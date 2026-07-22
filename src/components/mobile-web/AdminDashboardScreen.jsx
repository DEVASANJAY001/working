import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  FileText,
  AlertTriangle,
  Megaphone,
  TrendingUp,
  Trash2,
  UserX,
  UserCheck,
  Plus,
  Eye,
  CheckCircle,
  LogOut,
  Sparkles,
  Image as ImageIcon,
  Link as LinkIcon,
  ExternalLink,
  Search,
  Filter,
  BarChart3,
  Flame,
  ArrowRight,
  Pin,
  RefreshCw,
  Sun,
  Moon
} from 'lucide-react';
import { adminStore } from '../../services/adminStore';

export default function AdminDashboardScreen({ onLogout, onGoToFeed, currentUser }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'announcement' | 'users' | 'moderation' | 'trending' | 'ads'

  // Data states
  const [announcement, setAnnouncement] = useState(adminStore.getAnnouncement());
  const [ads, setAds] = useState(adminStore.getAds());
  const [bannedUsers, setBannedUsers] = useState(adminStore.getBannedUsers());
  const [reportedPosts, setReportedPosts] = useState(adminStore.getReportedPosts());
  const [deletedPostIds, setDeletedPostIds] = useState(adminStore.getDeletedPostIds());

  // Form states
  const [annTitle, setAnnTitle] = useState(announcement?.title || '');
  const [annText, setAnnText] = useState(announcement?.text || '');
  const [annImage, setAnnImage] = useState(announcement?.image || '');
  const [annSuccessMsg, setAnnSuccessMsg] = useState('');

  const [adTitle, setAdTitle] = useState('');
  const [adSponsor, setAdSponsor] = useState('');
  const [adImage, setAdImage] = useState('');
  const [adTargetUrl, setAdTargetUrl] = useState('');
  const [adSuccessMsg, setAdSuccessMsg] = useState('');

  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Sample Registered Users
  const [allUsers, setAllUsers] = useState([
    { id: 'usr_1', name: 'Nicole Edison', email: 'nicole@example.com', role: 'User', joined: 'May 12, 2026', posts: 14, reports: 0 },
    { id: 'usr_2', name: 'Algar Tech', email: 'contact@algartech.io', role: 'Developer', joined: 'Apr 02, 2026', posts: 28, reports: 1 },
    { id: 'usr_3', name: 'Crypto Daily Alerts', email: 'spammer_bot@crypto.org', role: 'User', joined: 'Jul 19, 2026', posts: 45, reports: 12 },
    { id: 'usr_4', name: 'Green India Initiative', email: 'ngo@greenindia.org', role: 'Verified NGO', joined: 'Jan 15, 2026', posts: 62, reports: 0 },
    { id: 'usr_5', name: 'Alex Harrison', email: 'alex.h@gmail.com', role: 'User', joined: 'Jun 28, 2026', posts: 8, reports: 0 },
  ]);

  // Sample Trending Posts
  const trendingPosts = [
    {
      id: 'post_1',
      author: 'British Ecological',
      text: 'Introducing our groundbreaking technology for wind turbines harness nature efficiently.',
      likes: 784,
      comments: 14,
      shares: 160,
      engagement: '98%'
    },
    {
      id: 'post_3',
      author: 'Nicole Edison',
      text: 'Just finished an amazing photoshoot for our new eco-friendly product line! 📸🌿',
      likes: 412,
      comments: 38,
      shares: 95,
      engagement: '89%'
    },
    {
      id: 'post_2',
      author: 'Tech World',
      text: 'BREAKING: New AI model achieves 98% accuracy in solving real-world problems.',
      likes: 128,
      comments: 24,
      shares: 89,
      engagement: '76%'
    }
  ];

  // Refresh stored state
  const refreshData = () => {
    setAnnouncement(adminStore.getAnnouncement());
    setAds(adminStore.getAds());
    setBannedUsers(adminStore.getBannedUsers());
    setReportedPosts(adminStore.getReportedPosts());
    setDeletedPostIds(adminStore.getDeletedPostIds());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Handlers for Announcement
  const handlePublishAnnouncement = (e) => {
    e.preventDefault();
    if (!annTitle.trim() || !annText.trim()) return;
    const updated = adminStore.setAnnouncement({
      title: annTitle,
      text: annText,
      image: annImage || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80"
    });
    setAnnouncement(updated);
    setAnnSuccessMsg('✨ Super User Pinned Announcement successfully updated! All users will see this post first.');
    setTimeout(() => setAnnSuccessMsg(''), 4000);
  };

  // Handlers for Ads
  const handleAddAd = (e) => {
    e.preventDefault();
    if (!adTitle.trim()) return;
    adminStore.addAd({
      title: adTitle,
      sponsor: adSponsor || "Sponsored Banner",
      image: adImage || "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80",
      targetUrl: adTargetUrl || "#"
    });
    setAds(adminStore.getAds());
    setAdTitle('');
    setAdSponsor('');
    setAdImage('');
    setAdTargetUrl('');
    setAdSuccessMsg('🚀 New Advertisement successfully created and published live on feed!');
    setTimeout(() => setAdSuccessMsg(''), 4000);
  };

  const handleToggleAd = (adId) => {
    const updated = adminStore.toggleAdStatus(adId);
    setAds(updated);
  };

  const handleDeleteAd = (adId) => {
    const updated = adminStore.deleteAd(adId);
    setAds(updated);
  };

  // Handlers for Users
  const handleToggleBanUser = (email) => {
    if (adminStore.isUserBanned(email)) {
      adminStore.unbanUser(email);
    } else {
      adminStore.banUser(email);
    }
    setBannedUsers(adminStore.getBannedUsers());
  };

  // Handlers for Content Moderation
  const handleDeleteReportedPost = (postId, reportId) => {
    adminStore.deletePost(postId);
    adminStore.dismissReport(reportId);
    setReportedPosts(adminStore.getReportedPosts());
    setDeletedPostIds(adminStore.getDeletedPostIds());
  };

  const handleDismissReport = (reportId) => {
    const updated = adminStore.dismissReport(reportId);
    setReportedPosts(updated);
  };

  const filteredUsers = allUsers.filter(u =>
    u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const themePageBg = isDarkMode ? "bg-[#121212] text-gray-100" : "bg-[#F6F7F8] text-gray-900";
  const themeHeaderBg = isDarkMode ? "bg-[#1C1C1E] border-[#2C2C2E] border-b" : "bg-white border-b border-gray-200";
  const themeHeaderTitle = isDarkMode ? "text-white" : "text-gray-900";
  const themeSubtext = isDarkMode ? "text-gray-400" : "text-gray-500";
  const themeCardBg = isDarkMode ? "bg-[#1C1C1E] border border-[#2C2C2E]" : "bg-white border border-gray-200 shadow-sm";
  const themeSubCardBg = isDarkMode ? "bg-[#2C2C2E]/60 border border-[#3C3C3E]" : "bg-gray-50 border border-gray-100";
  const themeInputBg = isDarkMode ? "bg-[#121212] border-gray-700 text-white" : "bg-white border border-gray-200 text-gray-900";
  const themeTableHeader = isDarkMode ? "bg-[#121212] text-gray-400 border-gray-800" : "bg-gray-50 text-gray-600 border-gray-200";

  // Secondary buttons: glass glossy for dark mode, normal border/light gray for light mode
  const themeBtnSecondary = isDarkMode
    ? "bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
    : "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300";

  return (
    <div className={`min-h-screen ${themePageBg} flex flex-col font-sans transition-colors duration-300 select-none`}>
      {/* ── Top Bar ── */}
      <header className={`${themeHeaderBg} sticky top-0 z-40 px-6 py-4 flex flex-wrap items-center justify-between gap-4 transition-colors`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-pink-500 to-orange-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`font-extrabold text-lg tracking-wide ${themeHeaderTitle}`}>Super User Console</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-500/20 text-violet-600 border border-violet-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-violet-500" /> Admin
              </span>
            </div>
            <p className={`text-xs ${themeSubtext}`}>Logged in as <span className="text-violet-600 font-bold">{currentUser?.email || "aadithya.davns@gmail.com"}</span></p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Light/Dark Toggle Switch */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2.5 rounded-xl transition-all cursor-pointer ${themeBtnSecondary}`}
            title="Toggle Light / Dark Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-violet-600" />}
          </button>

          <button
            onClick={onGoToFeed}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${themeBtnSecondary}`}
          >
            <Eye className="w-4 h-4 text-violet-500" /> See User View
          </button>

          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold transition-all flex items-center gap-2 border border-red-500/20 cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      {/* ── Main Layout ── */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 md:p-8 gap-8">
        {/* Sidebar Navigation */}
        <aside className={`${themeCardBg} w-full md:w-64 rounded-3xl p-4 flex flex-col justify-between shrink-0 transition-colors`}>
          <div className="space-y-1.5">
            <div className="px-3 py-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Management Modules
            </div>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'overview'
                  ? 'bg-gradient-to-r from-violet-600 to-orange-500 text-white shadow-lg shadow-violet-600/30'
                  : `${isDarkMode ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
                }`}
            >
              <BarChart3 className="w-4 h-4" /> Overview Dashboard
            </button>

            <button
              onClick={() => setActiveTab('announcement')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'announcement'
                  ? 'bg-gradient-to-r from-violet-600 to-orange-500 text-white shadow-lg shadow-violet-600/30'
                  : `${isDarkMode ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
                }`}
            >
              <Pin className="w-4 h-4" /> Pinned Super User Post
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer justify-between ${activeTab === 'users'
                  ? 'bg-gradient-to-r from-violet-600 to-orange-500 text-white shadow-lg shadow-violet-600/30'
                  : `${isDarkMode ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
                }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" /> User Management
              </div>
              {bannedUsers.length > 0 && (
                <span className="px-2 py-0.5 text-[10px] bg-red-500/20 text-red-500 rounded-full border border-red-500/30">
                  {bannedUsers.length} Banned
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('moderation')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer justify-between ${activeTab === 'moderation'
                  ? 'bg-gradient-to-r from-violet-600 to-orange-500 text-white shadow-lg shadow-violet-600/30'
                  : `${isDarkMode ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
                }`}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4" /> Reported Content
              </div>
              {reportedPosts.length > 0 && (
                <span className="px-2 py-0.5 text-[10px] bg-amber-500/20 text-amber-500 rounded-full border border-amber-500/30 font-extrabold">
                  {reportedPosts.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('trending')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'trending'
                  ? 'bg-gradient-to-r from-violet-600 to-orange-500 text-white shadow-lg shadow-violet-600/30'
                  : `${isDarkMode ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
                }`}
            >
              <Flame className="w-4 h-4 text-orange-500" /> Popular Posts
            </button>

            <button
              onClick={() => setActiveTab('ads')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer justify-between ${activeTab === 'ads'
                  ? 'bg-gradient-to-r from-violet-600 to-orange-500 text-white shadow-lg shadow-violet-600/30'
                  : `${isDarkMode ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
                }`}
            >
              <div className="flex items-center gap-3">
                <Megaphone className="w-4 h-4 text-emerald-500" /> Advertisements
              </div>
              <span className="px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-500 rounded-full border border-emerald-500/30 font-bold">
                {ads.filter(a => a.active).length} Active
              </span>
            </button>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-855">
            <div className="bg-gradient-to-br from-violet-500/10 to-orange-500/5 border border-violet-500/25 rounded-2xl p-3.5 text-center">
              <Sparkles className="w-5 h-5 text-violet-500 mx-auto mb-1.5 animate-pulse" />
              <p className="text-[11px] font-black">Super User Authority Active</p>
              <p className={`text-[10px] ${themeSubtext} mt-1`}>Full control over users, announcements, ads, and moderation.</p>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 space-y-6">
          {/* ── TAB 1: OVERVIEW DASHBOARD ── */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-gradient-to-r from-violet-600/25 via-pink-500/10 to-orange-500/5 border border-violet-500/30 rounded-3xl p-6 relative overflow-hidden">
                <div className="relative z-10 max-w-xl">
                  <h2 className="text-2xl font-black">Welcome back, Super User Aadithya 👋</h2>
                  <p className={`text-xs mt-2 leading-relaxed ${themeSubtext}`}>
                    You have total administration rights over the Inspire community web app. Monitor community health, handle reported posts, manage users, and post featured ads or pinned announcements.
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`${themeCardBg} rounded-3xl p-5 hover:border-violet-500/40 transition-all`}>
                  <div className={`flex items-center justify-between ${themeSubtext} mb-3`}>
                    <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
                    <div className="p-2 bg-violet-500/10 rounded-xl text-violet-500">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-black">{allUsers.length}</div>
                  <div className="text-[11px] text-emerald-500 mt-1 flex items-center gap-1 font-semibold">
                    <TrendingUp className="w-3.5 h-3.5" /> +24% this week
                  </div>
                </div>

                <div className={`${themeCardBg} rounded-3xl p-5 hover:border-violet-500/40 transition-all`}>
                  <div className={`flex items-center justify-between ${themeSubtext} mb-3`}>
                    <span className="text-xs font-bold uppercase tracking-wider">Reported Content</span>
                    <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-amber-500">{reportedPosts.length}</div>
                  <div className="text-[11px] text-amber-500 mt-1 font-semibold">
                    Requires admin action
                  </div>
                </div>

                <div className={`${themeCardBg} rounded-3xl p-5 hover:border-violet-500/40 transition-all`}>
                  <div className={`flex items-center justify-between ${themeSubtext} mb-3`}>
                    <span className="text-xs font-bold uppercase tracking-wider">Banned Users</span>
                    <div className="p-2 bg-red-500/10 rounded-xl text-red-500">
                      <UserX className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-red-500">{bannedUsers.length}</div>
                  <div className="text-[11px] text-red-500 mt-1 font-semibold">
                    Exploiters restricted
                  </div>
                </div>

                <div className={`${themeCardBg} rounded-3xl p-5 hover:border-violet-500/40 transition-all`}>
                  <div className={`flex items-center justify-between ${themeSubtext} mb-3`}>
                    <span className="text-xs font-bold uppercase tracking-wider">Active Ads</span>
                    <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                      <Megaphone className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-emerald-500">{ads.filter(a => a.active).length}</div>
                  <div className="text-[11px] text-emerald-500 mt-1 font-semibold">
                    Live banner campaigns
                  </div>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Active Super User Announcement Card */}
                <div className={`${themeCardBg} rounded-3xl p-6 space-y-4`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-sm flex items-center gap-2">
                      <Pin className="w-4 h-4 text-violet-500" /> Active Pinned Super User Post
                    </h3>
                    <button
                      onClick={() => setActiveTab('announcement')}
                      className="text-xs font-bold text-violet-500 hover:underline cursor-pointer"
                    >
                      Edit Pinned Post
                    </button>
                  </div>

                  {announcement ? (
                    <div className={`p-4 rounded-2xl ${themeSubCardBg} space-y-3`}>
                      <div className="flex items-center gap-2 text-xs font-bold text-violet-500">
                        <Sparkles className="w-3.5 h-3.5" /> Pinned at top of user feed
                      </div>
                      <h4 className="font-bold text-base">{announcement.title}</h4>
                      <p className={`text-xs ${themeSubtext} line-clamp-2`}>{announcement.text}</p>
                    </div>
                  ) : (
                    <p className={`text-xs ${themeSubtext} italic`}>No pinned announcement currently set.</p>
                  )}
                </div>

                {/* Moderation Queue Summary */}
                <div className={`${themeCardBg} rounded-3xl p-6 space-y-4`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-sm flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" /> Pending Moderation Reports
                    </h3>
                    <button
                      onClick={() => setActiveTab('moderation')}
                      className="text-xs font-bold text-amber-500 hover:underline cursor-pointer"
                    >
                      View All Reports
                    </button>
                  </div>

                  {reportedPosts.length > 0 ? (
                    <div className="space-y-2">
                      {reportedPosts.slice(0, 2).map((rep) => (
                        <div key={rep.id} className={`p-3 rounded-2xl ${themeSubCardBg} flex items-center justify-between`}>
                          <div>
                            <span className="text-xs font-bold">{rep.authorName}</span>
                            <p className="text-[11px] text-amber-500">{rep.reportReason} ({rep.reportsCount} reports)</p>
                          </div>
                          <button
                            onClick={() => handleDeleteReportedPost(rep.postId, rep.id)}
                            className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-500 text-xs font-bold border border-red-500/30 transition-all cursor-pointer"
                          >
                            Delete Post
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`p-4 rounded-2xl ${themeSubCardBg} text-center text-xs ${themeSubtext}`}>
                      No pending reports! Community content is clean.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 2: PINNED SUPER USER ANNOUNCEMENT ── */}
          {activeTab === 'announcement' && (
            <div className={`${themeCardBg} rounded-3xl p-6 md:p-8 space-y-6 animate-fade-in`}>
              <div>
                <h2 className="text-xl font-black flex items-center gap-2">
                  <Pin className="w-5 h-5 text-violet-500" /> Upload Super User Pinned Post
                </h2>
                <p className={`text-xs ${themeSubtext} mt-1`}>
                  This post will be permanently pinned at the top of every user's feed when they open the platform first.
                </p>
              </div>

              {annSuccessMsg && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs rounded-2xl font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{annSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handlePublishAnnouncement} className="space-y-4">
                <div className="space-y-1.5">
                  <label className={`block text-xs font-bold ${themeSubtext} uppercase tracking-wider`}>Announcement Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Welcome to Inspire Platform!"
                    value={annTitle}
                    onChange={e => setAnnTitle(e.target.value)}
                    className={`w-full py-3 px-4 border rounded-2xl ${themeInputBg} focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={`block text-xs font-bold ${themeSubtext} uppercase tracking-wider`}>Post Message / Body</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter full announcement details for all community members..."
                    value={annText}
                    onChange={e => setAnnText(e.target.value)}
                    className={`w-full py-3 px-4 border rounded-2xl ${themeInputBg} focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={`block text-xs font-bold ${themeSubtext} uppercase tracking-wider`}>Banner Image URL (Optional)</label>
                  <div className="relative">
                    <ImageIcon className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={annImage}
                      onChange={e => setAnnImage(e.target.value)}
                      className={`w-full py-3 pl-10 pr-4 border rounded-2xl ${themeInputBg} focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-12 rounded-2xl text-white font-bold text-sm bg-gradient-to-r from-violet-600 to-orange-500 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center shadow-lg shadow-violet-500/25 cursor-pointer mt-4"
                >
                  <Sparkles className="w-4 h-4 mr-2" /> Publish Super User Pinned Post
                </button>
              </form>
            </div>
          )}

          {/* ── TAB 3: USER MANAGEMENT & SAFETY ── */}
          {activeTab === 'users' && (
            <div className={`${themeCardBg} rounded-3xl p-6 md:p-8 space-y-6 animate-fade-in`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black flex items-center gap-2">
                    <Users className="w-5 h-5 text-violet-505" /> User Management & Platform Safety
                  </h2>
                  <p className={`text-xs ${themeSubtext} mt-1`}>
                    Super User authority to remove or ban users who exploit or violate platform rules.
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={userSearchQuery}
                    onChange={e => setUserSearchQuery(e.target.value)}
                    className={`w-full py-2 pl-9 pr-4 border rounded-xl ${themeInputBg} text-xs focus:outline-none focus:ring-2 focus:ring-violet-500`}
                  />
                </div>
              </div>

              {/* Users Table */}
              <div className={`overflow-x-auto rounded-2xl border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                <table className="w-full text-left text-xs">
                  <thead className={`${themeTableHeader} font-bold uppercase tracking-wider border-b`}>
                    <tr>
                      <th className="p-4">User</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Joined</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Super User Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/10 text-inherit">
                    {filteredUsers.map((user) => {
                      const isBanned = bannedUsers.includes(user.email.toLowerCase());
                      return (
                        <tr key={user.id} className={`${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'} transition-colors`}>
                          <td className="p-4">
                            <div className="font-bold">{user.name}</div>
                            <div className={`${themeSubtext} text-[11px]`}>{user.email}</div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-700'} border font-semibold`}>
                              {user.role}
                            </span>
                          </td>
                          <td className={`p-4 ${themeSubtext}`}>{user.joined}</td>
                          <td className="p-4">
                            {isBanned ? (
                              <span className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-500 border border-red-500/30 font-bold">
                                🚫 Banned
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 font-bold">
                                ✅ Active
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleToggleBanUser(user.email)}
                              className={`px-3 py-1.5 rounded-xl font-bold transition-all border cursor-pointer ${isBanned
                                  ? 'bg-emerald-500/20 text-emerald-555 border-emerald-500/30 hover:bg-emerald-500/30'
                                  : 'bg-red-500/20 text-red-500 border-red-500/30 hover:bg-red-500/30'
                                }`}
                            >
                              {isBanned ? (
                                <span className="flex items-center gap-1"><UserCheck className="w-3.5 h-3.5" /> Unban User</span>
                              ) : (
                                <span className="flex items-center gap-1"><UserX className="w-3.5 h-3.5" /> Ban User</span>
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── TAB 4: CONTENT MODERATION & REPORTED POSTS ── */}
          {activeTab === 'moderation' && (
            <div className={`${themeCardBg} rounded-3xl p-6 md:p-8 space-y-6 animate-fade-in`}>
              <div>
                <h2 className="text-xl font-black flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" /> Reported Posts & Content Moderation
                </h2>
                <p className={`text-xs ${themeSubtext} mt-1`}>
                  Inspect community report flags and delete non-compliant posts immediately.
                </p>
              </div>

              {reportedPosts.length === 0 ? (
                <div className={`p-12 text-center ${themeSubCardBg} rounded-3xl border border-gray-800/10 space-y-3`}>
                  <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
                  <h3 className="font-bold text-base">No Reported Posts</h3>
                  <p className={`text-xs ${themeSubtext}`}>All community posts are clean and compliant!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reportedPosts.map((report) => (
                    <div key={report.id} className={`p-5 ${themeSubCardBg} border border-amber-500/30 rounded-3xl space-y-3`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm">{report.authorName}</span>
                          <span className={`text-xs ${themeSubtext}`}>({report.authorHandle})</span>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-500 border border-amber-500/30 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> {report.reportsCount} Reports
                        </span>
                      </div>

                      <p className={`text-xs p-3 rounded-2xl ${themeInputBg} border italic`}>
                        "{report.text}"
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-850 text-xs">
                        <span className={themeSubtext}>Reason: <strong className="text-amber-505">{report.reportReason}</strong></span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDismissReport(report.id)}
                            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${themeBtnSecondary}`}
                          >
                            Dismiss Report
                          </button>
                          <button
                            onClick={() => handleDeleteReportedPost(report.postId, report.id)}
                            className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete Post
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TAB 5: POPULAR POSTS ── */}
          {activeTab === 'trending' && (
            <div className={`${themeCardBg} rounded-3xl p-6 md:p-8 space-y-6 animate-fade-in`}>
              <div>
                <h2 className="text-xl font-black flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-505" /> Popular & High-Engagement Posts
                </h2>
                <p className={`text-xs ${themeSubtext} mt-1`}>
                  View top performing content driving engagement across the platform.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {trendingPosts.map((post, idx) => (
                  <div key={post.id} className={`p-5 ${themeSubCardBg} rounded-3xl flex items-center justify-between gap-4 border ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-505 font-black flex items-center justify-center text-lg border border-orange-500/30">
                        #{idx + 1}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm">{post.author}</h4>
                        <p className={`text-xs ${themeSubtext} line-clamp-1 mt-0.5`}>{post.text}</p>
                        <div className="flex items-center gap-4 mt-2 text-[11px] text-gray-500 font-semibold">
                          <span>❤️ {post.likes} Likes</span>
                          <span>💬 {post.comments} Comments</span>
                          <span>🔄 {post.shares} Shares</span>
                        </div>
                      </div>
                    </div>

                    <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-500 font-extrabold rounded-xl border border-emerald-500/30 text-xs shrink-0">
                      {post.engagement} Score
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB 6: ADVERTISEMENT MANAGEMENT ── */}
          {activeTab === 'ads' && (
            <div className="space-y-6 animate-fade-in">
              {/* Form to Add Ad */}
              <div className={`${themeCardBg} rounded-3xl p-6 md:p-8 space-y-6`}>
                <div>
                  <h2 className="text-xl font-black flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-emerald-505" /> Upload Advertisement Campaign
                  </h2>
                  <p className={`text-xs ${themeSubtext} mt-1`}>
                    Super User feature to create and publish sponsored ad banners live into user feeds.
                  </p>
                </div>

                {adSuccessMsg && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs rounded-2xl font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{adSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleAddAd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={`block text-xs font-bold ${themeSubtext} uppercase tracking-wider`}>Ad Campaign Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Boost Your Creative Workflow"
                      value={adTitle}
                      onChange={e => setAdTitle(e.target.value)}
                      className={`w-full py-3 px-4 border rounded-2xl ${themeInputBg} focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`block text-xs font-bold ${themeSubtext} uppercase tracking-wider`}>Sponsor Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Inspire Network"
                      value={adSponsor}
                      onChange={e => setAdSponsor(e.target.value)}
                      className={`w-full py-3 px-4 border rounded-2xl ${themeInputBg} focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`block text-xs font-bold ${themeSubtext} uppercase tracking-wider`}>Banner Image URL</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={adImage}
                      onChange={e => setAdImage(e.target.value)}
                      className={`w-full py-3 px-4 border rounded-2xl ${themeInputBg} focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`block text-xs font-bold ${themeSubtext} uppercase tracking-wider`}>Target Link / URL</label>
                    <input
                      type="url"
                      placeholder="https://example.com/ad"
                      value={adTargetUrl}
                      onChange={e => setAdTargetUrl(e.target.value)}
                      className={`w-full py-3 px-4 border rounded-2xl ${themeInputBg} focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm`}
                    />
                  </div>

                  <div className="md:col-span-2 pt-2">
                    <button
                      type="submit"
                      className="w-full h-12 rounded-2xl text-white font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center shadow-lg shadow-emerald-500/20 cursor-pointer"
                    >
                      <Megaphone className="w-4 h-4 mr-2" /> Upload Live Advertisement Banner
                    </button>
                  </div>
                </form>
              </div>

              {/* Existing Campaigns List */}
              <div className={`${themeCardBg} rounded-3xl p-6 md:p-8 space-y-4`}>
                <h3 className="font-extrabold text-base">Active Advertisement Banners</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ads.map((ad) => (
                    <div key={ad.id} className={`p-4 ${themeSubCardBg} rounded-2xl space-y-3 flex flex-col justify-between border ${isDarkMode ? 'border-gray-800' : 'border-gray-150'}`}>
                      <div className="space-y-2">
                        <div className="h-32 rounded-xl overflow-hidden bg-gray-900 relative">
                          <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
                          <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur text-white text-[10px] font-extrabold rounded-md">
                            {ad.sponsor}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm">{ad.title}</h4>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-800/10 text-xs">
                        <span className={`${themeSubtext} font-semibold`}>{ad.clicks} Clicks</span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleAd(ad.id)}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${ad.active
                                ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30'
                                : `${isDarkMode ? 'bg-gray-800 text-gray-400 border border-gray-700' : 'bg-gray-150 text-gray-500 border border-gray-300'}`
                              }`}
                          >
                            {ad.active ? 'Active' : 'Paused'}
                          </button>

                          <button
                            onClick={() => handleDeleteAd(ad.id)}
                            className="p-1.5 rounded-xl bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/30 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
