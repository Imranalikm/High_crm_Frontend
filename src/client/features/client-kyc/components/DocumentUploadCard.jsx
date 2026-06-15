import React, { useRef, useState, useEffect } from 'react';
import {
  UploadCloud, FileText, FileCheck2, X,
  BookOpen, CreditCard, Car, AlertCircle, CheckCircle2,
} from 'lucide-react';

/* ─── UploadArea ─────────────────────────────────────────────────────────── */

export function UploadArea({
  label,
  hint,
  file,
  error,
  onChange,
  accept = 'image/png,image/jpeg,application/pdf',
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const depth = useRef(0);

  useEffect(() => {
    if (!file?.type?.startsWith('image/')) {
      const t = setTimeout(() => setPreview(null), 0);
      return () => clearTimeout(t);
    }
    const url = URL.createObjectURL(file);
    const t = setTimeout(() => setPreview(url), 0);
    return () => {
      clearTimeout(t);
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const onDragEnter = (e) => { e.preventDefault(); depth.current++; setDragging(true); };
  const onDragLeave = (e) => { e.preventDefault(); if (--depth.current <= 0) { depth.current = 0; setDragging(false); } };
  const onDrop = (e) => {
    e.preventDefault(); depth.current = 0; setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onChange(f);
  };
  const fmtSize = (b) => b < 1_048_576 ? `${(b / 1024).toFixed(0)} KB` : `${(b / 1_048_576).toFixed(1)} MB`;
  const isPdf = file?.type === 'application/pdf';

  const wrapCls = [
    'relative w-full rounded-[13px] border border-dashed transition-all duration-200 cursor-pointer overflow-hidden',
    error ? 'border-negative/40 bg-negative/[0.03]'
      : dragging ? 'border-brand/60 bg-brand/[0.05]'
        : file ? 'border-positive/40 bg-positive/[0.03]'
          : 'border-border/40 bg-muted-surface/30 hover:border-brand/40 hover:bg-brand/[0.025]',
  ].join(' ');

  return (
    <div>
      <div
        className={wrapCls}
        style={{ minHeight: preview ? 0 : 162 }}
        onClick={() => inputRef.current?.click()}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        <input ref={inputRef} type="file" accept={accept} className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)} />

        {preview ? (
          <div className="relative">
            <img src={preview} alt="Document" className="w-full max-h-56 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
            <div className="absolute bottom-3 left-3 right-10 flex items-center gap-2">
              <CheckCircle2 size={13} className="text-positive shrink-0" />
              <span className="text-[11px] font-bold text-white truncate">{file.name}</span>
              <span className="text-[10px] text-white/50 font-mono shrink-0">{fmtSize(file.size)}</span>
            </div>
            <button type="button"
              onClick={(e) => { e.stopPropagation(); onChange(null); }}
              className="absolute bottom-2.5 right-3 w-6 h-6 rounded-full bg-white/15 hover:bg-negative/70 flex items-center justify-center transition-colors">
              <X size={11} className="text-white" />
            </button>
          </div>
        ) : isPdf ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <div className="w-11 h-11 rounded-[11px] bg-positive/12 flex items-center justify-center mb-3">
              <FileText size={20} className="text-positive" />
            </div>
            <p className="text-[12.5px] font-bold text-text truncate max-w-[200px]">{file.name}</p>
            <p className="text-[11px] text-text-muted mt-1">{fmtSize(file.size)} · PDF ready</p>
            <button type="button"
              onClick={(e) => { e.stopPropagation(); onChange(null); }}
              className="mt-3 flex items-center gap-1 text-[10.5px] font-bold text-negative hover:opacity-75 transition-opacity">
              <X size={10} /> Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-9 px-5 text-center">
            <div className={`w-11 h-11 rounded-[11px] flex items-center justify-center mb-3 transition-all duration-150 ${dragging ? 'bg-brand/25 scale-110' : 'bg-brand/10'}`}>
              <UploadCloud size={20} className="text-brand" />
            </div>
            <p className="text-[12.5px] font-bold text-text">{dragging ? 'Release to upload' : label}</p>
            <p className="text-[11px] text-text-muted mt-1 leading-relaxed max-w-[210px]">{hint}</p>
            {!dragging && (
              <span className="mt-4 inline-flex gap-1.5 items-center text-[10.5px] font-bold text-brand border border-brand/25 bg-brand/[0.07] rounded-full px-3 py-1">
                Browse or drag &amp; drop
              </span>
            )}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-negative">
          <AlertCircle size={11} className="shrink-0" /> {error}
        </p>
      )}
    </div>
  );
}

/* ─── DocumentUploadCard ─────────────────────────────────────────────────── */

const DOC_TYPES = [
  { id: 'passport', label: 'Passport', Icon: BookOpen, sub: 'Bio-data page only', needsBack: false },
  { id: 'national-id', label: 'National ID', Icon: CreditCard, sub: 'Both sides required', needsBack: true },
  { id: 'driving-license', label: 'Driving license', Icon: Car, sub: 'Both sides required', needsBack: true },
];

function SectionLabel({ children }) {
  return <p className="text-[10px] font-black uppercase tracking-[0.12em] text-text-muted mb-3">{children}</p>;
}

function Tick() {
  return (
    <svg width="9" height="8" viewBox="0 0 9 8" fill="none">
      <path d="M1.5 4L3.5 6L7.5 2" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DocumentUploadCard({ value, onChange, errors = {} }) {
  const sel = DOC_TYPES.find((t) => t.id === value.type) ?? DOC_TYPES[0];

  return (
    <div className="space-y-7">

      {/* ── Type selector ── */}
      <div>
        <SectionLabel>Document type</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {DOC_TYPES.map((type) => {
            const { id, label, Icon, sub } = type;
            const on = value.type === id;
            return (
              <button key={id} type="button" onClick={() => onChange({ ...value, type: id })}
                className={`relative p-4 rounded-[12px] border text-left transition-all duration-150 ${on ? 'border-brand/50 bg-brand/[0.07]' : 'border-border/35 bg-muted-surface/50 hover:border-border/60'}`}>
                {on && (
                  <span className="absolute top-3 right-3 w-[18px] h-[18px] rounded-full bg-brand flex items-center justify-center">
                    <Tick />
                  </span>
                )}
                <div className={`w-9 h-9 rounded-[9px] mb-3 flex items-center justify-center transition-colors ${on ? 'bg-brand/15 text-brand' : 'bg-muted-surface text-text-muted'}`}>
                  <Icon size={17} />
                </div>
                <p className={`text-[12.5px] font-bold leading-tight ${on ? 'text-brand' : 'text-text'}`}>{label}</p>
                <p className="text-[10px] text-text-muted mt-0.5">{sub}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Upload areas ── */}
      <div>
        <SectionLabel>Upload document</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-[11px] font-semibold text-text-muted mb-2.5">Front side <span className="text-negative">*</span></p>
            <UploadArea
              label="Upload front side"
              hint="All four corners visible · PNG, JPG or PDF up to 10 MB"
              file={value.front}
              error={errors.front}
              onChange={(f) => onChange({ ...value, front: f })}
            />
          </div>
          {sel.needsBack ? (
            <div>
              <p className="text-[11px] font-semibold text-text-muted mb-2.5">Back side <span className="text-negative">*</span></p>
              <UploadArea
                label="Upload back side"
                hint="Make sure all text is easy to read"
                file={value.back}
                error={errors.back}
                onChange={(f) => onChange({ ...value, back: f })}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-[13px] border border-dashed border-border/25 bg-muted-surface/20 p-6 text-center">
              <div className="w-10 h-10 rounded-full bg-positive/10 flex items-center justify-center mb-3">
                <CheckCircle2 size={18} className="text-positive" />
              </div>
              <p className="text-[12px] font-bold">Back side not required</p>
              <p className="text-[11px] text-text-muted mt-1.5 max-w-[165px] leading-relaxed">
                Passports only need the photo data page.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Document details ── */}
      <div>
        <SectionLabel>Document info</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            ['documentNumber', 'Document ID number', 'text', 'e.g. A12345678'],
            ['expiryDate', 'Expiry date', 'date', null],
            ['issuingCountry', 'Country of issue', 'text', 'e.g. United Kingdom'],
          ].map(([name, label, type, ph]) => (
            <label key={name} className="block">
              <span className="block text-[10px] font-black uppercase tracking-[0.1em] text-text-muted mb-2">
                {label} <span className="text-negative">*</span>
              </span>
              <input type={type} value={value[name] ?? ''} placeholder={ph ?? ''}
                onChange={(e) => onChange({ ...value, [name]: e.target.value })}
                className={`w-full h-11 px-3.5 rounded-[9px] bg-muted-surface border text-[13px] text-text outline-none transition-colors focus:border-brand/55 placeholder:text-text-muted/30 ${errors[name] ? 'border-negative/50 bg-negative/[0.03]' : 'border-border/40'}`}
              />
              {errors[name] && (
                <span className="flex items-center gap-1 text-[11px] text-negative mt-1.5">
                  <AlertCircle size={10} className="shrink-0" /> {errors[name]}
                </span>
              )}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}