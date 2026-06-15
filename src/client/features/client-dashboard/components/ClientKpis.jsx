import React from 'react';
import { KpiCard } from '@/components/cards';
import {
  Wallet, TrendingUp, Shield, BarChart2,
  PieChart, Target
} from 'lucide-react';

const ACCOUNT = {
  balance: 84200,
  equity: 86140,
  freeMargin: 81930,
  todayPnl: 1940,
  todayPnlPct: 2.31,
  openPositions: 3,
  winRate: 68.4,
  totalTrades: 284,
  currency: 'USD'
};

export function ClientKpis() {
  const pnlPos = ACCOUNT.todayPnl >= 0;

  const KPI_DATA = [
    {
      label:   'Balance',
      value:   `$${ACCOUNT.balance.toLocaleString()}`,
      trend:   'stable',
      sub:     `USD · ${ACCOUNT.currency}`,
      Icon:    Wallet,
      accent:  'var(--brand)',
    },
    {
      label:   'Equity',
      value:   `$${ACCOUNT.equity.toLocaleString()}`,
      trend:   '+2.3%',
      trendUp: true,
      sub:     'floating included',
      Icon:    TrendingUp,
      accent:  'var(--positive)',
    },
    {
      label:   'Free Margin',
      value:   `$${ACCOUNT.freeMargin.toLocaleString()}`,
      trend:   'stable',
      sub:     'available to trade',
      Icon:    Shield,
      accent:  'var(--cyan)',
    },
    {
      label:   "Today's PnL",
      value:   `${pnlPos ? '+' : ''}$${ACCOUNT.todayPnl.toLocaleString()}`,
      trend:   `${pnlPos ? '+' : ''}${ACCOUNT.todayPnlPct}%`,
      trendUp: pnlPos,
      sub:     'floating live',
      Icon:    BarChart2,
      accent:  pnlPos ? 'var(--positive)' : 'var(--negative)',
    },
    {
      label:   'Open Positions',
      value:   ACCOUNT.openPositions.toString(),
      trend:   'active',
      trendUp: true,
      sub:     'across markets',
      Icon:    PieChart,
      accent:  'var(--purple)',
    },
    {
      label:   'Win Rate',
      value:   `${ACCOUNT.winRate}%`,
      trend:   `+0.8%`,
      trendUp: true,
      sub:     `${ACCOUNT.totalTrades} total trades`,
      Icon:    Target,
      accent:  'var(--warning)',
    },
  ];

  return (
    <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {KPI_DATA.map((k) => (
        <KpiCard key={k.label} {...k} />
      ))}
    </section>
  );
}
export default ClientKpis;
