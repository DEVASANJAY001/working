import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Image, TextInput, KeyboardAvoidingView, Platform,
  ScrollView, ActivityIndicator, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { messagesService } from '../services/apiService';

export default function MessagesScreen({ onBack, currentUser }) {
  const [inbox, setInbox] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [search, setSearch] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    messagesService.getInbox().then(data => {
      setInbox(data);
      setLoading(false);
    });
  }, []);

  const openChat = async (conv) => {
    setActiveChat(conv);
    const thread = await messagesService.getThread(conv.userId);
    setChatMessages(thread);
    // Mark as read
    setInbox(prev => prev.map(c => c.id === conv.id ? { ...c, unread: 0 } : c));
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChat) return;
    const msg = {
      id: `msg_${Date.now()}`,
      senderId: 'me',
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };
    setChatMessages(prev => [...prev, msg]);
    setNewMessage('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    await messagesService.send(activeChat.userId, newMessage.trim());
    // Simulate delivered
    setTimeout(() => {
      setChatMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status: 'delivered' } : m));
    }, 1000);
  };

  const totalUnread = inbox.reduce((sum, c) => sum + (c.unread || 0), 0);
  const filteredInbox = inbox.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const renderConversation = ({ item }) => (
    <TouchableOpacity style={styles.convItem} onPress={() => openChat(item)} activeOpacity={0.85}>
      <View style={styles.convAvatarWrap}>
        <Image source={{ uri: item.avatar }} style={styles.convAvatar} />
        {item.online && <View style={styles.onlineDot} />}
      </View>
      <View style={styles.convContent}>
        <View style={styles.convRow}>
          <Text style={styles.convName}>{item.name}</Text>
          <Text style={[styles.convTime, item.unread > 0 && styles.convTimeUnread]}>{item.time}</Text>
        </View>
        <View style={styles.convRow}>
          <Text style={[styles.convLast, item.unread > 0 && styles.convLastUnread]} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (activeChat) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Chat Header */}
        <View style={styles.chatHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setActiveChat(null)}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Image source={{ uri: activeChat.avatar }} style={styles.chatAvatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.chatName}>{activeChat.name}</Text>
            <Text style={styles.chatStatus}>{activeChat.online ? '🟢 Online' : 'Last seen recently'}</Text>
          </View>
          <TouchableOpacity style={styles.chatHeaderBtn}>
            <Ionicons name="call-outline" size={22} color="#1F2937" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.chatHeaderBtn}>
            <Ionicons name="ellipsis-vertical" size={22} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={styles.chatBody}
          contentContainerStyle={styles.chatBodyContent}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        >
          {chatMessages.map(msg => {
            const isMe = msg.senderId === 'me';
            return (
              <View key={msg.id} style={[styles.msgWrapper, isMe && styles.msgWrapperMe]}>
                {!isMe && <Image source={{ uri: activeChat.avatar }} style={styles.msgAvatar} />}
                <View style={[styles.msgBubble, isMe && styles.msgBubbleMe]}>
                  <Text style={[styles.msgText, isMe && styles.msgTextMe]}>{msg.text}</Text>
                  <View style={styles.msgMeta}>
                    <Text style={[styles.msgTime, isMe && styles.msgTimeMe]}>{msg.time}</Text>
                    {isMe && (
                      <Ionicons
                        name={msg.status === 'read' ? 'checkmark-done' : msg.status === 'delivered' ? 'checkmark-done' : 'checkmark'}
                        size={14}
                        color={msg.status === 'read' ? '#34D399' : '#9CA3AF'}
                      />
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Input */}
        <View style={styles.chatInput}>
          <TouchableOpacity style={styles.chatInputIcon}>
            <Ionicons name="happy-outline" size={24} color="#6B7280" />
          </TouchableOpacity>
          <TextInput
            style={styles.chatInputField}
            placeholder="Type a message..."
            placeholderTextColor="#9CA3AF"
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />
          {newMessage.trim() ? (
            <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
              <LinearGradient colors={['#FF6B00', '#FF9F4A']} style={styles.sendBtnGradient}>
                <Ionicons name="send" size={18} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.chatInputIcon}>
              <Ionicons name="mic-outline" size={24} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
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
        <View>
          <Text style={styles.headerTitle}>Messages</Text>
          {totalUnread > 0 && <Text style={styles.headerSub}>{totalUnread} unread</Text>}
        </View>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="create-outline" size={22} color="#FF6B00" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={18} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search messages..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Inbox */}
      {loading ? (
        <ActivityIndicator size="large" color="#FF6B00" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredInbox}
          keyExtractor={item => item.id}
          renderItem={renderConversation}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>💬</Text>
              <Text style={styles.emptyTitle}>No messages yet</Text>
              <Text style={styles.emptySubtitle}>Start a conversation!</Text>
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
  headerSub: { fontSize: 12, color: '#9CA3AF' },
  headerBtn: { padding: 6 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    margin: 16, paddingHorizontal: 14, height: 44,
    backgroundColor: '#F3F4F6', borderRadius: 22,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#374151' },
  convItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#F9FAFB',
  },
  convAvatarWrap: { position: 'relative' },
  convAvatar: { width: 52, height: 52, borderRadius: 26 },
  onlineDot: {
    position: 'absolute', bottom: 1, right: 1,
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: '#10B981', borderWidth: 2, borderColor: '#fff',
  },
  convContent: { flex: 1 },
  convRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 },
  convName: { fontSize: 15, fontWeight: 'bold', color: '#1F2937' },
  convTime: { fontSize: 12, color: '#9CA3AF' },
  convTimeUnread: { color: '#FF6B00', fontWeight: '600' },
  convLast: { fontSize: 13, color: '#9CA3AF', flex: 1 },
  convLastUnread: { color: '#374151', fontWeight: '500' },
  unreadBadge: { minWidth: 20, height: 20, borderRadius: 10, backgroundColor: '#FF6B00', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  unreadBadgeText: { fontSize: 11, color: '#fff', fontWeight: 'bold' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 6 },
  emptySubtitle: { fontSize: 14, color: '#9CA3AF' },
  // Chat
  chatHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 12, backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6', gap: 10,
  },
  chatAvatar: { width: 38, height: 38, borderRadius: 19 },
  chatName: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
  chatStatus: { fontSize: 12, color: '#9CA3AF', marginTop: 1 },
  chatHeaderBtn: { padding: 6 },
  chatBody: { flex: 1, backgroundColor: '#F8F9FA' },
  chatBodyContent: { padding: 16, gap: 10 },
  msgWrapper: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  msgWrapperMe: { flexDirection: 'row-reverse' },
  msgAvatar: { width: 30, height: 30, borderRadius: 15 },
  msgBubble: {
    maxWidth: '75%', backgroundColor: '#fff',
    borderRadius: 18, borderBottomLeftRadius: 4,
    paddingHorizontal: 14, paddingVertical: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
  },
  msgBubbleMe: {
    backgroundColor: '#FF6B00', borderRadius: 18, borderBottomRightRadius: 4,
  },
  msgText: { fontSize: 14, color: '#374151', lineHeight: 20 },
  msgTextMe: { color: '#fff' },
  msgMeta: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4, justifyContent: 'flex-end' },
  msgTime: { fontSize: 10, color: '#9CA3AF' },
  msgTimeMe: { color: 'rgba(255,255,255,0.7)' },
  chatInput: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 12, paddingVertical: 10,
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F3F4F6',
  },
  chatInputIcon: { padding: 6 },
  chatInputField: {
    flex: 1, minHeight: 40, maxHeight: 100,
    backgroundColor: '#F3F4F6', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8,
    fontSize: 14, color: '#374151',
  },
  sendBtn: { borderRadius: 22, overflow: 'hidden' },
  sendBtnGradient: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
