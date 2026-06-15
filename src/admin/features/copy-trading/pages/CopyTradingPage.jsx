import React from 'react';
import { Copy, UserCheck, Users, CreditCard, BarChart3, Activity } from 'lucide-react';

import { useCopyTradingWorkspace } from '../hooks/useCopyTradingWorkspace';
import { StrategiesPage } from './StrategiesPage';
import { ProvidersPage } from './ProvidersPage';
import { FollowersPage } from './FollowersPage';
import { SubscriptionsPage } from './SubscriptionsPage';
import { PerformancePage } from './PerformancePage';
import { LogsPage } from './LogsPage';

import { PROVIDER_ROWS, SUBSCRIPTION_ROWS, LOG_ROWS } from '@/config/constants/copy-trading/workspaces';

const providersData = PROVIDER_ROWS.map(p => ({
  ...p,
  name: p.provider,
  email: p.email || `${p.provider}@firm.com`,
  joined: p.joined || '2023-06-15',
  kyc: p.kyc || 'APPROVED',
  verified: p.verified ?? true,
  risk: p.risk || 'LOW',
}));

const subsData = SUBSCRIPTION_ROWS.map(s => ({
  ...s,
  alloc: s.allocation || s.alloc,
  fee: s.fee || '20%',
}));

const logsData = LOG_ROWS.map(l => ({
  ...l,
  id: l.eventId || l.id,
  sev: l.severity || l.sev,
  ts: l.timestamp || l.ts,
}));

const PAGE_TITLES = {
  strategies: 'Strategies',
  providers: 'Providers',
  followers: 'Followers',
  subscriptions: 'Subscriptions',
  performance: 'Performance',
  logs: 'Event Logs',
};

export function CopyTradingPage() {
  const { activeTab } = useCopyTradingWorkspace();

  const NAV_ITEMS = [
    { id: 'strategies', label: 'Strategies', Icon: Copy },
    {
      id: 'providers',
      label: 'Providers',
      Icon: UserCheck,
      badge: providersData.filter(p => p.approval === 'PENDING').length,
    },
    { id: 'followers', label: 'Followers', Icon: Users },
    {
      id: 'subscriptions',
      label: 'Subscriptions',
      Icon: CreditCard,
      badge: subsData.filter(s => s.status === 'EXPIRED').length,
      urgent: true,
    },
    { id: 'performance', label: 'Performance', Icon: BarChart3 },
    {
      id: 'logs',
      label: 'Logs',
      Icon: Activity,
      badge: logsData.filter(l => l.sev === 'CRITICAL').length,
      urgent: true,
    },
  ];

  const renderPage = () => {
    switch (activeTab) {
      case 'strategies':
        return <StrategiesPage />;
      case 'providers':
        return <ProvidersPage />;
      case 'followers':
        return <FollowersPage />;
      case 'subscriptions':
        return <SubscriptionsPage />;
      case 'performance':
        return <PerformancePage />;
      case 'logs':
        return <LogsPage />;
      default:
        return <StrategiesPage />;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
     
      <div className="">{renderPage()}</div>
    </div>
  );
}

export const CopyTradingModule = CopyTradingPage;
export default CopyTradingPage;