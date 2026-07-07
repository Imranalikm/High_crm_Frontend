import React, { createElement } from 'react';
import { createHashRouter, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@/shared/components/ui/ErrorBoundary';

// ── Admin portal
import { MainLayout } from '@/admin/layout/MainLayout';
import { AdminAuthGuard } from '@/shared/guards/AdminAuthGuard';
import { ClientAuthGuard } from '@/shared/guards/ClientAuthGuard';
import { PermissionGuard } from '@/shared/guards/PermissionGuard';
import { adminRedirectRoutes, adminRouteModules } from '@/shared/config/routes/admin-routes.config';

// ── Customer portal layout
import { ClientLayout } from '@/client/layout/ClientLayout';

// ── Auth page
import { LoginPage } from '@/shared/features/auth/pages/LoginPage';

// ── Admin feature pages
import { DashboardPage } from '@/admin/features/dashboard/pages/DashboardPage';
import UsersPage from '@/admin/features/users/pages/UsersPage';
import MT5QueuePage from '@/admin/features/users/pages/MT5QueuePage';
import { UserDetailPage } from '@/admin/features/users/pages/UserDetailPage';
import KYCQueuePage from '@/admin/features/users/pages/KYCQueuePage';
import UsersAuditPage from '@/admin/features/users/pages/UsersAuditPage';
import MT5AccountReviewPage from '@/admin/features/users/pages/MT5AccountReviewPage';
import DepositsPage from '@/admin/features/finance/pages/DepositsPage';
import WithdrawalsPage from '@/admin/features/finance/pages/WithdrawalsPage';
import TransactionsPage from '@/admin/features/finance/pages/TransactionsPage';
import FailedPaymentsPage from '@/admin/features/finance/pages/FailedPaymentsPage';
import ApprovalsPage from '@/admin/features/finance/pages/ApprovalsPage';
import DepositDetailPage from '@/admin/features/finance/pages/DepositDetailPage';
import WithdrawalDetailPage from '@/admin/features/finance/pages/WithdrawalDetailPage';
import TradingAccountsPage from '@/admin/features/trading/pages/TradingAccountsPage';
import OrdersPage from '@/admin/features/trading/pages/OrdersPage';
import PositionsPage from '@/admin/features/trading/pages/PositionsPage';
import TradeHistoryPage from '@/admin/features/trading/pages/TradeHistoryPage';
import ExecutionLogsPage from '@/admin/features/trading/pages/ExecutionLogsPage';
import CopyTradingPage from '@/admin/features/copy-trading/pages/CopyTradingPage';
import CopyTradingDetailPage from '@/admin/features/copy-trading/pages/CopyTradingDetailPage';
import IBSystemPage from '@/admin/features/ib-system/pages/IBSystemPage';
import PropTradingPage from '@/admin/features/prop-trading/pages/PropTradingPage';
import { ReportsOverviewPage } from '@/admin/features/reports/pages/ReportsOverviewPage';
import FinanceReportsPage from '@/admin/features/reports/pages/FinanceReportsPage';
import TradingReportsPage from '@/admin/features/reports/pages/TradingReportsPage';
import UserReportsPage from '@/admin/features/reports/pages/UserReportsPage';
import SystemReportsPage from '@/admin/features/reports/pages/SystemReportsPage';
import { ExportCenterPage } from '@/admin/features/reports/pages/ExportCenterPage';
import SupportPage from '@/admin/features/support/pages/SupportPage';
import { TicketDetailPage } from '@/admin/features/support/pages/TicketDetailPage';
import SettingsPage from '@/admin/features/settings/pages/SettingsPage';
import RolesPermissionsPage from '@/admin/features/roles-permissions/pages/RolesPermissionsPage';
import GroupWorkspacePage from '@/admin/features/group-management/pages/GroupWorkspacePage';
import { NotFoundPage } from '@/app/pages/NotFoundPage';

// ── Customer feature pages
import { ClientDashboardPage } from '@/client/features/client-dashboard/pages/ClientDashboardPage';
import AccountCenterPage from '@/shared/features/account-center/pages/AccountCenterPage';
import { WalletsPage } from '@/client/features/client-finance/pages/WalletsPage';
import { DepositPage } from '@/client/features/client-finance/pages/DepositPage';
import { WithdrawPage } from '@/client/features/client-finance/pages/WithdrawPage';
import { PaymentMethodsPage } from '@/client/features/client-finance/pages/PaymentMethodsPage';
import { LimitsFeesPage } from '@/client/features/client-finance/pages/LimitsFeesPage';
import { ClientTransactionsPage } from '@/client/features/client-finance/pages/ClientTransactionsPage';
import { ClientAccountsPage } from '@/client/features/client-accounts/ClientAccountsPage';
import { SupportTicketsPage } from '@/client/features/client-support/pages/SupportTicketsPage';
import { ClientTicketDetailPage } from '@/client/features/client-support/pages/TicketDetailPage';
import { SupportOverviewPage } from '@/client/features/client-support/pages/SupportOverviewPage';
import { KnowledgeBasePage } from '@/client/features/client-support/pages/KnowledgeBasePage';
import { AnnouncementsPage } from '@/client/features/client-support/pages/AnnouncementsPage';
import { LiveChatPage } from '@/client/features/client-support/pages/LiveChatPage';
import KycUploadPage from '@/client/features/client-kyc/pages/KycUploadPage';
import KycStatusPage, { KycDispatcher } from '@/client/features/client-kyc/pages/KycStatusPage';

/* ─────────────────────────────────────────────────────────
   ADMIN PAGE REGISTRY
───────────────────────────────────────────────────────── */
const adminPageRegistry = {
  'dashboard/dashboard': DashboardPage,
  'users/users-list': UsersPage,
  'users/kyc-queue': KYCQueuePage,
  'users/mt5-queue': MT5QueuePage,
  'users/mt5-review': MT5AccountReviewPage,
  'users/user-detail': UserDetailPage,
  'users/users-audit': UsersAuditPage,
  'finance/deposits': DepositsPage,
  'finance/deposit-detail': DepositDetailPage,
  'finance/withdrawals': WithdrawalsPage,
  'finance/withdrawal-detail': WithdrawalDetailPage,
  'finance/transactions': TransactionsPage,
  'finance/failed-payments': FailedPaymentsPage,
  'finance/approvals': ApprovalsPage,
  'trading/trading-accounts': TradingAccountsPage,
  'trading/orders': OrdersPage,
  'trading/positions': PositionsPage,
  'trading/trade-history': TradeHistoryPage,
  'trading/execution-logs': ExecutionLogsPage,
  'copy-trading/strategies': CopyTradingPage,
  'copy-trading/providers': CopyTradingPage,
  'copy-trading/followers': CopyTradingPage,
  'copy-trading/subscriptions': CopyTradingPage,
  'copy-trading/performance': CopyTradingPage,
  'copy-trading/logs': CopyTradingPage,
  'copy-trading/copy-trading-detail': CopyTradingDetailPage,
  'ib-system/ib-system-workspace': IBSystemPage,
  'group-management/workspace': GroupWorkspacePage,
  'prop-trading/prop-trading-workspace': PropTradingPage,
  'reports/overview': ReportsOverviewPage,
  'reports/finance': FinanceReportsPage,
  'reports/trading': TradingReportsPage,
  'reports/users': UserReportsPage,
  'reports/system': SystemReportsPage,
  'reports/exports': ExportCenterPage,
  'support/support-workspace': SupportPage,
  'support/ticket-detail': TicketDetailPage,
  'settings/settings-workspace': SettingsPage,
  'admin-mgmt/roles-permissions-workspace': RolesPermissionsPage,
  'account/account-center': AccountCenterPage,
};

function withPermission(permission, PageComponent) {
  return (
    <PermissionGuard permission={permission}>
      {createElement(PageComponent)}
    </PermissionGuard>
  );
}

function cleanAdminPath(path) {
  if (path.startsWith('/admin/')) {
    return path.substring(7);
  }
  if (path.startsWith('/admin')) {
    return path.substring(6);
  }
  if (path.startsWith('/')) {
    return path.substring(1);
  }
  return path;
}

function buildAdminRoutes() {
  return adminRouteModules.flatMap((module) =>
    module.routes.map((route) => {
      const PageComponent = adminPageRegistry[route.pageKey];
      if (!PageComponent) {
        throw new Error(`Missing page for admin route key: ${route.pageKey}`);
      }
      // Index route (dashboard)
      if (route.path === '') {
        return { index: true, element: withPermission(route.permission, PageComponent) };
      }
      return { path: cleanAdminPath(route.path), element: withPermission(route.permission, PageComponent) };
    }),
  );
}

/* ─────────────────────────────────────────────────────────
   UNIFIED ROUTER
───────────────────────────────────────────────────────── */
export const appRouter = createHashRouter([
  // Root → login
  { index: true, element: <Navigate to="/login" replace /> },

  // Login (public)
  { path: 'login', element: <LoginPage /> },

  // ── Admin Portal
  {
    path: 'admin',
    element: (
      <AdminAuthGuard>
        <MainLayout />
      </AdminAuthGuard>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      // Redirect shortcuts  (e.g. /admin/finance → /admin/finance/deposits)
      ...adminRedirectRoutes.map((r) => {
        const cleanTo = r.to.startsWith('/admin') ? r.to : `/admin${r.to}`;
        return {
          path: cleanAdminPath(r.path),
          element: <Navigate to={cleanTo} replace />,
        };
      }),
      // All module routes
      ...buildAdminRoutes(),
      { path: '*', element: <NotFoundPage /> },
    ],
  },

  // ── Customer Portal
  {
    path: 'client',
    element: (
      <ClientAuthGuard>
        <ClientLayout />
      </ClientAuthGuard>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <ClientDashboardPage /> },
      { path: 'accounts', element: <ClientAccountsPage /> },
      { path: 'account', element: <Navigate to="/client/account/overview" replace /> },
      { path: 'account/:tab', element: <AccountCenterPage /> },
      { path: 'finance/wallets', element: <WalletsPage /> },
      { path: 'finance/deposit', element: <DepositPage /> },
      { path: 'finance/withdraw', element: <WithdrawPage /> },
      { path: 'finance/payment-methods', element: <PaymentMethodsPage /> },
      { path: 'finance/limits', element: <LimitsFeesPage /> },
      { path: 'finance/transactions', element: <ClientTransactionsPage /> },
      { path: 'support', element: <Navigate to="/client/support/overview" replace /> },
      { path: 'support/overview', element: <SupportOverviewPage /> },
      { path: 'support/tickets', element: <SupportTicketsPage /> },
      { path: 'support/tickets/:id', element: <ClientTicketDetailPage /> },
      { path: 'support/kb', element: <KnowledgeBasePage /> },
      { path: 'support/announcements', element: <AnnouncementsPage /> },
      { path: 'support/chat', element: <LiveChatPage /> },
      { path: 'kyc', element: <KycDispatcher /> },
      { path: 'kyc/upload', element: <KycUploadPage /> },
      { path: 'kyc/status', element: <KycStatusPage /> },
      // Support FAQ redirect → knowledge base
      { path: 'support/faq', element: <Navigate to="/client/support/kb" replace /> },
      // Stub routes for sidebar items not yet built (redirect to dashboard)
      { path: 'copy-trading', element: <Navigate to="/client" replace /> },
      { path: 'prop-trading', element: <Navigate to="/client" replace /> },
      { path: 'ib-system', element: <Navigate to="/client" replace /> },
      { path: 'settings', element: <AccountCenterPage /> },
      // Finance root redirect
      { path: 'finance', element: <Navigate to="/client/finance/wallets" replace /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },

  // Catch-all
  { path: '*', element: <Navigate to="/login" replace /> },
]);

// Keep legacy named export for any lingering imports (will be removed later)
export const adminRouter = appRouter;
