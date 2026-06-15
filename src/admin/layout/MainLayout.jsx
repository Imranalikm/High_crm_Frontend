import React, { useEffect, useState } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { useAdminUi } from '@/app/providers/AdminUiProvider';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { CommandPalette } from '@/components/overlays/CommandPalette';
import { UniversalDrawerContainer } from '@/shared/components/overlays';

export function MainLayout() {
  const { collapsed, isMobile, setCollapsed, theme, toggleTheme, effectiveSidebarWidth } = useAdminUi();
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmdOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <div className="min-h-screen bg-bg text-text transition-colors duration-500 overflow-x-clip">
      <ScrollRestoration />
      {isMobile && !collapsed && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] animate-fade-in"
          onClick={() => setCollapsed(true)}
        />
      )}

      <Sidebar collapsed={collapsed} isMobile={isMobile} />

      <div
        className="flex flex-col min-h-screen relative"
        style={{
          paddingLeft: `${effectiveSidebarWidth}px`,
          transition: 'padding-left 0.28s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
        }}
      >
        <Topbar
          theme={theme}
          toggleTheme={toggleTheme}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onOpenCommand={() => setCmdOpen(true)}
        />

        <main className="flex-1 p-4 md:p-8 max-w-[1720px] w-full mx-auto animate-fade-in relative z-10">
          <Outlet />
        </main>
      </div>

      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
      <UniversalDrawerContainer />
    </div>
  );
}
