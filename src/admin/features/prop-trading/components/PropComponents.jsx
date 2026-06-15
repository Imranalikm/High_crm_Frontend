/**
 * PropComponents — re-exports canonical shared UI from components/ui/FeatureUI.
 * Feature-specific components (FormField, TextInput, SelectInput, Toggle, CustomTooltip)
 * remain here since they are only used in Prop Trading.
 */
/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { ChevronDown } from 'lucide-react';

// ── Re-export canonical shared primitives ──────────────────────
export { StatusChip as Badge, RiskChip as RiskBadge, SectionHead, ActionBtn as IconBtn, ActionToast } from '@/components/ui';

// STATUS_COLOR kept for backward compat (used in PropDrawer)
export const STATUS_COLOR = {
  PUBLISHED: 'var(--positive)', DRAFT: 'var(--text-muted)', PAUSED: 'var(--warning)',
  APPROVED:  'var(--positive)', REJECTED: 'var(--negative)', PENDING: 'var(--warning)',
  REVIEW:    'var(--cyan)',     ACTIVE: 'var(--positive)',  BREACHED: 'var(--negative)',
  WARNED:    'var(--warning)',  EXPIRED: 'var(--text-muted)', EXPIRING: 'var(--warning)',
  VERIFIED:  'var(--positive)', FAILED: 'var(--negative)',
};

// ── Prop-Trading-only Card wrapper ─────────────────────────────
export function Card({ children, className = '', pad = true }) {
  return (
    <div className={`bg-surface-elevated border border-border/40 shadow-card-subtle rounded-[10px] relative overflow-hidden transition-all duration-300 ${pad ? 'p-5' : ''} ${className}`}>
      {children}
    </div>
  );
}

// ── Form primitives (Prop Trading only) ───────────────────────
export function FormField({ label, children, hint }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted/70 font-heading">{label}</label>
      {children}
      {hint && <p className="text-[11.5px] text-text-muted/65 font-heading">{hint}</p>}
    </div>
  );
}

export function TextInput({ value, onChange, placeholder, mono, type = 'text', className = '' }) {
  return (
    <input
      type={type} value={value} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder}
      className={`w-full h-9 px-3 rounded-[9px] border border-white/[0.07] bg-white/[0.025] text-[13px] text-text outline-none placeholder:text-text-muted/25 focus:border-primary/30 transition-colors ${mono ? 'font-mono' : 'font-heading'} ${className}`}
    />
  );
}

export function SelectInput({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value} onChange={(e) => onChange?.(e.target.value)}
        className="w-full h-9 px-3 pr-8 rounded-[9px] border border-white/[0.07] bg-white/[0.025] text-[13px] text-text outline-none font-heading appearance-none cursor-pointer focus:border-primary/30 transition-colors"
      >
        {options.map((o) => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
      </select>
      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted/40 pointer-events-none" />
    </div>
  );
}

export function Toggle({ val, onChange, label, hint }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-white/[0.04] last:border-0">
      <div>
        <div className="text-[12.5px] font-semibold text-text/75 font-heading">{label}</div>
        {hint && <div className="text-[11.5px] text-text-muted/75 font-heading mt-0.5">{hint}</div>}
      </div>
      <button
        onClick={() => onChange(!val)}
        className={`relative w-10 h-5 rounded-full border flex-shrink-0 mt-0.5 transition-all duration-300 cursor-pointer ${val ? 'bg-positive/[0.15] border-positive/30' : 'bg-white/[0.03] border-white/[0.08]'}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${val ? 'translate-x-5 bg-positive' : 'translate-x-0.5 bg-text-muted/40'}`} />
      </button>
    </div>
  );
}

export function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[10px] border border-white/[0.1] bg-[var(--surface-elevated,#1a1a1a)] shadow-xl px-3 py-2.5 text-[11px] font-mono">
      <div className="text-[10.5px] font-bold uppercase tracking-widest text-text-muted/75 mb-1.5 font-heading">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span className="text-text-muted/75 capitalize">{String(p.dataKey).replace('_', ' ')}</span>
          <span className="font-semibold ml-1" style={{ color: p.color }}>
            {p.dataKey === 'payouts' ? `$${(p.value / 1000).toFixed(0)}K` : p.value}
            {(p.dataKey === 'pass' || p.dataKey === 'fail') ? '%' : ''}
          </span>
        </div>
      ))}
    </div>
  );
}
