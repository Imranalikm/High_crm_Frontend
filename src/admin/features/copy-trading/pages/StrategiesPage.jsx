import React, { useState, useMemo } from 'react';
import { Eye, PauseCircle, Plus, Download, Layers, UserCheck, Users, Target, TrendingDown, Copy } from 'lucide-react';

import { PageShell } from '@/components/layout/PageShell';
import { MainTable, TableToolbar } from '@/components/common/table';
import { Badge, RiskBadge, IBtn, ToastBar } from '../components/CopyTradingActions';
import { KpiCard } from '../components/CopyTradingStatsCards';
import { StatPills } from '../components/CopyTradingFilters';
import { STRATEGY_ROWS } from '@/config/constants/copy-trading/workspaces';

const strategiesData = STRATEGY_ROWS.map(s => ({
  ...s,
  copiedVol: s.copiedVolume || s.copiedVol,
  aum: s.copiedVolume || s.aum,
  winRateN: parseFloat((s.winRate || '0').replace(/%/g, '')) || 0,
  ddN: parseFloat((s.drawdown || '0').replace(/[-%]/g, '')) || 0,
  roiN: parseFloat((s.roi || '0').replace(/[+%]/g, '')) || 0,
  rating: s.rating || 4.5,
  tags: s.tags || ['forex', 'scalping'],
  phase: s.phase || 'Phase-2',
}));
import { StrategyDetailPage } from '../detail/StrategyDetailPage';

const PAGE = {
  eyebrow: 'Copy Trading',
  title: 'Copy Strategies',
  description: 'Track and manage copy trading strategies, performance, and follower activity.',
};

export function StrategiesPage() {
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('ALL');
  const [riskF, setRiskF] = useState('ALL');
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState(null);
  const [toast, setToast] = useState(null);
  const PER = 6;
  const act = (msg, id) => setToast(`${msg}: ${id}`);

  const filtered = useMemo(() => {
    let r = [...strategiesData];
    if (statusF !== 'ALL') r = r.filter(x => x.status === statusF);
    if (riskF !== 'ALL') r = r.filter(x => x.risk === riskF);
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(
        x =>
          x.name.toLowerCase().includes(q) ||
          x.provider.toLowerCase().includes(q) ||
          x.id.toLowerCase().includes(q)
      );
    }
    return r;
  }, [search, statusF, riskF]);

  const paged = filtered.slice((page - 1) * PER, page * PER);
  const avgWin = (strategiesData.reduce((s, x) => s + x.winRateN, 0) / strategiesData.length).toFixed(1);
  const avgDD = (strategiesData.reduce((s, x) => s + x.ddN, 0) / strategiesData.length).toFixed(1);

  if (detail) return <StrategyDetailPage row={detail} onBack={() => setDetail(null)} act={act} />;

  const columns = [
    {
      key: 'name',
      label: 'Strategy',
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
            <div className="text-[10px] font-mono text-text-muted/35">{r.id}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'provider',
      label: 'Provider',
      render: v => <span className="text-[11px] font-heading text-brand font-semibold">{v}</span>,
    },
    {
      key: 'followers',
      label: 'Followers',
      render: v => <span className="font-mono font-bold text-cyan">{v.toLocaleString()}</span>,
    },
    {
      key: 'copiedVol',
      label: 'Copied Vol.',
      render: v => <span className="font-mono font-bold text-brand">{v}</span>,
    },
    {
      key: 'winRateN',
      label: 'Win Rate',
      render: (v, r) => <span className="font-mono font-bold text-positive">{r.winRate}</span>,
    },
    {
      key: 'ddN',
      label: 'Drawdown',
      render: (v, r) => <span className="font-mono font-bold text-negative">{r.drawdown}</span>,
    },
    {
      key: 'risk',
      label: 'Risk',
      render: v => <RiskBadge v={v} />,
    },
    {
      key: 'status',
      label: 'Status',
      render: v => <Badge v={v} />,
    },
    {
      key: 'lastUpdated',
      label: 'Updated',
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
            <IBtn label="Export" Icon={Download} variant="default" onClick={() => act('Exported', 'strategies')} />
            <IBtn label="New Strategy" Icon={Plus} variant="brand" onClick={() => act('New strategy', 'form opened')} />
          </div>
        </header>

        {/* KPI Strip */}
        <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          <KpiCard label="Total Strategies" value={strategiesData.length} color="var(--cyan)" Icon={Layers} sub="All" />
          <KpiCard
            label="Active Providers"
            value={new Set(strategiesData.filter(s => s.status === 'ACTIVE').map(s => s.provider)).size}
            color="var(--positive)"
            Icon={UserCheck}
            sub="Active now"
          />
          <KpiCard
            label="Total Followers"
            value={strategiesData.reduce((s, x) => s + x.followers, 0).toLocaleString()}
            color="var(--brand)"
            Icon={Users}
            sub="Total"
          />
          <KpiCard label="Copied Volume" value="$12.4M" color="var(--brand)" Icon={Copy} sub="Total" />
          <KpiCard label="Avg Win Rate" value={`${avgWin}%`} color="var(--positive)" Icon={Target} sub="Average" />
          <KpiCard label="Avg Drawdown" value={`-${avgDD}%`} color="var(--negative)" Icon={TrendingDown} sub="Average loss" />
        </section>

        {/* Stat Pills Strip */}
        <StatPills
          items={[
            { k: 'Active', v: strategiesData.filter(s => s.status === 'ACTIVE').length, c: 'var(--positive)' },
            { k: 'Paused', v: strategiesData.filter(s => s.status === 'PAUSED').length, c: 'var(--warning)' },
            { k: 'Review', v: strategiesData.filter(s => s.status === 'REVIEW').length, c: 'var(--cyan)' },
            { k: 'Suspended', v: strategiesData.filter(s => s.status === 'SUSPENDED').length, c: 'var(--negative)' },
          ]}
        />

        <ToastBar msg={toast} onDone={() => setToast(null)} />

        {/* Table Registry */}
        <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
          <TableToolbar
            title="All Strategies"
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
                    {['ALL', 'ACTIVE', 'PAUSED', 'REVIEW', 'SUSPENDED'].map((opt) => (
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
            emptyTitle="No strategies found."
            pagination={tableState}
            rowClassName={(row) => {
              if (row.status === 'SUSPENDED') return 'hover:bg-negative/5 hover:border-l-negative';
              if (row.status === 'PAUSED' || row.status === 'REVIEW') return 'hover:bg-warning/5 hover:border-l-warning';
              return 'hover:bg-positive/5 hover:border-l-positive';
            }}
          />
        </section>
      </div>
    </PageShell>
  );
}

export default StrategiesPage;
