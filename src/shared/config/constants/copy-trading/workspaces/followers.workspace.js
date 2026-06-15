import { Activity, PauseCircle, ShieldAlert, TrendingUp, Users, Wallet } from 'lucide-react';

export const FOLLOWER_ROWS = [
  { id: 'F1', follower: 'k.mueller',  uid: 'U-8821', provider: 'alex.morgan',  strategy: 'FX Alpha Pro',     allocation: '$2,000', copyRatio: '100%', status: 'ACTIVE', pnlImpact: '+$364', lastActivity: '1h ago',  risk: 'MEDIUM' },
  { id: 'F2', follower: 'p.sharma',   uid: 'U-4102', provider: 'sarah.gold',   strategy: 'GoldRush Pro',     allocation: '$1,000', copyRatio: '50%',  status: 'ACTIVE', pnlImpact: '+$158', lastActivity: '2h ago',  risk: 'LOW'    },
  { id: 'F3', follower: 'r.james',    uid: 'U-3341', provider: 'james.eu',     strategy: 'ScalpMaster EU',   allocation: '$500',   copyRatio: '100%', status: 'PAUSED', pnlImpact: '+$47',  lastActivity: '1d ago',  risk: 'LOW'    },
  { id: 'F4', follower: 'f.martin',   uid: 'U-7723', provider: 'alex.morgan',  strategy: 'FX Alpha Pro',     allocation: '$5,000', copyRatio: '200%', status: 'ACTIVE', pnlImpact: '+$910', lastActivity: '1h ago',  risk: 'HIGH'   },
  { id: 'F5', follower: 'n.tanaka',   uid: 'U-2290', provider: 'marc.carry',   strategy: 'Safe Carry Trade', allocation: '$3,000', copyRatio: '100%', status: 'ACTIVE', pnlImpact: '+$663', lastActivity: '30m ago', risk: 'LOW'    },
  { id: 'F6', follower: 'h.ali',      uid: 'U-6640', provider: 'ken.apac',     strategy: 'AsiaPac Momentum', allocation: '$1,500', copyRatio: '75%',  status: 'ACTIVE', pnlImpact: '+$222', lastActivity: '3h ago',  risk: 'MEDIUM' },
  { id: 'F7', follower: 'l.chen',     uid: 'U-9910', provider: 'nina.swing',   strategy: 'SwingEU Long',     allocation: '$800',   copyRatio: '100%', status: 'PAUSED', pnlImpact: '-$26',  lastActivity: '3d ago',  risk: 'HIGH'   },
  { id: 'F8', follower: 's.ivanova',  uid: 'U-1123', provider: 'petra.news',   strategy: 'News Scalper',     allocation: '$600',   copyRatio: '100%', status: 'ACTIVE', pnlImpact: '+$47',  lastActivity: '45m ago', risk: 'MEDIUM' },
];

export const followersConfig = {
  title: 'Followers',
  tableTitle: 'Follower Registry',
  tableSubtitle: 'All active and paused copy followers across strategies',
  rows: FOLLOWER_ROWS,
  searchFields: ['follower', 'uid', 'provider', 'strategy', 'status'],
  kpis: [
    { label: 'Total Followers',  value: '8',       sub: 'registered',          Icon: Users,       accent: 'var(--brand)'    },
    { label: 'Active',           value: '6',       sub: 'copying live',        Icon: Activity,    accent: 'var(--positive)' },
    { label: 'Paused',           value: '2',       sub: 'copy paused',         Icon: PauseCircle, accent: 'var(--warning)'  },
    { label: 'High Risk',        value: '2',       sub: 'elevated allocation', Icon: ShieldAlert, accent: 'var(--negative)' },
    { label: 'Total Allocated',  value: '$15,400', sub: 'copy allocation',     Icon: Wallet,      accent: 'var(--cyan)'     },
    { label: 'Net Copy P&L',     value: '+$2,984', sub: 'all followers',       Icon: TrendingUp,  accent: 'var(--positive)' },
  ],
  statusOpts: ['ACTIVE', 'PAUSED'],
  riskOpts:   ['LOW', 'MEDIUM', 'HIGH'],
  columns: [
    { key: 'follower',     label: 'Follower',    type: 'user'   },
    { key: 'provider',     label: 'Provider',    type: 'mono'   },
    { key: 'strategy',     label: 'Strategy',    type: 'name'   },
    { key: 'allocation',   label: 'Allocation',  type: 'amount' },
    { key: 'copyRatio',    label: 'Ratio',       type: 'mono'   },
    { key: 'pnlImpact',    label: 'P&L Impact',  type: 'pnl'    },
    { key: 'risk',         label: 'Risk',        type: 'risk'   },
    { key: 'status',       label: 'Status',      type: 'status' },
    { key: 'lastActivity', label: 'Last Active', type: 'mono'   },
  ],
};
