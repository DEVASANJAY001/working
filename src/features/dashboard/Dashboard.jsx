import React, { useState, useEffect } from 'react';
import { LogOut, ShieldCheck } from 'lucide-react';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { authService } from '../../services/authService';

export default function Dashboard({ user, onLogout }) {
  const [displayName, setDisplayName] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function loadName() {
      try {
        const attrs = await fetchUserAttributes();
        const name =
          attrs.name ||
          attrs.email ||
          user?.signInDetails?.loginId ||
          user?.username ||
          'User';
        setDisplayName(name);
      } catch {
        // fallback if attributes can't be fetched
        setDisplayName(
          user?.signInDetails?.loginId ||
          user?.username ||
          'User'
        );
      }
    }
    loadName();
  }, [user]);

  const handleSignOut = async () => {
    setLoggingOut(true);
    try {
      await authService.signOut();
      onLogout();
    } catch (err) {
      console.error('Sign out failed:', err);
      onLogout();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0FAF4] via-white to-[#E8F5FF] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 overflow-hidden">

        {/* Top green accent band */}
        <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400" />

        {/* Hero Section */}
        <div className="px-8 pt-10 pb-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30 mb-5">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Hi, {displayName} 👋
          </h1>
          <p className="mt-2 text-lg text-gray-500 font-medium">Welcome!!</p>
        </div>

        {/* Divider */}
        <div className="px-8 py-4">
          <div className="h-px bg-gray-100" />
        </div>

        {/* Sign Out Button */}
        <div className="px-8 pb-8">
          <button
            onClick={handleSignOut}
            disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-700 hover:text-red-600 font-semibold rounded-xl text-sm transition-all duration-150 active:scale-[0.98] group disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loggingOut ? (
              <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                Sign Out
              </>
            )}
          </button>
        </div>
      </div>

      <p className="mt-6 text-xs text-gray-400 text-center">
        Your session is secured with SimpleAuth
      </p>
    </div>
  );
}
