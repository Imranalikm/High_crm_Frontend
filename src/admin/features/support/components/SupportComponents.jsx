/**
 * SupportComponents.jsx
 * Shared atoms, constants, and micro-components for the Support feature.
 *
 * All generic primitives re-export from canonical component layer.
 * Only Support-specific components that are not in the global design system live here.
 */

/* eslint-disable react-refresh/only-export-components */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CheckCircle2, X, MessageCircle, Clock, Timer, AlertOctagon, UserPlus, Eye, ArrowUp } from 'lucide-react';
import { PRIORITY_COLORS, CATEGORY_COLORS, STATUS_COLORS } from '@/config/constants/status.constants';

/* ── Color maps (re-exported for backward compat) ────────────── */

export const PRIORITY_CLR = PRIORITY_COLORS;

export const PRIORITY_ORDER = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

export const STATUS_CLR = {
  OPEN:      STATUS_COLORS.OPEN,
  PENDING:   STATUS_COLORS.PENDING,
  ESCALATED: STATUS_COLORS.ESCALATED,
  RESOLVED:  STATUS_COLORS.RESOLVED,
  CLOSED:    STATUS_COLORS.CLOSED,
};

export const CAT_CLR = CATEGORY_COLORS;

export const KYC_CLR   = { VERIFIED: 'var(--positive)', PENDING: 'var(--warning)', REVIEW: 'var(--warning)', FAILED: 'var(--negative)' };
export const WALL_CLR  = { ACTIVE: 'var(--positive)',   INACTIVE: 'var(--text-muted)',  FROZEN: 'var(--negative)' };
export const TRADE_CLR = { ACTIVE: 'var(--positive)',   NONE:     'var(--text-muted)',  SUSPENDED: 'var(--negative)' };

/* ── Canonical re-exports ─────────────────────────────────────── */
export { ActionBtn as SupportIconBtn } from '@/components/ui';
export { ActionBtn as IconBtn } from '@/components/ui';

/* ── Support-specific: PriorityBadge ─────────────────────────── */
export function PriorityBadge({ value, size = 'sm' }) {
  const color  = PRIORITY_COLORS[value] || 'var(--text-muted)';
  const cls    = size === 'lg' ? 'px-2.5 py-1 text-[11.5px]' : 'px-2.5 py-0.5 text-[11px]';
  const dotSz  = 'w-1.5 h-1.5';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[5px] font-semibold uppercase tracking-[0.05em] whitespace-nowrap font-heading ${cls}`}
      style={{ color, background: `color-mix(in srgb, ${color} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 25%, transparent)` }}
    >
      <span className={`${dotSz} rounded-full flex-shrink-0 ${value === 'CRITICAL' ? 'animate-pulse' : ''}`} style={{ background: color }} />
      {value}
    </span>
  );
}

/* ── Support-specific: SupportStatusBadge ────────────────────── */
export function SupportStatusBadge({ value, size = 'sm' }) {
  const color = STATUS_COLORS[value] || 'var(--text-muted)';
  const cls   = size === 'lg' ? 'px-2.5 py-1 text-[11.5px]' : 'px-2.5 py-0.5 text-[11px]';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[5px] font-semibold uppercase tracking-[0.05em] whitespace-nowrap font-heading ${cls}`}
      style={{ color, background: `color-mix(in srgb, ${color} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 22%, transparent)` }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
      {value}
    </span>
  );
}

/* ── Support-specific: CatTag ────────────────────────────────── */
export function CatTag({ value }) {
  const color = CATEGORY_COLORS[value] || 'rgba(255,255,255,0.35)';
  return (
    <span
      className="inline-flex items-center rounded-[5px] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.05em] whitespace-nowrap font-heading"
      style={{ color, background: `color-mix(in srgb, ${color} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 22%, transparent)` }}
    >
      {value}
    </span>
  );
}

/* ── Support-specific: SlaBar ────────────────────────────────── */
export function SlaBar({ pct, slaMins }) {
  const isBreached = pct === 0 || (slaMins != null && slaMins < 0);
  const isWarning  = pct < 30 && !isBreached;
  const color      = isBreached ? 'var(--negative)' : isWarning ? 'var(--warning)' : 'var(--positive)';
  const displayPct = Math.max(0, Math.min(100, pct));

  const fmt = (m) => {
    if (m == null)   return 'Resolved';
    if (m < 0)       return `${Math.abs(m)}m breached`;
    if (m < 60)      return `${m}m left`;
    return `${Math.floor(m / 60)}h ${m % 60}m left`;
  };

  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <div className="flex-1 h-1.5 rounded-full bg-border/20 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${displayPct}%`, background: color }}
        />
      </div>
      <span
        className="text-[10px] font-mono flex-shrink-0"
        style={{ color: isBreached ? 'var(--negative)' : isWarning ? 'var(--warning)' : 'var(--text-muted)' }}
      >
        {fmt(slaMins)}
      </span>
    </div>
  );
}

/* ── Support-specific: UserAvatar ────────────────────────────── */
export function UserAvatar({ name, size = 'sm' }) {
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  const dim =
    size === 'lg' ? 'w-10 h-10 text-[12px] rounded-[10px]' :
    size === 'md' ? 'w-8 h-8 text-[10px] rounded-[8px]' :
                    'w-7 h-7 text-[10.5px] rounded-[7px]';
  return (
    <div className={`${dim} bg-primary/[0.1] border border-primary/[0.18] flex items-center justify-center font-semibold text-primary font-heading flex-shrink-0`}>
      {initials}
    </div>
  );
}

/* ── Support-specific: SupportSectionHead ────────────────────── */
export function SupportSectionHead({ title, Icon: Ic, action }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      {Ic && <Ic size={11} className="text-text-muted/65 flex-shrink-0" />}
      <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted/70 font-heading select-none">{title}</span>
      <div className="flex-1 h-px bg-border/20" />
      {action}
    </div>
  );
}

/* ── Support-specific: SupportToast ──────────────────────────── */
export function SupportToast({ msg, onDone }) {
  useEffect(() => {
    if (msg) {
      const t = setTimeout(onDone, 3000);
      return () => clearTimeout(t);
    }
  }, [msg, onDone]);

  if (!msg) return null;
  return (
    <div className="flex items-center gap-2 rounded-[9px] border border-positive/20 bg-positive/[0.07] px-4 py-2.5 text-[12px] font-semibold text-positive font-heading animate-in fade-in duration-200">
      <CheckCircle2 size={13} />{msg}
    </div>
  );
}

/* ── Support-specific: SlaCheckRow ──────────────────────────── */
export function SlaCheckRow({ label, sla, met }) {
  return (
    <div className="flex items-center justify-between text-[11px] py-0.5">
      <span className="text-text-muted/70 font-heading">
        {label}: <span className="text-text-muted/80 font-semibold">{sla}</span>
      </span>
      <span className={`w-4 h-4 rounded-full flex items-center justify-center ${met ? 'bg-positive/[0.15]' : 'bg-negative/[0.15]'}`}>
        {met ? <Check size={9} className="text-positive" /> : <X size={9} className="text-negative" />}
      </span>
    </div>
  );
}

/* ── Support-specific: TicketCard ────────────────────────────── */
export function TicketCard({ ticket, onView, onAssign, onEscalate, onResolve, showEscalate = true }) {
  const navigate = useNavigate();
  const priorityColor = PRIORITY_COLORS[ticket.priority] || 'var(--text-muted)';
  const isBreached = ticket.slaMins != null && ticket.slaMins < 0;

  return (
    <div
      onClick={() => onView?.(ticket)}
      className={`relative flex flex-col rounded-[14px] border bg-surface-elevated shadow-card-subtle overflow-hidden transition-all duration-300 hover:shadow-[0_6px_24px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 group cursor-pointer ${
        isBreached ? 'border-negative/30 hover:border-negative/50 bg-negative/[0.01]' : 'border-border/25 hover:border-border/55'
      }`}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 h-[3px] w-full"
        style={{ background: priorityColor }}
      />

      <div className="flex flex-col gap-3.5 p-5 pt-6">
        {/* Row 1: ID + Status + Priority */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="font-mono font-semibold text-[12px] text-brand tracking-tight">
            #{ticket.id}
          </span>
          <div className="flex items-center gap-1.5">
            <PriorityBadge value={ticket.priority} />
            <SupportStatusBadge value={ticket.status} />
          </div>
        </div>

        {/* Row 2: Subject */}
        <div className="min-w-0">
          <h4 className="text-[13.5px] font-semibold text-text/90 font-heading leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {ticket.subject}
          </h4>
          <div className="mt-2 flex flex-wrap gap-1">
            {(ticket.tags || []).map((tag) => (
              <span key={tag} className="rounded-[4px] border border-border/15 px-1.5 py-0.5 font-mono text-[10px] text-text-muted/70 bg-bg/30">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Row 3: User Cell */}
        <div className="flex items-center gap-2.5 rounded-[10px] bg-bg/25 border border-border/10 p-2.5">
          <UserAvatar name={ticket.user} />
          <div className="min-w-0 flex-1">
            <div className="text-[12.5px] font-semibold text-text/85 truncate font-heading">{ticket.user}</div>
            <div className="text-[11px] font-mono text-text-muted/75 truncate mt-0.5">{ticket.uid} · {ticket.region}</div>
          </div>
        </div>

        {/* Row 4: Category & SLA */}
        <div className="flex items-center justify-between gap-3 border-t border-border/10 pt-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted/70">Type</span>
            <CatTag value={ticket.category} />
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted/70">Due</span>
            <SlaBar pct={ticket.sla} slaMins={ticket.slaMins} />
          </div>
        </div>

        {/* Row 5: Assignee & Replies */}
        <div className="flex items-center justify-between gap-3 border-t border-border/10 pt-3">
          <div className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: ticket.owner === 'Unassigned' ? 'var(--negative)' : 'var(--positive)' }}
            />
            <span className="text-[11px] font-semibold text-text-muted/75 truncate max-w-[150px]">
              {ticket.owner === 'Unassigned' ? 'Unassigned' : `${ticket.owner}`}
            </span>
          </div>
          {ticket.replies > 0 && (
            <span className="flex items-center gap-1 text-[11px] text-text-muted/70 font-mono">
              <MessageCircle size={10} /> {ticket.replies}
            </span>
          )}
        </div>
      </div>

      {/* Footer Quick Actions */}
      <div className="flex items-center justify-between gap-2 px-5 py-3.5 border-t border-border/12 bg-bg/15 mt-auto">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); navigate(`/admin/support/tickets/${ticket.id}`, { state: { fromEscalated: ticket.status === 'ESCALATED' } }); }}
          className="flex items-center gap-1 h-8 px-3 rounded-[8px] bg-brand text-text-on-accent text-[11.5px] font-semibold uppercase tracking-[0.05em] hover:brightness-110 transition-all cursor-pointer"
        >
          <Eye size={11} /> Open
        </button>

        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onAssign?.(ticket)}
            className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-cyan/20 text-cyan/50 hover:bg-cyan/8 hover:text-cyan cursor-pointer transition-colors"
            title="Assign"
          >
            <UserPlus size={11} />
          </button>
          {showEscalate && (
            <button
              type="button"
              onClick={() => onEscalate?.(ticket)}
              className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-orange-500/20 text-orange-400/60 hover:bg-orange-400/8 hover:text-orange-400 cursor-pointer transition-colors"
              title="Escalate"
            >
              <ArrowUp size={11} />
            </button>
          )}
          <button
            type="button"
            onClick={() => onResolve?.(ticket)}
            className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-positive/20 text-positive/50 hover:bg-positive/8 hover:text-positive cursor-pointer transition-colors"
            title="Resolve"
          >
            <Check size={11} />
          </button>
        </div>
      </div>
    </div>
  );
}
