import React from 'react';
import { CircleDollarSign, ShieldAlert, Download, AlertTriangle, Lock } from 'lucide-react';
import { fundedRows } from '@/config/constants/prop-trading/workspaces/funded.workspace';
import { StatusChip as Badge, RiskChip as RiskBadge, ActionToast } from '@/components/ui';
import { MainTable, TableToolbar } from '@/components/common/table';
import { FundedDrawer } from '../components/PropDrawer';
import { MetricGrid } from '@/components/cards/MetricGrid';
import { usePropWorkspace } from '../hooks/usePropWorkspace';
import { exportRows } from '@/utils/exporters';

// Summary metrics derived from source data
const totalFunded = fundedRows.reduce((s, r) => s + parseInt(r.funded.replace(/\D/g, '')), 0);
const metrics = [
  { label: 'Total Funded', value: `$${totalFunded.toLocaleString()}`, accent: 'var(--brand)' },
  { label: 'Profit/Loss', value: '+$30,687', accent: 'var(--positive)' },
  { label: 'Eligible Payouts', value: `${fundedRows.filter((r) => r.payoutReady).length} accounts`, accent: 'var(--brand)' },
  { label: 'Risk Flags', value: `${fundedRows.filter((r) => r.risk === 'HIGH').length} HIGH`, accent: 'var(--negative)' },
];

function FundedAccountsPage() {
  const ws = usePropWorkspace({
    rows: fundedRows,
    statusKey: 'status',
    searchKey: 'trader',
    searchKey2: 'id',
    customFilter: (r, filter) => r.status === filter || (filter === 'PAYOUT' && r.payoutReady),
  });

  const cols = [
    { key: 'id', label: 'Account', render: (v) => <span className="font-mono text-text-muted/60 text-[10.5px]">{v}</span> },
    {
      key: 'trader', label: 'Trader', render: (v, r) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[5px] bg-primary/[0.1] border border-primary/[0.15] flex items-center justify-center text-[9px] font-bold text-primary font-heading flex-shrink-0">
            {v.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <div className="text-[12px] font-semibold font-heading text-text/80">{v}</div>
            <div className="text-[10px] font-mono text-text-muted/35">{r.uid}</div>
          </div>
        </div>
      )
    },
    { key: 'funded', label: 'Balance', render: (v) => <span className="font-mono font-bold text-brand text-[11px]">{v}</span> },
    {
      key: 'pnl', label: 'Profit/Loss', render: (v, r) => (
        <div>
          <span className="font-mono font-bold text-[11.5px]" style={{ color: v?.startsWith('+') ? 'var(--positive)' : 'var(--negative)' }}>{v}</span>
          <div className="text-[10px] font-mono" style={{ color: r.pnlPct?.startsWith('+') ? 'var(--positive)' : 'var(--negative)', opacity: 0.6 }}>{r.pnlPct}</div>
        </div>
      )
    },
    {
      key: 'drawdown', label: 'Max Loss', render: (v, r) => {
        const pct = parseFloat(v?.replace('-', '').replace('%', '')) || 0;
        const limit = parseFloat(r.maxDD?.replace('%', '')) || 10;
        const ratio = Math.min(pct / limit, 1);
        return (
          <div className="w-20">
            <div className="flex justify-between text-[10px] mb-1">
              <span className="font-mono text-negative">{v}</span>
              <span className="text-text-muted/30 font-mono">{r.maxDD}</span>
            </div>
            <div className="h-1 rounded-full bg-white/[0.05]">
              <div className="h-full rounded-full" style={{ width: `${ratio * 100}%`, background: ratio > 0.8 ? 'var(--negative)' : ratio > 0.5 ? 'var(--warning)' : 'var(--positive)' }} />
            </div>
          </div>
        );
      }
    },
    { key: 'payout', label: 'Payout', render: (v, r) => r.payoutReady ? <span className="font-mono font-bold text-brand text-[11px]">{v}</span> : <span className="text-text-muted/30 text-[10.5px] font-heading">Not eligible</span> },
    { key: 'risk', label: 'Risk', render: (v) => <RiskBadge value={v} /> },
    { key: 'status', label: 'Status', render: (v) => <Badge value={v} /> },
    {
      key: 'actions', label: 'Actions', align: 'right', render: (_, r) => (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end" onClick={(e) => e.stopPropagation()}>
          {r.payoutReady && (
            <button onClick={(e) => { e.stopPropagation(); ws.onAction('Payout approved', r.id); }} className="w-6 h-6 rounded-[5px] border border-positive/20 bg-positive/[0.07] text-positive flex items-center justify-center cursor-pointer hover:brightness-110">
              <CircleDollarSign size={10} />
            </button>
          )}
          <button onClick={(e) => { e.stopPropagation(); ws.onAction('Warning sent', r.id); }} className="w-6 h-6 rounded-[5px] border border-warning/20 bg-warning/[0.07] text-warning flex items-center justify-center cursor-pointer hover:brightness-110"><AlertTriangle size={10} /></button>
          <button onClick={(e) => { e.stopPropagation(); ws.onAction('Account suspended', r.id); }} className="w-6 h-6 rounded-[5px] border border-negative/20 bg-negative/[0.07] text-negative flex items-center justify-center cursor-pointer hover:brightness-110"><Lock size={10} /></button>
        </div>
      )
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
            Funded Accounts
          </h2>
          <p className="text-[13.5px] text-text-muted/80 mt-2 leading-snug max-w-xl">
            Manage funded traders, risk, and payouts.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => exportRows(ws.filtered, 'funded-risk.csv')} className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-warning/20 bg-warning/[0.05] text-warning hover:bg-warning/[0.1] text-[11px] font-bold transition-all cursor-pointer">
            <ShieldAlert size={12} /> Risk Export
          </button>
          <button onClick={() => exportRows(ws.filtered, 'funded-accounts.csv')} className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[11px] font-semibold transition-all cursor-pointer">
            <Download size={12} /> Export CSV
          </button>
          <button onClick={() => ws.onAction('Batch payout initiated', '')} className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-brand text-text-on-accent border border-brand/20 text-[11px] font-bold transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.97]">
            <CircleDollarSign size={12} /> Batch Payout
          </button>
        </div>
      </header>

      <ActionToast msg={ws.toast} />

      <MetricGrid metrics={metrics} />

      <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
        <TableToolbar
          title="All Accounts"
          count={ws.filtered.length}
          accentColor="var(--brand)"
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
                {['ALL', 'ACTIVE', 'WARNED', 'BREACHED', 'PAYOUT'].map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          }
        />
        <MainTable 
          columns={cols} 
          data={ws.filtered} 
          onRowClick={ws.openDrawer}
          rowClassName={(r) => {
            if (r.payoutReady) return 'hover:bg-brand/5 hover:border-l-brand cursor-pointer';
            if (r.status === 'BREACHED' || r.risk === 'HIGH') return 'hover:bg-negative/5 hover:border-l-negative cursor-pointer';
            if (r.status === 'WARNED') return 'hover:bg-warning/5 hover:border-l-warning cursor-pointer';
            return 'hover:bg-brand/5 hover:border-l-brand cursor-pointer';
          }}
        />
      </section>

      <FundedDrawer row={ws.drawer} open={ws.isDrawerOpen} onClose={ws.closeDrawer} onAction={ws.onAction} />
    </div>
  );
}

export default FundedAccountsPage;
