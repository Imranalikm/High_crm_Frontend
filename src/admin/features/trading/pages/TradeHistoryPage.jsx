import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Download, RefreshCw, CheckCircle2, TrendingUp, TrendingDown, Target, Layers, Trophy, AlertTriangle,
} from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { KpiCard } from '@/components/cards';
import { MainTable, TableToolbar } from '@/components/common/table';
import { TradingDrawer } from '../components/TradingDrawer';
import { HistoryDetailsDrawer } from '../components/TradingDetailPanels';
import { useWorkspace } from '@/hooks/useWorkspace';
import { apiClient } from '@/shared/api/client/apiClient';
import { exportRows } from '@/utils/exporters';
import { useDrawerState } from '@/hooks/useDrawerState';

const PAGE = {
  accent: 'var(--cyan)',
  eyebrow: 'Trading',
  title: 'Trade History',
  description: 'Closed trades on all client MT5 accounts, loaded from MT5.',
};

/* ─── Helpers ─────────────────────────────────────────────── */
const ymd = (d) => d.toISOString().slice(0, 10);
const daysAgo = (n) => ymd(new Date(Date.now() - n * 86400000));

const usd = (n) => {
  const v = Number(n) || 0;
  return `${v >= 0 ? '+' : '-'}$${Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const fmtTime = (iso) => (iso ? new Date(iso).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }) : '—');

/** P/L shown in USD when convertible, otherwise in the symbol's own profit currency. */
function pnlText(t) {
  if (t.profitUsd !== null && t.profitUsd !== undefined) return usd(t.profitUsd);
  if (t.profit !== null && t.profit !== undefined) {
    const v = Number(t.profit);
    return `${v >= 0 ? '+' : '-'}${Math.abs(v).toLocaleString('en-US', { maximumFractionDigits: 2 })} ${t.profitCurrency || ''}`.trim();
  }
  return '—';
}

function toRow(t) {
  const p = Number(t.profit) || 0;
  return {
    id: t.positionId,
    ticket: t.positionId,
    user: t.client || 'Unknown client',
    uid: `MT5 #${t.login}`,
    account: t.login,
    login: t.login,
    symbol: t.symbol,
    side: t.side,
    openTime: fmtTime(t.openTime),
    closeTime: fmtTime(t.closeTime),
    size: Number(t.lots).toFixed(2),
    openPrice: t.openPrice,
    closePrice: t.closePrice,
    pnl: pnlText(t),
    status: p > 0 ? 'WIN' : p < 0 ? 'LOSS' : 'EVEN',
    _profit: p,
    _profitUsd: t.profitUsd,
    _lots: Number(t.lots) || 0,
    _closeTs: new Date(t.closeTime).getTime(),
  };
}

/* ─── Page ────────────────────────────────────────────────── */
function TradeHistoryPage() {
  const drawerRowState = useDrawerState(null);
  const [from, setFrom] = useState(() => daysAgo(30));
  const [to, setTo] = useState(() => ymd(new Date()));
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    return apiClient
      .get(`/mt5-accounts/history/trades?from=${from}&to=${to}`)
      .then((res) => setTrades(res?.data || []))
      .catch((err) => {
        setTrades([]);
        setError(err?.message || 'Failed to load trade history from MT5.');
      })
      .finally(() => setLoading(false));
  }, [from, to]);

  useEffect(() => {
    let active = true;
    apiClient
      .get(`/mt5-accounts/history/trades?from=${from}&to=${to}`)
      .then((res) => { if (active) { setTrades(res?.data || []); setError(null); } })
      .catch((err) => { if (active) { setTrades([]); setError(err?.message || 'Failed to load trade history from MT5.'); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [from, to]);

  const rows = useMemo(() => trades.map(toRow).sort((a, b) => b._closeTs - a._closeTs), [trades]);

  const config = useMemo(() => ({
    rows,
    searchFields: ['ticket', 'user', 'uid', 'symbol', 'login'],
    symbolOpts: [...new Set(rows.map((r) => r.symbol))].sort(),
    sideOpts: ['BUY', 'SELL'],
    resultOpts: ['WIN', 'LOSS'],
  }), [rows]);

  const ws = useWorkspace(config);

  const kpis = useMemo(() => {
    const usdRows = rows.filter((r) => r._profitUsd !== null && r._profitUsd !== undefined);
    const net = usdRows.reduce((s, r) => s + r._profitUsd, 0);
    const wins = rows.filter((r) => r._profit > 0).length;
    const decided = rows.filter((r) => r._profit !== 0).length;
    const lots = rows.reduce((s, r) => s + r._lots, 0);
    const best = usdRows.length ? Math.max(...usdRows.map((r) => r._profitUsd)) : null;
    const worst = usdRows.length ? Math.min(...usdRows.map((r) => r._profitUsd)) : null;
    const nonUsd = rows.length - usdRows.length;
    const up = net >= 0;
    return [
      { label: 'Closed Trades', value: String(rows.length), sub: `${from} → ${to}`, Icon: CheckCircle2, accent: 'var(--cyan)' },
      {
        label: 'Net Profit/Loss',
        value: usd(net),
        sub: nonUsd ? `USD only · ${nonUsd} cross trade${nonUsd > 1 ? 's' : ''} excluded` : 'all closed trades',
        Icon: up ? TrendingUp : TrendingDown,
        accent: up ? 'var(--positive)' : 'var(--negative)',
      },
      { label: 'Win Rate', value: decided ? `${Math.round((wins / decided) * 100)}%` : '—', sub: `${wins} winning of ${decided}`, Icon: Target, accent: 'var(--brand)' },
      { label: 'Volume Traded', value: `${lots.toFixed(2)} lots`, sub: 'closed volume', Icon: Layers, accent: 'var(--purple)' },
      { label: 'Best Trade', value: best === null ? '—' : usd(best), sub: 'largest win (USD)', Icon: Trophy, accent: 'var(--positive)' },
      { label: 'Worst Trade', value: worst === null ? '—' : usd(worst), sub: 'largest loss (USD)', Icon: AlertTriangle, accent: 'var(--negative)' },
    ];
  }, [rows, from, to]);

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
    { key: 'openTime', label: 'Opened', render: (val) => <span className="font-mono text-[12px] text-text-muted/75">{val}</span> },
    { key: 'closeTime', label: 'Closed', render: (val) => <span className="font-mono text-[12px] text-text-muted/75">{val}</span> },
    { key: 'size', label: 'Lots', render: (val) => <span className="font-mono text-[13px] text-text-muted/85">{val}</span> },
    { key: 'openPrice', label: 'Open Price', render: (val) => <span className="font-mono text-[12px] text-text-muted/75">{val}</span> },
    { key: 'closePrice', label: 'Close Price', render: (val) => <span className="font-mono text-[12px] text-text-muted/75">{val}</span> },
    {
      key: 'pnl',
      label: 'Profit/Loss',
      render: (val, row) => {
        const pnlColor = row._profit > 0 ? 'var(--positive)' : row._profit < 0 ? 'var(--negative)' : 'var(--text-muted)';
        return <span className="font-mono text-[14px] font-bold" style={{ color: pnlColor }}>{val}</span>;
      },
    },
    {
      key: 'status',
      label: 'Result',
      render: (val) => {
        const resultColor = val === 'WIN' ? 'var(--positive)' : val === 'LOSS' ? 'var(--negative)' : 'var(--text-muted)';
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[5px] text-[11px] font-semibold"
            style={{ color: resultColor, background: `color-mix(in srgb, ${resultColor} 10%, transparent)`, border: `1px solid color-mix(in srgb, ${resultColor} 22%, transparent)` }}
          >
            {val}
          </span>
        );
      },
    },
  ];

  const exportable = ws.filtered.map((r) => {
    const out = { ...r };
    delete out._profit; delete out._profitUsd; delete out._lots; delete out._closeTs; delete out.id;
    return out;
  });

  const dateInput =
    'h-8 rounded-[8px] border border-border/20 bg-surface-elevated px-2 text-[12px] font-mono text-text outline-none focus:border-brand/40';

  return (
    <PageShell>
      <div className="space-y-5 animate-fade-up">

        {/* ── Page Header ── */}
        <header className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
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
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-text-muted/70">
              From
              <input type="date" value={from} max={to} onChange={(e) => e.target.value && setFrom(e.target.value)} className={dateInput} />
            </label>
            <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-text-muted/70">
              To
              <input type="date" value={to} min={from} max={ymd(new Date())} onChange={(e) => e.target.value && setTo(e.target.value)} className={dateInput} />
            </label>
            <button
              type="button"
              onClick={() => exportRows(exportable, `trade-history-${from}_${to}.csv`)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted/85 hover:text-text hover:border-border/40 text-[12px] font-semibold transition-all cursor-pointer"
            >
              <Download size={12} /> Export
            </button>
            <button
              type="button"
              onClick={load}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted/85 hover:text-text hover:border-border/40 text-[12px] font-semibold transition-all cursor-pointer"
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        </header>

        {error && (
          <div className="p-4 rounded-[10px] bg-negative/10 border border-negative/20 text-negative text-[13px] font-medium">
            {error}
          </div>
        )}

        {/* ── KPI Grid ── */}
        <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {kpis.map((k) => (
            <KpiCard key={k.label} {...k} />
          ))}
        </section>

        {/* ── Table Card ── */}
        <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
          <TableToolbar
            title="Closed Trades"
            count={ws.table.items.length}
            accentColor={PAGE.accent}
            search={ws.search}
            onSearchChange={ws.setSearch}
            searchPlaceholder="Search client, login, symbol…"
            filters={
              <>
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
              loading
                ? 'Loading trade history from MT5…'
                : rows.length === 0
                  ? 'No closed trades on client accounts in this period.'
                  : 'No trades match your filters.'
            }
            pagination={ws.table}
            rowClassName="hover:bg-cyan/5 hover:border-l-cyan"
          />
        </section>
      </div>

      {/* Drawer */}
      <TradingDrawer
        open={drawerRowState.isOpen}
        eyebrow="Trade Details"
        title={drawerRowState.value ? `Position ${drawerRowState.value.ticket}` : ''}
        subtitle={drawerRowState.value ? `${drawerRowState.value.symbol} · ${drawerRowState.value.side}` : ''}
        onClose={() => drawerRowState.close()}
      >
        {drawerRowState.value && <HistoryDetailsDrawer row={drawerRowState.value} />}
      </TradingDrawer>
    </PageShell>
  );
}

export default TradeHistoryPage;
