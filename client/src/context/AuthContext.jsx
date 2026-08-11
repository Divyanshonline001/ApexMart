import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Load user data on startup if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const userData = await authAPI.getMe();
          setUser(userData);
        } catch (error) {
          console.error('Failed to load user profile:', error);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authAPI.login(email, password);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      });
      return { success: true };
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Login failed';
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role = 'user') => {
    setLoading(true);
    try {
      const data = await authAPI.register(name, email, password, role);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      });
      return { success: true };
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Registration failed';
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await authAPI.logout();
      }
    } catch (error) {
      console.warn('Backend logout failed:', error.message);
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    }
  };

  const updateProfile = async (updatedFields) => {
    if (!user) return { success: false, error: 'Not logged in' };
    try {
      const data = await userAPI.updateUser(user._id, updatedFields);
      setUser(prev => ({
        ...prev,
        name: data.name,
        email: data.email,
      }));
      return { success: true };
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Update failed';
      return { success: false, error: errMsg };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
