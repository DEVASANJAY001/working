import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Image, ScrollView, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { notificationsService } from '../services/apiService';

export default function NotificationsScreen({ onBack, currentUser }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  const FILTERS = ['All', 'Mentions', 'Comments', 'Likes', 'Awards', 'Follows'];

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const data = await notificationsService.getAll();
    setNotifications(data);
    setLoading(false);
    setRefreshing(false);
  };

  const handleMarkRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    notificationsService.markRead(id);
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const typeIcon = (type) => {
    switch (type) {
      case 'like': return { name: 'heart', color: '#EF4444' };
      case 'comment': return { name: 'chatbubble', color: '#3B82F6' };
      case 'follow': return { name: 'person-add', color: '#10B981' };
      case 'award': return { name: 'trophy', color: '#F59E0B' };
      case 'mention': return { name: 'at', color: '#8B5CF6' };
      case 'upvote': return { name: 'arrow-up-circle', color: '#FF6B00' };
      default: return { name: 'notifications', color: '#6B7280' };
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filtered = activeFilter === 'All' ? notifications :
    notifications.filter(n => {
      const map = { Mentions: 'mention', Comments: 'comment', Likes: 'like', Awards: 'award', Follows: 'follow' };
      return n.type === map[activeFilter];
    });

  const renderNotif = ({ item }) => {
    const icon = typeIcon(item.type);
    return (
      <TouchableOpacity
        style={[styles.notifItem, !item.isRead && styles.notifItemUnread]}
        onPress={() => handleMarkRead(item.id)}
        activeOpacity={0.85}
      >
        <View style={styles.notifLeft}>
          <Image source={{ uri: item.actorAvatar }} style={styles.notifAvatar} />
          <View style={[styles.notifTypeIcon, { backgroundColor: icon.color + '20' }]}>
            <Ionicons name={icon.name} size={12} color={icon.color} />
          </View>
        </View>
        <View style={styles.notifContent}>
          <Text style={styles.notifText}>
            <Text style={styles.notifActor}>{item.actor} </Text>
            {item.text}
          </Text>
          <Text style={styles.notifTime}>{item.time} ago</Text>
        </View>
        {!item.isRead && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
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
        <View>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && <Text style={styles.headerSubtitle}>{unreadCount} unread</Text>}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllBtn} onPress={handleMarkAllRead}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        style={styles.filtersRow}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingVertical: 10 }}
      >
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

      {loading ? (
        <ActivityIndicator size="large" color="#FF6B00" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={renderNotif}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadNotifications(); }} colors={['#FF6B00']} tintColor="#FF6B00" />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🔔</Text>
              <Text style={styles.emptyTitle}>All caught up!</Text>
              <Text style={styles.emptySubtitle}>No notifications in this category</Text>
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
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6', gap: 12,
  },
  backBtn: { padding: 6 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', flex: 1 },
  headerSubtitle: { fontSize: 12, color: '#9CA3AF' },
  markAllBtn: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#FFF3EC', borderRadius: 10 },
  markAllText: { fontSize: 12, color: '#FF6B00', fontWeight: '600' },
  filtersRow: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F3F4F6', flexGrow: 0 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB' },
  filterChipActive: { backgroundColor: '#FFF3EC', borderColor: '#FF6B00' },
  filterChipText: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  filterChipTextActive: { color: '#FF6B00', fontWeight: 'bold' },
  notifItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F9FAFB', gap: 12,
  },
  notifItemUnread: { backgroundColor: '#FFFBF7' },
  notifLeft: { position: 'relative' },
  notifAvatar: { width: 46, height: 46, borderRadius: 23 },
  notifTypeIcon: {
    position: 'absolute', bottom: 0, right: -4,
    width: 20, height: 20, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#fff',
  },
  notifContent: { flex: 1 },
  notifText: { fontSize: 14, color: '#374151', lineHeight: 20 },
  notifActor: { fontWeight: 'bold', color: '#1F2937' },
  notifTime: { fontSize: 12, color: '#9CA3AF', marginTop: 3 },
  unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF6B00' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 6 },
  emptySubtitle: { fontSize: 14, color: '#9CA3AF' },
});
