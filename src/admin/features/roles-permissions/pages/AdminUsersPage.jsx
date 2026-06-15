import React, { useState, useMemo, useEffect } from 'react';
import { Users, UserCheck, Lock, Clock, Fingerprint, ShieldOff, UserPlus, Download, Edit2, ShieldCheck, CheckCircle2, Zap, X } from 'lucide-react';
import { Badge, TwoFABadge, RolePill, AdminAvatar } from '../components/RolesComponents';
import { AdminUserDrawer } from '../components/RoleDrawers';
import { useRolesPermissions } from '../context/RolesPermissionsContext';
import { KpiCard } from '@/components/cards';
import { MainTable, TableToolbar } from '@/components/common/table';
import { MainDrawer } from '@/components/common/drawer';
import { useDrawerState } from '@/hooks/useDrawerState';

function AdminUsersPage() {
  const { adminUsers, roles, createAdmin, updateAdmin, deleteAdmin } = useRolesPermissions();
  
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const drawerState = useDrawerState(null);
  
  // Toast notifications
  const [toast, setToast] = useState(null);
  const act = (msg, id) => { 
    setToast(id ? `${msg}: ${id}` : msg); 
    setTimeout(() => setToast(null), 3000); 
  };

  // Form State
  const [adminForm, setAdminForm] = useState({ isOpen: false, mode: 'create', adminData: null });
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminRole, setAdminRole] = useState('SUPPORT');
  const [adminStatus, setAdminStatus] = useState('ACTIVE');
  const [admin2FA, setAdmin2FA] = useState(false);
  const [adminRegion, setAdminRegion] = useState('US');
  const [formError, setFormError] = useState('');

  // Sync admin form inputs
  useEffect(() => {
    if (adminForm.isOpen) {
      setFormError('');
      if (adminForm.mode === 'edit' && adminForm.adminData) {
        setAdminName(adminForm.adminData.name);
        setAdminEmail(adminForm.adminData.email);
        setAdminRole(adminForm.adminData.role || 'SUPPORT');
        setAdminStatus(adminForm.adminData.status || 'ACTIVE');
        setAdmin2FA(adminForm.adminData.twoFA || false);
        setAdminRegion(adminForm.adminData.region || 'US');
      } else {
        setAdminName('');
        setAdminEmail('');
        setAdminRole(roles[0]?.name || 'SUPPORT');
        setAdminStatus('ACTIVE');
        setAdmin2FA(false);
        setAdminRegion('US');
      }
    }
  }, [adminForm, roles]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!adminName.trim() || !adminEmail.trim()) {
      setFormError('Full Name and Email are required.');
      return;
    }

    try {
      if (adminForm.mode === 'create') {
        createAdmin({
          name: adminName.trim(),
          email: adminEmail.trim(),
          role: adminRole,
          status: adminStatus,
          twoFA: admin2FA,
          region: adminRegion
        });
        act('Admin added', adminName.trim());
      } else {
        updateAdmin(adminForm.adminData.id, {
          name: adminName.trim(),
          email: adminEmail.trim(),
          role: adminRole,
          status: adminStatus,
          twoFA: admin2FA,
          region: adminRegion,
          locked: adminStatus === 'LOCKED'
        });
        act('Admin details updated', adminName.trim());
      }
      setAdminForm({ isOpen: false, mode: 'create', adminData: null });
    } catch (err) {
      setFormError(err.message || 'Something went wrong.');
    }
  };

  const filtered = useMemo(() => {
    let rows = adminUsers;
    if (filter !== 'ALL') {
      if (['ACTIVE', 'INACTIVE', 'LOCKED', 'PENDING'].includes(filter)) rows = rows.filter(r => r.status === filter);
      else if (filter === '2FA') rows = rows.filter(r => r.twoFA);
      else if (filter === 'NO_2FA') rows = rows.filter(r => !r.twoFA);
      else rows = rows.filter(r => r.role === filter);
    }
    if (search) rows = rows.filter(r =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) || r.id.includes(search)
    );
    return rows;
  }, [adminUsers, search, filter]);

  const kpis = [
    { label: 'Total Admins', value: adminUsers.length, Icon: Users, accent: 'var(--cyan)', sub: 'All admin accounts' },
    { label: 'Active', value: adminUsers.filter(r => r.status === 'ACTIVE').length, Icon: UserCheck, accent: 'var(--positive)', sub: 'Currently active' },
    { label: 'Locked', value: adminUsers.filter(r => r.locked).length, Icon: Lock, accent: 'var(--negative)', sub: 'Require unlock' },
    { label: 'Pending Access', value: adminUsers.filter(r => r.status === 'PENDING').length, Icon: Clock, accent: 'var(--warning)', sub: 'Waiting to join' },
    { label: '2FA Enabled', value: adminUsers.filter(r => r.twoFA).length, Icon: Fingerprint, accent: 'var(--positive)', sub: adminUsers.length > 0 ? `${Math.round(adminUsers.filter(r => r.twoFA).length / adminUsers.length * 100)}% coverage` : '0% coverage' },
    { label: 'Without 2FA', value: adminUsers.filter(r => !r.twoFA).length, Icon: ShieldOff, accent: 'var(--negative)', sub: 'Security risk' },
  ];

  const cols = [
    {
      key: 'name', label: 'Admin', render: (v, r) => (
        <div className="flex items-center gap-2.5">
          <AdminAvatar name={v} role={r.role} />
          <div>
            <div className="text-[12px] font-semibold font-heading text-text/85">{v}</div>
            <div className="text-[10px] font-mono text-text-muted/35">{r.email}</div>
          </div>
        </div>
      )
    },
    { key: 'role', label: 'Role', render: v => <RolePill value={v} /> },
    { key: 'status', label: 'Status', render: v => <Badge value={v} /> },
    { key: 'twoFA', label: '2FA', render: v => <TwoFABadge enabled={v} /> },
    { key: 'lastLogin', label: 'Last Login', render: v => <span className="font-mono text-text-muted/50 text-[10.5px]">{v}</span> },
    { key: 'created', label: 'Created', render: v => <span className="font-mono text-text-muted/35 text-[10.5px]">{v}</span> },
    {
      key: 'actions', label: 'Actions', align: 'right', render: (_, r) => (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end pr-2" onClick={(e) => e.stopPropagation()}>
          <button onClick={e => { e.stopPropagation(); setAdminForm({ isOpen: true, mode: 'edit', adminData: r }); }} className="w-6 h-6 rounded-[5px] border border-white/[0.08] flex items-center justify-center text-text-muted/40 hover:text-text cursor-pointer transition-colors"><Edit2 size={10} /></button>
          {r.locked
            ? <button onClick={e => { e.stopPropagation(); updateAdmin(r.id, { locked: false, status: 'ACTIVE' }); act('Unlocked', r.name); }} className="w-6 h-6 rounded-[5px] border border-positive/20 flex items-center justify-center text-positive/60 hover:text-positive cursor-pointer transition-colors"><ShieldCheck size={10} /></button>
            : <button onClick={e => { e.stopPropagation(); updateAdmin(r.id, { locked: true, status: 'LOCKED' }); act('Locked', r.name); }} className="w-6 h-6 rounded-[5px] border border-negative/20 flex items-center justify-center text-negative/50 hover:text-negative cursor-pointer transition-colors"><Lock size={10} /></button>
          }
        </div>
      )
    },
  ];

  return (
    <div className="space-y-5 animate-fade-up">

      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-muted/70 mb-1.5 font-heading">
            Admin Access
          </p>
          <h2 className="text-[26px] font-semibold tracking-[-0.03em] leading-tight text-text font-heading">
            Admin Users
          </h2>
          <p className="text-[13.5px] text-text-muted/80 mt-2 leading-snug max-w-lg font-heading">
            Manage admins, roles, and access.
          </p>
        </div>
      </header>

      {/* 2FA alert */}
      {adminUsers.filter(r => !r.twoFA && r.status === 'ACTIVE').length > 0 && (
        <div className="flex items-start gap-3 rounded-[12px] border border-warning/20 bg-warning/[0.05] px-4 py-3 shadow-sm">
          <ShieldOff size={14} className="text-warning flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-[13px] font-bold text-warning font-heading">{adminUsers.filter(r => !r.twoFA && r.status === 'ACTIVE').length} Active Admin{adminUsers.filter(r => !r.twoFA && r.status === 'ACTIVE').length > 1 ? 's' : ''} Without 2FA</div>
            <div className="text-[12px] text-warning/80 font-heading mt-1">Require 2FA to keep admin accounts secure.</div>
          </div>
          <button onClick={() => {
            adminUsers.filter(r => !r.twoFA).forEach(adm => updateAdmin(adm.id, { twoFA: true }));
            act('2FA enforced for all admins');
          }} className="ml-auto flex-shrink-0 flex items-center gap-1.5 h-7 px-3 rounded-[7px] text-[11.5px] font-semibold font-heading border border-warning/25 bg-warning/[0.08] text-warning cursor-pointer hover:brightness-110">
            <Zap size={10} /> Require for All
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpis.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      {toast && (
        <div className="flex items-center gap-2 rounded-[9px] border border-positive/20 bg-positive/[0.07] px-4 py-2.5 text-[12px] font-semibold text-positive font-heading">
          <CheckCircle2 size={13} />{toast}
        </div>
      )}

      <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
        <TableToolbar
          title="Admins"
          count={filtered.length}
          accentColor="var(--cyan)"
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search admins…"
          filters={
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-text-muted/70 font-bold uppercase tracking-wider shrink-0">Filter:</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="h-7 rounded-[7px] border border-border/20 bg-bg text-[12.5px] font-semibold text-text px-2 pr-5 outline-none focus:border-brand/40 transition-all cursor-pointer appearance-none"
                style={{ minWidth: '70px' }}
              >
                <option value="ALL">ALL</option>
                {['ACTIVE', 'INACTIVE', 'LOCKED', 'PENDING', '2FA', 'NO_2FA'].slice(1).map(opt => (
                  <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>
                ))}
                <optgroup label="Roles">
                  {roles.map(r => (
                    <option key={r.name} value={r.name}>{r.label}</option>
                  ))}
                </optgroup>
              </select>
            </div>
          }
          actions={
            <div className="flex gap-2">
              <button onClick={() => act('Exported', 'admin list')} className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-text hover:border-border/40 text-[11px] font-semibold transition-all cursor-pointer">
                <Download size={12} /> Export
              </button>
              <button onClick={() => setAdminForm({ isOpen: true, mode: 'create', adminData: null })} className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-brand text-text-on-accent border border-brand/20 text-[11px] font-bold transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.97]">
                <UserPlus size={12} /> Add Admin
              </button>
            </div>
          }
        />
        <MainTable 
          columns={cols} 
          data={filtered} 
          onRowClick={r => drawerState.open(r)}
          rowClassName={(r) => {
            if (r.locked) return 'hover:bg-negative/5 hover:border-l-negative cursor-pointer';
            if (r.status === 'PENDING') return 'hover:bg-warning/5 hover:border-l-warning cursor-pointer';
            return 'hover:bg-cyan/5 hover:border-l-cyan cursor-pointer';
          }}
        />
      </section>

      {/* Admin User Details Drawer */}
      <AdminUserDrawer 
        row={drawerState.value} 
        open={drawerState.isOpen} 
        onClose={() => drawerState.close()} 
        onAction={act}
        onEdit={(admin) => setAdminForm({ isOpen: true, mode: 'edit', adminData: admin })}
      />

      {/* ── CREATE / EDIT ADMIN SLIDING DRAWER ── */}
      <MainDrawer open={adminForm.isOpen} onClose={() => setAdminForm({ isOpen: false, mode: 'create', adminData: null })}>
        {/* Top bar */}
        <div className="h-[2.5px] w-full bg-brand" />
        
        {/* Header */}
        <div className="px-6 py-5 flex items-start justify-between border-b border-border/15">
          <div>
            <p className="text-[9.5px] font-black uppercase tracking-[0.22em] text-brand mb-2 leading-none">
              User Directory
            </p>
            <h2 className="text-[20px] font-bold tracking-[-0.022em] text-text leading-tight font-heading">
              {adminForm.mode === 'create' ? 'Add Admin' : 'Edit Admin'}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setAdminForm({ isOpen: false, mode: 'create', adminData: null })}
            className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-border/18 bg-bg/40 text-text-muted hover:text-text hover:border-border/30 transition-all cursor-pointer"
          >
            <X size={13} />
          </button>
        </div>

        {/* Scrollable Body */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[9.5px] font-black uppercase tracking-[0.14em] text-text-muted/50 font-heading">
              Full Name
            </label>
            <input
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              placeholder="e.g. Priyesh Sharma"
              className="w-full h-9 rounded-[8px] border border-white/[0.1] bg-bg/40 px-3 text-[12.5px] text-text outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/10 transition-all font-heading"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[9.5px] font-black uppercase tracking-[0.14em] text-text-muted/50 font-heading">
              Email Address
            </label>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="e.g. priya@live-trader.com"
              className="w-full h-9 rounded-[8px] border border-white/[0.1] bg-bg/40 px-3 text-[12.5px] text-text outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/10 transition-all font-heading"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[9.5px] font-black uppercase tracking-[0.14em] text-text-muted/50 font-heading">
              Role
            </label>
            <select
              value={adminRole}
              onChange={(e) => setAdminRole(e.target.value)}
              className="w-full h-9 rounded-[8px] border border-white/[0.1] bg-bg/40 px-3 text-[12.5px] text-text outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/10 transition-all cursor-pointer font-heading"
            >
              {roles.map(r => (
                <option key={r.name} value={r.name}>{r.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[9.5px] font-black uppercase tracking-[0.14em] text-text-muted/50 font-heading">
                Status
              </label>
              <select
                value={adminStatus}
                onChange={(e) => setAdminStatus(e.target.value)}
                className="w-full h-9 rounded-[8px] border border-white/[0.1] bg-bg/40 px-3 text-[12.5px] text-text outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/10 transition-all cursor-pointer font-heading"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="PENDING">Pending</option>
                <option value="LOCKED">Locked</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[9.5px] font-black uppercase tracking-[0.14em] text-text-muted/50 font-heading">
                Region Code
              </label>
              <input
                type="text"
                value={adminRegion}
                onChange={(e) => setAdminRegion(e.target.value.toUpperCase())}
                placeholder="e.g. IN, US, UK, JP"
                className="w-full h-9 rounded-[8px] border border-white/[0.1] bg-bg/40 px-3 text-[12.5px] text-text outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/10 transition-all font-heading"
                maxLength={3}
                required
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between rounded-[9px] border border-white/[0.04] bg-bg/10 p-3">
            <div>
              <div className="text-[12.5px] font-bold text-text font-heading">Require 2FA</div>
              <div className="text-[11.5px] text-text-muted/60 font-heading mt-0.5">Ask for a second code at sign-in.</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={admin2FA} 
                onChange={(e) => setAdmin2FA(e.target.checked)} 
                className="sr-only peer" 
              />
              <div className="w-9 h-5 bg-white/[0.08] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-muted after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand peer-checked:after:bg-bg peer-checked:after:border-transparent" />
            </label>
          </div>

          {formError && (
            <div className="text-[11.5px] text-negative font-semibold font-heading bg-negative/5 border border-negative/10 px-3 py-2 rounded-[6px]">
              {formError}
            </div>
          )}
        </form>

        {/* Sticky Footer */}
        <div className="border-t border-border/15 bg-surface-elevated px-6 py-4 flex items-center justify-between gap-2">
          {adminForm.mode === 'edit' ? (
            <button
              type="button"
              onClick={() => {
                if (confirm(`Are you sure you want to delete the admin user "${adminName}"?`)) {
                  deleteAdmin(adminForm.adminData.id);
                  act('Admin user deleted', adminName);
                  setAdminForm({ isOpen: false, mode: 'create', adminData: null });
                }
              }}
              className="h-9 px-4 rounded-[8px] border border-negative/25 bg-negative/10 text-negative hover:bg-negative/20 text-[11.5px] font-bold cursor-pointer transition-colors"
            >
              Delete Admin
            </button>
          ) : <div />}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setAdminForm({ isOpen: false, mode: 'create', adminData: null })}
              className="h-9 px-4 rounded-[8px] border border-white/[0.08] text-text-muted hover:text-text hover:bg-white/[0.03] text-[11.5px] font-bold cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleFormSubmit}
              className="h-9 px-4 rounded-[8px] bg-brand text-bg hover:brightness-110 text-[11.5px] font-bold cursor-pointer transition-all active:scale-[0.98]"
            >
              {adminForm.mode === 'create' ? 'Add Admin' : 'Save Changes'}
            </button>
          </div>
        </div>
      </MainDrawer>
    </div>
  );
}

export default AdminUsersPage;
