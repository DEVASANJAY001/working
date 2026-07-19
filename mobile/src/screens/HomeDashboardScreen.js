import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ImageBackground,
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  Dimensions,
  Animated,
  Easing,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { safeStorage } from '../utils/storage';

const { width, height } = Dimensions.get('window');
const headerBgImage = require('../../assets/image.png');

// Helper for Time-based Dynamic Greeting
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

// Mock Communities
const recentCommunities = [
  { id: 'rc1', name: 'Chennai Techies', members: '12.4k', icon: 'code-slash', color: '#7C3AED' },
  { id: 'rc2', name: 'Desi Foodies', members: '45.2k', icon: 'restaurant', color: '#EF4444' },
  { id: 'rc3', name: 'Green Earth India', members: '8.1k', icon: 'leaf', color: '#10B981' },
  { id: 'rc4', name: 'Startup Founders', members: '19.8k', icon: 'rocket', color: '#3B82F6' },
  { id: 'rc5', name: 'Chennai Rains Alert', members: '34.1k', icon: 'cloud-rain', color: '#06B6D4' },
];

const joinedCommunities = [
  { id: 'jc1', name: 'Chennai Techies', members: '12.4k', icon: 'code-slash', color: '#7C3AED' },
  { id: 'jc2', name: 'Desi Foodies', members: '45.2k', icon: 'restaurant', color: '#EF4444' },
  { id: 'jc3', name: 'TN Photography', members: '15.6k', icon: 'camera', color: '#F59E0B' },
  { id: 'jc4', name: 'Crypto & AI South', members: '9.3k', icon: 'hardware-chip', color: '#8B5CF6' },
];

export default function HomeDashboardScreen({ onLogout, onCreatePress }) {
  const [activeTab, setActiveTab] = useState('Home Feed'); 
  const [posts, setPosts] = useState(initialPosts);
  
  // Profile state automatically synced with safeStorage / AWS User Profile
  const [userName, setUserName] = useState('Devasanjay');
  const [userHandle, setUserHandle] = useState('devasanjay');
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    async function loadUserProfile() {
      try {
        const stored = await safeStorage.getItem('user_profile');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.fullName) setUserName(parsed.fullName);
          if (parsed.username) setUserHandle(parsed.username);
          if (parsed.profileImage !== undefined) setProfileImage(parsed.profileImage);
        }
      } catch (e) {
        console.log('Error loading user profile:', e);
      }
    }
    loadUserProfile();
  }, []);

  // Navigation & Modal Overlays States
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

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllCommunities, setShowAllCommunities] = useState(false);
  const [showAllMessages, setShowAllMessages] = useState(false);

  // New Community form state
  const [communityName, setCommunityName] = useState('');
  const [communityDesc, setCommunityDesc] = useState('');

  // Coin Balance
  const [coinsBalance, setCoinsBalance] = useState(1250);
  const [selectedAward, setSelectedAward] = useState(null);
  const [awardQuantity, setAwardQuantity] = useState(1);

  // Sorting for Comments
  const [commentSort, setCommentSort] = useState('Top'); 
  const [newCommentText, setNewCommentText] = useState('');

  // Animation values for smooth 3-dots drawer fade-in and slide-up
  const drawerFadeAnim = useRef(new Animated.Value(0)).current;
  const drawerSlideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (showThreeDotsDrawer) {
      Animated.parallel([
        Animated.timing(drawerFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.spring(drawerSlideAnim, {
          toValue: 0,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      drawerFadeAnim.setValue(0);
      drawerSlideAnim.setValue(300);
    }
  }, [showThreeDotsDrawer]);

  const closeDrawerWithAnim = (callback) => {
    Animated.parallel([
      Animated.timing(drawerFadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(drawerSlideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      setShowThreeDotsDrawer(false);
      if (callback) callback();
    });
  };

  // Handle Logout Confirmation
  const handleLogoutPress = () => {
    closeDrawerWithAnim(() => {
      setShowLogoutConfirm(true);
    });
  };

  const confirmLogoutAction = () => {
    setShowLogoutConfirm(false);
    if (onLogout) onLogout();
  };

  // Handle Post Like
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

  // Handle Follow
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

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* 1. Header with Image Background (assets/image.png), Dark Overlay & Time-Based Greeting */}
      <View style={styles.headerContainer}>
        <ImageBackground 
          source={headerBgImage} 
          style={styles.headerBg}
          imageStyle={styles.headerBgImgStyle}
        >
          <LinearGradient 
            colors={['rgba(15, 23, 42, 0.65)', 'rgba(30, 27, 75, 0.85)']} 
            style={styles.headerGradientOverlay}
          >
            <View style={styles.topHeader}>
              <View style={styles.headerRow}>
                <View style={styles.userProfile}>
                  <TouchableOpacity onPress={() => setProfileImage(prev => prev ? null : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80')}>
                    {profileImage ? (
                      <Image 
                        source={{ uri: profileImage }} 
                        style={styles.avatarImg} 
                      />
                    ) : (
                      <LinearGradient colors={['#7C3AED', '#F97316']} style={styles.initialAvatar}>
                        <Text style={styles.initialAvatarText}>
                          {userName.trim().charAt(0).toUpperCase() || 'D'}
                        </Text>
                      </LinearGradient>
                    )}
                  </TouchableOpacity>
                  <View style={styles.userText}>
                    <Text style={styles.userName}>{userName}</Text>
                    <Text style={styles.greetingText}>@{userHandle} • {getDynamicGreeting()}</Text>
                  </View>
                </View>
                
                <View style={styles.headerActions}>
                  <TouchableOpacity style={styles.actionIconButtonHeader} onPress={() => setShowSearchWindow(true)}>
                    <Ionicons name="search" size={19} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionIconButtonHeader} onPress={() => setShowThreeDotsDrawer(true)}>
                    <Ionicons name="ellipsis-vertical" size={19} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>

      {/* 2. Segmented Control Feed Tabs with Purple Sliding Accent */}
      <View style={styles.tabsRowContainer}>
        <View style={styles.tabsRow}>
          {[
            { id: 'Home Feed', label: 'For You' },
            { id: 'Local Feed', label: 'Local' },
            { id: 'Trending Feed', label: 'Trending' },
            { id: 'Following Feed', label: 'Following' }
          ].map((tab) => {
            const isTabActive = activeTab === tab.id;
            return (
              <TouchableOpacity key={tab.id} style={styles.tabItem} onPress={() => setActiveTab(tab.id)}>
                <Text style={[styles.tabText, isTabActive && styles.tabTextActive]}>{tab.label}</Text>
                {isTabActive && <View style={styles.tabIndicator} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 3. Feeds Scroll Container */}
      <ScrollView style={styles.mainFeed} showsVerticalScrollIndicator={false}>
        
        {/* Render Feed HOM_001 (Home Feed) */}
        {activeTab === 'Home Feed' && (
          <View>
            {/* Redesigned 🔥 Trending Today Section (Horizontal Card Carousel) */}
            <View style={styles.trendingSectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🔥 Trending Today</Text>
                <TouchableOpacity><Text style={styles.seeAllLink}>See All →</Text></TouchableOpacity>
              </View>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trendingCardsScroll}>
                {[
                  { tag: '# Chennai Rains', count: '12.4K Posts', trend: '+22%', icon: 'cloud-rain', color: '#06B6D4', bg: '#ECFEFF' },
                  { tag: '# Metro Phase 2', count: '8.7K Posts', trend: '+14%', icon: 'subway', color: '#7C3AED', bg: '#F5F3FF' },
                  { tag: '# AI Jobs', count: '6.8K Posts', trend: '+10%', icon: 'hardware-chip', color: '#10B981', bg: '#ECFDF5' },
                  { tag: '# IPL 2025', count: '5.4K Posts', trend: '+18%', icon: 'trophy', color: '#F59E0B', bg: '#FFFBEB' }
                ].map((item, idx) => (
                  <View key={idx} style={styles.redesignedTrendingCard}>
                    <View style={styles.cardHeaderRow}>
                      <View style={[styles.cardIconBox, { backgroundColor: item.bg }]}>
                        <Ionicons name={item.icon} size={16} color={item.color} />
                      </View>
                      <View style={styles.growthBadge}>
                        <Text style={styles.growthText}>▲ {item.trend}</Text>
                      </View>
                    </View>

                    <Text style={styles.cardTagText}>{item.tag}</Text>
                    <Text style={styles.cardCountText}>{item.count}</Text>

                    <View style={styles.miniTrendBarBg}>
                      <View style={[styles.miniTrendBarFill, { width: `${65 + idx * 10}%`, backgroundColor: item.color }]} />
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Categories */}
            <View style={styles.categoriesSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Categories</Text>
                <TouchableOpacity><Text style={styles.seeAllLink}>View All →</Text></TouchableOpacity>
              </View>
              <View style={styles.categoriesRow}>
                {[
                  { label: 'Issues', icon: 'warning', color: '#EF4444', bg: '#FEE2E2' },
                  { label: 'Talks', icon: 'chatbubbles', color: '#F59E0B', bg: '#FEF3C7' },
                  { label: 'News', icon: 'newspaper', color: '#3B82F6', bg: '#DBEAFE' },
                  { label: 'Polls', icon: 'bar-chart', color: '#10B981', bg: '#D1FAE5' },
                  { label: 'Events', icon: 'calendar', color: '#8B5CF6', bg: '#EDE9FE' }
                ].map((cat, idx) => (
                  <TouchableOpacity key={idx} style={styles.categoryItem}>
                    <View style={[styles.categoryIconBg, { backgroundColor: cat.bg }]}>
                      <Ionicons name={cat.icon} size={20} color={cat.color} />
                    </View>
                    <Text style={styles.categoryLabel}>{cat.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Stories */}
            <View style={styles.storiesContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesScroll}>
                {stories.map((story) => (
                  <View key={story.id} style={styles.storyItem}>
                    {story.active ? (
                      <LinearGradient colors={['#7C3AED', '#F97316']} style={styles.storyRingGradient}>
                        <View style={styles.storyImageInner}>
                          <Image source={{ uri: story.image }} style={styles.storyImage} />
                        </View>
                      </LinearGradient>
                    ) : (
                      <View style={styles.storyRing}>
                        <Image source={{ uri: story.image }} style={styles.storyImage} />
                      </View>
                    )}
                    <Text style={styles.storyName} numberOfLines={1}>{story.name}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            {posts.filter(p => p.id === 'post_1').map(post => renderPostCard(post))}
          </View>
        )}

        {/* Render Feed HOM_002 (Local Feed) */}
        {activeTab === 'Local Feed' && (
          <View>
            <View style={styles.localLocationBar}>
              <Ionicons name="location" size={18} color="#7C3AED" />
              <Text style={styles.localLocationText}>Chennai, Tamil Nadu</Text>
              <Ionicons name="chevron-down" size={16} color="#6B7280" style={{ marginLeft: 6 }} />
            </View>

            <LinearGradient colors={['#7C3AED', '#EC4899']} style={styles.liveBanner}>
              <View style={styles.liveBannerContent}>
                <Text style={styles.liveBannerTitle}>Live Updates from your city</Text>
                <Text style={styles.liveBannerSubtitle}>Stay informed about what's happening</Text>
                <TouchableOpacity style={styles.viewLiveBtn}>
                  <Text style={styles.viewLiveBtnText}>View Live</Text>
                </TouchableOpacity>
              </View>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1596422846543-75c6fc18a523?w=200&auto=format&fit=crop&q=80' }} 
                style={styles.liveBannerImg} 
              />
            </LinearGradient>

            <View style={styles.localPostsHeader}>
              <Text style={styles.localPostsTitle}>What's happening near you</Text>
              <TouchableOpacity><Text style={styles.seeAllLink}>See All →</Text></TouchableOpacity>
            </View>

            {[
              {
                id: 'loc_1',
                title: 'Road work on Anna Salai',
                desc: 'Road renovation work is in progress. Plan your travel accordingly.',
                time: '2h ago',
                likes: 123,
                comments: 32,
                tag: 'Traffic',
                tagColor: '#F59E0B',
                tagBg: '#FEF3C7',
              },
              {
                id: 'loc_2',
                title: 'Water Supply Update',
                desc: 'Water supply will be affected in Adyar, Besant Nagar area.',
                time: '3h ago',
                likes: 87,
                comments: 0,
                tag: 'Utility',
                tagColor: '#3B82F6',
                tagBg: '#DBEAFE',
              },
              {
                id: 'loc_3',
                title: 'Garbage Collection Drive',
                desc: 'Special drive starting this Sunday in Ward 112.',
                time: '4h ago',
                likes: 64,
                comments: 15,
                tag: 'Cleanliness',
                tagColor: '#10B981',
                tagBg: '#D1FAE5',
              }
            ].map((item) => (
              <View key={item.id} style={styles.localPostCard}>
                <View style={styles.localPostHeader}>
                  <View style={[styles.localTagBadge, { backgroundColor: item.tagBg }]}>
                    <Text style={[styles.localTagText, { color: item.tagColor }]}>{item.tag}</Text>
                  </View>
                  <Text style={styles.localPostTime}>{item.time}</Text>
                </View>
                <Text style={styles.localPostTitle}>{item.title}</Text>
                <Text style={styles.localPostDesc}>{item.desc}</Text>
                
                <View style={styles.localPostFooter}>
                  <TouchableOpacity style={styles.localStatBtn}>
                    <Ionicons name="heart-outline" size={16} color="#6B7280" />
                    <Text style={styles.localStatText}>{item.likes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.localStatBtn}>
                    <Ionicons name="chatbubble-outline" size={16} color="#6B7280" />
                    <Text style={styles.localStatText}>{item.comments}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.localShareBtn}>
                    <Ionicons name="share-social-outline" size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Render Feed HOM_003 (Trending Feed) */}
        {activeTab === 'Trending Feed' && (
          <View>
            <View style={styles.trendingTopicsCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🔥 Trending Topics</Text>
                <TouchableOpacity><Text style={styles.seeAllLink}>See All →</Text></TouchableOpacity>
              </View>

              <View style={styles.trendingTopicsList}>
                {[
                  { rank: '01', tag: '# Chennai Rains', count: '12.5K posts', trend: '+ 22%' },
                  { rank: '02', tag: '# AI Jobs', count: '8.1K posts', trend: '+ 18%' },
                  { rank: '03', tag: '# Metro Phase 2', count: '6.7K posts', trend: '+ 16%' },
                  { rank: '04', tag: '# TN Budget 2025', count: '5.3K posts', trend: '+ 12%' },
                  { rank: '05', tag: '# IPL 2025', count: '4.0K posts', trend: '+ 10%' }
                ].map((item) => (
                  <View key={item.rank} style={styles.topicRankRow}>
                    <Text style={styles.topicRankNumber}>{item.rank}</Text>
                    <View style={styles.topicRankInfo}>
                      <Text style={styles.topicRankTag}>{item.tag}</Text>
                      <Text style={styles.topicRankCount}>{item.count}</Text>
                    </View>
                    <View style={styles.topicTrendBadge}>
                      <Text style={styles.topicTrendText}>{item.trend}</Text>
                      <Ionicons name="trending-up" size={14} color="#10B981" />
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View style={{ marginTop: 16 }}>
              <Text style={styles.sectionTitle}>Trending Post</Text>
            </View>
            {posts.filter(p => p.id === 'post_2').map(post => renderPostCard(post))}
          </View>
        )}

        {/* Render Feed HOM_004 (Following Feed) */}
        {activeTab === 'Following Feed' && (
          <View>
            <View style={styles.storiesContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesScroll}>
                {stories.slice(1).map((story) => (
                  <View key={story.id} style={styles.storyItem}>
                    <View style={styles.storyRing}>
                      <Image source={{ uri: story.image }} style={styles.storyImage} />
                    </View>
                    <Text style={styles.storyName} numberOfLines={1}>{story.name}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            {posts.filter(p => p.id === 'post_3').map(post => renderPostCard(post))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* 4. Bottom Custom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#7C3AED" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="compass-outline" size={24} color="#9CA3AF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButtonContainer} onPress={onCreatePress}>
          <LinearGradient colors={['#7C3AED', '#F97316']} style={styles.addButtonGradient}>
            <Ionicons name="add" size={28} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="chatbubbles-outline" size={24} color="#9CA3AF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* THREE-DOTS NAVIGATION DRAWER MODAL WITH FADE-IN BACKDROP & SPRING SLIDE-UP */}
      <Modal visible={showThreeDotsDrawer} transparent animationType="none" onRequestClose={() => closeDrawerWithAnim()}>
        <View style={styles.modalFullContainer}>
          <Animated.View style={[styles.drawerOverlay, { opacity: drawerFadeAnim }]}>
            <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={() => closeDrawerWithAnim()} />
          </Animated.View>

          <Animated.View style={[styles.drawerContent, { transform: [{ translateY: drawerSlideAnim }] }]}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Menu</Text>
              <TouchableOpacity onPress={() => closeDrawerWithAnim()}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.drawerScroll} showsVerticalScrollIndicator={false}>
              <TouchableOpacity style={styles.drawerNavItem} onPress={() => closeDrawerWithAnim(() => alert("Navigating to Discovery"))}>
                <Ionicons name="compass-outline" size={22} color="#7C3AED" />
                <Text style={styles.drawerNavLabel}>Discover Communities</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.drawerNavItem} onPress={() => closeDrawerWithAnim(() => setShowStartCommunity(true))}>
                <Ionicons name="add-circle-outline" size={22} color="#7C3AED" />
                <Text style={styles.drawerNavLabel}>Start a Community</Text>
              </TouchableOpacity>

              <View style={styles.drawerDivider} />

              <View style={styles.drawerSectionHeader}>
                <Text style={styles.drawerSectionTitle}>Recently Visited Communities</Text>
                <TouchableOpacity onPress={() => closeDrawerWithAnim(() => setShowSeeAllRecent(true))}>
                  <Text style={styles.seeAllText}>See All →</Text>
                </TouchableOpacity>
              </View>

              {recentCommunities.slice(0, 3).map(comm => (
                <TouchableOpacity key={comm.id} style={styles.communityRow} onPress={() => closeDrawerWithAnim(() => alert(`Opening ${comm.name}`))}>
                  <View style={[styles.communityIconBadge, { backgroundColor: `${comm.color}15` }]}>
                    <Ionicons name={comm.icon} size={18} color={comm.color} />
                  </View>
                  <View style={styles.communityMeta}>
                    <Text style={styles.communityName}>{comm.name}</Text>
                    <Text style={styles.communityMembers}>{comm.members} members</Text>
                  </View>
                </TouchableOpacity>
              ))}

              <View style={styles.drawerDivider} />

              <Text style={styles.drawerSectionTitle}>Your Communities</Text>
              {joinedCommunities.map(comm => (
                <TouchableOpacity key={comm.id} style={styles.communityRow} onPress={() => closeDrawerWithAnim(() => alert(`Opening ${comm.name}`))}>
                  <View style={[styles.communityIconBadge, { backgroundColor: `${comm.color}15` }]}>
                    <Ionicons name={comm.icon} size={18} color={comm.color} />
                  </View>
                  <View style={styles.communityMeta}>
                    <Text style={styles.communityName}>{comm.name}</Text>
                    <Text style={styles.communityMembers}>{comm.members} members</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.drawerLogoutBtn} onPress={handleLogoutPress}>
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              <Text style={styles.drawerLogoutText}>Logout</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      {/* LOGOUT CONFIRMATION MODAL */}
      <Modal visible={showLogoutConfirm} animationType="fade" transparent>
        <View style={styles.modalBg}>
          <View style={styles.logoutConfirmCard}>
            <View style={styles.logoutIconCircle}>
              <Ionicons name="log-out" size={28} color="#EF4444" />
            </View>
            <Text style={styles.logoutConfirmTitle}>Are you sure you want to logout?</Text>
            <Text style={styles.logoutConfirmSubtitle}>You will need to sign in again to access your communities and feeds.</Text>

            <View style={styles.logoutActionRow}>
              <TouchableOpacity style={styles.cancelLogoutBtn} onPress={() => setShowLogoutConfirm(false)}>
                <Text style={styles.cancelLogoutText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmLogoutBtn} onPress={confirmLogoutAction}>
                <Text style={styles.confirmLogoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* SEE ALL RECENT COMMUNITIES MODAL */}
      <Modal visible={showSeeAllRecent} animationType="slide" transparent>
        <View style={styles.bottomSheetOverlay}>
          <View style={styles.commentSheetContent}>
            <View style={styles.sheetHeader}>
              <TouchableOpacity onPress={() => setShowSeeAllRecent(false)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
              <Text style={styles.sheetTitle}>Recently Visited Communities</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10 }}>
              {recentCommunities.map(comm => (
                <TouchableOpacity key={comm.id} style={styles.communityRow} onPress={() => { setShowSeeAllRecent(false); alert(`Opening ${comm.name}`); }}>
                  <View style={[styles.communityIconBadge, { backgroundColor: `${comm.color}15` }]}>
                    <Ionicons name={comm.icon} size={18} color={comm.color} />
                  </View>
                  <View style={styles.communityMeta}>
                    <Text style={styles.communityName}>{comm.name}</Text>
                    <Text style={styles.communityMembers}>{comm.members} members</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* START A COMMUNITY MODAL */}
      <Modal visible={showStartCommunity} animationType="fade" transparent>
        <View style={styles.modalBg}>
          <View style={styles.startCommunityContent}>
            <Text style={styles.modalHeading}>Start a Community</Text>
            <TextInput
              style={styles.communityInput}
              placeholder="Community Name"
              placeholderTextColor="#9CA3AF"
              value={communityName}
              onChangeText={setCommunityName}
            />
            <TextInput
              style={[styles.communityInput, { height: 80, textAlignVertical: 'top' }]}
              placeholder="Description (Optional)"
              placeholderTextColor="#9CA3AF"
              multiline
              value={communityDesc}
              onChangeText={setCommunityDesc}
            />
            <View style={styles.communityActionRow}>
              <TouchableOpacity style={styles.cancelCommunityBtn} onPress={() => setShowStartCommunity(false)}>
                <Text style={styles.cancelCommunityText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.createCommunityBtn} 
                onPress={() => {
                  if (!communityName.trim()) { alert("Please enter a community name."); return; }
                  alert(`Community "${communityName}" created!`);
                  setCommunityName('');
                  setCommunityDesc('');
                  setShowStartCommunity(false);
                }}
              >
                <Text style={styles.createCommunityText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* SPOTLIGHT SLIDE-DOWN SINGLE-PAGE SEARCH OVERLAY */}
      <Modal visible={showSearchWindow} animationType="slide" transparent={false}>
        <View style={styles.searchWindowContainer}>
          <View style={styles.searchWindowHeader}>
            <View style={styles.searchBarInputContainer}>
              <Ionicons name="search" size={20} color="#7C3AED" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchWindowInput}
                placeholder="Search communities, topics, or messages..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity onPress={() => setShowSearchWindow(false)} style={styles.cancelSearchBtn}>
              <Text style={styles.cancelSearchText}>Close</Text>
            </TouchableOpacity>
          </View>

          {/* Single-Page Search Scroll view */}
          <ScrollView style={styles.searchResultsScroll} showsVerticalScrollIndicator={false}>
            {/* Top Section: Communities */}
            {(() => {
              const matchedCommunities = [...recentCommunities, ...joinedCommunities].filter((comm, index, self) => 
                index === self.findIndex((t) => t.id === comm.id) &&
                comm.name.toLowerCase().includes(searchQuery.toLowerCase())
              );
              const visibleCommunities = showAllCommunities ? matchedCommunities : matchedCommunities.slice(0, 3);

              return (
                <View style={styles.searchSectionBlock}>
                  <View style={styles.searchSectionHeaderRow}>
                    <Text style={styles.searchResultSectionTitle}>Communities ({matchedCommunities.length})</Text>
                    {matchedCommunities.length > 3 && !showAllCommunities && (
                      <TouchableOpacity onPress={() => setShowAllCommunities(true)}>
                        <Text style={styles.seeMoreBtnText}>See More →</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {visibleCommunities.length > 0 ? (
                    visibleCommunities.map(comm => (
                      <TouchableOpacity key={comm.id} style={styles.searchResultRow} onPress={() => { setShowSearchWindow(false); alert(`Navigating to ${comm.name}`); }}>
                        <View style={[styles.communityIconBadge, { backgroundColor: `${comm.color}15` }]}>
                          <Ionicons name={comm.icon} size={18} color={comm.color} />
                        </View>
                        <View style={styles.communityMeta}>
                          <Text style={styles.communityName}>{comm.name}</Text>
                          <Text style={styles.communityMembers}>{comm.members} members</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                      </TouchableOpacity>
                    ))
                  ) : (
                    <Text style={styles.emptySearchText}>No matching communities found.</Text>
                  )}
                </View>
              );
            })()}

            <View style={styles.searchSectionDivider} />

            {/* Bottom Section: Posts & Messages */}
            {(() => {
              const matchedPosts = posts.filter(p => p.text.toLowerCase().includes(searchQuery.toLowerCase()));
              const visiblePosts = showAllMessages ? matchedPosts : matchedPosts.slice(0, 3);

              return (
                <View style={styles.searchSectionBlock}>
                  <View style={styles.searchSectionHeaderRow}>
                    <Text style={styles.searchResultSectionTitle}>Posts & Messages ({matchedPosts.length})</Text>
                    {matchedPosts.length > 3 && !showAllMessages && (
                      <TouchableOpacity onPress={() => setShowAllMessages(true)}>
                        <Text style={styles.seeMoreBtnText}>See More →</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {visiblePosts.length > 0 ? (
                    visiblePosts.map(post => (
                      <TouchableOpacity key={post.id} style={styles.searchPostResultCard} onPress={() => { setShowSearchWindow(false); setSelectedPost(post); }}>
                        <View style={styles.searchPostAuthorRow}>
                          <Image source={{ uri: post.authorAvatar }} style={styles.searchPostAvatar} />
                          <Text style={styles.searchPostAuthorName}>{post.authorName}</Text>
                          <Text style={styles.searchPostTime}>• {post.time}</Text>
                        </View>
                        <Text style={styles.searchPostText} numberOfLines={2}>{post.text}</Text>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <Text style={styles.emptySearchText}>No matching posts found.</Text>
                  )}
                </View>
              );
            })()}

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </Modal>

    </View>
  );

  // Helper Post Card Renderer
  function renderPostCard(post) {
    return (
      <View key={post.id} style={styles.postCard}>
        <View style={styles.postHeader}>
          <View style={styles.authorInfo}>
            <Image source={{ uri: post.authorAvatar }} style={styles.authorAvatar} />
            <View>
              <Text style={styles.authorName}>{post.authorName}</Text>
              <Text style={styles.postTime}>@{post.authorHandle} • {post.time}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.moreBtn}>
            <Ionicons name="ellipsis-horizontal" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => setSelectedPost(post)}>
          <Text style={styles.postText}>{post.text}</Text>
        </TouchableOpacity>

        {post.image && (
          <TouchableOpacity onPress={() => setSelectedPost(post)}>
            <Image source={{ uri: post.image }} style={styles.postImage} resizeMode="cover" />
          </TouchableOpacity>
        )}

        {post.images && (
          <TouchableOpacity onPress={() => setSelectedPost(post)} style={styles.imageGridPreview}>
            {post.images.map((img, idx) => (
              <Image key={idx} source={{ uri: img }} style={styles.gridImageItemPreview} />
            ))}
          </TouchableOpacity>
        )}

        <View style={styles.postFooter}>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleToggleLike(post.id)}>
            <Ionicons name={post.isLiked ? "heart" : "heart-outline"} size={18} color={post.isLiked ? "#EF4444" : "#6B7280"} />
            <Text style={[styles.actionCount, post.isLiked && { color: '#EF4444' }]}>{post.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => { setSelectedPost(post); setShowComments(true); }}>
            <Ionicons name="chatbubble-outline" size={18} color="#6B7280" />
            <Text style={styles.actionCount}>{post.commentsCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => { setSelectedPost(post); setShowShare(true); }}>
            <Ionicons name="share-social-outline" size={18} color="#6B7280" />
            <Text style={styles.actionCount}>{post.shares}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => { setSelectedPost(post); setShowAwards(true); }}>
            <Ionicons name="gift-outline" size={18} color="#6B7280" />
            <Text style={styles.actionCount}>{post.awards}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, { marginLeft: 'auto' }]}>
            <Ionicons name="bookmark-outline" size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerContainer: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  headerBg: {
    width: '100%',
  },
  headerBgImgStyle: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerGradientOverlay: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  topHeader: {},
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  initialAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  initialAvatarText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: 'bold',
  },
  userText: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  greetingText: {
    fontSize: 11,
    color: '#CBD5E1',
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionIconButtonHeader: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsRowContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    position: 'relative',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  tabTextActive: {
    color: '#7C3AED',
    fontWeight: '700',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 28,
    height: 3,
    backgroundColor: '#7C3AED',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  mainFeed: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // REDESIGNED HORIZONTAL TRENDING CARDS
  trendingSectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  seeAllLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7C3AED',
  },
  trendingCardsScroll: {
    paddingRight: 16,
    gap: 12,
  },
  redesignedTrendingCard: {
    width: 170,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  growthBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  growthText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
  },
  cardTagText: {
    fontSize: 13,
    fontWeight: '750',
    color: '#1F2937',
  },
  cardCountText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
    marginBottom: 10,
  },
  miniTrendBarBg: {
    height: 4,
    width: '100%',
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
    overflow: 'hidden',
  },
  miniTrendBarFill: {
    height: '100%',
    borderRadius: 2,
  },

  categoriesSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryItem: {
    alignItems: 'center',
  },
  categoryIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4B5563',
  },
  storiesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  storiesScroll: {
    paddingHorizontal: 12,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 14,
    width: 60,
  },
  storyRingGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyImageInner: {
    width: '100%',
    height: '100%',
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  storyRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    padding: 2,
    overflow: 'hidden',
  },
  storyImage: {
    width: '100%',
    height: '100%',
    borderRadius: 26,
  },
  storyName: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
  },
  authorName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  postTime: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  moreBtn: {
    padding: 4,
  },
  postText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 19,
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 12,
  },
  imageGridPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  gridImageItemPreview: {
    width: '32%',
    height: 90,
    borderRadius: 8,
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionCount: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  bottomNav: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 4,
  },
  navItem: {
    padding: 8,
  },
  addButtonContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginTop: -20,
    elevation: 4,
    shadowColor: '#7C3AED',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    overflow: 'hidden',
  },
  addButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // THREE DOTS ANIMATED DRAWER STYLES
  modalFullContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  drawerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawerContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    maxHeight: height * 0.82,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  drawerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  drawerScroll: {
    flexGrow: 0,
    paddingTop: 12,
  },
  drawerNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  drawerNavLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  drawerDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 14,
  },
  drawerSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  drawerSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  seeAllText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
  },
  communityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  communityIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  communityMeta: {
    flex: 1,
    marginLeft: 12,
  },
  communityName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  communityMembers: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 1,
  },
  drawerLogoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: '#FEE2E2',
    borderRadius: 14,
    marginTop: 12,
  },
  drawerLogoutText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EF4444',
  },

  // LOGOUT CONFIRMATION MODAL STYLES
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoutConfirmCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    padding: 24,
    alignItems: 'center',
  },
  logoutIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoutConfirmTitle: {
    fontSize: 16,
    fontWeight: '750',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  logoutConfirmSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  logoutActionRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelLogoutBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelLogoutText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
  confirmLogoutBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#EF4444',
    alignItems: 'center',
  },
  confirmLogoutText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // START COMMUNITY MODAL STYLES
  startCommunityContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    padding: 20,
  },
  modalHeading: {
    fontSize: 16,
    fontWeight: '750',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  communityInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1F2937',
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
  },
  communityActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 8,
  },
  cancelCommunityBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  cancelCommunityText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  createCommunityBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#7C3AED',
  },
  createCommunityText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // UNIFIED SEARCH SLIDE DOWN STYLES
  searchWindowContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 44,
  },
  searchWindowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 10,
  },
  searchBarInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 42,
  },
  searchWindowInput: {
    flex: 1,
    fontSize: 13,
    color: '#1F2937',
  },
  cancelSearchBtn: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  cancelSearchText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7C3AED',
  },
  searchResultsScroll: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  searchSectionBlock: {
    marginBottom: 20,
  },
  searchSectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchResultSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  seeMoreBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
  },
  searchResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  searchPostResultCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  searchPostAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  searchPostAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  searchPostAuthorName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1F2937',
  },
  searchPostTime: {
    fontSize: 10,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  searchPostText: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 17,
  },
  searchSectionDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  emptySearchText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  localLocationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  localLocationText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 4,
  },
  liveBanner: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  liveBannerContent: {
    flex: 1,
  },
  liveBannerTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  liveBannerSubtitle: {
    color: '#F3E8FF',
    fontSize: 11,
    marginTop: 2,
  },
  viewLiveBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  viewLiveBtnText: {
    color: '#7C3AED',
    fontSize: 10,
    fontWeight: '700',
  },
  liveBannerImg: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginLeft: 12,
  },
  localPostsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  localPostsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  localPostCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  localPostHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  localTagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  localTagText: {
    fontSize: 9,
    fontWeight: '700',
  },
  localPostTime: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  localPostTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  localPostDesc: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 16,
  },
  localPostFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 14,
  },
  localStatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  localStatText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
  },
  localShareBtn: {
    marginLeft: 'auto',
  },
  trendingTopicsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  trendingTopicsList: {
    marginTop: 8,
  },
  topicRankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  topicRankNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: '#7C3AED',
    width: 28,
  },
  topicRankInfo: {
    flex: 1,
  },
  topicRankTag: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  topicRankCount: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 1,
  },
  topicTrendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  topicTrendText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },
  bottomSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  commentSheetContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '75%',
    paddingBottom: 20,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sheetTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
});
