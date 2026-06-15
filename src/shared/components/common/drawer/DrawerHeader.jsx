import React from 'react';
import { X } from 'lucide-react';

export function DrawerHeader({ title, subtitle, eyebrow, onClose }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/15 px-6 py-6 relative z-[5] shrink-0">
      <div>
        {eyebrow && <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">{eyebrow}</p>}
        <h3 className="mt-1.5 text-[24px] font-bold tracking-[-0.04em] text-text">{title}</h3>
        {subtitle && <p className="mt-2 text-[13px] font-medium text-text-muted/60">{subtitle}</p>}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-border/25 text-text-muted/40 hover:bg-surface-bright/20 hover:text-text transition-all"
        >
          <X size={16} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
