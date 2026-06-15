import React, { useMemo, useState, useEffect } from 'react';
import { Download, Layers, Landmark, Clock, Cpu, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { PageShell } from '@/components/layout/PageShell';
import { useTableState } from '@/hooks/useTableState';
import { TableToolbar } from '@/components/common/table';
import { exportRows } from '@/utils/exporters';
import { usersService } from '../services/userService';
import { UsersMt5Table } from '../components/UsersTable';
import { UsersKPIGrid } from '../components/UsersKpiGrid';
import { tradingAccountsService } from '@/admin/features/trading/services/tradingAccountsService';
import { CreateMt5AccountDrawer } from '../components/CreateMt5AccountDrawer';

const PAGE = {
  accent: 'var(--brand)',
  eyebrow: 'Integration',
  title: 'MT5 Accounts',
  description: 'Monitor trading accounts, connection status, and margins.',
};

function filterBySearch(items, search, fields) {
  const query = search.trim().toLowerCase();
  if (!query) return items;
  return items.filter((item) => (
    fields.some((field) => String(item[field] ?? '').toLowerCase().includes(query))
  ));
}

function MT5QueuePage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serverFilter, setServerFilter] = useState('all');

  const [accounts, setAccounts] = useState([]);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);

  const fetchAccounts = async () => {
    try {
      const data = await tradingAccountsService.list();
      const mapped = data.map(a => ({
        login: a.accountid,
        user: a.user?.name || 'Unknown',
        uid: a.userId,
        server: a.server,
        group: a.groupName,
        leverage: a.leverage,
        equity: a.balance,
        balance: a.balance,
        margin: '$0.00',
        freeMargin: a.balance,
        marginLvl: '—',
        status: a.status,
        lastSync: a.updatedAt
      }));
      setAccounts(mapped);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Load unique servers for dynamic triage dropdowns
  const servers = useMemo(() => {
    const unique = [...new Set(accounts.map((item) => item.server))].filter(Boolean);
    return unique.sort();
  }, [accounts]);

  const filteredMt5 = useMemo(
    () => {
      let rows = filterBySearch(accounts, search, ['login', 'user', 'server', 'group', 'status']);
      if (statusFilter !== 'all') {
        rows = rows.filter((r) => r.status === statusFilter);
      }
      if (serverFilter !== 'all') {
        rows = rows.filter((r) => r.server === serverFilter);
      }
      return rows;
    },
    [accounts, search, statusFilter, serverFilter]
  );

  const kpis = useMemo(() => {
    const list = accounts;
    const totalBalance = list.reduce((acc, curr) => {
      const val = parseFloat(String(curr.balance || '0').replace(/[$,]/g, '')) || 0;
      return acc + val;
    }, 0);
    const uniqueServers = [...new Set(list.map((t) => t.server))].filter(Boolean);
    
    return [
      { label: 'Total Accounts', value: list.length, subtext: 'active accounts', trend: 'Active Accounts', positive: true, Icon: Layers, accent: 'var(--brand)' },
      { label: 'Total Balance', value: `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, subtext: 'total pool of user funds', trend: 'Total Assets', positive: true, Icon: Landmark, accent: 'var(--positive)' },
      { label: 'Active Servers', value: uniqueServers.length, subtext: 'running server nodes', trend: 'MT5 Servers', positive: true, Icon: Cpu, accent: 'var(--cyan)' },
      { label: 'Connection Health', value: '99.8%', subtext: 'stable ping', trend: 'Healthy', positive: true, Icon: Clock, accent: 'var(--warning)', pulse: true },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredMt5]);

  const mt5Table = useTableState(filteredMt5, { searchFields: [], initialPageSize: 10 });

  return (
    <PageShell>
      <div className="space-y-5">

        {/* ── Page Header ── */}
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
              onClick={() => exportRows(filteredMt5, `mt5-accounts.csv`)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[11px] font-semibold transition-all cursor-pointer"
            >
              <Download size={12} /> Export
            </button>
            <button
              type="button"
              onClick={() => setIsCreateDrawerOpen(true)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-brand/20 bg-brand text-text-on-accent text-[11px] font-bold transition-all cursor-pointer hover:bg-brand-hover hover:scale-[1.02]"
            >
              <PlusCircle size={12} /> New Account
            </button>
          </div>
        </header>

        {/* ── MT5 KPI Telemetry scorecard Grid ── */}
        <UsersKPIGrid items={kpis} />

        {/* ── Table registry panel ── */}
        <Card padding={false}>
          <TableToolbar
            title="All MT5 Accounts"
            count={filteredMt5.length}
            accentColor={PAGE.accent}
            search={search}
            onSearchChange={(val) => { setSearch(val); mt5Table.setPage(1); }}
            searchPlaceholder="Search accounts..."
            filters={
              <>
                {/* 1. Status Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-text-muted/70 font-bold uppercase tracking-wider shrink-0 select-none">Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); mt5Table.setPage(1); }}
                    className="h-7 rounded-[7px] border border-border/20 bg-bg text-[12.5px] font-semibold text-text px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                    style={{ minWidth: '76px' }}
                  >
                    <option value="all">ALL</option>
                    {['CONNECTED', 'DISCONNECTED', 'SYNC_DELAY', 'BLOCKED', 'READONLY'].map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                {/* 2. Server Node Filter */}
                {servers.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-text-muted/70 font-bold uppercase tracking-wider shrink-0 select-none">Server:</span>
                    <select
                      value={serverFilter}
                      onChange={(e) => { setServerFilter(e.target.value); mt5Table.setPage(1); }}
                      className="h-7 rounded-[7px] border border-border/20 bg-bg text-[12.5px] font-semibold text-text px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                      style={{ minWidth: '76px' }}
                    >
                      <option value="all">ALL</option>
                      {servers.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            }
          />

          <UsersMt5Table
            tableState={mt5Table}
            onOpenUser={(nextUserId, nextTab) => navigate(`/admin/users/${nextUserId}${nextTab ? `/${nextTab}` : ''}`)}
            onOpenMt5={(entry) => navigate(`/admin/users/mt5/${entry.login}`)}
          />
        </Card>

      </div>

      <CreateMt5AccountDrawer 
        open={isCreateDrawerOpen} 
        onClose={() => setIsCreateDrawerOpen(false)} 
        onSave={() => fetchAccounts()} 
      />
    </PageShell>
  );
}
export default MT5QueuePage;
