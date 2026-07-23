import React, { useState } from 'react';
import { Bell, Plus, MessageSquare, Search } from 'lucide-react';
import { Avatar, Button } from '../atoms';
import { SearchBar } from '../molecules';
import UserMenuDropdown from '../menu/UserMenuDropdown';

export default function HeaderNavbar({
  searchQuery,
  setSearchQuery,
  currentUser,
  onCreatePress,
  onGoToAdmin,
  onLogout,
  onViewProfile,
  onMobileMenuClick,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const emailNickname = currentUser?.email ? currentUser.email.split('@')[0] : '';
  const isNameUUID = /^[0-9a-f]{8}-[0-9a-f]{4}/i.test(currentUser?.name);
  const displayUserName = (isNameUUID && emailNickname)
    ? emailNickname
    : (currentUser?.name || currentUser?.displayName || 'User');
  const userInitial = displayUserName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-3 lg:px-4 h-14 flex items-center justify-between gap-2 lg:gap-4">

      {/* ── Left: Hamburger (mobile only) + Logo ── */}
      <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
        {/* Hamburger: visible on mobile screen only (< lg) */}
        <button
          onClick={onMobileMenuClick}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200 flex-shrink-0"
          title="Menu"
        >
          <span className="text-sm font-black text-gray-700">☰</span>
        </button>

        {/* Logo: "Inspire" on sm+, "In" on mobile */}
        <div className="flex items-center cursor-pointer select-none flex-shrink-0">
          <span className="hidden sm:block text-xl font-black tracking-tight text-[#FF4500]">
            Inspire
          </span>
          <span className="sm:hidden text-xl font-black tracking-tight text-[#FF4500]">
            In
          </span>
        </div>
      </div>

      {/* ── Center: Search Bar (Visible on all screen sizes) ── */}
      <div className="flex-1 max-w-xl mx-auto px-1 sm:px-0">
        <SearchBar
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

          {/* ── Right: Actions ── */}
          <div className="flex items-center gap-1 lg:gap-2 flex-shrink-0">
            {/* AD button: hidden on mobile */}
            <button
              title="Advertise"
              className="hidden md:flex w-8 h-8 rounded-full hover:bg-gray-100 items-center justify-center text-[11px] font-extrabold border border-gray-700 cursor-pointer"
            >
              AD
            </button>

            {/* Chat: hidden on mobile */}
            <button
              title="Chat"
              className="hidden md:flex w-9 h-9 items-center justify-center rounded-full hover:bg-gray-100 text-gray-700 cursor-pointer"
            >
              <MessageSquare className="w-5 h-5" />
            </button>

            {/* Create button */}
            <button
              onClick={onCreatePress}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-full text-xs font-bold hover:bg-gray-50 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden lg:inline">Create</span>
            </button>

            {/* Notifications */}
            <button
              onClick={() => {
                window.history.pushState({ screen: 'Notifications' }, '', '/notifications');
                window.dispatchEvent(new PopStateEvent('popstate', { state: { screen: 'Notifications' } }));
              }}
              title="Notifications"
              className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-700 cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                5
              </span>
            </button>

            {/* Avatar + dropdown */}
            <div className="relative">
              <button onClick={() => setShowMenu(!showMenu)} className="cursor-pointer flex items-center">
                <Avatar src={currentUser?.profileImage} initials={userInitial} isOnline={true} />
              </button>

              {showMenu && (
                <UserMenuDropdown
                  currentUser={currentUser}
                  onGoToAdmin={onGoToAdmin}
                  onLogout={onLogout}
                  onViewProfile={onViewProfile}
                />
              )}
            </div>
          </div>
    </header>
  );
}
