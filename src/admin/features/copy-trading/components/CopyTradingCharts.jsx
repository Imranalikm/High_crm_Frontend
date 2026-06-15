import React from 'react';

export function CTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-[10px] border border-white/[0.1] shadow-xl px-3 py-2.5 text-[11px] font-mono"
      style={{ background: 'var(--surface-elevated,#1a1a1a)' }}
    >
      <div className="text-[10.5px] font-bold uppercase tracking-widest text-text-muted/75 mb-1.5 font-heading">
        {label}
      </div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span className="text-text-muted/75 capitalize">{String(p.dataKey)}</span>
          <span className="font-semibold ml-1" style={{ color: p.color }}>
            {typeof p.value === 'number' && (p.value > 0 ? '+' : '')}
            {p.value}
            {String(p.dataKey).includes('d') ? '%' : '%'}
          </span>
        </div>
      ))}
    </div>
  );
}

export default CTip;
