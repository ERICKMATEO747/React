import { useState, useEffect } from 'react';
import { login, saveAuthData, getAuthData, clearAuthData } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { token, user: savedUser } = getAuthData();
    if (token && savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const loginUser = async (credentials) => {
    try {
      const response = await login(credentials);
      if (response.success) {
        const { access_token, user: userData } = response.data;
        saveAuthData(access_token, userData);
        setUser(userData);
        return { success: true };
      }
      throw new Error(response.message || 'Error en el login');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logoutUser = () => {
    clearAuthData();
    setUser(null);
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login: loginUser,
    logout: logoutUser
  };
};