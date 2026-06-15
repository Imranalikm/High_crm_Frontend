import React, { useState } from 'react';
import {
  Area, ComposedChart, CartesianGrid,
  ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';

/* ── Seed functions matching user specs ── */
const PERF_DATA = {
  '1D': Array.from({length:24},(_,i)=>({ t:`${String(i).padStart(2,'0')}:00`, v:82000+Math.round(Math.sin(i/3)*800+Math.random()*600+i*90) })),
  '7D': Array.from({length:7},(_,i)=>{ const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun']; return { t:days[i], v:80000+Math.round(i*600+Math.sin(i)*1200+Math.random()*800) }; }),
  '1M': Array.from({length:30},(_,i)=>({ t:`${i+1}`, v:75000+Math.round(i*320+Math.sin(i/4)*2400+Math.random()*1200) })),
  '3M': Array.from({length:13},(_,i)=>({ t:`W${i+1}`, v:72000+Math.round(i*900+Math.sin(i/3)*3000+Math.random()*2000) })),
  '1Y': Array.from({length:12},(_,i)=>{ const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; return { t:months[i], v:60000+Math.round(i*2100+Math.sin(i/3)*4000+Math.random()*3000) }; }),
  'ALL':Array.from({length:18},(_,i)=>({ t:`Q${(i%4)+1}'${22+(Math.floor(i/4))}`, v:40000+Math.round(i*2800+Math.sin(i/4)*5000+Math.random()*4000) })),
};

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div 
      className="rounded-[8px] px-3 py-2 backdrop-blur-md"
      style={{ 
        background: 'var(--surface-2)', 
        border: '1px solid var(--border)', 
        fontFamily: 'var(--font-mono), monospace', 
        fontSize: '12px',
        boxShadow: 'var(--shadow-card-subtle)'
      }}
    >
      <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{label}</div>
      <div className="text-[14px] font-bold text-positive">
        ${Number(payload[0].value).toLocaleString('en', { minimumFractionDigits: 0 })}
      </div>
    </div>
  );
}

export function PortfolioChart() {
  const [period, setPeriod] = useState('1M');
  const data = PERF_DATA[period];
  const startVal = data[0].v;
  const endVal   = data[data.length-1].v;
  const change   = endVal - startVal;
  const changePct= ((change/startVal)*100).toFixed(2);
  const isUp     = change >= 0;
  const chartColor= isUp ? 'var(--positive)' : 'var(--negative)';

  const minV = Math.min(...data.map(d=>d.v));
  const maxV = Math.max(...data.map(d=>d.v));
  const domainMin = minV * 0.998;
  const domainMax = maxV * 1.002;

  return (
    <Card className="h-full p-0 flex flex-col overflow-hidden" padding={false} contentClassName="h-full flex flex-col min-h-0">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between gap-3 flex-wrap border-b border-border/15 bg-surface-elevated/45">
        <div>
          <p className="text-[9.5px] font-black uppercase tracking-[0.14em] text-text-muted mb-0.5">Portfolio Growth</p>
          <div className="flex items-baseline gap-2.5">
            <span className="font-mono font-black text-[20px] text-text tracking-[-0.02em] leading-none">
              ${endVal.toLocaleString()}
            </span>
            <span 
              className={`font-mono text-[12px] font-bold leading-none ${isUp ? 'text-positive' : 'text-negative'}`}
              style={{ textShadow: `0 0 16px color-mix(in srgb, ${chartColor} 20%, transparent)` }}
            >
              {isUp ? '+' : ''}${change.toLocaleString()} ({isUp ? '+' : ''}{changePct}%)
            </span>
          </div>
        </div>

        {/* Period Filters */}
        <div className="flex items-center gap-1 rounded-[6px] border border-border/20 bg-bg/50 p-0.5">
          {Object.keys(PERF_DATA).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="rounded-[4px] px-2.5 py-1 text-[11px] font-bold transition-all duration-200 cursor-pointer"
              style={{
                background: period === p ? 'color-mix(in srgb, var(--brand) 12%, transparent)' : 'transparent',
                border: period === p ? '1px solid color-mix(in srgb, var(--brand) 25%, transparent)' : '1px solid transparent',
                color: period === p ? 'var(--brand)' : 'var(--text-muted)',
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="p-5 flex-1 min-h-0 flex flex-col bg-surface/5">
        <div className="relative w-full flex-1 min-h-[280px]">
          <div className="absolute inset-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={chartColor} stopOpacity={0.16}/>
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 6" stroke="var(--border)" opacity={0.3} vertical={false}/>
                <XAxis 
                  dataKey="t" 
                  tick={{ fill: 'var(--text-muted)', fontSize: 9.5, fontFamily: 'var(--font-mono), monospace' }} 
                  axisLine={false} 
                  tickLine={false} 
                  dy={6}
                />
                <YAxis 
                  domain={[domainMin, domainMax]} 
                  tickFormatter={v=>`$${(v/1000).toFixed(0)}k`} 
                  tick={{ fill: 'var(--text-muted)', fontSize: 9.5, fontFamily: 'var(--font-mono), monospace' }} 
                  axisLine={false} 
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip/>}/>
                <ReferenceLine y={startVal} stroke="var(--border)" strokeDasharray="3 6"/>
                <Area 
                  type="monotone" 
                  dataKey="v" 
                  stroke={chartColor} 
                  strokeWidth={2} 
                  fill="url(#perfGrad)" 
                  dot={false} 
                  activeDot={{ r: 4, fill: chartColor, stroke: 'var(--bg)', strokeWidth: 1.5 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom stats bar */}
      <div className="grid grid-cols-4 border-t border-border/15 bg-surface-elevated/20 divide-x divide-border/10">
        {[
          { label: 'Period High', val: `$${maxV.toLocaleString()}`, color: 'var(--positive)' },
          { label: 'Period Low', val: `$${minV.toLocaleString()}`, color: 'var(--negative)' },
          { label: 'Net Change', val: `${isUp ? '+' : ''}$${Math.abs(change).toLocaleString()}`, color: isUp ? 'var(--positive)' : 'var(--negative)' },
          { label: 'Change %', val: `${isUp ? '+' : ''}${changePct}%`, color: isUp ? 'var(--positive)' : 'var(--negative)' },
        ].map((s) => (
          <div key={s.label} className="py-2.5 text-center">
            <p className="text-[8.5px] font-black uppercase tracking-[0.12em] text-text-muted mb-0.5">{s.label}</p>
            <p className="font-mono font-bold text-[12.5px]" style={{ color: s.color }}>{s.val}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
export default PortfolioChart;
