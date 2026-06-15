import React, { useState } from 'react';
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Moon,
  Search,
  Sun,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import { useRouteMeta } from '@/app/routes/use-route-meta';
import { useNavigate } from 'react-router-dom';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useAuth } from '@/shared/features/auth/AuthContext';

export function Topbar({ collapsed, setCollapsed, theme, toggleTheme, onOpenCommand }) {
  const routeMeta = useRouteMeta();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useClickOutside(() => setIsProfileOpen(false));

  const handleSignOut = () => {
    setIsProfileOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header
      className="sticky top-0 z-40 h-14 flex items-center px-4 gap-3 transition-all duration-300"
      style={{
        backgroundColor: 'var(--surface-2)',
        borderBottom: '1px solid var(--border)',
      }}
    >

      {/* ══════════════════════════════════════
          LEFT — Toggle + Title
      ══════════════════════════════════════ */}
      <div className="flex items-center gap-3 shrink-0">

        {/* Sidebar collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle Sidebar"
          className={`
            group relative flex items-center justify-center w-7 h-7 rounded-[7px]
            border transition-all duration-200 cursor-pointer outline-none
            ${collapsed
              ? 'border-primary/25 bg-primary/[0.08] text-primary'
              : 'border-border/[0.15] bg-transparent text-text-muted/45 hover:text-text/70 hover:border-border/25 hover:bg-white/[0.03]'
            }
          `}
        >
          <div
            className={`
              flex items-center justify-center transition-transform duration-400
              ease-[cubic-bezier(0.34,1.56,0.64,1)] group-active:scale-90
              ${collapsed ? '-rotate-180' : 'rotate-0'}
            `}
          >
            <ChevronLeft size={12} strokeWidth={2.5} />
          </div>
          {/* Active ring when collapsed */}
          {collapsed && (
            <span className="absolute inset-0 rounded-[7px] ring-1 ring-primary/15 pointer-events-none" />
          )}
        </button>



        {/* Vertical rule */}
        <div
          className="hidden sm:block w-px h-4 shrink-0"
          style={{ background: 'rgba(255,255,255,0.07)' }}
        />

        {/* Page breadcrumb + title */}
        <div className="hidden sm:flex flex-col justify-center gap-0.5 min-w-0">
          <div className="flex items-center gap-1 leading-none">
            <span
              className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted/60 cursor-default hover:text-text/75 transition-colors"
            >
              LiveTrade.PRO
            </span>
            <ChevronRight size={8} strokeWidth={2.5} className="text-text-muted/30 shrink-0" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted/75">
              {routeMeta.section}
            </span>
          </div>
          <h1 className="font-heading font-semibold text-[15px] leading-none tracking-[-0.03em] text-text truncate max-w-[220px]">
            {routeMeta.title}
          </h1>
        </div>
      </div>

      {/* ══════════════════════════════════════
          CENTER — Command Search
      ══════════════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center px-2 min-w-0">
        <button
          onClick={onOpenCommand}
          className="
            group relative flex items-center w-full max-w-[380px] h-8 rounded-[7px]
            border border-border/[0.12] bg-bg/40
            hover:border-border/25 hover:bg-bg/60
            transition-all duration-200 cursor-pointer outline-none overflow-hidden
          "
        >
          {/* Search icon */}
          <span className="pl-2.5 pr-2 flex items-center text-text-muted/30 group-hover:text-text-muted/55 transition-colors duration-200 shrink-0">
            <Search size={12} strokeWidth={2.5} />
          </span>

          {/* Placeholder text */}
          <span className="flex-1 text-left text-[11.5px] font-semibold text-text-muted/45 group-hover:text-text-muted/70 transition-colors duration-200 truncate min-w-0">
            Search users, deals, contacts…
          </span>

          {/* Kbd shortcuts */}
          <span className="pr-2.5 flex items-center gap-1 shrink-0">
            <kbd
              className="inline-flex items-center h-[17px] px-1.5 rounded-[4px] text-[9.5px] font-mono font-bold text-text-muted/60 uppercase tracking-[0.12em] leading-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              Ctrl
            </kbd>
            <kbd
              className="inline-flex items-center h-[17px] px-1.5 rounded-[4px] text-[9.5px] font-mono font-bold text-text-muted/60 uppercase tracking-[0.12em] leading-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              K
            </kbd>
          </span>
        </button>
      </div>

      {/* ══════════════════════════════════════
          RIGHT — Actions + Profile
      ══════════════════════════════════════ */}
      <div className="flex items-center gap-1.5 shrink-0">

        {/* ── Theme toggle pill ── */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="
            relative w-[48px] h-7 rounded-full p-[3px] flex items-center
            border transition-all duration-200 cursor-pointer shrink-0
            hover:border-border/25
          "
          style={{
            background: 'var(--surface-2)',
            borderColor: 'var(--border)',
          }}
        >
          {/* Track: static icons */}
          <span className="absolute inset-0 flex items-center justify-between px-[7px] pointer-events-none">
            <Moon size={9} strokeWidth={2.5} className="text-text-muted/20" />
            <Sun size={9} strokeWidth={2.5} className="text-text-muted/20" />
          </span>
          {/* Thumb */}
          <span
            className={`
              relative z-10 w-[18px] h-[18px] rounded-full flex items-center justify-center
              transition-transform duration-450 ease-[cubic-bezier(0.34,1.56,0.64,1)]
              ${theme === 'dark'
                ? 'translate-x-[20px] bg-surface-elevated border border-primary/20'
                : 'translate-x-0 bg-white border border-border/20 shadow-sm'
              }
            `}
          >
            {theme === 'dark'
              ? <Moon size={10} strokeWidth={2.5} className="text-primary" />
              : <Sun size={10} strokeWidth={2.5} className="text-yellow-500" />
            }
          </span>
        </button>

        {/* ── Notifications ── */}
        <button
          aria-label="Notifications"
          className="
            group relative flex items-center justify-center w-8 h-8 rounded-[7px]
            text-text-muted/75 hover:text-text
            hover:bg-text/[0.04] border border-transparent hover:border-border/[0.12]
            transition-all duration-200 cursor-pointer
          "
        >
          <Bell
            size={17}
            strokeWidth={2}
            className="transition-transform duration-300 group-hover:[transform:rotate(10deg)]"
          />
          {/* Badge */}
          <span
            className="absolute top-[3.5px] right-[3.5px] w-[14px] h-[14px] rounded-full text-[8.5px] font-bold text-white flex items-center justify-center tracking-normal leading-none pt-[0.5px] select-none"
            style={{ background: '#FF3B30', boxShadow: '0 0 0 1.5px var(--surface-2)' }}
          >
            3
          </span>
        </button>

        {/* Vertical rule */}
        <div
          className="w-px h-4 shrink-0 bg-border/40"
        />

        {/* ── Profile dropdown ── */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`
                group flex items-center gap-2 h-8 pl-1 pr-2.5 rounded-[8px]
                border transition-all duration-200 cursor-pointer outline-none
                ${isProfileOpen
                  ? 'border-primary/25 bg-primary/[0.07]'
                  : 'border-transparent hover:bg-text/[0.04] hover:border-border/[0.12]'
                }
              `}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <div
                className={`
                  w-6 h-6 rounded-[6px] flex items-center justify-center
                  text-[9.5px] font-black tracking-tight overflow-hidden
                  transition-all duration-200
                  ${isProfileOpen ? 'bg-primary text-bg' : 'bg-primary/[0.12] text-primary border border-primary/20'}
                `}
              >
                {user?.initials ?? 'U'}
              </div>
              {/* Online dot */}
              <div className="absolute -bottom-0.5 -right-0.5 w-[7px] h-[7px] rounded-full flex items-center justify-center"
                style={{ background: 'var(--surface-2)' }}>
                <div className="w-[5px] h-[5px] rounded-full bg-positive" />
              </div>
            </div>

            {/* Name + role */}
            <div className="hidden lg:flex flex-col items-start gap-0 max-w-[100px]">
              <span
                  className={`
                    text-[11px] font-semibold tracking-[-0.02em] leading-tight truncate transition-colors
                    ${isProfileOpen ? 'text-primary' : 'text-text group-hover:text-text/90'}
                  `}
                >
                  {user?.name ?? 'User'}
              </span>
              <span className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-text-muted/55 leading-none mt-0.5">
               Administrator
              </span>
            </div>

            <ChevronDown
              size={10}
              strokeWidth={2.5}
              className={`
                hidden lg:block text-text-muted/25 transition-transform duration-300 ml-0.5
                ${isProfileOpen ? 'rotate-180 text-primary/60' : 'rotate-0'}
              `}
            />
          </button>

          {/* ── Dropdown menu ── */}
          {isProfileOpen && (
            <div
              className="absolute top-full right-0 mt-2 w-[200px] rounded-[10px] overflow-hidden z-[100] animate-in fade-in zoom-in-95 slide-in-from-top-1.5 duration-150"
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                boxShadow: '0 16px 40px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.3)',
              }}
            >
              {/* Dropdown header */}
              <div
                className="px-3.5 py-3"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-text-muted/55 leading-none mb-1.5 select-none">
                  Administration
                </p>
                <p className="text-[12.5px] font-semibold tracking-[-0.02em] text-text leading-tight truncate">
                  Arjun Sathia
                </p>
              </div>

              {/* Menu items */}
              <div className="p-1.5 flex flex-col gap-px">
                <button
                  onClick={() => { setIsProfileOpen(false); navigate('/admin/account/overview'); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[7px] text-text-muted/55 hover:bg-text/[0.04] hover:text-text/80 transition-all duration-150 text-left group/item outline-none cursor-pointer"
                >
                  <User size={13} strokeWidth={1.8} className="shrink-0 group-hover/item:scale-110 transition-transform" />
                  <span className="text-[12.5px] font-medium tracking-[-0.01em] text-text-muted/85 group-hover/item:text-text transition-colors">Account Profile</span>
                </button>
                <button
                  onClick={() => { setIsProfileOpen(false); navigate('/admin/settings/system'); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[7px] text-text-muted/55 hover:bg-text/[0.04] hover:text-text/80 transition-all duration-150 text-left group/item outline-none cursor-pointer"
                >
                  <Settings size={13} strokeWidth={1.8} className="shrink-0 group-hover/item:scale-110 transition-transform" />
                  <span className="text-[12.5px] font-medium tracking-[-0.01em] text-text-muted/85 group-hover/item:text-text transition-colors">System Settings</span>
                </button>
              </div>

              {/* Divider */}
              <div
                className="mx-2 bg-border/40"
                style={{ height: '1px' }}
              />

              {/* Sign out */}
              <div className="p-1.5">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[7px] text-negative hover:bg-negative/[0.08] transition-all duration-150 text-left group/item outline-none cursor-pointer"
                >
                  <LogOut size={13} strokeWidth={1.8} className="shrink-0 group-hover/item:translate-x-0.5 transition-transform" />
                  <span className="text-[12.5px] font-bold tracking-[-0.01em] text-negative group-hover/item:brightness-110">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}