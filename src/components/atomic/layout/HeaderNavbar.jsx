import React, { useState } from 'react';
import { Bell, Plus, MessageSquare } from 'lucide-react';
import { Avatar, Button } from '../atoms';
import { SearchBar } from '../molecules';
import UserMenuDropdown from '../menu/UserMenuDropdown';

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

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-xl mx-auto relative">
        <SearchBar
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Right: Header Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button title="Advertise" className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-[11px] font-extrabold border border-gray-700 cursor-pointer">
          AD
        </button>

        <button title="Chat" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-700 cursor-pointer">
          <MessageSquare className="w-5 h-5" />
        </button>

        <Button variant="outline" size="sm" onClick={onCreatePress}>
          <Plus className="w-4 h-4" />
          Create
        </Button>

        <button title="Notifications" className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-700 cursor-pointer">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
            5
          </span>
        </button>

        {/* User Profile Avatar */}
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="cursor-pointer">
            <Avatar initials={userInitial} isOnline={true} />
          </button>

          {showMenu && (
            <UserMenuDropdown
              currentUser={currentUser}
              onGoToAdmin={onGoToAdmin}
              onLogout={onLogout}
            />
          )}
        </div>
      </div>
    </header>
  );
}
