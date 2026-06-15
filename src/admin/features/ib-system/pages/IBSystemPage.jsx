import React from 'react';
import { useLocation } from 'react-router-dom';
import { PageShell } from '@/components/layout/PageShell';
import { NAV_ITEMS } from '@/config/constants/ib-system/workspaces/shared.workspace';

// Import sub-pages
import IBOverviewPage from './IBOverviewPage';
import ReferralsPage from './ReferralsPage';
import CommissionsPage from './CommissionsPage';
import PayoutsPage from './PayoutsPage';
import IBPerformancePage from './IBPerformancePage';
import { PartnerTreePage } from './PartnerTreePage';

function IBSystemPage() {
  const location = useLocation();
  const slug = location.pathname.split('/').filter(Boolean).pop();
  const item = NAV_ITEMS.find(n => n.id === slug);
  const page = item?.id ?? 'overview';

  const renderScreen = () => {
    switch (page) {
      case 'overview':     return <IBOverviewPage />;
      case 'referrals':    return <ReferralsPage />;
      case 'commissions':  return <CommissionsPage />;
      case 'payouts':      return <PayoutsPage />;
      case 'performance':  return <IBPerformancePage />;
      case 'tree':         return <PartnerTreePage />;
      default:             return <IBOverviewPage />;
    }
  };

  return (
    <PageShell>
      <div className="space-y-5">
        {renderScreen()}
      </div>
    </PageShell>
  );
}

export default IBSystemPage;
