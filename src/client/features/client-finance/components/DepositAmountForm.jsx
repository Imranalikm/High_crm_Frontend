import React from 'react';
import { Info, ChevronRight } from 'lucide-react';
import { usePlatformSettings } from '@/shared/features/settings/PlatformSettingsContext';

const QUICK_AMOUNTS = ['100', '500', '1000', '5000'];

function parseFeePercent(feeString) {
  if (!feeString) return 0;
  const match = feeString.match(/([\d.]+)%/);
  if (match) {
    return parseFloat(match[1]) / 100;
  }
  return 0;
}

/**
 * DepositAmountForm
 * Amount input + quick-pick chips + live fee preview + submit button.
 */
export function DepositAmountForm({ method, amount, onChange, accountId, onAccountChange, mt5Accounts, onContinue }) {
  const { clientSettings } = usePlatformSettings();
  const { gateways } = clientSettings;

  const getGatewayConfig = (methodId) => {
    const gatewayMap = { card: 'stripe', bank: 'swift', crypto: 'fireblocks', skrill: 'skrill' };
    const gatewayId = gatewayMap[methodId];
    return gateways.find(g => g.id === gatewayId) || { fee: '0%' };
  };

  const g = getGatewayConfig(method);
  const feeRate = parseFeePercent(g.fee);
  
  const minAmounts = { card: 10, bank: 50, crypto: 20, skrill: 10 };
  const minAmount = minAmounts[method] ?? 10;

  const num       = parseFloat(amount) || 0;
  const fee       = num * feeRate;
  const netCredit = num - fee;
  const isValid   = num >= minAmount;

  const methodLabels = { card: 'Checkout', bank: 'Bank Details', crypto: 'Generate Address', skrill: 'Skrill Login' };

  return (
    <div className="flex flex-col gap-5">
      {/* MT5 Account selection */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: 'rgba(194,198,214,0.4)' }}>
          Select MT5 Account
        </label>
        <div className="relative">
          <select
            value={accountId}
            onChange={(e) => onAccountChange(e.target.value)}
            className="w-full h-14 pl-4 pr-10 rounded-[13px] font-mono font-semibold text-[15px] outline-none transition-all duration-200 appearance-none"
            style={{
              background: 'var(--muted-surface)',
              border: '1.5px solid rgba(173,198,255,0.09)',
              color: 'var(--text)',
            }}
          >
            <option value="" disabled>Select an account</option>
            {mt5Accounts.map((acc) => (
              <option key={acc.accountid} value={acc.accountid}>
                {acc.accountid} ({acc.groupName || acc.server})
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
             <ChevronRight size={14} className="rotate-90 text-text-muted/50" />
          </div>
        </div>
      </div>

      {/* Amount input */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: 'rgba(194,198,214,0.4)' }}>
          Deposit Amount (USD)
        </label>
        <div className="relative">
          <span
            className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-bold text-[22px]"
            style={{ color: 'rgba(194,198,214,0.35)' }}
          >
            $
          </span>
          <input
            id="deposit-amount-input"
            type="number"
            value={amount}
            onChange={(e) => onChange(e.target.value)}
            placeholder="0.00"
            min={minAmount}
            className="w-full h-16 pl-10 pr-5 rounded-[13px] font-mono font-black text-[24px] tracking-[-0.03em] outline-none transition-all duration-200"
            style={{
              background: 'var(--muted-surface)',
              border: `1.5px solid ${amount && !isValid ? 'color-mix(in srgb, var(--negative) 45%, transparent)' : 'rgba(173,198,255,0.09)'}`,
              color: 'var(--text)',
              caretColor: 'var(--brand)',
            }}
          />
        </div>

        {/* Validation message */}
        {amount && !isValid && (
          <p className="text-[11.5px] font-medium flex items-center gap-1.5" style={{ color: 'var(--negative)' }}>
            <Info size={12} strokeWidth={2} />
            Minimum deposit is ${minAmount}
          </p>
        )}
      </div>

      {/* Quick picks */}
      <div className="flex flex-wrap gap-2">
        {QUICK_AMOUNTS.map((v) => (
          <button
            key={v}
            id={`deposit-quick-${v}`}
            onClick={() => onChange(v)}
            className="px-3.5 py-2 rounded-[9px] text-[12.5px] font-bold transition-all duration-150 cursor-pointer hover:scale-[1.03] active:scale-95"
            style={{
              background: amount === v
                ? 'color-mix(in srgb, var(--brand) 12%, transparent)'
                : 'var(--muted-surface)',
              border: `1px solid ${amount === v
                ? 'color-mix(in srgb, var(--brand) 30%, transparent)'
                : 'transparent'}`,
              color: amount === v ? 'var(--brand)' : 'rgba(194,198,214,0.55)',
            }}
          >
            ${v}
          </button>
        ))}
      </div>

      {/* Fee preview */}
      {num > 0 && (
        <div
          className="rounded-[12px] p-4 flex flex-col gap-2 animate-in fade-in duration-200"
          style={{ background: 'color-mix(in srgb, var(--brand) 5%, transparent)', border: '1px solid color-mix(in srgb, var(--brand) 12%, transparent)' }}
        >
          <p className="text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: 'rgba(194,198,214,0.4)' }}>
            Fee Breakdown
          </p>
          {[
            { label: 'You Pay',    value: `$${num.toFixed(2)}`,        color: 'var(--text)' },
            { label: `Processing Fee (${(feeRate * 100).toFixed(1)}%)`, value: fee > 0 ? `-$${fee.toFixed(2)}` : 'Free', color: fee > 0 ? 'var(--negative)' : 'var(--positive)' },
            { label: 'Net Credit', value: `$${netCredit.toFixed(2)}`,  color: 'var(--positive)', bold: true },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between">
              <span className="text-[12px]" style={{ color: 'rgba(194,198,214,0.55)' }}>{row.label}</span>
              <span
                className={`font-mono text-[13px] ${row.bold ? 'font-black' : 'font-semibold'}`}
                style={{ color: row.color }}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Info note */}
      <div
        className="flex items-start gap-2.5 p-3.5 rounded-[10px] text-[12px]"
        style={{ background: 'color-mix(in srgb, var(--brand) 5%, transparent)', color: 'rgba(194,198,214,0.6)' }}
      >
        <Info size={13} className="shrink-0 mt-0.5" style={{ color: 'var(--brand)' }} strokeWidth={2} />
        <span>
          Minimum deposit for this method is <strong style={{ color: 'var(--text)' }}>${minAmount}</strong>. Funds typically appear within minutes for card and crypto payments.
        </span>
      </div>

      {/* Continue button */}
      <button
        id="deposit-continue-btn"
        disabled={!isValid}
        onClick={onContinue}
        className="w-full h-13 rounded-[13px] font-bold text-[14.5px] tracking-[-0.02em] transition-all duration-200 cursor-pointer active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{
          background: 'var(--brand)',
          color: 'var(--text-on-accent)',
          boxShadow: isValid ? '0 4px 16px color-mix(in srgb, var(--brand) 35%, transparent)' : 'none',
          height: '52px',
        }}
      >
        <ChevronRight size={17} strokeWidth={2.5} />
        Continue to {methodLabels[method] ?? 'Next Step'}
      </button>
    </div>
  );
}
