import React, { useState, useMemo } from 'react';
import { MainTable, TableToolbar } from '@/components/common/table';
import { useTableState } from '@/hooks/useTableState';
import { CheckCircle2, Download, Eye, PlayCircle, RefreshCw, AlertOctagon, Cpu, ShieldAlert } from 'lucide-react';
import { systemRows } from '@/config/constants/reports/mockData';
import { FormatBadge, SEV_CLR, StatusBadge } from '../components/ReportsComponents';
import { ReportDetailDrawer } from '../components/ReportDetailDrawer';
import { useDrawerState } from '@/hooks/useDrawerState';
import { KpiCard } from '@/components/cards';
import { PageShell } from '@/components/layout/PageShell';

const PAGE = {
  eyebrow: 'Reports',
  title: 'System Reports',
  description: 'Background system jobs, database tasks, and webhook delivery logs.',
};

function SevBadge({ value }) {
  const color = SEV_CLR[value] || 'var(--text-muted)';
  return (
    <span className="inline-flex items-center rounded-[5px] px-2 py-[3px] text-[11px] font-semibold uppercase tracking-[0.05em] whitespace-nowrap"
      style={{ color, background: `color-mix(in srgb, ${color} 10%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 20%, transparent)` }}>
      {value}
    </span>
  );
}

function SystemReportsPage() {
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('all');
  const [sevF, setSevF] = useState('all');
  const drawerRowState = useDrawerState(null);
  const [toast, setToast] = useState(null);

  const act = (msg, id) => {
    let message = '';
    if (msg === 'Downloaded') message = `Log downloaded: ${id}`;
    else if (msg === 'Retried') message = `Job retried: ${id}`;
    else if (msg === 'Deleted') message = `Log deleted: ${id}`;
    else if (msg === 'Viewed') message = `Opened details for job ${id}`;
    else if (msg === 'Job triggered') message = `Job triggered manually. Syncing...`;
    else if (msg === 'Bulk retry') message = `All failed jobs queued for retry.`;
    else if (msg === 'Exported') message = `All matching system logs exported.`;
    else message = `${msg}: ${id}`;

    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = useMemo(() => {
    let rows = systemRows;
    if (statusF !== 'all') rows = rows.filter(r => r.status === statusF);
    if (sevF !== 'all') rows = rows.filter(r => r.severity === sevF);
    if (search) rows = rows.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.service.toLowerCase().includes(search.toLowerCase()) || r.id.includes(search));
    return rows;
  }, [search, statusF, sevF]);

  const table = useTableState(filtered, { searchFields: [], initialPageSize: 10 });

  const columns = [
    { key: 'id', label: 'Job ID', render: (val) => <span className="font-mono text-text-muted/70 text-[11px]">{val}</span> },
    { key: 'name', label: 'Job Name', render: (val) => <span className="text-[12.5px] font-semibold text-text/90 max-w-[240px] block truncate hover:text-primary transition-colors">{val}</span> },
    { key: 'service', label: 'Service', render: (val) => <code className="font-mono text-[11.5px] text-cyan bg-cyan/10 border border-cyan/20 px-1.5 py-0.5 rounded-[4px] font-bold">{val}</code> },
    { key: 'severity', label: 'Severity', render: (val) => <SevBadge value={val} /> },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge value={val} /> },
    { key: 'generated', label: 'Generated', render: (val) => <span className="font-mono text-text-muted/60 text-[11px]">{val}</span> },
    {
      key: 'retries', label: 'Retries', render: (val) => (
        <span className={`font-mono font-bold text-[11.5px] ${val > 0 ? 'text-warning animate-pulse' : 'text-text-muted/60'}`}>
          {val > 0 ? `${val}×` : '—'}
        </span>
      )
    },
    { key: 'size', label: 'Size', render: (val) => <span className="font-mono text-text-muted/60 text-[11px]">{val}</span> },
    {
      key: 'actions', label: 'Actions', align: 'right', render: (_, row) => (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end" onClick={(e) => e.stopPropagation()}>
          {row.status === 'SUCCESS' && <button onClick={e => { e.stopPropagation(); act('Downloaded', row.id); }} className="w-6 h-6 rounded-[5px] border border-positive/20 bg-positive/10 text-positive flex items-center justify-center cursor-pointer hover:bg-positive/20 transition-all hover:scale-105"><Download size={10} /></button>}
          {row.status === 'FAILED' && <button onClick={e => { e.stopPropagation(); act('Retried', row.id); }} className="w-6 h-6 rounded-[5px] border border-warning/20 bg-warning/10 text-warning flex items-center justify-center cursor-pointer hover:bg-warning/20 transition-all hover:scale-105"><RefreshCw size={10} /></button>}
          <button onClick={e => { e.stopPropagation(); act('Viewed', row.id); }} className="w-6 h-6 rounded-[5px] border border-border/40 flex items-center justify-center text-text-muted/50 hover:text-text cursor-pointer hover:bg-bg/60 transition-all hover:scale-105"><Eye size={10} /></button>
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
            <button onClick={() => act('Exported', 'system logs')} className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[11px] font-semibold transition-all cursor-pointer">
              <Download size={12} /> Export Logs
            </button>
            <button onClick={() => act('Job triggered', 'manual')} className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-brand text-text-on-accent border border-brand/20 text-[11px] font-bold transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.97]">
              <PlayCircle size={12} /> Trigger Job
            </button>
          </div>
        </header>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total Jobs', val: systemRows.length, color: 'var(--text-muted)', Icon: Cpu },
          { label: 'Success', val: systemRows.filter(r => r.status === 'SUCCESS').length, color: 'var(--positive)', Icon: CheckCircle2 },
          { label: 'Failed', val: systemRows.filter(r => r.status === 'FAILED').length, color: 'var(--negative)', Icon: AlertOctagon },
          { label: 'With Retries', val: systemRows.filter(r => r.retries > 0).length, color: 'var(--warning)', Icon: RefreshCw },
          { label: 'Critical', val: systemRows.filter(r => r.severity === 'CRITICAL').length, color: 'var(--negative)', Icon: ShieldAlert },
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
          title="System Jobs"
          count={filtered.length}
          accentColor="var(--cyan)"
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search system logs…"
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
                  {[{value: 'all', label: 'All Status'}, {value: 'SUCCESS', label: 'Success'}, {value: 'FAILED', label: 'Failed'}].map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-text-muted/70 font-bold uppercase tracking-wider shrink-0">Severity:</span>
                <select
                  value={sevF}
                  onChange={(e) => setSevF(e.target.value)}
                  className="h-7 rounded-[7px] border border-border/20 bg-bg text-[12.5px] text-text px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none font-semibold"
                  style={{ minWidth: '70px' }}
                >
                  {[{value: 'all', label: 'All Sev'}, {value: 'INFO', label: 'Info'}, {value: 'WARNING', label: 'Warning'}, {value: 'ERROR', label: 'Error'}, {value: 'CRITICAL', label: 'Critical'}].map(opt => (
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
          emptyTitle="No jobs found"
          pagination={table}
          rowClassName={(row) => {
            const isCritical = row.severity === 'CRITICAL' || row.status === 'FAILED';
            if (isCritical) return 'hover:bg-negative/5 hover:border-l-negative';
            if (row.severity === 'WARNING') return 'hover:bg-warning/5 hover:border-l-warning';
            return 'hover:bg-cyan/5 hover:border-l-cyan';
          }}
        />
      </section>

      <ReportDetailDrawer open={drawerRowState.isOpen} row={drawerRowState.value} onClose={() => drawerRowState.close()} onAction={act} />
      </div>
    </PageShell>
  );
}

export default SystemReportsPage;
