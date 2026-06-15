import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const POSITIONS = [
  { ticket:'POS-8841', sym:'EURUSD', side:'BUY',  lots:1.00, openPx:'1.08840', curPx:'1.08920', pnl:80,    swap:-0.20, margin:1088, dur:'02:14' },
  { ticket:'POS-8840', sym:'USDJPY', side:'BUY',  lots:3.00, openPx:'153.418', curPx:'153.680', pnl:510,   swap:1.20,  margin:2301, dur:'03:46' },
  { ticket:'POS-8839', sym:'XAUUSD', side:'SELL', lots:0.50, openPx:'2315.00', curPx:'2318.40', pnl:-170,  swap:-0.80, margin:1157, dur:'01:22' },
];

export function OpenPositionsWidget() {
  const navigate = useNavigate();
  const totalPnl = POSITIONS.reduce((s, p) => s + p.pnl, 0);

  return (
    <Card className="h-full p-0 flex flex-col overflow-hidden" padding={false} contentClassName="h-full flex flex-col min-h-0">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between shrink-0 border-b border-border/15 bg-surface-elevated/45">
        <div className="flex items-center gap-2.5">
          <span 
            className="w-7 h-7 rounded-[8px] flex items-center justify-center text-positive"
            style={{ background: 'color-mix(in srgb, var(--positive) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--positive) 20%, transparent)' }}
          >
            <BarChart2 size={13} strokeWidth={2} />
          </span>
          <div>
            <p className="text-[9.5px] font-black uppercase tracking-[0.16em] text-text-muted">Active Positions</p>
            <h2 className="font-heading font-bold text-[14px] tracking-[-0.03em] text-text leading-tight">
              Open Positions
            </h2>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className={`font-mono text-[12px] font-bold ${totalPnl >= 0 ? 'text-positive' : 'text-negative'}`}>
            {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)} float
          </span>
          <button
            onClick={() => navigate('/client/trading')}
            className="rounded-[6px] px-2.5 py-1 text-[11px] font-bold border border-border bg-transparent text-text-muted hover:text-text hover:bg-white/[0.02] cursor-pointer transition-colors duration-150"
          >
            View All
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto overflow-x-auto custom-scrollbar divide-y divide-border/6 bg-surface/5">
        {POSITIONS.map((p) => {
          const isUp = p.pnl >= 0;
          return (
            <div 
              key={p.ticket} 
              className="px-5 py-3 flex items-center justify-between hover:bg-surface-elevated/30 transition-all duration-150 cursor-default min-w-[440px] sm:min-w-0"
            >
              {/* Symbol & Details */}
              <div className="w-[100px] shrink-0">
                <span className="font-mono text-[13px] font-bold text-text block">{p.sym}</span>
                <span className="text-[10px] text-text-muted block mt-0.5">{p.lots} lots · {p.dur}</span>
              </div>

              {/* Side badge */}
              <div className="w-[60px] shrink-0">
                <span
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[9.5px] font-bold tracking-wider"
                  style={{
                    background: p.side === 'BUY' ? 'rgba(74,225,118,0.08)' : 'rgba(255,179,173,0.08)',
                    border: p.side === 'BUY' ? '1px solid rgba(74,225,118,0.2)' : '1px solid rgba(255,179,173,0.2)',
                    color: p.side === 'BUY' ? 'var(--positive)' : 'var(--negative)',
                  }}
                >
                  {p.side === 'BUY' ? <ArrowDownRight size={9} /> : <ArrowUpRight size={9} />}
                  {p.side}
                </span>
              </div>

              {/* Open vs Current Prices */}
              <div className="flex-1 flex gap-6 px-4">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-[0.1em] text-text-muted block mb-0.5">Open</span>
                  <span className="font-mono text-[11.5px] text-text-muted">{p.openPx}</span>
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-[0.1em] text-text-muted block mb-0.5">Current</span>
                  <span className="font-mono text-[11.5px] text-cyan">{p.curPx}</span>
                </div>
              </div>

              {/* PnL and Margin */}
              <div className="text-right w-[90px] shrink-0">
                <span 
                  className={`font-mono text-[13.5px] font-bold block ${isUp ? 'text-positive' : 'text-negative'}`}
                  style={{ textShadow: `0 0 12px color-mix(in srgb, var(--${isUp ? 'positive' : 'negative'}) 15%, transparent)` }}
                >
                  {isUp ? '+' : ''}${p.pnl.toFixed(2)}
                </span>
                <span className="text-[9.5px] text-text-muted block mt-0.5">Margin: ${p.margin}</span>
              </div>

            </div>
          );
        })}

        {POSITIONS.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <span className="text-[12px] text-text-muted">No active positions</span>
          </div>
        )}
      </div>
    </Card>
  );
}
export default OpenPositionsWidget;
