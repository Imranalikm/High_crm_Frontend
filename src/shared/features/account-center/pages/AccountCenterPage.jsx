import React, { useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import { PageShell } from '@/components/layout/PageShell';

// Icons
import { User, Lock, Bell, History, Key, ShieldCheck } from 'lucide-react';

// Subcomponents
import { OverviewSection } from '../components/OverviewSection';
import { ProfileSection } from '../components/ProfileSection';
import { SecuritySection } from '../components/SecuritySection';
import { NotificationsSection } from '../components/NotificationsSection';
import { ActivityLogSection } from '../components/ActivityLogSection';
import { ApiKeysSection } from '../components/ApiKeysSection';

export function AccountCenterPage() {
  const { user } = useAuth();
  const { tab } = useParams();
  const location = useLocation();

  // Determine portal prefix from location (e.g. /admin or /client)
  const isAdminPortal = location.pathname.startsWith('/admin');

  // Define tab items
  const tabItems = useMemo(() => {
    const items = [
      { id: 'overview', label: 'Overview', icon: ShieldCheck },
      { id: 'profile', label: 'Profile Details', icon: User },
      { id: 'security', label: 'Security & 2FA', icon: Lock },
      { id: 'notifications', label: 'Notifications', icon: Bell },
      { id: 'activity', label: 'Activity Log', icon: History },
    ];

    // API Keys only for Traders (Client) and Super Admin
    if (user?.role === 'client' || user?.role === 'super-admin') {
      items.push({ id: 'api-keys', label: 'API Keys', icon: Key });
    }

    return items;
  }, [user]);

  // Set active tab based on param, defaulting to overview (or profile if accessed via settings path)
  const activeTabId = tabItems.some(item => item.id === tab)
    ? tab
    : (location.pathname.endsWith('/settings') ? 'profile' : 'overview');

  const renderActiveSection = () => {
    switch (activeTabId) {
      case 'overview':
        return <OverviewSection user={user} />;
      case 'profile':
        return <ProfileSection user={user} />;
      case 'security':
        return <SecuritySection user={user} />;
      case 'notifications':
        return <NotificationsSection user={user} />;
      case 'activity':
        return <ActivityLogSection user={user} />;
      case 'api-keys':
        return <ApiKeysSection user={user} />;
      default:
        return <OverviewSection user={user} />;
    }
  };

  // Content render wrapped in Portal-specific shell
  const content = (
    <div className="space-y-6">
      {/* Page Header Banner */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: 'rgba(194,198,214,0.4)' }}>
          Personal Account Center
        </p>
        <h1 className="font-heading font-black text-[23px] tracking-[-0.04em] text-text mt-1">
          My Account
        </h1>
        <p className="text-[13.5px] text-text-muted/50 mt-1.5">
          Manage your credentials, active sessions, preferences, and programmatic API access.
        </p>
      </div>

      {/* Active Section Viewport */}
      <div className="w-full min-w-0">
        {renderActiveSection()}
      </div>
    </div>
  );

  if (isAdminPortal) {
    return <PageShell>{content}</PageShell>;
  }

  return <div className="w-full animate-fade-in">{content}</div>;
}

export default AccountCenterPage;
