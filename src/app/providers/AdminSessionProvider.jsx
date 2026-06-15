/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from '@/auth/AuthContext';

/**
 * AdminSessionProvider
 *
 * A thin bridge that exposes the same `useAdminSession()` API that
 * all existing admin pages rely on, but now derives its data from
 * the real AuthProvider instead of a hardcoded object.
 *
 * No existing admin page component needs to change.
 */

const AdminSessionContext = createContext(null);

export function AdminSessionProvider({ children }) {
  const { user, permissions, isAuthenticated } = useAuth();

  const value = useMemo(() => ({
    user: user ?? { id: '', name: '', initials: '', role: '' },
    permissions,
    isAuthenticated,
  }), [user, permissions, isAuthenticated]);

  return (
    <AdminSessionContext.Provider value={value}>
      {children}
    </AdminSessionContext.Provider>
  );
}

export function useAdminSession() {
  const context = useContext(AdminSessionContext);

  if (!context) {
    throw new Error('useAdminSession must be used within AdminSessionProvider');
  }

  return context;
}
