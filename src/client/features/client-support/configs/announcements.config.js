import { Monitor, Wallet, BarChart2 } from 'lucide-react';

export const ANNOUNCEMENTS = [
  {
    id: 'ann-1',
    severity: 'warning',
    Icon: Monitor,
    title: 'Scheduled Maintenance — Aug 5, 02:00–04:00 UTC',
    body: 'MT5 servers will undergo routine maintenance. Trading will be unavailable during this window. Please close or adjust positions before 01:45 UTC.',
    time: 'Aug 1, 2026',
    resolved: false,
  },
  {
    id: 'ann-2',
    severity: 'info',
    Icon: Wallet,
    title: 'New Payment Method — Binance Pay Added',
    body: 'Binance Pay is now available as a zero-fee deposit option. Minimum deposit $50. Available for all verified accounts.',
    time: 'Jul 30, 2026',
    resolved: false,
  },
  {
    id: 'ann-3',
    severity: 'success',
    Icon: BarChart2,
    title: 'Leverage Update — Crypto Instruments',
    body: 'Maximum leverage for BTC/USD and ETH/USD has been updated to 1:10 effective August 1st. Existing open positions are not affected.',
    time: 'Jul 28, 2026',
    resolved: true,
  },
];

export const INCIDENTS = [
  {
    id: 'inc-1',
    title: 'MT5 Bridge — Elevated Execution Latency',
    status: 'investigating',
    severity: 'warning',
    updates: [
      { time: '14:22 UTC', text: 'Investigating elevated execution latency on MT5 servers. Some orders may experience delays of 50–200ms.' },
      { time: '14:08 UTC', text: 'Alert: average bridge latency exceeded 150ms threshold.' },
    ],
  },
  {
    id: 'inc-2',
    title: 'Withdrawal Processing — Fully Operational',
    status: 'resolved',
    severity: 'success',
    updates: [
      { time: 'Jul 31 18:00', text: 'All withdrawal processing has returned to normal. Pending withdrawals have been submitted.' },
    ],
  },
];

/* Severity → Tailwind colour tokens */
export const SEV_STYLES = {
  warning: { text: 'text-warning',  bg: 'bg-warning/[0.07]',  border: 'border-warning/20'  },
  info:    { text: 'text-brand',    bg: 'bg-brand/[0.07]',    border: 'border-brand/20'    },
  success: { text: 'text-positive', bg: 'bg-positive/[0.07]', border: 'border-positive/20' },
  error:   { text: 'text-negative', bg: 'bg-negative/[0.07]', border: 'border-negative/20' },
};
