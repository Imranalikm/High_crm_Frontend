import React, { useMemo, useState } from 'react';
import { Download, ShieldAlert, Clock, User, Activity, FileText } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { PageShell } from '@/components/layout/PageShell';
import { useTableState } from '@/hooks/useTableState';
import { TableToolbar, MainTable } from '@/components/common/table';
import { exportRows } from '@/utils/exporters';
import { usersService } from '../services/userService';
import { UsersKPIGrid } from '../components/UsersKpiGrid';

const PAGE = {
  accent: 'var(--brand)',
  eyebrow: 'Activity Log',
  title: 'Action History',
  description: 'A complete history of actions taken by administrators and the system.',
};

function filterBySearch(items, search, fields) {
  const query = search.trim().toLowerCase();
  if (!query) return items;
  return items.filter((item) => (
    fields.some((field) => String(item[field] ?? '').toLowerCase().includes(query))
  ));
}

function UsersAuditPage() {
  const [search, setSearch] = useState('');
  const [authorFilter, setAuthorFilter] = useState('all');

  const rawLogs = useMemo(() => usersService.listAdminAuditLogs() || [], []);

  // Filter list of authors for filter dropdown
  const authors = useMemo(() => {
    const list = [...new Set(rawLogs.map((l) => l.author))].filter(Boolean);
    return list.sort();
  }, [rawLogs]);

  // Handle search and admin filters
  const filteredLogs = useMemo(() => {
    let rows = filterBySearch(rawLogs, search, ['id', 'author', 'target', 'action', 'time']);
    if (authorFilter !== 'all') {
      rows = rows.filter((r) => r.author === authorFilter);
    }
    return rows;
  }, [search, authorFilter, rawLogs]);

  // Compute activity metrics
  const kpis = useMemo(() => {
    const totalCount = rawLogs.length;
    const uniqueTargets = [...new Set(rawLogs.map((l) => l.target))].filter(Boolean).length;
    const uniqueAuthors = authors.length;
    const lastAction = rawLogs[0]?.time ?? 'Never';

    return [
      { label: 'Total Actions', value: totalCount, subtext: 'Total logged actions', trend: 'All recorded changes', positive: true, Icon: Activity, accent: 'var(--brand)' },
      { label: 'Affected Users', value: uniqueTargets, subtext: 'Users modified', trend: 'Impact scope', positive: true, Icon: FileText, accent: 'var(--cyan)' },
      { label: 'Staff Members', value: uniqueAuthors, subtext: 'Active administrators', trend: 'Authorized team', positive: true, Icon: User, accent: 'var(--positive)' },
      { label: 'Last Action Time', value: lastAction, subtext: 'Most recent change', trend: 'Live logs', positive: true, Icon: Clock, accent: 'var(--warning)' },
    ];
  }, [rawLogs, authors]);

  const auditTable = useTableState(filteredLogs, { searchFields: [], initialPageSize: 15 });

  const columns = [
    {
      key: 'id',
      label: 'Action ID',
      render: (val) => (
        <span className="px-2 py-0.5 rounded-[5px] border border-border/12 bg-bg/50 font-mono text-[11px] font-semibold text-text-muted/70 select-none tracking-wider">
          {val}
        </span>
      ),
    },
    {
      key: 'time',
      label: 'Date & Time',
      render: (val) => (
        <span className="font-mono text-[11.5px] text-text-muted/70 font-medium select-none">
          {val}
        </span>
      ),
    },
    {
      key: 'author',
      label: 'Administrator',
      render: (val) => {
        const isSystem = val === 'System';
        return (
          <div className="flex items-center gap-2 select-none">
            <span className={`h-1.5 w-1.5 rounded-full ${isSystem ? 'bg-cyan' : 'bg-brand'} shrink-0`} />
            <span className="text-[12.5px] font-semibold text-text">{val}</span>
          </div>
        );
      },
    },
    {
      key: 'target',
      label: 'Impacted User',
      render: (val) => (
        <span className="text-[12.5px] font-semibold text-brand uppercase tracking-wider select-all">
          {val}
        </span>
      ),
    },
    {
      key: 'action',
      label: 'Action Taken',
      render: (val) => {
        const isSecurity = val.includes('Lock') || val.includes('Block') || val.includes('Suspend') || val.includes('Decline') || val.includes('Hedge') || val.includes('Close');
        return (
          <div className="flex items-center gap-2">
            {isSecurity && <ShieldAlert size={12} className="text-negative shrink-0 animate-pulse" />}
            <span className={`text-[12.5px] leading-relaxed ${isSecurity ? 'text-text font-semibold' : 'text-text-muted/80 font-normal'}`}>
              {val}
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <PageShell>
      <div className="space-y-5">
        {/* ── Header ── */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-muted/70 mb-1.5">
              {PAGE.eyebrow}
            </p>
            <h2 className="text-[26px] font-semibold tracking-[-0.03em] leading-tight text-text">
              {PAGE.title}
            </h2>
            <p className="text-[13.5px] text-text-muted/80 mt-2 leading-snug max-w-lg">
              {PAGE.description}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => exportRows(filteredLogs, `system-audit-logs.csv`)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[11px] font-semibold transition-all cursor-pointer"
            >
              <Download size={12} /> Export Action Logs
            </button>
          </div>
        </header>

        {/* ── KPI Scores ── */}
        <UsersKPIGrid items={kpis} />

        {/* ── Table Logs Card ── */}
        <Card padding={false}>
          <TableToolbar
            title="System Action Logs"
            count={filteredLogs.length}
            accentColor={PAGE.accent}
            search={search}
            onSearchChange={(val) => {
              setSearch(val);
              auditTable.setPage(1);
            }}
            searchPlaceholder="Search action logs..."
            filters={
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-text-muted/70 font-bold uppercase tracking-wider shrink-0 select-none">
                  Filter by Administrator:
                </span>
                <select
                  value={authorFilter}
                  onChange={(e) => {
                    setAuthorFilter(e.target.value);
                    auditTable.setPage(1);
                  }}
                  className="h-7 rounded-[7px] border border-border/20 bg-bg text-[12.5px] font-semibold text-text px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                  style={{ minWidth: '76px' }}
                >
                  <option value="all">ALL</option>
                  {authors.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
            }
          />

          <MainTable
            columns={columns}
            data={auditTable.items}
            rowKey="id"
            emptyTitle="No actions found matching your search."
            pagination={auditTable}
            rowClassName={(row) => {
              const isSecurity = row.action.includes('Lock') || row.action.includes('Block') || row.action.includes('Suspend') || row.action.includes('Decline');
              return isSecurity
                ? 'hover:bg-negative/[0.015] hover:border-l-negative hover:border-l-3 transition-all duration-150'
                : 'hover:bg-brand/[0.015] hover:border-l-brand hover:border-l-3 transition-all duration-150';
            }}
          />
        </Card>
      </div>
    </PageShell>
  );
}

export default UsersAuditPage;
