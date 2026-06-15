import React, { useState } from 'react';
import {
  RefreshCw, ChevronRight, Copy, Check, Clock,
  Wifi, WifiOff, Shield, TrendingUp, TrendingDown,
} from 'lucide-react';

/* ─── Status configuration ──────────────────────────────────── */
const STATUS_CONFIG = {
  LIVE:         { label: 'Live',         color: 'var(--positive)', bg: 'bg-positive/10',  border: 'border-positive/25', dot: true  },
  ACTIVE:       { label: 'Live',         color: 'var(--positive)', bg: 'bg-positive/10',  border: 'border-positive/25', dot: true  },
  DISCONNECTED: { label: 'Disconnected', color: 'var(--negative)', bg: 'bg-negative/10',  border: 'border-negative/25', dot: false },
  BLOCKED:      { label: 'Blocked',      color: 'var(--warning)',  bg: 'bg-warning/10',   border: 'border-warning/25',  dot: false },
  SUSPENDED:    { label: 'Suspended',    color: 'var(--warning)',  bg: 'bg-warning/10',   border: 'border-warning/25',  dot: false },
  READONLY:     { label: 'Read Only',    color: 'var(--brand)',    bg: 'bg-brand/10',     border: 'border-brand/25',    dot: false },
};

/* ─── Status Pill ────────────────────────────────────────────── */
function StatusPill({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.DISCONNECTED;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.08em] border ${cfg.bg} ${cfg.border}`}
      style={{ color: cfg.color }}
    >
      {cfg.dot && (
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0"
          style={{ background: cfg.color }}
        />
      )}
      {cfg.label}
    </span>
  );
}

/* ─── Server label simplifier ────────────────────────────────── */
function simplifyServer(server = '') {
  if (server.includes('PRIME')) return server.replace('MT5-PRIME-', 'Prime #').replace(/\s*\(.*\)/, '');
  if (server.includes('STND')) return server.replace('MT5-STND-', 'Standard #').replace(/\s*\(.*\)/, '');
  return server;
}

function serverRegion(server = '') {
  if (server.includes('EU')) return 'EU';
  if (server.includes('US')) return 'US';
  if (server.includes('AP')) return 'APAC';
  return 'GLOBAL';
}

/* ─── Single Account Card ────────────────────────────────────── */
function AccountCard({ account, onViewDetails, onSync }) {
  const [copied, setCopied] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const cfg = STATUS_CONFIG[account.status] ?? STATUS_CONFIG.DISCONNECTED;
  const isLive = account.status === 'LIVE' || account.status === 'ACTIVE';

  const equity  = parseFloat((account.equity  || '$0').replace(/[$,]/g, '')) || 0;
  const balance = parseFloat((account.balance || '$0').replace(/[$,]/g, '')) || 0;
  const delta   = equity - balance;
  const pnlUp   = delta >= 0;

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(account.login);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSync = (e) => {
    e.stopPropagation();
    setSyncing(true);
    setTimeout(() => setSyncing(false), 1200);
    onSync?.(account);
  };

  return (
    <div
      className="relative flex flex-col rounded-[14px] border border-border/25 bg-surface-elevated shadow-card-subtle overflow-hidden transition-all duration-300 hover:border-border/50 hover:shadow-[0_6px_24px_rgba(0,0,0,0.12)] group cursor-pointer"
      onClick={() => onViewDetails?.(account)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onViewDetails?.(account)}
    >
      {/* Top accent stripe — color reflects status */}
      <div
        className="absolute top-0 left-0 h-[3px] w-full rounded-t-[14px] transition-all duration-300"
        style={{ background: cfg.color }}
      />

      {/* Card Body */}
      <div className="flex flex-col gap-4 p-5 pt-6">

        {/* Row 1: Status + Account ID */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1.5 min-w-0">
            <StatusPill status={account.status} />
            {/* Account login number */}
            <div className="flex items-center gap-1.5 mt-1">
              <span className="font-mono font-black text-[18px] leading-none text-brand tracking-[-0.02em]">
                #{account.login}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="p-1 rounded-[6px] text-text-muted/35 hover:text-brand hover:bg-brand/8 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                title="Copy ID"
              >
                {copied ? <Check size={11} /> : <Copy size={11} />}
              </button>
            </div>
          </div>

          {/* Connection indicator */}
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] transition-all duration-300"
            style={{ background: `color-mix(in srgb, ${cfg.color} 12%, transparent)` }}
          >
            {isLive
              ? <Wifi size={16} style={{ color: cfg.color }} />
              : <WifiOff size={16} style={{ color: cfg.color }} />
            }
          </div>
        </div>

        {/* Row 2: Owner + Server */}
        <div className="flex flex-col gap-1">
          <div className="text-[14.5px] font-bold tracking-tight text-text leading-none">
            {account.user}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.05em] px-2 py-0.5 rounded-[4px]"
              style={{
                color: serverRegion(account.server) === 'EU' ? 'var(--brand)' : 'var(--warning)',
                background: serverRegion(account.server) === 'EU'
                  ? 'color-mix(in srgb, var(--brand) 12%, transparent)'
                  : 'color-mix(in srgb, var(--warning) 12%, transparent)',
              }}
            >
              {serverRegion(account.server)}
            </span>
            <span className="text-[12px] text-text-muted/65 font-medium truncate">
              {simplifyServer(account.server)}
            </span>
          </div>
        </div>

        {/* Row 3: Group badge */}
        <div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand/8 text-brand text-[11px] font-semibold rounded-[5px] border border-brand/18 uppercase tracking-wider">
            <span className="w-1 h-1 rounded-full bg-brand/60" />
            {(account.group || 'STANDARD').replace(/_/g, ' ')}
          </span>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-border/15" />

        {/* Row 4: Financial metrics — Equity / Balance */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted/70 select-none">
              Equity
            </span>
            <span className="font-mono font-black text-[15px] leading-none text-text">
              {account.equity}
            </span>
            {delta !== 0 && (
              <div className="flex items-center gap-0.5 mt-0.5">
                {pnlUp
                  ? <TrendingUp size={9} className="text-positive shrink-0" />
                  : <TrendingDown size={9} className="text-negative shrink-0" />
                }
                <span
                  className="font-mono font-black text-[9px] leading-none"
                  style={{ color: pnlUp ? 'var(--positive)' : 'var(--negative)' }}
                >
                  {pnlUp ? '+' : ''}{delta.toFixed(2)}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted/70 select-none">
              Balance
            </span>
            <span className="font-mono font-black text-[15px] leading-none text-text-muted/80">
              {account.balance}
            </span>
          </div>
        </div>

        {/* Row 5: Leverage + Last Sync */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted/70 select-none">
              Leverage
            </span>
            <span className="font-mono font-black text-[12.5px] leading-none text-text">
              {account.leverage}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted/70 select-none">
              Last Sync
            </span>
            <div className="flex items-center gap-1">
              <Clock size={9} className="text-text-muted/35 shrink-0" />
              <span className="text-[11px] text-text-muted/75 font-mono">
                {account.lastSync}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer — action buttons */}
      <div className="flex items-center gap-2 px-5 py-3.5 border-t border-border/12 bg-bg/30 mt-auto">
        <button
          type="button"
          onClick={handleSync}
          className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-border/20 bg-surface-elevated text-text-muted hover:text-brand hover:border-brand/30 hover:bg-brand/5 text-[11.5px] font-semibold uppercase tracking-[0.05em] transition-all cursor-pointer"
          title="Sync account"
        >
          <RefreshCw
            size={11}
            className={syncing ? 'animate-spin' : ''}
            strokeWidth={2.5}
          />
          {syncing ? 'Syncing…' : 'Sync'}
        </button>

        <button
          type="button"
          onClick={() => onViewDetails?.(account)}
          className="flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-brand text-text-on-accent text-[11.5px] font-semibold uppercase tracking-[0.05em] transition-all duration-200 hover:brightness-110 active:scale-[0.97] cursor-pointer ml-auto"
        >
          Details
          <ChevronRight size={11} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

/* ─── Empty state ────────────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-[14px] bg-brand/8 border border-brand/15 flex items-center justify-center mb-4">
        <Shield size={24} className="text-brand/40" />
      </div>
      <p className="text-[14px] font-black text-text/60 tracking-tight">No accounts found.</p>
      <p className="text-[12px] text-text-muted/40 mt-1.5 max-w-[240px] leading-snug">
        Try changing filters or adding an account.
      </p>
    </div>
  );
}

/* ─── Main exported component ────────────────────────────────── */
export function TradingAccountCards({
  accounts = [],
  onViewDetails,
  onSync,
  filterStatus = 'ALL',
}) {
  const visible = filterStatus === 'ALL'
    ? accounts
    : accounts.filter((a) => a.status === filterStatus);

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {visible.length === 0
        ? <EmptyState />
        : visible.map((account) => (
          <AccountCard
            key={account.login}
            account={account}
            onViewDetails={onViewDetails}
            onSync={onSync}
          />
        ))
      }
    </section>
  );
}
