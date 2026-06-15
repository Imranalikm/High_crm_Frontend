import React, { useMemo, useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronDown,
  ChevronRight,
  User,
  Lock,
  Bell,
  History,
  Key,
  ShieldCheck,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { adminNavigation, adminNavigationSections } from '@/shared/config/sidebar/admin-sidebar.config';
import { hasPermission } from '@/shared/config/permissions/permissions';
import { useAdminSession } from '@/app/providers/AdminSessionProvider';
import { useAuth } from '@/shared/features/auth/AuthContext';

/* ─────────────────────────────────────────────────────────────
   SIDEBAR ITEM
───────────────────────────────────────────────────────────── */
function SidebarItem({
  item,
  collapsed,
  activeId,
  expandedId,
  navigate,
  onHoverStart,
  onHoverEnd,
  hoverNode,
  onToggleExpand,
}) {
  const Icon = item.icon;
  const ref = useRef(null);
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const isExpanded = expandedId === item.id;
  const isActive =
    activeId === item.id ||
    (hasSubItems && item.subItems.some((s) => activeId === s.id));
  const isHoveredPortal = collapsed && hoverNode?.item.id === item.id;

  const handleMouseEnter = () => {
    if (collapsed && ref.current) onHoverStart(item, ref.current.getBoundingClientRect());
  };

  const handleClick = () => {
    if (hasSubItems) {
      if (!collapsed) {
        onToggleExpand(item.id);
      } else {
        navigate(item.subItems[0].path);
      }
    } else {
      navigate(item.path);
    }
  };

  return (
    <div
      className="flex flex-col w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onHoverEnd}
    >
      <button
        ref={ref}
        data-active={isActive && !hasSubItems}
        onClick={handleClick}
        className={`
          group/btn relative flex items-center outline-none cursor-pointer select-none
          transition-all duration-200
          ${collapsed
            ? 'justify-center rounded-[10px] mx-auto w-10 h-10'
            : 'px-3 py-2.5 gap-3 rounded-[8px] w-full'
          }
          ${isActive
            ? collapsed
              ? 'bg-primary/[0.14] text-primary'
              : 'bg-primary/[0.08] text-primary'
            : `text-text-muted/50 hover:bg-text/[0.04] hover:text-text/75
               ${isHoveredPortal ? 'bg-text/[0.04] text-text/75' : ''}`
          }
        `}
      >
        {/* Active left accent bar */}
        <span
          className={`
            absolute left-0 top-[20%] bottom-[20%] w-[2.5px] bg-primary rounded-r-full
            transition-all duration-200
            ${isActive && !collapsed ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
          `}
        />

        {/* Icon */}
        <span
          className={`
            relative shrink-0 flex items-center justify-center transition-all duration-200
            ${collapsed ? 'w-6 h-6' : 'w-[18px] h-[18px]'}
            ${isActive
              ? 'text-primary'
              : 'text-text-muted/40 group-hover/btn:text-text/70 group-hover/btn:scale-110'
            }
          `}
        >
          <Icon size={collapsed ? 19 : 16} strokeWidth={isActive ? 2.1 : 1.75} />
        </span>

        {/* Label + chevron (hidden when collapsed) */}
        <span
          className={`
            flex items-center justify-between min-w-0 transition-all duration-200
            ${collapsed
              ? 'w-0 flex-none opacity-0 overflow-hidden pointer-events-none'
              : 'flex-1 opacity-100 w-auto'
            }
          `}
        >
          <span
            className={`
              text-[14.5px] font-heading font-medium tracking-[-0.02em] truncate
              transition-colors duration-200
              ${isActive ? 'text-text font-semibold' : 'text-text-muted/55 group-hover/btn:text-text/80'}
            `}
          >
            {item.label}
          </span>
          {hasSubItems && (
            <ChevronDown
              size={12}
              strokeWidth={2.5}
              className={`
                ml-2 shrink-0 transition-transform duration-300
                ease-[cubic-bezier(0.34,1.56,0.64,1)]
                ${isExpanded ? 'rotate-180 text-primary' : 'rotate-0 text-text-muted/25'}
              `}
            />
          )}
        </span>

        {/* Collapsed active indicator dot */}
        <span
          className={`
            absolute right-1 top-1 w-1.5 h-1.5 rounded-full bg-primary transition-all duration-200
            ${isActive && collapsed ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
          `}
        />
      </button>

      {/* Sub-items accordion (expanded sidebar only) */}
      {hasSubItems && (
        <div
          className="grid"
          style={{
            // Use explicit property names for reliable cross-browser transition
            transition: 'grid-template-rows 280ms cubic-bezier(0.4,0,0.2,1), opacity 220ms ease',
            gridTemplateRows: isExpanded && !collapsed ? '1fr' : '0fr',
            opacity: isExpanded && !collapsed ? 1 : 0,
            pointerEvents: isExpanded && !collapsed ? 'auto' : 'none',
          }}
        >
          {/* overflow-hidden + min-h-0 is essential for grid accordion technique */}
          <div className="overflow-hidden min-h-0">
            <div className="relative ml-[30px] pt-1 pb-1.5 flex flex-col gap-px">
              {/* Vertical connector line */}
              <span className="absolute left-0 top-1.5 bottom-1.5 w-px bg-border/[0.12]" />

              {item.subItems.map((sub) => {
                const isSub = activeId === sub.id;
                return (
                  <button
                    key={sub.id}
                    data-active={isSub}
                    onClick={() => navigate(sub.path)}
                    className={`
                      group/sub relative flex items-center gap-2.5 pl-4 pr-3 py-2 rounded-[7px]
                      text-[13.5px] font-heading font-medium tracking-[-0.01em] min-w-0
                      outline-none cursor-pointer transition-all duration-150
                      ${isSub
                        ? 'bg-primary/[0.08] text-primary'
                        : 'text-text-muted/45 hover:bg-text/[0.04] hover:text-text/70'
                      }
                    `}
                  >
                    {/* Horizontal connector tick */}
                    <span
                      className={`
                        absolute left-0 top-1/2 -translate-y-1/2 w-[10px] h-px
                        transition-colors duration-150
                        ${isSub ? 'bg-primary/60' : 'bg-border/20 group-hover/sub:bg-border/35'}
                      `}
                    />
                    {/* Active sub dot */}
                    {isSub && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 -ml-0.5" />
                    )}
                    <span className={`truncate ${isSub ? '-ml-0.5' : ''}`}>{sub.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   NAV SECTION LABEL
───────────────────────────────────────────────────────────── */
function NavSection({ label, collapsed }) {
  if (collapsed) {
    return <div className="w-5 h-px mx-auto my-3" style={{ background: 'var(--border)' }} />;
  }
  return (
    <div className="flex items-center gap-3 px-3 pt-7 pb-2.5">
      <span className="text-[10.5px] font-black tracking-[0.22em] uppercase text-text-muted/25 select-none whitespace-nowrap">
        {label}
      </span>
      <span className="flex-1 h-px bg-border/20" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────────────────────────── */
export function Sidebar({ collapsed, isMobile }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { permissions } = useAdminSession();
  const { user } = useAuth();

  const [profileMenuExpanded, setProfileMenuExpanded] = useState(false);

  // Close profile submenu whenever the sidebar collapses
  const [prevCollapsed, setPrevCollapsed] = useState(collapsed);
  if (collapsed !== prevCollapsed) {
    setPrevCollapsed(collapsed);
    if (collapsed) {
      setProfileMenuExpanded(false);
    }
  }

  const profileSubTabs = useMemo(() => {
    const tabs = [
      { id: 'acct-overview', label: 'Overview', path: '/admin/account/overview', icon: ShieldCheck },
      { id: 'acct-profile', label: 'Profile Details', path: '/admin/account/profile', icon: User },
      { id: 'acct-security', label: 'Security & 2FA', path: '/admin/account/security', icon: Lock },
      { id: 'acct-notifications', label: 'Notifications', path: '/admin/account/notifications', icon: Bell },
      { id: 'acct-activity', label: 'Activity Log', path: '/admin/account/activity', icon: History },
    ];
    if (user?.role === 'super-admin' || user?.role === 'client') {
      tabs.push({ id: 'acct-api-keys', label: 'API Keys', path: '/admin/account/api-keys', icon: Key });
    }
    return tabs;
  }, [user]);

  // Prefixed profile item for the collapsed hover flyout
  const profileItem = useMemo(() => ({
    id: 'account',
    label: 'My Account',
    icon: User,
    subItems: profileSubTabs.map((sub) => ({
      id: sub.id,
      label: sub.label,
      path: sub.path,
    })),
  }), [profileSubTabs]);

  const [hoverNode, setHoverNode] = useState(null);
  const [manualExpandedId, setManualExpandedId] = useState(null);
  const [manualExpandedPath, setManualExpandedPath] = useState(null);

  const hoverTimer = useRef(null);
  const navRef = useRef(null);

  /* ── Allowed nav items ── */
  const allowedItems = useMemo(
    () =>
      adminNavigation
        .filter((item) => hasPermission(permissions, item.permission))
        .map((item) => ({
          ...item,
          subItems: item.subItems?.filter((s) => hasPermission(permissions, s.permission)),
        })),
    [permissions],
  );

  /* ── Active ID helpers ── */
  const getUsersActiveId = () => {
    if (location.pathname.includes('/admin/users/kyc') || location.state?.usersView === 'kyc') return 'users-kyc';
    if (location.pathname.includes('/admin/users/mt5') || location.state?.usersView === 'mt5') return 'users-mt5';
    return 'users-list';
  };

  const getFinanceActiveId = (pathname) => {
    if (pathname.includes('/admin/finance/deposits')) return 'finance-deposits';
    if (pathname.includes('/admin/finance/withdrawals')) return 'finance-withdrawals';
    if (pathname.includes('/admin/finance/transactions')) return 'finance-transactions';
    if (pathname.includes('/admin/finance/failed')) return 'finance-failed';
    if (pathname.includes('/admin/finance/approvals')) return 'finance-approvals';
    return 'finance-deposits';
  };

  const getActiveId = () => {
    const { pathname } = location;

    // ── Check profile sub-items first so the flyout highlights them correctly ──
    const profileSub = profileSubTabs.find((s) => s.path === pathname);
    if (profileSub) return profileSub.id;

    if (pathname === '/admin' || pathname === '/admin/') return 'dashboard';
    if (location.state?.fromTrading && pathname.startsWith('/admin/users/mt5')) return 'trading-accounts';

    for (const item of allowedItems) {
      if (item.path === pathname && (!item.subItems || item.subItems.length === 0)) return item.id;
      if (item.subItems) {
        const sub = item.subItems.find((c) => c.path === pathname);
        if (sub) return sub.id;
      }
      if (pathname.startsWith('/admin/users/') && item.id === 'users') return getUsersActiveId();
      if (pathname.startsWith('/admin/finance/') && item.id === 'finance') return getFinanceActiveId(pathname);
      if (pathname.startsWith('/admin/trading/') && item.id === 'trading') {
        if (pathname.includes('/admin/trading/orders')) return 'trading-orders';
        if (pathname.includes('/admin/trading/positions')) return 'trading-positions';
        if (pathname.includes('/admin/trading/history')) return 'trading-history';
        if (pathname.includes('/admin/trading/execution-logs')) return 'trading-logs';
        return 'trading-accounts';
      }
      if (pathname.startsWith('/admin/support/tickets/') && item.id === 'support') {
        return location.state?.fromEscalated ? 'support-escalated' : 'support-tickets';
      }
      if (pathname.startsWith('/admin/copy-trading/') && item.id === 'copy-trading') {
        const slug = pathname.split('/')[3];
        return slug ? `copy-${slug}` : 'copy-strategies';
      }
    }
    return null;
  };

  const activeId = getActiveId();
  const isAccountActive = location.pathname.startsWith('/admin/account');

  /* ── Expanded section ── */
  const routeExpandedId = useMemo(() => {
    if (location.state?.fromTrading && location.pathname.startsWith('/admin/users/mt5')) return 'trading';
    return allowedItems.find(
      (item) =>
        item.path === location.pathname ||
        item.subItems?.some((s) => s.path === location.pathname) ||
        (location.pathname.startsWith('/admin/users/') && item.id === 'users') ||
        (location.pathname.startsWith('/admin/finance/') && item.id === 'finance') ||
        (location.pathname.startsWith('/admin/trading/') && item.id === 'trading') ||
        (location.pathname.startsWith('/admin/copy-trading/') && item.id === 'copy-trading') ||
        (location.pathname.startsWith('/admin/support/') && item.id === 'support'),
    )?.id ?? null;
  }, [allowedItems, location.pathname, location.state]);

  const expandedId = manualExpandedPath === location.pathname ? manualExpandedId : routeExpandedId;

  const toggleExpand = (id) => {
    setManualExpandedPath(location.pathname);
    setManualExpandedId(expandedId === id ? null : id);
  };

  /* ── Auto-scroll active item into view ── */
  useEffect(() => {
    if (activeId && !collapsed && navRef.current) {
      const activeEl = navRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        const t = setTimeout(() => activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 150);
        return () => clearTimeout(t);
      }
    }
  }, [activeId, collapsed, expandedId]);

  /* ── Hover portal handlers ── */
  const handleHoverStart = (item, rect) => {
    if (isMobile) return;
    clearTimeout(hoverTimer.current);
    setHoverNode({ item, rect });
  };

  const handleHoverEnd = () => {
    if (isMobile) return;
    hoverTimer.current = window.setTimeout(() => setHoverNode(null), 220);
  };

  /* ── Grouped nav sections ── */
  const groupedItems = useMemo(
    () =>
      adminNavigationSections.map((section) => ({
        ...section,
        items: allowedItems.filter((item) => item.navSection === section.id),
      })),
    [allowedItems],
  );

  const showSubMenu = !collapsed && profileMenuExpanded;
  const sidebarWidth = isMobile ? '272px' : collapsed ? '68px' : '248px';
  const sidebarLeft = isMobile && collapsed ? '-272px' : '0';

  return (
    <aside
      className="fixed top-0 h-screen z-[100] flex flex-col overflow-hidden"
      style={{
        width: sidebarWidth,
        left: sidebarLeft,
        transition: 'width 0.38s cubic-bezier(0.16,1,0.3,1), left 0.38s cubic-bezier(0.16,1,0.3,1)',
        backgroundColor: 'var(--surface-2)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Flyout keyframe — defined once per render, no perf impact */}
      <style>{`
        @keyframes sideTooltip {
          from { opacity: 0; transform: translateX(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateX(0)   scale(1);    }
        }
      `}</style>

      {/* ══════════════════════════════════════
          LOGO HEADER
      ══════════════════════════════════════ */}
      <div
        className={`
          relative flex items-center shrink-0 h-16 transition-all duration-300
          ${collapsed ? 'justify-center px-0' : 'px-4 gap-3'}
        `}
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <button
          onClick={() => navigate('/admin')}
          className="relative shrink-0 w-8 h-8 rounded-[9px] flex items-center justify-center bg-primary cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ boxShadow: '0 0 14px color-mix(in srgb, var(--primary) 30%, transparent)' }}
        >
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <rect x="1" y="1" width="6" height="6" rx="1.5" fill="rgba(0,0,0,0.55)" />
            <rect x="11" y="1" width="6" height="6" rx="1.5" fill="rgba(0,0,0,0.35)" />
            <rect x="1" y="11" width="6" height="6" rx="1.5" fill="rgba(0,0,0,0.35)" />
            <rect x="11" y="11" width="6" height="6" rx="1.5" fill="rgba(0,0,0,0.15)" />
          </svg>
        </button>

        {!collapsed && (
          <div className="flex flex-col gap-0.5 overflow-hidden animate-in fade-in slide-in-from-left-2 duration-200">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-heading font-bold text-[16px] tracking-[-0.05em] text-text">
                LiveTrade<span className="text-primary">.</span>
              </span>
              <span className="text-[8px] font-black tracking-[0.22em] uppercase text-primary/65 px-1.5 py-0.5 rounded-[3px] bg-primary/[0.08] border border-primary/[0.15] leading-none">
                PRO
              </span>
            </div>
            <span className="text-[8px] font-black uppercase tracking-[0.18em] text-text-muted/30 leading-none mt-px select-none">
              Admin Console
            </span>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════
          NAVIGATION
      ══════════════════════════════════════ */}
      <nav
        ref={navRef}
        className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar"
      >
        <div
          className={`
            flex flex-col pt-2 pb-8
            ${collapsed ? 'items-center gap-1 px-[14px]' : 'gap-px px-2.5'}
          `}
        >
          {groupedItems.map((section) =>
            section.items.length > 0 ? (
              <React.Fragment key={section.id}>
                <NavSection label={section.label} collapsed={collapsed} />
                {section.items.map((item) => (
                  <SidebarItem
                    key={item.id}
                    item={item}
                    collapsed={collapsed}
                    activeId={activeId}
                    expandedId={expandedId}
                    navigate={navigate}
                    onHoverStart={handleHoverStart}
                    onHoverEnd={handleHoverEnd}
                    hoverNode={hoverNode}
                    onToggleExpand={toggleExpand}
                  />
                ))}
              </React.Fragment>
            ) : null,
          )}
        </div>
      </nav>

      {/* ══════════════════════════════════════
          COLLAPSED HOVER FLYOUT (portal)
      ══════════════════════════════════════ */}
      {collapsed && hoverNode &&
        createPortal(
          <div
            className="fixed z-[99999]"
            style={{
              top: hoverNode.rect.top > window.innerHeight - 300 ? 'auto' : hoverNode.rect.top,
              bottom: hoverNode.rect.top > window.innerHeight - 300
                ? window.innerHeight - hoverNode.rect.bottom
                : 'auto',
              left: 76,
            }}
            onMouseEnter={() => clearTimeout(hoverTimer.current)}
            onMouseLeave={handleHoverEnd}
          >
            {/* Arrow tip */}
            <div
              className={`
                absolute left-0 w-2 h-2 rotate-45 -translate-x-[5px] border-l border-b
                ${hoverNode.rect.top > window.innerHeight - 300 ? 'bottom-[14px]' : 'top-[14px]'}
              `}
              style={{ backgroundColor: 'var(--surface-bright)', borderColor: 'var(--border)' }}
            />

            {/* Flyout panel */}
            <div
              className="flex flex-col rounded-[10px] overflow-hidden min-w-[205px]"
              style={{
                backgroundColor: 'var(--surface-bright)',
                border: '1px solid var(--border)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.18)',
                animation: 'sideTooltip 0.17s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              {/* Header */}
              <div
                className="flex items-center gap-2.5 px-3.5 py-3"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                {hoverNode.item.icon && (
                  <span
                    className="w-6 h-6 rounded-[7px] flex items-center justify-center text-primary shrink-0"
                    style={{ background: 'color-mix(in srgb, var(--primary) 10%, transparent)' }}
                  >
                    <hoverNode.item.icon size={13} strokeWidth={2} />
                  </span>
                )}
                <span className="text-[14px] font-heading font-semibold tracking-[-0.025em] text-text leading-none">
                  {hoverNode.item.label}
                </span>
              </div>

              {/* Links */}
              <div className="p-1.5 flex flex-col gap-0.5">
                {hoverNode.item.subItems?.length > 0 ? (
                  hoverNode.item.subItems.map((sub) => {
                    // Support both regular nav IDs and profile path-based matching
                    const isSubActive = activeId === sub.id || location.pathname === sub.path;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => { navigate(sub.path); setHoverNode(null); }}
                        className={`
                          relative w-full flex items-center gap-2.5 px-3.5 py-[8px] rounded-[7px]
                          text-[13px] font-heading tracking-[-0.01em]
                          transition-all duration-150 cursor-pointer outline-none text-left group/flyout
                          ${isSubActive
                            ? 'bg-primary text-text-on-accent font-semibold shadow-sm'
                            : 'font-medium text-text/70 hover:bg-primary/[0.1] hover:text-primary'
                          }
                        `}
                      >
                        <span
                          className={`
                            w-[7px] h-[7px] rounded-full shrink-0 transition-all duration-150
                            ${isSubActive
                              ? 'bg-text-on-accent scale-110'
                              : 'bg-text-muted/25 group-hover/flyout:bg-primary/50 group-hover/flyout:scale-110'
                            }
                          `}
                        />
                        {sub.label}
                        {isSubActive && (
                          <ChevronRight size={11} strokeWidth={2.5} className="ml-auto text-text-on-accent/85 shrink-0" />
                        )}
                      </button>
                    );
                  })
                ) : (
                  <button
                    onClick={() => { navigate(hoverNode.item.path); setHoverNode(null); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[7px] text-[13px] font-heading font-medium text-text/80 hover:bg-primary/[0.1] hover:text-primary transition-all duration-150 cursor-pointer outline-none text-left"
                  >
                    <ChevronRight size={11} strokeWidth={2.5} className="text-primary/60 shrink-0" />
                    Open {hoverNode.item.label}
                  </button>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )
      }

      {/* ══════════════════════════════════════
          STICKY BOTTOM — PROFILE CARD
      ══════════════════════════════════════ */}
      <div
        className="shrink-0 px-3 pt-2 pb-3 border-t flex flex-col gap-1"
        style={{
          borderColor: 'var(--border)',
          backgroundColor: 'var(--surface-2)',
        }}
      >
        {/* ── Profile submenu accordion (expands upward) ── */}
        <div
          style={{
            transition: 'grid-template-rows 280ms cubic-bezier(0.4,0,0.2,1), opacity 220ms ease',
            display: 'grid',
            gridTemplateRows: showSubMenu ? '1fr' : '0fr',
            opacity: showSubMenu ? 1 : 0,
            pointerEvents: showSubMenu ? 'auto' : 'none',
          }}
        >
          <div className="overflow-hidden min-h-0">
            <div
              className="flex flex-col gap-px pb-2 mb-1 border-b"
              style={{ borderColor: 'var(--border)' }}
            >
              {profileSubTabs.map((sub) => {
                const isSubActive = location.pathname === sub.path;
                const SubIcon = sub.icon;
                return (
                  <button
                    key={sub.id}
                    onClick={() => navigate(sub.path)}
                    className={`
                      w-full flex items-center gap-2.5 px-3 py-[7px] rounded-[7px]
                      text-[13px] font-heading font-medium tracking-[-0.01em] min-w-0
                      outline-none cursor-pointer transition-all duration-150 text-left
                      ${isSubActive
                        ? 'bg-primary/[0.08] text-primary'
                        : 'text-text-muted/50 hover:bg-text/[0.04] hover:text-text/80'
                      }
                    `}
                  >
                    <SubIcon
                      size={12}
                      strokeWidth={isSubActive ? 2.2 : 1.75}
                      className={`shrink-0 ${isSubActive ? 'text-primary' : 'text-text-muted/30'}`}
                    />
                    <span className="truncate flex-1">{sub.label}</span>
                    {isSubActive && (
                      <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Profile button ── */}
        <button
          onClick={() => {
            if (collapsed) {
              navigate('/admin/account/overview');
            } else {
              setProfileMenuExpanded((prev) => !prev);
            }
          }}
          onMouseEnter={(e) => {
            if (collapsed) {
              handleHoverStart(profileItem, e.currentTarget.getBoundingClientRect());
            }
          }}
          onMouseLeave={handleHoverEnd}
          className={`
            flex items-center rounded-[8px] transition-all duration-200 cursor-pointer outline-none
            ${collapsed
              ? 'justify-center w-10 h-10 mx-auto'
              : 'p-2 gap-3 w-full hover:bg-text/[0.04]'
            }
            ${isAccountActive || (collapsed && hoverNode?.item.id === 'account')
              ? 'bg-primary/[0.08]'
              : ''
            }
          `}
        >
          {/* Initials avatar */}
          <div
            className={`
              rounded-[7px] flex items-center justify-center
              font-heading font-black text-[10px] tracking-tight shrink-0 transition-all duration-200
              ${isAccountActive
                ? 'bg-primary text-bg'
                : 'bg-primary/[0.12] text-primary border border-primary/20'
              }
            `}
            style={{ width: '1.875rem', height: '1.875rem' }}   /* 30px — between w-7 and w-8 */
          >
            {user?.initials ?? 'U'}
          </div>

          {/* Name + role label (hidden when collapsed) */}
          {!collapsed && (
            <div className="flex-1 flex flex-col items-start gap-0.5 min-w-0 overflow-hidden">
              <span className="text-[12.5px] font-heading font-bold text-text truncate w-full leading-tight">
                {user?.name ?? 'User'}
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.1em] text-text-muted/45 leading-none truncate w-full">
                {user?.role === 'super-admin'
                  ? 'Super Admin'
                  : user?.role === 'operations'
                    ? 'Operations'
                    : 'Auditor'}
              </span>
            </div>
          )}

          {/* Chevron toggle (visible only when expanded) */}
          {!collapsed && (
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              <ChevronDown
                size={13}
                strokeWidth={2.5}
                className={`
                  transition-transform duration-300
                  ${profileMenuExpanded ? 'rotate-180 text-primary' : 'rotate-0 text-text-muted/35'}
                `}
              />
            </div>
          )}
        </button>
      </div>

    </aside>
  );
}