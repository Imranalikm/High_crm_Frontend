import React from 'react';

export function FRow({ filters }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {filters.map((g) => (
        <div key={g.l} className="flex items-center gap-1.5">
          <span className="text-[11px] text-text-muted/70 font-bold uppercase tracking-wider shrink-0">
            {g.l}:
          </span>
          <div className="flex gap-1">
            {g.options.map((o) => (
              <button
                key={o}
                onClick={() => g.set(o)}
                className={`px-2.5 h-7 rounded-[6px] text-[11.5px] font-semibold font-heading cursor-pointer transition-all border
                  ${
                    g.v === o
                      ? 'bg-primary/[0.1] text-primary border-primary/20'
                      : 'border-white/[0.05] text-text-muted/75 hover:text-text-muted bg-transparent'
                  }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatPills({ items }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {items.map((s) => (
        <div key={s.k} className="flex items-center gap-2 rounded-[8px] border border-white/[0.06] bg-white/[0.02] px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.c }} />
          <span className="text-[11px] text-text-muted/75 font-heading">{s.k}</span>
          <span className="text-[11px] font-mono font-bold" style={{ color: s.c }}>
            {s.v}
          </span>
        </div>
      ))}
    </div>
  );
}
