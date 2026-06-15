import React, { useState, useMemo } from 'react';
import { Eye, Check, Plus, Download, UserPlus, Users, UserCheck, Clock, Lock, Wallet, ShieldCheck } from 'lucide-react';

import { PageShell } from '@/components/layout/PageShell';
import { MainTable, TableToolbar } from '@/components/common/table';
import { Badge, RiskBadge, StarRating, IBtn, ToastBar } from '../components/CopyTradingActions';
import { KpiCard } from '../components/CopyTradingStatsCards';
import { StatPills } from '../components/CopyTradingFilters';
import { PROVIDER_ROWS } from '@/config/constants/copy-trading/workspaces';

const providersData = PROVIDER_ROWS.map(p => ({
  ...p,
  name: p.provider,
  email: p.email || `${p.provider}@firm.com`,
  joined: p.joined || '2023-06-15',
  kyc: p.kyc || 'APPROVED',
  verified: p.verified ?? true,
  risk: p.risk || 'LOW',
}));
import { ProviderDetailPage } from '../detail/ProviderDetailPage';

const PAGE = {
  eyebrow: 'Copy Trading',
  title: 'Copy Providers',
  description: 'Manage strategy providers, verify identities, and review approvals.',
};

export function ProvidersPage() {
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('ALL');
  const [approvalF, setAF] = useState('ALL');
  const [riskF, setRiskF] = useState('ALL');
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState(null);
  const [toast, setToast] = useState(null);
  const PER = 7;
  const act = (msg, id) => setToast(`${msg}: ${id}`);

  const filtered = useMemo(() => {
    let r = [...providersData];
    if (statusF !== 'ALL') r = r.filter(x => x.status === statusF);
    if (approvalF !== 'ALL') r = r.filter(x => x.approval === approvalF);
    if (riskF !== 'ALL') r = r.filter(x => x.risk === riskF);
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(
        x =>
          x.name.toLowerCase().includes(q) ||
          x.id.toLowerCase().includes(q) ||
          x.region.toLowerCase().includes(q)
      );
    }
    return r;
  }, [search, statusF, approvalF, riskF]);

  const paged = filtered.slice((page - 1) * PER, page * PER);
  const totalAUM = '$11.8M';

  if (detail) return <ProviderDetailPage row={detail} onBack={() => setDetail(null)} act={act} />;

  const columns = [
    {
      key: 'name',
      label: 'Provider',
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
            <div className="text-[10px] font-mono text-text-muted/35">
              {r.id} · {r.region}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'strategies',
      label: 'Strategies',
      render: v => <span className="font-mono font-bold text-cyan">{v}</span>,
    },
    {
      key: 'followers',
      label: 'Followers',
      render: v => <span className="font-mono font-bold text-brand">{v.toLocaleString()}</span>,
    },
    {
      key: 'aum',
      label: 'Funds',
      render: v => <span className="font-mono font-bold text-brand">{v}</span>,
    },
    {
      key: 'winRateN',
      label: 'Win Rate',
      render: (v, r) => <span className="font-mono text-positive">{r.winRate}</span>,
    },
    {
      key: 'ddN',
      label: 'Drawdown',
      render: (v, r) => <span className="font-mono text-negative">{r.drawdown}</span>,
    },
    {
      key: 'verified',
      label: 'Verified',
      render: v =>
        v ? (
          <span className="text-positive flex items-center gap-1 text-[10px] font-bold font-heading">
            <ShieldCheck size={10} />
            YES
          </span>
        ) : (
          <span className="text-negative text-[10px] font-heading font-bold">NO</span>
        ),
    },
    {
      key: 'approval',
      label: 'Approval',
      render: v => <Badge v={v} />,
    },
    {
      key: 'status',
      label: 'Status',
      render: v => <Badge v={v} />,
    },
    {
      key: 'rating',
      label: 'Rating',
      render: v => <StarRating v={v} />,
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
          {r.approval === 'PENDING' && (
            <button
              onClick={() => act('Approved', r.id)}
              className="w-6 h-6 rounded-[5px] border border-positive/20 bg-positive/[0.07] text-positive flex items-center justify-center cursor-pointer bg-surface-elevated/40"
            >
              <Check size={10} />
            </button>
          )}
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
            <IBtn label="Export" Icon={Download} variant="default" onClick={() => act('Exported', 'providers')} />
            <IBtn label="Add Provider" Icon={UserPlus} variant="brand" onClick={() => act('Add provider', 'form')} />
          </div>
        </header>

        {/* KPI Strip */}
        <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
          <KpiCard label="Total Providers" value={providersData.length} color="var(--cyan)" Icon={Users} sub="All" />
          <KpiCard
            label="Active"
            value={providersData.filter(p => p.status === 'ACTIVE').length}
            color="var(--positive)"
            Icon={UserCheck}
            sub="Trading active"
          />
          <KpiCard
            label="Pending Approval"
            value={providersData.filter(p => p.approval === 'PENDING').length}
            color="var(--warning)"
            Icon={Clock}
            sub="Pending review"
            urgent
          />
          <KpiCard
            label="Suspended"
            value={providersData.filter(p => p.status === 'SUSPENDED').length}
            color="var(--negative)"
            Icon={Lock}
            sub="Suspended"
            urgent
          />
          <KpiCard label="Total Funds" value={totalAUM} color="var(--brand)" Icon={Wallet} sub="Copied funds" />
        </section>

        {/* Stat Pills Strip */}
        <StatPills
          items={[
            { k: 'Approved', v: providersData.filter(p => p.approval === 'APPROVED').length, c: 'var(--positive)' },
            { k: 'Pending', v: providersData.filter(p => p.approval === 'PENDING').length, c: 'var(--warning)' },
            { k: 'Review', v: providersData.filter(p => p.approval === 'REVIEW').length, c: 'var(--cyan)' },
            { k: 'Suspended', v: providersData.filter(p => p.status === 'SUSPENDED').length, c: 'var(--negative)' },
            { k: 'Verified', v: providersData.filter(p => p.verified).length, c: 'var(--positive)' },
          ]}
        />

        <ToastBar msg={toast} onDone={() => setToast(null)} />

        {/* Table Registry */}
        <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
          <TableToolbar
            title="All Providers"
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
                    {['ALL', 'ACTIVE', 'SUSPENDED'].map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-text-muted/70 font-bold uppercase tracking-wider shrink-0">Approval:</span>
                  <select
                    value={approvalF}
                    onChange={(e) => { setAF(e.target.value); setPage(1); }}
                    className="h-7 rounded-[7px] border border-border/20 bg-bg text-[12.5px] text-text px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none font-semibold"
                    style={{ minWidth: '80px' }}
                  >
                    {['ALL', 'APPROVED', 'PENDING', 'REVIEW'].map((opt) => (
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
            emptyTitle="No providers found."
            pagination={tableState}
            rowClassName={(row) => {
              if (row.status === 'SUSPENDED') return 'hover:bg-negative/5 hover:border-l-negative';
              if (row.approval === 'PENDING') return 'hover:bg-warning/5 hover:border-l-warning';
              return 'hover:bg-positive/5 hover:border-l-positive';
            }}
          />
        </section>
      </div>
    </PageShell>
  );
}

export default ProvidersPage;
