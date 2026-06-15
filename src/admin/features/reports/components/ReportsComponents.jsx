/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { FileText, FileSpreadsheet, Table as TableIcon, FileJson } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { SEV_CLR } from '@/config/constants/status.constants';

export { SEV_CLR };

export const STATUS_CLR = {
  READY: { c: 'var(--positive)', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.2)' },
  SCHEDULED: { c: 'var(--warning)', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' },
  FAILED: { c: 'var(--negative)', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' },
  PROCESSING: { c: 'var(--cyan)', bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.2)' },
  QUEUED: { c: 'var(--warning)', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' },
  SUCCESS: { c: 'var(--positive)', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.2)' },
  ACTIVE: { c: 'var(--positive)', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.2)' },
  PAUSED: { c: 'var(--warning)', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' },
  PENDING: { c: 'var(--warning)', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' },
  VERIFIED: { c: 'var(--positive)', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.2)' },
  MIXED: { c: 'var(--warning)', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' },
};

export function ReportStatusBadge({ value }) {
  return <Badge colorMap={STATUS_CLR}>{value}</Badge>;
}

// Keep legacy name as alias for backwards compatibility
export { ReportStatusBadge as StatusBadge };



export const FORMAT_ICONS = { PDF: FileText, XLSX: FileSpreadsheet, CSV: TableIcon, JSON: FileJson };
export const FORMAT_CLR = { PDF: '#ef4444', XLSX: 'var(--positive)', CSV: 'var(--brand)', JSON: '#a78bfa' };
export const TYPE_CLR = { Finance: 'var(--brand)', Trading: 'var(--cyan)', User: '#a78bfa', System: 'rgba(255,255,255,0.35)' };

export function FormatBadge({ value }) {
  const Icon = FORMAT_ICONS[value] || FileText;
  const color = FORMAT_CLR[value] || 'var(--text-muted)';
  return (
    <span className="inline-flex items-center gap-1.5 rounded-[5px] px-2 py-[3px] text-[11px] font-semibold uppercase tracking-[0.05em] whitespace-nowrap"
      style={{ color, background: `color-mix(in srgb, ${color} 10%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 20%, transparent)` }}>
      <Icon size={10} className="flex-shrink-0" />{value}
    </span>
  );
}

export function TypePill({ value }) {
  const color = TYPE_CLR[value] || 'rgba(255,255,255,0.35)';
  return (
    <span className="inline-flex items-center rounded-[5px] px-2 py-[3px] text-[11px] font-semibold uppercase tracking-[0.05em] whitespace-nowrap"
      style={{ color, background: `color-mix(in srgb, ${color} 10%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 18%, transparent)` }}>
      {value}
    </span>
  );
}

export function IconBtn({ Icon: Ic, label, variant = 'default', onClick, small }) {
  const vs = {
    danger: { border: '1px solid rgba(239,68,68,0.22)', bg: 'rgba(239,68,68,0.07)', color: '#ef4444' },
    success: { border: '1px solid rgba(74,225,118,0.22)', bg: 'rgba(74,225,118,0.07)', color: 'var(--positive)' },
    warning: { border: '1px solid rgba(217,119,6,0.22)', bg: 'rgba(217,119,6,0.07)', color: '#d97706' },
    cyan: { border: '1px solid rgba(6,182,212,0.22)', bg: 'rgba(6,182,212,0.07)', color: 'var(--cyan)' },
    brand: { border: '1px solid rgba(218,165,32,0.25)', bg: 'rgba(218,165,32,0.09)', color: 'var(--brand)' },
    default: { border: '1px solid rgba(255,255,255,0.08)', bg: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)' },
  };
  const s = vs[variant] ?? vs.default;
  const h = small ? 'h-7 px-2.5 text-[10.5px]' : 'h-8 px-3 text-[11px]';
  return (
    <button onClick={onClick}
      className={`flex items-center gap-1.5 ${h} rounded-[7px] font-semibold font-heading transition-all duration-200 hover:brightness-110 active:scale-[0.97] cursor-pointer whitespace-nowrap`}
      style={{ border: s.border, background: s.bg, color: s.color }}>
      {Ic && <Ic size={small ? 11 : 12} />}{label}
    </button>
  );
}


