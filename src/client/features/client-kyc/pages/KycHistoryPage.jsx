import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, History, Clock3,
  CheckCircle2, CircleAlert, RefreshCw, ShieldCheck,
} from 'lucide-react';
import { SubmissionTimeline } from '../components/SubmissionTimeline';
import { useKyc } from '../hooks/useKyc';

/* ── Helpers ── */
const fmtStatus = (s) =>
  (s ?? 'pending')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

const STATUS_CLS = {
  verified: 'bg-positive/10 text-positive border-positive/20',
  rejected: 'bg-negative/10 text-negative border-negative/20',
  pending: 'bg-warning/10 text-warning border-warning/20',
  'under-review': 'bg-brand/10 text-brand border-brand/20',
};

const STATUS_ICON = {
  verified: CheckCircle2,
  rejected: CircleAlert,
  pending: Clock3,
  'under-review': Clock3,
};

export function KycHistoryPage() {
  const navigate = useNavigate();
  const { history, loading, error } = useKyc();

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="space-y-5 px-4 sm:px-6 animate-pulse">
        <div className="h-4 w-36 bg-muted-surface rounded-full" />
        <div className="space-y-1.5">
          <div className="h-8 w-56 bg-muted-surface rounded-[9px]" />
          <div className="h-4 w-80 bg-muted-surface rounded" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-surface-elevated rounded-[12px]" />
          ))}
        </div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-[72px] bg-surface-elevated rounded-[12px]" />
          ))}
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="flex flex-col items-center py-20 text-center px-4">
        <div className="w-14 h-14 rounded-full bg-negative/10 flex items-center justify-center mb-4">
          <ShieldCheck size={24} className="text-negative" />
        </div>
        <p className="text-[14px] font-bold mb-1">Failed to load history</p>
        <p className="text-[12.5px] text-text-muted mb-5">
          Unable to retrieve your submission history. Please try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="h-10 px-4 rounded-[9px] bg-brand text-text-on-accent text-[12px] font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <RefreshCw size={13} /> Retry
        </button>
      </div>
    );
  }

  /* ── Derived stats ── */
  const items = history ?? [];
  const totalCount = items.length;
  const latestItem = items[0];
  const latestStatus = latestItem?.status;
  const latestDate = latestItem?.submittedAt;
  const LatestIcon = STATUS_ICON[latestStatus] ?? Clock3;

  return (
    <div className="space-y-6 animate-fade-up">

      {/* ── Back nav ── */}
      <button
        onClick={() => navigate('/client')}
        className="flex items-center gap-2 text-[11.5px] font-bold text-text-muted hover:text-text transition-colors"
      >
        <ArrowLeft size={13} /> Dashboard
      </button>

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-text-muted">
            Past Uploads
          </p>
          <h1 className="font-heading font-semibold text-[27px] tracking-[-0.04em] text-text mt-0.5">
            Upload history
          </h1>
          <p className="text-[13px] text-text-muted mt-1">
            View your past document uploads and notes from our team.
          </p>
        </div>
        {totalCount > 0 && (
          <button
            onClick={() => navigate('/client/kyc/upload')}
            className="h-10 px-4 rounded-[9px] bg-brand text-text-on-accent text-[12px] font-bold shrink-0 hover:opacity-90 transition-opacity"
          >
            Upload document
          </button>
        )}
      </div>

      {/* ── Stats row — only when submissions exist ── */}
      {totalCount > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Total submissions */}
          <div className="rounded-[12px] border border-border/35 bg-surface-elevated p-4">
            <div className="w-7 h-7 rounded-[7px] bg-brand/10 flex items-center justify-center mb-3">
              <History size={13} className="text-brand" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.1em] text-text-muted">
              Total uploads
            </p>
            <p className="text-[22px] font-bold mt-1 text-text tracking-[-0.02em]">
              {totalCount}
            </p>
          </div>

          {/* Last submitted */}
          <div className="rounded-[12px] border border-border/35 bg-surface-elevated p-4">
            <div className="w-7 h-7 rounded-[7px] bg-brand/10 flex items-center justify-center mb-3">
              <Clock3 size={13} className="text-brand" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.1em] text-text-muted">
              Last uploaded
            </p>
            <p className="text-[13.5px] font-bold mt-1 text-text">
              {latestDate ?? '—'}
            </p>
          </div>

          {/* Current status */}
          <div className="rounded-[12px] border border-border/35 bg-surface-elevated p-4">
            <div className="w-7 h-7 rounded-[7px] bg-brand/10 flex items-center justify-center mb-3">
              <LatestIcon size={13} className="text-brand" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.1em] text-text-muted">
              Status
            </p>
            <div className="mt-2">
              <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${STATUS_CLS[latestStatus] ?? STATUS_CLS.pending}`}>
                <LatestIcon size={11} />
                {fmtStatus(latestStatus)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Timeline (handles empty state internally) ── */}
      <SubmissionTimeline
        items={items}
        onReupload={() => navigate('/client/kyc/upload')}
      />
    </div>
  );
}

export default KycHistoryPage;