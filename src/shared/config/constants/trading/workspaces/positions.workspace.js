import { Activity, Layers, TrendingUp, ShieldAlert, Clock, BarChart2 } from 'lucide-react';

export const POSITION_ROWS = [
  { id: 'P1', ticket: 'POS-88421', user: 'k.mueller', uid: 'U-8821', symbol: 'EUR/USD', side: 'BUY', size: '2.00', openPrice: '1.08312', currPrice: '1.08445', pnl: '+$342', swap: '-$1.20', margin: '$1,083', duration: '1h 12m' },
  { id: 'P2', ticket: 'POS-88308', user: 'p.sharma', uid: 'U-4102', symbol: 'XAU/USD', side: 'SELL', size: '0.50', openPrice: '2341.00', currPrice: '2338.50', pnl: '+$125', swap: '-$0.80', margin: '$585', duration: '2h 04m' },
  { id: 'P3', ticket: 'POS-88201', user: 'k.mueller', uid: 'U-8821', symbol: 'GBP/JPY', side: 'BUY', size: '1.20', openPrice: '189.450', currPrice: '189.210', pnl: '-$88', swap: '$0.00', margin: '$454', duration: '3h 40m' },
  { id: 'P4', ticket: 'POS-88190', user: 'f.martin', uid: 'U-7723', symbol: 'USD/CAD', side: 'SELL', size: '3.00', openPrice: '1.34210', currPrice: '1.34890', pnl: '-$215', swap: '-$2.10', margin: '$1,006', duration: '4h 20m' },
  { id: 'P5', ticket: 'POS-88155', user: 'n.tanaka', uid: 'U-2290', symbol: 'USD/JPY', side: 'BUY', size: '1.50', openPrice: '149.812', currPrice: '149.831', pnl: '+$19', swap: '-$0.60', margin: '$449', duration: '1h 55m' },
  { id: 'P6', ticket: 'POS-88110', user: 'h.ali', uid: 'U-6640', symbol: 'EUR/USD', side: 'SELL', size: '1.00', openPrice: '1.08550', currPrice: '1.08445', pnl: '+$105', swap: '-$0.40', margin: '$542', duration: '5h 08m' },
];

export const positionsConfig = {
  title: 'Positions',
  tableTitle: 'All Positions',
  tableSubtitle: 'Track live positions.',
  rows: POSITION_ROWS,
  searchFields: ['ticket', 'user', 'uid', 'symbol'],
  kpis: [
    { label: 'Open Positions', value: '6', sub: 'active now', Icon: Activity, accent: 'var(--positive)' },
    { label: 'Total Exposure', value: '$9.30M', sub: 'total exposure', Icon: Layers, accent: 'var(--brand)' },
    { label: 'Profit/Loss', value: '+$288', sub: 'profit/loss', Icon: TrendingUp, accent: 'var(--positive)' },
    { label: 'Total Margin', value: '$4,119', sub: 'margin in use', Icon: ShieldAlert, accent: 'var(--warning)' },
    { label: 'Avg Duration', value: '3h 02m', sub: 'average hold time', Icon: Clock, accent: 'var(--cyan)' },
    { label: 'Long / Short', value: '4 / 2', sub: 'buy / sell ratio', Icon: BarChart2, accent: 'var(--purple)' },
  ],
  symbolOpts: ['EUR/USD', 'GBP/JPY', 'XAU/USD', 'USD/CAD', 'USD/JPY'],
  sideOpts: ['BUY', 'SELL'],
  profitOpts: ['Profit', 'Loss'],
  columns: [
    { key: 'ticket', label: 'Ticket', type: 'mono' },
    { key: 'user', label: 'User', type: 'user' },
    { key: 'symbol', label: 'Symbol', type: 'symbol' },
    { key: 'side', label: 'Side', type: 'side' },
    { key: 'size', label: 'Size', type: 'mono' },
    { key: 'openPrice', label: 'Open', type: 'mono' },
    { key: 'currPrice', label: 'Current', type: 'mono' },
    { key: 'pnl', label: 'Profit/Loss', type: 'pnl' },
    { key: 'swap', label: 'Swap', type: 'mono' },
    { key: 'margin', label: 'Margin', type: 'mono' },
    { key: 'duration', label: 'Duration', type: 'mono' },
  ],
};
