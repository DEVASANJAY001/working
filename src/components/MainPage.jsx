import React from 'react';
import { LogOut, ShieldCheck, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/authService';

export default function MainPage({ user, onLogout }) {
  const handleLogout = async () => {
    try {
      await authService.signOut();
      onLogout();
    } catch (err) {
      console.error('Logout failed:', err);
      onLogout(); // force logout anyway
    }
  };

  const loginId = user.signInDetails?.loginId || user.username || 'Authenticated User';
  const isEmail = loginId.includes('@');
  const displayName = loginId.split('@')[0] || loginId;

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
          <h1 className="text-2xl font-bold text-gray-900">You're signed in!</h1>
          <p className="mt-1 text-sm text-gray-500">Welcome back, {displayName}</p>
        </div>

        {/* User Info Card */}
        <div className="px-8 pb-2">
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Signed in as</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                {isEmail
                  ? <Mail className="w-5 h-5 text-emerald-600" />
                  : <Phone className="w-5 h-5 text-emerald-600" />}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{loginId}</p>
                <p className="text-xs text-gray-400">{isEmail ? 'Email address' : 'Phone number'}</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 ml-auto" />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="px-8 py-4">
          <div className="h-px bg-gray-100" />
        </div>

        {/* Sign Out Button */}
        <div className="px-8 pb-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-700 hover:text-red-600 font-semibold rounded-xl text-sm transition-all duration-150 active:scale-[0.98] group"
          >
            <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            Sign Out
          </button>
        </div>
      </div>

      <p className="mt-6 text-xs text-gray-400 text-center">
        Your session is secured with SimpleAuth
      </p>
    </div>
  );
}
