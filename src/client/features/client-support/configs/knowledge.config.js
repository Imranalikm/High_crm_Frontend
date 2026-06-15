import { Wallet, Shield, BarChart2, Layers, User, CreditCard } from 'lucide-react';

export const KB_CATEGORIES = [
  {
    id: 'finance',
    Icon: Wallet,
    label: 'Deposits & withdrawals',
    count: 24,
    colorCls: 'text-brand',
    bgCls: 'bg-brand/10 border border-brand/20',
    desc: 'Account funding, bank transfers, and deposit rules.'
  },
  {
    id: 'kyc',
    Icon: Shield,
    label: 'Identity verification',
    count: 18,
    colorCls: 'text-positive',
    bgCls: 'bg-positive/10 border border-positive/20',
    desc: 'ID checks and document requirements.'
  },
  {
    id: 'trading',
    Icon: BarChart2,
    label: 'Trading & MT5',
    count: 32,
    colorCls: 'text-warning',
    bgCls: 'bg-warning/10 border border-warning/20',
    desc: 'MT5 setup, settings, and leverage.'
  },
  {
    id: 'copy',
    Icon: Layers,
    label: 'Copy trading',
    count: 15,
    colorCls: 'text-purple',
    bgCls: 'bg-purple/10 border border-purple/20',
    desc: 'Linking accounts, ratios, and profits.'
  },
  {
    id: 'account',
    Icon: User,
    label: 'Account settings',
    count: 21,
    colorCls: 'text-cyan',
    bgCls: 'bg-cyan/10 border border-cyan/20',
    desc: 'Password, 2FA, and profile settings.'
  },
  {
    id: 'payments',
    Icon: CreditCard,
    label: 'Billing',
    count: 12,
    colorCls: 'text-negative',
    bgCls: 'bg-negative/10 border border-negative/20',
    desc: 'Card payments, crypto, and billing info.'
  },
];

export const KB_ARTICLES = [
  { id: 'a1', title: 'How to deposit funds into your account', views: '12.4K', readTime: '3 min', category: 'Finance', helpful: 94 },
  { id: 'a2', title: 'MT5 platform setup guide',               views: '8.2K',  readTime: '5 min', category: 'Trading', helpful: 88 },
  { id: 'a3', title: 'Understanding KYC requirements',          views: '6.8K',  readTime: '4 min', category: 'KYC',     helpful: 92 },
  { id: 'a4', title: 'How copy trading works — beginner guide', views: '5.1K',  readTime: '6 min', category: 'Copy',    helpful: 97 },
  { id: 'a5', title: 'Withdrawal processing times by method',   views: '9.3K',  readTime: '2 min', category: 'Finance', helpful: 85 },
  { id: 'a6', title: 'Reset your MT5 password step by step',    views: '4.4K',  readTime: '2 min', category: 'Trading', helpful: 91 },
];

export const KB_FAQS = [
  {
    id: 'f1',
    q: 'How long do withdrawals take?',
    a: 'Bank transfers take 3–5 business days. Crypto takes up to 24 hours. Card refunds take 5–10 business days.',
  },
  {
    id: 'f2',
    q: 'Why was my verification rejected?',
    a: 'Verification usually fails due to blurry documents, expired IDs, name mismatches, or old utility bills. Please upload clear documents.',
  },
  {
    id: 'f3',
    q: 'How do I change leverage?',
    a: 'Change it in MT5 under Account Properties. You cannot have open positions when changing leverage.',
  },
  {
    id: 'f4',
    q: 'Can I have multiple accounts?',
    a: 'You can have one Live and one Demo account. Extra accounts will be suspended.',
  },
  {
    id: 'f5',
    q: 'What is the minimum deposit?',
    a: 'The first deposit must be at least $100. Later deposits must be at least $50.',
  },
  {
    id: 'f6',
    q: 'How does copy trading work?',
    a: 'We automatically copy trades from a provider to your account based on your copy settings.',
  },
];
