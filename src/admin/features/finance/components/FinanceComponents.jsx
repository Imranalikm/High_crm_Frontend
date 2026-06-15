/**
 * finance/components/FinanceComponents.jsx
 * Shared UI atoms for the Finance feature.
 *
 * All generic primitives (badges, cards, icons) are re-exported from
 * the canonical component layer. Only Finance-specific atoms live here.
 */
import React, { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { PRIORITY_CLR, METHOD_ICONS, METHOD_LABELS } from '@/config/constants/finance/mockData';

// Re-export canonical components
export { StatusChip as StatusBadge, RiskChip as RiskBadge, PriorityChip, SectionHead, Card, ActionBtn as IconBtn } from '@/components/ui';
export { KpiCard } from '@/components/cards';
// Pagination is now canonical — Finance pages can import from here or from FinanceDrawer
export { Pagination } from '@/components/common/table';

/* ── Finance-specific: PriorityBadge ────────────────────────── */
function PriorityBadge({ value }) {
  const color = PRIORITY_CLR[value] || 'var(--text-muted)';
  return (
    <span className="inline-flex items-center gap-1.5 rounded-[5px] px-2 py-[3px] text-[10px] font-bold uppercase tracking-[0.14em] whitespace-nowrap font-heading"
      style={{ color, background: `color-mix(in srgb, ${color} 10%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 22%, transparent)` }}>
      <span className={`w-1 h-1 rounded-full flex-shrink-0 ${value === 'CRITICAL' ? 'animate-pulse' : ''}`} style={{ background: color }} />
      {value}
    </span>
  );
}

/* ── Finance-specific: MethodBadge ───────────────────────────── */
function MethodBadge({ value }) {
  const Icon = METHOD_ICONS[value];
  const displayLabel = METHOD_LABELS[value] || value;
  return (
    <span className="inline-flex items-center gap-1.5 text-[11.5px] font-heading font-semibold text-text-muted/80">
      {Icon ? <Icon size={12} className="flex-shrink-0 text-text-muted/55" /> : null}
      {displayLabel}
    </span>
  );
}

/* ── Finance-specific: AmountCell ────────────────────────────── */
function AmountCell({ value, type }) {
  const isCredit = value?.startsWith('+') || type === 'DEPOSIT' || type === 'COMMISSION' || type === 'REVERSAL' || type === 'ADJUSTMENT';
  const isDebit  = value?.startsWith('-') || type === 'WITHDRAWAL' || type === 'FEE';
  const color    = isCredit ? 'var(--positive)' : isDebit ? 'var(--negative)' : 'var(--text)';
  return <span className="font-mono font-bold text-[13px] leading-none" style={{ color }}>{value}</span>;
}

/* ── Finance-specific: Toast ─────────────────────────────────── */
function Toast({ msg, onDone }) {
  useEffect(() => { if (msg) { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); } }, [msg, onDone]);
  if (!msg) return null;
  return (
    <div className="flex items-center gap-2 rounded-[9px] border border-positive/20 bg-positive/[0.07] px-4 py-2.5 text-[12px] font-semibold text-positive font-heading animate-in fade-in">
      <CheckCircle2 size={13} />{msg}
    </div>
  );
}

/* ── Finance-specific: SummaryPills ──────────────────────────── */
function SummaryPills({ items }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {items.map(p => (
        <div key={p.label} className="flex items-center gap-2 rounded-[8px] border border-border/20 bg-surface-bright/10 px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span className="text-[11.5px] text-text-muted/80 font-heading">{p.label}</span>
          <span className="text-[12px] font-mono font-bold leading-none" style={{ color: p.color }}>{p.val}</span>
        </div>
      ))}
    </div>
  );
}

export {
  PriorityBadge, MethodBadge, AmountCell,
  Toast, SummaryPills,
};
