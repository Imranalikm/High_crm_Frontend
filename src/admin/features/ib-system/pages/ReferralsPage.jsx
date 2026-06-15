import React, { useState, useMemo } from 'react';
import { Check, Download, Edit2, Lock, UserPlus, X } from 'lucide-react';
import { IBBadge, IBTierBadge, TraderAvatar, IBToast, TableActionBtn } from '../components/IBComponents';
import { ReferralDrawer } from '../components/IBDrawer';
import { referralsRows, REFERRAL_FILTERS } from '@/config/constants/ib-system/workspaces/referrals.workspace';
import { MainTable, TableToolbar } from '@/components/common/table';
import { useDrawerState } from '@/hooks/useDrawerState';

function ReferralsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const drawerState = useDrawerState(null);
  const [toast, setToast] = useState(null);
  const act = (msg, id) => { setToast(`${msg}: ${id}`); setTimeout(() => setToast(null), 3000); };

  const filtered = useMemo(() => {
    let rows = referralsRows;
    if (filter !== 'ALL') rows = rows.filter(r => r.status === filter || r.tier === filter);
    if (search) rows = rows.filter(r =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.code.toLowerCase().includes(search.toLowerCase()) ||
      r.id.includes(search)
    );
    return rows;
  }, [search, filter]);

  const cols = [
    { key: 'id', label: 'ID', render: v => <span className="font-mono text-text-muted/70 text-[11px]">{v}</span> },
    {
      key: 'name', label: 'Partner', render: (v, r) => (
        <div className="flex items-center gap-2.5">
          <TraderAvatar name={v} />
          <div>
            <div className="text-[12.5px] font-semibold text-text/90">{v}</div>
            <div className="text-[10px] font-mono text-text-muted/60">{r.code}</div>
          </div>
        </div>
      )
    },
    { key: 'region', label: 'Region', render: v => <span className="text-text-muted/70 font-semibold text-[11.5px]">{v}</span> },
    { key: 'referred', label: 'Referred', render: v => <span className="font-mono font-bold text-brand">{v?.toLocaleString()}</span> },
    { key: 'active', label: 'Active', render: v => <span className="font-mono text-positive font-semibold">{v?.toLocaleString()}</span> },
    { key: 'share', label: 'Rev. Share', render: v => <span className="font-mono font-bold text-warning">{v}</span> },
    { key: 'tier', label: 'Tier', render: v => <IBTierBadge value={v} /> },
    { key: 'status', label: 'Status', render: v => <IBBadge value={v} /> },
    { key: 'lastActivity', label: 'Last Active', render: v => <span className="font-mono text-text-muted/60 text-[11px]">{v}</span> },
    {
      key: 'actions', label: 'Actions', align: 'right', render: (_, r) => (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end" onClick={(e) => e.stopPropagation()}>
          <TableActionBtn variant="default" Icon={Edit2} onClick={e => { e.stopPropagation(); act('Edited', r.id); }} />
          <TableActionBtn variant="danger" Icon={Lock} onClick={e => { e.stopPropagation(); act('Suspended', r.id); }} />
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
            Referrals
          </h2>
          <p className="text-[13.5px] text-text-muted/80 mt-2 leading-snug max-w-xl">
            Manage IB partners, referral networks, and their status.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => act('Exported', 'referrals CSV')} className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[11px] font-semibold transition-all cursor-pointer">
            <Download size={12} /> Export
          </button>
          <button onClick={() => act('Add IB', 'form opened')} className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-brand text-text-on-accent border border-brand/20 text-[11px] font-bold transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.97]">
            <UserPlus size={12} /> Add IB Partner
          </button>
        </div>
      </header>

      <IBToast msg={toast} />

      <div className="flex gap-2 flex-wrap">
        {[
          { label: 'Total IBs', val: referralsRows.length, color: 'var(--text-muted)' },
          { label: 'Active', val: referralsRows.filter(r => r.status === 'ACTIVE').length, color: 'var(--positive)' },
          { label: 'Paused', val: referralsRows.filter(r => r.status === 'PAUSED').length, color: 'var(--warning)' },
          { label: 'Suspended', val: referralsRows.filter(r => r.status === 'SUSPENDED').length, color: 'var(--negative)' },
          { label: 'Total Refs', val: referralsRows.reduce((s, r) => s + r.referred, 0).toLocaleString(), color: 'var(--brand)' },
        ].map(p => (
          <div key={p.label} className="flex items-center gap-2 rounded-[8px] border border-border/30 bg-bg/60 px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
            <span className="text-[11px] text-text-muted/70 font-semibold">{p.label}</span>
            <span className="text-[11px] font-mono font-bold" style={{ color: p.color }}>{p.val}</span>
          </div>
        ))}
      </div>

      <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
        <TableToolbar
          title="IB Partners"
          count={filtered.length}
          accentColor="var(--brand)"
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search partners, codes, IDs…"
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
                {REFERRAL_FILTERS.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          }
        />
        <MainTable 
          columns={cols} 
          data={filtered} 
          onRowClick={r => drawerState.open(r)}
          rowClassName={() => "hover:bg-brand/5 hover:border-l-brand cursor-pointer"}
        />
      </section>

      <ReferralDrawer row={drawerState.value} open={drawerState.isOpen} onClose={() => drawerState.close()} onAction={act} />
    </div>
  );
}

export default ReferralsPage;
