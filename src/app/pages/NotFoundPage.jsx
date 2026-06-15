import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageShell } from '@/components/layout/PageShell';

export function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const isClientPortal = location.pathname.startsWith('/client');
  const homeRoute = isClientPortal ? '/client' : '/admin';

  return (
    <PageShell>
      <Card title="Page Not Found" subtitle="The page you requested does not exist.">
        <div className="flex items-center gap-3">
          <Button variant="primary" onClick={() => navigate(homeRoute)}>Go to Dashboard</Button>
          <Button variant="secondary" onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </Card>
    </PageShell>
  );
}

export { NotFoundPage as NotFoundScreen };