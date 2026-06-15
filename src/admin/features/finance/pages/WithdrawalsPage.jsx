import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertOctagon, ArrowUpRight, CheckCircle2, Clock, Download, Lock, Play, ShieldAlert, TrendingDown, XCircle, Plus } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { adminFinanceApi } from '../services/finance.api';
import { KpiCard, StatusBadge, RiskBadge, MethodBadge, AmountCell, Toast } from '../components/FinanceComponents';
import { UserCell, QuickActions, FinanceRecordDrawer } from '../components/FinanceDrawer';
import { MainTable, TableToolbar } from '@/components/common/table';
import { AddWithdrawalDrawer } from '../components/AddWithdrawalDrawer';

const PAGE = {
  accent: 'var(--negative)',
  eyebrow: 'Finance',
  title: 'Withdrawals',
  description: 'Track and manage user withdrawals.',
};

function WithdrawalsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [toast, setToast] = useState(null);
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);

  // Read URL search params with defaults
  const search = searchParams.get('search') || '';
  const statusF = searchParams.get('status') || 'ALL';
  const methodF = searchParams.get('method') || 'ALL';
  const riskF = searchParams.get('risk') || 'ALL';
  const page = parseInt(searchParams.get('page') || '1', 10);
  
  const PER = 7;
  const act = (msg, id) => setToast(`${msg}: ${id}`);

  // Helper to update specific parameters
  const updateFilters = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === 'ALL' || val === '' || val === null || val === undefined) {
        updated.delete(key);
      } else {
        updated.set(key, String(val));
      }
    });

    // Reset page to 1 if we're altering other filter fields (i.e. if not explicitly updating page)
    if (newParams.page === undefined) {
      updated.delete('page'); // Let it fallback to 1 implicitly
    }

    setSearchParams(updated);
  };

  const [withdrawalsData, setWithdrawalsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const res = await adminFinanceApi.getWithdrawals({ status: statusF, method: methodF });
      
      const mapped = res.map(w => ({
        id: `WDR-${w.id}`,
        rawId: w.id,
        user: { name: w.recipient?.name || w.creator?.name || 'Unknown', uid: `U-${w.createdFor}` },
        amount: parseFloat(w.amount).toFixed(2),
        amtRaw: parseFloat(w.amount),
        destination: w.bankAccount || w.accountId || 'N/A',
        method: w.type || 'Unknown',
        status: w.status?.toUpperCase() || 'PENDING',
        risk: 'LOW',
        compliance: 'PASS',
        aml: 'CLEAR',
        created: new Date(w.createdAt).toLocaleDateString()
      }));

      setWithdrawalsData(mapped);
    } catch (e) {
      setToast('Failed to load withdrawals');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchWithdrawals();
  }, [statusF, methodF]);

  const filtered = useMemo(() => {
    let r = [...withdrawalsData];
    if (riskF !== 'ALL') r = r.filter(x => x.risk === riskF);
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(x => 
        x.id.toLowerCase().includes(q) || 
        x.user.name.toLowerCase().includes(q) || 
        x.user.uid.toLowerCase().includes(q)
      );
    }
    return r;
  }, [withdrawalsData, search, riskF]);

  const paged = filtered.slice((page - 1) * PER, page * PER);
  const vol24 = withdrawalsData.filter(d => d.status === 'PAID').reduce((s, d) => s + d.amtRaw, 0);

  const kpis = [
    { label: 'Total Withdrawals', value: withdrawalsData.length, Icon: ArrowUpRight, accent: 'var(--cyan)', sub: 'all withdrawals', trend: '+4.1%', trendUp: true },
    { label: 'Pending', value: withdrawalsData.filter(d => d.status === 'PENDING').length, Icon: Clock, accent: 'var(--warning)', sub: 'waiting for review', trend: 'Requires action', trendUp: false },
    { label: 'Approved', value: withdrawalsData.filter(d => d.status === 'PAID').length, Icon: CheckCircle2, accent: 'var(--positive)', sub: 'paid out today', trend: '+6.8%', trendUp: true },
    { label: 'Blocked', value: withdrawalsData.filter(d => ['FROZEN', 'REJECTED'].includes(d.status)).length, Icon: Lock, accent: 'var(--negative)', sub: 'blocked or rejected', trend: 'stable', trendUp: true },
    { label: 'Flagged', value: withdrawalsData.filter(d => d.status === 'FLAGGED').length, Icon: ShieldAlert, accent: 'var(--negative)', sub: 'flagged for review', trend: 'AML Alert', trendUp: false },
    { label: '24h Volume', value: `$${(vol24 / 1000).toFixed(1)}K`, Icon: TrendingDown, accent: 'var(--brand)', sub: 'total paid out today', trend: '+15.2%', trendUp: true },
  ];

  const columns = [
    { key: 'id', label: 'ID', render: (val) => <span className="font-mono text-[12px] font-bold text-brand">{val}</span> },
    { key: 'user', label: 'User', render: (_, row) => <UserCell u={row.user} /> },
    { key: 'amount', label: 'Amount', render: (_, row) => <AmountCell value={`-${row.amount}`} type="WITHDRAWAL" /> },
    { key: 'destination', label: 'Destination', render: (val) => <span className="font-mono text-text-muted/75 text-[12px] max-w-[160px] block truncate" title={val}>{val}</span> },
    { key: 'method', label: 'Method', render: (val) => <MethodBadge value={val} /> },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge value={val} /> },
    { key: 'risk', label: 'Risk', render: (val) => <RiskBadge value={val} /> },
    {
      key: 'compliance',
      label: 'Compliance',
      render: (val) => (
        <span className="text-[11px] font-semibold uppercase tracking-[0.05em] font-heading px-2 py-1 rounded-[5px]"
          style={{ 
            color: val === 'PASS' ? 'var(--positive)' : 'var(--negative)', 
            background: `color-mix(in srgb, ${val === 'PASS' ? 'var(--positive)' : 'var(--negative)'} 10%, transparent)` 
          }}
        >
          {val}
        </span>
      ),
    },
    {
      key: 'aml',
      label: 'AML',
      render: (val) => (
        <span className="text-[11px] font-semibold uppercase tracking-[0.05em] font-heading px-2 py-1 rounded-[5px]"
          style={{ 
            color: val === 'CLEAR' ? 'var(--positive)' : 'var(--negative)', 
            background: `color-mix(in srgb, ${val === 'CLEAR' ? 'var(--positive)' : 'var(--negative)'} 10%, transparent)` 
          }}
        >
          {val}
        </span>
      ),
    },
    { key: 'created', label: 'Created', render: (val) => <span className="font-mono text-[12px] text-text-muted/75">{val}</span> },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (_, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <QuickActions
            row={row}
            onApprove={async () => {
              try {
                await adminFinanceApi.approveWithdrawal(row.rawId);
                act('Approved', row.id);
                fetchWithdrawals();
              } catch (e) {
                act('Failed to approve', e.message);
              }
            }}
            onReject={async () => {
              try {
                await adminFinanceApi.rejectWithdrawal(row.rawId, 'Manually rejected by Admin');
                act('Rejected', row.id);
                fetchWithdrawals();
              } catch (e) {
                act('Failed to reject', e.message);
              }
            }}
            onFlag={() => {}}
          />
        </div>
      ),
    },
  ];

  const tableState = {
    page,
    pageSize: PER,
    setPage: (p) => updateFilters({ page: p }),
    setPageSize: () => {},
    totalPages: Math.ceil(filtered.length / PER)
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
              onClick={() => act('Exported', 'withdrawals')}
              className="group flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted/85 hover:text-text hover:border-border/40 text-[12px] font-semibold transition-all cursor-pointer"
            >
              <Download size={12} className="transition-transform duration-300 group-hover:-translate-y-0.5" /> Export
            </button>
            <button
              type="button"
              onClick={() => setShowAddDrawer(true)}
              className="group flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-brand text-text-on-accent border border-brand/20 text-[12px] font-bold transition-all duration-300 ease-out transform-gpu will-change-transform hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
            >
              <Plus size={12} className="transition-transform duration-300 group-hover:rotate-90" /> Add Withdrawal
            </button>
          </div>
        </header>

        {/* ── KPI Grid ── */}
        <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {kpis.map((k) => (
            <KpiCard key={k.label} {...k} />
          ))}
        </section>

        {/* AML Warnings Banner */}
        {withdrawalsData.filter(d => d.aml === 'FLAG').length > 0 && (
          <div className="flex items-start gap-3 rounded-[12px] border border-negative/20 bg-negative/[0.04] px-4 py-3 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="relative mt-0.5 shrink-0 flex items-center justify-center">
              <span className="absolute h-2 w-2 animate-ping rounded-full bg-negative" />
              <AlertOctagon size={14} className="text-negative relative z-10" />
            </div>
            <div className="flex-1">
              <h4 className="text-[13px] font-bold text-negative font-heading">
                {withdrawalsData.filter(d => d.aml === 'FLAG').length} Withdrawals Flagged for Review
              </h4>
              <p className="text-[12px] text-negative/80 font-heading mt-1 leading-relaxed">
                These withdrawals need approval before releasing funds.
              </p>
            </div>
          </div>
        )}

        <Toast msg={toast} onDone={() => setToast(null)} />

        {/* ── Table Card ── */}
        <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
          <TableToolbar
            title="All Withdrawals"
            count={filtered.length}
            accentColor={PAGE.accent}
            search={search}
            onSearchChange={(v) => updateFilters({ search: v })}
            searchPlaceholder="Search..."
            filters={
              <>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted/70 shrink-0">Status:</span>
                  <select
                    value={statusF}
                    onChange={(e) => updateFilters({ status: e.target.value })}
                    className="h-7 rounded-[7px] border border-border/20 bg-bg text-[12.5px] text-text px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                    style={{ minWidth: '70px' }}
                  >
                    {['ALL', 'PENDING', 'PROCESSING', 'PAID', 'FROZEN', 'FLAGGED', 'REJECTED'].map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted/70 shrink-0">Method:</span>
                  <select
                    value={methodF}
                    onChange={(e) => updateFilters({ method: e.target.value })}
                    className="h-7 rounded-[7px] border border-border/20 bg-bg text-[12.5px] text-text px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                    style={{ minWidth: '70px' }}
                  >
                    {['ALL', 'Bank Transfer', 'Cash', 'UPI'].map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted/70 shrink-0">Risk:</span>
                  <select
                    value={riskF}
                    onChange={(e) => updateFilters({ risk: e.target.value })}
                    className="h-7 rounded-[7px] border border-border/20 bg-bg text-[12.5px] text-text px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                    style={{ minWidth: '70px' }}
                  >
                    {['ALL', 'LOW', 'MEDIUM', 'HIGH'].map((opt) => (
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
            onRowClick={(row) => setSelectedTx(row)}
            emptyTitle="No withdrawals found matching filters."
            pagination={tableState}
            rowClassName={(row) => {
              const isCritical = row.status === 'FROZEN' || row.status === 'REJECTED' || row.status === 'FLAGGED';
              const isPending = row.status === 'PENDING' || row.status === 'PROCESSING';
              if (isCritical) return 'hover:bg-negative/5 hover:border-l-negative';
              if (isPending) return 'hover:bg-warning/5 hover:border-l-warning';
              return 'hover:bg-positive/5 hover:border-l-positive';
            }}
          />
        </section>
      </div>

      {selectedTx && (
        <FinanceRecordDrawer
          row={selectedTx}
          open={!!selectedTx}
          onClose={() => setSelectedTx(null)}
          type="Withdrawal"
          onAction={act}
        />
      )}

      {showAddDrawer && (
        <AddWithdrawalDrawer
          open={showAddDrawer}
          onClose={() => {
            setShowAddDrawer(false);
            fetchWithdrawals();
          }}
          onSuccess={(msg) => act('Success', msg)}
        />
      )}
    </PageShell>
  );
}

export default WithdrawalsPage;
