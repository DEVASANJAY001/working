import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions,
  Animated,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { postsService, communitiesService, notificationsService } from '../services/apiService';

const { width, height } = Dimensions.get('window');

// ─── Category Data ─────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'cat1', icon: '🏏', label: 'Cricket' },
  { id: 'cat2', icon: '🎬', label: 'Bollywood' },
  { id: 'cat3', icon: '🍛', label: 'Food' },
  { id: 'cat4', icon: '💻', label: 'Tech' },
  { id: 'cat5', icon: '🎵', label: 'Music' },
  { id: 'cat6', icon: '📰', label: 'News' },
  { id: 'cat7', icon: '🧘', label: 'Wellness' },
  { id: 'cat8', icon: '🌆', label: 'Local' },
  { id: 'cat9', icon: '🗳️', label: 'Politics' },
  { id: 'cat10', icon: '🎭', label: 'Culture' },
];

// ─── Stories Data ──────────────────────────────────────────────────────────────
const STATIC_STORIES = [
  { id: 's2', name: 'Rahul', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', active: true },
  { id: 's3', name: 'Priya', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', active: true },
  { id: 's4', name: 'Arjun', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80', active: true },
  { id: 's5', name: 'Meera', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80', active: true },
  { id: 's6', name: 'Dev', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', active: false },
  { id: 's7', name: 'Kavya', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', active: true },
];

const FEED_TABS = [
  { id: 'home', label: '🎯 For You' },
  { id: 'local', label: '📍 Local' },
  { id: 'trending', label: '🔥 Trending' },
  { id: 'following', label: '⭐ Following' },
];

const AWARD_TYPES = [
  { id: 'aw1', label: 'Excellent', coins: 100, icon: 'star', color: '#FBBF24' },
  { id: 'aw2', label: 'Inspiring', coins: 200, icon: 'heart', color: '#EC4899' },
  { id: 'aw3', label: 'Brilliant', coins: 500, icon: 'flash', color: '#3B82F6' },
  { id: 'aw4', label: 'Superb', coins: 800, icon: 'ribbon', color: '#10B981' },
  { id: 'aw5', label: 'Outstanding', coins: 1000, icon: 'trophy', color: '#F59E0B' },
  { id: 'aw6', label: 'Legendary', coins: 2000, icon: 'flame', color: '#EF4444' },
  { id: 'aw7', label: 'Epic', coins: 5000, icon: 'shield', color: '#8B5CF6' },
  { id: 'aw8', label: 'Diamond', coins: 10000, icon: 'diamond', color: '#06B6D4' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatCount = (n) => {
  if (!n) return '0';
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const getFirstName = (name) => {
  if (!name) return 'there';
  return name.split(' ')[0];
};

// ─── Sub-Components ────────────────────────────────────────────────────────────
const PollWidget = ({ poll, onVote }) => {
  const total = poll.totalVotes || 1;
  return (
    <View style={styles.pollContainer}>
      {poll.options.map(opt => {
        const pct = Math.round((opt.votes / total) * 100);
        const isVoted = poll.voted === opt.id;
        return (
          <TouchableOpacity key={opt.id} style={styles.pollOption} onPress={() => onVote && onVote(opt.id)}>
            <View style={[styles.pollBar, { width: `${pct}%` }]} />
            <View style={styles.pollOptionContent}>
              <Text style={[styles.pollOptionText, isVoted && styles.pollOptionVoted]}>{opt.text}</Text>
              <Text style={styles.pollPct}>{pct}%</Text>
            </View>
          </TouchableOpacity>
        );
      })}
      <Text style={styles.pollMeta}>{formatCount(total)} votes • Ends in {poll.endsIn}</Text>
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function HomeDashboardScreen({ currentUser, onLogout, onCreatePress, onNavigate }) {
  const [activeTab, setActiveTab] = useState('home');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [notifCount, setNotifCount] = useState(3);
  const [msgCount, setMsgCount] = useState(4);

  // Overlay states
  const [selectedPost, setSelectedPost] = useState(null);   // PST_001
  const [showComments, setShowComments] = useState(false);  // CMT_001
  const [showShare, setShowShare] = useState(false);        // SHR_001
  const [showAwards, setShowAwards] = useState(false);      // AWD_001
  const [showProfile, setShowProfile] = useState(false);    // Profile menu

  // Comments
  const [commentsList, setCommentsList] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [commentSort, setCommentSort] = useState('Top');

  // Awards
  const [coinsBalance, setCoinsBalance] = useState(1250);
  const [selectedAward, setSelectedAward] = useState(null);
  const [awardQuantity, setAwardQuantity] = useState(1);

  // Bottom Nav
  const [activeNav, setActiveNav] = useState('home');

  // Animated FAB
  const fabScale = useRef(new Animated.Value(1)).current;

  // ─── Load Feed ──────────────────────────────────────────────────────────────
  const loadFeed = useCallback(async (tab = activeTab, isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    try {
      const data = await postsService.getFeed(tab);
      setPosts(data);
    } catch (e) {
      console.warn('Feed error:', e);
    }
    setLoading(false);
    setRefreshing(false);
  }, [activeTab]);

  useEffect(() => { loadFeed(); }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setLoading(true);
    postsService.getFeed(tab).then(data => {
      setPosts(data);
      setLoading(false);
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadFeed(activeTab, true);
  };

  // ─── Post Actions ────────────────────────────────────────────────────────────
  const handleToggleLike = async (postId) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 };
      }
      return p;
    }));
    if (selectedPost?.id === postId) {
      setSelectedPost(prev => ({ ...prev, isLiked: !prev.isLiked, likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1 }));
    }
    await postsService.likePost(postId);
  };

  const handleToggleSave = async (postId) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) return { ...p, isSaved: !p.isSaved };
      return p;
    }));
    if (selectedPost?.id === postId) {
      setSelectedPost(prev => ({ ...prev, isSaved: !prev.isSaved }));
    }
    await postsService.savePost(postId);
  };

  const handleOpenPost = async (post) => {
    setSelectedPost(post);
    setShowComments(false);
    setCommentsLoading(true);
    const comments = await postsService.getComments(post.id);
    setCommentsList(comments);
    setCommentsLoading(false);
  };

  const handleAddComment = async () => {
    if (!newCommentText.trim()) return;
    const userDisplayName = currentUser?.name || 'You';
    const userHandle = currentUser?.username || 'user';
    const userAvatar = currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80';
    const newComment = {
      id: `c_${Date.now()}`,
      authorName: userDisplayName,
      authorHandle: `@${userHandle}`,
      authorAvatar: userAvatar,
      badgeLabel: null,
      time: 'Just now',
      text: newCommentText,
      likes: 0,
      isLiked: false,
      replies: [],
    };
    setCommentsList(prev => [newComment, ...prev]);
    setNewCommentText('');
    if (selectedPost) {
      setPosts(prev => prev.map(p => p.id === selectedPost.id ? { ...p, commentsCount: p.commentsCount + 1 } : p));
      setSelectedPost(prev => ({ ...prev, commentsCount: prev.commentsCount + 1 }));
    }
    await postsService.addComment(selectedPost?.id, newCommentText);
  };

  const handleVotePoll = (postId, optionId) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId && p.poll && !p.poll.voted) {
        const updatedOptions = p.poll.options.map(o =>
          o.id === optionId ? { ...o, votes: o.votes + 1 } : o
        );
        return { ...p, poll: { ...p.poll, options: updatedOptions, voted: optionId, totalVotes: p.poll.totalVotes + 1 } };
      }
      return p;
    }));
  };

  const handleSendAward = () => {
    if (!selectedAward) return;
    const cost = selectedAward.coins * awardQuantity;
    if (coinsBalance < cost) {
      Alert.alert('Insufficient Coins', 'You don\'t have enough coins for this award.');
      return;
    }
    setCoinsBalance(prev => prev - cost);
    if (selectedPost) {
      setPosts(prev => prev.map(p => p.id === selectedPost.id ? { ...p, awards: p.awards + awardQuantity } : p));
      setSelectedPost(prev => ({ ...prev, awards: prev.awards + awardQuantity }));
    }
    setShowAwards(false);
    setSelectedAward(null);
    setAwardQuantity(1);
    Alert.alert('Award Sent! 🏆', `You sent ${awardQuantity}x ${selectedAward.label} award!`);
  };

  // ─── User Info ───────────────────────────────────────────────────────────────
  const displayName = getFirstName(currentUser?.name);
  const userAvatar = currentUser?.avatar;

  // ─── Render Post Card ────────────────────────────────────────────────────────
  const renderPostCard = ({ item: post }) => (
    <TouchableOpacity
      style={styles.postCard}
      activeOpacity={0.97}
      onPress={() => handleOpenPost(post)}
    >
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.postHeaderLeft}>
          <View style={styles.communityIconBox}>
            <Text style={styles.communityIconText}>{post.communityIcon}</Text>
          </View>
          <View style={styles.postHeaderInfo}>
            <Text style={styles.postCommunity}>{post.community}</Text>
            <Text style={styles.postMeta}>
              <Text style={styles.postAuthor}>{post.authorHandle}</Text>
              {' • '}{post.time}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.postMoreBtn}>
          <Ionicons name="ellipsis-horizontal" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Badge */}
      {post.badgeLabel && (
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>⭐ {post.badgeLabel}</Text>
          </View>
        </View>
      )}

      {/* Post Text */}
      <Text style={styles.postText} numberOfLines={3}>{post.text}</Text>

      {/* Post Media */}
      {post.type === 'image' && post.image && (
        <Image source={{ uri: post.image }} style={styles.postImage} resizeMode="cover" />
      )}
      {post.type === 'gallery' && post.images?.length > 0 && (
        <View style={styles.galleryRow}>
          <Image source={{ uri: post.images[0] }} style={styles.galleryMain} resizeMode="cover" />
          {post.images.length > 1 && (
            <View style={styles.galleryCol}>
              <Image source={{ uri: post.images[1] }} style={styles.galleryThumb} resizeMode="cover" />
              {post.images.length > 2 && (
                <View style={styles.galleryThumbExtra}>
                  <Image source={{ uri: post.images[2] }} style={styles.galleryThumb} resizeMode="cover" />
                  {post.images.length > 3 && (
                    <View style={styles.galleryMore}>
                      <Text style={styles.galleryMoreText}>+{post.images.length - 3}</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          )}
        </View>
      )}
      {post.type === 'poll' && post.poll && (
        <PollWidget poll={post.poll} onVote={(optId) => handleVotePoll(post.id, optId)} />
      )}

      {/* Post Actions */}
      <View style={styles.postActions}>
        {/* Vote */}
        <View style={styles.voteGroup}>
          <TouchableOpacity
            style={[styles.voteBtn, post.isLiked && styles.voteBtnActive]}
            onPress={() => handleToggleLike(post.id)}
          >
            <Ionicons
              name={post.isLiked ? 'arrow-up-circle' : 'arrow-up-circle-outline'}
              size={22}
              color={post.isLiked ? '#FF6B00' : '#6B7280'}
            />
            <Text style={[styles.voteCount, post.isLiked && styles.voteCountActive]}>
              {formatCount(post.likes)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.voteBtn}>
            <Ionicons name="arrow-down-circle-outline" size={22} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Comments */}
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => { handleOpenPost(post); setShowComments(true); }}
        >
          <Ionicons name="chatbubble-outline" size={20} color="#6B7280" />
          <Text style={styles.actionBtnText}>{formatCount(post.commentsCount)}</Text>
        </TouchableOpacity>

        {/* Share */}
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => { setSelectedPost(post); setShowShare(true); }}
        >
          <Ionicons name="share-social-outline" size={20} color="#6B7280" />
          <Text style={styles.actionBtnText}>{formatCount(post.shares)}</Text>
        </TouchableOpacity>

        {/* Save */}
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleToggleSave(post.id)}>
          <Ionicons
            name={post.isSaved ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={post.isSaved ? '#FF6B00' : '#6B7280'}
          />
        </TouchableOpacity>

        {/* Award */}
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => { setSelectedPost(post); setSelectedAward(null); setAwardQuantity(1); setShowAwards(true); }}
        >
          <Ionicons name="trophy-outline" size={20} color="#6B7280" />
          {post.awards > 0 && <Text style={styles.actionBtnText}>{formatCount(post.awards)}</Text>}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // ─── Story Item ──────────────────────────────────────────────────────────────
  const renderStory = (item) => (
    <TouchableOpacity key={item.id} style={styles.storyItem}>
      <View style={[styles.storyRing, item.active && styles.storyRingActive]}>
        <Image source={{ uri: item.image }} style={styles.storyAvatar} />
      </View>
      <Text style={styles.storyName} numberOfLines={1}>{item.name}</Text>
    </TouchableOpacity>
  );

  // ─── Header ──────────────────────────────────────────────────────────────────
  const renderHeader = () => (
    <View style={styles.feedHeader}>
      {/* App Header */}
      <View style={styles.appHeader}>
        <View style={styles.appHeaderLeft}>
          <View style={styles.appLogo}>
            <LinearGradient colors={['#FF6B00', '#FF9F4A']} style={styles.logoGradient}>
              <Text style={styles.logoText}>D</Text>
            </LinearGradient>
          </View>
          <View>
            <Text style={styles.greetingText}>{getGreeting()},</Text>
            <Text style={styles.userNameText}>{displayName} 👋</Text>
          </View>
        </View>
        <View style={styles.appHeaderRight}>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => onNavigate && onNavigate('Discover')}>
            <Ionicons name="search-outline" size={24} color="#1F2937" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => onNavigate && onNavigate('Notifications')}>
            <Ionicons name="notifications-outline" size={24} color="#1F2937" />
            {notifCount > 0 && (
              <View style={styles.badge2}>
                <Text style={styles.badge2Text}>{notifCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => onNavigate && onNavigate('Messages')}>
            <Ionicons name="chatbubble-outline" size={23} color="#1F2937" />
            {msgCount > 0 && (
              <View style={styles.badge2}>
                <Text style={styles.badge2Text}>{msgCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowProfile(true)}>
            {userAvatar ? (
              <Image source={{ uri: userAvatar }} style={styles.headerAvatar} />
            ) : (
              <View style={styles.headerAvatarFallback}>
                <Text style={styles.headerAvatarFallbackText}>
                  {(currentUser?.name || 'U')[0].toUpperCase()}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Feed Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {FEED_TABS.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            onPress={() => handleTabChange(tab.id)}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
              {tab.label}
            </Text>
            {activeTab === tab.id && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Categories ── (separate container per blueprint) */}
      <View style={styles.categoriesSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        >
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryChip, selectedCategory === cat.id && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
            >
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text style={[styles.categoryLabel, selectedCategory === cat.id && styles.categoryLabelActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Stories ── (separate container per blueprint) */}
      <View style={styles.storiesSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesList}
        >
          {/* My Story */}
          <TouchableOpacity style={styles.storyItem}>
            <View style={styles.myStoryBox}>
              {userAvatar ? (
                <Image source={{ uri: userAvatar }} style={styles.storyAvatar} />
              ) : (
                <View style={styles.myStoryPlaceholder}>
                  <Text style={styles.myStoryInitial}>
                    {(currentUser?.name || 'U')[0].toUpperCase()}
                  </Text>
                </View>
              )}
              <View style={styles.addStoryBtn}>
                <Ionicons name="add" size={12} color="#fff" />
              </View>
            </View>
            <Text style={styles.storyName} numberOfLines={1}>Your Story</Text>
          </TouchableOpacity>
          {STATIC_STORIES.map(s => renderStory(s))}
        </ScrollView>
      </View>
    </View>
  );

  // ─── Post Detail Modal (PST_001) ──────────────────────────────────────────────
  const renderPostDetail = () => {
    if (!selectedPost) return null;
    return (
      <Modal visible={!!selectedPost} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSelectedPost(null)}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity style={styles.modalBack} onPress={() => { setSelectedPost(null); setShowComments(false); }}>
              <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedPost.community}</Text>
            <TouchableOpacity style={styles.modalBack}>
              <Ionicons name="ellipsis-horizontal" size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
            {/* Author */}
            <View style={styles.detailAuthorRow}>
              <Image source={{ uri: selectedPost.authorAvatar }} style={styles.detailAvatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.detailAuthorName}>{selectedPost.authorName}</Text>
                <Text style={styles.detailAuthorMeta}>{selectedPost.authorHandle} • {selectedPost.time}</Text>
              </View>
            </View>

            {/* Content */}
            <Text style={styles.detailText}>{selectedPost.text}</Text>
            {selectedPost.type === 'image' && selectedPost.image && (
              <Image source={{ uri: selectedPost.image }} style={styles.detailImage} resizeMode="cover" />
            )}
            {selectedPost.type === 'gallery' && selectedPost.images?.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 12 }}>
                {selectedPost.images.map((img, i) => (
                  <Image key={i} source={{ uri: img }} style={styles.detailGalleryImg} resizeMode="cover" />
                ))}
              </ScrollView>
            )}
            {selectedPost.type === 'poll' && selectedPost.poll && (
              <PollWidget poll={selectedPost.poll} onVote={(optId) => handleVotePoll(selectedPost.id, optId)} />
            )}

            {/* Actions */}
            <View style={styles.detailActions}>
              <TouchableOpacity
                style={[styles.detailActionBtn, selectedPost.isLiked && styles.detailActionActive]}
                onPress={() => handleToggleLike(selectedPost.id)}
              >
                <Ionicons name={selectedPost.isLiked ? 'arrow-up-circle' : 'arrow-up-circle-outline'} size={22} color={selectedPost.isLiked ? '#FF6B00' : '#6B7280'} />
                <Text style={[styles.detailActionText, selectedPost.isLiked && { color: '#FF6B00' }]}>{formatCount(selectedPost.likes)}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.detailActionBtn} onPress={() => setShowComments(!showComments)}>
                <Ionicons name="chatbubble-outline" size={20} color="#6B7280" />
                <Text style={styles.detailActionText}>{formatCount(selectedPost.commentsCount)}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.detailActionBtn} onPress={() => setShowShare(true)}>
                <Ionicons name="share-social-outline" size={20} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.detailActionBtn} onPress={() => handleToggleSave(selectedPost.id)}>
                <Ionicons name={selectedPost.isSaved ? 'bookmark' : 'bookmark-outline'} size={20} color={selectedPost.isSaved ? '#FF6B00' : '#6B7280'} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.detailActionBtn} onPress={() => { setShowAwards(true); }}>
                <Ionicons name="trophy-outline" size={20} color="#6B7280" />
                <Text style={styles.detailActionText}>{formatCount(selectedPost.awards)}</Text>
              </TouchableOpacity>
            </View>

            {/* Comments Section */}
            <View style={styles.commentsSection}>
              <View style={styles.commentsSectionHeader}>
                <Text style={styles.commentsSectionTitle}>
                  💬 {formatCount(selectedPost.commentsCount)} Comments
                </Text>
                <View style={styles.sortRow}>
                  {['Top', 'Latest'].map(s => (
                    <TouchableOpacity key={s} onPress={() => setCommentSort(s)}>
                      <Text style={[styles.sortBtn, commentSort === s && styles.sortBtnActive]}>{s}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {commentsLoading ? (
                <ActivityIndicator color="#FF6B00" style={{ marginVertical: 20 }} />
              ) : (
                commentsList.map(comment => (
                  <View key={comment.id} style={styles.commentItem}>
                    <Image source={{ uri: comment.authorAvatar }} style={styles.commentAvatar} />
                    <View style={styles.commentBody}>
                      <View style={styles.commentHeaderRow}>
                        <Text style={styles.commentAuthor}>{comment.authorName}</Text>
                        {comment.badgeLabel && <Text style={styles.commentBadge}> • {comment.badgeLabel}</Text>}
                        <Text style={styles.commentTime}> • {comment.time}</Text>
                      </View>
                      <Text style={styles.commentText}>{comment.text}</Text>
                      <View style={styles.commentActions}>
                        <TouchableOpacity style={styles.commentActionBtn}>
                          <Ionicons name={comment.isLiked ? 'heart' : 'heart-outline'} size={16} color={comment.isLiked ? '#FF6B00' : '#9CA3AF'} />
                          <Text style={styles.commentActionText}>{comment.likes}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.commentActionBtn}>
                          <Text style={styles.commentReplyBtn}>Reply</Text>
                        </TouchableOpacity>
                      </View>
                      {/* Replies */}
                      {comment.replies?.map(reply => (
                        <View key={reply.id} style={styles.replyItem}>
                          <Image source={{ uri: reply.authorAvatar }} style={styles.replyAvatar} />
                          <View style={styles.replyBody}>
                            <Text style={styles.replyAuthor}>{reply.authorName} <Text style={styles.replyTime}>• {reply.time}</Text></Text>
                            <Text style={styles.replyText}>{reply.text}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                ))
              )}
            </View>
          </ScrollView>

          {/* Comment Input */}
          <View style={styles.commentInput}>
            {userAvatar ? (
              <Image source={{ uri: userAvatar }} style={styles.commentInputAvatar} />
            ) : (
              <View style={styles.commentInputAvatarFallback}>
                <Text style={styles.commentInputAvatarText}>
                  {(currentUser?.name || 'U')[0].toUpperCase()}
                </Text>
              </View>
            )}
            <TextInput
              style={styles.commentInputField}
              placeholder="Add a comment..."
              placeholderTextColor="#9CA3AF"
              value={newCommentText}
              onChangeText={setNewCommentText}
              multiline
            />
            <TouchableOpacity
              style={[styles.commentSendBtn, !newCommentText.trim() && styles.commentSendBtnDisabled]}
              onPress={handleAddComment}
              disabled={!newCommentText.trim()}
            >
              <Ionicons name="send" size={18} color={newCommentText.trim() ? '#FF6B00' : '#D1D5DB'} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  // ─── Share Sheet (SHR_001) ────────────────────────────────────────────────────
  const renderShareSheet = () => (
    <Modal visible={showShare} animationType="slide" transparent onRequestClose={() => setShowShare(false)}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setShowShare(false)} />
      <View style={styles.bottomSheet}>
        <View style={styles.sheetHandle} />
        <Text style={styles.sheetTitle}>Share Post</Text>
        <View style={styles.shareGrid}>
          {[
            { icon: '💬', label: 'WhatsApp', color: '#25D366' },
            { icon: '✈️', label: 'Telegram', color: '#2AABEE' },
            { icon: '✉️', label: 'Messages', color: '#5AC8FA' },
            { icon: '🐦', label: 'X (Twitter)', color: '#000000' },
            { icon: '📘', label: 'Facebook', color: '#1877F2' },
            { icon: '🔗', label: 'Copy Link', color: '#6B7280' },
          ].map(item => (
            <TouchableOpacity key={item.label} style={styles.shareItem} onPress={() => setShowShare(false)}>
              <View style={[styles.shareIconBox, { backgroundColor: item.color + '20' }]}>
                <Text style={styles.shareIconText}>{item.icon}</Text>
              </View>
              <Text style={styles.shareLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.sheetCancelBtn} onPress={() => setShowShare(false)}>
          <Text style={styles.sheetCancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  // ─── Award Sheet (AWD_001) ────────────────────────────────────────────────────
  const renderAwardSheet = () => (
    <Modal visible={showAwards} animationType="slide" transparent onRequestClose={() => setShowAwards(false)}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setShowAwards(false)} />
      <View style={[styles.bottomSheet, { paddingBottom: 30 }]}>
        <View style={styles.sheetHandle} />
        <View style={styles.awardHeader}>
          <Text style={styles.sheetTitle}>Give Award</Text>
          <View style={styles.coinBadge}>
            <Text style={styles.coinText}>🪙 {coinsBalance.toLocaleString()}</Text>
          </View>
        </View>
        <View style={styles.awardGrid}>
          {AWARD_TYPES.map(award => (
            <TouchableOpacity
              key={award.id}
              style={[styles.awardItem, selectedAward?.id === award.id && styles.awardItemSelected]}
              onPress={() => setSelectedAward(award)}
            >
              <View style={[styles.awardIconBox, { backgroundColor: award.color + '20' }]}>
                <Ionicons name={award.icon} size={26} color={award.color} />
              </View>
              <Text style={styles.awardLabel}>{award.label}</Text>
              <Text style={styles.awardCost}>🪙 {award.coins}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {selectedAward && (
          <View style={styles.awardControls}>
            <View style={styles.qtyRow}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setAwardQuantity(q => Math.max(1, q - 1))}>
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{awardQuantity}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setAwardQuantity(q => q + 1)}>
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.awardSendBtn} onPress={handleSendAward}>
              <LinearGradient colors={['#FF6B00', '#FF9F4A']} style={styles.awardSendGradient}>
                <Text style={styles.awardSendText}>Send 🏆 ({awardQuantity * selectedAward.coins} coins)</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity style={styles.sheetCancelBtn} onPress={() => setShowAwards(false)}>
          <Text style={styles.sheetCancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  // ─── Profile Menu Modal ───────────────────────────────────────────────────────
  const renderProfileMenu = () => (
    <Modal visible={showProfile} animationType="slide" transparent onRequestClose={() => setShowProfile(false)}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setShowProfile(false)} />
      <View style={styles.bottomSheet}>
        <View style={styles.sheetHandle} />
        {/* User Info */}
        <View style={styles.profileMenuUser}>
          {userAvatar ? (
            <Image source={{ uri: userAvatar }} style={styles.profileMenuAvatar} />
          ) : (
            <View style={styles.profileMenuAvatarFallback}>
              <Text style={styles.profileMenuAvatarText}>
                {(currentUser?.name || 'U')[0].toUpperCase()}
              </Text>
            </View>
          )}
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.profileMenuName}>{currentUser?.name || 'User'}</Text>
            <Text style={styles.profileMenuEmail}>{currentUser?.email || ''}</Text>
          </View>
        </View>

        {[
          { icon: 'person-outline', label: 'My Profile' },
          { icon: 'bookmark-outline', label: 'Saved Posts' },
          { icon: 'trophy-outline', label: 'My Awards' },
          { icon: 'settings-outline', label: 'Settings' },
          { icon: 'help-circle-outline', label: 'Help Center' },
        ].map(item => (
          <TouchableOpacity key={item.label} style={styles.profileMenuItem} onPress={() => setShowProfile(false)}>
            <Ionicons name={item.icon} size={20} color="#374151" />
            <Text style={styles.profileMenuItemText}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => {
            setShowProfile(false);
            Alert.alert('Logout', 'Are you sure you want to logout?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Logout', style: 'destructive', onPress: onLogout },
            ]);
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  // ─── Main Return ──────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Feed */}
      {loading && !refreshing ? (
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color="#FF6B00" />
          <Text style={styles.loadingText}>Loading your feed...</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={item => item.id}
          renderItem={renderPostCard}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.feedList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#FF6B00']} tintColor="#FF6B00" />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🏜️</Text>
              <Text style={styles.emptyTitle}>Nothing here yet</Text>
              <Text style={styles.emptySubtitle}>Be the first to post in this feed!</Text>
            </View>
          }
        />
      )}

      {/* FAB */}
      <Animated.View style={[styles.fab, { transform: [{ scale: fabScale }] }]}>
        <TouchableOpacity onPress={onCreatePress} activeOpacity={0.85}>
          <LinearGradient colors={['#FF6B00', '#FF9F4A']} style={styles.fabGradient}>
            <Ionicons name="add" size={28} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {[
          { id: 'home', icon: 'home', label: 'Home' },
          { id: 'discover', icon: 'compass', label: 'Discover' },
          { id: 'create', icon: 'add-circle', label: 'Create', special: true },
          { id: 'chat', icon: 'chatbubble', label: 'Chat', badge: msgCount },
          { id: 'profile', icon: 'person', label: 'Profile' },
        ].map(item => {
          if (item.special) {
            return (
              <TouchableOpacity key={item.id} style={styles.navItemCreate} onPress={onCreatePress}>
                <LinearGradient colors={['#FF6B00', '#FF9F4A']} style={styles.navCreateGradient}>
                  <Ionicons name="add" size={26} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            );
          }
          const isActive = activeNav === item.id;
          const navActions = {
            home: () => setActiveNav('home'),
            discover: () => { setActiveNav('discover'); onNavigate && onNavigate('Discover'); },
            chat: () => { setActiveNav('chat'); onNavigate && onNavigate('Messages'); },
            profile: () => { setActiveNav('profile'); onNavigate && onNavigate('Profile'); },
          };
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.navItem}
              onPress={() => navActions[item.id] && navActions[item.id]()}
            >
              <View style={styles.navIconWrap}>
                <Ionicons
                  name={isActive ? item.icon : `${item.icon}-outline`}
                  size={24}
                  color={isActive ? '#FF6B00' : '#6B7280'}
                />
                {item.badge > 0 && (
                  <View style={styles.navBadge}>
                    <Text style={styles.navBadgeText}>{item.badge}</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Overlays */}
      {renderPostDetail()}
      {renderShareSheet()}
      {renderAwardSheet()}
      {renderProfileMenu()}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  feedList: { paddingBottom: 90 },
  loadingCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 15, color: '#9CA3AF' },
  emptyState: { alignItems: 'center', padding: 48 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 6 },
  emptySubtitle: { fontSize: 14, color: '#9CA3AF', textAlign: 'center' },

  // ── App Header ──
  feedHeader: { backgroundColor: '#FFFFFF' },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  appHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  appLogo: { width: 38, height: 38, borderRadius: 12, overflow: 'hidden' },
  logoGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  greetingText: { fontSize: 12, color: '#9CA3AF' },
  userNameText: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
  appHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  headerIconBtn: { padding: 8, position: 'relative' },
  badge2: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badge2Text: { fontSize: 9, color: '#fff', fontWeight: 'bold' },
  headerAvatar: { width: 34, height: 34, borderRadius: 17, borderWidth: 2, borderColor: '#FF6B00' },
  headerAvatarFallback: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#FF6B00',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#FF9F4A',
  },
  headerAvatarFallbackText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },

  // ── Feed Tabs ──
  tabsContainer: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  tabsContent: { paddingHorizontal: 12, paddingBottom: 0 },
  tab: { paddingHorizontal: 14, paddingVertical: 12, position: 'relative' },
  tabActive: {},
  tabText: { fontSize: 14, color: '#9CA3AF', fontWeight: '500' },
  tabTextActive: { color: '#FF6B00', fontWeight: 'bold' },
  tabIndicator: {
    position: 'absolute',
    bottom: 0, left: 14, right: 14,
    height: 3,
    backgroundColor: '#FF6B00',
    borderRadius: 2,
  },

  // ── Categories ──
  categoriesSection: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingVertical: 10,
  },
  categoriesList: { paddingHorizontal: 12, gap: 8 },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryChipActive: { backgroundColor: '#FFF3EC', borderColor: '#FF6B00' },
  categoryIcon: { fontSize: 15 },
  categoryLabel: { fontSize: 12, fontWeight: '500', color: '#6B7280' },
  categoryLabelActive: { color: '#FF6B00' },

  // ── Stories ──
  storiesSection: {
    backgroundColor: '#fff',
    borderBottomWidth: 8,
    borderBottomColor: '#F3F4F6',
    paddingTop: 12,
    paddingBottom: 14,
  },
  storiesList: { paddingHorizontal: 12, gap: 12 },
  storyItem: { alignItems: 'center', width: 68 },
  storyRing: {
    width: 62, height: 62,
    borderRadius: 31,
    borderWidth: 2.5,
    borderColor: '#E5E7EB',
    alignItems: 'center', justifyContent: 'center',
  },
  storyRingActive: { borderColor: '#FF6B00' },
  storyAvatar: { width: 54, height: 54, borderRadius: 27 },
  storyName: { fontSize: 11, color: '#374151', marginTop: 5, textAlign: 'center' },
  myStoryBox: { width: 62, height: 62, borderRadius: 31, position: 'relative' },
  myStoryPlaceholder: {
    width: 62, height: 62, borderRadius: 31,
    backgroundColor: '#FF6B00',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2.5, borderColor: '#F3F4F6',
  },
  myStoryInitial: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  addStoryBtn: {
    position: 'absolute',
    bottom: 0, right: 0,
    width: 20, height: 20,
    borderRadius: 10,
    backgroundColor: '#FF6B00',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#fff',
  },

  // ── Post Card ──
  postCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 0,
    marginBottom: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 0,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  postHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  communityIconBox: {
    width: 42, height: 42,
    borderRadius: 10,
    backgroundColor: '#FFF3EC',
    alignItems: 'center', justifyContent: 'center',
  },
  communityIconText: { fontSize: 22 },
  postHeaderInfo: { flex: 1 },
  postCommunity: { fontSize: 15, fontWeight: 'bold', color: '#1F2937' },
  postMeta: { fontSize: 12, color: '#9CA3AF', marginTop: 1 },
  postAuthor: { color: '#6B7280' },
  postMoreBtn: { padding: 6 },
  badgeRow: { marginBottom: 8 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF3EC',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: { fontSize: 11, color: '#FF6B00', fontWeight: '600' },
  postText: { fontSize: 15, color: '#374151', lineHeight: 22, marginBottom: 10 },
  postImage: { width: '100%', height: 220, borderRadius: 12, marginBottom: 10 },
  galleryRow: { flexDirection: 'row', height: 200, marginBottom: 10, gap: 4 },
  galleryMain: { flex: 1.5, borderRadius: 10 },
  galleryCol: { flex: 1, gap: 4 },
  galleryThumb: { flex: 1, borderRadius: 10 },
  galleryThumbExtra: { flex: 1, position: 'relative' },
  galleryMore: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  galleryMoreText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  // Poll
  pollContainer: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 14, marginBottom: 12, gap: 8 },
  pollOption: {
    height: 40,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
  },
  pollBar: { position: 'absolute', height: '100%', backgroundColor: '#FFF3EC', borderRadius: 8 },
  pollOptionContent: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, zIndex: 1 },
  pollOptionText: { fontSize: 14, color: '#374151', fontWeight: '500' },
  pollOptionVoted: { color: '#FF6B00', fontWeight: 'bold' },
  pollPct: { fontSize: 13, color: '#6B7280', fontWeight: '600' },
  pollMeta: { fontSize: 12, color: '#9CA3AF', textAlign: 'center', marginTop: 4 },

  // Post Actions
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 4,
  },
  voteGroup: { flexDirection: 'row', alignItems: 'center', marginRight: 4 },
  voteBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, padding: 6 },
  voteBtnActive: {},
  voteCount: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  voteCountActive: { color: '#FF6B00' },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flex: 1,
  },
  actionBtnText: { fontSize: 12, color: '#6B7280', fontWeight: '500' },

  // ── Post Detail Modal ──
  modalContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalBack: { padding: 6 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
  detailAuthorRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, marginBottom: 10, gap: 10 },
  detailAvatar: { width: 44, height: 44, borderRadius: 22 },
  detailAuthorName: { fontSize: 15, fontWeight: 'bold', color: '#1F2937' },
  detailAuthorMeta: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  detailText: { fontSize: 16, color: '#374151', lineHeight: 24, paddingHorizontal: 16, marginBottom: 12 },
  detailImage: { width: '100%', height: 260, marginBottom: 12 },
  detailGalleryImg: { width: 220, height: 180, borderRadius: 10, marginRight: 8 },
  detailActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, flex: 1, justifyContent: 'center' },
  detailActionActive: {},
  detailActionText: { fontSize: 13, color: '#6B7280', fontWeight: '600' },

  // Comments
  commentsSection: { paddingHorizontal: 16, paddingTop: 16 },
  commentsSectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  commentsSectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#1F2937' },
  sortRow: { flexDirection: 'row', gap: 8 },
  sortBtn: { fontSize: 13, color: '#9CA3AF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  sortBtnActive: { color: '#FF6B00', borderColor: '#FF6B00', fontWeight: 'bold' },
  commentItem: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  commentAvatar: { width: 36, height: 36, borderRadius: 18 },
  commentBody: { flex: 1 },
  commentHeaderRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 },
  commentAuthor: { fontSize: 13, fontWeight: 'bold', color: '#1F2937' },
  commentBadge: { fontSize: 11, color: '#FF6B00' },
  commentTime: { fontSize: 11, color: '#9CA3AF' },
  commentText: { fontSize: 14, color: '#374151', lineHeight: 20 },
  commentActions: { flexDirection: 'row', gap: 16, marginTop: 8 },
  commentActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  commentActionText: { fontSize: 12, color: '#9CA3AF' },
  commentReplyBtn: { fontSize: 12, color: '#6B7280', fontWeight: '600' },
  replyItem: { flexDirection: 'row', gap: 8, marginTop: 10, paddingLeft: 8, borderLeftWidth: 2, borderLeftColor: '#F3F4F6' },
  replyAvatar: { width: 28, height: 28, borderRadius: 14 },
  replyBody: { flex: 1 },
  replyAuthor: { fontSize: 12, fontWeight: 'bold', color: '#1F2937' },
  replyTime: { fontWeight: 'normal', color: '#9CA3AF' },
  replyText: { fontSize: 13, color: '#374151', lineHeight: 18, marginTop: 2 },

  // Comment Input
  commentInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#fff',
    gap: 10,
  },
  commentInputAvatar: { width: 34, height: 34, borderRadius: 17 },
  commentInputAvatarFallback: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#FF6B00',
    alignItems: 'center', justifyContent: 'center',
  },
  commentInputAvatarText: { color: '#fff', fontWeight: 'bold' },
  commentInputField: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    color: '#374151',
  },
  commentSendBtn: { padding: 8 },
  commentSendBtnDisabled: {},

  // ── Bottom Sheets ──
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' },
  bottomSheet: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
  },
  sheetHandle: { width: 40, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  sheetTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 },

  // Share
  shareGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 20 },
  shareItem: { width: (width - 96) / 3, alignItems: 'center' },
  shareIconBox: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  shareIconText: { fontSize: 26 },
  shareLabel: { fontSize: 12, color: '#374151', textAlign: 'center' },
  sheetCancelBtn: { paddingVertical: 14, borderRadius: 12, backgroundColor: '#F3F4F6', alignItems: 'center' },
  sheetCancelText: { fontSize: 15, fontWeight: '600', color: '#6B7280' },

  // Awards
  awardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  coinBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF3EC', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  coinText: { fontSize: 14, fontWeight: 'bold', color: '#FF6B00' },
  awardGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  awardItem: {
    width: (width - 68) / 4,
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F3F4F6',
  },
  awardItemSelected: { borderColor: '#FF6B00', backgroundColor: '#FFF3EC' },
  awardIconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  awardLabel: { fontSize: 10, fontWeight: '600', color: '#374151', textAlign: 'center' },
  awardCost: { fontSize: 9, color: '#9CA3AF', marginTop: 2 },
  awardControls: { gap: 12, marginBottom: 16 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24 },
  qtyBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { fontSize: 20, color: '#374151', fontWeight: 'bold' },
  qtyValue: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', minWidth: 40, textAlign: 'center' },
  awardSendBtn: { borderRadius: 14, overflow: 'hidden' },
  awardSendGradient: { paddingVertical: 14, alignItems: 'center' },
  awardSendText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },

  // ── Profile Menu ──
  profileMenuUser: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  profileMenuAvatar: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: '#FF6B00' },
  profileMenuAvatarFallback: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#FF6B00',
    alignItems: 'center', justifyContent: 'center',
  },
  profileMenuAvatarText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  profileMenuName: { fontSize: 17, fontWeight: 'bold', color: '#1F2937' },
  profileMenuEmail: { fontSize: 13, color: '#9CA3AF', marginTop: 2 },
  profileMenuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 12, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  profileMenuItemText: { flex: 1, fontSize: 15, color: '#374151' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 14, marginTop: 8 },
  logoutBtnText: { fontSize: 15, fontWeight: '600', color: '#EF4444' },

  // ── FAB ──
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 80,
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 10,
  },
  fabGradient: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },

  // ── Bottom Navigation ──
  bottomNav: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    alignItems: 'center',
    paddingHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 12,
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 6 },
  navItemCreate: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: -8 },
  navCreateGradient: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', shadowColor: '#FF6B00', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  navIconWrap: { position: 'relative' },
  navBadge: { position: 'absolute', top: -4, right: -8, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  navBadgeText: { fontSize: 9, color: '#fff', fontWeight: 'bold' },
  navLabel: { fontSize: 10, color: '#9CA3AF', marginTop: 3 },
  navLabelActive: { color: '#FF6B00', fontWeight: '600' },
});
