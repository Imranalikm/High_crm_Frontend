export const payoutsRows = [
  { id: 'PAY-9041', partner: 'Rehan Capital',   amount: '$18,400', method: 'Bank Wire',   status: 'PENDING',    requestedAt: '2024-08-01 14:22', processedBy: '—',   risk: 'LOW'    },
  { id: 'PAY-9040', partner: 'NewEdge SRL',      amount: '$3,200',  method: 'Crypto USDT', status: 'REVIEW',     requestedAt: '2024-08-01 13:41', processedBy: '—',   risk: 'HIGH'   },
  { id: 'PAY-9039', partner: 'Apex Markets',     amount: '$12,900', method: 'Bank Wire',   status: 'PENDING',    requestedAt: '2024-08-01 11:05', processedBy: '—',   risk: 'LOW'    },
  { id: 'PAY-9038', partner: 'unknown-IB-812',   amount: '$8,100',  method: 'Crypto BTC',  status: 'FROZEN',     requestedAt: '2024-08-01 08:30', processedBy: 'Auto',risk: 'HIGH'   },
  { id: 'PAY-9037', partner: 'FinEdge Global',   amount: '$9,600',  method: 'Bank Wire',   status: 'PROCESSING', requestedAt: '2024-07-31 17:14', processedBy: 'AR',  risk: 'LOW'    },
  { id: 'PAY-9036', partner: 'TradeBridge SG',   amount: '$6,200',  method: 'Bank Wire',   status: 'PAID',       requestedAt: '2024-07-31 09:00', processedBy: 'KL',  risk: 'LOW'    },
  { id: 'PAY-9035', partner: 'Euro IB Net',      amount: '$4,800',  method: 'Skrill',      status: 'PAID',       requestedAt: '2024-07-30 12:30', processedBy: 'AR',  risk: 'LOW'    },
  { id: 'PAY-9034', partner: 'Nile Trading EG',  amount: '$2,100',  method: 'Crypto USDT', status: 'REJECTED',   requestedAt: '2024-07-29 16:45', processedBy: 'KL',  risk: 'MEDIUM' },
];

export const PAYOUT_FILTERS = ['PENDING', 'REVIEW', 'PROCESSING', 'PAID', 'FROZEN', 'REJECTED', 'HIGH_RISK'];
