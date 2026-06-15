import React from 'react';
import { KpiCard } from '@/components/cards';

export function PropStatsCards({ kpis }) {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpis.map(k => (
        <KpiCard
          key={k.label}
          label={k.label}
          value={k.value}
          Icon={k.Icon}
          accent={k.color}
          trend={k.trend}
          trendUp={k.trend ? !k.trend.startsWith('-') : undefined}
          sub={k.sub}
        />
      ))}
    </section>
  );
}
