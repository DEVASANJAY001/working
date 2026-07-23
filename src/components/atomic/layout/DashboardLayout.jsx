import React, { useState } from 'react';
import ReactDOM from 'react-dom';
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
  // Desktop: sidebar expand/collapse
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Mobile: overlay drawer
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const mobileDrawer = mobileDrawerOpen ? ReactDOM.createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[300] bg-black/40"
        onClick={() => setMobileDrawerOpen(false)}
      />
      {/* Slide-in drawer */}
      <div className="fixed top-0 left-0 h-full z-[301] animate-slide-right bg-white shadow-2xl">
        <LeftSidebar
          activeNav={activeNav}
          setActiveNav={(nav) => { setActiveNav(nav); setMobileDrawerOpen(false); }}
          isOpen={true}
          isMobileDrawer={true}
        />
      </div>
    </>,
    document.body
  ) : null;

  return (
    <div className="h-screen w-screen bg-white text-gray-900 font-sans flex flex-col overflow-hidden">
      {/* Mobile overlay drawer via portal */}
      {mobileDrawer}

      {/* Top Navbar */}
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
        onMobileMenuClick={() => setMobileDrawerOpen(true)}
      />

      {/* Main Body Grid */}
      <div className="flex flex-1 w-full max-w-[1600px] mx-auto overflow-hidden">
        {/* Desktop Left Sidebar */}
        <LeftSidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          isOpen={sidebarOpen}
        />

        {/* Center Feed */}
        <main className={`flex-1 h-full overflow-y-auto no-scrollbar p-4 lg:p-6 min-w-0 ${hideRightSidebar ? 'max-w-[1200px] mx-auto' : 'max-w-3xl mx-auto'}`}>
          {children}
        </main>

        {/* Right Sidebar */}
        {!hideRightSidebar && (
          rightColumnOverride ? (
            <aside className="w-80 border-l border-gray-100 hidden xl:block h-full overflow-y-auto no-scrollbar flex-shrink-0 pt-4 px-4 pb-4">
              {rightColumnOverride}
            </aside>
          ) : (
            <RightSidebar recentPostsList={recentPostsList} />
          )
        )}
      </div>
    </div>
  );
}
