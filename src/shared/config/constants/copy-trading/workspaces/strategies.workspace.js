import { Activity, Copy, ShieldAlert, TrendingUp, Users, Wallet } from 'lucide-react';

export const STRATEGY_ROWS = [
  { id: 'S1', name: 'FX Alpha Pro',       provider: 'alex.morgan',  pid: 'PRV-001', followers: 231,  copiedVolume: '$2.14M', winRate: '68.4%', drawdown: '12.4%', roi: '+18.2%', status: 'ACTIVE',    risk: 'MEDIUM', lastUpdated: '2h ago',  fee: '20%', minDeposit: '$500'   },
  { id: 'S2', name: 'GoldRush Pro',       provider: 'sarah.gold',   pid: 'PRV-002', followers: 88,   copiedVolume: '$840K',  winRate: '74.1%', drawdown: '4.1%',  roi: '+31.7%', status: 'ACTIVE',    risk: 'LOW',    lastUpdated: '14m ago', fee: '25%', minDeposit: '$1,000' },
  { id: 'S3', name: 'ScalpMaster EU',     provider: 'james.eu',     pid: 'PRV-003', followers: 314,  copiedVolume: '$3.90M', winRate: '61.2%', drawdown: '2.8%',  roi: '+9.4%',  status: 'ACTIVE',    risk: 'LOW',    lastUpdated: '5m ago',  fee: '15%', minDeposit: '$250'   },
  { id: 'S4', name: 'SwingEU Long',       provider: 'nina.swing',   pid: 'PRV-004', followers: 47,   copiedVolume: '$320K',  winRate: '52.1%', drawdown: '8.9%',  roi: '-3.2%',  status: 'SUSPENDED', risk: 'HIGH',   lastUpdated: '3d ago',  fee: '10%', minDeposit: '$500'   },
  { id: 'S5', name: 'AsiaPac Momentum',   provider: 'ken.apac',     pid: 'PRV-005', followers: 122,  copiedVolume: '$1.22M', winRate: '65.9%', drawdown: '6.2%',  roi: '+14.8%', status: 'ACTIVE',    risk: 'MEDIUM', lastUpdated: '1h ago',  fee: '20%', minDeposit: '$500'   },
  { id: 'S6', name: 'Crypto-FX Blend',    provider: 'lena.crypto',  pid: 'PRV-006', followers: 19,   copiedVolume: '$95K',   winRate: '44.0%', drawdown: '22.1%', roi: '-11.4%', status: 'REVIEW',    risk: 'HIGH',   lastUpdated: '12h ago', fee: '30%', minDeposit: '$1,000' },
  { id: 'S7', name: 'Safe Carry Trade',   provider: 'marc.carry',   pid: 'PRV-007', followers: 198,  copiedVolume: '$1.88M', winRate: '71.3%', drawdown: '3.3%',  roi: '+22.1%', status: 'ACTIVE',    risk: 'LOW',    lastUpdated: '30m ago', fee: '18%', minDeposit: '$300'   },
  { id: 'S8', name: 'News Scalper',       provider: 'petra.news',   pid: 'PRV-008', followers: 63,   copiedVolume: '$410K',  winRate: '58.8%', drawdown: '9.7%',  roi: '+7.9%',  status: 'ACTIVE',    risk: 'MEDIUM', lastUpdated: '45m ago', fee: '15%', minDeposit: '$250'   },
];

export const strategiesConfig = {
  title: 'Strategies',
  tableTitle: 'Strategy Register',
  tableSubtitle: 'All copy trading strategies — active, suspended, under review',
  rows: STRATEGY_ROWS,
  searchFields: ['name', 'provider', 'pid', 'status', 'risk'],
  kpis: [
    { label: 'Total Strategies', value: '8',      sub: 'all types',              Icon: Copy,        accent: 'var(--brand)'    },
    { label: 'Active',           value: '6',      sub: 'accepting followers',    Icon: Activity,    accent: 'var(--positive)' },
    { label: 'Total Followers',  value: '1,082',  sub: 'across all strategies',  Icon: Users,       accent: 'var(--cyan)'     },
    { label: 'Copied Volume',    value: '$9.01M', sub: 'total AUM',              Icon: Wallet,      accent: 'var(--purple)'   },
    { label: 'Avg Win Rate',     value: '62.0%',  sub: 'platform average',       Icon: TrendingUp,  accent: 'var(--positive)' },
    { label: 'Under Review',     value: '1',      sub: 'flagged strategies',     Icon: ShieldAlert, accent: 'var(--warning)'  },
  ],
  statusOpts:  ['ACTIVE', 'SUSPENDED', 'REVIEW', 'INACTIVE'],
  riskOpts:    ['LOW', 'MEDIUM', 'HIGH'],
  columns: [
    { key: 'name',         label: 'Strategy',    type: 'name'   },
    { key: 'provider',     label: 'Provider',    type: 'mono'   },
    { key: 'followers',    label: 'Followers',   type: 'num'    },
    { key: 'copiedVolume', label: 'Copied Vol',  type: 'amount' },
    { key: 'roi',          label: 'ROI',         type: 'pnl'    },
    { key: 'winRate',      label: 'Win Rate',    type: 'mono'   },
    { key: 'drawdown',     label: 'Drawdown',    type: 'dd'     },
    { key: 'risk',         label: 'Risk',        type: 'risk'   },
    { key: 'status',       label: 'Status',      type: 'status' },
    { key: 'lastUpdated',  label: 'Updated',     type: 'mono'   },
  ],
};

export const strPerf = [
  { m:'Jan', roi:4.2, dd:-1.1 },{ m:'Feb', roi:6.8, dd:-2.4 },{ m:'Mar', roi:3.1, dd:-3.8 },
  { m:'Apr', roi:8.2, dd:-1.8 },{ m:'May', roi:5.4, dd:-2.2 },{ m:'Jun', roi:7.1, dd:-1.4 },
  { m:'Jul', roi:9.4, dd:-3.1 },{ m:'Aug', roi:6.2, dd:-2.0 },
];

export const strActivityLog = [
  { ts:'2024-08-01 14:22', event:'STATUS_CHANGE',  detail:'Strategy status PAUSED → ACTIVE',        by:'admin@sys' },
  { ts:'2024-08-01 10:12', event:'FEE_UPDATE',     detail:'Performance fee updated 18% → 20%',      by:'admin@sys' },
  { ts:'2024-07-31 18:00', event:'FOLLOWER_JOIN',  detail:'New follower UID-8821 subscribed',        by:'system'    },
  { ts:'2024-07-30 09:00', event:'RISK_REVIEW',    detail:'Risk profile reviewed — LOW maintained',  by:'Keiran L.' },
  { ts:'2024-07-28 14:44', event:'PUBLISH',        detail:'Strategy published to marketplace',       by:'admin@sys' },
];
