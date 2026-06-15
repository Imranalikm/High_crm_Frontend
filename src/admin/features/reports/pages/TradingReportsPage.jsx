import React, { useState, useMemo } from 'react';
import { MainTable, TableToolbar } from '@/components/common/table';
import { useTableState } from '@/hooks/useTableState';
import { CheckCircle2, Download, Plus, RefreshCw, Activity, FileText, AlertOctagon } from 'lucide-react';
import { tradingRows } from '@/config/constants/reports/mockData';
import { FormatBadge, StatusBadge } from '../components/ReportsComponents';
import { ReportDetailDrawer } from '../components/ReportDetailDrawer';
import { useDrawerState } from '@/hooks/useDrawerState';
import { KpiCard } from '@/components/cards';
import { PageShell } from '@/components/layout/PageShell';

const PAGE = {
  eyebrow: 'Reports',
  title: 'Trading Reports',
  description: 'Trade logs, profit/loss summaries, and volume performance data.',
};

function TradingReportsPage() {
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('all');
  const drawerRowState = useDrawerState(null);
  const [toast, setToast] = useState(null);

  const act = (msg, id) => {
    let message = '';
    if (msg === 'Downloaded') message = `Report downloaded: ${id}`;
    else if (msg === 'Retried') message = `Report restarted: ${id}`;
    else if (msg === 'Deleted') message = `Report deleted: ${id}`;
    else if (msg === 'Generate') message = `New trading report form opened.`;
    else if (msg === 'Exported') message = `All matching trading reports exported.`;
    else message = `${msg}: ${id}`;

    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = useMemo(() => {
    let rows = tradingRows;
    if (statusF !== 'all') rows = rows.filter(r => r.status === statusF);
    if (search) rows = rows.filter(r => r.title.toLowerCase().includes(search.toLowerCase()) || r.id.includes(search) || r.symbols.toLowerCase().includes(search.toLowerCase()));
    return rows;
  }, [search, statusF]);

  const table = useTableState(filtered, { searchFields: [], initialPageSize: 10 });

  const columns = [
    { key: 'id', label: 'ID', render: (val) => <span className="font-mono text-text-muted/70 text-[11px]">{val}</span> },
    { key: 'title', label: 'Report Title', render: (val) => <span className="text-[12.5px] font-semibold text-text/90 max-w-[220px] block truncate hover:text-primary transition-colors">{val}</span> },
    { key: 'scope', label: 'Scope', render: (val) => <span className="text-[11px] font-semibold border border-border/30 bg-bg/40 px-1.5 py-0.5 rounded-[4px] text-text-muted/70">{val}</span> },
    { key: 'symbols', label: 'Symbols', render: (val) => <span className="font-mono text-cyan text-[11.5px] font-semibold">{val}</span> },
    { key: 'pnl', label: 'P&L', render: (val) => val !== '—' ? <span className="font-mono font-bold text-[11.5px]" style={{ color: val?.startsWith('+') ? 'var(--positive)' : 'var(--negative)' }}>{val}</span> : <span className="text-text-muted/30">—</span> },
    { key: 'winRate', label: 'Win Rate', render: (val) => val !== '—' ? <span className="font-mono text-text/85 font-bold text-[11.5px]">{val}</span> : <span className="text-text-muted/30">—</span> },
    { key: 'drawdown', label: 'Max Loss', render: (val) => val !== '—' ? <span className="font-mono text-negative font-bold text-[11.5px]">{val}</span> : <span className="text-text-muted/30">—</span> },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge value={val} /> },
    { key: 'format', label: 'Format', render: (val) => <FormatBadge value={val} /> },
    { key: 'generated', label: 'Generated', render: (val) => <span className="font-mono text-text-muted/60 text-[11px]">{val}</span> },
    {
      key: 'actions', label: 'Actions', align: 'right', render: (_, row) => (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end" onClick={(e) => e.stopPropagation()}>
          {row.status === 'READY' && <button onClick={e => { e.stopPropagation(); act('Downloaded', row.id); }} className="w-6 h-6 rounded-[5px] border border-positive/20 bg-positive/10 text-positive flex items-center justify-center cursor-pointer hover:bg-positive/20 transition-all hover:scale-105"><Download size={10} /></button>}
          {row.status === 'FAILED' && <button onClick={e => { e.stopPropagation(); act('Retried', row.id); }} className="w-6 h-6 rounded-[5px] border border-warning/20 bg-warning/10 text-warning flex items-center justify-center cursor-pointer hover:bg-warning/20 transition-all hover:scale-105"><RefreshCw size={10} /></button>}
          {row.status === 'PROCESSING' && <button onClick={e => { e.stopPropagation(); }} className="w-6 h-6 rounded-[5px] border border-cyan/20 bg-cyan/5 text-cyan/60 flex items-center justify-center cursor-default"><Activity size={10} /></button>}
        </div>
      )
    },
  ];

  return (
    <PageShell>
      <div className="space-y-6 animate-fade-up">
        {/* Dynamic Floating Toast */}
        {toast && (
          <div className="fixed top-24 right-6 z-50 flex items-center gap-2.5 rounded-[12px] border border-positive/30 bg-surface/85 backdrop-blur-md px-4 py-3 text-[12.5px] font-semibold text-positive font-heading shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
            <CheckCircle2 size={14} className="text-positive" />
            <span>{toast}</span>
          </div>
        )}

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
            <button onClick={() => act('Exported', 'trading reports')} className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[11px] font-semibold transition-all cursor-pointer">
              <Download size={12} /> Export
            </button>
            <button onClick={() => act('Generate', 'trading report')} className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-brand text-text-on-accent border border-brand/20 text-[11px] font-bold transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.97]">
              <Plus size={12} /> Generate Trading Report
            </button>
          </div>
        </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Reports', val: tradingRows.length, color: 'var(--text-muted)', Icon: FileText },
          { label: 'Ready', val: tradingRows.filter(r => r.status === 'READY').length, color: 'var(--positive)', Icon: CheckCircle2 },
          { label: 'Processing', val: tradingRows.filter(r => r.status === 'PROCESSING').length, color: 'var(--cyan)', Icon: Activity },
          { label: 'Failed', val: tradingRows.filter(r => r.status === 'FAILED').length, color: 'var(--negative)', Icon: AlertOctagon },
        ].map(s => (
          <KpiCard
            key={s.label}
            label={s.label}
            value={s.val}
            Icon={s.Icon}
            accent={s.color}
          />
        ))}
      </div>

      <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
        <TableToolbar
          title="Trading Reports"
          count={filtered.length}
          accentColor="var(--positive)"
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search trading reports…"
          filters={
            <>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-text-muted/70 font-bold uppercase tracking-wider shrink-0">Status:</span>
                <select
                  value={statusF}
                  onChange={(e) => setStatusF(e.target.value)}
                  className="h-7 rounded-[7px] border border-border/20 bg-bg text-[12.5px] text-text px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none font-semibold"
                  style={{ minWidth: '70px' }}
                >
                  {[{value: 'all', label: 'All Status'}, {value: 'READY', label: 'Ready'}, {value: 'PROCESSING', label: 'Processing'}, {value: 'FAILED', label: 'Failed'}].map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </>
          }
        />

        <MainTable
          columns={columns}
          data={table.items}
          onRowClick={(row) => drawerRowState.open(row)}
          emptyTitle="No reports found"
          pagination={table}
          rowClassName={(row) => {
            const isCritical = row.status === 'FAILED';
            if (isCritical) return 'hover:bg-negative/5 hover:border-l-negative';
            if (row.status === 'PROCESSING') return 'hover:bg-cyan/5 hover:border-l-cyan';
            return 'hover:bg-positive/5 hover:border-l-positive';
          }}
        />
      </section>

      <ReportDetailDrawer open={drawerRowState.isOpen} row={drawerRowState.value} onClose={() => drawerRowState.close()} onAction={act} />
      </div>
    </PageShell>
  );
}

export default TradingReportsPage;
