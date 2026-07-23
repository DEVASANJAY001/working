import React, { useState } from 'react';
import {
  Search, Bell, Home, Compass, Plus, MessageSquare, User, MoreHorizontal,
  LogOut, MapPin, ChevronDown, TrendingUp, Award, ArrowUp, ArrowDown,
  X, MoreVertical, Users, PlusCircle, Code, Utensils, Leaf, Rocket,
  CloudRain, Camera, Cpu, ChevronRight, Train, Trophy, AlertTriangle,
  Share2, Bookmark, MessageCircle, Gift, Send, Smile, Copy, Smartphone,
  Flame, Clock, Flag, Pin, Radio, Sparkles, Repeat, RotateCcw, Volume2,
  VolumeX, Maximize2, Settings, Newspaper, Gamepad2, Layers, ShieldCheck,
  Eye, Skull, Grid, Crosshair, Wrench
} from 'lucide-react';
import { adminStore } from '../../services/adminStore';

// ── Mock data matching reference screenshot ────────────────
const initialPosts = [
  {
    id: 'post_cars',
    community: 'r/CarsIndia',
    communityIcon: '🚗',
    isVerified: true,
    authorName: 'carsindia_mod',
    time: '13 hr. ago',
    recommendationReason: "Because you've shown interest in this community",
    hasSpoiler: true,
    title: 'Thoughts on this build',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000&auto=format&fit=crop&q=80',
    likes: 144,
    commentsCount: 7,
    shares: 2,
    isLiked: false,
    isDisliked: false,
    isJoined: false,
    isSaved: false,
  },
  {
    id: 'post_ipl',
    community: 'r/ipl',
    communityIcon: '🏏',
    isVerified: false,
    authorName: 'cricket_fan',
    time: '6d ago',
    recommendationReason: 'Popular in Sports',
    hasSpoiler: false,
    title: 'How come this man becomes Bradman in MLC?',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1000&auto=format&fit=crop&q=80',
    likes: 176,
    commentsCount: 20,
    shares: 12,
    isLiked: false,
    isDisliked: false,
    isJoined: true,
    isSaved: false,
  },
  {
    id: 'post_ai',
    community: 'r/AI_Agents',
    communityIcon: '🤖',
    isVerified: false,
    authorName: 'agent_architect',
    time: '2mo ago',
    recommendationReason: 'Trending in Technology',
    hasSpoiler: false,
    title: 'How would you build an AI agent from zero as a beginner?',
    bodyText: 'I want to build an autonomous agent using LLMs and tools. What frameworks do you recommend for starting out?',
    likes: 149,
    commentsCount: 122,
    shares: 28,
    isLiked: false,
    isDisliked: false,
    isJoined: true,
    isSaved: false,
  },
];

const recentPostsList = [
  {
    id: 'rec_ipl',
    community: 'r/ipl',
    communityIcon: '🏏',
    time: '6d ago',
    title: 'How come this man becomes Bradman in MLC?',
    upvotes: '1/6 upvotes',
    comments: '20 comments',
    thumbnail: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'rec_ai',
    community: 'r/AI_Agents',
    communityIcon: '🤖',
    time: '2mo ago',
    title: 'How would you build an AI agent from zero as a beginner?',
    upvotes: '149 upvotes',
    comments: '122 comments',
  },
  {
    id: 'rec_side',
    community: 'r/SideProject',
    communityIcon: '🚀',
    time: '2mo ago',
    title: 'I built a platform where people post their problems and founders find what to...',
    upvotes: '2 upvotes',
    comments: '10 comments',
  },
  {
    id: 'rec_apps1',
    community: 'r/apps',
    communityIcon: '📱',
    time: '2mo ago',
    title: 'We built a Splitwise alternative - split group costs by just scanning receipts',
    upvotes: '1 upvote',
    comments: '16 comments',
  },
  {
    id: 'rec_apps2',
    community: 'r/apps',
    communityIcon: '📱',
    time: '2mo ago',
    title: 'Recently launched our first Android app — Split 🚀 It...',
    upvotes: '1 upvote',
    comments: '',
    thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=200&auto=format&fit=crop&q=80',
  },
];

// ── Spoiler Post Component ───────────────────────────────
function SpoilerPostCard({ post, onLike, onDislike, onReport, activeReportPostId, setActiveReportPostId }) {
  const [showSpoiler, setShowSpoiler] = useState(!post.hasSpoiler);
  const [joined, setJoined] = useState(post.isJoined);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl hover:border-gray-300 transition-all mb-4 p-4 md:p-5 shadow-xs">
      {/* 1. Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold border border-gray-200">
            {post.communityIcon || '🏎️'}
          </div>
          <span className="font-extrabold text-gray-900 hover:underline cursor-pointer">
            {post.community}
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-400 font-normal">{post.time}</span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-400 font-normal truncate max-w-xs">{post.recommendationReason}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setJoined(!joined)}
            className={`px-4 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              joined ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {joined ? 'Joined' : 'Join'}
          </button>

          <div className="relative">
            <button
              onClick={() => setActiveReportPostId(activeReportPostId === post.id ? null : post.id)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {activeReportPostId === post.id && (
              <div className="absolute right-0 top-7 w-36 bg-white border border-gray-200 rounded-xl shadow-xl z-30 p-1">
                <button
                  onClick={() => onReport(post)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Flag className="w-3.5 h-3.5" /> Report Post
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Spoiler Tag & Title */}
      {post.hasSpoiler && (
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-gray-800 mb-1">
          <span>◆</span>
          <span>SPOILER</span>
        </div>
      )}

      <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3 leading-snug cursor-pointer hover:text-orange-600 transition-colors">
        {post.title}
      </h2>

      {/* 3. Media with Spoiler Overlay */}
      {post.image && (
        <div className="relative rounded-2xl overflow-hidden bg-[#2D2825] my-2 min-h-[380px] max-h-[560px] flex items-center justify-center shadow-md">
          {!showSpoiler ? (
            <div className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center min-h-[380px]">
              {/* Blurred background image effect */}
              <img
                src={post.image}
                alt="Spoiler background"
                className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40"
              />
              <div className="absolute inset-0 bg-black/40" />

              <button
                onClick={() => setShowSpoiler(true)}
                className="relative z-10 bg-black/80 hover:bg-black text-white text-xs font-extrabold px-5 py-2.5 rounded-full transition-all cursor-pointer border border-white/20 shadow-2xl flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View spoiler
              </button>
            </div>
          ) : (
            <img
              src={post.image}
              alt="Post content"
              className="w-full max-h-[560px] object-contain transition-transform duration-300"
            />
          )}
        </div>
      )}

      {/* 4. Action Pills */}
      <div className="flex items-center gap-2 flex-wrap mt-3 select-none">
        <div className="flex items-center bg-gray-100 rounded-full h-8 px-2 text-xs font-bold">
          <button
            onClick={() => onLike(post.id)}
            className={`p-1 rounded-full hover:bg-gray-200 transition-colors cursor-pointer ${post.isLiked ? 'text-orange-600' : 'text-gray-500'}`}
          >
            <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
          </button>
          <span className={`px-2 ${post.isLiked ? 'text-orange-600' : post.isDisliked ? 'text-blue-600' : 'text-gray-800'}`}>
            {post.likes}
          </span>
          <button
            onClick={() => onDislike(post.id)}
            className={`p-1 rounded-full hover:bg-gray-200 transition-colors cursor-pointer ${post.isDisliked ? 'text-blue-600' : 'text-gray-500'}`}
          >
            <ArrowDown className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        <button className="flex items-center gap-1.5 h-8 px-3.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-bold text-gray-700 transition-colors cursor-pointer">
          <MessageCircle className="w-4 h-4 text-gray-500" />
          <span>{post.commentsCount}</span>
        </button>

        <button className="flex items-center gap-1.5 h-8 px-3 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-bold text-gray-700 transition-colors cursor-pointer">
          <Repeat className="w-3.5 h-3.5 text-gray-500" />
        </button>

        <button className="flex items-center gap-1.5 h-8 px-3.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-bold text-gray-700 transition-colors cursor-pointer">
          <Share2 className="w-3.5 h-3.5 text-gray-500" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}

// ── Main Home Dashboard Component ──────────────────────────
export default function HomeDashboardScreen({ onLogout, onCreatePress, onGoToAdmin, currentUser }) {
  const [posts, setPosts] = useState(initialPosts);
  const [activeNav, setActiveNav] = useState('Home');
  const [sortFilter, setSortFilter] = useState('Best');
  const [gamesOpen, setGamesOpen] = useState(true);
  const [modOpen, setModOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [activeReportPostId, setActiveReportPostId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

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

  const handleReportPost = (post) => {
    adminStore.reportPost(post.id, post, "Inappropriate content / Spam");
    setToastMsg(`Post reported to moderators.`);
    setActiveReportPostId(null);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    if (onLogout) onLogout();
  };

  const userInitial = (currentUser?.name || currentUser?.displayName || 'U').charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col">

      {/* ══════════ TOP HEADER (DITTO MATCH) ══════════ */}
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
                <button onClick={() => setShowLogoutConfirm(true)} className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ══════════ MAIN BODY (3 COLUMNS DITTO MATCH) ══════════ */}
      <div className="flex flex-1 w-full max-w-[1600px] mx-auto">

        {/* ── LEFT SIDEBAR ──────────────────────── */}
        <aside className="w-64 border-r border-gray-200 p-3 hidden lg:block space-y-4 sticky top-14 self-start h-[calc(100vh-3.5rem)] overflow-y-auto no-scrollbar">
          {/* Main Links */}
          <div className="space-y-1">
            {[
              { id: 'Home', label: 'Home', icon: Home },
              { id: 'Popular', label: 'Popular', icon: Compass },
              { id: 'News', label: 'News', icon: Newspaper },
              { id: 'Explore', label: 'Explore', icon: Layers },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveNav(id)}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-sm font-bold transition-colors cursor-pointer ${
                  activeNav === id ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 text-gray-700" />
                {label}
              </button>
            ))}
            
            <button className="w-full flex items-center gap-3.5 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-2xl cursor-pointer">
              <Plus className="w-5 h-5 text-gray-700" />
              Start a community
            </button>
          </div>

          <hr className="border-gray-200" />

          {/* GAMES ON REDDIT */}
          <div>
            <button
              onClick={() => setGamesOpen(!gamesOpen)}
              className="w-full flex items-center justify-between text-xs font-black text-gray-500 tracking-wider uppercase px-2 mb-2 cursor-pointer"
            >
              <span>GAMES ON REDDIT</span>
              <span className={`transform transition-transform ${gamesOpen ? 'rotate-180' : ''}`}>^</span>
            </button>

            {gamesOpen && (
              <div className="space-y-2">
                {/* Slingblade Featured Banner (Exact Screenshot Match) */}
                <div className="bg-[#0055D4] text-white rounded-2xl p-3 shadow-sm cursor-pointer hover:opacity-95 transition-opacity">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black tracking-wide">Slingblade</span>
                    <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase">NEW</span>
                  </div>
                  <p className="text-[11px] text-blue-100 mt-0.5">Reach the top!</p>
                </div>

                <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 rounded-xl cursor-pointer">
                  <Skull className="w-4 h-4 text-gray-500" />
                  <span>Bonkyard</span>
                </button>

                <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 rounded-xl cursor-pointer">
                  <Grid className="w-4 h-4 text-gray-500" />
                  <span>4 Pics 1 Word</span>
                </button>

                <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 rounded-xl cursor-pointer">
                  <Crosshair className="w-4 h-4 text-gray-500" />
                  <span>Sword & Supper</span>
                </button>

                <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 rounded-xl cursor-pointer">
                  <Gamepad2 className="w-4 h-4 text-gray-500" />
                  <span>Discover More</span>
                </button>
              </div>
            )}
          </div>

          <hr className="border-gray-200" />

          {/* MODERATION */}
          <div>
            <button
              onClick={() => setModOpen(!modOpen)}
              className="w-full flex items-center justify-between text-xs font-black text-gray-500 tracking-wider uppercase px-2 mb-2 cursor-pointer"
            >
              <span>MODERATION</span>
              <span className={`transform transition-transform ${modOpen ? 'rotate-180' : ''}`}>^</span>
            </button>

            {modOpen && (
              <div className="space-y-1">
                {['Mod Queue', 'Mod Mail', 'r/Mod'].map(name => (
                  <button key={name} className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 rounded-xl cursor-pointer">
                    <ShieldCheck className="w-4 h-4 text-gray-500" />
                    <span>{name}</span>
                  </button>
                ))}
                
                {/* Manage option at the bottom */}
                <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 rounded-xl cursor-pointer">
                  <Wrench className="w-4 h-4 text-gray-500" />
                  <span>Manage</span>
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* ── CENTER MAIN FEED ──────────────────── */}
        <main className="flex-1 p-4 max-w-3xl mx-auto min-w-0">
          {/* Top Sort Controls */}
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
            <div className="flex items-center gap-3 text-xs font-bold text-gray-700">
              <button className="flex items-center gap-1 hover:bg-gray-100 px-3 py-1.5 rounded-full cursor-pointer">
                <span>{sortFilter}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <button className="flex items-center gap-1 hover:bg-gray-100 px-2 py-1.5 rounded-full cursor-pointer">
                <span>[ = ]</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {posts.map(post => (
              <SpoilerPostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onDislike={handleDislike}
                onReport={handleReportPost}
                activeReportPostId={activeReportPostId}
                setActiveReportPostId={setActiveReportPostId}
              />
            ))}
          </div>
        </main>

        {/* ── RIGHT SIDEBAR (EXACT MATCH TO REFERENCE IMAGE) ─────────────────────── */}
        <aside className="w-80 p-4 border-l border-gray-200 hidden xl:block sticky top-14 self-start h-[calc(100vh-3.5rem)] overflow-y-auto no-scrollbar space-y-4">
          
          {/* Recent Posts Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">RECENT POSTS</h3>
            <button className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">Clear</button>
          </div>

          {/* Recent Posts List with Thumbnails */}
          <div className="space-y-3">
            {recentPostsList.map((item) => (
              <div key={item.id} className="p-2 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors space-y-1 flex gap-2 justify-between">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                    <span className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[9px] font-bold">{item.communityIcon}</span>
                    <span className="font-bold text-gray-800">{item.community}</span>
                    <span>•</span>
                    <span>{item.time}</span>
                  </div>
                  <p className="text-xs font-bold text-gray-900 leading-snug hover:text-orange-600 transition-colors line-clamp-2">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {item.upvotes} {item.comments ? `• ${item.comments}` : ''}
                  </p>
                </div>

                {/* Right side thumbnail if present */}
                {item.thumbnail && (
                  <img src={item.thumbnail} alt="Thumbnail" className="w-14 h-14 rounded-xl object-cover border border-gray-200 flex-shrink-0 shadow-xs" />
                )}
              </div>
            ))}
          </div>

        </aside>

      </div>

      {/* TOAST NOTIFICATION OVERLAY */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-2 border border-gray-700 animate-fade-in">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* LOGOUT CONFIRM MODAL */}
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

    </div>
  );
}
