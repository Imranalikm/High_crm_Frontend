import React from 'react';

export function SectionHead({ title, Icon: Ic, action }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      {Ic && <Ic size={12} className="flex-shrink-0 text-text-muted/70" />}
      <span className="select-none text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted/70 font-heading">
        {title}
      </span>
      <div className="h-px flex-1 bg-border/25" />
      {action}
    </div>
  );
}
