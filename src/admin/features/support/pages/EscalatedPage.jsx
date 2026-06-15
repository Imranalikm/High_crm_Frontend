import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertOctagon,
  Download,
  UserPlus,
  Timer,
  ShieldAlert,
  Wallet,
} from 'lucide-react';
import { TableToolbar } from '@/components/common/table';
import { KpiCard } from '@/components/cards';
import { escalatedData } from '@/config/constants/support/mockData';
import {
  SupportIconBtn,
  SupportToast,
  TicketCard,
} from '@/features/support/components/SupportComponents';

const PER_PAGE = 8;

function EscalatedPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [priorityF, setPriority] = useState('all');
  const [catF, setCatF] = useState('all');
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => setToast(msg);

  const filtered = useMemo(() => {
    let rows = [...escalatedData];

    if (priorityF !== 'all') rows = rows.filter((r) => r.priority === priorityF);
    if (catF !== 'all') rows = rows.filter((r) => r.category === catF);

    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.subject.toLowerCase().includes(q) ||
          r.user.toLowerCase().includes(q) ||
          r.id.includes(q)
      );
    }

    return rows.sort((a, b) => (a.slaMins ?? 9999) - (b.slaMins ?? 9999));
  }, [search, priorityF, catF]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const stats = [
    {
      label: 'Total',
      value: escalatedData.length,
      accent: 'var(--negative)',
      Icon: AlertOctagon,
      sub: 'Needs review',
    },
    {
      label: 'Critical',
      value: escalatedData.filter((t) => t.priority === 'CRITICAL').length,
      accent: 'var(--negative)',
      Icon: AlertOctagon,
      sub: 'Urgent action required',
    },
    {
      label: 'Overdue',
      value: escalatedData.filter((t) => t.slaMins != null && t.slaMins < 0).length,
      accent: 'var(--negative)',
      Icon: Timer,
      sub: 'Past deadline',
    },
    {
      label: 'Compliance',
      value: escalatedData.filter((t) => t.category === 'Compliance').length,
      accent: 'var(--warning)',
      Icon: ShieldAlert,
      sub: 'Needs verification',
    },
    {
      label: 'Finance',
      value: escalatedData.filter((t) => ['Finance', 'Prop'].includes(t.category)).length,
      accent: 'var(--warning)',
      Icon: Wallet,
      sub: 'Payment issues',
    },
    {
      label: 'Unassigned',
      value: escalatedData.filter((t) => t.owner === 'Unassigned').length,
      accent: 'var(--negative)',
      Icon: UserPlus,
      sub: 'No owner yet',
    },
  ];

  return (
    <div className="space-y-5 animate-fade-up">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-muted/70 mb-1.5">
            Support
          </p>
          <h2 className="text-[26px] font-semibold tracking-[-0.03em] leading-tight text-text">
            Urgent tickets
          </h2>
          <p className="text-[13.5px] text-text-muted/80 mt-2 leading-snug max-w-lg">
            Review and act on tickets that need attention.
          </p>
        </div>
      </header>

      {escalatedData.length > 0 && (
        <div
          className="flex items-start gap-3 rounded-[12px] border border-negative/25 bg-negative/[0.06] px-5 py-4"
          style={{ boxShadow: '0 0 24px rgba(239,68,68,0.07)' }}
        >
          <AlertOctagon size={16} className="text-negative flex-shrink-0 mt-0.5 animate-pulse" />
          <div className="flex-1">
            <div className="text-[13px] font-semibold text-negative font-heading tracking-[-0.01em]">
              {escalatedData.length} ticket{escalatedData.length > 1 ? 's' : ''} need attention
            </div>
            <div className="text-[12px] text-negative/80 font-heading mt-1">
              {escalatedData.filter((t) => t.priority === 'CRITICAL').length} critical ·{' '}
              {escalatedData.filter((t) => t.slaMins != null && t.slaMins < 0).length} overdue ·{' '}
              {escalatedData.filter((t) => t.owner === 'Unassigned').length} unassigned
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <SupportIconBtn
              label="Assign"
              Icon={UserPlus}
              variant="warning"
              small
              onClick={() => showToast('Assignment panel opened')}
            />
            <SupportIconBtn
              label="Export"
              Icon={Download}
              variant="default"
              small
              onClick={() => showToast('Report exported')}
            />
          </div>
        </div>
      )}

      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {stats.map((s) => (
          <KpiCard key={s.label} {...s} />
        ))}
      </section>

      <SupportToast msg={toast} onDone={() => setToast(null)} />

      <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
        <TableToolbar
          title="Tickets"
          count={filtered.length}
          accentColor="var(--negative)"
          search={search}
          onSearchChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          searchPlaceholder="Search tickets..."
          filters={
            <>
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-text-muted/70 font-bold uppercase tracking-wider shrink-0">
                  Priority:
                </span>
                <select
                  value={priorityF}
                  onChange={(e) => {
                    setPriority(e.target.value);
                    setPage(1);
                  }}
                  className="h-7 rounded-[7px] border border-border/20 bg-bg text-[12.5px] font-semibold text-text px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                  style={{ minWidth: '70px' }}
                >
                  <option value="all">All</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[11px] text-text-muted/70 font-bold uppercase tracking-wider shrink-0">
                  Category:
                </span>
                <select
                  value={catF}
                  onChange={(e) => {
                    setCatF(e.target.value);
                    setPage(1);
                  }}
                  className="h-7 rounded-[7px] border border-border/20 bg-bg text-[12.5px] font-semibold text-text px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                  style={{ minWidth: '70px' }}
                >
                  <option value="all">All</option>
                  <option value="Finance">Finance</option>
                  <option value="Compliance">Compliance</option>
                  <option value="Account">Account</option>
                  <option value="Prop">Prop</option>
                </select>
              </div>
            </>
          }
          actions={
            <SupportIconBtn
              label="Export"
              Icon={Download}
              variant="default"
              small
              onClick={() => showToast('Report downloaded')}
            />
          }
        />

        <div className="p-5 border-t border-border/15">
          {paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 rounded-[12px] bg-negative/8 border border-negative/15 flex items-center justify-center mb-3">
                <AlertOctagon size={20} className="text-negative/50" />
              </div>
              <p className="text-[13px] font-bold text-text/60 tracking-tight">
                No tickets found
              </p>
              <p className="text-[11.5px] text-text-muted/40 mt-1 max-w-[220px] leading-snug">
                Try different filters or search.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {paginated.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onView={(t) =>
                    navigate(`/admin/support/tickets/${t.id}`, {
                      state: { fromEscalated: true },
                    })
                  }
                  onAssign={(t) => showToast(`Assigned: ${t.id}`)}
                  onResolve={(t) => showToast(`Resolved: ${t.id}`)}
                  showEscalate={false}
                />
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border/10 px-5 py-4 bg-bg/5">
            <span className="text-[11px] font-mono text-text-muted/45 font-bold">
              Showing {(page - 1) * PER_PAGE + 1} to {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="flex h-7.5 px-3 items-center justify-center rounded-[6px] border border-border/20 text-[10.5px] font-bold text-text-muted hover:text-text hover:border-border/40 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all bg-surface"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="flex h-7.5 px-3 items-center justify-center rounded-[6px] border border-border/20 text-[10.5px] font-bold text-text-muted hover:text-text hover:border-border/40 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all bg-surface"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default EscalatedPage;
