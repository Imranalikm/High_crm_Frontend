import React, { useEffect, useMemo, useState } from 'react';
import {
  Download, RefreshCw, Clock, CheckCircle2, BarChart2, Layers, Users, Smartphone,
} from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { KpiCard } from '@/components/cards';
import { MainTable, TableToolbar } from '@/components/common/table';
import { TradingDrawer } from '../components/TradingDrawer';
import { OrderDetailsDrawer } from '../components/TradingDetailPanels';
import { useWorkspace } from '@/hooks/useWorkspace';
import { apiClient } from '@/shared/api/client/apiClient';
import { exportRows } from '@/utils/exporters';
import { useDrawerState } from '@/hooks/useDrawerState';

const PAGE = {
  accent: 'var(--brand)',
  eyebrow: 'Trading',
  title: 'Orders',
  description: 'Pending and executed orders on all client MT5 accounts, read from MT5.',
};

const PENDING_REFRESH_MS = 10_000;

/* ─── Helpers ─────────────────────────────────────────────── */
const ymd = (d) => d.toISOString().slice(0, 10);
const daysAgo = (n) => ymd(new Date(Date.now() - n * 86400000));
const fmtTime = (iso) => (iso ? new Date(iso).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }) : '—');
const num = (v) => (v === null || v === undefined || v === '' ? '—' : v);

function pendingRow(o) {
  return {
    id: `P-${o.orderId}`,
    ticket: o.orderId,
    user: o.client || 'Unknown client',
    uid: `MT5 #${o.login}`,
    login: o.login,
    symbol: o.symbol,
    side: o.side,
    orderType: o.type,
    volume: o.lots === null ? '—' : Number(o.lots).toFixed(2),
    price: num(o.priceTrigger ? `${o.price} (trigger ${o.priceTrigger})` : o.price),
    sl: num(o.sl),
    tp: num(o.tp),
    status: 'PENDING',
    source: '—',
    time: fmtTime(o.time),
    comment: o.comment,
    _lots: Number(o.lots) || 0,
    _ts: o.time ? new Date(o.time).getTime() : 0,
  };
}

function historyRow(o) {
  return {
    id: `H-${o.orderId}`,
    ticket: o.orderId,
    positionId: o.positionId,
    direction: o.direction,
    user: o.client || 'Unknown client',
    uid: `MT5 #${o.login}`,
    login: o.login,
    symbol: o.symbol,
    side: o.side,
    orderType: `${o.side} · ${o.direction}`,
    volume: Number(o.lots).toFixed(2),
    price: num(o.price),
    sl: num(o.sl),
    tp: num(o.tp),
    status: 'FILLED',
    source: o.source,
    time: fmtTime(o.time),
    comment: o.comment,
    _lots: Number(o.lots) || 0,
    _ts: new Date(o.time).getTime(),
  };
}

/* ─── Page ────────────────────────────────────────────────── */
function OrdersPage() {
  const drawerRowState = useDrawerState(null);
  const [pending, setPending] = useState([]);
  const [pendingMeta, setPendingMeta] = useState(null);
  const [pendingError, setPendingError] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState(null);
  const [from, setFrom] = useState(() => daysAgo(7));
  const [to, setTo] = useState(() => ymd(new Date()));
  const [reloadKey, setReloadKey] = useState(0);

  // Pending orders: poll every 10s while the page is open
  useEffect(() => {
    let active = true;
    const load = () =>
      apiClient
        .get('/mt5-accounts/orders/pending')
        .then((res) => {
          if (!active) return;
          setPending(res?.data || []);
          setPendingMeta(res?.meta || null);
          setPendingError(null);
        })
        .catch((err) => { if (active) setPendingError(err?.message || 'Failed to load pending orders.'); });
    load();
    const t = setInterval(load, PENDING_REFRESH_MS);
    return () => { active = false; clearInterval(t); };
  }, [reloadKey]);

  // Executed orders for the selected range
  useEffect(() => {
    let active = true;
    apiClient
      .get(`/mt5-accounts/orders/history?from=${from}&to=${to}`)
      .then((res) => { if (active) { setHistory(res?.data || []); setHistoryError(null); } })
      .catch((err) => { if (active) { setHistory([]); setHistoryError(err?.message || 'Failed to load order history.'); } })
      .finally(() => { if (active) setHistoryLoading(false); });
    return () => { active = false; };
  }, [from, to, reloadKey]);

  const pendingRows = useMemo(() => pending.map(pendingRow).sort((a, b) => b._ts - a._ts), [pending]);
  const historyRows = useMemo(() => history.map(historyRow).sort((a, b) => b._ts - a._ts), [history]);

  const pendingWs = useWorkspace(useMemo(() => ({
    rows: pendingRows,
    searchFields: ['ticket', 'user', 'uid', 'symbol', 'login', 'orderType'],
    symbolOpts: [...new Set(pendingRows.map((r) => r.symbol))].sort(),
    typeOpts: [...new Set(pendingRows.map((r) => r.orderType))].sort(),
  }), [pendingRows]));

  const historyWs = useWorkspace(useMemo(() => ({
    rows: historyRows,
    searchFields: ['ticket', 'positionId', 'user', 'uid', 'symbol', 'login', 'source'],
    symbolOpts: [...new Set(historyRows.map((r) => r.symbol))].sort(),
    sideOpts: ['BUY', 'SELL'],
    sourceOpts: [...new Set(historyRows.map((r) => r.source))].sort(),
  }), [historyRows]));

  const kpis = useMemo(() => {
    const today = ymd(new Date());
    const filledToday = history.filter((o) => String(o.time).slice(0, 10) === today);
    const lots = historyRows.reduce((s, r) => s + r._lots, 0);
    const buys = historyRows.filter((r) => r.side === 'BUY').length;
    const pendingAccounts = new Set(pendingRows.map((r) => r.login)).size;
    const sources = {};
    historyRows.forEach((r) => { sources[r.source] = (sources[r.source] || 0) + 1; });
    const topSource = Object.entries(sources).sort((a, b) => b[1] - a[1])[0];
    return [
      { label: 'Pending Orders', value: String(pendingRows.length), sub: `${pendingAccounts} account${pendingAccounts === 1 ? '' : 's'} · refreshes every 10s`, Icon: Clock, accent: 'var(--warning)' },
      { label: 'Filled Today', value: String(filledToday.length), sub: 'executed orders today', Icon: CheckCircle2, accent: 'var(--positive)' },
      { label: 'Filled in Range', value: String(historyRows.length), sub: `${from} → ${to}`, Icon: BarChart2, accent: 'var(--cyan)' },
      { label: 'Volume', value: `${lots.toFixed(2)} lots`, sub: 'executed in range', Icon: Layers, accent: 'var(--brand)' },
      { label: 'Buy / Sell', value: `${buys} / ${historyRows.length - buys}`, sub: 'executed orders', Icon: Users, accent: 'var(--purple)' },
      { label: 'Top Source', value: topSource ? topSource[0] : '—', sub: topSource ? `${topSource[1]} of ${historyRows.length} orders` : 'no orders', Icon: Smartphone, accent: 'var(--text-muted)' },
    ];
  }, [history, historyRows, pendingRows, from, to]);

  const sideCell = (val) => {
    const isBuy = val === 'BUY';
    const c = isBuy ? 'var(--positive)' : 'var(--negative)';
    return (
      <span className="inline-flex items-center gap-1 rounded-[4px] px-2 py-1 text-[11px] font-semibold" style={{ color: c, background: `color-mix(in srgb, ${c} 10%, transparent)` }}>
        {isBuy ? '▲' : '▼'} {val}
      </span>
    );
  };
  const clientCell = (_, row) => (
    <div>
      <div className="text-[13px] font-semibold text-text">{row.user}</div>
      <div className="text-[11px] font-mono text-text-muted/70">{row.uid}</div>
    </div>
  );
  const mono = (cls) => (val) => <span className={`font-mono ${cls}`}>{val}</span>;

  const pendingColumns = [
    { key: 'ticket', label: 'Order', render: mono('text-[12px] font-bold text-brand') },
    { key: 'user', label: 'Client', render: clientCell },
    { key: 'symbol', label: 'Symbol', render: mono('text-[13px] font-semibold text-text') },
    { key: 'orderType', label: 'Type', render: (val) => <span className="text-[11px] font-semibold border border-border/25 rounded-[4px] px-2 py-1 text-text-muted/85">{val}</span> },
    { key: 'volume', label: 'Lots', render: mono('text-[13px] text-text-muted/85') },
    { key: 'price', label: 'Price', render: mono('text-[13px] text-text') },
    { key: 'sl', label: 'SL', render: mono('text-[12px] text-negative/85') },
    { key: 'tp', label: 'TP', render: mono('text-[12px] text-positive/85') },
    { key: 'time', label: 'Placed', render: mono('text-[12px] text-text-muted/75') },
  ];

  const historyColumns = [
    { key: 'ticket', label: 'Order', render: mono('text-[12px] font-bold text-brand') },
    { key: 'positionId', label: 'Position', render: mono('text-[12px] text-text-muted/80') },
    { key: 'user', label: 'Client', render: clientCell },
    { key: 'symbol', label: 'Symbol', render: mono('text-[13px] font-semibold text-text') },
    { key: 'side', label: 'Side', render: sideCell },
    {
      key: 'direction',
      label: 'Action',
      render: (val) => (
        <span className={`text-[11px] font-semibold rounded-[4px] px-2 py-1 border ${val === 'OPEN' ? 'border-cyan/30 text-cyan' : 'border-border/25 text-text-muted/85'}`}>
          {val === 'OPEN' ? 'Open' : 'Close'}
        </span>
      ),
    },
    { key: 'volume', label: 'Lots', render: mono('text-[13px] text-text-muted/85') },
    { key: 'price', label: 'Fill Price', render: mono('text-[13px] text-text') },
    { key: 'source', label: 'Source', render: (val) => <span className="text-[12px] text-text-muted/85">{val}</span> },
    { key: 'time', label: 'Time', render: mono('text-[12px] text-text-muted/75') },
  ];

  const strip = (rows) => rows.map((r) => {
    const out = { ...r };
    delete out._lots; delete out._ts; delete out.id;
    return out;
  });

  const filterBar = (ws) => ws.filterSets.map((fs) => (
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
  ));

  const btn = 'flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted/85 hover:text-text hover:border-border/40 text-[12px] font-semibold transition-all cursor-pointer';
  const dateInput = 'h-8 rounded-[8px] border border-border/20 bg-surface-elevated px-2 text-[12px] font-mono text-text outline-none focus:border-brand/40';

  return (
    <PageShell>
      <div className="space-y-5 animate-fade-up">

        {/* ── Page Header ── */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-muted/70 mb-1.5">{PAGE.eyebrow}</p>
            <h2 className="text-[26px] font-semibold tracking-[-0.03em] text-text leading-tight">{PAGE.title}</h2>
            <p className="text-[13.5px] text-text-muted/80 mt-2 leading-snug max-w-xl">{PAGE.description}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button type="button" onClick={() => { setHistoryLoading(true); setReloadKey((k) => k + 1); }} className={btn}>
              <RefreshCw size={12} className={historyLoading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        </header>

        {/* ── KPI Grid ── */}
        <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {kpis.map((k) => <KpiCard key={k.label} {...k} />)}
        </section>

        {/* ── Pending orders ── */}
        <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
          <TableToolbar
            title="Pending Orders"
            count={pendingWs.table.items.length}
            accentColor="var(--warning)"
            search={pendingWs.search}
            onSearchChange={pendingWs.setSearch}
            searchPlaceholder="Search client, login, symbol…"
            filters={
              <>
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-warning/20 bg-warning/8 mr-2">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-warning" />
                  <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-warning">Every 10s</span>
                </div>
                {filterBar(pendingWs)}
                <button type="button" onClick={() => exportRows(strip(pendingWs.filtered), 'pending-orders.csv')} className={btn}>
                  <Download size={12} /> Export
                </button>
              </>
            }
          />
          {(pendingError || pendingMeta?.accountsFailed > 0) && (
            <div className="px-5 py-2 text-[12px] text-warning border-b border-border/10">
              {pendingError || `Could not read ${pendingMeta.accountsFailed} of ${pendingMeta.accountsChecked} accounts from MT5; the list may be incomplete.`}
            </div>
          )}
          <MainTable
            columns={pendingColumns}
            data={pendingWs.table.items}
            onRowClick={(row) => drawerRowState.open(row)}
            emptyTitle={pendingMeta ? 'No pending orders on client accounts right now.' : 'Loading pending orders from MT5…'}
            pagination={pendingWs.table}
            rowClassName="hover:bg-warning/5 hover:border-l-warning"
          />
        </section>

        {/* ── Executed orders ── */}
        <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
          <TableToolbar
            title="Executed Orders"
            count={historyWs.table.items.length}
            accentColor={PAGE.accent}
            search={historyWs.search}
            onSearchChange={historyWs.setSearch}
            searchPlaceholder="Search order, position, client…"
            filters={
              <>
                <input type="date" value={from} max={to} onChange={(e) => { if (e.target.value) { setHistoryLoading(true); setFrom(e.target.value); } }} className={dateInput} aria-label="From date" />
                <span className="text-[11px] text-text-muted/60">→</span>
                <input type="date" value={to} min={from} max={ymd(new Date())} onChange={(e) => { if (e.target.value) { setHistoryLoading(true); setTo(e.target.value); } }} className={dateInput} aria-label="To date" />
                {filterBar(historyWs)}
                <button type="button" onClick={() => exportRows(strip(historyWs.filtered), `orders-${from}_${to}.csv`)} className={btn}>
                  <Download size={12} /> Export
                </button>
              </>
            }
          />
          {historyError && (
            <div className="px-5 py-2 text-[12px] text-negative border-b border-border/10">{historyError}</div>
          )}
          <MainTable
            columns={historyColumns}
            data={historyWs.table.items}
            onRowClick={(row) => drawerRowState.open(row)}
            emptyTitle={
              historyLoading
                ? 'Loading executed orders from MT5…'
                : historyRows.length === 0
                  ? 'No executed orders on client accounts in this period.'
                  : 'No orders match your filters.'
            }
            pagination={historyWs.table}
            rowClassName="hover:bg-brand/5 hover:border-l-brand"
          />
        </section>
      </div>

      {/* Drawer: read-only */}
      <TradingDrawer
        open={drawerRowState.isOpen}
        eyebrow="Order Details"
        title={drawerRowState.value ? `Order ${drawerRowState.value.ticket}` : ''}
        subtitle={drawerRowState.value ? `${drawerRowState.value.symbol} · ${drawerRowState.value.orderType}` : ''}
        onClose={() => drawerRowState.close()}
      >
        {drawerRowState.value && <OrderDetailsDrawer row={drawerRowState.value} />}
      </TradingDrawer>
    </PageShell>
  );
}

export default OrdersPage;
