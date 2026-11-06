import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle2, Upload, X, AlertCircle, Building2 } from 'lucide-react';
import { financeApi } from '../services/finance.api';
import upiQr from '@/assets/payments/upi-qr.jpg';
import usdtQr from '@/assets/payments/usdt-trc20-qr.jpg';

/* Loads the company bank/UPI details (bank account picked server-side from the client's country) */
function usePaymentDetails() {
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    financeApi.getPaymentDetails()
      .then((d) => { if (active) setDetails(d); })
      .catch((err) => { if (active) setError(err.message || 'Failed to load payment details'); });
    return () => { active = false; };
  }, []);

  return { details, error, loading: !details && !error };
}

function InrNotice() {
  return (
    <div
      className="flex items-start gap-2.5 p-3.5 rounded-[10px] text-[12px] text-left w-full"
      style={{ background: 'color-mix(in srgb, var(--brand) 6%, transparent)', color: 'rgba(194,198,214,0.65)' }}
    >
      <AlertCircle size={13} className="shrink-0 mt-0.5" style={{ color: 'var(--brand)' }} strokeWidth={2} />
      <span>
        Pay the <strong style={{ color: 'var(--text)' }}>INR equivalent</strong> of your USD amount. We credit your account in USD at the day's rate after verification.
      </span>
    </div>
  );
}

/* ── Bank instructions ── */
function BankInstructions({ onProofUpload, proofFile, accountId }) {
  const { details: payment, error, loading } = usePaymentDetails();
  const bank = payment?.bank;

  const details = [
    ...(bank?.fields || []),
    ...(accountId ? [{ label: 'Payment Reference (MT5 Account)', value: String(accountId), highlight: true }] : []),
  ];

  const [copied, setCopied] = useState(null);

  const handleCopy = (label, value) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-[12px]" style={{ color: 'rgba(194,198,214,0.5)' }}>
        Loading bank details...
      </div>
    );
  }

  if (error || !bank) {
    return (
      <div
        className="flex items-start gap-2.5 p-3.5 rounded-[10px] text-[12px]"
        style={{ background: 'color-mix(in srgb, var(--negative) 7%, transparent)', color: 'rgba(194,198,214,0.75)' }}
      >
        <AlertCircle size={13} className="shrink-0 mt-0.5" style={{ color: 'var(--negative)' }} strokeWidth={2} />
        <span>Bank details could not be loaded. Please refresh the page or contact support before sending money.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Building2 size={14} style={{ color: 'var(--brand)' }} strokeWidth={1.8} />
        <span className="text-[12px] font-bold" style={{ color: 'var(--text)' }}>{bank.label} bank account</span>
      </div>

      <div
        className="flex items-start gap-2.5 p-3.5 rounded-[10px] text-[12px]"
        style={{ background: 'color-mix(in srgb, var(--warning) 7%, transparent)', color: 'rgba(194,198,214,0.65)' }}
      >
        <AlertCircle size={13} className="shrink-0 mt-0.5" style={{ color: 'var(--warning)' }} strokeWidth={2} />
        <span>
          Transfer exactly the amount you entered. <strong style={{ color: 'var(--text)' }}>Include your payment reference</strong> in the payment note or your deposit may be delayed.
        </span>
      </div>

      {bank.currency === 'INR' && <InrNotice />}

      <div
        className="rounded-[13px] overflow-hidden"
        style={{ background: 'var(--muted-surface)', border: '1px solid var(--border)' }}
      >
        {details.map((d, i) => (
          <div
            key={d.label}
            className="flex items-center justify-between px-4 py-3.5 transition-colors duration-150"
            style={{
              borderBottom: i < details.length - 1 ? '1px solid rgba(66,71,84,0.12)' : 'none',
              background: d.highlight ? 'color-mix(in srgb, var(--brand) 6%, transparent)' : 'transparent',
            }}
          >
            <div>
              <p className="text-[9.5px] font-black uppercase tracking-[0.14em] mb-0.5" style={{ color: 'rgba(194,198,214,0.35)' }}>
                {d.label}
              </p>
              <p
                className="font-mono text-[13.5px] font-bold"
                style={{ color: d.highlight ? 'var(--brand)' : 'var(--text)' }}
              >
                {d.value}
              </p>
            </div>
            <button
              onClick={() => handleCopy(d.label, d.value)}
              className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-[7px] transition-all duration-150 cursor-pointer"
              style={{
                color: copied === d.label ? 'var(--positive)' : 'rgba(194,198,214,0.45)',
                background: copied === d.label ? 'color-mix(in srgb, var(--positive) 8%, transparent)' : 'transparent',
              }}
            >
              {copied === d.label ? <CheckCircle2 size={12} /> : <Copy size={12} />}
              {copied === d.label ? 'Copied' : 'Copy'}
            </button>
          </div>
        ))}
      </div>

      {/* Proof upload */}
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: 'rgba(194,198,214,0.4)' }}>
          Upload Payment Proof <span style={{ color: 'var(--negative, #ef4444)' }}>(Required)</span>
        </p>
        {proofFile ? (
          <div
            className="flex items-center justify-between p-4 rounded-[12px] border-2 border-dashed"
            style={{ borderColor: 'color-mix(in srgb, var(--positive) 30%, transparent)', background: 'color-mix(in srgb, var(--positive) 5%, transparent)' }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <CheckCircle2 size={18} style={{ color: 'var(--positive)' }} />
              <span className="text-[12px] font-medium truncate" style={{ color: 'var(--text)' }}>
                {proofFile.name}
              </span>
            </div>
            <button
              onClick={() => onProofUpload(null)}
              className="shrink-0 p-1.5 rounded-[6px] transition-colors cursor-pointer hover:bg-[rgba(255,255,255,0.05)]"
              style={{ color: 'rgba(194,198,214,0.5)' }}
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <label
            id="deposit-proof-upload"
            className="flex flex-col items-center gap-2 p-5 rounded-[12px] border-2 border-dashed cursor-pointer transition-all duration-200 hover:scale-[1.01]"
            style={{ borderColor: 'rgba(173,198,255,0.15)', background: 'color-mix(in srgb, var(--brand) 3%, transparent)' }}
          >
            <Upload size={22} style={{ color: 'rgba(194,198,214,0.35)' }} strokeWidth={1.5} />
            <span className="text-[12px] font-medium" style={{ color: 'rgba(194,198,214,0.5)' }}>
              Click to upload receipt or screenshot
            </span>
            <span className="text-[10.5px]" style={{ color: 'rgba(194,198,214,0.3)' }}>
              JPG, PNG or PDF — max 5MB
            </span>
            <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => { if (e.target.files[0]) onProofUpload(e.target.files[0]); }} />
          </label>
        )}
      </div>
    </div>
  );
}

/* ── Payment proof upload (screenshot / receipt) ── */
function ProofUpload({ id, onProofUpload, proofFile }) {
  return (
    <div className="flex flex-col gap-2 w-full text-left">
      <p className="text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: 'rgba(194,198,214,0.4)' }}>
        Upload Payment Proof <span style={{ color: 'var(--negative, #ef4444)' }}>(Required)</span>
      </p>
      {proofFile ? (
        <div
          className="flex items-center justify-between p-4 rounded-[12px] border-2 border-dashed"
          style={{ borderColor: 'color-mix(in srgb, var(--positive) 30%, transparent)', background: 'color-mix(in srgb, var(--positive) 5%, transparent)' }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <CheckCircle2 size={18} style={{ color: 'var(--positive)' }} />
            <span className="text-[12px] font-medium truncate" style={{ color: 'var(--text)' }}>
              {proofFile.name}
            </span>
          </div>
          <button
            onClick={() => onProofUpload(null)}
            className="shrink-0 p-1.5 rounded-[6px] transition-colors cursor-pointer hover:bg-[rgba(255,255,255,0.05)]"
            style={{ color: 'rgba(194,198,214,0.5)' }}
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <label
          id={id}
          className="flex flex-col items-center gap-2 p-5 rounded-[12px] border-2 border-dashed cursor-pointer transition-all duration-200 hover:scale-[1.01]"
          style={{ borderColor: 'rgba(173,198,255,0.15)', background: 'color-mix(in srgb, var(--brand) 3%, transparent)' }}
        >
          <Upload size={22} style={{ color: 'rgba(194,198,214,0.35)' }} strokeWidth={1.5} />
          <span className="text-[12px] font-medium" style={{ color: 'rgba(194,198,214,0.5)' }}>
            Click to upload receipt or screenshot
          </span>
          <span className="text-[10.5px]" style={{ color: 'rgba(194,198,214,0.3)' }}>
            JPG, PNG or PDF — max 5MB
          </span>
          <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => { if (e.target.files[0]) onProofUpload(e.target.files[0]); }} />
        </label>
      )}
    </div>
  );
}

/* ── Crypto instructions (USDT) ── */
const USDT_NETWORK = 'Tron (TRC20)';
const USDT_ADDRESS = 'TP8eMW4tQriV3wS9ZRWQuasgLk3V64t89G';

function CryptoInstructions({ onProofUpload, proofFile }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(USDT_ADDRESS).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4 items-center text-center">
      <div className="flex flex-col gap-1.5">
        <p className="text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: 'rgba(194,198,214,0.4)' }}>
          Network
        </p>
        <span
          className="px-3 py-1.5 rounded-[8px] text-[11.5px] font-bold"
          style={{
            background: 'color-mix(in srgb, var(--warning) 12%, transparent)',
            border: '1px solid color-mix(in srgb, var(--warning) 28%, transparent)',
            color: 'var(--warning)',
          }}
        >
          USDT ({USDT_NETWORK})
        </span>
      </div>

      <div className="p-3 rounded-[12px] bg-white">
        <img src={usdtQr} alt={`USDT ${USDT_NETWORK} deposit QR code`} className="w-48 h-48 object-contain" />
      </div>
      <p className="text-[12px]" style={{ color: 'rgba(194,198,214,0.6)' }}>
        Scan this QR code with your wallet app, or copy the address below.
      </p>

      <div
        className="flex items-center justify-between gap-3 w-full px-4 py-3.5 rounded-[13px] text-left"
        style={{ background: 'var(--muted-surface)', border: '1px solid var(--border)' }}
      >
        <div className="min-w-0">
          <p className="text-[9.5px] font-black uppercase tracking-[0.14em] mb-0.5" style={{ color: 'rgba(194,198,214,0.35)' }}>
            USDT Address ({USDT_NETWORK})
          </p>
          <p className="font-mono text-[12.5px] font-bold break-all" style={{ color: 'var(--text)' }}>
            {USDT_ADDRESS}
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="shrink-0 flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-[7px] transition-all duration-150 cursor-pointer"
          style={{
            color: copied ? 'var(--positive)' : 'rgba(194,198,214,0.45)',
            background: copied ? 'color-mix(in srgb, var(--positive) 8%, transparent)' : 'transparent',
          }}
        >
          {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div
        className="flex items-start gap-2 p-3 rounded-[9px] text-[11.5px] text-left w-full"
        style={{ background: 'color-mix(in srgb, var(--warning) 6%, transparent)', color: 'rgba(194,198,214,0.6)' }}
      >
        <AlertCircle size={12} className="shrink-0 mt-0.5" style={{ color: 'var(--warning)' }} strokeWidth={2} />
        <span>
          Send only <strong style={{ color: 'var(--text)' }}>USDT</strong> on the <strong style={{ color: 'var(--text)' }}>{USDT_NETWORK}</strong> network. Wrong network = loss of funds.
        </span>
      </div>

      <ProofUpload id="deposit-proof-upload-crypto" onProofUpload={onProofUpload} proofFile={proofFile} />
    </div>
  );
}

/* ── UPI instructions ── */
function UpiInstructions({ amount, onProofUpload, proofFile }) {
  const { details: payment } = usePaymentDetails();
  // Fallback keeps UPI usable if the details request fails; matches the server config
  const upiId = payment?.upi?.upiId || 'spectronreseach@idfcbank';
  const payeeName = payment?.upi?.payeeName || 'SPECTRON RESEARCH PRIVATE LIMITED';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4 text-center items-center py-2">
      <div>
        <p className="text-[14px] font-semibold mb-1" style={{ color: 'var(--text)' }}>
          Pay with any UPI app
        </p>
        <p className="text-[12.5px] max-w-sm leading-relaxed" style={{ color: 'rgba(194,198,214,0.6)' }}>
          Scan the QR code or pay to the UPI ID below for your deposit of <strong style={{ color: 'var(--text)' }}>${parseFloat(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>.
        </p>
      </div>

      <div className="p-3 rounded-[12px] bg-white">
        <img src={upiQr} alt="UPI payment QR code" className="w-48 h-48 object-contain" />
      </div>

      <div className="w-full text-left">
        <p className="text-[10px] font-black uppercase tracking-[0.14em] mb-1.5" style={{ color: 'rgba(194,198,214,0.4)' }}>
          UPI ID
        </p>
        <div
          className="flex items-center gap-2 p-3 rounded-[10px]"
          style={{ background: 'var(--muted-surface)', border: '1px solid var(--border)' }}
        >
          <span className="font-mono text-[12.5px] font-bold flex-1 min-w-0 truncate" style={{ color: 'var(--text)' }}>
            {upiId}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 shrink-0 text-[11px] font-bold px-2.5 py-1.5 rounded-[7px] transition-all duration-150 cursor-pointer"
            style={{
              background: copied ? 'color-mix(in srgb, var(--positive) 10%, transparent)' : 'color-mix(in srgb, var(--brand) 8%, transparent)',
              color: copied ? 'var(--positive)' : 'var(--brand)',
            }}
          >
            {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <p className="text-[11px] mt-1.5" style={{ color: 'rgba(194,198,214,0.5)' }}>
          Payee: <strong style={{ color: 'var(--text)' }}>{payeeName}</strong>
        </p>
      </div>

      <InrNotice />

      <div
        className="flex items-start gap-2.5 p-3.5 rounded-[10px] text-[11.5px] text-left w-full"
        style={{ background: 'color-mix(in srgb, var(--warning) 7%, transparent)', color: 'rgba(194,198,214,0.65)' }}
      >
        <AlertCircle size={13} className="shrink-0 mt-0.5" style={{ color: 'var(--warning)' }} strokeWidth={2} />
        <span>
          After paying, enter the UPI transaction ID (UTR) and upload a screenshot of the payment below.
        </span>
      </div>

      {/* Proof upload */}
      <div className="flex flex-col gap-2 w-full text-left">
        <p className="text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: 'rgba(194,198,214,0.4)' }}>
          Upload Payment Proof <span style={{ color: 'var(--negative, #ef4444)' }}>(Required)</span>
        </p>
        {proofFile ? (
          <div
            className="flex items-center justify-between p-4 rounded-[12px] border-2 border-dashed"
            style={{ borderColor: 'color-mix(in srgb, var(--positive) 30%, transparent)', background: 'color-mix(in srgb, var(--positive) 5%, transparent)' }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <CheckCircle2 size={18} style={{ color: 'var(--positive)' }} />
              <span className="text-[12px] font-medium truncate" style={{ color: 'var(--text)' }}>
                {proofFile.name}
              </span>
            </div>
            <button
              onClick={() => onProofUpload(null)}
              className="shrink-0 p-1.5 rounded-[6px] transition-colors cursor-pointer hover:bg-[rgba(255,255,255,0.05)]"
              style={{ color: 'rgba(194,198,214,0.5)' }}
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <label
            id="deposit-proof-upload-upi"
            className="flex flex-col items-center gap-2 p-5 rounded-[12px] border-2 border-dashed cursor-pointer transition-all duration-200 hover:scale-[1.01]"
            style={{ borderColor: 'rgba(173,198,255,0.15)', background: 'color-mix(in srgb, var(--brand) 3%, transparent)' }}
          >
            <Upload size={22} style={{ color: 'rgba(194,198,214,0.35)' }} strokeWidth={1.5} />
            <span className="text-[12px] font-medium" style={{ color: 'rgba(194,198,214,0.5)' }}>
              Click to upload receipt or screenshot
            </span>
            <span className="text-[10.5px]" style={{ color: 'rgba(194,198,214,0.3)' }}>
              JPG, PNG or PDF — max 5MB
            </span>
            <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => { if (e.target.files[0]) onProofUpload(e.target.files[0]); }} />
          </label>
        )}
      </div>
    </div>
  );
}

/**
 * DepositInstructions
 * Conditionally renders method-specific instructions.
 */
export function DepositInstructions({ method, amount, accountId, onProofUpload, proofFile }) {
  return (
    <div className="animate-in fade-in duration-300">
      {method === 'bank'   && <BankInstructions amount={amount} accountId={accountId} onProofUpload={onProofUpload} proofFile={proofFile} />}
      {method === 'crypto' && <CryptoInstructions amount={amount} onProofUpload={onProofUpload} proofFile={proofFile} />}
      {method === 'upi'    && <UpiInstructions amount={amount} onProofUpload={onProofUpload} proofFile={proofFile} />}
    </div>
  );
}
