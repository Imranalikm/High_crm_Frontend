import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet2, ArrowDownLeft, Upload, ArrowLeftRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const WALLET = {
  balance: 84200,
  lastDeposit: '+$5,000',
  pendingWD: '—',
};

const TRANSACTIONS = [
  { type:'DEPOSIT',    amount:'+$5,000', method:'Bank Wire',  ts:'Aug 01', status:'COMPLETED' },
  { type:'WITHDRAWAL', amount:'-$1,200', method:'Crypto',     ts:'Jul 28', status:'COMPLETED' },
  { type:'FEE',        amount:'-$24',    method:'Internal',   ts:'Jul 31', status:'COMPLETED' },
  { type:'DEPOSIT',    amount:'+$2,000', method:'Card',       ts:'Jul 25', status:'COMPLETED' },
];

export function WalletWidget() {
  const navigate = useNavigate();

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

      {/* Wallet balance cards */}
      <div className="px-5 py-3.5 border-b border-border/10 bg-surface/10 shrink-0">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Balance', val: `$${WALLET.balance.toLocaleString()}`, color: 'var(--brand)' },
            { label: 'Last Deposit', val: WALLET.lastDeposit, color: 'var(--positive)' },
            { label: 'Pending WDR', val: WALLET.pendingWD, color: 'var(--text-muted)' },
          ].map((s) => (
            <div key={s.label} className="p-2 border border-border/15 bg-bg/30 rounded-[8px] text-center">
              <p className="text-[8.5px] font-black uppercase tracking-[0.12em] text-text-muted mb-1 leading-none">{s.label}</p>
              <p className="font-mono font-bold text-[13px] leading-tight" style={{ color: s.color }}>{s.val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent transactions */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-surface/5">
        <p className="px-5 pt-3 pb-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-text-muted border-b border-border/6">Recent Activity</p>
        {TRANSACTIONS.map((tx, i) => {
          const isDebit = tx.type === 'WITHDRAWAL' || tx.type === 'FEE';
          const amtColor = isDebit ? 'var(--negative)' : 'var(--positive)';
          const TxIcon = tx.type === 'DEPOSIT' ? ArrowDownLeft : tx.type === 'WITHDRAWAL' ? Upload : ArrowLeftRight;
          return (
            <div 
              key={i} 
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
                  {tx.method} · {tx.ts}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-mono text-[12.5px] font-bold block" style={{ color: amtColor }}>{tx.amount}</span>
                <span className="text-[9.5px] text-positive font-bold block mt-0.5">{tx.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
export default WalletWidget;
