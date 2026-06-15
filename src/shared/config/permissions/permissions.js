import { buildInitialMatrix } from '@/shared/config/constants/roles-permissions/workspaces/admin-mgmt.workspace';

/**
 * Global Permissions Registry
 * 
 * Defines all available frontend granular permissions for rendering specific UI modules,
 * buttons, and routes. Helps safely disable/hide elements for roles without access.
 */
export const PERMISSIONS = {
  dashboard: {
    view: 'dashboard.view',
  },
  users: {
    view: 'users.view',
    create: 'users.create',
    edit: 'users.edit',
    kyc: 'users.kyc',
    mt5: 'users.mt5',
    risk: 'users.risk',
  },
  finance: {
    view: 'finance.view',
    approve: 'finance.approve',
    export: 'finance.export',
  },
  trading: {
    view: 'trading.view',
    intervene: 'trading.intervene',
  },
  copyTrading: {
    view: 'copy-trading.view',
    manage: 'copy-trading.manage',
  },
  propTrading: {
    view: 'prop-trading.view',
    manage: 'prop-trading.manage',
    approve: 'prop-trading.approve',
  },
  ibSystem: {
    view: 'ib-system.view',
    payouts: 'ib-system.payouts',
  },
  reports: {
    view: 'reports.view',
    export: 'reports.export',
  },
  support: {
    view: 'support.view',
    escalate: 'support.escalate',
  },
  settings: {
    view: 'settings.view',
    edit: 'settings.edit',
  },
  rolesPermissions: {
    view: 'admin-mgmt.view',
    manage: 'admin-mgmt.manage',
  },
  groupManagement: {
    view: 'group-management.view',
    manage: 'group-management.manage',
  },

};


/**
 * Utility to check if a set of granted permissions covers a required permission.
 * Supports '*' wildcards and arrays of required permissions.
 *
 * @param {string[]} grantedPermissions - Array of permissions the user possesses.
 * @param {string|string[]} requiredPermission - The permission(s) required to pass.
 * @returns {boolean} True if access is granted, otherwise false.
 */
export function hasPermission(grantedPermissions = [], requiredPermission) {
  if (!requiredPermission) return true;

  if (grantedPermissions.includes('*')) {
    return true;
  }

  if (Array.isArray(requiredPermission)) {
    return requiredPermission.every((permission) => grantedPermissions.includes(permission));
  }

  return grantedPermissions.includes(requiredPermission);
}

/**
 * Resolves permissions for a given role based on the local permissions matrix.
 * Super Admin gets '*' (all permissions).
 */
export function getPermissionsForRole(roleName) {
  if (!roleName) return [];
  const normalizedRole = roleName.toUpperCase().replace(/-/g, '_');
  
  if (normalizedRole === 'SUPER_ADMIN') {
    return ['*'];
  }

  let matrix = null;
  try {
    const cachedMatrix = localStorage.getItem('lt_admin_matrix');
    if (cachedMatrix) {
      matrix = JSON.parse(cachedMatrix);
    }
  } catch (e) {
    console.error('Failed to parse lt_admin_matrix:', e);
  }

  if (!matrix) {
    matrix = buildInitialMatrix();
  }

  const roleMatrix = matrix[normalizedRole];
  if (!roleMatrix) return [];

  const flat = [];
  for (const [moduleId, actionsObj] of Object.entries(roleMatrix)) {
    const permModuleId = moduleId.replace(/_/g, '-');
    for (const [actionName, isAllowed] of Object.entries(actionsObj)) {
      if (isAllowed) {
        flat.push(`${permModuleId}.${actionName}`);
      }
    }
  }
  return flat;
}

