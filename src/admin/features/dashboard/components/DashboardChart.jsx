import React, { useState } from 'react';
import {
  Area, CartesianGrid, ResponsiveContainer, Tooltip,
  XAxis, YAxis, ComposedChart, Line,
} from 'recharts';
import { BarChart2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const TIME_FILTERS = ['1H', '4H', '1D', '1W', '1M'];

const CHART_DATA = {
  '1H': Array.from({ length: 12 }, (_, i) => ({
    time: `${String(i * 5).padStart(2, '0')}m`,
    volume: 180 + Math.round(Math.sin(i * 0.6) * 80 + Math.random() * 60),
    deposits: 40 + Math.round(Math.random() * 50),
    withdrawals: 20 + Math.round(Math.random() * 35),
  })),
  '4H': Array.from({ length: 16 }, (_, i) => ({
    time: `${i * 15}m`,
    volume: 200 + Math.round(Math.sin(i * 0.5) * 100 + Math.random() * 80),
    deposits: 50 + Math.round(Math.random() * 60),
    withdrawals: 25 + Math.round(Math.random() * 40),
  })),
  '1D': Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    volume: 150 + Math.round(Math.sin(i * 0.4) * 120 + Math.random() * 100),
    deposits: 60 + Math.round(Math.random() * 80),
    withdrawals: 30 + Math.round(Math.random() * 55),
  })),
  '1W': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => ({
    time: d,
    volume: 800 + Math.round(Math.random() * 600),
    deposits: 200 + Math.round(Math.random() * 200),
    withdrawals: 100 + Math.round(Math.random() * 150),
  })),
  '1M': ['W1', 'W2', 'W3', 'W4'].map((w) => ({
    time: w,
    volume: 3200 + Math.round(Math.random() * 2000),
    deposits: 900 + Math.round(Math.random() * 700),
    withdrawals: 400 + Math.round(Math.random() * 400),
  })),
};

const MINI_STATS = [
  { label: 'Total Volume', value: '$9.14M', color: 'var(--brand)' },
  { label: 'Net Deposits', value: '+$1.23M', color: 'var(--positive)' },
  { label: 'Total W/D', value: '-$384k', color: 'var(--negative)' },
];

const LEGEND = [
  { label: 'Volume Flow', color: 'var(--brand)' },
  { label: 'Deposits', color: 'var(--positive)' },
  { label: 'Withdrawals', color: 'var(--negative)' },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-[10px] p-3 backdrop-blur-md"
      style={{
        background: 'rgba(15, 23, 42, 0.75)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
        fontSize: '11px',
        fontFamily: 'IBM Plex Mono, monospace',
      }}
    >
      <div className="mb-2 text-[10px] uppercase tracking-wider text-text-muted border-b border-border/20 pb-1.5">
        {label}
      </div>
      <div className="flex flex-col gap-1.5 mt-2">
        {payload.map((p) => {
          const isWD = p.dataKey === 'withdrawals';
          const symbol = isWD ? '-' : '+';
          return (
            <div key={p.dataKey} className="flex items-center gap-2">
              <span 
                className="h-1.5 w-1.5 rounded-full" 
                style={{ 
                  background: p.color,
                  boxShadow: `0 0 6px ${p.color}` 
                }} 
              />
              <span className="text-text-muted w-20">{p.name}:</span>
              <span className="font-semibold text-text" style={{ color: p.color }}>
                {symbol}${p.value.toLocaleString()}k
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function DashboardChart() {
  const [activeFilter, setActiveFilter] = useState('1D');
  const chartData = CHART_DATA[activeFilter];

  return (
    <Card className="h-full p-0 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-border/15 bg-surface-elevated/45">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="text-[15px] font-semibold text-text flex items-center gap-2">
              <BarChart2 size={16} className="text-brand animate-pulse" />
              Liquidity Flow &amp; Revenue
            </div>
            <div className="text-[12.5px] text-text-muted mt-1">
              Real-time platform volume, deposits, and performance metrics
            </div>
          </div>
          {/* Time Filters */}
          <div className="flex items-center gap-1 rounded-[8px] border border-border/20 bg-bg/50 p-0.5">
            {TIME_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`rounded-[6px] px-3 py-1 text-[12.5px] font-medium transition-all cursor-pointer ${
                  activeFilter === f
                    ? 'shadow-[0_2px_8px_rgba(0,0,0,0.2)]'
                    : 'hover:text-text'
                }`}
                style={{
                  background: activeFilter === f ? 'var(--brand)' : 'transparent',
                  color: activeFilter === f ? 'var(--text-on-accent)' : 'var(--text-muted)',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5 bg-surface/10">
        {/* Mini Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {MINI_STATS.map(({ label, value, color }) => (
            <div
              key={label}
              className="relative rounded-[10px] border border-border/20 bg-bg/40 px-4 py-3 flex flex-col overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-border/40 hover:shadow-card-subtle cursor-default group"
            >
              {/* Top Accent Gradient Bar */}
              <div 
                className="absolute top-0 left-0 h-[2px] w-full" 
                style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} 
              />
              <div className="text-[11.5px] font-bold uppercase tracking-wider text-text-muted group-hover:text-text transition-colors">
                {label}
              </div>
              <div className="mt-1.5 text-[20px] font-bold tracking-[-0.02em] transition-transform duration-300 group-hover:translate-x-0.5" style={{ color }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Chart Legend */}
        <div className="mb-5 flex items-center gap-4">
          {LEGEND.map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5 group cursor-pointer">
              <span 
                className="h-2 w-2 rounded-full transition-transform duration-300 group-hover:scale-125" 
                style={{ 
                  background: color,
                  boxShadow: `0 0 5px ${color}`
                }} 
              />
              <span className="text-[12.5px] text-text-muted font-medium group-hover:text-text transition-colors">{label}</span>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="w-full h-[320px] sm:h-[360px] xl:h-[430px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="var(--brand)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="depGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--positive)" stopOpacity={0.06} />
                  <stop offset="95%" stopColor="var(--positive)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(194,198,214,0.45)', fontSize: 10, fontFamily: 'IBM Plex Mono, monospace' }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(194,198,214,0.45)', fontSize: 10, fontFamily: 'IBM Plex Mono, monospace' }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.04)', strokeWidth: 1 }} />
              <Area type="monotone" dataKey="volume" name="Volume" stroke="var(--brand)" fill="url(#volGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="deposits" name="Deposits" stroke="var(--positive)" fill="url(#depGrad)" strokeWidth={1.8} />
              <Line type="monotone" dataKey="withdrawals" name="Withdrawals" stroke="var(--negative)" strokeWidth={1.6} dot={false} strokeDasharray="4 2" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}

export default DashboardChart;
