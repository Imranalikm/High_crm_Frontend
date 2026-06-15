import React from 'react';
import { useLocation } from 'react-router-dom';
import { PageShell } from '@/components/layout/PageShell';
import TicketsPage from '@/features/support/pages/TicketsPage';
import EscalatedPage from '@/features/support/pages/EscalatedPage';

const PAGE_MAP = {
  tickets: TicketsPage,
  escalated: EscalatedPage,
};

function SupportPage() {
  const { pathname } = useLocation();

  const slug = pathname
    .split('/')
    .filter(Boolean)
    .pop();

  const activePage = PAGE_MAP[slug] ? slug : 'tickets';
  const ActiveComponent = PAGE_MAP[activePage];

  return (
    <PageShell>
      <div className="animate-in fade-in duration-200">
        <ActiveComponent />
      </div>
    </PageShell>
  );
}

export default SupportPage;