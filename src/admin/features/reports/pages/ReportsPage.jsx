import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, DollarSign, TrendingUp, Users, Cpu, Send, ShieldAlert } from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { ReportsOverviewPage } from './ReportsOverviewPage';
import FinanceReportsPage from './FinanceReportsPage';
import TradingReportsPage from './TradingReportsPage';
import UserReportsPage from './UserReportsPage';
import SystemReportsPage from './SystemReportsPage';
import { ExportCenterPage } from './ExportCenterPage';
import { PERMISSIONS, hasPermission } from '@/config/permissions/permissions';
import { useAdminSession } from '@/app/providers/AdminSessionProvider';

const NAV_ITEMS = [
  { id: 'overview',  path: '/admin/reports',          label: 'Overview',        Icon: LayoutDashboard, permission: PERMISSIONS.reports.view },
  { id: 'finance',   path: '/admin/reports/finance',   label: 'Finance',         Icon: DollarSign,      permission: PERMISSIONS.reports.view },
  { id: 'trading',   path: '/admin/reports/trading',   label: 'Trading',         Icon: TrendingUp,      permission: PERMISSIONS.reports.view },
  { id: 'users',     path: '/admin/reports/users',     label: 'Users',           Icon: Users,           permission: PERMISSIONS.reports.view },
  { id: 'system',    path: '/admin/reports/system',    label: 'System Jobs',     Icon: Cpu,             permission: PERMISSIONS.reports.view },
  { id: 'exports',   path: '/admin/reports/exports',   label: 'Export Center',   Icon: Send,            permission: PERMISSIONS.reports.export },
];

const PAGE_MAP = {
  overview: ReportsOverviewPage,
  finance:  FinanceReportsPage,
  trading:  TradingReportsPage,
  users:    UserReportsPage,
  system:   SystemReportsPage,
  exports:  ExportCenterPage,
};

const ROLE_LABELS = {
  'super-admin': 'Super Admin',
  'operations': 'Operations',
  'auditor': 'Auditor',
};

function ReportsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { permissions, user } = useAdminSession();

  const filteredNavItems = NAV_ITEMS.filter(
    (item) => !item.permission || hasPermission(permissions, item.permission)
  );

  const active = filteredNavItems.find((n) => n.path === location.pathname);
  const activeId = active?.id ?? 'overview';

  const PageComponent = PAGE_MAP[activeId] ?? PAGE_MAP.overview;

  return (
    <PageShell className="!pt-0">
      {/* ── Sticky sub-nav ── */}
      <div className="sticky top-[68px] z-20 -mx-6 px-6 mb-5 pt-4 pb-3 border-b border-border/20 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
        style={{ backgroundColor: 'var(--bg)' }}>
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {filteredNavItems.map((item) => {
            const { id, path, label, Icon } = item;
            const active = activeId === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => navigate(path)}
                className={[
                  'flex flex-shrink-0 items-center gap-1.5 rounded-[9px] border px-3 py-2',
                  'text-[12px] font-semibold font-heading transition-all duration-200',
                  active
                    ? 'border-primary/25 bg-primary/10 text-primary'
                    : 'border-transparent bg-transparent text-text-muted hover:border-border/35 hover:bg-bg/50 hover:text-text',
                ].join(' ')}
              >
                <Icon size={13} className="flex-shrink-0" />
                {label}
              </button>
            );
          })}
        </div>

        {/* Role-Access Indicator Badge */}
        <div className="flex items-center gap-1.5 self-start md:self-auto rounded-[8px] border border-border/25 bg-surface/50 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold text-text hover:border-border/50 hover:bg-surface-elevated transition-all cursor-pointer relative group">
          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
          <span className="text-[11px] uppercase tracking-[0.05em] text-text-muted/70 font-bold">Access:</span>
          <span className="text-text/90 font-bold">{ROLE_LABELS[user?.role] || user?.role || 'Custom'}</span>
          
          {/* Tooltip Overlay */}
          <div className="absolute right-0 top-full mt-2 w-64 rounded-[12px] border border-border/30 bg-surface shadow-2xl p-4 hidden group-hover:block z-50 animate-in fade-in zoom-in-98 duration-150">
            <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-border/10">
              <ShieldAlert size={12} className="text-brand" />
              <h4 className="text-[11px] font-bold uppercase tracking-[0.05em] text-text-muted/70">Access Levels</h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11.5px]">
                <span className="font-semibold text-text/80">Super Admin</span>
                <span className="font-semibold text-positive border border-positive/25 bg-positive/10 px-2 py-0.5 rounded-[5px] text-[11px]">All Access</span>
              </div>
              <div className="flex items-center justify-between text-[11.5px]">
                <span className="font-semibold text-text/80">Operations</span>
                <span className="font-semibold text-brand border border-brand/25 bg-brand-muted px-2 py-0.5 rounded-[5px] text-[11px]">Standard</span>
              </div>
              <div className="flex items-center justify-between text-[11.5px]">
                <span className="font-semibold text-text/80">Auditor</span>
                <span className="font-semibold text-purple border border-purple/25 bg-purple/10 px-2 py-0.5 rounded-[5px] text-[11px]">Read Only</span>
              </div>
            </div>
            <p className="text-[11px] text-text-muted/60 mt-3 leading-relaxed">
              Export Center requires <code>reports.export</code> permission. Other reports need <code>reports.view</code>.
            </p>
          </div>
        </div>
      </div>

      {/* ── Active Page ── */}
      <div className="animate-fade-up">
        <PageComponent />
      </div>
    </PageShell>
  );
}

export default ReportsPage;