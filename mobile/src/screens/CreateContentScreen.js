import React, { useState, useEffect } from 'react';
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
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

// Mock communities matching screenshots
const MOCK_COMMUNITIES = [
  { name: 'r/apps', members: '116k members', subtext: 'subscribed', desc: 'The universal subreddit for anything application related.', color: '#EF4444' },
  { name: 'r/saveetha_chennai', members: '222 members', subtext: 'recently visited', desc: 'A community for students, alumni, and faculty of all Saveetha branches. Share campus news, events, study tips, memes, and everything related to college life!', color: '#F97316' },
  { name: 'r/androidapps', members: '566k members', subtext: 'subscribed', desc: 'Subreddit to talk about Android apps, ask questions, or get app help or recommendations....', color: '#10B981' },
  { name: 'r/announcements', members: '303m members', subtext: 'subscribed', desc: 'Official announcements from Reddit, Inc.', color: '#3B82F6', cannotPost: true },
  { name: 'r/AI_Agents', members: '404k members', subtext: 'recently visited', desc: 'A place for discussion around the use of AI Agents and related tools. AI Agents are LLMs that have the ability to "use tools" or "execute functions" in an autono...', color: '#8B5CF6' }
];

export default function CreateContentScreen({ onBack, onPublish }) {
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [titleText, setTitleText] = useState('');
  const [bodyText, setBodyText] = useState('');
  
  // Attached items
  const [attachedImage, setAttachedImage] = useState(null);
  const [attachedVideo, setAttachedVideo] = useState(null);
  const [attachedPoll, setAttachedPoll] = useState(null);
  const [attachedLink, setAttachedLink] = useState(null);
  const [attachedAMA, setAttachedAMA] = useState(false);

  // Modals / Bottom Sheets
  const [showAddImageSheet, setShowAddImageSheet] = useState(false);
  const [showAddVideoSheet, setShowAddVideoSheet] = useState(false);
  const [searchCommunityQuery, setSearchCommunityQuery] = useState('');

  // Poll Inline States
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollDays, setPollDays] = useState('2 days');

  // AMA Inline States
  const [amaStartTime, setAmaStartTime] = useState('Start now');
  const [amaDuration, setAmaDuration] = useState('4 hours');
  const [amaSelfie, setAmaSelfie] = useState(null);
  const [customAlert, setCustomAlert] = useState(null);
  const [showLinkInputModal, setShowLinkInputModal] = useState(false);
  const [tempLink, setTempLink] = useState('');

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const showAlert = (title, message, buttons = null) => {
    setCustomAlert({ title, message, buttons });
  };

  const handlePostPublish = () => {
    if (!titleText.trim()) {
      showAlert('Required', 'Please enter a title.');
      return;
    }
    if (!selectedCommunity) {
      showAlert('Required', 'Please select a community to post to.');
      return;
    }

    const newPost = {
      id: `post_${Date.now()}`,
      authorName: 'Devasanjay',
      authorHandle: 'devasanjay',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      time: 'Just now',
      text: titleText + '\n\n' + bodyText,
      image: attachedImage,
      likes: 1,
      commentsCount: 0,
      shares: 0,
      awards: 0,
      isLiked: true,
      communityName: selectedCommunity.name,
      isFollowing: false,
    };

    onPublish(newPost);
  };

  const handleImageOptionPress = async (option) => {
    setShowAddImageSheet(false);
    try {
      if (option === 'library') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          showAlert('Permission Denied', 'Sorry, we need camera roll permissions to select photos!');
          return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
          setAttachedImage(result.assets[0].uri);
        }
      } else {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          showAlert('Permission Denied', 'Sorry, we need camera permissions to take photos!');
          return;
        }
        let result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          quality: 1,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
          setAttachedImage(result.assets[0].uri);
        }
      }
    } catch (err) {
      console.log('Error picking image:', err);
      setAttachedImage('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80');
    }
  };

  const handleVideoOptionPress = async (option) => {
    setShowAddVideoSheet(false);
    try {
      if (option === 'library') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          showAlert('Permission Denied', 'Sorry, we need camera roll permissions to select videos!');
          return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
          allowsEditing: true,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
          setAttachedVideo(result.assets[0].uri);
          showAlert('Video Added', 'Video attached successfully!');
        }
      } else {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          showAlert('Permission Denied', 'Sorry, we need camera permissions to record videos!');
          return;
        }
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
          setAttachedVideo(result.assets[0].uri);
          showAlert('Video Added', 'Video attached successfully!');
        }
      }
    } catch (err) {
      console.log('Error picking video:', err);
      showAlert('Video Added', 'Video attached successfully!');
    }
  };

  // Filter communities
  const filteredCommunities = MOCK_COMMUNITIES.filter(comm => 
    comm.name.toLowerCase().includes(searchCommunityQuery.toLowerCase())
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <StatusBar style="dark" />
      
      {/* Header bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.headerCloseBtn}>
          <Ionicons name="close" size={24} color="#1F2937" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.communitySelectorBtn} 
          onPress={() => setShowCommunityModal(true)}
        >
          {selectedCommunity ? (
            <View style={[styles.selectedCommIcon, { backgroundColor: selectedCommunity.color }]}>
              <Text style={styles.selectedCommIconText}>{selectedCommunity.name.charAt(2).toUpperCase()}</Text>
            </View>
          ) : null}
          <Text style={styles.communitySelectorText}>
            {selectedCommunity ? selectedCommunity.name : 'Select a community'}
          </Text>
          <Ionicons name="chevron-down" size={14} color="#1F2937" style={{ marginLeft: 4 }} />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handlePostPublish} 
          disabled={!titleText.trim() || !selectedCommunity}
          style={[
            styles.postBtn, 
            (!titleText.trim() || !selectedCommunity) && styles.postBtnDisabled
          ]}
        >
          <Text style={[
            styles.postBtnText,
            (!titleText.trim() || !selectedCommunity) && styles.postBtnTextDisabled
          ]}>
            Post
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <ScrollView 
        style={styles.contentScroll} 
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          style={styles.titleInput}
          placeholder="Title"
          placeholderTextColor="#9CA3AF"
          multiline
          value={titleText}
          onChangeText={setTitleText}
        />

        {attachedLink && (
          <View style={styles.attachedLinkContainer}>
            <Text style={styles.attachedLinkText} numberOfLines={1}>{attachedLink}</Text>
            <TouchableOpacity onPress={() => setAttachedLink(null)} style={styles.removeLinkBtn}>
              <Ionicons name="close" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
        )}

        <TextInput
          style={styles.bodyInput}
          placeholder="body text (optional)"
          placeholderTextColor="#9CA3AF"
          multiline
          value={bodyText}
          onChangeText={setBodyText}
        />

        {/* Attached image preview */}
        {attachedImage && (
          <View style={styles.attachedImageContainer}>
            <Image source={{ uri: attachedImage }} style={styles.attachedImage} />
            <TouchableOpacity 
              style={styles.removeAttachmentBtn} 
              onPress={() => setAttachedImage(null)}
            >
              <Ionicons name="close-circle" size={24} color="#EF4444" />
            </TouchableOpacity>
          </View>
        )}

        {/* Inline Poll Creator block (Screen 6) */}
        {attachedPoll && (
          <View style={styles.pollCardBlock}>
            <View style={styles.cardBlockHeader}>
              <TouchableOpacity 
                style={styles.pollDaysTrigger} 
                onPress={() => {
                  showAlert(
                    "Poll Duration",
                    "Choose when the poll ends:",
                    [
                      { text: "1 day", onPress: () => setPollDays("1 day") },
                      { text: "2 days", onPress: () => setPollDays("2 days") },
                      { text: "3 days", onPress: () => setPollDays("3 days") },
                      { text: "7 days", onPress: () => setPollDays("7 days") },
                    ]
                  );
                }}
              >
                <Text style={styles.pollDaysText}>Poll ends in <Text style={{ fontWeight: 'bold' }}>{pollDays}</Text></Text>
                <Ionicons name="chevron-down" size={14} color="#6B7280" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setAttachedPoll(null)} style={styles.cardBlockCloseBtn}>
                <Ionicons name="close" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {pollOptions.map((opt, idx) => (
              <TextInput
                key={idx}
                style={styles.pollOptionInput}
                placeholder={`Option ${idx + 1}`}
                placeholderTextColor="#9CA3AF"
                value={opt}
                onChangeText={(text) => {
                  const updated = [...pollOptions];
                  updated[idx] = text;
                  setPollOptions(updated);
                }}
              />
            ))}

            {pollOptions.length < 6 && (
              <TouchableOpacity 
                style={styles.addPollOptionBtn} 
                onPress={() => setPollOptions([...pollOptions, ''])}
              >
                <Ionicons name="add" size={16} color="#4B5563" />
                <Text style={styles.addPollOptionText}>Add poll option</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Inline AMA Creator block (Screen 7) */}
        {attachedAMA && (
          <View style={styles.amaCardBlock}>
            <View style={styles.cardBlockHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.amaTitleText}>AMA</Text>
                <Ionicons name="information-circle-outline" size={16} color="#6B7280" style={{ marginLeft: 6 }} />
              </View>
              <TouchableOpacity onPress={() => setAttachedAMA(false)} style={styles.cardBlockCloseBtn}>
                <Ionicons name="close" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Dropdown 1: Start Time */}
            <View style={styles.amaDropdownGroup}>
              <Text style={styles.amaLabelText}>Start time (GMT+05:30)</Text>
              <TouchableOpacity 
                style={styles.amaDropdownTrigger}
                onPress={() => {
                  showAlert("Start Time", "Select when the AMA should start:", [
                    { text: "Start now", onPress: () => setAmaStartTime("Start now") },
                    { text: "In 1 hour", onPress: () => setAmaStartTime("In 1 hour") },
                    { text: "Tomorrow", onPress: () => setAmaStartTime("Tomorrow") }
                  ]);
                }}
              >
                <Text style={styles.amaDropdownValue}>{amaStartTime}</Text>
                <Ionicons name="chevron-down" size={14} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Dropdown 2: Duration */}
            <View style={styles.amaDropdownGroup}>
              <Text style={styles.amaLabelText}>Duration</Text>
              <TouchableOpacity 
                style={styles.amaDropdownTrigger}
                onPress={() => {
                  showAlert("Duration", "Select the AMA duration:", [
                    { text: "2 hours", onPress: () => setAmaDuration("2 hours") },
                    { text: "4 hours", onPress: () => setAmaDuration("4 hours") },
                    { text: "8 hours", onPress: () => setAmaDuration("8 hours") },
                    { text: "24 hours", onPress: () => setAmaDuration("24 hours") }
                  ]);
                }}
              >
                <Text style={styles.amaDropdownValue}>{amaDuration}</Text>
                <Ionicons name="chevron-down" size={14} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Row 3: Add a selfie Card */}
            <TouchableOpacity 
              style={styles.selfieUploadCard}
              onPress={() => {
                setAmaSelfie('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80');
                showAlert("Selfie Attached", "Selfie added successfully!");
              }}
            >
              {amaSelfie ? (
                <Image source={{ uri: amaSelfie }} style={styles.selfieImg} />
              ) : (
                <View style={{ alignItems: 'center' }}>
                  <View style={styles.selfiePillIcons}>
                    <Ionicons name="camera" size={18} color="#4B5563" />
                    <View style={{ width: 1, height: 16, backgroundColor: '#D1D5DB', marginHorizontal: 8 }} />
                    <Ionicons name="images" size={18} color="#4B5563" />
                  </View>
                  <Text style={styles.selfieUploadTitle}>Add a selfie</Text>
                  <Text style={styles.selfieUploadSub}>
                    Most guests add a selfie holding a note with the community name, date, and time
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Bottom Sticky Toolbar */}
      <View style={[styles.bottomToolbar, isKeyboardVisible && { height: 50, paddingBottom: 0 }]}>
        <TouchableOpacity style={styles.toolbarItem} onPress={() => {
          setTempLink('');
          setShowLinkInputModal(true);
        }}>
          <Ionicons name="link-outline" size={22} color="#1F2937" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolbarItem} onPress={() => setShowAddImageSheet(true)}>
          <Ionicons name="image-outline" size={22} color="#1F2937" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolbarItem} onPress={() => setShowAddVideoSheet(true)}>
          <Ionicons name="play-circle-outline" size={22} color="#1F2937" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolbarItem} onPress={() => {
          setAttachedPoll({ question: '', options: ['', ''] });
        }}>
          <Ionicons name="list-outline" size={22} color="#1F2937" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.toolbarItem, styles.amaToolbarItem]} 
          onPress={() => { setAttachedAMA(true); }}
        >
          <Text style={styles.amaText}>ama</Text>
        </TouchableOpacity>
      </View>

      {/* 1. SELECT COMMUNITY MODAL (Screen 3) */}
      <Modal 
        visible={showCommunityModal} 
        animationType="slide"
        statusBarTranslucent={true}
        onRequestClose={() => setShowCommunityModal(false)}
      >
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCommunityModal(false)} style={styles.modalCloseBtn}>
              <Ionicons name="close" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Post to</Text>
          </View>

          {/* Search Field */}
          <View style={styles.modalSearchWrapper}>
            <Ionicons name="search" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.modalSearchInput}
              placeholder="Search for a community"
              placeholderTextColor="#9CA3AF"
              value={searchCommunityQuery}
              onChangeText={setSearchCommunityQuery}
            />
          </View>

          {/* Communities list */}
          <ScrollView style={styles.communitiesListScroll} showsVerticalScrollIndicator={false}>
            {filteredCommunities.map((comm) => (
              <TouchableOpacity 
                key={comm.name} 
                style={[
                  styles.communityRowItem,
                  comm.cannotPost && { opacity: 0.5 }
                ]}
                onPress={() => {
                  if (comm.cannotPost) {
                    Alert.alert('Restricted', 'You cannot post to this community.');
                    return;
                  }
                  setSelectedCommunity(comm);
                  setShowCommunityModal(false);
                }}
              >
                <View style={[styles.commAvatarCircle, { backgroundColor: comm.color }]}>
                  <Text style={styles.commAvatarLetter}>{comm.name.charAt(2).toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.commRowName}>{comm.name}</Text>
                  <Text style={styles.commRowMeta}>{comm.members} • {comm.subtext}</Text>
                  <Text style={styles.commRowDesc} numberOfLines={2}>{comm.desc}</Text>
                  {comm.cannotPost && (
                    <Text style={styles.cannotPostLabel}>⚠️ You cannot post here</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* 2. ADD IMAGE BOTTOM SHEET (Screen 4) */}
      <Modal 
        visible={showAddImageSheet} 
        transparent
        animationType="fade"
        statusBarTranslucent={true}
        onRequestClose={() => setShowAddImageSheet(false)}
      >
        <View style={styles.bottomSheetOverlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowAddImageSheet(false)} />
          <View style={styles.bottomSheetContent}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Add image</Text>
              <TouchableOpacity onPress={() => setShowAddImageSheet(false)} style={styles.sheetCloseBtn}>
                <Ionicons name="close" size={22} color="#1F2937" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.sheetOptionRow} 
              onPress={() => handleImageOptionPress('camera')}
            >
              <Ionicons name="camera-outline" size={24} color="#4B5563" style={{ marginRight: 12 }} />
              <Text style={styles.sheetOptionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.sheetOptionRow} 
              onPress={() => handleImageOptionPress('library')}
            >
              <Ionicons name="images-outline" size={24} color="#4B5563" style={{ marginRight: 12 }} />
              <Text style={styles.sheetOptionText}>Photo Library</Text>
            </TouchableOpacity>
            
            {/* Safe bottom spacer */}
            <View style={{ height: 100, backgroundColor: '#FFFFFF', position: 'absolute', bottom: -100, left: 0, right: 0 }} />
          </View>
        </View>
      </Modal>

      {/* 3. ADD VIDEO BOTTOM SHEET (Screen 5) */}
      <Modal 
        visible={showAddVideoSheet} 
        transparent
        animationType="fade"
        statusBarTranslucent={true}
        onRequestClose={() => setShowAddVideoSheet(false)}
      >
        <View style={styles.bottomSheetOverlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowAddVideoSheet(false)} />
          <View style={styles.bottomSheetContent}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Add video</Text>
              <TouchableOpacity onPress={() => setShowAddVideoSheet(false)} style={styles.sheetCloseBtn}>
                <Ionicons name="close" size={22} color="#1F2937" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.sheetOptionRow} 
              onPress={() => handleVideoOptionPress('camera')}
            >
              <Ionicons name="videocam-outline" size={24} color="#4B5563" style={{ marginRight: 12 }} />
              <Text style={styles.sheetOptionText}>Capture Video</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.sheetOptionRow} 
              onPress={() => handleVideoOptionPress('library')}
            >
              <Ionicons name="images-outline" size={24} color="#4B5563" style={{ marginRight: 12 }} />
              <Text style={styles.sheetOptionText}>Video Library</Text>
            </TouchableOpacity>
            
            {/* Safe bottom spacer */}
            <View style={{ height: 100, backgroundColor: '#FFFFFF', position: 'absolute', bottom: -100, left: 0, right: 0 }} />
          </View>
        </View>
      </Modal>

      {/* 4. CUSTOM DESICIRCLE ALERT POPUP MODAL */}
      {customAlert && (
        <Modal transparent visible animationType="fade" statusBarTranslucent={true} onRequestClose={() => setCustomAlert(null)}>
          <View style={styles.alertOverlay}>
            <View style={styles.alertBox}>
              <Text style={styles.alertTitle}>{customAlert.title}</Text>
              <Text style={styles.alertMessage}>{customAlert.message}</Text>
              <View style={styles.alertButtonsRow}>
                {customAlert.buttons ? (
                  customAlert.buttons.map((btn, idx) => (
                    <TouchableOpacity 
                      key={idx} 
                      style={[styles.alertBtn, idx === 0 && styles.alertBtnSecondary]}
                      onPress={() => {
                        setCustomAlert(null);
                        if (btn.onPress) btn.onPress();
                      }}
                    >
                      <Text style={[styles.alertBtnText, idx === 0 && styles.alertBtnTextSecondary]}>{btn.text}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <TouchableOpacity style={styles.alertBtn} onPress={() => setCustomAlert(null)}>
                    <Text style={styles.alertBtnText}>OK</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </Modal>
      )}

      {showLinkInputModal && (
        <Modal transparent visible animationType="slide" statusBarTranslucent={true} onRequestClose={() => setShowLinkInputModal(false)}>
          <KeyboardAvoidingView 
            style={{ flex: 1 }} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={styles.bottomSheetOverlay}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowLinkInputModal(false)} />
              <View style={styles.bottomSheetContent}>
                <View style={styles.sheetHeader}>
                  <Text style={styles.sheetTitle}>Add Link</Text>
                  <TouchableOpacity onPress={() => setShowLinkInputModal(false)} style={styles.sheetCloseBtn}>
                    <Ionicons name="close" size={22} color="#1F2937" />
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={styles.pollOptionInput}
                  placeholder="https://example.com"
                  placeholderTextColor="#9CA3AF"
                  value={tempLink}
                  onChangeText={setTempLink}
                  autoFocus
                />
                <TouchableOpacity 
                  style={{ backgroundColor: '#0F172A', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 16 }} 
                  onPress={() => {
                    setShowLinkInputModal(false);
                    if (tempLink.trim()) {
                      setAttachedLink(tempLink);
                      showAlert('Link Added', 'URL attached successfully!');
                    }
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 }}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 90,
    paddingTop: 44,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  headerCloseBtn: {
    padding: 4,
  },
  communitySelectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 16,
  },
  communitySelectorText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  selectedCommIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  selectedCommIconText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  postBtn: {
    backgroundColor: '#EEF2F6',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 6,
    marginLeft: 'auto',
  },
  postBtnDisabled: {
    backgroundColor: '#F3F4F6',
  },
  postBtnText: {
    color: '#1F2937',
    fontWeight: '800',
    fontSize: 13,
  },
  postBtnTextDisabled: {
    color: '#9CA3AF',
  },
  contentScroll: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  titleInput: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    padding: 0,
  },
  bodyInput: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 20,
    padding: 0,
  },
  attachedImageContainer: {
    marginTop: 16,
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  attachedImage: {
    width: '100%',
    height: 240,
  },
  removeAttachmentBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  attachedTagsRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagBadgeText: {
    fontSize: 12,
    color: '#7C3AED',
    fontWeight: 'bold',
  },
  bottomToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    height: 72,
    paddingHorizontal: 16,
    paddingBottom: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  toolbarItem: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  amaToolbarItem: {
    borderWidth: 1.5,
    borderColor: '#1F2937',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  amaText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#1F2937',
    textTransform: 'uppercase',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 90,
    paddingTop: 44,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 16,
  },
  modalSearchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    margin: 16,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
  },
  communitiesListScroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  communityRowItem: {
    flexDirection: 'row',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  commAvatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commAvatarLetter: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  commRowName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  commRowMeta: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  commRowDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    lineHeight: 16,
  },
  cannotPostLabel: {
    fontSize: 10,
    color: '#EF4444',
    fontWeight: 'bold',
    marginTop: 4,
  },
  bottomSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  bottomSheetContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  sheetCloseBtn: {
    padding: 4,
  },
  sheetOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  sheetOptionText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  pollCardBlock: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },
  cardBlockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pollDaysTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pollDaysText: {
    fontSize: 13,
    color: '#4B5563',
  },
  cardBlockCloseBtn: {
    backgroundColor: '#EEF2F6',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pollOptionInput: {
    backgroundColor: '#EEF2F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1F2937',
    marginTop: 10,
  },
  addPollOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 10,
  },
  addPollOptionText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#4B5563',
    marginLeft: 6,
  },
  amaCardBlock: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },
  amaTitleText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  amaDropdownGroup: {
    marginTop: 12,
  },
  amaLabelText: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '600',
  },
  amaDropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EEF2F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  amaDropdownValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  selfieUploadCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  selfiePillIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2F6',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 10,
  },
  selfieUploadTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  selfieUploadSub: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  selfieImg: {
    width: '100%',
    height: 180,
    borderRadius: 12,
  },
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  alertBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  alertMessage: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 20,
  },
  alertButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  alertBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  alertBtnSecondary: {
    backgroundColor: '#EEF2F6',
  },
  alertBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  alertBtnTextSecondary: {
    color: '#4B5563',
  },
  attachedLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  attachedLinkText: {
    fontSize: 14,
    color: '#3B82F6',
    marginRight: 6,
    textDecorationLine: 'underline',
  },
  removeLinkBtn: {
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
