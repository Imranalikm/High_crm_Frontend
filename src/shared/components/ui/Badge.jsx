import React from 'react';
import { STATUS_COLORS, RISK_COLORS, PRIORITY_COLORS, CATEGORY_COLORS } from '@/config/constants/status.constants';

/**
 * Badge — THE single status/badge component for the entire app.
 *
 * Usage A (variant-based):
 *   <Badge variant="success" dot>VERIFIED</Badge>
 *
 * Usage B (colorMap-based, for Finance chips):
 *   <Badge colorMap={STATUS_COLOR} value="PENDING">PENDING</Badge>
 *
 * Usage C (StatusChip-style — value + optional colorMap):
 *   <StatusChip value="APPROVED" />
 *   <StatusChip value="HIGH" colorMap={RISK_COLORS} dot={false} />
 */
export function Badge({
  children,
  value,
  variant = 'info',
  size = 'md',
  className = '',
  dot = false,
  colorMap,
  ...props
}) {
  const content = children ?? value;
  const baseStyles =
    'inline-flex items-center justify-center font-semibold uppercase tracking-[0.12em] rounded-[5px] px-2 py-0.5';

  /* If a colorMap is provided, derive colors from it directly */
  if (colorMap) {
    const col = colorMap[content] ??
      colorMap[String(content)] ?? { c: 'var(--text-muted)', bg: 'var(--bg)', border: 'transparent' };
    return (
      <span
        className={`${baseStyles} text-[10px] font-black ${className}`}
        style={{
          color: col.c,
          background: col.bg,
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: col.border ?? `color-mix(in srgb, ${col.c} 25%, transparent)`,
        }}
        {...props}
      >
        {dot && <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 shrink-0" />}
        {content}
      </span>
    );
  }

  /* Variant-based (original behavior) */
  const variants = {
    info: 'bg-primary/10 text-primary border border-primary/20',
    success: 'bg-positive/10 text-positive border border-positive/20',
    warning: 'bg-warning/10 text-warning border border-warning/20',
    danger: 'bg-negative/10 text-negative border border-negative/20',
    muted: 'bg-surface/50 text-text-muted border border-border/40',
  };

  const sizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-[11px]',
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant] ?? variants.info} ${sizes[size] ?? sizes.md} ${className}`}
      {...props}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 shrink-0" />}
      {content}
    </span>
  );
}

/**
 * StatusChip — canonical status pill. Merged from StatusChip.jsx.
 *
 * Usage:
 *   <StatusChip value="APPROVED" />
 *   <StatusChip value="HIGH" colorMap={RISK_COLORS} dot={false} />
 *   <StatusChip value="CRITICAL" colorMap={PRIORITY_COLORS} dot />
 */
export function StatusChip({ value, colorMap, size = 'sm', dot = true, className = '' }) {
  const map   = colorMap ?? STATUS_COLORS;
  const color = map[value] || 'var(--text-muted)';
  const cls   = size === 'lg' ? 'px-2.5 py-1 text-[11px]' : 'px-2 py-[3px] text-[9.5px]';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[5px] font-black uppercase tracking-[0.09em] whitespace-nowrap font-heading ${cls} ${className}`}
      style={{
        color,
        background: `color-mix(in srgb, ${color} 10%, transparent)`,
        border:     `1px solid color-mix(in srgb, ${color} 20%, transparent)`,
      }}
    >
      {dot && (
        <span
          className={`h-1 w-1 rounded-full flex-shrink-0 ${value === 'CRITICAL' ? 'animate-pulse' : ''}`}
          style={{ background: color }}
        />
      )}
      {value}
    </span>
  );
}

/** RiskChip — convenience wrapper using RISK_COLORS without dot */
export function RiskChip({ value, size }) {
  return <StatusChip value={value} colorMap={RISK_COLORS} dot={false} size={size} />;
}

/** PriorityChip — convenience wrapper using PRIORITY_COLORS with animated dot */
export function PriorityChip({ value, size }) {
  return <StatusChip value={value} colorMap={PRIORITY_COLORS} dot size={size} />;
}

/** CatChip — category tag (Support) using CATEGORY_COLORS */
export function CatChip({ value }) {
  const color = CATEGORY_COLORS[value] || 'rgba(255,255,255,0.35)';
  return (
    <span
      className="inline-flex items-center rounded-[5px] px-1.5 py-[2px] text-[9px] font-bold uppercase tracking-[0.09em] whitespace-nowrap font-heading"
      style={{
        color,
        background: `color-mix(in srgb, ${color} 10%, transparent)`,
        border:     `1px solid color-mix(in srgb, ${color} 18%, transparent)`,
      }}
    >
      {value}
    </span>
  );
}

/**
 * StatusBadge — backward-compatible alias. Uses StatusChip internally.
 * <StatusBadge status="APPROVED" />
 */
export function StatusBadge({ status, dot = true, className = '', size }) {
  return <StatusChip value={status} dot={dot} className={className} size={size} />;
}
