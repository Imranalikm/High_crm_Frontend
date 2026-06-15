import {
  BarChart2, CircleDollarSign, GitBranch, TrendingUp, UserPlus, Wallet,
} from 'lucide-react';

export const STATUS_CLR = {
  ACTIVE: 'var(--positive)', PAUSED: 'var(--warning)', SUSPENDED: 'var(--negative)',
  PENDING: 'var(--warning)', REVIEW: 'var(--cyan)',    APPROVED: 'var(--positive)',
  REJECTED: 'var(--negative)', SETTLED: 'var(--positive)', HELD: 'var(--warning)',
  PAID: 'var(--positive)', PROCESSING: 'var(--cyan)', FROZEN: 'var(--negative)',
  VERIFIED: 'var(--positive)', FAILED: 'var(--negative)',
};

export const TIER_CLR = {
  PLATINUM: '#e5c07b', GOLD: '#d4a843', SILVER: '#a0aec0',
  BRONZE: '#cd7f32',   BASIC: 'rgba(255,255,255,0.4)',
};

export const NAV_ITEMS = [
  { id: 'overview',     path: '/ib-system/overview',    label: 'Overview',       Icon: BarChart2        },
  { id: 'referrals',   path: '/ib-system/referrals',   label: 'Referrals',      Icon: UserPlus         },
  { id: 'commissions', path: '/ib-system/commissions', label: 'Commissions',    Icon: CircleDollarSign },
  { id: 'payouts',     path: '/ib-system/payouts',     label: 'Payouts',        Icon: Wallet, badge: 42 },
  { id: 'performance', path: '/ib-system/performance', label: 'IB Performance', Icon: TrendingUp       },
  { id: 'tree',        path: '/ib-system/tree',        label: 'Partner Tree',   Icon: GitBranch        },
];
