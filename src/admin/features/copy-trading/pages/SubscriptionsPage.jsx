import React, { useState, useMemo } from 'react';
import { Eye, PauseCircle, X, CheckCircle2, XCircle, CalendarDays, CreditCard, Download } from 'lucide-react';

import { PageShell } from '@/components/layout/PageShell';
import { MainTable, TableToolbar } from '@/components/common/table';
import { Badge, IBtn, ToastBar } from '../components/CopyTradingActions';
import { KpiCard } from '../components/CopyTradingStatsCards';
import { StatPills } from '../components/CopyTradingFilters';
import { SUBSCRIPTION_ROWS } from '@/config/constants/copy-trading/workspaces';

const subsData = SUBSCRIPTION_ROWS.map(s => ({
  ...s,
  alloc: s.allocation || s.alloc,
  fee: s.fee || '20%',
}));
import { SubscriptionDetailPage } from '../detail/SubscriptionDetailPage';

const PAGE = {
  eyebrow: 'Copy Trading',
  title: 'Copy Subscriptions',
  description: 'Track copy trading subscriptions, fees, and renewals.',
};

export function SubscriptionsPage() {
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('ALL');
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState(null);
  const [toast, setToast] = useState(null);
  const PER = 7;
  const act = (msg, id) => setToast(`${msg}: ${id}`);

  const filtered = useMemo(() => {
    let r = [...subsData];
    if (statusF !== 'ALL') r = r.filter(x => x.status === statusF);
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(
        x =>
          x.user.toLowerCase().includes(q) ||
          x.id.toLowerCase().includes(q) ||
          x.provider.toLowerCase().includes(q) ||
          x.uid.toLowerCase().includes(q)
      );
    }
    return r;
  }, [search, statusF]);

  const paged = filtered.slice((page - 1) * PER, page * PER);
  const renewalsSoon = subsData.filter(s => {
    if (!s.renewal) return false;
    const d = new Date(s.renewal);
    const now = new Date();
    return (d - now) / (1000 * 60 * 60 * 24) < 30 && s.status === 'ACTIVE';
  }).length;

  if (detail) return <SubscriptionDetailPage row={detail} onBack={() => setDetail(null)} act={act} />;

  const columns = [
    {
      key: 'id',
      label: 'Sub ID',
      render: v => <span className="font-mono text-text-muted/55 text-[10.5px]">{v}</span>,
    },
    {
      key: 'user',
      label: 'User',
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
      key: 'plan',
      label: 'Plan',
      render: v => (
        <span className="text-[10px] font-heading border border-white/[0.06] px-1.5 py-0.5 rounded-[4px] text-text-muted/55">
          {v}
        </span>
      ),
    },
    {
      key: 'alloc',
      label: 'Allocation',
      render: v => <span className="font-mono font-bold text-brand">{v}</span>,
    },
    {
      key: 'startDate',
      label: 'Started',
      render: v => <span className="font-mono text-text-muted/45 text-[10.5px]">{v}</span>,
    },
    {
      key: 'renewal',
      label: 'Renewal',
      render: v => <span className="font-mono text-text-muted/45 text-[10.5px]">{v}</span>,
    },
    {
      key: 'fee',
      label: 'Fee',
      render: v => <span className="font-mono text-warning">{v}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: v => <Badge v={v} />,
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
            onClick={() => act('Paused', r.id)}
            className="w-6 h-6 rounded-[5px] border border-warning/20 flex items-center justify-center text-warning/60 hover:text-warning cursor-pointer bg-surface-elevated/40"
          >
            <PauseCircle size={10} />
          </button>
          <button
            onClick={() => act('Cancelled', r.id)}
            className="w-6 h-6 rounded-[5px] border border-negative/20 flex items-center justify-center text-negative/50 hover:text-negative cursor-pointer bg-surface-elevated/40"
          >
            <X size={10} />
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
            <IBtn label="Export" Icon={Download} variant="default" onClick={() => act('Exported', 'subscriptions')} />
          </div>
        </header>

        {/* KPI Strip */}
        <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
          <KpiCard
            label="Active Subs"
            value={subsData.filter(s => s.status === 'ACTIVE').length}
            color="var(--positive)"
            Icon={CheckCircle2}
            sub="Active"
          />
          <KpiCard
            label="Paused"
            value={subsData.filter(s => s.status === 'PAUSED').length}
            color="var(--warning)"
            Icon={PauseCircle}
            sub="Paused"
          />
          <KpiCard
            label="Expired"
            value={subsData.filter(s => s.status === 'EXPIRED').length}
            color="var(--negative)"
            Icon={XCircle}
            sub="Expired"
            urgent
          />
          <KpiCard label="Renewals Due" value={renewalsSoon} color="var(--warning)" Icon={CalendarDays} sub="Next 30 days" />
          <KpiCard label="Total Subs" value={subsData.length} color="var(--cyan)" Icon={CreditCard} sub="All" />
        </section>

        {/* Stat Pills Strip */}
        <StatPills
          items={[
            { k: 'Active', v: subsData.filter(s => s.status === 'ACTIVE').length, c: 'var(--positive)' },
            { k: 'Paused', v: subsData.filter(s => s.status === 'PAUSED').length, c: 'var(--warning)' },
            { k: 'Expired', v: subsData.filter(s => s.status === 'EXPIRED').length, c: 'var(--negative)' },
            { k: 'Standard', v: subsData.filter(s => s.plan === 'Standard').length, c: 'var(--text-muted)' },
            { k: 'Elite', v: subsData.filter(s => s.plan === 'Elite').length, c: 'var(--brand)' },
          ]}
        />

        <ToastBar msg={toast} onDone={() => setToast(null)} />

        {/* Table Registry */}
        <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
          <TableToolbar
            title="All Subscriptions"
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
                    {['ALL', 'ACTIVE', 'PAUSED', 'EXPIRED'].map((opt) => (
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
            emptyTitle="No subscriptions found."
            pagination={tableState}
            rowClassName={(row) => {
              if (row.status === 'EXPIRED') return 'hover:bg-negative/5 hover:border-l-negative';
              if (row.status === 'PAUSED') return 'hover:bg-warning/5 hover:border-l-warning';
              return 'hover:bg-positive/5 hover:border-l-positive';
            }}
          />
        </section>
      </div>
    </PageShell>
  );
}

export default SubscriptionsPage;
