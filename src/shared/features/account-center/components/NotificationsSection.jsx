import React, { useState } from 'react';
import { Mail, HardDrive, BarChart3, Save } from 'lucide-react';
import { SettingsCard } from '@/features/settings/components/SettingsCard';
import { ToggleRow, Btn } from '@/features/settings/components/SettingsForm';

export function NotificationsSection() {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // States
  const [emailLogin, setEmailLogin] = useState(true);
  const [emailSecurity, setEmailSecurity] = useState(true);
  const [emailTickets, setEmailTickets] = useState(true);

  const [platformMaint, setPlatformMaint] = useState(true);
  const [platformAnnounce, setPlatformAnnounce] = useState(false);
  const [platformReport, setPlatformReport] = useState(true);

  const [tradeExecution, setTradeExecution] = useState(true);
  const [tradeMargin, setTradeMargin] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 animate-fade-in">
      
      {/* 1. Security & Email Notifications */}
      <SettingsCard
        title="Email Alerts & Security"
        desc="Setup email notification parameters whenever security status triggers occur."
        Icon={Mail}
      >
        <div className="space-y-1">
          <ToggleRow
            label="Account Login Warnings"
            desc="Send an email update whenever your credentials are used to sign in from a new IP or device."
            val={emailLogin}
            onChange={setEmailLogin}
          />
          <ToggleRow
            label="Critical Security Alerts"
            desc="Receive instant notifications about changes to your password, multi-factor status, or active API keys."
            val={emailSecurity}
            onChange={setEmailSecurity}
          />
          <ToggleRow
            label="Support Desk Activity"
            desc="Email alerts when administrators or support operators reply to your open help desk tickets."
            val={emailTickets}
            onChange={setEmailTickets}
          />
        </div>
      </SettingsCard>

      {/* 2. Platform Maintenance & Announcements */}
      <SettingsCard
        title="Platform System Toggles"
        desc="Recieve releases regarding platform updates and maintenance schedules."
        Icon={HardDrive}
      >
        <div className="space-y-1">
          <ToggleRow
            label="Scheduled Maintenance Announcements"
            desc="Receive warnings at least 24 hours prior to scheduled server infrastructure downtime or API maintenance cycles."
            val={platformMaint}
            onChange={setPlatformMaint}
          />
          <ToggleRow
            label="Marketing Promotional Bulletins"
            desc="Receive periodic releases regarding trading tier updates, commission reductions, and loyalty initiatives."
            val={platformAnnounce}
            onChange={setPlatformAnnounce}
          />
          <ToggleRow
            label="Periodic Platform Summary Reports"
            desc="Weekly metrics summarizing platform changes, system status indicators, and trading activity indexes."
            val={platformReport}
            onChange={setPlatformReport}
          />
        </div>
      </SettingsCard>

      {/* 3. Trading & Execution alerts */}
      <SettingsCard
        title="Trading & Order Signals"
        desc="Trigger desktop notifications for order executions and margin warnings."
        Icon={BarChart3}
      >
        <div className="space-y-1">
          <ToggleRow
            label="Order Executions Alerts"
            desc="Receive desktop notifications when copy trading orders or MT5 positions are filled, modified, or closed."
            val={tradeExecution}
            onChange={setTradeExecution}
          />
          <ToggleRow
            label="Margin Threshold Reminders"
            desc="Trigger alerts if equity levels fall below 120% margin requirements on active trading nodes."
            val={tradeMargin}
            onChange={setTradeMargin}
          />
        </div>
      </SettingsCard>

      {/* Button & feedback */}
      <div className="flex items-center gap-4 pt-2">
        <Btn
          type="submit"
          Icon={Save}
          label={loading ? 'Saving Preferences...' : 'Save Notification Preferences'}
          variant="brand"
          loading={loading}
        />
        {saved && (
          <span className="text-[12.5px] font-semibold text-positive animate-fade-in">
            ✓ Notification configurations updated successfully
          </span>
        )}
      </div>

    </form>
  );
}
