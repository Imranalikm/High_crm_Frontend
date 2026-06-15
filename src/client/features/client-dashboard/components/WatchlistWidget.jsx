import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const WATCHLIST = [
  { sym:'EURUSD', name:'Euro / Dollar',   price:1.08912, chg:+0.0008, chgPct:+0.07, high:1.09120, low:1.08640, bid:1.08910, ask:1.08914 },
  { sym:'XAUUSD', name:'Gold / Dollar',   price:2318.40, chg:+8.40,   chgPct:+0.36, high:2328.10, low:2304.20, bid:2318.10, ask:2318.70 },
  { sym:'USDJPY', name:'Dollar / Yen',    price:153.680, chg:-0.182,  chgPct:-0.12, high:154.100, low:153.220, bid:153.670, ask:153.690 },
  { sym:'GBPUSD', name:'Pound / Dollar',  price:1.27048, chg:-0.0024, chgPct:-0.19, high:1.27420, low:1.26820, bid:1.27044, ask:1.27052 },
  { sym:'BTCUSD', name:'Bitcoin / Dollar',price:66420,   chg:+840,    chgPct:+1.28, high:67200,   low:65800,   bid:66410,   ask:66430   },
  { sym:'NASDAQ', name:'Nasdaq 100',      price:19841.2, chg:+124.8,  chgPct:+0.63, high:19940,   low:19688,   bid:19839,   ask:19843   },
];

export function WatchlistWidget() {
  const navigate = useNavigate();
  const [prices, setPrices] = useState(() => 
    Object.fromEntries(WATCHLIST.map(w => [w.sym, { val: w.price, dir: null }]))
  );

  // Live price ticking simulation
  useEffect(() => {
    const id = setInterval(() => {
      setPrices(prev => {
        const next = { ...prev };
        const randomItem = WATCHLIST[Math.floor(Math.random() * WATCHLIST.length)];
        const sym = randomItem.sym;
        const item = WATCHLIST.find(w => w.sym === sym);
        if (!item) return prev;
        
        const delta = (Math.random() - 0.485) * item.price * 0.0003;
        const newVal = Number((prev[sym].val + delta).toFixed(item.price > 1000 ? 1 : item.price > 100 ? 3 : 5));
        next[sym] = { val: newVal, dir: delta > 0 ? 'up' : 'dn' };
        return next;
      });
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <Card className="h-full p-0 flex flex-col overflow-hidden" padding={false} contentClassName="h-full flex flex-col min-h-0">
      {/* Local CSS injection for price tick animations */}
      <style>{`
        @keyframes tickUpAnim { 0% { color: var(--positive); } 100% { color: inherit; } }
        @keyframes tickDnAnim { 0% { color: var(--negative); } 100% { color: inherit; } }
        .price-tick-up { animation: tickUpAnim 0.7s ease; }
        .price-tick-dn { animation: tickDnAnim 0.7s ease; }
      `}</style>

      {/* Header */}
      <div className="px-5 py-3 flex items-center justify-between shrink-0 border-b border-border/15 bg-surface-elevated/45">
        <div className="flex items-center gap-2.5">
          <span 
            className="w-7 h-7 rounded-[8px] flex items-center justify-center text-gold"
            style={{ background: 'color-mix(in srgb, var(--warning) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--warning) 20%, transparent)' }}
          >
            <Star size={13} strokeWidth={2} />
          </span>
          <div>
            <p className="text-[9.5px] font-black uppercase tracking-[0.16em] text-text-muted">Markets</p>
            <h2 className="font-heading font-bold text-[14px] tracking-[-0.03em] text-text leading-tight">
              Watchlist
            </h2>
          </div>
        </div>
        <button
          onClick={() => navigate('/client/trading')}
          className="rounded-[6px] px-2.5 py-1 text-[11px] font-bold border border-border bg-transparent text-text-muted hover:text-text hover:bg-white/[0.02] cursor-pointer transition-colors duration-150"
        >
          Markets
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-border/6 bg-surface/5">
        {WATCHLIST.map((w) => {
          const live = prices[w.sym];
          const chgPos = w.chgPct >= 0;
          return (
            <div 
              key={w.sym} 
              className="px-5 py-1.5 flex items-center justify-between hover:bg-surface-elevated/30 transition-all duration-150 cursor-default"
            >
              {/* Symbol & Name */}
              <div className="w-[100px] shrink-0">
                <span className="font-mono text-[13px] font-bold text-text block">{w.sym}</span>
                <span className="text-[9.5px] text-text-muted block truncate leading-none mt-0.5">{w.name}</span>
              </div>

              {/* Sparkline Visual Component */}
              <div className="w-12 h-6 flex items-end gap-[2px] shrink-0 opacity-40">
                {Array.from({ length: 8 }, (_, i) => (
                  <div 
                    key={i} 
                    className="flex-1 rounded-[1px] transition-all duration-300"
                    style={{ 
                      background: chgPos ? 'var(--positive)' : 'var(--negative)', 
                      height: `${30 + Math.sin(i * 1.5) * 25 + Math.random() * 20}%` 
                    }}
                  />
                ))}
              </div>

              {/* Bid vs Ask pricing mini metrics */}
              <div className="hidden sm:flex items-center gap-3 text-right">
                <div>
                  <span className="text-[8px] font-black uppercase text-text-muted block">Bid</span>
                  <span className="font-mono text-[11px] text-text-muted">{w.bid}</span>
                </div>
                <div>
                  <span className="text-[8px] font-black uppercase text-text-muted block">Ask</span>
                  <span className="font-mono text-[11px] text-text-muted">{w.ask}</span>
                </div>
              </div>

              {/* Live Price & Change */}
              <div className="text-right w-[90px] shrink-0">
                <span 
                  className={`font-mono text-[13px] font-bold block ${
                    live?.dir === 'up' ? 'price-tick-up' : live?.dir === 'dn' ? 'price-tick-dn' : ''
                  }`}
                >
                  {live 
                    ? (live.val > 1000 ? live.val.toLocaleString() : live.val.toFixed(live.val > 10 ? 3 : 5))
                    : w.price
                  }
                </span>
                <span className={`text-[10px] font-mono font-bold ${chgPos ? 'text-positive' : 'text-negative'}`}>
                  {chgPos ? '+' : ''}{w.chgPct.toFixed(2)}%
                </span>
              </div>

            </div>
          );
        })}
      </div>
    </Card>
  );
}
export default WatchlistWidget;
