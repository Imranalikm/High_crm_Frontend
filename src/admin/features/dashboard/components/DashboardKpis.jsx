import React from 'react';
import { KpiCard } from '@/components/cards';
import {
  DollarSign, Users, FileCheck, Wallet, BarChart2, Wifi,
} from 'lucide-react';

const KPI_DATA = [
  { label: 'Platform Equity', value: '$42.8M', trend: '+3.2%', trendUp: true, sub: 'vs yesterday', Icon: DollarSign, accent: 'var(--brand)' },
  { label: 'Active Traders', value: '1,847', trend: '+61', trendUp: true, sub: 'since 00:00 UTC', Icon: Users, accent: 'var(--positive)' },
  { label: 'KYC Backlog', value: '73', trend: '+12', trendUp: false, sub: 'awaiting review', Icon: FileCheck, accent: 'var(--warning)' },
  { label: 'Pending W/D', value: '28', trend: '$184k', trendUp: false, sub: 'total exposure', Icon: Wallet, accent: 'var(--negative)' },
  { label: '24H Volume', value: '$9.14M', trend: '-5.8%', trendUp: false, sub: 'vs prior 24h', Icon: BarChart2, accent: 'var(--purple)' },
  { label: 'Live Connections', value: '3,291', trend: 'stable', sub: 'across 14 servers', Icon: Wifi, accent: 'var(--cyan)' },
];

export function DashboardKpis() {
  return (
    <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {KPI_DATA.map((k) => (
        <KpiCard key={k.label} {...k} />
      ))}
    </section>
  );
}
