import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export function AdminModal({ open, title, subtitle, children, footer, onClose, maxWidth = 'max-w-[720px]', actionLabel = 'Create Action' }) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[#020617]/65 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${maxWidth} rounded-[16px] border border-border/40 bg-surface shadow-card-subtle`}>
        <div className="flex items-start justify-between gap-4 border-b border-border/30 px-6 py-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted/60">{actionLabel}</p>
            <h3 className="mt-1 text-[24px] font-semibold tracking-[-0.05em] text-text">{title}</h3>
            {subtitle && <p className="mt-2 text-[13px] text-text-muted">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-border/30 text-text-muted hover:bg-surface-elevated hover:text-text"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-6">{children}</div>
        {footer && <div className="border-t border-border/30 px-6 py-4">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
