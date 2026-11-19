import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Download, Plus, Gift, CreditCard, Percent, Receipt, Layers, AlertTriangle } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { MainTable, TableToolbar } from '@/components/common/table';
import { exportRows } from '@/utils/exporters';
import { useFinanceUpdates } from '@/shared/hooks/useFinanceUpdates';
import { adminFinanceApi } from '../services/finance.api';
import { KpiCard, Toast } from '../components/FinanceComponents';
import { UserCell } from '../components/FinanceDrawer';
import { BalanceOperationDrawer } from '../components/BalanceOperationDrawer';
import { BALANCE_OP_TYPES, BALANCE_OP_TYPE_BY_ID, fmtMoney } from '../components/balanceOpTypes';

const PAGE = {
  accent: 'var(--brand)',
  eyebrow: 'Finance',
  title: 'Balance Operations',
  description: 'Credit, bonus, commission, charges and other MT5 balance operations. Deposits and withdrawals are on their own pages.',
};
const PER = 10;

const selectCls = 'h-7 rounded-[7px] border border-border/20 bg-bg text-[12.5px] text-text px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer';

function TypeBadge({ type, label }) {
  const color = BALANCE_OP_TYPE_BY_ID[type]?.color || 'var(--text-muted)';
  return (
    <span className="inline-flex items-center gap-1.5 rounded-[5px] px-2 py-[3px] text-[10.5px] font-bold uppercase tracking-[0.08em] whitespace-nowrap"
      style={{ color, background: `color-mix(in srgb, ${color} 10%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 22%, transparent)` }}>
      {label}
    </span>
  );
}

function StatusPill({ status, error }) {
  const ok = status === 'completed';
  const color = ok ? 'var(--positive)' : 'var(--negative)';
  return (
    <span title={error || ''} className="text-[10.5px] font-bold uppercase tracking-[0.06em] px-2 py-1 rounded-[5px] cursor-default"
      style={{ color, background: `color-mix(in srgb, ${color} 10%, transparent)` }}>
      {ok ? 'Completed' : 'Failed'}
    </span>
  );
}

function BalanceOperationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const updates = useFinanceUpdates('balance_operation');

  const search = searchParams.get('search') || '';
  const typeF = searchParams.get('type') || 'ALL';
  const statusF = searchParams.get('status') || 'ALL';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const updateFilters = (patch) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([k, v]) => {
      if (v === 'ALL' || v === '' || v == null) next.delete(k); else next.set(k, String(v));
    });
    if (patch.page === undefined) next.delete('page');
    setSearchParams(next);
  };

  const load = useCallback(async () => {
    try {
      const data = await adminFinanceApi.getBalanceOperations({ type: typeF, status: statusF });
      setRows(data);
    } catch (e) {
      setToast(`Failed to load balance operations: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, [typeF, statusF]);

  useEffect(() => { load(); }, [load, updates]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      String(r.id).includes(q) ||
      String(r.accountId).includes(q) ||
      (r.client?.name || '').toLowerCase().includes(q) ||
      (r.client?.email || '').toLowerCase().includes(q) ||
      (r.comment || '').toLowerCase().includes(q) ||
      String(r.dealId || '').includes(q));
  }, [rows, search]);

  const kpis = useMemo(() => {
    const done = rows.filter((r) => r.status === 'completed');
    const net = (...types) => done.filter((r) => types.includes(r.type)).reduce((s, r) => s + r.amount, 0);
    const failed = rows.filter((r) => r.status === 'failed').length;
    return [
      { label: 'Operations', value: done.length, Icon: Layers, accent: 'var(--cyan)', sub: 'completed' },
      { label: 'Net Credit', value: fmtMoney(net(2)), Icon: CreditCard, accent: 'var(--cyan)', sub: 'credit in − out' },
      { label: 'Net Bonus', value: fmtMoney(net(5)), Icon: Gift, accent: 'var(--positive)', sub: 'bonus given − removed' },
      { label: 'Commission', value: fmtMoney(net(6)), Icon: Percent, accent: 'var(--brand)', sub: 'net commission' },
      { label: 'Charges & Tax', value: fmtMoney(net(3, 7)), Icon: Receipt, accent: 'var(--negative)', sub: 'charges + tax' },
      { label: 'Failed', value: failed, Icon: AlertTriangle, accent: 'var(--negative)', sub: 'rejected by MT5', trend: failed ? 'check' : 'none', trendUp: !failed },
    ];
  }, [rows]);

  const columns = [
    { key: 'id', label: 'ID', render: (v) => <span className="font-mono text-[12px] font-bold text-brand">BOP-{v}</span> },
    { key: 'client', label: 'Client', render: (_, r) => <UserCell u={{ name: r.client?.name || 'Unknown', uid: r.userId ? `U-${r.userId}` : '—' }} /> },
    { key: 'accountId', label: 'Account', render: (v) => <span className="font-mono text-[12px] text-text">#{v}</span> },
    { key: 'type', label: 'Type', render: (v, r) => <TypeBadge type={v} label={r.typeLabel} /> },
    {
      key: 'amount', label: 'Amount', align: 'right',
      render: (v) => (
        <span className="font-mono font-bold text-[13px]" style={{ color: v >= 0 ? 'var(--positive)' : 'var(--negative)' }}>
          {v > 0 ? '+' : ''}{fmtMoney(v)}
        </span>
      ),
    },
    { key: 'comment', label: 'Comment', render: (v, r) => <span className="text-[12px] text-text-muted/85 max-w-[180px] block truncate" title={r.note ? `${v}\nNote: ${r.note}` : v}>{v || '—'}</span> },
    { key: 'dealId', label: 'MT5 Deal', render: (v) => <span className="font-mono text-[12px] text-text-muted/75">{v || '—'}</span> },
    { key: 'status', label: 'Status', render: (v, r) => <StatusPill status={v} error={r.errorMessage} /> },
    { key: 'creator', label: 'By', render: (_, r) => <span className="text-[12px] text-text-muted/85">{r.creator?.name || '—'}</span> },
    { key: 'createdAt', label: 'Date', render: (v) => <span className="font-mono text-[12px] text-text-muted/75 whitespace-nowrap">{new Date(v).toLocaleString()}</span> },
  ];

  const paged = filtered.slice((page - 1) * PER, page * PER);

  const handleExport = () => exportRows(filtered.map((r) => ({
    id: `BOP-${r.id}`,
    date: new Date(r.createdAt).toISOString(),
    client: r.client?.name || '',
    email: r.client?.email || '',
    account: r.accountId,
    type: r.typeLabel,
    amount: r.amount,
    comment: r.comment || '',
    note: r.note || '',
    dealId: r.dealId || '',
    status: r.status,
    error: r.errorMessage || '',
    by: r.creator?.name || '',
  })), 'balance-operations.csv');

  return (
    <PageShell>
      <div className="space-y-5 animate-fade-up">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-muted/70 mb-1.5">{PAGE.eyebrow}</p>
            <h2 className="text-[26px] font-semibold tracking-[-0.03em] text-text leading-tight">{PAGE.title}</h2>
            <p className="text-[13.5px] text-text-muted/80 mt-2 leading-snug max-w-xl">{PAGE.description}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button type="button" onClick={handleExport}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted/85 hover:text-text hover:border-border/40 text-[12px] font-semibold transition-all cursor-pointer">
              <Download size={12} /> Export
            </button>
            <button type="button" onClick={() => setShowDrawer(true)}
              className="group flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-brand text-text-on-accent border border-brand/20 text-[12px] font-bold transition-all hover:scale-[1.03] active:scale-[0.97] cursor-pointer">
              <Plus size={12} className="transition-transform duration-300 group-hover:rotate-90" /> New Operation
            </button>
          </div>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {kpis.map((k) => <KpiCard key={k.label} {...k} />)}
        </section>

        <Toast msg={toast} onDone={() => setToast(null)} />

        <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
          <TableToolbar
            title="All Operations"
            count={filtered.length}
            accentColor={PAGE.accent}
            search={search}
            onSearchChange={(v) => updateFilters({ search: v })}
            searchPlaceholder="Client, account, comment, deal…"
            filters={
              <>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted/70 shrink-0">Type:</span>
                  <select value={typeF} onChange={(e) => updateFilters({ type: e.target.value })} className={selectCls}>
                    <option value="ALL">All</option>
                    {BALANCE_OP_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted/70 shrink-0">Status:</span>
                  <select value={statusF} onChange={(e) => updateFilters({ status: e.target.value })} className={selectCls}>
                    <option value="ALL">All</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </>
            }
          />
          <MainTable
            columns={columns}
            data={paged}
            loading={loading}
            emptyTitle={loading ? 'Loading…' : 'No balance operations yet.'}
            pagination={{
              page,
              pageSize: PER,
              setPage: (p) => updateFilters({ page: p }),
              setPageSize: () => {},
              totalPages: Math.max(1, Math.ceil(filtered.length / PER)),
            }}
          />
        </section>
      </div>

      {showDrawer && (
        <BalanceOperationDrawer
          open={showDrawer}
          onClose={() => setShowDrawer(false)}
          onSuccess={(msg) => { setToast(msg); load(); }}
        />
      )}
    </PageShell>
  );
}

export default BalanceOperationsPage;
