import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';

export function ClientAuthGuard({ children }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Admin trying to access client portal → redirect to their portal
  if (user?.portalType !== 'client') {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
