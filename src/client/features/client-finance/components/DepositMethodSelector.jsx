import React from 'react';
import { CreditCard, Bitcoin, Building2, Zap, Clock } from 'lucide-react';
import { usePlatformSettings } from '@/shared/features/settings/PlatformSettingsContext';

const DEFAULT_METHODS = {
  card: {
    id: 'card',
    label: 'Credit / Debit Card',
    sub: 'Visa, Mastercard, Amex',
    icon: CreditCard,
    color: 'brand',
    processingLabel: 'Instant',
    processingIcon: Zap,
    processingColor: 'var(--positive)',
    fee: '2.5%',
    minDeposit: '$10',
  },
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
  crypto: {
    id: 'crypto',
    label: 'Cryptocurrency',
    sub: 'USDT, BTC, ETH, BNB',
    icon: Bitcoin,
    color: 'warning',
    processingLabel: '10–30 Minutes',
    processingIcon: Clock,
    processingColor: 'var(--cyan)',
    fee: '0%',
    minDeposit: '$20',
  },
  skrill: {
    id: 'skrill',
    label: 'Skrill Wallet',
    sub: 'Skrill Balance',
    icon: Zap,
    color: 'positive',
    processingLabel: 'Instant',
    processingIcon: Zap,
    processingColor: 'var(--positive)',
    fee: '1.9%',
    minDeposit: '$10',
  }
};

export function DepositMethodSelector({ value, onChange }) {
  const { clientSettings } = usePlatformSettings();
  const { gateways } = clientSettings;

  const activeMethods = [];

  // Map admin gateways to client methods
  gateways.forEach((g) => {
    if (!g.enabled) return;
    
    if (g.id === 'stripe') {
      activeMethods.push({
        ...DEFAULT_METHODS.card,
        fee: g.fee || '2.5%'
      });
    } else if (g.id === 'swift') {
      activeMethods.push({
        ...DEFAULT_METHODS.bank,
        fee: g.fee || 'Free'
      });
    } else if (g.id === 'fireblocks') {
      activeMethods.push({
        ...DEFAULT_METHODS.crypto,
        fee: g.fee || '0%'
      });
    } else if (g.id === 'skrill') {
      activeMethods.push({
        ...DEFAULT_METHODS.skrill,
        fee: g.fee || '1.9%'
      });
    }
  });

  // Fallback in case everything is disabled
  const methodsToRender = activeMethods.length > 0 ? activeMethods : [DEFAULT_METHODS.card];

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

              {/* Fee + processing */}
              <div className="flex items-center gap-3 mt-2">
                <span
                  className="flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded-[5px]"
                  style={{ background: cssMuted, color: cssColor }}
                >
                  Fee: {m.fee}
                </span>
                <span
                  className="flex items-center gap-1 text-[10.5px] font-medium"
                  style={{ color: m.processingColor }}
                >
                  <ProcessIcon size={10} strokeWidth={2.2} />
                  {m.processingLabel}
                </span>
                <span className="text-[10.5px]" style={{ color: 'rgba(194,198,214,0.35)' }}>
                  Min {m.minDeposit}
                </span>
              </div>
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
