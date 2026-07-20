import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  Switch,
  Platform,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  Animated,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const APP_PURPLE = '#7C3AED';
const APP_ORANGE = '#F97316';

const ALL_TOPICS = [
  { id: 'news', label: 'News & Politics', icon: 'newspaper-outline', color: '#EF4444' },
  { id: 'anime', label: 'Anime & Manga', icon: 'film-outline', color: '#EC4899' },
  { id: 'art', label: 'Art & Design', icon: 'brush-outline', color: '#8B5CF6' },
  { id: 'business', label: 'Business', icon: 'briefcase-outline', color: '#059669' },
  { id: 'collectibles', label: 'Collectibles', icon: 'trophy-outline', color: '#D97706' },
  { id: 'education', label: 'Education', icon: 'book-outline', color: '#2563EB' },
  { id: 'fashion', label: 'Fashion', icon: 'shirt-outline', color: '#DB2777' },
  { id: 'food', label: 'Food & Drink', icon: 'pizza-outline', color: '#EA580C' },
  { id: 'games', label: 'Gaming', icon: 'game-controller-outline', color: '#7C3AED' },
  { id: 'health', label: 'Health & Fitness', icon: 'heart-outline', color: '#DC2626' },
  { id: 'home', label: 'Home & Garden', icon: 'home-outline', color: '#16A34A' },
  { id: 'law', label: 'Law & Finance', icon: 'scale-outline', color: '#1D4ED8' },
  { id: 'identity', label: 'Identity', icon: 'finger-print-outline', color: '#7C3AED' },
  { id: 'internet', label: 'Internet Culture', icon: 'globe-outline', color: '#0891B2' },
  { id: 'movies', label: 'Movies & TV', icon: 'film-outline', color: '#7C3AED' },
  { id: 'music', label: 'Music', icon: 'musical-notes-outline', color: '#BE185D' },
  { id: 'photography', label: 'Photography', icon: 'camera-outline', color: '#0369A1' },
  { id: 'science', label: 'Science', icon: 'flask-outline', color: '#047857' },
  { id: 'sports', label: 'Sports', icon: 'football-outline', color: '#B45309' },
  { id: 'tech', label: 'Technology', icon: 'hardware-chip-outline', color: '#1E40AF' },
  { id: 'travel', label: 'Travel', icon: 'airplane-outline', color: '#0F766E' },
  { id: 'animals', label: 'Animals & Pets', icon: 'paw-outline', color: '#B45309' },
  { id: 'crafts', label: 'Crafts & DIY', icon: 'construct-outline', color: '#92400E' },
  { id: 'crypto', label: 'Crypto & Web3', icon: 'logo-bitcoin', color: '#D97706' },
  { id: 'comedy', label: 'Comedy', icon: 'happy-outline', color: '#F59E0B' },
  { id: 'history', label: 'History', icon: 'time-outline', color: '#6B7280' },
  { id: 'philosophy', label: 'Philosophy', icon: 'school-outline', color: '#4B5563' },
  { id: 'relationship', label: 'Relationship', icon: 'people-outline', color: '#E11D48' },
  { id: 'environment', label: 'Environment', icon: 'leaf-outline', color: '#16A34A' },
  { id: 'career', label: 'Career & Jobs', icon: 'ribbon-outline', color: '#1D4ED8' },
];

export default function CommunityManagerScreen({ onBack }) {
  // Navigation flow state
  const [currentView, setCurrentView] = useState('creation_idea');

  // Step 1 – Idea & Type
  const [communityIdea, setCommunityIdea] = useState('');
  const [communityType, setCommunityType] = useState('Public');
  const [showTypeSheet, setShowTypeSheet] = useState(false);
  const [is18Plus, setIs18Plus] = useState(false);

  // Step 2 – AI Loading animation
  const loadingDots = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  const loadingProgress = useRef(new Animated.Value(0)).current;
  const [aiSuggestedTopics, setAiSuggestedTopics] = useState([]);

  // Step 3 – Topics
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [topicSearch, setTopicSearch] = useState('');

  // Step 4 – Name
  const [communityName, setCommunityName] = useState('');
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [nameStatus, setNameStatus] = useState(null);

  // Community Home
  const [posts, setPosts] = useState([
    { id: '1', author: 'u/devasanjay', text: 'Welcome to our community! This is the first post.', likes: 1, comments: 0, status: 'approved', reports: 0 },
    { id: '2', author: 'u/user123', text: 'Test post for moderation queue', likes: 0, comments: 0, status: 'reported', reports: 2 },
  ]);
  const completedTasks = useRef(2);

  // Mod sections
  const [queueType, setQueueType] = useState('Needs Review');
  const [showQueueFilterSheet, setShowQueueFilterSheet] = useState(false);
  const [modMailTab, setModMailTab] = useState('Inbox');
  const [modMailList, setModMailList] = useState([
    { id: '1', sender: '@user123', subject: 'Ban Appeal', body: 'Please unban me, I did not break any rules.', category: 'Appeals', date: '2h ago', replies: [] },
    { id: '2', sender: '@gamerPro', subject: 'Co-mod invite', body: 'Hey, I would love to help moderate the community!', category: 'Inbox', date: '1d ago', replies: [] },
  ]);
  const [activeMail, setActiveMail] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [modLogs, setModLogs] = useState([
    { id: '1', mod: 'Devasanjay', action: 'Created Community', time: 'Just now', icon: 'shield-checkmark' },
    { id: '2', mod: 'System', action: 'Auto-safety filter applied', time: '1m ago', icon: 'lock-closed' },
  ]);
  const [rules, setRules] = useState([
    { id: '1', title: 'Be Respectful', desc: 'No harassment, hate speech, or personal attacks.', active: true },
    { id: '2', title: 'No Spam', desc: 'Avoid repeated self-promotion or off-topic links.', active: true },
  ]);
  const [newRuleTitle, setNewRuleTitle] = useState('');
  const [newRuleDesc, setNewRuleDesc] = useState('');
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);
  const [automations, setAutomations] = useState([
    { id: '1', trigger: 'On Post Publish', condition: 'Contains spam domain link', action: 'Auto Remove', active: true },
    { id: '2', trigger: 'On Comment Report', condition: 'Report count ≥ 3', action: 'Auto Flag for Review', active: false },
  ]);
  const [safetySpam, setSafetySpam] = useState(true);
  const [safetyHarassment, setSafetyHarassment] = useState(true);
  const [safetyCrowdControl, setSafetyCrowdControl] = useState(false);
  const [moderators, setModerators] = useState([
    { id: '1', name: 'Devasanjay', handle: 'devasanjay', role: 'Head Moderator', status: 'Online', isYou: true },
  ]);
  const [bannedUsers, setBannedUsers] = useState([]);
  const [mutedUsers, setMutedUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [savedResponses, setSavedResponses] = useState([
    { id: '1', title: 'Welcome Message', body: 'Welcome to our community! Please read the rules before posting.' },
  ]);
  const [scheduledPosts, setScheduledPosts] = useState([]);

  // Mod settings sub-pages
  const [modSettingsSubPage, setModSettingsSubPage] = useState(null);
  const [communityDescription, setCommunityDescription] = useState('');
  const [communityGuides, setCommunityGuides] = useState('');
  const [communityAppearance, setCommunityAppearance] = useState({ primaryColor: APP_PURPLE, theme: 'Light' });

  // Custom Alert
  const [customAlert, setCustomAlert] = useState(null);
  const triggerAlert = (title, message) => setCustomAlert({ title, message });

  // ─── Name availability check ─────────────────────────────────
  useEffect(() => {
    if (!communityName) { setNameStatus(null); return; }
    const clean = communityName.toLowerCase().replace(/\s+/g, '');
    if (clean.length < 3) { setNameStatus('invalid'); return; }
    setIsCheckingName(true);
    const t = setTimeout(() => {
      setIsCheckingName(false);
      const taken = ['india', 'gaming', 'ipl', 'cricket', 'tech'];
      setNameStatus(taken.includes(clean) ? 'taken' : 'available');
    }, 700);
    return () => clearTimeout(t);
  }, [communityName]);

  // ─── AI Loading Animation ─────────────────────────────────────
  const startLoadingAnim = () => {
    loadingDots.forEach((dot, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 150),
          Animated.timing(dot, { toValue: 1, duration: 350, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 350, useNativeDriver: true }),
        ])
      ).start();
    });
    Animated.timing(loadingProgress, { toValue: 1, duration: 2500, useNativeDriver: false }).start(() => {
      // After loading: auto-suggest topics from the idea text
      const idea = communityIdea.toLowerCase();
      const autoSuggested = ALL_TOPICS.filter(t => {
        if (idea.includes('sport') || idea.includes('cricket') || idea.includes('football') || idea.includes('game')) {
          return ['sports', 'games'].includes(t.id);
        }
        if (idea.includes('tech') || idea.includes('code') || idea.includes('dev') || idea.includes('software')) {
          return ['tech', 'science'].includes(t.id);
        }
        if (idea.includes('food') || idea.includes('cook') || idea.includes('recipe')) {
          return ['food', 'health'].includes(t.id);
        }
        if (idea.includes('art') || idea.includes('design') || idea.includes('creative')) {
          return ['art', 'photography'].includes(t.id);
        }
        if (idea.includes('music') || idea.includes('song') || idea.includes('band')) {
          return ['music', 'art'].includes(t.id);
        }
        return false;
      }).map(t => t.id);

      const fallback = autoSuggested.length > 0 ? autoSuggested : ['internet', 'news'];
      setAiSuggestedTopics(fallback);
      setSelectedTopics(fallback);
      setCurrentView('creation_topics');
    });
  };

  // ─────────────────────────────────────────────────────────────
  // SCREEN: Idea
  // ─────────────────────────────────────────────────────────────
  const renderIdeaScreen = () => {
    const disabled = !communityIdea.trim();
    return (
      <KeyboardAvoidingView style={styles.fullFlex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.wizardSafeArea}>
          {/* Header */}
          <View style={styles.wizardTopBar}>
            <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
              <Ionicons name="arrow-back" size={22} color="#1F2937" />
            </TouchableOpacity>
            <LinearGradient colors={[APP_PURPLE, APP_ORANGE]} style={styles.progressBarContainer}>
              <View style={[styles.progressBarFillWizard, { width: '30%' }]} />
            </LinearGradient>
          </View>

          <ScrollView contentContainerStyle={styles.wizardBody} showsVerticalScrollIndicator={false}>
            <Text style={styles.bigTitle}>Start with your idea</Text>
            <Text style={styles.subTitle}>Tell us what this community is about. We'll help you choose a topic and name.</Text>

            <View style={styles.ideaInputBox}>
              <TextInput
                style={styles.ideaTextarea}
                placeholder="Describe your community vision..."
                placeholderTextColor="#9CA3AF"
                multiline
                maxLength={1000}
                value={communityIdea}
                onChangeText={setCommunityIdea}
              />
              <Text style={styles.charCounter}>{communityIdea.length}/1000</Text>
            </View>
            <Text style={styles.onlyYouHint}>Only visible to you</Text>

            <View style={styles.exampleCard}>
              <Ionicons name="bulb-outline" size={18} color={APP_PURPLE} style={{ marginRight: 8, marginTop: 1 }} />
              <Text style={styles.exampleText}>
                Example: "A supportive place for first-time cooks to share wins, failures, and recipes."
              </Text>
            </View>

            {/* Community Type */}
            <Text style={styles.fieldLabel}>Community Type</Text>
            <TouchableOpacity style={styles.typePickerRow} onPress={() => setShowTypeSheet(true)}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View style={styles.typeIconCircle}>
                  <Ionicons
                    name={communityType === 'Public' ? 'globe-outline' : communityType === 'Restricted' ? 'eye-outline' : 'lock-closed-outline'}
                    size={18} color={APP_PURPLE}
                  />
                </View>
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.typeName}>{communityType}</Text>
                  <Text style={styles.typeDesc}>
                    {communityType === 'Public' ? 'Anyone can view and post' :
                      communityType === 'Restricted' ? 'Anyone can view, approved can post' :
                        'Only approved members can view'}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryBtn, disabled && styles.primaryBtnDisabled]}
              disabled={disabled}
              onPress={() => { setCurrentView('ai_loading'); startLoadingAnim(); }}
            >
              <Text style={[styles.primaryBtnText, disabled && styles.primaryBtnTextDisabled]}>Continue</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Community Type Sheet */}
        {showTypeSheet && (
          <Modal transparent visible animationType="slide" statusBarTranslucent>
            <View style={styles.overlay}>
              <TouchableOpacity style={styles.overlayBg} onPress={() => setShowTypeSheet(false)} />
              <View style={styles.sheet}>
                <View style={styles.sheetHandle} />
                <View style={styles.sheetTitleRow}>
                  <Text style={styles.sheetTitleText}>Community Type</Text>
                  <TouchableOpacity onPress={() => setShowTypeSheet(false)}>
                    <Ionicons name="close" size={22} color="#1F2937" />
                  </TouchableOpacity>
                </View>
                {[
                  { val: 'Public', icon: 'globe-outline', sub: 'Anyone can search, view and post' },
                  { val: 'Restricted', icon: 'eye-outline', sub: 'Anyone can view. Only approved can post' },
                  { val: 'Private', icon: 'lock-closed-outline', sub: 'Only approved members can see or join' },
                ].map(opt => (
                  <TouchableOpacity key={opt.val} style={styles.radioRow} onPress={() => setCommunityType(opt.val)}>
                    <Ionicons name={opt.icon} size={20} color={communityType === opt.val ? APP_PURPLE : '#6B7280'} style={{ marginRight: 14 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.radioTitle, communityType === opt.val && { color: APP_PURPLE }]}>{opt.val}</Text>
                      <Text style={styles.radioSub}>{opt.sub}</Text>
                    </View>
                    <Ionicons name={communityType === opt.val ? 'radio-button-on' : 'radio-button-off'} size={22} color={communityType === opt.val ? APP_PURPLE : '#D1D5DB'} />
                  </TouchableOpacity>
                ))}
                <View style={styles.toggleRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.radioTitle}>Mature (18+)</Text>
                    <Text style={styles.radioSub}>Restrict to adult content</Text>
                  </View>
                  <Switch value={is18Plus} onValueChange={setIs18Plus} thumbColor={is18Plus ? APP_PURPLE : '#E5E7EB'} trackColor={{ true: '#C4B5FD', false: '#D1D5DB' }} />
                </View>
                <TouchableOpacity style={[styles.primaryBtn, { marginTop: 20 }]} onPress={() => setShowTypeSheet(false)}>
                  <Text style={styles.primaryBtnText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </KeyboardAvoidingView>
    );
  };

  // ─────────────────────────────────────────────────────────────
  // SCREEN: AI Loading
  // ─────────────────────────────────────────────────────────────
  const renderAILoading = () => {
    const progressWidth = loadingProgress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
    return (
      <View style={styles.aiLoadingContainer}>
        <LinearGradient colors={[APP_PURPLE, '#4F46E5', APP_ORANGE]} style={styles.aiGradientBg} />
        <View style={styles.aiLoadingContent}>
          {/* Pulsing icon */}
          <View style={styles.aiIconRing}>
            <View style={styles.aiIconInner}>
              <Ionicons name="sparkles" size={40} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.aiLoadingTitle}>Analysing your idea...</Text>
          <Text style={styles.aiLoadingSubtitle}>
            Our AI is finding the best topics and community structure for you
          </Text>

          {/* Progress bar */}
          <View style={styles.aiProgressBarBg}>
            <Animated.View style={[styles.aiProgressBarFill, { width: progressWidth }]} />
          </View>

          {/* Animated dots */}
          <View style={{ flexDirection: 'row', marginTop: 28, gap: 10 }}>
            {loadingDots.map((dot, i) => (
              <Animated.View
                key={i}
                style={[styles.loadingDot, {
                  transform: [{ scale: dot.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.4] }) }],
                  opacity: dot.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }),
                }]}
              />
            ))}
          </View>

          <Text style={styles.aiHintText}>Choosing topics based on: "{communityIdea.slice(0, 40)}..."</Text>
        </View>
      </View>
    );
  };

  // ─────────────────────────────────────────────────────────────
  // SCREEN: Topics
  // ─────────────────────────────────────────────────────────────
  const renderTopicsScreen = () => {
    const filtered = ALL_TOPICS.filter(t =>
      t.label.toLowerCase().includes(topicSearch.toLowerCase())
    );
    const isSelected = id => selectedTopics.includes(id);
    const toggleTopic = id => {
      setSelectedTopics(prev => isSelected(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    return (
      <View style={styles.fullFlex}>
        <View style={styles.wizardSafeArea}>
          <View style={styles.wizardTopBar}>
            <TouchableOpacity onPress={() => setCurrentView('creation_idea')} style={styles.iconBtn}>
              <Ionicons name="arrow-back" size={22} color="#1F2937" />
            </TouchableOpacity>
            <LinearGradient colors={[APP_PURPLE, APP_ORANGE]} style={styles.progressBarContainer}>
              <View style={[styles.progressBarFillWizard, { width: '55%' }]} />
            </LinearGradient>
          </View>

          <View style={{ paddingHorizontal: 20, paddingBottom: 8 }}>
            <Text style={styles.bigTitle}>Choose topics</Text>
            <Text style={styles.subTitle}>
              AI suggested {aiSuggestedTopics.length} topics. Add or remove as many as you like.
            </Text>

            {/* AI suggested pills */}
            {aiSuggestedTopics.length > 0 && (
              <View style={styles.aiSuggestCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Ionicons name="sparkles" size={14} color={APP_PURPLE} />
                  <Text style={styles.aiSuggestLabel}> AI Suggested</Text>
                </View>
                <View style={styles.pillsRow}>
                  {aiSuggestedTopics.map(id => {
                    const t = ALL_TOPICS.find(t => t.id === id);
                    if (!t) return null;
                    return (
                      <View key={id} style={styles.aiSuggestPill}>
                        <Ionicons name={t.icon} size={13} color={APP_PURPLE} />
                        <Text style={styles.aiSuggestPillText}>{t.label}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Search */}
            <View style={styles.topicSearchBar}>
              <Ionicons name="search" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.topicSearchInput}
                placeholder="Search topics..."
                placeholderTextColor="#9CA3AF"
                value={topicSearch}
                onChangeText={setTopicSearch}
              />
            </View>

            {/* Selected count */}
            <Text style={styles.selectedCount}>{selectedTopics.length} selected</Text>
          </View>

          <ScrollView contentContainerStyle={styles.topicsGrid} showsVerticalScrollIndicator={false}>
            {filtered.map(topic => {
              const sel = isSelected(topic.id);
              return (
                <TouchableOpacity
                  key={topic.id}
                  style={[styles.topicCard, sel && { borderColor: topic.color, backgroundColor: topic.color + '15' }]}
                  onPress={() => toggleTopic(topic.id)}
                >
                  <View style={[styles.topicIconBubble, { backgroundColor: topic.color + '20' }, sel && { backgroundColor: topic.color }]}>
                    <Ionicons name={topic.icon} size={20} color={sel ? '#FFFFFF' : topic.color} />
                  </View>
                  <Text style={[styles.topicCardLabel, sel && { color: topic.color, fontWeight: '700' }]} numberOfLines={2}>
                    {topic.label}
                  </Text>
                  {sel && (
                    <View style={[styles.topicCheckMark, { backgroundColor: topic.color }]}>
                      <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={{ paddingHorizontal: 20, paddingBottom: Platform.OS === 'ios' ? 32 : 20 }}>
            <TouchableOpacity
              style={[styles.primaryBtn, selectedTopics.length === 0 && styles.primaryBtnDisabled]}
              disabled={selectedTopics.length === 0}
              onPress={() => setCurrentView('creation_name')}
            >
              <Text style={[styles.primaryBtnText, selectedTopics.length === 0 && styles.primaryBtnTextDisabled]}>
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // ─────────────────────────────────────────────────────────────
  // SCREEN: Name Your Community (like screenshot 1)
  // ─────────────────────────────────────────────────────────────
  const renderNameScreen = () => {
    const disabled = !communityName || nameStatus !== 'available';
    return (
      <KeyboardAvoidingView style={styles.fullFlex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={{ flex: 1, backgroundColor: '#FFFFFF', paddingTop: Platform.OS === 'android' ? 44 : 44 }}>
          {/* Header bar */}
          <View style={styles.wizardTopBar}>
            <TouchableOpacity onPress={() => setCurrentView('creation_topics')} style={styles.iconBtn}>
              <Ionicons name="arrow-back" size={22} color="#1F2937" />
            </TouchableOpacity>
            {/* Reddit-style red + grey progress bar */}
            <View style={styles.nameProgressBarBg}>
              <View style={[styles.nameProgressBarFill, { width: '75%' }]} />
            </View>
          </View>

          <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
            <Text style={[styles.bigTitle, { textAlign: 'center', marginTop: 12 }]}>Name your community</Text>
            <Text style={[styles.subTitle, { textAlign: 'center', marginBottom: 32 }]}>The best names are descriptive and clear</Text>

            {/* Proper Card Layout matching the uploaded screenshot 1 */}
            <View style={styles.nameCardDesignContainer}>
              {/* Grey Speech bubble background pattern at the top of the card as shown in the screenshot */}
              <View style={styles.nameCardBubblesBg}>
                <View style={[styles.speechBubbleMock, { left: -10, width: 90, height: 40, borderBottomRightRadius: 20, borderBottomLeftRadius: 20 }]} />
                <View style={[styles.speechBubbleMock, { left: 90, width: 80, height: 45, borderBottomRightRadius: 20, borderBottomLeftRadius: 20 }]} />
                <View style={[styles.speechBubbleMock, { left: 180, width: 30, height: 30, borderRadius: 15 }]} />
                <View style={[styles.speechBubbleMock, { left: 220, width: 110, height: 45, borderBottomRightRadius: 20, borderBottomLeftRadius: 20 }]} />
              </View>

              {/* White Overlay Card containing the active community name details */}
              <View style={styles.nameCardWhiteOverlay}>
                <View style={styles.megaphoneAvatarContainer}>
                  <Ionicons name="megaphone" size={24} color="#F97316" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.nameCardTitleText}>{communityName || 'cjppartyy'}</Text>
                  <Text style={styles.nameCardSubtext}>1 visitor and 1 contribution</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Bottom fixed section */}
          <View style={styles.nameBottomSection}>
            {/* Pencil icon input - like screenshot */}
            <View style={styles.nameInputRow}>
              <Ionicons name="pencil-outline" size={18} color="#9CA3AF" style={{ marginRight: 10 }} />
              <TextInput
                style={styles.nameInputInline}
                placeholder="communityname"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                autoCorrect={false}
                value={communityName ? communityName : ''}
                onChangeText={(text) => {
                  const stripped = text.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
                  setCommunityName(stripped);
                }}
              />
              {isCheckingName && <ActivityIndicator size="small" color={APP_PURPLE} />}
            </View>

            {/* Status */}
            {communityName.length > 0 && (
              <Text style={[styles.nameStatusText, {
                color: nameStatus === 'available' ? '#10B981' : nameStatus === 'taken' ? '#EF4444' : '#F59E0B'
              }]}>
                {nameStatus === 'available' ? '✓ Community name is available' :
                  nameStatus === 'taken' ? '✗ This name is already taken' :
                    nameStatus === 'invalid' ? '⚠ Use 3-21 alphanumeric characters' : ''}
              </Text>
            )}

            <TouchableOpacity
              style={[styles.bigBlackBtn, disabled && styles.bigBlackBtnDisabled]}
              disabled={disabled}
              onPress={() => setCurrentView('dashboard_home')}
            >
              <Text style={styles.bigBlackBtnText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  };

  // ─────────────────────────────────────────────────────────────
  // SCREEN: Mod Tools (screenshot 3+4+5 exact layout)
  // ─────────────────────────────────────────────────────────────
  const renderModTools = () => {
    // Full list exactly matching the uploaded images
    const SECTIONS = [
      {
        title: 'Activity',
        items: [
          { label: 'Queues', icon: 'layers-outline', target: 'queues', badge: null },
          { label: 'Mod Mail', icon: 'mail-outline', target: 'modmail', badge: null },
          { label: 'Mod Log', icon: 'list-outline', target: 'modlog', badge: null },
          { label: 'Scheduled Posts', icon: 'calendar-outline', target: 'scheduled', badge: null },
          { label: 'Temporary Events', icon: 'notifications-outline', target: 'events', badge: null },
        ],
      },
      {
        title: 'People',
        items: [
          { label: 'Moderators', icon: 'shield-outline', target: 'moderators', badge: null },
          { label: 'Approved Users', icon: 'checkmark-circle-outline', target: 'approved', badge: null },
          { label: 'Muted Users', icon: 'volume-mute-outline', target: 'muted', badge: null },
          { label: 'Banned Users', icon: 'ban-outline', target: 'banned', badge: null },
        ],
      },
      {
        title: 'Content & Contribution',
        items: [
          { label: 'Rules', icon: 'document-text-outline', target: 'rules', badge: null },
          { label: 'Saved Responses', icon: 'chatbox-outline', target: 'saved_responses', badge: null },
          { label: 'Post Types', icon: 'albums-outline', target: 'post_types', badge: null },
          { label: 'Media in Comments', icon: 'image-outline', target: 'media_comments', badge: 'NEW' },
          { label: 'Archive Posts', icon: 'archive-outline', target: 'archive', badge: null },
          { label: 'Automations', icon: 'code-working-outline', target: 'automations', badge: 'NEW' },
          { label: 'Safety Filters', icon: 'key-outline', target: 'safety', badge: null },
          { label: 'Insights', icon: 'bar-chart-outline', target: 'insights', badge: null },
        ],
      },
      {
        title: 'Settings',
        items: [
          { label: 'Description', icon: 'pencil-outline', target: 'settings_desc', badge: null },
          { label: 'Guides', icon: 'book-outline', target: 'settings_guides', badge: null },
          { label: 'Discovery', icon: 'compass-outline', target: 'settings_discovery', badge: null },
          { label: 'Mod Notifications', icon: 'notifications-outline', target: 'settings_notifications', badge: null },
          { label: 'Community Type', icon: 'lock-closed-outline', target: 'settings_type', badge: null },
          { label: 'Appearance', icon: 'color-palette-outline', target: 'settings_appearance', badge: null },
          { label: 'User Flair', icon: 'pricetag-outline', target: 'settings_userflair', badge: null },
          { label: 'Post Flair', icon: 'pricetags-outline', target: 'settings_postflair', badge: null },
          { label: 'Achievements', icon: 'trophy-outline', target: 'settings_achievements', badge: null },
        ],
      },
    ];

    const RESOURCE_LINKS = [
      { label: 'Reddit for Community', icon: 'logo-reddit', isLink: true },
      { label: 'Mod Help Center', icon: 'help-circle-outline', isLink: true },
      { label: 'Mod Code of Conduct', icon: 'document-outline', isLink: true },
      { label: 'r/ModSupport', icon: 'shield-outline', isLink: false, iconColor: '#FF4500' },
      { label: 'r/modhelp', icon: 'shield-outline', isLink: false, iconColor: '#FF4500' },
      { label: 'Contact Reddit', icon: 'logo-reddit', isLink: true },
    ];

    return (
      <View style={styles.fullFlex}>
        {/* Header */}
        <View style={styles.modToolsTopBar}>
          <TouchableOpacity onPress={() => setCurrentView('dashboard_home')} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={22} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.modToolsHeader}>Mod Tools</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="pencil-outline" size={20} color="#1F2937" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="search-outline" size={20} color="#1F2937" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          {/* Mod Guide highlighted card */}
          <TouchableOpacity style={styles.modGuideBanner} onPress={() => triggerAlert('Mod Guide', 'Access the complete moderator handbook and guidelines here.')}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <Ionicons name="book-outline" size={20} color="#78716C" style={{ marginRight: 14 }} style={{ marginRight: 14 }} />
              <Text style={styles.modGuideText}>Mod Guide</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#78716C" />
          </TouchableOpacity>

          {/* Sections */}
          {SECTIONS.map((sec, sIdx) => (
            <View key={sIdx}>
              <Text style={styles.sectionGroupTitle}>{sec.title}</Text>
              {sec.items.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.modToolRow}
                  onPress={() => setCurrentView(item.target)}
                >
                  <Ionicons name={item.icon} size={20} color="#374151" style={{ marginRight: 16, width: 24 }} />
                  <Text style={styles.modToolRowLabel}>{item.label}</Text>
                  {item.badge && (
                    <View style={styles.newBadge}>
                      <Text style={styles.newBadgeText}>{item.badge}</Text>
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={16} color="#9CA3AF" style={{ marginLeft: 'auto' }} />
                </TouchableOpacity>
              ))}
              {sIdx < SECTIONS.length - 1 && <View style={styles.sectionDivider} />}
            </View>
          ))}

          {/* Resource Links */}
          <View style={styles.sectionDivider} />
          <Text style={styles.sectionGroupTitle}>Resource Links</Text>
          {RESOURCE_LINKS.map((link, idx) => (
            <TouchableOpacity key={idx} style={styles.modToolRow} onPress={() => triggerAlert(link.label, 'This resource link opens in your browser.')}>
              <Ionicons name={link.icon} size={20} color={link.iconColor || '#374151'} style={{ marginRight: 16, width: 24 }} />
              <Text style={styles.modToolRowLabel}>{link.label}</Text>
              <Ionicons name={link.isLink ? 'link-outline' : 'chevron-forward'} size={16} color="#9CA3AF" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  // State for Queues dropdown menu and filters
  const [showQueuesMenu, setShowQueuesMenu] = useState(false);
  const [queueFilterType, setQueueFilterType] = useState('Needs Review'); // Needs Review, Removed, Reported, Edited, Unmoderated
  const [queueFilterContent, setQueueFilterContent] = useState('All'); // All, Posts Only, Comments Only, Awards Only
  const [queueFilterSort, setQueueFilterSort] = useState('Newest First'); // Newest First, Oldest First, Most Reported First

  const [activeFilterSheet, setActiveFilterSheet] = useState(null); // 'type', 'content', 'sort'
  const [showModGuideSheet, setShowModGuideSheet] = useState(false);

  // ─────────────────────────────────────────────────────────────
  // SCREEN: Community Dashboard (screenshot 2 style)
  // ─────────────────────────────────────────────────────────────
  const renderCommunityHome = () => {
    return (
      <View style={styles.fullFlex}>
        {/* Banner with background pattern (grey speech bubbles like screenshot 2) */}
        <View style={styles.bannerContainer}>
          <View style={styles.bannerPatternContainer}>
            <View style={[styles.patternBubble, { top: 10, left: 10, width: 85, height: 45, borderRadius: 22 }]} />
            <View style={[styles.patternBubble, { top: 15, right: 30, width: 95, height: 50, borderRadius: 25 }]} />
            <View style={[styles.patternBubble, { bottom: 5, left: '35%', width: 75, height: 38, borderRadius: 19 }]} />
            <View style={[styles.patternBubble, { bottom: 12, right: 10, width: 50, height: 30, borderRadius: 15 }]} />
          </View>
          
          {/* Top bar over banner with semi-transparent dark circle backgrounds matching screenshot 2 */}
          <View style={styles.commDashTopBar}>
            <TouchableOpacity onPress={onBack} style={styles.commDashIconBtnCircle}>
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity style={styles.commDashIconBtnCircle}>
                <Ionicons name="search-outline" size={22} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.commDashIconBtnCircle}>
                <Ionicons name="share-social-outline" size={22} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.commDashIconBtnCircle}>
                <Ionicons name="ellipsis-vertical" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
          {/* Community Header (matching screenshot 2 layout) */}
          <View style={styles.commDashHeader}>
            <View style={[styles.commDashAvatar, { backgroundColor: '#BBF7D0' }]}>
              {/* Pencil icon inside avatar as shown in screenshot 2 */}
              <Ionicons name="pencil" size={24} color="#10B981" />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.commDashName}>{communityName || 'hisnndijd'}</Text>
            </View>
            {/* Action Buttons Row */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <TouchableOpacity style={styles.modToolsPill} onPress={() => setCurrentView('mod_tools')}>
                <Text style={styles.modToolsPillText}>Mod Tools</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.commDashActionIconRound}>
                <Ionicons name="notifications-off-outline" size={20} color="#1F2937" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.commDashActionIconRound} onPress={() => setShowModGuideSheet(true)}>
                <Ionicons name="book-outline" size={20} color="#1F2937" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Description & See more link */}
          <View style={styles.commDashDescRow}>
            <Text style={styles.commDashDesc}>
              {communityIdea || 'A community for developers to showcase their work, share ideas, and connect with others. Join us for demo parties and collaborative development.'}
            </Text>
            <TouchableOpacity onPress={() => triggerAlert('About', communityIdea || 'Community vision & description.')}>
              <Text style={styles.seeMoreLink}>See more</Text>
            </TouchableOpacity>
          </View>

          {/* Insights card */}
          <View style={styles.insightsCardBlock}>
            <Text style={styles.insightsBlockTitle}>
              Insights <Text style={styles.insightsPeriod}>Past week</Text>
            </Text>
            <Text style={styles.insightsNumbers}>0 visitors • 0 contributions</Text>
          </View>

          {/* Build your community card */}
          <View style={styles.achievementCard}>
            <View style={styles.achievementHeader}>
              <Text style={styles.achievementTitle}>Build your community</Text>
              <Ionicons name="chevron-up" size={20} color="#1F2937" />
            </View>
            <View style={styles.achievementBody}>
              {/* Stacked avatars */}
              <View style={styles.achievementAvatarsRow}>
                {['#FBBF24', '#10B981', '#E5E7EB'].map((c, i) => (
                  <View key={i} style={[styles.achievementMiniAvatar, { backgroundColor: c, marginLeft: i > 0 ? -12 : 0, zIndex: 3 - i }]}>
                    <Ionicons name={i === 0 ? "trophy" : i === 1 ? "checkmark-circle" : "ellipse"} size={12} color="#FFFFFF" />
                  </View>
                ))}
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.achievementLabel}>Finish setting up</Text>
                <View style={styles.achievementProgressBg}>
                  <View style={[styles.achievementProgressFill, { width: '66%', backgroundColor: '#EF4444' }]} />
                </View>
                <Text style={styles.achievementMeta}>2/3 achievements unlocked</Text>
              </View>
              <TouchableOpacity style={styles.finishBtn} onPress={() => setShowModGuideSheet(true)}>
                <Text style={styles.finishBtnText}>Finish</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Posts sort row */}
          <View style={styles.postsSortRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="rocket-outline" size={16} color="#4B5563" />
              <Text style={styles.postsSortLabel}> BEST POSTS</Text>
              <Ionicons name="chevron-down" size={14} color="#4B5563" style={{ marginLeft: 4 }} />
            </View>
            <View style={{ flexDirection: 'row', gap: 14 }}>
              <Ionicons name="grid-outline" size={20} color="#4B5563" />
              <Ionicons name="reorder-four-outline" size={20} color="#4B5563" />
            </View>
          </View>

          {/* Empty feed */}
          <View style={styles.emptyFeedArea}>
            <Text style={{ fontSize: 14, color: '#9CA3AF' }}>No posts yet</Text>
          </View>
        </ScrollView>

        {/* ─── MOD GUIDE BOTTOM SHEET MODAL (screenshot 3 style) ─── */}
        {showModGuideSheet && (
          <Modal transparent visible animationType="slide" statusBarTranslucent>
            <View style={styles.overlay}>
              <TouchableOpacity style={styles.overlayBg} onPress={() => setShowModGuideSheet(false)} />
              <View style={styles.sheet}>
                <View style={styles.sheetHandle} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  {/* Speech bubble style badge */}
                  <View style={styles.modGuideBadgeBubble}>
                    <Text style={styles.modGuideBadgeBubbleText}>{communityName || 'hisnndijd'}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setShowModGuideSheet(false)} style={styles.closeBtnCircle}>
                    <Ionicons name="close" size={20} color="#1F2937" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modGuideTitle}>Welcome to our mod team!</Text>

                {/* Subtitle grey card */}
                <View style={styles.modGuideWelcomeCard}>
                  <Text style={styles.modGuideWelcomeText}>
                    Welcome to the {communityName || 'hisnndijd'} mod team. Read this guide to get started, and reach out to your fellow mods with any questions.
                  </Text>
                  <Text style={styles.modGuideWelcomeAuthor}>- {communityName || 'hisnndijd'} mod team</Text>
                </View>

                <Text style={[styles.fieldLabel, { marginTop: 16 }]}>What's next?</Text>
                <Text style={styles.modGuideNextSub}>
                  Feel free to work through this at your own pace! You can always find this guide again via mod tools or the community page.
                </Text>

                {/* List items */}
                {[
                  { title: 'Say hi to the mod team', sub: '', icon: 'open-outline', btn: 'Go', action: () => { setShowModGuideSheet(false); setCurrentView('modmail'); } },
                  { title: 'Review the rules', sub: 'Review the rules and guidelines', icon: 'document-text-outline', btn: 'Review', action: () => { setShowModGuideSheet(false); setCurrentView('rules'); } },
                  { title: 'Review the Ultimate Guide', sub: 'Learn more about joining a mod team on Reddit', icon: 'bulb-outline', btn: 'Learn', action: () => triggerAlert('Ultimate Guide', 'Handbook is opened successfully.') },
                ].map((item, idx) => (
                  <View key={idx} style={styles.guideListItem}>
                    <Ionicons name={item.icon} size={20} color="#374151" style={{ marginRight: 12, marginTop: 2 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.guideListItemTitle}>{item.title}</Text>
                      {item.sub ? <Text style={styles.guideListItemSub}>{item.sub}</Text> : null}
                    </View>
                    <TouchableOpacity style={styles.guideListItemBtn} onPress={item.action}>
                      <Text style={styles.guideListItemBtnText}>{item.btn}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </Modal>
        )}
      </View>
    );
  };

  // ─────────────────────────────────────────────────────────────
  // SCREEN: Queues (screenshot 4 style)
  // ─────────────────────────────────────────────────────────────
  const renderQueues = () => {
    return (
      <View style={styles.fullFlex}>
        {/* Header bar */}
        <View style={styles.queuesHeaderBar}>
          <TouchableOpacity onPress={() => setCurrentView('mod_tools')} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={22} color="#1F2937" />
          </TouchableOpacity>

          {/* Queues Dropdown Title selector */}
          <TouchableOpacity style={styles.queuesTitleSelector} onPress={() => setShowQueuesMenu(prev => !prev)}>
            <Text style={styles.queuesTitleText}>Queues</Text>
            <Ionicons name="chevron-down" size={16} color="#1F2937" style={{ marginLeft: 4 }} />
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <TouchableOpacity style={styles.greenAvatarBadge}>
              <Ionicons name="person" size={16} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => triggerAlert('Reloaded', 'Queue feed refreshed.')}>
              <Ionicons name="reload" size={20} color="#1F2937" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Queues header menu selection dropdown */}
        {showQueuesMenu && (
          <View style={styles.queuesDropdownMenu}>
            {[
              { label: 'Queues', target: 'queues', icon: 'layers-outline' },
              { label: 'Mod Mail', target: 'modmail', icon: 'mail-outline' },
              { label: 'Mod Log', target: 'modlog', icon: 'list-outline' },
            ].map(item => (
              <TouchableOpacity key={item.label} style={styles.queuesDropdownItem} onPress={() => { setShowQueuesMenu(false); setCurrentView(item.target); }}>
                <Ionicons name={item.icon} size={18} color="#1F2937" style={{ marginRight: 12 }} />
                <Text style={styles.queuesDropdownLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Filters bar underneath top header (matching screenshot 4) */}
        <View style={styles.queuesFilterRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}>
            <TouchableOpacity style={styles.filterPill}>
              <Text style={styles.filterPillText}>{communityName || 'hisnndijd'}</Text>
              <Ionicons name="chevron-down" size={12} color="#4B5563" style={{ marginLeft: 4 }} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.filterPill} onPress={() => setActiveFilterSheet('type')}>
              <Text style={styles.filterPillText}>{queueFilterType}</Text>
              <Ionicons name="chevron-down" size={12} color="#4B5563" style={{ marginLeft: 4 }} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.filterPill} onPress={() => setActiveFilterSheet('content')}>
              <Text style={styles.filterPillText}>{queueFilterContent}</Text>
              <Ionicons name="chevron-down" size={12} color="#4B5563" style={{ marginLeft: 4 }} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.filterPill} onPress={() => setActiveFilterSheet('sort')}>
              <Text style={styles.filterPillText}>{queueFilterSort}</Text>
              <Ionicons name="chevron-down" size={12} color="#4B5563" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Queues Content List / Empty Dog State */}
        <ScrollView contentContainerStyle={styles.queuesMainBody} showsVerticalScrollIndicator={false}>
          {/* Always display the cute smiling dog empty state as requested in screenshot 4 */}
          <View style={styles.dogEmptyState}>
            {/* Smiling dog picture representation */}
            <View style={styles.dogImageWrapper}>
              <View style={styles.dogImageMock}>
                {/* Dog head representation */}
                <View style={styles.dogHead}>
                  <View style={[styles.dogEye, { left: 16 }]} />
                  <View style={[styles.dogEye, { right: 16 }]} />
                  <View style={styles.dogNose} />
                  <View style={styles.dogSmile} />
                </View>
                {/* Red collar as in screenshot */}
                <View style={styles.dogCollar} />
              </View>
            </View>

            <Text style={styles.dogSuccessTitle}>Good job</Text>
            <Text style={styles.dogSuccessSub}>Everything's been reviewed.</Text>

            <TouchableOpacity style={styles.dogBackBtn} onPress={() => setCurrentView('dashboard_home')}>
              <Text style={styles.dogBackBtnText}>Go to Community Page</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* ─── FILTERS SELECTION BOTTOM SHEETS ─── */}
        {activeFilterSheet && (
          <Modal transparent visible animationType="fade" statusBarTranslucent>
            <View style={styles.overlay}>
              <TouchableOpacity style={styles.overlayBg} onPress={() => setActiveFilterSheet(null)} />
              <View style={styles.sheet}>
                <View style={styles.sheetHandle} />
                <View style={styles.sheetHeader}>
                  <Text style={styles.sheetTitleText}>
                    {activeFilterSheet === 'type' ? 'Queues' :
                     activeFilterSheet === 'content' ? 'Filter by content' : 'Sort by'}
                  </Text>
                  <TouchableOpacity onPress={() => setActiveFilterSheet(null)}>
                    <Ionicons name="close" size={22} color="#1F2937" />
                  </TouchableOpacity>
                </View>

                {/* Queue Type Filter */}
                {activeFilterSheet === 'type' && (
                  ['Needs Review', 'Removed', 'Reported', 'Edited', 'Unmoderated'].map(item => (
                    <TouchableOpacity key={item} style={styles.radioRow} onPress={() => { setQueueFilterType(item); setActiveFilterSheet(null); }}>
                      <Text style={[styles.radioTitle, queueFilterType === item && { color: APP_PURPLE }]}>{item}</Text>
                      <Ionicons name={queueFilterType === item ? 'checkmark' : 'square-outline'} size={18} color={queueFilterType === item ? APP_PURPLE : '#9CA3AF'} />
                    </TouchableOpacity>
                  ))
                )}

                {/* Content Filter */}
                {activeFilterSheet === 'content' && (
                  ['All', 'Posts Only', 'Comments Only', 'Awards Only'].map(item => (
                    <TouchableOpacity key={item} style={styles.radioRow} onPress={() => { setQueueFilterContent(item); setActiveFilterSheet(null); }}>
                      <Text style={[styles.radioTitle, queueFilterContent === item && { color: APP_PURPLE }]}>{item}</Text>
                      <Ionicons name={queueFilterContent === item ? 'checkmark' : 'square-outline'} size={18} color={queueFilterContent === item ? APP_PURPLE : '#9CA3AF'} />
                    </TouchableOpacity>
                  ))
                )}

                {/* Sort Filter */}
                {activeFilterSheet === 'sort' && (
                  ['Newest First', 'Oldest First', 'Most Reported First'].map(item => (
                    <TouchableOpacity key={item} style={styles.radioRow} onPress={() => { setQueueFilterSort(item); setActiveFilterSheet(null); }}>
                      <Text style={[styles.radioTitle, queueFilterSort === item && { color: APP_PURPLE }]}>{item}</Text>
                      <Ionicons name={queueFilterSort === item ? 'checkmark' : 'square-outline'} size={18} color={queueFilterSort === item ? APP_PURPLE : '#9CA3AF'} />
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </View>
          </Modal>
        )}
      </View>
    );
  };

  // ─────────────────────────────────────────────────────────────
  // SCREEN: Mod Mail
  // ─────────────────────────────────────────────────────────────
  const renderModMail = () => renderSubPageShell('Mod Mail', 'mod_tools', (
    <>
      <View style={styles.mailTabs}>
        {['Inbox', 'Appeals', 'Conversations'].map(tab => (
          <TouchableOpacity key={tab} style={[styles.mailTab, modMailTab === tab && styles.mailTabActive]} onPress={() => { setModMailTab(tab); setActiveMail(null); }}>
            <Text style={[styles.mailTabText, modMailTab === tab && styles.mailTabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {activeMail ? (
        <View style={{ flex: 1, padding: 16 }}>
          <TouchableOpacity onPress={() => setActiveMail(null)} style={{ marginBottom: 12 }}>
            <Text style={{ color: APP_PURPLE, fontWeight: '600' }}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.mailThread}>
            <Text style={styles.mailThreadSubject}>{activeMail.subject}</Text>
            <Text style={styles.mailThreadSender}>From {activeMail.sender} • {activeMail.date}</Text>
            <Text style={styles.mailThreadBody}>{activeMail.body}</Text>
            {activeMail.replies.map((r, i) => (
              <View key={i} style={styles.mailReplyBubble}>
                <Text style={styles.mailReplyMod}>You replied:</Text>
                <Text style={styles.mailReplyText}>{r.text}</Text>
              </View>
            ))}
          </View>
          <View style={styles.mailReplyRow}>
            <TextInput style={styles.mailReplyInput} placeholder="Reply..." placeholderTextColor="#9CA3AF" value={replyText} onChangeText={setReplyText} />
            <TouchableOpacity style={styles.mailSendBtn} onPress={() => {
              if (!replyText.trim()) return;
              const updated = [...activeMail.replies, { text: replyText }];
              setActiveMail({ ...activeMail, replies: updated });
              setModMailList(prev => prev.map(m => m.id === activeMail.id ? { ...m, replies: updated } : m));
              setReplyText('');
            }}>
              <Ionicons name="send" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {modMailList.filter(m => m.category === modMailTab).map(mail => (
            <TouchableOpacity key={mail.id} style={styles.mailCard} onPress={() => setActiveMail(mail)}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.mailCardSender}>{mail.sender}</Text>
                <Text style={styles.mailCardDate}>{mail.date}</Text>
              </View>
              <Text style={styles.mailCardSubject}>{mail.subject}</Text>
              <Text style={styles.mailCardSnippet} numberOfLines={1}>{mail.body}</Text>
            </TouchableOpacity>
          ))}
          {modMailList.filter(m => m.category === modMailTab).length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="mail-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyStateTitle}>No messages</Text>
            </View>
          )}
        </ScrollView>
      )}
    </>
  ));

  // ─────────────────────────────────────────────────────────────
  // SCREEN: Mod Log
  // ─────────────────────────────────────────────────────────────
  const renderModLog = () => renderSubPageShell('Mod Log', 'mod_tools', (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {modLogs.map(log => (
        <View key={log.id} style={styles.logCard}>
          <View style={styles.logIconCircle}>
            <Ionicons name={log.icon || 'construct-outline'} size={16} color={APP_PURPLE} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.logAction}><Text style={{ fontWeight: '700' }}>{log.mod}</Text>: {log.action}</Text>
            <Text style={styles.logTime}>{log.time}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  ));

  // ─────────────────────────────────────────────────────────────
  // SCREEN: Moderators
  // ─────────────────────────────────────────────────────────────
  const renderModerators = () => renderSubPageShell('Moderators', 'mod_tools', (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {moderators.map(mod => (
        <View key={mod.id} style={styles.peopleCard}>
          <LinearGradient colors={[APP_PURPLE, APP_ORANGE]} style={styles.peopleAvatar}>
            <Text style={styles.peopleAvatarLetter}>{mod.name.charAt(0)}</Text>
          </LinearGradient>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.peopleName}>{mod.name}</Text>
              {mod.isYou && <View style={styles.youBadge}><Text style={styles.youBadgeText}>You</Text></View>}
            </View>
            <Text style={styles.peopleRole}>{mod.role}</Text>
          </View>
          <View style={[styles.statusDot, { backgroundColor: mod.status === 'Online' ? '#10B981' : '#9CA3AF' }]} />
        </View>
      ))}
      <TouchableOpacity style={styles.addPeopleBtn} onPress={() => triggerAlert('Invite Mod', 'Share invite link to add new moderators.')}>
        <Ionicons name="add-circle-outline" size={20} color={APP_PURPLE} />
        <Text style={styles.addPeopleBtnText}>Invite Moderator</Text>
      </TouchableOpacity>
    </ScrollView>
  ));

  // ─────────────────────────────────────────────────────────────
  // SCREEN: Rules
  // ─────────────────────────────────────────────────────────────
  const renderRules = () => renderSubPageShell('Rules', 'mod_tools', (
    <>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {rules.map((rule, idx) => (
          <View key={rule.id} style={styles.ruleCard}>
            <View style={styles.ruleNumCircle}><Text style={styles.ruleNum}>{idx + 1}</Text></View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.ruleTitle}>{rule.title}</Text>
              <Text style={styles.ruleDesc}>{rule.desc}</Text>
            </View>
            <TouchableOpacity onPress={() => {
              setRules(prev => prev.filter(r => r.id !== rule.id));
              setModLogs(prev => [{ id: Date.now().toString(), mod: 'Devasanjay', action: `Deleted rule: "${rule.title}"`, time: 'Just now', icon: 'trash' }, ...prev]);
            }}>
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={styles.addPeopleBtn} onPress={() => setShowAddRuleModal(true)}>
          <Ionicons name="add-circle-outline" size={20} color={APP_PURPLE} />
          <Text style={styles.addPeopleBtnText}>Add Rule</Text>
        </TouchableOpacity>
      </ScrollView>

      {showAddRuleModal && (
        <Modal transparent visible animationType="slide" statusBarTranslucent>
          <View style={styles.overlay}>
            <TouchableOpacity style={styles.overlayBg} onPress={() => setShowAddRuleModal(false)} />
            <View style={styles.sheet}>
              <View style={styles.sheetHandle} />
              <Text style={styles.sheetTitleText}>New Rule</Text>
              <TextInput style={styles.settingsInput} placeholder="Rule title" placeholderTextColor="#9CA3AF" value={newRuleTitle} onChangeText={setNewRuleTitle} />
              <TextInput style={[styles.settingsInput, { height: 80, textAlignVertical: 'top' }]} placeholder="Rule description" placeholderTextColor="#9CA3AF" multiline value={newRuleDesc} onChangeText={setNewRuleDesc} />
              <TouchableOpacity style={[styles.primaryBtn, { marginTop: 16 }]} onPress={() => {
                if (!newRuleTitle.trim()) return;
                setRules(prev => [...prev, { id: Date.now().toString(), title: newRuleTitle, desc: newRuleDesc, active: true }]);
                setModLogs(prev => [{ id: Date.now().toString(), mod: 'Devasanjay', action: `Added rule: "${newRuleTitle}"`, time: 'Just now', icon: 'checkmark-circle' }, ...prev]);
                setNewRuleTitle(''); setNewRuleDesc('');
                setShowAddRuleModal(false);
                triggerAlert('Rule Added', 'New community rule created.');
              }}>
                <Text style={styles.primaryBtnText}>Save Rule</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </>
  ));

  // ─────────────────────────────────────────────────────────────
  // SCREEN: Automations
  // ─────────────────────────────────────────────────────────────
  const renderAutomations = () => renderSubPageShell('Automations', 'mod_tools', (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {automations.map(auto => (
        <View key={auto.id} style={styles.automationCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.autoTrigger}>{auto.trigger}</Text>
            <Switch value={auto.active} onValueChange={val => setAutomations(prev => prev.map(a => a.id === auto.id ? { ...a, active: val } : a))} thumbColor={auto.active ? APP_PURPLE : '#E5E7EB'} trackColor={{ true: '#C4B5FD', false: '#D1D5DB' }} />
          </View>
          <Text style={styles.autoDetail}>If: {auto.condition}</Text>
          <Text style={[styles.autoDetail, { color: APP_PURPLE, fontWeight: '700' }]}>Then: {auto.action}</Text>
        </View>
      ))}
    </ScrollView>
  ));

  // ─────────────────────────────────────────────────────────────
  // SCREEN: Safety Filters
  // ─────────────────────────────────────────────────────────────
  const renderSafety = () => renderSubPageShell('Safety Filters', 'mod_tools', (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {[
        { label: 'Spam Detection', sub: 'Auto-flag links from low credibility domains', val: safetySpam, set: setSafetySpam },
        { label: 'Harassment Filter', sub: 'Collapse comments flagged for abuse or hate speech', val: safetyHarassment, set: setSafetyHarassment },
        { label: 'Crowd Control', sub: 'Require approval for posts from new members', val: safetyCrowdControl, set: setSafetyCrowdControl },
      ].map((item, idx) => (
        <View key={idx} style={styles.toggleCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.toggleCardLabel}>{item.label}</Text>
            <Text style={styles.toggleCardSub}>{item.sub}</Text>
          </View>
          <Switch value={item.val} onValueChange={item.set} thumbColor={item.val ? APP_PURPLE : '#E5E7EB'} trackColor={{ true: '#C4B5FD', false: '#D1D5DB' }} />
        </View>
      ))}
    </ScrollView>
  ));

  // ─────────────────────────────────────────────────────────────
  // SCREEN: Insights Analytics
  // ─────────────────────────────────────────────────────────────
  const renderInsights = () => renderSubPageShell('Insights', 'mod_tools', (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.sectionGroupTitle}>Weekly Traffic</Text>
      <View style={styles.chartRow}>
        {[{ d: 'M', v: 40 }, { d: 'T', v: 80 }, { d: 'W', v: 60 }, { d: 'T', v: 140 }, { d: 'F', v: 100 }, { d: 'S', v: 160 }, { d: 'S', v: 200 }].map((b, i) => (
          <View key={i} style={styles.chartCol}>
            <View style={[styles.chartBar, { height: b.v, backgroundColor: APP_PURPLE }]} />
            <Text style={styles.chartDay}>{b.d}</Text>
          </View>
        ))}
      </View>
      <View style={styles.statsCard}>
        <View style={styles.statsRow}><Text style={styles.statsLabel}>Total Visitors</Text><Text style={styles.statsVal}>243</Text></View>
        <View style={styles.statsRow}><Text style={styles.statsLabel}>Engagement Rate</Text><Text style={[styles.statsVal, { color: '#10B981' }]}>+48%</Text></View>
        <View style={styles.statsRow}><Text style={styles.statsLabel}>Top Contributor</Text><Text style={[styles.statsVal, { color: APP_PURPLE }]}>@Devasanjay</Text></View>
      </View>
    </ScrollView>
  ));

  // ─────────────────────────────────────────────────────────────
  // SCREEN: Generic People Management (approved/muted/banned)
  // ─────────────────────────────────────────────────────────────
  const renderPeopleList = (title, backTarget, list, setList, emptyText, banLabel) =>
    renderSubPageShell(title, backTarget, (
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {list.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color="#D1D5DB" />
            <Text style={styles.emptyStateTitle}>{emptyText}</Text>
          </View>
        ) : list.map(u => (
          <View key={u.id} style={styles.peopleCard}>
            <View style={styles.peopleAvatarSmall}>
              <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>{u.name.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.peopleName}>{u.name}</Text>
              <Text style={styles.peopleRole}>{u.handle}</Text>
            </View>
            <TouchableOpacity onPress={() => setList(prev => prev.filter(x => x.id !== u.id))}>
              <Ionicons name="close-circle-outline" size={22} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    ));

  // ─────────────────────────────────────────────────────────────
  // SCREEN: Saved Responses
  // ─────────────────────────────────────────────────────────────
  const renderSavedResponses = () => renderSubPageShell('Saved Responses', 'mod_tools', (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {savedResponses.map(r => (
        <View key={r.id} style={styles.ruleCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.ruleTitle}>{r.title}</Text>
            <Text style={styles.ruleDesc}>{r.body}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  ));

  // ─────────────────────────────────────────────────────────────
  // SCREEN: Generic Settings Form (desc/guides/appearance etc.)
  // ─────────────────────────────────────────────────────────────
  const renderSettingsPage = (title, back, children) => renderSubPageShell(title, back, (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      {children}
      <TouchableOpacity style={[styles.primaryBtn, { marginTop: 24 }]} onPress={() => { setCurrentView(back); triggerAlert('Saved', `${title} updated.`); }}>
        <Text style={styles.primaryBtnText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  ));

  // ─────────────────────────────────────────────────────────────
  // MAIN RENDER ROUTER
  // ─────────────────────────────────────────────────────────────
  const renderCurrentView = () => {
    switch (currentView) {
      case 'creation_idea': return renderIdeaScreen();
      case 'ai_loading': return renderAILoading();
      case 'creation_topics': return renderTopicsScreen();
      case 'creation_name': return renderNameScreen();
      case 'dashboard_home': return renderCommunityHome();
      case 'mod_tools': return renderModTools();
      case 'queues': return renderQueues();
      case 'modmail': return renderModMail();
      case 'modlog': return renderModLog();
      case 'moderators': return renderModerators();
      case 'approved': return renderPeopleList('Approved Users', 'mod_tools', approvedUsers, setApprovedUsers, 'No approved users yet', 'Remove');
      case 'muted': return renderPeopleList('Muted Users', 'mod_tools', mutedUsers, setMutedUsers, 'No muted users', 'Unmute');
      case 'banned': return renderPeopleList('Banned Users', 'mod_tools', bannedUsers, setBannedUsers, 'No banned users', 'Unban');
      case 'rules': return renderRules();
      case 'saved_responses': return renderSavedResponses();
      case 'automations': return renderAutomations();
      case 'safety': return renderSafety();
      case 'insights': return renderInsights();
      case 'scheduled': return renderSubPageShell('Scheduled Posts', 'mod_tools', (
        <View style={styles.emptyState}><Ionicons name="calendar-outline" size={48} color="#D1D5DB" /><Text style={styles.emptyStateTitle}>No scheduled posts</Text></View>
      ));
      case 'events': return renderSubPageShell('Temporary Events', 'mod_tools', (
        <View style={styles.emptyState}><Ionicons name="notifications-outline" size={48} color="#D1D5DB" /><Text style={styles.emptyStateTitle}>No active events</Text></View>
      ));
      case 'post_types': return renderSubPageShell('Post Types', 'mod_tools', (
        <View style={styles.emptyState}><Ionicons name="albums-outline" size={48} color="#D1D5DB" /><Text style={styles.emptyStateTitle}>Post types configuration</Text><Text style={styles.emptyStateSub}>Allow text, images, videos, polls, and links</Text></View>
      ));
      case 'media_comments': return renderSubPageShell('Media in Comments', 'mod_tools', (
        <View style={styles.emptyState}><Ionicons name="image-outline" size={48} color="#D1D5DB" /><Text style={styles.emptyStateTitle}>Media in Comments</Text><Text style={styles.emptyStateSub}>Configure whether members can post images in comments</Text></View>
      ));
      case 'archive': return renderSubPageShell('Archive Posts', 'mod_tools', (
        <View style={styles.emptyState}><Ionicons name="archive-outline" size={48} color="#D1D5DB" /><Text style={styles.emptyStateTitle}>No archived posts</Text></View>
      ));
      case 'settings_desc': return renderSettingsPage('Description', 'mod_tools', (
        <>
          <Text style={styles.settingsFieldLabel}>Community Description</Text>
          <TextInput style={[styles.settingsInput, { height: 100, textAlignVertical: 'top' }]} placeholder="Tell people what this community is about..." placeholderTextColor="#9CA3AF" multiline value={communityDescription} onChangeText={setCommunityDescription} />
        </>
      ));
      case 'settings_guides': return renderSettingsPage('Guides', 'mod_tools', (
        <>
          <Text style={styles.settingsFieldLabel}>Community Guide</Text>
          <TextInput style={[styles.settingsInput, { height: 120, textAlignVertical: 'top' }]} placeholder="Write a guide or FAQ for new members..." placeholderTextColor="#9CA3AF" multiline value={communityGuides} onChangeText={setCommunityGuides} />
        </>
      ));
      case 'settings_type': return renderSettingsPage('Community Type', 'mod_tools', (
        <>
          <Text style={styles.settingsFieldLabel}>Visibility</Text>
          {['Public', 'Restricted', 'Private'].map(t => (
            <TouchableOpacity key={t} style={styles.radioRow} onPress={() => setCommunityType(t)}>
              <Text style={[styles.radioTitle, { flex: 1 }]}>{t}</Text>
              <Ionicons name={communityType === t ? 'radio-button-on' : 'radio-button-off'} size={22} color={communityType === t ? APP_PURPLE : '#D1D5DB'} />
            </TouchableOpacity>
          ))}
        </>
      ));
      case 'settings_notifications': return renderSettingsPage('Mod Notifications', 'mod_tools', (
        <View style={styles.emptyState}><Ionicons name="notifications-outline" size={48} color="#D1D5DB" /><Text style={styles.emptyStateTitle}>Notification Preferences</Text></View>
      ));
      case 'settings_discovery': return renderSettingsPage('Discovery', 'mod_tools', (
        <View style={styles.emptyState}><Ionicons name="compass-outline" size={48} color="#D1D5DB" /><Text style={styles.emptyStateTitle}>Discovery Settings</Text><Text style={styles.emptyStateSub}>Control how your community appears in search</Text></View>
      ));
      case 'settings_appearance': return renderSettingsPage('Appearance', 'mod_tools', (
        <View style={styles.emptyState}><Ionicons name="color-palette-outline" size={48} color="#D1D5DB" /><Text style={styles.emptyStateTitle}>Appearance</Text><Text style={styles.emptyStateSub}>Customize banner, icon, and colors</Text></View>
      ));
      case 'settings_userflair': return renderSettingsPage('User Flair', 'mod_tools', (
        <View style={styles.emptyState}><Ionicons name="pricetag-outline" size={48} color="#D1D5DB" /><Text style={styles.emptyStateTitle}>User Flair</Text><Text style={styles.emptyStateSub}>Create custom flairs for your members</Text></View>
      ));
      case 'settings_postflair': return renderSettingsPage('Post Flair', 'mod_tools', (
        <View style={styles.emptyState}><Ionicons name="pricetags-outline" size={48} color="#D1D5DB" /><Text style={styles.emptyStateTitle}>Post Flair</Text><Text style={styles.emptyStateSub}>Create categories to label posts</Text></View>
      ));
      case 'settings_achievements': return renderSettingsPage('Achievements', 'mod_tools', (
        <View style={styles.emptyState}><Ionicons name="trophy-outline" size={48} color="#D1D5DB" /><Text style={styles.emptyStateTitle}>Achievements</Text><Text style={styles.emptyStateSub}>Milestone achievements for your community</Text></View>
      ));
      default: return renderIdeaScreen();
    }
  };

  return (
    <View style={styles.root}>
      {renderCurrentView()}

      {/* Global Alert Modal */}
      {customAlert && (
        <Modal transparent visible animationType="fade" statusBarTranslucent>
          <View style={styles.alertOverlay}>
            <View style={styles.alertBox}>
              <Text style={styles.alertTitle}>{customAlert.title}</Text>
              <Text style={styles.alertMessage}>{customAlert.message}</Text>
              <TouchableOpacity style={styles.alertOkBtn} onPress={() => setCustomAlert(null)}>
                <Text style={styles.alertOkText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  fullFlex: { flex: 1, backgroundColor: '#FFFFFF' },

  // Wizard layout
  wizardSafeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? 44 : 44 },
  wizardTopBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, gap: 12 },
  wizardBody: { paddingHorizontal: 20, paddingBottom: 40 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6' },
  progressBarContainer: { flex: 1, height: 4, borderRadius: 2, overflow: 'hidden' },
  progressBarFillWizard: { height: '100%', backgroundColor: '#FFFFFF', opacity: 0.5 },

  // Typography
  bigTitle: { fontSize: 26, fontWeight: '800', color: '#0F172A', marginBottom: 6 },
  subTitle: { fontSize: 14, color: '#6B7280', lineHeight: 20, marginBottom: 24 },
  fieldLabel: { fontSize: 14, fontWeight: '700', color: '#374151', marginBottom: 8 },

  // Idea screen
  ideaInputBox: { borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 16, padding: 16, backgroundColor: '#F9FAFB', marginBottom: 6, minHeight: 150 },
  ideaTextarea: { fontSize: 15, color: '#1F2937', textAlignVertical: 'top', minHeight: 100 },
  charCounter: { textAlign: 'right', fontSize: 11, color: '#9CA3AF', marginTop: 8 },
  onlyYouHint: { fontSize: 11, color: '#9CA3AF', marginBottom: 20 },
  exampleCard: { flexDirection: 'row', backgroundColor: '#F5F3FF', borderRadius: 12, padding: 14, marginBottom: 24 },
  exampleText: { flex: 1, fontSize: 13, fontStyle: 'italic', color: '#6D28D9', lineHeight: 18 },

  // Type Picker
  typePickerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 16, padding: 14, marginBottom: 32 },
  typeIconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F5F3FF', justifyContent: 'center', alignItems: 'center' },
  typeName: { fontSize: 14, fontWeight: '700', color: '#1F2937' },
  typeDesc: { fontSize: 11, color: '#6B7280', marginTop: 2 },

  // Buttons
  primaryBtn: { backgroundColor: '#0F172A', borderRadius: 28, height: 50, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  primaryBtnDisabled: { backgroundColor: '#E5E7EB' },
  primaryBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  primaryBtnTextDisabled: { color: '#9CA3AF' },
  bigBlackBtn: { backgroundColor: '#000000', borderRadius: 28, height: 52, justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  bigBlackBtnDisabled: { backgroundColor: '#D1D5DB' },
  bigBlackBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },

  // Sheet
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  overlayBg: { flex: 1 },
  sheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: Platform.OS === 'ios' ? 36 : 24 },
  sheetHandle: { width: 36, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  sheetTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sheetTitleText: { fontSize: 18, fontWeight: '800', color: '#1F2937' },
  radioRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  radioTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937' },
  radioSub: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },

  // AI Loading
  aiLoadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  aiGradientBg: { ...StyleSheet.absoluteFillObject },
  aiLoadingContent: { alignItems: 'center', paddingHorizontal: 40 },
  aiIconRing: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  aiIconInner: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' },
  aiLoadingTitle: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', marginBottom: 10, textAlign: 'center' },
  aiLoadingSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 20, marginBottom: 32 },
  aiProgressBarBg: { width: width - 80, height: 6, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 3, overflow: 'hidden' },
  aiProgressBarFill: { height: '100%', backgroundColor: '#FFFFFF', borderRadius: 3 },
  loadingDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FFFFFF' },
  aiHintText: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 24, textAlign: 'center', fontStyle: 'italic' },

  // Topics
  aiSuggestCard: { backgroundColor: '#F5F3FF', borderRadius: 14, padding: 14, marginBottom: 12 },
  aiSuggestLabel: { fontSize: 12, fontWeight: '700', color: '#7C3AED' },
  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  aiSuggestPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EDE9FE', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, gap: 4 },
  aiSuggestPillText: { fontSize: 11, fontWeight: '600', color: '#7C3AED' },
  topicSearchBar: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 12, height: 42, backgroundColor: '#F9FAFB', marginBottom: 8 },
  topicSearchInput: { flex: 1, fontSize: 14, color: '#1F2937' },
  selectedCount: { fontSize: 12, fontWeight: '600', color: '#7C3AED', marginBottom: 4 },
  topicsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 20 },
  topicCard: { width: '31%', borderRadius: 14, padding: 10, alignItems: 'center', marginBottom: 10, borderWidth: 1.5, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB', position: 'relative' },
  topicIconBubble: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  topicCardLabel: { fontSize: 11, fontWeight: '600', color: '#4B5563', textAlign: 'center' },
  topicCheckMark: { position: 'absolute', top: 6, right: 6, width: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },

  // Name screen
  nameProgressBarBg: { flex: 1, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, overflow: 'hidden' },
  nameProgressBarFill: { height: '100%', backgroundColor: '#FF4500' },
  communityPreviewScroll: { marginBottom: 20, marginHorizontal: -8 },
  blurredCommunityCard: { width: 80, height: 80, borderRadius: 16, backgroundColor: '#F3F4F6', marginHorizontal: 6, justifyContent: 'flex-end', padding: 8 },
  blurredAvatarCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#D1D5DB', marginBottom: 4 },
  blurredTextBar: { height: 8, backgroundColor: '#D1D5DB', borderRadius: 4, width: '80%' },
  livePreviewCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1.5, borderColor: '#E5E7EB', padding: 16, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  livePreviewAvatar: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  livePreviewAvatarLetter: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' },
  livePreviewName: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  livePreviewMeta: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
  nameBottomSection: { borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingHorizontal: 20, paddingTop: 16, paddingBottom: Platform.OS === 'ios' ? 32 : 20 },
  nameInputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 28, paddingHorizontal: 18, height: 52, backgroundColor: '#FFFFFF', marginBottom: 10 },
  nameInputInline: { flex: 1, fontSize: 15, color: '#1F2937', fontWeight: '500' },
  nameStatusText: { fontSize: 12, fontWeight: '600', marginBottom: 8, paddingHorizontal: 4 },

  // Community Dashboard
  commDashTopBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: Platform.OS === 'android' ? 44 : 44, paddingBottom: 12 },
  commDashIconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  commDashHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12 },
  commDashAvatar: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  commDashAvatarLetter: { color: '#FFFFFF', fontSize: 22, fontWeight: '800' },
  commDashName: { fontSize: 20, fontWeight: '800', color: '#1F2937' },
  commDashMeta: { fontSize: 12, color: '#9CA3AF', marginTop: 1 },
  modToolsPill: { backgroundColor: '#0F172A', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  modToolsPillText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  commDashDescRow: { paddingHorizontal: 16, marginBottom: 12 },
  commDashDesc: { fontSize: 14, color: '#4B5563', lineHeight: 20 },
  seeMoreLink: { color: '#7C3AED', fontWeight: '600', fontSize: 13, marginTop: 4 },
  commDashIconRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 16 },
  commDashActionIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },

  // Insights block
  insightsCardBlock: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, marginHorizontal: 16, marginBottom: 12, padding: 14 },
  insightsBlockTitle: { fontSize: 14, fontWeight: '700', color: '#1F2937' },
  insightsPeriod: { fontSize: 12, color: '#9CA3AF' },
  insightsNumbers: { fontSize: 13, color: '#6B7280', marginTop: 4 },

  // Achievement card
  achievementCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, marginHorizontal: 16, marginBottom: 16, padding: 14 },
  achievementHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  achievementTitle: { fontSize: 14, fontWeight: '700', color: '#1F2937' },
  achievementBody: { flexDirection: 'row', alignItems: 'center' },
  achievementAvatarsRow: { flexDirection: 'row', alignItems: 'center' },
  achievementMiniAvatar: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFFFFF' },
  achievementProgressBg: { height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, overflow: 'hidden', marginVertical: 4 },
  achievementProgressFill: { height: '100%', backgroundColor: '#FF4500' },
  achievementLabel: { fontSize: 13, fontWeight: '600', color: '#1F2937' },
  achievementMeta: { fontSize: 11, color: '#9CA3AF' },
  finishBtn: { backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8, marginLeft: 8 },
  finishBtnText: { fontSize: 12, fontWeight: '700', color: '#1F2937' },

  // Posts sort row
  postsSortRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  postsSortLabel: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
  emptyFeedArea: { alignItems: 'center', paddingVertical: 60 },
  emptyFeedText: { fontSize: 16, fontWeight: '700', color: '#9CA3AF', marginTop: 12 },
  emptyFeedSub: { fontSize: 13, color: '#D1D5DB', marginTop: 4 },

  // Mod Tools screen
  modToolsTopBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? 44 : 44, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  modToolsHeader: { fontSize: 18, fontWeight: '800', color: '#1F2937' },
  modGuideBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FEFCE8', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#FEF08A' },
  modGuideText: { fontSize: 15, fontWeight: '600', color: '#78716C' },
  sectionGroupTitle: { fontSize: 12, fontWeight: '700', color: '#6B7280', letterSpacing: 0.5, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#F9FAFB' },
  modToolRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  modToolRowLabel: { fontSize: 15, fontWeight: '500', color: '#1F2937', flex: 1 },
  newBadge: { backgroundColor: '#EF4444', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginRight: 8 },
  newBadgeText: { fontSize: 10, fontWeight: '800', color: '#FFFFFF' },
  sectionDivider: { height: 8, backgroundColor: '#F9FAFB' },

  // Queue
  queueTabsScroll: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  queueTabPill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, borderWidth: 1.5, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' },
  queueTabPillActive: { borderColor: '#7C3AED', backgroundColor: '#F5F3FF' },
  queueTabPillText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  queueTabPillTextActive: { color: '#7C3AED' },
  queueCard: { backgroundColor: '#FFFFFF', padding: 16, borderBottomWidth: 8, borderBottomColor: '#F9FAFB' },
  queueCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  queueCardAuthor: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
  reportsBadge: { backgroundColor: '#FEE2E2', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  reportsBadgeText: { fontSize: 11, fontWeight: '700', color: '#EF4444' },
  queueCardText: { fontSize: 14, color: '#1F2937', lineHeight: 20, marginBottom: 12 },
  queueCardActions: { flexDirection: 'row', gap: 8 },
  approveBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#10B981', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, gap: 4 },
  approveBtnText: { fontSize: 12, fontWeight: '700', color: '#10B981' },
  removeBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#EF4444', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, gap: 4 },
  removeBtnText: { fontSize: 12, fontWeight: '700', color: '#EF4444' },

  // Mail
  mailTabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  mailTab: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  mailTabActive: { borderBottomWidth: 2, borderBottomColor: '#7C3AED' },
  mailTabText: { fontSize: 13, fontWeight: '600', color: '#9CA3AF' },
  mailTabTextActive: { color: '#7C3AED', fontWeight: '700' },
  mailCard: { backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', padding: 14, marginBottom: 10 },
  mailCardSender: { fontSize: 13, fontWeight: '700', color: '#7C3AED' },
  mailCardDate: { fontSize: 11, color: '#9CA3AF' },
  mailCardSubject: { fontSize: 14, fontWeight: '700', color: '#1F2937', marginTop: 4 },
  mailCardSnippet: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  mailThread: { backgroundColor: '#F9FAFB', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#E5E7EB', flex: 1 },
  mailThreadSubject: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
  mailThreadSender: { fontSize: 12, color: '#9CA3AF', marginBottom: 14 },
  mailThreadBody: { fontSize: 14, color: '#1F2937', lineHeight: 20, marginBottom: 16 },
  mailReplyBubble: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#F3F4F6', marginTop: 8 },
  mailReplyMod: { fontSize: 11, fontWeight: '700', color: '#7C3AED', marginBottom: 4 },
  mailReplyText: { fontSize: 13, color: '#4B5563' },
  mailReplyRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
  mailReplyInput: { flex: 1, borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 20, paddingHorizontal: 16, height: 42, fontSize: 14, color: '#1F2937' },
  mailSendBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#7C3AED', justifyContent: 'center', alignItems: 'center' },

  // Mod Log
  logCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  logIconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F5F3FF', justifyContent: 'center', alignItems: 'center' },
  logAction: { fontSize: 13, color: '#1F2937', lineHeight: 18 },
  logTime: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },

  // People
  peopleCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  peopleAvatar: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  peopleAvatarSmall: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#7C3AED', justifyContent: 'center', alignItems: 'center' },
  peopleAvatarLetter: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  peopleName: { fontSize: 15, fontWeight: '700', color: '#1F2937' },
  peopleRole: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  youBadge: { backgroundColor: '#F5F3FF', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  youBadgeText: { fontSize: 10, fontWeight: '700', color: '#7C3AED' },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  addPeopleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#7C3AED', borderRadius: 12, padding: 14, gap: 8, marginTop: 8 },
  addPeopleBtnText: { fontSize: 14, fontWeight: '700', color: '#7C3AED' },

  // Rules
  ruleCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  ruleNumCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#F5F3FF', justifyContent: 'center', alignItems: 'center', marginRight: 12, marginTop: 2 },
  ruleNum: { fontSize: 12, fontWeight: '800', color: '#7C3AED' },
  ruleTitle: { fontSize: 14, fontWeight: '700', color: '#1F2937', marginBottom: 2 },
  ruleDesc: { fontSize: 12, color: '#6B7280', lineHeight: 16 },

  // Automations
  automationCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  autoTrigger: { fontSize: 14, fontWeight: '700', color: '#1F2937', flex: 1 },
  autoDetail: { fontSize: 12, color: '#9CA3AF', fontWeight: '600', marginTop: 6 },

  // Safety / toggles
  toggleCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  toggleCardLabel: { fontSize: 14, fontWeight: '700', color: '#1F2937' },
  toggleCardSub: { fontSize: 12, color: '#6B7280', marginTop: 2, lineHeight: 16 },

  // Insights chart
  chartRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 200, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingBottom: 8, marginBottom: 20 },
  chartCol: { alignItems: 'center', flex: 1 },
  chartBar: { width: '60%', borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  chartDay: { fontSize: 11, color: '#9CA3AF', marginTop: 6 },
  statsCard: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  statsLabel: { fontSize: 14, color: '#6B7280' },
  statsVal: { fontSize: 14, fontWeight: '700', color: '#1F2937' },

  // Settings inputs
  settingsInput: { borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: '#1F2937', backgroundColor: '#F9FAFB', marginBottom: 14 },
  settingsFieldLabel: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 8 },

  // Empty states
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 24 },
  emptyStateTitle: { fontSize: 16, fontWeight: '700', color: '#9CA3AF', marginTop: 12 },
  emptyStateSub: { fontSize: 13, color: '#D1D5DB', textAlign: 'center', marginTop: 6, lineHeight: 18 },

  // Alert
  alertOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  alertBox: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 24, width: '100%', maxWidth: 320, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 20, elevation: 10 },
  alertTitle: { fontSize: 17, fontWeight: '800', color: '#1F2937', marginBottom: 8 },
  alertMessage: { fontSize: 14, color: '#4B5563', lineHeight: 20, marginBottom: 20 },
  alertOkBtn: { backgroundColor: '#0F172A', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  alertOkText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },

  // New Banner and Pattern Styles
  bannerContainer: { height: 120, backgroundColor: '#FFFFFF', position: 'relative', overflow: 'hidden', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  bannerPatternContainer: { ...StyleSheet.absoluteFillObject, opacity: 0.8 },
  patternBubble: { position: 'absolute', backgroundColor: '#F3F4F6', borderWidth: 2, borderColor: '#E5E7EB' },
  commDashIconBtnCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  commDashActionIconRound: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },

  // Mod Guide Bottom Sheet styles
  modGuideBadgeBubble: { backgroundColor: '#FF4500', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6 },
  modGuideBadgeBubbleText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  closeBtnCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  modGuideTitle: { fontSize: 22, fontWeight: '800', color: '#1F2937', marginVertical: 12 },
  modGuideWelcomeCard: { backgroundColor: '#F3F4F6', borderRadius: 12, padding: 14, marginBottom: 12 },
  modGuideWelcomeText: { fontSize: 13, color: '#4B5563', lineHeight: 18 },
  modGuideWelcomeAuthor: { fontSize: 11, fontWeight: '700', color: '#6B7280', marginTop: 6, textAlign: 'right' },
  modGuideNextSub: { fontSize: 12, color: '#6B7280', lineHeight: 16, marginBottom: 16 },
  guideListItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 14, marginBottom: 10 },
  guideListItemTitle: { fontSize: 14, fontWeight: '700', color: '#1F2937' },
  guideListItemSub: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
  guideListItemBtn: { backgroundColor: '#EEF2F6', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 6 },
  guideListItemBtnText: { color: '#1F2937', fontSize: 12, fontWeight: '700' },

  // Queues Screen custom header & filter bar
  queuesHeaderBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? 44 : 44, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', backgroundColor: '#FFFFFF' },
  queuesTitleSelector: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#EEF2F6' },
  queuesTitleText: { fontSize: 16, fontWeight: '800', color: '#1F2937' },
  greenAvatarBadge: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center' },
  queuesDropdownMenu: { position: 'absolute', top: Platform.OS === 'android' ? 90 : 85, left: '20%', width: 180, backgroundColor: '#FFFFFF', borderRadius: 12, borderOpacity: 0.1, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, elevation: 5, padding: 8, zIndex: 100 },
  queuesDropdownItem: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 8 },
  queuesDropdownLabel: { fontSize: 14, fontWeight: '700', color: '#1F2937' },
  queuesFilterRow: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', backgroundColor: '#FFFFFF' },
  filterPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 6 },
  filterPillText: { fontSize: 12, fontWeight: '600', color: '#374151' },
  queuesMainBody: { flexGrow: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },

  // Smiling Dog Empty state
  dogEmptyState: { alignItems: 'center', paddingHorizontal: 20 },
  dogImageWrapper: { width: 180, height: 180, borderRadius: 24, overflow: 'hidden', backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  dogImageMock: { width: 120, height: 120, justifyContent: 'center', alignItems: 'center' },
  dogHead: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#854D0E', position: 'relative', justifyContent: 'center', alignItems: 'center' },
  dogEye: { position: 'absolute', top: 24, width: 10, height: 10, borderRadius: 5, backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#000000' },
  dogNose: { width: 14, height: 8, borderRadius: 4, backgroundColor: '#000000', marginTop: 12 },
  dogSmile: { width: 24, height: 12, borderBottomWidth: 3, borderColor: '#000000', borderBottomLeftRadius: 12, borderBottomRightRadius: 12, marginTop: 4 },
  dogCollar: { width: 60, height: 10, backgroundColor: '#EF4444', borderRadius: 5, marginTop: 10 },
  dogSuccessTitle: { fontSize: 24, fontWeight: '800', color: '#1F2937', marginBottom: 6 },
  dogSuccessSub: { fontSize: 14, color: '#6B7280', marginBottom: 20 },
  dogBackBtn: { backgroundColor: '#000000', borderRadius: 24, paddingHorizontal: 20, paddingVertical: 12 },
  dogBackBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '750' },

  // Name Card Design Styles
  nameCardDesignContainer: { width: '100%', height: 130, borderRadius: 20, borderWidth: 1.5, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', position: 'relative', overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, marginBottom: 20 },
  nameCardWhiteOverlay: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#FFFFFF', position: 'absolute', bottom: 0, left: 0, right: 0, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, borderTopWidth: 1, borderTopColor: '#F3F4F6', zIndex: 10 },
  nameCardBubblesBg: { height: 60, width: '100%', backgroundColor: '#F3F4F6', position: 'relative', zIndex: 1 },
  speechBubbleMock: { position: 'absolute', backgroundColor: '#E5E7EB', top: 10 },
  megaphoneAvatarContainer: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E0F2FE', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  nameCardTitleText: { fontSize: 16, fontWeight: '800', color: '#1F2937' },
  nameCardSubtext: { fontSize: 12, color: '#6B7280', marginTop: 2 },
});
