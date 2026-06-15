import React from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { KpiCard } from '@/components/cards';
import { MainTable, TableToolbar } from '@/components/common/table';
import { ExecutionLogDrawer } from '../components/ExecutionLogDrawer';
import { useWorkspace } from '@/hooks/useWorkspace';
import { logsConfig } from '@/config/constants/trading/workspaces/logs.workspace';
import { exportRows } from '@/utils/exporters';
import { useDrawerState } from '@/hooks/useDrawerState';

const PAGE = {
  accent: 'var(--warning)',
  eyebrow: 'Trading',
  title: 'Execution Logs',
  description: 'Track bridge and execution events.',
};

const SEVERITY_META = {
  INFO:     { color: 'var(--positive)', bg: 'color-mix(in srgb, var(--positive) 10%, transparent)', border: 'color-mix(in srgb, var(--positive) 22%, transparent)' },
  WARN:     { color: 'var(--warning)',  bg: 'color-mix(in srgb, var(--warning) 10%, transparent)',  border: 'color-mix(in srgb, var(--warning) 22%, transparent)' },
  ERROR:    { color: 'var(--negative)', bg: 'color-mix(in srgb, var(--negative) 10%, transparent)', border: 'color-mix(in srgb, var(--negative) 22%, transparent)' },
  CRITICAL: { color: 'var(--negative)', bg: 'color-mix(in srgb, var(--negative) 14%, transparent)', border: 'color-mix(in srgb, var(--negative) 30%, transparent)' },
};

function latencyBadge(value) {
  const ms = parseInt(value, 10) || 0;
  const color = ms > 500 ? 'var(--negative)' : ms > 200 ? 'var(--warning)' : 'var(--positive)';
  const bg = ms > 500
    ? 'color-mix(in srgb, var(--negative) 10%, transparent)'
    : ms > 200
    ? 'color-mix(in srgb, var(--warning) 10%, transparent)'
    : 'color-mix(in srgb, var(--positive) 8%, transparent)';
  return (
    <span
      className="inline-flex items-center rounded-[4px] px-2 py-1 font-mono text-[11.5px] font-semibold"
      style={{ color, background: bg }}
    >
      {value}
    </span>
  );
}

function ExecutionLogsPage() {
  const ws = useWorkspace(logsConfig);
  const drawerRowState = useDrawerState(null);

  const columns = [
    { key: 'eventId', label: 'ID', render: (val) => <span className="font-mono text-[12px] font-bold text-brand">{val}</span> },
    { key: 'type', label: 'Type', render: (val) => <span className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-text-muted/85">{val}</span> },
    { key: 'bridge', label: 'Bridge', render: (val) => <span className="text-[11.5px] font-semibold border border-border/25 rounded-[4px] px-2 py-1 text-text-muted/85 font-mono bg-surface-elevated/40">{val}</span> },
    { key: 'symbol', label: 'Symbol', render: (val) => <span className="font-mono text-[13px] text-text-muted/85">{val}</span> },
    { key: 'latency', label: 'Latency', render: (val) => latencyBadge(val) },
    { key: 'code', label: 'Code', render: (val) => <span className="font-mono text-[12px] text-text-muted/75">{val}</span> },
    {
      key: 'severity',
      label: 'Severity',
      render: (val) => {
        const sev = SEVERITY_META[val] ?? SEVERITY_META.INFO;
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[5px] text-[11px] font-semibold"
            style={{ color: sev.color, background: sev.bg, border: `1px solid ${sev.border}` }}
          >
            {val}
          </span>
        );
      },
    },
    { key: 'timestamp', label: 'Time', render: (val) => <span className="font-mono text-[12px] text-text-muted/75">{val}</span> },
    { key: 'detail', label: 'Detail', render: (val) => <span className="block truncate max-w-[220px] text-[12.5px] text-text-muted/80 font-medium" title={val}>{val}</span> },
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
              onClick={() => exportRows(ws.filtered, 'trading-execution-logs.csv')}
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
          {logsConfig.kpis.map((k) => (
            <KpiCard key={k.label} {...k} />
          ))}
        </section>

        {/* ── Table Card ── */}
        <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
          <TableToolbar
            title={logsConfig.tableTitle}
            count={ws.table.items.length}
            accentColor={PAGE.accent}
            search={ws.search}
            onSearchChange={ws.setSearch}
            searchPlaceholder="Search..."
            filters={
              <>
                {ws.filtered.filter(r => r.severity === 'ERROR' || r.severity === 'CRITICAL').length > 0 && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-negative/20 bg-negative/8 mr-2">
                    <span className="h-1.5 w-1.5 animate-ping rounded-full bg-negative" />
                    <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-negative">
                      {ws.filtered.filter(r => r.severity === 'ERROR' || r.severity === 'CRITICAL').length} Errors
                    </span>
                  </div>
                )}
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
            emptyTitle="No events match your filters."
            pagination={ws.table}
            rowClassName={(row) => {
              const isCritical = row.severity === 'CRITICAL' || row.severity === 'ERROR';
              if (isCritical) return 'hover:bg-negative/5 hover:border-l-negative';
              if (row.severity === 'WARN') return 'hover:bg-warning/5 hover:border-l-warning';
              return 'hover:bg-positive/5 hover:border-l-positive';
            }}
          />
        </section>
      </div>

      {/* Drawer */}
      <ExecutionLogDrawer
        open={drawerRowState.isOpen}
        row={drawerRowState.value}
        onClose={() => drawerRowState.close()}
      />
    </PageShell>
  );
}

export default ExecutionLogsPage;
