import React, { useState, useMemo } from 'react';
import { AlertOctagon, Check, CheckCircle2, Download, Flag, ShieldAlert, X } from 'lucide-react';
import { IBBadge, IBRiskBadge, TraderAvatar, IBToast, TableActionBtn } from '../components/IBComponents';
import { PayoutDrawer } from '../components/IBDrawer';
import { payoutsRows, PAYOUT_FILTERS } from '@/config/constants/ib-system/workspaces/payouts.workspace';
import { MainTable, TableToolbar } from '@/components/common/table';
import { useDrawerState } from '@/hooks/useDrawerState';

function PayoutsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const drawerState = useDrawerState(null);
  const [toast, setToast] = useState(null);
  const act = (msg, id) => { setToast(`${msg}: ${id}`); setTimeout(() => setToast(null), 3000); };

  const filtered = useMemo(() => {
    let rows = payoutsRows;
    if (filter !== 'ALL') rows = rows.filter(r => r.status === filter || (filter === 'HIGH_RISK' && r.risk === 'HIGH'));
    if (search) rows = rows.filter(r => r.partner.toLowerCase().includes(search.toLowerCase()) || r.id.includes(search));
    return rows;
  }, [search, filter]);

  const totalPending = payoutsRows
    .filter(r => r.status === 'PENDING' || r.status === 'REVIEW')
    .reduce((s, r) => s + parseFloat(r.amount.replace(/[$,]/g, '')), 0);

  const cols = [
    { key: 'id', label: 'Payout ID', render: v => <span className="font-mono text-text-muted/70 text-[11px]">{v}</span> },
    { key: 'partner', label: 'Partner', render: v => <div className="flex items-center gap-2"><TraderAvatar name={v} /><span className={`text-[12.5px] font-semibold ${v.startsWith('unknown') ? 'text-negative' : 'text-text/90'}`}>{v}</span></div> },
    { key: 'amount', label: 'Amount', render: v => <span className="font-mono font-bold text-brand text-[12.5px]">{v}</span> },
    { key: 'method', label: 'Method', render: v => <span className="text-[11px] font-semibold border border-border/30 px-1.5 py-0.5 rounded-[4px] text-text-muted/70">{v}</span> },
    { key: 'status', label: 'Status', render: v => <IBBadge value={v} /> },
    { key: 'risk', label: 'Risk', render: v => <IBRiskBadge value={v} /> },
    { key: 'requestedAt', label: 'Requested', render: v => <span className="font-mono text-text-muted/60 text-[11px]">{v}</span> },
    { key: 'processedBy', label: 'Processed', render: v => <span className="font-medium text-text-muted/70 text-[12px]">{v}</span> },
    {
      key: 'actions', label: 'Actions', align: 'right', render: (_, r) => (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end" onClick={(e) => e.stopPropagation()}>
          {(r.status === 'PENDING' || r.status === 'REVIEW') && (
            <TableActionBtn variant="success" Icon={Check} onClick={e => { e.stopPropagation(); act('Approved', r.id); }} />
          )}
          <TableActionBtn variant="danger" Icon={X} onClick={e => { e.stopPropagation(); act('Rejected', r.id); }} />
          <TableActionBtn variant="warning" Icon={Flag} onClick={e => { e.stopPropagation(); act('Flagged', r.id); }} />
        </div>
      )
    },
  ];

  return (
    <div className="space-y-5 animate-fade-up">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-muted/70 mb-1.5">
            IB System
          </p>
          <h2 className="text-[26px] font-semibold tracking-[-0.03em] text-text leading-tight">
            Payout Requests
          </h2>
          <p className="text-[13.5px] text-text-muted/80 mt-2 leading-snug max-w-xl">
            Review and process partner commission withdrawals.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => act('Exported', 'risk report')} className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-warning/20 bg-warning/[0.05] text-warning hover:bg-warning/[0.1] text-[11px] font-bold transition-all cursor-pointer">
            <ShieldAlert size={12} /> Risk Export
          </button>
          <button onClick={() => act('Exported', 'payouts CSV')} className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[11px] font-semibold transition-all cursor-pointer">
            <Download size={12} /> Export CSV
          </button>
          <button onClick={() => act('Batch approved', 'PENDING')} className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-brand text-text-on-accent border border-brand/20 text-[11px] font-bold transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.97]">
            <CheckCircle2 size={12} /> Batch Approve
          </button>
        </div>
      </header>

      <IBToast msg={toast} />

      {payoutsRows.filter(r => r.risk === 'HIGH' && ['PENDING', 'REVIEW', 'FROZEN'].includes(r.status)).length > 0 && (
        <div className="flex items-start gap-3 rounded-[10px] border border-negative/20 bg-negative/[0.05] px-4 py-3">
          <AlertOctagon size={14} className="text-negative flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-[13px] font-bold text-negative">High-Risk Payouts Require Manual Review</div>
            <div className="text-[12px] text-negative/85 mt-0.5">{payoutsRows.filter(r => r.risk === 'HIGH' && ['PENDING', 'REVIEW', 'FROZEN'].includes(r.status)).length} payout(s) flagged — verify partner identity and fund source before processing.</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Pending Value', val: `$${totalPending.toLocaleString()}`, color: 'var(--warning)' },
          { label: 'Pending Count', val: payoutsRows.filter(r => r.status === 'PENDING').length, color: 'var(--warning)' },
          { label: 'High Risk', val: payoutsRows.filter(r => r.risk === 'HIGH').length + ' items', color: 'var(--negative)' },
          { label: 'Paid This Month', val: payoutsRows.filter(r => r.status === 'PAID').length + ' items', color: 'var(--positive)' },
        ].map(s => (
          <div key={s.label} className="rounded-[10px] border border-border/30 bg-surface-elevated shadow-card-subtle px-4 py-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted/70 mb-1.5">{s.label}</div>
            <div className="text-[18px] font-bold tracking-[-0.02em]" style={{ color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
        <TableToolbar
          title="Payout Requests"
          count={filtered.length}
          accentColor="var(--warning)"
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search partner, payout ID…"
          filters={
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-text-muted/70 font-bold uppercase tracking-wider shrink-0">Filter:</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="h-7 rounded-[7px] border border-border/20 bg-bg text-[12.5px] text-text px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none font-semibold"
                style={{ minWidth: '70px' }}
              >
                <option value="ALL">ALL</option>
                {PAYOUT_FILTERS.map(f => (
                  <option key={f} value={f}>{f.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          }
        />
        <MainTable 
          columns={cols} 
          data={filtered} 
          onRowClick={r => drawerState.open(r)}
          rowClassName={(r) => {
            if (r.status === 'PENDING' || r.status === 'REVIEW') return 'hover:bg-warning/5 hover:border-l-warning cursor-pointer';
            if (r.status === 'REJECTED' || r.risk === 'HIGH') return 'hover:bg-negative/5 hover:border-l-negative cursor-pointer';
            return 'hover:bg-positive/5 hover:border-l-positive cursor-pointer';
          }}
        />
      </section>

      <PayoutDrawer row={drawerState.value} open={drawerState.isOpen} onClose={() => drawerState.close()} onAction={act} />
    </div>
  );
}

export default PayoutsPage;
