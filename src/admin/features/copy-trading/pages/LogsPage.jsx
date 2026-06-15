import React, { useState, useMemo } from 'react';
import { Eye, RefreshCw, Download, Activity, WifiOff, AlertTriangle, AlertOctagon, Bell } from 'lucide-react';

import { PageShell } from '@/components/layout/PageShell';
import { MainTable, TableToolbar } from '@/components/common/table';
import { Badge, SevBadge, IBtn, ToastBar } from '../components/CopyTradingActions';
import { KpiCard } from '../components/CopyTradingStatsCards';
import { StatPills } from '../components/CopyTradingFilters';
import { LOG_ROWS } from '@/config/constants/copy-trading/workspaces';

const logsData = LOG_ROWS.map(l => ({
  ...l,
  id: l.eventId || l.id,
  sev: l.severity || l.sev,
  ts: l.timestamp || l.ts,
}));
import { LogDetailPage } from '../detail/LogDetailPage';

const PAGE = {
  eyebrow: 'Copy Trading',
  title: 'Event Logs',
  description: 'Track system events, sync failures, and warnings.',
};

export function LogsPage() {
  const [search, setSearch] = useState('');
  const [sevF, setSevF] = useState('ALL');
  const [typeF, setTypeF] = useState('ALL');
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState(null);
  const [toast, setToast] = useState(null);
  const PER = 8;
  const act = (msg, id) => setToast(`${msg}: ${id}`);

  const types = ['ALL', ...new Set(logsData.map(l => l.type))];

  const filtered = useMemo(() => {
    let r = [...logsData];
    if (sevF !== 'ALL') r = r.filter(x => x.sev === sevF);
    if (typeF !== 'ALL') r = r.filter(x => x.type === typeF);
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(
        x =>
          x.id.toLowerCase().includes(q) ||
          x.type.toLowerCase().includes(q) ||
          x.source.toLowerCase().includes(q) ||
          x.target.toLowerCase().includes(q)
      );
    }
    return r;
  }, [search, sevF, typeF]);

  const paged = filtered.slice((page - 1) * PER, page * PER);

  if (detail) return <LogDetailPage row={detail} onBack={() => setDetail(null)} act={act} />;

  const columns = [
    {
      key: 'id',
      label: 'Event ID',
      render: v => <span className="font-mono text-text-muted/55 text-[10.5px]">{v}</span>,
    },
    {
      key: 'type',
      label: 'Event Type',
      render: v => <span className="text-[10.5px] font-mono text-text/65">{v.replace(/_/g, ' ')}</span>,
    },
    {
      key: 'source',
      label: 'Source',
      render: v => (
        <span className="text-[10px] font-heading border border-white/[0.06] px-1.5 py-0.5 rounded-[4px] text-text-muted/55">
          {v}
        </span>
      ),
    },
    {
      key: 'target',
      label: 'Target',
      render: v => <span className="font-mono text-cyan text-[10.5px]">{v}</span>,
    },
    {
      key: 'sev',
      label: 'Severity',
      render: v => <SevBadge v={v} />,
    },
    {
      key: 'status',
      label: 'Status',
      render: v => <Badge v={v} />,
    },
    {
      key: 'ts',
      label: 'Timestamp',
      render: v => <span className="font-mono text-text-muted/40 text-[10px]">{v}</span>,
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
          {r.status === 'FAILED' && (
            <button
              onClick={() => act('Retried', r.id)}
              className="w-6 h-6 rounded-[5px] border border-cyan/20 bg-cyan/[0.07] text-cyan flex items-center justify-center cursor-pointer bg-surface-elevated/40"
            >
              <RefreshCw size={10} />
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
            <IBtn label="Export Logs" Icon={Download} variant="default" onClick={() => act('Exported', 'logs')} />
          </div>
        </header>

        {/* KPI Strip */}
        <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
          <KpiCard label="Total Events" value={logsData.length} color="var(--cyan)" Icon={Activity} sub="All" />
          <KpiCard
            label="Sync Failures"
            value={logsData.filter(l => l.type.includes('SYNC')).length}
            color="var(--negative)"
            Icon={WifiOff}
            sub="Sync errors"
            urgent
          />
          <KpiCard
            label="Sub Changes"
            value={logsData.filter(l => l.type.includes('SUB')).length}
            color="var(--warning)"
            Icon={Bell}
            sub="Subscriptions"
          />
          <KpiCard
            label="Warnings"
            value={logsData.filter(l => l.sev === 'WARNING' || l.sev === 'CRITICAL').length}
            color="var(--warning)"
            Icon={AlertTriangle}
            sub="Warnings"
            urgent
          />
          <KpiCard
            label="Critical Events"
            value={logsData.filter(l => l.sev === 'CRITICAL').length}
            color="var(--negative)"
            Icon={AlertOctagon}
            sub="Alerts"
            urgent
          />
        </section>

        {/* Flagged Warn Banner (AML standard alignment) */}
        {logsData.filter(l => l.sev === 'CRITICAL').length > 0 && (
          <div className="flex items-start gap-3 rounded-[12px] border border-negative/20 bg-negative/[0.04] px-4 py-3 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="relative mt-0.5 shrink-0 flex items-center justify-center">
              <span className="absolute h-2 w-2 animate-ping rounded-full bg-negative" />
              <AlertOctagon size={14} className="text-negative relative z-10" />
            </div>
            <div className="flex-1">
              <h4 className="text-[13px] font-bold text-negative font-heading">
                {logsData.filter(l => l.sev === 'CRITICAL').length} Critical Event
                {logsData.filter(l => l.sev === 'CRITICAL').length > 1 ? 's' : ''} Require Immediate Review
              </h4>
              <p className="text-[12px] text-negative/80 font-heading mt-0.5 leading-relaxed">
                Check sync failures and risk flags immediately.
              </p>
            </div>
          </div>
        )}

        {/* Stat Pills Strip */}
        <StatPills
          items={[
            { k: 'Info', v: logsData.filter(l => l.sev === 'INFO').length, c: 'var(--cyan)' },
            { k: 'Warning', v: logsData.filter(l => l.sev === 'WARNING').length, c: 'var(--warning)' },
            { k: 'Error', v: logsData.filter(l => l.sev === 'ERROR').length, c: 'var(--negative)' },
            { k: 'Critical', v: logsData.filter(l => l.sev === 'CRITICAL').length, c: 'var(--negative)' },
            { k: 'Failed', v: logsData.filter(l => l.status === 'FAILED').length, c: 'var(--negative)' },
          ]}
        />

        <ToastBar msg={toast} onDone={() => setToast(null)} />

        {/* Table Registry */}
        <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
          <TableToolbar
            title="All Logs"
            count={filtered.length}
            accentColor="var(--cyan)"
            search={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            searchPlaceholder="Search..."
            filters={
              <>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-text-muted/70 font-bold uppercase tracking-wider shrink-0">Severity:</span>
                  <select
                    value={sevF}
                    onChange={(e) => { setSevF(e.target.value); setPage(1); }}
                    className="h-7 rounded-[7px] border border-border/20 bg-bg text-[12.5px] text-text px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none font-semibold"
                    style={{ minWidth: '80px' }}
                  >
                    {['ALL', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'].map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-text-muted/70 font-bold uppercase tracking-wider shrink-0">Type:</span>
                  <select
                    value={typeF}
                    onChange={(e) => { setTypeF(e.target.value); setPage(1); }}
                    className="h-7 rounded-[7px] border border-border/20 bg-bg text-[12.5px] text-text px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none font-semibold"
                    style={{ minWidth: '120px' }}
                  >
                    {types.slice(0, 7).map((opt) => (
                      <option key={opt} value={opt}>{opt.replace(/_/g, ' ')}</option>
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
            emptyTitle="No logs found."
            pagination={tableState}
            rowClassName={(row) => {
              if (row.sev === 'CRITICAL' || row.status === 'FAILED') return 'hover:bg-negative/5 hover:border-l-negative';
              if (row.sev === 'WARNING' || row.status === 'PENDING') return 'hover:bg-warning/5 hover:border-l-warning';
              return 'hover:bg-positive/5 hover:border-l-positive';
            }}
          />
        </section>
      </div>
    </PageShell>
  );
}

export default LogsPage;
