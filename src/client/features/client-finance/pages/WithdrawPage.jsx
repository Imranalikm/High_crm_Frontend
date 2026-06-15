/**
 * WithdrawPage.jsx — Live-Trader Customer Withdrawal Flow
 *
 * Design system: dark premium fintech (Syne + DM Sans + DM Mono)
 * Requires: react-router-dom, lucide-react
 * Centered side-by-side layout matching DepositPage.jsx.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { WithdrawMethodSelector } from '../components/WithdrawMethodSelector';
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

function SummarySidebar({ method, destination, amount, availableBalance, step }) {
  const num = parseFloat(amount) || 0;

  const methodNames = {
    bank: 'Bank Transfer',
    cash: 'Cash',
    upi: 'UPI'
  };

  const rows = [
    { label: 'Method', value: methodNames[method] || method },
    { label: 'Amount', value: num > 0 ? `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—' },
    { label: 'Available', value: `$${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
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



export function WithdrawPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState('bank');
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState('');
  const [mt5Accounts, setMt5Accounts] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    apiClient.get('/mt5-accounts').then(res => {
      setMt5Accounts(res.data || []);
      if (res.data && res.data.length > 0) {
        setAccountId(res.data[0].accountid);
      }
    }).catch(err => console.error(err));
  }, []);

  const availableBalance = mt5Accounts.find(a => String(a.accountid) === String(accountId))?.balance || 0;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await financeApi.createWithdrawal({
        accountId,
        amount,
        type: method,
        bankAccount: null,
        note: `Withdrawal via ${method}`
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

            {/* Step 1: Select Method & Destination */}
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
                  <WithdrawMethodSelector
                    value={method}
                    onChange={(m) => {
                      setMethod(m);
                    }}
                  />
                </div>

                <button
                  id="withdraw-step1-next-btn"
                  disabled={!accountId}
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
          />
        </div>
      </div>
    </div>
  );
}

export default WithdrawPage;
