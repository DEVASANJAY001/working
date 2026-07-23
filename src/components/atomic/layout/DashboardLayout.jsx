import React, { useState } from 'react';
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
  onViewProfile,
  activeNav,
  setActiveNav,
  recentPostsList,
  rightColumnOverride,
  hideRightSidebar = false,
  children
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-screen w-screen bg-white text-gray-900 font-sans flex flex-col overflow-hidden">
      {/* Top Navbar: fixed size */}
      <HeaderNavbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentUser={currentUser}
        onCreatePress={onCreatePress}
        onGoToAdmin={onGoToAdmin}
        onLogout={onLogout}
        onViewProfile={onViewProfile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Body Grid: locked to viewport height */}
      <div className="flex flex-1 w-full max-w-[1600px] mx-auto overflow-hidden">
        {/* Left Sidebar: collapsible via hamburger */}
        <LeftSidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          isOpen={sidebarOpen}
        />

        {/* Center Feed: independently scrollable */}
        <main className={`flex-1 h-full overflow-y-auto no-scrollbar p-6 min-w-0 ${hideRightSidebar ? 'max-w-[1200px] mx-auto' : 'max-w-3xl mx-auto'}`}>
          {children}
        </main>

        {/* Right Sidebar: independently scrollable */}
        {!hideRightSidebar && (
          rightColumnOverride ? (
            <aside className="w-80 border-l border-gray-100 hidden xl:block h-full overflow-y-auto no-scrollbar flex-shrink-0 pt-4 px-4 pb-4">
              {rightColumnOverride}
            </aside>
          ) : (
            <RightSidebar
              recentPostsList={recentPostsList}
            />
          )
        )}
      </div>
    </div>
  );
}
