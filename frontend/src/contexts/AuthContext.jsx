import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockUsers } from '../utils/mockData';
import { STORAGE_KEYS } from '../utils/constants';
import { getDashboardPath } from '../utils/sidebarConfig';

// Create the Auth Context
const AuthContext = createContext({
  user: null,
  loading: true,
  isAuthenticated: false,
  error: null,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
});

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Initialize auth from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Always prefer sessionStorage (fresh session auth only)
        const sesToken = sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const sesUser = sessionStorage.getItem(STORAGE_KEYS.USER_DATA);

        if (sesToken && sesUser) {
          const userData = JSON.parse(sesUser);
          setUser(userData);
          setIsAuthenticated(true);
        }

        // Proactively clear any stale persistent tokens to avoid auto-login
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      } catch (e) {
        console.error('Error initializing auth:', e);
        sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        sessionStorage.removeItem(STORAGE_KEYS.USER_DATA);
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = useCallback(async (email, password, remember = false) => {
    setLoading(true);
    setError(null);
    try {
      const foundUser = Object.values(mockUsers).find(u => u.email === email);
      if (!foundUser) throw new Error('Invalid email or password');
      if (!password) throw new Error('Password is required');

      const token = 'mock-jwt-token-' + Date.now();
      const userData = { ...foundUser, token, loginTime: new Date().toISOString() };

      // Persist auth based on remember flag
      if (remember) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      } else {
        sessionStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        sessionStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        // Ensure no stale persistent session remains
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      }

      setUser(userData);
      setIsAuthenticated(true);

      const dashboardPath = getDashboardPath(userData.role);
      navigate(dashboardPath);
      return { success: true, user: userData };
    } catch (e) {
      setError(e.message);
      return { success: false, error: e.message };
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Logout function
  const logout = useCallback(() => {
    // Clear both storages to fully sign out
    sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    setUser(null);
    setIsAuthenticated(false);
    navigate('/auth/sign-in');
  }, [navigate]);

  // Update user function
  const updateUser = useCallback((updates) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
  }, [user]);

  const clearError = () => setError(null);

  const value = { user, loading, isAuthenticated, error, login, logout, updateUser, clearError };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Export the context for rare cases where direct access is needed
export default AuthContext;
