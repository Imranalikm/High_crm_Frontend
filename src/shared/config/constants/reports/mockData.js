import { FileText, Send, Layers, AlertOctagon, Archive, Clock } from 'lucide-react';

export const overviewKpis = [
  { label: 'Generated Today', value: '248', Icon: FileText, color: 'var(--cyan)', trend: '+12%', sub: 'vs. yesterday' },
  { label: 'Delivery Success', value: '99.4%', Icon: Send, color: 'var(--positive)', trend: '+0.2%', sub: '246/248 sent' },
  { label: 'Active Automations', value: '14', Icon: Layers, color: 'var(--brand)', trend: 'Stable', sub: 'Running hourly' },
  { label: 'Failure Logs (24h)', value: '2', Icon: AlertOctagon, color: 'var(--negative)', trend: '-3', sub: 'Requires attention' },
  { label: 'Storage Used', value: '12.4 GB', Icon: Archive, color: 'var(--purple)', trend: '+8%', sub: '90 days retention' },
  { label: 'Next Scheduled', value: '14 mins', Icon: Clock, color: 'var(--warning)', trend: 'Normal', sub: 'GL Export xlsx' }
];

export const reportActivity = [
  { hour: '08', generated: 12, failed: 0 },
  { hour: '10', generated: 34, failed: 1 },
  { hour: '12', generated: 58, failed: 0 },
  { hour: '14', generated: 42, failed: 0 },
  { hour: '16', generated: 64, failed: 1 },
  { hour: '18', generated: 28, failed: 0 },
  { hour: '20', generated: 10, failed: 0 }
];

export const deliveryTrend = [
  { day: 'Mon', success: 198, failed: 1 },
  { day: 'Tue', success: 212, failed: 0 },
  { day: 'Wed', success: 240, failed: 2 },
  { day: 'Thu', success: 225, failed: 0 },
  { day: 'Fri', success: 254, failed: 1 },
  { day: 'Sat', success: 98, failed: 0 },
  { day: 'Sun', success: 84, failed: 0 }
];

export const reportTypeSplit = [
  { name: 'Finance', value: 40, color: 'var(--brand)' },
  { name: 'Trading', value: 35, color: 'var(--cyan)' },
  { name: 'Users', value: 15, color: 'var(--purple)' },
  { name: 'System', value: 10, color: 'rgba(255,255,255,0.35)' }
];

export const recentReports = [
  { id: 'RPT-FIN-294', name: 'Daily General Ledger Reconciliations', type: 'Finance', status: 'READY', format: 'PDF', generatedAt: '12 mins ago', size: '14.2 MB', owner: 'System', rows: 8450 },
  { id: 'RPT-TRD-842', name: 'Daily Trading P&L & Volume Summary', type: 'Trading', status: 'READY', format: 'XLSX', generatedAt: '24 mins ago', size: '8.4 MB', owner: 'super-admin', rows: 1420 },
  { id: 'RPT-SYS-105', name: 'MT5 Server Sync Job', type: 'System', status: 'READY', format: 'JSON', generatedAt: '45 mins ago', size: '412 KB', owner: 'System', rows: 48 },
  { id: 'RPT-USR-733', name: 'KYC Verification Queue Analytics', type: 'User', status: 'FAILED', format: 'CSV', generatedAt: '1 hour ago', size: '—', owner: 'operations-lead', rows: 0 },
  { id: 'RPT-FIN-291', name: 'Monthly IB Commissions Summary', type: 'Finance', status: 'READY', format: 'XLSX', generatedAt: '2 hours ago', size: '22.8 MB', owner: 'System', rows: 12400 }
];

export const financeRows = [
  { id: 'RPT-FIN-294', name: 'Daily General Ledger Reconciliations', period: '2026-05-26', owner: 'System', source: 'Automated', status: 'READY', format: 'PDF', generated: '2026-05-27 08:30', size: '14.2 MB', rows: 8450 },
  { id: 'RPT-FIN-291', name: 'Monthly IB Commissions Summary', period: '2026-04', owner: 'System', source: 'Scheduled', status: 'READY', format: 'XLSX', generated: '2026-05-27 07:15', size: '22.8 MB', rows: 12400 },
  { id: 'RPT-FIN-285', name: 'Withdrawal Audit Logs - May 2026', period: '2026-05-01 to 2026-05-25', owner: 'operations-lead', source: 'Manual Request', status: 'READY', format: 'CSV', generated: '2026-05-26 15:40', size: '1.8 MB', rows: 4320 },
  { id: 'RPT-FIN-281', name: 'Deposit Stream Summary Q2', period: '2026-Q2', owner: 'super-admin', source: 'Manual Request', status: 'READY', format: 'JSON', generated: '2026-05-25 11:20', size: '4.2 MB', rows: 8900 },
  { id: 'RPT-FIN-277', name: 'Processor Fee Analysis & Forecast', period: '2026-YTD', owner: 'System', source: 'Scheduled', status: 'SCHEDULED', format: 'XLSX', generated: 'Pending...', size: '—', rows: 0 },
  { id: 'RPT-FIN-272', name: 'Corporate Tax Ledger & Liabilities', period: '2025-FY', owner: 'auditor-lead', source: 'Manual Request', status: 'READY', format: 'PDF', generated: '2026-05-20 10:15', size: '32.4 MB', rows: 18400 },
  { id: 'RPT-FIN-269', name: 'Automated Billing Audit Report', period: '2026-05-20', owner: 'System', source: 'Automated', status: 'FAILED', format: 'PDF', generated: '2026-05-20 04:00', size: '—', rows: 0 }
];

export const tradingRows = [
  { id: 'RPT-TRD-842', title: 'Daily Trading P&L & Volume Summary', scope: 'Global Platform', symbols: 'ALL (XAUUSD, EURUSD...)', pnl: '+$248,320', winRate: '68.5%', drawdown: '3.4%', status: 'READY', generated: '2026-05-27 08:45', format: 'XLSX', size: '8.4 MB' },
  { id: 'RPT-TRD-839', title: 'Top 100 Profitable MT5 Accounts', scope: 'Standard & ECN', symbols: 'ALL FX & Crypto', pnl: '+$1,142,500', winRate: '74.2%', drawdown: '8.9%', status: 'READY', generated: '2026-05-27 02:00', format: 'XLSX', size: '1.2 MB' },
  { id: 'RPT-TRD-833', title: 'High-Frequency Trading Execution Logs', scope: 'Prop-HFT Node', symbols: 'XAUUSD, BTCUSD', pnl: '-$42,800', winRate: '48.9%', drawdown: '14.2%', status: 'READY', generated: '2026-05-26 21:10', format: 'CSV', size: '124.5 MB' },
  { id: 'RPT-TRD-828', title: 'Copy Trading Strategy Performance', scope: 'Social Copy Platform', symbols: 'ALL STG', pnl: '+$84,500', winRate: '61.2%', drawdown: '4.8%', status: 'READY', generated: '2026-05-25 18:30', format: 'PDF', size: '6.4 MB' },
  { id: 'RPT-TRD-822', title: 'Symbol Spreads & Slippage Audit', scope: 'Liquidity Provider A', symbols: 'EURUSD, GBPUSD', pnl: '—', winRate: '—', drawdown: '—', status: 'PROCESSING', generated: 'In Progress...', format: 'JSON', size: '—' },
  { id: 'RPT-TRD-815', title: 'Margin Call & Liquidation Report', scope: 'All Live Accounts', symbols: 'ALL LIQ', pnl: '+$12,450', winRate: '—', drawdown: '98.5%', status: 'READY', generated: '2026-05-24 06:15', format: 'PDF', size: '950 KB' },
  { id: 'RPT-TRD-809', title: 'VIP Clients Trading Activity Report', scope: 'HNW Accounts', symbols: 'ALL SYMBOLS', pnl: '-$14,200', winRate: '52.4%', drawdown: '6.2%', status: 'FAILED', generated: '2026-05-23 14:00', format: 'XLSX', size: '—' }
];

export const userRows = [
  { id: 'RPT-USR-738', name: 'Dormant Accounts & Balance List', segment: 'Inactives > 180d', kyc: 'MIXED', wallet: 'SUSPENDED', trading: 'LOCKED', risk: 'LOW', status: 'READY', generated: '2026-05-27 06:00', format: 'XLSX', size: '1.4 MB' },
  { id: 'RPT-USR-733', name: 'KYC Verification Queue Analytics', segment: 'All Pending Requests', kyc: 'PENDING', wallet: 'ACTIVE', trading: 'ACTIVE', risk: 'MEDIUM', status: 'FAILED', generated: '2026-05-27 05:15', format: 'CSV', size: '—' },
  { id: 'RPT-USR-728', name: 'High Net Worth Clients Segment List', segment: 'Balance > $50k', kyc: 'VERIFIED', wallet: 'ACTIVE', trading: 'ACTIVE', risk: 'LOW', status: 'READY', generated: '2026-05-26 12:45', format: 'XLSX', size: '3.1 MB' },
  { id: 'RPT-USR-721', name: 'Active Partner / IB Network Performance', segment: 'IB Level 1 to 5', kyc: 'VERIFIED', wallet: 'ACTIVE', trading: 'ACTIVE', risk: 'LOW', status: 'READY', generated: '2026-05-25 09:30', format: 'CSV', size: '4.8 MB' },
  { id: 'RPT-USR-715', name: 'User Security & MFA Audits', segment: 'All Admin Accounts', kyc: 'VERIFIED', wallet: 'ACTIVE', trading: 'ACTIVE', risk: 'HIGH', status: 'READY', generated: '2026-05-24 16:20', format: 'JSON', size: '180 KB' },
  { id: 'RPT-USR-709', name: 'Risk Level Distribution Audit', segment: 'Global Userbase', kyc: 'MIXED', wallet: 'ACTIVE', trading: 'ACTIVE', risk: 'HIGH', status: 'READY', generated: '2026-05-22 11:00', format: 'PDF', size: '9.4 MB' },
  { id: 'RPT-USR-701', name: 'Suspicious Activity Log Summary', segment: 'Flagged User IPs', kyc: 'MIXED', wallet: 'SUSPENDED', trading: 'LOCKED', risk: 'HIGH', status: 'SCHEDULED', generated: 'Pending...', format: 'PDF', size: '—' }
];

export const systemRows = [
  { id: 'SYS-JOB-498', name: 'MT5 Server Sync Job', service: 'mt5-sync-daemon', severity: 'INFO', status: 'SUCCESS', generated: '2026-05-27 09:30', retries: 0, size: '412 KB' },
  { id: 'SYS-JOB-495', name: 'Daily Database Vacuum Cleanup', service: 'postgres-maintenance', severity: 'INFO', status: 'SUCCESS', generated: '2026-05-27 04:00', retries: 0, size: '1.2 MB' },
  { id: 'SYS-JOB-490', name: 'Gateway Heartbeat Pulse', service: 'payment-gateway-link', severity: 'WARNING', status: 'SUCCESS', generated: '2026-05-27 00:05', retries: 1, size: '85 KB' },
  { id: 'SYS-JOB-488', name: 'Third-Party KYC API Sync', service: 'sumsub-sync-worker', severity: 'ERROR', status: 'SUCCESS', generated: '2026-05-26 23:45', retries: 3, size: '24 KB' },
  { id: 'SYS-JOB-481', name: 'Mailgun Queue Processor', service: 'email-dispatch-daemon', severity: 'CRITICAL', status: 'FAILED', generated: '2026-05-26 19:30', retries: 5, size: '—' },
  { id: 'SYS-JOB-477', name: 'Websockets Broadcast Daemon', service: 'pusher-ticks-relay', severity: 'WARNING', status: 'SUCCESS', generated: '2026-05-26 12:00', retries: 1, size: '1.8 MB' },
  { id: 'SYS-JOB-472', name: 'Redis Cache Eviction Cleaner', service: 'redis-cache-mgr', severity: 'INFO', status: 'SUCCESS', generated: '2026-05-25 04:00', retries: 0, size: '14 KB' }
];

export const exportTemplates = [
  { id: 'TPL-FIN-001', name: 'Daily General Ledger Export', type: 'Finance', format: 'XLSX', freq: 'Daily', recipients: ['finance-ops@firm.com', 'treasury@firm.com'], lastRun: '2026-05-27 04:00', status: 'ACTIVE', nextRun: '2026-05-28 04:00' },
  { id: 'TPL-TRD-014', name: 'Weekly Operations Overview', type: 'Trading', format: 'CSV', freq: 'Weekly', recipients: ['ops-manager@firm.com', 'risk@firm.com'], lastRun: '2026-05-25 00:00', status: 'ACTIVE', nextRun: '2026-06-01 00:00' },
  { id: 'TPL-IB-009', name: 'Monthly Partner Payouts Sync', type: 'Finance', format: 'JSON', freq: 'Monthly', recipients: ['ib-payouts@firm.com'], lastRun: '2026-05-01 01:00', status: 'ACTIVE', nextRun: '2026-06-01 01:00' },
  { id: 'TPL-SYS-994', name: 'Hourly Security Incident Audit', type: 'System', format: 'PDF', freq: 'Hourly', recipients: ['soc-lead@firm.com', 'cio@firm.com'], lastRun: '2026-05-27 09:00', status: 'ACTIVE', nextRun: '2026-05-27 10:00' },
  { id: 'TPL-USR-105', name: 'High-Risk Account Checkups', type: 'User', format: 'PDF', freq: 'Daily', recipients: ['compliance-officer@firm.com'], lastRun: '2026-05-27 03:00', status: 'PAUSED', nextRun: '—' }
];

export const exportFailureLog = [
  { id: 'EXP-F-942', template: 'Hourly Security Incident Audit', ts: '2026-05-27 08:00', reason: 'Mailgun SMTP auth timeout (Code 535)' },
  { id: 'EXP-F-889', template: 'Daily General Ledger Export', ts: '2026-05-26 04:00', reason: 'Database connection pools exhausted (Max limit reached)' }
];
