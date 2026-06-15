import { Activity, Clock, Lock, Star, UserCheck, Wallet } from 'lucide-react';

export const PROVIDER_ROWS = [
  { id: 'PR1', provider: 'alex.morgan',  uid: 'U-0041', strategies: 2, followers: 231, aum: '$2.14M', winRate: '68.4%', drawdown: '12.4%', status: 'ACTIVE',    approval: 'APPROVED', region: 'EU',   rating: '4.8' },
  { id: 'PR2', provider: 'sarah.gold',   uid: 'U-0122', strategies: 1, followers: 88,  aum: '$840K',  winRate: '74.1%', drawdown: '4.1%',  status: 'ACTIVE',    approval: 'APPROVED', region: 'US',   rating: '4.9' },
  { id: 'PR3', provider: 'james.eu',     uid: 'U-0219', strategies: 3, followers: 314, aum: '$3.90M', winRate: '61.2%', drawdown: '2.8%',  status: 'ACTIVE',    approval: 'APPROVED', region: 'EU',   rating: '4.6' },
  { id: 'PR4', provider: 'nina.swing',   uid: 'U-0334', strategies: 1, followers: 47,  aum: '$320K',  winRate: '52.1%', drawdown: '8.9%',  status: 'SUSPENDED', approval: 'APPROVED', region: 'EU',   rating: '3.2' },
  { id: 'PR5', provider: 'ken.apac',     uid: 'U-0501', strategies: 2, followers: 122, aum: '$1.22M', winRate: '65.9%', drawdown: '6.2%',  status: 'ACTIVE',    approval: 'APPROVED', region: 'APAC', rating: '4.4' },
  { id: 'PR6', provider: 'lena.crypto',  uid: 'U-0618', strategies: 1, followers: 19,  aum: '$95K',   winRate: '44.0%', drawdown: '22.1%', status: 'REVIEW',    approval: 'PENDING',  region: 'EU',   rating: '2.8' },
  { id: 'PR7', provider: 'marc.carry',   uid: 'U-0702', strategies: 1, followers: 198, aum: '$1.88M', winRate: '71.3%', drawdown: '3.3%',  status: 'ACTIVE',    approval: 'APPROVED', region: 'US',   rating: '4.7' },
  { id: 'PR8', provider: 'petra.news',   uid: 'U-0811', strategies: 1, followers: 63,  aum: '$410K',  winRate: '58.8%', drawdown: '9.7%',  status: 'ACTIVE',    approval: 'APPROVED', region: 'EU',   rating: '4.1' },
  { id: 'PR9', provider: 'raj.india',    uid: 'U-0920', strategies: 1, followers: 0,   aum: '$0',     winRate: '—',     drawdown: '—',     status: 'INACTIVE',  approval: 'PENDING',  region: 'APAC', rating: '—'   },
];

export const providersConfig = {
  title: 'Providers',
  tableTitle: 'Provider Directory',
  tableSubtitle: 'All registered copy trading signal providers',
  rows: PROVIDER_ROWS,
  searchFields: ['provider', 'uid', 'region', 'approval', 'status'],
  kpis: [
    { label: 'Total Providers',   value: '9',       sub: 'registered',         Icon: UserCheck, accent: 'var(--brand)'    },
    { label: 'Active',            value: '6',       sub: 'trading live',       Icon: Activity,  accent: 'var(--positive)' },
    { label: 'Pending Approval',  value: '2',       sub: 'awaiting review',    Icon: Clock,     accent: 'var(--warning)'  },
    { label: 'Suspended',         value: '1',       sub: 'restricted',         Icon: Lock,      accent: 'var(--negative)' },
    { label: 'Total AUM',         value: '$9.01M',  sub: 'across all',         Icon: Wallet,    accent: 'var(--cyan)'     },
    { label: 'Avg Rating',        value: '4.2 / 5', sub: 'follower score',     Icon: Star,      accent: 'var(--purple)'   },
  ],
  statusOpts:   ['ACTIVE', 'SUSPENDED', 'REVIEW', 'INACTIVE'],
  approvalOpts: ['APPROVED', 'PENDING'],
  regionOpts:   ['EU', 'US', 'APAC'],
  columns: [
    { key: 'provider',   label: 'Provider',   type: 'user'     },
    { key: 'strategies', label: 'Strategies', type: 'num'      },
    { key: 'followers',  label: 'Followers',  type: 'num'      },
    { key: 'aum',        label: 'AUM',        type: 'amount'   },
    { key: 'winRate',    label: 'Win Rate',   type: 'mono'     },
    { key: 'drawdown',   label: 'Drawdown',   type: 'dd'       },
    { key: 'region',     label: 'Region',     type: 'tag'      },
    { key: 'approval',   label: 'Approval',   type: 'approval' },
    { key: 'status',     label: 'Status',     type: 'status'   },
    { key: 'rating',     label: 'Rating',     type: 'rating'   },
  ],
};
