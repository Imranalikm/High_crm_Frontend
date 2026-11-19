import { useState, useEffect, useCallback, useRef } from 'react';
import { dashboardApi } from '../services/dashboardApi';
import { socketClient } from '@/shared/api/client/socketClient';
import { METHOD_LABELS } from '@/shared/config/constants/finance';

const REFRESH_INTERVAL = 60_000; // 60 seconds (safety net)
const EVENT_DEBOUNCE = 1_500;    // coalesce bursts of socket events into one refetch

// Socket events (sent to admins) that mean dashboard numbers changed
const REFRESH_EVENTS = ['finance:updated', 'new_ticket', 'ticket_updated', 'new_notification'];

/**
 * useDashboardData
 *
 * Fetches and computes all dashboard metrics from real backend data.
 * Refetches immediately when the backend reports a deposit/withdrawal,
 * ticket or registration change, and every 60 seconds as a fallback.
 */
export function useDashboardData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      setError(null);

      const raw = await dashboardApi.fetchAll();
      const computed = computeDashboardMetrics(raw);
      setData(computed);
    } catch (err) {
      console.error('[Dashboard] Failed to fetch data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(false);
    intervalRef.current = setInterval(() => fetchData(true), REFRESH_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [fetchData]);

  // Realtime: refetch shortly after relevant backend events
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) return undefined;
    const socket = socketClient.connect(token);
    let timer = null;
    const onEvent = () => {
      clearTimeout(timer);
      timer = setTimeout(() => fetchData(true), EVENT_DEBOUNCE);
    };
    REFRESH_EVENTS.forEach((e) => socket.on(e, onEvent));
    return () => {
      clearTimeout(timer);
      REFRESH_EVENTS.forEach((e) => socket.off(e, onEvent));
    };
  }, [fetchData]);

  return { data, loading, error, refresh: () => fetchData(false) };
}

/**
 * Compute all dashboard-level metrics from raw API data.
 */
function computeDashboardMetrics(raw) {
  // ── Users ──
  const totalUsers = raw.users.length;
  const recentUsers = raw.users
    .filter((u) => u.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // ── KYC ──
  const totalKyc = raw.kycAll.length;
  const pendingKyc = raw.kycPending.length;
  const approvedKyc = raw.kycAll.filter(
    (k) => (k.status || '').toLowerCase() === 'approved'
  ).length;
  const rejectedKyc = raw.kycAll.filter(
    (k) => (k.status || '').toLowerCase() === 'rejected'
  ).length;

  // ── Deposits ──
  const allDeposits = raw.deposits;
  const pendingDeposits = raw.depositsPending;
  const totalDepositsAmount = sumAmount(allDeposits);
  const pendingDepositsAmount = sumAmount(pendingDeposits);
  const approvedDeposits = allDeposits.filter(
    (d) => (d.status || '').toUpperCase() === 'APPROVED' || (d.status || '').toUpperCase() === 'COMPLETED'
  );
  const approvedDepositsAmount = sumAmount(approvedDeposits);
  const rejectedDeposits = allDeposits.filter(
    (d) => (d.status || '').toUpperCase() === 'REJECTED'
  );
  const rejectedDepositsAmount = sumAmount(rejectedDeposits);
  const recentDeposits = allDeposits
    .filter((d) => d.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // ── Withdrawals ──
  const allWithdrawals = raw.withdrawals;
  const pendingWithdrawals = raw.withdrawalsPending;
  const totalWithdrawalsAmount = sumAmount(allWithdrawals);
  const pendingWithdrawalsAmount = sumAmount(pendingWithdrawals);
  const approvedWithdrawals = allWithdrawals.filter(
    (w) => (w.status || '').toUpperCase() === 'APPROVED' || (w.status || '').toUpperCase() === 'COMPLETED'
  );
  const approvedWithdrawalsAmount = sumAmount(approvedWithdrawals);
  const rejectedWithdrawals = allWithdrawals.filter(
    (w) => (w.status || '').toUpperCase() === 'REJECTED'
  );
  const rejectedWithdrawalsAmount = sumAmount(rejectedWithdrawals);
  const recentWithdrawals = allWithdrawals
    .filter((w) => w.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // ── Tickets ──
  const totalTickets = raw.tickets.length;
  const openTickets = raw.tickets.filter(
    (t) => ['open', 'pending', 'escalated'].includes((t.status || '').toLowerCase())
  ).length;
  const recentTickets = raw.tickets
    .filter((t) => t.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // ── KPIs ──
  const kpis = {
    totalUsers,
    pendingKyc,
    pendingDepositsCount: pendingDeposits.length,
    pendingDepositsAmount,
    pendingWithdrawalsCount: pendingWithdrawals.length,
    pendingWithdrawalsAmount,
    openTickets,
  };

  // ── Finance Summary ──
  const financeSummary = {
    deposits: {
      total: allDeposits.length,
      totalAmount: totalDepositsAmount,
      approved: approvedDeposits.length,
      approvedAmount: approvedDepositsAmount,
      pending: pendingDeposits.length,
      pendingAmount: pendingDepositsAmount,
      rejected: rejectedDeposits.length,
      rejectedAmount: rejectedDepositsAmount,
    },
    withdrawals: {
      total: allWithdrawals.length,
      totalAmount: totalWithdrawalsAmount,
      approved: approvedWithdrawals.length,
      approvedAmount: approvedWithdrawalsAmount,
      pending: pendingWithdrawals.length,
      pendingAmount: pendingWithdrawalsAmount,
      rejected: rejectedWithdrawals.length,
      rejectedAmount: rejectedWithdrawalsAmount,
    },
    // Only money that actually moved: approved deposits minus approved withdrawals
    netFlow: approvedDepositsAmount - approvedWithdrawalsAmount,
  };

  // ── KYC Summary ──
  const kycSummary = {
    total: totalKyc,
    pending: pendingKyc,
    approved: approvedKyc,
    rejected: rejectedKyc,
  };

  // ── Action Items (pending things needing attention) ──
  const actionItems = [];

  if (pendingKyc > 0) {
    actionItems.push({
      id: 'kyc-pending',
      level: 'warning',
      cat: 'KYC',
      title: `${pendingKyc} KYC request${pendingKyc > 1 ? 's' : ''} awaiting review`,
      text: 'Users are waiting for identity verification approval.',
      path: '/admin/users/kyc',
    });
  }

  if (pendingWithdrawals.length > 0) {
    actionItems.push({
      id: 'wd-pending',
      level: 'critical',
      cat: 'FINANCE',
      title: `${pendingWithdrawals.length} withdrawal${pendingWithdrawals.length > 1 ? 's' : ''} pending (${formatCurrency(pendingWithdrawalsAmount)})`,
      text: 'Withdrawal requests need admin approval.',
      path: '/admin/finance/withdrawals',
    });
  }

  if (pendingDeposits.length > 0) {
    actionItems.push({
      id: 'dep-pending',
      level: 'warning',
      cat: 'FINANCE',
      title: `${pendingDeposits.length} deposit${pendingDeposits.length > 1 ? 's' : ''} pending (${formatCurrency(pendingDepositsAmount)})`,
      text: 'Deposit requests awaiting confirmation.',
      path: '/admin/finance/deposits',
    });
  }

  if (openTickets > 0) {
    actionItems.push({
      id: 'tickets-open',
      level: openTickets > 5 ? 'critical' : 'warning',
      cat: 'SUPPORT',
      title: `${openTickets} open support ticket${openTickets > 1 ? 's' : ''}`,
      text: 'Clients are waiting for support responses.',
      path: '/admin/support/tickets',
    });
  }

  // ── Recent Activity (merged and sorted) ──
  const recentActivity = buildRecentActivity(recentUsers, recentDeposits, recentWithdrawals, recentTickets);

  return {
    kpis,
    financeSummary,
    kycSummary,
    actionItems,
    recentActivity,
    mt5Accounts: raw.mt5Accounts || [],
  };
}

/**
 * Build a unified recent activity list from all modules.
 */
function buildRecentActivity(users, deposits, withdrawals, tickets) {
  const items = [];

  for (const u of users) {
    items.push({
      id: `user-${u.id}`,
      type: 'user',
      detail: `${u.name || u.email || 'New User'} registered`,
      info: u.email || '',
      time: u.createdAt,
      path: `/admin/users/${u.id}`,
    });
  }

  for (const d of deposits) {
    const amt = parseAmount(d.amount);
    items.push({
      id: `dep-${d.id}`,
      type: 'deposit',
      detail: `Deposit ${formatCurrency(amt)}`,
      info: describeTx(d),
      status: d.status,
      time: d.createdAt,
      path: `/admin/finance/deposits/${d.id}`,
    });
  }

  for (const w of withdrawals) {
    const amt = parseAmount(w.amount);
    items.push({
      id: `wd-${w.id}`,
      type: 'withdrawal',
      detail: `Withdrawal ${formatCurrency(amt)}`,
      info: describeTx(w),
      status: w.status,
      time: w.createdAt,
      path: `/admin/finance/withdrawals/${w.id}`,
    });
  }

  for (const t of tickets) {
    items.push({
      id: `ticket-${t.id}`,
      type: 'ticket',
      detail: t.subject || 'Support Ticket',
      info: t.category || 'General',
      status: t.status,
      time: t.createdAt,
      path: `/admin/support/tickets/${t.id}`,
    });
  }

  return items
    .filter((i) => i.time)
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 10);
}

// ── Utilities ──

/** "Bank Wire · Jane Doe · #901000018290" from a deposit/withdrawal row. */
function describeTx(t) {
  const parts = [METHOD_LABELS[t.type] || t.type || 'Transfer'];
  const who = t.recipient?.name || t.creator?.name;
  if (who) parts.push(who);
  if (t.accountId) parts.push(`#${t.accountId}`);
  return parts.join(' · ');
}

function parseAmount(val) {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') return parseFloat(val.replace(/[^0-9.-]/g, '')) || 0;
  return 0;
}

function sumAmount(items) {
  return items.reduce((sum, item) => sum + parseAmount(item.amount), 0);
}

export function formatCurrency(num) {
  const n = Number(num) || 0;
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}k`;
  return `${sign}$${abs.toFixed(2)}`;
}

export function formatNumber(num) {
  return num.toLocaleString('en-US');
}

export function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
