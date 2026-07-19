import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  ScrollView, Modal, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { safeStorage } from '../utils/storage';

export default function ProfileScreen({ onBack, currentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('Posts');
  const [showSettings, setShowSettings] = useState(false);

  const displayName = currentUser?.name || 'DesiCircle User';
  const userHandle = currentUser?.username ? `@${currentUser.username}` : '@user';
  const userEmail = currentUser?.email || '';
  const userAvatar = currentUser?.avatar || null;
  const firstLetter = (displayName[0] || 'U').toUpperCase();

  const STATS = [
    { label: 'Posts', value: '142' },
    { label: 'Following', value: '389' },
    { label: 'Followers', value: '1.2K' },
    { label: 'Karma', value: '8.4K' },
  ];

  const TABS = ['Posts', 'Comments', 'Awards', 'Saved'];

  // Sample placeholder for posts grid
  const SAMPLE_POST_IMAGES = [
    'https://images.unsplash.com/photo-1540747913346-19212a4d8e74?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=300&auto=format&fit=crop&q=80',
  ];

  const SETTINGS_GROUPS = [
    {
      title: 'Account',
      items: [
        { icon: 'person-outline', label: 'Edit Profile', color: '#3B82F6' },
        { icon: 'lock-closed-outline', label: 'Change Password', color: '#8B5CF6' },
        { icon: 'shield-checkmark-outline', label: 'Privacy', color: '#10B981' },
        { icon: 'notifications-outline', label: 'Notifications', color: '#F59E0B' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: 'language-outline', label: 'Language', color: '#3B82F6' },
        { icon: 'color-palette-outline', label: 'Theme', color: '#EC4899' },
        { icon: 'phone-portrait-outline', label: 'Data Saver', color: '#6B7280' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: 'help-circle-outline', label: 'Help Center', color: '#3B82F6' },
        { icon: 'mail-outline', label: 'Contact Us', color: '#10B981' },
        { icon: 'information-circle-outline', label: 'About DesiCircle', color: '#9CA3AF' },
        { icon: 'document-text-outline', label: 'Terms of Service', color: '#9CA3AF' },
        { icon: 'shield-outline', label: 'Privacy Policy', color: '#9CA3AF' },
      ],
    },
  ];

  if (showSettings) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setShowSettings(false)}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 36 }} />
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
          {SETTINGS_GROUPS.map(group => (
            <View key={group.title} style={styles.settingsGroup}>
              <Text style={styles.settingsGroupTitle}>{group.title}</Text>
              {group.items.map(item => (
                <TouchableOpacity key={item.label} style={styles.settingsItem}>
                  <View style={[styles.settingsItemIcon, { backgroundColor: item.color + '15' }]}>
                    <Ionicons name={item.icon} size={20} color={item.color} />
                  </View>
                  <Text style={styles.settingsItemText}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
                </TouchableOpacity>
              ))}
            </View>
          ))}
          {/* Logout */}
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => {
              Alert.alert('Logout', 'Are you sure you want to logout?', [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Logout', style: 'destructive', onPress: async () => {
                    await safeStorage.removeItem('user_session');
                    await safeStorage.removeItem('auth_tokens');
                    onLogout && onLogout();
                  }
                },
              ]);
            }}
          >
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
          <Text style={styles.appVersion}>DesiCircle v1.0.0 · Made with ❤️ for Desi community</Text>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => setShowSettings(true)}>
          <Ionicons name="settings-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Banner */}
        <LinearGradient colors={['#FF6B00', '#FF9F4A', '#FFD580']} style={styles.banner}>
          <View style={styles.avatarWrap}>
            {userAvatar ? (
              <Image source={{ uri: userAvatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarFallbackText}>{firstLetter}</Text>
              </View>
            )}
            <TouchableOpacity style={styles.avatarEditBtn}>
              <Ionicons name="camera" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userHandle}>{userHandle}</Text>
          {userEmail ? <Text style={styles.userEmail}>{userEmail}</Text> : null}
          <View style={styles.badgesRow}>
            <View style={styles.userBadge}>
              <Text style={styles.userBadgeText}>🧡 Desi Member</Text>
            </View>
            <View style={styles.userBadge}>
              <Text style={styles.userBadgeText}>⭐ New User</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {STATS.map(s => (
            <TouchableOpacity key={s.label} style={styles.statItem}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.profileActions}>
          <TouchableOpacity style={styles.editProfileBtn}>
            <Text style={styles.editProfileBtnText}>✏️ Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareProfileBtn}>
            <Ionicons name="share-social-outline" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Content Tabs */}
        <View style={styles.tabs}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
              {activeTab === tab && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Posts Grid */}
        {activeTab === 'Posts' && (
          <View style={styles.postsGrid}>
            {SAMPLE_POST_IMAGES.map((img, i) => (
              <TouchableOpacity key={i} style={styles.gridItem}>
                <Image source={{ uri: img }} style={styles.gridImage} resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {(activeTab === 'Comments' || activeTab === 'Awards' || activeTab === 'Saved') && (
          <View style={styles.emptyTab}>
            <Text style={styles.emptyTabIcon}>{activeTab === 'Awards' ? '🏆' : activeTab === 'Saved' ? '🔖' : '💬'}</Text>
            <Text style={styles.emptyTabTitle}>No {activeTab} yet</Text>
            <Text style={styles.emptyTabText}>Your {activeTab.toLowerCase()} will appear here</Text>
          </View>
        )}
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
  banner: { height: 120, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 0 },
  avatarWrap: { position: 'relative', marginBottom: -40 },
  avatar: { width: 86, height: 86, borderRadius: 43, borderWidth: 4, borderColor: '#fff' },
  avatarFallback: {
    width: 86, height: 86, borderRadius: 43,
    backgroundColor: '#FF6B00', alignItems: 'center', justifyContent: 'center',
    borderWidth: 4, borderColor: '#fff',
  },
  avatarFallbackText: { fontSize: 36, fontWeight: 'bold', color: '#fff' },
  avatarEditBtn: {
    position: 'absolute', bottom: 4, right: 4,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#FF6B00', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#fff',
  },
  userInfo: { alignItems: 'center', paddingTop: 48, paddingBottom: 16, backgroundColor: '#fff' },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#1F2937', marginBottom: 4 },
  userHandle: { fontSize: 14, color: '#9CA3AF', marginBottom: 4 },
  userEmail: { fontSize: 13, color: '#9CA3AF', marginBottom: 10 },
  badgesRow: { flexDirection: 'row', gap: 8 },
  userBadge: { backgroundColor: '#FFF3EC', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  userBadgeText: { fontSize: 12, color: '#FF6B00', fontWeight: '600' },
  statsRow: {
    flexDirection: 'row', backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#F3F4F6',
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: 16, borderRightWidth: 1, borderRightColor: '#F3F4F6' },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  statLabel: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  profileActions: {
    flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff',
    borderBottomWidth: 8, borderBottomColor: '#F3F4F6',
  },
  editProfileBtn: {
    flex: 1, height: 42, borderRadius: 21, borderWidth: 2, borderColor: '#FF6B00',
    alignItems: 'center', justifyContent: 'center',
  },
  editProfileBtnText: { fontSize: 14, fontWeight: '600', color: '#FF6B00' },
  shareProfileBtn: {
    width: 42, height: 42, borderRadius: 21, borderWidth: 1.5, borderColor: '#E5E7EB',
    alignItems: 'center', justifyContent: 'center',
  },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 14, position: 'relative' },
  tabActive: {},
  tabText: { fontSize: 13, fontWeight: '500', color: '#9CA3AF' },
  tabTextActive: { color: '#FF6B00', fontWeight: 'bold' },
  tabIndicator: { position: 'absolute', bottom: 0, left: '15%', right: '15%', height: 3, backgroundColor: '#FF6B00', borderRadius: 2 },
  postsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 2 },
  gridItem: { width: '33.33%', padding: 2 },
  gridImage: { width: '100%', aspectRatio: 1, borderRadius: 4 },
  emptyTab: { alignItems: 'center', paddingTop: 60, paddingBottom: 40 },
  emptyTabIcon: { fontSize: 48, marginBottom: 12 },
  emptyTabTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 6 },
  emptyTabText: { fontSize: 14, color: '#9CA3AF' },
  // Settings
  settingsGroup: { marginTop: 20, marginHorizontal: 16 },
  settingsGroupTitle: { fontSize: 12, fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, paddingHorizontal: 4 },
  settingsItem: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 14,
    borderRadius: 12, marginBottom: 2,
  },
  settingsItemIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  settingsItemText: { flex: 1, fontSize: 15, color: '#374151' },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FEF2F2', marginHorizontal: 16, marginTop: 20,
    paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12,
  },
  logoutBtnText: { fontSize: 15, fontWeight: '600', color: '#EF4444' },
  appVersion: { textAlign: 'center', fontSize: 12, color: '#D1D5DB', marginTop: 24, marginBottom: 8 },
});
