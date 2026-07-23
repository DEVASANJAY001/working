import React, { useState, useEffect } from 'react';
import {
  Search, Bell, Home, Compass, Plus, MessageSquare, User, MoreHorizontal,
  LogOut, MapPin, ChevronDown, TrendingUp, Award, ArrowUp, ArrowDown,
  X, MoreVertical, Users, PlusCircle, Code, Utensils, Leaf, Rocket,
  CloudRain, Camera, Cpu, ChevronRight, Train, Trophy, AlertTriangle,
  Share2, Bookmark, MessageCircle, Gift, Send, Smile, Copy, Smartphone,
  Flame, Clock, Flag, Pin, Radio, Sparkles, Repeat, RotateCcw, Volume2,
  VolumeX, Maximize2, Settings, Newspaper, Gamepad2, Layers, ShieldCheck
} from 'lucide-react';
import { adminStore } from '../../services/adminStore';

// ── Mock data for Reddit-style feed ───────────────────────
const initialPosts = [
  {
    id: 'post_vit',
    community: 'r/vitchennai',
    communityIcon: '🎓',
    isVerified: true,
    authorName: 'vitchennai_mod',
    time: '17 hr. ago',
    recommendationReason: "Because you've shown interest in this community",
    title: 'meme',
    subtitle: 'How E block students be moving to reach AB1 at crisp 8am',
    type: 'video',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-group-of-friends-running-together-in-the-sunset-40292-large.mp4',
    videoPoster: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000&auto=format&fit=crop&q=80',
    duration: '0:06',
    likes: 162,
    commentsCount: 15,
    shares: 4,
    isLiked: false,
    isDisliked: false,
    isJoined: false,
    isSaved: false,
  },
  {
    id: 'post_ai',
    community: 'r/AI_Agents',
    communityIcon: '🤖',
    isVerified: false,
    authorName: 'agent_architect',
    time: '2h ago',
    recommendationReason: 'Trending in Technology',
    title: 'How would you build an AI agent from zero as a beginner?',
    type: 'text',
    bodyText: 'I want to build an autonomous agent using LLMs and tools. What frameworks (LangChain, LlamaIndex, AutoGen, or raw API) do you recommend for starting out?',
    likes: 149,
    commentsCount: 122,
    shares: 28,
    isLiked: false,
    isDisliked: false,
    isJoined: true,
    isSaved: false,
  },
  {
    id: 'post_sideproject',
    community: 'r/SideProject',
    communityIcon: '🚀',
    isVerified: false,
    authorName: 'founder_guy',
    time: '5h ago',
    recommendationReason: 'Popular in Startups',
    title: 'I built a platform where people post their problems and founders find what to build next.',
    type: 'image',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1000&auto=format&fit=crop&q=80',
    likes: 312,
    commentsCount: 45,
    shares: 19,
    isLiked: false,
    isDisliked: false,
    isJoined: false,
    isSaved: false,
  },
];

const recentPostsList = [
  {
    id: 'rec_1',
    community: 'r/AI_Agents',
    communityIcon: '🤖',
    time: '2mo ago',
    title: 'How would you build an AI agent from zero as a beginner?',
    upvotes: '149 upvotes',
    comments: '122 comments',
  },
  {
    id: 'rec_2',
    community: 'r/SideProject',
    communityIcon: '🚀',
    time: '2mo ago',
    title: 'I built a platform where people post their problems and founders find what to...',
    upvotes: '2 upvotes',
    comments: '10 comments',
  },
  {
    id: 'rec_3',
    community: 'r/apps',
    communityIcon: '📱',
    time: '2mo ago',
    title: 'The universal subreddit for anything application related.',
    upvotes: '54K Weekly visitors',
    comments: '878 Weekly contributions',
    isFeaturedCard: true,
  },
  {
    id: 'rec_4',
    community: 'r/PathOfBaa',
    communityIcon: '⚔️',
    time: '2mo ago',
    title: 'Help me build this Inn',
    upvotes: '12 upvotes',
    comments: '10 comments',
  },
];

const gamesList = [
  { id: 'g1', name: 'Slingblade', tag: 'NEW', desc: 'Reach the top!', color: 'bg-gradient-to-r from-blue-600 to-indigo-600' },
  { id: 'g2', name: 'Bonyard', icon: TargetIcon },
  { id: 'g3', name: '4 Pics 1 Word', icon: Layers },
  { id: 'g4', name: 'Sword & Supper', icon: Trophy },
  { id: 'g5', name: 'Discover More', icon: Gamepad2 },
];

function TargetIcon(props) {
  return <Cpu {...props} />;
}

// ── Reddit Video Player Component ─────────────────────────
function RedditVideoPlayer({ poster, subtitle, videoUrl }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="relative bg-black rounded-2xl overflow-hidden group shadow-lg my-3 w-full flex flex-col items-center justify-center min-h-[380px] max-h-[560px]">
      {/* Meme Subtitle Header inside video frame */}
      <div className="absolute top-4 inset-x-4 z-20 text-center">
        <span className="bg-black/80 text-white font-black text-sm md:text-base px-4 py-2 rounded-xl border border-white/10 shadow-2xl inline-block max-w-md uppercase tracking-wide leading-tight">
          {subtitle || "How E block students be moving to reach AB1 at crisp 8am"}
        </span>
      </div>

      {/* Video / Poster Content */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden py-12">
        <img
          src={poster || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000&auto=format&fit=crop&q=80"}
          alt="Video preview"
          className="max-h-[460px] w-auto object-contain transition-transform duration-300 group-hover:scale-[1.01]"
        />
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-orange-600 transition-all cursor-pointer backdrop-blur-sm shadow-2xl"
          >
            {isPlaying ? (
              <span className="text-xl font-bold">❚❚</span>
            ) : (
              <span className="text-2xl font-bold ml-1">▶</span>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Video Controls Overlay (Exact Reddit format) */}
      <div className="w-full bg-black/90 px-4 py-2.5 flex items-center justify-between text-white text-xs font-mono z-20 border-t border-white/10">
        <button className="text-gray-300 hover:text-white transition-colors cursor-pointer">
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Progress Bar */}
        <div className="flex-1 mx-4 h-1.5 bg-gray-800 rounded-full overflow-hidden relative cursor-pointer">
          <div className="w-3/4 h-full bg-white rounded-full" />
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold text-gray-300">
          <span>0:06 / 0:06</span>
          <span className="px-1.5 py-0.5 border border-gray-600 rounded text-[10px] font-bold text-gray-200">CC</span>
          <button className="hover:text-white transition-colors cursor-pointer"><Settings className="w-4 h-4" /></button>
          <button className="hover:text-white transition-colors cursor-pointer"><Maximize2 className="w-4 h-4" /></button>
          <button onClick={() => setIsMuted(!isMuted)} className="hover:text-white transition-colors cursor-pointer">
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Reddit Post Card Component ─────────────────────────────
function RedditPostCard({ post, onLike, onDislike, onReport, activeReportPostId, setActiveReportPostId }) {
  const [joined, setJoined] = useState(post.isJoined);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl hover:border-gray-300 transition-all mb-4 p-4 md:p-5 shadow-xs">
      {/* 1. Subreddit Header Bar */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Subreddit Avatar */}
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold border border-gray-200">
            {post.communityIcon || '🌱'}
          </div>
          <span className="font-extrabold text-gray-900 hover:underline cursor-pointer">
            {post.community}
          </span>
          {post.isVerified && (
            <span className="text-amber-500 font-bold text-xs" title="Verified Subreddit">★</span>
          )}
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

      {/* 2. Post Title */}
      <h2 className="text-base md:text-lg font-bold text-gray-900 mb-2 leading-snug cursor-pointer hover:text-orange-600 transition-colors">
        {post.title}
      </h2>

      {/* 3. Post Content (Video / Image / Text) */}
      {post.type === 'video' && (
        <RedditVideoPlayer poster={post.videoPoster} subtitle={post.subtitle} videoUrl={post.videoUrl} />
      )}

      {post.type === 'image' && post.image && (
        <div className="my-3 rounded-2xl overflow-hidden bg-black/5 border border-gray-100 max-h-[520px] flex items-center justify-center cursor-pointer">
          <img src={post.image} alt="Post content" className="w-full object-cover max-h-[520px] hover:scale-[1.005] transition-transform duration-300" />
        </div>
      )}

      {post.type === 'text' && post.bodyText && (
        <p className="text-sm text-gray-700 leading-relaxed my-2">
          {post.bodyText}
        </p>
      )}

      {/* 4. Bottom Action Bar (Reddit Pill Buttons) */}
      <div className="flex items-center gap-2 flex-wrap mt-3 select-none">
        {/* Vote Pill */}
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

        {/* Comments Pill */}
        <button className="flex items-center gap-1.5 h-8 px-3 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-bold text-gray-700 transition-colors cursor-pointer">
          <MessageCircle className="w-4 h-4 text-gray-500" />
          <span>{post.commentsCount}</span>
        </button>

        {/* Crosspost / Repost Pill */}
        <button className="flex items-center gap-1.5 h-8 px-3 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-bold text-gray-700 transition-colors cursor-pointer">
          <Repeat className="w-3.5 h-3.5 text-gray-500" />
        </button>

        {/* Share Pill */}
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

      {/* ══════════ TOP HEADER (REDDIT DESIGN) ══════════ */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 h-14 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Navigation Drawer Toggle */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
            <span className="text-lg text-gray-700 font-black">☰</span>
          </button>
          
          <div className="flex items-center gap-1.5 cursor-pointer select-none">
            {/* Reddit Mascot Orange Circle Icon */}
            <div className="w-8 h-8 rounded-full bg-[#FF4500] flex items-center justify-center text-white shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" fill="#FF4500" />
                <circle cx="12" cy="12" r="7" fill="white" />
                <circle cx="9" cy="11" r="1.5" fill="#FF4500" />
                <circle cx="15" cy="11" r="1.5" fill="#FF4500" />
                <path d="M9 15c1.5 1 4.5 1 6 0" stroke="#FF4500" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            <span className="text-xl font-black tracking-tight text-[#FF4500]">
              reddit
            </span>
          </div>
        </div>

        {/* Center: Search Bar with "✦ Ask" button */}
        <div className="flex-1 max-w-xl mx-auto relative">
          <div className="w-full h-10 border border-gray-200 hover:border-orange-300 focus-within:border-orange-500 rounded-full bg-white flex items-center px-3 gap-2 transition-all shadow-2xs">
            <div className="w-6 h-6 rounded-full bg-[#FF4500] text-white flex items-center justify-center text-[10px] font-bold">
              r/
            </div>
            <input
              type="text"
              placeholder="Find anything"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400 font-medium"
            />
            <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs px-3 py-1 rounded-full flex items-center gap-1 cursor-pointer shadow-xs transition-all flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
              Ask
            </button>
          </div>
        </div>

        {/* Right: Header Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button title="Advertise" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-700 cursor-pointer">
            <span className="text-xs font-black border border-gray-700 px-1 rounded">AD</span>
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
            <span className="absolute top-1 right-1 bg-orange-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
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
                  <p className="text-xs font-bold text-gray-900">{currentUser?.name || 'Reddit User'}</p>
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

      {/* ══════════ MAIN BODY (3 COLUMNS) ══════════ */}
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
                {/* Slingblade Featured Banner */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-3 shadow-sm cursor-pointer hover:opacity-95 transition-opacity">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black tracking-wide">Slingblade</span>
                    <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase">NEW</span>
                  </div>
                  <p className="text-[11px] text-blue-100 mt-0.5">Reach the top!</p>
                </div>

                {['Bonyard', '4 Pics 1 Word', 'Sword & Supper', 'Discover More'].map(name => (
                  <button key={name} className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 rounded-xl cursor-pointer">
                    <Gamepad2 className="w-4 h-4 text-gray-500" />
                    <span>{name}</span>
                  </button>
                ))}
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
              <RedditPostCard
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

        {/* ── RIGHT SIDEBAR ─────────────────────── */}
        <aside className="w-80 p-4 border-l border-gray-200 hidden xl:block sticky top-14 self-start h-[calc(100vh-3.5rem)] overflow-y-auto no-scrollbar space-y-4">
          
          {/* Recent Posts Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">RECENT POSTS</h3>
            <button className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">Clear</button>
          </div>

          {/* Recent Posts List */}
          <div className="space-y-3">
            {recentPostsList.map((item) => (
              <React.Fragment key={item.id}>
                {item.isFeaturedCard ? (
                  /* Floating Popover Subreddit Preview Card for r/apps (Exact screenshot match!) */
                  <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xl space-y-3 relative border-l-4 border-l-red-500">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-red-600 text-white font-black flex items-center justify-center text-xs">
                        r/
                      </div>
                      <span className="font-extrabold text-sm text-gray-900">r/apps</span>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed font-medium">
                      {item.title}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-xs">
                      <div>
                        <p className="font-extrabold text-gray-900">54K</p>
                        <p className="text-[10px] text-gray-400">Weekly visitors</p>
                      </div>
                      <div>
                        <p className="font-extrabold text-gray-900">878</p>
                        <p className="text-[10px] text-gray-400">Weekly contributions</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-2 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                      <span className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[9px]">{item.communityIcon}</span>
                      <span className="font-bold text-gray-800">{item.community}</span>
                      <span>•</span>
                      <span>{item.time}</span>
                    </div>
                    <p className="text-xs font-bold text-gray-900 leading-snug hover:text-orange-600 transition-colors line-clamp-2">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium">
                      {item.upvotes} • {item.comments}
                    </p>
                  </div>
                )}
              </React.Fragment>
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
              <h3 className="text-base font-black text-gray-900">Log out of Reddit?</h3>
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
