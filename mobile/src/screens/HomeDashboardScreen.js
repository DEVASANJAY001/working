import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const stories = [
  { id: '1', name: 'Your Story', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', active: false },
  { id: '2', name: 'Nicole', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', active: true },
  { id: '3', name: 'Green Africa', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', active: true },
  { id: '4', name: 'Algae Tech', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', active: true },
  { id: '5', name: 'British Ecological', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80', active: true },
];

export default function HomeDashboardScreen({ onLogout }) {
  const [activeTab, setActiveTab] = useState('For you');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(784);
  const [activeNav, setActiveNav] = useState('Home');

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount(prev => prev - 1);
    } else {
      setLiked(true);
      setLikeCount(prev => prev + 1);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Top Header Section with custom gradient style matching top header in image */}
      <LinearGradient
        colors={['#7C3AED', '#F97316']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.topHeader}
      >
        <View style={styles.headerRow}>
          <View style={styles.userProfile}>
            <TouchableOpacity onPress={onLogout}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' }} 
                style={styles.avatarImg} 
              />
            </TouchableOpacity>
            <View style={styles.userText}>
              <Text style={styles.userName}>Hello, Devasanjay 👋</Text>
              <Text style={styles.greetingText}>Good morning</Text>
            </View>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionIconButton}>
              <Ionicons name="search-outline" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionIconButton}>
              <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
              <View style={styles.badge} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.mainFeed} showsVerticalScrollIndicator={false}>
        {/* Stories Horizontal List */}
        <View style={styles.storiesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesScroll}>
            {stories.map((story) => (
              <View key={story.id} style={styles.storyItem}>
                {story.active ? (
                  <LinearGradient
                    colors={['#7C3AED', '#F97316']}
                    style={styles.storyRingGradient}
                  >
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

        {/* Tab Selection */}
        <View style={styles.tabsRow}>
          {['For you', 'Following', 'Trending'].map((tab) => {
            const isTabActive = activeTab === tab;
            return (
              <TouchableOpacity key={tab} style={styles.tabItem} onPress={() => setActiveTab(tab)}>
                <Text style={[styles.tabText, isTabActive && styles.tabTextActive]}>{tab}</Text>
                {isTabActive && <View style={styles.tabIndicator} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Feed Card */}
        <View style={styles.feedCard}>
          <View style={styles.cardHeader}>
            <View style={styles.authorRow}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80' }} 
                style={styles.authorAvatar} 
              />
              <View style={styles.authorText}>
                <Text style={styles.authorName}>British Ecological</Text>
                <Text style={styles.authorHandle}>@britishecological • 2h</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Ionicons name="ellipsis-horizontal" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Post Text */}
          <Text style={styles.postText}>
            Introducing our groundbreaking technology for wind turbines, designed to harness the power of nature more efficiently than ever before.
          </Text>

          {/* Post Image (Wind turbines mock image) */}
          <View style={styles.postImageContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&auto=format&fit=crop&q=80' }} 
              style={styles.postImage} 
            />
          </View>

          {/* Post Actions row */}
          <View style={styles.cardActions}>
            <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
              <Ionicons 
                name={liked ? "heart" : "heart-outline"} 
                size={22} 
                color={liked ? "#EF4444" : "#4B5563"} 
              />
              <Text style={[styles.actionCount, liked && styles.likedColor]}>{likeCount}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="chatbubble-outline" size={20} color="#4B5563" />
              <Text style={styles.actionCount}>14</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="share-social-outline" size={20} color="#4B5563" />
              <Text style={styles.actionCount}>160</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtnRight}>
              <Ionicons name="bookmark-outline" size={20} color="#4B5563" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Extra spacer */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom Custom Navigation bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveNav('Home')}>
          <Ionicons 
            name={activeNav === 'Home' ? "home" : "home-outline"} 
            size={24} 
            color={activeNav === 'Home' ? "#7C3AED" : "#9CA3AF"} 
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveNav('Discover')}>
          <Ionicons 
            name={activeNav === 'Discover' ? "search" : "search-outline"} 
            size={24} 
            color={activeNav === 'Discover' ? "#7C3AED" : "#9CA3AF"} 
          />
        </TouchableOpacity>

        {/* Add Center Button */}
        <TouchableOpacity style={styles.addButtonContainer} onPress={onLogout}>
          <LinearGradient
            colors={['#7C3AED', '#F97316']}
            style={styles.addButtonGradient}
          >
            <Ionicons name="add" size={28} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveNav('Messages')}>
          <Ionicons 
            name={activeNav === 'Messages' ? "chatbubbles" : "chatbubbles-outline"} 
            size={24} 
            color={activeNav === 'Messages' ? "#7C3AED" : "#9CA3AF"} 
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setActiveNav('Profile')}>
          <Ionicons 
            name={activeNav === 'Profile' ? "person" : "person-outline"} 
            size={24} 
            color={activeNav === 'Profile' ? "#7C3AED" : "#9CA3AF"} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topHeader: {
    paddingTop: 54,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#7C3AED',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 8,
    shadowColor: '#7C3AED',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
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
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userText: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  greetingText: {
    fontSize: 12,
    color: '#E0D4FF',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  mainFeed: {
    flex: 1,
  },
  storiesContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  storiesScroll: {
    paddingHorizontal: 20,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 68,
  },
  storyRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyRingGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyRingInner: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  storyImage: {
    width: '100%',
    height: '100%',
    borderRadius: 27,
  },
  storyName: {
    fontSize: 11,
    color: '#4B5563',
    marginTop: 6,
    textAlign: 'center',
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tabItem: {
    marginRight: 24,
    paddingVertical: 12,
    position: 'relative',
  },
  tabText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#9CA3AF',
  },
  tabTextActive: {
    color: '#7C3AED',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#7C3AED',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  feedCard: {
    marginHorizontal: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
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
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  authorText: {
    marginLeft: 12,
  },
  authorName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  authorHandle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 1,
  },
  postText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginVertical: 12,
  },
  postImageContainer: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionBtnRight: {
    marginLeft: 'auto',
  },
  actionCount: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '600',
    marginLeft: 6,
  },
  likedColor: {
    color: '#EF4444',
  },
  bottomNav: {
    flexDirection: 'row',
    height: 72,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    paddingBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'relative',
  },
  navItem: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
  },
  addButtonContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginTop: -28,
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
});
