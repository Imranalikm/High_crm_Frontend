import React, { useMemo, useState, useEffect } from 'react';
import { Download, FileCheck, Layers, Plus, Search, ShieldAlert, Users, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageShell } from '@/components/layout/PageShell';
import { useDrawerState } from '@/hooks/useDrawerState';
import { useTableState } from '@/hooks/useTableState';
import { exportRows } from '@/utils/exporters';
import { usersService } from '../services/userService';
import { tradingAccountsService } from '@/features/trading/services/tradingAccountsService';
import {
  FUNDING_OPTIONS, KYC_OPTIONS, RISK_OPTIONS,
} from '@/config/constants/USER_FORM';
import { buildUserDraft, createDefaultUserDraft } from '@/utils/userDraftUtils';
import { AddUserDrawer } from '../components/AddUserDrawer';
import { UsersKPIGrid } from '../components/UsersKpiGrid';
import { UsersListTable } from '../components/UsersTable';
import { Mt5AccountDrawer, QuickUserDrawer } from '../components/UserDrawers';
import { TableToolbar } from '@/components/common/table';

const USER_NAV_TABS = [
  { id: 'list', label: 'Users', path: '/users', Icon: Users },
  { id: 'kyc', label: 'KYC Requests', path: '/users/kyc', Icon: FileCheck },
  { id: 'mt5', label: 'MT5 Accounts', path: '/users/mt5', Icon: Layers },
];

const PAGE = {
  accent: 'var(--brand)',
  eyebrow: 'User Management',
  title: 'Users',
  description: 'Manage users, verification status, balances, and trading accounts.',
};

function filterBySearch(items, search, fields) {
  const query = search.trim().toLowerCase();
  if (!query) return items;
  return items.filter((item) => (
    fields.some((field) => String(item[field] ?? '').toLowerCase().includes(query))
  ));
}

function UsersPage() {
  const navigate = useNavigate();

  const [userRows, setUserRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [kycFilter, setKycFilter] = useState('all');
  const [fundingFilter, setFundingFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [editingUserId, setEditingUserId] = useState(null);
  const [userDraft, setUserDraft] = useState(() => createDefaultUserDraft());

  const quickDrawer = useDrawerState(null);
  const mt5Drawer = useDrawerState(null);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const fetchUsers = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const data = await usersService.list();
      setUserRows(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError(err.message || 'Failed to load users from the server.');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const data = await usersService.list();
        if (active) {
          setUserRows(data);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Failed to load users from the server.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const handleSaveMt5Account = async (accountData) => {
    const targetUser = mt5Drawer.value;
    if (targetUser) {
      try {
        const payload = {
          userId: targetUser.id,
          groupName: accountData.group,
          leverage: accountData.leverage
        };
        const result = await tradingAccountsService.create(payload);
        await fetchUsers(false); // Refresh list of users
        triggerToast(`Successfully created MT5 Account #${result?.data?.accountid || ''} for ${targetUser.name}`);
      } catch (err) {
        console.error('Failed to create MT5 Account:', err);
        triggerToast(err?.response?.data?.message || err.message || 'Failed to create MT5 Account.');
      }
    }
  };

  const filteredUsers = useMemo(() => {
    let rows = filterBySearch(userRows, search, ['name', 'uid', 'email', 'phone', 'segment']);
    if (kycFilter !== 'all') rows = rows.filter((user) => user.kycStatus === kycFilter);
    if (fundingFilter !== 'all') rows = rows.filter((user) => user.fundingState === fundingFilter);
    return rows;
  }, [fundingFilter, kycFilter, search, userRows]);

  const usersTable = useTableState(filteredUsers, { searchFields: [], initialPageSize: 10 });

  const kpis = useMemo(() => [
    { label: 'Total Users', value: userRows.length.toLocaleString(), subtext: 'registered users', trend: '+24', positive: true, Icon: Users, accent: 'var(--brand)' },
    { label: 'Pending Verification', value: userRows.filter((user) => user.kycStatus === 'PENDING').length, subtext: 'waiting for review', trend: `${KYC_OPTIONS.length - 1} view`, positive: true, Icon: FileCheck, accent: 'var(--warning)' },
    { label: 'Funded Users', value: userRows.filter((user) => user.fundingState === 'FUNDED').length, subtext: 'users with balance', trend: `${FUNDING_OPTIONS.length} modes`, positive: true, Icon: Wallet, accent: 'var(--positive)' },
    { label: 'Risk Alerts', value: userRows.filter((user) => ['ELEVATED', 'WATCHLIST', 'FLAGGED'].includes(user.riskStatus)).length, subtext: 'high risk or flagged', trend: `${RISK_OPTIONS.length} groups`, positive: false, Icon: ShieldAlert, accent: 'var(--negative)' },
  ], [userRows]);

  const openUser = (nextUserId) => navigate(`/admin/users/${nextUserId}`);

  const handleSaveUser = async () => {
    try {
      if (formMode === 'edit' && editingUserId) {
        const payload = {
          name: userDraft.name,
          email: userDraft.email,
          phone: userDraft.phone,
          country: userDraft.country,
        };
        await usersService.update(editingUserId, payload);
        triggerToast(`Successfully updated user: ${userDraft.name}`);
      } else {
        const payload = {
          name: userDraft.name,
          email: userDraft.email,
          phone: userDraft.phone,
          country: userDraft.country,
          password: userDraft.password,
          confirmPassword: userDraft.confirmPassword,
        };
        await usersService.create(payload);
        triggerToast(`Successfully created user: ${userDraft.name}`);
      }
      setFormOpen(false);
      await fetchUsers(false);
    } catch (err) {
      console.error('Failed to save user:', err);
      triggerToast(err.message || 'Failed to save user.');
    }
  };

  const handleToggleSuspend = async (user) => {
    try {
      const targetSuspended = !user.suspended;
      await usersService.toggleBlock(user.id, targetSuspended);
      triggerToast(`User ${user.name} ${targetSuspended ? 'suspended' : 'unsuspended'} successfully`);
      await fetchUsers(false);
    } catch (err) {
      console.error('Failed to toggle block status:', err);
      triggerToast(err.message || 'Failed to update user block status.');
    }
  };

  if (loading) {
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center h-[50vh] text-center gap-2">
          <span className="relative flex h-5.5 w-5.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-60" />
            <span className="relative inline-flex rounded-full h-5.5 w-5.5 bg-brand/80" />
          </span>
          <span className="text-[12px] font-bold text-text-muted mt-2 uppercase tracking-widest animate-pulse">Loading directory...</span>
        </div>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center h-[50vh] text-center gap-4">
          <ShieldAlert size={36} className="text-negative animate-bounce" />
          <h2 className="text-lg font-black text-text">Failed to Load Users Directory</h2>
          <p className="text-[12px] text-text-muted/65 max-w-md">{error}</p>
          <button
            onClick={() => fetchUsers(true)}
            className="h-8 px-4 text-[11px] rounded-[7px] border border-border/20 bg-surface-elevated text-text font-bold cursor-pointer hover:bg-surface-bright transition-all"
          >
            Retry
          </button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[300] bg-surface-elevated border border-brand/20 text-text text-[11px] font-bold px-4 py-3 rounded-[8px] shadow-[0_4px_24px_rgba(0,0,0,0.4)] animate-fade-in flex items-center gap-2.5">
          <span className="w-2 h-2 bg-positive rounded-full animate-ping" />
          {toastMessage}
        </div>
      )}

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
              onClick={() => exportRows(filteredUsers, `users-list.csv`)}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[11px] font-semibold transition-all cursor-pointer"
            >
              <Download size={12} /> Export
            </button>
            <button
              type="button"
              onClick={() => { setFormMode('create'); setFormOpen(true); }}
              className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-brand text-text-on-accent border border-brand/20 text-[11px] font-bold transition-all duration-300 ease-out transform-gpu will-change-transform hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
            >
              <Plus size={12} /> Add User
            </button>
          </div>
        </header>



        {/* ── KPI Grid ── */}
        <UsersKPIGrid items={kpis} />

        {/* ── Table registry panel ── */}
        <Card padding={false}>
          <TableToolbar
            title="All Users"
            count={filteredUsers.length}
            accentColor={PAGE.accent}
            search={search}
            onSearchChange={(val) => { setSearch(val); usersTable.setPage(1); }}
            searchPlaceholder="Search directory..."
            filters={
              <>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-text-muted/70 font-bold uppercase tracking-wider shrink-0">Verification:</span>
                  <select
                    value={kycFilter}
                    onChange={(e) => { setKycFilter(e.target.value); usersTable.setPage(1); }}
                    className="h-7 rounded-[7px] border border-border/20 bg-bg text-[12.5px] font-semibold text-text px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                    style={{ minWidth: '76px' }}
                  >
                    <option value="all">ALL</option>
                    {KYC_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label.toUpperCase()}</option>
                    ))}
                  </select>
                </div>



                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-text-muted/70 font-bold uppercase tracking-wider shrink-0">Funding:</span>
                  <select
                    value={fundingFilter}
                    onChange={(e) => { setFundingFilter(e.target.value); usersTable.setPage(1); }}
                    className="h-7 rounded-[7px] border border-border/20 bg-bg text-[12.5px] font-semibold text-text px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                    style={{ minWidth: '76px' }}
                  >
                    <option value="all">ALL</option>
                    {FUNDING_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              </>
            }
          />

          <UsersListTable
            tableState={usersTable}
            onOpenUser={openUser}
            onQuickView={(user) => quickDrawer.open(user)}
            onEditUser={(u) => { setFormMode('edit'); setEditingUserId(u.id); setUserDraft(buildUserDraft(u)); setFormOpen(true); }}
            onSuspendUser={handleToggleSuspend}
            onOpenMt5={(entry) => mt5Drawer.open(entry)}
          />
        </Card>
      </div>

      <AddUserDrawer open={formOpen} mode={formMode} draft={userDraft} setDraft={setUserDraft} onSubmit={handleSaveUser} onClose={() => setFormOpen(false)} />
      <QuickUserDrawer open={quickDrawer.isOpen} user={quickDrawer.value} onClose={quickDrawer.close} onExpand={(uid) => { quickDrawer.close(); openUser(uid); }} />
      <Mt5AccountDrawer open={mt5Drawer.isOpen} entry={mt5Drawer.value} onClose={mt5Drawer.close} onSave={handleSaveMt5Account} />
    </PageShell>
  );
}
export default UsersPage;
