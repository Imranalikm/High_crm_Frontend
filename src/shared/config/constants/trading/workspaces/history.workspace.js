import { BookOpen, TrendingUp, BarChart2, Activity, Zap, Clock } from 'lucide-react';

export const HISTORY_ROWS = [
  { id: 'H1', ticket: 'TRD-88200', user: 'k.mueller', uid: 'U-8821', symbol: 'USD/CAD', side: 'SELL', openTime: '2024-01-14 12:30', closeTime: '2024-01-14 18:20', size: '3.00', openPrice: '1.34210', closePrice: '1.33490', pnl: '+$540', status: 'WIN', account: '100142' },
  { id: 'H2', ticket: 'TRD-88180', user: 'p.sharma', uid: 'U-4102', symbol: 'EUR/USD', side: 'BUY', openTime: '2024-01-13 09:10', closeTime: '2024-01-13 14:45', size: '1.00', openPrice: '1.07910', closePrice: '1.08450', pnl: '+$540', status: 'WIN', account: '100201' },
  { id: 'H3', ticket: 'TRD-88141', user: 'f.martin', uid: 'U-7723', symbol: 'XAU/USD', side: 'BUY', openTime: '2024-01-12 07:05', closeTime: '2024-01-12 15:30', size: '0.25', openPrice: '2310.50', closePrice: '2341.00', pnl: '+$762', status: 'WIN', account: '100334' },
  { id: 'H4', ticket: 'TRD-88100', user: 'k.mueller', uid: 'U-8821', symbol: 'GBP/USD', side: 'BUY', openTime: '2024-01-11 10:00', closeTime: '2024-01-11 16:30', size: '2.00', openPrice: '1.27200', closePrice: '1.26990', pnl: '-$420', status: 'LOSS', account: '100142' },
  { id: 'H5', ticket: 'TRD-88071', user: 'n.tanaka', uid: 'U-2290', symbol: 'EUR/JPY', side: 'SELL', openTime: '2024-01-10 11:20', closeTime: '2024-01-10 19:45', size: '0.80', openPrice: '158.400', closePrice: '157.900', pnl: '-$312', status: 'LOSS', account: '100512' },
  { id: 'H6', ticket: 'TRD-88040', user: 'h.ali', uid: 'U-6640', symbol: 'USD/JPY', side: 'BUY', openTime: '2024-01-09 08:30', closeTime: '2024-01-09 13:10', size: '1.20', openPrice: '148.900', closePrice: '149.420', pnl: '+$498', status: 'WIN', account: '100701' },
  { id: 'H7', ticket: 'TRD-88010', user: 'l.chen', uid: 'U-9910', symbol: 'GBP/JPY', side: 'SELL', openTime: '2024-01-08 14:00', closeTime: '2024-01-08 22:00', size: '0.60', openPrice: '190.800', closePrice: '190.200', pnl: '+$271', status: 'WIN', account: '100600' },
  { id: 'H8', ticket: 'TRD-87990', user: 'p.sharma', uid: 'U-4102', symbol: 'XAU/USD', side: 'SELL', openTime: '2024-01-07 09:00', closeTime: '2024-01-07 17:30', size: '0.30', openPrice: '2325.00', closePrice: '2338.50', pnl: '-$405', status: 'LOSS', account: '100201' },
];

export const historyConfig = {
  title: 'Trade History',
  tableTitle: 'Completed Trades',
  tableSubtitle: 'Track completed trades.',
  rows: HISTORY_ROWS,
  searchFields: ['ticket', 'user', 'uid', 'symbol', 'account'],
  kpis: [
    { label: 'Closed Trades', value: '8', sub: 'total trades', Icon: BookOpen, accent: 'var(--brand)' },
    { label: 'Win Rate', value: '62.5%', sub: 'win rate', Icon: TrendingUp, accent: 'var(--positive)' },
    { label: 'Total P&L', value: '+$1,474', sub: 'total profit/loss', Icon: BarChart2, accent: 'var(--positive)' },
    { label: 'Avg P&L', value: '+$184', sub: 'average per trade', Icon: Activity, accent: 'var(--cyan)' },
    { label: 'Best Symbol', value: 'XAU/USD', sub: 'best asset', Icon: Zap, accent: 'var(--warning)' },
    { label: 'Avg Duration', value: '7h 15m', sub: 'average hold time', Icon: Clock, accent: 'var(--purple)' },
  ],
  symbolOpts: ['EUR/USD', 'GBP/USD', 'XAU/USD', 'USD/JPY', 'GBP/JPY', 'EUR/JPY'],
  sideOpts: ['BUY', 'SELL'],
  resultOpts: ['WIN', 'LOSS'],
  columns: [
    { key: 'ticket', label: 'Ticket', type: 'mono' },
    { key: 'user', label: 'User', type: 'user' },
    { key: 'symbol', label: 'Symbol', type: 'symbol' },
    { key: 'side', label: 'Side', type: 'side' },
    { key: 'openTime', label: 'Opened', type: 'mono' },
    { key: 'closeTime', label: 'Closed', type: 'mono' },
    { key: 'size', label: 'Size', type: 'mono' },
    { key: 'openPrice', label: 'Open Price', type: 'mono' },
    { key: 'closePrice', label: 'Close Price', type: 'mono' },
    { key: 'pnl', label: 'Profit/Loss', type: 'pnl' },
    { key: 'status', label: 'Result', type: 'result' },
  ],
};
