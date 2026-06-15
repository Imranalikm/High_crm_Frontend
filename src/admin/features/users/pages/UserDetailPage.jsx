import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BarChart2,
  User,
  FileCheck,
  Wallet,
  Monitor,
  TrendingUp,
  Activity,
  ShieldAlert,
  Edit2,
  Copy,
  Check,
  Ban,
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
  Globe,
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui';
import { UserDetailContent } from '../components/UserDetailContent';
import { usersService } from '../services/userService';
import { kycService } from '../services/kycService';
import { tradingAccountsService } from '@/features/trading/services/tradingAccountsService';
import { userDetailTabs } from '@/config/constants/USER_TABS';
import { AddUserDrawer } from '../components/AddUserDrawer';
import { buildUserDraft } from '@/utils/userDraftUtils';
import { useDrawerState } from '@/hooks/useDrawerState';
import { Mt5AccountDrawer } from '../components/UserDrawers';

/* ── Tab icon map ── */
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

/* ── Deterministic avatar gradient from name ── */
function getAvatarStyle(name = '?') {
  const seed = name.charCodeAt(0) * 37;
  return {
    background: `linear-gradient(135deg, hsl(${seed % 360},45%,28%), hsl(${(seed + 60) % 360},45%,15%))`,
    color: `hsl(${seed % 360},90%,70%)`,
    boxShadow: `0 0 20px color-mix(in srgb, hsl(${seed % 360},90%,70%) 20%, transparent)`,
    border: `1px solid color-mix(in srgb, hsl(${seed % 360},90%,70%) 25%, transparent)`,
  };
}

const getImageUrl = (path) => {
  if (!path) return null;
  let stringPath = typeof path === 'object' ? (path.url || path.path || path.location || path.filePath || '') : path;
  if (!stringPath) return null;
  if (stringPath.startsWith('http://') || stringPath.startsWith('https://') || stringPath.startsWith('blob:') || stringPath.startsWith('/mock_')) {
    return stringPath;
  }
  let baseUrl = import.meta.env.VITE_API_URL || 'https://account.smatams.com/api';
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
  }
  baseUrl = baseUrl.replace(/\/api$/, '');
  return `${baseUrl}${stringPath.startsWith('/') ? '' : '/'}${stringPath}`;
};

/* ── Inline contact row ── */
// eslint-disable-next-line no-unused-vars
const ContactRow = ({ icon: Icon, label, children }) => (
  <div className="flex items-center gap-3 py-2 border-b border-border/8 last:border-0">
    <div className="flex items-center gap-1.5 w-[88px] shrink-0">
      <Icon size={10} className="text-text-muted/30 shrink-0" />
      <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-text-muted/70 truncate">{label}</span>
    </div>
    <div className="flex-1 min-w-0 flex items-center justify-end">{children}</div>
  </div>
);

/* ── Stat pill used in sidebar quick-stats bar ── */
const QuickStat = ({ label, value, valueClass = 'text-text' }) => (
  <div className="flex-1 flex flex-col items-center py-3 gap-0.5">
    <span className={`font-mono font-semibold text-[14.5px] leading-none ${valueClass}`}>{value}</span>
    <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-text-muted/70 mt-0.5">{label}</span>
  </div>
);

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
══════════════════════════════════════════════════════════════ */
export function UserDetailPage() {
  const { userId, tab } = useParams();
  const navigate = useNavigate();
  const activeTab = tab || 'overview';

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [userDraft, setUserDraft] = useState(null);
  const [copied, setCopied] = useState(false);
  const mt5Drawer = useDrawerState(null);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const fetchUserDetail = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const data = await usersService.getById(userId);
      setUser(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load user details:', err);
      setError(err.message || 'Failed to load user details from the server.');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await usersService.getById(userId);
        if (active) {
          setUser(data);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Failed to load user details.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [userId]);

  const handleSaveMt5Account = async (accountData) => {
    const target = mt5Drawer.value;
    if (!target) return;
    if (accountData.login) {
      usersService.updateMt5AccountForUser(user.id, accountData.login, accountData);
      await fetchUserDetail(false);
      triggerToast(`Successfully updated MT5 Account #${accountData.login}`);
    } else {
      try {
        const payload = {
          userId: user.id,
          groupName: accountData.group,
          leverage: accountData.leverage
        };
        const result = await tradingAccountsService.create(payload);
        await fetchUserDetail(false);
        triggerToast(`Successfully created MT5 Account #${result?.data?.accountid || ''} for ${user.name}`);
      } catch (err) {
        console.error('Failed to create MT5 Account:', err);
        triggerToast(err?.response?.data?.message || err.message || 'Failed to create MT5 Account.');
      }
    }
  };

  const handleSyncMt5Account = (accountData) => triggerToast(`Cluster handshake refreshed for #${accountData.login}`);
  const handleResetMt5Password = (accountData) => triggerToast(`Password reset instruction queued for #${accountData.login}`);

  const handleOpenEdit = () => {
    if (!user) return;
    setUserDraft(buildUserDraft(user));
    setFormOpen(true);
  };

  const handleSaveUser = async () => {
    try {
      const payload = {
        name: userDraft.name,
        email: userDraft.email,
        phone: userDraft.phone,
        country: userDraft.country,
      };
      await usersService.update(userId, payload);
      triggerToast('Profile updated successfully');
      setFormOpen(false);
      await fetchUserDetail(false);
    } catch (err) {
      console.error('Failed to save profile:', err);
      triggerToast(err.message || 'Failed to update profile.');
    }
  };

  const handleToggleSuspension = async () => {
    try {
      const targetSuspended = !user.suspended;
      await usersService.toggleBlock(user.id, targetSuspended);
      triggerToast(`User ${targetSuspended ? 'suspended' : 'unsuspended'} successfully`);
      await fetchUserDetail(false);
    } catch (err) {
      console.error('Failed to toggle suspension state:', err);
      triggerToast(err.message || 'Failed to update suspension status.');
    }
  };

  const handleUpdateUser = async (updatedFields) => {
    try {
      await usersService.update(userId, updatedFields);
      if (updatedFields.kycStatus) {
        kycService.updateStatusByUserId(userId, updatedFields.kycStatus);
      }
      triggerToast('User details updated successfully');
      await fetchUserDetail(false);
    } catch (err) {
      console.error('Failed to update user:', err);
      triggerToast(err.message || 'Failed to update user.');
    }
  };

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center gap-2">
          <span className="relative flex h-5.5 w-5.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-60" />
            <span className="relative inline-flex rounded-full h-5.5 w-5.5 bg-brand/80" />
          </span>
          <span className="text-[12px] font-bold text-text-muted mt-2 uppercase tracking-widest animate-pulse">Loading user profile...</span>
        </div>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center gap-4">
          <ShieldAlert size={36} className="text-negative animate-bounce" />
          <h2 className="text-lg font-black text-text">Failed to Load User Dossier</h2>
          <p className="text-[12px] text-text-muted/65 max-w-md">{error}</p>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => navigate('/admin/users')}>Back to Users</Button>
            <Button variant="primary" onClick={() => fetchUserDetail(true)}>Retry</Button>
          </div>
        </div>
      </PageShell>
    );
  }

  /* ── Not found ── */
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center gap-4">
        <h2 className="text-xl font-black text-text">User Not Found</h2>
        <p className="text-[12px] text-text-muted/55">The user with ID {userId} could not be located.</p>
        <Button variant="primary" onClick={() => navigate('/admin/users')}>Back to Users</Button>
      </div>
    );
  }

  const filteredTabs = userDetailTabs.filter(t => t.id !== 'profile');

  /* ── Derived pnl color ── */
  const isPnLNegative = String(user.pnl30d ?? '').startsWith('-');

  return (
    <PageShell>

      {/* ── Toast ── */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[300] flex items-center gap-3 bg-surface-elevated border border-brand/20 px-4 py-3 rounded-[8px] shadow-[0_8px_32px_rgba(0,0,0,0.45)] animate-fade-in">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-positive opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-positive" />
          </span>
          <span className="text-[11px] font-bold text-text">{toastMessage}</span>
        </div>
      )}

      <div className="space-y-5">

        {/* ── Breadcrumb bar ── */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/admin/users')}
            className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-border/18 bg-bg/30 text-text-muted hover:text-text hover:border-border/35 hover:bg-bg/50 transition-all cursor-pointer shrink-0"
          >
            <ArrowLeft size={13} />
          </button>
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted/70 select-none">
            <span className="hover:text-text-muted/60 cursor-pointer transition-colors" onClick={() => navigate('/admin/users')}>
              User Management
            </span>
            <ChevronRight size={10} className="text-text-muted/20" />
            <span className="text-text-muted/55">User Profile</span>
            <ChevronRight size={10} className="text-text-muted/20" />
            <span className="text-brand font-bold">{user.uid}</span>
          </div>
        </div>

        {/* ── Main 2-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

          {/* ═══════════════════════════════════════
              LEFT SIDEBAR — Sticky Profile Dossier
          ═══════════════════════════════════════ */}
          <div className="lg:col-span-4 lg:sticky lg:top-5 space-y-3">

            {/* ── Profile Identity Card ── */}
            <div className="rounded-[10px] border border-border/15 bg-surface-elevated overflow-hidden">

              {/* Avatar + Name header */}
              <div className="relative px-5 pt-6 pb-0 flex flex-col items-center text-center">

                {/* Subtle top glow strip */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand/30 to-transparent" />

                {/* Suspended warning bar */}
                {user.suspended && (
                  <div className="absolute top-[2px] left-0 right-0 flex items-center justify-center gap-1.5 bg-negative/10 border-b border-negative/15 py-1.5">
                    <Ban size={9} className="text-negative" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-negative">Account Suspended</span>
                  </div>
                )}

                {/* Avatar */}
                <div className={`relative ${user.suspended ? 'mt-6' : 'mt-0'}`}>
                  {user.avatar ? (
                    <img
                      src={getImageUrl(user.avatar)}
                      alt={user.name}
                      className="flex h-[72px] w-[72px] items-center justify-center rounded-full object-cover select-none transition-transform duration-300 hover:scale-105 border-2 border-border/15 shadow-[0_0_20px_rgba(0,0,0,0.15)]"
                    />
                  ) : (
                    <div
                      className="flex h-[72px] w-[72px] items-center justify-center rounded-full text-[26px] font-semibold select-none transition-transform duration-300 hover:scale-105"
                      style={getAvatarStyle(user.name)}
                    >
                      {user.name?.[0] ?? '?'}
                    </div>
                  )}
                  {/* Online / KYC indicator dot */}
                  <span className={`absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-surface-elevated
                    ${user.kycStatus === 'VERIFIED' ? 'bg-positive' : user.kycStatus === 'REJECTED' ? 'bg-negative' : 'bg-warning'}`}
                  />
                </div>

                {/* Name */}
                <h1 className="text-[18px] font-semibold tracking-[-0.02em] text-text mt-3 leading-tight">
                  {user.name}
                </h1>

                {/* UID */}
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[11.5px] font-mono font-semibold uppercase tracking-[0.10em] text-brand">UID {user.uid}</span>
                </div>

                {/* Status badges */}
                <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                  <StatusBadge status={user.kycStatus} />
                  <StatusBadge status={user.riskStatus} dot={false} />
                  {user.withdrawalsBlocked && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-[11px] font-semibold uppercase tracking-[0.05em] border border-negative/25 bg-negative/8 text-negative animate-pulse">
                      <Ban size={8} /> Payout Lock
                    </span>
                  )}
                  {user.readOnlyTerminals && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-[11px] font-semibold uppercase tracking-[0.05em] border border-warning/25 bg-warning/8 text-warning animate-pulse">
                      <Ban size={8} /> Read-Only
                    </span>
                  )}
                  {user.apiBlocked && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-[11px] font-semibold uppercase tracking-[0.05em] border border-negative/25 bg-negative/8 text-negative animate-pulse">
                      <Ban size={8} /> API Blocked
                    </span>
                  )}
                </div>

                {/* Dynamic classification tags */}
                {(user.tags ?? []).length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1.5 mt-2.5 max-w-[260px]">
                    {user.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-[4px] text-[11px] font-semibold uppercase tracking-[0.05em] border select-none cursor-default animate-fade-in"
                        style={{
                          borderColor: t === 'HighRisk' ? 'rgba(239,68,68,0.3)' : t === 'VIPPriority' ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.07)',
                          color: t === 'HighRisk' ? 'var(--negative)' : t === 'VIPPriority' ? 'var(--brand)' : 'var(--text-muted)',
                          background: t === 'HighRisk' ? 'rgba(239,68,68,0.07)' : t === 'VIPPriority' ? 'rgba(99,102,241,0.07)' : 'rgba(255,255,255,0.02)',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Quick-stats strip */}
                <div className="w-full mt-5 flex divide-x divide-border/10 border-t border-border/10">
                  <QuickStat label="MT5 Accounts" value={user.mt5Accounts ?? 0} />
                  <QuickStat
                    label="30d Profit/Loss"
                    value={user.pnl30d || '$0'}
                    valueClass={isPnLNegative ? 'text-negative' : 'text-positive'}
                  />
                  <QuickStat label="Open Positions" value={user.openPositions ?? 0} valueClass="text-brand" />
                </div>
              </div>

              {/* ── Identity metadata ── */}
              <div className="px-5 py-4">
                <ContactRow icon={Mail} label="Email">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-mono text-[12.5px] font-medium text-text-muted/80 truncate">{user.email}</span>
                    <button
                      onClick={() => handleCopyEmail(user.email)}
                      className="shrink-0 flex h-5 w-5 items-center justify-center rounded-[4px] border border-border/18 bg-bg/40 text-text-muted/50 hover:text-text transition-all cursor-pointer"
                    >
                      {copied ? <Check size={9} className="text-positive" /> : <Copy size={9} />}
                    </button>
                  </div>
                </ContactRow>

                <ContactRow icon={Phone} label="Phone">
                  <span className="font-mono text-[12.5px] font-medium text-text-muted/80">{user.phone || '—'}</span>
                </ContactRow>

                <ContactRow icon={Globe} label="Country">
                  <span className="font-mono text-[12.5px] font-medium text-text-muted/80">{user.country || '—'}</span>
                </ContactRow>

                <ContactRow icon={User} label="Tier">
                  <span className="text-[12.5px] font-medium text-text-muted/80">
                    {user.segment} <span className="text-brand font-semibold">· {user.tier}</span>
                  </span>
                </ContactRow>

                <ContactRow icon={ExternalLink} label="Source">
                  <span className="text-[12.5px] font-medium text-text-muted/80">{user.source || 'Direct signup'}</span>
                </ContactRow>

                <ContactRow icon={Calendar} label="Signed Up">
                  <span className="font-mono text-[12.5px] font-medium text-text-muted/80">{user.registered || '—'}</span>
                </ContactRow>

                <ContactRow icon={Clock} label="Last Active">
                  <span className="font-mono text-[12.5px] font-medium text-text-muted/80">{user.lastSeen || '—'}</span>
                </ContactRow>

                {user.address && (
                  <ContactRow icon={MapPin} label="Address">
                    <span className="text-[12.5px] font-medium text-text-muted/80 text-right leading-snug break-words max-w-[180px]">
                      {user.address}
                    </span>
                  </ContactRow>
                )}
              </div>

              {/* ── Action buttons ── */}
              <div className="px-5 pb-5 grid grid-cols-2 gap-2 border-t border-border/8 pt-4">
                <button
                  onClick={handleOpenEdit}
                  className="flex items-center justify-center gap-1.5 h-8.5 rounded-[7px] bg-brand text-text-on-accent border border-brand/20 text-[11px] font-bold uppercase tracking-wider hover:bg-brand-hover transition-all duration-200 transform-gpu hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm shadow-brand/10"
                >
                  <Edit2 size={11} /> Edit Profile
                </button>
                <button
                  onClick={handleToggleSuspension}
                  className={`flex items-center justify-center gap-1.5 h-8.5 rounded-[7px] text-[11px] font-bold uppercase tracking-wider cursor-pointer border transition-all duration-200 transform-gpu hover:scale-[1.02] active:scale-[0.98]
                    ${user.suspended
                      ? 'border-positive/20 bg-positive/5 text-positive hover:bg-positive/10'
                      : 'border-negative/20 bg-negative/5 text-negative hover:bg-negative/10'
                    }`}
                >
                  {user.suspended
                    ? <><ShieldCheck size={11} /> Unsuspend</>
                    : <><Ban size={11} /> Suspend</>
                  }
                </button>
              </div>
            </div>

            {/* ── Equity & Balance mini-panel ── */}
            <div className="rounded-[10px] border border-border/15 bg-surface-elevated overflow-hidden">
              <div className="px-4 py-2.5 border-b border-border/10 bg-bg/20">
                <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted/70">Finances</span>
              </div>
              <div className="divide-y divide-border/8">
                {[
                  { label: 'Balance', value: user.walletBalance, cls: 'text-text font-mono' },
                  { label: 'Equity', value: user.equity, cls: 'text-positive font-mono' },
                  { label: 'Verification', value: user.kycStatus, cls: '' },
                  { label: 'Risk', value: user.riskStatus, cls: '' },
                ].map(({ label, value, cls }) => (
                  <div key={label} className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-text-muted/70">{label}</span>
                    <span className={`text-[12.5px] font-semibold ${cls || 'text-text'}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ═══════════════════════════════════════
              RIGHT COLUMN — Tabs + Content
          ═══════════════════════════════════════ */}
          <div className="lg:col-span-8 space-y-4">

            {/* ── Tab Navigation ── */}
            <div className="rounded-[10px] border border-border/15 bg-surface-elevated overflow-hidden">
              {/* Scrollable tab strip */}
              <div className="flex overflow-x-auto no-scrollbar">
                {filteredTabs.map((t, idx) => {
                  const Icon = tabIcons[t.id] ?? User;
                  const active = t.id === activeTab;

                  return (
                    <button
                      key={t.id}
                      onClick={() => navigate(`/admin/users/${userId}/${t.id}`)}
                      className={`relative group flex items-center gap-2 px-4 h-11 whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.08em] transition-all duration-150 cursor-pointer shrink-0 border-b-2
                        ${active
                          ? 'border-b-brand text-brand bg-brand/[0.04]'
                          : 'border-b-transparent text-text-muted/40 hover:text-text-muted/70 hover:bg-bg/20 hover:border-b-border/20'
                        }
                        ${idx > 0 ? 'border-l border-l-border/8' : ''}`}
                    >
                      <Icon
                        size={12}
                        className={`shrink-0 transition-colors ${active ? 'text-brand' : 'text-text-muted/30 group-hover:text-text-muted/55'}`}
                      />
                      {t.label}
                      {/* Active dot indicator */}
                      {active && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-0.5 rounded-t-full bg-brand" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Content Panel ── */}
            <div className="rounded-[10px] border border-border/15 bg-surface-elevated overflow-hidden animate-in fade-in slide-in-from-bottom-1 duration-250">
              <div className="p-5">
                <UserDetailContent
                  user={user}
                  activeTab={activeTab}
                  onUpdateUser={handleUpdateUser}
                  onCreateMt5Account={() => mt5Drawer.open(user)}
                  onOpenMt5Account={(terminal) => mt5Drawer.open(terminal)}
                />
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ── Drawers ── */}
      <AddUserDrawer
        open={formOpen}
        mode="edit"
        draft={userDraft}
        setDraft={setUserDraft}
        onSubmit={handleSaveUser}
        onClose={() => setFormOpen(false)}
      />
      <Mt5AccountDrawer
        open={mt5Drawer.isOpen}
        entry={mt5Drawer.value}
        onClose={mt5Drawer.close}
        onSave={handleSaveMt5Account}
        onSync={handleSyncMt5Account}
        onResetPassword={handleResetMt5Password}
      />

    </PageShell>
  );
}