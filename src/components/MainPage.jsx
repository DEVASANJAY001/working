import React from 'react';
import { LogOut, ShieldCheck, Mail, Phone, User } from 'lucide-react';
import { authService } from '../services/authService';

export default function MainPage({ user, onLogout }) {
  const handleLogout = async () => {
    try {
      await authService.signOut();
      onLogout();
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };

  // Extract displaying name or ID
  const loginId = user.signInDetails?.loginId || user.username || 'Authenticated User';
  const isEmail = loginId.includes('@');

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F5FBF7]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden transform transition-all duration-300 hover:shadow-2xl text-center">
        
        {/* Decorative Top Accent Banner */}
        <div className="h-2 bg-gradient-to-r from-emerald-400 via-green-500 to-lime-400"></div>

        <div className="p-8">
          {/* Status Badge */}
          <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
            <ShieldCheck className="w-8 h-8 text-emerald-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900">Welcome Back!</h2>
          <p className="mt-2 text-sm text-gray-500">You are securely signed in.</p>

          {/* User ID Container Card */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center gap-3">
            {isEmail ? (
              <Mail className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <Phone className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            )}
            <span className="text-gray-700 font-semibold text-sm break-all">{loginId}</span>
          </div>

          {/* Logout Action button */}
          <div className="mt-8">
            <button
              onClick={handleLogout}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all shadow-md shadow-emerald-600/20 active:scale-95 text-sm flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
