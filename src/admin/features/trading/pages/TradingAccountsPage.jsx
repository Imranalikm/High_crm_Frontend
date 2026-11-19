import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  RefreshCw, Download,
  Wallet, Monitor, ShieldAlert, Radio, DollarSign,
} from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { KpiCard } from '@/components/cards';
import { TradingAccountCards } from '../components/TradingAccountCards';
import { TradingActivityLog } from '../components/TradingActivityLog';
import { tradingAccountsService } from '../services/tradingAccountsService';
import { useLiveMt5Accounts, withLive } from '@/shared/hooks/useLiveMt5Accounts';
import { isDemoAccount } from '@/shared/utils/mt5Accounts';
import { exportRows } from '@/utils/exporters';
import { useNavigate } from 'react-router-dom';

/* ─── Page metadata ─────────────────────────────────────────── */
const PAGE = {
  eyebrow:     'Trading',
  title:       'Trading Accounts',
  description: 'Manage trading accounts and balances. Balances, equity and margin update live from MT5.',
};

const FILTER_OPTIONS = [
  { id: 'ALL',          label: 'All Accounts' },
  { id: 'LIVE',         label: 'Live Only'    },
  { id: 'DISCONNECTED', label: 'Disconnected' },
  { id: 'BLOCKED',      label: 'Blocked'      },
];

/* ─── Helpers ─────────────────────────────────────────────── */
// Provisioned live accounts only: no pending/failed placeholders, no demo accounts
const isRealAccount = (r) =>
  r.accountid && !String(r.accountid).startsWith('PENDING-') && !isDemoAccount(r);

function formatMoney(num) {
  const n = Number(num) || 0;
  return `${n < 0 ? '-' : ''}$${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function timeAgo(ms, now) {
  if (!ms) return '—';
  const s = Math.max(0, Math.round((now - ms) / 1000));
  if (s < 5) return 'Just now';
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)} mins ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} hours ago`;
  return `${Math.floor(s / 86400)} days ago`;
}

/** DB row + live MT5 values -> the shape TradingAccountCards renders. */
function toCard(row, byLogin, now) {
  const a = withLive(row, byLogin);
  const balance = Number(a.balance) || 0;
  const equity = a.isLive ? Number(a.equity) || 0 : balance;
  const dbStatus = String(row.status || 'LIVE').toUpperCase();
  return {
    login:      String(row.accountid),
    user:       row.user?.name || row.contactName || (row.accountType === 'DEMO' ? 'Demo account' : '—'),
    uid:        row.userId ? `U-${row.userId}` : '—',
    server:     row.server || '—',
    group:      row.groupName,
    leverage:   String(row.leverage || '').includes(':') ? row.leverage : `1:${row.leverage || 100}`,
    equity:     formatMoney(equity),
    balance:    formatMoney(balance),
    margin:     formatMoney(a.isLive ? a.margin : 0),
    freeMargin: formatMoney(a.isLive ? a.marginFree : balance),
    marginLvl:  a.isLive && a.marginLevel ? `${Number(a.marginLevel).toFixed(0)}%` : '—',
    // A LIVE account we have no feed data for is shown as disconnected
    status:     dbStatus === 'LIVE' && !a.isLive ? 'DISCONNECTED' : dbStatus,
    lastSync:   a.isLive ? timeAgo(a.liveTime, now) : timeAgo(row.updatedAt && Date.parse(row.updatedAt), now),
    // raw numbers for KPIs
    _equity: equity,
    _balance: balance,
    _margin: a.isLive ? Number(a.margin) || 0 : 0,
  };
}

/* ─── Page Component ─────────────────────────────────────────── */
function TradingAccountsPage() {
  const navigate = useNavigate();
  const [rows,         setRows]       = useState([]);
  const [loading,      setLoading]    = useState(true);
  const [filterStatus, setFilter]     = useState('ALL');
  const [syncing,      setSyncing]    = useState(false);
  const [toastMsg,     setToastMsg]   = useState('');
  const [now,          setNow]        = useState(() => Date.now());
  const { byLogin, feedConnected } = useLiveMt5Accounts();

  /* ── Toast helper ── */
  const toast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const loadAccounts = useCallback(() =>
    tradingAccountsService.list().then((list) => {
      setRows(list.filter(isRealAccount));
      setLoading(false);
    }), []);

  useEffect(() => {
    tradingAccountsService.list().then((list) => {
      setRows(list.filter(isRealAccount));
      setLoading(false);
    });
  }, []);

  // Re-render every 5s so "Last Sync" stays accurate
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(t);
  }, []);

  const accounts = useMemo(() => rows.map((r) => toCard(r, byLogin, now)), [rows, byLogin, now]);

  /* ── Aggregate KPI values ── */
  const kpis = useMemo(() => {
    const liveCount    = accounts.filter((a) => a.status === 'LIVE' || a.status === 'ACTIVE').length;
    const totalEquity  = accounts.reduce((s, a) => s + a._equity,  0);
    const totalBalance = accounts.reduce((s, a) => s + a._balance, 0);
    const totalMargin  = accounts.reduce((s, a) => s + a._margin,  0);
    const floating     = totalEquity - totalBalance;

    return [
      {
        label:   'Total Equity',
        value:   formatMoney(totalEquity),
        accent:  'var(--brand)',
        Icon:    Wallet,
        sub:     'all accounts',
        trend:   `${floating >= 0 ? '+' : ''}${formatMoney(floating)}`,
        trendUp: floating >= 0,
      },
      {
        label:   'Live Accounts',
        value:   `${liveCount} of ${accounts.length}`,
        accent:  'var(--positive)',
        Icon:    Monitor,
        sub:     'streaming from MT5',
        trend:   liveCount > 0 ? 'online' : 'offline',
        trendUp: liveCount > 0,
      },
      {
        label:   'Total Balance',
        value:   formatMoney(totalBalance),
        accent:  'var(--cyan)',
        Icon:    DollarSign,
        sub:     'total balance',
      },
      {
        label:   'Margin In Use',
        value:   formatMoney(totalMargin),
        accent:  'var(--warning)',
        Icon:    ShieldAlert,
        sub:     'margin in use',
      },
      {
        label:   'Live Feed',
        value:   feedConnected === null ? 'Connecting…' : feedConnected ? 'Connected' : 'Offline',
        accent:  feedConnected === false ? 'var(--negative)' : 'var(--positive)',
        Icon:    Radio,
        sub:     'MT5 account stream',
        trend:   feedConnected ? 'live' : 'down',
        trendUp: !!feedConnected,
      },
    ];
  }, [accounts, feedConnected]);

  /* ── Actions ── */
  const handleGlobalSync = async () => {
    setSyncing(true);
    await loadAccounts();
    setSyncing(false);
    toast('Account list refreshed');
  };

  const handleSyncOne = async (account) => {
    await loadAccounts();
    toast(`Account #${account.login} refreshed`);
  };

  const exportable = accounts.map((a) => {
    const row = { ...a };
    delete row._equity; delete row._balance; delete row._margin;
    return row;
  });

  return (
    <PageShell className="relative">

      {/* ── Toast ── */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-[300] bg-surface-elevated border border-brand/20 text-text text-[11px] font-bold px-4 py-3 rounded-[8px] shadow-[0_4px_24px_rgba(0,0,0,0.4)] animate-fade-in flex items-center gap-2.5">
          <span className="w-2 h-2 bg-positive rounded-full animate-ping" />
          {toastMsg}
        </div>
      )}

      <div className="space-y-6 animate-fade-up">

        {/* ── Page Header ── */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-muted/70 mb-1.5">
              {PAGE.eyebrow}
            </p>
            <h2 className="text-[26px] font-semibold tracking-[-0.03em] text-text leading-tight">
              {PAGE.title}
            </h2>
            <p className="text-[13.5px] text-text-muted/80 mt-2 leading-snug max-w-xl">
              {PAGE.description}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => exportRows(exportable, 'trading-accounts.csv')}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted/85 hover:text-text hover:border-border/40 text-[12px] font-semibold transition-all cursor-pointer"
            >
              <Download size={12} /> Export
            </button>
            <button
              type="button"
              onClick={handleGlobalSync}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-brand text-text-on-accent border border-brand/20 text-[12px] font-semibold transition-all cursor-pointer hover:brightness-110 active:scale-[0.97]"
            >
              <RefreshCw size={12} className={syncing ? 'animate-spin' : ''} />
              {syncing ? 'Syncing…' : 'Sync All'}
            </button>
          </div>
        </header>

        {/* ── KPI Strip ── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.label} {...kpi} />
          ))}
        </section>

        {/* ── Filter Bar ── */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 flex-wrap">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFilter(opt.id)}
                className={`h-8 px-3.5 rounded-[8px] text-[12px] font-semibold transition-all cursor-pointer border ${
                  filterStatus === opt.id
                    ? 'bg-brand text-text-on-accent border-brand/30'
                    : 'bg-surface-elevated border-border/20 text-text-muted/80 hover:text-text hover:border-border/40'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Account count */}
          <span className="text-[12px] text-text-muted/75 font-mono font-bold select-none">
            {filterStatus === 'ALL'
              ? `${accounts.length} accounts`
              : `${accounts.filter((a) => a.status === filterStatus).length} of ${accounts.length}`}
          </span>
        </div>

        {/* ── Account Cards Grid ── */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="relative flex h-6 w-6">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-60" />
              <span className="relative inline-flex rounded-full h-6 w-6 bg-brand/80" />
            </span>
          </div>
        ) : (
          <TradingAccountCards
            accounts={accounts}
            filterStatus={filterStatus}
            onViewDetails={(account) => navigate(`/admin/users/mt5/${account.login}`, { state: { fromTrading: true } })}
            onSync={handleSyncOne}
          />
        )}

        {/* ── Activity Log (collapsible) ── */}
        <TradingActivityLog />

      </div>
    </PageShell>
  );
}

export default TradingAccountsPage;
