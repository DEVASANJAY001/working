import React from 'react';
import { ShieldCheck, LogOut } from 'lucide-react';

export default function UserMenuDropdown({ currentUser, onGoToAdmin, onLogout }) {
  return (
    <div className="absolute right-0 top-11 w-56 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 py-2 animate-fade-in">
      <div className="px-4 py-2 border-b border-gray-100">
        <p className="text-xs font-bold text-gray-900">{currentUser?.name || 'User'}</p>
        <p className="text-[10px] text-gray-400">u/{currentUser?.username || 'user'}</p>
      </div>
      {currentUser?.isAdmin && (
        <button onClick={onGoToAdmin} className="w-full text-left px-4 py-2 text-xs font-bold text-violet-600 hover:bg-violet-50 flex items-center gap-2 cursor-pointer">
          <ShieldCheck className="w-4 h-4" /> Admin Console
        </button>
      )}
      <button onClick={onLogout} className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer">
        <LogOut className="w-4 h-4" /> Log Out
      </button>
    </div>
  );
}
