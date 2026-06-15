import { Clock, CheckCircle2, XCircle, X, BarChart2, Cpu } from 'lucide-react';

export const ORDER_ROWS = [
  { id: 'O1', ticket: 'ORD-88501', user: 'k.mueller', uid: 'U-8821', symbol: 'EUR/USD', side: 'BUY', orderType: 'LIMIT', volume: '2.00', price: '1.08200', sl: '1.07800', tp: '1.08900', status: 'PENDING', time: '09:14 UTC', source: 'Terminal' },
  { id: 'O2', ticket: 'ORD-88498', user: 'p.sharma', uid: 'U-4102', symbol: 'GBP/USD', side: 'SELL', orderType: 'MARKET', volume: '1.00', price: '1.26874', sl: '1.27400', tp: '1.26200', status: 'FILLED', time: '09:08 UTC', source: 'API' },
  { id: 'O3', ticket: 'ORD-88495', user: 'f.martin', uid: 'U-7723', symbol: 'XAU/USD', side: 'BUY', orderType: 'STOP', volume: '0.50', price: '2345.00', sl: '2330.00', tp: '2370.00', status: 'PENDING', time: '09:02 UTC', source: 'Terminal' },
  { id: 'O4', ticket: 'ORD-88491', user: 'n.tanaka', uid: 'U-2290', symbol: 'USD/JPY', side: 'BUY', orderType: 'MARKET', volume: '1.50', price: '149.812', sl: '149.200', tp: '150.500', status: 'FILLED', time: '08:50 UTC', source: 'MT5 App' },
  { id: 'O5', ticket: 'ORD-88488', user: 'l.chen', uid: 'U-9910', symbol: 'EUR/USD', side: 'SELL', orderType: 'LIMIT', volume: '3.00', price: '1.08600', sl: '1.09000', tp: '1.07900', status: 'CANCELED', time: '08:44 UTC', source: 'Terminal' },
  { id: 'O6', ticket: 'ORD-88481', user: 'h.ali', uid: 'U-6640', symbol: 'BTC/USD', side: 'BUY', orderType: 'MARKET', volume: '0.10', price: '42100.0', sl: '41500.0', tp: '43000.0', status: 'REJECTED', time: '08:31 UTC', source: 'API' },
  { id: 'O7', ticket: 'ORD-88470', user: 'k.mueller', uid: 'U-8821', symbol: 'GBP/JPY', side: 'BUY', orderType: 'STOP', volume: '1.20', price: '190.000', sl: '189.200', tp: '191.500', status: 'FILLED', time: '08:12 UTC', source: 'Terminal' },
  { id: 'O8', ticket: 'ORD-88460', user: 'p.sharma', uid: 'U-4102', symbol: 'EUR/JPY', side: 'SELL', orderType: 'LIMIT', volume: '0.80', price: '160.500', sl: '161.200', tp: '159.000', status: 'PENDING', time: '07:55 UTC', source: 'API' },
];

export const ordersConfig = {
  title: 'Orders',
  tableTitle: 'All Orders',
  tableSubtitle: 'Track orders.',
  rows: ORDER_ROWS,
  searchFields: ['ticket', 'user', 'uid', 'symbol', 'orderType', 'source'],
  kpis: [
    { label: 'Pending', value: '3', sub: 'pending orders', Icon: Clock, accent: 'var(--warning)' },
    { label: 'Filled', value: '3', sub: 'completed today', Icon: CheckCircle2, accent: 'var(--positive)' },
    { label: 'Rejected', value: '1', sub: 'declined today', Icon: XCircle, accent: 'var(--negative)' },
    { label: 'Canceled', value: '1', sub: 'canceled today', Icon: X, accent: 'var(--text-muted)' },
    { label: 'Volume', value: '11.1 lots', sub: 'lots traded today', Icon: BarChart2, accent: 'var(--brand)' },
    { label: 'API Orders', value: '3', sub: 'automated', Icon: Cpu, accent: 'var(--purple)' },
  ],
  symbolOpts: ['EUR/USD', 'GBP/USD', 'XAU/USD', 'USD/JPY', 'BTC/USD', 'GBP/JPY', 'EUR/JPY'],
  sideOpts: ['BUY', 'SELL'],
  typeOpts: ['MARKET', 'LIMIT', 'STOP'],
  statusOpts: ['PENDING', 'FILLED', 'CANCELED', 'REJECTED'],
  sourceOpts: ['Terminal', 'API', 'MT5 App'],
  columns: [
    { key: 'ticket', label: 'Ticket', type: 'mono' },
    { key: 'user', label: 'User', type: 'user' },
    { key: 'symbol', label: 'Symbol', type: 'symbol' },
    { key: 'side', label: 'Side', type: 'side' },
    { key: 'orderType', label: 'Type', type: 'tag' },
    { key: 'volume', label: 'Volume', type: 'mono' },
    { key: 'price', label: 'Price', type: 'mono' },
    { key: 'sl', label: 'SL', type: 'mono' },
    { key: 'tp', label: 'TP', type: 'mono' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'time', label: 'Time', type: 'mono' },
  ],
};
