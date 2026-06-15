import React from 'react';
import { KpiCard } from './KpiCard';

/**
 * MetricGrid — a responsive grid of KPI cards.
 * Wraps the canonical KpiCard for use across Trading, Support, Reports, IB, etc.
 *
 * Each metric object:
 *   { label, value, subtext, trend, icon, accent }
 *   trend: 'up' | 'down' | 'neutral' | string value e.g. '+3.2%'
 */
export function MetricGrid({ metrics }) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        // Map StatCard-style trend string to KpiCard trendUp bool
        const isTrendUp = metric.trend === 'up' || metric.trend === 'positive';
        const isTrendDown = metric.trend === 'down' || metric.trend === 'danger' || metric.trend === 'negative';
        const trendStr = (metric.trend && metric.trend !== 'up' && metric.trend !== 'down' &&
          metric.trend !== 'positive' && metric.trend !== 'neutral' && metric.trend !== 'danger')
          ? metric.trend
          : undefined;

        return (
          <KpiCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            sub={metric.subtext}
            trend={trendStr}
            trendUp={trendStr ? isTrendUp : (!isTrendDown && isTrendUp ? true : isTrendDown ? false : undefined)}
            Icon={metric.icon}
            accent={metric.accent ?? 'var(--brand)'}
          />
        );
      })}
    </div>
  );
}
