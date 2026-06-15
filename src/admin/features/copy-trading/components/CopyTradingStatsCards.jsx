import React from 'react';

// Re-export standard platform KPI Card
export { KpiCard } from '@/components/cards';

export function SH({ title, Icon: Ic, action }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      {Ic && <Ic size={12} className="text-text-muted/65 flex-shrink-0" />}
      <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-muted/70 font-heading select-none">
        {title}
      </span>
      <div className="flex-1 h-px bg-white/[0.05]" />
      {action}
    </div>
  );
}
