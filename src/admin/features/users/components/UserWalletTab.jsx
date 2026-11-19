import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Gift, AlertTriangle } from 'lucide-react';
import { apiClient } from '@/shared/api/client/apiClient';
import { useLiveMt5Accounts, withLive } from '@/shared/hooks/useLiveMt5Accounts';
import { useFinanceUpdates } from '@/shared/hooks/useFinanceUpdates';
import { isDemoAccount } from '@/shared/utils/mt5Accounts';
import { METHOD_LABELS } from '@/shared/config/constants/finance';
import { adminFinanceApi } from '@/admin/features/finance/services/finance.api';
import { BALANCE_OP_TYPE_BY_ID, fmtMoney } from '@/admin/features/finance/components/balanceOpTypes';

const STATUS_COLOR = {
  approved: 'var(--positive)', completed: 'var(--positive)',
  pending: 'var(--warning)',
  rejected: 'var(--negative)', failed: 'var(--negative)', flagged: 'var(--negative)',
};

const FILTERS = [
  ['ALL', 'All'],
  ['DEPOSIT', 'Deposits'],
  ['WITHDRAWAL', 'Withdrawals'],
  ['OP', 'Balance Ops'],
];

const num = (v) => Number(v) || 0;
const asArray = (res, ...keys) => {
  if (Array.isArray(res)) return res;
  for (const k of keys) if (Array.isArray(res?.[k])) return res[k];
  return [];
};

function Tile({ label, value, sub, color = 'var(--text)' }) {
  return (
    <div className="rounded-[9px] border border-border/15 bg-surface-elevated px-3.5 py-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-text-muted/75">{label}</p>
      <p className="font-mono text-[15px] font-bold mt-1" style={{ color }}>{value}</p>
      {sub && <p className="text-[10.5px] text-text-muted/60 mt-0.5">{sub}</p>}
    </div>
  );
}

/**
 * Admin › User detail › Wallet tab.
 * Real data: CRM wallet balance, live MT5 balances per account, and the
 * client's deposits, withdrawals and balance operations.
 */
export function UserWalletTab({ user }) {
  const userId = user?.id || user?.uid;
  const { byLogin, feedConnected } = useLiveMt5Accounts();
  const updates = useFinanceUpdates();
  const [accounts, setAccounts] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [ops, setOps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');

  const load = useCallback(() => {
    if (!userId) return Promise.resolve();
    return Promise.allSettled([
      apiClient.get(`/mt5-accounts?userId=${userId}`),
      apiClient.get(`/deposits?userId=${userId}`),
      apiClient.get(`/withdrawals?userId=${userId}`),
      adminFinanceApi.getBalanceOperations({ userId }),
    ]).then(([acc, dep, wd, bop]) => {
      const ok = (r) => (r.status === 'fulfilled' ? r.value : null);
      // Server filters by userId; filter again so an older backend can't leak other users' rows
      const mine = (rows, key) => rows.filter((r) => String(r[key]) === String(userId));
      setAccounts(mine(asArray(ok(acc), 'data'), 'userId').filter((a) => a.accountid && !String(a.accountid).startsWith('PENDING-')));
      setDeposits(mine(asArray(ok(dep), 'data'), 'createdFor'));
      setWithdrawals(mine(asArray(ok(wd), 'withdrawals', 'data'), 'createdFor'));
      setOps(ok(bop) || []);
      const failed = [acc, dep, wd, bop].filter((r) => r.status === 'rejected').length;
      setError(failed ? 'Some wallet data could not be loaded.' : '');
      setLoading(false);
    });
  }, [userId]);

  useEffect(() => { load(); }, [load, updates]);

  const liveAccounts = useMemo(() => accounts.map((a) => withLive(a, byLogin)), [accounts, byLogin]);
  const realAccounts = liveAccounts.filter((a) => !isDemoAccount(a));

  const totals = useMemo(() => {
    const sum = (rows, pick) => rows.reduce((s, r) => s + pick(r), 0);
    const approvedDep = sum(deposits.filter((d) => d.status === 'approved'), (d) => num(d.amount));
    const approvedWd = sum(withdrawals.filter((w) => w.status === 'approved'), (w) => num(w.amount));
    const pending = [...deposits, ...withdrawals].filter((r) => r.status === 'pending');
    return {
      mt5Balance: sum(realAccounts, (a) => num(a.balance)),
      mt5Equity: sum(realAccounts, (a) => (a.isLive ? num(a.equity) : num(a.balance))),
      mt5Credit: sum(realAccounts, (a) => (a.isLive ? num(a.credit) : 0)),
      approvedDep,
      approvedWd,
      pendingCount: pending.length,
      pendingAmount: sum(pending, (r) => num(r.amount)),
      opsNet: sum(ops.filter((o) => o.status === 'completed'), (o) => num(o.amount)),
    };
  }, [realAccounts, deposits, withdrawals, ops]);

  const txs = useMemo(() => {
    const list = [
      ...deposits.map((d) => ({
        key: `DEP-${d.id}`, kind: 'DEPOSIT', label: 'Deposit',
        detail: `${METHOD_LABELS[d.type] || d.type || 'Deposit'} · #${d.accountId}`,
        amount: num(d.amount), status: d.status, ref: d.mt5DealId || d.transactionId || `DEP-${d.id}`, date: d.createdAt,
      })),
      ...withdrawals.map((w) => ({
        key: `WDR-${w.id}`, kind: 'WITHDRAWAL', label: 'Withdrawal',
        detail: `${METHOD_LABELS[w.type] || w.type || (w.role === 'admin' ? 'Admin' : 'Withdrawal')} · #${w.accountId}`,
        amount: -num(w.amount), status: w.status, ref: `WDR-${w.id}`, date: w.createdAt,
      })),
      ...ops.map((o) => ({
        key: `BOP-${o.id}`, kind: 'OP', label: o.typeLabel, color: BALANCE_OP_TYPE_BY_ID[o.type]?.color,
        detail: `#${o.accountId}${o.comment ? ` · ${o.comment}` : ''}`,
        amount: num(o.amount), status: o.status, ref: o.dealId || `BOP-${o.id}`, date: o.createdAt,
      })),
    ];
    return list
      .filter((t) => filter === 'ALL' || t.kind === filter)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [deposits, withdrawals, ops, filter]);

  if (loading) {
    return <div className="py-16 text-center text-[12px] text-text-muted/60 animate-fade-up">Loading wallet…</div>;
  }

  return (
    <div className="space-y-5 animate-fade-up">
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-[8px] bg-warning/10 border border-warning/20 text-warning text-[12px] font-semibold">
          <AlertTriangle size={14} /> {error}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2.5">
        <Tile label="CRM Wallet" value={user.walletBalance || '$0.00'} sub="wallet balance" />
        <Tile label="MT5 Balance" value={fmtMoney(totals.mt5Balance)} sub={`${realAccounts.length} live account${realAccounts.length === 1 ? '' : 's'}`} />
        <Tile label="MT5 Equity" value={fmtMoney(totals.mt5Equity)} sub={totals.mt5Credit ? `incl. ${fmtMoney(totals.mt5Credit)} credit` : 'balance + floating'}
          color={totals.mt5Equity >= totals.mt5Balance ? 'var(--positive)' : 'var(--negative)'} />
        <Tile label="Deposited" value={fmtMoney(totals.approvedDep)} sub="approved" color="var(--positive)" />
        <Tile label="Withdrawn" value={fmtMoney(totals.approvedWd)} sub="approved" color="var(--negative)" />
        <Tile label="Pending" value={fmtMoney(totals.pendingAmount)} sub={`${totals.pendingCount} request${totals.pendingCount === 1 ? '' : 's'}`} color="var(--warning)" />
      </div>

      {/* MT5 balances */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-text-muted/75">MT5 Balances</p>
          <span className="flex items-center gap-1.5 text-[11px] text-text-muted/70">
            <span className={`h-1.5 w-1.5 rounded-full ${feedConnected ? 'bg-positive animate-pulse' : 'bg-text-muted/40'}`} />
            {feedConnected ? 'Live' : 'Feed offline'}
          </span>
        </div>
        <div className="rounded-[10px] border border-border/15 bg-surface-elevated overflow-x-auto">
          {liveAccounts.length === 0 ? (
            <div className="p-6 text-center text-[12px] text-text-muted/60 italic">No MT5 accounts.</div>
          ) : (
            <table className="w-full text-[12px]">
              <thead>
                <tr className="text-[10px] font-bold uppercase tracking-[0.08em] text-text-muted/70 border-b border-border/15">
                  <th className="px-3.5 py-2.5 text-left">Account</th>
                  {['Balance', 'Credit', 'Equity', 'Margin', 'Free Margin', 'Margin Lvl'].map((h) => (
                    <th key={h} className="px-3.5 py-2.5 text-right whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {liveAccounts.map((a) => {
                  const floating = a.isLive ? num(a.equity) - num(a.balance) - num(a.credit) : 0;
                  return (
                    <tr key={a.accountid} className="border-b border-border/10 last:border-0 hover:bg-bg/30">
                      <td className="px-3.5 py-2.5">
                        <div className="flex items-center gap-2">
                          <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${a.isLive ? 'bg-positive' : 'bg-text-muted/40'}`} title={a.isLive ? 'Live' : 'No live data'} />
                          <span className="font-mono font-semibold text-text">#{a.accountid}</span>
                          {isDemoAccount(a) && <span className="text-[9.5px] font-bold uppercase px-1.5 py-0.5 rounded bg-warning/10 text-warning">Demo</span>}
                        </div>
                        <p className="text-[10.5px] text-text-muted/60 mt-0.5 pl-3.5">{a.groupName || '—'}</p>
                      </td>
                      <td className="px-3.5 py-2.5 text-right font-mono font-semibold text-text">{fmtMoney(a.balance)}</td>
                      <td className="px-3.5 py-2.5 text-right font-mono text-text-muted/85">{a.isLive ? fmtMoney(a.credit) : '—'}</td>
                      <td className="px-3.5 py-2.5 text-right font-mono">
                        <span className="font-semibold text-text">{a.isLive ? fmtMoney(a.equity) : '—'}</span>
                        {a.isLive && floating !== 0 && (
                          <span className="block text-[10px]" style={{ color: floating > 0 ? 'var(--positive)' : 'var(--negative)' }}>
                            {floating > 0 ? '+' : ''}{fmtMoney(floating)}
                          </span>
                        )}
                      </td>
                      <td className="px-3.5 py-2.5 text-right font-mono text-text-muted/85">{a.isLive ? fmtMoney(a.margin) : '—'}</td>
                      <td className="px-3.5 py-2.5 text-right font-mono text-text-muted/85">{a.isLive ? fmtMoney(a.marginFree) : '—'}</td>
                      <td className="px-3.5 py-2.5 text-right font-mono text-text-muted/85">{a.isLive && num(a.marginLevel) ? `${num(a.marginLevel).toFixed(0)}%` : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Transactions */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-text-muted/75">Transactions</p>
          <div className="flex gap-1.5">
            {FILTERS.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setFilter(id)}
                className={`h-7 px-2.5 rounded-[7px] text-[11px] font-semibold border transition-all cursor-pointer ${
                  filter === id ? 'bg-brand text-text-on-accent border-brand/30' : 'bg-surface-elevated border-border/20 text-text-muted/80 hover:text-text'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1 no-scrollbar">
          {txs.length === 0 ? (
            <div className="rounded-[8px] border border-dashed border-border/20 p-6 text-center text-[11.5px] text-text-muted/50 italic">
              No transactions recorded.
            </div>
          ) : txs.map((tx) => {
            const isDebit = tx.amount < 0;
            const accent = tx.kind === 'OP' ? (tx.color || 'var(--brand)') : isDebit ? 'var(--negative)' : 'var(--positive)';
            const statusColor = STATUS_COLOR[tx.status] || 'var(--text-muted)';
            const Icon = tx.kind === 'OP' ? Gift : isDebit ? ArrowDownRight : ArrowUpRight;
            return (
              <div key={tx.key}
                className="flex items-center justify-between gap-4 px-4 py-2.5 rounded-[7px] border border-border/10 bg-bg/20 hover:bg-bg/35 transition-all"
                style={{ borderLeft: `2px solid ${accent}` }}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-1.5 rounded-[5px] shrink-0" style={{ color: accent, background: `color-mix(in srgb, ${accent} 10%, transparent)` }}>
                    {React.createElement(Icon, { size: 11 })}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[12px] font-bold text-text leading-tight">{tx.label}</h4>
                    <p className="text-[10.5px] text-text-muted/65 mt-0.5 truncate">
                      {tx.detail} · <span className="font-bold uppercase" style={{ color: statusColor }}>{tx.status}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono text-[12.5px] font-black block" style={{ color: isDebit ? 'var(--negative)' : 'var(--positive)' }}>
                    {isDebit ? '' : '+'}{fmtMoney(tx.amount)}
                  </span>
                  <span className="font-mono text-[10px] text-text-muted/55 block mt-0.5">
                    {new Date(tx.date).toLocaleString()} · {tx.ref}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        {totals.opsNet !== 0 && (
          <p className="text-[11px] text-text-muted/65 mt-2">
            Net balance operations: <span className="font-mono font-bold" style={{ color: totals.opsNet > 0 ? 'var(--positive)' : 'var(--negative)' }}>{totals.opsNet > 0 ? '+' : ''}{fmtMoney(totals.opsNet)}</span>
          </p>
        )}
      </div>
    </div>
  );
}
