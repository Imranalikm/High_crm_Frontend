import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  Clock3, Check, ShieldCheck, FileSearch, Bell,
  ArrowLeft, AlertTriangle, LockKeyhole, RefreshCw, ArrowRight,
  FileText,
} from 'lucide-react';
import { useKyc } from '../hooks/useKyc';
import { KycViewDrawer } from '../components/KycViewDrawer';

/* ── Status config ── */
const STATUS_CFG = {
  verified: {
    eyebrow: 'Verified',
    headline: 'You are verified!',
    sub: 'You now have full access to trading features, higher limits, and withdrawals.',
    iconCls: 'bg-positive/12 text-positive',
    Icon: Check,
  },
  rejected: {
    eyebrow: 'Action required',
    headline: 'Verification failed',
    sub: 'There was an issue with your documents. Please review the reason below and try again.',
    iconCls: 'bg-negative/12 text-negative',
    Icon: AlertTriangle,
  },
  'under-review': {
    eyebrow: 'Under review',
    headline: 'Checking your documents',
    sub: 'We are checking your documents now. We will email you once this is completed.',
    iconCls: 'bg-brand/12 text-brand',
    Icon: Clock3,
  },
  pending: {
    eyebrow: 'In progress',
    headline: 'Checking your documents',
    sub: 'Your documents are currently being checked. This usually takes 1 to 3 business days.',
    iconCls: 'bg-brand/12 text-brand',
    Icon: Clock3,
  },
};

export function KycStatusPage() {
  const navigate = useNavigate();
  const { overview, loading, error } = useKyc();
  const [drawerOpen, setDrawerOpen] = useState(false);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="space-y-5 px-4 sm:px-6 animate-pulse">
        <div className="h-4 w-36 bg-muted-surface rounded-full" />
        <div className="h-52 bg-surface-elevated rounded-[16px]" />
        <div className="h-64 bg-surface-elevated rounded-[12px]" />
      </div>
    );
  }

  /* ── Error ── */
  if (error || !overview) {
    return (
      <div className="flex flex-col items-center py-20 text-center px-4">
        <div className="w-14 h-14 rounded-full bg-negative/10 flex items-center justify-center mb-4">
          <AlertTriangle size={24} className="text-negative" />
        </div>
        <p className="text-[14px] font-bold mb-1">Unable to load status</p>
        <p className="text-[12.5px] text-text-muted mb-5">
          Please try again or return to the overview.
        </p>
        <button
          onClick={() => navigate('/client/kyc')}
          className="h-10 px-4 rounded-[9px] bg-brand text-text-on-accent text-[12px] font-bold hover:opacity-90 transition-opacity"
        >
          Back to overview
        </button>
      </div>
    );
  }

  const status = overview.status ?? 'under-review';
  const cfg = STATUS_CFG[status] ?? STATUS_CFG['under-review'];
  const isVerified = status === 'verified';
  const isRejected = status === 'rejected';
  const isActive = status === 'under-review' || status === 'pending';

  const STAGES = [
    {
      title: 'Documents uploaded',
      desc: 'Your files have been received safely.',
      Icon: Check,
      done: true,
      warn: false,
    },
    {
      title: 'Reviewing documents',
      desc: isRejected
        ? 'Your documents could not be verified. Please upload them again.'
        : 'We are checking your details and documents.',
      Icon: FileSearch,
      done: isActive || isRejected || isVerified,
      warn: isRejected,
    },
    {
      title: 'Final decision',
      desc: isVerified
        ? 'Verification complete. All trading features are ready.'
        : isRejected
          ? 'Please review the issues and submit again.'
          : 'We will notify you here and via email when done.',
      Icon: Bell,
      done: isVerified || isRejected,
      warn: isRejected,
    },
  ];

  return (
    <div className="space-y-5 animate-fade-up">

      {/* ── Back nav ── */}
      <button
        onClick={() => navigate('/client')}
        className="flex items-center gap-2 text-[11.5px] font-bold text-text-muted hover:text-text transition-colors"
      >
        <ArrowLeft size={13} /> Dashboard
      </button>

      {/* ── Status hero ── */}
      <div className="rounded-[16px] border border-border/30 bg-surface-elevated p-7 text-center">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 ${cfg.iconCls}`}>
          <cfg.Icon size={26} />
        </div>

        <p className="text-[10px] font-black uppercase tracking-[0.13em] text-brand">
          {cfg.eyebrow}
        </p>
        <h1 className="font-heading font-semibold text-[24px] tracking-[-0.03em] text-text mt-1.5 mb-2">
          {cfg.headline}
        </h1>
        <p className="text-[13px] text-text-muted max-w-md mx-auto leading-relaxed">{cfg.sub}</p>

        {/* Reference number */}
        {overview.reference && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted-surface border border-border/30">
            <span className="text-[9.5px] font-black uppercase tracking-[0.1em] text-text-muted">Ref</span>
            <span className="font-mono text-[11px] text-text">{overview.reference}</span>
          </div>
        )}

        {/* Review ETA */}
        {isActive && overview.estimatedReviewTime && (
          <p className="mt-3 text-[11.5px] text-text-muted">
            Estimated completion:{' '}
            <span className="font-bold text-text">{overview.estimatedReviewTime}</span>
          </p>
        )}

        {/* View Submitted Data Button */}
        {overview?.kycData && (
          <div className="mt-5">
            <button
              onClick={() => setDrawerOpen(true)}
              className="h-10 px-6 rounded-[14px] bg-[#a2c1f5] text-[#0a1e3f] hover:bg-[#92b3e8] transition-all font-bold text-[12.5px] inline-flex items-center gap-2 cursor-pointer shadow-sm select-none"
            >
              View Submitted Data <ArrowRight size={13} />
            </button>
          </div>
        )}
      </div>

      {/* ── Process timeline ── */}
      <div className="rounded-[12px] border border-border/35 bg-surface-elevated p-6">
        <h2 className="font-heading font-semibold text-[15px] text-text mb-6">
          {isRejected ? 'Issues' : 'Next steps'}
        </h2>

        <div>
          {STAGES.map((stage, i) => {
            const { title, desc, Icon, done, warn } = stage;
            return (
              <div key={title} className="flex gap-4">

                {/* Icon + connector */}
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 ${warn ? 'bg-negative/12 text-negative'
                    : done ? 'bg-positive/12 text-positive'
                      : 'bg-muted-surface text-text-muted'
                    }`}>
                    <Icon size={15} />
                  </div>
                  {i < STAGES.length - 1 && (
                    <div className={`w-px flex-1 min-h-[28px] my-1 ${done ? 'bg-border/50' : 'bg-border/20'}`} />
                  )}
                </div>

                {/* Content */}
                <div className="pb-5 pt-1.5">
                  <p className="text-[12.5px] font-bold text-text leading-tight">{title}</p>
                  <p className="text-[11.5px] text-text-muted mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Rejection action ── */}
      {isRejected && (
        <div className="rounded-[12px] border border-negative/25 bg-negative/[0.05] p-5">
          <p className="text-[12.5px] font-bold text-negative mb-1">Action required</p>
          {overview.rejectionReason && (
            <p className="text-[12px] text-text-muted mb-4 leading-relaxed">
              {overview.rejectionReason}
            </p>
          )}
          <button
            onClick={() => navigate('/client/kyc/upload?reupload=true')}
            className="h-10 px-4 rounded-[9px] bg-brand text-text-on-accent text-[12px] font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <RefreshCw size={13} /> Try again
          </button>
        </div>
      )}

      {/* ── Verified action ── */}
      {isVerified && (
        <div className="rounded-[12px] border border-positive/25 bg-positive/[0.05] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck size={18} className="text-positive shrink-0" />
            <p className="text-[12.5px] font-bold text-positive">
              Verified! You can now trade.
            </p>
          </div>
          <button
            onClick={() => navigate('/client/trading')}
            className="h-9 px-4 rounded-[8px] bg-positive text-white text-[11.5px] font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0"
          >
            Start trading <ArrowRight size={13} />
          </button>
        </div>
      )}

      {/* ── Encryption note ── */}
      <div className="flex items-center gap-3 rounded-[11px] border border-border/30 bg-surface p-4">
        <LockKeyhole size={14} className="text-brand shrink-0" />
        <p className="text-[11.5px] text-text-muted">
          Your files are encrypted and safe. They cannot be edited while we review them.
        </p>
      </div>

      <KycViewDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        rawKyc={overview?.kycData}
        status={status}
      />
    </div>
  );
}

export function KycDispatcher() {
  const { overview, loading, error } = useKyc();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: '2px solid rgba(99, 102, 241, 0.1)',
          borderTopColor: '#6366f1',
          animation: 'kycSpin 0.8s linear infinite',
        }} />
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes kycSpin {
            to { transform: rotate(360deg); }
          }
        `}} />
        <p className="text-[12.5px] text-text-muted mt-4">Loading verification status...</p>
      </div>
    );
  }

  if (error || !overview) {
    return <Navigate to="/client/kyc/upload" replace />;
  }

  const status = overview.status ?? 'not-started';

  if (status === 'verified' || status === 'under-review' || status === 'pending') {
    return <Navigate to="/client/kyc/status" replace />;
  }

  return <Navigate to="/client/kyc/upload" replace />;
}

export default KycStatusPage;