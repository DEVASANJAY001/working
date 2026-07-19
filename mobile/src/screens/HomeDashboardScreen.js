import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  Dimensions,
  Share 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

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
  
  // Profile Picture state (defaults to image, toggleable to test initial letter avatar)
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80');

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

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTab, setSearchTab] = useState('Communities'); 

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
  
  // Mock Comments List
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

  // Add Comment
  const handleAddComment = () => {
    if (!newCommentText.trim()) return;
    const newComment = {
      id: `c_${Date.now()}`,
      author: 'Devasanjay',
      handle: 'devasanjay',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      time: 'Just now',
      text: newCommentText,
      likes: 0,
      isLiked: false,
      replies: []
    };
    setCommentsList([newComment, ...commentsList]);
    setNewCommentText('');

    if (selectedPost) {
      setPosts(prev => prev.map(p => {
        if (p.id === selectedPost.id) {
          return { ...p, commentsCount: p.commentsCount + 1 };
        }
        return p;
      }));
      setSelectedPost(prev => ({ ...prev, commentsCount: prev.commentsCount + 1 }));
    }
  };

  // Send Award
  const handleSendAward = () => {
    if (!selectedAward) return;
    const cost = selectedAward.coins * awardQuantity;
    if (coinsBalance < cost) {
      alert("Insufficient coins balance!");
      return;
    }
    setCoinsBalance(prev => prev - cost);
    setShowAwards(false);
    
    if (selectedPost) {
      setPosts(prev => prev.map(p => {
        if (p.id === selectedPost.id) {
          return { ...p, awards: p.awards + awardQuantity };
        }
        return p;
      }));
      setSelectedPost(prev => ({ ...prev, awards: prev.awards + awardQuantity }));
    }
    alert(`Successfully sent ${awardQuantity} ${selectedAward.label} Award(s)!`);
  };

  // Award Types Definition
  const awardsList = [
    { id: 'aw1', label: 'Excellent', coins: 100, icon: 'star', color: '#FBBF24' },
    { id: 'aw2', label: 'Inspiring', coins: 200, icon: 'heart', color: '#EC4899' },
    { id: 'aw3', label: 'Brilliant', coins: 500, icon: 'flash', color: '#3B82F6' },
    { id: 'aw4', label: 'Superb', coins: 800, icon: 'ribbon', color: '#10B981' },
    { id: 'aw5', label: 'Outstanding', coins: 1000, icon: 'trophy', color: '#F59E0B' },
    { id: 'aw6', label: 'Legendary', coins: 2000, icon: 'flame', color: '#EF4444' },
    { id: 'aw7', label: 'Epic', coins: 5000, icon: 'shield', color: '#8B5CF6' },
    { id: 'aw8', label: 'Diamond', coins: 10000, icon: 'diamond', color: '#06B6D4' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* 1. Header (Greeting + Brand + Avatar Fallback + Search & 3-Dots Action) */}
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
                  <Text style={styles.initialAvatarText}>D</Text>
                </LinearGradient>
              )}
            </TouchableOpacity>
            <View style={styles.userText}>
              <Text style={styles.userName}>Devasanjay 👋</Text>
              <Text style={styles.greetingText}>Good Morning</Text>
            </View>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionIconButton} onPress={() => setShowSearchWindow(true)}>
              <Ionicons name="search" size={20} color="#1F2937" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionIconButton} onPress={() => setShowThreeDotsDrawer(true)}>
              <Ionicons name="ellipsis-vertical" size={20} color="#1F2937" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 2. Top Feeds Swiper Navigation */}
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

      {/* 3. Feeds Container */}
      <ScrollView style={styles.mainFeed} showsVerticalScrollIndicator={false}>
        
        {/* Render Feed HOM_001 (Home Feed) */}
        {activeTab === 'Home Feed' && (
          <View>
            {/* Top Trending Header section */}
            <View style={styles.trendingSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🔥 Top Trending Today</Text>
                <TouchableOpacity><Text style={styles.seeAllLink}>See All</Text></TouchableOpacity>
              </View>
              
              <View style={styles.trendingGrid}>
                {[
                  { tag: '# Chennai Rains', count: '12.5K posts', trend: '+22%' },
                  { tag: '# Metro Phase 2', count: '8.7K posts', trend: '+18%' },
                  { tag: '# Traffic Updates', count: '6.2K posts', trend: '+14%' },
                  { tag: '# IPL 2025', count: '5.4K posts', trend: '+12%' }
                ].map((item, idx) => (
                  <View key={idx} style={styles.trendingCard}>
                    <Text style={styles.trendingTag}>{item.tag}</Text>
                    <Text style={styles.trendingCount}>{item.count}</Text>
                    <Text style={styles.trendingPercentage}>▲ {item.trend}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Categories Horizontal */}
            <View style={styles.categoriesSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Categories</Text>
                <TouchableOpacity><Text style={styles.seeAllLink}>View All</Text></TouchableOpacity>
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

            {/* Stories Horizontal */}
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

            {/* Infinite Feed - Post 1 */}
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
              <TouchableOpacity><Text style={styles.seeAllLink}>See All</Text></TouchableOpacity>
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
                <TouchableOpacity><Text style={styles.seeAllLink}>See All</Text></TouchableOpacity>
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

      {/* 4. Bottom Custom Navigation bar */}
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

      {/* 5. POST DETAIL VIEW (PST_001) MODAL */}
      {selectedPost && (
        <Modal visible={true} animationType="slide" onRequestClose={() => setSelectedPost(null)}>
          <View style={styles.detailContainer}>
            <View style={styles.detailHeader}>
              <TouchableOpacity onPress={() => setSelectedPost(null)} style={styles.backBtnWrapper}>
                <Ionicons name="arrow-back" size={24} color="#1F2937" />
              </TouchableOpacity>
              <Text style={styles.detailHeaderTitle}>Post</Text>
              <TouchableOpacity>
                <Ionicons name="ellipsis-horizontal" size={20} color="#1F2937" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
              <View style={styles.detailAuthorRow}>
                <Image source={{ uri: selectedPost.authorAvatar }} style={styles.detailAvatar} />
                <View style={styles.detailAuthorText}>
                  <Text style={styles.detailAuthorName}>{selectedPost.authorName}</Text>
                  <Text style={styles.detailAuthorHandle}>@{selectedPost.authorHandle}</Text>
                </View>
                <TouchableOpacity 
                  style={[styles.followBtn, selectedPost.isFollowing && styles.followingBtn]} 
                  onPress={() => handleToggleFollow(selectedPost.id)}
                >
                  <Text style={[styles.followBtnText, selectedPost.isFollowing && styles.followingBtnText]}>
                    {selectedPost.isFollowing ? 'Following' : 'Follow'}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.detailBodyText}>{selectedPost.text}</Text>

              {selectedPost.image && (
                <Image source={{ uri: selectedPost.image }} style={styles.detailPostImage} resizeMode="cover" />
              )}
              {selectedPost.images && (
                <View style={styles.imageGrid}>
                  {selectedPost.images.map((img, idx) => (
                    <Image key={idx} source={{ uri: img }} style={styles.gridImageItem} />
                  ))}
                </View>
              )}

              <Text style={styles.detailTimestamp}>9:41 AM - 20 May 2026</Text>
              
              <View style={styles.statsDivider} />
              <View style={styles.statsRow}>
                <Text style={styles.statItem}><Text style={styles.statBold}>{selectedPost.likes}</Text> Likes</Text>
                <Text style={styles.statItem}><Text style={styles.statBold}>{selectedPost.commentsCount}</Text> Comments</Text>
                <Text style={styles.statItem}><Text style={styles.statBold}>{selectedPost.shares}</Text> Shares</Text>
                <Text style={styles.statItem}><Text style={styles.statBold}>{selectedPost.awards}</Text> Awards</Text>
              </View>
              <View style={styles.statsDivider} />

              <View style={styles.interactionRow}>
                <TouchableOpacity style={styles.interactBtn} onPress={() => handleToggleLike(selectedPost.id)}>
                  <Ionicons name={selectedPost.isLiked ? "heart" : "heart-outline"} size={22} color={selectedPost.isLiked ? "#EF4444" : "#4B5563"} />
                  <Text style={styles.interactBtnText}>Like</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.interactBtn} onPress={() => setShowComments(true)}>
                  <Ionicons name="chatbubble-outline" size={20} color="#4B5563" />
                  <Text style={styles.interactBtnText}>Comment</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.interactBtn} onPress={() => setShowShare(true)}>
                  <Ionicons name="share-social-outline" size={20} color="#4B5563" />
                  <Text style={styles.interactBtnText}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.interactBtn} onPress={() => setShowAwards(true)}>
                  <Ionicons name="gift-outline" size={20} color="#4B5563" />
                  <Text style={styles.interactBtnText}>Award</Text>
                </TouchableOpacity>
              </View>

              <View style={{ height: 40 }} />
            </ScrollView>
          </View>

          {/* 6. COMMENT THREAD MODAL (CMT_001) */}
          <Modal visible={showComments} animationType="slide" transparent>
            <View style={styles.bottomSheetOverlay}>
              <View style={styles.commentSheetContent}>
                <View style={styles.sheetHeader}>
                  <TouchableOpacity onPress={() => setShowComments(false)}>
                    <Ionicons name="chevron-down" size={24} color="#4B5563" />
                  </TouchableOpacity>
                  <Text style={styles.sheetTitle}>Comments</Text>
                  <View style={{ width: 24 }} />
                </View>

                <View style={styles.commentSortTabs}>
                  {['Top', 'Latest'].map(sort => (
                    <TouchableOpacity 
                      key={sort} 
                      style={[styles.sortTab, commentSort === sort && styles.sortTabActive]}
                      onPress={() => setCommentSort(sort)}
                    >
                      <Text style={[styles.sortTabText, commentSort === sort && styles.sortTabTextActive]}>{sort}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <ScrollView style={styles.commentsList} showsVerticalScrollIndicator={false}>
                  {commentsList.map(comment => (
                    <View key={comment.id} style={styles.commentItem}>
                      <View style={styles.commentMain}>
                        <Image source={{ uri: comment.avatar }} style={styles.commentAvatar} />
                        <View style={styles.commentTextContent}>
                          <Text style={styles.commentAuthor}>
                            {comment.author} <Text style={styles.commentHandle}>@{comment.handle}</Text>
                          </Text>
                          <Text style={styles.commentText}>{comment.text}</Text>
                        </View>
                      </View>

                      {comment.replies && comment.replies.map(reply => (
                        <View key={reply.id} style={styles.replyItem}>
                          <Image source={{ uri: reply.avatar }} style={styles.replyAvatar} />
                          <View style={styles.commentTextContent}>
                            <Text style={styles.commentAuthor}>
                              {reply.author} <Text style={styles.commentHandle}>@{reply.handle}</Text>
                              {reply.isAuthor && <Text style={styles.authorBadge}> • Author</Text>}
                            </Text>
                            <Text style={styles.commentText}>{reply.text}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  ))}
                </ScrollView>

                <View style={styles.commentInputRow}>
                  <TextInput
                    style={styles.commentTextInput}
                    placeholder="Add a comment..."
                    placeholderTextColor="#9CA3AF"
                    value={newCommentText}
                    onChangeText={setNewCommentText}
                  />
                  <TouchableOpacity style={styles.sendCommentBtn} onPress={handleAddComment}>
                    <Ionicons name="send" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* 7. SHARE SHEET MODAL (SHR_001) */}
          <Modal visible={showShare} animationType="slide" transparent>
            <View style={styles.bottomSheetOverlay}>
              <View style={styles.shareSheetContent}>
                <View style={styles.sheetHeader}>
                  <Text style={styles.sheetTitle}>Share Post</Text>
                  <TouchableOpacity onPress={() => setShowShare(false)}>
                    <Ionicons name="close" size={22} color="#4B5563" />
                  </TouchableOpacity>
                </View>

                <View style={styles.shareGrid}>
                  {[
                    { label: 'WhatsApp', icon: 'logo-whatsapp', color: '#25D366', bg: '#DCFCE7' },
                    { label: 'Telegram', icon: 'paper-plane', color: '#0088CC', bg: '#E0F2FE' },
                    { label: 'Stories', icon: 'camera', color: '#E1306C', bg: '#FCE7F3' },
                    { label: 'Messages', icon: 'chatbox', color: '#10B981', bg: '#D1FAE5' },
                    { label: 'Copy Link', icon: 'link', color: '#6B7280', bg: '#F3F4F6' },
                    { label: 'Facebook', icon: 'logo-facebook', color: '#1877F2', bg: '#DBEAFE' },
                    { label: 'X (Twitter)', icon: 'logo-twitter', color: '#1DA1F2', bg: '#E0F2FE' },
                  ].map((app, idx) => (
                    <TouchableOpacity 
                      key={idx} 
                      style={styles.shareItem}
                      onPress={() => {
                        setShowShare(false);
                        alert(`Shared to ${app.label}!`);
                      }}
                    >
                      <View style={[styles.shareIconBg, { backgroundColor: app.bg }]}>
                        <Ionicons name={app.icon} size={22} color={app.color} />
                      </View>
                      <Text style={styles.shareLabel}>{app.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity style={styles.cancelShareBtn} onPress={() => setShowShare(false)}>
                  <Text style={styles.cancelShareText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* 8. AWARD SHEET MODAL (AWD_001) */}
          <Modal visible={showAwards} animationType="slide" transparent>
            <View style={styles.bottomSheetOverlay}>
              <View style={styles.awardSheetContent}>
                <View style={styles.sheetHeader}>
                  <View>
                    <Text style={styles.sheetTitle}>Give an Award</Text>
                    <Text style={styles.sheetSubtitle}>Support the creator</Text>
                  </View>
                  <TouchableOpacity onPress={() => setShowAwards(false)}>
                    <Ionicons name="close" size={22} color="#4B5563" />
                  </TouchableOpacity>
                </View>

                <View style={styles.coinBalanceBar}>
                  <Ionicons name="wallet-outline" size={16} color="#D97706" />
                  <Text style={styles.coinBalanceText}>Your balance: {coinsBalance} Coins</Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.awardsGridScroll}>
                  <View style={styles.awardsGridRow}>
                    {awardsList.map(award => {
                      const isSelected = selectedAward?.id === award.id;
                      return (
                        <TouchableOpacity 
                          key={award.id}
                          style={[styles.awardCard, isSelected && styles.awardCardSelected]}
                          onPress={() => setSelectedAward(award)}
                        >
                          <Ionicons name={award.icon} size={28} color={award.color} />
                          <Text style={styles.awardLabel}>{award.label}</Text>
                          <Text style={styles.awardCoins}>{award.coins} c</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>

                <View style={styles.quantitySelectorRow}>
                  <TouchableOpacity 
                    style={styles.quantityBtn}
                    onPress={() => setAwardQuantity(prev => Math.max(1, prev - 1))}
                  >
                    <Text style={styles.quantityBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityValue}>{awardQuantity}</Text>
                  <TouchableOpacity 
                    style={styles.quantityBtn}
                    onPress={() => setAwardQuantity(prev => prev + 1)}
                  >
                    <Text style={styles.quantityBtnText}>+</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.sendAwardBtn} onPress={handleSendAward}>
                  <Text style={styles.sendAwardText}>
                    Send Award {selectedAward ? `(${selectedAward.coins * awardQuantity} Coins)` : ''}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </Modal>
      )}

      {/* THREE-DOTS NAVIGATION DRAWER MODAL */}
      <Modal visible={showThreeDotsDrawer} animationType="slide" transparent>
        <View style={styles.drawerOverlay}>
          <View style={styles.drawerContent}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Menu</Text>
              <TouchableOpacity onPress={() => setShowThreeDotsDrawer(false)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.drawerScroll} showsVerticalScrollIndicator={false}>
              <TouchableOpacity style={styles.drawerNavItem} onPress={() => { setShowThreeDotsDrawer(false); alert("Navigating to Discovery"); }}>
                <Ionicons name="compass-outline" size={22} color="#7C3AED" />
                <Text style={styles.drawerNavLabel}>Discovery</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.drawerNavItem} onPress={() => { setShowThreeDotsDrawer(false); alert("Navigating to Communities"); }}>
                <Ionicons name="people-outline" size={22} color="#7C3AED" />
                <Text style={styles.drawerNavLabel}>Communities</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.drawerNavItem} onPress={() => { setShowThreeDotsDrawer(false); setShowStartCommunity(true); }}>
                <Ionicons name="add-circle-outline" size={22} color="#7C3AED" />
                <Text style={styles.drawerNavLabel}>Start a Community</Text>
              </TouchableOpacity>

              <View style={styles.drawerDivider} />

              <View style={styles.drawerSectionHeader}>
                <Text style={styles.drawerSectionTitle}>Recently Visited Communities</Text>
                <TouchableOpacity onPress={() => setShowSeeAllRecent(true)}>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>

              {recentCommunities.slice(0, 3).map(comm => (
                <TouchableOpacity key={comm.id} style={styles.communityRow} onPress={() => { setShowThreeDotsDrawer(false); alert(`Opening ${comm.name}`); }}>
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
                <TouchableOpacity key={comm.id} style={styles.communityRow} onPress={() => { setShowThreeDotsDrawer(false); alert(`Opening ${comm.name}`); }}>
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

            <TouchableOpacity style={styles.drawerLogoutBtn} onPress={onLogout}>
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              <Text style={styles.drawerLogoutText}>Logout</Text>
            </TouchableOpacity>
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
                <TouchableOpacity key={comm.id} style={styles.communityRow} onPress={() => { setShowSeeAllRecent(false); setShowThreeDotsDrawer(false); alert(`Opening ${comm.name}`); }}>
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

      {/* FULL-SCREEN SLIDE-DOWN SEARCH OVERLAY */}
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

          <View style={styles.searchTabsRow}>
            {['Communities', 'Messages'].map(st => (
              <TouchableOpacity 
                key={st} 
                style={[styles.searchTabItem, searchTab === st && styles.searchTabItemActive]}
                onPress={() => setSearchTab(st)}
              >
                <Text style={[styles.searchTabText, searchTab === st && styles.searchTabTextActive]}>{st}</Text>
                {searchTab === st && <View style={styles.searchTabIndicator} />}
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView style={styles.searchResultsScroll} showsVerticalScrollIndicator={false}>
            {searchTab === 'Communities' && (
              <View>
                <Text style={styles.searchResultSectionTitle}>Communities</Text>
                {[...recentCommunities, ...joinedCommunities]
                  .filter((comm, index, self) => 
                    index === self.findIndex((t) => t.id === comm.id) &&
                    comm.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(comm => (
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
                  ))}
              </View>
            )}

            {searchTab === 'Messages' && (
              <View>
                <Text style={styles.searchResultSectionTitle}>Messages & Posts</Text>
                {posts
                  .filter(p => p.text.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(post => (
                    <TouchableOpacity key={post.id} style={styles.searchPostResultCard} onPress={() => { setShowSearchWindow(false); setSelectedPost(post); }}>
                      <View style={styles.searchPostAuthorRow}>
                        <Image source={{ uri: post.authorAvatar }} style={styles.searchPostAvatar} />
                        <Text style={styles.searchPostAuthorName}>{post.authorName}</Text>
                        <Text style={styles.searchPostTime}>• {post.time}</Text>
                      </View>
                      <Text style={styles.searchPostText} numberOfLines={2}>{post.text}</Text>
                    </TouchableOpacity>
                  ))}
              </View>
            )}
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
  topHeader: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
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
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  initialAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialAvatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userText: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  greetingText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingHorizontal: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
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
    width: 24,
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
  trendingSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  seeAllLink: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
  },
  trendingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  trendingCard: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  trendingTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
  },
  trendingCount: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  trendingPercentage: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
    marginTop: 4,
  },
  categoriesSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
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
    borderRadius: 16,
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
    borderRadius: 16,
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
  detailContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  detailHeader: {
    flexDirection: 'row',
    height: 90,
    paddingTop: 44,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtnWrapper: {
    padding: 4,
  },
  detailHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  detailContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  detailAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  detailAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  detailAuthorText: {
    flex: 1,
    marginLeft: 12,
  },
  detailAuthorName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  detailAuthorHandle: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  followBtn: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#7C3AED',
  },
  followingBtn: {
    backgroundColor: '#7C3AED',
  },
  followBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
  },
  followingBtnText: {
    color: '#FFFFFF',
  },
  detailBodyText: {
    fontSize: 15,
    color: '#1F2937',
    lineHeight: 22,
    marginBottom: 14,
  },
  detailPostImage: {
    width: '100%',
    height: 260,
    borderRadius: 16,
    marginBottom: 14,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  gridImageItem: {
    width: '32%',
    height: 100,
    borderRadius: 10,
  },
  detailTimestamp: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  statsDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  statItem: {
    fontSize: 11,
    color: '#6B7280',
  },
  statBold: {
    fontWeight: '700',
    color: '#1F2937',
  },
  interactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  interactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 6,
  },
  interactBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  bottomSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
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
  sheetSubtitle: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  commentSortTabs: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sortTab: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sortTabActive: {
    backgroundColor: '#F3E8FF',
  },
  sortTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  sortTabTextActive: {
    color: '#7C3AED',
    fontWeight: '700',
  },
  commentsList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  commentItem: {
    marginBottom: 16,
  },
  commentMain: {
    flexDirection: 'row',
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  commentTextContent: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 10,
  },
  commentAuthor: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1F2937',
  },
  commentHandle: {
    fontWeight: '400',
    color: '#9CA3AF',
  },
  commentText: {
    fontSize: 12,
    color: '#374151',
    marginTop: 3,
    lineHeight: 17,
  },
  replyItem: {
    flexDirection: 'row',
    marginLeft: 36,
    marginTop: 8,
  },
  replyAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  authorBadge: {
    color: '#7C3AED',
    fontWeight: '700',
    fontSize: 10,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 8,
  },
  commentTextInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 12,
    color: '#1F2937',
  },
  sendCommentBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareSheetContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  shareGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginVertical: 16,
    justifyContent: 'flex-start',
  },
  shareItem: {
    alignItems: 'center',
    width: '21%',
  },
  shareIconBg: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  shareLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center',
  },
  cancelShareBtn: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelShareText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
  },
  awardSheetContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  coinBalanceBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    paddingVertical: 8,
    borderRadius: 12,
    marginVertical: 12,
    gap: 6,
  },
  coinBalanceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706',
  },
  awardsGridScroll: {
    marginVertical: 10,
  },
  awardsGridRow: {
    flexDirection: 'row',
    gap: 10,
  },
  awardCard: {
    width: 80,
    height: 90,
    borderRadius: 14,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
  },
  awardCardSelected: {
    borderColor: '#7C3AED',
    backgroundColor: '#F3E8FF',
  },
  awardLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 4,
  },
  awardCoins: {
    fontSize: 9,
    color: '#9CA3AF',
    marginTop: 2,
  },
  quantitySelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  quantityBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  quantityValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginHorizontal: 16,
  },
  sendAwardBtn: {
    backgroundColor: '#7C3AED',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  sendAwardText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  // THREE DOTS DRAWER STYLES
  drawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  drawerContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%',
    padding: 20,
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
    flex: 1,
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
    marginTop: 10,
  },
  drawerLogoutText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EF4444',
  },
  // START COMMUNITY MODAL STYLES
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
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
  // SEARCH SLIDE DOWN STYLES
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
  searchTabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchTabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  searchTabItemActive: {},
  searchTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  searchTabTextActive: {
    color: '#7C3AED',
    fontWeight: '700',
  },
  searchTabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 32,
    height: 3,
    backgroundColor: '#7C3AED',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  searchResultsScroll: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  searchResultSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  searchResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
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
});
