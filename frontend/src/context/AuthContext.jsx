import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginApi, logoutApi, fetchCurrentUser } from '../api/client';
import { isJwtValid } from '../components/admin/ProtectedRoute';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token || !isJwtValid(token)) {
      logoutApi();
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const userData = await fetchCurrentUser();
      const isAdmin = Boolean(userData && (userData.is_staff || userData.is_superuser));
      if (!isAdmin) {
        logoutApi();
        setIsAuthenticated(false);
        setUser(null);
      } else {
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Auth verification failed:', err);
      logoutApi();
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();

    const handleLogout = () => {
      setIsAuthenticated(false);
      setUser(null);
    };

    window.addEventListener('auth-logout', handleLogout);
    return () => window.removeEventListener('auth-logout', handleLogout);
  }, [checkAuth]);

  const login = async (username, password) => {
    const data = await loginApi(username, password);
    const userData = await fetchCurrentUser();
    const isAdmin = Boolean(userData && (userData.is_staff || userData.is_superuser));
    if (!isAdmin) {
      logoutApi();
      setIsAuthenticated(false);
      setUser(null);
      throw new Error('Access denied: Staff administrator privileges required.');
    }
    setUser(userData);
    setIsAuthenticated(true);
    return data;
  };

  const logout = () => {
    logoutApi();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
