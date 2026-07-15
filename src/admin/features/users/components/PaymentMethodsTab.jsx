import React, { useState, useEffect } from 'react';
import { Building2, CreditCard, Bitcoin, Smartphone, Star, Loader2, AlertCircle } from 'lucide-react';
import { usersService } from '../services/userService';
import { FIELDS } from '@/client/features/client-finance/components/paymentForm.constants';

const METHOD_META = {
  bank: { icon: Building2, color: 'cyan', label: 'Bank Account' },
  card: { icon: CreditCard, color: 'brand', label: 'Debit / Credit Card' },
  crypto: { icon: Bitcoin, color: 'warning', label: 'Crypto Wallet' },
  upi: { icon: Smartphone, color: 'positive', label: 'UPI' },
};

function AdminPaymentMethodCard({ method }) {
  const meta = METHOD_META[method.type] ?? METHOD_META.bank;
  const Icon = meta.icon;
  const cssColor = `var(--${meta.color})`;
  const cssMuted = `color-mix(in srgb, var(--${meta.color}) 10%, transparent)`;
  const csBorder = `color-mix(in srgb, var(--${meta.color}) 18%, transparent)`;

  const detailsArray = method.details
    ? Object.entries(method.details)
        .filter(([, v]) => v)
        .map(([k, v]) => {
          const fieldDef = (FIELDS[method.type] || []).find(f => f.key === k);
          return { label: fieldDef ? fieldDef.label : k, value: v };
        })
    : [];

  return (
    <div
      className="rounded-[16px] p-5 flex flex-col gap-4 relative bg-surface-elevated border shadow-card-subtle"
      style={{
        borderColor: method.isDefault
          ? `color-mix(in srgb, var(--${meta.color}) 35%, transparent)`
          : 'var(--border)',
        boxShadow: method.isDefault
          ? `0 0 16px -4px color-mix(in srgb, var(--${meta.color}) 20%, transparent)`
          : 'none',
      }}
    >
      {method.isDefault && (
        <span
          className="absolute top-3.5 right-3.5 flex items-center gap-1 px-2.5 py-1 rounded-[6px] text-[9.5px] font-bold uppercase tracking-[0.12em]"
          style={{ background: cssMuted, color: cssColor }}
        >
          <Star size={9} fill="currentColor" />
          Default
        </span>
      )}

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

      <div className="flex flex-col gap-2 mt-2">
        {detailsArray.map((d) => (
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
    </div>
  );
}

export function PaymentMethodsTab({ user }) {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadMethods() {
      try {
        setLoading(true);
        setError(null);
        const data = await usersService.getBankAccountsByUserId(user.id || user.uid);
        if (data.length === 0) {
          console.warn("No data returned for user:", user.id || user.uid);
        }
        setMethods(data);
      } catch (err) {
        console.error("loadMethods error:", err);
        setError(err.message || 'Failed to load payment methods');
      } finally {
        setLoading(false);
      }
    }
    if (user?.id || user?.uid) {
      loadMethods();
    }
  }, [user?.id, user?.uid]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-text-muted">
        <Loader2 size={24} className="animate-spin mb-3 text-brand" />
        <span className="text-[12px] font-medium">Loading payment methods...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-4 rounded-lg bg-negative/10 text-negative text-sm">
        <AlertCircle size={16} />
        {error}
      </div>
    );
  }

  if (!methods || methods.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border/40 rounded-[16px] bg-bg/20">
        <CreditCard size={32} className="text-text-muted/30 mb-3" />
        <p className="text-[14px] font-bold text-text">No Payment Methods</p>
        <p className="text-[12.5px] text-text-muted mt-1">This user has not added any payment methods yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[16px] font-bold text-text">Payment Methods</h3>
        <span className="text-[12px] font-bold text-text-muted">{methods.length} Saved Method{methods.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {methods.map((m) => (
          <AdminPaymentMethodCard key={m.id} method={m} />
        ))}
      </div>
    </div>
  );
}
