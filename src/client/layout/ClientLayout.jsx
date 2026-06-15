import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { ClientSidebar } from './ClientSidebar';
import { ClientTopbar } from './ClientTopbar';
import { useAdminUi } from '@/app/providers/AdminUiProvider';
import { UniversalDrawerContainer } from '@/shared/components/overlays';

export function ClientLayout() {
  const { collapsed, isMobile, setCollapsed, theme, toggleTheme } = useAdminUi();

  return (
    <div className="min-h-screen bg-bg text-text transition-colors duration-500 overflow-x-clip">
      <ScrollRestoration />
      {/* Mobile overlay */}
      {isMobile && !collapsed && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] animate-fade-in"
          onClick={() => setCollapsed(true)}
        />
      )}

      <ClientSidebar collapsed={collapsed} isMobile={isMobile} />

      <div
        className="flex flex-col min-h-screen relative"
        style={{
          paddingLeft: isMobile ? '0' : (collapsed ? '68px' : '248px'),
          transition: 'padding-left 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <ClientTopbar
          theme={theme}
          toggleTheme={toggleTheme}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <main className="flex-1 p-4 md:p-8 max-w-[1720px] w-full mx-auto animate-fade-in relative z-10">
          <Outlet />
        </main>
      </div>
      <UniversalDrawerContainer />
    </div>
  );
}
