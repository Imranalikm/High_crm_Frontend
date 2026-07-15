/**
 * WithdrawPage.jsx — Smatams Customer Withdrawal Flow
 *
 * Design system: dark premium fintech (Syne + DM Sans + DM Mono)
 * Requires: react-router-dom, lucide-react
 * Centered side-by-side layout matching DepositPage.jsx.
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, Check, AlertTriangle, Building2, CreditCard, Bitcoin, Wallet2, Plus, Smartphone } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { WithdrawAmountForm } from '../components/WithdrawAmountForm';
import { WithdrawConfirmStep } from '../components/WithdrawConfirmStep';
import { usePlatformSettings } from '@/shared/features/settings/PlatformSettingsContext';
import { financeApi } from '../services/finance.api';
import { apiClient } from '@/shared/api/client/apiClient';

const STEPS = [
  { id: 1, label: 'Method' },
  { id: 2, label: 'Amount' },
  { id: 3, label: 'Confirm' },
];



function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-between w-full border-b border-border/10 pb-5 mb-5">
      {STEPS.map((step, i) => {
        const done = step.id < current;
        const active = step.id === current;

        const dotBg = done ? 'var(--positive)' : active ? 'var(--brand)' : 'var(--surface-2)';
        const dotClr = done || active ? 'var(--text-on-accent)' : 'var(--text-muted)';
        const dotBd = done
          ? '2px solid color-mix(in srgb, var(--positive) 25%, transparent)'
          : active
          ? '2.5px solid color-mix(in srgb, var(--brand) 30%, transparent)'
          : '1.5px solid var(--border)';
        const dotShad = active ? '0 0 12px color-mix(in srgb, var(--brand) 25%, transparent)' : 'none';
        const lblClr = active ? 'var(--brand)' : done ? 'var(--positive)' : 'var(--text-muted)';

        return (
          <React.Fragment key={step.id}>
            <div className="flex items-center gap-2 shrink-0">
              <div 
                className="w-7 h-7 rounded-full flex items-center justify-center font-mono text-[11px] font-black transition-all duration-300"
                style={{
                  background: dotBg,
                  color: dotClr,
                  border: dotBd,
                  boxShadow: dotShad,
                }}
              >
                {done ? <Check size={12} strokeWidth={3} /> : step.id}
              </div>
              <span 
                className="text-[10px] font-bold uppercase tracking-[0.08em] hidden sm:inline"
                style={{ color: lblClr }}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div 
                className="flex-1 h-[2px] mx-2 transition-all duration-300"
                style={{
                  background: step.id < current
                    ? 'var(--positive)'
                    : 'var(--border)',
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

const SEC_ITEMS = [
  { text: 'Password-secured request' },
  { text: 'Reviewed in 1 business day' },
  { text: 'Email confirmation sent' },
];

function SummarySidebar({ method, destination, amount, availableBalance, step, selectedBankAccount }) {
  const num = parseFloat(amount) || 0;

  const methodNames = {
    bank: 'Bank Transfer',
    upi: 'UPI'
  };

  const rows = [
    { label: 'Method', value: methodNames[method] || method },
    { label: 'Amount', value: num > 0 ? `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—' },
    { label: 'Available', value: `$${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
    { label: 'Bank Account', value: selectedBankAccount ? selectedBankAccount.name : '—' },
    { label: 'Step', value: `${step} of ${STEPS.length}` },
  ];

  return (
    <Card heading="Withdrawal Summary" className="h-full">
      <div className="flex flex-col gap-3">
        {rows.map((r) => (
          <div 
            key={r.label} 
            className="flex justify-between items-center py-2.5 border-b border-border/10 last:border-0"
          >
            <span className="text-[12px] text-text-muted shrink-0">{r.label}</span>
            <span className="font-mono text-[12px] font-bold text-text text-right truncate max-w-[150px]">
              {r.value}
            </span>
          </div>
        ))}

        <div className="pt-4 border-t border-border/10 flex flex-col gap-2">
          {SEC_ITEMS.map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px] text-text-muted/60">
              <span className="text-positive">✓</span>
              <span>{s.text}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ── Bank Account Selector for Withdrawal ── */
function BankAccountSelector({ bankAccounts, selectedId, onSelect }) {
  const typeIcons = {
    bank: Building2,
    card: CreditCard,
    crypto: Bitcoin,
    upi: Smartphone,
  };

  if (bankAccounts.length === 0) {
    return (
      <div
        className="flex flex-col items-center gap-4 py-8 text-center rounded-[12px]"
        style={{ background: 'var(--muted-surface)', border: '1px dashed var(--border)' }}
      >
        <div
          className="w-12 h-12 rounded-[12px] flex items-center justify-center"
          style={{ background: 'color-mix(in srgb, var(--warning) 10%, transparent)' }}
        >
          <AlertTriangle size={22} style={{ color: 'var(--warning)' }} strokeWidth={1.6} />
        </div>
        <div>
          <p className="text-[13px] font-bold" style={{ color: 'var(--text)' }}>
            No Payment Methods Found
          </p>
          <p className="text-[12px] mt-1" style={{ color: 'var(--text-muted)' }}>
            You need to add a bank account before you can make a withdrawal.
          </p>
        </div>
        <Link
          to="/client/finance/payment-methods"
          className="flex items-center gap-2 h-9 px-5 rounded-[9px] font-bold text-[12px] cursor-pointer transition-all duration-200 hover:scale-[1.02] no-underline"
          style={{ background: 'var(--brand)', color: 'var(--text-on-accent)' }}
        >
          <Wallet2 size={14} strokeWidth={2} />
          Add Payment Method
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {bankAccounts.map((acc) => {
        const Icon = typeIcons[acc.type] || Building2;
        const isSelected = selectedId === acc.id;
        const details = acc.details || {};
        const subtitle = acc.type === 'bank'
          ? (details.accountNumber ? `••••${details.accountNumber.slice(-4)}` : details.routing || '')
          : acc.type === 'card'
          ? (details.cardNumber ? `••••${details.cardNumber.slice(-4)}` : '')
          : acc.type === 'upi'
          ? (details.upiId || '')
          : (details.network || details.address?.slice(0, 12) || '');

        return (
          <button
            key={acc.id}
            onClick={() => onSelect(acc.id)}
            className="w-full flex items-center gap-3.5 p-3.5 rounded-[11px] transition-all duration-200 cursor-pointer outline-none text-left hover:scale-[1.005]"
            style={{
              background: isSelected
                ? 'color-mix(in srgb, var(--brand) 8%, transparent)'
                : 'var(--muted-surface)',
              border: `1.5px solid ${isSelected ? 'color-mix(in srgb, var(--brand) 30%, transparent)' : 'transparent'}`,
              boxShadow: isSelected ? '0 0 0 1px color-mix(in srgb, var(--brand) 15%, transparent)' : 'none',
            }}
          >
            <div
              className="w-9 h-9 rounded-[9px] flex items-center justify-center shrink-0"
              style={{
                background: isSelected
                  ? 'color-mix(in srgb, var(--brand) 12%, transparent)'
                  : 'color-mix(in srgb, var(--text-muted) 8%, transparent)',
                color: isSelected ? 'var(--brand)' : 'var(--text-muted)',
              }}
            >
              <Icon size={17} strokeWidth={1.8} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>
                {acc.name}
                {acc.isDefault && (
                  <span className="ml-2 text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-[4px]"
                    style={{ background: 'color-mix(in srgb, var(--positive) 12%, transparent)', color: 'var(--positive)' }}>
                    Default
                  </span>
                )}
              </p>
              {subtitle && (
                <p className="text-[11px] font-mono mt-0.5" style={{ color: 'rgba(194,198,214,0.45)' }}>
                  {subtitle}
                </p>
              )}
            </div>

            <div
              className="w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all duration-200"
              style={{ borderColor: isSelected ? 'var(--brand)' : 'rgba(194,198,214,0.2)' }}
            >
              {isSelected && <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--brand)' }} />}
            </div>
          </button>
        );
      })}

      <Link
        to="/client/finance/payment-methods"
        className="mt-1 w-full flex items-center justify-center gap-2 p-3.5 rounded-[11px] font-bold text-[12.5px] cursor-pointer transition-all duration-200 no-underline hover:scale-[1.005]"
        style={{
          background: 'var(--muted-surface)',
          border: '1px dashed color-mix(in srgb, var(--brand) 30%, var(--border))',
          color: 'var(--text-muted)'
        }}
      >
        <span className="flex items-center justify-center w-6 h-6 rounded-full shrink-0" style={{ background: 'color-mix(in srgb, var(--brand) 12%, transparent)', color: 'var(--brand)' }}>
          <Plus size={14} strokeWidth={2.5} />
        </span>
        Add Another Payment Method
      </Link>
    </div>
  );
}


export function WithdrawPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState('bank');
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState('');
  const [mt5Accounts, setMt5Accounts] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Bank accounts state
  const [bankAccounts, setBankAccounts] = useState([]);
  const [selectedBankAccountId, setSelectedBankAccountId] = useState(null);
  const [bankAccountsLoading, setBankAccountsLoading] = useState(true);

  React.useEffect(() => {
    apiClient.get('/mt5-accounts').then(res => {
      setMt5Accounts(res.data || []);
      if (res.data && res.data.length > 0) {
        setAccountId(res.data[0].accountid);
      }
    }).catch(err => console.error(err));

    // Fetch bank accounts
    financeApi.getBankAccounts().then(accounts => {
      setBankAccounts(accounts || []);
      // Auto-select the default one
      const defaultAcc = (accounts || []).find(a => a.isDefault);
      if (defaultAcc) {
        setSelectedBankAccountId(defaultAcc.id);
        setMethod(defaultAcc.type || 'bank');
      } else if (accounts && accounts.length > 0) {
        setSelectedBankAccountId(accounts[0].id);
        setMethod(accounts[0].type || 'bank');
      }
    }).catch(err => {
      console.error('Failed to load bank accounts:', err);
    }).finally(() => {
      setBankAccountsLoading(false);
    });
  }, []);

  const availableBalance = mt5Accounts.find(a => String(a.accountid) === String(accountId))?.balance || 0;
  const selectedBankAccount = bankAccounts.find(a => a.id === selectedBankAccountId);

  const canProceedStep1 = accountId && selectedBankAccountId;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await financeApi.createWithdrawal({
        accountId,
        amount,
        type: method,
        bankAccount: selectedBankAccountId ? String(selectedBankAccountId) : null,
        note: `Withdrawal via ${method} to ${selectedBankAccount?.name || 'N/A'}`
      });
      navigate('/client/finance/wallets');
    } catch (e) {
      alert("Failed to submit withdrawal request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-up max-w-[1100px] mx-auto w-full">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between mb-5 border-b border-border/10 pb-3.5">
        <div>
          <p className="text-section-eyebrow">Financials</p>
          <h1 className="font-heading font-semibold text-[26px] tracking-[-0.03em] leading-tight text-text mt-0.5">
            Withdraw Funds
          </h1>
        </div>
        <span className="text-[11px] font-bold font-mono text-text-muted bg-surface-elevated border border-border px-2.5 py-1 rounded-[6px]">
          Step {step} of 3
        </span>
      </div>

      {/* ── 2-Column Centered Flex Layout ── */}
      <div className="flex flex-col md:flex-row gap-5 items-start justify-center">

        {/* Center column: Main form card */}
        <div className="flex-1 max-w-[580px] w-full">
          <Card padding={true} className="overflow-hidden">
            {/* Step Timeline Indicator */}
            <StepIndicator current={step} />

            {/* Step 1: Select Method & Bank Account */}
            {step === 1 && (
              <div className="flex flex-col gap-5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-text-muted/40 mb-3">
                    Select MT5 Account
                  </p>
                  <select
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    className="w-full h-12 rounded-[10px] border border-border/20 bg-bg text-[13.5px] px-3 mb-5 outline-none focus:border-brand/40 transition-colors"
                  >
                    {mt5Accounts.map(acc => (
                      <option key={acc.accountid} value={acc.accountid}>
                        {acc.accountid} (Balance: ${parseFloat(acc.balance || 0).toFixed(2)})
                      </option>
                    ))}
                  </select>

                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-text-muted/40 mb-3">
                    Select Withdrawal Method
                  </p>
                  {bankAccountsLoading ? (
                    <div className="flex items-center justify-center py-6">
                      <span className="text-[11px] font-bold text-text-muted animate-pulse">Loading payment methods...</span>
                    </div>
                  ) : (
                    <BankAccountSelector
                      bankAccounts={bankAccounts}
                      selectedId={selectedBankAccountId}
                      onSelect={(id) => {
                        setSelectedBankAccountId(id);
                        const acc = bankAccounts.find(a => a.id === id);
                        if (acc) setMethod(acc.type || 'bank');
                      }}
                    />
                  )}
                </div>

                <button
                  id="withdraw-step1-next-btn"
                  disabled={!canProceedStep1}
                  onClick={() => setStep(2)}
                  className="w-full h-12 rounded-[10px] font-bold text-[13.5px] transition-all duration-150 cursor-pointer bg-brand text-text-on-accent hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ChevronRight size={16} strokeWidth={2.5} />
                  Continue to Amount
                </button>
              </div>
            )}

            {/* Step 2: Enter Amount */}
            {step === 2 && (
              <div className="flex flex-col gap-5">
                <WithdrawAmountForm
                  method={method}
                  amount={amount}
                  onChange={setAmount}
                  availableBalance={availableBalance}
                />
                <button
                  id="withdraw-step2-next-btn"
                  disabled={!amount || parseFloat(amount) < 1}
                  onClick={() => setStep(3)}
                  className="w-full h-12 rounded-[10px] font-bold text-[13.5px] transition-all duration-150 cursor-pointer bg-brand text-text-on-accent hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ChevronRight size={16} strokeWidth={2.5} />
                  Review Withdrawal
                </button>
              </div>
            )}

            {/* Step 3: Review & Confirm */}
            {step === 3 && (
              <div className="flex flex-col gap-5">
                <WithdrawConfirmStep
                  method={method}
                  amount={amount}
                  onSubmit={handleSubmit}
                  isSubmitting={submitting}
                />
              </div>
            )}
          </Card>
        </div>

        {/* Right column: Summary sidebar */}
        <div className="w-full md:w-[280px] shrink-0">
          <SummarySidebar
            method={method}
            amount={amount}
            availableBalance={availableBalance}
            step={step}
            selectedBankAccount={selectedBankAccount}
          />
        </div>
      </div>
    </div>
  );
}

export default WithdrawPage;
