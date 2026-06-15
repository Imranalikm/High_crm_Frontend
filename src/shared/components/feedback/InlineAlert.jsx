import React from 'react';
import { AlertTriangle, CheckCircle2, Info, ShieldAlert } from 'lucide-react';

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: ShieldAlert,
};

const tones = {
  info: 'border-primary/20 bg-primary/5 text-primary',
  success: 'border-positive/20 bg-positive/5 text-positive',
  warning: 'border-warning/20 bg-warning/5 text-warning',
  danger: 'border-negative/20 bg-negative/5 text-negative',
};

export function InlineAlert({ tone = 'info', title, children }) {
  const Icon = icons[tone] ?? Info;

  return (
    <div className={`rounded-[10px] border p-4 shadow-card-subtle ${tones[tone] ?? tones.info}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          <Icon size={16} strokeWidth={2.4} />
        </div>
        <div>
          {title && <div className="text-[12px] font-semibold uppercase tracking-[0.14em]">{title}</div>}
          <div className="mt-1 text-[13px] leading-6 text-current/90">{children}</div>
        </div>
      </div>
    </div>
  );
}
