import React from 'react';
import { Globe, ArrowUp, ArrowDown } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const MARKET_PAIRS = [
  { pair: 'EUR/USD', bid: '1.08432', spread: '1.3', chg: '+0.18%', up: true },
  { pair: 'GBP/USD', bid: '1.26874', spread: '1.7', chg: '-0.09%', up: false },
  { pair: 'USD/JPY', bid: '149.812', spread: '1.9', chg: '+0.32%', up: true },
  { pair: 'XAU/USD', bid: '2341.50', spread: '0.5', chg: '-0.41%', up: false },
  { pair: 'BTC/USD', bid: '64210.0', spread: '12.0', chg: '+1.45%', up: true },
];

function PairRow({ pair }) {
  const color = pair.up ? 'var(--positive)' : 'var(--negative)';
  const GlowIcon = pair.up ? ArrowUp : ArrowDown;

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/8 last:border-0 hover:bg-surface-elevated/30 px-2.5 rounded-[8px] transition-all duration-200 group cursor-default">
      <div className="flex items-center gap-2">
        <span
          className="w-[2.5px] h-3.5 rounded-full opacity-40 group-hover:opacity-100 transition-opacity"
          style={{ 
            background: color,
            boxShadow: `0 0 6px ${color}`
          }}
        />
        <span className="font-mono text-[12.5px] font-medium text-text-muted w-16 group-hover:text-text transition-colors">
          {pair.pair}
        </span>
      </div>
      <div className="flex-1 flex justify-end gap-3 items-center">
        <span 
          className="font-mono text-[13.5px] font-semibold text-text group-hover:scale-[1.01] transition-transform"
          style={{
            textShadow: `0 0 8px color-mix(in srgb, ${color} 15%, transparent)`
          }}
        >
          {pair.bid}
        </span>
        <span className="text-[10.5px] text-text-muted font-mono w-6 text-right font-medium">s{pair.spread}</span>
      </div>
      <div className="w-[60px] flex justify-end items-center gap-1">
        <GlowIcon size={10} className="shrink-0 group-hover:animate-pulse" style={{ color }} />
        <span className="font-mono text-[11.5px] font-bold" style={{ color }}>{pair.chg}</span>
      </div>
    </div>
  );
}

export function DashboardMarket() {
  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between mb-3 border-b border-border/15 pb-3 bg-surface-elevated/10">
        <div className="text-[15px] font-semibold text-text flex items-center gap-2 tracking-tight">
          <Globe size={13} className="text-cyan animate-spin-slow" style={{ color: 'var(--cyan)' }} />
          Market Ticker Feeds
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-positive/8 border border-positive/20">
          <span className="h-1.5 w-1.5 rounded-full animate-pulse bg-positive" />
          <span className="text-[10.5px] font-bold tracking-wider text-positive">LIVE</span>
        </div>
      </div>
      <div className="text-[10.5px] font-bold uppercase tracking-wider text-text-muted pb-1.5 mb-1.5 border-b border-border/10 px-2.5">
        Pair — Bid price — spread / Chg
      </div>
      <div className="flex flex-col gap-0.5">
        {MARKET_PAIRS.map((p) => (
          <PairRow key={p.pair} pair={p} />
        ))}
      </div>
    </Card>
  );
}

export default DashboardMarket;
