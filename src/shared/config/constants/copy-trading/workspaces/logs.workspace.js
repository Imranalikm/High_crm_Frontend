import { Activity, Copy, RefreshCw, ShieldAlert, UserCheck, XCircle } from 'lucide-react';

export const LOG_ROWS = [
  { id: 'L1', eventId: 'CT-8821', type: 'COPY_EXECUTED',   source: 'FX Alpha Pro',    target: 'k.mueller', severity: 'INFO',     timestamp: '09:14:02 UTC', status: 'SUCCESS', detail: 'EUR/USD BUY 0.40 lot copied at 1.08445' },
  { id: 'L2', eventId: 'CT-8820', type: 'SUBSCRIPTION',    source: 'SUB-1002',        target: 'p.sharma',  severity: 'INFO',     timestamp: '09:08:30 UTC', status: 'SUCCESS', detail: 'Subscription renewed. GoldRush Pro plan.' },
  { id: 'L3', eventId: 'CT-8819', type: 'SYNC_FAIL',       source: 'ScalpMaster EU',  target: 'r.james',   severity: 'ERROR',    timestamp: '08:55:11 UTC', status: 'FAILED',  detail: 'Copy sync timeout — order not replicated. Retry scheduled.' },
  { id: 'L4', eventId: 'CT-8818', type: 'PROVIDER_UPDATE', source: 'nina.swing',      target: 'system',    severity: 'WARN',     timestamp: '08:44:00 UTC', status: 'SUCCESS', detail: 'SwingEU Long suspended by admin — high drawdown alert.' },
  { id: 'L5', eventId: 'CT-8817', type: 'COPY_EXECUTED',   source: 'Safe Carry Trade',target: 'n.tanaka',  severity: 'INFO',     timestamp: '08:31:50 UTC', status: 'SUCCESS', detail: 'USD/JPY BUY 0.30 lot copied at 149.812' },
  { id: 'L6', eventId: 'CT-8816', type: 'RISK_FLAG',       source: 'Crypto-FX Blend', target: 'system',    severity: 'CRITICAL', timestamp: '08:12:41 UTC', status: 'PENDING', detail: 'Strategy drawdown exceeded 20%. Auto-pause triggered.' },
  { id: 'L7', eventId: 'CT-8815', type: 'FOLLOWER_JOINED', source: 'News Scalper',    target: 's.ivanova', severity: 'INFO',     timestamp: '07:55:00 UTC', status: 'SUCCESS', detail: 'New follower subscribed. Allocation $600, ratio 100%.' },
  { id: 'L8', eventId: 'CT-8814', type: 'SUBSCRIPTION',    source: 'SUB-1006',        target: 'h.ali',     severity: 'ERROR',    timestamp: '07:30:22 UTC', status: 'FAILED',  detail: 'Subscription renewal failed — insufficient wallet balance.' },
];

export const logsConfig = {
  title: 'Logs',
  tableTitle: 'Copy Trading Event Log',
  tableSubtitle: 'All copy execution, subscription, and system events',
  rows: LOG_ROWS,
  searchFields: ['eventId', 'type', 'source', 'target', 'status', 'detail'],
  kpis: [
    { label: 'Total Events',     value: '8', sub: 'today',                Icon: Activity,    accent: 'var(--brand)'    },
    { label: 'Copy Executions',  value: '2', sub: 'trades replicated',    Icon: Copy,        accent: 'var(--positive)' },
    { label: 'Sync Failures',    value: '1', sub: 'copy errors',          Icon: XCircle,     accent: 'var(--negative)' },
    { label: 'Sub Changes',      value: '2', sub: 'renewed / failed',     Icon: RefreshCw,   accent: 'var(--warning)'  },
    { label: 'Provider Updates', value: '1', sub: 'status change',        Icon: UserCheck,   accent: 'var(--cyan)'     },
    { label: 'Critical',         value: '1', sub: 'risk auto-pause',      Icon: ShieldAlert, accent: 'var(--negative)' },
  ],
  severityOpts: ['INFO', 'WARN', 'ERROR', 'CRITICAL'],
  typeOpts:     ['COPY_EXECUTED', 'SUBSCRIPTION', 'SYNC_FAIL', 'PROVIDER_UPDATE', 'RISK_FLAG', 'FOLLOWER_JOINED'],
  statusOpts:   ['SUCCESS', 'FAILED', 'PENDING'],
  columns: [
    { key: 'eventId',   label: 'Event ID',  type: 'mono'      },
    { key: 'type',      label: 'Type',      type: 'logtype'   },
    { key: 'source',    label: 'Source',    type: 'mono'      },
    { key: 'target',    label: 'Target',    type: 'mono'      },
    { key: 'severity',  label: 'Severity',  type: 'severity'  },
    { key: 'status',    label: 'Status',    type: 'logstatus' },
    { key: 'timestamp', label: 'Timestamp', type: 'mono'      },
    { key: 'detail',    label: 'Detail',    type: 'detail'    },
  ],
};
