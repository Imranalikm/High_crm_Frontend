import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AuthContext } from './AuthContext';
import { loginUser, fetchMe } from './authApiService';
import { PERM_MODULES, PERM_ACTIONS } from '@/shared/config/constants/roles-permissions/workspaces/admin-mgmt.workspace';
import { executeTokenRefresh } from '@/shared/api/client/apiClient';
import { setSession, clearSession } from '@/app/store/slices/authSlice';

/**
 * AuthProvider
 *
 * Wraps application auth state using Redux Toolkit store.
 * Maintains context compatibility so components using useAuth function correctly.
 * Performs session validation and token rotation during initial mount.
 */
export function AuthProvider({ children }) {
  const dispatch = useDispatch();

  // Read from Redux Store
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const permissions = useSelector((state) => state.auth.permissions);

  // loadingMe is true if there's any session token we can attempt to restore
  const [loadingMe, setLoadingMe] = useState(
    () => !!(localStorage.getItem('admin_token') || localStorage.getItem('refresh_token'))
  );

  /**
   * Helper to establish the user session and save tokens/state.
   */
  const establishSession = useCallback((apiUser, accessToken, refreshToken) => {
    if (accessToken) localStorage.setItem('admin_token', accessToken);
    if (refreshToken) localStorage.setItem('refresh_token', refreshToken);

    let roleKey = apiUser?.role?.key || apiUser?.role || 'client';
    if (typeof roleKey === 'string') {
      const normalized = roleKey.toLowerCase().replace(/_/g, '-').replace(/\s+/g, '-');
      if (normalized === 'superadmin' || normalized === 'super-admin') {
        roleKey = 'super-admin';
      } else if (normalized === 'operations') {
        roleKey = 'operations';
      } else if (normalized === 'auditor') {
        roleKey = 'auditor';
      } else {
        roleKey = normalized;
      }
    }

    // Redirect to userpanel if role type is 'user', otherwise redirect to admin
    const isUser = apiUser?.role?.type === 'user';
    const portalType = isUser ? 'client' : 'admin';

    const sessionUser = {
      id: apiUser?.id ? String(apiUser.id) : `api-${Date.now()}`,
      email: apiUser?.email || '',
      name: apiUser?.name || '',
      phone: apiUser?.phone || '',
      country: apiUser?.country || '',
      initials: (apiUser?.name || apiUser?.email || '')
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2),
      role: roleKey,
      portalType,
    };

    dispatch(setSession(sessionUser));
    return sessionUser;
  }, [dispatch]);

  const login = useCallback(async (email, password) => {
    const data = await loginUser(email, password);
    const { accessToken, refreshToken, user: apiUser } = data;
    return establishSession(apiUser, accessToken, refreshToken);
  }, [establishSession]);

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('refresh_token');
    dispatch(clearSession());
  }, [dispatch]);

  // Synchronize initial session fetch / token validation on mount
  useEffect(() => {
    let active = true;

    const initAuth = async () => {
      const token = localStorage.getItem('admin_token');
      const hasRefresh = localStorage.getItem('refresh_token');

      if (!token && !hasRefresh) {
        setLoadingMe(false);
        return;
      }

      try {
        let currentToken = token;
        if (!currentToken && hasRefresh) {
          const rotation = await executeTokenRefresh();
          currentToken = rotation?.accessToken;
        }

        if (!currentToken) throw new Error('No access token available');

        const profile = await fetchMe(currentToken);

        if (active) {
          establishSession(profile.user, currentToken, hasRefresh);
        }
      } catch (err) {
        console.warn('Initial session validation failed, attempting refresh fallback:', err);
        if (token && hasRefresh) {
          try {
            const rotation = await executeTokenRefresh();
            const newToken = rotation?.accessToken;
            if (newToken && active) {
              const profile = await fetchMe(newToken);
              establishSession(profile.user, newToken, rotation?.refreshToken);
              if (active) setLoadingMe(false);
              return;
            }
          } catch (refreshErr) {
            console.error('Session recovery refresh failed:', refreshErr);
          }
        }

        if (active) {
          dispatch(clearSession());
        }
      } finally {
        if (active) {
          setLoadingMe(false);
        }
      }
    };

    initAuth();
    return () => {
      active = false;
    };
  }, [dispatch, establishSession]);

  // Handle centralized force-logout events (e.g. refresh failure in apiClient)
  useEffect(() => {
    const handleForceLogout = () => {
      logout();
    };
    window.addEventListener('auth-logout', handleForceLogout);
    return () => window.removeEventListener('auth-logout', handleForceLogout);
  }, [logout]);

  const value = useMemo(() => ({
    user,
    permissions,
    isAuthenticated,
    login,
    logout,
    establishSession,
  }), [user, permissions, isAuthenticated, login, logout, establishSession]);

  if (loadingMe) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)',
        color: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            border: '2px solid rgba(99, 102, 241, 0.1)',
            borderTopColor: '#6366f1',
            animation: 'authSpin 1s linear infinite',
            position: 'absolute'
          }} />
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ zIndex: 1 }}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes authSpin {
            to { transform: rotate(360deg); }
          }
        `}} />
        <h2 style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '8px', color: '#f1f5f9' }}>
          SECURE LOGIN
        </h2>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
          Restoring your session...
        </p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
