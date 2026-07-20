import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Dimensions,
  Alert,
  Switch,
  Platform,
  ActivityIndicator,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { authService } from '../services/authService';

const { width, height } = Dimensions.get('window');

// Mock datasets matching screenshots
const DISCOVER_TOPICS = [
  'Internet Culture', 'Games', 'Q&As & Stories', 'Movies & TV', 
  'Home & Garden', 'Technology', 'Sports', 'Places & Travel', 
  'Pop Culture', 'Fashion & Beauty', 'Business & Finance', 
  'Education & Career', 'News & Politics', 'Vehicles'
];

const DISCOVER_DATA = {
  'Internet Culture': {
    subtopics: ['Amazing', 'Animals & Pets', 'Cringe & Facepalm', 'Funny', 'Interesting'],
    Amazing: [
      { id: 'nextfuckinglevel', name: 'nextfuckinglevel', handle: 'nextfuckinglevel', visitors: '3.8m weekly visitors', desc: 'Witness the most impressive feats, skills, and moments around.', iconColor: '#FF4500' },
      { id: 'BeAmazed', name: 'BeAmazed', handle: 'BeAmazed', visitors: '3.0m weekly visitors', desc: 'Witness human skill and the marvels of nature in this subreddit for amazing things.', iconColor: '#0079D3' },
      { id: 'AbsoluteUnits', name: 'AbsoluteUnits', handle: 'AbsoluteUnits', visitors: '2.0m weekly visitors', desc: 'Gawk at the size of these lads. Come share and admire absolute units.', iconColor: '#46D160' },
      { id: 'Amazing', name: 'Amazing', handle: 'Amazing', visitors: '1.5m weekly visitors', desc: 'A place for amazing things.', iconColor: '#FFD635' },
      { id: 'blackmagicfuckery', name: 'blackmagicfuckery', handle: 'blackmagicfuckery', visitors: '661k weekly visitors', desc: 'Experience the magic of optical illusions and impossible feats of physics.', iconColor: '#D100D1' },
      { id: 'nextlevel', name: 'nextlevel', handle: 'nextlevel', visitors: '234k weekly visitors', desc: 'Step up to the next level.', iconColor: '#FF4500' },
      { id: 'nevertellmetheodds', name: 'nevertellmetheodds', handle: 'nevertellmetheodds', visitors: '88.9k weekly visitors', desc: 'Be amazed by incredible acts of luck and skill that defy the odds.', iconColor: '#000000' },
      { id: 'ThatsActuallyInsane', name: 'ThatsActuallyInsane', handle: 'ThatsActuallyInsane', visitors: '245k weekly visitors', desc: 'Actually insane things.', iconColor: '#1A1A1B' },
      { id: 'UNGBBIIIVCHIDCTIICBG', name: 'UNGBBIIIVCHIDCTIICBG', handle: 'UNGBBIIIVCHIDCTIICBG', visitors: '135k weekly visitors', desc: 'Explore cool content that happens to feature women - no objectification.', iconColor: '#FF4500' }
    ],
    'Animals & Pets': [
      { id: 'cats', name: 'cats', handle: 'cats', visitors: '3.8m weekly visitors', desc: 'From kittens to seniors, celebrate the furry friends that make our hearts purr.', iconColor: '#E57373' },
      { id: 'CATHELP', name: 'CATHELP', handle: 'CATHELP', visitors: '1.3m weekly visitors', desc: 'Discover the answers to all your cat-related questions and dilemmas.', iconColor: '#81C784' }
    ],
    'Cringe & Facepalm': [
      { id: 'mildlyinfuriating', name: 'mildlyinfuriating', handle: 'mildlyinfuriating', visitors: '11.5m weekly visitors', desc: 'Find comfort in knowing you\'re not alone in life\'s minor irritations.', iconColor: '#FFB74D' },
      { id: 'TikTokCringe', name: 'TikTokCringe', handle: 'TikTokCringe', visitors: '5.2m weekly visitors', desc: 'Laugh out loud at cringy and hilarious TikTok videos and memes.', iconColor: '#BA68C8' }
    ],
    Funny: [
      { id: 'funny', name: 'funny', handle: 'funny', visitors: '15m weekly visitors', desc: 'Welcome to r/funny, internet\'s largest humor depository.', iconColor: '#90AEF5' }
    ],
    Interesting: [
      { id: 'interestingasfuck', name: 'interestingasfuck', handle: 'interestingasfuck', visitors: '8.2m weekly visitors', desc: 'For anything that is interesting as fuck.', iconColor: '#4DB6AC' }
    ]
  }
};

export default function CommunitiesScreen({ onBackToFeed }) {
  // Navigation State
  const [currentView, setCurrentView] = useState('list');
  const [selectedCommId, setSelectedCommId] = useState(null);
  
  // Data State
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [listTab, setListTab] = useState('Discover'); // Discover or Your Communities
  
  // Discover Communities Screen sub-states
  const [discoverSubView, setDiscoverSubView] = useState('main'); // 'main', 'topic', 'subtopic'
  const [selectedTopic, setSelectedTopic] = useState(''); // e.g. 'Internet Culture'
  const [selectedSubtopic, setSelectedSubtopic] = useState(''); // e.g. 'Amazing'

  // Detail Hub Tab (Feed, About, Rules, Mods, Stats)
  const [detailTab, setDetailTab] = useState('Feed');
  
  // Join Dialog Modal (COM_008)
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joiningComm, setJoiningComm] = useState(null);
  
  // Create Community Form State (COM_007)
  const [createName, setCreateName] = useState('');
  const [createHandle, setCreateHandle] = useState('');
  const [createDesc, setCreateDesc] = useState('');
  const [createCat, setCreateCat] = useState('News');
  const [createPrivacy, setCreatePrivacy] = useState('Public');
  const [createIs18, setCreateIs18] = useState(false);
  const [createIcon, setCreateIcon] = useState(null);

  // Settings State (COM_009)
  const [settingsName, setSettingsName] = useState('');
  const [settingsDesc, setSettingsDesc] = useState('');
  const [settingsCat, setSettingsCat] = useState('');
  const [settingsPrivacy, setSettingsPrivacy] = useState('');
  const [settingsImagesAllowed, setSettingsImagesAllowed] = useState(true);
  const [settingsApprovalReq, setSettingsApprovalReq] = useState(false);
  const [settingsBlockedWord, setSettingsBlockedWord] = useState('');
  
  // Members State (COM_010)
  const [memberSearch, setMemberSearch] = useState('');
  const [memberTab, setMemberTab] = useState('All'); // All, Admins & Mods
  
  // Stats Mock Actions
  const [statsPeriod, setStatsPeriod] = useState('Weekly');

  useEffect(() => {
    loadCommunities();
  }, []);

  const loadCommunities = async () => {
    setLoading(true);
    const data = await authService.getCommunities();
    setCommunities(data);
    setLoading(false);
  };

  const handleJoinPress = (comm) => {
    setJoiningComm(comm);
    setShowJoinModal(true);
  };

  const confirmJoin = async () => {
    if (!joiningComm) return;
    setLoading(true);
    const res = await authService.joinCommunity(joiningComm.id);
    if (res.success) {
      setCommunities(res.list);
      setShowJoinModal(false);
      // If we are currently looking at this community detail, trigger update
      Alert.alert('Joined!', `You are now a member of ${joiningComm.name}.`);
    }
    setLoading(false);
  };

  const handleLeaveCommunity = async (commId) => {
    Alert.alert(
      'Leave Community',
      'Are you sure you want to leave this community?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            const res = await authService.leaveCommunity(commId);
            if (res.success) {
              setCommunities(res.list);
            }
            setLoading(false);
          }
        }
      ]
    );
  };

  const handleCreateCommunity = async () => {
    if (!createName.trim() || !createHandle.trim()) {
      Alert.alert('Required', 'Please enter a community name and handle.');
      return;
    }
    setLoading(true);
    const newComm = {
      id: `c_${Date.now()}`,
      name: createName,
      handle: createHandle.toLowerCase().replace(/\s+/g, '_'),
      category: createCat,
      members: 1,
      online: 1,
      joined: true,
      description: createDesc,
      createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      location: 'India',
      language: 'English',
      type: createPrivacy,
      tags: [createCat, 'New'],
      rules: [
        { id: 1, title: 'Be Respectful', desc: 'Be kind to fellow members.' },
        { id: 2, title: 'Follow Guidelines', desc: 'Respect terms and conditions.' }
      ],
      mods: [
        { name: 'You (Owner)', username: 'owner', role: 'Admin', status: 'Online', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80' }
      ],
      stats: { members: '1', online: '1', posts: '0', comments: '0' },
      posts: []
    };
    
    const res = await authService.saveCommunity(newComm);
    if (res.success) {
      setCommunities(res.list);
      setSelectedCommId(newComm.id);
      setDetailTab('Feed');
      setCurrentView('detail');
      // Reset form
      setCreateName('');
      setCreateHandle('');
      setCreateDesc('');
    }
    setLoading(false);
  };

  const handleSaveSettings = async (commId) => {
    setLoading(true);
    const res = await authService.updateCommunitySettings(commId, {
      name: settingsName,
      description: settingsDesc,
      category: settingsCat,
      type: settingsPrivacy,
    });
    if (res.success) {
      setCommunities(res.list);
      Alert.alert('Saved', 'Community settings updated successfully.');
      setCurrentView('detail');
    }
    setLoading(false);
  };

  const handleDeleteCommunity = async (commId) => {
    Alert.alert(
      'Delete Community',
      'This action is irreversible. All posts, members, and settings will be permanently removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            const stored = await authService.getCommunities();
            const filtered = stored.filter(c => c.id !== commId);
            await authService.updateCommunitySettings(commId, {}); // dummy check
            // Save filtered list directly
            const { safeStorage } = require('../utils/storage');
            await safeStorage.setItem('aws_dynamodb_communities', JSON.stringify(filtered));
            setCommunities(filtered);
            setCurrentView('list');
            setLoading(false);
          }
        }
      ]
    );
  };

  // Get active community details
  let activeCommunity = communities.find(c => c.id === selectedCommId) || null;
  if (!activeCommunity && selectedCommId) {
    // Find it in DISCOVER_DATA
    Object.keys(DISCOVER_DATA).forEach(topic => {
      const topicInfo = DISCOVER_DATA[topic];
      if (topicInfo && topicInfo.subtopics) {
        topicInfo.subtopics.forEach(sub => {
          const found = topicInfo[sub].find(c => c.id === selectedCommId);
          if (found) {
            activeCommunity = {
              id: found.id,
              name: found.name,
              handle: found.handle,
              type: 'Public',
              members: 3700000,
              online: '50.3k',
              joined: false,
              description: found.desc,
              createdDate: 'Jul 20, 2026',
              language: 'English',
              location: 'Global',
              tags: [sub, 'Culture'],
              rules: [
                { id: 1, title: 'Follow Guidelines', desc: 'Respect terms and conditions.' }
              ],
              mods: [
                { name: 'Admin', username: 'admin', role: 'Admin', status: 'Online', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80' }
              ],
              posts: [
                {
                  id: 'post_spider',
                  authorName: 'North-Guitar-1781',
                  authorHandle: 'North-Guitar-1781',
                  authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80',
                  time: '14d',
                  text: 'Jumping spider climbs a lady\'s leg so she sics it on a fly',
                  image: 'https://images.unsplash.com/photo-1558244661-d248897f7bc4?auto=format&fit=crop&w=400&q=80',
                  likes: '125k',
                  commentsCount: '1,463'
                }
              ]
            };
          }
        });
      }
    });
  }

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#7C3AED" />
        </View>
      )}

      {/* RENDER VIEW SWITCHER */}
      {currentView === 'list' && renderCommunityList()}
      {currentView === 'detail' && activeCommunity && renderCommunityDetail(activeCommunity)}
      {currentView === 'create' && renderCreateCommunity()}
      {currentView === 'settings' && activeCommunity && renderCommunitySettings(activeCommunity)}
      {currentView === 'members' && activeCommunity && renderCommunityMembers(activeCommunity)}

      {/* JOIN COMMUNITY DIALOG MODAL (COM_008) */}
      {renderJoinModal()}
    </View>
  );

  // ----------------------------------------------------
  // COM_001 - COMMUNITY LIST SCREEN
  // ----------------------------------------------------
  // ----------------------------------------------------
  // COM_001 - COMMUNITY LIST SCREEN & DISCOVER SUBFLOW
  // ----------------------------------------------------
  function renderDiscoverDashboard() {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        {/* Header */}
        <View style={styles.discoverHeader}>
          <TouchableOpacity onPress={onBackToFeed} style={styles.discoverBackBtn}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.discoverHeaderTitle}>Discover communities</Text>
          <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={() => alert('Search communities...')}>
            <Ionicons name="search" size={22} color="#1F2937" />
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
          {/* Explore communities by topic */}
          <Text style={styles.discoverSecTitle}>Explore communities by topic</Text>
          <View style={styles.topicGrid}>
            {DISCOVER_TOPICS.map((topic) => (
              <TouchableOpacity 
                key={topic} 
                style={styles.topicBadgeItem}
                onPress={() => {
                  setSelectedTopic(topic);
                  setDiscoverSubView('topic');
                }}
              >
                <Text style={styles.topicBadgeText}>{topic}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Recommended for you */}
          <Text style={styles.discoverSecTitle}>Recommended for you</Text>
          <View style={{ paddingHorizontal: 16, gap: 14 }}>
            {[
              { id: 'nextfuckinglevel', name: 'Startup_Ideas', handle: 'Startup_Ideas', visitors: '33.5k weekly visitors', desc: 'Explore innovative business ideas and potential opportunities for entrepreneurs.', color: '#EF4444' },
              { id: 'BeAmazed', name: 'ChatGPT', handle: 'ChatGPT', visitors: '1.5m weekly visitors', desc: 'Discuss the power of artificial intelligence in natural language processing.', color: '#10B981' }
            ].map((comm) => (
              <View key={comm.name} style={styles.discoverCardContainer}>
                <TouchableOpacity 
                  style={styles.discoverCardTopRow}
                  onPress={() => {
                    setSelectedCommId(comm.id);
                    setDetailTab('Feed');
                    setCurrentView('detail');
                  }}
                >
                  <View style={[styles.discoverCardAvatar, { backgroundColor: comm.color }]}>
                    <Text style={styles.discoverAvatarLetter}>{comm.name.charAt(0)}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.discoverCardName}>{comm.name}</Text>
                    <Text style={styles.discoverCardVisitors}>{comm.visitors}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.discoverJoinBtn}
                    onPress={() => handleJoinPress({ id: comm.id, name: comm.name, handle: comm.handle })}
                  >
                    <Text style={styles.discoverJoinBtnText}>Join</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
                <Text style={styles.discoverCardDesc}>{comm.desc}</Text>
              </View>
            ))}
          </View>

          {/* More like apps */}
          <View style={styles.discoverSectionHeaderRow}>
            <Text style={styles.discoverSecTitle}>More like apps</Text>
            <TouchableOpacity 
              style={{ marginLeft: 'auto', paddingRight: 16 }}
              onPress={() => {
                setSelectedTopic('Internet Culture');
                setSelectedSubtopic('Amazing');
                setDiscoverSubView('subtopic');
              }}
            >
              <Ionicons name="chevron-forward" size={20} color="#1F2937" />
            </TouchableOpacity>
          </View>
          <View style={{ paddingHorizontal: 16, gap: 14 }}>
            {[
              { id: 'AbsoluteUnits', name: 'Smartphones', handle: 'Smartphones', visitors: '134k weekly visitors', desc: 'A platform for discussing the latest smartphones, features, and trends.', color: '#4F46E5' },
              { id: 'Amazing', name: 'EPFL', handle: 'EPFL', visitors: '5.3k weekly visitors', desc: 'Welcome to r/EPFL, a community for EPFL students, professors, applicants...', color: '#EF4444' }
            ].map((comm) => (
              <View key={comm.name} style={styles.discoverCardContainer}>
                <TouchableOpacity 
                  style={styles.discoverCardTopRow}
                  onPress={() => {
                    setSelectedCommId(comm.id);
                    setDetailTab('Feed');
                    setCurrentView('detail');
                  }}
                >
                  <View style={[styles.discoverCardAvatar, { backgroundColor: comm.color }]}>
                    <Text style={styles.discoverAvatarLetter}>{comm.name.charAt(0)}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.discoverCardName}>{comm.name}</Text>
                    <Text style={styles.discoverCardVisitors}>{comm.visitors}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.discoverJoinBtn}
                    onPress={() => handleJoinPress({ id: comm.id, name: comm.name, handle: comm.handle })}
                  >
                    <Text style={styles.discoverJoinBtnText}>Join</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
                <Text style={styles.discoverCardDesc}>{comm.desc}</Text>
              </View>
            ))}
          </View>

          {/* More like androidapps */}
          <View style={styles.discoverSectionHeaderRow}>
            <Text style={styles.discoverSecTitle}>More like androidapps</Text>
            <TouchableOpacity 
              style={{ marginLeft: 'auto', paddingRight: 16 }}
              onPress={() => {
                setSelectedTopic('Internet Culture');
                setSelectedSubtopic('Amazing');
                setDiscoverSubView('subtopic');
              }}
            >
              <Ionicons name="chevron-forward" size={20} color="#1F2937" />
            </TouchableOpacity>
          </View>
          <View style={{ paddingHorizontal: 16, gap: 14 }}>
            {[
              { id: 'blackmagicfuckery', name: 'LineageOS', handle: 'LineageOS', visitors: '37.8k weekly visitors', desc: 'Share news, announcements, and updates related to the LineageOS project.', color: '#0EA5E9' },
              { id: 'nextlevel', name: 'galaxys10', handle: 'galaxys10', visitors: '37.7k weekly visitors', desc: 'Your go-to hub for everything related to the Samsung Galaxy S10 series.', color: '#111827' }
            ].map((comm) => (
              <View key={comm.name} style={styles.discoverCardContainer}>
                <TouchableOpacity 
                  style={styles.discoverCardTopRow}
                  onPress={() => {
                    setSelectedCommId(comm.id);
                    setDetailTab('Feed');
                    setCurrentView('detail');
                  }}
                >
                  <View style={[styles.discoverCardAvatar, { backgroundColor: comm.color }]}>
                    <Text style={styles.discoverAvatarLetter}>{comm.name.charAt(0)}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.discoverCardName}>{comm.name}</Text>
                    <Text style={styles.discoverCardVisitors}>{comm.visitors}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.discoverJoinBtn}
                    onPress={() => handleJoinPress({ id: comm.id, name: comm.name, handle: comm.handle })}
                  >
                    <Text style={styles.discoverJoinBtnText}>Join</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
                <Text style={styles.discoverCardDesc}>{comm.desc}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  function renderDiscoverTopicView() {
    const topicData = DISCOVER_DATA[selectedTopic] || { subtopics: [], Amazing: [] };
    
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        {/* Header */}
        <View style={styles.discoverHeader}>
          <TouchableOpacity onPress={() => setDiscoverSubView('main')} style={styles.discoverBackBtn}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.discoverHeaderTitle}>{selectedTopic}</Text>
        </View>

        {/* Subtopics horizontal pills */}
        <View style={{ height: 50, borderBottomWidth: 1, borderColor: '#F3F4F6' }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, alignItems: 'center' }}>
            {topicData.subtopics.map((sub) => (
              <TouchableOpacity 
                key={sub} 
                style={styles.subtopicPill}
                onPress={() => {
                  setSelectedSubtopic(sub);
                  setDiscoverSubView('subtopic');
                }}
              >
                <Text style={styles.subtopicPillText}>{sub}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
          {topicData.subtopics.map((sub) => {
            const list = topicData[sub] || [];
            return (
              <View key={sub}>
                <TouchableOpacity 
                  style={styles.discoverSectionHeaderRow}
                  onPress={() => {
                    setSelectedSubtopic(sub);
                    setDiscoverSubView('subtopic');
                  }}
                >
                  <Text style={styles.discoverSecTitle}>{sub}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#1F2937" style={{ marginLeft: 'auto', marginRight: 16 }} />
                </TouchableOpacity>

                <View style={{ paddingHorizontal: 16, gap: 14 }}>
                  {list.slice(0, 2).map((comm) => (
                    <View key={comm.name} style={styles.discoverCardContainer}>
                      <TouchableOpacity 
                        style={styles.discoverCardTopRow}
                        onPress={() => {
                          setSelectedCommId(comm.id);
                          setDetailTab('Feed');
                          setCurrentView('detail');
                        }}
                      >
                        <View style={[styles.discoverCardAvatar, { backgroundColor: comm.iconColor }]}>
                          <Text style={styles.discoverAvatarLetter}>{comm.name.charAt(0)}</Text>
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                          <Text style={styles.discoverCardName}>{comm.name}</Text>
                          <Text style={styles.discoverCardVisitors}>{comm.visitors}</Text>
                        </View>
                        <TouchableOpacity 
                          style={styles.discoverJoinBtn}
                          onPress={() => handleJoinPress(comm)}
                        >
                          <Text style={styles.discoverJoinBtnText}>Join</Text>
                        </TouchableOpacity>
                      </TouchableOpacity>
                      <Text style={styles.discoverCardDesc}>{comm.desc}</Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  function renderDiscoverSubtopicListView() {
    const topicData = DISCOVER_DATA[selectedTopic] || {};
    const list = topicData[selectedSubtopic] || [];

    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        {/* Header */}
        <View style={styles.discoverHeader}>
          <TouchableOpacity onPress={() => setDiscoverSubView('topic')} style={styles.discoverBackBtn}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.discoverHeaderTitle}>{selectedSubtopic}</Text>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
          <View style={{ paddingVertical: 10 }}>
            {list.map((comm, index) => (
              <TouchableOpacity 
                key={comm.id} 
                style={styles.subtopicRowItem}
                onPress={() => {
                  setSelectedCommId(comm.id);
                  setDetailTab('Feed');
                  setCurrentView('detail');
                }}
              >
                <Text style={styles.subtopicRowNumber}>{index + 1}</Text>
                <View style={[styles.subtopicRowAvatar, { backgroundColor: comm.iconColor }]}>
                  <Text style={styles.subtopicAvatarLetter}>{comm.name.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.subtopicRowName}>{comm.name}</Text>
                  <Text style={styles.subtopicRowVisitors}>{comm.visitors}</Text>
                  <Text style={styles.subtopicRowDesc} numberOfLines={2}>{comm.desc}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.subtopicJoinBtn}
                  onPress={() => handleJoinPress(comm)}
                >
                  <Text style={styles.subtopicJoinBtnText}>Join</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  function renderCommunityList() {
    if (listTab === 'Discover') {
      if (discoverSubView === 'topic') {
        return renderDiscoverTopicView();
      }
      if (discoverSubView === 'subtopic') {
        return renderDiscoverSubtopicListView();
      }
      return renderDiscoverDashboard();
    }

    const categories = ['All', 'News', 'Technology', 'Business', 'Lifestyle', 'Gaming'];
    
    const filtered = communities.filter(comm => {
      const matchSearch = comm.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          comm.handle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = activeCategory === 'All' || comm.category === activeCategory;
      const matchTab = comm.joined;
      return matchSearch && matchCat && matchTab;
    });

    return (
      <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Communities</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => setCurrentView('create')} style={styles.headerBtn}>
              <Ionicons name="add-circle" size={26} color="#7C3AED" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Discover / Joined Selector Tab */}
        <View style={styles.tabBar}>
          {['Discover', 'Your Communities'].map(tab => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tabItem, listTab === tab && styles.tabItemActive]}
              onPress={() => setListTab(tab)}
            >
              <Text style={[styles.tabLabel, listTab === tab && styles.tabLabelActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search communities..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Categories Carousel */}
        <View style={{ height: 44, marginVertical: 8 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.catChip, activeCategory === cat && styles.catChipActive]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text style={[styles.catChipText, activeCategory === cat && styles.catChipTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* List Content */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
          {filtered.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No communities found</Text>
            </View>
          ) : (
            filtered.map(comm => (
              <TouchableOpacity 
                key={comm.id} 
                style={styles.commCard} 
                onPress={() => {
                  setSelectedCommId(comm.id);
                  setDetailTab('Feed');
                  setCurrentView('detail');
                }}
              >
                {/* Gradient Logo Mock */}
                <LinearGradient colors={['#7C3AED', '#F97316']} style={styles.commAvatar}>
                  <Text style={styles.commAvatarText}>{comm.name.charAt(0)}</Text>
                </LinearGradient>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.commName}>{comm.name}</Text>
                  <Text style={styles.commStats}>@{comm.handle} • {comm.type} • {(comm.members / 1000).toFixed(0)}k members</Text>
                  <Text style={styles.commDesc} numberOfLines={2}>{comm.description}</Text>
                </View>
                <TouchableOpacity 
                  style={[styles.joinBtn, comm.joined && styles.joinedBtn]} 
                  onPress={() => comm.joined ? handleLeaveCommunity(comm.id) : handleJoinPress(comm)}
                >
                  <Text style={[styles.joinBtnText, comm.joined && styles.joinedBtnText]}>
                    {comm.joined ? 'Joined' : 'Join'}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    );
  }

  // ----------------------------------------------------
  // COM_002 - COMMUNITY DETAIL HUB (MAIN SCREEN)
  // ----------------------------------------------------
  function renderCommunityDetail(comm) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        {/* Banner Area */}
        <View style={styles.bannerContainer}>
          <LinearGradient colors={['rgba(0,0,0,0.8)', 'transparent']} style={styles.bannerOverlay} />
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1597059737153-611ffb372671?auto=format&fit=crop&w=400&q=80' }} 
            style={styles.bannerImg} 
          />
          <TouchableOpacity onPress={() => setCurrentView('list')} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.detailHeaderActions}>
            <TouchableOpacity onPress={() => Alert.alert('Share', `Invite link copied to clipboard!`)} style={styles.iconBtn}>
              <Ionicons name="share-social-outline" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            {comm.joined && (
              <TouchableOpacity onPress={() => setCurrentView('settings')} style={styles.iconBtn}>
                <Ionicons name="settings-outline" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Community Info Section */}
        <View style={styles.detailMetaContainer}>
          <View style={styles.logoAndTitleRow}>
            <LinearGradient colors={['#7C3AED', '#F97316']} style={styles.detailLogo}>
              <Text style={styles.detailLogoText}>{comm.name.charAt(0)}</Text>
            </LinearGradient>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.detailName}>{comm.name}</Text>
              <Text style={styles.detailHandle}>@{comm.handle} • {comm.type} Community</Text>
            </View>
            <TouchableOpacity 
              style={[styles.joinBtn, comm.joined && styles.joinedBtn]}
              onPress={() => comm.joined ? handleLeaveCommunity(comm.id) : handleJoinPress(comm)}
            >
              <Text style={[styles.joinBtnText, comm.joined && styles.joinedBtnText]}>
                {comm.joined ? 'Joined ✓' : 'Join'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Counts */}
          <View style={styles.countsRow}>
            <View style={styles.countItem}>
              <Text style={styles.countNumber}>{(comm.members / 1000).toFixed(0)}k</Text>
              <Text style={styles.countLabel}>Members</Text>
            </View>
            <View style={styles.countDivider} />
            <View style={styles.countItem}>
              <Text style={styles.countNumber}>{comm.online}</Text>
              <Text style={styles.countLabel}>Online Now</Text>
            </View>
            <View style={styles.countDivider} />
            <View style={styles.countItem}>
              <TouchableOpacity onPress={() => setCurrentView('members')}>
                <Text style={styles.countNumber}>View List</Text>
                <Text style={styles.countLabel}>Members Roster</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.detailDesc}>{comm.description}</Text>
        </View>

        {/* Tabs switcher: Feed, About, Rules, Mods, Stats */}
        <View style={styles.detailTabBar}>
          {['Feed', 'About', 'Rules', 'Mods', 'Stats'].map(tab => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.detailTabItem, detailTab === tab && styles.detailTabItemActive]}
              onPress={() => setDetailTab(tab)}
            >
              <Text style={[styles.detailTabLabel, detailTab === tab && styles.detailTabLabelActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Screen Switching Renderers */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
          {detailTab === 'Feed' && renderFeedTab(comm)}
          {detailTab === 'About' && renderAboutTab(comm)}
          {detailTab === 'Rules' && renderRulesTab(comm)}
          {detailTab === 'Mods' && renderModsTab(comm)}
          {detailTab === 'Stats' && renderStatsTab(comm)}
        </ScrollView>
      </View>
    );
  }

  // COM_002 - FEED TAB (Posts & Pinned Items)
  function renderFeedTab(comm) {
    return (
      <View style={{ padding: 16 }}>
        {/* Pinned Post */}
        <View style={styles.pinnedPostBox}>
          <View style={styles.pinnedLabelRow}>
            <Ionicons name="pin" size={16} color="#7C3AED" />
            <Text style={styles.pinnedLabelText}>PINNED POST</Text>
          </View>
          <Text style={styles.postText}>Heavy rain alert in Chennai. Stay safe and avoid non-essential travel.</Text>
          <Text style={styles.postMeta}>Posted by Admin • 2 hours ago</Text>
        </View>

        {/* Regular Posts Listing */}
        <Text style={styles.sectionHeader}>Discussion Feed</Text>
        {comm.posts && comm.posts.length > 0 ? (
          comm.posts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <Image source={{ uri: post.authorAvatar }} style={styles.postAuthorAvatar} />
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.postAuthorName}>{post.authorName}</Text>
                  <Text style={styles.postAuthorHandle}>@{post.authorHandle} • {post.time}</Text>
                </View>
              </View>
              <Text style={styles.postContent}>{post.text}</Text>
              {post.image && (
                <Image 
                  source={{ uri: post.image }} 
                  style={{ width: '100%', height: 260, borderRadius: 12, marginTop: 10, marginBottom: 4 }} 
                  resizeMode="cover" 
                />
              )}
              <View style={styles.postActions}>
                <TouchableOpacity style={styles.postActionBtn}>
                  <Ionicons name="heart-outline" size={18} color="#6B7280" />
                  <Text style={styles.postActionText}>{post.likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.postActionBtn}>
                  <Ionicons name="chatbubble-outline" size={18} color="#6B7280" />
                  <Text style={styles.postActionText}>{post.commentsCount}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={32} color="#9CA3AF" />
            <Text style={styles.emptyText}>Be the first to post here!</Text>
          </View>
        )}
      </View>
    );
  }

  // COM_003 - COMMUNITY ABOUT TAB
  function renderAboutTab(comm) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={styles.sectionHeader}>About this community</Text>
        
        <View style={styles.aboutCard}>
          <View style={styles.aboutRow}>
            <Ionicons name="calendar-outline" size={18} color="#7C3AED" style={{ width: 24 }} />
            <Text style={styles.aboutLabel}>Created on</Text>
            <Text style={styles.aboutVal}>{comm.createdDate}</Text>
          </View>

          <View style={styles.aboutRow}>
            <Ionicons name="language-outline" size={18} color="#7C3AED" style={{ width: 24 }} />
            <Text style={styles.aboutLabel}>Language</Text>
            <Text style={styles.aboutVal}>{comm.language}</Text>
          </View>

          <View style={styles.aboutRow}>
            <Ionicons name="location-outline" size={18} color="#7C3AED" style={{ width: 24 }} />
            <Text style={styles.aboutLabel}>Location</Text>
            <Text style={styles.aboutVal}>{comm.location}</Text>
          </View>

          <View style={styles.aboutRow}>
            <Ionicons name="shield-checkmark-outline" size={18} color="#7C3AED" style={{ width: 24 }} />
            <Text style={styles.aboutLabel}>Type</Text>
            <Text style={styles.aboutVal}>{comm.type}</Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}>Topics & Tags</Text>
        <View style={styles.tagsContainer}>
          {comm.tags.map((tag, idx) => (
            <View key={idx} style={styles.tagBadge}>
              <Text style={styles.tagBadgeText}>#{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  // COM_004 - COMMUNITY RULES TAB
  function renderRulesTab(comm) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={styles.sectionHeader}>Community Rules</Text>
        {comm.rules && comm.rules.length > 0 ? (
          comm.rules.map((rule) => (
            <View key={rule.id} style={styles.ruleItem}>
              <View style={styles.ruleNumberCircle}>
                <Text style={styles.ruleNumberText}>{rule.id}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.ruleTitle}>{rule.title}</Text>
                <Text style={styles.ruleDesc}>{rule.desc}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No custom rules defined yet.</Text>
        )}
      </View>
    );
  }

  // COM_005 - COMMUNITY MODS TAB
  function renderModsTab(comm) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={styles.sectionHeader}>Moderators</Text>
        {comm.mods && comm.mods.length > 0 ? (
          comm.mods.map((mod, idx) => (
            <View key={idx} style={styles.modRow}>
              <Image source={{ uri: mod.avatar }} style={styles.modAvatar} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.modName}>{mod.name}</Text>
                <Text style={styles.modHandle}>@{mod.username} • {mod.status}</Text>
              </View>
              <View style={[styles.roleBadge, mod.role === 'Admin' ? styles.roleAdmin : styles.roleMod]}>
                <Text style={styles.roleText}>{mod.role}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No moderators listed.</Text>
        )}
      </View>
    );
  }

  // COM_006 - COMMUNITY STATS TAB (WITH SVG CHARTS)
  function renderStatsTab(comm) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={styles.sectionHeader}>Analytics Dashboard</Text>
        
        {/* Core Metric Cards */}
        <View style={styles.statsCardsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>125K</Text>
            <Text style={styles.statLabel}>Total Members</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>1.2K</Text>
            <Text style={styles.statLabel}>Online Now</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>8.4K</Text>
            <Text style={styles.statLabel}>Total Posts</Text>
          </View>
        </View>

        {/* Growth Trend Graph Mock */}
        <Text style={styles.sectionSubHeader}>Member Growth Overview</Text>
        <View style={styles.chartContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={styles.chartTitle}>Monthly Growth Trend</Text>
            <Text style={styles.chartBadge}>+15.4%</Text>
          </View>
          
          {/* Simple Vector SVG/View Simulation of a line chart */}
          <View style={styles.mockGraphFrame}>
            <View style={styles.mockGraphBarLine} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 'auto' }}>
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m) => (
                <Text key={m} style={styles.chartAxisText}>{m}</Text>
              ))}
            </View>
          </View>
        </View>

        {/* Heatmap Grid Simulation */}
        <Text style={styles.sectionSubHeader}>Weekly Engagement Matrix</Text>
        <View style={styles.heatmapCard}>
          <View style={styles.heatmapGrid}>
            {[...Array(21)].map((_, i) => {
              const colors = ['#F3E8FF', '#DDD6FE', '#C084FC', '#A855F7', '#7C3AED'];
              const randomColor = colors[Math.floor(Math.sin(i) * 2.5 + 2.5)];
              return (
                <View key={i} style={[styles.heatmapTile, { backgroundColor: randomColor }]} />
              );
            })}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <Text style={styles.chartAxisText}>Low activity</Text>
            <Text style={styles.chartAxisText}>High activity</Text>
          </View>
        </View>
      </View>
    );
  }

  // ----------------------------------------------------
  // COM_007 - CREATE COMMUNITY SCREEN
  // ----------------------------------------------------
  function renderCreateCommunity() {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setCurrentView('list')}>
            <Ionicons name="close" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.modalHeaderTitle}>Create Community</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={{ flex: 1, padding: 16 }} contentContainerStyle={{ paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
          <Text style={styles.fieldLabel}>Community Name *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. Chennai Foodies"
            placeholderTextColor="#9CA3AF"
            value={createName}
            onChangeText={setCreateName}
          />

          <Text style={styles.fieldLabel}>Community Handle (@) *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. chennai_foodies"
            placeholderTextColor="#9CA3AF"
            value={createHandle}
            onChangeText={setCreateHandle}
            autoCapitalize="none"
          />

          <Text style={styles.fieldLabel}>Description</Text>
          <TextInput
            style={[styles.textInput, { height: 80, textAlignVertical: 'top' }]}
            placeholder="Describe what your community is about..."
            placeholderTextColor="#9CA3AF"
            multiline
            value={createDesc}
            onChangeText={setCreateDesc}
          />

          <Text style={styles.fieldLabel}>Category</Text>
          <View style={styles.pickerContainer}>
            {['News', 'Technology', 'Business', 'Lifestyle', 'Gaming'].map(cat => (
              <TouchableOpacity 
                key={cat} 
                style={[styles.catPickerChip, createCat === cat && styles.catPickerChipActive]}
                onPress={() => setCreateCat(cat)}
              >
                <Text style={[styles.catPickerChipText, createCat === cat && styles.catPickerChipTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Privacy Settings</Text>
          <View style={styles.privacyRow}>
            <TouchableOpacity 
              style={[styles.privacyBox, createPrivacy === 'Public' && styles.privacyBoxActive]}
              onPress={() => setCreatePrivacy('Public')}
            >
              <Ionicons name="earth" size={24} color={createPrivacy === 'Public' ? '#7C3AED' : '#9CA3AF'} />
              <Text style={styles.privacyBoxTitle}>Public</Text>
              <Text style={styles.privacyBoxSub}>Anyone can view and join</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.privacyBox, createPrivacy === 'Private' && styles.privacyBoxActive]}
              onPress={() => setCreatePrivacy('Private')}
            >
              <Ionicons name="lock-closed" size={24} color={createPrivacy === 'Private' ? '#7C3AED' : '#9CA3AF'} />
              <Text style={styles.privacyBoxTitle}>Private</Text>
              <Text style={styles.privacyBoxSub}>Only invited members can view</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchLabel}>18+ Age Restriction</Text>
              <Text style={styles.switchSublabel}>Contains mature topics or content</Text>
            </View>
            <Switch
              value={createIs18}
              onValueChange={setCreateIs18}
              trackColor={{ false: '#D1D5DB', true: '#C084FC' }}
              thumbColor={createIs18 ? '#7C3AED' : '#F3F4F6'}
            />
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleCreateCommunity}>
            <Text style={styles.submitBtnText}>Create Community</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // ----------------------------------------------------
  // COM_008 - JOIN COMMUNITY BOTTOM POPUP MODAL
  // ----------------------------------------------------
  function renderJoinModal() {
    if (!joiningComm) return null;
    return (
      <Modal visible={showJoinModal} transparent animationType="slide">
        <View style={styles.joinModalOverlay}>
          <TouchableOpacity style={{ flex: 0.4 }} onPress={() => setShowJoinModal(false)} />
          <View style={styles.joinModalContent}>
            <View style={styles.joinHeader}>
              <LinearGradient colors={['#7C3AED', '#F97316']} style={styles.joinLogoCircle}>
                <Text style={styles.joinLogoText}>{joiningComm.name.charAt(0)}</Text>
              </LinearGradient>
              <Text style={styles.joinTitle}>Join this community?</Text>
              <Text style={styles.joinSubtitle}>@{joiningComm.handle} • {(joiningComm.members / 1000).toFixed(0)}k members</Text>
            </View>

            <View style={styles.benefitsBox}>
              <View style={styles.benefitRow}>
                <Ionicons name="checkmark-circle" size={20} color="#7C3AED" />
                <Text style={styles.benefitText}>Participate and search discussions</Text>
              </View>
              <View style={styles.benefitRow}>
                <Ionicons name="checkmark-circle" size={20} color="#7C3AED" />
                <Text style={styles.benefitText}>Post messages and media uploads</Text>
              </View>
              <View style={styles.benefitRow}>
                <Ionicons name="checkmark-circle" size={20} color="#7C3AED" />
                <Text style={styles.benefitText}>Interact with moderators and members</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.confirmJoinBtn} onPress={confirmJoin}>
              <Text style={styles.confirmJoinText}>Join Community</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelJoinBtn} onPress={() => setShowJoinModal(false)}>
              <Text style={styles.cancelJoinText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  // ----------------------------------------------------
  // COM_009 - COMMUNITY SETTINGS SCREEN
  // ----------------------------------------------------
  function renderCommunitySettings(comm) {
    // Populate settings values once
    if (settingsName === '') {
      setSettingsName(comm.name);
      setSettingsDesc(comm.description);
      setSettingsCat(comm.category);
      setSettingsPrivacy(comm.type);
    }

    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setCurrentView('detail')}>
            <Ionicons name="close" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.modalHeaderTitle}>Community Settings</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={{ flex: 1, padding: 16 }} contentContainerStyle={{ paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
          <Text style={styles.sectionHeader}>General Information</Text>

          <Text style={styles.fieldLabel}>Community Name</Text>
          <TextInput
            style={styles.textInput}
            value={settingsName}
            onChangeText={setSettingsName}
          />

          <Text style={styles.fieldLabel}>Description</Text>
          <TextInput
            style={[styles.textInput, { height: 80, textAlignVertical: 'top' }]}
            multiline
            value={settingsDesc}
            onChangeText={setSettingsDesc}
          />

          <Text style={styles.fieldLabel}>Privacy Options</Text>
          <View style={styles.privacyRow}>
            {['Public', 'Private'].map(priv => (
              <TouchableOpacity
                key={priv}
                style={[styles.privacyBox, settingsPrivacy === priv && styles.privacyBoxActive]}
                onPress={() => setSettingsPrivacy(priv)}
              >
                <Ionicons name={priv === 'Public' ? 'earth' : 'lock-closed'} size={20} color={settingsPrivacy === priv ? '#7C3AED' : '#9CA3AF'} />
                <Text style={styles.privacyBoxTitle}>{priv}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionHeader}>Moderation Restrictions</Text>
          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchLabel}>Require Post Approval</Text>
              <Text style={styles.switchSublabel}>Mods must approve posts before visibility</Text>
            </View>
            <Switch
              value={settingsApprovalReq}
              onValueChange={setSettingsApprovalReq}
              trackColor={{ false: '#D1D5DB', true: '#C084FC' }}
              thumbColor={settingsApprovalReq ? '#7C3AED' : '#F3F4F6'}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchLabel}>Allow Image Uploads</Text>
              <Text style={styles.switchSublabel}>Members can post picture attachments</Text>
            </View>
            <Switch
              value={settingsImagesAllowed}
              onValueChange={setSettingsImagesAllowed}
              trackColor={{ false: '#D1D5DB', true: '#C084FC' }}
              thumbColor={settingsImagesAllowed ? '#7C3AED' : '#F3F4F6'}
            />
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={() => handleSaveSettings(comm.id)}>
            <Text style={styles.submitBtnText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteCommunity(comm.id)}>
            <Text style={styles.deleteBtnText}>Delete Community</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // ----------------------------------------------------
  // COM_010 - COMMUNITY MEMBERS LIST
  // ----------------------------------------------------
  function renderCommunityMembers(comm) {
    const listToRender = comm.mods.concat(
      // Mocking some other community members
      [
        { name: 'Deepak M', username: 'deepak_m', role: 'Member', status: 'Online', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80' },
        { name: 'Karthik Raja', username: 'karthik_raja', role: 'Member', status: 'Offline', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80' }
      ]
    ).filter(mem => {
      const matchSearch = mem.name.toLowerCase().includes(memberSearch.toLowerCase()) || 
                          mem.username.toLowerCase().includes(memberSearch.toLowerCase());
      const matchRole = memberTab === 'All' ? true : (mem.role === 'Admin' || mem.role === 'Mod');
      return matchSearch && matchRole;
    });

    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setCurrentView('detail')}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.modalHeaderTitle}>Members roster</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Member search bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search roster list..."
            placeholderTextColor="#9CA3AF"
            value={memberSearch}
            onChangeText={setMemberSearch}
          />
        </View>

        {/* Roster Filter Tabs */}
        <View style={styles.tabBar}>
          {['All', 'Admins & Mods'].map(tab => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tabItem, memberTab === tab && styles.tabItemActive]}
              onPress={() => setMemberTab(tab)}
            >
              <Text style={[styles.tabLabel, memberTab === tab && styles.tabLabelActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* List */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
          {listToRender.map((mem, idx) => (
            <View key={idx} style={styles.memberRow}>
              <Image source={{ uri: mem.avatar }} style={styles.modAvatar} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.modName}>{mem.name}</Text>
                  {mem.role !== 'Member' && (
                    <View style={[styles.roleBadgeMini, mem.role === 'Admin' ? styles.roleAdmin : styles.roleMod]}>
                      <Text style={styles.roleTextMini}>{mem.role}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.modHandle}>@{mem.username} • {mem.status}</Text>
              </View>
              <TouchableOpacity 
                style={styles.memberActionBtn}
                onPress={() => {
                  Alert.alert('Member Admin Actions', `Manage status for ${mem.name}`, [
                    { text: 'Mute User', onPress: () => Alert.alert('Action Logged', `${mem.name} has been muted.`) },
                    { text: 'Kick User', style: 'destructive', onPress: () => Alert.alert('Action Logged', `${mem.name} has been kicked.`) },
                    { text: 'Cancel', style: 'cancel' }
                  ]);
                }}
              >
                <Ionicons name="ellipsis-vertical" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 44 : 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBtn: {
    padding: 4,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: '#7C3AED',
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  tabLabelActive: {
    color: '#7C3AED',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1F2937',
    padding: 0,
  },
  catChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    justifyContent: 'center',
  },
  catChipActive: {
    backgroundColor: '#7C3AED',
  },
  catChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  catChipTextActive: {
    color: '#FFFFFF',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 8,
  },
  commCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  commAvatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commAvatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  commName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F2937',
  },
  commStats: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 2,
  },
  commDesc: {
    fontSize: 11,
    color: '#4B5563',
    marginTop: 4,
    lineHeight: 16,
  },
  joinBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#7C3AED',
    alignSelf: 'center',
  },
  joinedBtn: {
    backgroundColor: '#F3F4F6',
  },
  joinBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  joinedBtnText: {
    color: '#4B5563',
  },
  bannerContainer: {
    height: 160,
    position: 'relative',
    backgroundColor: '#000',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  bannerImg: {
    width: '100%',
    height: '100%',
    opacity: 0.85,
  },
  backBtn: {
    position: 'absolute',
    left: 16,
    top: Platform.OS === 'android' ? 44 : 20,
    zIndex: 2,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailHeaderActions: {
    position: 'absolute',
    right: 16,
    top: Platform.OS === 'android' ? 44 : 20,
    zIndex: 2,
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailMetaContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
  },
  logoAndTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLogo: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailLogoText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  detailName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
  },
  detailHandle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  countsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#F9FAFB',
    paddingVertical: 12,
    borderRadius: 12,
    marginVertical: 14,
  },
  countItem: {
    alignItems: 'center',
  },
  countNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F2937',
  },
  countLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  countDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E5E7EB',
  },
  detailDesc: {
    fontSize: 12,
    lineHeight: 18,
    color: '#4B5563',
  },
  detailTabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  detailTabItem: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  detailTabItemActive: {
    borderBottomColor: '#7C3AED',
  },
  detailTabLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  detailTabLabelActive: {
    color: '#7C3AED',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  sectionSubHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4B5563',
    marginTop: 14,
    marginBottom: 6,
  },
  pinnedPostBox: {
    backgroundColor: '#F5F3FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    padding: 12,
    marginBottom: 16,
  },
  pinnedLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  pinnedLabelText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#7C3AED',
  },
  postText: {
    fontSize: 12,
    color: '#1F2937',
    lineHeight: 18,
  },
  postMeta: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 6,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postAuthorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  postAuthorName: {
    fontSize: 12,
    fontWeight: '750',
    color: '#1F2937',
  },
  postAuthorHandle: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  postContent: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 18,
    marginTop: 8,
  },
  postActions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
  },
  postActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  postActionText: {
    fontSize: 11,
    color: '#6B7280',
  },
  aboutCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
  },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  aboutLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    flex: 1,
  },
  aboutVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagBadge: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  ruleNumberCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DDD6FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ruleNumberText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#7C3AED',
  },
  ruleTitle: {
    fontSize: 13,
    fontWeight: '750',
    color: '#1F2937',
  },
  ruleDesc: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
    lineHeight: 16,
  },
  modRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  modAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  modName: {
    fontSize: 13,
    fontWeight: '750',
    color: '#1F2937',
  },
  modHandle: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleAdmin: {
    backgroundColor: '#FEE2E2',
  },
  roleMod: {
    backgroundColor: '#EFF6FF',
  },
  roleText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#EF4444',
  },
  statsCardsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '850',
    color: '#7C3AED',
  },
  statLabel: {
    fontSize: 9,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 14,
    padding: 16,
    marginVertical: 6,
  },
  chartTitle: {
    fontSize: 12,
    fontWeight: '750',
    color: '#1F2937',
  },
  chartBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },
  mockGraphFrame: {
    height: 120,
    justifyContent: 'flex-end',
    position: 'relative',
    marginTop: 10,
  },
  mockGraphBarLine: {
    height: 2,
    backgroundColor: '#C084FC',
    width: '100%',
    position: 'absolute',
    bottom: 40,
  },
  chartAxisText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  heatmapCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 14,
    padding: 16,
    marginTop: 6,
  },
  heatmapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  heatmapTile: {
    width: 32,
    height: 32,
    borderRadius: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 44 : 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  modalHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F2937',
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '750',
    color: '#4B5563',
    marginTop: 14,
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catPickerChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
  },
  catPickerChipActive: {
    backgroundColor: '#7C3AED',
  },
  catPickerChipText: {
    fontSize: 12,
    color: '#4B5563',
  },
  catPickerChipTextActive: {
    color: '#FFFFFF',
  },
  privacyRow: {
    flexDirection: 'row',
    gap: 12,
  },
  privacyBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  privacyBoxActive: {
    borderColor: '#7C3AED',
    backgroundColor: '#F5F3FF',
  },
  privacyBoxTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F2937',
    marginTop: 6,
  },
  privacyBoxSub: {
    fontSize: 9,
    color: '#6B7280',
    marginTop: 2,
    textAlign: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  switchLabel: {
    fontSize: 13,
    fontWeight: '750',
    color: '#1F2937',
  },
  switchSublabel: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  submitBtn: {
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  deleteBtn: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  deleteBtnText: {
    color: '#EF4444',
    fontWeight: '800',
    fontSize: 13,
  },
  joinModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  joinModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  joinHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  joinLogoCircle: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  joinLogoText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  joinTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },
  joinSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  benefitsBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    gap: 10,
    marginBottom: 20,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitText: {
    fontSize: 12,
    color: '#4B5563',
  },
  confirmJoinBtn: {
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmJoinText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  cancelJoinBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelJoinText: {
    fontSize: 13,
    fontWeight: '750',
    color: '#6B7280',
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  memberActionBtn: {
    padding: 4,
  },
  roleBadgeMini: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 6,
  },
  roleTextMini: {
    fontSize: 8,
    fontWeight: '800',
    color: '#2563EB',
  },
  discoverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  discoverBackBtn: {
    marginRight: 12,
  },
  discoverHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  discoverSecTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 10,
  },
  topicGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 10,
  },
  topicBadgeItem: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  topicBadgeText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
  },
  discoverCardContainer: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  discoverCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discoverCardAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  discoverAvatarLetter: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  discoverCardName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  discoverCardVisitors: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 1,
  },
  discoverJoinBtn: {
    backgroundColor: '#EEF2F6',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginLeft: 'auto',
  },
  discoverJoinBtnText: {
    color: '#1F2937',
    fontWeight: 'bold',
    fontSize: 12,
  },
  discoverCardDesc: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 10,
    lineHeight: 16,
  },
  discoverSectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtopicPill: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  subtopicPillText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
  },
  subtopicRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  subtopicRowNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#9CA3AF',
    width: 20,
  },
  subtopicRowAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  subtopicAvatarLetter: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  subtopicRowName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtopicRowVisitors: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 1,
  },
  subtopicRowDesc: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 4,
    lineHeight: 16,
  },
  subtopicJoinBtn: {
    backgroundColor: '#EEF2F6',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginLeft: 'auto',
  },
  subtopicJoinBtnText: {
    color: '#1F2937',
    fontWeight: 'bold',
    fontSize: 12,
  }
});
