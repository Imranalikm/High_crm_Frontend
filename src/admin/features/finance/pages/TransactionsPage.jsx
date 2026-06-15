import React, { useState, useMemo } from 'react';
import { Activity, ArrowDownLeft, ArrowLeftRight, ArrowUpRight, BarChart2, CircleDollarSign, Copy, Download, Eye, FileText, Flag, RefreshCw, RotateCcw, Settings, Star, User, Search } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { transactionsData, TXN_TYPE_CLR, STATUS_CLR } from '@/config/constants/finance/mockData';
import { KpiCard, StatusBadge, MethodBadge, AmountCell, Toast } from '../components/FinanceComponents';
import { UserCell, FinanceRecordDrawer } from '../components/FinanceDrawer';
import { MainTable, TableToolbar } from '@/components/common/table';
import { useDrawerState } from '@/hooks/useDrawerState';

const PAGE = {
  accent: 'var(--brand)',
  eyebrow: 'Finance',
  title: 'Transactions',
  description: 'Track all user transactions.',
};

function TransactionsPage() {
  const [search, setSearch] = useState('');
  const [typeF, setTypeF] = useState('ALL');
  const [statusF, setStatusF] = useState('ALL');
  const [methodF, setMethodF] = useState('ALL');
  const [page, setPage] = useState(1);
  const drawerState = useDrawerState(null);
  const [toast, setToast] = useState(null);
  
  const PER = 8;
  const act = (msg, id) => setToast(`${msg}: ${id}`);

  const filtered = useMemo(() => {
    let r = [...transactionsData];
    if (typeF !== 'ALL') r = r.filter(x => x.type === typeF);
    if (statusF !== 'ALL') r = r.filter(x => x.status === statusF);
    if (methodF !== 'ALL') r = r.filter(x => x.method === methodF);
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(x => 
        x.id.toLowerCase().includes(q) || 
        x.reference.toLowerCase().includes(q) || 
        x.user.name.toLowerCase().includes(q) || 
        x.user.uid.toLowerCase().includes(q)
      );
    }
    return r;
  }, [search, typeF, statusF, methodF]);

  const paged = filtered.slice((page - 1) * PER, page * PER);
  const credits = transactionsData.filter(t => t.amtRaw > 0).reduce((s, t) => s + t.amtRaw, 0);
  const debits = transactionsData.filter(t => t.amtRaw < 0).reduce((s, t) => s + Math.abs(t.amtRaw), 0);
  const reversals = transactionsData.filter(t => t.type === 'REVERSAL').length;

  const kpis = [
    { label: 'Total Transactions', value: transactionsData.length, Icon: ArrowLeftRight, accent: 'var(--cyan)', sub: 'all transactions' },
    { label: 'Credits', value: `$${(credits / 1000).toFixed(1)}K`, Icon: ArrowDownLeft, accent: 'var(--positive)', sub: 'total incoming' },
    { label: 'Debits', value: `$${(debits / 1000).toFixed(1)}K`, Icon: ArrowUpRight, accent: 'var(--negative)', sub: 'total outgoing' },
    { label: 'Reversals', value: reversals, Icon: RotateCcw, accent: 'var(--warning)', sub: 'reversed transactions' },
    { label: 'Flagged', value: transactionsData.filter(t => t.status === 'FLAGGED').length, Icon: Flag, accent: 'var(--negative)', sub: 'flagged for review', urgent: true },
    { label: 'Net Volume', value: `$${((credits - debits) / 1000).toFixed(1)}K`, Icon: BarChart2, accent: 'var(--brand)', sub: 'net movement' },
  ];

  const TXN_ICONS = { 
    DEPOSIT: ArrowDownLeft, 
    WITHDRAWAL: ArrowUpRight, 
    FEE: CircleDollarSign, 
    REVERSAL: RotateCcw, 
    COMMISSION: Star, 
    ADJUSTMENT: Settings 
  };

  const columns = [
    { key: 'id', label: 'ID', render: (val) => <span className="font-mono text-[12px] font-bold text-brand">{val}</span> },
    { key: 'user', label: 'User', render: (_, row) => <UserCell u={row.user} /> },
    {
      key: 'type',
      label: 'Type',
      render: (val) => {
        const Ic = TXN_ICONS[val] || ArrowLeftRight;
        const c = TXN_TYPE_CLR[val] || 'var(--text-muted)';
        return (
          <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-[0.05em] font-heading" style={{ color: c }}>
            <Ic size={12} className="flex-shrink-0" />
            {val}
          </span>
        );
      },
    },
    { key: 'amount', label: 'Amount', render: (_, row) => <AmountCell value={row.amount} type={row.type} /> },
    { key: 'method', label: 'Method', render: (val) => <MethodBadge value={val} /> },
    { key: 'reference', label: 'Reference', render: (val) => <span className="font-mono text-[12px] text-cyan hover:underline">{val}</span> },
    { key: 'status', label: 'Status', render: (val) => <StatusBadge value={val} /> },
    { key: 'ts', label: 'Timestamp', render: (val) => <span className="font-mono text-[12px] text-text-muted/75">{val}</span> },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (_, row) => (
        <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => { e.stopPropagation(); act('Exported', row.id); }}
            className="w-6 h-6 rounded-[5px] border border-border/20 bg-bg text-text-muted/80 hover:text-text cursor-pointer flex items-center justify-center transition-colors"
          >
            <Download size={10} />
          </button>
          {row.status === 'FLAGGED' && (
            <button
              onClick={(e) => { e.stopPropagation(); act('Reviewed', row.id); }}
              className="w-6 h-6 rounded-[5px] border border-warning/20 bg-warning/[0.07] text-warning cursor-pointer flex items-center justify-center transition-colors"
            >
              <Eye size={10} />
            </button>
          )}
        </div>
      ),
    },
  ];

  const tableState = {
    page,
    pageSize: PER,
    setPage,
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
              onClick={() => act('Exported', 'ledger')}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted/85 hover:text-text hover:border-border/40 text-[12px] font-semibold transition-all cursor-pointer"
            >
              <Download size={12} /> Export Ledger
            </button>
          </div>
        </header>

        {/* ── KPI Grid ── */}
        <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {kpis.map((k) => (
            <KpiCard key={k.label} {...k} />
          ))}
        </section>

        <Toast msg={toast} onDone={() => setToast(null)} />

        {/* ── Table Card ── */}
        <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
          <TableToolbar
            title="All Transactions"
            count={filtered.length}
            accentColor={PAGE.accent}
            search={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            searchPlaceholder="Search..."
            filters={
              <>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted/70 shrink-0">Type:</span>
                  <select
                    value={typeF}
                    onChange={(e) => { setTypeF(e.target.value); setPage(1); }}
                    className="h-7 rounded-[7px] border border-border/20 bg-bg text-[12px] text-text px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                    style={{ minWidth: '70px' }}
                  >
                    {['ALL', 'DEPOSIT', 'WITHDRAWAL', 'FEE', 'REVERSAL', 'COMMISSION', 'ADJUSTMENT'].map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted/70 shrink-0">Status:</span>
                  <select
                    value={statusF}
                    onChange={(e) => { setStatusF(e.target.value); setPage(1); }}
                    className="h-7 rounded-[7px] border border-border/20 bg-bg text-[12px] text-text px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                    style={{ minWidth: '70px' }}
                  >
                    {['ALL', 'SETTLED', 'PENDING', 'FLAGGED', 'FROZEN'].map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted/70 shrink-0">Method:</span>
                  <select
                    value={methodF}
                    onChange={(e) => { setMethodF(e.target.value); setPage(1); }}
                    className="h-7 rounded-[7px] border border-border/20 bg-bg text-[12px] text-text px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                    style={{ minWidth: '70px' }}
                  >
                    {['ALL', 'Bank Wire', 'Card', 'Crypto', 'E-Wallet', 'Internal'].map((opt) => (
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
            onRowClick={(row) => drawerState.open(row)}
            emptyTitle="No transactions found matching filters."
            pagination={tableState}
            rowClassName={(row) => {
              const isGreen = row.type === 'DEPOSIT' || row.type === 'COMMISSION';
              const isRed = row.type === 'WITHDRAWAL' || row.type === 'FEE';
              if (isGreen) return 'hover:bg-positive/5 hover:border-l-positive';
              if (isRed) return 'hover:bg-negative/5 hover:border-l-negative';
              return 'hover:bg-warning/5 hover:border-l-warning';
            }}
          />
        </section>
      </div>

      <FinanceRecordDrawer
        row={drawerState.value}
        open={drawerState.isOpen}
        onClose={() => drawerState.close()}
        type="Transaction"
        onAction={act}
      />
    </PageShell>
  );
}

export default TransactionsPage;
