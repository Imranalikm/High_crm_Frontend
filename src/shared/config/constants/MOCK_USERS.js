export const userMetrics = [
  { label: 'Demo Metric', value: '0', subtext: 'Demo data', trend: 'up' }
];

export const users = [
  {
    id: 'usr-demo',
    uid: '0000',
    name: 'Demo User',
    email: 'demo@example.com',
    phone: '+1 555 000 0000',
    country: 'US',
    tier: 'Standard',
    segment: 'Retail',
    fundingState: 'PENDING',
    kycStatus: 'PENDING',
    riskStatus: 'LOW',
    walletBalance: '$0.00',
    equity: '$0.00',
    pnl30d: '$0.00',
    openPositions: 0,
    mt5Accounts: 0,
    registered: '2024-01-01 00:00',
    lastSeen: 'Just now',
    source: 'Demo',
    address: 'Demo Address',
    notesSummary: 'Demo structure',
    kyc: {
      level: 'Level 1',
      submittedAt: '2024-01-01 00:00',
      reviewer: 'System',
      status: 'PENDING',
      documents: ['ID'],
      aml: 'Clear',
    },
    wallet: [
      { asset: 'USD', balance: '$0.00', available: '$0.00', hold: '$0.00' }
    ],
    mt5: [
      { login: '000000', server: 'Demo', group: 'Demo', leverage: '1:100', status: 'DISCONNECTED', equity: '$0', marginLevel: 'n/a', lastSync: 'N/A' }
    ],
    tradingHistory: [
      { ticket: '000000', symbol: 'EURUSD', side: 'BUY', lots: '0.00', open: '0.000', close: '0.000', pnl: '$0', time: '2024-01-01 00:00' }
    ],
    activity: [
      { time: '00:00', actor: 'System', action: 'Account Created', channel: 'System' }
    ],
    risk: {
      score: '0 / 100',
      exposure: '$0',
      concentration: 'None',
      drawdown: '0%',
      status: 'LOW',
      alerts: [],
    },
    notes: [
      { id: 'NOTE-DEMO', author: 'System', time: '2024-01-01 00:00', text: 'Demo note' }
    ],
    tags: ['Retail FX', 'Standard'],
    sessions: [
      { id: 'sess-1', device: 'Windows 11 · Chrome Pro', ip: '192.168.1.105', location: 'Singapore (SG)', lastActive: 'Just now' },
      { id: 'sess-2', device: 'iPhone 15 · Safari Mobile', ip: '72.10.45.10', location: 'New York, US', lastActive: '3 hours ago' }
    ],
    withdrawalsBlocked: false,
    readOnlyTerminals: false,
    apiBlocked: false,
    rebateRate: 10,
    referrals: [
      { id: 'ref-1', name: 'James Carter', uid: 'U-309481', registered: '2026-04-12 11:22', volume: '14.5 lots', earnings: '$145.00' },
      { id: 'ref-2', name: 'Sophia Loren', uid: 'U-502941', registered: '2026-05-01 09:14', volume: '8.2 lots', earnings: '$82.00' }
    ],
    livePositions: [
      { ticket: '9920141', symbol: 'EURUSD', side: 'BUY', lots: '1.50', openPrice: '1.08240', livePrice: '1.08310', swaps: '-$4.50', commissions: '-$15.00', pnl: '+$105.00' },
      { ticket: '9920155', symbol: 'XAUUSD', side: 'SELL', lots: '0.50', openPrice: '2350.20', livePrice: '2351.80', swaps: '$0.00', commissions: '-$5.00', pnl: '-$80.00' }
    ],
    walletHistory: [
      { id: 'TX-49910', type: 'DEPOSIT', amount: '+$50,000.00', method: 'Bank Wire Direct', time: '2026-03-31 10:00', status: 'SUCCESS' },
      { id: 'TX-49911', type: 'WITHDRAWAL', amount: '-$5,000.00', method: 'ERC20 Wallet', time: '2026-04-20 14:15', status: 'SUCCESS' }
    ],
  }
];

export const kycQueue = [
  { id: 'KYC-DEMO', userId: 'usr-demo', user: 'Demo User', tier: 'Standard', country: 'US', status: 'PENDING', eta: 'N/A', docs: '0/0', risk: 'LOW' }
];

export const userActivityFeed = [
  { id: 'ACT-DEMO', userId: 'usr-demo', user: 'Demo User', event: 'Demo Event', source: 'System', severity: 'INFO', time: '00:00', owner: 'System' }
];

export const mt5Accounts = [
  { id: 'MT5-DEMO', login: '000000', userId: 'usr-demo', user: 'Demo User', server: 'Demo', status: 'DISCONNECTED', connection: 'N/A', group: 'Demo', leverage: '1:100', balance: '$0', lastSync: 'N/A' }
];

export const adminAuditLogs = [
  { id: 'LOG-1', author: 'System', target: 'Demo User', action: 'KYC Verification Level 1 Approved', time: '2026-05-25 10:00' }
];
