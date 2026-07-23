import React, { useState } from 'react';
import {
  Search, Bell, Plus, MessageSquare, LogOut, ShieldCheck, Sparkles
} from 'lucide-react';

export default function HeaderNavbar({
  searchQuery,
  setSearchQuery,
  currentUser,
  onCreatePress,
  onGoToAdmin,
  onLogout
}) {
  const [showMenu, setShowMenu] = useState(false);
  const userInitial = (currentUser?.name || currentUser?.displayName || 'U').charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 h-14 flex items-center justify-between gap-4">
      {/* Left: Brand Name "Inspire" & Drawer Toggle */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200">
          <span className="text-sm font-black text-gray-700">☰</span>
        </button>

        <div className="flex items-center gap-1.5 cursor-pointer select-none">
          <span className="text-xl font-black tracking-tight text-[#FF4500]">
            Inspire
          </span>
        </div>
      </div>

      {/* Center: Search Bar with "✦ Ask" button */}
      <div className="flex-1 max-w-xl mx-auto relative">
        <div className="w-full h-10 border border-orange-300 hover:border-orange-500 focus-within:border-orange-500 rounded-full bg-white flex items-center px-3 gap-2 transition-all shadow-2xs">
          <div className="w-6 h-6 rounded-full bg-[#FF4500] text-white flex items-center justify-center text-[10px] font-bold">
            r/
          </div>
          <input
            type="text"
            placeholder="Find anything"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400 font-normal"
          />
          <button className="border border-orange-300 hover:bg-orange-50 text-orange-600 font-extrabold text-xs px-3.5 py-1 rounded-full flex items-center gap-1 cursor-pointer transition-all flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
            Ask
          </button>
        </div>
      </div>

      {/* Right: Header Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button title="Advertise" className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-[11px] font-extrabold border border-gray-700 cursor-pointer">
          AD
        </button>

        <button title="Chat" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-700 cursor-pointer">
          <MessageSquare className="w-5 h-5" />
        </button>

        <button
          onClick={onCreatePress}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 hover:bg-gray-100 font-bold text-xs text-gray-800 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create
        </button>

        <button title="Notifications" className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-700 cursor-pointer">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
            5
          </span>
        </button>

        {/* User Profile Avatar with Online Badge */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-9 h-9 rounded-full bg-emerald-500 text-white font-extrabold text-sm flex items-center justify-center shadow-xs cursor-pointer relative"
          >
            {userInitial}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-11 w-56 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 py-2 animate-fade-in">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-xs font-bold text-gray-900">{currentUser?.name || 'User'}</p>
                <p className="text-[10px] text-gray-400">u/{currentUser?.username || 'user'}</p>
              </div>
              {currentUser?.isAdmin && (
                <button onClick={onGoToAdmin} className="w-full text-left px-4 py-2 text-xs font-bold text-violet-600 hover:bg-violet-50 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Admin Console
                </button>
              )}
              <button onClick={onLogout} className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
