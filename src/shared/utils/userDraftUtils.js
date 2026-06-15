import { USER_DRAFT_DEFAULTS } from '@/config/constants/USER_FORM';


function normalizeAmount(value) {
  const numericValue = Number.parseFloat(String(value ?? '').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(numericValue) ? numericValue : 0;
}

function formatCurrency(value) {
  return normalizeAmount(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function createPendingMt5Account(draft, existingLogin = 'Pending') {
  return {
    login: existingLogin,
    server: draft.mt5Server || 'Pending assignment',
    group: draft.mt5Group || 'retail_usd_std',
    leverage: draft.mt5Leverage || '1:100',
    status: existingLogin === 'Pending' ? 'PENDING' : 'CONNECTED',
    equity: `$${formatCurrency(draft.mt5Deposit || draft.initialBalance)}`,
    marginLevel: existingLogin === 'Pending' ? 'Pending' : '250%',
    lastSync: existingLogin === 'Pending' ? 'Not connected' : 'Just now',
  };
}

export function createDefaultUserDraft(overrides = {}) {
  return {
    ...USER_DRAFT_DEFAULTS,
    ...overrides,
  };
}

export function buildUserDraft(user) {
  return createDefaultUserDraft({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    country: user?.country ?? '',
    nationality: user?.country ?? '',
    address: user?.address ?? '',
    tier: user?.tier ?? 'Standard',
    segment: user?.segment ?? 'Retail FX',
    kycStatus: user?.kycStatus ?? 'PENDING',
    riskLevel: user?.riskStatus ?? 'LOW',
    fundingState: user?.fundingState ?? 'PENDING',
    initialBalance: String(normalizeAmount(user?.walletBalance)),
    autoWallet: true,
    createMt5: (user?.mt5Accounts ?? 0) > 0,
    mt5Server: user?.mt5?.[0]?.server ?? '',
    mt5Leverage: user?.mt5?.[0]?.leverage ?? '',
    mt5Group: user?.mt5?.[0]?.group ?? '',
    mt5Deposit: String(normalizeAmount(user?.mt5?.[0]?.equity ?? user?.walletBalance)),
    note: user?.notesSummary ?? '',
    ibCode: '',
  });
}

export function draftToUserPayload(draft) {
  const walletBalance = `$${formatCurrency(draft.initialBalance)}`;
  const hasMt5 = draft.createMt5;

  return {
    name: draft.name.trim(),
    email: draft.email.trim(),
    phone: draft.phone.trim(),
    country: draft.country.trim().toUpperCase(),
    address: draft.address.trim(),
    tier: draft.tier,
    segment: draft.segment,
    kycStatus: draft.kycStatus,
    riskStatus: draft.riskLevel,
    fundingState: draft.fundingState,
    walletBalance,
    equity: walletBalance,
    notesSummary: draft.note.trim() || 'Operator note not added yet.',
    source: draft.ibCode.trim() ? `Affiliate / ${draft.ibCode.trim()}` : 'Manual Admin Entry',
    mt5Accounts: hasMt5 ? 1 : 0,
    mt5: hasMt5 ? [createPendingMt5Account(draft)] : [],
    kyc: {
      level: draft.kycStatus === 'VERIFIED' ? 'Level 2' : 'Level 0',
      submittedAt: draft.kycStatus === 'PENDING' ? 'Awaiting submission' : 'Submitted by admin',
      reviewer: draft.kycStatus === 'VERIFIED' ? 'Ops Desk' : 'Pending',
      status: draft.kycStatus,
      documents: draft.kycStatus === 'VERIFIED' ? ['Passport', 'Proof of Address'] : [],
      aml: draft.kycStatus === 'VERIFIED' ? 'Cleared during onboarding review.' : 'Awaiting onboarding review.',
    },
    risk: {
      score: draft.riskLevel === 'LOW' ? '22 / 100' : draft.riskLevel === 'WATCHLIST' ? '54 / 100' : '78 / 100',
      exposure: walletBalance,
      concentration: 'Pending',
      drawdown: '0%',
      status: draft.riskLevel,
      alerts: draft.note.trim() ? [draft.note.trim()] : ['Profile waiting for operator review.'],
    },
  };
}

export function applyDraftToUser(user, draft) {
  const payload = draftToUserPayload(draft);
  const existingMt5 = user.mt5 ?? [];
  const mt5Accounts = draft.createMt5
    ? (existingMt5.length > 0 ? existingMt5 : [createPendingMt5Account(draft)])
    : existingMt5;

  return {
    ...user,
    ...payload,
    mt5: mt5Accounts,
    mt5Accounts: mt5Accounts.length,
    kyc: {
      ...user.kyc,
      ...payload.kyc,
    },
    risk: {
      ...user.risk,
      ...payload.risk,
    },
    lastSeen: 'Just now',
  };
}
