/**
 * DepositPage.jsx — Smatams Customer Deposit Flow
 *
 * Design system: dark premium fintech (Syne + DM Sans + DM Mono)
 * Requires: react-router-dom, lucide-react
 * Responsive grid side-by-side layout centered on the page.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { DepositMethodSelector, DEPOSIT_METHODS } from '../components/DepositMethodSelector';
import { DepositAmountForm } from '../components/DepositAmountForm';
import { DepositInstructions } from '../components/DepositInstructions';
import { usePlatformSettings } from '@/shared/features/settings/PlatformSettingsContext';
import { financeApi } from '../services/finance.api';
import { apiClient } from '@/shared/api/client/apiClient';

const STEPS = [
  { id: 1, label: 'Select Method' },
  { id: 2, label: 'Enter Amount' },
  { id: 3, label: 'Instructions' },
];

const METHOD_NAMES = {
  online: 'USD Payment',
  bank: 'Bank Wire',
  crypto: 'Crypto',
  upi: 'UPI',
};

function parseFeePercent(feeString) {
  if (!feeString) return 0;
  const match = feeString.match(/([\d.]+)%/);
  if (match) {
    return parseFloat(match[1]) / 100;
  }
  return 0;
}

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
  { text: '256-bit SSL encrypted' },
  { text: 'PCI DSS compliant' },
  { text: 'Email confirmation sent' },
];

function SummarySidebar({ method, amount, step }) {
  const { clientSettings } = usePlatformSettings();
  const { gateways } = clientSettings;

  const getGatewayConfig = (methodId) => {
    const gatewayMap = { online: 'stripe', bank: 'swift', crypto: 'fireblocks', upi: 'upi' };
    const gatewayId = gatewayMap[methodId];
    return gateways.find(g => g.id === gatewayId) || { fee: '0%' };
  };

  const g = getGatewayConfig(method);
  const feeRate = parseFeePercent(g.fee);

  const m = DEPOSIT_METHODS.find(x => x.id === method);
  const num = parseFloat(amount) || 0;
  const fee = num * feeRate;
  const net = num - fee;

  const rows = [
    { label: 'Method', value: m ? (METHOD_NAMES[m.id] || m.label) : '—' },
    { label: 'Amount', value: num > 0 ? `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—', accent: true },
    { label: 'Step', value: `${step} of ${STEPS.length}` },
  ];

  return (
    <Card heading="Deposit Summary" className="h-full">
      <div className="flex flex-col gap-3">
        {rows.map((r) => (
          <div 
            key={r.label} 
            className="flex justify-between items-center py-2.5 border-b border-border/10 last:border-0"
          >
            <span className="text-[12px] text-text-muted">{r.label}</span>
            <span 
              className={`font-mono text-[12.5px] font-bold ${r.accent ? 'text-positive' : 'text-text'}`}
            >
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

export function DepositPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState('online');
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState('');
  const [mt5Accounts, setMt5Accounts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [depositProof, setDepositProof] = useState(null);

  React.useEffect(() => {
    apiClient.get('/mt5-accounts').then(res => {
      setMt5Accounts(res.data || []);
      if (res.data && res.data.length > 0) {
        setAccountId(res.data[0].accountid);
      }
    }).catch(err => console.error(err));
  }, []);

  const handleStep1Next = () => setStep(2);
  const handleStep2Next = () => {
    if (!accountId) {
      alert("Please select an MT5 account first.");
      return;
    }
    setStep(3);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('accountId', accountId);
      formData.append('amount', amount);
      formData.append('type', method);
      formData.append('note', `Deposit via ${method}`);
      if (transactionId) formData.append('transactionId', transactionId);
      if (depositProof) formData.append('depositProof', depositProof);

      await financeApi.createDeposit(formData);
      navigate('/client/finance/wallets');
    } catch (err) {
      console.error(err);
      alert('Deposit submission failed: ' + (err.message || 'Unknown error'));
      setIsSubmitting(false);
    }
  };

  const displayMethodName = METHOD_NAMES[method] || method;

  return (
    <div className="animate-fade-up max-w-[900px] mx-auto w-full">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between mb-5 border-b border-border/10 pb-3.5">
        <div>
          <p className="text-section-eyebrow">Financials</p>
          <h1 className="font-heading font-semibold text-[26px] tracking-[-0.03em] leading-tight text-text mt-0.5">
            Deposit Funds
          </h1>
        </div>
        <span className="text-[11px] font-bold font-mono text-text-muted bg-surface-elevated border border-border px-2.5 py-1 rounded-[6px]">
          Step {step} of 3
        </span>
      </div>

      {/* ── Side-by-Side Centered Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-start">
        {/* Main form card */}
        <div className="sm:col-span-2">
          <Card padding={true} className="overflow-hidden">
            {/* Step Timeline Indicator */}
            <StepIndicator current={step} />

            {/* Step 1: Select payment method */}
            {step === 1 && (
              <div className="flex flex-col gap-5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-text-muted/40 mb-3">
                    Select Payment Method
                  </p>
                  <DepositMethodSelector value={method} onChange={setMethod} />
                </div>
                <button
                  id="deposit-step1-next-btn"
                  onClick={handleStep1Next}
                  className="w-full h-12 rounded-[10px] font-bold text-[13.5px] transition-all duration-150 cursor-pointer bg-brand text-text-on-accent hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
                >
                  <ArrowRight size={15} strokeWidth={2.5} />
                  Continue with {displayMethodName}
                </button>
              </div>
            )}

            {/* Step 2: Enter Amount */}
            {step === 2 && (
              <div className="flex flex-col gap-4">
                <DepositAmountForm
                  method={method}
                  amount={amount}
                  onChange={setAmount}
                  accountId={accountId}
                  onAccountChange={setAccountId}
                  mt5Accounts={mt5Accounts}
                  onContinue={handleStep2Next}
                />
              </div>
            )}

            {/* Step 3: Instructions & Confirm */}
            {step === 3 && (
              <div className="flex flex-col gap-5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-text-muted/40 mb-3">
                    Instructions
                  </p>
                  <DepositInstructions method={method} amount={amount} onProofUpload={setDepositProof} proofFile={depositProof} />
                </div>

                {(method === 'bank' || method === 'crypto' || method === 'upi' || method === 'online') && (
                  <div className="flex flex-col gap-4 mt-2">
                    {(method === 'bank' || method === 'upi' || method === 'online') && (
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-text-muted/70 mb-1.5">
                          {method === 'upi' ? 'Stripe Reference / UPI Transaction ID (UTR) (Optional)' 
                            : method === 'online' ? 'Stripe Reference / Transaction ID (Optional)'
                            : 'Bank Wire Transaction ID (Optional)'}
                        </label>
                        <input
                          type="text"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          placeholder={method === 'online' ? "e.g. pi_3M1..." : "e.g. TRN-9381..."}
                          className="w-full h-10 rounded-[8px] border border-border/20 bg-bg text-[13px] px-3 outline-none focus:border-brand/40 transition-colors"
                        />
                      </div>
                    )}
                  </div>
                )}

                {(method === 'bank' || method === 'crypto' || method === 'upi' || method === 'online') && (
                  <button
                    id="deposit-confirm-sent-btn"
                    onClick={handleConfirm}
                    disabled={isSubmitting || ((method === 'bank' || method === 'upi' || method === 'online') && !depositProof)}
                    className="w-full h-12 rounded-[10px] font-bold text-[13px] transition-all duration-150 cursor-pointer border border-border bg-surface-elevated text-text hover:bg-muted-surface active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  >
                    <Check size={14} strokeWidth={2.5} />
                    {isSubmitting ? 'Processing...' : "I've Sent the Payment — Submit for Review"}
                  </button>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Summary sidebar */}
        <div className="sm:col-span-1">
          <SummarySidebar method={method} amount={amount} step={step} />
        </div>
      </div>
    </div>
  );
}

export default DepositPage;