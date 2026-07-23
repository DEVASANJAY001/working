import React, { useState, useEffect } from 'react';
import {
  Search, Bell, Home, Compass, Plus, MessageSquare, User, MoreHorizontal,
  LogOut, MapPin, ChevronDown, TrendingUp, Award, ArrowUp, ArrowDown,
  X, MoreVertical, Users, PlusCircle, Code, Utensils, Leaf, Rocket,
  CloudRain, Camera, Cpu, ChevronRight, Train, Trophy, AlertTriangle,
  Share2, Bookmark, MessageCircle, Gift, Send, Smile, Copy, Smartphone,
  Flame, Clock, Flag, Pin
} from 'lucide-react';
import { adminStore } from '../../services/adminStore';

// ── Dynamic greeting ──────────────────────────────────────
const getDynamicGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning ☀️';
  if (h < 17) return 'Good Afternoon 🌤️';
  return 'Good Evening 🌙';
};

// ── Mock data ─────────────────────────────────────────────
const stories = [
  { id: '1', name: 'Your Story', active: false },
  { id: '2', name: 'Nicole',     active: true },
  { id: '3', name: 'Algar Tech', active: true },
  { id: '4', name: 'Green India',active: true },
  { id: '5', name: 'Tech World', active: true },
];

const initialPosts = [
  {
    id: 'post_1',
    community: 'r/GreenTech', communityIcon: '🌱',
    authorName: 'British Ecological', authorHandle: 'britishecological',
    time: '2h', timestamp: 2, flair: 'Technology',
    text: 'Introducing our groundbreaking technology for wind turbines, designed to harness the power of nature more efficiently than ever before.',
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1000&auto=format&fit=crop&q=80',
    likes: 784, commentsCount: 14, shares: 160, awards: 32,
    isLiked: false, isDisliked: false, isFollowing: false, isSaved: false,
  },
  {
    id: 'post_2',
    community: 'r/ArtificialIntelligence', communityIcon: '🤖',
    authorName: 'Tech World', authorHandle: 'techworldindia',
    time: '3h', timestamp: 3, flair: 'News',
    text: 'BREAKING: New AI model achieves 98% accuracy in solving real-world problems. This is a major leap forward for artificial intelligence research.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80',
    likes: 128, commentsCount: 24, shares: 89, awards: 12,
    isLiked: false, isDisliked: false, isFollowing: true, isSaved: false,
  },
  {
    id: 'post_3',
    community: 'r/Photography', communityIcon: '🎨',
    authorName: 'Nicole Edison', authorHandle: 'nicole_edison',
    time: '1h', timestamp: 1, flair: 'OC',
    text: 'Parallel, Jason Anderson, oil on linen, 2019. Just stunning work!',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1000&auto=format&fit=crop&q=80',
    likes: 64, commentsCount: 8, shares: 23, awards: 4,
    isLiked: false, isDisliked: false, isFollowing: true, isSaved: false,
  },
];

const sidebarCommunities = [
  { id: 'rc1', name: 'Chennai Techies',      members: '12.4k', icon: Code,     color: 'text-violet-600', bg: 'bg-violet-100' },
  { id: 'rc2', name: 'Desi Foodies',         members: '45.2k', icon: Utensils, color: 'text-red-500',    bg: 'bg-red-100' },
  { id: 'rc3', name: 'Green Earth India',    members: '8.1k',  icon: Leaf,     color: 'text-green-600', bg: 'bg-green-100' },
  { id: 'rc4', name: 'Startup Founders',     members: '19.8k', icon: Rocket,   color: 'text-blue-500',  bg: 'bg-blue-100' },
  { id: 'rc5', name: 'Chennai Rains Alert',  members: '34.1k', icon: CloudRain,color: 'text-cyan-500',  bg: 'bg-cyan-100' },
];

const tabs = [
  { id: 'Home Feed', label: 'For You', icon: Home },
  { id: 'Local Feed', label: 'Local', icon: MapPin },
  { id: 'Trending Feed', label: 'Trending', icon: TrendingUp },
  { id: 'Following Feed', label: 'Following', icon: Users },
];

const sortCategories = [
  { id: 'best', label: 'Best', icon: Rocket },
  { id: 'hot', label: 'Hot', icon: Flame },
  { id: 'new', label: 'New', icon: Clock },
  { id: 'top', label: 'Top', icon: Trophy },
  { id: 'rising', label: 'Rising', icon: TrendingUp }
];

// ── Reddit-style Post Card ────────────────────────────────
function PostCard({ post, onLike, onDislike, onSave, onComment, onReport, activeReportPostId, setActiveReportPostId }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl hover:border-gray-300 transition-all mb-4 p-5 shadow-sm hover:shadow-md">
      {/* 1. Header: Community + Meta info */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="w-7 h-7 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center text-xs font-bold shadow-sm">
            {post.communityIcon || '🌱'}
          </div>
          <span className="text-sm font-black text-gray-900 hover:underline cursor-pointer">
            {post.community}
          </span>
          <span className="text-gray-300 text-xs">•</span>
          <span className="text-xs text-gray-400 font-medium">
            {post.time} ago
          </span>
          <span className="text-gray-300 text-xs">•</span>
          <span className="text-xs text-violet-600 font-semibold bg-violet-50 px-2.5 py-0.5 rounded-md">
            Recommended
          </span>
          
          <button className="text-xs font-extrabold text-violet-600 hover:bg-violet-50 px-3 py-1 rounded-full border border-violet-200 transition-colors cursor-pointer ml-1 select-none">
            Join
          </button>
        </div>

        {/* 3-dots actions menu with Admin Moderation Report */}
        <div className="relative">
          <button 
            onClick={() => setActiveReportPostId(activeReportPostId === post.id ? null : post.id)}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
          
          {activeReportPostId === post.id && (
            <div className="absolute right-0 top-8 w-40 bg-white border border-gray-200 rounded-xl shadow-xl z-30 p-1 space-y-1">
              <button
                onClick={() => onReport(post)}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                <Flag className="w-4 h-4" /> Report Post
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Title & Description */}
      <div className="space-y-1 cursor-pointer">
        <h3 className="text-base md:text-lg font-bold text-gray-900 leading-snug hover:text-violet-700 transition-colors">
          {post.text}
        </h3>
      </div>

      {/* 3. Post Image/Media */}
      {post.image && (
        <div className="mt-3.5 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 max-h-[550px] flex items-center justify-center cursor-pointer shadow-sm">
          <img
            src={post.image}
            alt="Post media"
            className="w-full object-cover max-h-[550px] hover:scale-[1.006] transition-transform duration-500"
          />
        </div>
      )}

      {/* 4. Bottom Action Bar: Pill Buttons */}
      <div className="flex items-center gap-2.5 flex-wrap mt-4 select-none">
        
        {/* Upvote / Downvote Pill */}
        <div className="flex items-center bg-gray-100 rounded-full h-9 px-1.5">
          <button
            onClick={() => onLike(post.id)}
            className={`p-1.5 rounded-full hover:bg-gray-200 transition-colors cursor-pointer ${post.isLiked ? 'text-orange-500' : 'text-gray-500'}`}
          >
            <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
          </button>
          <span className={`text-xs font-black px-2 leading-none ${post.isLiked ? 'text-orange-500' : post.isDisliked ? 'text-violet-600' : 'text-gray-700'}`}>
            {post.likes}
          </span>
          <button
            onClick={() => onDislike(post.id)}
            className={`p-1.5 rounded-full hover:bg-gray-200 transition-colors cursor-pointer ${post.isDisliked ? 'text-violet-600' : 'text-gray-500'}`}
          >
            <ArrowDown className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* Comment Pill */}
        <button
          onClick={() => onComment(post)}
          className="flex items-center gap-2 h-9 px-4 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-bold text-gray-600 transition-colors cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{post.commentsCount} Comments</span>
        </button>

        {/* Shares Pill */}
        <button
          className="flex items-center gap-2 h-9 px-4 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-bold text-gray-600 transition-colors cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>{post.shares} Share</span>
        </button>

        {/* Save Pill */}
        <button
          onClick={() => onSave(post.id)}
          className={`flex items-center gap-2 h-9 px-4 rounded-full text-xs font-bold transition-colors cursor-pointer ${post.isSaved ? 'text-violet-600 bg-violet-50 border border-violet-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
        >
          <Bookmark className={`w-4 h-4 ${post.isSaved ? 'fill-violet-600' : ''}`} />
          <span>{post.isSaved ? 'Saved' : 'Save'}</span>
        </button>

      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────
export default function HomeDashboardScreen({ onLogout, onCreatePress, onGoToAdmin, currentUser }) {
  const [activeTab, setActiveTab] = useState('Home Feed');
  const [posts, setPosts] = useState(initialPosts);
  // Admin Data State
  const [pinnedAnnouncement, setPinnedAnnouncement] = useState(adminStore.getAnnouncement());
  const [ads, setAds] = useState(adminStore.getAds());
  const [deletedPostIds, setDeletedPostIds] = useState(adminStore.getDeletedPostIds());
  const [activeReportPostId, setActiveReportPostId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [sortType, setSortType] = useState('best');

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
  const [profileImage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showStartCommunity, setShowStartCommunity] = useState(false);
  const [communityName, setCommunityName] = useState('');
  const [communityDesc, setCommunityDesc] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showComments, setShowComments] = useState(false);

  const getSortedPosts = (filterFunc = () => true) => {
    let list = posts.filter(filterFunc);
    if (sortType === 'best') {
      return [...list].sort((a, b) => b.likes - a.likes);
    }
    if (sortType === 'hot') {
      return [...list].sort((a, b) => (b.likes + b.commentsCount) - (a.likes + a.commentsCount));
    }
    if (sortType === 'new') {
      return [...list].sort((a, b) => a.timestamp - b.timestamp);
    }
    if (sortType === 'top') {
      return [...list].sort((a, b) => b.likes - a.likes);
    }
    if (sortType === 'rising') {
      return [...list].sort((a, b) => b.shares - a.shares);
    }
    return list;
  };

  const handleLike = (postId) => {
    setPosts(prev => prev.map(p => p.id === postId
      ? { ...p, isLiked: !p.isLiked, isDisliked: false, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
      : p));
  };
  const handleDislike = (postId) => {
    setPosts(prev => prev.map(p => p.id === postId
      ? { ...p, isDisliked: !p.isDisliked, isLiked: false, likes: p.isLiked ? p.likes - 1 : p.likes }
      : p));
  };
  const handleSave = (postId) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, isSaved: !p.isSaved } : p));
  };
  const handleComment = (post) => { setSelectedPost(post); setShowComments(true); };
  const handleLogout = () => { setShowMenu(false); setShowLogoutConfirm(true); };
  const confirmLogout = () => { setShowLogoutConfirm(false); if (onLogout) onLogout(); };

  const displayUserInitial = (currentUser?.displayName || currentUser?.name || 'U').charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#F6F7F8] text-gray-900 font-sans flex flex-col">

      {/* ══════════ TOP NAVIGATION BAR ══════════ */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm w-full">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-4">

          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0 cursor-pointer select-none">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-orange-500 flex items-center justify-center shadow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <ellipse cx="12" cy="6"  rx="4" ry="5" fill="white" opacity="0.9" transform="rotate(0 12 12)" />
                <ellipse cx="12" cy="18" rx="4" ry="5" fill="white" opacity="0.9" transform="rotate(180 12 12)" />
                <ellipse cx="6"  cy="12" rx="5" ry="4" fill="white" opacity="0.9" transform="rotate(270 12 12)" />
                <ellipse cx="18" cy="12" rx="5" ry="4" fill="white" opacity="0.9" transform="rotate(90 12 12)" />
                <circle cx="12" cy="12" r="2.5" fill="white" />
              </svg>
            </div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-violet-600 to-orange-500 bg-clip-text text-transparent hidden sm:block">
              Inspire
            </span>
          </div>

          {/* Search bar - Widescreen optimized */}
          <div className="flex-1 max-w-2xl mx-auto relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search communities, topics, or posts..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearchOverlay(true)}
              className="w-full h-10 pl-11 pr-4 bg-gray-100 border border-transparent rounded-full text-sm focus:outline-none focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-200 transition-all"
            />
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {(currentUser?.isAdmin || currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN') && (
              <button
                onClick={onGoToAdmin}
                className="hidden md:flex items-center gap-1.5 px-3.5 h-9 rounded-full bg-violet-50 text-violet-700 font-extrabold text-xs border border-violet-200 hover:bg-violet-100 transition-all cursor-pointer"
              >
                <Award className="w-4 h-4" /> Admin Console
              </button>
            )}

            <button
              onClick={onCreatePress}
              className="hidden sm:flex items-center gap-2 px-4 h-9 rounded-full bg-gradient-to-r from-violet-600 to-orange-500 text-white font-bold text-xs hover:opacity-95 shadow-md shadow-violet-500/15 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Create
            </button>

            <button className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
            </button>

            {/* User avatar + dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 h-10 px-2.5 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all cursor-pointer"
              >
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-orange-500 flex items-center justify-center text-white font-extrabold text-xs">
                    {displayUserInitial}
                  </div>
                )}
                <span className="text-xs font-bold text-gray-700 hidden lg:inline max-w-[100px] truncate">
                  {currentUser?.displayName || currentUser?.name || 'User'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-12 w-60 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
                  <div className="p-3.5 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-orange-500 flex items-center justify-center text-white font-extrabold text-sm">
                        {displayUserInitial}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-gray-900 truncate">{currentUser?.displayName || currentUser?.name || 'Community Member'}</p>
                        <p className="text-[11px] text-gray-400 truncate">{currentUser?.email || currentUser?.username || 'user'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-1">
                    {[
                      { icon: User, label: 'Profile' },
                      { icon: Bookmark, label: 'Saved' },
                      { icon: MessageSquare, label: 'Messages' },
                      { icon: Compass, label: 'Discover' },
                    ].map(({ icon: Icon, label }) => (
                      <button key={label} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                        <Icon className="w-4 h-4 text-gray-400" />
                        {label}
                      </button>
                    ))}
                    {(currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN' || currentUser?.isAdmin) && (
                      <button onClick={onGoToAdmin} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-violet-600 hover:bg-violet-50 transition-colors cursor-pointer border-t border-gray-100 mt-1 pt-1">
                        <AlertTriangle className="w-4 h-4 text-violet-500" />
                        Admin Console
                      </button>
                    )}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ══════════ BODY: 3-COLUMN FULL SCREEN LAYOUT ══════════ */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex gap-6 lg:gap-8 flex-1">

        {/* ── LEFT SIDEBAR ──────────────────────── */}
        <aside className="w-64 flex-shrink-0 hidden lg:block space-y-1.5 sticky top-18 self-start max-h-[calc(100vh-5rem)] overflow-y-auto no-scrollbar">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${activeTab === id ? 'bg-white shadow-sm text-violet-700 border border-violet-100' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${activeTab === id ? 'text-violet-600' : ''}`} />
              {label}
            </button>
          ))}

          <div className="border-t border-gray-200/80 my-3 pt-3">
            <button
              onClick={() => setShowStartCommunity(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-white hover:shadow-sm transition-all cursor-pointer border border-transparent hover:border-gray-200"
            >
              <PlusCircle className="w-5 h-5 text-violet-600" />
              Create Community
            </button>
          </div>

          {/* Communities */}
          <div className="pt-2">
            <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5">Popular Communities</p>
            {sidebarCommunities.map(c => {
              const Icon = c.icon;
              return (
                <button key={c.id} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-gray-700 hover:bg-white hover:shadow-sm transition-all cursor-pointer border border-transparent hover:border-gray-100">
                  <div className={`w-8 h-8 rounded-full ${c.bg} ${c.color} flex items-center justify-center flex-shrink-0 shadow-xs`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="truncate">{c.name}</span>
                </button>
              );
            })}
          </div>

          <div className="px-4 pt-6 text-[11px] text-gray-400 leading-relaxed">
            Help · About · Careers · Privacy · Terms<br />
            <span className="text-[10px] text-gray-400/80">Inspire © 2026. Powered by DAWNS</span>
          </div>
        </aside>

        {/* ── MAIN FEED (EXPANDED WIDESCREEN) ─────────────────────────── */}
        <main className="flex-1 min-w-0 max-w-none">
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-2xl px-4 py-2 mb-4 shadow-xs overflow-x-auto no-scrollbar">
            {sortCategories.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSortType(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold flex-shrink-0 transition-all cursor-pointer ${sortType === id ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <Icon className={`w-4 h-4 ${sortType === id ? 'text-orange-500' : 'text-gray-400'}`} />
                {label}
              </button>
            ))}
          </div>

          {/* Create-post shortcut bar */}
          {activeTab !== 'Home Feed' && (
            <div className="bg-white border border-gray-200 rounded-2xl p-3 flex items-center gap-3 mb-4 shadow-xs">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-orange-500 flex items-center justify-center text-white font-extrabold text-xs flex-shrink-0">
                {displayUserInitial}
              </div>
              <button
                onClick={onCreatePress}
                className="flex-1 h-10 text-left px-4 text-sm text-gray-400 bg-gray-50 border border-gray-200 rounded-full hover:bg-white hover:border-violet-300 transition-all cursor-pointer"
              >
                Create a post...
              </button>
              <button onClick={onCreatePress} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* ── Home Feed ── */}
          {activeTab === 'Home Feed' && (
            <div className="space-y-4">
              {/* ── PINNED SUPER USER ANNOUNCEMENT ── */}
              {pinnedAnnouncement && (
                <div className="border-2 border-violet-500/80 rounded-3xl p-6 bg-gradient-to-br from-violet-900/10 via-purple-500/5 to-white shadow-md relative overflow-hidden space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-gradient-to-r from-violet-600 to-orange-500 text-white font-black text-xs rounded-full flex items-center gap-1.5 shadow-sm">
                        <Pin className="w-3.5 h-3.5" /> Pinned by Super User
                      </span>
                      <span className="text-xs font-bold text-gray-900">{pinnedAnnouncement.authorName}</span>
                    </div>
                    <span className="text-[10px] font-black text-violet-600 uppercase tracking-widest bg-violet-100 px-2.5 py-1 rounded-md">
                      Official Announcement
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-gray-900">{pinnedAnnouncement.title}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed font-medium">{pinnedAnnouncement.text}</p>

                  {pinnedAnnouncement.image && (
                    <div className="w-full max-h-[450px] rounded-2xl overflow-hidden shadow-sm">
                      <img src={pinnedAnnouncement.image} alt="Announcement" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              )}

              {/* ── LIVE ADVERTISEMENT BANNER ── */}
              {ads && ads.filter(a => a.active).length > 0 && (
                <div className="border border-emerald-300 rounded-3xl p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-white shadow-sm flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider rounded-md animate-pulse">
                      Sponsored Ad
                    </span>
                    <h4 className="text-sm font-bold text-gray-900">{ads.find(a => a.active).title}</h4>
                    <p className="text-xs text-gray-500">{ads.find(a => a.active).sponsor}</p>
                  </div>
                  {ads.find(a => a.active).image && (
                    <img src={ads.find(a => a.active).image} alt="Ad" className="w-20 h-20 object-cover rounded-xl shrink-0 border border-emerald-200 shadow-sm" />
                  )}
                </div>
              )}

              {/* Posts */}
              {getSortedPosts(p => !deletedPostIds.includes(p.id)).map(post => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onLike={handleLike} 
                  onDislike={handleDislike} 
                  onSave={handleSave} 
                  onComment={handleComment} 
                  onReport={handleReportPost}
                  activeReportPostId={activeReportPostId}
                  setActiveReportPostId={setActiveReportPostId}
                />
              ))}
            </div>
          )}

          {/* ── Local Feed ── */}
          {activeTab === 'Local Feed' && (
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-2.5 shadow-xs">
                <MapPin className="w-5 h-5 text-violet-600" />
                <span className="text-base font-bold text-gray-900">Chennai, Tamil Nadu</span>
                <ChevronDown className="w-4 h-4 text-gray-400 cursor-pointer" />
              </div>

              <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-violet-600 to-pink-500 p-6 text-white flex justify-between items-center shadow-sm">
                <div className="space-y-2">
                  <h4 className="text-base font-black">Live Updates from your city</h4>
                  <p className="text-xs text-violet-100">Stay informed about what's happening near you</p>
                  <button className="bg-white text-violet-600 font-black text-xs px-5 py-2 rounded-full hover:opacity-90 transition-opacity cursor-pointer shadow-sm">View Live</button>
                </div>
                <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-bold">🏙️</div>
              </div>

              {[
                { id: 'l1', title: 'Road work on Anna Salai', desc: 'Road renovation work is in progress. Plan your travel accordingly.', time: '2h ago', likes: 123, comments: 32, tag: 'Traffic', color: 'text-amber-600 bg-amber-50' },
                { id: 'l2', title: 'Water Supply Update', desc: 'Water supply will be affected in Adyar, Besant Nagar area this weekend.', time: '3h ago', likes: 87, comments: 0, tag: 'Utility', color: 'text-blue-600 bg-blue-50' },
                { id: 'l3', title: 'Garbage Collection Drive', desc: 'Special cleanliness drive starting this Sunday in Ward 112.', time: '4h ago', likes: 64, comments: 15, tag: 'Cleanliness', color: 'text-green-600 bg-green-50' },
              ].map(item => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-2xl hover:border-gray-400 transition-colors shadow-xs">
                  <div className="flex gap-0">
                    <div className="w-12 bg-gray-50 rounded-l-2xl flex flex-col items-center pt-4 gap-1">
                      <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-orange-50 hover:text-orange-500 text-gray-400 transition-all cursor-pointer"><ArrowUp className="w-4 h-4" strokeWidth={2.5}/></button>
                      <span className="text-xs font-black text-gray-700">{item.likes}</span>
                      <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-violet-50 hover:text-violet-600 text-gray-400 transition-all cursor-pointer"><ArrowDown className="w-4 h-4" strokeWidth={2.5}/></button>
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${item.color}`}>{item.tag}</span>
                        <span className="text-xs text-gray-400">{item.time}</span>
                      </div>
                      <h4 className="text-base font-bold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                      <div className="flex gap-2 mt-3">
                        <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-gray-500 hover:bg-gray-100 transition-all cursor-pointer">
                          <MessageCircle className="w-4 h-4" />{item.comments} Comments
                        </button>
                        <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-gray-500 hover:bg-gray-100 transition-all cursor-pointer">
                          <Share2 className="w-4 h-4" />Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Trending Feed ── */}
          {activeTab === 'Trending Feed' && (
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-base font-black text-gray-900">🔥 Trending Topics</span>
                  <span className="text-xs text-violet-600 font-bold cursor-pointer hover:opacity-80">See All →</span>
                </div>
                <div className="divide-y divide-gray-100">
                  {[
                    { rank: '01', tag: '#ChennaiRains', count: '12.5K posts', trend: '+22%' },
                    { rank: '02', tag: '#AIJobs',        count: '8.1K posts',  trend: '+18%' },
                    { rank: '03', tag: '#MetroPhase2',   count: '6.7K posts',  trend: '+16%' },
                    { rank: '04', tag: '#TNBudget2025',  count: '5.3K posts',  trend: '+12%' },
                    { rank: '05', tag: '#IPL2025',        count: '4.0K posts',  trend: '+10%' },
                  ].map(item => (
                    <div key={item.rank} className="flex items-center py-3.5 cursor-pointer hover:bg-gray-50 px-3 -mx-3 rounded-xl transition-colors">
                      <span className="text-lg font-black text-violet-600 w-12">{item.rank}</span>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">{item.tag}</p>
                        <p className="text-xs text-gray-400">{item.count}</p>
                      </div>
                      <div className="flex items-center gap-1 text-green-500 font-bold text-xs">
                        <TrendingUp className="w-4 h-4" />
                        {item.trend}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs font-black text-gray-700 px-1">Trending Post</p>
              {getSortedPosts(p => p.id === 'post_2').map(post => (
                <PostCard key={post.id} post={post} onLike={handleLike} onDislike={handleDislike} onSave={handleSave} onComment={handleComment} />
              ))}
            </div>
          )}

          {/* ── Following Feed ── */}
          {activeTab === 'Following Feed' && (
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-2xl py-4 px-5 shadow-xs">
                <p className="text-xs font-black text-gray-700 mb-3">People you follow</p>
                <div className="flex gap-4 overflow-x-auto no-scrollbar">
                  {stories.slice(1).map(story => (
                    <div key={story.id} className="flex flex-col items-center flex-shrink-0 w-16 cursor-pointer">
                      <div className="w-14 h-14 rounded-full p-0.5 bg-gray-200">
                        <div className="w-full h-full rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-sm font-black text-gray-600 select-none">
                          {story.name[0]}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 mt-1 truncate w-full text-center">{story.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              {getSortedPosts(p => p.id === 'post_3').map(post => (
                <PostCard key={post.id} post={post} onLike={handleLike} onDislike={handleDislike} onSave={handleSave} onComment={handleComment} />
              ))}
            </div>
          )}
        </main>

        {/* ── RIGHT SIDEBAR (EXPANDED WIDESCREEN 320PX) ─────────────────────── */}
        <aside className="w-80 flex-shrink-0 hidden xl:block sticky top-18 self-start space-y-5 max-h-[calc(100vh-5rem)] overflow-y-auto no-scrollbar">
          
          {/* Home community card */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="h-20 bg-gradient-to-r from-violet-600 via-pink-500 to-orange-400 relative">
              <div className="absolute -bottom-6 left-5 w-14 h-14 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-2xl select-none">
                🏠
              </div>
            </div>
            <div className="pt-8 px-5 pb-5 space-y-3.5">
              <h3 className="text-base font-black text-gray-900">Home Feed</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Your personal Inspire dashboard. Come here to check in with your favorite communities and trending topics.
              </p>
              <button
                onClick={onCreatePress}
                className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-orange-500 text-white font-black text-xs rounded-full hover:opacity-90 transition-opacity cursor-pointer shadow-md"
              >
                Create Post
              </button>
              <button
                onClick={() => setShowStartCommunity(true)}
                className="w-full py-2.5 border border-violet-600 text-violet-600 font-black text-xs rounded-full hover:bg-violet-50 transition-colors cursor-pointer"
              >
                Create Community
              </button>
            </div>
          </div>

          {/* Top communities */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-4">Top Communities</h3>
            <div className="space-y-3.5">
              {sidebarCommunities.map((c, idx) => {
                const Icon = c.icon;
                return (
                  <div key={c.id} className="flex items-center gap-3 cursor-pointer group">
                    <span className="text-xs font-black text-gray-400 w-4">{idx + 1}</span>
                    <div className={`w-9 h-9 rounded-full ${c.bg} ${c.color} flex items-center justify-center flex-shrink-0 shadow-xs`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate group-hover:text-violet-600 transition-colors">{c.name}</p>
                      <p className="text-[11px] text-gray-400">{c.members} members</p>
                    </div>
                    <button className="text-[11px] font-black text-violet-600 border border-violet-300 px-3 py-1 rounded-full hover:bg-violet-50 transition-colors cursor-pointer flex-shrink-0">
                      Join
                    </button>
                  </div>
                );
              })}
            </div>
            <button className="w-full mt-4 text-xs text-violet-600 font-bold hover:opacity-80 transition-opacity cursor-pointer text-center block">
              View All Communities →
            </button>
          </div>

          {/* Footer links */}
          <div className="px-2 text-[11px] text-gray-400 leading-relaxed">
            Help · About · Careers · Press · Blog<br />
            Rules · Privacy · Terms · Accessibility<br />
            <span className="text-[10px] text-gray-400/80">Inspire Inc © 2026. Powered by DAWNS</span>
          </div>
        </aside>
      </div>

      {/* ══════════ FLOATING MOBILE BOTTOM NAV ══════════ */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex xl:hidden z-40 safe-bottom">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 text-[9px] font-bold transition-colors cursor-pointer ${activeTab === id ? 'text-violet-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Icon className={`w-5 h-5 ${activeTab === id ? 'text-violet-600' : ''}`} />
            {label}
          </button>
        ))}
        <button
          onClick={onCreatePress}
          className="flex-1 flex flex-col items-center py-2.5 gap-0.5 text-[9px] font-bold text-gray-400 hover:text-violet-600 transition-colors cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Create
        </button>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex-1 flex flex-col items-center py-2.5 gap-0.5 text-[9px] font-bold text-gray-400 hover:text-violet-600 transition-colors cursor-pointer"
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-600 to-orange-500 flex items-center justify-center text-white font-extrabold text-[9px]">
            {displayUserInitial}
          </div>
          Me
        </button>
      </nav>

      {/* Close menu overlay */}
      {showMenu && <div className="fixed inset-0 z-30" onClick={() => setShowMenu(false)} />}

      {/* ══════════ SEARCH OVERLAY ══════════ */}
      {showSearchOverlay && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-start justify-center pt-16 px-4" onClick={() => setShowSearchOverlay(false)}>
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="p-3.5 border-b border-gray-100 flex items-center gap-2.5">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search communities, posts, people..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 text-sm focus:outline-none"
              />
              <button onClick={() => setShowSearchOverlay(false)} className="text-xs font-bold text-violet-600 cursor-pointer">Close</button>
            </div>
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto no-scrollbar">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Communities</p>
                {sidebarCommunities.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map(c => {
                  const Icon = c.icon;
                  return (
                    <div key={c.id} onClick={() => setShowSearchOverlay(false)} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 cursor-pointer">
                      <div className={`w-8 h-8 rounded-full ${c.bg} ${c.color} flex items-center justify-center`}><Icon className="w-4 h-4" /></div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">{c.name}</p>
                        <p className="text-[10px] text-gray-400">{c.members} members</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Posts</p>
                {posts.filter(p => p.text.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
                  <div key={p.id} onClick={() => setShowSearchOverlay(false)} className="p-2.5 rounded-xl hover:bg-gray-50 cursor-pointer">
                    <p className="text-xs font-bold text-gray-800 truncate">{p.text}</p>
                    <p className="text-[10px] text-gray-400">{p.community} • {p.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ LOGOUT CONFIRM ══════════ */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl text-center space-y-4 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto">
              <LogOut className="w-7 h-7 text-red-500" />
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900">Log out of Inspire?</h3>
              <p className="text-xs text-gray-500 mt-1">You'll need to sign in again to access your feed.</p>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs hover:bg-gray-200 cursor-pointer">Cancel</button>
              <button onClick={confirmLogout} className="flex-1 py-2.5 bg-red-500 text-white font-bold rounded-xl text-xs hover:bg-red-600 cursor-pointer shadow-md">Log Out</button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ CREATE COMMUNITY MODAL ══════════ */}
      {showStartCommunity && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-black text-gray-900">Create a Community</h3>
              <button onClick={() => setShowStartCommunity(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest block mb-1.5">Name</label>
                <input
                  type="text"
                  placeholder="Community name (no spaces)"
                  value={communityName}
                  onChange={e => setCommunityName(e.target.value)}
                  className="w-full py-2.5 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest block mb-1.5">Description</label>
                <textarea
                  placeholder="What is your community about?"
                  value={communityDesc}
                  onChange={e => setCommunityDesc(e.target.value)}
                  rows={3}
                  className="w-full py-2.5 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={() => setShowStartCommunity(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-bold rounded-xl text-sm hover:bg-gray-50 cursor-pointer">Cancel</button>
                <button
                  onClick={() => {
                    if (!communityName.trim()) return;
                    setCommunityName(''); setCommunityDesc(''); setShowStartCommunity(false);
                  }}
                  className="flex-1 py-2.5 bg-gradient-to-r from-violet-600 to-orange-500 text-white font-bold rounded-xl text-sm hover:opacity-90 cursor-pointer shadow-md"
                >
                  Create Community
                </button>
              </div>
            </div>
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
}
