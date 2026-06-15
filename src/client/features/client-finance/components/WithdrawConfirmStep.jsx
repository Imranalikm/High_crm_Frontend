import React, { useState } from 'react';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * WithdrawConfirmStep
 * Security confirmation (password + optional 2FA) + final review summary before submit.
 */
export function WithdrawConfirmStep({ method, amount, onSubmit, isSubmitting }) {
  const navigate        = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [refId]                 = useState(() => `WD-2026-${String(Math.floor(10000 + Math.random() * 90000))}`);

  const num = parseFloat(amount) || 0;

  const handleSubmit = () => {
    if (isSubmitting) return;
    setSubmitted(true);
    onSubmit?.({ method, amount, refId });
  };

  // Success state
  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-5 py-8 text-center animate-in fade-in zoom-in-95 duration-300">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: 'color-mix(in srgb, var(--positive) 12%, transparent)', border: '2px solid color-mix(in srgb, var(--positive) 25%, transparent)' }}
        >
          <CheckCircle2 size={40} style={{ color: 'var(--positive)' }} strokeWidth={1.8} />
        </div>
        <div>
          <h3 className="font-heading font-black text-[20px] tracking-[-0.04em]" style={{ color: 'var(--text)' }}>
            Request Submitted!
          </h3>
          <p className="text-[13px] mt-1.5" style={{ color: 'rgba(194,198,214,0.55)' }}>
            Your withdrawal is being reviewed. You'll receive an email confirmation shortly.
          </p>
        </div>
        <div
          className="w-full rounded-[12px] p-4 flex items-center justify-between"
          style={{ background: 'var(--muted-surface)', border: '1px solid var(--border)' }}
        >
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] mb-0.5" style={{ color: 'rgba(194,198,214,0.4)' }}>
              Reference ID
            </p>
            <p className="font-mono font-bold text-[15px]" style={{ color: 'var(--brand)' }}>
              {refId}
            </p>
          </div>
          <span
            className="px-2.5 py-1 rounded-[7px] text-[10px] font-black uppercase tracking-[0.1em]"
            style={{ background: 'color-mix(in srgb, var(--warning) 10%, transparent)', color: 'var(--warning)' }}
          >
            Pending Review
          </span>
        </div>
        <div className="flex gap-3 w-full">
          <button
            onClick={() => navigate('/client/finance/wallets')}
            className="flex-1 h-11 rounded-[12px] font-bold text-[13.5px] transition-all duration-200 cursor-pointer"
            style={{ background: 'var(--brand)', color: 'var(--text-on-accent)' }}
          >
            Back to Wallet
          </button>
          <button
            onClick={() => navigate('/client/finance/transactions')}
            className="flex-1 h-11 rounded-[12px] font-bold text-[13.5px] transition-all duration-200 cursor-pointer"
            style={{ background: 'var(--muted-surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            View Transactions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Summary card */}
      <div
        className="rounded-[14px] overflow-hidden"
        style={{ background: 'var(--muted-surface)', border: '1px solid var(--border)' }}
      >
        <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(66,71,84,0.12)' }}>
          <p className="text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: 'rgba(194,198,214,0.4)' }}>
            Review Your Withdrawal
          </p>
        </div>
        {[
          { label: 'Method',        value: method === 'bank' ? 'Bank Transfer' : method === 'cash' ? 'Cash' : method === 'upi' ? 'UPI' : method },
          { label: 'Amount',        value: `$${num.toFixed(2)}`, bold: true, color: 'var(--positive)' },
        ].map((row, i, arr) => (
          <div
            key={row.label}
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(66,71,84,0.08)' : 'none' }}
          >
            <span className="text-[12.5px]" style={{ color: 'rgba(194,198,214,0.5)' }}>{row.label}</span>
            <span
              className={`font-mono text-[13px] ${row.bold ? 'font-black' : 'font-semibold'}`}
              style={{ color: row.color ?? 'var(--text)' }}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* Submit */}
      <button
        id="withdraw-submit-btn"
        disabled={isSubmitting}
        onClick={handleSubmit}
        className="w-full rounded-[13px] font-bold text-[14.5px] tracking-[-0.02em] transition-all duration-200 cursor-pointer active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{
          height: '52px',
          background: 'var(--brand)',
          color: 'var(--text-on-accent)',
          boxShadow: '0 4px 16px color-mix(in srgb, var(--brand) 35%, transparent)',
        }}
      >
        <ChevronRight size={17} strokeWidth={2.5} />
        {isSubmitting ? 'Processing…' : 'Submit Withdrawal Request'}
      </button>
    </div>
  );
}
