import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Wallet, TrendingUp, TrendingDown, ShieldAlert, Radio } from 'lucide-react';
import { KpiCard } from '@/components/cards';
import { useLiveMt5Accounts, withLive } from '@/shared/hooks/useLiveMt5Accounts';
import { formatCurrency } from '../hooks/useDashboardData';

/**
 * Live MT5 totals across all CRM client accounts, streamed from the MT5 feed.
 * Accounts with no live data yet fall back to their stored balance.
 */
export function DashboardMt5Live({ accounts = [], loading }) {
  const navigate = useNavigate();
  const { byLogin, feedConnected } = useLiveMt5Accounts();

  const t = useMemo(() => {
    const sum = { balance: 0, equity: 0, floating: 0, margin: 0, live: 0, atRisk: 0 };
    accounts.forEach((row) => {
      const a = withLive(row, byLogin);
      const bal = Number(a.balance) || 0;
      sum.balance += bal;
      if (a.isLive) {
        sum.live += 1;
        sum.equity += Number(a.equity) || 0;
        sum.floating += Number(a.floating) || 0;
        sum.margin += Number(a.margin) || 0;
        // margin level under 150% with margin in use = close to stop-out
        if (Number(a.margin) > 0 && Number(a.marginLevel) < 150) sum.atRisk += 1;
      } else {
        sum.equity += bal;
      }
    });
    return sum;
  }, [accounts, byLogin]);

  if (loading) {
    return (
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-[110px] rounded-[10px] border border-border/20 bg-surface-elevated/50 animate-pulse" />
        ))}
      </section>
    );
  }

  const floatUp = t.floating >= 0;
  const cards = [
    {
      label: 'Client Equity (MT5)',
      value: formatCurrency(t.equity),
      Icon: Activity,
      accent: 'var(--brand)',
      sub: `${t.live} of ${accounts.length} accounts live`,
    },
    {
      label: 'Client Balance (MT5)',
      value: formatCurrency(t.balance),
      Icon: Wallet,
      accent: 'var(--cyan)',
      sub: 'excluding open positions',
    },
    {
      label: 'Floating P/L',
      value: `${floatUp ? '+' : ''}${formatCurrency(t.floating)}`,
      Icon: floatUp ? TrendingUp : TrendingDown,
      accent: floatUp ? 'var(--positive)' : 'var(--negative)',
      sub: 'open positions, live',
    },
    {
      label: 'Margin In Use',
      value: formatCurrency(t.margin),
      Icon: ShieldAlert,
      accent: t.atRisk > 0 ? 'var(--negative)' : 'var(--warning)',
      sub: t.atRisk > 0 ? `${t.atRisk} account${t.atRisk > 1 ? 's' : ''} below 150% margin` : 'no accounts at risk',
    },
    {
      label: 'MT5 Live Feed',
      value: feedConnected === null ? 'Connecting…' : feedConnected ? 'Connected' : 'Offline',
      Icon: Radio,
      accent: feedConnected === false ? 'var(--negative)' : 'var(--positive)',
      sub: feedConnected === false ? 'showing last stored balances' : 'balances update in real time',
    },
  ];

  return (
    <section>
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-text-muted">
          <span className={`w-1.5 h-1.5 rounded-full ${feedConnected ? 'bg-positive animate-pulse' : 'bg-text-muted/40'}`} />
          MT5 Trading Accounts · Live
        </h3>
        <button
          type="button"
          onClick={() => navigate('/admin/trading/accounts')}
          className="text-[11.5px] font-semibold text-brand hover:underline cursor-pointer"
        >
          View accounts
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        {cards.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>
    </section>
  );
}

export default DashboardMt5Live;
