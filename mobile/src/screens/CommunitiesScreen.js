import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Image, ActivityIndicator, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { communitiesService } from '../services/apiService';

export default function CommunitiesScreen({ onBack, currentUser }) {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const FILTERS = ['All', 'Joined', 'Sports', 'Entertainment', 'Food', 'Technology', 'Local', 'Culture'];

  useEffect(() => {
    communitiesService.getAll().then(data => {
      setCommunities(data);
      setLoading(false);
    });
  }, []);

  const filtered = communities.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === 'All' ||
      (activeFilter === 'Joined' && c.isJoined) ||
      c.category === activeFilter;
    return matchSearch && matchFilter;
  });

  const handleJoin = (id) => {
    setCommunities(prev => prev.map(c =>
      c.id === id ? { ...c, isJoined: !c.isJoined } : c
    ));
    communitiesService.joinCommunity(id);
  };

  const renderCommunity = ({ item }) => (
    <TouchableOpacity style={styles.communityCard} activeOpacity={0.9}>
      <View style={styles.communityCardHeader}>
        <View style={styles.communityIcon}>
          <Text style={styles.communityIconText}>{item.icon}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.communityName}>{item.name}</Text>
          <Text style={styles.communityMembers}>👥 {item.members} members</Text>
        </View>
        <TouchableOpacity
          style={[styles.joinBtn, item.isJoined && styles.joinBtnJoined]}
          onPress={() => handleJoin(item.id)}
        >
          {item.isJoined ? (
            <Text style={styles.joinBtnJoinedText}>Joined ✓</Text>
          ) : (
            <LinearGradient colors={['#FF6B00', '#FF9F4A']} style={styles.joinBtnGradient}>
              <Text style={styles.joinBtnText}>+ Join</Text>
            </LinearGradient>
          )}
        </TouchableOpacity>
      </View>
      <Text style={styles.communityDescription} numberOfLines={2}>{item.description}</Text>
      <View style={styles.communityCategory}>
        <Text style={styles.communityCategoryText}>{item.category}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Communities</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="add" size={24} color="#FF6B00" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={18} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search communities..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersRow} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.filterChipText, activeFilter === f && styles.filterChipTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* List */}
      {loading ? (
        <ActivityIndicator size="large" color="#FF6B00" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={renderCommunity}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🏘️</Text>
              <Text style={styles.emptyTitle}>No communities found</Text>
              <Text style={styles.emptySubtitle}>Try a different search or filter</Text>
            </View>
          }
        />
      )}
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
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', flex: 1, textAlign: 'center' },
  headerBtn: { padding: 6 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    margin: 16, paddingHorizontal: 14, height: 44,
    backgroundColor: '#F3F4F6', borderRadius: 22,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#374151' },
  filtersRow: { flexGrow: 0, marginBottom: 8 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 20, backgroundColor: '#F3F4F6',
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  filterChipActive: { backgroundColor: '#FFF3EC', borderColor: '#FF6B00' },
  filterChipText: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  filterChipTextActive: { color: '#FF6B00', fontWeight: 'bold' },
  list: { padding: 16, gap: 12 },
  communityCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  communityCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  communityIcon: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: '#FFF3EC', alignItems: 'center', justifyContent: 'center',
  },
  communityIconText: { fontSize: 26 },
  communityName: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
  communityMembers: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  joinBtn: { borderRadius: 20, overflow: 'hidden' },
  joinBtnJoined: { backgroundColor: '#F3F4F6', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
  joinBtnGradient: { paddingHorizontal: 14, paddingVertical: 7 },
  joinBtnText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  joinBtnJoinedText: { color: '#6B7280', fontSize: 13, fontWeight: '600' },
  communityDescription: { fontSize: 13, color: '#6B7280', lineHeight: 19, marginBottom: 10 },
  communityCategory: {
    alignSelf: 'flex-start', backgroundColor: '#EFF6FF',
    paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8,
  },
  communityCategoryText: { fontSize: 11, color: '#3B82F6', fontWeight: '600' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 6 },
  emptySubtitle: { fontSize: 14, color: '#9CA3AF' },
});
