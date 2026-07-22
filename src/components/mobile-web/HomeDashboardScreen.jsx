import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Home, 
  Compass, 
  Plus, 
  MessageSquare, 
  User, 
  MoreHorizontal, 
  LogOut, 
  MapPin, 
  ChevronDown, 
  TrendingUp, 
  Award, 
  ArrowLeft, 
  Smile, 
  Send,
  X,
  Smartphone,
  Copy,
  Gift,
  MoreVertical,
  Users,
  PlusCircle,
  Code,
  Utensils,
  Leaf,
  Rocket,
  CloudRain,
  Camera,
  Cpu,
  ChevronRight,
  Train,
  Trophy,
  AlertTriangle,
  ShieldAlert,
  Pin,
  Sparkles,
  Flag,
  Megaphone
} from 'lucide-react';
import { adminStore } from '../../services/adminStore';

// Dynamic Time-Based Greeting
const getDynamicGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning ☀️';
  if (hour < 17) return 'Good Afternoon 🌤️';
  return 'Good Evening 🌙';
};

// Mock Data for Stories
const stories = [
  { id: '1', name: 'Your Story', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80', active: false },
  { id: '2', name: 'Nicole', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', active: true },
  { id: '3', name: 'Algar Tech', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', active: true },
  { id: '4', name: 'Green India', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', active: true },
  { id: '5', name: 'Tech World', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80', active: true },
];

// Mock Feed Posts Data
const initialPosts = [
  {
    id: 'post_1',
    authorName: 'British Ecological',
    authorHandle: 'britishecological',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    time: '2h',
    text: 'Introducing our groundbreaking technology for wind turbines, designed to harness the power of nature more efficiently than ever before.',
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&auto=format&fit=crop&q=80',
    likes: 784,
    commentsCount: 14,
    shares: 160,
    awards: 32,
    isLiked: false,
    isFollowing: false,
  },
  {
    id: 'post_2',
    authorName: 'Tech World',
    authorHandle: 'techworldindia',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    time: '3h',
    text: 'BREAKING: New AI model achieves 98% accuracy in solving real-world problems.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    likes: 128,
    commentsCount: 24,
    shares: 89,
    awards: 12,
    isLiked: false,
    isFollowing: true,
  },
  {
    id: 'post_3',
    authorName: 'Nicole Edison',
    authorHandle: 'nicole_edison',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    time: '1h',
    text: 'Just finished an amazing photoshoot for our new eco-friendly product line! 📸🌿',
    images: [
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1472214222555-d404758b1c42?w=300&auto=format&fit=crop&q=80'
    ],
    likes: 64,
    commentsCount: 8,
    shares: 23,
    awards: 4,
    isLiked: false,
    isFollowing: true,
  }
];

const recentCommunities = [
  { id: 'rc1', name: 'Chennai Techies', members: '12.4k', icon: Code, color: 'text-violet-600 bg-violet-50' },
  { id: 'rc2', name: 'Desi Foodies', members: '45.2k', icon: Utensils, color: 'text-red-500 bg-red-50' },
  { id: 'rc3', name: 'Green Earth India', members: '8.1k', icon: Leaf, color: 'text-green-500 bg-green-50' },
  { id: 'rc4', name: 'Startup Founders', members: '19.8k', icon: Rocket, color: 'text-blue-500 bg-blue-50' },
  { id: 'rc5', name: 'Chennai Rains Alert', members: '34.1k', icon: CloudRain, color: 'text-cyan-500 bg-cyan-50' },
];

const joinedCommunities = [
  { id: 'jc1', name: 'Chennai Techies', members: '12.4k', icon: Code, color: 'text-violet-600 bg-violet-50' },
  { id: 'jc2', name: 'Desi Foodies', members: '45.2k', icon: Utensils, color: 'text-red-500 bg-red-50' },
  { id: 'jc3', name: 'TN Photography', members: '15.6k', icon: Camera, color: 'text-amber-500 bg-amber-50' },
  { id: 'jc4', name: 'Crypto & AI South', members: '9.3k', icon: Cpu, color: 'text-purple-500 bg-purple-50' },
];

export default function HomeDashboardScreen({ onLogout, onCreatePress, onGoToAdmin, currentUser }) {
  const [activeTab, setActiveTab] = useState('Home Feed'); 
  const [posts, setPosts] = useState(initialPosts);
  
  // Admin Data State
  const [pinnedAnnouncement, setPinnedAnnouncement] = useState(adminStore.getAnnouncement());
  const [ads, setAds] = useState(adminStore.getAds());
  const [deletedPostIds, setDeletedPostIds] = useState(adminStore.getDeletedPostIds());
  const [activeReportPostId, setActiveReportPostId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    setPinnedAnnouncement(adminStore.getAnnouncement());
    setAds(adminStore.getAds());
    setDeletedPostIds(adminStore.getDeletedPostIds());
  }, []);

  const handleReportPost = (post) => {
    adminStore.reportPost(post.id, post, "Inappropriate content / Spam");
    setToastMsg(`Post reported to Super User Admin for moderation.`);
    setActiveReportPostId(null);
    setTimeout(() => setToastMsg(''), 3500);
  };
  
  // Profile picture image or initial fallback
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80');

  // Navigation & Overlays
  const [selectedPost, setSelectedPost] = useState(null); 
  const [showComments, setShowComments] = useState(false); 
  const [showShare, setShowShare] = useState(false); 
  const [showAwards, setShowAwards] = useState(false); 

  // Three-Dots Drawer & Search Overlays
  const [showThreeDotsDrawer, setShowThreeDotsDrawer] = useState(false);
  const [showSeeAllRecent, setShowSeeAllRecent] = useState(false);
  const [showStartCommunity, setShowStartCommunity] = useState(false);
  const [showSearchWindow, setShowSearchWindow] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Search expansion state
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllCommunities, setShowAllCommunities] = useState(false);
  const [showAllMessages, setShowAllMessages] = useState(false);

  // Form state for new community
  const [communityName, setCommunityName] = useState('');
  const [communityDesc, setCommunityDesc] = useState('');

  // Coins balance and award inputs
  const [coinsBalance, setCoinsBalance] = useState(1250);
  const [selectedAward, setSelectedAward] = useState(null);
  const [awardQuantity, setAwardQuantity] = useState(1);

  // Comments List
  const [commentSort, setCommentSort] = useState('Top');
  const [newCommentText, setNewCommentText] = useState('');
  const [commentsList, setCommentsList] = useState([
    {
      id: 'c1',
      author: 'James Lee',
      handle: 'jameslee',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      time: '2h',
      text: 'This is incredible! The future of clean energy looks promising. ⚡🌱',
      likes: 8,
      isLiked: false,
      replies: [
        {
          id: 'r1',
          author: 'British Ecological',
          handle: 'britishecological',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
          time: '1h',
          text: "Thank you! We're working hard to make it a sustainable future.",
          likes: 5,
          isAuthor: true,
        }
      ]
    },
    {
      id: 'c2',
      author: 'Priya Natarajan',
      handle: 'priyanatarajan',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      time: '1h',
      text: 'Great initiative! When will this be available for public use?',
      likes: 5,
      isLiked: false,
      replies: [
        {
          id: 'r2',
          author: 'British Ecological',
          handle: 'britishecological',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
          time: '45m',
          text: "Soon! We'll share updates here. Stay tuned!",
          likes: 3,
          isAuthor: true,
        }
      ]
    }
  ]);

  const handleToggleLike = (postId) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          isLiked: !p.isLiked,
          likes: p.isLiked ? p.likes - 1 : p.likes + 1
        };
      }
      return p;
    }));
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(prev => ({
        ...prev,
        isLiked: !prev.isLiked,
        likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1
      }));
    }
  };

  const handleToggleFollow = (postId) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, isFollowing: !p.isFollowing };
      }
      return p;
    }));
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(prev => ({ ...prev, isFollowing: !prev.isFollowing }));
    }
  };

  const handleLogoutPress = () => {
    setShowThreeDotsDrawer(false);
    setShowLogoutConfirm(true);
  };

  const confirmLogoutAction = () => {
    setShowLogoutConfirm(false);
    if (onLogout) onLogout();
  };

  const menuItems = [
    { name: 'Home', icon: Home },
    { name: 'Discover', icon: Compass },
    { name: 'Messages', icon: MessageSquare },
    { name: 'Profile', icon: User },
  ];

  return (
    <div className="flex-1 flex flex-col md:flex-row h-screen bg-[#F9FAFB] text-gray-900 animate-fade-in relative overflow-hidden select-none">
      
      {/* 1. Left Sidebar Navigation */}
      <aside className="w-64 border-r border-gray-100 bg-white h-full hidden md:flex flex-col justify-between p-6">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-orange-500 flex items-center justify-center shadow-md">
                <span className="text-white text-xl font-extrabold">I</span>
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-violet-600 to-orange-500 bg-clip-text text-transparent">Inspire</span>
            </div>
            <button onClick={() => setShowThreeDotsDrawer(true)} className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-50 cursor-pointer">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1">
            {onGoToAdmin && (
              <button
                onClick={onGoToAdmin}
                className="w-full flex items-center gap-4 py-3 px-4 rounded-2xl text-xs font-black transition-all cursor-pointer bg-gradient-to-r from-violet-600 via-purple-600 to-orange-500 text-white shadow-lg shadow-violet-500/20 hover:opacity-90 mb-3"
              >
                <ShieldAlert className="w-5 h-5" />
                <span>Super User Console</span>
              </button>
            )}

            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  className={`w-full flex items-center gap-4 py-3 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer text-gray-500 hover:bg-gray-50 hover:text-gray-900`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-2">
            <div onClick={() => setProfileImage(prev => prev ? null : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80')} className="cursor-pointer">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-orange-500 flex items-center justify-center text-white font-bold text-base shadow-sm">
                  D
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate">Devasanjay</p>
              <p className="text-[10px] text-gray-400 truncate">{getDynamicGreeting()}</p>
            </div>
          </div>

          <button 
            onClick={handleLogoutPress}
            className="w-full flex items-center gap-4 py-3 px-4 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header with Image Background (assets/image.png) & Dark Overlay */}
      <header className="flex-shrink-0 pt-8 pb-4 px-5 bg-[#0F172A] border-b border-gray-100 md:hidden relative overflow-hidden rounded-b-3xl shadow-md">
        <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url('/assets/image.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 to-purple-950/80" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div onClick={() => setProfileImage(prev => prev ? null : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80')} className="cursor-pointer">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-orange-500 flex items-center justify-center text-white font-bold text-base shadow-md border-2 border-white">
                  D
                </div>
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-normal shadow-sm">Devasanjay</h3>
              <p className="text-[10px] text-slate-300 font-medium">{getDynamicGreeting()}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button onClick={() => setShowSearchWindow(true)} className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
              <Search className="w-4 h-4 text-white" />
            </button>
            <button onClick={() => setShowThreeDotsDrawer(true)} className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
              <MoreVertical className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Middle Main Feed Column */}
      <main className="flex-1 flex flex-col h-full bg-white md:bg-[#F9FAFB] overflow-hidden">
        
        {/* Animated Segmented Control Tabs */}
        <div className="flex justify-between border-b border-gray-100 bg-white px-6">
          {[
            { id: 'Home Feed', label: 'For You' },
            { id: 'Local Feed', label: 'Local' },
            { id: 'Trending Feed', label: 'Trending' },
            { id: 'Following Feed', label: 'Following' }
          ].map((tab) => {
            const isTabActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)}
                className={`relative py-3.5 text-xs md:text-sm font-bold transition-all focus:outline-none cursor-pointer flex-1 text-center
                  ${isTabActive ? 'text-violet-600' : 'text-gray-400'}`}
              >
                {tab.label}
                {isTabActive && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.75 bg-violet-600 rounded-t-full" />}
              </button>
            );
          })}
        </div>

        {/* Scrollable Feed Contents */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-6 px-4">
          <div className="max-w-xl mx-auto space-y-6">
            
            {/* HOM_001 (Home Feed) view */}
            {activeTab === 'Home Feed' && (
              <div className="space-y-6">
                {/* Redesigned 🔥 Trending Today Section (Horizontal Scroll Carousel) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-gray-900">🔥 Trending Today</span>
                    <span className="text-[11px] text-violet-600 font-bold cursor-pointer hover:opacity-80">See All →</span>
                  </div>

                  <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                    {[
                      { tag: '# Chennai Rains', count: '12.4K Posts', trend: '+22%', icon: CloudRain, color: 'text-cyan-500 bg-cyan-50', barColor: 'bg-cyan-500' },
                      { tag: '# Metro Phase 2', count: '8.7K Posts', trend: '+14%', icon: Train, color: 'text-purple-600 bg-purple-50', barColor: 'bg-purple-600' },
                      { tag: '# AI Jobs', count: '6.8K Posts', trend: '+10%', icon: Cpu, color: 'text-emerald-500 bg-emerald-50', barColor: 'bg-emerald-500' },
                      { tag: '# IPL 2025', count: '5.4K Posts', trend: '+18%', icon: Trophy, color: 'text-amber-500 bg-amber-50', barColor: 'bg-amber-500' }
                    ].map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div key={idx} className="w-44 flex-shrink-0 bg-white border border-gray-100 rounded-2xl p-3.5 shadow-sm space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${item.color}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md">▲ {item.trend}</span>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-800 truncate">{item.tag}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{item.count}</p>
                          </div>
                          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full ${item.barColor} rounded-full`} style={{ width: `${60 + idx * 10}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-gray-900">Categories</span>
                    <span className="text-[11px] text-violet-600 font-bold cursor-pointer">View All →</span>
                  </div>
                  <div className="flex justify-between">
                    {[
                      { label: 'Issues', color: 'bg-red-50 text-red-500' },
                      { label: 'Talks', color: 'bg-yellow-50 text-yellow-500' },
                      { label: 'News', color: 'bg-blue-50 text-blue-500' },
                      { label: 'Polls', color: 'bg-green-50 text-green-500' },
                      { label: 'Events', color: 'bg-purple-50 text-purple-500' }
                    ].map((cat, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1 cursor-pointer">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${cat.color}`}>
                          {cat.label[0]}
                        </div>
                        <span className="text-[10px] text-gray-500 font-medium">{cat.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── PINNED SUPER USER ANNOUNCEMENT ── */}
                {pinnedAnnouncement && (
                  <div className="border-2 border-violet-500/80 rounded-3xl p-5 bg-gradient-to-br from-violet-900/10 via-purple-500/5 to-white shadow-md relative overflow-hidden space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-gradient-to-r from-violet-600 to-orange-500 text-white font-black text-[11px] rounded-full flex items-center gap-1.5 shadow-sm">
                          <Pin className="w-3.5 h-3.5" /> Pinned by Super User
                        </span>
                        <span className="text-xs font-bold text-gray-900">{pinnedAnnouncement.authorName}</span>
                      </div>
                      <span className="text-[10px] font-black text-violet-600 uppercase tracking-widest bg-violet-100 px-2 py-0.5 rounded-md">
                        Official Announcement
                      </span>
                    </div>

                    <h3 className="text-base font-black text-gray-900">{pinnedAnnouncement.title}</h3>
                    <p className="text-xs text-gray-700 leading-relaxed font-medium">{pinnedAnnouncement.text}</p>

                    {pinnedAnnouncement.image && (
                      <div className="w-full h-56 rounded-2xl overflow-hidden shadow-sm">
                        <img src={pinnedAnnouncement.image} alt="Announcement" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                )}

                {/* Stories */}
                <div className="bg-white border border-gray-100 rounded-2xl py-4 shadow-sm">
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

                {/* ── LIVE ADVERTISEMENT BANNER ── */}
                {ads && ads.filter(a => a.active).length > 0 && (
                  <div className="border border-emerald-300 rounded-3xl p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-white shadow-sm flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider rounded-md">
                        Sponsored
                      </span>
                      <h4 className="text-xs font-bold text-gray-900">{ads.find(a => a.active).title}</h4>
                      <p className="text-[10px] text-gray-500">{ads.find(a => a.active).sponsor}</p>
                    </div>
                    {ads.find(a => a.active).image && (
                      <img src={ads.find(a => a.active).image} alt="Ad" className="w-16 h-16 object-cover rounded-xl shrink-0 border border-emerald-200" />
                    )}
                  </div>
                )}

                {/* Infinite Feed Posts (Filtered for deleted posts) */}
                {posts.filter(p => !deletedPostIds.includes(p.id)).map(post => renderPostCard(post))}
              </div>
            )}

            {/* HOM_002 (Local Feed) view */}
            {activeTab === 'Local Feed' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 px-1">
                  <MapPin className="w-4 h-4 text-violet-600" />
                  <span className="text-xs font-bold text-gray-800">Chennai, Tamil Nadu</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500 cursor-pointer" />
                </div>

                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-violet-600 to-pink-500 p-5 text-white flex justify-between items-center">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold">Live Updates from your city</h4>
                    <p className="text-[11px] text-violet-100">Stay informed about what's happening</p>
                    <button className="bg-white text-violet-600 font-bold text-[10px] px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity cursor-pointer">
                      View Live
                    </button>
                  </div>
                  <img src="https://images.unsplash.com/photo-1596422846543-75c6fc18a523?w=200&auto=format&fit=crop&q=80" alt="Live city" className="w-20 h-20 object-cover rounded-xl" />
                </div>

                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-gray-900">What's happening near you</span>
                  <span className="text-[11px] text-violet-600 font-bold cursor-pointer">See All →</span>
                </div>

                {[
                  { id: 'loc_1', title: 'Road work on Anna Salai', desc: 'Road renovation work is in progress. Plan your travel accordingly.', time: '2h ago', likes: 123, comments: 32, tag: 'Traffic', color: 'text-amber-500 bg-amber-50' },
                  { id: 'loc_2', title: 'Water Supply Update', desc: 'Water supply will be affected in Adyar, Besant Nagar area.', time: '3h ago', likes: 87, comments: 0, tag: 'Utility', color: 'text-blue-500 bg-blue-50' },
                  { id: 'loc_3', title: 'Garbage Collection Drive', desc: 'Special drive starting this Sunday in Ward 112.', time: '4h ago', likes: 64, comments: 15, tag: 'Cleanliness', color: 'text-green-500 bg-green-50' }
                ].map((item) => (
                  <div key={item.id} className="border border-gray-150 rounded-2xl p-4 bg-white shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${item.color}`}>{item.tag}</span>
                      <span className="text-[10px] text-gray-400">{item.time}</span>
                    </div>
                    <h4 className="text-xs font-bold text-gray-900">{item.title}</h4>
                    <p className="text-[11px] text-gray-500 leading-normal">{item.desc}</p>
                    <div className="flex gap-4 pt-2 border-t border-gray-50 text-gray-400">
                      <button className="flex items-center gap-1 hover:text-red-500 transition-colors"><Heart className="w-3.5 h-3.5" /> <span className="text-[10px] font-bold">{item.likes}</span></button>
                      <button className="flex items-center gap-1 hover:text-violet-600 transition-colors"><MessageCircle className="w-3.5 h-3.5" /> <span className="text-[10px] font-bold">{item.comments}</span></button>
                      <button className="ml-auto hover:text-violet-600"><Share2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* HOM_003 (Trending Feed) view */}
            {activeTab === 'Trending Feed' && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-gray-900">🔥 Trending Topics</span>
                    <span className="text-[11px] text-violet-600 font-bold cursor-pointer">See All →</span>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {[
                      { rank: '01', tag: '# Chennai Rains', count: '12.5K posts', trend: '+ 22%' },
                      { rank: '02', tag: '# AI Jobs', count: '8.1K posts', trend: '+ 18%' },
                      { rank: '03', tag: '# Metro Phase 2', count: '6.7K posts', trend: '+ 16%' },
                      { rank: '04', tag: '# TN Budget 2025', count: '5.3K posts', trend: '+ 12%' },
                      { rank: '05', tag: '# IPL 2025', count: '4.0K posts', trend: '+ 10%' }
                    ].map((item) => (
                      <div key={item.rank} className="flex items-center py-3">
                        <span className="text-sm font-extrabold text-violet-600 w-8">{item.rank}</span>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-gray-800">{item.tag}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{item.count}</p>
                        </div>
                        <div className="flex items-center gap-1 text-green-500 font-bold text-xs">
                          <span>{item.trend}</span>
                          <TrendingUp className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-gray-900">Trending Post</span>
                </div>
                {posts.filter(p => p.id === 'post_2').map(post => renderPostCard(post))}
              </div>
            )}

            {/* HOM_004 (Following Feed) view */}
            {activeTab === 'Following Feed' && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-100 rounded-2xl py-4 shadow-sm">
                  <div className="flex gap-4 px-5 overflow-x-auto no-scrollbar">
                    {stories.slice(1).map((story) => (
                      <div key={story.id} className="flex flex-col items-center flex-shrink-0 w-16 cursor-pointer">
                        <div className="w-14 h-14 rounded-full border-2 border-gray-100 p-0.5 overflow-hidden">
                          <img src={story.image} alt={story.name} className="w-full h-full object-cover rounded-full" />
                        </div>
                        <span className="text-[10px] text-gray-500 mt-2 truncate w-full text-center">{story.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {posts.filter(p => p.id === 'post_3').map(post => renderPostCard(post))}
              </div>
            )}

          </div>
        </div>
      </main>

      {/* THREE-DOTS NAVIGATION DRAWER OVERLAY (SLIDES UP FROM BOTTOM WITH DARK FADE BACKGROUND) */}
      {showThreeDotsDrawer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center transition-opacity duration-300 animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-t-3xl flex flex-col p-6 shadow-2xl space-y-6 max-h-[85vh] transition-transform duration-300 border-b-0">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Menu Navigation</h3>
              <button onClick={() => setShowThreeDotsDrawer(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-1 no-scrollbar">
              {/* Core links */}
              <div className="space-y-2">
                <button onClick={() => { setShowThreeDotsDrawer(false); alert("Navigating to Discovery"); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-xs font-bold text-gray-700 cursor-pointer">
                  <Compass className="w-4.5 h-4.5 text-violet-600" />
                  <span>Discover Communities</span>
                </button>
                <button onClick={() => { setShowThreeDotsDrawer(false); setShowStartCommunity(true); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-violet-50 text-xs font-bold text-violet-600 cursor-pointer">
                  <PlusCircle className="w-4.5 h-4.5" />
                  <span>Start a Community</span>
                </button>
              </div>

              {/* Recently Visited */}
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Recently Visited</span>
                  <button onClick={() => setShowSeeAllRecent(true)} className="text-[11px] font-bold text-violet-600 cursor-pointer">See All →</button>
                </div>
                {recentCommunities.slice(0, 3).map(comm => {
                  const Icon = comm.icon;
                  return (
                    <div key={comm.id} onClick={() => { setShowThreeDotsDrawer(false); alert(`Opening ${comm.name}`); }} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${comm.color}`}>
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <p className="text-xs font-bold text-gray-800 truncate">{comm.name}</p>
                        <p className="text-[10px] text-gray-400">{comm.members} members</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Your Communities */}
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Your Communities</span>
                {joinedCommunities.map(comm => {
                  const Icon = comm.icon;
                  return (
                    <div key={comm.id} onClick={() => { setShowThreeDotsDrawer(false); alert(`Opening ${comm.name}`); }} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${comm.color}`}>
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <p className="text-xs font-bold text-gray-800 truncate">{comm.name}</p>
                        <p className="text-[10px] text-gray-400">{comm.members} members</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Logout fixed at bottom */}
            <button onClick={handleLogoutPress} className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-500 rounded-xl font-bold text-xs hover:bg-red-100 transition-colors cursor-pointer">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-center space-y-4 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
              <LogOut className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Are you sure you want to logout?</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">You will need to sign in again to access your communities and feeds.</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs hover:bg-gray-200 cursor-pointer">
                Cancel
              </button>
              <button onClick={confirmLogoutAction} className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl text-xs hover:bg-red-600 cursor-pointer shadow-md">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEE ALL RECENT COMMUNITIES MODAL */}
      {showSeeAllRecent && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Recently Visited Communities</h3>
              <button onClick={() => setShowSeeAllRecent(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="max-h-80 overflow-y-auto space-y-2 no-scrollbar">
              {recentCommunities.map(comm => {
                const Icon = comm.icon;
                return (
                  <div key={comm.id} onClick={() => { setShowSeeAllRecent(false); setShowThreeDotsDrawer(false); alert(`Opening ${comm.name}`); }} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 cursor-pointer border border-gray-50">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${comm.color}`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <p className="text-xs font-bold text-gray-800 truncate">{comm.name}</p>
                      <p className="text-[10px] text-gray-400">{comm.members} members</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* START A COMMUNITY MODAL */}
      {showStartCommunity && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-gray-900 text-center">Start a Community</h3>
            <input 
              type="text" 
              placeholder="Community Name" 
              value={communityName} 
              onChange={e => setCommunityName(e.target.value)} 
              className="w-full py-2.5 px-3 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-violet-500" 
            />
            <textarea 
              placeholder="Description (Optional)" 
              value={communityDesc} 
              onChange={e => setCommunityDesc(e.target.value)} 
              className="w-full min-h-[80px] py-2.5 px-3 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" 
            />
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowStartCommunity(false)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200">Cancel</button>
              <button 
                onClick={() => {
                  if (!communityName.trim()) return alert("Please enter community name.");
                  alert(`Community "${communityName}" created!`);
                  setCommunityName('');
                  setCommunityDesc('');
                  setShowStartCommunity(false);
                }} 
                className="px-5 py-2 bg-violet-600 text-white rounded-xl text-xs font-bold hover:opacity-90"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UNIFIED SPOTLIGHT SINGLE-PAGE SEARCH WINDOW OVERLAY */}
      {showSearchWindow && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 max-w-2xl mx-auto w-full gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-violet-600 absolute left-3.5 top-3" />
              <input
                type="text"
                autoFocus
                placeholder="Search communities, topics, or messages..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-10 pr-8 border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white text-xs font-medium"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button onClick={() => setShowSearchWindow(false)} className="text-xs font-bold text-violet-600 hover:opacity-80">Close</button>
          </div>

          {/* Unified Single-Page Search List */}
          <div className="flex-1 overflow-y-auto p-6 max-w-2xl mx-auto w-full space-y-6">
            
            {/* Top Section: Communities */}
            {(() => {
              const matchedCommunities = [...recentCommunities, ...joinedCommunities].filter((comm, index, self) => 
                index === self.findIndex((t) => t.id === comm.id) &&
                comm.name.toLowerCase().includes(searchQuery.toLowerCase())
              );
              const visibleCommunities = showAllCommunities ? matchedCommunities : matchedCommunities.slice(0, 3);

              return (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Communities ({matchedCommunities.length})</span>
                    {matchedCommunities.length > 3 && !showAllCommunities && (
                      <button onClick={() => setShowAllCommunities(true)} className="text-[11px] font-bold text-violet-600 cursor-pointer hover:opacity-80">
                        See More →
                      </button>
                    )}
                  </div>

                  {visibleCommunities.length > 0 ? (
                    visibleCommunities.map(comm => {
                      const Icon = comm.icon;
                      return (
                        <div key={comm.id} onClick={() => { setShowSearchWindow(false); alert(`Opening ${comm.name}`); }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer border border-gray-100">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${comm.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1 text-left">
                            <p className="text-xs font-bold text-gray-800 truncate">{comm.name}</p>
                            <p className="text-[10px] text-gray-400">{comm.members} members</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-gray-400 italic text-left">No matching communities found.</p>
                  )}
                </div>
              );
            })()}

            <div className="border-t border-gray-100 my-2" />

            {/* Bottom Section: Posts & Messages */}
            {(() => {
              const matchedPosts = posts.filter(p => p.text.toLowerCase().includes(searchQuery.toLowerCase()));
              const visiblePosts = showAllMessages ? matchedPosts : matchedPosts.slice(0, 3);

              return (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Posts & Messages ({matchedPosts.length})</span>
                    {matchedPosts.length > 3 && !showAllMessages && (
                      <button onClick={() => setShowAllMessages(true)} className="text-[11px] font-bold text-violet-600 cursor-pointer hover:opacity-80">
                        See More →
                      </button>
                    )}
                  </div>

                  {visiblePosts.length > 0 ? (
                    visiblePosts.map(post => (
                      <div key={post.id} onClick={() => { setShowSearchWindow(false); setSelectedPost(post); }} className="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white transition-colors cursor-pointer space-y-2 text-left">
                        <div className="flex items-center gap-2">
                          <img src={post.authorAvatar} alt="Avatar" className="w-5 h-5 rounded-full object-cover" />
                          <span className="text-xs font-bold text-gray-800">{post.authorName}</span>
                          <span className="text-[10px] text-gray-400">• {post.time}</span>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">{post.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 italic text-left">No matching posts found.</p>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION OVERLAY */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-2 border border-gray-700 animate-fade-in">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>{toastMsg}</span>
        </div>
      )}

    </div>
  );

  // Helper renderer for website post card
  function renderPostCard(post) {
    return (
      <div key={post.id} className="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={post.authorAvatar} 
              alt="Author" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h4 className="text-sm font-bold text-gray-900">{post.authorName}</h4>
              <p className="text-[11px] text-gray-400">@{post.authorHandle} • {post.time}</p>
            </div>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setActiveReportPostId(activeReportPostId === post.id ? null : post.id)} 
              className="text-gray-400 hover:text-gray-600 cursor-pointer p-1.5 rounded-lg hover:bg-gray-50"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {activeReportPostId === post.id && (
              <div className="absolute right-0 top-8 w-44 bg-white border border-gray-200 rounded-2xl shadow-xl z-30 p-1 space-y-1 animate-fade-in">
                <button
                  onClick={() => handleReportPost(post)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                >
                  <Flag className="w-4 h-4" /> Report Post
                </button>
              </div>
            )}
          </div>
        </div>

        <div onClick={() => setSelectedPost(post)} className="cursor-pointer">
          <p className="text-sm text-gray-700 leading-relaxed my-3">{post.text}</p>
        </div>

        {post.image && (
          <div onClick={() => setSelectedPost(post)} className="w-full h-64 rounded-xl overflow-hidden mb-4 cursor-pointer">
            <img 
              src={post.image} 
              alt="Post media" 
              className="w-full h-full object-cover hover:scale-101 transition-transform duration-300" 
            />
          </div>
        )}

        {post.images && (
          <div onClick={() => setSelectedPost(post)} className="grid grid-cols-3 gap-2 mb-4 cursor-pointer">
            {post.images.map((img, idx) => (
              <img key={idx} src={img} alt="Grid media" className="w-full h-24 object-cover rounded-lg" />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-gray-400 pt-3 border-t border-gray-50">
          <div className="flex gap-5">
            <button onClick={() => handleToggleLike(post.id)} className="flex items-center gap-1.5 hover:text-red-500 transition-colors cursor-pointer">
              <Heart className={`w-4.5 h-4.5 ${post.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              <span className={`text-[11px] font-bold ${post.isLiked ? 'text-red-500' : ''}`}>{post.likes}</span>
            </button>

            <button onClick={() => { setSelectedPost(post); setShowComments(true); }} className="flex items-center gap-1.5 hover:text-violet-600 transition-colors cursor-pointer">
              <MessageCircle className="w-4.5 h-4.5" />
              <span className="text-[11px] font-bold">{post.commentsCount}</span>
            </button>

            <button onClick={() => { setSelectedPost(post); setShowShare(true); }} className="flex items-center gap-1.5 hover:text-violet-600 transition-colors cursor-pointer">
              <Share2 className="w-4.5 h-4.5" />
              <span className="text-[11px] font-bold">{post.shares}</span>
            </button>

            <button onClick={() => { setSelectedPost(post); setShowAwards(true); }} className="flex items-center gap-1.5 hover:text-violet-600 transition-colors cursor-pointer">
              <Gift className="w-4.5 h-4.5" />
              <span className="text-[11px] font-bold">{post.awards}</span>
            </button>
          </div>

          <button className="hover:text-violet-600 transition-colors cursor-pointer">
            <Bookmark className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    );
  }
}
