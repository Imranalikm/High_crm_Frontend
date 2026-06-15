import React, { useState } from 'react';
import { Check, X, ChevronRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { MainDrawer } from '@/components/common/drawer';
import { PaymentMethodForm } from './PaymentMethodForm';
import { FIELDS } from './paymentForm.constants';

/**
 * AddPaymentMethodDrawer
 * Slide-over drawer for adding or editing a payment method.
 * Styled to perfectly match the design, width, and header accents of AddUserDrawer.
 */
export function AddPaymentMethodDrawer({ open, onClose, onSave, editMethod }) {
  const [type,   setType]   = useState(editMethod?.type ?? 'bank');
  const [form,   setForm]   = useState(editMethod?.formData ?? {});
  const [saved,  setSaved]  = useState(false);

  const fields = FIELDS[type] ?? [];
  const allFilled = fields.filter(f => f.key !== 'label').every(f => (form[f.key] ?? '').trim().length > 0);

  const handleSave = () => {
    if (!allFilled) return;
    setSaved(true);
    setTimeout(() => {
      onSave?.({ type, formData: form });
      setSaved(false);
      onClose?.();
    }, 900);
  };

  return (
    <MainDrawer open={open} width="max-w-[720px]" onClose={onClose}>
      <div className="flex h-full w-full flex-col overflow-hidden">
        
        {/* Header Section */}
        <div className="flex-shrink-0 border-b border-border/15">
          {/* Brand accent top bar */}
          <div
            className="h-[2.5px] w-full"
            style={{
              background:
                'linear-gradient(90deg, var(--brand), color-mix(in srgb, var(--brand) 40%, transparent) 65%, transparent)',
            }}
          />

          <div className="px-6 py-5 flex items-start justify-between gap-4">
            {/* Title block */}
            <div className="min-w-0">
              {/* Mode eyebrow */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                <span className="text-[9.5px] font-black uppercase tracking-[0.22em] text-brand/65 leading-none">
                  Payment Method · {editMethod ? 'Edit Mode' : 'Create Mode'}
                </span>
              </div>

              <h2 className="text-[22px] font-bold tracking-[-0.025em] text-text leading-none">
                {editMethod ? 'Edit Method' : 'Add New Method'}
              </h2>
              <p className="text-[12px] text-text-muted/50 mt-2 leading-relaxed max-w-[460px]">
                {editMethod
                  ? 'Update your payment method account or address details.'
                  : 'Link a bank account, card, or crypto wallet to your profile for secure deposits and withdrawals.'}
              </p>
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="flex-shrink-0 mt-0.5 flex h-8 w-8 items-center justify-center rounded-[8px] border border-border/18 bg-bg/40 text-text-muted hover:text-text hover:border-border/30 transition-all cursor-pointer"
            >
              <X size={13} />
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
          <PaymentMethodForm
            type={type}
            setType={setType}
            form={form}
            setForm={setForm}
          />
          <div className="h-2" />
        </div>

        {/* Sticky Drawer Footer */}
        <div className="flex-shrink-0 border-t border-border/15 bg-surface-elevated">
          {/* Validation warning banner */}
          {!allFilled && (
            <div className="flex items-center gap-2.5 mx-6 mt-4 rounded-[9px] border border-warning/22 bg-warning/6 px-3.5 py-2.5">
              <AlertTriangle size={13} className="text-warning flex-shrink-0" />
              <span className="text-[11.5px] font-medium text-warning leading-tight">
                All fields are required before saving this payment method.
              </span>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 px-6 py-4">
            {/* Required fields hint */}
            <p className="text-[10px] text-text-muted/35 font-medium">
              <span className="text-brand/60 font-black">*</span> Required fields
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="h-9 px-5 rounded-[9px] text-[11.5px] font-bold border border-border/20 bg-bg/40 text-text-muted hover:text-text hover:border-border/32 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!allFilled || saved}
                className="flex items-center gap-1.5 h-9 px-5 rounded-[9px] text-[11.5px] font-black uppercase tracking-wider bg-brand text-text-on-accent hover:brightness-110 active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {saved ? (
                  <>
                    <CheckCircle2 size={12} /> Saved!
                  </>
                ) : editMethod ? (
                  <>
                    <Check size={12} /> Save Changes
                  </>
                ) : (
                  <>
                    <ChevronRight size={12} strokeWidth={2.5} /> Save Method
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

      </div>
    </MainDrawer>
  );
}

export default AddPaymentMethodDrawer;
