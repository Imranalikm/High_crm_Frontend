import { Layers, Clock, Trophy, Target, CircleDollarSign, AlertOctagon } from 'lucide-react';

export const overviewKpis = [
  { label: 'Total Challenges', value: '12', Icon: Layers, color: 'var(--cyan)', trend: '+2', sub: 'Active types' },
  { label: 'Pending Reviews', value: '247', Icon: Clock, color: 'var(--warning)', trend: '+18', sub: 'Awaiting review' },
  { label: 'Funded Traders', value: '1,084', Icon: Trophy, color: 'var(--positive)', trend: '+63', sub: 'Active accounts' },
  { label: 'Pass Rate', value: '34.2%', Icon: Target, color: 'var(--brand)', trend: '+1.4%', sub: 'Last 30 days' },
  { label: 'Pending Payouts', value: '$84K', Icon: CircleDollarSign, color: 'var(--brand)', trend: '$12K new', sub: 'Awaiting payment' },
  { label: 'Risk Flags', value: '23', Icon: AlertOctagon, color: 'var(--negative)', trend: '-5', sub: 'Open alerts' },
];

export const funnelData = [
  { name: 'Applications', value: 4800, fill: 'rgba(var(--brand-rgb),0.7)' },
  { name: 'Phase 1 Pass', value: 2160, fill: 'rgba(var(--cyan-rgb,6,182,212),0.7)' },
  { name: 'Phase 2 Pass', value: 980, fill: 'rgba(74,225,118,0.7)' },
  { name: 'Funded', value: 480, fill: 'rgba(74,225,118,1)' },
];

export const payoutTrend = [
  { month: 'Jan', payouts: 42000 }, { month: 'Feb', payouts: 58000 },
  { month: 'Mar', payouts: 51000 }, { month: 'Apr', payouts: 73000 },
  { month: 'May', payouts: 89000 }, { month: 'Jun', payouts: 67000 },
  { month: 'Jul', payouts: 94000 }, { month: 'Aug', payouts: 112000 },
];

export const completionTrend = [
  { month: 'Jan', pass: 28, fail: 72 }, { month: 'Feb', pass: 31, fail: 69 },
  { month: 'Mar', pass: 29, fail: 71 }, { month: 'Apr', pass: 35, fail: 65 },
  { month: 'May', pass: 34, fail: 66 }, { month: 'Jun', pass: 38, fail: 62 },
  { month: 'Jul', pass: 34, fail: 66 }, { month: 'Aug', pass: 36, fail: 64 },
];

export const recentApprovals = [
  { id: 'FA-8831', trader: 'Marcus Chen', amount: '$50K', phase: 'Funded', ts: '2 min ago', risk: 'LOW' },
  { id: 'FA-8830', trader: 'Priya Mehta', amount: '$25K', phase: 'Funded', ts: '14 min ago', risk: 'LOW' },
  { id: 'EV-4421', trader: 'Sam Torres', amount: '$100K', phase: 'Phase 2', ts: '31 min ago', risk: 'MEDIUM' },
  { id: 'EV-4420', trader: 'Lena Braun', amount: '$10K', phase: 'Phase 1', ts: '1h ago', risk: 'LOW' },
  { id: 'EV-4419', trader: 'Ali Hassan', amount: '$200K', phase: 'Phase 1', ts: '2h ago', risk: 'HIGH' },
];
