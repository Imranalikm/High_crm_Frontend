/**
 * IBComponents — re-exports canonical shared UI from components/ui/FeatureUI.
 * IB-specific components (IBTierBadge, TraderAvatar, IBChartTip, IBDrawerFormGrid)
 * remain here since they are only used in the IB System feature.
 */
import React from 'react';
import { Star } from 'lucide-react';
import { IB_TIER_COLORS } from '@/config/constants/status.constants';
import { STATUS_CLR, TIER_CLR } from '@/config/constants/ib-system/workspaces/shared.workspace';

// ── Re-export canonical shared primitives ──────────────────────
export { StatusChip as IBBadge, RiskChip as IBRiskBadge, SectionHead, ActionBtn as IBIconBtn, ActionToast as IBToast, TableActionBtn } from '@/components/ui';

// ── IBCard (IB-specific card wrapper) ─────────────────────────
export function IBCard({ children, className = '', pad = true }) {
  return (
    <div className={`rounded-[10px] border border-border/40 bg-surface-elevated shadow-card-subtle ${pad ? 'p-5' : ''} ${className}`}>
      {children}
    </div>
  );
}

// ── IBTierBadge (IB-specific — uses tier color map) ───────────
export function IBTierBadge({ value }) {
  const color = TIER_CLR[value] || IB_TIER_COLORS[value] || 'rgba(255,255,255,0.4)';
  return (
    <span
      className="inline-flex items-center gap-1 rounded-[5px] px-2 py-[3px] text-[11px] font-semibold uppercase tracking-[0.05em] whitespace-nowrap font-heading"
      style={{
        color,
        background: `color-mix(in srgb, ${color} 12%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 22%, transparent)`,
      }}
    >
      <Star size={10} className="flex-shrink-0" /> {value}
    </span>
  );
}

// ── TraderAvatar (IB/Prop shared initials avatar) ─────────────
export function TraderAvatar({ name }) {
  const initials = (name || '?')
    .replace('unknown-', '')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="w-6 h-6 rounded-[5px] bg-primary/[0.1] border border-primary/[0.18] flex items-center justify-center text-[9px] font-bold text-primary font-heading flex-shrink-0">
      {initials}
    </div>
  );
}

// ── IBDrawerFormGrid (IB-specific grid wrapper) ───────────────────
export function IBDrawerFormGrid({ children }) {
  return <div className="grid grid-cols-2 gap-2">{children}</div>;
}

// ── IBChartTip (IB-specific chart tooltip) ────────────────────
export function IBChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const fmt = (k, v) =>
    k === 'approved' || k === 'pending'
      ? `$${(v / 1000).toFixed(0)}K`
      : v?.toLocaleString?.() ?? v;
  return (
    <div className="rounded-[10px] border border-border/40 bg-surface-elevated shadow-lg px-3 py-2.5 text-[11px] font-mono">
      <div className="text-[9px] font-black uppercase tracking-widest text-text-muted/50 mb-1.5 font-heading">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span className="text-text-muted/60 capitalize">{String(p.dataKey).replace(/_/g, ' ')}</span>
          <span className="font-semibold ml-1" style={{ color: p.color }}>{fmt(p.dataKey, p.value)}</span>
        </div>
      ))}
    </div>
  );
}
