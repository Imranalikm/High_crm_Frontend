export const feesRows = [
  { id: 'FEE-01', challenge: 'Standard 10K', fee: '$79', refundable: true, active: true },
  { id: 'FEE-02', challenge: 'Standard 25K', fee: '$149', refundable: true, active: true },
  { id: 'FEE-03', challenge: 'Standard 50K', fee: '$249', refundable: true, active: true },
  { id: 'FEE-04', challenge: 'Standard 100K', fee: '$449', refundable: true, active: true },
  { id: 'FEE-05', challenge: 'Standard 200K', fee: '$799', refundable: true, active: true },
  { id: 'FEE-06', challenge: 'Aggressive 25K', fee: '$129', refundable: false, active: false },
  { id: 'FEE-07', challenge: 'Instant 10K', fee: '$199', refundable: false, active: true },
];

export const couponsRows = [
  { id: 'CPN-01', code: 'LAUNCH50', discount: '50%', type: 'PERCENT', uses: 248, maxUses: 500, expires: '2024-12-31', status: 'ACTIVE', campaign: 'Launch 2024' },
  { id: 'CPN-02', code: 'SAVE20', discount: '20%', type: 'PERCENT', uses: 1842, maxUses: null, expires: '2024-09-30', status: 'ACTIVE', campaign: 'Always On' },
  { id: 'CPN-03', code: 'FLAT30', discount: '$30', type: 'FLAT', uses: 92, maxUses: 100, expires: '2024-08-31', status: 'EXPIRING', campaign: 'Summer 2024' },
  { id: 'CPN-04', code: 'VIP100', discount: '$100', type: 'FLAT', uses: 14, maxUses: 50, expires: '2025-01-31', status: 'ACTIVE', campaign: 'VIP Program' },
  { id: 'CPN-05', code: 'BLACKFRI', discount: '70%', type: 'PERCENT', uses: 3210, maxUses: 3210, expires: '2023-11-25', status: 'EXPIRED', campaign: 'Black Friday 23' },
  { id: 'CPN-06', code: 'REFER15', discount: '15%', type: 'PERCENT', uses: 621, maxUses: null, expires: null, status: 'ACTIVE', campaign: 'Referral Program' },
];
