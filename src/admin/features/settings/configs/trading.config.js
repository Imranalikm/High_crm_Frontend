export const INITIAL_TRADING_CONFIG = {
  forexLev: '1:100',
  indicesLev: '1:20',
  cryptoLev: '1:5',
  metalLev: '1:50',
  maxOrderSize: '100',
  minOrderSize: '0.01',
  maxDailyOrders: '500',
  maxOpenPositions: '50',
  defaultSlippage: '3',
  maxSlippage: '10',
  stopLossRequired: true,
  takeProfitRequired: false,
  marginCallLevel: '80',
  stopOutLevel: '50',
  marginModel: 'NETTING',
  tradeHoursMode: 'MARKET',
  weekendTrading: false,
  newsTrading: true,
  newsTradingBuffer: '5',
  bannedSymbols: "BTCUSD\nETHUSD",
  copyMaxRatio: '5',
  copyMinDeposit: '100',
  copyAutoClose: true,
  propPhases: 2,
  propProfitTarget: '10',
  propMaxDD: '10',
  propDailyDD: '5',
  propMinDays: '10',
};

export const LEVERAGE_OPTIONS = ['1:5', '1:10', '1:20', '1:30', '1:50', '1:100', '1:200', '1:500'];

export const MARGIN_MODEL_OPTIONS = [
  { label: 'Netting Mode', value: 'NETTING' },
  { label: 'Hedging Mode', value: 'HEDGING' },
  { label: 'Gross Margin', value: 'GROSS' },
];

export const TRADE_HOURS_MODE_OPTIONS = [
  { label: 'Follow Market Hours', value: 'MARKET' },
  { label: '24/5 (Forex standard)', value: '24_5' },
  { label: '24/7 (Crypto)', value: '24_7' },
  { label: 'Custom Schedule', value: 'CUSTOM' },
];

export const PROP_PHASES_OPTIONS = [
  { label: '1 Phase', value: '1' },
  { label: '2 Phases', value: '2' },
];
