import React from 'react';
import HeaderNavbar from './HeaderNavbar';
import LeftSidebar from '../menu/LeftSidebar';
import RightSidebar from '../recent/RightSidebar';

export default function DashboardLayout({
  searchQuery,
  setSearchQuery,
  currentUser,
  onCreatePress,
  onGoToAdmin,
  onLogout,
  activeNav,
  setActiveNav,
  recentPostsList,
  children
}) {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col">
      {/* Top Navigation Header */}
      <HeaderNavbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentUser={currentUser}
        onCreatePress={onCreatePress}
        onGoToAdmin={onGoToAdmin}
        onLogout={onLogout}
      />

      {/* Main Body Grid Layout */}
      <div className="flex flex-1 w-full max-w-[1600px] mx-auto">
        {/* Left Navigation Sidebar */}
        <LeftSidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
        />

        {/* Center Main Slot */}
        <main className="flex-1 p-4 max-w-3xl mx-auto min-w-0">
          {children}
        </main>

        {/* Right Sidebar */}
        <RightSidebar
          recentPostsList={recentPostsList}
        />
      </div>
    </div>
  );
}
