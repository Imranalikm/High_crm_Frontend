export const INITIAL_KYC_CONFIG = {
  kycProvider: 'SUMSUB',
  autoApproveEnabled: false,
  autoApproveThreshold: '80',
  manualReviewHighRisk: true,
  amlScanEnabled: true,
  amlProvider: 'REFINITIV',
  pepScanEnabled: true,
  sanctionsScan: true,
  riskThreshold: 'MEDIUM',
  resubmissionAllowed: true,
 ResubmissionDays: '30',
  docs: { passport: true, national_id: true, driving_license: true, utility_bill: true, bank_statement: true, selfie: true },
  levels: { basic: 'EMAIL_ONLY', standard: 'PHOTO_ID', advanced: 'ID+ADDRESS+SELFIE', vip: 'FULL_ENHANCED' },
  restrictions: { blocked: ['KP', 'IR', 'SY', 'CU'], enhanced: ['RU', 'BY', 'VE', 'MM'] },
};

export const KYC_PROVIDERS = ['SUMSUB', 'ONFIDO', 'JUMIO', 'MANUAL_ONLY'];

export const AML_PROVIDERS = ['REFINITIV', 'COMPLYADVANTAGE', 'LexisNexis', 'MANUAL_ONLY'];

export const RISK_TOLERANCE_OPTIONS = [
  { label: 'Low (Strict)', value: 'LOW' },
  { label: 'Medium (Default)', value: 'MEDIUM' },
  { label: 'High (Flexible)', value: 'HIGH' },
];

export const KYC_TIERS_LIST = [
  { level: 'Tier 1: Basic', desc: 'Email and phone verification only', requirements: ['Email OTP', 'Phone verification'], limits: 'Max $1,000 deposits' },
  { level: 'Tier 2: Standard', desc: 'Government photo ID check', requirements: ['Passport / National ID', 'Driving License'], limits: 'Max $10,000 deposits' },
  { level: 'Tier 3: Advanced', desc: 'Address proof and live selfie check', requirements: ['Utility Bill / Bank Statement', 'Live Selfie'], limits: 'Max $100,000 deposits' },
  { level: 'Tier 4: VIP', desc: 'Full review with source of wealth', requirements: ['Source of Funds Proof', 'Manual compliance review'], limits: 'Unlimited deposits / withdrawals' },
];
