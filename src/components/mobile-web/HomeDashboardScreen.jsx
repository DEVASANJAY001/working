import React, { useState } from 'react';
import { Search, Bell, Heart, MessageCircle, Share2, Bookmark, Home, Compass, Plus, MessageSquare, User, MoreHorizontal, LogOut, Settings } from 'lucide-react';

const stories = [
  { id: '1', name: 'Your Story', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', active: false },
  { id: '2', name: 'Nicole', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', active: true },
  { id: '3', name: 'Green Africa', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', active: true },
  { id: '4', name: 'Algae Tech', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', active: true },
  { id: '5', name: 'British Ecological', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80', active: true },
];

export default function HomeDashboardScreen({ onLogout }) {
  const [activeTab, setActiveTab] = useState('For you');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(784);
  const [activeNav, setActiveNav] = useState('Home');

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount(prev => prev - 1);
    } else {
      setLiked(true);
      setLikeCount(prev => prev + 1);
    }
  };

  const menuItems = [
    { name: 'Home', icon: Home },
    { name: 'Discover', icon: Compass },
    { name: 'Messages', icon: MessageSquare },
    { name: 'Profile', icon: User },
  ];

  return (
    <div className="flex-1 flex flex-col md:flex-row h-screen bg-[#F9FAFB] text-gray-900 animate-fade-in relative overflow-hidden select-none">
      
      {/* 1. Left Sidebar Navigation (Visible on Desktop/Tablet) */}
      <aside className="w-64 border-r border-gray-150 bg-white h-full hidden md:flex flex-col justify-between p-6">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-orange-500 flex items-center justify-center shadow-md">
              <span className="text-white text-xl font-extrabold">I</span>
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-violet-600 to-orange-500 bg-clip-text text-transparent">Inspire</span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveNav(item.name)}
                  className={`w-full flex items-center gap-4 py-3 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer
                    ${isActive ? 'bg-violet-50 text-violet-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions / Profile */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-2">
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80" 
              alt="Profile" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate">Devasanjay</p>
              <p className="text-[10px] text-gray-400 truncate">Good morning</p>
            </div>
          </div>

          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 py-3 px-4 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header (Visible on Mobile Only) */}
      <header className="flex-shrink-0 pt-8 pb-4 px-5 bg-gradient-to-r from-violet-600 to-orange-500 text-white rounded-b-2xl shadow-md md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div onClick={onLogout} className="w-9 h-9 rounded-full border border-white overflow-hidden cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-sm font-bold leading-normal">Hello, Devasanjay 👋</h3>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
              <Search className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Middle Main Feed Column */}
      <main className="flex-1 flex flex-col h-full bg-white md:bg-[#F9FAFB] overflow-hidden">
        {/* Scrollable Feed Contents */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-6">
          <div className="max-w-xl mx-auto space-y-6">
            
            {/* Stories Horizontal List */}
            <div className="bg-white md:border md:border-gray-150 md:rounded-2xl py-4 shadow-sm">
              <div className="flex gap-4 px-5 overflow-x-auto no-scrollbar">
                {stories.map((story) => (
                  <div key={story.id} className="flex flex-col items-center flex-shrink-0 w-16 cursor-pointer">
                    {story.active ? (
                      <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-br from-violet-600 to-orange-500 flex items-center justify-center">
                        <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
                          <img src={story.image} alt={story.name} className="w-full h-full object-cover" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-full border-2 border-gray-100 p-0.5 overflow-hidden">
                        <img src={story.image} alt={story.name} className="w-full h-full object-cover rounded-full" />
                      </div>
                    )}
                    <span className="text-[10px] text-gray-500 mt-2 truncate w-full text-center">{story.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tab Selection */}
            <div className="flex gap-6 px-5 border-b border-gray-150 bg-white md:border md:rounded-2xl md:shadow-sm">
              {['For you', 'Following', 'Trending'].map((tab) => {
                const isTabActive = activeTab === tab;
                return (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)}
                    className={`relative py-3.5 text-sm font-bold transition-all focus:outline-none cursor-pointer
                      ${isTabActive ? 'text-violet-600' : 'text-gray-400'}`}
                  >
                    {tab}
                    {isTabActive && <div className="absolute bottom-0 left-0 right-0 h-0.75 bg-violet-600 rounded-t-full" />}
                  </button>
                );
              })}
            </div>

            {/* Feed Card */}
            <div className="border border-gray-150 rounded-2xl p-5 bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80" 
                    alt="Author" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">British Ecological</h4>
                    <p className="text-[11px] text-gray-400">@britishecological • 2h</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed my-3">
                Introducing our groundbreaking technology for wind turbines, designed to harness the power of nature more efficiently than ever before.
              </p>

              <div className="w-full h-64 rounded-xl overflow-hidden mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&auto=format&fit=crop&q=80" 
                  alt="Wind turbines" 
                  className="w-full h-full object-cover hover:scale-102 transition-transform duration-500" 
                />
              </div>

              <div className="flex items-center justify-between text-gray-500 pt-1">
                <div className="flex gap-5">
                  <button onClick={handleLike} className="flex items-center gap-1.5 hover:text-red-500 transition-colors cursor-pointer">
                    <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
                    <span className={`text-xs font-bold ${liked ? 'text-red-500' : ''}`}>{likeCount}</span>
                  </button>

                  <button className="flex items-center gap-1.5 hover:text-violet-600 transition-colors cursor-pointer">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-xs font-bold">14</span>
                  </button>

                  <button className="flex items-center gap-1.5 hover:text-violet-600 transition-colors cursor-pointer">
                    <Share2 className="w-5 h-5" />
                    <span className="text-xs font-bold">160</span>
                  </button>
                </div>

                <button className="hover:text-violet-600 transition-colors cursor-pointer">
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="h-14 md:h-6" />
          </div>
        </div>
      </main>

      {/* 3. Right Sidebar Widgets (Visible on Desktop screens > 1024px) */}
      <aside className="w-80 border-l border-gray-150 bg-white h-full hidden lg:flex flex-col p-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="w-4.5 h-4.5 text-gray-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search Inspire..."
            className="w-full py-2.5 pl-10 pr-4 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all text-xs font-medium"
          />
        </div>

        {/* Notifications Widget */}
        <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-900">Notifications</span>
            <Bell className="w-4.5 h-4.5 text-violet-600" />
          </div>
          <div className="space-y-3">
            <div className="p-2.5 bg-white border border-gray-100 rounded-xl flex items-center gap-3">
              <div className="w-2 h-2 bg-violet-600 rounded-full flex-shrink-0" />
              <p className="text-[11px] text-gray-500 leading-normal">Nicole liked your comment on <span className="font-semibold text-gray-700">Green Africa</span></p>
            </div>
            <div className="p-2.5 bg-white border border-gray-100 rounded-xl flex items-center gap-3">
              <div className="w-2 h-2 bg-violet-600 rounded-full flex-shrink-0" />
              <p className="text-[11px] text-gray-500 leading-normal">Welcome to Inspire! Complete your profile setup.</p>
            </div>
          </div>
        </div>

        {/* Brand/Powered widgets */}
        <div className="flex-1 flex flex-col justify-end text-[10px] text-gray-400 px-2 leading-relaxed">
          <p>© 2026 Inspire Portal Inc.</p>
          <p>Powered by DAWNS Security Suite.</p>
        </div>
      </aside>

      {/* Mobile Bottom Navigation (Visible on Mobile Only) */}
      <div className="flex-shrink-0 flex items-center justify-around h-16 border-t border-gray-150 bg-white pb-2 relative md:hidden">
        <button onClick={() => setActiveNav('Home')} className="p-2">
          <Home className={`w-5.5 h-5.5 ${activeNav === 'Home' ? 'text-violet-600' : 'text-gray-300'}`} />
        </button>

        <button onClick={() => setActiveNav('Discover')} className="p-2">
          <Compass className={`w-5.5 h-5.5 ${activeNav === 'Discover' ? 'text-violet-600' : 'text-gray-300'}`} />
        </button>

        {/* Center logout/action */}
        <div onClick={onLogout} className="w-12 h-12 rounded-full -mt-6 flex items-center justify-center text-white bg-gradient-to-r from-violet-600 to-orange-500 shadow-md shadow-violet-500/30 cursor-pointer">
          <Plus className="w-6 h-6" />
        </div>

        <button onClick={() => setActiveNav('Messages')} className="p-2">
          <MessageSquare className={`w-5.5 h-5.5 ${activeNav === 'Messages' ? 'text-violet-600' : 'text-gray-300'}`} />
        </button>

        <button onClick={() => setActiveNav('Profile')} className="p-2">
          <User className={`w-5.5 h-5.5 ${activeNav === 'Profile' ? 'text-violet-600' : 'text-gray-300'}`} />
        </button>
      </div>
    </div>
  );
}
