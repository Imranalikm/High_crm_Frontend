import {
  Copy,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  LineChart,
  Settings,
  Share2,
  ShieldCheck,
  Trophy,
  User,
  Users,
  Wallet,
} from 'lucide-react';
import { PERMISSIONS } from '@/config/permissions/permissions';

/**
 * Admin Route Modules Configuration
 *
 * All paths are RELATIVE (no leading slash) because they live
 * under the /admin parent route in the router.
 *
 * defaultPath values keep a leading slash so Navigate components
 * can use them as absolute hash paths.
 */
export const adminRouteModules = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    navSection: 'main',
    permission: PERMISSIONS.dashboard.view,
    defaultPath: '/admin',
    routes: [
      {
        id: 'dashboard',
        path: '',           // index route under /admin
        pageKey: 'dashboard/dashboard',
        permission: PERMISSIONS.dashboard.view,
        meta: [
          { pattern: '/admin', title: 'Dashboard Control', section: 'Dashboard', permission: PERMISSIONS.dashboard.view },
        ],
      },
    ],
  },
  {
    id: 'users',
    label: 'Users',
    icon: Users,
    navSection: 'main',
    permission: PERMISSIONS.users.view,
    defaultPath: '/admin/users',
    routes: [
      {
        id: 'users-list',
        path: 'users',
        pageKey: 'users/users-list',
        navLabel: 'User List',
        permission: PERMISSIONS.users.view,
        meta: [
          { pattern: '/admin/users', title: 'Master User List', section: 'Users', permission: PERMISSIONS.users.view },
        ],
      },
      {
        id: 'users-kyc',
        path: 'users/kyc',
        pageKey: 'users/kyc-queue',
        navLabel: 'KYC Requests',
        permission: PERMISSIONS.users.kyc,
        meta: [
          { pattern: '/admin/users/kyc', title: 'Verification Queue', section: 'Users', permission: PERMISSIONS.users.kyc },
        ],
      },
      {
        id: 'users-mt5',
        path: 'users/mt5',
        pageKey: 'users/mt5-queue',
        navLabel: 'MT5 Accounts',
        permission: PERMISSIONS.users.mt5,
        meta: [
          { pattern: '/admin/users/mt5', title: 'MT5 Accounts', section: 'Users', permission: PERMISSIONS.users.mt5 },
        ],
      },
      {
        id: 'users-mt5-review',
        path: 'users/mt5/:login',
        pageKey: 'users/mt5-review',
        permission: PERMISSIONS.users.mt5,
        meta: [
          { pattern: '/admin/users/mt5/:login', title: 'MT5 Account Details', section: 'Users', permission: PERMISSIONS.users.mt5 },
        ],
      },
      {
        id: 'users-detail',
        path: 'users/:userId',
        pageKey: 'users/user-detail',
        permission: PERMISSIONS.users.view,
        meta: [
          { pattern: '/admin/users/:userId', title: 'User Overview', section: 'Users', permission: PERMISSIONS.users.view },
        ],
      },
      {
        id: 'users-detail-tab',
        path: 'users/:userId/:tab',
        pageKey: 'users/user-detail',
        permission: PERMISSIONS.users.view,
      },
    ],
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: Wallet,
    navSection: 'main',
    permission: PERMISSIONS.finance.view,
    defaultPath: '/admin/finance/deposits',
    routes: [
      {
        id: 'finance-deposits',
        path: 'finance/deposits',
        pageKey: 'finance/deposits',
        navLabel: 'Deposits',
        permission: PERMISSIONS.finance.view,
        meta: [
          { pattern: '/admin/finance/deposits', title: 'Deposit Ledger', section: 'Finance', permission: PERMISSIONS.finance.view },
        ],
      },
      {
        id: 'finance-deposit-detail',
        path: 'finance/deposits/:id',
        pageKey: 'finance/deposit-detail',
        permission: PERMISSIONS.finance.view,
        meta: [
          { pattern: '/admin/finance/deposits/:id', title: 'Deposit Details', section: 'Finance', permission: PERMISSIONS.finance.view },
        ],
      },
      {
        id: 'finance-withdrawals',
        path: 'finance/withdrawals',
        pageKey: 'finance/withdrawals',
        navLabel: 'Withdrawals',
        permission: PERMISSIONS.finance.view,
        meta: [
          { pattern: '/admin/finance/withdrawals', title: 'Withdrawal Approvals', section: 'Finance', permission: PERMISSIONS.finance.view },
        ],
      },
      {
        id: 'finance-withdrawal-detail',
        path: 'finance/withdrawals/:id',
        pageKey: 'finance/withdrawal-detail',
        permission: PERMISSIONS.finance.view,
        meta: [
          { pattern: '/admin/finance/withdrawals/:id', title: 'Withdrawal Details', section: 'Finance', permission: PERMISSIONS.finance.view },
        ],
      },
      {
        id: 'finance-transactions',
        path: 'finance/transactions',
        pageKey: 'finance/transactions',
        navLabel: 'Transactions',
        permission: PERMISSIONS.finance.view,
        meta: [
          { pattern: '/admin/finance/transactions', title: 'Transaction Stream', section: 'Finance', permission: PERMISSIONS.finance.view },
        ],
      },
      {
        id: 'finance-failed',
        path: 'finance/failed-payments',
        pageKey: 'finance/failed-payments',
        navLabel: 'Failed Payments',
        permission: PERMISSIONS.finance.view,
        meta: [
          { pattern: '/admin/finance/failed-payments', title: 'Failed Payments', section: 'Finance', permission: PERMISSIONS.finance.view },
        ],
      },
      {
        id: 'finance-approvals',
        path: 'finance/approvals',
        pageKey: 'finance/approvals',
        navLabel: 'Approvals',
        permission: PERMISSIONS.finance.approve,
        meta: [
          { pattern: '/admin/finance/approvals', title: 'Manual Approvals', section: 'Finance', permission: PERMISSIONS.finance.approve },
        ],
      },
    ],
  },
  {
    id: 'trading',
    label: 'Trading Operations',
    icon: LineChart,
    navSection: 'main',
    permission: PERMISSIONS.trading.view,
    defaultPath: '/admin/trading/accounts',
    routes: [
      {
        id: 'trading-accounts',
        path: 'trading/accounts',
        pageKey: 'trading/trading-accounts',
        navLabel: 'Trading Accounts',
        permission: PERMISSIONS.trading.view,
        meta: [
          { pattern: '/admin/trading/accounts', title: 'Trading Accounts', section: 'Trading', permission: PERMISSIONS.trading.view },
        ],
      },
      {
        id: 'trading-orders',
        path: 'trading/orders',
        pageKey: 'trading/orders',
        navLabel: 'Orders',
        permission: PERMISSIONS.trading.view,
        meta: [
          { pattern: '/admin/trading/orders', title: 'Orders Monitor', section: 'Trading', permission: PERMISSIONS.trading.view },
        ],
      },
      {
        id: 'trading-positions',
        path: 'trading/positions',
        pageKey: 'trading/positions',
        navLabel: 'Positions',
        permission: PERMISSIONS.trading.view,
        meta: [
          { pattern: '/admin/trading/positions', title: 'Live Positions', section: 'Trading', permission: PERMISSIONS.trading.view },
        ],
      },
      {
        id: 'trading-history',
        path: 'trading/history',
        pageKey: 'trading/trade-history',
        navLabel: 'Trade History',
        permission: PERMISSIONS.trading.view,
        meta: [
          { pattern: '/admin/trading/history', title: 'Trade History', section: 'Trading', permission: PERMISSIONS.trading.view },
        ],
      },
      {
        id: 'trading-logs',
        path: 'trading/execution-logs',
        pageKey: 'trading/execution-logs',
        navLabel: 'Execution Logs',
        permission: PERMISSIONS.trading.view,
        meta: [
          { pattern: '/admin/trading/execution-logs', title: 'Execution Logs', section: 'Trading', permission: PERMISSIONS.trading.view },
        ],
      },
    ],
  },
  {
    id: 'copy-trading',
    label: 'Copy Trading',
    icon: Copy,
    navSection: 'management',
    permission: PERMISSIONS.copyTrading.view,
    defaultPath: '/admin/copy-trading/strategies',
    routes: [
      {
        id: 'copy-strategies',
        path: 'copy-trading/strategies',
        pageKey: 'copy-trading/strategies',
        navLabel: 'Strategies',
        permission: PERMISSIONS.copyTrading.view,
        meta: [
          { pattern: '/admin/copy-trading/strategies', title: 'Copy Strategies', section: 'Copy-Trading', permission: PERMISSIONS.copyTrading.view },
        ],
      },
      {
        id: 'copy-providers',
        path: 'copy-trading/providers',
        pageKey: 'copy-trading/providers',
        navLabel: 'Providers',
        permission: PERMISSIONS.copyTrading.view,
        meta: [
          { pattern: '/admin/copy-trading/providers', title: 'Copy Providers', section: 'Copy-Trading', permission: PERMISSIONS.copyTrading.view },
        ],
      },
      {
        id: 'copy-followers',
        path: 'copy-trading/followers',
        pageKey: 'copy-trading/followers',
        navLabel: 'Followers',
        permission: PERMISSIONS.copyTrading.view,
        meta: [
          { pattern: '/admin/copy-trading/followers', title: 'Copy Followers', section: 'Copy-Trading', permission: PERMISSIONS.copyTrading.view },
        ],
      },
      {
        id: 'copy-subscriptions',
        path: 'copy-trading/subscriptions',
        pageKey: 'copy-trading/subscriptions',
        navLabel: 'Subscriptions',
        permission: PERMISSIONS.copyTrading.view,
        meta: [
          { pattern: '/admin/copy-trading/subscriptions', title: 'Copy Subscriptions', section: 'Copy-Trading', permission: PERMISSIONS.copyTrading.view },
        ],
      },
      {
        id: 'copy-performance',
        path: 'copy-trading/performance',
        pageKey: 'copy-trading/performance',
        navLabel: 'Performance',
        permission: PERMISSIONS.copyTrading.view,
        meta: [
          { pattern: '/admin/copy-trading/performance', title: 'Copy Performance', section: 'Copy-Trading', permission: PERMISSIONS.copyTrading.view },
        ],
      },
      {
        id: 'copy-logs',
        path: 'copy-trading/logs',
        pageKey: 'copy-trading/logs',
        navLabel: 'Logs',
        permission: PERMISSIONS.copyTrading.view,
        meta: [
          { pattern: '/admin/copy-trading/logs', title: 'Copy Logs', section: 'Copy-Trading', permission: PERMISSIONS.copyTrading.view },
        ],
      },
      {
        id: 'copy-detail',
        path: 'copy-trading/:slug/:id',
        pageKey: 'copy-trading/copy-trading-detail',
        permission: PERMISSIONS.copyTrading.view,
        meta: [
          { pattern: '/admin/copy-trading/:slug/:id', title: 'Copy Trading Detail', section: 'Copy-Trading', permission: PERMISSIONS.copyTrading.view },
        ],
      },
    ],
  },
  {
    id: 'prop-trading',
    label: 'Prop Trading',
    icon: Trophy,
    navSection: 'management',
    permission: PERMISSIONS.propTrading.view,
    defaultPath: '/admin/prop-trading',
    routes: [
      {
        id: 'prop-overview',
        path: 'prop-trading',
        pageKey: 'prop-trading/prop-trading-workspace',
        navLabel: 'Overview',
        permission: PERMISSIONS.propTrading.view,
        meta: [
          { pattern: '/admin/prop-trading', title: 'Prop Trading Overview', section: 'Prop-Trading', permission: PERMISSIONS.propTrading.view },
        ],
      },
      {
        id: 'prop-configs',
        path: 'prop-trading/challenge-configurations',
        pageKey: 'prop-trading/prop-trading-workspace',
        navLabel: 'Challenges',
        permission: PERMISSIONS.propTrading.manage,
        meta: [
          { pattern: '/admin/prop-trading/challenge-configurations', title: 'Challenges', section: 'Prop-Trading', permission: PERMISSIONS.propTrading.manage },
        ],
      },
      {
        id: 'prop-evaluations',
        path: 'prop-trading/evaluation-requests',
        pageKey: 'prop-trading/prop-trading-workspace',
        navLabel: 'Evaluation Requests',
        permission: PERMISSIONS.propTrading.approve,
        meta: [
          { pattern: '/admin/prop-trading/evaluation-requests', title: 'Evaluation Requests', section: 'Prop-Trading', permission: PERMISSIONS.propTrading.approve },
        ],
      },
      {
        id: 'prop-funded',
        path: 'prop-trading/funded-accounts',
        pageKey: 'prop-trading/prop-trading-workspace',
        navLabel: 'Funded Accounts',
        permission: PERMISSIONS.propTrading.view,
        meta: [
          { pattern: '/admin/prop-trading/funded-accounts', title: 'Funded Accounts', section: 'Prop-Trading', permission: PERMISSIONS.propTrading.view },
        ],
      },
      {
        id: 'prop-statistics',
        path: 'prop-trading/statistics',
        pageKey: 'prop-trading/prop-trading-workspace',
        navLabel: 'Statistics',
        permission: PERMISSIONS.propTrading.view,
        meta: [
          { pattern: '/admin/prop-trading/statistics', title: 'Challenge Statistics', section: 'Prop-Trading', permission: PERMISSIONS.propTrading.view },
        ],
      },
      {
        id: 'prop-fees',
        path: 'prop-trading/fees-coupons',
        pageKey: 'prop-trading/prop-trading-workspace',
        navLabel: 'Fees & Coupons',
        permission: PERMISSIONS.propTrading.manage,
        meta: [
          { pattern: '/admin/prop-trading/fees-coupons', title: 'Fees & Coupons', section: 'Prop-Trading', permission: PERMISSIONS.propTrading.manage },
        ],
      },
      {
        id: 'prop-rules',
        path: 'prop-trading/rules-risk',
        pageKey: 'prop-trading/prop-trading-workspace',
        navLabel: 'Rules / Risk Settings',
        permission: PERMISSIONS.propTrading.manage,
        meta: [
          { pattern: '/admin/prop-trading/rules-risk', title: 'Rules / Risk Settings', section: 'Prop-Trading', permission: PERMISSIONS.propTrading.manage },
        ],
      },
    ],
  },
  {
    id: 'ib-system',
    label: 'IB System',
    icon: Share2,
    navSection: 'management',
    permission: PERMISSIONS.ibSystem.view,
    defaultPath: '/admin/ib-system/overview',
    routes: [
      {
        id: 'ib-overview',
        path: 'ib-system/overview',
        pageKey: 'ib-system/ib-system-workspace',
        navLabel: 'Overview',
        permission: PERMISSIONS.ibSystem.view,
        meta: [
          { pattern: '/admin/ib-system/overview', title: 'IB System Overview', section: 'IB-System', permission: PERMISSIONS.ibSystem.view },
        ],
      },
      {
        id: 'ib-referrals',
        path: 'ib-system/referrals',
        pageKey: 'ib-system/ib-system-workspace',
        navLabel: 'Referrals',
        permission: PERMISSIONS.ibSystem.view,
        meta: [
          { pattern: '/admin/ib-system/referrals', title: 'Referral Network', section: 'IB-System', permission: PERMISSIONS.ibSystem.view },
        ],
      },
      {
        id: 'ib-commissions',
        path: 'ib-system/commissions',
        pageKey: 'ib-system/ib-system-workspace',
        navLabel: 'Commissions',
        permission: PERMISSIONS.ibSystem.view,
        meta: [
          { pattern: '/admin/ib-system/commissions', title: 'Commission History', section: 'IB-System', permission: PERMISSIONS.ibSystem.view },
        ],
      },
      {
        id: 'ib-payouts',
        path: 'ib-system/payouts',
        pageKey: 'ib-system/ib-system-workspace',
        navLabel: 'Payouts',
        permission: PERMISSIONS.ibSystem.payouts,
        meta: [
          { pattern: '/admin/ib-system/payouts', title: 'IB Payouts', section: 'IB-System', permission: PERMISSIONS.ibSystem.payouts },
        ],
      },
      {
        id: 'ib-performance',
        path: 'ib-system/performance',
        pageKey: 'ib-system/ib-system-workspace',
        navLabel: 'IB Performance',
        permission: PERMISSIONS.ibSystem.view,
        meta: [
          { pattern: '/admin/ib-system/performance', title: 'IB Performance', section: 'IB-System', permission: PERMISSIONS.ibSystem.view },
        ],
      },
      {
        id: 'ib-tree',
        path: 'ib-system/tree',
        pageKey: 'ib-system/ib-system-workspace',
        navLabel: 'Partner Tree',
        permission: PERMISSIONS.ibSystem.view,
        meta: [
          { pattern: '/admin/ib-system/tree', title: 'Partner Tree', section: 'IB-System', permission: PERMISSIONS.ibSystem.view },
        ],
      },
    ],
  },
  {
    id: 'group-management',
    label: 'Group Management',
    icon: Users,
    navSection: 'management',
    permission: PERMISSIONS.groupManagement.view,
    defaultPath: '/admin/group-management',
    routes: [
      {
        id: 'group-workspace',
        path: 'group-management',
        pageKey: 'group-management/workspace',
        permission: PERMISSIONS.groupManagement.view,
        meta: [
          { pattern: '/admin/group-management', title: 'Group Management', section: 'Group Management', permission: PERMISSIONS.groupManagement.view },
        ],
      },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: FileText,
    navSection: 'management',
    permission: PERMISSIONS.reports.view,
    defaultPath: '/admin/reports/overview',
    routes: [
      {
        id: 'reports-overview',
        path: 'reports/overview',
        pageKey: 'reports/overview',
        navLabel: 'Overview',
        permission: PERMISSIONS.reports.view,
        meta: [
          { pattern: '/admin/reports/overview', title: 'Reports Overview', section: 'Reports', permission: PERMISSIONS.reports.view },
        ],
      },
      {
        id: 'reports-finance',
        path: 'reports/finance',
        pageKey: 'reports/finance',
        navLabel: 'Finance Reports',
        permission: PERMISSIONS.reports.view,
        meta: [
          { pattern: '/admin/reports/finance', title: 'Finance Reports', section: 'Reports', permission: PERMISSIONS.reports.view },
        ],
      },
      {
        id: 'reports-trading',
        path: 'reports/trading',
        pageKey: 'reports/trading',
        navLabel: 'Trading Reports',
        permission: PERMISSIONS.reports.view,
        meta: [
          { pattern: '/admin/reports/trading', title: 'Trading Reports', section: 'Reports', permission: PERMISSIONS.reports.view },
        ],
      },
      {
        id: 'reports-users',
        path: 'reports/users',
        pageKey: 'reports/users',
        navLabel: 'User Reports',
        permission: PERMISSIONS.reports.view,
        meta: [
          { pattern: '/admin/reports/users', title: 'User Reports', section: 'Reports', permission: PERMISSIONS.reports.view },
        ],
      },
      {
        id: 'reports-system',
        path: 'reports/system',
        pageKey: 'reports/system',
        navLabel: 'System Reports',
        permission: PERMISSIONS.reports.view,
        meta: [
          { pattern: '/admin/reports/system', title: 'System Reports', section: 'Reports', permission: PERMISSIONS.reports.view },
        ],
      },
      {
        id: 'reports-exports',
        path: 'reports/exports',
        pageKey: 'reports/exports',
        navLabel: 'Export Center',
        permission: PERMISSIONS.reports.export,
        meta: [
          { pattern: '/admin/reports/exports', title: 'Export Center', section: 'Reports', permission: PERMISSIONS.reports.export },
        ],
      },
    ],
  },
  {
    id: 'support',
    label: 'Support',
    icon: LifeBuoy,
    navSection: 'management',
    permission: PERMISSIONS.support.view,
    defaultPath: '/admin/support/tickets',
    routes: [
      {
        id: 'support-tickets',
        path: 'support/tickets',
        pageKey: 'support/support-workspace',
        navLabel: 'All Tickets',
        permission: PERMISSIONS.support.view,
        meta: [
          { pattern: '/admin/support/tickets', title: 'All Tickets', section: 'Support', permission: PERMISSIONS.support.view },
        ],
      },
      {
        id: 'support-escalated',
        path: 'support/escalated',
        pageKey: 'support/support-workspace',
        navLabel: 'Urgent Tickets',
        permission: PERMISSIONS.support.escalate,
        meta: [
          { pattern: '/admin/support/escalated', title: 'Urgent Tickets', section: 'Support', permission: PERMISSIONS.support.escalate },
        ],
      },
      {
        id: 'support-detail',
        path: 'support/tickets/:ticketId',
        pageKey: 'support/ticket-detail',
        permission: PERMISSIONS.support.view,
        meta: [
          { pattern: '/admin/support/tickets/:ticketId', title: 'Ticket Details', section: 'Support', permission: PERMISSIONS.support.view },
        ],
      },
    ],
  },
  {
    id: 'settings',
    label: 'Platform Settings',
    icon: Settings,
    navSection: 'system',
    permission: PERMISSIONS.settings.view,
    defaultPath: '/admin/settings/overview',
    routes: [
      {
        id: 'settings-overview',
        path: 'settings/overview',
        pageKey: 'settings/settings-workspace',
        navLabel: 'Overview',
        permission: PERMISSIONS.settings.view,
        meta: [
          { pattern: '/admin/settings/overview', title: 'Settings Overview', section: 'Settings', permission: PERMISSIONS.settings.view },
        ],
      },
      {
        id: 'settings-api',
        path: 'settings/api',
        pageKey: 'settings/settings-workspace',
        navLabel: 'API',
        permission: PERMISSIONS.settings.view,
        meta: [
          { pattern: '/admin/settings/api', title: 'API Settings', section: 'Settings', permission: PERMISSIONS.settings.view },
        ],
      },
      {
        id: 'settings-payments',
        path: 'settings/payment-gateway',
        pageKey: 'settings/settings-workspace',
        navLabel: 'Payment Gateway',
        permission: PERMISSIONS.settings.view,
        meta: [
          { pattern: '/admin/settings/payment-gateway', title: 'Payment Gateway', section: 'Settings', permission: PERMISSIONS.settings.view },
        ],
      },
      {
        id: 'settings-kyc',
        path: 'settings/kyc',
        pageKey: 'settings/settings-workspace',
        navLabel: 'Verification Settings',
        permission: PERMISSIONS.settings.view,
        meta: [
          { pattern: '/admin/settings/kyc', title: 'Verification Settings', section: 'Settings', permission: PERMISSIONS.settings.view },
        ],
      },
      {
        id: 'settings-trading',
        path: 'settings/trading',
        pageKey: 'settings/settings-workspace',
        navLabel: 'Trading Settings',
        permission: PERMISSIONS.settings.view,
        meta: [
          { pattern: '/admin/settings/trading', title: 'Trading Settings', section: 'Settings', permission: PERMISSIONS.settings.view },
        ],
      },
      {
        id: 'settings-notifications',
        path: 'settings/notifications',
        pageKey: 'settings/settings-workspace',
        navLabel: 'Notifications',
        permission: PERMISSIONS.settings.view,
        meta: [
          { pattern: '/admin/settings/notifications', title: 'Notification Settings', section: 'Settings', permission: PERMISSIONS.settings.view },
        ],
      },
      {
        id: 'settings-system',
        path: 'settings/system',
        pageKey: 'settings/settings-workspace',
        navLabel: 'System',
        permission: PERMISSIONS.settings.view,
        meta: [
          { pattern: '/admin/settings/system', title: 'System Settings', section: 'Settings', permission: PERMISSIONS.settings.view },
        ],
      },
    ],
  },
  {
    id: 'admin-mgmt',
    label: 'Admins & Access',
    icon: ShieldCheck,
    navSection: 'system',
    permission: PERMISSIONS.rolesPermissions.view,
    defaultPath: '/admin/admin-mgmt/users',
    routes: [
      {
        id: 'admin-users',
        path: 'admin-mgmt/users',
        pageKey: 'admin-mgmt/roles-permissions-workspace',
        navLabel: 'Admin Users',
        permission: PERMISSIONS.rolesPermissions.view,
        meta: [
          { pattern: '/admin/admin-mgmt/users', title: 'Admin Users', section: 'Admin', permission: PERMISSIONS.rolesPermissions.view },
        ],
      },
      {
        id: 'admin-roles',
        path: 'admin-mgmt/roles',
        pageKey: 'admin-mgmt/roles-permissions-workspace',
        navLabel: 'Roles',
        permission: PERMISSIONS.rolesPermissions.view,
        meta: [
          { pattern: '/admin/admin-mgmt/roles', title: 'Roles', section: 'Admin', permission: PERMISSIONS.rolesPermissions.view },
        ],
      },
      {
        id: 'admin-permissions',
        path: 'admin-mgmt/permissions',
        pageKey: 'admin-mgmt/roles-permissions-workspace',
        navLabel: 'Permissions',
        permission: PERMISSIONS.rolesPermissions.view,
        meta: [
          { pattern: '/admin/admin-mgmt/permissions', title: 'Permissions', section: 'Admin', permission: PERMISSIONS.rolesPermissions.view },
        ],
      },
    ],
  },
  {
    id: 'account',
    label: 'My Account',
    icon: User,
    navSection: 'personal',
    permission: null,
    defaultPath: '/admin/account/overview',
    routes: [
      {
        id: 'account-overview',
        path: 'account/:tab',
        pageKey: 'account/account-center',
        permission: null,
        meta: [
          { pattern: '/admin/account/:tab', title: 'My Account', section: 'Account Center', permission: null },
        ]
      }
    ]
  }
];

export const adminRedirectRoutes = [
  { path: 'finance',      to: '/admin/finance/deposits' },
  { path: 'trading',      to: '/admin/trading/accounts' },
  { path: 'copy-trading', to: '/admin/copy-trading/strategies' },
  { path: 'ib-system',   to: '/admin/ib-system/overview' },
  { path: 'reports',     to: '/admin/reports/overview' },
  { path: 'support',     to: '/admin/support/tickets' },
  { path: 'settings',    to: '/admin/settings/overview' },
  { path: 'admin-mgmt',  to: '/admin/admin-mgmt/users' },
];

export const adminRouteMeta = adminRouteModules.flatMap((module) =>
  module.routes.flatMap((route) => route.meta ?? []),
);
