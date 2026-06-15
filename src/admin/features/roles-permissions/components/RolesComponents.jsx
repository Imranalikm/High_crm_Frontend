/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { Fingerprint, Search } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { rolesData } from '@/config/constants/roles-permissions/workspaces/admin-mgmt.workspace';
import { SEV_CLR } from '@/config/constants/status.constants';
import { useRolesPermissions } from '../context/RolesPermissionsContext';
export { SEV_CLR };

export const STATUS_CLR = {
  ACTIVE: 'var(--positive)', INACTIVE: 'var(--text-muted)', LOCKED: 'var(--negative)',
  PENDING: 'var(--warning)', DRAFT: 'var(--warning)', SUCCESS: 'var(--positive)',
  FAILED: 'var(--negative)', BLOCKED: 'var(--negative)', LOCKED_OUT: 'var(--negative)',
};

export const ROLE_CLR = {
  SUPER_ADMIN: '#e5c07b', RISK_OFFICER: '#ef4444', COMPLIANCE: '#a78bfa',
  FINANCE: 'var(--brand)', SUPPORT: 'var(--cyan)', READ_ONLY: 'rgba(255,255,255,0.35)',
};

export function Badge({ value, size = 'sm' }) {
  const color = STATUS_CLR[value] || 'var(--text-muted)';
  const cls = size === 'lg' ? 'px-2.5 py-1 text-[11.5px]' : 'px-2.5 py-0.5 text-[11px]';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-[5px] font-semibold uppercase tracking-[0.05em] whitespace-nowrap font-heading ${cls}`}
      style={{ color, background: `color-mix(in srgb, ${color} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 22%, transparent)` }}>
      <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: color }} />{value}
    </span>
  );
}

export function SevBadge({ value }) {
  const color = SEV_CLR[value] || 'var(--text-muted)';
  return (
    <span className="inline-flex items-center gap-1 rounded-[5px] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.05em] whitespace-nowrap font-heading"
      style={{ color, background: `color-mix(in srgb, ${color} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 22%, transparent)` }}>
      {value}
    </span>
  );
}

export function RolePill({ value }) {
  let dynamicRoles = [];
  try {
    const ctx = useRolesPermissions();
    dynamicRoles = ctx.roles;
  } catch (e) {
    // Fallback if rendered outside provider
  }
  const roleObj = dynamicRoles.find(r => r.name === value);
  const color = roleObj?.color || ROLE_CLR[value] || 'rgba(255,255,255,0.35)';
  const label = roleObj?.label || value;
  return (
    <span className="inline-flex items-center gap-1 rounded-[5px] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.05em] whitespace-nowrap font-heading"
      style={{ color, background: `color-mix(in srgb, ${color} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 22%, transparent)` }}>
      {label}
    </span>
  );
}

export function ModuleIcon({ icon, size = 13, className = "" }) {
  if (!icon) return null;
  if (typeof icon === 'function' || (typeof icon === 'object' && icon.render)) {
    const IconComponent = icon;
    return <IconComponent size={size} className={className} />;
  }
  const IconComponent = LucideIcons[icon] || LucideIcons.Shield;
  return <IconComponent size={size} className={className} />;
}

export function TwoFABadge({ enabled }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-[5px] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.05em] whitespace-nowrap font-heading
      ${enabled
        ? 'text-positive border border-positive/20 bg-positive/[0.08]'
        : 'text-negative/70 border border-negative/20 bg-negative/[0.06]'}`}>
      <Fingerprint size={10} className="flex-shrink-0" />
      {enabled ? '2FA ON' : '2FA OFF'}
    </span>
  );
}

export function SectionHead({ title, Icon: Ic, action }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      {Ic && <Ic size={11} className="text-text-muted/65 flex-shrink-0" />}
      <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted/70 font-heading select-none">{title}</span>
      <div className="flex-1 h-px bg-white/[0.05]" />
      {action}
    </div>
  );
}

export function IconBtn({ Icon: Ic, label, variant = 'default', onClick, small }) {
  const vs = {
    danger: { border: '1px solid rgba(239,68,68,0.22)', bg: 'rgba(239,68,68,0.07)', color: '#ef4444' },
    success: { border: '1px solid rgba(74,225,118,0.22)', bg: 'rgba(74,225,118,0.07)', color: 'var(--positive)' },
    warning: { border: '1px solid rgba(217,119,6,0.22)', bg: 'rgba(217,119,6,0.07)', color: '#d97706' },
    cyan: { border: '1px solid rgba(6,182,212,0.22)', bg: 'rgba(6,182,212,0.07)', color: 'var(--cyan)' },
    brand: { border: '1px solid rgba(218,165,32,0.25)', bg: 'rgba(218,165,32,0.09)', color: 'var(--brand)' },
    default: { border: '1px solid rgba(255,255,255,0.08)', bg: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)' },
  };
  const s = vs[variant] ?? vs.default;
  const h = small ? 'h-7 px-2.5 text-[11px]' : 'h-8 px-3 text-[11.5px]';
  return (
    <button onClick={onClick}
      className={`flex items-center gap-1.5 ${h} rounded-[7px] font-semibold font-heading transition-all duration-200 hover:brightness-110 active:scale-[0.97] cursor-pointer whitespace-nowrap`}
      style={{ border: s.border, background: s.bg, color: s.color }}>
      {Ic && <Ic size={small ? 11 : 12} />}{label}
    </button>
  );
}

export function AdminAvatar({ name, size = 'sm', role }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  let dynamicRoles = [];
  try {
    const ctx = useRolesPermissions();
    dynamicRoles = ctx.roles;
  } catch (e) {
    // Fallback if rendered outside provider
  }
  const roleObj = dynamicRoles.find(r => r.name === role);
  const color = roleObj?.color || ROLE_CLR[role] || 'rgba(255,255,255,0.3)';
  const dim = size === 'lg' ? 'w-10 h-10 text-[12px] rounded-[10px]' : 'w-7 h-7 text-[10.5px] rounded-[7px]';
  return (
    <div className={`${dim} flex items-center justify-center font-semibold font-heading flex-shrink-0 border`}
      style={{ background: `color-mix(in srgb, ${color} 12%, transparent)`, borderColor: `color-mix(in srgb, ${color} 22%, transparent)`, color }}>
      {initials}
    </div>
  );
}

export function Toolbar({ search, setSearch, filters, activeFilter, setFilter, actions, extra }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {search !== undefined && (
        <div className="relative flex-1 min-w-[200px] max-w-[300px]">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/30 pointer-events-none" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
            className="w-full h-8 pl-8 pr-3 rounded-[8px] border border-white/[0.07] bg-white/[0.03] text-[12px] text-text placeholder:text-text-muted/25 outline-none focus:border-primary/30 transition-colors font-heading" />
        </div>
      )}
      {filters && (
        <div className="flex gap-1 flex-wrap">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-2.5 h-8 rounded-[7px] text-[11px] font-bold font-heading uppercase tracking-wide cursor-pointer transition-all duration-150 border
                ${activeFilter === f ? 'bg-primary/[0.12] text-primary border-primary/20' : 'border-white/[0.06] text-text-muted/40 hover:text-text-muted hover:border-white/[0.1] bg-transparent'}`}>
              {f}
            </button>
          ))}
        </div>
      )}
      {extra}
      <div className="flex gap-2 ml-auto">
        {actions?.map((a, i) => (
          <button key={i} onClick={a.onClick}
            className={`flex items-center gap-1.5 h-8 px-3 rounded-[8px] text-[11px] font-semibold font-heading border transition-all duration-200 cursor-pointer
              ${a.primary
                ? 'bg-brand/90 text-black border-brand/40 hover:brightness-110'
                : 'border-white/[0.07] bg-white/[0.03] text-text-muted/70 hover:text-text hover:border-white/[0.12]'}`}>
            {a.Icon && <a.Icon size={12} />}{a.label}
          </button>
        ))}
      </div>
    </div>
  );
}

