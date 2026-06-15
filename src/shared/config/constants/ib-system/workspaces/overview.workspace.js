import { CircleDollarSign, Target, TrendingUp, UserMinus, Users, Wallet } from 'lucide-react';

export const overviewKpis = [
  { label: 'Total IB Partners',    value: '2,841',  Icon: Users,           accent: 'var(--cyan)',     trend: '+124',   trendUp: true,  sub: 'All registered IBs'        },
  { label: 'Active Partners',      value: '1,607',  Icon: Users,           accent: 'var(--positive)', trend: '+38',    trendUp: true,  sub: 'Traded last 30 days'       },
  { label: 'Total Referrals',      value: '48,302', Icon: Users,           accent: 'var(--brand)',    trend: '+1,240', trendUp: true,  sub: 'Lifetime referred users'   },
  { label: 'Approved Commissions', value: '$1.84M', Icon: CircleDollarSign,accent: 'var(--brand)',    trend: '+$126K', trendUp: true,  sub: 'MTD approved'              },
  { label: 'Pending Payouts',      value: '$284K',  Icon: Wallet,          accent: 'var(--warning)',  trend: '42 req',                 sub: 'Awaiting disbursement'     },
  { label: 'Monthly IB Revenue',   value: '$2.1M',  Icon: TrendingUp,      accent: 'var(--positive)', trend: '+8.4%',  trendUp: true,  sub: 'vs previous month'        },
];

export const perfKpis = [
  { label: 'Partner Growth',   value: '+18.4%', Icon: TrendingUp,       accent: 'var(--positive)', trend: '+3.1%',  trendUp: true  },
  { label: 'Referral Conv.',   value: '6.2%',   Icon: Target,           accent: 'var(--cyan)',     trend: '+0.4%',  trendUp: true  },
  { label: 'Commission Vol.',  value: '$2.1M',  Icon: CircleDollarSign, accent: 'var(--brand)',    trend: '+$286K', trendUp: true  },
  { label: 'Active Downlines', value: '14,840', Icon: Users,            accent: 'var(--brand)',    trend: '+1,204', trendUp: true  },
  { label: 'Churn Rate',       value: '4.1%',   Icon: UserMinus,        accent: 'var(--negative)', trend: '-0.6%',  trendUp: false },
  { label: 'Payout Ratio',     value: '82.4%',  Icon: Wallet,           accent: 'var(--warning)',  trend: '+1.2%',  trendUp: true  },
];

export const referralGrowth = [
  { month: 'Jan', referrals: 3200, active: 1820 }, { month: 'Feb', referrals: 3850, active: 2100 },
  { month: 'Mar', referrals: 3640, active: 1980 }, { month: 'Apr', referrals: 4320, active: 2460 },
  { month: 'May', referrals: 5100, active: 2880 }, { month: 'Jun', referrals: 4780, active: 2640 },
  { month: 'Jul', referrals: 5620, active: 3110 }, { month: 'Aug', referrals: 6240, active: 3480 },
];

export const commissionTrend = [
  { month: 'Jan', approved: 148000, pending: 34000 }, { month: 'Feb', approved: 182000, pending: 41000 },
  { month: 'Mar', approved: 164000, pending: 38000 }, { month: 'Apr', approved: 210000, pending: 52000 },
  { month: 'May', approved: 248000, pending: 61000 }, { month: 'Jun', approved: 224000, pending: 48000 },
  { month: 'Jul', approved: 276000, pending: 58000 }, { month: 'Aug', approved: 312000, pending: 72000 },
];

export const perfTrend = [
  { month: 'Jan', partners: 2420, churned: 88 }, { month: 'Feb', partners: 2510, churned: 92 },
  { month: 'Mar', partners: 2580, churned: 76 }, { month: 'Apr', partners: 2680, churned: 84 },
  { month: 'May', partners: 2720, churned: 68 }, { month: 'Jun', partners: 2760, churned: 72 },
  { month: 'Jul', partners: 2800, churned: 61 }, { month: 'Aug', partners: 2841, churned: 58 },
];

export const tierDistrib = [
  { name: 'PLATINUM', value: 42,   color: '#e5c07b' },
  { name: 'GOLD',     value: 184,  color: '#d4a843' },
  { name: 'SILVER',   value: 521,  color: '#a0aec0' },
  { name: 'BRONZE',   value: 842,  color: '#cd7f32' },
  { name: 'BASIC',    value: 1252, color: 'rgba(255,255,255,0.2)' },
];

export const topPartners = [
  { id: 'IB-001', name: 'Rehan Capital',  region: 'UAE',   referrals: 1842, revenue: '$84,200', tier: 'PLATINUM', trend: '+12%' },
  { id: 'IB-002', name: 'Apex Markets',   region: 'UK',    referrals: 1521, revenue: '$71,400', tier: 'GOLD',     trend: '+8%'  },
  { id: 'IB-003', name: 'FinEdge Global', region: 'India', referrals: 1284, revenue: '$58,100', tier: 'GOLD',     trend: '+14%' },
  { id: 'IB-004', name: 'TradeBridge SG', region: 'SG',    referrals: 1102, revenue: '$49,600', tier: 'SILVER',   trend: '+5%'  },
  { id: 'IB-005', name: 'Euro IB Net',    region: 'DE',    referrals: 948,  revenue: '$42,300', tier: 'SILVER',   trend: '-2%'  },
];

export const payoutAlerts = [
  { id: 'PAY-9041', partner: 'Rehan Capital', amount: '$18,400', risk: 'LOW',  ts: '3 min ago',  urgent: false },
  { id: 'PAY-9040', partner: 'NewEdge SRL',   amount: '$3,200',  risk: 'HIGH', ts: '22 min ago', urgent: true  },
  { id: 'PAY-9039', partner: 'Apex Markets',  amount: '$12,900', risk: 'LOW',  ts: '1h ago',     urgent: false },
  { id: 'PAY-9038', partner: 'unknown-IB-812',amount: '$8,100',  risk: 'HIGH', ts: '2h ago',     urgent: true  },
];

export const topPerformers = [
  { name: 'Rehan Capital',  region: 'UAE', referrals: 1842, revenue: '$84,200', growth: '+12%', tier: 'PLATINUM' },
  { name: 'Apex Markets',   region: 'UK',  referrals: 1521, revenue: '$71,400', growth: '+8%',  tier: 'GOLD'     },
  { name: 'FinEdge Global', region: 'IN',  referrals: 1284, revenue: '$58,100', growth: '+14%', tier: 'GOLD'     },
  { name: 'TradeBridge SG', region: 'SG',  referrals: 1102, revenue: '$49,600', growth: '+5%',  tier: 'SILVER'   },
  { name: 'Euro IB Net',    region: 'DE',  referrals: 948,  revenue: '$42,300', growth: '-2%',  tier: 'SILVER'   },
];

export const lowPerformers = [
  { name: 'Atlas IB Group', region: 'ZA', referrals: 214, revenue: '$2,100', growth: '-18%', tier: 'BASIC'  },
  { name: 'Sunrise KE IB',  region: 'KE', referrals: 142, revenue: '$980',   growth: '-11%', tier: 'BASIC'  },
  { name: 'Pacific Refs',   region: 'AU', referrals: 408, revenue: '$4,200', growth: '-8%',  tier: 'BRONZE' },
];
