import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const COPY_STRATEGIES = [
  { id:'STR-001', name:'Apex Scalper Pro',  provider:'Rehan Capital',  alloc:'$5,000', allocN:5000, pnl:'+$312',  pnlN:312,  pnlPct:'+6.24%', status:'ACTIVE',  ratio:'1.0x', risk:'LOW' },
  { id:'STR-002', name:'Gold Trend Master', provider:'Apex Markets',   alloc:'$3,000', allocN:3000, pnl:'-$48',   pnlN:-48,  pnlPct:'-1.6%',  status:'ACTIVE',  ratio:'0.5x', risk:'MED' },
];

export function CopyTradingWidget() {
  const navigate = useNavigate();
  const totalAlloc = COPY_STRATEGIES.reduce((s, c) => s + c.allocN, 0);
  const totalPnl   = COPY_STRATEGIES.reduce((s, c) => s + c.pnlN, 0);
  const isUp = totalPnl >= 0;

  return (
    <Card className="h-full p-0 flex flex-col overflow-hidden" padding={false} contentClassName="h-full flex flex-col min-h-0">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between shrink-0 border-b border-border/15 bg-surface-elevated/45">
        <div className="flex items-center gap-2.5">
          <span 
            className="w-7 h-7 rounded-[8px] flex items-center justify-center text-purple"
            style={{ background: 'color-mix(in srgb, var(--purple) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--purple) 20%, transparent)' }}
          >
            <Copy size={13} strokeWidth={2} />
          </span>
          <div>
            <p className="text-[9.5px] font-black uppercase tracking-[0.16em] text-text-muted">Copy Trading</p>
            <h2 className="font-heading font-bold text-[14px] tracking-[-0.03em] text-text leading-tight">
              Copy Portfolio
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`font-mono text-[12px] font-bold ${isUp ? 'text-positive' : 'text-negative'}`}>
            {isUp ? '+' : ''}${totalPnl} net
          </span>
          <button
            onClick={() => navigate('/client/copy-trading')}
            className="rounded-[6px] px-2.5 py-1 text-[11px] font-bold border border-border bg-transparent text-text-muted hover:text-text hover:bg-white/[0.02] cursor-pointer transition-colors duration-150"
          >
            Manage
          </button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-3 divide-x divide-border/10 border-b border-border/10 bg-surface/10 shrink-0">
        {[
          { label: 'Strategies', val: COPY_STRATEGIES.length, color: 'var(--text)' },
          { label: 'Allocated', val: `$${totalAlloc.toLocaleString()}`, color: 'var(--brand)' },
          { label: 'Copied P&L', val: `${isUp ? '+' : ''}$${totalPnl}`, color: isUp ? 'var(--positive)' : 'var(--negative)' },
        ].map((s) => (
          <div key={s.label} className="py-2.5 text-center">
            <p className="text-[8.5px] font-black uppercase tracking-[0.12em] text-text-muted mb-0.5">{s.label}</p>
            <p className="font-mono font-bold text-[13px]" style={{ color: s.color }}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-border/6 bg-surface/5">
        {COPY_STRATEGIES.map((c) => {
          const pnlPos = c.pnlN >= 0;
          return (
            <div 
              key={c.id} 
              className="px-5 py-3 flex items-center justify-between hover:bg-surface-elevated/30 transition-all duration-150 cursor-default"
            >
              <div className="flex-1 min-w-0 pr-3">
                <span className="text-[12.5px] font-bold text-text block truncate">{c.name}</span>
                <span className="text-[10px] text-text-muted block mt-0.5 truncate">
                  {c.provider} · {c.ratio} ratio · {c.alloc}
                </span>
              </div>

              {/* Status Badge */}
              <div className="shrink-0 flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[9.5px] font-bold bg-positive/8 border border-positive/20 text-positive mr-3">
                <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse" />
                {c.status}
              </div>

              {/* PnL Stats */}
              <div className="text-right shrink-0 w-[70px]">
                <span className={`font-mono text-[13px] font-bold block ${pnlPos ? 'text-positive' : 'text-negative'}`}>
                  {c.pnl}
                </span>
                <span className={`text-[10px] font-mono block mt-0.5 ${pnlPos ? 'text-positive' : 'text-negative'}`}>
                  {c.pnlPct}
                </span>
              </div>

            </div>
          );
        })}
      </div>

      {/* Discover strategies marketplace banner */}
      <div className="p-4 border-t border-border/10 bg-surface-elevated/45 shrink-0">
        <div className="rounded-[8px] p-3 bg-brand/5 border border-brand/12 text-center">
          <p className="text-[11.5px] text-text-muted">Want to copy new strategy managers?</p>
          <button 
            onClick={() => navigate('/client/copy-trading')}
            className="mt-2 w-full h-8 rounded-[6px] text-[11px] font-bold bg-brand text-text-on-accent hover:opacity-90 transition-colors cursor-pointer outline-none active:scale-[0.98]"
          >
            Explore Strategy Marketplace
          </button>
        </div>
      </div>
    </Card>
  );
}
export default CopyTradingWidget;
