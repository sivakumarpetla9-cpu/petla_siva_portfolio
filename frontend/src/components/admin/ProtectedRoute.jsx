import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function isJwtValid(token) {
  if (!token || typeof token !== 'string') return false;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const payload = JSON.parse(atob(base64));
    if (!payload.exp) return false;
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export default function ProtectedAdminRoute() {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();
  const token = localStorage.getItem('access_token');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090c15] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-400 text-xs font-semibold">Verifying administrative access...</span>
        </div>
      </div>
    );
  }

  // 1. Must have a valid, non-expired JWT token
  if (!token || !isJwtValid(token)) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // 2. Must be authenticated in context with an active user object
  if (!isAuthenticated || !user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // 3. Must have staff or superuser administrator privileges
  const isAdmin = Boolean(user.is_staff || user.is_superuser);
  if (!isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location, error: 'Admin privileges required.' }} replace />;
  }

  return <Outlet />;
}

export { ProtectedAdminRoute as AuthGuard, ProtectedAdminRoute as ProtectedRoute };
