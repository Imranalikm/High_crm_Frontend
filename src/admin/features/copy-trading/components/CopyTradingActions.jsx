/* eslint-disable react-refresh/only-export-components */
import React, { useEffect } from 'react';
import { TrendingUp, TrendingDown, ArrowLeft } from 'lucide-react';
import { StatusChip, RiskChip, Button as BaseButton, Card as BaseCard, Toast as CanonicalToast } from '@/components/ui';
import { SEV_CLR } from '@/config/constants/status.constants';

const Minus = () => <span style={{ fontSize: 9, lineHeight: 1 }}>—</span>;

export function Badge({ v, size = 'sm' }) {
  return <StatusChip value={v} size={size} />;
}

export function RiskBadge({ v, size = 'sm' }) {
  // NormalizeMED to MEDIUM to match standard RISK_COLORS themed mappings
  const normalized = v === 'MED' ? 'MEDIUM' : v;
  return <RiskChip value={normalized} size={size} />;
}

export function SevBadge({ v, size = 'sm' }) {
  return <StatusChip value={v} colorMap={SEV_CLR} dot={false} size={size} />;
}

export function TrendBadge({ v }) {
  const c = v === 'UP' ? 'var(--positive)' : v === 'DOWN' ? 'var(--negative)' : 'var(--warning)';
  const Icon = v === 'UP' ? TrendingUp : v === 'DOWN' ? TrendingDown : Minus;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-[5px] px-2 py-[3px] text-[11px] font-semibold uppercase tracking-[0.05em] font-heading"
      style={{
        color: c,
        background: `color-mix(in srgb,${c} 10%,transparent)`,
        border: `1px solid color-mix(in srgb,${c} 18%,transparent)`,
      }}
    >
      <Icon size={9} className="flex-shrink-0" />
      {v}
    </span>
  );
}

export function StarRating({ v }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[11px] font-mono font-bold text-brand">{v} ★</span>
    </div>
  );
}

export function Card({ children, className = '', pad = true, title, heading }) {
  return (
    <BaseCard className={className} padding={pad} title={title} heading={heading}>
      {children}
    </BaseCard>
  );
}

export function IBtn({ Icon: Ic, label, variant = 'default', onClick, small, disabled }) {
  let btnVariant = 'secondary';
  if (variant === 'danger') btnVariant = 'danger';
  if (variant === 'success') btnVariant = 'success';
  if (variant === 'warning') btnVariant = 'warning';
  if (variant === 'brand' || variant === 'cyan' || variant === 'purple') btnVariant = 'primary';

  return (
    <BaseButton
      variant={btnVariant}
      size={small ? 'sm' : 'md'}
      icon={Ic}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </BaseButton>
  );
}

export function ToastBar({ msg, onDone }) {
  useEffect(() => {
    if (msg) {
      const t = setTimeout(onDone, 3000);
      return () => clearTimeout(t);
    }
  }, [msg, onDone]);
  return <CanonicalToast msg={msg} />;
}

export function UserAvatar({ name, size = 'sm' }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const dim =
    size === 'lg'
      ? 'w-10 h-10 text-[12px] rounded-[10px]'
      : size === 'md'
      ? 'w-8 h-8 text-[10px] rounded-[8px]'
      : 'w-6 h-6 text-[9px] rounded-[6px]';
  return (
    <div
      className={`${dim} bg-primary/[0.1] border border-primary/[0.18] flex items-center justify-center font-bold text-primary font-heading flex-shrink-0`}
    >
      {initials}
    </div>
  );
}

export function DetailHeader({ onBack, breadcrumb, title, badges, actions }) {
  return (
    <>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-[11px] font-semibold font-heading text-text-muted/70 hover:text-text transition-colors cursor-pointer mb-4"
      >
        <ArrowLeft size={13} />
        {breadcrumb}
      </button>
      <div
        className="sticky top-16 z-30 -mx-6 px-6 py-3 mb-5"
        style={{
          background: 'color-mix(in srgb,var(--bg) 88%,transparent)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="flex items-start gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap mb-1">{badges}</div>
            <h1 className="text-[22px] font-semibold tracking-[-0.03em] text-text font-heading">{title}</h1>
          </div>
          {actions && <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">{actions}</div>}
        </div>
      </div>
    </>
  );
}

export function AuditTrail({ entries }) {
  return (
    <div className="relative space-y-0">
      <div className="absolute left-[7px] top-3 bottom-3 w-px bg-white/[0.06]" />
      {entries.map((e, i) => (
        <div key={i} className="flex gap-3 pb-3">
          <div
            className="w-3.5 h-3.5 rounded-full border border-white/[0.12] bg-white/[0.06] flex-shrink-0 mt-1 z-10"
            style={{ boxShadow: '0 0 0 2px var(--bg)' }}
          />
          <div className="min-w-0">
            <div className="text-[12.5px] font-heading font-semibold text-text/85">{e.event.replace(/_/g, ' ')}</div>
            <div className="text-[11.5px] text-text-muted/70 font-heading mt-0.5">{e.detail}</div>
            <div className="text-[11px] font-mono text-text-muted/60 mt-0.5">
              {e.ts} · {e.by}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function FollowerRow({ f }) {
  return (
    <div className="flex items-center gap-3 rounded-[9px] border border-white/[0.04] bg-white/[0.015] px-3 py-2.5 hover:border-white/[0.08] transition-all">
      <UserAvatar name={f.follower} />
      <div className="flex-1 min-w-0">
        <div className="text-[12.5px] font-semibold font-heading text-text/85 truncate">{f.follower}</div>
        <div className="text-[11px] font-mono text-text-muted/70">
          {f.uid} · {f.alloc}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`text-[11px] font-mono font-bold ${f.pnlN >= 0 ? 'text-positive' : 'text-negative'}`}>
          {f.pnl}
        </span>
        <Badge v={f.status} />
      </div>
    </div>
  );
}
export const SC = {
  ACTIVE: 'var(--positive)',
  PAUSED: 'var(--warning)',
  SUSPENDED: 'var(--negative)',
  APPROVED: 'var(--positive)',
  PENDING: 'var(--warning)',
  REVIEW: 'var(--cyan)',
  REJECTED: 'var(--negative)',
  EXPIRED: 'var(--text-muted)',
  SUCCESS: 'var(--positive)',
  FAILED: 'var(--negative)',
  UP: 'var(--positive)',
  DOWN: 'var(--negative)',
  FLAT: 'var(--warning)',
};

export const RC = {
  LOW: 'var(--positive)',
  MED: 'var(--warning)',
  HIGH: 'var(--negative)',
};

export const SEV_C = {
  INFO: 'var(--cyan)',
  WARNING: 'var(--warning)',
  ERROR: 'var(--negative)',
  CRITICAL: 'var(--negative)',
};
