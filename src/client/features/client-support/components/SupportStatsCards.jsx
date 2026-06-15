import React from 'react';
import { KpiCard } from '@/components/cards';

export function SupportStatsCards({ stats = [], loading = false }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-[10px] bg-surface-elevated border border-border/30 animate-pulse" />
        ))}
      </div>
    );
  }

  // Helper to resolve HSL color variables based on metric ID
  const getColorVar = (id) => {
    if (id === 'open') return 'var(--brand)';
    if (id === 'pending') return 'var(--warning)';
    if (id === 'resolved') return 'var(--positive)';
    return 'var(--purple)';
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      {stats.map((s) => (
        <KpiCard
          key={s.id}
          label={s.label}
          value={s.value}
          accent={getColorVar(s.id)}
          Icon={s.Icon}
        />
      ))}
    </div>
  );
}

export default SupportStatsCards;

