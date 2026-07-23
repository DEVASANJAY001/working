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
  const [liveUsers, setLiveUsers] = useState(148);
  const [selectedUserEmails, setSelectedUserEmails] = useState([]);
  const [activeModUser, setActiveModUser] = useState(null);
  const [userFilterStatus, setUserFilterStatus] = useState('all');
  const [userFilterRole, setUserFilterRole] = useState('all');
  const [userWarnings, setUserWarnings] = useState({
    'spammer_bot@crypto.org': 4,
    'contact@algartech.io': 1
  });
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [moderatorNotes, setModeratorNotes] = useState({});
  const [escalationStatus, setEscalationStatus] = useState({});
  const [moderationHistory, setModerationHistory] = useState([
    { id: 'h_1', time: '10 mins ago', action: 'Dismissed spam flag', target: 'u/techworldindia' },
    { id: 'h_2', time: '1 hr ago', action: 'Deleted post & Banned user', target: 'spammer_bot@crypto.org' }
  ]);
  const [modFilterPriority, setModFilterPriority] = useState('all');
  const [rankingAlgorithm, setRankingAlgorithm] = useState('hot');
  const [boostedPosts, setBoostedPosts] = useState([]);
  const [lockedPosts, setLockedPosts] = useState([]);
  const [selectedTrendingPostId, setSelectedTrendingPostId] = useState(null);

  // Form states
  const [annTitle, setAnnTitle] = useState(announcement?.title || '');
  const [annText, setAnnText] = useState(announcement?.text || '');
  const [annImage, setAnnImage] = useState(announcement?.image || '');
  const [annSuccessMsg, setAnnSuccessMsg] = useState('');
  const [annTarget, setAnnTarget] = useState(announcement?.target || 'Entire Platform');
  const [annPriority, setAnnPriority] = useState(announcement?.priority || 'Standard');
  const [annStatus, setAnnStatus] = useState(announcement?.status || 'published');
  const [annScheduledTime, setAnnScheduledTime] = useState(announcement?.scheduledTime || '');
  const [annCommentsEnabled, setAnnCommentsEnabled] = useState(announcement?.commentsEnabled !== false);
  const [annLikesEnabled, setAnnLikesEnabled] = useState(announcement?.likesEnabled !== false);
  const [annBookmarksEnabled, setAnnBookmarksEnabled] = useState(announcement?.bookmarksEnabled !== false);
  const [annNotification, setAnnNotification] = useState(announcement?.notification || false);
  const [annExpiryDate, setAnnExpiryDate] = useState(announcement?.expiryDate || '');

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
    const ann = adminStore.getAnnouncement();
    setAnnouncement(ann);
    if (ann) {
      setAnnTitle(ann.title || '');
      setAnnText(ann.text || '');
      setAnnImage(ann.image || '');
      setAnnTarget(ann.target || 'Entire Platform');
      setAnnPriority(ann.priority || 'Standard');
      setAnnStatus(ann.status || 'published');
      setAnnScheduledTime(ann.scheduledTime || '');
      setAnnCommentsEnabled(ann.commentsEnabled !== false);
      setAnnLikesEnabled(ann.likesEnabled !== false);
      setAnnBookmarksEnabled(ann.bookmarksEnabled !== false);
      setAnnNotification(ann.notification || false);
      setAnnExpiryDate(ann.expiryDate || '');
    }
    setAds(adminStore.getAds());
    setBannedUsers(adminStore.getBannedUsers());
    setReportedPosts(adminStore.getReportedPosts());
    setDeletedPostIds(adminStore.getDeletedPostIds());
  };

  useEffect(() => {
    refreshData();

    // Subscribe to real-time events
    const unsubAnn = adminStore.subscribeAnnouncement(ann => setAnnouncement(ann));
    const unsubAds = adminStore.subscribeAds(updatedAds => setAds(updatedAds));
    const unsubBan = adminStore.subscribeBannedUsers(banned => setBannedUsers(banned));
    const unsubRep = adminStore.subscribeReports(reps => setReportedPosts(reps));
    const unsubDel = adminStore.subscribeDeletedPosts(ids => setDeletedPostIds(ids));

    // Fluctuate live users randomly
    const interval = setInterval(() => {
      setLiveUsers(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const next = prev + change;
        return next < 120 ? 120 : next > 180 ? 180 : next;
      });
    }, 3000);

    return () => {
      unsubAnn();
      unsubAds();
      unsubBan();
      unsubRep();
      unsubDel();
      clearInterval(interval);
    };
  }, []);

  // Handlers for Announcement
  const handlePublishAnnouncement = (e) => {
    e.preventDefault();
    if (!annTitle.trim() || !annText.trim()) return;
    const isPinned = annStatus === 'published';
    const updated = adminStore.setAnnouncement({
      title: annTitle,
      text: annText,
      image: annImage || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
      target: annTarget,
      priority: annPriority,
      status: annStatus,
      scheduledTime: annScheduledTime,
      commentsEnabled: annCommentsEnabled,
      likesEnabled: annLikesEnabled,
      bookmarksEnabled: annBookmarksEnabled,
      notification: annNotification,
      expiryDate: annExpiryDate,
      isPinned: isPinned
    });
    setAnnouncement(updated);
    setAnnSuccessMsg(`✨ Super User Announcement successfully saved in ${annStatus} status!`);
    setTimeout(() => setAnnSuccessMsg(''), 4000);
  };

  const handleDeleteAnnouncement = () => {
    adminStore.deleteAnnouncement();
    setAnnouncement(null);
    setAnnTitle('');
    setAnnText('');
    setAnnImage('');
    setAnnSuccessMsg('🗑️ Pinned Announcement successfully deleted/unpinned!');
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
              {/* Header Status Bar */}
              <div className="bg-gradient-to-r from-violet-600/25 via-pink-500/10 to-orange-500/5 border border-violet-500/30 rounded-3xl p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative z-10">
                  <h2 className="text-2xl font-black">Welcome back, Super User Aadithya 👋</h2>
                  <p className={`text-xs mt-2 leading-relaxed ${themeSubtext}`}>
                    You have total administration rights over the Inspire community web app. Monitor community health, handle reported posts, manage users, and post featured ads or pinned announcements.
                  </p>
                </div>
                {/* Live pulsing online widget */}
                <div className={`shrink-0 flex items-center gap-3 px-4 py-2.5 rounded-2xl ${themeSubCardBg} border border-emerald-500/20`}>
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <div>
                    <div className="text-sm font-black">{liveUsers} Online</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live Platform Session</div>
                  </div>
                </div>
              </div>

              {/* Core KPIs Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`${themeCardBg} rounded-3xl p-5 hover:border-violet-500/40 transition-all flex flex-col justify-between`}>
                  <div>
                    <div className={`flex items-center justify-between ${themeSubtext} mb-3`}>
                      <span className="text-[10px] font-black uppercase tracking-wider">Total Registrations</span>
                      <div className="p-2 bg-violet-500/10 rounded-xl text-violet-500">
                        <Users className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-3xl font-black">{allUsers.length}</div>
                  </div>
                  <div className="text-[10px] text-emerald-500 mt-3 flex items-center gap-1 font-bold">
                    <TrendingUp className="w-3.5 h-3.5" /> +24% Growth MoM
                  </div>
                </div>

                <div className={`${themeCardBg} rounded-3xl p-5 hover:border-violet-500/40 transition-all flex flex-col justify-between`}>
                  <div>
                    <div className={`flex items-center justify-between ${themeSubtext} mb-3`}>
                      <span className="text-[10px] font-black uppercase tracking-wider">Pending Moderation</span>
                      <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-amber-500">{reportedPosts.length}</div>
                  </div>
                  <div className="text-[10px] text-amber-500 mt-3 font-bold">
                    {reportedPosts.length > 0 ? "⚠️ Requires immediate review" : "✓ Content clean"}
                  </div>
                </div>

                <div className={`${themeCardBg} rounded-3xl p-5 hover:border-violet-500/40 transition-all flex flex-col justify-between`}>
                  <div>
                    <div className={`flex items-center justify-between ${themeSubtext} mb-3`}>
                      <span className="text-[10px] font-black uppercase tracking-wider">Banned Exploiters</span>
                      <div className="p-2 bg-red-500/10 rounded-xl text-red-500">
                        <UserX className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-red-500">{bannedUsers.length}</div>
                  </div>
                  <div className="text-[10px] text-red-500 mt-3 font-bold">
                    Restrictive policies active
                  </div>
                </div>

                <div className={`${themeCardBg} rounded-3xl p-5 hover:border-violet-500/40 transition-all flex flex-col justify-between`}>
                  <div>
                    <div className={`flex items-center justify-between ${themeSubtext} mb-3`}>
                      <span className="text-[10px] font-black uppercase tracking-wider">Active Campaigns</span>
                      <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                        <Megaphone className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-emerald-500">{ads.filter(a => a.active).length}</div>
                  </div>
                  <div className="text-[10px] text-emerald-500 mt-3 font-bold">
                    Sponsored impressions active
                  </div>
                </div>
              </div>

              {/* Analytics Graphs Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Line Chart: Engagement Trends */}
                <div className={`${themeCardBg} rounded-3xl p-5 space-y-4`}>
                  <div>
                    <h3 className="font-extrabold text-xs uppercase tracking-wider">Platform Daily Engagement</h3>
                    <p className={`text-[10px] ${themeSubtext}`}>Submissions & reactions trend (7d)</p>
                  </div>
                  <div className="h-32 flex items-end">
                    <svg viewBox="0 0 300 120" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {/* Grid lines */}
                      <line x1="0" y1="30" x2="300" y2="30" stroke="#E5E7EB" strokeDasharray="3 3" />
                      <line x1="0" y1="70" x2="300" y2="70" stroke="#E5E7EB" strokeDasharray="3 3" />
                      <line x1="0" y1="100" x2="300" y2="100" stroke="#E5E7EB" />
                      
                      {/* Gradient Fill under Path */}
                      <path
                        d="M 10 90 Q 60 70 110 50 T 210 20 T 290 10 L 290 100 L 10 100 Z"
                        fill="url(#lineGrad)"
                      />
                      {/* Line Path */}
                      <path
                        d="M 10 90 Q 60 70 110 50 T 210 20 T 290 10"
                        fill="none"
                        stroke="#8B5CF6"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      {/* Spark dots */}
                      <circle cx="290" cy="10" r="4" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="2.5" />
                    </svg>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider px-1">
                    <span>Mon</span>
                    <span>Wed</span>
                    <span>Fri</span>
                    <span>Today</span>
                  </div>
                </div>

                {/* Bar Chart: Community Health */}
                <div className={`${themeCardBg} rounded-3xl p-5 space-y-4`}>
                  <div>
                    <h3 className="font-extrabold text-xs uppercase tracking-wider">Top Communities Activity</h3>
                    <p className={`text-[10px] ${themeSubtext}`}>Posts & active members index</p>
                  </div>
                  <div className="h-32 flex items-end">
                    <svg viewBox="0 0 300 120" className="w-full h-full">
                      {/* Grid lines */}
                      <line x1="0" y1="30" x2="300" y2="30" stroke="#E5E7EB" strokeDasharray="3 3" />
                      <line x1="0" y1="70" x2="300" y2="70" stroke="#E5E7EB" strokeDasharray="3 3" />
                      <line x1="0" y1="100" x2="300" y2="100" stroke="#E5E7EB" />
                      
                      {/* Bars */}
                      <rect x="25" y="20" width="22" height="80" rx="3" fill="#8B5CF6" />
                      <rect x="95" y="45" width="22" height="55" rx="3" fill="#EC4899" />
                      <rect x="165" y="10" width="22" height="90" rx="3" fill="#F97316" />
                      <rect x="235" y="60" width="22" height="40" rx="3" fill="#10B981" />
                    </svg>
                  </div>
                  <div className="flex justify-between text-[9px] text-gray-400 font-extrabold uppercase tracking-wider px-1">
                    <span className="truncate max-w-[50px]">CarsIndia</span>
                    <span className="truncate max-w-[50px]">ipl</span>
                    <span className="truncate max-w-[50px]">AI_Agents</span>
                    <span className="truncate max-w-[50px]">SideProj</span>
                  </div>
                </div>

                {/* Donut Chart: Report Categories */}
                <div className={`${themeCardBg} rounded-3xl p-5 space-y-4`}>
                  <div>
                    <h3 className="font-extrabold text-xs uppercase tracking-wider">Report Frequency Breakdown</h3>
                    <p className={`text-[10px] ${themeSubtext}`}>Common violation segments</p>
                  </div>
                  <div className="flex items-center justify-around h-32">
                    <svg viewBox="0 0 100 100" className="w-24 h-24 transform -rotate-90">
                      <circle cx="50" cy="50" r="35" fill="transparent" stroke="#F3F4F6" strokeWidth="12" />
                      {/* Spam: 45% (dasharray: 2 * pi * 35 = 220. => 45% = 99) */}
                      <circle cx="50" cy="50" r="35" fill="transparent" stroke="#8B5CF6" strokeWidth="12"
                              strokeDasharray="99 121" strokeDashoffset="0" />
                      {/* Scams: 30% (= 66) */}
                      <circle cx="50" cy="50" r="35" fill="transparent" stroke="#F97316" strokeWidth="12"
                              strokeDasharray="66 154" strokeDashoffset="-99" />
                      {/* Harassment: 25% (= 55) */}
                      <circle cx="50" cy="50" r="35" fill="transparent" stroke="#EF4444" strokeWidth="12"
                              strokeDasharray="55 165" strokeDashoffset="-165" />
                    </svg>
                    <div className="space-y-1.5 text-[9px] font-bold uppercase tracking-wider">
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-[#8B5CF6] rounded-full shrink-0"></span><span>Spam (45%)</span></div>
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-[#F97316] rounded-full shrink-0"></span><span>Scams (30%)</span></div>
                      <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-[#EF4444] rounded-full shrink-0"></span><span>Abuse (25%)</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions & Moderation Summaries */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Active Announcement Status */}
                <div className={`${themeCardBg} rounded-3xl p-6 space-y-4`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-sm flex items-center gap-2">
                      <Pin className="w-4 h-4 text-violet-500" /> Active Platform Pinned Announcement
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
                      <h4 className="font-bold text-sm">{announcement.title}</h4>
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
                      <AlertTriangle className="w-4 h-4 text-amber-500" /> High-Priority Content Reports
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

              {/* Operational Alerts Center */}
              <div className={`${themeCardBg} rounded-3xl p-5 space-y-3`}>
                <h3 className="text-xs font-black uppercase tracking-wider">System & Operational Alerts</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600">
                    <span className="mt-0.5 font-bold shrink-0">⚠️ SYSTEM:</span>
                    <span>High spam threshold reached in <strong>r/ipl</strong>. Rate limiting rules triggered automatically.</span>
                  </div>
                  <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-xs text-violet-600">
                    <span className="mt-0.5 font-bold shrink-0">⚡ CAMPAIGN:</span>
                    <span>Sponsored campaign <strong>"Boost Your Creative Workflow with Inspire Pro"</strong> reached 1,000+ clicks today.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'announcement' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
              {/* Left Column: Announcement Builder (2 cols span) */}
              <div className={`${themeCardBg} rounded-3xl p-6 md:p-8 space-y-6 lg:col-span-2`}>
                <div>
                  <h2 className="text-xl font-black flex items-center gap-2">
                    <Pin className="w-5 h-5 text-violet-500" /> Platform Announcement Builder
                  </h2>
                  <p className={`text-xs ${themeSubtext} mt-1`}>
                    Design, draft, schedule, or publish announcements targeted to specific audiences with custom engagement controls.
                  </p>
                </div>

                {annSuccessMsg && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs rounded-2xl font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{annSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handlePublishAnnouncement} className="space-y-4">
                  {/* Title & Body */}
                  <div className="space-y-1.5">
                    <label className={`block text-[10px] font-black ${themeSubtext} uppercase tracking-wider`}>Announcement Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Welcome to the Official Inspire Community!"
                      value={annTitle}
                      onChange={e => setAnnTitle(e.target.value)}
                      className={`w-full py-3 px-4 border rounded-2xl ${themeInputBg} focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`block text-[10px] font-black ${themeSubtext} uppercase tracking-wider`}>Post Body / Message</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Enter the announcement copy details..."
                      value={annText}
                      onChange={e => setAnnText(e.target.value)}
                      className={`w-full py-3 px-4 border rounded-2xl ${themeInputBg} focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm`}
                    />
                  </div>

                  {/* Banner Image */}
                  <div className="space-y-1.5">
                    <label className={`block text-[10px] font-black ${themeSubtext} uppercase tracking-wider`}>Banner Image URL (Optional)</label>
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

                  {/* Targeting & Priority */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={`block text-[10px] font-black ${themeSubtext} uppercase tracking-wider`}>Target Audience</label>
                      <select
                        value={annTarget}
                        onChange={e => setAnnTarget(e.target.value)}
                        className={`w-full py-3 px-4 border rounded-2xl ${themeInputBg} focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm`}
                      >
                        <option value="Entire Platform">Entire Platform</option>
                        <option value="CarsIndia">CarsIndia Community Only</option>
                        <option value="ipl">ipl Community Only</option>
                        <option value="AI_Agents">AI_Agents Community Only</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className={`block text-[10px] font-black ${themeSubtext} uppercase tracking-wider`}>Priority / Banner Level</label>
                      <select
                        value={annPriority}
                        onChange={e => setAnnPriority(e.target.value)}
                        className={`w-full py-3 px-4 border rounded-2xl ${themeInputBg} focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm`}
                      >
                        <option value="Standard">Standard Priority</option>
                        <option value="Urgent">Urgent Priority (Red Banner)</option>
                      </select>
                    </div>
                  </div>

                  {/* Status & Schedule Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={`block text-[10px] font-black ${themeSubtext} uppercase tracking-wider`}>Publish Status</label>
                      <select
                        value={annStatus}
                        onChange={e => setAnnStatus(e.target.value)}
                        className={`w-full py-3 px-4 border rounded-2xl ${themeInputBg} focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm`}
                      >
                        <option value="published">Publish Immediately (Live)</option>
                        <option value="draft">Save as Draft</option>
                        <option value="scheduled">Schedule for Future</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className={`block text-[10px] font-black ${themeSubtext} uppercase tracking-wider`}>Scheduled Date/Time or Expiry</label>
                      <input
                        type="datetime-local"
                        value={annScheduledTime || annExpiryDate}
                        onChange={e => {
                          if (annStatus === 'scheduled') {
                            setAnnScheduledTime(e.target.value);
                          } else {
                            setAnnExpiryDate(e.target.value);
                          }
                        }}
                        disabled={annStatus === 'draft'}
                        className={`w-full py-2.5 px-4 border rounded-2xl ${themeInputBg} focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm`}
                      />
                    </div>
                  </div>

                  {/* Engagement Interaction Toggles */}
                  <div className="space-y-3 pt-2">
                    <label className={`block text-[10px] font-black ${themeSubtext} uppercase tracking-wider`}>User Interaction Controls</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={annCommentsEnabled}
                          onChange={e => setAnnCommentsEnabled(e.target.checked)}
                          className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500"
                        />
                        <span>Enable user comments & replies</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={annLikesEnabled}
                          onChange={e => setAnnLikesEnabled(e.target.checked)}
                          className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500"
                        />
                        <span>Allow feed upvoting/likes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={annBookmarksEnabled}
                          onChange={e => setAnnBookmarksEnabled(e.target.checked)}
                          className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500"
                        />
                        <span>Allow saving to bookmarks</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={annNotification}
                          onChange={e => setAnnNotification(e.target.checked)}
                          className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500"
                        />
                        <span className="text-violet-600">Dispatch Push notification on save</span>
                      </label>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-2">
                    <button
                      type="submit"
                      className="flex-1 h-12 rounded-2xl text-white font-bold text-sm bg-gradient-to-r from-violet-600 to-orange-500 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center shadow-lg shadow-violet-500/25 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 mr-2" /> Save Announcement Settings
                    </button>
                    {announcement && (
                      <button
                        type="button"
                        onClick={handleDeleteAnnouncement}
                        className="px-5 h-12 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 font-bold text-sm transition-all cursor-pointer"
                      >
                        Unpin / Delete
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Right Column: Announcement Settings & Analytics */}
              <div className="space-y-6">
                {/* Active Announcement Preview & Analytics */}
                <div className={`${themeCardBg} rounded-3xl p-6 space-y-4`}>
                  <h3 className="text-xs font-black uppercase tracking-wider">Announcement Analytics</h3>
                  {announcement ? (
                    <div className="space-y-4">
                      <div className={`p-4 rounded-2xl ${themeSubCardBg} space-y-3`}>
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-violet-500/20 text-violet-600 border border-violet-500/30">
                            {announcement.status || 'Active'}
                          </span>
                          <span className="text-[10px] text-gray-400 font-bold">
                            {announcement.target || 'Entire Platform'}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm">{announcement.title}</h4>
                      </div>

                      {/* Performance Grid */}
                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div className={`p-3 rounded-2xl ${themeSubCardBg}`}>
                          <div className="text-lg font-black text-violet-600">{announcement.likes || 1240}</div>
                          <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Total Likes</div>
                        </div>
                        <div className={`p-3 rounded-2xl ${themeSubCardBg}`}>
                          <div className="text-lg font-black text-pink-500">{announcement.commentsCount || 88}</div>
                          <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Comments</div>
                        </div>
                        <div className={`p-3 rounded-2xl ${themeSubCardBg}`}>
                          <div className="text-lg font-black text-orange-500">{announcement.shares || 310}</div>
                          <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Shares</div>
                        </div>
                        <div className={`p-3 rounded-2xl ${themeSubCardBg}`}>
                          <div className="text-lg font-black text-emerald-500">2.4k</div>
                          <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Views (Reach)</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={`p-5 rounded-2xl ${themeSubCardBg} text-center text-xs ${themeSubtext} italic`}>
                      No active platform announcement. Use the builder to publish one.
                    </div>
                  )}
                </div>

                {/* Platform Target Summary */}
                <div className={`${themeCardBg} rounded-3xl p-6 space-y-3`}>
                  <h3 className="text-xs font-black uppercase tracking-wider">Audience Targeting Stats</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-gray-400">Total Reach Potential</span>
                      <span className="font-bold">14,200 users</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-gray-400">CarsIndia Members</span>
                      <span className="font-bold">5,430 users</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-400">AI_Agents Members</span>
                      <span className="font-bold">2,110 users</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* ── TAB 3: USER MANAGEMENT & SAFETY ── */}
          {activeTab === 'users' && (() => {
            // Apply search & status/role filters dynamically
            const filteredAndSearchUsers = allUsers.filter(user => {
              const matchesSearch = user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(userSearchQuery.toLowerCase());
              
              const isBanned = bannedUsers.includes(user.email.toLowerCase());
              const matchesStatus = userFilterStatus === 'all' ||
                (userFilterStatus === 'banned' && isBanned) ||
                (userFilterStatus === 'active' && !isBanned);
                
              const matchesRole = userFilterRole === 'all' || user.role === userFilterRole;
              
              return matchesSearch && matchesStatus && matchesRole;
            });

            // Default activeModUser if not set
            const currentSelectedUser = activeModUser || filteredAndSearchUsers[0];

            // Bulk action handlers
            const handleSelectAll = (e) => {
              if (e.target.checked) {
                setSelectedUserEmails(filteredAndSearchUsers.map(u => u.email));
              } else {
                setSelectedUserEmails([]);
              }
            };

            const handleSelectRow = (email) => {
              setSelectedUserEmails(prev =>
                prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
              );
            };

            const handleBulkBan = () => {
              if (selectedUserEmails.length === 0) return;
              selectedUserEmails.forEach(email => adminStore.banUser(email));
              setBannedUsers(adminStore.getBannedUsers());
              setSelectedUserEmails([]);
              setAnnSuccessMsg(`🚫 Successfully banned ${selectedUserEmails.length} users in bulk.`);
              setTimeout(() => setAnnSuccessMsg(''), 4000);
            };

            const handleBulkWarn = () => {
              if (selectedUserEmails.length === 0) return;
              setUserWarnings(prev => {
                const next = { ...prev };
                selectedUserEmails.forEach(email => {
                  next[email] = (next[email] || 0) + 1;
                });
                return next;
              });
              setSelectedUserEmails([]);
              setAnnSuccessMsg(`⚠️ Issued warnings to ${selectedUserEmails.length} users in bulk.`);
              setTimeout(() => setAnnSuccessMsg(''), 4000);
            };

            const handleWarnUser = (email) => {
              setUserWarnings(prev => ({
                ...prev,
                [email]: (prev[email] || 0) + 1
              }));
            };

            const handlePromoteUser = (userId, newRole) => {
              setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
            };

            return (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                {/* Left Column: Moderation list table (2 cols span) */}
                <div className={`${themeCardBg} rounded-3xl p-6 space-y-4 lg:col-span-2`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-black flex items-center gap-2">
                        <Users className="w-5 h-5 text-violet-500" /> Trust & Safety Console
                      </h2>
                      <p className={`text-[11px] ${themeSubtext}`}>
                        Review registered user permissions, issue warning counts, suspend login access, or adjust authorization roles.
                      </p>
                    </div>

                    <div className="relative w-full sm:w-60">
                      <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={userSearchQuery}
                        onChange={e => setUserSearchQuery(e.target.value)}
                        className={`w-full py-2 pl-9 pr-4 border rounded-xl ${themeInputBg} text-xs focus:outline-none focus:ring-2 focus:ring-violet-500`}
                      />
                    </div>
                  </div>

                  {/* Filters Bar & Bulk Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
                    <div className="flex gap-2 items-center text-xs">
                      <span className="font-bold text-gray-400">Filters:</span>
                      <select
                        value={userFilterStatus}
                        onChange={e => setUserFilterStatus(e.target.value)}
                        className={`py-1 px-2 border rounded-lg ${themeInputBg} text-xs focus:outline-none`}
                      >
                        <option value="all">All Statuses</option>
                        <option value="active">Active Only</option>
                        <option value="banned">Banned Only</option>
                      </select>
                      <select
                        value={userFilterRole}
                        onChange={e => setUserFilterRole(e.target.value)}
                        className={`py-1 px-2 border rounded-lg ${themeInputBg} text-xs focus:outline-none`}
                      >
                        <option value="all">All Roles</option>
                        <option value="User">User</option>
                        <option value="Developer">Developer</option>
                        <option value="Verified NGO">Verified NGO</option>
                      </select>
                    </div>

                    {selectedUserEmails.length > 0 && (
                      <div className="flex gap-2">
                        <button
                          onClick={handleBulkBan}
                          className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 text-[10px] font-black uppercase tracking-wider cursor-pointer"
                        >
                          Bulk Ban ({selectedUserEmails.length})
                        </button>
                        <button
                          onClick={handleBulkWarn}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 text-[10px] font-black uppercase tracking-wider cursor-pointer"
                        >
                          Bulk Warn
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Table */}
                  <div className={`overflow-x-auto rounded-2xl border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                    <table className="w-full text-left text-[11px]">
                      <thead className={`${themeTableHeader} font-bold uppercase tracking-wider border-b`}>
                        <tr>
                          <th className="p-3 w-8">
                            <input
                              type="checkbox"
                              checked={selectedUserEmails.length === filteredAndSearchUsers.length && filteredAndSearchUsers.length > 0}
                              onChange={handleSelectAll}
                              className="rounded text-violet-600 focus:ring-violet-500 cursor-pointer"
                            />
                          </th>
                          <th className="p-3">User info</th>
                          <th className="p-3">Role settings</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Moderation Controls</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800/10 text-inherit">
                        {filteredAndSearchUsers.map((user) => {
                          const isBanned = bannedUsers.includes(user.email.toLowerCase());
                          const isSelected = selectedUserEmails.includes(user.email);
                          const warnings = userWarnings[user.email] || 0;

                          return (
                            <tr
                              key={user.id}
                              onClick={() => setActiveModUser(user)}
                              className={`transition-colors cursor-pointer ${
                                currentSelectedUser?.id === user.id
                                  ? (isDarkMode ? 'bg-white/5' : 'bg-gray-100')
                                  : (isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50')
                              }`}
                            >
                              <td className="p-3" onClick={e => e.stopPropagation()}>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleSelectRow(user.email)}
                                  className="rounded text-violet-600 focus:ring-violet-500 cursor-pointer"
                                />
                              </td>
                              <td className="p-3">
                                <div className="font-bold flex items-center gap-1">
                                  {user.name}
                                  {warnings >= 3 && (
                                    <span className="px-1.5 py-0.2 bg-red-500/10 text-red-500 text-[9px] rounded-full font-black uppercase">
                                      ⚠️ {warnings} warnings
                                    </span>
                                  )}
                                </div>
                                <div className={`${themeSubtext} text-[10px]`}>{user.email}</div>
                              </td>
                              <td className="p-3" onClick={e => e.stopPropagation()}>
                                <select
                                  value={user.role}
                                  onChange={e => handlePromoteUser(user.id, e.target.value)}
                                  className={`py-1 px-1.5 border rounded-lg ${themeInputBg} text-[10px] focus:outline-none font-semibold`}
                                >
                                  <option value="User">User</option>
                                  <option value="Developer">Developer</option>
                                  <option value="Verified NGO">Verified NGO</option>
                                  <option value="Admin">Admin</option>
                                </select>
                              </td>
                              <td className="p-3">
                                {isBanned ? (
                                  <span className="px-2 py-0.5 rounded-lg bg-red-500/20 text-red-500 border border-red-500/30 font-extrabold text-[10px]">
                                    Banned
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 font-extrabold text-[10px]">
                                    Active
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-right space-x-1.5" onClick={e => e.stopPropagation()}>
                                <button
                                  onClick={() => handleWarnUser(user.email)}
                                  className="px-2 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-500 text-[10px] font-bold border border-amber-500/20 cursor-pointer"
                                >
                                  Warn
                                </button>
                                <button
                                  onClick={() => handleToggleBanUser(user.email)}
                                  className={`px-2 py-1 rounded-xl text-[10px] font-bold border cursor-pointer ${
                                    isBanned
                                      ? 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-500 border-emerald-500/20'
                                      : 'bg-red-500/15 hover:bg-red-500/25 text-red-500 border-red-500/20'
                                  }`}
                                >
                                  {isBanned ? 'Unban' : 'Ban'}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Column: User details & Safety History Timeline */}
                <div className={`${themeCardBg} rounded-3xl p-5 space-y-4`}>
                  <h3 className="text-xs font-black uppercase tracking-wider">User Security Profile</h3>
                  {currentSelectedUser ? (
                    <div className="space-y-4 text-xs">
                      {/* Summary card */}
                      <div className={`p-4 rounded-2xl ${themeSubCardBg} space-y-2`}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-orange-500 flex items-center justify-center text-white font-extrabold text-sm shadow">
                            {currentSelectedUser.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-extrabold text-sm text-gray-900">{currentSelectedUser.name}</div>
                            <div className="text-[10px] text-gray-400">u/{currentSelectedUser.email.split('@')[0]}</div>
                          </div>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-800/10 text-[10px]">
                          <div>
                            <div className="text-gray-400 font-bold uppercase">Role</div>
                            <div className="font-black text-gray-800 mt-0.5">{currentSelectedUser.role}</div>
                          </div>
                          <div>
                            <div className="text-gray-400 font-bold uppercase">Warnings</div>
                            <div className="font-black text-amber-500 mt-0.5">{userWarnings[currentSelectedUser.email] || 0}</div>
                          </div>
                          <div>
                            <div className="text-gray-400 font-bold uppercase">Account Status</div>
                            <div className={`font-black mt-0.5 ${bannedUsers.includes(currentSelectedUser.email.toLowerCase()) ? 'text-red-500' : 'text-emerald-500'}`}>
                              {bannedUsers.includes(currentSelectedUser.email.toLowerCase()) ? 'Restricted' : 'Active'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Mock User activity statistics */}
                      <div className="space-y-2">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Platform Activity</div>
                        <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                          <div className={`p-2.5 rounded-xl ${themeSubCardBg}`}>
                            <div className="font-black text-sm text-violet-600">{currentSelectedUser.posts || 14}</div>
                            <div className="text-gray-400">Total Posts</div>
                          </div>
                          <div className={`p-2.5 rounded-xl ${themeSubCardBg}`}>
                            <div className="font-black text-sm text-pink-500">42</div>
                            <div className="text-gray-400">Comments</div>
                          </div>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="space-y-3">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Safety Log Timeline</div>
                        <div className="space-y-3 relative pl-3.5 border-l border-violet-500/30 text-[11px]">
                          <div className="relative">
                            <span className="absolute -left-[19.5px] top-1 w-2.5 h-2.5 bg-violet-600 rounded-full border-2 border-white shadow"></span>
                            <div className="font-bold text-gray-800">Account Created</div>
                            <div className="text-[10px] text-gray-400">{currentSelectedUser.joined}</div>
                          </div>
                          <div className="relative">
                            <span className="absolute -left-[19.5px] top-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white shadow"></span>
                            <div className="font-bold text-gray-800">Phone & Email Verified</div>
                            <div className="text-[10px] text-gray-400">Auto-completed on registration</div>
                          </div>
                          {userWarnings[currentSelectedUser.email] > 0 && (
                            <div className="relative">
                              <span className="absolute -left-[19.5px] top-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white shadow"></span>
                              <div className="font-bold text-amber-500">Official Warning Issued</div>
                              <div className="text-[10px] text-gray-400">System warnings count: {userWarnings[currentSelectedUser.email]}</div>
                            </div>
                          )}
                          {bannedUsers.includes(currentSelectedUser.email.toLowerCase()) && (
                            <div className="relative">
                              <span className="absolute -left-[19.5px] top-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow"></span>
                              <div className="font-bold text-red-500">Access Revoked (Banned)</div>
                              <div className="text-[10px] text-gray-400">Reason: Repeated platform policy violations</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className={`text-xs ${themeSubtext} italic text-center p-6`}>
                      No user selected. Click any row in the safety console list to audit.
                    </p>
                  )}
                </div>
              </div>
            );
          })()}          {activeTab === 'moderation' && (() => {
            // Apply priority filters dynamically
            const filteredReports = reportedPosts.filter(r => {
              if (modFilterPriority === 'critical') return r.reportsCount >= 12;
              if (modFilterPriority === 'high') return r.reportsCount >= 5 && r.reportsCount < 12;
              if (modFilterPriority === 'medium') return r.reportsCount < 5;
              return true;
            });

            // Set default highlighted report
            const currentSelectedReport = reportedPosts.find(r => r.id === selectedReportId) || filteredReports[0];

            const handleUpdateNote = (reportId, noteText) => {
              setModeratorNotes(prev => ({ ...prev, [reportId]: noteText }));
            };

            const handleEscalate = (reportId) => {
              setEscalationStatus(prev => ({ ...prev, [reportId]: 'Escalated to Super Admin' }));
              setAnnSuccessMsg("⚡ Ticket escalated successfully. Senior support has been notified.");
              setTimeout(() => setAnnSuccessMsg(''), 4000);
            };

            // Custom wrapper handlers to log history on actions
            const handleResolveKeep = (report) => {
              handleDismissReport(report.id);
              setModerationHistory(prev => [
                { id: `h_${Date.now()}`, time: 'Just now', action: 'Approved post (Dismissed flags)', target: `@${report.authorHandle}` },
                ...prev
              ]);
            };

            const handleResolveDelete = (report) => {
              handleDeleteReportedPost(report.postId, report.id);
              setModerationHistory(prev => [
                { id: `h_${Date.now()}`, time: 'Just now', action: 'Deleted post', target: `@${report.authorHandle}` },
                ...prev
              ]);
            };

            const handleResolveWarn = (report) => {
              // Warn author
              const authorEmail = `${report.authorHandle}@example.com`;
              setUserWarnings(prev => ({
                ...prev,
                [authorEmail]: (prev[authorEmail] || 0) + 1
              }));
              handleDeleteReportedPost(report.postId, report.id);
              setModerationHistory(prev => [
                { id: `h_${Date.now()}`, time: 'Just now', action: 'Deleted post & Issued Warning', target: `@${report.authorHandle}` },
                ...prev
              ]);
            };

            const handleResolveBan = (report) => {
              // Ban author
              const authorEmail = `${report.authorHandle}@example.com`;
              adminStore.banUser(authorEmail);
              setBannedUsers(adminStore.getBannedUsers());
              handleDeleteReportedPost(report.postId, report.id);
              setModerationHistory(prev => [
                { id: `h_${Date.now()}`, time: 'Just now', action: 'Deleted post & Banned Author', target: `@${report.authorHandle}` },
                ...prev
              ]);
            };

            return (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                {/* Left Column: Moderation Queue List (2 cols span) */}
                <div className={`${themeCardBg} rounded-3xl p-6 space-y-4 lg:col-span-2`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-black flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-500" /> Trust & Safety Content Queue
                      </h2>
                      <p className={`text-[11px] ${themeSubtext}`}>
                        Review reported community submissions, run spam heuristics, and take actions that synchronize instantly.
                      </p>
                    </div>

                    {/* Priority Filter */}
                    <div className="flex gap-2 items-center text-xs">
                      <span className="font-bold text-gray-400">Severity:</span>
                      <select
                        value={modFilterPriority}
                        onChange={e => setModFilterPriority(e.target.value)}
                        className={`py-1 px-2 border rounded-lg ${themeInputBg} text-xs focus:outline-none`}
                      >
                        <option value="all">All Levels</option>
                        <option value="critical">Critical (12+ Reports)</option>
                        <option value="high">High (5-11 Reports)</option>
                        <option value="medium">Medium / Low (&lt;5 Reports)</option>
                      </select>
                    </div>
                  </div>

                  {annSuccessMsg && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[11px] rounded-xl font-bold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{annSuccessMsg}</span>
                    </div>
                  )}

                  {filteredReports.length === 0 ? (
                    <div className={`p-12 text-center ${themeSubCardBg} rounded-3xl border border-gray-800/10 space-y-2`}>
                      <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
                      <h3 className="font-bold text-sm">Clear Moderation Queue</h3>
                      <p className={`text-[11px] ${themeSubtext}`}>No reports matched your selection. Feeds are compliant.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredReports.map((report) => {
                        const isCritical = report.reportsCount >= 12;
                        const isHigh = report.reportsCount >= 5 && report.reportsCount < 12;
                        const isSpamBot = report.authorHandle.toLowerCase().includes('bot') ||
                          report.text.toLowerCase().includes('profit') ||
                          report.text.toLowerCase().includes('scam') ||
                          report.text.toLowerCase().includes('guaranteed');

                        return (
                          <div
                            key={report.id}
                            onClick={() => setSelectedReportId(report.id)}
                            className={`p-4 ${themeSubCardBg} border transition-all rounded-2xl space-y-3 cursor-pointer ${
                              currentSelectedReport?.id === report.id
                                ? 'border-amber-500/50 shadow-md'
                                : 'border-gray-800/15'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-xs">{report.authorName}</span>
                                <span className={`text-[10px] ${themeSubtext}`}>@{report.authorHandle}</span>
                                {isSpamBot && (
                                  <span className="px-1.5 py-0.2 bg-red-500/15 text-red-500 text-[9px] rounded-full font-black uppercase tracking-wider animate-pulse flex items-center gap-1">
                                    ⚠️ Spam Bot
                                  </span>
                                )}
                              </div>

                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1 ${
                                isCritical
                                  ? 'bg-red-500/15 text-red-500 border border-red-500/25'
                                  : isHigh
                                    ? 'bg-orange-500/15 text-orange-500 border border-orange-500/25'
                                    : 'bg-amber-500/15 text-amber-500 border border-amber-500/25'
                              }`}>
                                <AlertTriangle className="w-3 h-3" /> {report.reportsCount} Reports ({isCritical ? 'Critical' : isHigh ? 'High' : 'Medium'})
                              </span>
                            </div>

                            <p className={`text-xs p-3 rounded-xl ${themeInputBg} border italic`}>
                              "{report.text}"
                            </p>

                            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-800/10 text-[10px]">
                              <span className={themeSubtext}>Reason: <strong className="text-amber-500">{report.reportReason}</strong></span>

                              <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                                <button
                                  onClick={() => handleResolveKeep(report)}
                                  className="px-2.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-500 text-[10px] font-bold border border-emerald-500/20 cursor-pointer"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleResolveDelete(report)}
                                  className="px-2.5 py-1.5 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 text-orange-500 text-[10px] font-bold border border-orange-500/20 cursor-pointer"
                                >
                                  Delete
                                </button>
                                <button
                                  onClick={() => handleResolveWarn(report)}
                                  className="px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-500 text-[10px] font-bold border border-amber-500/20 cursor-pointer"
                                >
                                  Warn
                                </button>
                                <button
                                  onClick={() => handleResolveBan(report)}
                                  className="px-2.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold shadow cursor-pointer"
                                >
                                  Ban Author
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Right Column: Moderation Details, Notes & History */}
                <div className="space-y-6">
                  {/* Notes & Workflow Actions */}
                  <div className={`${themeCardBg} rounded-3xl p-5 space-y-4`}>
                    <h3 className="text-xs font-black uppercase tracking-wider">Moderator Action Panel</h3>
                    {currentSelectedReport ? (
                      <div className="space-y-4 text-xs">
                        <div className={`p-3.5 rounded-2xl ${themeSubCardBg} space-y-2`}>
                          <div className="font-extrabold text-[10px] text-gray-400 uppercase">Selected Ticket</div>
                          <div className="font-bold">Author: @{currentSelectedReport.authorHandle}</div>
                          <div className="text-gray-500 line-clamp-2">"{currentSelectedReport.text}"</div>
                        </div>

                        {/* Note text area */}
                        <div className="space-y-1">
                          <label className={`block text-[9px] font-bold ${themeSubtext} uppercase`}>Moderator Audit Notes</label>
                          <textarea
                            rows={3}
                            placeholder="Type notes regarding violations, evidence, or user history..."
                            value={moderatorNotes[currentSelectedReport.id] || ''}
                            onChange={e => handleUpdateNote(currentSelectedReport.id, e.target.value)}
                            className={`w-full py-2 px-3 border rounded-xl ${themeInputBg} focus:outline-none focus:ring-2 focus:ring-violet-500 text-xs`}
                          />
                        </div>

                        {/* Escalation Workflow */}
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => handleEscalate(currentSelectedReport.id)}
                            className="flex-1 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 rounded-xl font-bold text-[10px] uppercase tracking-wider cursor-pointer"
                          >
                            {escalationStatus[currentSelectedReport.id] || 'Escalate Ticket'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className={`text-xs ${themeSubtext} italic text-center p-4`}>
                        No report selected. Select any card to add auditor notes.
                      </p>
                    )}
                  </div>

                  {/* Resolved Actions Audit Trail */}
                  <div className={`${themeCardBg} rounded-3xl p-5 space-y-3`}>
                    <h3 className="text-xs font-black uppercase tracking-wider">Safety Resolution Log</h3>
                    <div className="space-y-3 relative pl-3.5 border-l border-violet-500/30 text-[11px]">
                      {moderationHistory.slice(0, 4).map((hist) => (
                        <div key={hist.id} className="relative">
                          <span className="absolute -left-[19.5px] top-1 w-2 h-2 bg-violet-600 rounded-full border border-white shadow"></span>
                          <div className="font-bold text-gray-800">{hist.action}</div>
                          <div className={`text-[10px] ${themeSubtext}`}>{hist.target} • {hist.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ── TAB 5: POPULAR POSTS ── */}
          {activeTab === 'trending' && (() => {
            // Define mock hourly timestamps or scores for algorithms
            const computedTrending = trendingPosts.map((post, idx) => {
              const isBoosted = boostedPosts.includes(post.id);
              const isLocked = lockedPosts.includes(post.id);
              
              // Calculate dynamic scores based on algorithm
              let score = post.likes + post.comments * 4 + post.shares * 3;
              if (rankingAlgorithm === 'hot') {
                // Hot score: higher likes/comments, decaying slightly by original index order
                score = Math.round((post.likes + post.comments * 8) / (1 + idx * 0.1));
              } else if (rankingAlgorithm === 'controversial') {
                // High comment count relative to upvotes/likes
                score = Math.round((post.comments * 15) / (post.likes + 1) * 10);
              } else if (rankingAlgorithm === 'new') {
                score = 100 - idx * 10; // Simple chronological weight
              }

              // Apply 1.5x multiplier if boosted
              if (isBoosted) score = Math.round(score * 1.5);

              return { ...post, score, isBoosted, isLocked };
            }).sort((a, b) => b.score - a.score);

            const currentTrendingSelected = computedTrending.find(p => p.id === selectedTrendingPostId) || computedTrending[0];

            const handleToggleBoost = (postId) => {
              setBoostedPosts(prev =>
                prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
              );
            };

            const handleToggleLock = (postId) => {
              setLockedPosts(prev =>
                prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
              );
            };

            return (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                {/* Left Column: List of trending content (2 cols span) */}
                <div className={`${themeCardBg} rounded-3xl p-6 space-y-4 lg:col-span-2`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-black flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-500" /> Platform Ranking & Hotness Queue
                      </h2>
                      <p className={`text-[11px] ${themeSubtext}`}>
                        Audit trending community submissions, control feed priority rankings, or lock comment threads.
                      </p>
                    </div>

                    {/* Ranking Algorithm dropdown */}
                    <div className="flex gap-2 items-center text-xs">
                      <span className="font-bold text-gray-400">Sort Algorithm:</span>
                      <select
                        value={rankingAlgorithm}
                        onChange={e => setRankingAlgorithm(e.target.value)}
                        className={`py-1 px-2 border rounded-lg ${themeInputBg} text-xs focus:outline-none`}
                      >
                        <option value="hot">Hot (Reddit Rank Formula)</option>
                        <option value="best">Best (Overall Engagement)</option>
                        <option value="controversial">Controversial (High Comment Ratio)</option>
                        <option value="new">Chronological / Newest</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {computedTrending.map((post, idx) => (
                      <div
                        key={post.id}
                        onClick={() => setSelectedTrendingPostId(post.id)}
                        className={`p-4 ${themeSubCardBg} border transition-all rounded-2xl flex items-center justify-between gap-4 cursor-pointer ${
                          currentTrendingSelected?.id === post.id
                            ? 'border-orange-500/50 shadow-md'
                            : 'border-gray-800/15'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-500 font-black flex items-center justify-center text-sm border border-orange-500/20">
                            #{idx + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-xs">{post.author}</h4>
                              {post.isBoosted && (
                                <span className="px-1.5 py-0.2 bg-gradient-to-r from-violet-600 to-orange-500 text-white text-[8px] rounded-full font-black uppercase flex items-center gap-0.5">
                                  ⚡ Boosted
                                </span>
                              )}
                              {post.isLocked && (
                                <span className="px-1.5 py-0.2 bg-red-500/15 text-red-500 text-[8px] rounded-full font-black uppercase flex items-center gap-0.5">
                                  🔒 Locked
                                </span>
                              )}
                            </div>
                            <p className={`text-xs ${themeSubtext} line-clamp-1 mt-0.5`}>{post.text}</p>
                            <div className="flex items-center gap-3 mt-1.5 text-[10px] text-gray-500 font-bold">
                              <span>❤️ {post.likes}</span>
                              <span>💬 {post.comments}</span>
                              <span>🔄 {post.shares}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => handleToggleBoost(post.id)}
                            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                              post.isBoosted
                                ? 'bg-gradient-to-r from-violet-600 to-orange-500 text-white border-transparent'
                                : 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-700'
                            }`}
                          >
                            {post.isBoosted ? 'Unboost' : 'Boost Rank'}
                          </button>
                          <button
                            onClick={() => handleToggleLock(post.id)}
                            className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                              post.isLocked
                                ? 'bg-red-500/15 hover:bg-red-500/25 text-red-500 border-red-500/25'
                                : 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-700'
                            }`}
                          >
                            {post.isLocked ? 'Unlock' : 'Lock Comments'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column: Trending Insights & Recommendations */}
                <div className="space-y-6">
                  {/* Selected Content Profile */}
                  <div className={`${themeCardBg} rounded-3xl p-5 space-y-4`}>
                    <h3 className="text-xs font-black uppercase tracking-wider">Algorithmic Content Details</h3>
                    {currentTrendingSelected ? (
                      <div className="space-y-4 text-xs">
                        <div className={`p-4 rounded-2xl ${themeSubCardBg} space-y-2`}>
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-xs text-gray-900">Post u/{currentTrendingSelected.author.toLowerCase()}</span>
                            <span className="text-[10px] text-orange-500 font-black">Score: {currentTrendingSelected.score}</span>
                          </div>
                          <p className="text-gray-500 text-xs italic">"{currentTrendingSelected.text}"</p>
                        </div>

                        {/* Engagement stats */}
                        <div className="space-y-2">
                          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Real-time CTR & Velocity</div>
                          <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                            <div className={`p-2.5 rounded-xl ${themeSubCardBg}`}>
                              <div className="font-black text-xs text-violet-600">6.8k/hr</div>
                              <div className="text-gray-400 mt-0.5">Impression Velocity</div>
                            </div>
                            <div className={`p-2.5 rounded-xl ${themeSubCardBg}`}>
                              <div className="font-black text-xs text-emerald-500">4.82%</div>
                              <div className="text-gray-400 mt-0.5">Click-Through Rate</div>
                            </div>
                          </div>
                        </div>

                        {/* Automated Recommendation Insight */}
                        <div className={`p-3 rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-600`}>
                          <div className="font-black uppercase text-[9px] tracking-wider mb-1">🤖 AI Recommendation Insight</div>
                          <p className="text-[10px] leading-relaxed">
                            {currentTrendingSelected.likes > 600
                              ? "High engagement velocity. Recommendation: Feature on platform home screen banner."
                              : "Standard engagement velocity. Maintain standard feeds placement."}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className={`text-xs ${themeSubtext} italic text-center p-4`}>
                        No trending item selected.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

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
