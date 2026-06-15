export const USER_DRAFT_DEFAULTS = {
  name: '',
  email: '',
  phone: '',
  country: '',
  nationality: '',
  address: '',
  tier: 'Standard',
  segment: 'Retail FX',
  kycStatus: 'PENDING',
  riskLevel: 'LOW',
  fundingState: 'PENDING',
  initialBalance: '',
  autoWallet: true,
  createMt5: false,
  mt5Server: '',
  mt5Leverage: '',
  mt5Group: '',
  mt5Deposit: '',
  note: '',
  ibCode: '',
  password: '',
  confirmPassword: '',
};

export const KYC_OPTIONS = [
  { value: 'VERIFIED', label: 'Verified' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
];

export const RISK_OPTIONS = [
  { value: 'LOW', label: 'Low' },
  { value: 'WATCHLIST', label: 'Watchlist' },
  { value: 'ELEVATED', label: 'Elevated' },
  { value: 'FLAGGED', label: 'Flagged' },
];

export const FUNDING_OPTIONS = [
  { value: 'FUNDED', label: 'Funded' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'RESTRICTED', label: 'Restricted' },
  { value: 'UNFUNDED', label: 'Unfunded' },
];

export const TIER_OPTIONS = ['Standard', 'Prime', 'Institutional', 'VIP', 'Partner'];
export const SEGMENT_OPTIONS = ['Retail FX', 'Institutional Copy', 'Prop Trader', 'IB Partner', 'MAM Manager'];
export const LEVERAGE_OPTIONS = ['1:10', '1:30', '1:50', '1:100', '1:200', '1:500'];
export const SERVER_OPTIONS = ['MT5-LIVE-EU1', 'MT5-LIVE-EU2', 'MT5-LIVE-APAC', 'MT5-DEMO'];
