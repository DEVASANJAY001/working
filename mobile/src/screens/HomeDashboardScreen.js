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
  Animated 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

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

export default function HomeDashboardScreen({ onLogout, onCreatePress }) {
  const [activeTab, setActiveTab] = useState('Home Feed'); // Home Feed, Local Feed, Trending Feed, Following Feed
  const [posts, setPosts] = useState(initialPosts);
  
  // Navigation & Modal Overlays States
  const [selectedPost, setSelectedPost] = useState(null); // PST_001 Post Detail
  const [showComments, setShowComments] = useState(false); // CMT_001 Comment Thread Overlay
  const [showShare, setShowShare] = useState(false); // SHR_001 Share Overlay
  const [showAwards, setShowAwards] = useState(false); // AWD_001 Award Overlay
  
  // Coin Balance
  const [coinsBalance, setCoinsBalance] = useState(1250);
  const [selectedAward, setSelectedAward] = useState(null);
  const [awardQuantity, setAwardQuantity] = useState(1);

  // Sorting for Comments
  const [commentSort, setCommentSort] = useState('Top'); // Top, Latest
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

    // Update comment count on post
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
    
    // Increment award count
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
      
      {/* 1. Header (Greeting + Brand + Notification Badge) */}
      <View style={styles.topHeader}>
        <View style={styles.headerRow}>
          <View style={styles.userProfile}>
            <TouchableOpacity onPress={onLogout}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' }} 
                style={styles.avatarImg} 
              />
            </TouchableOpacity>
            <View style={styles.userText}>
              <Text style={styles.userName}>Devasanjay 👋</Text>
              <Text style={styles.greetingText}>Good Morning</Text>
            </View>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionIconButton}>
              <Ionicons name="search" size={20} color="#1F2937" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionIconButton}>
              <Ionicons name="notifications-outline" size={20} color="#1F2937" />
              <View style={styles.badge} />
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
            {/* Top Trending Card */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🔥 Top Trending Today</Text>
              <TouchableOpacity><Text style={styles.seeAllLink}>See All</Text></TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trendingCardsScroll}>
              {[
                { tag: '# Chennai Rains', count: '12.5K posts', trend: '22%' },
                { tag: '# Metro Phase 2', count: '8.7K posts', trend: '18%' },
                { tag: '# Traffic Updates', count: '6.2K posts', trend: '14%' },
                { tag: '# IPL 2025', count: '5.4K posts', trend: '12%' },
              ].map((item, idx) => (
                <View key={idx} style={styles.trendCard}>
                  <Text style={styles.trendCardTag}>{item.tag}</Text>
                  <Text style={styles.trendCardCount}>{item.count}</Text>
                  <Text style={styles.trendCardTrend}>▲ {item.trend}</Text>
                </View>
              ))}
            </ScrollView>

            {/* Categories List */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <TouchableOpacity><Text style={styles.seeAllLink}>View All</Text></TouchableOpacity>
            </View>
            <View style={styles.categoriesGrid}>
              {[
                { icon: 'alert-circle', label: 'Issues', color: '#EF4444' },
                { icon: 'chatbubbles', label: 'Talks', color: '#F59E0B' },
                { icon: 'newspaper', label: 'News', color: '#3B82F6' },
                { icon: 'stats-chart', label: 'Polls', color: '#10B981' },
                { icon: 'calendar', label: 'Events', color: '#8B5CF6' }
              ].map((cat, idx) => (
                <TouchableOpacity key={idx} style={styles.categoryItem}>
                  <View style={[styles.catIconBg, { backgroundColor: cat.color + '15' }]}>
                    <Ionicons name={cat.icon} size={20} color={cat.color} />
                  </View>
                  <Text style={styles.catLabel}>{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Stories Horizontal List */}
            <View style={styles.storiesContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesScroll}>
                {stories.map((story) => (
                  <View key={story.id} style={styles.storyItem}>
                    {story.active ? (
                      <LinearGradient colors={['#7C3AED', '#F97316']} style={styles.storyRingGradient}>
                        <View style={styles.storyRingInner}>
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
            {/* Location selector */}
            <View style={styles.localLocationBar}>
              <Ionicons name="location" size={18} color="#7C3AED" />
              <Text style={styles.localLocationText}>Chennai, Tamil Nadu</Text>
              <Ionicons name="chevron-down" size={16} color="#6B7280" style={{ marginLeft: 6 }} />
            </View>

            {/* Live banner */}
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

            {/* Local Posts */}
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
                color: '#F59E0B'
              },
              {
                id: 'loc_2',
                title: 'Water Supply Update',
                desc: 'Water supply will be affected in Adyar, Besant Nagar area.',
                time: '3h ago',
                likes: 87,
                comments: 0,
                tag: 'Utility',
                color: '#3B82F6'
              },
              {
                id: 'loc_3',
                title: 'Garbage Collection Drive',
                desc: 'Special drive starting this Sunday in Ward 112.',
                time: '4h ago',
                likes: 64,
                comments: 15,
                tag: 'Cleanliness',
                color: '#10B981'
              }
            ].map((item) => (
              <View key={item.id} style={styles.localCard}>
                <View style={styles.localCardHeader}>
                  <View style={[styles.localTag, { backgroundColor: item.color + '15' }]}>
                    <Text style={[styles.localTagText, { color: item.color }]}>{item.tag}</Text>
                  </View>
                  <Text style={styles.localCardTime}>{item.time}</Text>
                </View>
                <Text style={styles.localCardTitleText}>{item.title}</Text>
                <Text style={styles.localCardDesc}>{item.desc}</Text>
                <View style={styles.localCardFooter}>
                  <TouchableOpacity style={styles.localAction}>
                    <Ionicons name="heart-outline" size={16} color="#4B5563" />
                    <Text style={styles.localActionText}>{item.likes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.localAction}>
                    <Ionicons name="chatbubble-outline" size={15} color="#4B5563" />
                    <Text style={styles.localActionText}>{item.comments}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.localActionRight}>
                    <Ionicons name="share-social-outline" size={16} color="#4B5563" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Render Feed HOM_003 (Trending Feed) */}
        {activeTab === 'Trending Feed' && (
          <View>
            {/* Trending rankings list */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🔥 Trending Topics</Text>
              <TouchableOpacity><Text style={styles.seeAllLink}>See All</Text></TouchableOpacity>
            </View>

            <View style={styles.rankingContainer}>
              {[
                { rank: '01', tag: '# Chennai Rains', count: '12.5K posts', trend: '+ 22%', color: '#EF4444' },
                { rank: '02', tag: '# AI Jobs', count: '8.1K posts', trend: '+ 18%', color: '#F59E0B' },
                { rank: '03', tag: '# Metro Phase 2', count: '6.7K posts', trend: '+ 16%', color: '#3B82F6' },
                { rank: '04', tag: '# TN Budget 2025', count: '5.3K posts', trend: '+ 12%', color: '#10B981' },
                { rank: '05', tag: '# IPL 2025', count: '4.0K posts', trend: '+ 10%', color: '#8B5CF6' }
              ].map((item) => (
                <View key={item.rank} style={styles.rankingRow}>
                  <Text style={styles.rankingNum}>{item.rank}</Text>
                  <View style={styles.rankingDetails}>
                    <Text style={styles.rankingTag}>{item.tag}</Text>
                    <Text style={styles.rankingCount}>{item.count}</Text>
                  </View>
                  <View style={styles.rankingTrend}>
                    <Text style={styles.rankingTrendText}>{item.trend}</Text>
                    <Ionicons name="trending-up" size={16} color="#10B981" />
                  </View>
                </View>
              ))}
            </View>

            {/* Featured Trending Post */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Trending Post</Text>
            </View>
            {posts.filter(p => p.id === 'post_2').map(post => renderPostCard(post))}
          </View>
        )}

        {/* Render Feed HOM_004 (Following Feed) */}
        {activeTab === 'Following Feed' && (
          <View>
            {/* Followed Creators bubbles list */}
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

            {/* Posts from followed creators */}
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
            {/* Header */}
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
              {/* Author Row */}
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

              {/* Text */}
              <Text style={styles.detailBodyText}>{selectedPost.text}</Text>

              {/* Media */}
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
              
              {/* Stats */}
              <View style={styles.statsDivider} />
              <View style={styles.statsRow}>
                <Text style={styles.statItem}><Text style={styles.statBold}>{selectedPost.likes}</Text> Likes</Text>
                <Text style={styles.statItem}><Text style={styles.statBold}>{selectedPost.commentsCount}</Text> Comments</Text>
                <Text style={styles.statItem}><Text style={styles.statBold}>{selectedPost.shares}</Text> Shares</Text>
                <Text style={styles.statItem}><Text style={styles.statBold}>{selectedPost.awards}</Text> Awards</Text>
              </View>
              <View style={styles.statsDivider} />

              {/* Action Buttons */}
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

                {/* Sort tabs */}
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

                <ScrollView style={styles.commentsScroll} showsVerticalScrollIndicator={false}>
                  {commentsList.map(comment => (
                    <View key={comment.id} style={styles.commentContainer}>
                      <View style={styles.commentHeader}>
                        <Image source={{ uri: comment.avatar }} style={styles.commentAvatar} />
                        <View style={styles.commentAuthorInfo}>
                          <Text style={styles.commentAuthor}>{comment.author} <Text style={styles.commentHandle}>@{comment.handle}</Text></Text>
                          <Text style={styles.commentText}>{comment.text}</Text>
                        </View>
                      </View>
                      
                      {/* Nested Replies */}
                      {comment.replies.map(reply => (
                        <View key={reply.id} style={styles.replyContainer}>
                          <View style={styles.commentHeader}>
                            <Image source={{ uri: reply.avatar }} style={styles.commentAvatar} />
                            <View style={styles.commentAuthorInfo}>
                              <Text style={styles.commentAuthor}>
                                {reply.author} <Text style={styles.commentHandle}>@{reply.handle}</Text>
                                {reply.isAuthor && <Text style={styles.authorBadge}>Author</Text>}
                              </Text>
                              <Text style={styles.commentText}>{reply.text}</Text>
                            </View>
                          </View>
                        </View>
                      ))}
                    </View>
                  ))}
                </ScrollView>

                {/* Add comment bar */}
                <View style={styles.commentInputRow}>
                  <TextInput 
                    style={styles.commentTextInput} 
                    placeholder="Add a comment..." 
                    placeholderTextColor="#9CA3AF"
                    value={newCommentText}
                    onChangeText={setNewCommentText}
                  />
                  <TouchableOpacity onPress={handleAddComment}>
                    <Ionicons name="send" size={22} color="#7C3AED" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* 7. SHARE SHEET MODAL (SHR_001) */}
          <Modal visible={showShare} animationType="slide" transparent>
            <View style={styles.bottomSheetOverlay}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowShare(false)} />
              <View style={styles.shareSheetContent}>
                <Text style={styles.shareSheetTitle}>Share Post</Text>
                
                <View style={styles.shareGrid}>
                  {[
                    { icon: 'logo-whatsapp', label: 'WhatsApp', color: '#25D366' },
                    { icon: 'paper-plane', label: 'Telegram', color: '#0088cc' },
                    { icon: 'logo-instagram', label: 'Instagram', color: '#E1306C' },
                    { icon: 'chatbubble', label: 'Messages', color: '#34C759' },
                    { icon: 'link', label: 'Copy Link', color: '#4B5563' },
                    { icon: 'logo-facebook', label: 'Facebook', color: '#1877F2' },
                    { icon: 'logo-twitter', label: 'X (Twitter)', color: '#000000' }
                  ].map((app, idx) => (
                    <TouchableOpacity key={idx} style={styles.shareAppItem} onPress={() => { setShowShare(false); alert("Shared successfully!"); }}>
                      <View style={[styles.shareIconBg, { backgroundColor: app.color + '10' }]}>
                        <Ionicons name={app.icon} size={24} color={app.color} />
                      </View>
                      <Text style={styles.shareAppLabel}>{app.label}</Text>
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
              <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowAwards(false)} />
              <View style={styles.awardSheetContent}>
                <Text style={styles.awardSheetTitle}>Give an award</Text>
                <Text style={styles.awardSheetSubtitle}>Support the creator</Text>
                
                <View style={styles.coinsBalanceRow}>
                  <Ionicons name="wallet-outline" size={16} color="#4B5563" />
                  <Text style={styles.coinsBalanceText}>Your balance: <Text style={styles.coinsBold}>{coinsBalance} Coins</Text></Text>
                </View>

                <ScrollView style={{ maxHeight: 220 }} showsVerticalScrollIndicator={false}>
                  <View style={styles.awardsGrid}>
                    {awardsList.map((award) => {
                      const isSelected = selectedAward?.id === award.id;
                      return (
                        <TouchableOpacity 
                          key={award.id} 
                          style={[styles.awardCard, isSelected && styles.awardCardSelected]}
                          onPress={() => setSelectedAward(award)}
                        >
                          <Ionicons name={award.icon} size={28} color={award.color} />
                          <Text style={styles.awardLabel}>{award.label}</Text>
                          <Text style={styles.awardCoins}>{award.coins} Coins</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>

                {/* Quantity selector */}
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
    </View>
  );

  // Helper render for feed post card
  function renderPostCard(post) {
    return (
      <View key={post.id} style={styles.feedCard}>
        <View style={styles.cardHeader}>
          <View style={styles.authorRow}>
            <Image source={{ uri: post.authorAvatar }} style={styles.authorAvatar} />
            <View style={styles.authorText}>
              <Text style={styles.authorName}>{post.authorName}</Text>
              <Text style={styles.authorHandle}>@{post.authorHandle} • {post.time}</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => setSelectedPost(post)}>
          <Text style={styles.postText}>{post.text}</Text>
        </TouchableOpacity>

        {/* Post Image */}
        {post.image && (
          <TouchableOpacity style={styles.postImageContainer} onPress={() => setSelectedPost(post)}>
            <Image source={{ uri: post.image }} style={styles.postImage} />
          </TouchableOpacity>
        )}

        {/* Post Image Grid for Following */}
        {post.images && (
          <TouchableOpacity style={styles.imageGrid} onPress={() => setSelectedPost(post)}>
            {post.images.map((img, idx) => (
              <Image key={idx} source={{ uri: img }} style={styles.gridImageItem} />
            ))}
          </TouchableOpacity>
        )}

        {/* Action buttons bar */}
        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => handleToggleLike(post.id)}>
            <Ionicons 
              name={post.isLiked ? "heart" : "heart-outline"} 
              size={22} 
              color={post.isLiked ? "#EF4444" : "#4B5563"} 
            />
            <Text style={[styles.actionCount, post.isLiked && styles.likedColor]}>{post.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => { setSelectedPost(post); setShowComments(true); }}>
            <Ionicons name="chatbubble-outline" size={20} color="#4B5563" />
            <Text style={styles.actionCount}>{post.commentsCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => { setSelectedPost(post); setShowShare(true); }}>
            <Ionicons name="share-social-outline" size={20} color="#4B5563" />
            <Text style={styles.actionCount}>{post.shares}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => { setSelectedPost(post); setShowAwards(true); }}>
            <Ionicons name="gift-outline" size={20} color="#4B5563" />
            <Text style={styles.actionCount}>{post.awards}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtnRight}>
            <Ionicons name="bookmark-outline" size={20} color="#4B5563" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },
  topHeader: {
    paddingTop: 54,
    paddingBottom: 12,
    paddingHorizontal: 20,
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
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  userText: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  greetingText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
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
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    justifyContent: 'space-between',
  },
  tabItem: {
    paddingVertical: 12,
    position: 'relative',
    flex: 1,
    alignItems: 'center',
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
    borderRadius: 1.5,
  },
  mainFeed: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 18,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  seeAllLink: {
    fontSize: 12,
    color: '#7C3AED',
    fontWeight: '600',
  },
  trendingCardsScroll: {
    paddingLeft: 20,
    paddingRight: 8,
  },
  trendCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    width: 120,
    marginRight: 12,
  },
  trendCardTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1F2937',
  },
  trendCardCount: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 4,
  },
  trendCardTrend: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 2,
  },
  categoriesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 8,
  },
  categoryItem: {
    alignItems: 'center',
    width: 60,
  },
  catIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  catLabel: {
    fontSize: 10,
    color: '#4B5563',
    fontWeight: '500',
  },
  storiesContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  storiesScroll: {
    paddingHorizontal: 20,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 14,
    width: 62,
  },
  storyRing: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyRingGradient: {
    width: 54,
    height: 54,
    borderRadius: 27,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyRingInner: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  storyImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  storyName: {
    fontSize: 10,
    color: '#4B5563',
    marginTop: 4,
    textAlign: 'center',
  },
  feedCard: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  authorText: {
    marginLeft: 10,
  },
  authorName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  authorHandle: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 1,
  },
  postText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
    marginVertical: 10,
  },
  postImageContainer: {
    width: '100%',
    height: 170,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  imageGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 130,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 12,
  },
  gridImageItem: {
    flex: 1,
    height: '100%',
    marginRight: 4,
    borderRadius: 4,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionBtnRight: {
    marginLeft: 'auto',
  },
  actionCount: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
    marginLeft: 4,
  },
  likedColor: {
    color: '#EF4444',
  },
  localLocationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  localLocationText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 6,
  },
  liveBanner: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  liveBannerContent: {
    flex: 1,
    paddingRight: 8,
  },
  liveBannerTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  liveBannerSubtitle: {
    color: '#E0D4FF',
    fontSize: 11,
    marginTop: 4,
  },
  viewLiveBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  viewLiveBtnText: {
    color: '#7C3AED',
    fontSize: 11,
    fontWeight: '700',
  },
  liveBannerImg: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  localPostsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 18,
  },
  localPostsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  localCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
  },
  localCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  localTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  localTagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  localCardTime: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  localCardTitleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
  },
  localCardDesc: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 16,
    marginTop: 4,
  },
  localCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  localAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  localActionText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '600',
    marginLeft: 4,
  },
  localActionRight: {
    marginLeft: 'auto',
  },
  rankingContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
  },
  rankingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  rankingNum: {
    fontSize: 14,
    fontWeight: '800',
    color: '#7C3AED',
    width: 28,
  },
  rankingDetails: {
    flex: 1,
  },
  rankingTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
  },
  rankingCount: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  rankingTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankingTrendText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
    marginRight: 4,
  },
  bottomNav: {
    flexDirection: 'row',
    height: 64,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  navItem: {
    justifyContent: 'center',
    alignItems: 'center',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtnWrapper: {
    padding: 4,
  },
  detailHeaderTitle: {
    fontSize: 15,
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
    marginBottom: 16,
  },
  detailAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  detailAuthorText: {
    marginLeft: 12,
    flex: 1,
  },
  detailAuthorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  detailAuthorHandle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 1,
  },
  followBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
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
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 14,
  },
  detailPostImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
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
    fontSize: 12,
    color: '#4B5563',
  },
  statBold: {
    fontWeight: '700',
    color: '#1F2937',
  },
  interactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  interactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  interactBtnText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
    marginLeft: 6,
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
    paddingBottom: 24,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sheetTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  commentSortTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sortTab: {
    marginRight: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sortTabActive: {
    backgroundColor: '#7C3AED15',
  },
  sortTabText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  sortTabTextActive: {
    color: '#7C3AED',
  },
  commentsScroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  commentContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  commentHeader: {
    flexDirection: 'row',
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  commentAuthorInfo: {
    marginLeft: 10,
    flex: 1,
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
  },
  commentHandle: {
    fontWeight: 'normal',
    color: '#9CA3AF',
  },
  commentText: {
    fontSize: 12,
    color: '#374151',
    marginTop: 4,
    lineHeight: 16,
  },
  replyContainer: {
    marginLeft: 40,
    marginTop: 10,
    paddingLeft: 10,
    borderLeftWidth: 1.5,
    borderLeftColor: '#E5E7EB',
  },
  authorBadge: {
    backgroundColor: '#7C3AED15',
    color: '#7C3AED',
    fontSize: 9,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 6,
    overflow: 'hidden',
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  commentTextInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 12,
    color: '#1F2937',
    marginRight: 10,
  },
  shareSheetContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  shareSheetTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  shareGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  shareAppItem: {
    alignItems: 'center',
    width: '24%',
    marginBottom: 16,
  },
  shareIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  shareAppLabel: {
    fontSize: 10,
    color: '#4B5563',
    fontWeight: '500',
  },
  cancelShareBtn: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelShareText: {
    fontSize: 13,
    color: '#EF4444',
    fontWeight: '700',
  },
  awardSheetContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  awardSheetTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  awardSheetSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 12,
  },
  coinsBalanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 16,
    alignSelf: 'center',
    paddingHorizontal: 12,
  },
  coinsBalanceText: {
    fontSize: 11,
    color: '#4B5563',
    marginLeft: 6,
  },
  coinsBold: {
    fontWeight: '700',
    color: '#F59E0B',
  },
  awardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  awardCard: {
    width: '23%',
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  awardCardSelected: {
    borderColor: '#7C3AED',
    backgroundColor: '#7C3AED05',
  },
  awardLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 6,
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
});
