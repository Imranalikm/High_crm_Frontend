import React from 'react';
import { Zap, Building2, Home, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { UploadArea } from './DocumentUploadCard';

const DOC_TYPES = [
  { id: 'utility-bill', label: 'Utility bill', Icon: Zap, desc: 'Gas, electricity or water' },
  { id: 'bank-statement', label: 'Bank statement', Icon: Building2, desc: 'Official bank statement' },
  { id: 'rent-agreement', label: 'Rent agreement', Icon: Home, desc: 'Signed tenancy agreement' },
];

function Tick() {
  return (
    <svg width="9" height="8" viewBox="0 0 9 8" fill="none">
      <path d="M1.5 4L3.5 6L7.5 2" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AddressProofUpload({ value, onChange, errors = {} }) {
  return (
    <div className="space-y-6">

      {/* ── Type selector ── */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.12em] text-text-muted mb-3">Document type</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {DOC_TYPES.map((type) => {
            const { id, label, Icon, desc } = type;
            const on = value.type === id;
            return (
              <button key={id} type="button" onClick={() => onChange({ ...value, type: id })}
                className={`relative p-4 rounded-[12px] border text-left transition-all duration-150 ${on ? 'border-brand/50 bg-brand/[0.07]' : 'border-border/35 bg-muted-surface/50 hover:border-border/60'}`}>
                {on && (
                  <span className="absolute top-3 right-3 w-[18px] h-[18px] rounded-full bg-brand flex items-center justify-center">
                    <Tick />
                  </span>
                )}
                <div className={`w-9 h-9 rounded-[9px] mb-3 flex items-center justify-center ${on ? 'bg-brand/15 text-brand' : 'bg-muted-surface text-text-muted'}`}>
                  <Icon size={17} />
                </div>
                <p className={`text-[12.5px] font-bold leading-tight ${on ? 'text-brand' : 'text-text'}`}>{label}</p>
                <p className="text-[10px] text-text-muted mt-0.5">{desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Upload + metadata ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">

        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-text-muted mb-3">Upload document</p>
          <UploadArea
            label="Upload proof of address"
            hint="Dated within the last 90 days · PNG, JPG or PDF up to 10 MB"
            file={value.file}
            error={errors.file}
            onChange={(f) => onChange({ ...value, file: f })}
          />
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-text-muted mb-2">
              Document issue date <span className="text-negative">*</span>
            </p>
            <input type="date" value={value.issueDate ?? ''}
              onChange={(e) => onChange({ ...value, issueDate: e.target.value })}
              className={`w-full h-11 px-3.5 rounded-[9px] bg-muted-surface border text-[13px] text-text outline-none focus:border-brand/55 ${errors.issueDate ? 'border-negative/50 bg-negative/[0.03]' : 'border-border/40'}`}
            />
            {errors.issueDate && (
              <span className="flex items-center gap-1 text-[11px] text-negative mt-1.5">
                <AlertCircle size={10} className="shrink-0" /> {errors.issueDate}
              </span>
            )}
          </div>

          <div className="rounded-[10px] bg-positive/[0.06] border border-positive/20 p-4">
            <p className="flex items-center gap-2 text-[11.5px] font-bold text-positive mb-1.5">
              <CheckCircle2 size={13} className="shrink-0" /> Address must match
            </p>
            <p className="text-[11px] text-text-muted leading-relaxed">
              The name and full address on this document must match exactly what you entered in Step 1.
            </p>
          </div>

          <div className="rounded-[10px] bg-brand/[0.06] border border-brand/20 p-4">
            <p className="flex items-center gap-2 text-[11.5px] font-bold text-brand mb-1.5">
              <Info size={13} className="shrink-0" /> Dated within 90 days
            </p>
            <p className="text-[11px] text-text-muted leading-relaxed">
              Documents older than 90 days will be rejected. Check the issue date before uploading.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}