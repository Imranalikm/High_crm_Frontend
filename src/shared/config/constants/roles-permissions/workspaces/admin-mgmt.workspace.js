import {
  BarChart2, Users, CreditCard, TrendingUp, GitBranch, Trophy, Network, FileText, Settings, Shield
} from 'lucide-react';

export const adminUsers = [
  { id: 'ADM-001', name: 'Arjun Ravi', email: 'arjun@live-trader.com', role: 'SUPER_ADMIN', status: 'ACTIVE', twoFA: true, lastLogin: '2 min ago', created: '2023-01-10', locked: false, logins: 1842, actions: 4821, region: 'IN' },
  { id: 'ADM-002', name: 'Keiran Lynch', email: 'keiran@live-trader.com', role: 'RISK_OFFICER', status: 'ACTIVE', twoFA: true, lastLogin: '18 min ago', created: '2023-02-14', locked: false, logins: 984, actions: 2140, region: 'IE' },
  { id: 'ADM-003', name: 'Priya Sharma', email: 'priya@live-trader.com', role: 'COMPLIANCE', status: 'ACTIVE', twoFA: true, lastLogin: '1h ago', created: '2023-03-08', locked: false, logins: 762, actions: 1890, region: 'IN' },
  { id: 'ADM-004', name: 'Marcus Webb', email: 'marcus@live-trader.com', role: 'SUPPORT', status: 'ACTIVE', twoFA: false, lastLogin: '3h ago', created: '2023-04-21', locked: false, logins: 521, actions: 981, region: 'UK' },
  { id: 'ADM-005', name: 'Yuki Nakamura', email: 'yuki@live-trader.com', role: 'FINANCE', status: 'ACTIVE', twoFA: true, lastLogin: '5h ago', created: '2023-05-15', locked: false, logins: 641, actions: 1420, region: 'JP' },
  { id: 'ADM-006', name: 'Sofia Delgado', email: 'sofia@live-trader.com', role: 'SUPPORT', status: 'INACTIVE', twoFA: false, lastLogin: '12d ago', created: '2023-06-30', locked: false, logins: 188, actions: 340, region: 'ES' },
  { id: 'ADM-007', name: 'Omar Farouk', email: 'omar@live-trader.com', role: 'RISK_OFFICER', status: 'LOCKED', twoFA: true, lastLogin: '8d ago', created: '2023-07-12', locked: true, logins: 420, actions: 890, region: 'EG' },
  { id: 'ADM-008', name: 'Nina Volkov', email: 'nina@live-trader.com', role: 'COMPLIANCE', status: 'PENDING', twoFA: false, lastLogin: 'Never', created: '2024-07-28', locked: false, logins: 0, actions: 0, region: 'RU' },
  { id: 'ADM-009', name: 'Dev Kapoor', email: 'dev@live-trader.com', role: 'FINANCE', status: 'ACTIVE', twoFA: true, lastLogin: '30 min ago', created: '2023-09-05', locked: false, logins: 528, actions: 1102, region: 'IN' },
  { id: 'ADM-010', name: 'Lena Fischer', email: 'lena@live-trader.com', role: 'SUPPORT', status: 'ACTIVE', twoFA: false, lastLogin: '2h ago', created: '2023-10-18', locked: false, logins: 312, actions: 620, region: 'DE' },
];

export const adminNotes = {
  'ADM-001': 'Main super admin. Has full access. Reviewed every quarter.',
  'ADM-007': 'Account locked after 5 failed 2FA attempts on 2024-07-29. Pending re-verification.',
  'ADM-008': 'New hire — awaiting IT onboarding and 2FA setup.',
};

export const rolesData = [
  {
    id: 'ROLE-001', name: 'SUPER_ADMIN', label: 'Super Admin', desc: 'Full access to all modules and settings.',
    userCount: 1, scope: 'ALL_MODULES', status: 'ACTIVE', updated: '2024-01-15', color: '#e5c07b',
    modules: ['Dashboard', 'Users', 'Finance', 'Trading', 'Copy Trading', 'Prop Trading', 'IB System', 'Reports', 'Settings', 'Admin Mgmt'],
    actions: ['view', 'create', 'edit', 'approve', 'delete', 'export', 'assign'],
  },
  {
    id: 'ROLE-002', name: 'RISK_OFFICER', label: 'Risk Officer', desc: 'Access to risk, trading, and compliance tools.',
    userCount: 2, scope: 'RISK_MODULES', status: 'ACTIVE', updated: '2024-02-20', color: '#ef4444',
    modules: ['Dashboard', 'Users', 'Trading', 'Copy Trading', 'Prop Trading', 'Reports'],
    actions: ['view', 'edit', 'approve', 'export'],
  },
  {
    id: 'ROLE-003', name: 'COMPLIANCE', label: 'Compliance', desc: 'Access to KYC, AML, document reviews, and reports.',
    userCount: 2, scope: 'COMPLIANCE_MODULES', status: 'ACTIVE', updated: '2024-03-10', color: '#a78bfa',
    modules: ['Dashboard', 'Users', 'Finance', 'Reports'],
    actions: ['view', 'create', 'edit', 'approve', 'export'],
  },
  {
    id: 'ROLE-004', name: 'FINANCE', label: 'Finance', desc: 'Access to payments, payouts, commissions, and billing.',
    userCount: 2, scope: 'FINANCE_MODULES', status: 'ACTIVE', updated: '2024-04-05', color: 'var(--brand)',
    modules: ['Dashboard', 'Finance', 'IB System', 'Reports'],
    actions: ['view', 'create', 'edit', 'approve', 'export'],
  },
  {
    id: 'ROLE-005', name: 'SUPPORT', label: 'Support Agent', desc: 'Access to support tickets and basic account actions.',
    userCount: 3, scope: 'SUPPORT_MODULES', status: 'ACTIVE', updated: '2024-05-18', color: 'var(--cyan)',
    modules: ['Dashboard', 'Users', 'Finance'],
    actions: ['view', 'create', 'edit'],
  },
  {
    id: 'ROLE-006', name: 'READ_ONLY', label: 'Read Only', desc: 'Can view approved modules but cannot make changes.',
    userCount: 0, scope: 'VIEW_ONLY', status: 'DRAFT', updated: '2024-07-01', color: 'rgba(255,255,255,0.3)',
    modules: ['Dashboard', 'Reports'],
    actions: ['view', 'export'],
  },
];

export const PERM_MODULES = [
  { id: 'dashboard', label: 'Dashboard', Icon: BarChart2 },
  { id: 'users', label: 'Users', Icon: Users },
  { id: 'finance', label: 'Finance', Icon: CreditCard },
  { id: 'trading', label: 'Trading', Icon: TrendingUp },
  { id: 'copy_trading', label: 'Copy Trading', Icon: GitBranch },
  { id: 'prop_trading', label: 'Prop Trading', Icon: Trophy },
  { id: 'ib_system', label: 'IB System', Icon: Network },
  { id: 'reports', label: 'Reports', Icon: FileText },
  { id: 'settings', label: 'Settings', Icon: Settings },
  { id: 'admin_mgmt', label: 'Admins & Access', Icon: Shield },
];

export const PERM_ACTIONS = ['view', 'create', 'edit', 'approve', 'delete', 'export', 'assign'];

export const buildInitialMatrix = () => {
  const matrix = {};
  rolesData.forEach(role => {
    matrix[role.name] = {};
    PERM_MODULES.forEach(mod => {
      matrix[role.name][mod.id] = {};
      PERM_ACTIONS.forEach(action => {
        const hasModule = role.modules.some(m => m.toLowerCase().replace(/\s/g, '_') === mod.id || m.toLowerCase().includes(mod.id.split('_')[0]));
        const hasAction = role.actions.includes(action);
        matrix[role.name][mod.id][action] = hasModule && hasAction;
      });
    });
  });
  return matrix;
};

export const accessLogsData = [
  { id: 'EVT-5501', admin: 'Arjun Ravi', action: 'LOGIN', module: 'Auth', severity: 'INFO', ip: '103.82.14.201', device: 'Desktop', status: 'SUCCESS', ts: '2024-08-01 14:32:18', browser: 'Chrome 126', location: 'Mumbai, IN' },
  { id: 'EVT-5500', admin: 'Keiran Lynch', action: 'APPROVE_PAYOUT', module: 'Finance', severity: 'INFO', ip: '82.44.18.7', device: 'Desktop', status: 'SUCCESS', ts: '2024-08-01 14:18:04', browser: 'Firefox 128', location: 'Dublin, IE' },
  { id: 'EVT-5499', admin: 'Omar Farouk', action: 'LOGIN_FAILED', module: 'Auth', severity: 'WARNING', ip: '197.44.82.11', device: 'Mobile', status: 'FAILED', ts: '2024-08-01 13:55:41', browser: 'Safari 17', location: 'Cairo, EG' },
  { id: 'EVT-5498', admin: 'Omar Farouk', action: 'LOGIN_FAILED', module: 'Auth', severity: 'WARNING', ip: '197.44.82.11', device: 'Mobile', status: 'FAILED', ts: '2024-08-01 13:54:22', browser: 'Safari 17', location: 'Cairo, EG' },
  { id: 'EVT-5497', admin: 'Omar Farouk', action: 'ACCOUNT_LOCKED', module: 'Auth', severity: 'ERROR', ip: '197.44.82.11', device: 'Mobile', status: 'LOCKED', ts: '2024-08-01 13:54:25', browser: 'Safari 17', location: 'Cairo, EG' },
  { id: 'EVT-5496', admin: 'Priya Sharma', action: 'EXPORT_REPORT', module: 'Reports', severity: 'INFO', ip: '49.36.88.14', device: 'Desktop', status: 'SUCCESS', ts: '2024-08-01 12:40:11', browser: 'Chrome 126', location: 'Delhi, IN' },
  { id: 'EVT-5495', admin: 'System', action: 'PRIVILEGE_CHANGE', module: 'Admin Mgmt', severity: 'CRITICAL', ip: 'SYSTEM', device: 'Server', status: 'SUCCESS', ts: '2024-08-01 11:30:00', browser: 'N/A', location: 'System' },
  { id: 'EVT-5494', admin: 'Yuki Nakamura', action: 'SUSPEND_USER', module: 'Users', severity: 'WARNING', ip: '210.140.22.14', device: 'Desktop', status: 'SUCCESS', ts: '2024-08-01 10:18:33', browser: 'Chrome 126', location: 'Tokyo, JP' },
  { id: 'EVT-5493', admin: 'Marcus Webb', action: 'VIEW_USER', module: 'Users', severity: 'INFO', ip: '80.76.14.22', device: 'Desktop', status: 'SUCCESS', ts: '2024-08-01 09:55:12', browser: 'Edge 125', location: 'London, UK' },
  { id: 'EVT-5492', admin: 'Unknown', action: 'BRUTE_FORCE', module: 'Auth', severity: 'CRITICAL', ip: '45.142.88.200', device: 'Bot', status: 'BLOCKED', ts: '2024-08-01 03:14:08', browser: 'Unknown', location: 'Unknown (RU)' },
  { id: 'EVT-5491', admin: 'Keiran Lynch', action: 'ROLE_ASSIGN', module: 'Admin Mgmt', severity: 'WARNING', ip: '82.44.18.7', device: 'Desktop', status: 'SUCCESS', ts: '2024-07-31 18:22:44', browser: 'Firefox 128', location: 'Dublin, IE' },
  { id: 'EVT-5490', admin: 'Dev Kapoor', action: 'PAYOUT_REJECTED', module: 'Finance', severity: 'INFO', ip: '49.36.88.21', device: 'Desktop', status: 'SUCCESS', ts: '2024-07-31 16:44:01', browser: 'Chrome 126', location: 'Bangalore, IN' },
];

export const activityLogsData = [
  { id: 'ACT-1101', admin: 'Arjun Ravi', module: 'Admin Mgmt', action: 'ROLE_CREATED', detail: 'Created new role "READ_ONLY" with view-only permissions', severity: 'INFO', ts: '2024-08-01 14:10:00' },
  { id: 'ACT-1100', admin: 'Keiran Lynch', module: 'Finance', action: 'PAYOUT_APPROVED', detail: 'Approved payout PAY-9041 ($18,400) for partner Rehan Capital', severity: 'INFO', ts: '2024-08-01 14:18:04' },
  { id: 'ACT-1099', admin: 'Priya Sharma', module: 'Users', action: 'KYC_APPROVED', detail: 'Approved KYC for user UID-7823 (Marcus Chen)', severity: 'INFO', ts: '2024-08-01 13:42:18' },
  { id: 'ACT-1098', admin: 'Arjun Ravi', module: 'Admin Mgmt', action: 'PERMISSION_CHANGED', detail: 'Revoked "delete" permission from SUPPORT role on Finance module', severity: 'WARNING', ts: '2024-08-01 12:30:00' },
  { id: 'ACT-1097', admin: 'Yuki Nakamura', module: 'Users', action: 'USER_SUSPENDED', detail: 'Suspended user UID-3341 (Ali Hassan) — risk breach', severity: 'WARNING', ts: '2024-08-01 10:18:33' },
  { id: 'ACT-1096', admin: 'System', module: 'Auth', action: 'ACCOUNT_LOCKED', detail: 'Auto-locked ADM-007 (Omar Farouk) after 5 failed 2FA attempts', severity: 'ERROR', ts: '2024-08-01 13:54:25' },
  { id: 'ACT-1095', admin: 'Dev Kapoor', module: 'Finance', action: 'COMMISSION_HELD', detail: 'Placed hold on COM-8815 ($90) for compliance review', severity: 'INFO', ts: '2024-07-31 16:44:01' },
  { id: 'ACT-1094', admin: 'Keiran Lynch', module: 'Admin Mgmt', action: 'ROLE_ASSIGNED', detail: 'Assigned role COMPLIANCE to ADM-008 (Nina Volkov)', severity: 'WARNING', ts: '2024-07-31 18:22:44' },
  { id: 'ACT-1093', admin: 'Priya Sharma', module: 'Prop Trading', action: 'STRATEGY_SUSPENDED', detail: 'Suspended strategy CHAL-07 (Instant 10K) — compliance review', severity: 'WARNING', ts: '2024-07-31 15:08:12' },
  { id: 'ACT-1092', admin: 'Arjun Ravi', module: 'Settings', action: 'SYSTEM_CONFIG', detail: 'Updated risk engine config — max leverage cap changed to 1:200', severity: 'ERROR', ts: '2024-07-31 11:00:00' },
  { id: 'ACT-1091', admin: 'Marcus Webb', module: 'Users', action: 'NOTE_ADDED', detail: 'Added internal note to user UID-9102 (Dev Patel)', severity: 'INFO', ts: '2024-07-31 09:55:12' },
  { id: 'ACT-1090', admin: 'Dev Kapoor', module: 'IB System', action: 'PAYOUT_REJECTED', detail: 'Rejected payout PAY-9034 ($2,100) — incomplete verification', severity: 'WARNING', ts: '2024-07-30 16:44:01' },
  { id: 'ACT-1089', admin: 'System', module: 'Auth', action: 'BRUTE_FORCE_BLOCKED', detail: '14 login attempts from 45.142.88.200 — IP blocked for 24h', severity: 'CRITICAL', ts: '2024-08-01 03:14:08' },
  { id: 'ACT-1088', admin: 'Priya Sharma', module: 'Reports', action: 'EXPORT', detail: 'Exported compliance report Q2-2024 (1,240 records)', severity: 'INFO', ts: '2024-07-30 12:40:11' },
];
