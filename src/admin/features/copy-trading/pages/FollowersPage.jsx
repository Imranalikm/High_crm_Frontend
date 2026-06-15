import React, { useState, useMemo } from 'react';
import { Eye, PauseCircle, Download, Users, UserCheck, ShieldAlert, BarChart2 } from 'lucide-react';

import { PageShell } from '@/components/layout/PageShell';
import { MainTable, TableToolbar } from '@/components/common/table';
import { Badge, RiskBadge, IBtn, ToastBar } from '../components/CopyTradingActions';
import { KpiCard } from '../components/CopyTradingStatsCards';
import { StatPills } from '../components/CopyTradingFilters';
import { FOLLOWER_ROWS } from '@/config/constants/copy-trading/workspaces';

const followersData = FOLLOWER_ROWS.map(f => ({
  ...f,
  alloc: f.allocation || f.alloc,
  ratio: f.copyRatio || f.ratio,
  pnl: f.pnlImpact || f.pnl,
  pnlN: parseFloat((f.pnlImpact || f.pnl || '0').replace(/[+$$,]/g, '')) || 0,
}));
import { FollowerDetailPage } from '../detail/FollowerDetailPage';

const PAGE = {
  eyebrow: 'Copy Trading',
  title: 'Copy Followers',
  description: 'Track followers copying strategies, active allocations, and profit/loss.',
};

export function FollowersPage() {
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('ALL');
  const [riskF, setRiskF] = useState('ALL');
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState(null);
  const [toast, setToast] = useState(null);
  const PER = 7;
  const act = (msg, id) => setToast(`${msg}: ${id}`);

  const filtered = useMemo(() => {
    let r = [...followersData];
    if (statusF !== 'ALL') r = r.filter(x => x.status === statusF);
    if (riskF !== 'ALL') r = r.filter(x => x.risk === riskF);
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(
        x =>
          x.follower.toLowerCase().includes(q) ||
          x.uid.toLowerCase().includes(q) ||
          x.provider.toLowerCase().includes(q) ||
          x.strategy.toLowerCase().includes(q)
      );
    }
    return r;
  }, [search, statusF, riskF]);

  const paged = filtered.slice((page - 1) * PER, page * PER);
  const totalPnl = followersData.reduce((s, f) => s + f.pnlN, 0);

  if (detail) return <FollowerDetailPage row={detail} onBack={() => setDetail(null)} act={act} />;

  const columns = [
    {
      key: 'follower',
      label: 'Follower',
      render: (v, r) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[8px] bg-primary/[0.1] border border-primary/[0.16] flex items-center justify-center text-[10px] font-bold text-primary font-heading flex-shrink-0">
            {v
              .split(' ')
              .map(n => n[0])
              .join('')
              .slice(0, 2)}
          </div>
          <div>
            <div className="text-[12px] font-semibold font-heading text-text/85">{v}</div>
            <div className="text-[10px] font-mono text-text-muted/35">{r.uid}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'provider',
      label: 'Provider',
      render: v => <span className="text-[11px] font-heading text-brand">{v}</span>,
    },
    {
      key: 'strategy',
      label: 'Strategy',
      render: v => <span className="text-[11px] font-heading text-text/65 max-w-[160px] block truncate">{v}</span>,
    },
    {
      key: 'alloc',
      label: 'Allocation',
      render: v => <span className="font-mono font-bold text-brand">{v}</span>,
    },
    {
      key: 'ratio',
      label: 'Ratio',
      render: v => <span className="font-mono text-cyan">{v}</span>,
    },
    {
      key: 'pnlN',
      label: 'Profit/Loss',
      render: (v, r) => (
        <span className="font-mono font-bold" style={{ color: v >= 0 ? 'var(--positive)' : 'var(--negative)' }}>
          {r.pnl}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: v => <Badge v={v} />,
    },
    {
      key: 'risk',
      label: 'Risk',
      render: v => <RiskBadge v={v} />,
    },
    {
      key: 'lastActivity',
      label: 'Last Active',
      render: v => <span className="font-mono text-text-muted/40 text-[10.5px]">{v}</span>,
    },
    {
      key: '_act',
      label: '',
      align: 'right',
      render: (_, r) => (
        <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => setDetail(r)}
            className="w-6 h-6 rounded-[5px] border border-white/[0.08] flex items-center justify-center text-text-muted/40 hover:text-text cursor-pointer bg-surface-elevated/40"
          >
            <Eye size={10} />
          </button>
          <button
            onClick={() => act('Toggled', r.id)}
            className="w-6 h-6 rounded-[5px] border border-warning/20 flex items-center justify-center text-warning/60 hover:text-warning cursor-pointer bg-surface-elevated/40"
          >
            <PauseCircle size={10} />
          </button>
        </div>
      ),
    },
  ];

  const tableState = {
    page,
    pageSize: PER,
    onPageChange: setPage,
    totalPages: Math.ceil(filtered.length / PER),
  };

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
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <IBtn label="Export" Icon={Download} variant="default" onClick={() => act('Exported', 'followers')} />
          </div>
        </header>

        {/* KPI Strip */}
        <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
          <KpiCard label="Total Followers" value={followersData.length} color="var(--cyan)" Icon={Users} sub="All" />
          <KpiCard
            label="Active"
            value={followersData.filter(f => f.status === 'ACTIVE').length}
            color="var(--positive)"
            Icon={UserCheck}
            sub="Active"
          />
          <KpiCard
            label="Paused"
            value={followersData.filter(f => f.status === 'PAUSED').length}
            color="var(--warning)"
            Icon={PauseCircle}
            sub="Paused"
          />
          <KpiCard
            label="High Risk"
            value={followersData.filter(f => f.risk === 'HIGH').length}
            color="var(--negative)"
            Icon={ShieldAlert}
            sub="High risk"
            urgent
          />
          <KpiCard
            label="Total Profit/Loss"
            value={`${totalPnl >= 0 ? '+' : ''}$${totalPnl.toLocaleString()}`}
            color={totalPnl >= 0 ? 'var(--positive)' : 'var(--negative)'}
            Icon={BarChart2}
            sub="Total profit/loss"
          />
        </section>

        {/* Stat Pills Strip */}
        <StatPills
          items={[
            { k: 'Active', v: followersData.filter(f => f.status === 'ACTIVE').length, c: 'var(--positive)' },
            { k: 'Paused', v: followersData.filter(f => f.status === 'PAUSED').length, c: 'var(--warning)' },
            { k: 'High Risk', v: followersData.filter(f => f.risk === 'HIGH').length, c: 'var(--negative)' },
            { k: 'Winning', v: followersData.filter(f => f.pnlN > 0).length, c: 'var(--positive)' },
            { k: 'Losing', v: followersData.filter(f => f.pnlN < 0).length, c: 'var(--negative)' },
          ]}
        />

        <ToastBar msg={toast} onDone={() => setToast(null)} />

        {/* Table Registry */}
        <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
          <TableToolbar
            title="All Followers"
            count={filtered.length}
            accentColor="var(--cyan)"
            search={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            searchPlaceholder="Search..."
            filters={
              <>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-text-muted/70 font-bold uppercase tracking-wider shrink-0">Status:</span>
                  <select
                    value={statusF}
                    onChange={(e) => { setStatusF(e.target.value); setPage(1); }}
                    className="h-7 rounded-[7px] border border-border/20 bg-bg text-[12.5px] text-text px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none font-semibold"
                    style={{ minWidth: '80px' }}
                  >
                    {['ALL', 'ACTIVE', 'PAUSED'].map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-text-muted/70 font-bold uppercase tracking-wider shrink-0">Risk:</span>
                  <select
                    value={riskF}
                    onChange={(e) => { setRiskF(e.target.value); setPage(1); }}
                    className="h-7 rounded-[7px] border border-border/20 bg-bg text-[12.5px] text-text px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none font-semibold"
                    style={{ minWidth: '80px' }}
                  >
                    {['ALL', 'LOW', 'MED', 'HIGH'].map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </>
            }
          />

          <MainTable
            columns={columns}
            data={paged}
            onRowClick={(row) => setDetail(row)}
            emptyTitle="No followers found."
            pagination={tableState}
            rowClassName={(row) => {
              if (row.status === 'PAUSED') return 'hover:bg-warning/5 hover:border-l-warning';
              if (row.risk === 'HIGH') return 'hover:bg-negative/5 hover:border-l-negative';
              return 'hover:bg-positive/5 hover:border-l-positive';
            }}
          />
        </section>
      </div>
    </PageShell>
  );
}

export default FollowersPage;
