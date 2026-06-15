import {
  LayoutDashboard,
  LayoutGrid,
  Wallet,
  History,
  LifeBuoy,
  Settings,
  User,
  ArrowDownToLine,
  ArrowUpFromLine,
  CreditCard,
  BarChart3,
  Copy,
  Trophy,
  Share2,
  BookOpen,
  ShieldCheck,
  UploadCloud,
  Clock3,
  Inbox,
  MessageCircle,
  Bell,
} from 'lucide-react';

export const clientNavigationSections = [
  { id: 'main',        label: 'My Hub' },
  { id: 'trading',     label: 'Trading & Finance' },
  { id: 'partnership', label: 'Partnership' },
  { id: 'help',        label: 'Help & Settings' },
];

export const clientNavigation = [
  /* ── MAIN ── */
  {
    id: 'client-dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/client',
    navSection: 'main',
  },
  {
    id: 'client-kyc',
    label: 'Verify Identity',
    icon: ShieldCheck,
    path: '/client/kyc',
    navSection: 'main',
    subItems: [
      { id: 'client-kyc-upload',   label: 'Upload ID',       path: '/client/kyc/upload',  icon: UploadCloud },
      { id: 'client-kyc-status',   label: 'Status',          path: '/client/kyc/status',  icon: Clock3 },
      { id: 'client-kyc-history',  label: 'History',         path: '/client/kyc/history', icon: History },
    ],
  },

  /* ── TRADING & FINANCE ── */
  {
    id: 'client-wallets',
    label: 'My Wallets',
    icon: Wallet,
    path: '/client/finance/wallets',
    navSection: 'trading',
    subItems: [
      { id: 'client-wallet-overview',  label: 'Overview',         path: '/client/finance/wallets',          icon: LayoutGrid      },
      { id: 'client-deposit',          label: 'Deposit Funds',    path: '/client/finance/deposit',          icon: ArrowDownToLine },
      { id: 'client-withdraw',         label: 'Withdraw',         path: '/client/finance/withdraw',         icon: ArrowUpFromLine },
      { id: 'client-payment-methods',  label: 'Payment Methods',  path: '/client/finance/payment-methods',  icon: CreditCard      },
      { id: 'client-limits',           label: 'Limits & Fees',    path: '/client/finance/limits',           icon: BarChart3       },
    ],
  },
  {
    id: 'client-transactions',
    label: 'Transactions',
    icon: History,
    path: '/client/finance/transactions',
    navSection: 'trading',
  },
  {
    id: 'client-copy-trading',
    label: 'Copy Trading',
    icon: Copy,
    path: '/client/copy-trading',
    navSection: 'trading',
  },
  {
    id: 'client-prop-trading',
    label: 'Prop Challenge',
    icon: Trophy,
    path: '/client/prop-trading',
    navSection: 'trading',
  },

  /* ── PARTNERSHIP ── */
  {
    id: 'client-ib',
    label: 'IB Affiliate',
    icon: Share2,
    path: '/client/ib-system',
    navSection: 'partnership',
  },

  /* ── HELP & SETTINGS ── */
  {
    id: 'client-support',
    label: 'Support Center',
    icon: LifeBuoy,
    path: '/client/support/overview',
    navSection: 'help',
    subItems: [
      { id: 'client-support-overview',  label: 'Overview',          path: '/client/support/overview',       icon: LayoutGrid          },
      { id: 'client-support-tickets',   label: 'My Tickets',        path: '/client/support/tickets',        icon: Inbox               },
      { id: 'client-faq',              label: 'Knowledge Base',    path: '/client/support/kb',             icon: BookOpen            },
      { id: 'client-chat',             label: 'Live Chat',         path: '/client/support/chat',           icon: MessageCircle       },
      { id: 'client-announcements',    label: 'Announcements',     path: '/client/support/announcements',  icon: Bell                },
    ],
  },

  {
    id: 'client-settings',
    label: 'Preferences',
    icon: Settings,
    path: '/client/settings',
    navSection: 'help',
  },
];
