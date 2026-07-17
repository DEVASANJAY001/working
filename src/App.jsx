import React, { useState, useEffect } from 'react';
import AuthPage from './components/AuthPage';
import MainPage from './components/MainPage';
import { authService } from './services/authService';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check active session on mount
  useEffect(() => {
    async function checkUserSession() {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        // User not authenticated or error
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkUserSession();
  }, []);

  const handleLoginSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5FBF7]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-500 font-medium text-sm">Loading security keys...</span>
        </div>
      </div>
    );
  }

  return user ? (
    <MainPage user={user} onLogout={handleLogout} />
  ) : (
    <AuthPage onLoginSuccess={handleLoginSuccess} />
  );
}
