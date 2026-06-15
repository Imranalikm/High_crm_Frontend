import React, { useState } from 'react';
import { Building2, CreditCard, Bitcoin, Info, AlertTriangle, ChevronUp, ChevronDown } from 'lucide-react';

import { TYPES, FIELDS } from './paymentForm.constants';

/* ── Collapsible Section Card ── */
function Section({ step, icon, title, children, collapsible = false }) {
  const IconComponent = icon;
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="rounded-[12px] border border-border/15 bg-bg/20 overflow-hidden">
      {/* Section Header Row */}
      <div
        className={`flex items-center gap-3 px-4 py-3 border-b transition-colors select-none ${isOpen ? 'border-border/10' : 'border-transparent'
          } ${collapsible ? 'cursor-pointer hover:bg-bg/30' : 'cursor-default'}`}
        onClick={() => collapsible && setIsOpen((v) => !v)}
      >
        {/* Step Number Badge */}
        <div className="w-[26px] h-[26px] rounded-[7px] bg-brand/10 border border-brand/20 flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-black text-brand leading-none tabular-nums">
            {String(step).padStart(2, '0')}
          </span>
        </div>

        {/* Icon */}
        <IconComponent size={13} className="text-text-muted/50 flex-shrink-0" />

        {/* Title */}
        <span className="flex-1 text-[10.5px] font-black uppercase tracking-[0.16em] text-text-muted/65">
          {title}
        </span>

        {/* Collapse Chevron */}
        {collapsible && (
          <div className="flex-shrink-0 w-5 h-5 rounded-[5px] flex items-center justify-center text-text-muted/30">
            {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </div>
        )}
      </div>

      {/* Section Body */}
      {isOpen && (
        <div className="px-4 py-4 space-y-3.5">
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * PaymentMethodForm
 * Displays the form to add or edit a payment method.
 */
export function PaymentMethodForm({ type, setType, form, setForm }) {
  const fields = FIELDS[type] ?? [];

  const handleField = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <div className="flex flex-col gap-3.5">
      {/* Section 1: Method Type */}
      <Section step={1} icon={CreditCard} title="Method Type">
        <div className="grid grid-cols-3 gap-2">
          {TYPES.map((t) => {
            const Icon      = t.icon;
            const isActive  = type === t.id;
            const cssColor  = `var(--${t.color})`;
            return (
              <button
                key={t.id}
                type="button"
                id={`add-method-type-${t.id}`}
                onClick={() => { setType(t.id); setForm({}); }}
                className="flex flex-col items-center gap-1.5 p-3 rounded-[11px] transition-all duration-200 cursor-pointer"
                style={{
                  background: isActive ? `color-mix(in srgb, var(--${t.color}) 8%, transparent)` : 'var(--muted-surface)',
                  border: `1px solid ${isActive ? `color-mix(in srgb, var(--${t.color}) 22%, transparent)` : 'transparent'}`,
                }}
              >
                <Icon size={18} style={{ color: isActive ? cssColor : 'rgba(194,198,214,0.4)' }} strokeWidth={1.8} />
                <span className="text-[10.5px] font-bold text-center leading-tight" style={{ color: isActive ? cssColor : 'rgba(194,198,214,0.5)' }}>
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </Section>

      {/* Section 2: Method Details */}
      <Section step={2} icon={Building2} title="Method Details">
        <div className="grid grid-cols-2 gap-3">
          {fields.map((f) => (
            <div key={f.key} className={`space-y-1.5 ${f.wide ? 'col-span-2' : ''}`}>
              <label className="flex items-center gap-1 text-[9.5px] font-black uppercase tracking-[0.14em] text-text-muted/50 select-none">
                {f.label}
                {f.key !== 'label' && <span className="text-brand/70">*</span>}
              </label>
              <input
                id={`payment-field-${f.key}`}
                type={f.type}
                value={form[f.key] ?? ''}
                onChange={(e) => handleField(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="w-full h-9 rounded-[8px] border border-border/18 bg-bg/60 px-3 text-[12.5px] text-text outline-none placeholder:text-text-muted/20 focus:border-brand/40 focus:ring-1 focus:ring-brand/10 transition-all"
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Section 3: Guidelines & Security */}
      <Section step={3} icon={Info} title="Guidelines & Security" collapsible>
        {type === 'bank' && (
          <div className="flex items-start gap-2.5 rounded-[10px] border border-cyan/25 bg-cyan/5 px-3.5 py-3 shadow-sm text-[11.5px] text-cyan/90 leading-relaxed">
            <Info size={14} className="shrink-0 mt-0.5 text-cyan" />
            <span>Please ensure that the bank account name matches your registered client account name to avoid processing delays. We do not support third-party transfers.</span>
          </div>
        )}
        {type === 'card' && (
          <div className="flex items-start gap-2.5 rounded-[10px] border border-brand/25 bg-brand/5 px-3.5 py-3 shadow-sm text-[11.5px] text-brand/90 leading-relaxed">
            <Info size={14} className="shrink-0 mt-0.5 text-brand" />
            <span>Cards must be in your name. We support Visa, Mastercard, and American Express. 3D Secure verification is required during deposit checks.</span>
          </div>
        )}
        {type === 'crypto' && (
          <div className="flex items-start gap-2.5 rounded-[10px] border border-warning/25 bg-warning/5 px-3.5 py-3 shadow-sm text-[11.5px] text-warning/90 leading-relaxed">
            <Info size={14} className="shrink-0 mt-0.5 text-warning" />
            <span>Verify network selection carefully. Sending assets to the wrong blockchain or address will result in permanent loss of funds. We recommend a test transfer first.</span>
          </div>
        )}
      </Section>
    </div>
  );
}

export default PaymentMethodForm;
