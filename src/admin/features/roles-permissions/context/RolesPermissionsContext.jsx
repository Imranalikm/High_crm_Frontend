import React, { createContext, useContext, useState, useEffect } from 'react';
import { rolesData as initialRoles, adminUsers as initialAdmins } from '@/config/constants/roles-permissions/workspaces/admin-mgmt.workspace';

const RolesPermissionsContext = createContext(null);

const DEFAULT_MODULES = [
  { id: 'dashboard', label: 'Dashboard', Icon: 'BarChart2' },
  { id: 'users', label: 'Users', Icon: 'Users' },
  { id: 'finance', label: 'Finance', Icon: 'CreditCard' },
  { id: 'trading', label: 'Trading', Icon: 'TrendingUp' },
  { id: 'copy_trading', label: 'Copy Trading', Icon: 'GitBranch' },
  { id: 'prop_trading', label: 'Prop Trading', Icon: 'Trophy' },
  { id: 'ib_system', label: 'IB System', Icon: 'Network' },
  { id: 'reports', label: 'Reports', Icon: 'FileText' },
  { id: 'settings', label: 'Settings', Icon: 'Settings' },
  { id: 'admin_mgmt', label: 'Admin Mgmt', Icon: 'Shield' },
];

export const PERM_ACTIONS = ['view', 'create', 'edit', 'approve', 'delete', 'export', 'assign'];

export function RolesPermissionsProvider({ children }) {
  // 1. Modules State
  const [modules, setModules] = useState(() => {
    const cached = localStorage.getItem('lt_admin_modules');
    return cached ? JSON.parse(cached) : DEFAULT_MODULES;
  });

  // 2. Roles State
  const [roles, setRoles] = useState(() => {
    const cached = localStorage.getItem('lt_admin_roles');
    if (cached) return JSON.parse(cached);
    // Format initial roles with color preset if not already present
    return initialRoles.map(role => ({
      ...role,
      color: role.color || '#e5c07b'
    }));
  });

  // 3. Permissions Matrix State
  const [matrix, setMatrix] = useState(() => {
    const cached = localStorage.getItem('lt_admin_matrix');
    if (cached) return JSON.parse(cached);
    
    // Build initial matrix matching roles Data
    const initialMatrix = {};
    initialRoles.forEach(role => {
      initialMatrix[role.name] = {};
      DEFAULT_MODULES.forEach(mod => {
        initialMatrix[role.name][mod.id] = {};
        PERM_ACTIONS.forEach(action => {
          const hasModule = role.modules.some(
            m => m.toLowerCase().replace(/\s/g, '_') === mod.id || m.toLowerCase().includes(mod.id.split('_')[0])
          );
          const hasAction = role.actions.includes(action);
          initialMatrix[role.name][mod.id][action] = hasModule && hasAction;
        });
      });
    });
    return initialMatrix;
  });

  // 4. Admin Users State
  const [adminUsers, setAdminUsers] = useState(() => {
    const cached = localStorage.getItem('lt_admin_users');
    return cached ? JSON.parse(cached) : initialAdmins;
  });

  // Keep localStorage in sync
  useEffect(() => {
    localStorage.setItem('lt_admin_modules', JSON.stringify(modules));
  }, [modules]);

  useEffect(() => {
    localStorage.setItem('lt_admin_roles', JSON.stringify(roles));
  }, [roles]);

  useEffect(() => {
    localStorage.setItem('lt_admin_matrix', JSON.stringify(matrix));
  }, [matrix]);

  useEffect(() => {
    localStorage.setItem('lt_admin_users', JSON.stringify(adminUsers));
  }, [adminUsers]);

  // Recalculate member count for roles based on active admins
  const updateRoleUserCounts = (currentAdmins) => {
    setRoles(prevRoles =>
      prevRoles.map(role => ({
        ...role,
        userCount: currentAdmins.filter(admin => admin.role === role.name).length
      }))
    );
  };

  /* ══════════════════════════════════════════════════════════════
     MODULE CRUD OPERATIONS
  ══════════════════════════════════════════════════════════════ */
  
  const createModule = (label, iconName, desc) => {
    const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    if (modules.some(m => m.id === id)) {
      throw new Error(`Module with ID "${id}" already exists.`);
    }

    const newModule = { id, label, Icon: iconName || 'Shield', desc: desc || '' };
    
    // Add to modules list
    setModules(prev => [...prev, newModule]);

    // Initialize in permissions matrix for all roles
    setMatrix(prev => {
      const updated = { ...prev };
      roles.forEach(role => {
        if (!updated[role.name]) updated[role.name] = {};
        updated[role.name][id] = {};
        PERM_ACTIONS.forEach(action => {
          // Super admin gets all by default, others get false
          updated[role.name][id][action] = role.name === 'SUPER_ADMIN';
        });
      });
      return updated;
    });

    // Update role configuration modules list for SUPER_ADMIN
    setRoles(prev =>
      prev.map(role => {
        if (role.name === 'SUPER_ADMIN') {
          return { ...role, modules: [...role.modules, label] };
        }
        return role;
      })
    );
  };

  const updateModule = (id, label, iconName, desc) => {
    setModules(prev =>
      prev.map(m => (m.id === id ? { ...m, label, Icon: iconName, desc: desc || '' } : m))
    );
  };

  const deleteModule = (id) => {
    const targetModule = modules.find(m => m.id === id);
    if (!targetModule) return;

    // Remove from modules
    setModules(prev => prev.filter(m => m.id !== id));

    // Remove from matrix
    setMatrix(prev => {
      const updated = { ...prev };
      roles.forEach(role => {
        if (updated[role.name]) {
          delete updated[role.name][id];
        }
      });
      return updated;
    });

    // Remove module name from role definitions
    setRoles(prev =>
      prev.map(role => ({
        ...role,
        modules: role.modules.filter(m => m !== targetModule.label)
      }))
    );
  };

  /* ══════════════════════════════════════════════════════════════
     ROLE CRUD OPERATIONS
  ══════════════════════════════════════════════════════════════ */

  const createRole = (label, desc, status, color) => {
    const name = label.toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    if (roles.some(r => r.name === name)) {
      throw new Error(`Role with key "${name}" already exists.`);
    }

    const newRoleObj = {
      id: `ROLE-${String(Math.floor(Math.random() * 900) + 100)}`,
      name,
      label,
      desc,
      status: status || 'ACTIVE',
      color: color || '#a78bfa',
      userCount: 0,
      scope: 'CUSTOM_SCOPE',
      updated: new Date().toISOString().split('T')[0],
      modules: [],
      actions: []
    };

    setRoles(prev => [...prev, newRoleObj]);

    // Initialize matrix with false for all modules
    setMatrix(prev => ({
      ...prev,
      [name]: Object.fromEntries(
        modules.map(mod => [
          mod.id,
          Object.fromEntries(PERM_ACTIONS.map(action => [action, false]))
        ])
      )
    }));
  };

  const updateRole = (id, label, desc, status, color) => {
    setRoles(prev =>
      prev.map(r => (r.id === id ? { ...r, label, desc, status, color } : r))
    );
  };

  const deleteRole = (id) => {
    const targetRole = roles.find(r => r.id === id);
    if (!targetRole) return;
    if (targetRole.name === 'SUPER_ADMIN') {
      throw new Error('Super Admin role cannot be deleted.');
    }

    // Remove from roles
    setRoles(prev => prev.filter(r => r.id !== id));

    // Remove from matrix
    setMatrix(prev => {
      const updated = { ...prev };
      delete updated[targetRole.name];
      return updated;
    });

    // Reassign any admins with this role to 'READ_ONLY'
    setAdminUsers(prevAdmins => {
      const updatedAdmins = prevAdmins.map(admin =>
        admin.role === targetRole.name ? { ...admin, role: 'READ_ONLY' } : admin
      );
      // Recalculate member counts with the new admin list
      setTimeout(() => updateRoleUserCounts(updatedAdmins), 0);
      return updatedAdmins;
    });
  };

  /* ══════════════════════════════════════════════════════════════
     ADMIN USER CRUD OPERATIONS
  ══════════════════════════════════════════════════════════════ */

  const createAdmin = (admin) => {
    const newId = `ADM-${String(adminUsers.length + 1).padStart(3, '0')}`;
    const newAdminObj = {
      id: newId,
      name: admin.name,
      email: admin.email,
      role: admin.role || 'SUPPORT',
      status: admin.status || 'ACTIVE',
      twoFA: admin.twoFA || false,
      lastLogin: 'Never',
      created: new Date().toISOString().split('T')[0],
      locked: false,
      logins: 0,
      actions: 0,
      region: admin.region || 'US'
    };

    setAdminUsers(prev => {
      const nextAdmins = [newAdminObj, ...prev];
      updateRoleUserCounts(nextAdmins);
      return nextAdmins;
    });
  };

  const updateAdmin = (id, updatedFields) => {
    setAdminUsers(prev => {
      const nextAdmins = prev.map(admin =>
        admin.id === id ? { ...admin, ...updatedFields } : admin
      );
      updateRoleUserCounts(nextAdmins);
      return nextAdmins;
    });
  };

  const deleteAdmin = (id) => {
    setAdminUsers(prev => {
      const nextAdmins = prev.filter(admin => admin.id !== id);
      updateRoleUserCounts(nextAdmins);
      return nextAdmins;
    });
  };

  /* ══════════════════════════════════════════════════════════════
     GRANULAR PERMISSION MATRIX ACTIONS
  ══════════════════════════════════════════════════════════════ */

  const togglePerm = (role, mod, action) => {
    setMatrix(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [mod]: {
          ...prev[role]?.[mod],
          [action]: !prev[role]?.[mod]?.[action]
        }
      }
    }));
  };

  const toggleRow = (role, mod) => {
    setMatrix(prev => {
      const rowPerms = prev[role]?.[mod] || {};
      const allOn = PERM_ACTIONS.every(a => rowPerms[a]);
      return {
        ...prev,
        [role]: {
          ...prev[role],
          [mod]: Object.fromEntries(PERM_ACTIONS.map(a => [a, !allOn]))
        }
      };
    });
  };

  const toggleCol = (role, action) => {
    setMatrix(prev => {
      const allOn = modules.every(m => prev[role]?.[m.id]?.[action]);
      const updatedModules = {};
      modules.forEach(m => {
        updatedModules[m.id] = {
          ...prev[role]?.[m.id],
          [action]: !allOn
        };
      });
      return {
        ...prev,
        [role]: {
          ...prev[role],
          ...updatedModules
        }
      };
    });
  };

  const toggleAll = (role, val) => {
    setMatrix(prev => {
      const updatedModules = {};
      modules.forEach(m => {
        updatedModules[m.id] = Object.fromEntries(PERM_ACTIONS.map(a => [a, val]));
      });
      return {
        ...prev,
        [role]: {
          ...prev[role],
          ...updatedModules
        }
      };
    });
  };

  // Sync role's allowed modules and actions arrays based on matrix selection
  const savePermissions = (roleName) => {
    const roleMatrix = matrix[roleName];
    if (!roleMatrix) return;

    // Find allowed actions
    const allowedActions = new Set();
    const allowedModules = [];

    modules.forEach(mod => {
      const hasAnyAction = PERM_ACTIONS.some(action => roleMatrix[mod.id]?.[action]);
      if (hasAnyAction) {
        allowedModules.push(mod.label);
        PERM_ACTIONS.forEach(action => {
          if (roleMatrix[mod.id]?.[action]) {
            allowedActions.add(action);
          }
        });
      }
    });

    setRoles(prev =>
      prev.map(role =>
        role.name === roleName
          ? {
              ...role,
              modules: allowedModules,
              actions: Array.from(allowedActions),
              updated: new Date().toISOString().split('T')[0]
            }
          : role
      )
    );
  };

  return (
    <RolesPermissionsContext.Provider
      value={{
        modules,
        roles,
        matrix,
        adminUsers,
        PERM_ACTIONS,
        createModule,
        updateModule,
        deleteModule,
        createRole,
        updateRole,
        deleteRole,
        createAdmin,
        updateAdmin,
        deleteAdmin,
        togglePerm,
        toggleRow,
        toggleCol,
        toggleAll,
        savePermissions
      }}
    >
      {children}
    </RolesPermissionsContext.Provider>
  );
}

export function useRolesPermissions() {
  const context = useContext(RolesPermissionsContext);
  if (!context) {
    throw new Error('useRolesPermissions must be used within a RolesPermissionsProvider');
  }
  return context;
}
