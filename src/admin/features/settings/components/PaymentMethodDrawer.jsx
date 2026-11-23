import React, { useEffect, useMemo, useState } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';
import { MainDrawer, DrawerHeader, DrawerBody, DrawerFooter } from '@/components/common/drawer';
import { getUploadUrl } from '@/shared/utils/uploadUrl';
import { FieldLabel, FGroup, TInput, TSelect, ToggleRow, WarnBanner, Btn } from './SettingsForm';
import { TYPE_NAMES, REGION_OPTIONS, NETWORK_OPTIONS } from '../configs/paymentMethods.config';

const BANK_KEYS = ['accountName', 'bankName', 'accountNumber', 'ifsc', 'iban', 'swift', 'accountType', 'currency', 'bankCountry', 'branch'];

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
  if (!form.label.trim()) return 'Display name is required.';
  if (type === 'bank') {
    if (!d.accountName.trim()) return 'Account name is required.';
    if (!d.bankName.trim()) return 'Bank name is required.';
    if (!d.accountNumber.trim() && !d.iban.trim()) return 'Enter an account number or an IBAN.';
    if (form.region === 'IN' && d.accountNumber.trim() && !d.ifsc.trim()) return 'IFSC code is required for Indian bank accounts.';
  }
  if (type === 'upi' && !/^[\w.-]{2,256}@[a-zA-Z][a-zA-Z0-9.-]{1,63}$/.test(d.upiId.trim())) {
    return 'UPI ID must look like name@bank.';
  }
  if (type === 'usdt') {
    const addr = d.walletAddress.trim();
    if (!addr) return 'Wallet address is required.';
    if (d.network === 'TRC20' && !/^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(addr)) return 'A TRC20 address starts with "T" and is 34 characters long.';
    if (d.network !== 'TRC20' && !/^0x[a-fA-F0-9]{40}$/.test(addr)) return `A ${d.network} address starts with "0x" followed by 40 hex characters.`;
  }
  return '';
}

function QrUpload({ existingUrl, file, removed, onFile, onRemove }) {
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const shown = preview || (!removed && existingUrl ? getUploadUrl(existingUrl) : null);

  return (
    <div>
      <FieldLabel hint="Optional. Clients can scan it on the deposit page. PNG, JPG or WEBP, max 5MB.">QR Code</FieldLabel>
      {shown ? (
        <div className="flex items-center gap-4 rounded-[8px] border border-border/30 bg-bg p-3">
          <div className="rounded-[8px] bg-white p-1.5">
            <img src={shown} alt="QR code preview" className="h-24 w-24 object-contain" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="cursor-pointer text-[11.5px] font-semibold text-brand hover:underline">
              Replace image
              <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => e.target.files[0] && onFile(e.target.files[0])} />
            </label>
            <button type="button" onClick={onRemove} className="flex items-center gap-1.5 text-left text-[11.5px] font-semibold text-negative hover:underline cursor-pointer">
              <Trash2 size={11} /> Remove
            </button>
          </div>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-[8px] border-2 border-dashed border-border/30 bg-bg p-5 transition-colors hover:border-brand/40">
          <ImagePlus size={20} className="text-text-muted/40" />
          <span className="text-[12px] text-text-muted/60">Click to upload a QR image</span>
          <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => e.target.files[0] && onFile(e.target.files[0])} />
        </label>
      )}
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
    <MainDrawer open={open} onClose={onClose} width="max-w-[560px]">
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

  const setField = (key, value) => setForm((p) => ({ ...p, [key]: value }));
  const setDetail = (key, value) => setForm((p) => ({ ...p, details: { ...p.details, [key]: value } }));

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

  const d = form.details;
  const isEdit = Boolean(method);

  return (
    <>
      <DrawerHeader
        eyebrow="Payment Methods"
        title={`${isEdit ? 'Edit' : 'Add'} ${TYPE_NAMES[type] || ''}`}
        subtitle="Clients see these details on the deposit page."
        onClose={onClose}
      />
      <DrawerBody>
        <div className="space-y-5">
          {error && <WarnBanner title="Can't save" message={error} severity="danger" />}

          <div>
            <FieldLabel required hint="Shown to clients when choosing which account to pay into">Display Name</FieldLabel>
            <TInput
              value={form.label}
              onChange={(v) => setField('label', v)}
              placeholder={type === 'bank' ? 'e.g. HDFC Bank (INR)' : type === 'upi' ? 'e.g. Company UPI' : 'e.g. USDT TRC20 Wallet'}
            />
          </div>

          {type === 'bank' && (
            <>
              <div>
                <FieldLabel required>Region</FieldLabel>
                <TSelect value={form.region} onChange={(v) => setField('region', v)} options={REGION_OPTIONS} />
              </div>
              <FGroup cols={2}>
                <div>
                  <FieldLabel required>Account Name</FieldLabel>
                  <TInput value={d.accountName} onChange={(v) => setDetail('accountName', v)} />
                </div>
                <div>
                  <FieldLabel required>Bank Name</FieldLabel>
                  <TInput value={d.bankName} onChange={(v) => setDetail('bankName', v)} />
                </div>
                <div>
                  <FieldLabel required={form.region === 'IN'}>Account Number</FieldLabel>
                  <TInput value={d.accountNumber} onChange={(v) => setDetail('accountNumber', v)} mono />
                </div>
                {form.region === 'IN' ? (
                  <div>
                    <FieldLabel required>IFSC Code</FieldLabel>
                    <TInput value={d.ifsc} onChange={(v) => setDetail('ifsc', v.toUpperCase())} placeholder="ABCD0123456" mono />
                  </div>
                ) : (
                  <div>
                    <FieldLabel hint="Account number or IBAN is required">IBAN</FieldLabel>
                    <TInput value={d.iban} onChange={(v) => setDetail('iban', v.toUpperCase())} mono />
                  </div>
                )}
                {form.region === 'INTL' && (
                  <div>
                    <FieldLabel>SWIFT / BIC</FieldLabel>
                    <TInput value={d.swift} onChange={(v) => setDetail('swift', v.toUpperCase())} mono />
                  </div>
                )}
                <div>
                  <FieldLabel>Account Type</FieldLabel>
                  <TInput value={d.accountType} onChange={(v) => setDetail('accountType', v)} placeholder="e.g. Current Account" />
                </div>
                <div>
                  <FieldLabel>Currency</FieldLabel>
                  <TInput value={d.currency} onChange={(v) => setDetail('currency', v.toUpperCase())} placeholder="INR / USD" mono />
                </div>
                {form.region === 'INTL' && (
                  <div>
                    <FieldLabel>Bank Country</FieldLabel>
                    <TInput value={d.bankCountry} onChange={(v) => setDetail('bankCountry', v)} />
                  </div>
                )}
                <div>
                  <FieldLabel>Branch</FieldLabel>
                  <TInput value={d.branch} onChange={(v) => setDetail('branch', v)} />
                </div>
              </FGroup>
            </>
          )}

          {type === 'upi' && (
            <FGroup cols={2}>
              <div>
                <FieldLabel required>UPI ID</FieldLabel>
                <TInput value={d.upiId} onChange={(v) => setDetail('upiId', v)} placeholder="name@bank" mono />
              </div>
              <div>
                <FieldLabel>Payee Name</FieldLabel>
                <TInput value={d.payeeName} onChange={(v) => setDetail('payeeName', v)} />
              </div>
            </FGroup>
          )}

          {type === 'usdt' && (
            <>
              <div>
                <FieldLabel required>Network</FieldLabel>
                <TSelect value={d.network} onChange={(v) => setDetail('network', v)} options={NETWORK_OPTIONS} />
              </div>
              <div>
                <FieldLabel required>Wallet Address</FieldLabel>
                <TInput value={d.walletAddress} onChange={(v) => setDetail('walletAddress', v.trim())} mono />
              </div>
            </>
          )}

          {type !== 'bank' && (
            <QrUpload
              existingUrl={method?.qrImage}
              file={qrFile}
              removed={qrRemoved}
              onFile={(f) => { setQrFile(f); setQrRemoved(false); }}
              onRemove={() => { setQrFile(null); setQrRemoved(true); }}
            />
          )}

          <div className="rounded-[8px] border border-border/15 bg-bg px-4 py-1">
            <ToggleRow
              label="Show to clients"
              desc="Turn off to hide this account without deleting it"
              val={form.enabled}
              onChange={(v) => setField('enabled', v)}
            />
          </div>
        </div>
      </DrawerBody>
      <DrawerFooter>
        <div className="flex justify-end gap-2">
          <Btn label="Cancel" onClick={onClose} />
          <Btn label={isEdit ? 'Save Changes' : 'Add Account'} variant="primary" onClick={handleSubmit} loading={saving} />
        </div>
      </DrawerFooter>
    </>
  );
}

export default PaymentMethodDrawer;
