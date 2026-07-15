import React, { useState, useEffect } from 'react';

import { Plus, CreditCard, Wallet2, Loader2, AlertTriangle } from 'lucide-react';
import { PaymentMethodCard }      from '../components/PaymentMethodCard';
import { AddPaymentMethodDrawer } from '../components/AddPaymentMethodDrawer';
import { financeApi }             from '../services/finance.api';

import { FIELDS }                 from '../components/paymentForm.constants';

function EmptyState({ onAdd }) {
  return (
    <div
      className="flex flex-col items-center gap-4 py-16 text-center rounded-[16px]"
      style={{ background: 'var(--surface)', border: '1px dashed var(--border)' }}
    >
      <div
        className="w-16 h-16 rounded-[16px] flex items-center justify-center"
        style={{ background: 'color-mix(in srgb, var(--brand) 8%, transparent)' }}
      >
        <Wallet2 size={30} style={{ color: 'var(--brand)' }} strokeWidth={1.4} />
      </div>
      <div>
        <p className="font-heading font-bold text-[16px] tracking-[-0.03em]" style={{ color: 'var(--text)' }}>
          No Payment Methods Saved
        </p>
        <p className="text-[13px] mt-1" style={{ color: 'var(--text-muted)' }}>
          Add a bank account to speed up your withdrawals.
        </p>
      </div>
      <button
        id="payment-methods-empty-add-btn"
        onClick={onAdd}
        className="flex items-center gap-2 h-10 px-5 rounded-[10px] font-bold text-[13px] cursor-pointer transition-all duration-200 hover:scale-[1.02]"
        style={{ background: 'var(--brand)', color: 'var(--text-on-accent)' }}
      >
        <Plus size={15} strokeWidth={2.5} />
        Add Your First Method
      </button>
    </div>
  );
}

export function PaymentMethodsPage() {
  const [methods, setMethods] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editMethod, setEditMethod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const fetchMethods = async () => {
    try {
      setLoading(true);
      const data = await financeApi.getBankAccounts();
      // Map API response to the format expected by PaymentMethodCard
      const mapped = (data || []).map(acc => ({
        id: acc.id,
        type: acc.type,
        name: acc.name,
        isDefault: acc.isDefault,
        details: acc.details
          ? Object.entries(acc.details)
              .filter(([, v]) => v)
              .map(([k, v]) => {
                const fieldDef = (FIELDS[acc.type] || []).find(f => f.key === k);
                return { label: fieldDef ? fieldDef.label : k, value: v };
              })
          : [],
        rawDetails: acc.details || {},
      }));
      setMethods(mapped);
    } catch (err) {
      console.error('Failed to load payment methods:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const handleSetDefault = async (id) => {
    try {
      await financeApi.setDefaultBankAccount(id);
      setMethods((prev) => prev.map((m) => ({ ...m, isDefault: m.id === id })));
    } catch (err) {
      console.error('Failed to set default:', err);
    }
  };

  const handleRemove = async (id) => {
    try {
      await financeApi.deleteBankAccount(id);
      await fetchMethods();
    } catch (err) {
      console.error('Failed to remove:', err);
    }
  };

  const handleEdit = (method) => {
    setEditMethod(method);
    setDrawerOpen(true);
  };

  const handleAdd = () => {
    setEditMethod(null);
    setDrawerOpen(true);
  };

  const handleSave = async (data) => {
    try {
      const payload = {
        type: data.type,
        name: data.formData.bankName || data.formData.cardName || data.formData.label || data.formData.network || 'New Method',
        details: data.formData,
      };

      if (editMethod) {
        await financeApi.updateBankAccount(editMethod.id, payload);
      } else {
        await financeApi.createBankAccount(payload);
      }
      await fetchMethods();
    } catch (err) {
      console.error('Failed to save payment method:', err);
      showToast(err?.response?.data?.message || err?.message || 'Failed to save payment method');
    }
    setDrawerOpen(false);
    setEditMethod(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 animate-fade-up">
        <Loader2 size={24} className="animate-spin text-brand" />
        <span className="text-[12px] font-bold text-text-muted uppercase tracking-widest">Loading payment methods...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-up">

      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-section-eyebrow">Financials</p>
          <h1 className="font-heading font-semibold text-[26px] tracking-[-0.03em] leading-tight text-text mt-0.5">
            Payment Methods
          </h1>
          <p className="text-[13.5px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Manage your saved bank accounts, cards, and crypto wallets.
          </p>
        </div>
        <button
          id="payment-methods-add-btn"
          onClick={handleAdd}
          className="flex items-center gap-2 h-9 px-4 rounded-[9px] font-semibold text-[12.5px] transition-all duration-200 cursor-pointer active:scale-95 hover:scale-[1.02] shrink-0"
          style={{ background: 'var(--brand)', color: 'var(--text-on-accent)' }}
        >
          <Plus size={14} strokeWidth={2.5} />
          Add Method
        </button>
      </div>

      {/* Methods grid or empty state */}
      {methods.length === 0 ? (
        <EmptyState onAdd={handleAdd} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {methods.map((m) => (
            <PaymentMethodCard
              key={m.id}
              method={m}
              onEdit={handleEdit}
              onRemove={handleRemove}
              onSetDefault={handleSetDefault}
            />
          ))}

          {/* Add tile */}
          <button
            id="payment-methods-add-tile"
            onClick={handleAdd}
            className="flex flex-col items-center justify-center gap-3 rounded-[16px] p-6 border-2 border-dashed transition-all duration-200 cursor-pointer hover:scale-[1.01] min-h-[200px] bg-surface-elevated/20 border-border/30 hover:border-brand/40 text-text-muted hover:text-text"
          >
            <div
              className="w-12 h-12 rounded-[12px] flex items-center justify-center transition-all duration-200"
              style={{ background: 'color-mix(in srgb, var(--brand) 6%, transparent)' }}
            >
              <Plus size={22} style={{ color: 'var(--brand)' }} strokeWidth={1.8} />
            </div>
            <div className="text-center">
              <p className="text-[13.5px] font-bold text-text">
                Add Payment Method
              </p>
              <p className="text-[11.5px] mt-1 text-text-muted">
                Bank Account
              </p>
            </div>
          </button>
        </div>
      )}
      <AddPaymentMethodDrawer
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setEditMethod(null); }}
        onSave={handleSave}
        editMethod={editMethod}
      />
      {toast && (
        <div className="fixed bottom-6 right-6 px-4 py-2.5 rounded-[9px] font-bold text-[12px] flex items-center gap-2 z-50 animate-fade-up shadow-xl"
             style={{ background: 'var(--warning)', color: 'var(--bg)' }}>
          <AlertTriangle size={14} />
          {toast}
        </div>
      )}
    </div>
  );
}
