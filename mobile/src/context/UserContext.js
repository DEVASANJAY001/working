import React, { createContext, useContext, useState, useEffect } from 'react';
import { safeStorage } from '../utils/storage';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const sessionStr = await safeStorage.getItem('user_session');
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        if (session && session.isLoggedIn) {
          setUser(session.user || null);
        }
      }
    } catch (e) {
      console.log('UserContext loadUser error:', e);
    }
    setLoading(false);
  };

  const saveUser = async (userData) => {
    try {
      setUser(userData);
      const session = { isLoggedIn: true, user: userData };
      await safeStorage.setItem('user_session', JSON.stringify(session));
    } catch (e) {
      console.log('UserContext saveUser error:', e);
    }
  };

  const clearUser = async () => {
    try {
      setUser(null);
      await safeStorage.removeItem('user_session');
    } catch (e) {
      console.log('UserContext clearUser error:', e);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser: saveUser, clearUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserContext;
