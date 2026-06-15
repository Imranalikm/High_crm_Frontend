import React, { useState } from 'react';

import { Plus, CreditCard, Wallet2 } from 'lucide-react';
import { PaymentMethodCard }      from '../components/PaymentMethodCard';
import { AddPaymentMethodDrawer } from '../components/AddPaymentMethodDrawer';

/* ── Mock saved methods — TODO: replace with API call ── */
const INITIAL_METHODS = [
  {
    id: 'pm-1',
    type: 'bank',
    name: 'HDFC Bank',
    isDefault: true,
    details: [
      { label: 'Account Number', value: '••••  ••••  5678' },
      { label: 'Account Name',   value: 'John Doe'          },
      { label: 'IFSC Code',      value: 'HDFC0001234'       },
      { label: 'Country',        value: 'India'              },
    ],
  },
  {
    id: 'pm-2',
    type: 'card',
    name: 'Visa Debit',
    isDefault: false,
    details: [
      { label: 'Card Number', value: '•••• •••• •••• 4242' },
      { label: 'Expiry',      value: '08 / 27'              },
      { label: 'Name',        value: 'John Doe'              },
    ],
  },
  {
    id: 'pm-3',
    type: 'crypto',
    name: 'USDT Wallet',
    isDefault: false,
    details: [
      { label: 'Network', value: 'TRC-20 (TRON)'                      },
      { label: 'Address', value: 'TQn9Y2…hfNa'                        },
    ],
  },
];

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
          Add a bank account, card, or crypto wallet to speed up deposits & withdrawals.
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
  const [methods, setMethods] = useState(INITIAL_METHODS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editMethod, setEditMethod] = useState(null);

  const handleSetDefault = (id) => {
    setMethods((prev) => prev.map((m) => ({ ...m, isDefault: m.id === id })));
  };

  const handleRemove = (id) => {
    setMethods((prev) => prev.filter((m) => m.id !== id));
  };

  const handleEdit = (method) => {
    setEditMethod(method);
    setDrawerOpen(true);
  };

  const handleAdd = () => {
    setEditMethod(null);
    setDrawerOpen(true);
  };

  const handleSave = (data) => {
    // TODO: persist via API
    if (editMethod) {
      setMethods((prev) =>
        prev.map((m) => m.id === editMethod.id ? { ...m, ...data } : m)
      );
    } else {
      setMethods((prev) => [
        ...prev,
        {
          id:        `pm-${Date.now()}`,
          type:      data.type,
          name:      data.formData.bankName || data.formData.cardName || data.formData.label || 'New Method',
          isDefault: false,
          details:   Object.entries(data.formData)
            .filter(([, v]) => v)
            .map(([k, v]) => ({ label: k, value: v })),
        },
      ]);
    }
    setDrawerOpen(false);
    setEditMethod(null);
  };

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
                Bank, card, or crypto
              </p>
            </div>
          </button>
        </div>
      )}
      {/* Drawer */}
      <AddPaymentMethodDrawer
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setEditMethod(null); }}
        onSave={handleSave}
        editMethod={editMethod}
      />
    </div>
  );
}
