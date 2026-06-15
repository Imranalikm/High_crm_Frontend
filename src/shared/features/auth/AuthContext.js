import { createContext, useContext } from 'react';

/**
 * AuthContext — single source of truth for authentication across
 * both the Admin Portal and the Customer Portal.
 */
export const AuthContext = createContext(null);

/**
 * useAuth — access the auth context from any component.
 * Must be used inside <AuthProvider>.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
