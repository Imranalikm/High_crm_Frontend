import React, { useState } from 'react';
import { Copy, CheckCircle2, Upload, X, AlertCircle, QrCode, Building2 } from 'lucide-react';

/* ── Bank instructions ── */
function BankInstructions() {
  const details = [
    { label: 'Bank Name',       value: 'CitiBank N.A.' },
    { label: 'Account Name',    value: 'LiveTrade Finance Ltd.' },
    { label: 'Account Number',  value: '4429 8800 1234 5678' },
    { label: 'Routing / SWIFT', value: 'CITIUS33' },
    { label: 'Reference ID',    value: 'DEP-2026-00483', highlight: true },
  ];

  const [copied, setCopied] = useState(null);

  const handleCopy = (label, value) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex items-start gap-2.5 p-3.5 rounded-[10px] text-[12px]"
        style={{ background: 'color-mix(in srgb, var(--warning) 7%, transparent)', color: 'rgba(194,198,214,0.65)' }}
      >
        <AlertCircle size={13} className="shrink-0 mt-0.5" style={{ color: 'var(--warning)' }} strokeWidth={2} />
        <span>
          Transfer exactly the amount you entered. <strong style={{ color: 'var(--text)' }}>Include your reference ID</strong> in the payment note or your deposit may be delayed.
        </span>
      </div>

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
          Upload Payment Proof (Optional but recommended)
        </p>
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
          <input type="file" accept="image/*,application/pdf" className="hidden" />
        </label>
      </div>
    </div>
  );
}

/* ── Crypto instructions ── */
function CryptoInstructions() {
  const [network, setNetwork] = useState('USDT-TRC20');
  const [copied, setCopied]   = useState(false);

  const addresses = {
    'USDT-TRC20': 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE',
    'USDT-ERC20': '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    'BTC':         '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    'ETH':         '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
  };

  const addr = addresses[network];

  const handleCopy = () => {
    navigator.clipboard.writeText(addr).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Network selector */}
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: 'rgba(194,198,214,0.4)' }}>
          Select Network
        </p>
        <div className="flex flex-wrap gap-2">
          {Object.keys(addresses).map((n) => (
            <button
              key={n}
              id={`crypto-network-${n}`}
              onClick={() => setNetwork(n)}
              className="px-3 py-1.5 rounded-[8px] text-[11.5px] font-bold transition-all duration-150 cursor-pointer"
              style={{
                background: network === n ? 'color-mix(in srgb, var(--warning) 12%, transparent)' : 'var(--muted-surface)',
                border: `1px solid ${network === n ? 'color-mix(in srgb, var(--warning) 28%, transparent)' : 'transparent'}`,
                color: network === n ? 'var(--warning)' : 'rgba(194,198,214,0.5)',
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* QR code placeholder */}
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div
          className="w-28 h-28 rounded-[12px] flex items-center justify-center shrink-0"
          style={{ background: 'var(--muted-surface)', border: '1px solid var(--border)' }}
        >
          <QrCode size={48} style={{ color: 'rgba(194,198,214,0.3)' }} strokeWidth={1.2} />
        </div>

        <div className="flex flex-col gap-3 flex-1 min-w-0">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] mb-1.5" style={{ color: 'rgba(194,198,214,0.4)' }}>
              Wallet Address ({network})
            </p>
            <div
              className="flex items-center gap-2 p-3 rounded-[10px]"
              style={{ background: 'var(--muted-surface)', border: '1px solid var(--border)' }}
            >
              <span className="font-mono text-[11.5px] font-medium flex-1 min-w-0 truncate" style={{ color: 'var(--text)' }}>
                {addr}
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
          </div>

          <div
            className="flex items-start gap-2 p-3 rounded-[9px] text-[11.5px]"
            style={{ background: 'color-mix(in srgb, var(--warning) 6%, transparent)', color: 'rgba(194,198,214,0.6)' }}
          >
            <AlertCircle size={12} className="shrink-0 mt-0.5" style={{ color: 'var(--warning)' }} strokeWidth={2} />
            Send only <strong style={{ color: 'var(--text)' }}>{network.split('-')[0]}</strong> on the <strong style={{ color: 'var(--text)' }}>{network}</strong> network. Wrong network = loss of funds.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Card & Skrill instructions ── */
function CardInstructions({ method }) {
  const isSkrill = method === 'skrill';
  return (
    <div
      className="flex flex-col items-center gap-4 py-4 text-center"
      style={{ color: 'rgba(194,198,214,0.6)' }}
    >
      <div
        className="w-14 h-14 rounded-[14px] flex items-center justify-center"
        style={{ background: 'color-mix(in srgb, var(--brand) 10%, transparent)' }}
      >
        <Building2 size={26} style={{ color: 'var(--brand)' }} strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-[14px] font-semibold mb-1" style={{ color: 'var(--text)' }}>
          {isSkrill ? 'Skrill Secure Transfer' : 'Secure Checkout'}
        </p>
        <p className="text-[12.5px] max-w-xs">
          {isSkrill 
            ? 'You will be redirected to Skrill payment gate to authorize this transfer. Safe and immediate crediting.'
            : 'You will be redirected to our secure payment gateway. Your card details are never stored on our servers.'
          }
        </p>
      </div>
      <div className="flex items-center gap-2 text-[11px]">
        <CheckCircle2 size={13} style={{ color: 'var(--positive)' }} />
        <span>Secure encryption</span>
        <span style={{ color: 'rgba(194,198,214,0.25)' }}>·</span>
        <CheckCircle2 size={13} style={{ color: 'var(--positive)' }} />
        <span>PCI compliant</span>
      </div>
    </div>
  );
}

/**
 * DepositInstructions
 * Conditionally renders method-specific instructions.
 */
export function DepositInstructions({ method, amount }) {
  return (
    <div className="animate-in fade-in duration-300">
      {method === 'bank'   && <BankInstructions amount={amount} />}
      {method === 'crypto' && <CryptoInstructions amount={amount} />}
      {(method === 'card' || method === 'skrill') && <CardInstructions method={method} amount={amount} />}
    </div>
  );
}
