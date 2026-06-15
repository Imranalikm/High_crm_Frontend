import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';

export function AdminAuthGuard({ children }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Customer trying to access admin portal → redirect to their portal
  if (user?.portalType !== 'admin') {
    return <Navigate to="/client" replace />;
  }

  return children;
}
