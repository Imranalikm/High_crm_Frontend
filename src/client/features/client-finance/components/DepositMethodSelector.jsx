import React from 'react';
import { CreditCard, Building2, Zap, Clock } from 'lucide-react';
import { usePlatformSettings } from '@/shared/features/settings/PlatformSettingsContext';

const DEFAULT_METHODS = {
  bank: {
    id: 'bank',
    label: 'Bank Transfer',
    sub: 'SWIFT, SEPA, Wire',
    icon: Building2,
    color: 'cyan',
    processingLabel: '1–3 Business Days',
    processingIcon: Clock,
    processingColor: 'var(--warning)',
    fee: 'Free',
    minDeposit: '$50',
  },
  upi: {
    id: 'upi',
    label: 'UPI',
    sub: 'Google Pay, PhonePe, Paytm',
    icon: Zap,
    color: 'positive',
    processingLabel: 'Instant',
    processingIcon: Zap,
    processingColor: 'var(--positive)',
    fee: '0%',
    minDeposit: '₹100',
  },
  online: {
    id: 'online',
    label: 'Online Payment',
    sub: 'Visa, Mastercard, Stripe Checkout',
    icon: CreditCard,
    color: 'brand',
    processingLabel: 'Instant',
    processingIcon: Zap,
    processingColor: 'var(--positive)',
    fee: '2.9% + $0.30',
    minDeposit: '$10',
  }
};

export function DepositMethodSelector({ value, onChange }) {
  const { clientSettings } = usePlatformSettings();
  const { gateways } = clientSettings;

  // Gateway ID → DEFAULT_METHODS key mapping
  const gatewayToMethod = { swift: 'bank', upi: 'upi', stripe: 'online' };

  // Build a fee lookup from enabled gateways
  const feeOverrides = {};
  gateways.forEach((g) => {
    if (!g.enabled) return;
    const key = gatewayToMethod[g.id];
    if (key && g.fee) feeOverrides[key] = g.fee;
  });

  // Always show all methods in the defined order, with gateway fee overrides
  const methodsToRender = Object.values(DEFAULT_METHODS).map((m) => ({
    ...m,
    ...(feeOverrides[m.id] ? { fee: feeOverrides[m.id] } : {}),
  }));

  return (
    <div className="flex flex-col gap-3">
      {methodsToRender.map((m) => {
        const Icon          = m.icon;
        const ProcessIcon   = m.processingIcon;
        const isSelected    = value === m.id;
        const cssColor      = `var(--${m.color})`;
        const cssBg         = `color-mix(in srgb, var(--${m.color}) 8%, transparent)`;
        const csBorder      = `color-mix(in srgb, var(--${m.color}) 25%, transparent)`;
        const cssMuted      = `color-mix(in srgb, var(--${m.color}) 12%, transparent)`;

        return (
          <button
            key={m.id}
            id={`deposit-method-${m.id}`}
            onClick={() => onChange(m.id)}
            className="w-full flex items-center gap-4 p-4 rounded-[13px] transition-all duration-200 cursor-pointer outline-none text-left hover:scale-[1.005]"
            style={{
              background: isSelected ? cssBg : 'var(--muted-surface)',
              border: `1px solid ${isSelected ? csBorder : 'transparent'}`,
              boxShadow: isSelected ? `0 0 0 1px ${csBorder}` : 'none',
            }}
          >
            {/* Icon */}
            <div
              className="w-11 h-11 rounded-[11px] flex items-center justify-center shrink-0"
              style={{ background: cssMuted, color: cssColor }}
            >
              <Icon size={20} strokeWidth={1.8} />
            </div>

            {/* Labels */}
            <div className="flex-1 min-w-0">
              <p className="text-[13.5px] font-semibold" style={{ color: 'var(--text)' }}>{m.label}</p>
              <p className="text-[11.5px] mt-0.5" style={{ color: 'rgba(194,198,214,0.5)' }}>{m.sub}</p>


            </div>

            {/* Radio indicator */}
            <div
              className="w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all duration-200"
              style={{ borderColor: isSelected ? cssColor : 'rgba(194,198,214,0.2)' }}
            >
              {isSelected && (
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: cssColor }} />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export const DEPOSIT_METHODS = Object.values(DEFAULT_METHODS);
