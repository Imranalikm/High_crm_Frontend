import React, { useState, useEffect } from 'react';
import { Shield, Check, CheckCircle2, XCircle, X, Plus, Edit, Trash2 } from 'lucide-react';
import { IconBtn, ROLE_CLR, ModuleIcon } from '../components/RolesComponents';
import { useRolesPermissions } from '../context/RolesPermissionsContext';
import { Card } from '@/components/ui/Card';
import { MainTable } from '@/components/common/table';
import { MainDrawer } from '@/components/common/drawer';

const AVAILABLE_ICONS = [
  'Shield', 'Users', 'CreditCard', 'TrendingUp', 'GitBranch', 'Trophy', 
  'Network', 'FileText', 'Settings', 'Activity', 'Briefcase', 'Code',
  'Database', 'Mail', 'MessageSquare', 'Terminal', 'Sliders', 'HelpCircle'
];

function PermissionsPage() {
  const {
    roles,
    modules,
    matrix,
    PERM_ACTIONS,
    createModule,
    updateModule,
    deleteModule,
    togglePerm,
    toggleRow,
    toggleCol,
    toggleAll,
    savePermissions
  } = useRolesPermissions();

  const [activeRole, setActiveRole] = useState('');
  const [toast, setToast] = useState(null);
  
  // Module edit/create drawer state
  const [moduleModal, setModuleModal] = useState({ isOpen: false, mode: 'create', moduleData: null });
  const [moduleLabel, setModuleLabel] = useState('');
  const [moduleIcon, setModuleIcon] = useState('Shield');
  const [moduleDesc, setModuleDesc] = useState('');
  const [modalError, setModalError] = useState('');

  // Set initial active role when roles load
  useEffect(() => {
    if (roles.length > 0 && !activeRole) {
      setActiveRole(roles[0].name);
    }
  }, [roles, activeRole]);

  // Sync modal input fields
  useEffect(() => {
    if (moduleModal.isOpen) {
      setModalError('');
      if (moduleModal.mode === 'edit' && moduleModal.moduleData) {
        setModuleLabel(moduleModal.moduleData.label);
        setModuleIcon(moduleModal.moduleData.Icon || 'Shield');
        setModuleDesc(moduleModal.moduleData.desc || '');
      } else {
        setModuleLabel('');
        setModuleIcon('Shield');
        setModuleDesc('');
      }
    }
  }, [moduleModal]);

  const act = msg => { 
    setToast(msg); 
    setTimeout(() => setToast(null), 3000); 
  };

  const handleSave = () => {
    savePermissions(activeRole);
    act('Permissions saved for ' + activeRole);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    setModalError('');

    if (!moduleLabel.trim()) {
      setModalError('Module name is required.');
      return;
    }

    try {
      if (moduleModal.mode === 'create') {
        createModule(moduleLabel.trim(), moduleIcon, moduleDesc.trim());
        act(`Module "${moduleLabel.trim()}" created`);
      } else {
        updateModule(moduleModal.moduleData.id, moduleLabel.trim(), moduleIcon, moduleDesc.trim());
        act(`Module "${moduleLabel.trim()}" updated`);
      }
      setModuleModal({ isOpen: false, mode: 'create', moduleData: null });
    } catch (err) {
      setModalError(err.message || 'Something went wrong.');
    }
  };

  const roleObj = roles.find(r => r.name === activeRole) || roles[0];
  if (!roleObj) return null;

  const roleColor = roleObj.color || ROLE_CLR[roleObj.name] || 'rgba(255,255,255,0.3)';

  const PermCheck = ({ active, onClick }) => (
    <button onClick={onClick}
      className={`w-6 h-6 rounded-[5px] flex items-center justify-center border transition-all duration-150 cursor-pointer hover:scale-110 active:scale-95 ${active
        ? 'border-positive/30 bg-positive/[0.15] text-positive shadow-[0_0_6px_rgba(74,225,118,0.2)]'
        : 'border-white/[0.08] bg-transparent text-transparent hover:border-white/[0.16]'}`}>
      <Check size={11} strokeWidth={3} />
    </button>
  );

  const countActive = () => {
    const roleMatrix = matrix[activeRole] || {};
    return modules.reduce((s, m) =>
      s + PERM_ACTIONS.filter(a => roleMatrix[m.id]?.[a]).length, 0);
  };

  const permColumns = [
    {
      key: 'label',
      label: 'Module',
      render: (_, mod) => {
        return (
          <div className="flex items-center justify-between w-full group/row pr-4 min-w-[200px]">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[8px] bg-surface-elevated shadow-card-subtle">
                <ModuleIcon icon={mod.Icon} size={13} className="text-text-muted/50 transition-colors group-hover:text-primary/70" />
              </div>
              <span className="text-[13px] font-semibold text-text/85 leading-none">{mod.label}</span>
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => setModuleModal({ isOpen: true, mode: 'edit', moduleData: mod })}
                className="w-5.5 h-5.5 rounded-[4px] border border-white/[0.08] bg-bg flex items-center justify-center text-text-muted/55 hover:text-cyan hover:border-cyan/30 cursor-pointer transition-colors"
                title="Edit Module"
              >
                <Edit size={10} />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Are you sure you want to delete the module "${mod.label}"? All permissions for this module will be cleared.`)) {
                    deleteModule(mod.id);
                    act(`Module "${mod.label}" deleted`);
                  }
                }}
                className="w-5.5 h-5.5 rounded-[4px] border border-negative/15 bg-bg flex items-center justify-center text-negative/50 hover:text-negative hover:border-negative/30 cursor-pointer transition-colors"
                title="Delete Module"
              >
                <Trash2 size={10} />
              </button>
            </div>
          </div>
        );
      },
    },
    {
      key: '_all',
      label: 'All',
      align: 'center',
      render: (_, mod) => {
        const rowPerms = matrix[activeRole]?.[mod.id] || {};
        const allRowOn = PERM_ACTIONS.every(a => rowPerms[a]);
        const someRowOn = PERM_ACTIONS.some(a => rowPerms[a]);
        return (
          <button onClick={() => toggleRow(activeRole, mod.id)}
            className={`mx-auto flex h-5 w-5 items-center justify-center rounded-[4px] border transition-all hover:scale-110 cursor-pointer
              ${allRowOn ? 'border-brand/40 bg-brand/[0.12]' : someRowOn ? 'border-warning/40 bg-warning/[0.08]' : 'border-border/30 hover:border-border/60'}`}>
            {allRowOn ? <Check size={9} strokeWidth={3} className="text-brand" />
              : someRowOn ? <span className="h-0.5 w-2 rounded-full bg-warning" />
                : null}
          </button>
        );
      },
    },
    ...PERM_ACTIONS.map(action => {
      const allOn = modules.every(m => matrix[activeRole]?.[m.id]?.[action]);
      return {
        key: action,
        align: 'center',
        label: (
          <div className="flex flex-col items-center gap-2">
            <span className="capitalize">{action}</span>
            <button onClick={(event) => { event.stopPropagation(); toggleCol(activeRole, action); }}
              className={`flex h-5 w-5 items-center justify-center rounded-[4px] border transition-all hover:scale-110 cursor-pointer
                ${allOn ? 'border-cyan/30 bg-cyan/[0.12] text-cyan' : 'border-border/30 text-transparent hover:border-border/60'}`}>
              <Check size={9} strokeWidth={3} />
            </button>
          </div>
        ),
        render: (_, mod) => (
          <div className="flex justify-center">
            <PermCheck
              active={matrix[activeRole]?.[mod.id]?.[action] || false}
              onClick={() => togglePerm(activeRole, mod.id, action)}
            />
          </div>
        ),
      };
    }),
  ];

  return (
    <div className="space-y-4 animate-fade-up">

      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-2">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-muted/70 mb-1.5 font-heading">
            Admin Access
          </p>
          <h2 className="text-[26px] font-semibold tracking-[-0.03em] leading-tight text-text font-heading">
            Permissions
          </h2>
          <p className="text-[13.5px] text-text-muted/80 mt-2 leading-snug max-w-lg font-heading">
            Choose what each role can view and do.
          </p>
        </div>
      </header>

      {/* Role selector and Quick Actions toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted/70 font-heading flex-shrink-0">Role:</span>
        <div className="flex gap-1.5 flex-wrap">
          {roles.map(r => {
            const c = r.color || ROLE_CLR[r.name] || 'rgba(255,255,255,0.3)';
            const isActive = activeRole === r.name;
            return (
              <button key={r.name} onClick={() => setActiveRole(r.name)}
                className="flex items-center gap-2 px-3 h-8 rounded-[8px] text-[12px] font-semibold font-heading cursor-pointer transition-all border"
                style={isActive
                  ? { color: c, background: `color-mix(in srgb, ${c} 12%, transparent)`, borderColor: `color-mix(in srgb, ${c} 30%, transparent)` }
                  : { color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
                <Shield size={11} />
                {r.label}
              </button>
            );
          })}
        </div>
        <div className="ml-auto flex gap-2">
          <IconBtn label="Create Module" Icon={Plus} variant="cyan" small onClick={() => setModuleModal({ isOpen: true, mode: 'create', moduleData: null })} />
          <IconBtn label="Grant All" Icon={CheckCircle2} variant="success" small onClick={() => { toggleAll(activeRole, true); act('All permissions granted for ' + activeRole); }} />
          <IconBtn label="Revoke All" Icon={XCircle} variant="danger" small onClick={() => { toggleAll(activeRole, false); act('All permissions revoked for ' + activeRole); }} />
          <IconBtn label="Save Changes" Icon={Check} variant="brand" small onClick={handleSave} />
        </div>
      </div>

      {toast && (
        <div className="flex items-center gap-2 rounded-[9px] border border-positive/20 bg-positive/[0.07] px-4 py-2.5 text-[12px] font-semibold text-positive font-heading">
          <CheckCircle2 size={13} />{toast}
        </div>
      )}

      {/* Active role summary */}
      <Card padding={false} className="border-cyan/20 overflow-hidden" style={{ background: `color-mix(in srgb, ${roleColor} 3%, transparent)` }}>
        <div className="flex items-center gap-4 px-5 py-4">
          <Shield size={18} className="flex-shrink-0" style={{ color: roleColor }} />
          <div className="flex-1 min-w-0">
            <span className="text-[14.5px] font-semibold font-heading text-text">{roleObj.label}</span>
            <span className="text-[13px] text-text-muted/75 font-heading ml-3">{roleObj.desc}</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[12.5px] font-mono font-semibold" style={{ color: roleColor }}>{countActive()}</span>
            <span className="text-[11px] text-text-muted/70 font-heading">/ {modules.length * PERM_ACTIONS.length} permissions enabled</span>
          </div>
        </div>

        <div className="border-t border-border/15">
          <MainTable columns={permColumns} data={modules} />
        </div>
      </Card>

      {/* Legend */}
      <div className="flex items-center gap-6 text-[11px] font-heading text-text-muted/70 flex-wrap pt-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-[4px] border border-positive/30 bg-positive/[0.15] flex items-center justify-center"><Check size={9} strokeWidth={3} className="text-positive" /></div>
          Allowed
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-[4px] border border-white/[0.08] bg-transparent" />
          Not allowed
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-[4px] border border-cyan/25 bg-cyan/[0.1] flex items-center justify-center"><Check size={9} strokeWidth={3} className="text-cyan" /></div>
          Column header — toggles entire column
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-[4px] border border-brand/25 bg-brand/[0.1]" />
          Row header — toggles entire row
        </div>
      </div>

      {/* ── CREATE / EDIT MODULE SLIDING DRAWER ── */}
      <MainDrawer open={moduleModal.isOpen} onClose={() => setModuleModal({ isOpen: false, mode: 'create', moduleData: null })}>
        {/* Color bar */}
        <div className="h-[2.5px] w-full bg-cyan" />
        
        {/* Header */}
        <div className="px-6 py-5 flex items-start justify-between border-b border-border/15">
          <div>
            <p className="text-[9.5px] font-black uppercase tracking-[0.22em] text-cyan mb-2 leading-none">
              System Modules
            </p>
            <h2 className="text-[20px] font-bold tracking-[-0.022em] text-text leading-tight font-heading">
              {moduleModal.mode === 'create' ? 'Create Module' : 'Edit Module'}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setModuleModal({ isOpen: false, mode: 'create', moduleData: null })}
            className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-border/18 bg-bg/40 text-text-muted hover:text-text hover:border-border/30 transition-all cursor-pointer"
          >
            <X size={13} />
          </button>
        </div>

        {/* Scrollable Body */}
        <form onSubmit={handleModalSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[9.5px] font-black uppercase tracking-[0.14em] text-text-muted/50 font-heading">
              Module Name
            </label>
            <input
              type="text"
              value={moduleLabel}
              onChange={(e) => setModuleLabel(e.target.value)}
              placeholder="e.g. Activity Logs, Risk Management"
              className="w-full h-9 rounded-[8px] border border-white/[0.1] bg-bg/40 px-3 text-[12.5px] text-text outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/10 transition-all font-heading"
              maxLength={30}
              required
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[9.5px] font-black uppercase tracking-[0.14em] text-text-muted/50 font-heading">
              Module ID
            </label>
            <div className="flex h-9 items-center rounded-[8px] border border-white/[0.04] bg-bg/25 px-3 text-[12px] font-mono text-text-muted select-none">
              {moduleLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || '(Enter module name)'}
            </div>
            <span className="block text-[10.5px] text-text-muted/40 font-heading">
              Used by the system for APIs and permission checks.
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[9.5px] font-black uppercase tracking-[0.14em] text-text-muted/50 font-heading">
              Description
            </label>
            <textarea
              value={moduleDesc}
              onChange={(e) => setModuleDesc(e.target.value)}
              placeholder="Describe what this module controls..."
              rows={4}
              className="w-full resize-none rounded-[8px] border border-white/[0.1] bg-bg/40 px-3 py-2.5 text-[12.5px] text-text outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/10 transition-all leading-relaxed font-heading"
              maxLength={150}
            />
          </div>

          {/* Icon Selector Grid */}
          <div className="space-y-1.5">
            <label className="block text-[9.5px] font-black uppercase tracking-[0.14em] text-text-muted/50 font-heading">
              Select Icon
            </label>
            <div className="grid grid-cols-6 gap-2 rounded-[9px] border border-white/[0.05] bg-bg/20 p-2.5">
              {AVAILABLE_ICONS.map((ico) => {
                const isSelected = moduleIcon === ico;
                return (
                  <button
                    key={ico}
                    type="button"
                    onClick={() => setModuleIcon(ico)}
                    className={`flex h-8 w-8 items-center justify-center rounded-[6px] border transition-all hover:scale-105 cursor-pointer
                      ${isSelected 
                        ? 'border-cyan/40 bg-cyan/[0.12] text-cyan shadow-[0_0_8px_rgba(6,182,212,0.15)]' 
                        : 'border-white/[0.04] bg-bg/40 text-text-muted/40 hover:text-text hover:border-white/[0.1]'}`}
                    title={ico}
                  >
                    <ModuleIcon icon={ico} size={14} />
                  </button>
                );
              })}
            </div>
          </div>

          {modalError && (
            <div className="text-[11.5px] text-negative font-semibold font-heading bg-negative/5 border border-negative/10 px-3 py-2 rounded-[6px]">
              {modalError}
            </div>
          )}
        </form>

        {/* Sticky Footer */}
        <div className="border-t border-border/15 bg-surface-elevated px-6 py-4 flex items-center justify-between gap-2">
          {moduleModal.mode === 'edit' ? (
            <button
              type="button"
              onClick={() => {
                if (confirm(`Are you sure you want to delete the module "${moduleModal.moduleData.label}"? All permissions for this module will be cleared.`)) {
                  deleteModule(moduleModal.moduleData.id);
                  act(`Module "${moduleModal.moduleData.label}" deleted`);
                  setModuleModal({ isOpen: false, mode: 'create', moduleData: null });
                }
              }}
              className="h-9 px-4 rounded-[8px] border border-negative/25 bg-negative/10 text-negative hover:bg-negative/20 text-[11.5px] font-bold cursor-pointer transition-colors"
            >
              Delete Module
            </button>
          ) : <div />}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setModuleModal({ isOpen: false, mode: 'create', moduleData: null })}
              className="h-9 px-4 rounded-[8px] border border-white/[0.08] text-text-muted hover:text-text hover:bg-white/[0.03] text-[11.5px] font-bold cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleModalSubmit}
              className="h-9 px-4 rounded-[8px] bg-brand text-bg hover:brightness-110 text-[11.5px] font-bold cursor-pointer transition-all active:scale-[0.98]"
            >
              {moduleModal.mode === 'create' ? 'Create Module' : 'Save Changes'}
            </button>
          </div>
        </div>
      </MainDrawer>
    </div>
  );
}

export default PermissionsPage;
