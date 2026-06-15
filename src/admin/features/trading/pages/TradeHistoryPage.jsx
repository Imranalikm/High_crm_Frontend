import React from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { KpiCard } from '@/components/cards';
import { MainTable, TableToolbar } from '@/components/common/table';
import { TradingDrawer } from '../components/TradingDrawer';
import { HistoryDetailsDrawer } from '../components/TradingDetailPanels';
import { useWorkspace } from '@/hooks/useWorkspace';
import { historyConfig } from '@/config/constants/trading/workspaces/history.workspace';
import { exportRows } from '@/utils/exporters';
import { useDrawerState } from '@/hooks/useDrawerState';

const PAGE = {
  accent: 'var(--cyan)',
  eyebrow: 'Trading',
  title: 'Trade History',
  description: 'Track completed trades.',
};

function TradeHistoryPage() {
  const ws = useWorkspace(historyConfig);
  const drawerRowState = useDrawerState(null);

  const columns = [
    { key: 'ticket', label: 'Ticket', render: (val) => <span className="font-mono text-[12px] font-bold text-brand">{val}</span> },
    {
      key: 'user',
      label: 'User',
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
    { key: 'size', label: 'Size', render: (val) => <span className="font-mono text-[13px] text-text-muted/85">{val}</span> },
    { key: 'openPrice', label: 'Open Price', render: (val) => <span className="font-mono text-[12px] text-text-muted/75">{val}</span> },
    { key: 'closePrice', label: 'Close Price', render: (val) => <span className="font-mono text-[12px] text-text-muted/75">{val}</span> },
    {
      key: 'pnl',
      label: 'Profit/Loss',
      render: (val) => {
        const pnlPositive = String(val).startsWith('+');
        const pnlColor = pnlPositive ? 'var(--positive)' : 'var(--negative)';
        return (
          <span className="font-mono text-[14px] font-bold" style={{ color: pnlColor }}>
            {val}
          </span>
        );
      },
    },
    {
      key: 'status',
      label: 'Result',
      render: (val) => {
        const isWin = val === 'WIN';
        const resultColor = isWin ? 'var(--positive)' : 'var(--negative)';
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[5px] text-[11px] font-semibold"
            style={{ color: resultColor, background: `color-mix(in srgb, ${resultColor} 10%, transparent)`, border: `1px solid color-mix(in srgb, ${resultColor} 22%, transparent)` }}
          >
            {isWin ? '✓' : '✗'} {val}
          </span>
        );
      },
    },
  ];

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
              onClick={() => exportRows(ws.filtered, 'trading-history.csv')}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted/85 hover:text-text hover:border-border/40 text-[12px] font-semibold transition-all cursor-pointer"
            >
              <Download size={12} /> Export
            </button>
            <button
              type="button"
              onClick={() => {}}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted/85 hover:text-text hover:border-border/40 text-[12px] font-semibold transition-all cursor-pointer"
            >
              <RefreshCw size={12} /> Refresh
            </button>
          </div>
        </header>

        {/* ── KPI Grid ── */}
        <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {historyConfig.kpis.map((k) => (
            <KpiCard key={k.label} {...k} />
          ))}
        </section>

        {/* ── Table Card ── */}
        <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
          <TableToolbar
            title={historyConfig.tableTitle}
            count={ws.table.items.length}
            accentColor={PAGE.accent}
            search={ws.search}
            onSearchChange={ws.setSearch}
            searchPlaceholder="Search..."
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
            emptyTitle="No trades match your filters."
            pagination={ws.table}
            rowClassName="hover:bg-cyan/5 hover:border-l-cyan"
          />
        </section>
      </div>

      {/* Drawer */}
      <TradingDrawer
        open={drawerRowState.isOpen}
        eyebrow="Trade Details"
        title={drawerRowState.value ? `Trade ${drawerRowState.value.ticket}` : ''}
        subtitle={drawerRowState.value ? `${drawerRowState.value.symbol} · ${drawerRowState.value.status}` : ''}
        onClose={() => drawerRowState.close()}
      >
        {drawerRowState.value && <HistoryDetailsDrawer row={drawerRowState.value} />}
      </TradingDrawer>
    </PageShell>
  );
}

export default TradeHistoryPage;
