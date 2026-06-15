import { Activity, XCircle, AlertTriangle, Zap, RefreshCw, ShieldAlert } from 'lucide-react';

export const LOG_ROWS = [
  { id: 'L1', eventId: 'EVT-50091', type: 'EXECUTION', bridge: 'EU-1', symbol: 'EUR/USD', latency: '82ms', code: '0', severity: 'INFO', timestamp: '09:14:02 UTC', detail: 'Order ORD-88501 filled at 1.08445' },
  { id: 'L2', eventId: 'EVT-50090', type: 'SYNC', bridge: 'EU-2', symbol: '—', latency: '310ms', code: '0', severity: 'WARN', timestamp: '09:13:41 UTC', detail: 'Bridge EU-2 sync latency above threshold (250ms)' },
  { id: 'L3', eventId: 'EVT-50089', type: 'REJECTION', bridge: 'EU-1', symbol: 'BTC/USD', latency: '44ms', code: 'ERR_MKT_CLOSED', severity: 'ERROR', timestamp: '08:31:12 UTC', detail: 'ORD-88481 rejected — market closed on BTC/USD' },
  { id: 'L4', eventId: 'EVT-50088', type: 'EXECUTION', bridge: 'APAC', symbol: 'USD/JPY', latency: '97ms', code: '0', severity: 'INFO', timestamp: '08:50:22 UTC', detail: 'Order ORD-88491 filled at 149.812' },
  { id: 'L5', eventId: 'EVT-50087', type: 'PRICE_FEED', bridge: 'EU-1', symbol: 'XAU/USD', latency: '12ms', code: '0', severity: 'INFO', timestamp: '08:44:55 UTC', detail: 'Price feed tick: 2341.0 / 2341.5' },
  { id: 'L6', eventId: 'EVT-50086', type: 'RETRY', bridge: 'EU-2', symbol: 'GBP/USD', latency: '1,240ms', code: 'ERR_TIMEOUT', severity: 'ERROR', timestamp: '08:31:01 UTC', detail: 'Order transmission timeout. Retry 1/3 scheduled.' },
  { id: 'L7', eventId: 'EVT-50085', type: 'HEARTBEAT', bridge: 'APAC', symbol: '—', latency: '105ms', code: '0', severity: 'INFO', timestamp: '08:30:00 UTC', detail: 'APAC bridge heartbeat OK' },
  { id: 'L8', eventId: 'EVT-50084', type: 'MARGIN_CALL', bridge: 'EU-1', symbol: 'USD/CAD', latency: '—', code: 'MARGIN_CALL', severity: 'CRITICAL', timestamp: '08:12:41 UTC', detail: 'Account 100455 margin level hit 120%. Alert issued.' },
];

export const logsConfig = {
  title: 'Execution Logs',
  tableTitle: 'All Logs',
  tableSubtitle: 'Track system events.',
  rows: LOG_ROWS,
  searchFields: ['eventId', 'type', 'bridge', 'symbol', 'code', 'detail'],
  kpis: [
    { label: 'Total Events', value: '8', sub: 'total logs', Icon: Activity, accent: 'var(--brand)' },
    { label: 'Errors', value: '2', sub: 'system errors', Icon: XCircle, accent: 'var(--negative)' },
    { label: 'Warnings', value: '1', sub: 'system warnings', Icon: AlertTriangle, accent: 'var(--warning)' },
    { label: 'Avg Latency', value: '239ms', sub: 'average latency', Icon: Zap, accent: 'var(--cyan)' },
    { label: 'Retries', value: '1', sub: 'retry attempts', Icon: RefreshCw, accent: 'var(--purple)' },
    { label: 'Critical', value: '1', sub: 'critical issues', Icon: ShieldAlert, accent: 'var(--negative)' },
  ],
  severityOpts: ['INFO', 'WARN', 'ERROR', 'CRITICAL'],
  typeOpts: ['EXECUTION', 'SYNC', 'REJECTION', 'RETRY', 'PRICE_FEED', 'HEARTBEAT', 'MARGIN_CALL'],
  bridgeOpts: ['EU-1', 'EU-2', 'APAC'],
  columns: [
    { key: 'eventId', label: 'ID', type: 'mono' },
    { key: 'type', label: 'Type', type: 'logtype' },
    { key: 'bridge', label: 'Bridge', type: 'tag' },
    { key: 'symbol', label: 'Symbol', type: 'symbol' },
    { key: 'latency', label: 'Latency', type: 'latency' },
    { key: 'code', label: 'Code', type: 'mono' },
    { key: 'severity', label: 'Severity', type: 'severity' },
    { key: 'timestamp', label: 'Time', type: 'mono' },
    { key: 'detail', label: 'Detail', type: 'detail' },
  ],
};
