import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertOctagon,
  CheckCircle2,
  Download,
  Inbox,
  MessageCircle,
  Plus,
  ShieldAlert,
  Timer,
  UserPlus,
} from 'lucide-react';
import { TableToolbar } from '@/components/common/table';
import { KpiCard } from '@/components/cards';
import { adminSupportApi } from '../services/support.api';
import {
  PRIORITY_ORDER,
  SupportIconBtn,
  SupportToast,
  TicketCard,
} from '@/features/support/components/SupportComponents';

const PER_PAGE = 8;

function TicketsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('all');
  const [priorityF, setPriorityF] = useState('all');
  const [catF, setCatF] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => setToast(msg);

  const [ticketsData, setTicketsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminSupportApi.getTickets().then(data => {
      setTicketsData(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const cats = useMemo(() => ['all', ...new Set(ticketsData.map((ticket) => ticket.category))], [ticketsData]);

  const filtered = useMemo(() => {
    let rows = [...ticketsData];

    if (statusF !== 'all') rows = rows.filter((row) => row.status === statusF);
    if (priorityF !== 'all') rows = rows.filter((row) => row.priority === priorityF);
    if (catF !== 'all') rows = rows.filter((row) => row.category === catF);

    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (row) =>
          row.subject.toLowerCase().includes(q) ||
          row.user.toLowerCase().includes(q) ||
          row.id.includes(q) ||
          row.uid.includes(q)
      );
    }

    if (sortBy === 'priority') rows.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
    if (sortBy === 'sla') rows.sort((a, b) => (a.slaMins ?? 9999) - (b.slaMins ?? 9999));
    if (sortBy === 'updated') rows.sort((a, b) => b.updated.localeCompare(a.updated));

    return rows;
  }, [search, statusF, priorityF, catF, sortBy, ticketsData]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const breachedCount = ticketsData.filter((ticket) => ticket.slaMins != null && ticket.slaMins < 0).length;

  const stats = [
    {
      label: 'Total',
      value: ticketsData.length,
      accent: 'var(--brand)',
      Icon: Inbox,
      sub: 'All tickets',
    },
    {
      label: 'Open',
      value: ticketsData.filter((t) => t.status === 'OPEN').length,
      accent: 'var(--positive)',
      Icon: MessageCircle,
      sub: 'Needs a reply',
    },
    {
      label: 'Pending',
      value: ticketsData.filter((t) => t.status === 'PENDING').length,
      accent: 'var(--warning)',
      Icon: Timer,
      sub: 'In progress',
    },
    {
      label: 'Resolved',
      value: ticketsData.filter((t) => t.status === 'RESOLVED').length,
      accent: 'var(--positive)',
      Icon: CheckCircle2,
      sub: 'Done',
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
            All tickets
          </h2>
          <p className="text-[13.5px] text-text-muted/80 mt-2 leading-snug max-w-lg">
            View and manage all support tickets.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => showToast('Tickets exported')}
            className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[11px] font-semibold transition-all cursor-pointer"
          >
            <Download size={12} /> Export
          </button>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <KpiCard key={stat.label} {...stat} />
        ))}
      </section>

      {breachedCount > 0 && (
        <div className="flex items-start gap-3 rounded-[12px] border border-negative/20 bg-negative/[0.04] px-4 py-3 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="relative mt-0.5 shrink-0 flex items-center justify-center">
            <span className="absolute h-2 w-2 animate-ping rounded-full bg-negative" />
            <AlertOctagon size={14} className="text-negative relative z-10" />
          </div>
          <div className="flex-1">
            <h4 className="text-[13px] font-bold text-negative font-heading tracking-[-0.01em]">
              {breachedCount} overdue ticket{breachedCount > 1 ? 's' : ''}
            </h4>
            <p className="text-[12px] text-negative/80 font-heading mt-1 leading-relaxed">
              {breachedCount > 1 ? 'These tickets are' : 'This ticket is'} past the response deadline.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSortBy('sla');
              setStatusF('all');
              setPage(1);
            }}
            className="flex h-7 flex-shrink-0 items-center gap-1.5 rounded-[7px] border border-negative/25 bg-negative/[0.08] px-3 text-[11.5px] font-semibold text-negative cursor-pointer"
          >
            <Timer size={10} />
            View overdue
          </button>
        </div>
      )}

      <SupportToast msg={toast} onDone={() => setToast(null)} />

      <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
        <TableToolbar
          title="Tickets"
          count={filtered.length}
          accentColor="var(--brand)"
          search={search}
          onSearchChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          searchPlaceholder="Search..."
          filters={
            <>
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-text-muted/70 font-bold uppercase tracking-wider shrink-0">
                  Status:
                </span>
                <select
                  value={statusF}
                  onChange={(e) => {
                    setStatusF(e.target.value);
                    setPage(1);
                  }}
                  className="h-7 rounded-[7px] border border-border/20 bg-bg text-[12.5px] font-semibold text-text px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                  style={{ minWidth: '70px' }}
                >
                  <option value="all">All</option>
                  <option value="OPEN">Open</option>
                  <option value="PENDING">Pending</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[11px] text-text-muted/70 font-bold uppercase tracking-wider shrink-0">
                  Priority:
                </span>
                <select
                  value={priorityF}
                  onChange={(e) => {
                    setPriorityF(e.target.value);
                    setPage(1);
                  }}
                  className="h-7 rounded-[7px] border border-border/20 bg-bg text-[12.5px] font-semibold text-text px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                  style={{ minWidth: '70px' }}
                >
                  <option value="all">All</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
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
                  {cats.map((c) => (
                    <option key={c} value={c}>
                      {c === 'all' ? 'All' : c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[11px] text-text-muted/70 font-bold uppercase tracking-wider shrink-0">
                  Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                  className="h-7 rounded-[7px] border border-border/20 bg-bg text-[12.5px] font-semibold text-text px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                  style={{ minWidth: '70px' }}
                >
                  <option value="priority">Priority</option>
                  <option value="sla">SLA</option>
                  <option value="updated">Updated</option>
                </select>
              </div>
            </>
          }
        />

        <div className="p-5 border-t border-border/15">
          {paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 rounded-[12px] bg-brand/8 border border-brand/15 flex items-center justify-center mb-3">
                <AlertOctagon size={20} className="text-brand/40" />
              </div>
              <p className="text-[13px] font-bold text-text/60 tracking-tight">
                No tickets found
              </p>
              <p className="text-[11.5px] text-text-muted/40 mt-1 max-w-[220px] leading-snug">
                Try different filters or search terms.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {paginated.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onView={(t) =>
                    navigate(`/admin/support/tickets/${t.uuid}`, {
                      state: { fromEscalated: false },
                    })
                  }
                  onAssign={(t) => showToast(`Assigned: ${t.id}`)}
                  onResolve={(t) => showToast(`Closed: ${t.id}`)}
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

export default TicketsPage;
