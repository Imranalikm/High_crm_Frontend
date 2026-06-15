import React from 'react';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

/**
 * Canonical KPI Card — used by Dashboard, Users, and Finance sections.
 *
 * Props:
 *   label    — string, the metric name (shown as small caps label)
 *   value    — string | number, the primary display value
 *   accent   — CSS color string (e.g. 'var(--brand)' or '#4ae176')
 *   Icon     — Lucide icon component
 *   sub      — string, secondary description text (optional)
 *   trend    — string, e.g. '+3.2%' or '61' (optional)
 *   trendUp  — bool, true = green arrow, false = red arrow (optional, if omitted no arrow)
 */
export function KPICard({ label, value, accent = 'var(--brand)', Icon, sub, trend, trendUp }) {
  const hasTrend = trend !== undefined && trend !== null && trend !== 'stable';
  const isStable = trend === 'stable';

  return (
    <div className="relative flex flex-col gap-2 rounded-[10px] border border-border/40 bg-surface-elevated shadow-card-subtle p-4 overflow-hidden group hover:border-border/60 transition-all duration-300">
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 h-[2px] w-full"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
      />

      {/* Label + Icon */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-black uppercase tracking-[0.12em] text-text-muted select-none">
          {label}
        </span>
        {Icon && (
          <span
            className="flex h-7 w-7 items-center justify-center rounded-[8px] transition-transform duration-300 group-hover:scale-110"
            style={{ background: `color-mix(in srgb, ${accent} 12%, transparent)` }}
          >
            <Icon size={14} style={{ color: accent }} />
          </span>
        )}
      </div>

      {/* Value */}
      <div className="text-[28px] font-black tracking-[-0.04em] font-mono text-text leading-none mt-1">
        {value}
      </div>

      {/* Trend + sub */}
      <div className="flex items-center gap-1.5 mt-0.5">
        {hasTrend ? (
          <>
            {trendUp === true && <ArrowUpRight size={11} className="text-positive shrink-0" />}
            {trendUp === false && <ArrowDownRight size={11} className="text-negative shrink-0" />}
            <span
              className="text-[11px] font-black font-mono tracking-wider"
              style={{ color: trendUp === true ? 'var(--positive)' : trendUp === false ? 'var(--negative)' : 'var(--text-muted)' }}
            >
              {trend}
            </span>
          </>
        ) : isStable ? (
          <Activity size={11} className="text-text-muted shrink-0" />
        ) : null}
        {sub && (
          <span className="text-[10.5px] text-text-muted leading-none">{sub}</span>
        )}
      </div>
    </div>
  );
}

export { KPICard as KpiCard };
