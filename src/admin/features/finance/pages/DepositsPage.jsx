import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDownLeft, CheckCircle2, Clock, Download, Plus, ShieldAlert, TrendingUp, XCircle } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { adminFinanceApi } from '../services/finance.api';
import { KpiCard, StatusBadge, RiskBadge, MethodBadge, AmountCell, Toast } from '../components/FinanceComponents';
import { UserCell, QuickActions } from '../components/FinanceDrawer';
import { NewDepositDrawer } from '../components/NewDepositDrawer';
import { MainTable, TableToolbar } from '@/components/common/table';

const PAGE = {
  accent: 'var(--cyan)',
  eyebrow: 'Finance',
  title: 'Deposits',
  description: 'Track and manage user deposits.',
};

function DepositsPage() {
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('ALL');
  const [methodF, setMethodF] = useState('ALL');
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState(null);
  
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const PER = 7;
  const act = (msg, id) => setToast(`${msg}: ${id}`);

  React.useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    setLoading(true);
    try {
      const data = await adminFinanceApi.getDeposits();
      setDeposits(data);
    } catch (err) {
      console.error(err);
      act('Error fetching deposits', err.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let r = [...deposits];
    if (statusF !== 'ALL') r = r.filter((x) => x.status?.toUpperCase() === statusF);
    if (methodF !== 'ALL') r = r.filter((x) => x.type?.toLowerCase() === methodF.toLowerCase());
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(
        (x) =>
          x.id?.toString().includes(q) ||
          x.creator?.name?.toLowerCase().includes(q) ||
          x.creator?.email?.toLowerCase().includes(q)
      );
    }
    return r;
  }, [deposits, search, statusF, methodF]);

  const paged = filtered.slice((page - 1) * PER, page * PER);
  const vol24 = deposits
    .filter((d) => d.status?.toUpperCase() !== 'FAILED' && d.status?.toUpperCase() !== 'REJECTED')
    .reduce((s, d) => s + (parseFloat(d.amount) || 0), 0);

  const kpis = [
    { label: 'Total Deposits',  value: deposits.length, Icon: ArrowDownLeft, accent: 'var(--cyan)',     sub: 'all deposits',              trend: '+5.4%',          trendUp: true  },
    { label: 'Pending',         value: deposits.filter((d) => d.status === 'pending').length,  Icon: Clock,        accent: 'var(--warning)',   sub: 'waiting for review',    trend: 'Requires action', trendUp: false },
    { label: 'Approved',        value: deposits.filter((d) => d.status === 'approved').length, Icon: CheckCircle2, accent: 'var(--positive)',  sub: 'processed today',       trend: '+8.1%',          trendUp: true  },
    { label: 'Failed/Rejected', value: deposits.filter((d) => ['failed', 'rejected'].includes(d.status)).length,   Icon: XCircle,      accent: 'var(--negative)',  sub: 'failed deposits',       trend: '0 new',          trendUp: true  },
    { label: 'Flagged',         value: deposits.filter((d) => d.status === 'flagged').length,  Icon: ShieldAlert,  accent: 'var(--negative)',  sub: 'flagged for review',    trend: 'AML Hold',       trendUp: false },
    { label: '24h Volume',      value: `$${(vol24 / 1000).toFixed(1)}K`, Icon: TrendingUp, accent: 'var(--brand)', sub: 'total deposited today', trend: '+12.3%',         trendUp: true  },
  ];

  const columns = [
    { key: 'id',         label: 'ID',   render: (val) => <span className="font-mono text-[12px] font-bold text-brand">{val}</span> },
    { key: 'user',       label: 'User',         render: (_, row) => <UserCell u={{ name: row.recipient?.name, email: row.recipient?.email, uid: `U-${row.createdFor}` }} /> },
    { key: 'amount',     label: 'Amount',       render: (val) => <AmountCell value={val ? `$${parseFloat(val).toFixed(2)}` : '$0.00'} type="DEPOSIT" /> },
    { key: 'type',       label: 'Method',       render: (val) => <MethodBadge value={val || 'Unknown'} /> },
    { key: 'status',     label: 'Status',       render: (val) => <StatusBadge value={val} /> },
    { key: 'createdAt',  label: 'Created',      render: (val) => <span className="font-mono text-[12px] text-text-muted/75">{new Date(val).toLocaleDateString()}</span> },
    { key: 'mt5Account', label: 'MT5 Group',    render: (val) => <span className="text-[12px] font-semibold text-text-muted/85">{val?.groupName || 'N/A'}</span> },
    {
      key: 'actions', label: 'Actions', align: 'right',
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <QuickActions
            row={row}
            onApprove={async () => {
              try {
                await adminFinanceApi.approveDeposit(row.id);
                act('Approved', row.id);
                fetchDeposits();
              } catch (e) {
                act('Failed to approve', e.message);
              }
            }}
            onReject={async () => {
              try {
                await adminFinanceApi.rejectDeposit(row.id, 'Manually rejected by Admin');
                act('Rejected', row.id);
                fetchDeposits();
              } catch (e) {
                act('Failed to reject', e.message);
              }
            }}
            onFlag={async () => {
              try {
                await adminFinanceApi.flagDeposit(row.id, 'Flagged for AML/Review by Admin');
                act('Flagged', row.id);
                fetchDeposits();
              } catch (e) {
                act('Failed to flag', e.message);
              }
            }}
          />
        </div>
      ),
    },
  ];

  const tableState = {
    page,
    pageSize: PER,
    setPage,
    setPageSize: () => {},
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
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => act('Exported', 'deposits')}
              className="group flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted/85 hover:text-text hover:border-border/40 text-[12px] font-semibold transition-all cursor-pointer"
            >
              <Download size={12} className="transition-transform duration-300 group-hover:-translate-y-0.5" /> Export
            </button>
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="group flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-brand text-text-on-accent border border-brand/20 text-[12px] font-bold transition-all duration-300 ease-out transform-gpu will-change-transform hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
            >
              <Plus size={12} className="transition-transform duration-300 group-hover:rotate-90" /> New Deposit
            </button>
          </div>
        </header>

        {/* ── KPI Grid ── */}
        <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {kpis.map((k) => (
            <KpiCard key={k.label} {...k} />
          ))}
        </section>

        {/* Flagged warning banner */}
        {deposits.filter((d) => d.status === 'flagged').length > 0 && (
          <div className="flex items-start gap-3 rounded-[12px] border border-negative/20 bg-negative/[0.04] px-4 py-3 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="relative mt-0.5 shrink-0 flex items-center justify-center">
              <span className="absolute h-2 w-2 animate-ping rounded-full bg-negative" />
              <ShieldAlert size={14} className="text-negative relative z-10" />
            </div>
            <div className="flex-1">
              <h4 className="text-[13px] font-bold text-negative font-heading">
                {deposits.filter((d) => d.status === 'flagged').length} Deposits Flagged for Review
              </h4>
              <p className="text-[12px] text-negative/80 font-heading mt-1 leading-relaxed">
                These deposits need approval before crediting to user accounts.
              </p>
            </div>
          </div>
        )}

        <Toast msg={toast} onDone={() => setToast(null)} />

        {/* ── Table Card ── */}
        <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
          <TableToolbar
            title="All Deposits"
            count={filtered.length}
            accentColor={PAGE.accent}
            search={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            searchPlaceholder="Search…"
            filters={
              <>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted/70 shrink-0">Status:</span>
                  <select
                    value={statusF}
                    onChange={(e) => { setStatusF(e.target.value); setPage(1); }}
                    className="h-7 rounded-[7px] border border-border/20 bg-bg text-[12.5px] text-text px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                    style={{ minWidth: '70px' }}
                  >
                    {['ALL', 'PENDING', 'APPROVED', 'FLAGGED', 'FAILED'].map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted/70 shrink-0">Method:</span>
                  <select
                    value={methodF}
                    onChange={(e) => { setMethodF(e.target.value); setPage(1); }}
                    className="h-7 rounded-[7px] border border-border/20 bg-bg text-[12.5px] text-text px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                    style={{ minWidth: '70px' }}
                  >
                    <option value="ALL">ALL</option>
                    <option value="bank">Bank Wire</option>
                    <option value="card">Card</option>
                    <option value="crypto">Crypto</option>
                    <option value="cash">Cash</option>
                  </select>
                </div>
              </>
            }
          />

          <MainTable
            columns={columns}
            data={paged}
            onRowClick={(row) => navigate(`/admin/finance/deposits/${row.id}`)}
            emptyTitle="No deposits found matching filters."
            pagination={tableState}
            rowClassName={(row) => {
              const status = row.status?.toUpperCase() || '';
              const isFlagged = status === 'FLAGGED' || status === 'FAILED' || status === 'REJECTED';
              const isPending = status === 'PENDING';
              if (isFlagged) return 'hover:bg-negative/5 hover:border-l-negative';
              if (isPending) return 'hover:bg-warning/5 hover:border-l-warning';
              return 'hover:bg-positive/5 hover:border-l-positive';
            }}
          />
        </section>
      </div>

      {/* Manual Deposit Drawer */}
      <NewDepositDrawer 
        open={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        onCreated={() => {
          act('Deposit created', 'Successfully manually deposited');
          fetchDeposits();
        }}
      />
    </PageShell>
  );
}

export default DepositsPage;
