import React, { useState, useEffect } from 'react';
import {
  CheckCircle2, CircleAlert, FileText, UserRound,
  ScanFace, MapPin, AlertTriangle, LockKeyhole,
} from 'lucide-react';

/* ─── File thumbnail ─────────────────────────────────────────────────────── */

function FileThumb({ file }) {
  const [src, setSrc] = useState(null);
  useEffect(() => {
    if (!file?.type?.startsWith('image/')) {
      const t = setTimeout(() => setSrc(null), 0);
      return () => clearTimeout(t);
    }
    const url = URL.createObjectURL(file);
    const t = setTimeout(() => setSrc(url), 0);
    return () => {
      clearTimeout(t);
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!file) return null;
  return src
    ? <img src={src} alt="" className="w-10 h-10 rounded-[8px] object-cover border border-border/30 shrink-0" />
    : <div className="w-10 h-10 rounded-[8px] bg-muted-surface border border-border/30 flex items-center justify-center shrink-0">
      <FileText size={14} className="text-text-muted" />
    </div>;
}

/* ─── ReviewBlock ────────────────────────────────────────────────────────── */

function ReviewBlock({ icon, title, complete, children, onEdit }) {
  const Icon = icon;
  return (
    <div className={`rounded-[12px] border p-4 ${complete ? 'border-border/30 bg-muted-surface/20' : 'border-warning/25 bg-warning/[0.04]'}`}>
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-[6px] flex items-center justify-center shrink-0 ${complete ? 'bg-positive/15 text-positive' : 'bg-warning/15 text-warning'}`}>
            <Icon size={13} />
          </div>
          <h3 className="text-[12.5px] font-bold">{title}</h3>
          {complete
            ? <CheckCircle2 size={12} className="text-positive" />
            : <CircleAlert size={12} className="text-warning" />}
        </div>
        <button type="button" onClick={onEdit}
          className="text-[10.5px] font-bold text-brand hover:opacity-75 transition-opacity shrink-0">
          Edit
        </button>
      </div>
      {children}
    </div>
  );
}

/* ─── Custom checkbox ────────────────────────────────────────────────────── */

function Checkbox({ checked, onChange }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      className={`w-5 h-5 rounded-[5px] border flex items-center justify-center cursor-pointer transition-colors shrink-0 mt-0.5 ${checked ? 'bg-brand border-brand' : 'bg-muted-surface border-border/50 hover:border-border'}`}
    >
      {checked && (
        <svg width="10" height="9" viewBox="0 0 10 9" fill="none">
          <path d="M1.5 4.5L4 7L8.5 1.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

/* ─── ReviewSummary ──────────────────────────────────────────────────────── */

export function ReviewSummary({ data, onEdit, errors = {}, onDeclaration }) {
  const personalComplete = ['fullName', 'dateOfBirth', 'email', 'address'].every((k) => data.personalInfo?.[k]);
  const idComplete = Boolean(data.identityDocument?.front);
  const selfieComplete = Boolean(data.selfie);
  const addressComplete = Boolean(data.addressProof?.file);

  const completeCount = [personalComplete, idComplete, selfieComplete, addressComplete].filter(Boolean).length;
  const allComplete = completeCount === 4;
  const missingCount = 4 - completeCount;

  const personalRows = [
    ['Full name', data.personalInfo?.fullName],
    ['Date of birth', data.personalInfo?.dateOfBirth],
    ['Email', data.personalInfo?.email],
    ['Country', data.personalInfo?.country],
    ['Address', [data.personalInfo?.address, data.personalInfo?.city, data.personalInfo?.postalCode].filter(Boolean).join(', ')],
  ];

  return (
    <div className="space-y-4">

      {/* ── Missing items banner ── */}
      {!allComplete && (
        <div className="flex items-start gap-3 rounded-[11px] bg-warning/[0.07] border border-warning/25 p-4">
          <AlertTriangle size={15} className="text-warning shrink-0 mt-0.5" />
          <div>
            <p className="text-[12px] font-bold text-warning">Incomplete sections</p>
            <p className="text-[11px] text-text-muted mt-0.5">
              Please complete {missingCount} more section{missingCount !== 1 ? 's' : ''} to submit.
            </p>
          </div>
        </div>
      )}

      {/* ── Personal info ── */}
      <ReviewBlock icon={UserRound} title="Personal information" complete={personalComplete} onEdit={() => onEdit(1)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5">
          {personalRows.map(([label, val]) => (
            <p key={label} className="text-[11.5px]">
              <span className="text-text-muted">{label}: </span>
              <span className={`font-semibold ${!val ? 'text-warning' : ''}`}>{val || '— Missing'}</span>
            </p>
          ))}
        </div>
      </ReviewBlock>

      {/* ── Document blocks ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ReviewBlock icon={FileText} title="Identity document" complete={idComplete} onEdit={() => onEdit(2)}>
          <div className="flex items-center gap-3">
            <FileThumb file={data.identityDocument?.front} />
            {data.identityDocument?.back && <FileThumb file={data.identityDocument.back} />}
            <div className="min-w-0">
              <p className="text-[11px] font-semibold capitalize">{data.identityDocument?.type?.replace('-', ' ') || 'Not selected'}</p>
              <p className="text-[10.5px] text-text-muted truncate">{data.identityDocument?.front?.name || 'No file uploaded'}</p>
            </div>
          </div>
        </ReviewBlock>

        <ReviewBlock icon={ScanFace} title="Face verification" complete={selfieComplete} onEdit={() => onEdit(3)}>
          <div className="flex items-center gap-3">
            <FileThumb file={data.selfie} />
            <p className="text-[11px] text-text-muted truncate">{data.selfie?.name || 'No selfie uploaded'}</p>
          </div>
        </ReviewBlock>

        <ReviewBlock icon={MapPin} title="Proof of address" complete={addressComplete} onEdit={() => onEdit(4)}>
          <div className="flex items-center gap-3">
            <FileThumb file={data.addressProof?.file} />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold capitalize">{data.addressProof?.type?.replace('-', ' ') || 'Not selected'}</p>
              <p className="text-[10.5px] text-text-muted truncate">{data.addressProof?.file?.name || 'No file uploaded'}</p>
            </div>
          </div>
        </ReviewBlock>
      </div>

      {/* ── Declaration ── */}
      <div
        onClick={() => onDeclaration(!data.declaration)}
        className={`flex items-start gap-3 rounded-[12px] border p-4 cursor-pointer transition-colors ${errors.declaration ? 'border-negative/40 bg-negative/[0.04]' : 'border-border/35 bg-surface hover:border-border/55'}`}
      >
        <Checkbox checked={data.declaration ?? false} onChange={onDeclaration} />
        <div>
          <p className="text-[12px] text-text leading-relaxed select-none">
            I confirm that these documents are mine and the information is correct.
          </p>
          {errors.declaration && (
            <p className="flex items-center gap-1 text-[11px] text-negative mt-1.5">
              <AlertTriangle size={10} /> {errors.declaration}
            </p>
          )}
        </div>
      </div>

      {/* ── Security note ── */}
      <div className="flex items-center gap-2.5 text-[11px] text-text-muted px-1">
        <LockKeyhole size={12} className="text-brand shrink-0" />
        Your data is securely encrypted and stored according to data privacy laws.
      </div>
    </div>
  );
}