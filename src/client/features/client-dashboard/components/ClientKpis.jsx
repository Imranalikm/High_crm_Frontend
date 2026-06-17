import React, { useState, useEffect } from 'react';
import { KpiCard } from '@/components/cards';
import {
  Wallet, TrendingUp, Shield, BarChart2,
  PieChart, Target
} from 'lucide-react';
import { apiClient } from '@/shared/api/client/apiClient';

export function ClientKpis() {
  const [mt5Account, setMt5Account] = useState(null);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await apiClient.get('/mt5-accounts');
        const accounts = response?.data || response || [];
        const arr = Array.isArray(accounts) ? accounts : [];
        if (arr.length > 0) {
          setMt5Account(arr[0]);
        }
      } catch (err) {
        console.error('Error fetching mt5 accounts for KPIs:', err);
      }
    };
    fetchAccount();
  }, []);

  const balance = parseFloat(mt5Account?.balance || 0);
  const equity = balance; 
  const freeMargin = balance;
  
  // Placeholders for real-time MT5 metrics not yet available via API
  const todayPnl = 0;
  const todayPnlPct = 0;
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
      label:   "Today's PnL",
      value:   `${pnlPos ? '+' : ''}$${todayPnl.toLocaleString('en-US', {minimumFractionDigits: 2})}`,
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
