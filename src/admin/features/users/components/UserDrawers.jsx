import React, { useState, useEffect } from 'react';
import {
  Activity,
  BarChart2,
  Edit2,
  FileCheck,
  Monitor,
  ShieldAlert,
  TrendingUp,
  User,
  Wallet,
  KeyRound,
  RefreshCw,
  Check,
  History,
} from 'lucide-react';
import { MainDrawer, DrawerHeader, DrawerBody, DrawerFooter } from '@/components/common/drawer';
import { DrawerField, DrawerFormGrid as DrawerFormGrid, DrawerSection, SelectField, TextField } from '@/components/common/drawer';
import { ActionBtn } from '@/components/ui';
import { InlineAlert } from '@/components/feedback/InlineAlert';
import { StatusBadge } from '@/components/ui';
import { StatusChip } from '@/components/ui';
import { userDetailTabs } from '@/config/constants/USER_TABS';
import { UserDetailContent } from './UserDetailContent';
import { groupService } from '@/features/group-management/services/groupService';

const tabIcons = {
  overview: BarChart2,
  profile: User,
  kyc: FileCheck,
  wallet: Wallet,
  'mt5-accounts': Monitor,
  'trading-history': TrendingUp,
  'activity-logs': Activity,
  'risk-view': ShieldAlert,
  notes: Edit2,
};

function getAvatarStyle(name = '?') {
  const seed = name.charCodeAt(0) * 37;
  return {
    background: `hsl(${seed % 360},35%,22%)`,
    color: `hsl(${seed % 360},80%,65%)`,
    border: `1px solid hsl(${seed % 360},40%,30%)`,
  };
}

export function UserDetailDrawer({
  open,
  user,
  activeTab,
  onChangeTab,
  onClose,
  onEditUser,
}) {
  return (
    <MainDrawer
      open={open}
      width="max-w-[760px]"
      onClose={onClose}
    >
      <DrawerHeader title={user?.name ?? 'User Detail'} subtitle={user ? `UID ${user.uid} | ${user.segment} | ${user.tier}` : ''} eyebrow="User Details" onClose={onClose} />
      <DrawerBody>
        {user && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 rounded-[10px] border border-border/25 bg-bg/55 p-4 shadow-card-subtle">
              <div className="flex h-11 w-11 items-center justify-center rounded-full text-[15px] font-semibold" style={getAvatarStyle(user.name)}>
                {user.name?.[0] ?? '?'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-semibold text-text">{user.name}</div>
                <div className="truncate text-[12px] text-text-muted">{user.email}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={user.kycStatus} />
                <StatusBadge status={user.riskStatus} dot={false} />
              </div>
            </div>

            <div className="flex gap-1 border-b border-white/[0.06] overflow-x-auto no-scrollbar pb-px mb-2">
              {userDetailTabs.map((tab) => {
                const Icon = tabIcons[tab.id] ?? User;
                const active = tab.id === activeTab;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onChangeTab(tab.id)}
                    className={`group relative flex h-11 items-center gap-2.5 border-b-2 px-4 transition-all duration-200 cursor-pointer whitespace-nowrap
                    ${active
                        ? 'border-brand text-brand font-bold'
                        : 'border-transparent text-text-muted/40 hover:text-text-muted hover:border-white/10'
                      }`}
                  >
                    <Icon size={14} className={active ? 'text-brand' : 'text-text-muted/30 group-hover:text-text-muted/50'} />
                    <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted/70 font-heading">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <UserDetailContent user={user} activeTab={activeTab} />
          </div>
        )}
      </DrawerBody>
      <DrawerFooter>
        <div className="flex items-center justify-between gap-2">
          <div className="text-[11px] text-text-muted">Changes are only saved to the user profile.</div>
          <div className="flex items-center gap-2">
            <ActionBtn label="Close" variant="default" onClick={onClose} />
            {user && (
              <ActionBtn label="Edit User" variant="brand" onClick={() => onEditUser(user)} />
            )}
          </div>
        </div>
      </DrawerFooter>
    </MainDrawer>
  );
}

export function QuickUserDrawer({ open, user, onClose, onExpand }) {
  return (
    <MainDrawer
      open={open}
      width="max-w-[720px]"
      onClose={onClose}
    >
      <DrawerHeader title={user?.name ?? 'Quick View'} subtitle={user ? `UID ${user.uid} | ${user.segment}` : ''} eyebrow="Quick View" onClose={onClose} />
      <DrawerBody>
        {user && (
          <div className="space-y-5">
            <InlineAlert tone="info" title="Notes Summary">
              {user.notesSummary}
            </InlineAlert>
            <DrawerSection title="Summary">
              <DrawerFormGrid>
                {[
                  ['Email', user.email],
                  ['Phone', user.phone],
                  ['Country', user.country],
                  ['Funding', user.fundingState],
                  ['Wallet', user.walletBalance],
                  ['Equity', user.equity],
                ].map(([label, value]) => (
                  <DrawerField key={label} label={label} value={value} />
                ))}
              </DrawerFormGrid>
            </DrawerSection>
          </div>
        )}
      </DrawerBody>
      <DrawerFooter>
        <div className="flex justify-end gap-2">
          <ActionBtn label="Close" variant="default" onClick={onClose} />
          {user && (
            <ActionBtn label="Open User" variant="brand" onClick={() => onExpand(user.id)} />
          )}
        </div>
      </DrawerFooter>
    </MainDrawer>
  );
}

export function Mt5AccountDrawer({ open, entry, onClose, onSave, onSync, onResetPassword }) {
  const [leverage, setLeverage] = useState('');
  const [status, setStatus] = useState('');
  const [server, setServer] = useState('MT5-LIVE-EU1');
  const [group, setGroup] = useState('');
  const [deposit, setDeposit] = useState('1000');
  const [customLogin, setCustomLogin] = useState('');
  const [showStatusSuccess, setShowStatusSuccess] = useState(false);
  const [prevEntry, setPrevEntry] = useState(null);
  const [crmGroups, setCrmGroups] = useState([]);

  useEffect(() => {
    if (open) {
      groupService.list().then(data => setCrmGroups(data || []));
    }
  }, [open]);

  if (entry !== prevEntry) {
    setPrevEntry(entry);
    if (entry) {
      setLeverage(entry.leverage || '1:100');
      setStatus(entry.status || 'CONNECTED');
      setServer('MT5-LIVE-EU1');
      
      const activeGroups = crmGroups;
      const defaultGroupName = activeGroups.length > 0 ? activeGroups[0].name : 'Standard';
      setGroup(entry.group || defaultGroupName);
      
      setDeposit('1000');
      setCustomLogin('');
      setShowStatusSuccess(false);
    }
  }

  const isExistingAccount = Boolean(entry?.login);
  const isBlocked = status === 'DISCONNECTED' || status === 'BLOCKED' || status === 'SUSPENDED';
  const statusAccent = isBlocked ? 'var(--negative)' : 'var(--positive)';
  const balanceVal = entry?.balance ? parseFloat(String(entry.balance).replace(/[$,]/g, '')) : 0;
  const equityVal = entry?.equity ? parseFloat(String(entry.equity).replace(/[$,]/g, '')) : balanceVal;
  const delta = equityVal - balanceVal;

  const handleSave = () => {
    if (isExistingAccount) {
      onSave?.({ ...entry, leverage, status });
    } else {
      onSave?.({
        server,
        leverage,
        group,
        deposit,
        login: customLogin || undefined
      });
    }
    setShowStatusSuccess(true);
    setTimeout(() => {
      setShowStatusSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <MainDrawer
      open={open}
      width="max-w-[720px]"
      onClose={onClose}
    >
      <DrawerHeader title={entry ? (isExistingAccount ? `Account #${entry.login}` : `New Account`) : 'MT5 Account'} subtitle={isExistingAccount ? "View balance, details, and settings." : "Set up settings for the new MT5 account."} eyebrow={isExistingAccount ? "MT5 Account" : "Configure Account"} onClose={onClose} />
      <DrawerBody>
        <div className="space-y-6">
          {isExistingAccount ? (
            <>
              {/* Connection Status Card */}
              <div
                className="rounded-[12px] border overflow-hidden p-4"
                style={{ borderColor: `color-mix(in srgb, ${statusAccent} 22%, var(--border))`, background: `color-mix(in srgb, ${statusAccent} 4%, transparent)` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-[15px] font-semibold text-text">{entry.user ?? 'MT5 User'}</div>
                    <div className="text-[11px] font-mono text-text-muted/70 mt-0.5">UID: {entry.uid || 'U-499201'}</div>
                  </div>
                  <StatusChip value={status} size="lg" />
                </div>

                {/* Equity / Balance Scoreboard */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border/10">
                  <div className="text-center flex flex-col items-center gap-1.5">
                    <div className="text-[11px] font-bold uppercase tracking-[0.05em] text-text-muted/70 leading-none">Balance</div>
                    <div className="font-mono text-[13.5px] font-semibold text-text leading-none">{entry.balance ?? '$0.00'}</div>
                  </div>
                  <div className="text-center flex flex-col items-center gap-1.5">
                    <div className="text-[11px] font-bold uppercase tracking-[0.05em] text-text-muted/70 leading-none">Equity</div>
                    <div className="font-mono text-[13.5px] font-semibold text-brand leading-none">{entry.equity ?? entry.balance ?? '$0.00'}</div>
                  </div>
                  <div className="text-center flex flex-col items-center gap-1.5">
                    <div className="text-[11px] font-bold uppercase tracking-[0.05em] text-text-muted/70 leading-none">Float</div>
                    <div
                      className="font-mono text-[13.5px] font-semibold leading-none"
                      style={{ color: delta >= 0 ? 'var(--positive)' : 'var(--negative)' }}
                    >
                      {delta >= 0 ? '+' : ''}{delta.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-text-muted/55 flex items-center gap-1.5 mt-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse" />
                  Connected · Stable
                </div>
              </div>

              {showStatusSuccess && (
                <InlineAlert tone="success" title="Synced">
                  Leverage updated and status synced.
                </InlineAlert>
              )}

              {/* Account Snapshot */}
              <DrawerSection title="Details">
                <DrawerFormGrid>
                  <DrawerField label="Login" value={entry.login} mono copyable />
                  <DrawerField label="Server" value={entry.server} mono />
                  <DrawerField label="Group" value={entry.group || 'retail_usd_std'} mono copyable />
                  <DrawerField label="Type" value={entry.type || 'Live'} />
                  <DrawerField label="Currency" value={entry.currency || 'USD'} />
                  <DrawerField label="Last Synced" value={entry.lastSync} mono />
                </DrawerFormGrid>
              </DrawerSection>

              {/* Capital Metrics */}
              <DrawerSection title="Balance Info">
                <DrawerFormGrid>
                  <DrawerField label="Balance" value={entry.balance} mono accent="var(--cyan)" />
                  <DrawerField label="Equity" value={entry.equity ?? entry.balance} mono accent="var(--brand)" />
                  <DrawerField label="Used Margin" value={entry.margin || '$0'} mono accent="var(--warning)" />
                  <DrawerField label="Free Margin" value={entry.freeMargin || entry.balance} mono accent="var(--positive)" />
                  <DrawerField
                    label="Margin Level"
                    value={entry.marginLvl || '—'}
                    mono
                    accent={
                      entry.marginLvl && entry.marginLvl.includes('%') && parseInt(entry.marginLvl) < 150
                        ? 'var(--negative)'
                        : 'var(--text)'
                    }
                  />
                </DrawerFormGrid>
              </DrawerSection>

              {/* Dealing Desk Controls */}
              <DrawerSection title="Settings">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectField
                    label="Leverage"
                    value={leverage}
                    onChange={setLeverage}
                    options={['1:50', '1:100', '1:200', '1:500']}
                  />
                  <SelectField
                    label="Status"
                    value={status}
                    onChange={setStatus}
                    options={['CONNECTED', 'DISCONNECTED', 'SYNC_DELAY', 'BLOCKED', 'READONLY']}
                  />
                </div>
              </DrawerSection>

              {/* Quick Actions */}
              <DrawerSection title="Actions" collapsible>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      onSync?.(entry);
                      setShowStatusSuccess(true);
                      setTimeout(() => setShowStatusSuccess(false), 1500);
                    }}
                    className="flex items-center justify-center gap-1.5 h-9 rounded-[8px] border border-brand/20 bg-brand/5 text-brand text-[11px] font-bold transition-all duration-300 ease-out transform-gpu will-change-transform hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
                  >
                    <RefreshCw size={12} className="animate-spin-slow" /> Sync
                  </button>
                  <button
                    type="button"
                    onClick={() => onResetPassword?.(entry)}
                    className="flex items-center justify-center gap-1.5 h-9 rounded-[8px] border border-negative/20 bg-negative/5 text-negative text-[11px] font-bold transition-all duration-300 ease-out transform-gpu will-change-transform hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
                  >
                    <KeyRound size={12} /> Reset Password
                  </button>
                  <button
                    type="button"
                    disabled
                    className="flex items-center justify-center gap-1.5 h-9 rounded-[8px] border border-border/15 bg-surface-elevated text-text-muted/40 text-[11px] font-bold cursor-not-allowed opacity-50"
                    title="Coming soon"
                  >
                    <History size={12} /> Trade History
                  </button>
                </div>
              </DrawerSection>
            </>
          ) : (
            <div className="space-y-5 animate-fade-up">
              <InlineAlert tone="info" title="New MT5 Account">
                Set up MT5 account for {entry?.name} (UID: {entry?.uid}).
              </InlineAlert>

              {showStatusSuccess && (
                <InlineAlert tone="success" title="Account Prepared">
                  Setting up account and server gateway...
                </InlineAlert>
              )}

              <DrawerSection title="Parameters">
                <DrawerFormGrid cols={2}>
                  <SelectField
                    label="Server"
                    value={server}
                    onChange={setServer}
                    options={['MT5-LIVE-EU1', 'MT5-LIVE-EU2', 'MT5-LIVE-APAC', 'MT5-DEMO']}
                  />
                  <SelectField
                    label="Leverage"
                    value={leverage}
                    onChange={setLeverage}
                    options={['1:10', '1:30', '1:50', '1:100', '1:200', '1:500']}
                  />
                  <SelectField
                    label="Group"
                    value={group}
                    onChange={setGroup}
                    options={crmGroups.map(g => g.name)}
                  />
                  <TextField
                    label="Initial Deposit ($)"
                    value={deposit}
                    onChange={setDeposit}
                    placeholder="1000"
                    type="number"
                  />
                </DrawerFormGrid>
              </DrawerSection>

              <DrawerSection title="Advanced Settings" collapsible>
                <div className="space-y-2.5">
                  <TextField
                    label="Login ID"
                    value={customLogin}
                    onChange={setCustomLogin}
                    placeholder="Leave empty to auto-generate"
                    mono
                  />
                  <p className="text-[12px] text-text-muted/80 leading-relaxed">
                    If left blank, an 8-digit account number starting with 881 will be generated.
                  </p>
                </div>
              </DrawerSection>
            </div>
          )}
        </div>
      </DrawerBody>
      <DrawerFooter>
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="text-[10px] text-text-muted/55 max-w-[280px] leading-snug">
            {isExistingAccount ? "Leverage changes are sent directly to the server." : "Setting leverage directly on the server."}
          </div>
          <div className="flex items-center gap-2">
            <ActionBtn label="Close" variant="default" onClick={onClose} />
            <ActionBtn
              label={showStatusSuccess ? (isExistingAccount ? "Pushed to MT5" : "Preparing...") : (isExistingAccount ? 'Keep Monitoring' : 'Save Setup')}
              Icon={showStatusSuccess ? Check : undefined}
              variant="brand"
              disabled={showStatusSuccess}
              onClick={handleSave}
            />
          </div>
        </div>
      </DrawerFooter>
    </MainDrawer>
  );
}
