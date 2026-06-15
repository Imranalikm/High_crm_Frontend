import { BarChart2, CheckCircle2, ShieldAlert, Star, TrendingUp, Zap } from 'lucide-react';

export const PERFORMANCE_ROWS = [
  { id: 'PF1', strategy: 'Safe Carry Trade',  provider: 'marc.carry',  copiedPnl: '+$14,820', winRate: '71.3%', drawdown: '3.3%',  followers: 198, trend: 'UP',   monthlyGrowth: '+22.1%', sharpe: '2.4'  },
  { id: 'PF2', strategy: 'GoldRush Pro',      provider: 'sarah.gold',  copiedPnl: '+$11,240', winRate: '74.1%', drawdown: '4.1%',  followers: 88,  trend: 'UP',   monthlyGrowth: '+31.7%', sharpe: '3.1'  },
  { id: 'PF3', strategy: 'FX Alpha Pro',       provider: 'alex.morgan', copiedPnl: '+$8,940',  winRate: '68.4%', drawdown: '12.4%', followers: 231, trend: 'UP',   monthlyGrowth: '+18.2%', sharpe: '1.8'  },
  { id: 'PF4', strategy: 'AsiaPac Momentum',  provider: 'ken.apac',    copiedPnl: '+$7,210',  winRate: '65.9%', drawdown: '6.2%',  followers: 122, trend: 'UP',   monthlyGrowth: '+14.8%', sharpe: '2.1'  },
  { id: 'PF5', strategy: 'ScalpMaster EU',    provider: 'james.eu',    copiedPnl: '+$5,840',  winRate: '61.2%', drawdown: '2.8%',  followers: 314, trend: 'FLAT', monthlyGrowth: '+9.4%',  sharpe: '1.5'  },
  { id: 'PF6', strategy: 'News Scalper',      provider: 'petra.news',  copiedPnl: '+$3,240',  winRate: '58.8%', drawdown: '9.7%',  followers: 63,  trend: 'DOWN', monthlyGrowth: '+7.9%',  sharpe: '1.2'  },
  { id: 'PF7', strategy: 'SwingEU Long',      provider: 'nina.swing',  copiedPnl: '-$1,540',  winRate: '52.1%', drawdown: '8.9%',  followers: 47,  trend: 'DOWN', monthlyGrowth: '-3.2%',  sharpe: '0.4'  },
  { id: 'PF8', strategy: 'Crypto-FX Blend',   provider: 'lena.crypto', copiedPnl: '-$3,080',  winRate: '44.0%', drawdown: '22.1%', followers: 19,  trend: 'DOWN', monthlyGrowth: '-11.4%', sharpe: '-0.8' },
];

export const performanceConfig = {
  title: 'Performance',
  tableTitle: 'Strategy Performance Board',
  tableSubtitle: 'Ranked by total copied P&L across all followers',
  rows: PERFORMANCE_ROWS,
  searchFields: ['strategy', 'provider'],
  kpis: [
    { label: 'Total Copied P&L', value: '+$46,710', sub: 'all followers',          Icon: TrendingUp,  accent: 'var(--positive)' },
    { label: 'Monthly Growth',   value: '+14.8%',   sub: 'platform avg',           Icon: BarChart2,   accent: 'var(--brand)'    },
    { label: 'Top Provider',     value: 'sarah.gold',sub: '74.1% win rate',        Icon: Star,        accent: 'var(--warning)'  },
    { label: 'Max Drawdown',     value: '22.1%',    sub: 'Crypto-FX Blend',        Icon: ShieldAlert, accent: 'var(--negative)' },
    { label: 'Success Rate',     value: '75%',      sub: 'profitable strategies',  Icon: CheckCircle2,accent: 'var(--positive)' },
    { label: 'Avg Sharpe',       value: '1.84',     sub: 'risk-adjusted return',   Icon: Zap,         accent: 'var(--purple)'   },
  ],
  trendOpts: ['UP', 'FLAT', 'DOWN'],
  columns: [
    { key: 'strategy',      label: 'Strategy',     type: 'name'   },
    { key: 'provider',      label: 'Provider',     type: 'mono'   },
    { key: 'copiedPnl',     label: 'Copied P&L',  type: 'pnl'    },
    { key: 'monthlyGrowth', label: 'Monthly',      type: 'pnl'    },
    { key: 'winRate',       label: 'Win Rate',     type: 'mono'   },
    { key: 'drawdown',      label: 'Drawdown',     type: 'dd'     },
    { key: 'sharpe',        label: 'Sharpe',       type: 'sharpe' },
    { key: 'followers',     label: 'Followers',    type: 'num'    },
    { key: 'trend',         label: 'Trend',        type: 'trend'  },
  ],
};

export const growth = [
  { m:'Jan', apex:4.2, gold:2.1, finedge:1.8 },{ m:'Feb', apex:6.8, gold:3.4, finedge:2.6 },
  { m:'Mar', apex:3.1, gold:1.8, finedge:3.2 },{ m:'Apr', apex:8.2, gold:4.2, finedge:2.8 },
  { m:'May', apex:5.4, gold:3.1, finedge:2.2 },{ m:'Jun', apex:7.1, gold:2.8, finedge:3.8 },
  { m:'Jul', apex:9.4, gold:5.6, finedge:2.4 },{ m:'Aug', apex:6.2, gold:3.2, finedge:1.6 },
];

export const dd = [
  { m:'Jan', apex:-1.1, gold:-2.4, finedge:-1.8 },{ m:'Feb', apex:-2.4, gold:-3.1, finedge:-2.2 },
  { m:'Mar', apex:-3.8, gold:-4.2, finedge:-3.4 },{ m:'Apr', apex:-1.8, gold:-2.8, finedge:-2.0 },
  { m:'May', apex:-2.2, gold:-3.4, finedge:-2.8 },{ m:'Jun', apex:-1.4, gold:-2.1, finedge:-1.6 },
  { m:'Jul', apex:-3.1, gold:-3.8, finedge:-2.4 },{ m:'Aug', apex:-2.0, gold:-2.6, finedge:-2.1 },
];
