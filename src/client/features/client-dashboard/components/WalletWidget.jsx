import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet2, ArrowDownLeft, Upload } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { financeApi } from '@/client/features/client-finance/services/finance.api';
import { METHOD_LABELS } from '@/shared/config/constants/finance';
import { useLiveMt5Accounts } from '@/shared/hooks/useLiveMt5Accounts';
import { useFinanceUpdates } from '@/shared/hooks/useFinanceUpdates';

const fmt = (n) =>
  `${Number(n) < 0 ? '-' : ''}$${Math.abs(Number(n) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const STATUS_COLOR = {
  APPROVED: 'var(--positive)',
  PENDING:  'var(--warning)',
  REJECTED: 'var(--negative)',
  FAILED:   'var(--negative)',
  FLAGGED:  'var(--warning)',
};

export function WalletWidget() {
  const navigate = useNavigate();
  const { byLogin } = useLiveMt5Accounts();
  const [wallet, setWallet] = useState(null);
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);
  const updates = useFinanceUpdates(); // any deposit/withdrawal change

  useEffect(() => {
    let active = true;
    Promise.all([
      financeApi.getWallet().catch(() => ({})),
      financeApi.getDeposits().catch(() => []),
      financeApi.getWithdrawals().catch(() => []),
    ]).then(([w, deps, wdrs]) => {
      if (!active) return;
      const toTx = (kind) => (r) => ({
        id: `${kind}-${r.id}`,
        type: kind,
        amount: parseFloat(r.amount || 0),
        method: METHOD_LABELS[r.type] || r.type || '—',
        account: r.accountId,
        status: String(r.status || 'pending').toUpperCase(),
        ts: new Date(r.createdAt).getTime(),
      });
      const all = [...(deps || []).map(toTx('DEPOSIT')), ...(wdrs || []).map(toTx('WITHDRAWAL'))]
        .sort((a, b) => b.ts - a.ts);
      setWallet(w || {});
      setTxs(all);
      setLoading(false);
    });
    return () => { active = false; };
  }, [updates]);

  // CRM wallet + MT5 balances, with MT5 values overridden live from the feed
  const totals = useMemo(() => {
    const crm = parseFloat(wallet?.wallet_balance || 0);
    const accounts = wallet?.accounts || [];
    let mt5 = 0;
    let anyLive = false;
    accounts.forEach((a) => {
      const live = byLogin[String(a.login)];
      if (live) anyLive = true;
      mt5 += live ? Number(live.balance) || 0 : Number(a.balance) || 0;
    });
    return { crm, mt5, total: crm + mt5, anyLive, accountCount: accounts.length };
  }, [wallet, byLogin]);

  const lastDeposit = txs.find((t) => t.type === 'DEPOSIT' && t.status === 'APPROVED');
  const pendingWdr = txs
    .filter((t) => t.type === 'WITHDRAWAL' && t.status === 'PENDING')
    .reduce((s, t) => s + t.amount, 0);

  return (
    <Card className="h-full p-0 flex flex-col overflow-hidden" padding={false} contentClassName="h-full flex flex-col min-h-0">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between shrink-0 border-b border-border/15 bg-surface-elevated/45">
        <div className="flex items-center gap-2.5">
          <span
            className="w-7 h-7 rounded-[8px] flex items-center justify-center text-cyan"
            style={{ background: 'color-mix(in srgb, var(--cyan) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--cyan) 20%, transparent)' }}
          >
            <Wallet2 size={13} strokeWidth={2} />
          </span>
          <div>
            <p className="text-[9.5px] font-black uppercase tracking-[0.16em] text-text-muted">Financials</p>
            <h2 className="font-heading font-bold text-[14px] tracking-[-0.03em] text-text leading-tight">
              Wallet Account
            </h2>
          </div>
        </div>
        <button
          onClick={() => navigate('/client/finance')}
          className="rounded-[6px] px-2.5 py-1 text-[11px] font-bold border border-border bg-transparent text-text-muted hover:text-text hover:bg-white/[0.02] cursor-pointer transition-colors duration-150"
        >
          Wallet
        </button>
      </div>

      {/* Balances: CRM wallet / MT5 (live) / total */}
      <div className="px-5 py-3.5 border-b border-border/10 bg-surface/10 shrink-0">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'CRM Wallet', val: fmt(totals.crm), color: 'var(--cyan)' },
            {
              label: totals.accountCount === 1 ? 'MT5 Account' : `MT5 · ${totals.accountCount} accts`,
              val: fmt(totals.mt5),
              color: 'var(--positive)',
              live: totals.anyLive,
            },
            { label: 'Total', val: fmt(totals.total), color: 'var(--brand)' },
          ].map((s) => (
            <div key={s.label} className="p-2 border border-border/15 bg-bg/30 rounded-[8px] text-center min-w-0">
              <p className="flex items-center justify-center gap-1 text-[8.5px] font-black uppercase tracking-[0.12em] text-text-muted mb-1 leading-none truncate">
                {s.live && <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse shrink-0" title="Live from MT5" />}
                {s.label}
              </p>
              <p className="font-mono font-bold text-[13px] leading-tight truncate" style={{ color: s.color }}>
                {loading ? '…' : s.val}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-2.5 text-[10.5px] text-text-muted">
          <span>
            Last deposit:{' '}
            <span className="font-mono font-bold text-positive">
              {lastDeposit ? `+${fmt(lastDeposit.amount)}` : '—'}
            </span>
          </span>
          <span>
            Pending withdrawals:{' '}
            <span className="font-mono font-bold" style={{ color: pendingWdr ? 'var(--warning)' : undefined }}>
              {pendingWdr ? fmt(pendingWdr) : '—'}
            </span>
          </span>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-surface/5">
        <p className="px-5 pt-3 pb-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-text-muted border-b border-border/6">Recent Activity</p>
        {!loading && txs.length === 0 && (
          <p className="px-5 py-6 text-center text-[12px] text-text-muted">
            No deposits or withdrawals yet.
          </p>
        )}
        {txs.slice(0, 6).map((tx) => {
          const isDebit = tx.type === 'WITHDRAWAL';
          const amtColor = isDebit ? 'var(--negative)' : 'var(--positive)';
          const TxIcon = isDebit ? Upload : ArrowDownLeft;
          return (
            <div
              key={tx.id}
              className="px-5 py-2.5 flex items-center gap-3 border-b border-border/8 last:border-0 hover:bg-surface-elevated/30 transition-all duration-150 cursor-default"
            >
              <div
                className="w-7 h-7 rounded-[7px] flex items-center justify-center shrink-0"
                style={{
                  background: `color-mix(in srgb, ${amtColor} 10%, transparent)`,
                  color: amtColor,
                  border: `1px solid color-mix(in srgb, ${amtColor} 15%, transparent)`,
                }}
              >
                <TxIcon size={12} strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[12px] font-bold text-text block truncate">{tx.type}</span>
                <span className="text-[10px] text-text-muted block mt-0.5 truncate">
                  {tx.method}
                  {tx.account ? ` · #${tx.account}` : ''}
                  {' · '}
                  {new Date(tx.ts).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-mono text-[12.5px] font-bold block" style={{ color: amtColor }}>
                  {isDebit ? '-' : '+'}{fmt(tx.amount)}
                </span>
                <span className="text-[9.5px] font-bold block mt-0.5" style={{ color: STATUS_COLOR[tx.status] || 'var(--text-muted)' }}>
                  {tx.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
export default WalletWidget;
