import React, { useState } from 'react';
import {
  User, Sparkles, Trophy, DollarSign, Shield, LogOut, Megaphone, Settings,
  Eye, ToggleLeft, ToggleRight, Sun, Moon, FileText, Shirt
} from 'lucide-react';
import { Avatar } from '../atoms';

export default function UserMenuDropdown({ currentUser, onGoToAdmin, onLogout }) {
  const [modMode, setModMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const userInitial = (currentUser?.name || currentUser?.displayName || 'U').charAt(0).toUpperCase();
  const userName = currentUser?.name || currentUser?.displayName || 'Personal_Ability_537';
  const userHandle = currentUser?.username || userName.toLowerCase().replace(/\s+/g, '_');

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="absolute right-0 top-12 w-64 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 py-2.5 animate-fade-in text-gray-800">
      {/* User Header Profile Link */}
      <div className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100">
        <Avatar initials={userInitial} isOnline={true} size="md" />
        <div className="min-w-0 flex-1">
          <p className="text-xs text-gray-500 font-medium">View Profile</p>
          <p className="text-xs font-black text-gray-900 truncate">u/{userHandle}</p>
        </div>
      </div>

      {/* Menu Actions List */}
      <div className="py-1 max-h-[420px] overflow-y-auto no-scrollbar text-xs font-semibold">
        
        {/* Edit Avatar */}
        <button className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left text-gray-700 cursor-pointer">
          <Shirt className="w-4 h-4 text-gray-400" />
          <span>Edit Avatar</span>
        </button>

        {/* Drafts */}
        <button className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left text-gray-700 cursor-pointer">
          <FileText className="w-4 h-4 text-gray-400" />
          <span>Drafts</span>
        </button>

        {/* Achievements */}
        <button className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors text-left text-gray-700 cursor-pointer">
          <div className="flex items-center gap-3.5">
            <Trophy className="w-4 h-4 text-gray-400" />
            <span>Achievements</span>
          </div>
          <span className="text-[10px] text-gray-400 font-bold bg-gray-100 px-1.5 py-0.5 rounded">11 unlocked</span>
        </button>

        {/* Earn */}
        <button className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors text-left text-gray-700 cursor-pointer border-b border-gray-100 pb-3">
          <div className="flex items-center gap-3.5">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <div className="leading-tight">
              <p>Earn</p>
              <p className="text-[10px] text-gray-400 font-normal">Earn cash on Reddit</p>
            </div>
          </div>
        </button>

        {/* Premium */}
        <button className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left text-gray-700 cursor-pointer pt-3">
          <Shield className="w-4 h-4 text-gray-400" />
          <span>Premium</span>
        </button>

        {/* Mod Mode Toggle */}
        <div className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-colors text-left text-gray-700">
          <div className="flex items-center gap-3.5">
            <Shield className="w-4 h-4 text-gray-400" />
            <span>Mod Mode</span>
          </div>
          <button 
            onClick={() => setModMode(!modMode)} 
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            {modMode ? (
              <ToggleRight className="w-8 h-8 text-orange-500" />
            ) : (
              <ToggleLeft className="w-8 h-8 text-gray-300" />
            )}
          </button>
        </div>

        {/* Display Mode Theme Toggle */}
        <div className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-colors text-left text-gray-700 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-3.5">
            {darkMode ? <Moon className="w-4 h-4 text-gray-400" /> : <Sun className="w-4 h-4 text-gray-400" />}
            <span>Display Mode</span>
          </div>
          <button 
            onClick={toggleTheme} 
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            {darkMode ? (
              <ToggleRight className="w-8 h-8 text-orange-500" />
            ) : (
              <ToggleLeft className="w-8 h-8 text-gray-300" />
            )}
          </button>
        </div>

        {/* Log Out */}
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left text-red-500 cursor-pointer pt-3"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span>Log Out</span>
        </button>

        {/* Advertise on Reddit */}
        <button className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left text-gray-700 cursor-pointer">
          <Megaphone className="w-4 h-4 text-gray-400" />
          <span>Advertise on Reddit</span>
        </button>

        {/* Try Reddit Pro (BETA) */}
        <button className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors text-left text-gray-700 cursor-pointer">
          <div className="flex items-center gap-3.5">
            <Sparkles className="w-4 h-4 text-gray-400" />
            <span>Try Reddit Pro</span>
          </div>
          <span className="text-[9px] text-white font-black bg-orange-500 px-1.5 py-0.5 rounded">BETA</span>
        </button>

        {/* Settings */}
        <button 
          onClick={onGoToAdmin}
          className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left text-gray-700 cursor-pointer border-t border-gray-100 mt-2"
        >
          <Settings className="w-4 h-4 text-gray-400" />
          <span>Settings</span>
        </button>

      </div>
    </div>
  );
}
