import React from 'react';
import { ResponsiveContainer, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';

export function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const fmt = (k, v) => {
    if (k === 'success' || k === 'generated') return `${v} reports`;
    if (k === 'failed') return `${v} failed`;
    return v;
  };
  return (
    <div className="rounded-[11px] border border-border/25 bg-surface/85 backdrop-blur-md shadow-2xl px-3 py-2.5 text-[11px] font-mono animate-in fade-in zoom-in-98 duration-100">
      <div className="text-[9px] font-black uppercase tracking-widest text-text-muted/50 mb-2 font-heading">{label}</div>
      <div className="space-y-1.5">
        {payload.map(p => (
          <div key={p.dataKey} className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
            <span className="text-text-muted/65 capitalize text-[10px] font-heading">{String(p.dataKey).replace(/_/g, ' ')}</span>
            <span className="font-bold ml-auto font-mono text-[10.5px]" style={{ color: p.color }}>{fmt(p.dataKey, p.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ActivityBarChart({ data }) {
  return (
    <div className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap="25%">
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.12} vertical={false} />
          <XAxis 
            dataKey="hour" 
            tick={{ fill: 'color-mix(in srgb, var(--text-muted) 55%, transparent)', fontSize: 10, fontFamily: 'var(--font-heading)', fontWeight: 600 }} 
            axisLine={false} 
            tickLine={false} 
            tickFormatter={v => `${v}:00`} 
          />
          <YAxis 
            tick={{ fill: 'color-mix(in srgb, var(--text-muted) 55%, transparent)', fontSize: 10, fontFamily: 'var(--font-mono)' }} 
            axisLine={false} 
            tickLine={false} 
            width={24} 
          />
          <Tooltip content={<ChartTip />} cursor={{ fill: 'var(--border)', opacity: 0.05 }} />
          <Bar dataKey="generated" fill="var(--brand)" radius={[4, 4, 0, 0]} opacity={0.85} />
          <Bar dataKey="failed" fill="var(--negative)" radius={[4, 4, 0, 0]} opacity={0.7} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DeliveryAreaChart({ data }) {
  return (
    <div className="h-full w-full min-h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 16, left: 16, bottom: 0 }}>
          <defs>
            <linearGradient id="sucG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--positive)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="var(--positive)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="failG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--negative)" stopOpacity={0.12} />
              <stop offset="95%" stopColor="var(--negative)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.1} vertical={false} />
          <XAxis 
            dataKey="day" 
            tick={{ fill: 'color-mix(in srgb, var(--text-muted) 55%, transparent)', fontSize: 10, fontFamily: 'var(--font-heading)', fontWeight: 600 }} 
            axisLine={false} 
            tickLine={false} 
          />
          {/* Left Y-Axis for Success Volume */}
          <YAxis 
            yAxisId="left"
            tick={{ fill: 'color-mix(in srgb, var(--text-muted) 55%, transparent)', fontSize: 10, fontFamily: 'var(--font-mono)' }} 
            axisLine={false} 
            tickLine={false} 
            width={28} 
          />
          {/* Right Y-Axis for Failure Counts (max failed is 2, so [0, 4] domain keeps it neat and readable) */}
          <YAxis 
            yAxisId="right"
            orientation="right"
            domain={[0, 4]}
            tick={{ fill: 'color-mix(in srgb, var(--negative) 60%, transparent)', fontSize: 10, fontFamily: 'var(--font-mono)' }} 
            axisLine={false} 
            tickLine={false} 
            width={20} 
          />
          <Tooltip content={<ChartTip />} />
          <Area 
            yAxisId="left" 
            type="monotone" 
            dataKey="success" 
            stroke="var(--positive)" 
            strokeWidth={2} 
            fill="url(#sucG)" 
          />
          <Area 
            yAxisId="right" 
            type="monotone" 
            dataKey="failed" 
            stroke="var(--negative)" 
            strokeWidth={1.5} 
            fill="url(#failG)" 
            strokeDasharray="4 3" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TypePieChart({ data }) {
  return (
    <div className="h-[150px] w-[150px] flex-shrink-0 relative group">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie 
            data={data} 
            cx="50%" 
            cy="50%" 
            innerRadius={45} 
            outerRadius={65} 
            dataKey="value" 
            strokeWidth={1.5}
            stroke="var(--bg)"
          >
            {data.map((t, i) => (
              <Cell 
                key={i} 
                fill={t.color} 
                className="transition-all duration-300 hover:opacity-90 outline-none" 
              />
            ))}
          </Pie>
          <Tooltip content={({ active, payload }) => active && payload?.length ? (
            <div className="rounded-[11px] border border-border/25 bg-surface/85 backdrop-blur-md px-3 py-2 text-[11px] font-mono shadow-2xl animate-in fade-in zoom-in-98 duration-100">
              <div className="font-bold font-heading text-[10.5px] pb-1 border-b border-border/10 mb-1" style={{ color: payload[0].payload.color }}>{payload[0].name}</div>
              <div className="text-text-muted/65 text-[10px] font-heading">{payload[0].value}% of volume</div>
            </div>
          ) : null} />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
        <span className="text-[10px] font-black uppercase tracking-wider text-text-muted/35 font-heading">Reports</span>
        <span className="text-[15px] font-black font-heading text-text mt-0.5">Ratio</span>
      </div>
    </div>
  );
}
