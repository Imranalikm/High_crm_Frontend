import React from 'react';
import { CheckCircle2, Download, Check, X } from 'lucide-react';
import { evaluationRows } from '@/config/constants/prop-trading/workspaces/evaluation.workspace';
import { StatusChip as Badge, RiskChip as RiskBadge, ActionToast } from '@/components/ui';
import { MainTable, TableToolbar } from '@/components/common/table';
import { EvaluationDrawer } from '../components/PropDrawer';
import { MetricGrid } from '@/components/cards/MetricGrid';
import { usePropWorkspace } from '../hooks/usePropWorkspace';
import { exportRows } from '@/utils/exporters';

// Summary metrics derived from source data
const metrics = [
  { label: 'Total', value: evaluationRows.length, accent: 'var(--text-muted)' },
  { label: 'Pending', value: evaluationRows.filter((r) => r.status === 'PENDING').length, accent: 'var(--warning)' },
  { label: 'In Review', value: evaluationRows.filter((r) => r.status === 'REVIEW').length, accent: 'var(--cyan)' },
  { label: 'Approved', value: evaluationRows.filter((r) => r.status === 'APPROVED').length, accent: 'var(--positive)' },
  { label: 'Rejected', value: evaluationRows.filter((r) => r.status === 'REJECTED').length, accent: 'var(--negative)' },
];

function EvaluationRequestsPage() {
  const ws = usePropWorkspace({
    rows: evaluationRows,
    statusKey: 'status',
    searchKey: 'trader',
    searchKey2: 'id',
  });

  const tableCols = [
    { key: 'id',       label: 'ID',        render: (v)    => <span className="font-mono text-text-muted/60 text-[11px]">{v}</span> },
    {
      key: 'trader',   label: 'Trader',    render: (v, r) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[8px] bg-primary/[0.1] border border-primary/[0.15] flex items-center justify-center text-[9px] font-bold text-primary font-heading flex-shrink-0">
            {v.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <div className="text-[12px] font-semibold font-heading text-text">{v}</div>
            <div className="text-[10px] font-mono text-text-muted/50">{r.uid}</div>
          </div>
        </div>
      ),
    },
    { key: 'challenge', label: 'Challenge', render: (v) => <span className="text-text/70 font-heading text-[12px]">{v}</span> },
    { key: 'phase',     label: 'Phase',     render: (v) => <span className="text-cyan font-heading text-[11px] font-semibold">{v}</span> },
    { key: 'profit',   label: 'Profit',    render: (v) => <span className="font-mono font-bold text-[12px]" style={{ color: v?.startsWith('+') ? 'var(--positive)' : 'var(--negative)' }}>{v}</span> },
    { key: 'drawdown', label: 'Max Loss',  render: (v) => <span className="font-mono text-negative text-[12px]">{v}</span> },
    { key: 'dailyLoss',label: 'Daily',     render: (v) => <span className="font-heading font-bold text-[11px]" style={{ color: v === 'OK' ? 'var(--positive)' : v === 'WARN' ? 'var(--warning)' : 'var(--negative)' }}>{v}</span> },
    { key: 'kyc',      label: 'ID Check',   render: (v) => <Badge value={v} /> },
    { key: 'risk',     label: 'Risk',      render: (v) => <RiskBadge value={v} /> },
    { key: 'status',   label: 'Status',    render: (v) => <Badge value={v} /> },
    {
      key: 'actions', label: 'Actions', align: 'right', render: (_, r) => (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end" onClick={(e) => e.stopPropagation()}>
          <button onClick={(e) => { e.stopPropagation(); ws.onAction('Approved', r.id); }} className="w-6 h-6 rounded-[5px] border border-positive/20 bg-positive/[0.07] text-positive flex items-center justify-center cursor-pointer hover:brightness-110"><Check size={10} /></button>
          <button onClick={(e) => { e.stopPropagation(); ws.onAction('Rejected', r.id); }} className="w-6 h-6 rounded-[5px] border border-negative/20 bg-negative/[0.07] text-negative flex items-center justify-center cursor-pointer hover:brightness-110"><X size={10} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 animate-fade-up">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-muted/70 mb-1.5">
            Prop Trading
          </p>
          <h2 className="text-[26px] font-semibold tracking-[-0.03em] text-text leading-tight">
            Evaluation Reviews
          </h2>
          <p className="text-[13.5px] text-text-muted/80 mt-2 leading-snug max-w-xl">
            Review and approve passed challenges.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => exportRows(ws.filtered, 'evaluation-requests.csv')} className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[11px] font-semibold transition-all cursor-pointer">
            <Download size={12} /> Export
          </button>
          <button onClick={() => ws.onAction('Bulk approved', `${ws.filtered.filter((r) => r.status === 'PENDING').length} items`)} className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-brand text-text-on-accent border border-brand/20 text-[11px] font-bold transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.97]">
            <CheckCircle2 size={12} /> Bulk Approve
          </button>
        </div>
      </header>

      <ActionToast msg={ws.toast} />

      <MetricGrid metrics={metrics} />

      <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
        <TableToolbar
          title="All Evaluations"
          count={ws.filtered.length}
          accentColor="var(--cyan)"
          search={ws.search}
          onSearchChange={ws.setSearch}
          searchPlaceholder="Search..."
          filters={
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-text-muted/70 font-bold uppercase tracking-wider shrink-0">Filter:</span>
              <select
                value={ws.filter}
                onChange={(e) => ws.setFilter(e.target.value)}
                className="h-7 rounded-[7px] border border-border/20 bg-bg text-[12.5px] text-text px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none font-semibold"
                style={{ minWidth: '70px' }}
              >
                {['ALL', 'PENDING', 'REVIEW', 'APPROVED', 'REJECTED'].map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          }
        />
        <MainTable 
          columns={tableCols} 
          data={ws.filtered} 
          onRowClick={ws.openDrawer}
          rowClassName={(r) => {
            if (r.status === 'APPROVED') return 'hover:bg-positive/5 hover:border-l-positive cursor-pointer';
            if (r.status === 'REJECTED') return 'hover:bg-negative/5 hover:border-l-negative cursor-pointer';
            if (r.status === 'PENDING' || r.status === 'REVIEW') return 'hover:bg-warning/5 hover:border-l-warning cursor-pointer';
            return 'hover:bg-brand/5 hover:border-l-brand cursor-pointer';
          }}
        />
      </section>

      <EvaluationDrawer row={ws.drawer} open={ws.isDrawerOpen} onClose={ws.closeDrawer} onAction={ws.onAction} />
    </div>
  );
}

export default EvaluationRequestsPage;
