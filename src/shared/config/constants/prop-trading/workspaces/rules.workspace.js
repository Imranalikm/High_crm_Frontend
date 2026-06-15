export const defaultRules = {
  leverage: { forex: '1:100', indices: '1:20', crypto: '1:5', metals: '1:50' },
  dailyLoss: { phase1: '5%', phase2: '5%', funded: '5%', hardStop: true },
  totalLoss: { phase1: '10%', phase2: '10%', funded: '10%', hardStop: true },
  minDays: { phase1: 10, phase2: 10, funded: 0 },
  weekend: { holdingAllowed: false, autoClose: true, closeAt: 'Friday 23:00 UTC' },
  news: { tradingBlocked: true, blockWindow: 5, highImpactOnly: true },
  bannedSymbols: ['BTCUSD', 'ETHUSD', 'DOGEUSD', 'XRPUSD'],
  consistency: { minDailyTrades: 1, maxSingleTradeRisk: '2%', enabled: true },
  autoFail: { maxDD: true, dailyDD: true, minDaysViolation: true, bannedSymbol: true },
};
