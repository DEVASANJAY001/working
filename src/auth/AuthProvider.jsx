import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { authService } from '../services/authService';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async ({ email, password }) => {
    const result = await authService.signIn({ username: email, password });
    // AWS Amplify or custom signIn can return status or session
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
    return currentUser;
  };

  const logout = async () => {
    await authService.signOut();
    setUser(null);
  };

  const register = async ({ name, email, password, phone }) => {
    const cleanPhone = phone.replace(/\D/g, "");
    const cognitoPhone = `+91${cleanPhone}`;
    return await authService.signUp({
      username: email.trim(),
      password,
      options: {
        userAttributes: {
          email: email.trim(),
          name: name.trim(),
          phone_number: cognitoPhone,
        },
      },
    });
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    role: user?.role || null,
    login,
    logout,
    register,
    checkSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
