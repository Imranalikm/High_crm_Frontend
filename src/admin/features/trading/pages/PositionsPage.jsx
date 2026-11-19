import React, { useEffect, useMemo, useState } from 'react';
import { Download, Activity, TrendingUp, TrendingDown, Layers, Users, BarChart2 } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { KpiCard } from '@/components/cards';
import { MainTable, TableToolbar } from '@/components/common/table';
import { TradingDrawer } from '../components/TradingDrawer';
import { PositionDetailsDrawer } from '../components/TradingDetailPanels';
import { tradingAccountsService } from '../services/tradingAccountsService';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useLiveMt5Positions } from '@/shared/hooks/useLiveMt5Positions';
import { exportRows } from '@/utils/exporters';
import { useDrawerState } from '@/hooks/useDrawerState';

const PAGE = {
  accent: 'var(--positive)',
  eyebrow: 'Trading',
  title: 'Live Positions',
  description: 'Open positions across all client MT5 accounts, streamed live from MT5.',
};

/* ─── Helpers ─────────────────────────────────────────────── */
const money = (n) => {
  const v = Number(n) || 0;
  return `${v >= 0 ? '+' : '-'}$${Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

function duration(ms, now) {
  if (!ms) return '—';
  const mins = Math.max(0, Math.floor((now - ms) / 60000));
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h}h ${String(mins % 60).padStart(2, '0')}m`;
  return `${Math.floor(h / 24)}d ${h % 24}h`;
}

/** Live position + account owner -> table row */
function toRow(p, owner, now) {
  return {
    id: p.positionId,
    ticket: p.positionId,
    login: p.login,
    user: owner?.name || 'Unknown client',
    uid: `MT5 #${p.login}`,
    userId: owner?.userId,
    symbol: p.symbol,
    side: p.side,
    size: (Number(p.lots) || 0).toFixed(2),
    openPrice: p.priceOpen,
    currPrice: p.priceCurrent,
    pnl: money(p.profit),
    stopLoss: p.stopLoss ? p.stopLoss : '—',
    takeProfit: p.takeProfit ? p.takeProfit : '—',
    opened: p.time ? new Date(p.time).toLocaleString('en-GB') : '—',
    duration: duration(p.time, now),
    _profit: Number(p.profit) || 0,
    _lots: Number(p.lots) || 0,
  };
}

/* ─── Page ────────────────────────────────────────────────── */
function PositionsPage() {
  const drawerRowState = useDrawerState(null);
  const { positions, feedConnected, ready } = useLiveMt5Positions();
  const [owners, setOwners] = useState({});
  const [now, setNow] = useState(() => Date.now());

  // login -> { name, userId } for the "User" column
  useEffect(() => {
    tradingAccountsService.list().then((list) => {
      const map = {};
      list.forEach((a) => {
        map[String(a.accountid)] = {
          name: a.user?.name || a.contactName || (a.accountType === 'DEMO' ? 'Demo account' : null),
          userId: a.userId,
        };
      });
      setOwners(map);
    });
  }, []);

  // keep "Duration" current
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);

  const rows = useMemo(
    () => positions
      .map((p) => toRow(p, owners[p.login], now))
      .sort((a, b) => Number(b.ticket) - Number(a.ticket)),
    [positions, owners, now]
  );

  const config = useMemo(() => ({
    rows,
    searchFields: ['ticket', 'user', 'uid', 'symbol', 'login'],
    symbolOpts: [...new Set(rows.map((r) => r.symbol))].sort(),
    sideOpts: ['BUY', 'SELL'],
    profitOpts: ['Profit', 'Loss'],
  }), [rows]);

  const ws = useWorkspace(config);

  // Keep the open drawer in sync with live price/profit updates
  const openRow = drawerRowState.value
    ? rows.find((r) => r.id === drawerRowState.value.id) || drawerRowState.value
    : null;

  const kpis = useMemo(() => {
    const total = rows.reduce((s, r) => s + r._profit, 0);
    const winners = rows.filter((r) => r._profit > 0).length;
    const losers = rows.filter((r) => r._profit < 0).length;
    const lots = rows.reduce((s, r) => s + r._lots, 0);
    const accounts = new Set(rows.map((r) => r.login)).size;
    const buys = rows.filter((r) => r.side === 'BUY').length;
    const up = total >= 0;
    return [
      { label: 'Open Positions', value: String(rows.length), sub: 'open right now', Icon: Activity, accent: 'var(--positive)' },
      { label: 'Floating P/L', value: money(total), sub: 'all open positions', Icon: up ? TrendingUp : TrendingDown, accent: up ? 'var(--positive)' : 'var(--negative)' },
      { label: 'Winning / Losing', value: `${winners} / ${losers}`, sub: 'positions in profit / loss', Icon: BarChart2, accent: 'var(--cyan)' },
      { label: 'Total Volume', value: `${lots.toFixed(2)} lots`, sub: 'open volume', Icon: Layers, accent: 'var(--brand)' },
      { label: 'Accounts Trading', value: String(accounts), sub: 'with open positions', Icon: Users, accent: 'var(--warning)' },
      { label: 'Long / Short', value: `${buys} / ${rows.length - buys}`, sub: 'buy / sell count', Icon: BarChart2, accent: 'var(--purple)' },
    ];
  }, [rows]);

  const columns = [
    { key: 'ticket', label: 'Position', render: (val) => <span className="font-mono text-[12px] font-bold text-brand">{val}</span> },
    {
      key: 'user',
      label: 'Client',
      render: (_, row) => (
        <div>
          <div className="text-[13px] font-semibold text-text">{row.user}</div>
          <div className="text-[11px] font-mono text-text-muted/70">{row.uid}</div>
        </div>
      ),
    },
    { key: 'symbol', label: 'Symbol', render: (val) => <span className="font-mono text-[13px] font-semibold text-text">{val}</span> },
    {
      key: 'side',
      label: 'Side',
      render: (val) => {
        const isBuy = val === 'BUY';
        const sideColor = isBuy ? 'var(--positive)' : 'var(--negative)';
        return (
          <span
            className="inline-flex items-center gap-1 rounded-[4px] px-2 py-1 text-[11px] font-semibold"
            style={{ color: sideColor, background: `color-mix(in srgb, ${sideColor} 10%, transparent)` }}
          >
            {isBuy ? '▲' : '▼'} {val}
          </span>
        );
      },
    },
    { key: 'size', label: 'Lots', render: (val) => <span className="font-mono text-[13px] text-text-muted/85">{val}</span> },
    { key: 'openPrice', label: 'Open', render: (val) => <span className="font-mono text-[13px] text-text-muted/85">{val}</span> },
    { key: 'currPrice', label: 'Current', render: (val) => <span className="font-mono text-[13px] text-text">{val}</span> },
    {
      key: 'pnl',
      label: 'Profit/Loss',
      render: (val, row) => {
        const pnlColor = row._profit > 0 ? 'var(--positive)' : row._profit < 0 ? 'var(--negative)' : 'var(--text-muted)';
        return (
          <span className="font-mono text-[14px] font-bold" style={{ color: pnlColor }}>
            {val}
          </span>
        );
      },
    },
    {
      key: 'stopLoss',
      label: 'SL / TP',
      render: (_, row) => (
        <span className="font-mono text-[12px] text-text-muted/75">
          {row.stopLoss} / {row.takeProfit}
        </span>
      ),
    },
    { key: 'duration', label: 'Duration', render: (val) => <span className="text-[12px] text-text-muted/75">{val}</span> },
  ];

  const exportable = ws.filtered.map((r) => {
    const out = { ...r };
    delete out._profit; delete out._lots; delete out.id;
    return out;
  });

  const liveBadge = feedConnected === false
    ? { text: 'Feed offline', cls: 'border-negative/20 bg-negative/8 text-negative', dot: 'bg-negative' }
    : { text: 'Live', cls: 'border-positive/20 bg-positive/8 text-positive', dot: 'bg-positive animate-pulse' };

  return (
    <PageShell>
      <div className="space-y-5 animate-fade-up">

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
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => exportRows(exportable, 'open-positions.csv')}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted/85 hover:text-text hover:border-border/40 text-[12px] font-semibold transition-all cursor-pointer"
            >
              <Download size={12} /> Export
            </button>
          </div>
        </header>

        {/* ── KPI Grid ── */}
        <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {kpis.map((k) => (
            <KpiCard key={k.label} {...k} />
          ))}
        </section>

        {/* ── Table Card ── */}
        <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
          <TableToolbar
            title="Open Positions"
            count={ws.table.items.length}
            accentColor={PAGE.accent}
            search={ws.search}
            onSearchChange={ws.setSearch}
            searchPlaceholder="Search client, login, symbol…"
            filters={
              <>
                <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border mr-2 ${liveBadge.cls}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${liveBadge.dot}`} />
                  <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em]">{liveBadge.text}</span>
                </div>
                {ws.filterSets.map((fs) => (
                  <div key={fs.label} className="flex items-center gap-1.5">
                    <span className="text-[11px] text-text-muted/70 font-bold uppercase tracking-wider shrink-0">{fs.label}:</span>
                    <select
                      value={fs.get}
                      onChange={(e) => fs.set(e.target.value)}
                      className="h-7 rounded-[7px] border border-border/20 bg-bg text-[12.5px] text-text px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none font-semibold"
                      style={{ minWidth: '80px' }}
                    >
                      <option value="all">All</option>
                      {fs.opts.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                ))}
              </>
            }
          />

          <MainTable
            columns={columns}
            data={ws.table.items}
            onRowClick={(row) => drawerRowState.open(row)}
            emptyTitle={
              !ready
                ? 'Loading live positions…'
                : rows.length === 0
                  ? 'No open positions on client accounts right now.'
                  : 'No positions match your filters.'
            }
            pagination={ws.table}
            rowClassName="hover:bg-positive/5 hover:border-l-positive"
          />
        </section>
      </div>

      {/* Drawer (read-only: no close/modify actions until they are wired to MT5) */}
      <TradingDrawer
        open={drawerRowState.isOpen}
        eyebrow="Position Details"
        title={openRow ? `Position ${openRow.ticket}` : ''}
        subtitle={openRow ? `${openRow.symbol} · ${openRow.side}` : ''}
        onClose={() => drawerRowState.close()}
        actionDone={null}
      >
        {openRow && <PositionDetailsDrawer row={openRow} />}
      </TradingDrawer>
    </PageShell>
  );
}

export default PositionsPage;
