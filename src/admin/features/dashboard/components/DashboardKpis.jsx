import React from 'react';
import { KpiCard } from '@/components/cards';
import {
  Users, FileCheck, Wallet, ArrowDownRight, LifeBuoy,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '../hooks/useDashboardData';

/**
 * DashboardKpis — Displays real-time KPI cards from backend data.
 */
export function DashboardKpis({ kpis, loading }) {
  if (loading || !kpis) {
    return (
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-[110px] rounded-[10px] border border-border/20 bg-surface-elevated/50 animate-pulse"
          />
        ))}
      </section>
    );
  }

  const KPI_DATA = [
    {
      label: 'Total Users',
      value: formatNumber(kpis.totalUsers),
      Icon: Users,
      accent: 'var(--brand)',
      sub: 'registered users',
    },
    {
      label: 'Pending KYC',
      value: formatNumber(kpis.pendingKyc),
      Icon: FileCheck,
      accent: kpis.pendingKyc > 0 ? 'var(--warning)' : 'var(--positive)',
      sub: 'awaiting review',
      trend: kpis.pendingKyc > 0 ? `${kpis.pendingKyc}` : null,
      trendUp: false,
    },
    {
      label: 'Pending Deposits',
      value: formatNumber(kpis.pendingDepositsCount),
      Icon: ArrowDownRight,
      accent: kpis.pendingDepositsCount > 0 ? 'var(--warning)' : 'var(--positive)',
      sub: kpis.pendingDepositsAmount > 0 ? formatCurrency(kpis.pendingDepositsAmount) : 'all clear',
    },
    {
      label: 'Pending Withdrawals',
      value: formatNumber(kpis.pendingWithdrawalsCount),
      Icon: Wallet,
      accent: kpis.pendingWithdrawalsCount > 0 ? 'var(--negative)' : 'var(--positive)',
      sub: kpis.pendingWithdrawalsAmount > 0 ? formatCurrency(kpis.pendingWithdrawalsAmount) : 'all clear',
    },
    {
      label: 'Open Tickets',
      value: formatNumber(kpis.openTickets),
      Icon: LifeBuoy,
      accent: kpis.openTickets > 5 ? 'var(--negative)' : kpis.openTickets > 0 ? 'var(--warning)' : 'var(--positive)',
      sub: 'support requests',
    },
  ];

  return (
    <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
      {KPI_DATA.map((k) => (
        <KpiCard key={k.label} {...k} />
      ))}
    </section>
  );
}
