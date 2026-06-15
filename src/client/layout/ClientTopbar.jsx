import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Moon,
  Sun,
  Bell,
  User,
  LogOut,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useClickOutside } from '@/shared/hooks/useClickOutside';
import { useAuth } from '@/shared/features/auth/AuthContext';

export function ClientTopbar({ collapsed, setCollapsed, theme, toggleTheme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useClickOutside(() => setIsProfileOpen(false));

  const handleSignOut = () => {
    setIsProfileOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  // Simple breadcrumb from path
  const pathParts  = location.pathname.replace('/client/', '').split('/');
  const pageTitle  = pathParts[pathParts.length - 1]
    ?.replace(/-/g, ' ')
    ?.replace(/\b\w/g, (c) => c.toUpperCase()) || 'Dashboard';
  const section    = pathParts[0]?.replace(/-/g, ' ')?.replace(/\b\w/g, (c) => c.toUpperCase()) || 'Client';

  return (
    <header
      className="sticky top-0 z-40 h-14 flex items-center px-4 gap-3 transition-all duration-300"
      style={{
        backgroundColor: 'var(--surface-2)',
        borderBottom:    '1px solid var(--border)',
      }}
    >
      {/* LEFT */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Sidebar toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle Sidebar"
          className={`
            group relative flex items-center justify-center w-7 h-7 rounded-[7px]
            border transition-all duration-200 cursor-pointer outline-none
            ${collapsed
              ? 'border-primary/25 bg-primary/[0.08] text-primary'
              : 'border-border/[0.15] bg-transparent text-text-muted/45 hover:text-text/70 hover:border-border/25 hover:bg-text/[0.03]'
            }
          `}
        >
          <div className={`flex items-center justify-center transition-transform duration-400 ${collapsed ? '-rotate-180' : 'rotate-0'}`}>
            <ChevronLeft size={12} strokeWidth={2.5} />
          </div>
        </button>

        <div className="hidden sm:block w-px h-4 shrink-0 bg-border/40" />

        {/* Breadcrumb */}
        <div className="hidden sm:flex flex-col justify-center gap-0.5 min-w-0">
          <div className="flex items-center gap-1 leading-none">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted/60">
              Client Portal
            </span>
            <ChevronRight size={8} strokeWidth={2.5} className="text-text-muted/30 shrink-0" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted/75">
              {section}
            </span>
          </div>
          <h1 className="font-heading font-semibold text-[15px] leading-none tracking-[-0.03em] text-text truncate max-w-[220px]">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* SPACER */}
      <div className="flex-1" />

      {/* RIGHT */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="relative w-[48px] h-7 rounded-full p-[3px] flex items-center border transition-all duration-200 cursor-pointer shrink-0 hover:border-border/25"
          style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}
        >
          <span className="absolute inset-0 flex items-center justify-between px-[7px] pointer-events-none">
            <Moon size={9} strokeWidth={2.5} className="text-text-muted/20" />
            <Sun  size={9} strokeWidth={2.5} className="text-text-muted/20" />
          </span>
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
              : <Sun  size={10} strokeWidth={2.5} className="text-yellow-500" />
            }
          </span>
        </button>

        {/* Notifications bell */}
        <button
          aria-label="Notifications"
          className="group relative flex items-center justify-center w-8 h-8 rounded-[7px] text-text-muted/75 hover:text-text hover:bg-text/[0.04] border border-transparent hover:border-border/[0.12] transition-all duration-200 cursor-pointer"
        >
          <Bell size={17} strokeWidth={2} className="transition-transform duration-300 group-hover:[transform:rotate(10deg)]" />
        </button>

        <div className="w-px h-4 shrink-0 bg-border/40" />

        {/* Profile dropdown */}
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
              <div className="absolute -bottom-0.5 -right-0.5 w-[7px] h-[7px] rounded-full flex items-center justify-center" style={{ background: 'var(--surface-2)' }}>
                <div className="w-[5px] h-[5px] rounded-full bg-positive" />
              </div>
            </div>

            <div className="hidden lg:flex flex-col items-start gap-0 max-w-[100px]">
              <span className={`text-[11px] font-semibold tracking-[-0.02em] leading-tight truncate transition-colors ${isProfileOpen ? 'text-primary' : 'text-text'}`}>
                {user?.name ?? 'Client'}
              </span>
              <span className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-text-muted/55 leading-none mt-0.5">
                Client Account
              </span>
            </div>

            <ChevronDown
              size={10}
              strokeWidth={2.5}
              className={`hidden lg:block text-text-muted/25 transition-transform duration-300 ml-0.5 ${isProfileOpen ? 'rotate-180 text-primary/60' : 'rotate-0'}`}
            />
          </button>

          {isProfileOpen && (
            <div
              className="absolute top-full right-0 mt-2 w-[200px] rounded-[10px] overflow-hidden z-[100] animate-in fade-in zoom-in-95 slide-in-from-top-1.5 duration-150"
              style={{
                background:  'var(--surface-2)',
                border:      '1px solid var(--border)',
                boxShadow:   '0 16px 40px rgba(0,0,0,0.55)',
              }}
            >
              <div className="px-3.5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-text-muted/55 leading-none mb-1.5 select-none">Client Portal</p>
                <p className="text-[12.5px] font-semibold tracking-[-0.02em] text-text leading-tight truncate">{user?.name}</p>
              </div>

              <div className="p-1.5 flex flex-col gap-px">
                <button
                  onClick={() => { setIsProfileOpen(false); navigate('/client/account/overview'); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[7px] text-text-muted/55 hover:bg-text/[0.04] hover:text-text/80 transition-all duration-150 text-left group/item outline-none cursor-pointer"
                >
                  <User size={13} strokeWidth={1.8} className="shrink-0 group-hover/item:scale-110 transition-transform" />
                  <span className="text-[12.5px] font-medium tracking-[-0.01em] text-text-muted/85 group-hover/item:text-text transition-colors">My Profile</span>
                </button>
              </div>

              <div className="mx-2 bg-border/40" style={{ height: '1px' }} />

              <div className="p-1.5">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[7px] text-negative hover:bg-text/[0.04] hover:text-negative transition-all duration-150 text-left group/item outline-none cursor-pointer"
                >
                  <LogOut size={13} strokeWidth={1.8} className="shrink-0 group-hover/item:translate-x-0.5 transition-transform" />
                  <span className="text-[12.5px] font-bold tracking-[-0.01em] text-negative">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
