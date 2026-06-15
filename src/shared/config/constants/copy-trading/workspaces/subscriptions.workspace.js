import { Activity, Clock, CreditCard, PauseCircle, Wallet, XCircle } from 'lucide-react';

export const SUBSCRIPTION_ROWS = [
  { id: 'SUB-1001', user: 'k.mueller',  uid: 'U-8821', provider: 'alex.morgan',  plan: 'Performance', allocation: '$2,000', startDate: '2023-11-01', renewal: '2024-02-01', status: 'ACTIVE'  },
  { id: 'SUB-1002', user: 'p.sharma',   uid: 'U-4102', provider: 'sarah.gold',   plan: 'Fixed Fee',   allocation: '$1,000', startDate: '2023-12-15', renewal: '2024-01-15', status: 'RENEWED' },
  { id: 'SUB-1003', user: 'r.james',    uid: 'U-3341', provider: 'james.eu',     plan: 'Free',        allocation: '$500',   startDate: '2024-01-01', renewal: '—',           status: 'PAUSED'  },
  { id: 'SUB-1004', user: 'f.martin',   uid: 'U-7723', provider: 'alex.morgan',  plan: 'Performance', allocation: '$5,000', startDate: '2023-09-01', renewal: '2024-02-01', status: 'ACTIVE'  },
  { id: 'SUB-1005', user: 'n.tanaka',   uid: 'U-2290', provider: 'marc.carry',   plan: 'Fixed Fee',   allocation: '$3,000', startDate: '2024-01-10', renewal: '2024-02-10', status: 'ACTIVE'  },
  { id: 'SUB-1006', user: 'h.ali',      uid: 'U-6640', provider: 'ken.apac',     plan: 'Performance', allocation: '$1,500', startDate: '2023-12-20', renewal: '2024-01-20', status: 'FAILED'  },
  { id: 'SUB-1007', user: 'l.chen',     uid: 'U-9910', provider: 'nina.swing',   plan: 'Fixed Fee',   allocation: '$800',   startDate: '2023-10-05', renewal: '2024-01-05', status: 'PAUSED'  },
  { id: 'SUB-1008', user: 's.ivanova',  uid: 'U-1123', provider: 'petra.news',   plan: 'Free',        allocation: '$600',   startDate: '2024-01-12', renewal: '—',           status: 'ACTIVE'  },
];

export const subscriptionsConfig = {
  title: 'Subscriptions',
  tableTitle: 'Subscription Ledger',
  tableSubtitle: 'All copy trading subscription records',
  rows: SUBSCRIPTION_ROWS,
  searchFields: ['id', 'user', 'uid', 'provider', 'plan', 'status'],
  kpis: [
    { label: 'Active Subs',      value: '5',       sub: 'live subscriptions', Icon: Activity,    accent: 'var(--positive)' },
    { label: 'Paused',           value: '2',       sub: 'copy paused',        Icon: PauseCircle, accent: 'var(--warning)'  },
    { label: 'Failed',           value: '1',       sub: 'renewal failed',     Icon: XCircle,     accent: 'var(--negative)' },
    { label: 'Renewals Due',     value: '3',       sub: 'next 7 days',        Icon: Clock,       accent: 'var(--cyan)'     },
    { label: 'Total Allocated',  value: '$15,400', sub: 'subscription funds', Icon: Wallet,      accent: 'var(--brand)'    },
    { label: 'Performance Fee',  value: '$4,080',  sub: 'fees collected MTD', Icon: CreditCard,  accent: 'var(--purple)'   },
  ],
  statusOpts: ['ACTIVE', 'PAUSED', 'FAILED', 'RENEWED'],
  planOpts:   ['Performance', 'Fixed Fee', 'Free'],
  columns: [
    { key: 'id',         label: 'Sub ID',     type: 'mono'   },
    { key: 'user',       label: 'User',       type: 'user'   },
    { key: 'provider',   label: 'Provider',   type: 'mono'   },
    { key: 'plan',       label: 'Plan',       type: 'tag'    },
    { key: 'allocation', label: 'Allocation', type: 'amount' },
    { key: 'startDate',  label: 'Start',      type: 'mono'   },
    { key: 'renewal',    label: 'Renewal',    type: 'mono'   },
    { key: 'status',     label: 'Status',     type: 'status' },
  ],
};
