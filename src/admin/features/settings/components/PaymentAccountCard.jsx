import React from 'react';
import { Pencil, Trash2, QrCode, EyeOff } from 'lucide-react';
import { Toggle } from './SettingsForm';
import { TYPE_META, NETWORK_NAMES, tint } from '../configs/paymentMethods.config';

const lastFour = (v) => (v && v.length > 4 ? `•••• ${v.slice(-4)}` : v || '');
const shortAddress = (v) => (v && v.length > 18 ? `${v.slice(0, 8)}…${v.slice(-6)}` : v || '');

// The one identifying value of an account, shown large on the card
function primaryValue(method, reveal) {
  const d = method.details || {};
  if (method.type === 'bank') {
    if (d.accountNumber) return { label: 'Account number', value: reveal ? d.accountNumber : lastFour(d.accountNumber) };
    if (d.iban) return { label: 'IBAN', value: reveal ? d.iban : lastFour(d.iban) };
    return { label: 'Account number', value: '' };
  }
  if (method.type === 'upi') return { label: 'UPI ID', value: d.upiId || '' };
  return { label: 'Wallet address', value: reveal ? d.walletAddress : shortAddress(d.walletAddress) };
}

// Secondary facts as small labelled pairs
function secondaryFacts(method) {
  const d = method.details || {};
  if (method.type === 'bank') {
    return [
      d.ifsc && ['IFSC', d.ifsc],
      d.swift && ['SWIFT', d.swift],
      d.currency && ['Currency', d.currency],
    ].filter(Boolean);
  }
  if (method.type === 'upi') return d.payeeName ? [['Payee', d.payeeName]] : [];
  return d.network ? [['Network', NETWORK_NAMES[d.network] || d.network]] : [];
}

function subtitle(method) {
  const d = method.details || {};
  if (method.type === 'bank') return [d.bankName, d.accountName].filter(Boolean).join(', ');
  if (method.type === 'upi') return 'Pay with any UPI app';
  return 'Tether stablecoin';
}

/**
 * One company account, drawn as a payment instrument. Used in the list and as the live preview in the drawer.
 * `preview` hides the controls; `qrUrl` is the resolved QR image (or null).
 */
export function PaymentAccountCard({ method, qrUrl, preview = false, handle, dragging, busy, onToggle, onEdit, onDelete }) {
  const meta = TYPE_META[method.type];
  const primary = primaryValue(method, preview);
  const facts = secondaryFacts(method);
  const hidden = !method.enabled;
  const showQrSlot = method.type !== 'bank';

  return (
    <div
      className={`group relative overflow-hidden rounded-[12px] border bg-surface-elevated transition-[opacity,border-color] duration-200 ${
        dragging ? 'opacity-40' : ''
      }`}
      style={{ borderColor: dragging ? meta.color : 'color-mix(in srgb, var(--border) 60%, transparent)' }}
    >
      {/* Type rail */}
      <span aria-hidden className="absolute inset-y-0 left-0 w-[3px]" style={{ background: hidden ? 'var(--border)' : meta.color }} />

      <div className={`flex gap-4 py-4 pl-5 pr-4 ${hidden && !preview ? 'opacity-55' : ''}`}>
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            {handle}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold leading-tight text-text font-heading">
                {method.label || <span className="text-text-muted/40">Display name</span>}
              </p>
              <p className="mt-0.5 truncate text-[12px] text-text-muted/60 font-heading">{subtitle(method) || ' '}</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-[11px] text-text-muted/50 font-heading">{primary.label}</p>
            <p
              className="mt-0.5 truncate font-mono text-[16px] font-semibold tracking-[0.02em] text-text"
              style={{ fontVariantNumeric: 'tabular-nums' }}
              title={method.type === 'usdt' ? method.details?.walletAddress : undefined}
            >
              {primary.value || <span className="text-text-muted/30">Not set</span>}
            </p>
          </div>

          {facts.length > 0 && (
            <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
              {facts.map(([k, v]) => (
                <div key={k} className="min-w-0">
                  <dt className="text-[10.5px] text-text-muted/45 font-heading">{k}</dt>
                  <dd className={`truncate text-[12px] text-text/85 ${k === 'Payee' || k === 'Network' ? 'font-heading' : 'font-mono'}`}>{v}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {showQrSlot && (
          qrUrl ? (
            <div className="shrink-0 self-start rounded-[8px] bg-white p-1.5">
              <img src={qrUrl} alt="" className="h-[68px] w-[68px] object-contain" />
            </div>
          ) : (
            <div
              className="flex h-[80px] w-[80px] shrink-0 flex-col items-center justify-center gap-1 self-start rounded-[8px] border border-dashed text-text-muted/35"
              style={{ borderColor: 'color-mix(in srgb, var(--border) 70%, transparent)' }}
            >
              <QrCode size={16} />
              <span className="text-[10px] font-heading">No QR</span>
            </div>
          )
        )}
      </div>

      {!preview && (
        <div
          className="flex items-center gap-1 border-t py-2 pl-5 pr-3"
          style={{ borderColor: 'color-mix(in srgb, var(--border) 40%, transparent)' }}
        >
          {hidden ? (
            <span className="flex items-center gap-1.5 text-[11.5px] text-text-muted/60 font-heading">
              <EyeOff size={12} /> Hidden from clients
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[11.5px] font-heading" style={{ color: meta.color }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.color }} /> Shown to clients
            </span>
          )}
          <div className="ml-auto flex items-center gap-0.5">
            <button
              type="button"
              onClick={onEdit}
              className="flex cursor-pointer items-center gap-1.5 rounded-[6px] px-2 py-1.5 text-[12px] text-text-muted/70 transition-colors hover:bg-muted-surface hover:text-text focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand/60 font-heading"
            >
              <Pencil size={12} /> Edit
            </button>
            <button
              type="button"
              onClick={onDelete}
              disabled={busy}
              aria-label={`Delete ${method.label}`}
              className="flex cursor-pointer items-center rounded-[6px] p-1.5 text-text-muted/50 transition-colors hover:bg-negative/10 hover:text-negative focus-visible:outline focus-visible:outline-1 focus-visible:outline-negative/60 disabled:opacity-40"
            >
              <Trash2 size={13} />
            </button>
            <span className="mx-1.5 h-4 w-px" style={{ background: 'color-mix(in srgb, var(--border) 60%, transparent)' }} />
            <Toggle val={method.enabled} onChange={onToggle} disabled={busy} />
          </div>
        </div>
      )}
    </div>
  );
}

/** Dashed tile at the end of a grid that opens the add drawer */
export function AddAccountTile({ type, label, onClick }) {
  const meta = TYPE_META[type];
  const Icon = meta.Icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-[150px] cursor-pointer flex-col items-center justify-center gap-2.5 rounded-[12px] border border-dashed text-text-muted/60 transition-colors hover:text-text focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand/60"
      style={{ borderColor: 'color-mix(in srgb, var(--border) 80%, transparent)' }}
    >
      <span
        className="flex h-9 w-9 items-center justify-center rounded-full transition-transform group-hover:scale-105"
        style={{ background: tint(meta.color, 12), color: meta.color }}
      >
        <Icon size={16} />
      </span>
      <span className="text-[12.5px] font-medium font-heading">{label}</span>
    </button>
  );
}

export default PaymentAccountCard;
