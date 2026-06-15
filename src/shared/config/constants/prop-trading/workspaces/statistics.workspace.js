import { Users, CheckCircle2, XCircle, TrendingUp, Clock, CircleDollarSign } from 'lucide-react';

export const statsKpis = [
  { label: 'Applications', value: '14,820', Icon: Users, color: 'var(--cyan)', trend: '+8.2%' },
  { label: 'Pass Rate', value: '34.2%', Icon: CheckCircle2, color: 'var(--positive)', trend: '+1.4%' },
  { label: 'Fail Rate', value: '65.8%', Icon: XCircle, color: 'var(--negative)', trend: '-1.4%' },
  { label: 'Conversion', value: '10.0%', Icon: TrendingUp, color: 'var(--brand)', trend: '+0.6%' },
  { label: 'Avg. Days', value: '16.3d', Icon: Clock, color: 'var(--warning)', trend: '-1.2d' },
  { label: 'Total Payouts', value: '$2.4M', Icon: CircleDollarSign, color: 'var(--brand)', trend: '+$340K' },
];

export const appTrend = [
  { month: 'Jan', apps: 1200, funded: 128 }, { month: 'Feb', apps: 1450, funded: 154 },
  { month: 'Mar', apps: 1320, funded: 139 }, { month: 'Apr', apps: 1680, funded: 182 },
  { month: 'May', apps: 1900, funded: 196 }, { month: 'Jun', apps: 1740, funded: 178 },
  { month: 'Jul', apps: 2100, funded: 214 }, { month: 'Aug', apps: 2430, funded: 253 },
];

export const challengeStats = [
  { name: 'Standard 10K', apps: 4200, pass: 38, fail: 62, funded: 248, revenue: '$331,800' },
  { name: 'Standard 25K', apps: 3100, pass: 35, fail: 65, funded: 162, revenue: '$461,900' },
  { name: 'Standard 50K', apps: 2100, pass: 31, fail: 69, funded: 98, revenue: '$523,900' },
  { name: 'Standard 100K', apps: 1100, pass: 28, fail: 72, funded: 41, revenue: '$494,900' },
  { name: 'Standard 200K', apps: 420, pass: 24, fail: 76, funded: 14, revenue: '$335,580' },
  { name: 'Instant 10K', apps: 320, pass: 42, fail: 58, funded: 23, revenue: '$63,680' },
];
