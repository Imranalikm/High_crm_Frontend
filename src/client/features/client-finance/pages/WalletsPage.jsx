/**
 * WalletsPage.jsx — Live-Trader Customer Wallet Overview
 *
 * Design system: dark premium fintech (Syne + DM Sans + DM Mono)
 * Requires: react-router-dom, lucide-react
 * CSS vars expected from global theme (see design-tokens below)
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowDownToLine, ArrowUpFromLine, CreditCard, BarChart3,
  TrendingUp, Lock, ShieldCheck, ChevronRight,
  ArrowDownLeft, ArrowUpRight, Clock,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { financeApi } from '../services/finance.api';
import { METHOD_LABELS } from '@/shared/config/constants/finance';
import { AddWithdrawalDrawer } from '../components/AddWithdrawalDrawer';

/* ─────────────────────────────────────────────────────────
   Mock data — replace with API / store values
───────────────────────────────────────────────────────── */
const WALLET_DATA = {
  totalBalance: 84200.00,
  availableBalance: 72500.00,
  lockedBalance: 11700.00,
  todayChange: 405.00,
  todayChangePct: 1.68,
  totalDeposits: 142800.00,
  totalWithdrawals: 58600.00,
  pendingAmount: 11700.00,
  pendingCount: 2,
};

const TRANSACTIONS = [
  { type: 'DEPOSIT', amount: 5000, method: 'Bank Wire', date: 'Jun 03', status: 'COMPLETED', ref: 'DEP-00483' },
  { type: 'WITHDRAWAL', amount: -1200, method: 'Crypto (USDT)', date: 'May 28', status: 'COMPLETED', ref: 'WD-00412' },
  { type: 'DEPOSIT', amount: 2000, method: 'Credit Card', date: 'May 25', status: 'COMPLETED', ref: 'DEP-00401' },
  { type: 'WITHDRAWAL', amount: -500, method: 'Bank Transfer', date: 'May 22', status: 'PENDING', ref: 'WD-00398' },
  { type: 'DEPOSIT', amount: 3000, method: 'Crypto (BTC)', date: 'May 18', status: 'COMPLETED', ref: 'DEP-00387' },
  { type: 'DEPOSIT', amount: 8200, method: 'Bank Wire', date: 'May 10', status: 'COMPLETED', ref: 'DEP-00371' },
  { type: 'WITHDRAWAL', amount: -2100, method: 'Bank Transfer', date: 'May 05', status: 'COMPLETED', ref: 'WD-00355' },
];

const QUICK_ACTIONS = [
  { id: 'deposit', label: 'Deposit', desc: 'Add funds instantly', path: '/client/finance/deposit', color: 'brand', Icon: ArrowDownToLine },
  { id: 'withdraw', label: 'Withdraw', desc: 'Withdraw to account', path: '/client/finance/withdraw', color: 'cyan', Icon: ArrowUpFromLine },
  { id: 'payment-methods', label: 'Payment Methods', desc: 'Manage saved methods', path: '/client/finance/payment-methods', color: 'purple', Icon: CreditCard },
  { id: 'limits', label: 'Limits & Fees', desc: 'View fee structure', path: '/client/finance/limits', color: 'warning', Icon: BarChart3 },
];

/* ─────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);

const FILTERS = ['All', 'Deposits', 'Withdrawals', 'Completed', 'Pending'];

const matchFilter = (tx, f) => {
  if (f === 'All') return true;
  if (f === 'Deposits') return tx.type === 'DEPOSIT';
  if (f === 'Withdrawals') return tx.type === 'WITHDRAWAL';
  if (f === 'Completed') return tx.status === 'COMPLETED';
  if (f === 'Pending') return tx.status === 'PENDING';
  return true;
};

/* ─────────────────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────────────────── */

/** Tiny inline sparkline (pure SVG, no deps) */
function Sparkline() {
  return (
    <svg viewBox="0 0 120 52" width={120} height={52} aria-hidden="true"
      style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="wlt-sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--brand)" stopOpacity=".22" />
          <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0,48 L0,36 C15,32 22,40 30,30 C38,20 44,24 54,18 C64,12 72,22 84,14 C96,6 106,10 120,4 L120,48 Z"
        fill="url(#wlt-sg)"
      />
      <path
        d="M0,36 C15,32 22,40 30,30 C38,20 44,24 54,18 C64,12 72,22 84,14 C96,6 106,10 120,4"
        fill="none"
        stroke="var(--brand)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Verification / notice banner */
function VerifiedNotice() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '11px 16px',
      background: 'color-mix(in srgb, var(--brand) 8%, transparent)',
      border: '1px solid color-mix(in srgb, var(--brand) 18%, transparent)',
      borderRadius: 12,
      fontSize: 12.5,
      color: 'var(--text)',
      marginBottom: 18,
    }}>
      <ShieldCheck size={18} color="var(--brand)" strokeWidth={2} style={{ flexShrink: 0 }} />
      <span>
        Your identity is <strong style={{ fontWeight: 700 }}>verified</strong>.
        You have full deposit &amp; withdrawal access up to your daily limits.
      </span>
    </div>
  );
}

/** Hero balance card */
function HeroCard({ data }) {
  const isUp = data.todayChange >= 0;
  return (
    <Card className="p-0 overflow-hidden" padding={false}>
      <div className="p-6 lg:p-7 relative z-10 flex flex-col gap-5">
        {/* Subtle glow accent */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 55% 75% at 82% 18%, color-mix(in srgb, var(--brand) 7%, transparent) 0%, transparent 65%)',
        }} />

        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted leading-none mb-1.5">
              Total Portfolio Balance
            </p>
            {/* Big balance */}
            <p style={{ fontFamily: "var(--font-heading)", fontSize: 36, fontWeight: 800, letterSpacing: '-.03em', color: 'var(--text)', lineHeight: 1 }}>
              <span style={{ fontSize: 20, verticalAlign: 'top', marginTop: 4, display: 'inline-block', color: 'var(--text-muted)', fontWeight: 600 }}>$</span>
              {new Intl.NumberFormat('en-US').format(data.totalBalance)}
              <span style={{ fontSize: 22 }}>.00</span>
            </p>
            {/* Change pill */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              marginTop: 10, padding: '4px 10px', borderRadius: 6,
              fontSize: 12, fontWeight: 600, fontFamily: "var(--font-mono), monospace",
              background: isUp ? 'color-mix(in srgb, var(--positive) 12%, transparent)' : 'color-mix(in srgb, var(--negative) 12%, transparent)',
              color: isUp ? 'var(--positive)' : 'var(--negative)',
            }}>
              <TrendingUp size={13} strokeWidth={2.2} />
              {isUp ? '+' : ''}{fmt(data.todayChange)} &nbsp; {isUp ? '+' : ''}{data.todayChangePct.toFixed(2)}% today
            </div>
          </div>
          <Sparkline />
        </div>

        {/* Bottom stats */}
        <div className="grid grid-cols-2 pt-5 border-t border-border/10 gap-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-[6px] flex items-center justify-center shrink-0 text-text-muted"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}
            >
              <ArrowDownLeft size={13} />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.14em] text-text-muted leading-none mb-1">
                Available Balance
              </p>
              <p className="text-[14px] font-bold font-mono text-text leading-none">
                {fmt(data.availableBalance)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-[6px] flex items-center justify-center shrink-0 text-text-muted"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}
            >
              <Lock size={13} />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.14em] text-text-muted leading-none mb-1">
                Locked / Pending
              </p>
              <p className="text-[14px] font-bold font-mono text-text leading-none">
                {fmt(data.lockedBalance)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

/** 3-column stat cards */
function StatCards({ data }) {
  const cards = [
    { label: 'Total Deposits', value: fmt(data.totalDeposits), sub: 'Lifetime funded', color: 'positive', Icon: ArrowDownToLine },
    { label: 'Total Withdrawals', value: fmt(data.totalWithdrawals), sub: 'Lifetime withdrawn', color: 'negative', Icon: ArrowUpFromLine },
    { label: 'Pending Amount', value: fmt(data.pendingAmount), sub: `${data.pendingCount} transactions processing`, color: 'warning', Icon: Clock },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {cards.map((c) => {
        const colorVar = `var(--${c.color})`;
        const dimVar = `color-mix(in srgb, var(--${c.color}) 12%, transparent)`;
        return (
          <Card key={c.label} padding={false} className="border-t-[2px]" style={{ borderTopColor: colorVar }}>
            <div className="p-4 flex flex-col gap-2.5">
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: dimVar, color: colorVar,
                fontSize: 16,
              }}>
                <c.Icon size={14} strokeWidth={2} />
              </div>
              <div>
                <p className="text-[9.5px] font-black uppercase tracking-[0.12em] text-text-muted mb-1 leading-none">{c.label}</p>
                <p className="font-mono font-bold text-[15px] leading-tight" style={{ color: colorVar }}>{c.value}</p>
                <p className="text-[10px] text-text-muted mt-1 leading-normal">{c.sub}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

/** Quick action grid */
function QuickActions({ actions, onNavigate }) {
  return (
    <section>
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted mb-3">
        Quick Actions
      </p>
      <div className="grid grid-cols-4 gap-3">
        {actions.map((a) => {
          const colorVar = `var(--${a.color})`;
          const dimVar = `color-mix(in srgb, var(--${a.color}) 12%, transparent)`;
          const bdVar = `color-mix(in srgb, var(--${a.color}) 18%, transparent)`;
          return (
            <button
              key={a.id}
              id={`wallet-qa-${a.id}`}
              onClick={() => onNavigate(a.id, a.path)}
              className="bg-surface-elevated border border-border shadow-card-subtle rounded-[10px] p-4 flex flex-col items-start gap-3 cursor-pointer text-left hover:scale-[1.02] hover:shadow-card-subtle hover:border-border/60 hover:bg-muted-surface transition-all duration-300 group"
            >
              <div 
                className="transition-all duration-300 group-hover:scale-110"
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: dimVar, border: `1px solid ${bdVar}`, color: colorVar,
                  boxShadow: `0 0 8px color-mix(in srgb, ${colorVar} 25%, transparent)`,
                }}
              >
                <a.Icon size={14} strokeWidth={2} className="group-hover:animate-pulse" />
              </div>
              <div className="min-w-0">
                <p className="font-heading font-bold text-[13px] text-text-muted group-hover:text-text tracking-[-0.01em] leading-tight mb-1 transition-colors duration-250">{a.label}</p>
                <p className="text-[10.5px] text-text-muted group-hover:text-text leading-normal truncate transition-colors duration-250">{a.desc}</p>
              </div>
              <ChevronRight size={12} color="color-mix(in srgb, var(--text) 25%, transparent)" className="self-end mt-0 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          );
        })}
      </div>
    </section>
  );
}

/** Status badge */
function StatusBadge({ status }) {
  const map = {
    COMPLETED: { bg: 'color-mix(in srgb, var(--positive) 12%, transparent)', color: 'var(--positive)' },
    PENDING: { bg: 'color-mix(in srgb, var(--warning) 12%, transparent)', color: 'var(--warning)' },
    FAILED: { bg: 'color-mix(in srgb, var(--negative) 12%, transparent)', color: 'var(--negative)' },
  };
  const s = map[status] ?? map.COMPLETED;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 7px', borderRadius: 4,
      fontSize: 9.5, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase',
      background: s.bg, color: s.color, marginLeft: 7, verticalAlign: 'middle',
    }}>
      {status}
    </span>
  );
}

/** Single transaction row */
function TxRow({ tx, isLast }) {
  const isDebit = tx.type === 'WITHDRAWAL';
  const amtColor = isDebit ? 'var(--negative)' : 'var(--positive)';
  const iconBg = isDebit ? 'color-mix(in srgb, var(--negative) 12%, transparent)' : 'color-mix(in srgb, var(--positive) 12%, transparent)';
  const iconBd = isDebit ? 'color-mix(in srgb, var(--negative) 18%, transparent)' : 'color-mix(in srgb, var(--positive) 18%, transparent)';
  const TxIcon = isDebit ? ArrowUpRight : ArrowDownLeft;
  const amtStr = isDebit ? `-${fmt(Math.abs(tx.amount))}` : `+${fmt(tx.amount)}`;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 18px',
      borderBottom: isLast ? 'none' : '1px solid var(--border)',
      transition: 'background .12s',
    }}
      onMouseEnter={e => e.currentTarget.style.background = 'color-mix(in srgb, var(--text) 1.2%, transparent)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {/* Icon */}
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: iconBg, color: amtColor, border: `1px solid ${iconBd}`,
      }}>
        <TxIcon size={14} strokeWidth={2.2} style={{ margin: 'auto' }} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text)' }}>
          {tx.type}
          <StatusBadge status={tx.status} />
        </div>
        <p style={{
          fontSize: 10.5, color: 'var(--text-muted)', marginTop: 2,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {tx.method} &middot; {tx.date} &middot; {tx.ref}
        </p>
      </div>

      {/* Amount */}
      <span style={{
        fontFamily: "var(--font-mono), monospace", fontSize: 13.5,
        fontWeight: 500, flexShrink: 0, color: amtColor,
      }}>
        {amtStr}
      </span>
    </div>
  );
}

/** Filter pill row + activity list */
function ActivitySection({ txs, onViewAll }) {
  const [active, setActive] = useState('All');

  const filtered = useMemo(() => txs.filter(tx => matchFilter(tx, active)), [txs, active]);

  return (
    <section>
      <div className="flex items-center justify-between gap-4 mb-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted">
          Recent Activity
        </p>
        <button
          onClick={onViewAll}
          className="text-[11.5px] font-bold text-brand hover:opacity-85 cursor-pointer transition-opacity duration-150"
        >
          View All →
        </button>
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setActive(f)}
            style={{
              padding: '5px 12px', borderRadius: 20,
              fontSize: 11, fontWeight: 600, letterSpacing: '.04em',
              cursor: 'pointer', border: 'none', transition: 'background .15s, color .15s',
              background: active === f ? 'var(--brand)' : 'var(--surface-2)',
              color: active === f ? 'var(--text-on-accent)' : 'var(--text-muted)',
              boxShadow: active === f ? 'none' : 'inset 0 0 0 1px var(--border)',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <Card padding={false} className="overflow-hidden">
        {filtered.length > 0
          ? filtered.map((tx, i) => (
            <TxRow key={tx.ref} tx={tx} isLast={i === filtered.length - 1} />
          ))
          : (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              No transactions match this filter.
            </div>
          )
        }
      </Card>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   Design tokens (inject once at app root or in a CSS file)
   Copy these to your global CSS / :root block.

   :root {
     --lt-bg:            #0A0C12;
     --lt-surface:       #111420;
     --lt-surface2:      #161924;
     --lt-surface3:      #1C2030;
     --lt-border:        rgba(255,255,255,.06);
     --lt-border2:       rgba(255,255,255,.10);
     --lt-text:          #E8EAF6;
     --lt-muted:         #6B7094;
     --lt-muted2:        #3E4260;
     --lt-brand:         #4F6EF7;
     --lt-brand-dim:     rgba(79,110,247,.12);
     --lt-brand-glow:    rgba(79,110,247,.25);
     --lt-positive:      #2ECC8F;
     --lt-positive-dim:  rgba(46,204,143,.12);
     --lt-negative:      #F25C5C;
     --lt-negative-dim:  rgba(242,92,92,.12);
     --lt-warning:       #F5A623;
     --lt-warning-dim:   rgba(245,166,35,.12);
     --lt-cyan:          #22D4F5;
     --lt-cyan-dim:      rgba(34,212,245,.12);
     --lt-purple:        #8B5CF6;
     --lt-purple-dim:    rgba(139,92,246,.12);
   }
───────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────
   Main page component
───────────────────────────────────────────────────────── */
export function WalletsPage() {
  const navigate = useNavigate();

  const [walletData, setWalletData] = useState({
    totalBalance: 0,
    availableBalance: 0,
    lockedBalance: 0,
    todayChange: 0,
    todayChangePct: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    pendingAmount: 0,
    pendingCount: 0,
  });

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWithdrawDrawer, setShowWithdrawDrawer] = useState(false);

  const fetchWalletData = async () => {
    try {
      const [walletRes, depositsRes, withdrawalsRes] = await Promise.all([
        financeApi.getWallet(),
        financeApi.getDeposits(),
        financeApi.getWithdrawals()
      ]);

        const balance = parseFloat(walletRes.wallet_balance || 0);
        const portfolio = parseFloat(walletRes.portfolio_balance || balance);

        let totalDeps = 0;
        let pendingAmt = 0;
        let pendingCount = 0;

        let totalWiths = 0;
        
        const depTxs = depositsRes.map(d => {
          const amt = parseFloat(d.amount || 0);
          if (d.status === 'approved') totalDeps += amt;
          if (d.status === 'pending') {
            pendingAmt += amt;
            pendingCount += 1;
          }
          return {
            type: 'DEPOSIT',
            amount: amt,
            method: METHOD_LABELS[d.type] || d.type || 'Unknown',
            date: new Date(d.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
            status: d.status?.toUpperCase() || 'PENDING',
            ref: d.mt5DealId || d.transactionId || `DEP-${d.id}`,
            _rawDate: new Date(d.createdAt).getTime()
          };
        });

        const withTxs = withdrawalsRes.map(w => {
          const amt = parseFloat(w.amount || 0);
          if (w.status === 'approved') totalWiths += amt;
          if (w.status === 'pending') {
            pendingAmt += amt;
            pendingCount += 1;
          }
          return {
            type: 'WITHDRAWAL',
            amount: amt,
            method: METHOD_LABELS[w.type] || w.type || 'Unknown',
            date: new Date(w.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
            status: w.status?.toUpperCase() || 'PENDING',
            ref: w.mt5DealId || w.transactionId || `WDR-${w.id}`,
            _rawDate: new Date(w.createdAt).getTime()
          };
        });

        const txs = [...depTxs, ...withTxs].sort((a, b) => b._rawDate - a._rawDate);

        setWalletData({
          totalBalance: portfolio,
          availableBalance: balance, // pure wallet balance
          lockedBalance: 0,
          todayChange: 0,
          todayChangePct: 0,
          totalDeposits: totalDeps,
          totalWithdrawals: totalWiths,
          pendingAmount: pendingAmt,
          pendingCount: pendingCount,
        });

        setTransactions(txs);
      } catch (err) {
        console.error('Failed to load wallet data', err);
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  return (
    <div className="space-y-6 animate-fade-up">

      {/* ── Page header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <p className="text-section-eyebrow" style={{ marginBottom: 4 }}>
            Financials
          </p>
          <h1 className="font-heading font-semibold text-[26px] tracking-[-0.03em] leading-tight text-text mt-0.5">
            My Wallet
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button
            id="wallets-page-deposit-btn"
            onClick={() => navigate('/client/finance/deposit')}
            className="flex items-center gap-2 h-9 px-4 rounded-[6px] font-bold text-[12.5px] tracking-[-0.01em] cursor-pointer transition-all duration-150 bg-brand text-text-on-accent hover:opacity-90 active:scale-95"
          >
            <ArrowDownToLine size={13} strokeWidth={2.2} /> Deposit
          </button>
          <button
            id="wallets-page-withdraw-btn"
            onClick={() => setShowWithdrawDrawer(true)}
            className="flex items-center gap-2 h-9 px-4 rounded-[6px] font-bold text-[12.5px] tracking-[-0.01em] cursor-pointer transition-all duration-150 border border-border bg-transparent text-text hover:bg-white/[0.02] active:scale-95"
          >
            <ArrowUpFromLine size={13} strokeWidth={2} /> Withdraw
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-text-muted">Loading wallet...</div>
      ) : (
        <>
          {/* ── Verification notice ── */}
          <VerifiedNotice />

          {/* ── Hero balance card ── */}
          <HeroCard data={walletData} />

          {/* ── Stat cards row ── */}
          <StatCards data={walletData} />

          <QuickActions
            actions={QUICK_ACTIONS}
            onNavigate={(id, path) => {
              if (id === 'withdraw') setShowWithdrawDrawer(true);
              else navigate(path);
            }}
          />

          {/* ── Recent activity ── */}
          <ActivitySection
            txs={transactions}
            onViewAll={() => navigate('/client/finance/transactions')}
          />
        </>
      )}

      {showWithdrawDrawer && (
        <AddWithdrawalDrawer
          open={showWithdrawDrawer}
          onClose={() => {
            setShowWithdrawDrawer(false);
            fetchWalletData();
          }}
          onSuccess={(msg) => console.log(msg)}
        />
      )}
    </div>
  );
}

export default WalletsPage;