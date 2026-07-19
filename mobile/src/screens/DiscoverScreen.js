import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, FlatList, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const TRENDING_TOPICS = [
  { id: 't1', tag: '#IndiaWins', posts: '2.4M posts', category: 'Cricket', hot: true },
  { id: 't2', tag: '#BollywoodBuzz', posts: '890K posts', category: 'Entertainment', hot: true },
  { id: 't3', tag: '#DesiFood', posts: '450K posts', category: 'Food', hot: false },
  { id: 't4', tag: '#TechIndia', posts: '320K posts', category: 'Technology', hot: false },
  { id: 't5', tag: '#MumbaiRains', posts: '1.2M posts', category: 'Local', hot: true },
  { id: 't6', tag: '#Yoga2026', posts: '180K posts', category: 'Wellness', hot: false },
];

const SUGGESTED_USERS = [
  { id: 'u1', name: 'Priya Kapoor', handle: '@priyadesi', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', followers: '12.4K', badge: 'Verified Artist', isFollowing: false },
  { id: 'u2', name: 'Dev Patel', handle: '@devpatel_codes', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', followers: '8.9K', badge: 'Tech Creator', isFollowing: false },
  { id: 'u3', name: 'Meera Iyer', handle: '@meera_bai', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80', followers: '5.2K', badge: 'Food Blogger', isFollowing: true },
];

const CATEGORIES = [
  { id: 'c1', icon: '🏏', name: 'Cricket', color: '#22C55E' },
  { id: 'c2', icon: '🎬', name: 'Bollywood', color: '#EC4899' },
  { id: 'c3', icon: '🍛', name: 'Food', color: '#F59E0B' },
  { id: 'c4', icon: '💻', name: 'Technology', color: '#3B82F6' },
  { id: 'c5', icon: '🎵', name: 'Music', color: '#8B5CF6' },
  { id: 'c6', icon: '🌆', name: 'Local', color: '#10B981' },
  { id: 'c7', icon: '🧘', name: 'Wellness', color: '#06B6D4' },
  { id: 'c8', icon: '🗳️', name: 'Politics', color: '#EF4444' },
];

export default function DiscoverScreen({ onBack, currentUser }) {
  const [searchText, setSearchText] = useState('');
  const [following, setFollowing] = useState(
    SUGGESTED_USERS.reduce((acc, u) => ({ ...acc, [u.id]: u.isFollowing }), {})
  );

  const toggleFollow = (id) => {
    setFollowing(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Discover</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={18} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search posts, users, communities..."
          placeholderTextColor="#9CA3AF"
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Categories Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Browse Categories</Text>
        </View>
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity key={cat.id} style={styles.categoryCard} activeOpacity={0.85}>
              <LinearGradient colors={[cat.color, cat.color + 'AA']} style={styles.categoryGradient}>
                <Text style={styles.categoryCardIcon}>{cat.icon}</Text>
                <Text style={styles.categoryCardName}>{cat.name}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Trending Topics */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🔥 Trending Now</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
        </View>
        {TRENDING_TOPICS.map((topic, i) => (
          <TouchableOpacity key={topic.id} style={styles.trendingItem} activeOpacity={0.85}>
            <View style={styles.trendingRank}>
              <Text style={styles.trendingRankText}>{i + 1}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.trendingTagRow}>
                <Text style={styles.trendingTag}>{topic.tag}</Text>
                {topic.hot && <View style={styles.hotBadge}><Text style={styles.hotBadgeText}>🔥 HOT</Text></View>}
              </View>
              <Text style={styles.trendingMeta}>{topic.category} · {topic.posts}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
          </TouchableOpacity>
        ))}

        {/* Suggested Users */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>👥 People to Follow</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
        </View>
        {SUGGESTED_USERS.map(user => (
          <View key={user.id} style={styles.userCard}>
            <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userHandle}>{user.handle}</Text>
              <Text style={styles.userMeta}>{user.badge} · {user.followers} followers</Text>
            </View>
            <TouchableOpacity
              style={[styles.followBtn, following[user.id] && styles.followBtnFollowing]}
              onPress={() => toggleFollow(user.id)}
            >
              {following[user.id] ? (
                <Text style={styles.followBtnFollowingText}>Following</Text>
              ) : (
                <LinearGradient colors={['#FF6B00', '#FF9F4A']} style={styles.followBtnGradient}>
                  <Text style={styles.followBtnText}>Follow</Text>
                </LinearGradient>
              )}
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  backBtn: { padding: 6 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    margin: 16, paddingHorizontal: 16, height: 46,
    backgroundColor: '#F3F4F6', borderRadius: 23,
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  searchInput: { flex: 1, fontSize: 14, color: '#374151' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
  seeAll: { fontSize: 13, color: '#FF6B00', fontWeight: '600' },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 10, marginBottom: 8 },
  categoryCard: { width: '22%', borderRadius: 14, overflow: 'hidden' },
  categoryGradient: { paddingVertical: 14, alignItems: 'center', gap: 6 },
  categoryCardIcon: { fontSize: 26 },
  categoryCardName: { fontSize: 11, fontWeight: '600', color: '#fff', textAlign: 'center' },
  trendingItem: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#F9FAFB',
  },
  trendingRank: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#FFF3EC', alignItems: 'center', justifyContent: 'center' },
  trendingRankText: { fontSize: 13, fontWeight: 'bold', color: '#FF6B00' },
  trendingTagRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  trendingTag: { fontSize: 15, fontWeight: 'bold', color: '#1F2937' },
  hotBadge: { backgroundColor: '#FEF3C7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  hotBadgeText: { fontSize: 10, fontWeight: 'bold', color: '#D97706' },
  trendingMeta: { fontSize: 12, color: '#9CA3AF' },
  userCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  userAvatar: { width: 48, height: 48, borderRadius: 24 },
  userName: { fontSize: 15, fontWeight: 'bold', color: '#1F2937' },
  userHandle: { fontSize: 13, color: '#9CA3AF' },
  userMeta: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  followBtn: { borderRadius: 20, overflow: 'hidden' },
  followBtnFollowing: { backgroundColor: '#F3F4F6', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  followBtnGradient: { paddingHorizontal: 14, paddingVertical: 7 },
  followBtnText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  followBtnFollowingText: { color: '#6B7280', fontSize: 13, fontWeight: '600' },
});
