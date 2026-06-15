export const partnerTree = [
  {
    id: 'IB-001', name: 'Rehan Capital', tier: 'PLATINUM', region: 'UAE',
    referrals: 1842, commission: '$84.2K', share: '35%', status: 'ACTIVE',
    subIBs: [
      { id: 'IB-011', name: 'Gulf Markets ME', tier: 'GOLD',   region: 'SA',  referrals: 421, commission: '$18.4K', share: '28%', status: 'ACTIVE',
        subIBs: [
          { id: 'IB-021', name: 'Riyadh FX',    tier: 'SILVER', region: 'SA', referrals: 142, commission: '$5.2K', share: '22%', status: 'ACTIVE', subIBs: [] },
          { id: 'IB-022', name: 'Jeddah Trades', tier: 'BRONZE', region: 'SA', referrals: 88,  commission: '$2.8K', share: '18%', status: 'ACTIVE', subIBs: [] },
        ],
      },
      { id: 'IB-012', name: 'UAE Trader Hub', tier: 'SILVER', region: 'UAE', referrals: 284, commission: '$11.2K', share: '24%', status: 'ACTIVE',
        subIBs: [
          { id: 'IB-023', name: 'Dubai FX Pvt', tier: 'BRONZE', region: 'UAE', referrals: 94, commission: '$3.1K', share: '18%', status: 'PAUSED', subIBs: [] },
        ],
      },
    ],
  },
  {
    id: 'IB-002', name: 'Apex Markets', tier: 'GOLD', region: 'UK',
    referrals: 1521, commission: '$71.4K', share: '30%', status: 'ACTIVE',
    subIBs: [
      { id: 'IB-013', name: 'London Ref Group', tier: 'SILVER', region: 'UK', referrals: 382, commission: '$14.8K', share: '22%', status: 'ACTIVE',
        subIBs: [
          { id: 'IB-024', name: 'City FX Ltd', tier: 'BRONZE', region: 'UK', referrals: 121, commission: '$4.2K', share: '16%', status: 'ACTIVE', subIBs: [] },
        ],
      },
    ],
  },
  {
    id: 'IB-003', name: 'FinEdge Global', tier: 'GOLD', region: 'IN',
    referrals: 1284, commission: '$58.1K', share: '30%', status: 'ACTIVE',
    subIBs: [
      { id: 'IB-014', name: 'Mumbai IB Desk', tier: 'SILVER', region: 'IN', referrals: 341, commission: '$12.4K', share: '22%', status: 'ACTIVE', subIBs: [] },
      { id: 'IB-015', name: 'Delhi Referrals', tier: 'BRONZE', region: 'IN', referrals: 218, commission: '$7.8K',  share: '18%', status: 'ACTIVE', subIBs: [] },
    ],
  },
];

export const TIER_COMMISSION_SCHEDULE = [
  { tier: 'PLATINUM', share: '35%' },
  { tier: 'GOLD',     share: '30%' },
  { tier: 'SILVER',   share: '25%' },
  { tier: 'BRONZE',   share: '20%' },
  { tier: 'BASIC',    share: '15%' },
];
