import React, { useEffect, useMemo, useState } from 'react';
import { ImagePlus, Trash2, RefreshCw } from 'lucide-react';
import { MainDrawer, DrawerHeader, DrawerBody, DrawerFooter } from '@/components/common/drawer';
import { getUploadUrl } from '@/shared/utils/uploadUrl';
import { TInput, Toggle, WarnBanner, Btn } from './SettingsForm';
import { PaymentAccountCard } from './PaymentAccountCard';
import { TYPE_META, REGION_OPTIONS, NETWORK_OPTIONS, tint } from '../configs/paymentMethods.config';

const BANK_KEYS = ['accountName', 'bankName', 'accountNumber', 'ifsc', 'iban', 'swift', 'accountType', 'currency', 'bankCountry', 'branch'];
const QR_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

function emptyForm(type, region) {
  return {
    label: '',
    region: region || 'IN',
    enabled: true,
    details: type === 'usdt'
      ? { network: 'TRC20', walletAddress: '' }
      : type === 'upi'
        ? { upiId: '', payeeName: '' }
        : { ...Object.fromEntries(BANK_KEYS.map((k) => [k, ''])), currency: region === 'INTL' ? 'USD' : 'INR' },
  };
}

function fromMethod(method) {
  return {
    label: method.label || '',
    region: method.region || 'IN',
    enabled: Boolean(method.enabled),
    details: { ...emptyForm(method.type, method.region).details, ...(method.details || {}) },
  };
}

// Mirrors the server rules so most mistakes are caught before submitting
function validate(type, form) {
  const d = form.details;
  if (!form.label.trim()) return 'Give the account a display name.';
  if (type === 'bank') {
    if (!d.accountName.trim()) return 'Enter the account holder name.';
    if (!d.bankName.trim()) return 'Enter the bank name.';
    if (!d.accountNumber.trim() && !d.iban.trim()) return 'Enter an account number or an IBAN.';
    if (form.region === 'IN' && d.accountNumber.trim() && !d.ifsc.trim()) return 'Indian bank accounts need an IFSC code.';
  }
  if (type === 'upi' && !/^[\w.-]{2,256}@[a-zA-Z][a-zA-Z0-9.-]{1,63}$/.test(d.upiId.trim())) {
    return 'Enter a UPI ID like name@bank.';
  }
  if (type === 'usdt') {
    const addr = d.walletAddress.trim();
    if (!addr) return 'Enter the wallet address.';
    if (d.network === 'TRC20' && !/^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(addr)) return 'A TRC20 address starts with "T" and is 34 characters long.';
    if (d.network !== 'TRC20' && !/^0x[a-fA-F0-9]{40}$/.test(addr)) return `A ${d.network} address starts with "0x" followed by 40 characters.`;
  }
  return '';
}

/* ── Small building blocks ── */
function Label({ children, required, hint, htmlFor }) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-2">
      <label htmlFor={htmlFor} className="text-[12.5px] font-medium text-text/90 font-heading">
        {children}
        {required && <span className="ml-0.5 text-negative" aria-hidden>*</span>}
      </label>
      {hint && <span className="truncate text-[11px] text-text-muted/50 font-heading">{hint}</span>}
    </div>
  );
}

function Group({ title, children }) {
  return (
    <fieldset className="space-y-4">
      <legend className="mb-3 text-[13px] font-semibold text-text font-heading">{title}</legend>
      {children}
    </fieldset>
  );
}

function Segmented({ value, onChange, options, color, label }) {
  return (
    <div role="radiogroup" aria-label={label} className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className="cursor-pointer rounded-[9px] border px-3 py-2.5 text-left transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand/60"
            style={{
              borderColor: active ? tint(color, 50) : 'color-mix(in srgb, var(--border) 60%, transparent)',
              background: active ? tint(color, 9) : 'transparent',
            }}
          >
            <span className={`block text-[13px] font-semibold font-heading ${active ? 'text-text' : 'text-text-muted'}`}>{o.label}</span>
            {o.hint && <span className="block text-[11px] text-text-muted/55 font-heading">{o.hint}</span>}
          </button>
        );
      })}
    </div>
  );
}

function QrDropzone({ previewUrl, onFile, onRemove, color }) {
  const [over, setOver] = useState(false);
  const [problem, setProblem] = useState('');

  const accept = (file) => {
    if (!file) return;
    if (!QR_TYPES.includes(file.type)) {
      setProblem('Use a PNG, JPG or WEBP image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setProblem('The image must be 5MB or smaller.');
      return;
    }
    setProblem('');
    onFile(file);
  };

  const input = (
    <input
      type="file"
      accept={QR_TYPES.join(',')}
      className="sr-only"
      onChange={(e) => { accept(e.target.files[0]); e.target.value = ''; }}
    />
  );

  return (
    <div>
      <Label hint="Optional">QR code</Label>
      {previewUrl ? (
        <div
          className="flex items-center gap-4 rounded-[10px] border p-3"
          style={{ borderColor: 'color-mix(in srgb, var(--border) 60%, transparent)' }}
        >
          <div className="rounded-[8px] bg-white p-1.5">
            <img src={previewUrl} alt="QR code preview" className="h-[88px] w-[88px] object-contain" />
          </div>
          <div className="flex flex-col items-start gap-1">
            <label className="flex cursor-pointer items-center gap-1.5 rounded-[6px] px-2 py-1.5 text-[12px] font-medium text-text-muted hover:bg-muted-surface hover:text-text focus-within:outline focus-within:outline-1 focus-within:outline-brand/60 font-heading">
              <RefreshCw size={12} /> Replace
              {input}
            </label>
            <button
              type="button"
              onClick={onRemove}
              className="flex cursor-pointer items-center gap-1.5 rounded-[6px] px-2 py-1.5 text-[12px] font-medium text-text-muted hover:bg-negative/10 hover:text-negative focus-visible:outline focus-visible:outline-1 focus-visible:outline-negative/60 font-heading"
            >
              <Trash2 size={12} /> Remove
            </button>
          </div>
        </div>
      ) : (
        <label
          onDragOver={(e) => { e.preventDefault(); setOver(true); }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => { e.preventDefault(); setOver(false); accept(e.dataTransfer.files[0]); }}
          className="flex cursor-pointer flex-col items-center gap-2 rounded-[10px] border border-dashed px-4 py-6 text-center transition-colors focus-within:outline focus-within:outline-1 focus-within:outline-brand/60"
          style={{
            borderColor: over ? color : 'color-mix(in srgb, var(--border) 80%, transparent)',
            background: over ? tint(color, 7) : 'transparent',
          }}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: tint(color, 12), color }}>
            <ImagePlus size={16} />
          </span>
          <span className="text-[12.5px] font-medium text-text font-heading">Drop a QR image here, or click to choose</span>
          <span className="text-[11px] text-text-muted/55 font-heading">PNG, JPG or WEBP, up to 5MB. Clients can scan it on the deposit page.</span>
          {input}
        </label>
      )}
      {problem && <p className="mt-1.5 text-[11.5px] text-negative font-heading">{problem}</p>}
    </div>
  );
}

/**
 * Add / edit one company payment account.
 * `type` is fixed per drawer; `region` pre-selects India/International for new bank accounts.
 * `session` changes every time the drawer opens, so the form starts fresh each time.
 */
export function PaymentMethodDrawer({ open, session, onClose, type, region, method, onSubmit }) {
  return (
    <MainDrawer open={open} onClose={onClose} width="max-w-[600px]">
      <PaymentMethodForm key={session} onClose={onClose} type={type} region={region} method={method} onSubmit={onSubmit} />
    </MainDrawer>
  );
}

function PaymentMethodForm({ onClose, type, region, method, onSubmit }) {
  const [form, setForm] = useState(() => (method ? fromMethod(method) : emptyForm(type, region)));
  const [qrFile, setQrFile] = useState(null);
  const [qrRemoved, setQrRemoved] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const meta = TYPE_META[type];
  const isEdit = Boolean(method);
  const d = form.details;

  const filePreview = useMemo(() => (qrFile ? URL.createObjectURL(qrFile) : null), [qrFile]);
  useEffect(() => () => { if (filePreview) URL.revokeObjectURL(filePreview); }, [filePreview]);
  const qrUrl = filePreview || (!qrRemoved && method?.qrImage ? getUploadUrl(method.qrImage) : null);

  const setField = (key, value) => setForm((p) => ({ ...p, [key]: value }));
  const setDetail = (key, value) => setForm((p) => ({ ...p, details: { ...p.details, [key]: value } }));

  // Switching a new bank account's region also switches its default currency
  const setRegion = (value) => {
    setForm((p) => {
      const currency = p.details.currency;
      const swap = !isEdit && (currency === 'INR' || currency === 'USD' || !currency);
      return { ...p, region: value, details: { ...p.details, currency: swap ? (value === 'IN' ? 'INR' : 'USD') : currency } };
    });
  };

  const handleSubmit = async () => {
    const problem = validate(type, form);
    if (problem) {
      setError(problem);
      return;
    }
    setError('');
    setSaving(true);

    // Drop fields the chosen bank region doesn't show (e.g. IFSC typed before switching to International)
    const details = { ...form.details };
    if (type === 'bank') {
      const hidden = form.region === 'IN' ? ['iban', 'swift', 'bankCountry'] : ['ifsc'];
      hidden.forEach((key) => { details[key] = ''; });
    }

    try {
      await onSubmit({
        type,
        region: type === 'bank' ? form.region : undefined,
        label: form.label.trim(),
        enabled: form.enabled,
        details,
        qrFile: type === 'bank' ? null : qrFile,
        removeQr: type !== 'bank' && qrRemoved && !qrFile,
      });
    } catch (err) {
      setError(err.message || 'Failed to save payment method.');
      setSaving(false);
    }
  };

  const previewMethod = { type, region: form.region, label: form.label, enabled: form.enabled, details: d };
  const nameHint = type === 'bank' ? 'e.g. HDFC Bank (INR)' : type === 'upi' ? 'e.g. Company UPI' : 'e.g. USDT TRC20 wallet';

  return (
    <>
      <DrawerHeader
        title={isEdit ? `Edit ${meta.noun}` : `Add ${meta.noun}`}
        subtitle={isEdit ? method.label : 'Clients see these details when they choose this account on the deposit page.'}
        onClose={onClose}
      />
      <DrawerBody>
        <div className="space-y-7">
          {/* Live preview */}
          <div>
            <p className="mb-2 text-[12px] text-text-muted/60 font-heading">How it looks in your list</p>
            <PaymentAccountCard method={previewMethod} qrUrl={qrUrl} preview />
          </div>

          {error && <WarnBanner title="Check this before saving" message={error} severity="danger" />}

          <div>
            <Label required hint="Clients see this when choosing an account">Display name</Label>
            <TInput value={form.label} onChange={(v) => setField('label', v)} placeholder={nameHint} />
          </div>

          {type === 'bank' && (
            <>
              <div>
                <Label required>Who sees this account</Label>
                <Segmented value={form.region} onChange={setRegion} options={REGION_OPTIONS} color={meta.color} label="Region" />
              </div>

              <Group title="Account holder">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label required>Account name</Label>
                    <TInput value={d.accountName} onChange={(v) => setDetail('accountName', v)} />
                  </div>
                  <div>
                    <Label required>Bank name</Label>
                    <TInput value={d.bankName} onChange={(v) => setDetail('bankName', v)} />
                  </div>
                </div>
              </Group>

              <Group title="Account details">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label required={form.region === 'IN'} hint={form.region === 'INTL' ? 'Or use IBAN' : undefined}>Account number</Label>
                    <TInput value={d.accountNumber} onChange={(v) => setDetail('accountNumber', v.replace(/\s+/g, ''))} mono />
                  </div>
                  {form.region === 'IN' ? (
                    <div>
                      <Label required>IFSC code</Label>
                      <TInput value={d.ifsc} onChange={(v) => setDetail('ifsc', v.toUpperCase().trim())} placeholder="ABCD0123456" mono />
                    </div>
                  ) : (
                    <div>
                      <Label hint="Or use account number">IBAN</Label>
                      <TInput value={d.iban} onChange={(v) => setDetail('iban', v.toUpperCase())} mono />
                    </div>
                  )}
                  {form.region === 'INTL' && (
                    <div>
                      <Label>SWIFT / BIC</Label>
                      <TInput value={d.swift} onChange={(v) => setDetail('swift', v.toUpperCase().trim())} mono />
                    </div>
                  )}
                  <div>
                    <Label>Currency</Label>
                    <TInput value={d.currency} onChange={(v) => setDetail('currency', v.toUpperCase().trim())} placeholder="INR" mono />
                  </div>
                  <div>
                    <Label>Account type</Label>
                    <TInput value={d.accountType} onChange={(v) => setDetail('accountType', v)} placeholder="e.g. Current account" />
                  </div>
                  {form.region === 'INTL' && (
                    <div>
                      <Label>Bank country</Label>
                      <TInput value={d.bankCountry} onChange={(v) => setDetail('bankCountry', v)} />
                    </div>
                  )}
                  <div className={form.region === 'INTL' ? 'sm:col-span-2' : ''}>
                    <Label>Branch</Label>
                    <TInput value={d.branch} onChange={(v) => setDetail('branch', v)} />
                  </div>
                </div>
              </Group>
            </>
          )}

          {type === 'upi' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label required>UPI ID</Label>
                <TInput value={d.upiId} onChange={(v) => setDetail('upiId', v.trim())} placeholder="name@bank" mono />
              </div>
              <div>
                <Label hint="Shown under the UPI ID">Payee name</Label>
                <TInput value={d.payeeName} onChange={(v) => setDetail('payeeName', v)} />
              </div>
            </div>
          )}

          {type === 'usdt' && (
            <>
              <div>
                <Label required hint="Clients must send on this network">Network</Label>
                <Segmented value={d.network} onChange={(v) => setDetail('network', v)} options={NETWORK_OPTIONS} color={meta.color} label="Network" />
              </div>
              <div>
                <Label required>Wallet address</Label>
                <TInput
                  value={d.walletAddress}
                  onChange={(v) => setDetail('walletAddress', v.trim())}
                  placeholder={d.network === 'TRC20' ? 'T…' : '0x…'}
                  mono
                />
              </div>
            </>
          )}

          {type !== 'bank' && (
            <QrDropzone
              previewUrl={qrUrl}
              color={meta.color}
              onFile={(f) => { setQrFile(f); setQrRemoved(false); }}
              onRemove={() => { setQrFile(null); setQrRemoved(true); }}
            />
          )}

          <div
            className="flex items-center gap-3 rounded-[10px] border px-4 py-3"
            style={{ borderColor: 'color-mix(in srgb, var(--border) 60%, transparent)' }}
          >
            <Toggle val={form.enabled} onChange={(v) => setField('enabled', v)} />
            <div>
              <p className="text-[13px] font-semibold text-text font-heading">Show to clients</p>
              <p className="text-[11.5px] text-text-muted/60 font-heading">Switch off to hide this account without deleting it.</p>
            </div>
          </div>
        </div>
      </DrawerBody>
      <DrawerFooter>
        <div className="flex justify-end gap-2">
          <Btn label="Cancel" onClick={onClose} />
          <Btn label={isEdit ? 'Save changes' : `Add ${meta.noun}`} variant="primary" onClick={handleSubmit} loading={saving} />
        </div>
      </DrawerFooter>
    </>
  );
}

export default PaymentMethodDrawer;
