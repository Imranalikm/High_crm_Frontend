/**
 * users/pages/MT5AccountReviewPage.jsx
 * Standalone review and administration page for a single MT5 account bridge.
 */
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft, ChevronRight, RefreshCw, KeyRound, Check,
  Sliders, Activity, ShieldAlert, Cpu, Layers, Clock, Copy
} from 'lucide-react';
import { PageShell } from '@/components/layout/PageShell';
import { Card } from '@/components/ui/Card';
import { StatusChip } from '@/components/ui';
import { usersService } from '../services/userService';

/* ─── Premium Glassy Panel Primitive ─────────────────────────── */
function DetailPanel({ children, className = '' }) {
  return (
    <div className={`rounded-[12px] border border-border/12 bg-surface-elevated/45 backdrop-blur-md shadow-card-subtle overflow-hidden transition-all duration-300 hover:border-border/20 ${className}`}>
      {children}
    </div>
  );
}

function PanelHead({ title, subtitle }) {
  return (
    <div className="px-5 py-4 border-b border-border/10 bg-bg/20 flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2.5">
        <span className="block w-[3px] h-3.5 rounded-full bg-brand shrink-0" />
        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted/70 leading-none font-heading">{title}</h4>
          {subtitle && <p className="text-[12px] text-text-muted/80 mt-1 leading-none font-heading">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, mono = false, accent, copyable = false }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-text-muted/70 select-none font-heading">{label}</span>
      <div
        className={`relative group flex h-10 items-center rounded-[10px] border border-border/20 bg-bg/25 px-3 text-[13.5px] text-text ${mono ? 'font-mono' : 'font-heading font-medium'}`}
        style={{ color: accent ?? 'var(--text)' }}
      >
        <span className="truncate">{value || <span className="opacity-25">—</span>}</span>
        {copyable && value && (
          <button
            type="button"
            onClick={() => { navigator.clipboard.writeText(String(value)); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
            className="absolute right-2 flex h-6 w-6 items-center justify-center rounded-[7px] text-text-muted/30 opacity-0 group-hover:opacity-100 hover:text-brand hover:bg-brand/8 transition-all cursor-pointer"
          >
            {copied ? <Check size={10} /> : <Copy size={10} />}
          </button>
        )}
      </div>
    </div>
  );
}

export function MT5AccountReviewPage() {
  const { login } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fromTrading = location.state?.fromTrading;

  // Find dynamic record from service layer
  const originalAccount = useMemo(() => {
    const allAccts = usersService.listMt5Accounts();
    return allAccts.find((item) => item.login === login) || {
      login: login || '000000',
      userId: 'usr-unknown',
      user: 'Unknown User',
      server: 'MT5-LIVE-EU1',
      status: 'DISCONNECTED',
      connection: 'STANDBY',
      group: 'retail_usd_std',
      leverage: '1:100',
      balance: '$0.00',
      equity: '$0.00',
      lastSync: 'N/A'
    };
  }, [login]);

  const [account, setAccount] = useState(originalAccount);
  const [leverage, setLeverage] = useState(originalAccount.leverage || '1:100');
  const [status, setStatus] = useState(originalAccount.status || 'CONNECTED');
  const [toastMsg, setToastMsg] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [localAudit, setLocalAudit] = useState([
    { action: 'Trading account registered', by: 'SystemEngine', ts: originalAccount.lastSync || '2026-05-26 12:00' },
    { action: 'Connection check completed', by: 'BridgeManager', ts: originalAccount.lastSync || '2026-05-26 12:00', note: 'Stable connection' }
  ]);

  const [prevLogin, setPrevLogin] = useState(login);
  if (login !== prevLogin) {
    setPrevLogin(login);
    setAccount(originalAccount);
    setLeverage(originalAccount.leverage || '1:100');
    setStatus(originalAccount.status || 'CONNECTED');
  }

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleSaveSettings = () => {
    const updated = {
      ...account,
      leverage,
      status
    };
    usersService.updateMt5AccountForUser(account.userId, account.login, updated);
    setAccount(updated);
    setLocalAudit(prev => [
      ...prev,
      { action: 'Account status or leverage updated', by: 'sys_admin_01', ts: new Date().toISOString().replace('T', ' ').slice(0, 16), note: `Leverage: ${leverage} | Status: ${status}` }
    ]);
    triggerToast(`Account #${account.login} settings saved`);
  };

  const handleForceSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const syncedTime = new Date().toISOString().replace('T', ' ').slice(0, 16);
      const updated = { ...account, lastSync: syncedTime };
      usersService.updateMt5AccountForUser(account.userId, account.login, updated);
      setAccount(updated);
      setLocalAudit(prev => [
        ...prev,
        { action: 'Manual sync triggered', by: 'sys_admin_01', ts: syncedTime }
      ]);
      triggerToast(`Account #${account.login} synced`);
    }, 1000);
  };

  const handleResetPassword = () => {
    setLocalAudit(prev => [
      ...prev,
      { action: 'Password reset queued', by: 'sys_admin_01', ts: new Date().toISOString().replace('T', ' ').slice(0, 16) }
    ]);
    triggerToast(`Password reset queued for #${account.login}`);
  };

  const balanceVal = account.balance ? parseFloat(String(account.balance).replace(/[$,]/g, '')) : 0;
  const equityVal = account.equity ? parseFloat(String(account.equity).replace(/[$,]/g, '')) : balanceVal;
  const delta = equityVal - balanceVal;

  const isBlocked = status === 'DISCONNECTED' || status === 'BLOCKED' || status === 'SUSPENDED';
  const statusAccent = isBlocked ? 'var(--negative)' : 'var(--positive)';

  return (
    <PageShell>
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-[300] bg-surface-elevated border border-brand/20 text-text text-[11px] font-bold px-4 py-3 rounded-[8px] shadow-[0_4px_24px_rgba(0,0,0,0.4)] animate-fade-in flex items-center gap-2.5">
          <span className="w-2 h-2 bg-positive rounded-full animate-ping" />
          {toastMsg}
        </div>
      )}

      <div className="space-y-5 animate-fade-up">
        {/* ── Breadcrumb Navigation ── */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(fromTrading ? '/admin/trading/accounts' : '/admin/users/mt5')}
            className="group flex h-7 w-7 items-center justify-center rounded-[6px] border border-border/18 bg-bg/30 text-text-muted hover:text-text hover:border-border/35 transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft size={13} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
          </button>
          <span
            className="text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted/70 font-heading cursor-pointer hover:text-text transition-colors"
            onClick={() => navigate(fromTrading ? '/admin/trading/accounts' : '/admin/users/mt5')}
          >
            {fromTrading ? 'Trading Accounts' : 'MT5 Accounts'}
          </span>
          <ChevronRight size={12} className="text-text-muted/30" />
          <span className="text-[11px] font-mono font-semibold text-brand tracking-tight">#{account.login}</span>
        </div>

        {/* ── Connection Banner / Scoreboard Hero ── */}
        <DetailPanel className="relative">
          <div className="absolute top-0 left-0 h-[3px] w-full transition-all duration-300" style={{ background: statusAccent }} />
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 pt-7 bg-surface-bright/5">
            {/* Identity details */}
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-[12px] flex items-center justify-center shrink-0 font-black text-[16px]"
                style={{
                  background: `linear-gradient(135deg, hsl(${(account.login.charCodeAt(account.login.length - 1) * 45) % 360},40%,22%), hsl(${(account.login.charCodeAt(account.login.length - 1) * 45 + 60) % 360},40%,14%))`,
                  color: `hsl(${(account.login.charCodeAt(account.login.length - 1) * 45) % 360},90%,70%)`,
                  border: `1px solid color-mix(in srgb, hsl(${(account.login.charCodeAt(account.login.length - 1) * 45) % 360},90%,70%) 25%, transparent)`,
                }}
              >
                MT5
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-muted/70 mb-1.5 font-heading">MT5 Account Details</p>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-text leading-none font-mono">
                    Account #{account.login}
                  </h2>
                  <StatusChip value={status} />
                  <span className="text-[10px] border border-border/25 rounded-[4px] px-1.5 py-0.5 text-text-muted font-mono bg-surface-elevated/40">
                    {account.server}
                  </span>
                </div>
                <p className="text-[13px] text-text-muted/80 font-medium mt-2 font-heading">
                  Trader: <span className="text-text font-semibold">{account.user}</span> · <span className="font-mono text-text-muted/80">{account.userId}</span>
                </p>
              </div>
            </div>

            {/* Quick stats grid inside header */}
            <div className="grid grid-cols-3 gap-6 bg-bg/25 border border-border/12 px-4 py-3 rounded-[10px] min-w-[280px]">
              <div className="text-center">
                <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-text-muted/70 leading-none">Balance</p>
                <p className="font-mono text-[14px] font-semibold text-text mt-1.5">{account.balance}</p>
              </div>
              <div className="text-center border-l border-border/12 px-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-text-muted/70 leading-none">Equity</p>
                <p className="font-mono text-[14px] font-semibold text-brand mt-1.5">{account.equity || account.balance}</p>
              </div>
              <div className="text-center border-l border-border/12 pl-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-text-muted/70 leading-none">Floating</p>
                <p
                  className="font-mono text-[14px] font-semibold mt-1.5"
                  style={{ color: delta >= 0 ? 'var(--positive)' : 'var(--negative)' }}
                >
                  {delta >= 0 ? '+' : ''}{delta.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </DetailPanel>

        {/* ── Content Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main panels */}
          <div className="lg:col-span-2 space-y-5">
            {/* Account Snapshot */}
            <DetailPanel>
              <PanelHead title="Details" subtitle="Core settings and account metrics." />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5">
                <InfoRow label="Login ID" value={account.login} mono copyable />
                <InfoRow label="Server" value={account.server} mono />
                <InfoRow label="Group" value={account.group || 'retail_usd_std'} mono copyable />
                <InfoRow label="Type" value={account.type || 'Live'} />
                <InfoRow label="Currency" value={account.currency || 'USD'} />
                <InfoRow label="Last Synced" value={account.lastSync} mono />
              </div>
            </DetailPanel>

            {/* Capital & Leverage Metrics */}
            <DetailPanel>
              <PanelHead title="Balance Info" subtitle="Active balance and margin details." />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5">
                <InfoRow label="Balance" value={account.balance} mono accent="var(--cyan)" />
                <InfoRow label="Equity" value={account.equity || account.balance} mono accent="var(--brand)" />
                <InfoRow label="Used Margin" value={account.margin || '$0.00'} mono accent="var(--warning)" />
                <InfoRow label="Free Margin" value={account.freeMargin || account.balance} mono accent="var(--positive)" />
                <InfoRow
                  label="Margin Level"
                  value={account.marginLvl || '—'}
                  mono
                  accent={
                    account.marginLvl && account.marginLvl.includes('%') && parseInt(account.marginLvl) < 150
                      ? 'var(--negative)'
                      : 'var(--text)'
                  }
                />
              </div>
            </DetailPanel>

            {/* Private Audit Timeline */}
            <DetailPanel>
              <PanelHead title="History & Audits" subtitle="History of actions taken on this account." />
              <div className="p-6">
                <div className="relative pl-6 space-y-5">
                  <div className="absolute left-[7px] top-1.5 bottom-1.5 w-px bg-border/20" />
                  {localAudit.map((e, idx) => (
                    <div key={idx} className="relative group">
                      <div className="absolute -left-[23px] top-[3px] w-2.5 h-2.5 rounded-full border border-border/30 bg-surface-bright flex-shrink-0 z-10 transition-transform duration-300 group-hover:scale-125" style={{ boxShadow: '0 0 0 3px var(--bg)' }} />
                      <div className="min-w-0">
                        <p className="text-[12.5px] font-semibold text-text leading-tight font-heading">{e.action}</p>
                        <p className="text-[11px] font-mono text-text-muted/70 mt-1">Admin: {e.by} · {e.ts}</p>
                        {e.note && (
                          <p className="text-[12.5px] text-text-muted/80 mt-1.5 italic leading-relaxed border-l-2 border-border/20 pl-2 font-heading font-normal bg-surface-bright/5 py-1 pr-2 rounded-r-[4px]">{e.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </DetailPanel>
          </div>

          {/* Sidebar controls */}
          <div className="space-y-5">
            {/* Dealing Desk Controls */}
            <DetailPanel>
              <PanelHead title="Settings" subtitle="Manage status and leverage." />
              <div className="p-5 space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-[0.05em] text-text-muted/70 select-none font-heading">Leverage</label>
                  <select
                    value={leverage}
                    onChange={(e) => setLeverage(e.target.value)}
                    className="w-full h-10 rounded-[10px] border border-border/20 bg-bg text-[12.5px] font-semibold text-text px-3 outline-none focus:border-brand/45 transition-all cursor-pointer appearance-none"
                  >
                    {['1:50', '1:100', '1:200', '1:500'].map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-[0.05em] text-text-muted/70 select-none font-heading">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full h-10 rounded-[10px] border border-border/20 bg-bg text-[12.5px] font-semibold text-text px-3 outline-none focus:border-brand/45 transition-all cursor-pointer appearance-none"
                  >
                    {['CONNECTED', 'DISCONNECTED', 'SYNC_DELAY', 'BLOCKED', 'READONLY'].map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="w-full h-9 flex items-center justify-center gap-1.5 rounded-[6px] border border-brand/25 bg-brand text-text-on-accent text-[11px] font-bold uppercase tracking-wider font-heading active:scale-[0.97] hover:brightness-110 cursor-pointer transition-all shadow-sm shadow-brand/10"
                >
                  <Sliders size={12} /> Save Settings
                </button>
              </div>
            </DetailPanel>

            {/* Quick Actions */}
            <DetailPanel>
              <PanelHead title="Actions" subtitle="Quick actions for this account." />
              <div className="p-5 space-y-2.5">
                <button
                  type="button"
                  onClick={handleForceSync}
                  disabled={isSyncing}
                  className="w-full h-9 flex items-center justify-center gap-2 rounded-[6px] border border-brand/20 bg-brand/5 text-brand hover:bg-brand/10 text-[11px] font-bold uppercase tracking-wider font-heading active:scale-[0.97] transition-all cursor-pointer"
                >
                  <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} /> {isSyncing ? 'Syncing...' : 'Sync'}
                </button>
                
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="w-full h-9 flex items-center justify-center gap-2 rounded-[6px] border border-negative/20 bg-negative/5 text-negative hover:bg-negative/10 text-[11px] font-bold uppercase tracking-wider font-heading active:scale-[0.97] transition-all cursor-pointer"
                >
                  <KeyRound size={12} /> Reset Password
                </button>
              </div>
            </DetailPanel>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export default MT5AccountReviewPage;
