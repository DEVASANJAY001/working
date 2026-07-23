import React, { useState } from 'react';
import { ChevronDown, AlertTriangle, LogOut } from 'lucide-react';
import { adminStore } from '../../services/adminStore';
import { DashboardLayout, SpoilerPostCard, Button } from '../atomic';

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

export default function HomeDashboardScreen({ onLogout, onCreatePress, onGoToAdmin, currentUser }) {
  const [posts, setPosts] = useState(initialPosts);
  const [activeNav, setActiveNav] = useState('Home');
  const [sortFilter, setSortFilter] = useState('Best');
  const [searchQuery, setSearchQuery] = useState('');
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

  return (
    <DashboardLayout
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      currentUser={currentUser}
      onCreatePress={onCreatePress}
      onGoToAdmin={onGoToAdmin}
      onLogout={() => setShowLogoutConfirm(true)}
      activeNav={activeNav}
      setActiveNav={setActiveNav}
      recentPostsList={recentPostsList}
    >
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

      {/* Posts List using Atomic Organism */}
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
              <Button variant="pill" className="flex-1" onClick={() => setShowLogoutConfirm(false)}>Cancel</Button>
              <Button variant="default" className="flex-1 bg-red-500 hover:bg-red-600" onClick={confirmLogout}>Log Out</Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
