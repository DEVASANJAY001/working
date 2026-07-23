import React from 'react';
import { HeaderNavbar, LeftSidebar, RightSidebar } from '../organisms';

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
      {/* Organism: Top Navigation Header */}
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
        {/* Organism: Left Navigation Sidebar */}
        <LeftSidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
        />

        {/* Center Main Slot */}
        <main className="flex-1 p-4 max-w-3xl mx-auto min-w-0">
          {children}
        </main>

        {/* Organism: Right Sidebar */}
        <RightSidebar
          recentPostsList={recentPostsList}
        />
      </div>
    </div>
  );
}
