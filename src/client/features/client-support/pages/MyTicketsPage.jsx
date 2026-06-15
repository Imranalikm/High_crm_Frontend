import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronDown } from 'lucide-react';
import { useTickets } from '../hooks/useTickets';
import { TicketTable } from '../components/TicketTable';
import { PageShell } from '@/shared/components/layout/PageShell';
import { useUniversalDrawer } from '@/shared/components/overlays';
import { CreateTicketDrawer } from './CreateTicketDrawer';
import { TableToolbar } from '@/components/common/table';

const statusOptions = [
  { value: 'ALL', label: 'ALL' },
  { value: 'OPEN', label: 'OPEN' },
  { value: 'PENDING', label: 'PENDING' },
  { value: 'RESOLVED', label: 'RESOLVED' },
];

const categoryOptions = [
  { value: 'ALL', label: 'ALL' },
  { value: 'Finance', label: 'FINANCE' },
  { value: 'KYC', label: 'KYC' },
  { value: 'Technical', label: 'TECHNICAL' },
  { value: 'Copy Trading', label: 'COPY TRADING' },
  { value: 'Account', label: 'ACCOUNT' },
];

const priorityOptions = [
  { value: 'ALL', label: 'ALL' },
  { value: 'HIGH', label: 'HIGH' },
  { value: 'MED', label: 'MEDIUM' },
  { value: 'LOW', label: 'LOW' },
];

function SelectFilter({ label, value, onChange, options, minWidth }) {
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      {label && (
        <span className="text-[10px] font-black uppercase tracking-wider text-text-muted/65 shrink-0">
          {label}:
        </span>
      )}
      <div className="relative inline-flex items-center">
        <select
          value={value}
          onChange={onChange}
          className="h-7 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text pl-2 pr-6 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none font-bold"
          style={{ minWidth }}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={10}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted/40 pointer-events-none"
        />
      </div>
    </div>
  );
}

export function MyTicketsPage() {
  const navigate = useNavigate();
  const { openDrawer } = useUniversalDrawer();
  const {
    filtered, loading, tickets,
    statusFilter,   setStatusFilter,
    categoryFilter, setCategoryFilter,
    priorityFilter, setPriorityFilter,
    search, setSearch,
  } = useTickets();

  const [page, setPage] = React.useState(1);
  const PER_PAGE = 8;

  // Reset page when any filters change
  React.useEffect(() => {
    setPage(1);
  }, [statusFilter, categoryFilter, priorityFilter, search]);

  const pagedTickets = React.useMemo(() => {
    return filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const paginationState = {
    page,
    totalPages,
    pageSize: PER_PAGE,
    onPageChange: (newPage) => setPage(newPage),
    onPageSizeChange: () => {}
  };

  const hasActiveFilters = search || statusFilter !== 'ALL' || categoryFilter !== 'ALL' || priorityFilter !== 'ALL';
  const resetFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setCategoryFilter('ALL');
    setPriorityFilter('ALL');
  };

  const openCount = tickets.filter((t) => t.status === 'OPEN').length;

  return (
    <PageShell className="max-w-[1400px] w-full">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-section-eyebrow">Support</p>
          <h1 className="font-heading font-semibold text-[27px] tracking-[-0.04em] text-text mt-1">Support tickets</h1>
          <p className="text-[13px] text-text-muted mt-1">
            {tickets.length} total · {openCount} open
          </p>
        </div>
        <button
          onClick={() => openDrawer(CreateTicketDrawer)}
          className="h-10 px-4 rounded-[9px] bg-brand text-text-on-accent text-[12.5px] font-bold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all duration-150 shadow-sm"
        >
          <Plus size={14} /> New Ticket
        </button>
      </div>

      {/* Table card */}
      <div className="rounded-[16px] border border-border/35 bg-surface-elevated overflow-hidden shadow-sm">
        <TableToolbar
          title="Tickets"
          count={filtered.length}
          accentColor="var(--brand)"
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search..."
          filters={
            <>
              {/* Status Filter */}
              <SelectFilter
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={statusOptions}
                minWidth="80px"
              />

              {/* Category Filter */}
              <SelectFilter
                label="Category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                options={categoryOptions}
                minWidth="90px"
              />

              {/* Priority Filter */}
              <SelectFilter
                label="Priority"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                options={priorityOptions}
                minWidth="85px"
              />

              {/* Reset button */}
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="h-7 px-2.5 rounded-[7px] border border-negative/20 bg-negative/5 text-negative hover:bg-negative/10 font-bold text-[10.5px] cursor-pointer transition-all active:scale-[0.97]"
                  title="Reset Filters"
                >
                  Reset
                </button>
              )}
            </>
          }
        />
        <TicketTable
          tickets={pagedTickets}
          loading={loading}
          onSelect={(t) => navigate(`/client/support/tickets/${t.id}`)}
          pagination={paginationState}
        />
      </div>
    </PageShell>
  );
}

export default MyTicketsPage;
