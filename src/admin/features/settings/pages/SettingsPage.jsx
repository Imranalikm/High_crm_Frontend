import React from 'react';
import { Settings, Activity, Key, CreditCard, ShieldCheck, BarChart2, Bell } from 'lucide-react';

import { usePlatformSettingsWorkspace } from '../hooks/usePlatformSettingsWorkspace';
import { PageShell } from '@/components/layout/PageShell';

// Page Components
import { PlatformOverviewPage } from './PlatformOverviewPage';
import { ApiConfigPage } from './ApiConfigPage';
import { PaymentGatewayPage } from './PaymentGatewayPage';
import { KycSettingsPage } from './KycSettingsPage';
import { TradingSettingsPage } from './TradingSettingsPage';
import { NotificationSettingsPage } from './NotificationSettingsPage';
import { SystemSettingsPage } from './SystemSettingsPage';

// Standardized list of main settings category tabs
const MAIN_SECTIONS = [
  { id: 'overview', label: 'Overview', Icon: Activity, badge: 1, badgeColor: 'var(--warning)' },
  { id: 'api', label: 'API Config', Icon: Key },
  { id: 'gateways', label: 'Payment Gateways', Icon: CreditCard },
  { id: 'kyc', label: 'KYC Settings', Icon: ShieldCheck },
  { id: 'trading', label: 'Trading Settings', Icon: BarChart2 },
  { id: 'notifications', label: 'Notifications', Icon: Bell },
  { id: 'system', label: 'System', Icon: Settings },
];

const SECTION_TITLES = {
  overview: 'Platform Overview',
  api: 'API Settings',
  gateways: 'Payment Gateways',
  kyc: 'KYC Settings',
  trading: 'Trading Settings',
  notifications: 'Notification Settings',
  system: 'System Settings',
};

/**
 * SettingsPage — The main entry component for the entire Platform configuration area.
 * Binds state managers, route changes, sub-pages, and tab navigation menus together.
 */
export function SettingsPage() {
  const ws = usePlatformSettingsWorkspace();

  const renderActiveSection = () => {
    switch (ws.section) {
      case 'overview':
        return <PlatformOverviewPage setSection={ws.setSection} />;
      case 'api':
        return (
          <ApiConfigPage
            apiConfig={ws.apiConfig}
            updateApiField={ws.updateApiField}
            isDirty={ws.isDirty}
            saveCurrentSection={ws.saveCurrentSection}
            resetCurrentSection={ws.resetCurrentSection}
          />
        );
      case 'gateways':
        return (
          <PaymentGatewayPage
            gateways={ws.gateways}
            setGateways={ws.setGateways}
            globalFees={ws.globalFees}
            updateGlobalFeesField={ws.updateGlobalFeesField}
            isDirty={ws.isDirty}
            saveCurrentSection={ws.saveCurrentSection}
            resetCurrentSection={ws.resetCurrentSection}
          />
        );
      case 'kyc':
        return (
          <KycSettingsPage
            kycConfig={ws.kycConfig}
            updateKycField={ws.updateKycField}
            updateKycNestedField={ws.updateKycNestedField}
            isDirty={ws.isDirty}
            saveCurrentSection={ws.saveCurrentSection}
            resetCurrentSection={ws.resetCurrentSection}
          />
        );
      case 'trading':
        return (
          <TradingSettingsPage
            tradingConfig={ws.tradingConfig}
            updateTradingField={ws.updateTradingField}
            isDirty={ws.isDirty}
            saveCurrentSection={ws.saveCurrentSection}
            resetCurrentSection={ws.resetCurrentSection}
          />
        );
      case 'notifications':
        return (
          <NotificationSettingsPage
            notificationConfig={ws.notificationConfig}
            updateNotificationField={ws.updateNotificationField}
            updateNotificationNestedField={ws.updateNotificationNestedField}
            isDirty={ws.isDirty}
            saveCurrentSection={ws.saveCurrentSection}
            resetCurrentSection={ws.resetCurrentSection}
          />
        );
      case 'system':
        return (
          <SystemSettingsPage
            systemConfig={ws.systemConfig}
            updateSystemField={ws.updateSystemField}
            isDirty={ws.isDirty}
            saveCurrentSection={ws.saveCurrentSection}
            resetCurrentSection={ws.resetCurrentSection}
          />
        );
      default:
        return <PlatformOverviewPage setSection={ws.setSection} />;
    }
  };

  return (
    <PageShell>


      {/* 2. Responsive Render Container */}
      <div className="w-full animate-in fade-in duration-300">
        {renderActiveSection()}
      </div>
    </PageShell>
  );
}

export default SettingsPage;
