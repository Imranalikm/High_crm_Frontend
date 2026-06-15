import React from 'react';
import { Building2, CreditCard, Bitcoin, Star, Trash2, Pencil } from 'lucide-react';

const METHOD_META = {
  bank: {
    icon: Building2,
    color: 'cyan',
    label: 'Bank Account',
  },
  card: {
    icon: CreditCard,
    color: 'brand',
    label: 'Debit / Credit Card',
  },
  crypto: {
    icon: Bitcoin,
    color: 'warning',
    label: 'Crypto Wallet',
  },
};

/**
 * PaymentMethodCard
 * Displays a single saved payment method (bank / card / crypto) with actions.
 */
export function PaymentMethodCard({ method, onEdit, onRemove, onSetDefault }) {
  const meta    = METHOD_META[method.type] ?? METHOD_META.bank;
  const Icon    = meta.icon;
  const cssColor = `var(--${meta.color})`;
  const cssMuted = `color-mix(in srgb, var(--${meta.color}) 10%, transparent)`;
  const csBorder = `color-mix(in srgb, var(--${meta.color}) 18%, transparent)`;

  return ( 
    <div
      className="rounded-[16px] p-5 flex flex-col gap-4 transition-all duration-200 hover:scale-[1.01] relative bg-surface-elevated border shadow-card-subtle"
      style={{
        borderColor: method.isDefault
          ? `color-mix(in srgb, var(--${meta.color}) 35%, transparent)`
          : 'var(--border)',
        boxShadow: method.isDefault
          ? `0 0 16px -4px color-mix(in srgb, var(--${meta.color}) 20%, transparent)`
          : 'none',
      }}
    >
      {/* Default badge */}
      {method.isDefault && (
        <span
          className="absolute top-3.5 right-3.5 flex items-center gap-1 px-2.5 py-1 rounded-[6px] text-[9.5px] font-bold uppercase tracking-[0.12em]"
          style={{ background: cssMuted, color: cssColor }}
        >
          <Star size={9} fill="currentColor" />
          Default
        </span>
      )}

      {/* Top: icon + type label */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-[11px] flex items-center justify-center shrink-0"
          style={{ background: cssMuted, border: `1px solid ${csBorder}`, color: cssColor }}
        >
          <Icon size={18} strokeWidth={1.8} />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted/60">
            {meta.label}
          </p>
          <p className="text-[14px] font-bold mt-0.5 text-text">
            {method.name}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-2">
        {method.details.map((d) => (
          <div key={d.label} className="flex items-center justify-between py-1 border-b border-border/5 last:border-0">
            <span className="text-[11.5px] font-medium text-text-muted">
              {d.label}
            </span>
            <span className="font-mono text-[12px] font-bold text-text">
              {d.value}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div
        className="flex items-center gap-2 pt-3"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        {!method.isDefault && (
          <button
            id={`payment-method-default-${method.id}`}
            onClick={() => onSetDefault?.(method.id)}
            className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-[7px] transition-all duration-150 cursor-pointer hover:opacity-90 active:scale-95"
            style={{ color: cssColor, background: cssMuted }}
          >
            <Star size={10} />
            Set Default
          </button>
        )}
        <button
          id={`payment-method-edit-${method.id}`}
          onClick={() => onEdit?.(method)}
          className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-[7px] transition-all duration-150 cursor-pointer hover:opacity-90 active:scale-95 ml-auto text-text bg-muted-surface border border-border/20"
        >
          <Pencil size={10} />
          Edit
        </button>
        <button
          id={`payment-method-remove-${method.id}`}
          onClick={() => onRemove?.(method.id)}
          className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-[7px] transition-all duration-150 cursor-pointer hover:opacity-90 active:scale-95 text-negative"
          style={{ background: 'color-mix(in srgb, var(--negative) 8%, transparent)' }}
        >
          <Trash2 size={10} />
          Remove
        </button>
      </div>
    </div>
  );
}
