import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowDownToLine, ArrowUpFromLine, CheckCircle2, Clock, AlertCircle, XCircle,
  Download, Search, Copy, Calendar, ChevronRight, Info, ArrowLeftRight,
  RefreshCw, FileText, Eye, ArrowUpRight, ArrowDownLeft, ChevronDown
} from 'lucide-react';
import { Card, StatusBadge, Toast } from '@/components/ui';
import { TransactionDetailDrawer } from '../components/TransactionDetailDrawer';
import { MainTable, TableToolbar } from '@/components/common/table';
import { useDrawerState } from '@/hooks/useDrawerState';
import { financeApi } from '../services/finance.api';
import { METHOD_LABELS } from '@/shared/config/constants/finance';

/* ─────────────────────────────────────────────────────────
   Mock transactions data - Customer view
   Spans deposits, withdrawals, transfers, and fees
───────────────────────────────────────────────────────── */


/* ─────────────────────────────────────────────────────────
   Helper for Currency Formatting
───────────────────────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);

/* ─────────────────────────────────────────────────────────
   Custom Dropdown Component with Arrow Down Chevron Icon
───────────────────────────────────────────────────────── */
function SelectFilter({ label, value, onChange, options, minWidth }) {
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      {label && (
        <span className="text-[10px] font-black uppercase tracking-wider text-text-muted/60 shrink-0">
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

export function ClientTransactionsPage() {
  const navigate = useNavigate();

  // ── States for Filters ──
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateRange, setDateRange] = useState('All Time');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [methodFilter, setMethodFilter] = useState('All');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  // ── Pagination State ──
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  // ── Detail Drawer State ──
  const drawerState = useDrawerState(null);

  // ── Toast Alert State ──
  const [toast, setToast] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTxns = async () => {
      try {
        const rawDeposits = await financeApi.getDeposits();
        
        // Map database records to frontend transaction schema
        const mapped = rawDeposits.map(d => {
          const statusMap = {
            'pending': 'PENDING',
            'approved': 'COMPLETED',
            'rejected': 'REJECTED',
            'failed': 'FAILED',
            'flagged': 'FLAGGED'
          };

          return {
            id: `DEP-${d.id}`,
            type: 'Deposit',
            amount: parseFloat(d.amount) || 0,
            fee: 0,
            netAmount: parseFloat(d.amount) || 0,
            method: METHOD_LABELS[d.type] || d.type || 'Unknown',
            source: d.transactionId || 'User Deposit',
            destination: d.mt5Account?.groupName || 'Trading Account',
            status: statusMap[d.status?.toLowerCase()] || 'PENDING',
            date: d.createdAt,
            referenceId: d.mt5DealId || d.transactionId,
            notes: d.note || 'User initiated deposit.',
            statusHistory: [
              { status: 'PENDING', date: new Date(d.createdAt).toLocaleString() },
              ...(d.status !== 'pending' ? [{ status: statusMap[d.status?.toLowerCase()] || d.status?.toUpperCase(), date: new Date(d.updatedAt).toLocaleString() }] : [])
            ]
          };
        });

        setTransactions(mapped);
      } catch (err) {
        console.error("Failed to load transactions", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTxns();
  }, []);

  const triggerToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }, []);

  const copyToClipboard = useCallback((text, typeName) => {
    navigator.clipboard.writeText(text);
    triggerToast(`${typeName} copied to clipboard`);
  }, [triggerToast]);

  // ── Reset Filters ──
  const resetFilters = () => {
    setSearchTerm('');
    setTypeFilter('All');
    setStatusFilter('All');
    setDateRange('All Time');
    setStartDate('');
    setEndDate('');
    setMethodFilter('All');
    setMinAmount('');
    setMaxAmount('');
    triggerToast('All filters cleared');
  };

  const hasActiveFilters = useMemo(() => {
    return (
      searchTerm !== '' ||
      typeFilter !== 'All' ||
      statusFilter !== 'All' ||
      dateRange !== 'All Time' ||
      methodFilter !== 'All' ||
      minAmount !== '' ||
      maxAmount !== ''
    );
  }, [searchTerm, typeFilter, statusFilter, dateRange, methodFilter, minAmount, maxAmount]);

  // Reset page to 1 when filters are changed
  useEffect(() => {
    setPage(1);
  }, [searchTerm, typeFilter, statusFilter, dateRange, startDate, endDate, methodFilter, minAmount, maxAmount]);

  // ── Filter Logic ──
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // 1. Search filter
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesId = t.id.toLowerCase().includes(query);
        const matchesRef = t.referenceId.toLowerCase().includes(query);
        if (!matchesId && !matchesRef) return false;
      }

      // 2. Type filter
      if (typeFilter !== 'All') {
        if (t.type.toLowerCase() !== typeFilter.toLowerCase()) return false;
      }

      // 3. Status filter
      if (statusFilter !== 'All') {
        if (t.status.toUpperCase() !== statusFilter.toUpperCase()) return false;
      }

      // 4. Date range filter
      if (dateRange !== 'All Time') {
        const txnDate = new Date(t.date);
        const now = new Date();
        if (dateRange === 'Today') {
          const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          if (txnDate < startOfToday) return false;
        } else if (dateRange === 'Yesterday') {
          const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
          const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          if (txnDate < startOfYesterday || txnDate >= startOfToday) return false;
        } else if (dateRange === 'Last 7 Days') {
          const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
          if (txnDate < sevenDaysAgo) return false;
        } else if (dateRange === 'Last 30 Days') {
          const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
          if (txnDate < thirtyDaysAgo) return false;
        } else if (dateRange === 'Custom Range') {
          if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            if (txnDate < start) return false;
          }
          if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            if (txnDate > end) return false;
          }
        }
      }

      // 5. Method filter
      if (methodFilter !== 'All') {
        if (!t.method.toLowerCase().includes(methodFilter.toLowerCase())) return false;
      }

      // 6. Amount Range filter
      const absAmount = Math.abs(t.amount);
      if (minAmount && absAmount < parseFloat(minAmount)) return false;
      if (maxAmount && absAmount > parseFloat(maxAmount)) return false;

      return true;
    });
  }, [transactions, searchTerm, typeFilter, statusFilter, dateRange, startDate, endDate, methodFilter, minAmount, maxAmount]);

  // ── Stats Calculations ──
  const stats = useMemo(() => {
    let totalCount = filteredTransactions.length;
    let totalDeposits = 0;
    let totalWithdrawals = 0;
    let pendingCount = 0;
    let completedCount = 0;
    let failedCount = 0;

    filteredTransactions.forEach((t) => {
      if (t.type === 'Deposit') {
        totalDeposits += Math.abs(t.amount);
      } else if (t.type === 'Withdrawal') {
        totalWithdrawals += Math.abs(t.amount);
      }

      if (t.status === 'PENDING') {
        pendingCount++;
      } else if (t.status === 'COMPLETED') {
        completedCount++;
      } else if (t.status === 'FAILED' || t.status === 'CANCELED') {
        failedCount++;
      }
    });

    return {
      totalCount,
      totalDeposits,
      totalWithdrawals,
      pendingCount,
      completedCount,
      failedCount,
    };
  }, [filteredTransactions]);

  // ── Pagination Calculation ──
  const pagedTransactions = useMemo(() => {
    return filteredTransactions.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  }, [filteredTransactions, page]);

  const totalPages = Math.ceil(filteredTransactions.length / PER_PAGE);

  const paginationState = {
    page,
    totalPages,
    pageSize: PER_PAGE,
    onPageChange: (newPage) => setPage(newPage),
    onPageSizeChange: () => {}
  };

  // ── Table Column Definition ──
  const columns = useMemo(() => [
    {
      key: 'id',
      label: 'Transaction ID',
      render: (val) => (
        <div className="flex items-center gap-1.5 min-w-0" onClick={(e) => e.stopPropagation()}>
          <span className="font-mono text-[12px] font-bold text-brand select-all truncate">
            {val}
          </span>
          <button
            onClick={() => copyToClipboard(val, 'Transaction ID')}
            className="text-text-muted/30 hover:text-brand cursor-pointer p-0.5 rounded hover:bg-white/5 transition-colors"
            title="Copy ID"
          >
            <Copy size={11} />
          </button>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (val) => (
        <span className="text-[12px] font-bold text-text">
          {val}
        </span>
      )
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (val) => {
        const isCredit = val > 0;
        const amtColor = isCredit ? 'var(--positive)' : 'var(--text)';
        const amtStr = isCredit ? `+${fmt(val)}` : `-${fmt(Math.abs(val))}`;
        return (
          <span className="font-mono text-[13px] font-bold" style={{ color: amtColor }}>
            {amtStr}
          </span>
        );
      }
    },
    {
      key: 'method',
      label: 'Method',
      render: (val) => (
        <span className="text-[12px] text-text-muted/80">
          {val}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <StatusBadge status={val} size="sm" />
      )
    },
    {
      key: 'date',
      label: 'Date',
      render: (val) => (
        <span className="text-[11.5px] text-text-muted/65">
          {new Date(val).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
      )
    },
    {
      key: 'referenceId',
      label: 'Reference ID',
      render: (val) => (
        <div className="flex items-center gap-1.5 min-w-0" onClick={(e) => e.stopPropagation()}>
          <span className="font-mono text-[11px] text-text-muted/50 truncate select-all">
            {val || 'N/A'}
          </span>
          {val && (
            <button
              onClick={() => copyToClipboard(val, 'Reference ID')}
              className="text-text-muted/20 hover:text-brand cursor-pointer p-0.5 rounded hover:bg-white/5 transition-colors"
              title="Copy Reference"
            >
              <Copy size={11} />
            </button>
          )}
        </div>
      )
    }
  ], [copyToClipboard]);

  // ── Options list for Custom Select Filters ──
  const typeOptions = [
    { value: 'All', label: 'ALL' },
    { value: 'Deposit', label: 'DEPOSIT' },
    { value: 'Withdrawal', label: 'WITHDRAWAL' },
    { value: 'Internal Transfer', label: 'TRANSFER' },
    { value: 'Fee', label: 'FEE' },
    { value: 'Credit', label: 'CREDIT' },
    { value: 'Debit', label: 'DEBIT' }
  ];

  const statusOptions = [
    { value: 'All', label: 'ALL' },
    { value: 'COMPLETED', label: 'COMPLETED' },
    { value: 'PENDING', label: 'PENDING' },
    { value: 'FAILED', label: 'FAILED' },
    { value: 'CANCELED', label: 'CANCELED' },
    { value: 'REJECTED', label: 'REJECTED' },
    { value: 'FLAGGED', label: 'FLAGGED' }
  ];

  const dateOptions = [
    { value: 'All Time', label: 'ALL TIME' },
    { value: 'Today', label: 'TODAY' },
    { value: 'Yesterday', label: 'YESTERDAY' },
    { value: 'Last 7 Days', label: 'LAST 7 DAYS' },
    { value: 'Last 30 Days', label: 'LAST 30 DAYS' },
    { value: 'Custom Range', label: 'CUSTOM' }
  ];

  const methodOptions = [
    { value: 'All', label: 'ALL' },
    { value: 'Stripe Card', label: 'STRIPE' },
    { value: 'USDT', label: 'USDT' },
    { value: 'BTC', label: 'BTC' },
    { value: 'Wire', label: 'WIRE' },
    { value: 'System', label: 'SYSTEM' }
  ];

  // ── CSV Export ──
  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      triggerToast('No data to export');
      return;
    }
    const headers = ['Transaction ID', 'Type', 'Amount', 'Fee', 'Net Amount', 'Method', 'Status', 'Date', 'Reference ID', 'Notes'];
    const rows = filteredTransactions.map((t) => [
      t.id,
      t.type,
      t.amount,
      t.fee,
      t.netAmount,
      t.method,
      t.status,
      t.date,
      t.referenceId,
      t.notes
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Smatams_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast('CSV Export downloaded successfully');
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-section-eyebrow mb-1">Financials</p>
          <h1 className="font-heading font-semibold text-[26px] tracking-[-0.03em] leading-tight text-text mt-0.5">Transaction History</h1>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 h-9 px-4 rounded-[9px] font-semibold text-[12.5px] transition-all duration-200 cursor-pointer active:scale-95"
          style={{ background: 'var(--muted-surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
        >
          <Download size={13} strokeWidth={2} /> Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Txns', value: stats.totalCount, desc: 'Filtered count', color: 'brand', Icon: ArrowLeftRight },
          { label: 'Total Deposits', value: fmt(stats.totalDeposits), desc: 'Funding volume', color: 'positive', Icon: ArrowDownToLine },
          { label: 'Total Withdrawals', value: fmt(stats.totalWithdrawals), desc: 'Withdrawn volume', color: 'negative', Icon: ArrowUpFromLine },
          { label: 'Pending Txns', value: stats.pendingCount, desc: 'In processing', color: 'warning', Icon: Clock },
          { label: 'Completed Txns', value: stats.completedCount, desc: 'Settled events', color: 'positive', Icon: CheckCircle2 },
          { label: 'Failed / Canceled', value: stats.failedCount, desc: 'Unsuccessful', color: 'text-muted', Icon: XCircle }
        ].map((c) => {
          const isMuted = c.color === 'text-muted';
          const colorVar = isMuted ? 'var(--text-muted)' : `var(--${c.color})`;
          const dimVar = `color-mix(in srgb, ${colorVar} 12%, transparent)`;

          return (
            <Card
              key={c.label}
              padding={false}
              className="border-t-[2px] hover:scale-[1.02] transition-transform duration-300"
              style={{ borderTopColor: colorVar }}
            >
              <div className="p-3.5 flex flex-col gap-2">
                <div
                  style={{ background: dimVar, color: colorVar }}
                  className="w-7 h-7 rounded-[6px] flex items-center justify-center shrink-0"
                >
                  <c.Icon size={13} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.12em] text-text-muted/40 mb-0.5 leading-none">
                    {c.label}
                  </p>
                  <p className="font-mono font-bold text-[14px] leading-tight" style={{ color: colorVar }}>
                    {c.value}
                  </p>
                  <p className="text-[9.5px] text-text-muted/45 mt-0.5 leading-normal truncate">{c.desc}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Table Container matching the Admin Table Card styling with Header Toolbar Filters */}
      {filteredTransactions.length > 0 && (
        <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
          {/* Table Toolbar Headers */}
          <TableToolbar
            title="Transactions"
            count={filteredTransactions.length}
            accentColor="var(--brand)"
            search={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search ID or Ref..."
            filters={
              <>
                {/* Type Filter */}
                <SelectFilter
                  label="Type"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  options={typeOptions}
                  minWidth="80px"
                />

                {/* Status Filter */}
                <SelectFilter
                  label="Status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={statusOptions}
                  minWidth="85px"
                />

                {/* Date preset selector */}
                <SelectFilter
                  label="Dates"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  options={dateOptions}
                  minWidth="85px"
                />

                {/* Method Filter */}
                <SelectFilter
                  label="Method"
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  options={methodOptions}
                  minWidth="85px"
                />

                {/* Amount ranges */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-text-muted/60 shrink-0">Range ($):</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={minAmount}
                      onChange={(e) => setMinAmount(e.target.value)}
                      placeholder="Min"
                      className="h-7 w-12 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text placeholder:text-text-muted/30 px-1.5 outline-none focus:border-brand/40 text-center font-bold"
                    />
                    <span className="text-[10px] text-text-muted/30 font-bold">-</span>
                    <input
                      type="number"
                      value={maxAmount}
                      onChange={(e) => setMaxAmount(e.target.value)}
                      placeholder="Max"
                      className="h-7 w-12 rounded-[7px] border border-border/20 bg-bg text-[11px] text-text placeholder:text-text-muted/30 px-1.5 outline-none focus:border-brand/40 text-center font-bold"
                    />
                  </div>
                </div>

                {/* Reset button */}
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="h-7 px-2.5 rounded-[7px] border border-negative/20 bg-negative/5 text-negative hover:bg-negative/10 font-bold text-[10.5px] cursor-pointer transition-all active:scale-[0.97]"
                    title="Reset Filters"
                  >
                    RESET
                  </button>
                )}
              </>
            }
          />

          {/* Custom Range Date Pickers */}
          {dateRange === 'Custom Range' && (
            <div className="px-5 py-2.5 border-b border-border/8 flex items-center gap-3 bg-surface-elevated/40 text-[11px] text-text animate-fade-in flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-[9.5px] font-bold text-text-muted/50 uppercase">Start Date:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-7 rounded-[7px] border border-border/20 bg-bg text-[11.5px] text-text px-2 outline-none focus:border-brand/40 transition-all cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9.5px] font-bold text-text-muted/50 uppercase">End Date:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-7 rounded-[7px] border border-border/20 bg-bg text-[11.5px] text-text px-2 outline-none focus:border-brand/40 transition-all cursor-pointer"
                />
              </div>
            </div>
          )}

          <MainTable
            columns={columns}
            data={pagedTransactions}
            onRowClick={(row) => drawerState.open(row)}
            emptyTitle="No transactions found matching filters."
            pagination={paginationState}
            rowClassName={(row) => {
              const isGreen = row.type === 'Deposit' || row.type === 'Credit';
              const isRed = row.type === 'Withdrawal' || row.type === 'Fee' || row.type === 'Debit';
              if (isGreen) return 'hover:bg-positive/[0.04] hover:border-l-positive';
              if (isRed) return 'hover:bg-negative/[0.04] hover:border-l-negative';
              return 'hover:bg-brand/[0.04] hover:border-l-brand';
            }}
          />
        </section>
      )}

      {/* Empty State */}
      {filteredTransactions.length === 0 && (
        <Card className="py-12" padding={false}>
          <div className="flex flex-col items-center justify-center text-center max-w-sm mx-auto p-6 gap-5 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-surface-2 border border-border/20 flex items-center justify-center text-text-muted/30">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="font-heading font-black text-[15px] text-text mb-1.5">No transactions found</h3>
              <p className="text-[12px] text-text-muted/50 leading-relaxed">
                We couldn't find any transactions matching your filters. Try resetting the filters or add funds to get
                started.
              </p>
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => navigate('/client/finance/deposit')}
                className="flex-1 h-9 flex items-center justify-center gap-2 rounded-[7px] font-bold text-[12px] bg-brand text-text-on-accent hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                <ArrowDownToLine size={13} strokeWidth={2.2} /> Deposit Funds
              </button>
              <button
                onClick={() => navigate('/client/finance/withdraw')}
                className="flex-1 h-9 flex items-center justify-center gap-2 rounded-[7px] font-bold text-[12px] border border-border text-text hover:bg-white/[0.02] active:scale-95 transition-all cursor-pointer"
              >
                <ArrowUpFromLine size={13} strokeWidth={2} /> Withdraw Funds
              </button>
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[11.5px] font-bold text-brand hover:underline cursor-pointer transition-all"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </Card>
      )}

      {/* Detail Slide-Over Drawer */}
      <TransactionDetailDrawer
        transaction={drawerState.value}
        open={drawerState.isOpen}
        onClose={() => drawerState.close()}
        triggerToast={triggerToast}
      />

      {/* Global Toast Alert */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 animate-in fade-in duration-200">
          <Toast msg={toast} />
        </div>
      )}
    </div>
  );
}

export default ClientTransactionsPage;
