import React, { useState, useEffect } from 'react';
import { Shield, ShieldCheck, Users, Sliders, Plus, Download, CheckCircle2, ChevronRight, Edit2, Copy, ClipboardList, X, Check, EyeOff } from 'lucide-react';
import { SectionHead, IconBtn, ROLE_CLR, Badge } from '../components/RolesComponents';
import { RoleDrawer } from '../components/RoleDrawers';
import { useRolesPermissions } from '../context/RolesPermissionsContext';
import { KpiCard } from '@/components/cards';
import { MainTable, TableToolbar } from '@/components/common/table';
import { Card } from '@/components/ui/Card';
import { MainDrawer } from '@/components/common/drawer';
import { useDrawerState } from '@/hooks/useDrawerState';

const PRESET_COLORS = [
  '#e5c07b', // Gold (Super Admin default)
  '#ef4444', // Red (Risk default)
  '#a78bfa', // Purple (Compliance default)
  '#3b82f6', // Blue (Finance default)
  '#06b6d4', // Cyan (Support default)
  '#10b981', // Green
  '#f59e0b', // Orange
  '#da1b60'  // Pink
];

function RolesPage() {
  const { roles, createRole, updateRole } = useRolesPermissions();
  const drawerState = useDrawerState(null);
  
  // Toast notifications
  const [toast, setToast] = useState(null);
  const act = (msg, id) => { 
    setToast(id ? `${msg}: ${id}` : msg); 
    setTimeout(() => setToast(null), 3000); 
  };

  // Role Form state
  const [roleForm, setRoleForm] = useState({ isOpen: false, mode: 'create', roleData: null });
  const [roleLabel, setRoleLabel] = useState('');
  const [roleDesc, setRoleDesc] = useState('');
  const [roleStatus, setRoleStatus] = useState('ACTIVE');
  const [roleColor, setRoleColor] = useState('#a78bfa');
  const [formError, setFormError] = useState('');

  // Sync role form inputs
  useEffect(() => {
    if (roleForm.isOpen) {
      setFormError('');
      if (roleForm.mode === 'edit' && roleForm.roleData) {
        setRoleLabel(roleForm.roleData.label);
        setRoleDesc(roleForm.roleData.desc || '');
        setRoleStatus(roleForm.roleData.status || 'ACTIVE');
        setRoleColor(roleForm.roleData.color || '#a78bfa');
      } else {
        setRoleLabel('');
        setRoleDesc('');
        setRoleStatus('ACTIVE');
        setRoleColor('#a78bfa');
      }
    }
  }, [roleForm]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!roleLabel.trim()) {
      setFormError('Role name is required.');
      return;
    }

    try {
      if (roleForm.mode === 'create') {
        createRole(roleLabel.trim(), roleDesc.trim(), roleStatus, roleColor);
        act('Role created successfully', roleLabel.trim());
      } else {
        updateRole(roleForm.roleData.id, roleLabel.trim(), roleDesc.trim(), roleStatus, roleColor);
        act('Role details updated', roleLabel.trim());
      }
      setRoleForm({ isOpen: false, mode: 'create', roleData: null });
    } catch (err) {
      setFormError(err.message || 'An error occurred.');
    }
  };

  const kpis = [
    { label: 'Total Roles', value: roles.length, Icon: Shield, accent: 'var(--cyan)', sub: 'Defined roles' },
    { label: 'Active Roles', value: roles.filter(r => r.status === 'ACTIVE').length, Icon: ShieldCheck, accent: 'var(--positive)', sub: 'Currently applied' },
    { label: 'Total Admins', value: roles.reduce((s, r) => s + r.userCount, 0), Icon: Users, accent: 'var(--brand)', sub: 'Across all roles' },
    { label: 'Custom Roles', value: roles.filter(r => !['SUPER_ADMIN', 'READ_ONLY'].includes(r.name)).length, Icon: Sliders, accent: 'var(--warning)', sub: 'Non-default roles' },
  ];

  const cols = [
    {
      key: 'label', label: 'Role', render: (v, r) => {
        const color = r.color || ROLE_CLR[r.name] || '#fff';
        return (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[7px] flex items-center justify-center border flex-shrink-0"
              style={{ background: `color-mix(in srgb, ${color} 14%, transparent)`, borderColor: `color-mix(in srgb, ${color} 22%, transparent)` }}>
              <Shield size={13} style={{ color }} />
            </div>
            <div>
              <div className="text-[13px] font-semibold font-heading text-text/90">{v}</div>
              <div className="text-[11.5px] text-text-muted/75 font-heading truncate max-w-[200px]">{r.desc}</div>
            </div>
          </div>
        );
      }
    },
    { key: 'userCount', label: 'Admins', render: v => <span className="font-mono font-semibold text-[12.5px] text-brand">{v}</span> },
    { key: 'scope', label: 'Scope', render: v => <span className="text-[11px] font-semibold border border-white/[0.06] px-2 py-0.5 rounded-[4px] text-text-muted/75">{v}</span> },
    {
      key: 'perms', label: 'Permissions', render: (_, r) => (
        <div className="flex gap-1 flex-wrap max-w-[200px]">
          {r.actions.length > 0 
            ? r.actions.map(a => <span key={a} className="text-[10px] font-mono px-1.5 py-0.5 rounded-[3px] bg-primary/[0.08] border border-primary/[0.15] text-primary">{a}</span>)
            : <span className="text-[10px] text-text-muted/40 font-heading italic">None assigned</span>
          }
        </div>
      )
    },
    { key: 'status', label: 'Status', render: v => <Badge value={v} /> },
    { key: 'updated', label: 'Updated', render: v => <span className="font-mono text-text-muted/70 text-[11px]">{v}</span> },
    {
      key: 'actions', label: 'Actions', align: 'right', render: (_, r) => (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end pr-2" onClick={(e) => e.stopPropagation()}>
          <button onClick={e => { e.stopPropagation(); setRoleForm({ isOpen: true, mode: 'edit', roleData: r }); }} className="w-6 h-6 rounded-[5px] border border-white/[0.08] flex items-center justify-center text-text-muted/40 hover:text-text cursor-pointer transition-colors"><Edit2 size={10} /></button>
          <button onClick={e => { e.stopPropagation(); createRole(`${r.label} Copy`, r.desc, 'DRAFT', r.color); act('Role duplicated', r.label); }} className="w-6 h-6 rounded-[5px] border border-cyan/[0.15] flex items-center justify-center text-cyan/60 hover:text-cyan cursor-pointer transition-colors"><Copy size={10} /></button>
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
            Roles
          </h2>
          <p className="text-[13.5px] text-text-muted/80 mt-2 leading-snug max-w-lg font-heading">
            Manage roles, permissions, and assigned admins.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      <div className="flex items-center justify-between mb-4">
        <SectionHead title="All Roles" Icon={Shield} />
        <div className="flex gap-2">
          <IconBtn label="New Role" Icon={Plus} variant="brand" onClick={() => setRoleForm({ isOpen: true, mode: 'create', roleData: null })} />
          <IconBtn label="Export" Icon={Download} variant="default" onClick={() => act('Exported', 'roles')} />
        </div>
      </div>

      {toast && (
        <div className="flex items-center gap-2 rounded-[9px] border border-positive/20 bg-positive/[0.07] px-4 py-2.5 text-[12px] font-semibold text-positive font-heading">
          <CheckCircle2 size={13} />{toast}
        </div>
      )}

      {/* Role cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mb-4">
        {roles.map(role => {
          const color = role.color || ROLE_CLR[role.name] || 'rgba(255,255,255,0.3)';
          return (
            <Card key={role.id} onClick={() => drawerState.open(role)} padding={false}
              className="text-left group cursor-pointer hover:border-white/[0.1] hover:bg-white/[0.03] p-4 transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-[8px] flex items-center justify-center border flex-shrink-0"
                    style={{ background: `color-mix(in srgb, ${color} 14%, transparent)`, borderColor: `color-mix(in srgb, ${color} 24%, transparent)` }}>
                    <Shield size={15} style={{ color }} />
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold font-heading text-text tracking-[-0.01em]">{role.label}</div>
                    <div className="text-[11px] font-mono text-text-muted/70">{role.userCount} admin{role.userCount !== 1 ? 's' : ''}</div>
                  </div>
                </div>
                <Badge value={role.status} />
              </div>
              <div className="text-[12.5px] text-text-muted/75 font-heading leading-snug mb-3 line-clamp-2 min-h-[38px]">{role.desc}</div>
              <div className="flex flex-wrap gap-1 pt-2 border-t border-white/[0.04]">
                {role.actions.length > 0 
                  ? role.actions.slice(0, 5).map(a => (
                      <span key={a} className="text-[10px] font-mono px-1.5 py-0.5 rounded-[4px]"
                        style={{ color, background: `color-mix(in srgb, ${color} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 22%, transparent)` }}>
                        {a}
                      </span>
                    ))
                  : <span className="text-[10px] text-text-muted/40 font-heading italic">No permissions assigned</span>
                }
                {role.actions.length > 5 && (
                  <span className="text-[9px] font-mono text-text-muted/50 px-1 py-0.5" style={{ color }}>
                    +{role.actions.length - 5} more
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between mt-2.5">
                <span className="text-[11px] text-text-muted/70 font-heading">{role.modules.length} modules</span>
                <ChevronRight size={12} className="text-text-muted/50 group-hover:text-primary transition-colors" />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Also show as table */}
      <section className="rounded-[12px] border border-border/20 bg-surface-elevated shadow-card-subtle overflow-hidden">
        <TableToolbar title="Roles List" count={roles.length} accentColor="var(--primary)" />
        <MainTable 
          columns={cols} 
          data={roles} 
          onRowClick={r => drawerState.open(r)}
          rowClassName={() => `hover:bg-primary/5 hover:border-l-primary cursor-pointer`}
        />
      </section>
      
      {/* Role Details Drawer */}
      <RoleDrawer 
        row={drawerState.value} 
        open={drawerState.isOpen} 
        onClose={() => drawerState.close()} 
        onAction={act}
        onEdit={(role) => setRoleForm({ isOpen: true, mode: 'edit', roleData: role })}
      />

      {/* ── CREATE / EDIT ROLE SLIDING DRAWER ── */}
      <MainDrawer open={roleForm.isOpen} onClose={() => setRoleForm({ isOpen: false, mode: 'create', roleData: null })}>
        {/* Color bar */}
        <div className="h-[2.5px] w-full" style={{ background: `linear-gradient(90deg, ${roleColor}, transparent)` }} />
        
        {/* Header */}
        <div className="px-6 py-5 flex items-start justify-between border-b border-border/15">
          <div>
            <p className="text-[9.5px] font-black uppercase tracking-[0.22em] mb-2 leading-none" style={{ color: `color-mix(in srgb, ${roleColor} 85%, transparent)` }}>
              Role Administration
            </p>
            <h2 className="text-[20px] font-bold tracking-[-0.022em] text-text leading-tight">
              {roleForm.mode === 'create' ? 'Create New Role' : 'Edit Role Description'}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setRoleForm({ isOpen: false, mode: 'create', roleData: null })}
            className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-border/18 bg-bg/40 text-text-muted hover:text-text hover:border-border/30 transition-all cursor-pointer"
          >
            <X size={13} />
          </button>
        </div>

        {/* Scrollable Body */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[9.5px] font-black uppercase tracking-[0.14em] text-text-muted/50 font-heading">
              Role Name / Label
            </label>
            <input
              type="text"
              value={roleLabel}
              onChange={(e) => setRoleLabel(e.target.value)}
              placeholder="e.g. Compliance Officer, Support Agent"
              className="w-full h-9 rounded-[8px] border border-white/[0.1] bg-bg/40 px-3 text-[12.5px] text-text outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/10 transition-all font-heading"
              maxLength={40}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[9.5px] font-black uppercase tracking-[0.14em] text-text-muted/50 font-heading">
              Description
            </label>
            <textarea
              value={roleDesc}
              onChange={(e) => setRoleDesc(e.target.value)}
              placeholder="Describe what this role can access and do..."
              rows={4}
              className="w-full resize-none rounded-[8px] border border-white/[0.1] bg-bg/40 px-3 py-2.5 text-[12.5px] text-text outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/10 transition-all leading-relaxed font-heading"
              maxLength={150}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[9.5px] font-black uppercase tracking-[0.14em] text-text-muted/50 font-heading">
              Status
            </label>
            <div className="flex gap-2">
              {['ACTIVE', 'DRAFT'].map(status => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setRoleStatus(status)}
                  className={`flex-1 h-9 rounded-[8px] border text-[11.5px] font-bold transition-all cursor-pointer
                    ${roleStatus === status 
                      ? 'border-brand/40 bg-brand/[0.08] text-brand shadow-[0_0_6px_rgba(218,165,32,0.1)]' 
                      : 'border-white/[0.06] bg-bg/20 text-text-muted/50 hover:border-white/[0.12] hover:text-text'}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Color Presets */}
          <div className="space-y-1.5">
            <label className="block text-[9.5px] font-black uppercase tracking-[0.14em] text-text-muted/50 font-heading">
              Theme / Color Preset
            </label>
            <div className="grid grid-cols-8 gap-2 rounded-[9px] border border-white/[0.05] bg-bg/20 p-2.5">
              {PRESET_COLORS.map(c => {
                const isSelected = roleColor === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setRoleColor(c)}
                    className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-white/[0.04] transition-all hover:scale-108 cursor-pointer relative"
                    style={{ background: c }}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-[5px]">
                        <Check size={12} className="text-white drop-shadow" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {formError && (
            <div className="text-[11.5px] text-negative font-semibold font-heading bg-negative/5 border border-negative/10 px-3 py-2 rounded-[6px]">
              {formError}
            </div>
          )}
        </form>

        {/* Sticky Footer */}
        <div className="border-t border-border/15 bg-surface-elevated px-6 py-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setRoleForm({ isOpen: false, mode: 'create', roleData: null })}
            className="h-9 px-4 rounded-[8px] border border-white/[0.08] text-text-muted hover:text-text hover:bg-white/[0.03] text-[11.5px] font-bold cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleFormSubmit}
            className="h-9 px-4 rounded-[8px] bg-brand text-bg hover:brightness-110 text-[11.5px] font-bold cursor-pointer transition-all active:scale-[0.98]"
          >
            {roleForm.mode === 'create' ? 'Create Role' : 'Save Changes'}
          </button>
        </div>
      </MainDrawer>
    </div>
  );
}

export default RolesPage;
