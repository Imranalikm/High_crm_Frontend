/**
 * finance/data/mockData.js
 * All mock datasets + shared color maps for the Finance module.
 */
import { Building2, Banknote, Smartphone } from 'lucide-react';

const uid = (n) => `UID-${n}`;
const users = [
  { name: 'Demo User', uid: uid(1000), email: 'demo@email.com', region: 'US' },
];

// ── Deposits ──────────────────────────────────────────────────────
export const depositsData = [
  { id: 'DEP-DEMO', user: users[0], amount: '$0', amtRaw: 0, method: 'Bank Wire', rail: 'SWIFT', status: 'PENDING', risk: 'LOW', created: '2024-01-01 00:00', reviewedBy: 'Auto', hash: null, note: 'Demo data' }
];

// ── Withdrawals ──────────────────────────────────────────────────
export const withdrawalsData = [
  { id: 'WDR-DEMO', user: users[0], amount: '$0', amtRaw: 0, destination: 'Demo Bank', method: 'Bank Wire', rail: 'SWIFT', status: 'PENDING', risk: 'LOW', created: '2024-01-01 00:00', reviewedBy: 'Auto', compliance: 'PASS', aml: 'CLEAR' }
];

// ── Transactions ─────────────────────────────────────────────────
export const transactionsData = [
  { id: 'TXN-DEMO', user: users[0], type: 'DEPOSIT', amount: '+$0', amtRaw: 0, method: 'Bank Wire', reference: 'DEP-DEMO', status: 'SETTLED', ts: '2024-01-01 00:00' }
];

// ── Failed Payments ──────────────────────────────────────────────
export const failedPaymentsData = [
  { id: 'FAIL-DEMO', user: users[0], method: 'Bank Wire', provider: 'SWIFT', reason: 'DEMO_REASON', code: 'DEMO-001', severity: 'LOW', status: 'UNRESOLVED', retries: 0, created: '2024-01-01 00:00' }
];

// ── Approvals ────────────────────────────────────────────────────
export const approvalsData = [
  { id: 'APR-DEMO', user: users[0], amount: '$0', amtRaw: 0, type: 'DEPOSIT', risk: 'LOW', rule: 'DEMO_RULE', reviewer: 'Auto', status: 'PENDING', priority: 'LOW', sla: 0, created: '2024-01-01 00:00' }
];

// ── Color maps ───────────────────────────────────────────────────
export const STATUS_CLR = {
  PENDING: 'var(--warning)', APPROVED: 'var(--positive)', FAILED: 'var(--negative)',
  FLAGGED: 'var(--negative)', PROCESSING: 'var(--cyan)', PAID: 'var(--positive)',
  FROZEN: 'var(--negative)', REJECTED: 'var(--negative)', SETTLED: 'var(--positive)',
  REVERSED: 'var(--warning)', UNRESOLVED: 'var(--negative)', RESOLVED: 'var(--positive)',
  RETRY: 'var(--warning)', ESCALATED: 'var(--negative)', LOCKED: 'var(--negative)',
  REVIEW: 'var(--warning)',
};
export const RISK_CLR = { LOW: 'var(--positive)', MEDIUM: 'var(--warning)', HIGH: 'var(--negative)', CRITICAL: 'var(--negative)' };
export const PRIORITY_CLR = { CRITICAL: 'var(--negative)', HIGH: '#f97316', MEDIUM: 'var(--warning)', LOW: 'var(--cyan)' };
export const SEV_CLR = { LOW: 'var(--positive)', MEDIUM: 'var(--warning)', HIGH: 'var(--negative)', CRITICAL: 'var(--negative)' };
export const TXN_TYPE_CLR = {
  DEPOSIT: 'var(--positive)', WITHDRAWAL: 'var(--negative)', FEE: 'var(--warning)',
  REVERSAL: 'var(--cyan)', COMMISSION: 'var(--brand)', ADJUSTMENT: '#a78bfa',
};

export const METHOD_ICONS = {
  'bank': Building2,
  'cash': Banknote,
  'upi': Smartphone,
  'BANK': Building2,
  'CASH': Banknote,
  'UPI': Smartphone,
};

export const METHOD_LABELS = {
  'bank': 'Bank Transfer',
  'cash': 'Cash',
  'upi': 'UPI',
  'BANK': 'Bank Transfer',
  'CASH': 'Cash',
  'UPI': 'UPI',
};
