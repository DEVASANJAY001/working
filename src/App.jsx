import React, { useState, useEffect } from 'react';
import { Hub } from 'aws-amplify/utils';
import AuthPage from './features/auth/AuthPage';
import Dashboard from './features/dashboard/Dashboard';
import { authService } from './services/authService';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Resolve the current user (called on mount and after OAuth redirect) ──
  async function resolveUser() {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // 1. Check for an existing session on first render
    resolveUser();

    // 2. Listen for Amplify auth events — critical for OAuth redirects.
    //    After signInWithRedirect() returns the user to localhost:5173,
    //    Amplify exchanges the authorization code and fires one of these Hub events.
    //    Without this listener the React state is never updated after the redirect.
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
          // OAuth flow completed successfully — refresh user state
          resolveUser();
          break;

        case 'signInWithRedirect':
          // The redirect is in progress (code is being exchanged)
          setLoading(true);
          break;

        case 'signInWithRedirect_failure':
          // OAuth failed (e.g. user cancelled, invalid_scope, redirect_uri_mismatch)
          console.error('OAuth sign-in failed:', payload.data);
          setLoading(false);
          setUser(null);
          break;

        case 'signedOut':
          setUser(null);
          break;

        default:
          break;
      }
    });

    // Cleanup Hub subscription when component unmounts
    return unsubscribe;
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
    <Dashboard user={user} onLogout={handleLogout} />
  ) : (
    <AuthPage onLoginSuccess={handleLoginSuccess} />
  );
}
