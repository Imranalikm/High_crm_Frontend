import React, { useState, useMemo } from 'react';
import { Check, CheckCircle2, Download, PauseCircle, X } from 'lucide-react';
import { IBBadge, IBTierBadge, TraderAvatar, IBToast, TableActionBtn } from '../components/IBComponents';
import { CommissionDrawer } from '../components/IBDrawer';
import { commissionsRows, COMMISSION_FILTERS } from '@/config/constants/ib-system/workspaces/commissions.workspace';
import { MainTable, TableToolbar } from '@/components/common/table';
import { useDrawerState } from '@/hooks/useDrawerState';

function CommissionsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const drawerState = useDrawerState(null);
  const [toast, setToast] = useState(null);
  const act = (msg, id) => { setToast(`${msg}: ${id}`); setTimeout(() => setToast(null), 3000); };

  const filtered = useMemo(() => {
    let rows = commissionsRows;
    if (filter !== 'ALL') rows = rows.filter(r => r.payout === filter || r.approval === filter);
    if (search) rows = rows.filter(r =>
      r.partner.toLowerCase().includes(search.toLowerCase()) ||
      r.id.includes(search) || r.user.toLowerCase().includes(search.toLowerCase())
    );
    return rows;
  }, [search, filter]);

  const totalAmt = commissionsRows.reduce((s, r) => s + parseFloat(r.amount.replace(/[$,]/g, '')), 0);

  const cols = [
    { key: 'id', label: 'ID', render: v => <span className="font-mono text-text-muted/70 text-[11px]">{v}</span> },
    { key: 'partner', label: 'Partner', render: v => <div className="flex items-center gap-2"><TraderAvatar name={v} /><span className="text-[12.5px] font-semibold text-text/90">{v}</span></div> },
    { key: 'user', label: 'Referred User', render: v => <span className="text-text-muted/80 font-medium">{v}</span> },
    { key: 'source', label: 'Source', render: v => <span className="text-[11px] text-text-muted/70 font-semibold border border-border/30 px-1.5 py-0.5 rounded-[4px]">{v}</span> },
    { key: 'amount', label: 'Amount', render: v => <span className="font-mono font-bold text-brand">{v}</span> },
    { key: 'tier', label: 'Tier', render: v => <IBTierBadge value={v} /> },
    { key: 'payout', label: 'Payout State', render: v => <IBBadge value={v} /> },
    { key: 'approval', label: 'Approval', render: v => <IBBadge value={v} /> },
    { key: 'date', label: 'Date', render: v => <span className="font-mono text-text-muted/60 text-[11px]">{v}</span> },
    {
      key: 'actions', label: 'Actions', align: 'right', render: (_, r) => (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end" onClick={(e) => e.stopPropagation()}>
          {r.approval === 'REVIEW' && <>
            <TableActionBtn variant="success" Icon={Check} onClick={e => { e.stopPropagation(); act('Approved', r.id); }} />
            <TableActionBtn variant="danger" Icon={X} onClick={e => { e.stopPropagation(); act('Rejected', r.id); }} />
          </>}
          <TableActionBtn variant="default" Icon={PauseCircle} onClick={e => { e.stopPropagation(); act('Held', r.id); }} />
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
            Commission Records
          </h2>
          <p className="text-[13.5px] text-text-muted/80 mt-2 leading-snug max-w-xl">
            Monitor and manage individual commission transactions.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => act('Exported', 'commissions CSV')} className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[11px] font-semibold transition-all cursor-pointer">
            <Download size={12} /> Export CSV
          </button>
          <button onClick={() => act('Bulk approved', 'REVIEW items')} className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-brand text-text-on-accent border border-brand/20 text-[11px] font-bold transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.97]">
            <CheckCircle2 size={12} /> Bulk Approve
          </button>
        </div>
      </header>

      <IBToast msg={toast} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Commission', val: `$${totalAmt.toLocaleString()}`, color: 'var(--brand)' },
          { label: 'Approved', val: commissionsRows.filter(r => r.approval === 'APPROVED').length + ' records', color: 'var(--positive)' },
          { label: 'Under Review', val: commissionsRows.filter(r => r.approval === 'REVIEW').length + ' records', color: 'var(--warning)' },
          { label: 'Held', val: commissionsRows.filter(r => r.payout === 'HELD').length + ' records', color: 'var(--negative)' },
        ].map(s => (
          <div key={s.label} className="rounded-[10px] border border-border/30 bg-surface-elevated shadow-card-subtle px-4 py-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted/70 mb-1.5">{s.label}</div>
            <div className="text-[18px] font-bold tracking-[-0.02em]" style={{ color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
        <TableToolbar
          title="Commission Ledger"
          count={filtered.length}
          accentColor="var(--brand)"
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search partner, user, ID…"
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
                {COMMISSION_FILTERS.map(f => (
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
            if (r.approval === 'REVIEW' || r.payout === 'HELD') return 'hover:bg-warning/5 hover:border-l-warning cursor-pointer';
            if (r.approval === 'REJECTED') return 'hover:bg-negative/5 hover:border-l-negative cursor-pointer';
            return 'hover:bg-brand/5 hover:border-l-brand cursor-pointer';
          }}
        />
      </section>

      <CommissionDrawer row={drawerState.value} open={drawerState.isOpen} onClose={() => drawerState.close()} onAction={act} />
    </div>
  );
}

export default CommissionsPage;
