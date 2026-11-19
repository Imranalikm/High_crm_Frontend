import React, { useState, useEffect, useMemo } from 'react';
import { KpiCard } from '@/components/cards';
import {
  Wallet, TrendingUp, Shield, BarChart2,
  PieChart, Target
} from 'lucide-react';
import { apiClient } from '@/shared/api/client/apiClient';
import { useLiveMt5Accounts, withLive } from '@/shared/hooks/useLiveMt5Accounts';

export function ClientKpis() {
  const [mt5Accounts, setMt5Accounts] = useState([]);
  const { byLogin } = useLiveMt5Accounts();

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await apiClient.get('/mt5-accounts');
        const accounts = response?.data || response || [];
        const arr = Array.isArray(accounts) ? accounts : [];
        setMt5Accounts(arr);
      } catch (err) {
        console.error('Error fetching mt5 accounts for KPIs:', err);
      }
    };
    fetchAccount();
  }, []);

  // Totals across all of the client's MT5 accounts, live values when available
  const { balance, equity, freeMargin, floating } = useMemo(() => {
    const t = { balance: 0, equity: 0, freeMargin: 0, floating: 0 };
    mt5Accounts.forEach((acc) => {
      const a = withLive(acc, byLogin);
      const bal = parseFloat(a.balance || 0);
      t.balance += bal;
      t.equity += a.isLive ? parseFloat(a.equity || 0) : bal;
      t.freeMargin += a.isLive ? parseFloat(a.marginFree || 0) : bal;
      t.floating += a.isLive ? parseFloat(a.floating || 0) : 0;
    });
    return t;
  }, [mt5Accounts, byLogin]);

  const todayPnl = floating;
  const todayPnlPct = balance ? ((floating / balance) * 100).toFixed(2) : 0;

  // Placeholders for MT5 metrics not yet available via API
  const openPositions = 0;
  const winRate = 0;
  const totalTrades = 0;
  const currency = 'USD';

  const pnlPos = todayPnl >= 0;

  const KPI_DATA = [
    {
      label:   'Balance',
      value:   `$${balance.toLocaleString('en-US', {minimumFractionDigits: 2})}`,
      trend:   'stable',
      sub:     `USD · ${currency}`,
      Icon:    Wallet,
      accent:  'var(--brand)',
    },
    {
      label:   'Equity',
      value:   `$${equity.toLocaleString('en-US', {minimumFractionDigits: 2})}`,
      trend:   '+0.0%',
      trendUp: true,
      sub:     'floating included',
      Icon:    TrendingUp,
      accent:  'var(--positive)',
    },
    {
      label:   'Free Margin',
      value:   `$${freeMargin.toLocaleString('en-US', {minimumFractionDigits: 2})}`,
      trend:   'stable',
      sub:     'available to trade',
      Icon:    Shield,
      accent:  'var(--cyan)',
    },
    {
      label:   'Floating P/L',
      value:   `${pnlPos ? '+' : '-'}$${Math.abs(todayPnl).toLocaleString('en-US', {minimumFractionDigits: 2})}`,
      trend:   `${pnlPos ? '+' : ''}${todayPnlPct}%`,
      trendUp: pnlPos,
      sub:     'floating live',
      Icon:    BarChart2,
      accent:  pnlPos ? 'var(--positive)' : 'var(--negative)',
    },
    {
      label:   'Open Positions',
      value:   openPositions.toString(),
      trend:   'active',
      trendUp: true,
      sub:     'across markets',
      Icon:    PieChart,
      accent:  'var(--purple)',
    },
    {
      label:   'Win Rate',
      value:   `${winRate}%`,
      trend:   `+0.0%`,
      trendUp: true,
      sub:     `${totalTrades} total trades`,
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
