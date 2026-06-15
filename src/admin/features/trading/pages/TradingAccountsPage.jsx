import React, { useMemo, useState } from 'react';

import {
  PlusCircle, RefreshCw, Download,
  Wallet, Monitor, ShieldAlert, Radio, DollarSign,
} from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { KpiCard } from '@/components/cards';
import { TradingAccountCards } from '../components/TradingAccountCards';
import { TradingActivityLog } from '../components/TradingActivityLog';
import { exportRows } from '@/utils/exporters';
import { useNavigate } from 'react-router-dom';

/* ─── Page metadata ─────────────────────────────────────────── */
const PAGE = {
  eyebrow:     'Trading',
  title:       'Trading Accounts',
  description: 'Manage trading accounts and balances.',
};

/* ─── Mock data ─────────────────────────────────────────────── */
const MOCK_ACCOUNTS = [
  {
    login:      '88100249',
    user:       'Arjun Sathia',
    uid:        'U-499201',
    server:     'MT5-PRIME-01 (EU Node)',
    group:      'REAL_RAW_SPREAD',
    leverage:   '1:500',
    equity:     '$142,005.12',
    balance:    '$141,800.00',
    margin:     '$2,800.00',
    freeMargin: '$139,205.12',
    marginLvl:  '5071%',
    status:     'LIVE',
    lastSync:   '2 mins ago',
  },
  {
    login:      '88100562',
    user:       'Arjun Sathia',
    uid:        'U-499201',
    server:     'MT5-STND-04 (US Node)',
    group:      'REAL_STANDARD',
    leverage:   '1:100',
    equity:     '$42,099.00',
    balance:    '$42,099.00',
    margin:     '$0.00',
    freeMargin: '$42,099.00',
    marginLvl:  '—',
    status:     'DISCONNECTED',
    lastSync:   '14 hours ago',
  },
  {
    login:      '88100918',
    user:       'Arjun Sathia',
    uid:        'U-499201',
    server:     'MT5-PRIME-01 (EU Node)',
    group:      'REAL_RAW_SPREAD',
    leverage:   '1:500',
    equity:     '$100,000.33',
    balance:    '$100,000.00',
    margin:     '$2,000.00',
    freeMargin: '$98,000.33',
    marginLvl:  '5000%',
    status:     'LIVE',
    lastSync:   'Just now',
  },
];

const FILTER_OPTIONS = [
  { id: 'ALL',          label: 'All Accounts' },
  { id: 'LIVE',         label: 'Live Only'    },
  { id: 'DISCONNECTED', label: 'Disconnected' },
  { id: 'BLOCKED',      label: 'Blocked'      },
];

/* ─── Helpers ─────────────────────────────────────────────── */
function parseMoney(str = '$0') {
  return parseFloat(String(str).replace(/[$,]/g, '')) || 0;
}

function formatMoney(num) {
  return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/* ─── Page Component ─────────────────────────────────────────── */
function TradingAccountsPage() {
  const navigate = useNavigate();
  const [accounts,    setAccounts]    = useState(MOCK_ACCOUNTS);
  const [filterStatus, setFilter]     = useState('ALL');
  const [syncing,     setSyncing]     = useState(false);
  const [toastMsg,    setToastMsg]    = useState('');


  /* ── Toast helper ── */
  const toast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  /* ── Aggregate KPI values ── */
  const kpis = useMemo(() => {
    const liveCount = accounts.filter((a) => a.status === 'LIVE' || a.status === 'ACTIVE').length;
    const totalEquity   = accounts.reduce((s, a) => s + parseMoney(a.equity),   0);
    const totalBalance  = accounts.reduce((s, a) => s + parseMoney(a.balance),  0);
    const totalMargin   = accounts.reduce((s, a) => s + parseMoney(a.margin),   0);

    return [
      {
        label:   'Total Equity',
        value:   formatMoney(totalEquity),
        accent:  'var(--brand)',
        Icon:    Wallet,
        sub:     'all accounts',
        trend:   '+4.2%',
        trendUp: true,
      },
      {
        label:   'Live Accounts',
        value:   `${liveCount} of ${accounts.length}`,
        accent:  'var(--positive)',
        Icon:    Monitor,
        sub:     'active accounts',
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
        label:   'Server Status',
        value:   'Healthy',
        accent:  'var(--positive)',
        Icon:    Radio,
        sub:     'NY4 · 14ms',
        trend:   'stable',
      },
    ];
  }, [accounts]);

  /* ── Actions ── */
  const handleAddNewAccount = () => {
    const login = String(Math.floor(10_000_000 + Math.random() * 90_000_000));
    setAccounts((prev) => [{
      login,
      user:       'New Account',
      uid:        'U-000000',
      server:     'MT5-PRIME-01 (EU Node)',
      group:      'REAL_STANDARD',
      leverage:   '1:100',
      equity:     '$10,000.00',
      balance:    '$10,000.00',
      margin:     '$0.00',
      freeMargin: '$10,000.00',
      marginLvl:  '—',
      status:     'LIVE',
      lastSync:   'Just now',
    }, ...prev]);
    toast(`New account #${login} created`);
  };

  const handleGlobalSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 1800);
    setAccounts((prev) => prev.map((a) => ({ ...a, lastSync: 'Just now', status: a.status === 'DISCONNECTED' ? 'DISCONNECTED' : 'LIVE' })));
    toast('All accounts synced with MT5 cluster');
  };

  const handleSyncOne = (account) => {
    setAccounts((prev) =>
      prev.map((a) => a.login === account.login ? { ...a, lastSync: 'Just now', status: 'LIVE' } : a)
    );
    toast(`Account #${account.login} synced`);
  };



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
              onClick={() => exportRows(accounts, 'trading-accounts.csv')}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted/85 hover:text-text hover:border-border/40 text-[12px] font-semibold transition-all cursor-pointer"
            >
              <Download size={12} /> Export
            </button>
            <button
              type="button"
              onClick={handleAddNewAccount}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted/85 hover:text-text hover:border-border/40 text-[12px] font-semibold transition-all cursor-pointer"
            >
              <PlusCircle size={12} /> New Account
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
          <div className="flex items-center gap-1.5">
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
        <TradingAccountCards
          accounts={accounts}
          filterStatus={filterStatus}
          onViewDetails={(account) => navigate(`/admin/users/mt5/${account.login}`, { state: { fromTrading: true } })}
          onSync={handleSyncOne}
        />

        {/* ── Activity Log (collapsible) ── */}
        <TradingActivityLog />

      </div>
    </PageShell>
  );
}

export default TradingAccountsPage;