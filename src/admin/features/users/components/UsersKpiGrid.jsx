import React from 'react';
import { KpiCard } from '@/components/cards';

export function UsersKPIGrid({ items }) {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <KpiCard
          key={item.label}
          label={item.label}
          value={item.value}
          accent={item.accent}
          Icon={item.Icon}
          sub={item.subtext}
          trend={item.trend}
          trendUp={item.positive}
        />
      ))}
    </section>
  );
}
