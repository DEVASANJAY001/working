import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ImageBackground,
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  Dimensions,
  Animated,
  Easing,
  Alert,
  Switch,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { safeStorage } from '../utils/storage';
import { authService } from '../services/authService';
import CommunitiesScreen from './CommunitiesScreen';

const { width, height } = Dimensions.get('window');
const headerBgImage = require('../../assets/image.png');

const ABOUT_DOCS = {
  'Community Rules': `Welcome to Desicircle!\n\n1. Be Respectful: Treat all community members with empathy and courtesy. Personal attacks, harassment, or hate speech are strictly prohibited.\n\n2. Keep it Relevant: Ensure posts are on-topic and placed in the appropriate communities.\n\n3. Avoid Spam: Do not post repetitive content, advertisements, or promotional links.\n\n4. Protect Privacy: Do not share personal identification info of yourself or others.\n\n5. Content Guidelines: NSFW content must be labeled as 18+. Violations may result in profile suspension.`,
  'Privacy Policy': `Desicircle Privacy Policy\n\nEffective Date: July 19, 2026\n\n1. Information We Collect: We collect profile setup data, Cognito authentication records, and uploaded profile/banner images (stored securely in AWS S3).\n\n2. How We Use Data: To personalize feed algorithms, facilitate private messaging, and maintain secure user authentication sessions.\n\n3. Data Storage: All profile attributes and configurations are synced with AWS DynamoDB databases and preserved locally using secure caches.`,
  'User Agreement': `Desicircle Terms of Service\n\n1. Acceptance of Terms: By logging in or creating a profile on Desicircle, you agree to follow our community guidelines and privacy mandates.\n\n2. Account Responsibility: You are fully responsible for maintaining Cognito credential security and all content published from your profile.\n\n3. Intellectual Property: You retain ownership of content you publish but grant Desicircle a perpetual license to display and distribute it.`,
  'Acknowledgements': `Desicircle Acknowledgements\n\nWe express sincere gratitude to the open-source developer communities, Expo/React Native contributors, and Amazon Web Services for the cloud emulation frameworks that power our community experiences.\n\nThank you to our beta testing team and community moderators!`,
  'Open Source Licenses': `Open Source Software Notice\n\n- React Native: MIT License\n- Expo SDK: MIT License\n- Ionicons: MIT License\n- @react-native-async-storage/async-storage: MIT License\n- Expo Image Picker: MIT License\n- React Native Linear Gradient: MIT License`
};

// Helper for Time-based Dynamic Greeting
const getDynamicGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning ☀️';
  if (hour < 17) return 'Good Afternoon 🌤️';
  return 'Good Evening 🌙';
};

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
    authorName: 'r/ipl',
    authorHandle: 'ipl',
    authorAvatar: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80',
    time: '22h',
    views: '20.9k views',
    text: "1st Indian to score a 100 at Lord's!",
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&auto=format&fit=crop&q=80',
    likes: 540,
    commentsCount: 12,
    shares: 4,
    awards: 0,
    isLiked: false,
    isCommunity: true,
    isJoined: true,
  },
  {
    id: 'post_2',
    authorName: 'r/CarsIndia',
    authorHandle: 'CarsIndia',
    authorAvatar: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?w=100&auto=format&fit=crop&q=80',
    time: '1d',
    views: '220k views',
    text: "Was staring at her for like 20 mins, shi so beautiful",
    image: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?w=600&auto=format&fit=crop&q=80',
    likes: 220,
    commentsCount: 6,
    shares: 14,
    awards: 0,
    isLiked: false,
    isCommunity: true,
    isJoined: false,
  }
];

// Mock Communities
const recentCommunities = [
  { id: 'rc1', name: 'Chennai Techies', members: '12.4k', icon: 'code-slash', color: '#7C3AED' },
  { id: 'rc2', name: 'Desi Foodies', members: '45.2k', icon: 'restaurant', color: '#EF4444' },
  { id: 'rc3', name: 'Green Earth India', members: '8.1k', icon: 'leaf', color: '#10B981' },
  { id: 'rc4', name: 'Startup Founders', members: '19.8k', icon: 'rocket', color: '#3B82F6' },
  { id: 'rc5', name: 'Chennai Rains Alert', members: '34.1k', icon: 'rainy', color: '#06B6D4' },
];

const joinedCommunities = [
  { id: 'jc1', name: 'Chennai Techies', members: '12.4k', icon: 'code-slash', color: '#7C3AED' },
  { id: 'jc2', name: 'Desi Foodies', members: '45.2k', icon: 'restaurant', color: '#EF4444' },
  { id: 'jc3', name: 'TN Photography', members: '15.6k', icon: 'camera', color: '#F59E0B' },
  { id: 'jc4', name: 'Crypto & AI South', members: '9.3k', icon: 'hardware-chip', color: '#8B5CF6' },
];

export default function HomeDashboardScreen({ onLogout, onCreatePress, onGoToCommunityManager }) {
  const [activeTab, setActiveTab] = useState('Home Feed'); 
  const [posts, setPosts] = useState(initialPosts);
  
  // Profile state automatically synced with safeStorage / AWS User Profile
  const [userName, setUserName] = useState('Devasanjay');
  const [userHandle, setUserHandle] = useState('devasanjay');
  const [profileImage, setProfileImage] = useState(null);

  // Left Profile Side Panel States
  const [showLeftProfilePanel, setShowLeftProfilePanel] = useState(false);
  const leftPanelSlideAnim = useRef(new Animated.Value(-width)).current;
  const leftPanelFadeAnim = useRef(new Animated.Value(0)).current;

  // Dedicated Full-Screen Edit Profile Page States
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showAddSocialSheet, setShowAddSocialSheet] = useState(false);
  const [showSocialInputDialog, setShowSocialInputDialog] = useState(false);
  const [selectedPlatformForInput, setSelectedPlatformForInput] = useState(null);
  const [socialInputText, setSocialInputText] = useState('');
  const [socialLinksList, setSocialLinksList] = useState([]);

  // Settings Architecture States
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDarkModeSheet, setShowDarkModeSheet] = useState(false);
  const [darkModeSetting, setDarkModeSetting] = useState('Device'); // Device, Light, Dark, Sunrise to Sunset
  const [commentSortSetting, setCommentSortSetting] = useState('Hot');
  const [jumpButtonEnabled, setJumpButtonEnabled] = useState(true);
  const [saveImagesEnabled, setSaveImagesEnabled] = useState(true);
  const [externalLinksEnabled, setExternalLinksEnabled] = useState(true);
  const [dataSaverEnabled, setDataSaverEnabled] = useState(false);

  // Settings Sub-Page Navigation States
  const [settingsSubPage, setSettingsSubPage] = useState('main'); // main, language, viewOptions, accessibility, about, support
  const [selectedAboutDoc, setSelectedAboutDoc] = useState('');
  const [aboutDocContent, setAboutDocContent] = useState('');
  const [appLanguage, setAppLanguage] = useState('English');
  const [feedLayout, setFeedLayout] = useState('Classic');
  const [autoplayMedia, setAutoplayMedia] = useState('Always');
  const [textSize, setTextSize] = useState('Normal');
  const [voiceAssistEnabled, setVoiceAssistEnabled] = useState(false);
  const [supportCategory, setSupportCategory] = useState('General');
  const [supportMessage, setSupportMessage] = useState('');

  // Banner & Fields
  const [bannerImage, setBannerImage] = useState(null);
  const [editDisplayName, setEditDisplayName] = useState('Devasanjay');
  const [editBio, setEditBio] = useState('Exploring clean tech & innovative digital experiences! 🚀');

  // Custom Platform link (optional generator inside sheet)
  const [customPlatform, setCustomPlatform] = useState('');
  const [customUsername, setCustomUsername] = useState('');

  // Toggles
  const [is18Plus, setIs18Plus] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(true);

  // App Header Collapse Animations & Rotating Search Placeholders
  const headerTransitionAnim = useRef(new Animated.Value(0)).current;
  const searchPlaceholders = [
    "Search communities...",
    "Try '# Chennai Rains'",
    "Find local events",
    "Search for '# AI Jobs'",
    "Explore discussions...",
    "Looking for food walks?",
    "Find Metro Phase 2 updates",
    "Search trending feeds..."
  ];
  const [currentPlaceholder, setCurrentPlaceholder] = useState(searchPlaceholders[0]);

  // --- ACCOUNT SETTINGS STATES ---
  // Switch Accounts
  const [switchableAccounts, setSwitchableAccounts] = useState([
    { username: 'devasanjay', email: 'devasanjay@example.com', active: true, profileImage: null },
    { username: 'creative_mind', email: 'creative@example.com', active: false, profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' }
  ]);
  const [showSwitchAccountsModal, setShowSwitchAccountsModal] = useState(false);

  // Email Update Flow
  const [userEmailAddress, setUserEmailAddress] = useState('devasanjay@example.com');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailStep, setEmailStep] = useState(1); // 1: Send current OTP, 2: Enter current OTP, 3: Enter new email, 4: Enter new OTP
  const [emailOtpInput, setEmailOtpInput] = useState('');
  const [newEmailInput, setNewEmailInput] = useState('');

  // App Lock
  const [appLockEnabled, setAppLockEnabled] = useState(false);
  const [appLockPassword, setAppLockPassword] = useState('');
  const [appLockDuration, setAppLockDuration] = useState('72 hrs'); // Immediate, 1 hr, 24 hrs, 72 hrs
  const [appLockBiometrics, setAppLockBiometrics] = useState(true);
  const [showPasscodeSetup, setShowPasscodeSetup] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');

  // Location Customization
  const [personalizeLocation, setPersonalizeLocation] = useState(true);

  // Connected to Google
  const [googleConnected, setGoogleConnected] = useState(false);
  const [showGoogleConnectModal, setShowGoogleConnectModal] = useState(false);

  // Profile Page & Change Password Modal States
  const [showProfilePageModal, setShowProfilePageModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmNewPasswordInput, setConfirmNewPasswordInput] = useState('');

  // Contact Notifications
  const [notifPush, setNotifPush] = useState(true);
  const [notifEmail, setNotifEmail] = useState(false);
  const [notifDMs, setNotifDMs] = useState(true);
  const [notifComments, setNotifComments] = useState(true);

  // Safety
  const [blockedAccountsList, setBlockedAccountsList] = useState(['spammer_bot', 'annoying_user']);
  const [mutedCommunitiesList, setMutedCommunitiesList] = useState(['noise_channel', 'offtopic_hub']);
  const [chatPermissionsOption, setChatPermissionsOption] = useState('Everyone'); // Everyone, 30days, Nobody
  const [allowFollowers, setAllowFollowers] = useState(true);
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const [showMutedModal, setShowMutedModal] = useState(false);

  // Privacy
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [showInSearchResults, setShowInSearchResults] = useState(true);
  const [personalizeAdsFromPartners, setPersonalizeAdsFromPartners] = useState(true);

  // Sensitive Ads Toggles
  const [allowAlcoholAds, setAllowAlcoholAds] = useState(true);
  const [allowDatingAds, setAllowDatingAds] = useState(true);
  const [allowGamblingAds, setAllowGamblingAds] = useState(false);
  const [allowPoliticsAds, setAllowPoliticsAds] = useState(true);
  const [allowPregnancyAds, setAllowPregnancyAds] = useState(true);
  const [allowReligionAds, setAllowReligionAds] = useState(false);
  const [allowWeightLossAds, setAllowWeightLossAds] = useState(true);
  // --- END ACCOUNT SETTINGS STATES ---

  const startupLockChecked = useRef(false);
  const [isAppLocked, setIsAppLocked] = useState(false);
  const [unlockInputCode, setUnlockInputCode] = useState('');

  const updateSettingOnBackend = async (fieldName, value) => {
    try {
      const stored = await safeStorage.getItem('user_profile');
      let profile = {};
      if (stored) {
        profile = JSON.parse(stored);
      }
      profile[fieldName] = value;
      if (fieldName === 'email') {
        profile.email = value;
      }
      await safeStorage.setItem('user_profile', JSON.stringify(profile));
      await authService.updateUserProfile(profile);
      console.log(`[Backend Sync] Updated ${fieldName} to:`, value);
    } catch (e) {
      console.log('Error updating settings on backend:', e);
    }
  };

  useEffect(() => {
    const collapseTimer = setTimeout(() => {
      Animated.timing(headerTransitionAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start();
    }, 4000);

    let index = 0;
    const placeholderTimer = setInterval(() => {
      index = (index + 1) % searchPlaceholders.length;
      setCurrentPlaceholder(searchPlaceholders[index]);
    }, 2000);

    const postSyncInterval = setInterval(async () => {
      try {
        const publishedPostStr = await safeStorage.getItem('new_published_post');
        if (publishedPostStr) {
          const newPost = JSON.parse(publishedPostStr);
          setPosts(prev => {
            if (prev.find(p => p.id === newPost.id)) return prev;
            return [newPost, ...prev];
          });
          await safeStorage.removeItem('new_published_post');
        }
      } catch (e) {}
    }, 1000);

    return () => {
      clearTimeout(collapseTimer);
      clearInterval(placeholderTimer);
      clearInterval(postSyncInterval);
    };
  }, []);

  useEffect(() => {
    async function loadUserProfile() {
      try {
        // Load switchable accounts list
        const storedAccounts = await safeStorage.getItem('switchable_accounts');
        if (storedAccounts) {
          setSwitchableAccounts(JSON.parse(storedAccounts));
        }

        const applySettings = (profile) => {
          if (profile.email) setUserEmailAddress(profile.email);
          if (profile.notifPush !== undefined) setNotifPush(profile.notifPush);
          if (profile.notifEmail !== undefined) setNotifEmail(profile.notifEmail);
          if (profile.notifDMs !== undefined) setNotifDMs(profile.notifDMs);
          if (profile.notifComments !== undefined) setNotifComments(profile.notifComments);
          if (profile.blockedAccountsList !== undefined) setBlockedAccountsList(profile.blockedAccountsList);
          if (profile.mutedCommunitiesList !== undefined) setMutedCommunitiesList(profile.mutedCommunitiesList);
          if (profile.chatPermissionsOption !== undefined) setChatPermissionsOption(profile.chatPermissionsOption);
          if (profile.allowFollowers !== undefined) setAllowFollowers(profile.allowFollowers);
          if (profile.showRecommendations !== undefined) setShowRecommendations(profile.showRecommendations);
          if (profile.showInSearchResults !== undefined) setShowInSearchResults(profile.showInSearchResults);
          if (profile.personalizeAdsFromPartners !== undefined) setPersonalizeAdsFromPartners(profile.personalizeAdsFromPartners);
          if (profile.allowAlcoholAds !== undefined) setAllowAlcoholAds(profile.allowAlcoholAds);
          if (profile.allowDatingAds !== undefined) setAllowDatingAds(profile.allowDatingAds);
          if (profile.allowGamblingAds !== undefined) setAllowGamblingAds(profile.allowGamblingAds);
          if (profile.allowPoliticsAds !== undefined) setAllowPoliticsAds(profile.allowPoliticsAds);
          if (profile.allowPregnancyAds !== undefined) setAllowPregnancyAds(profile.allowPregnancyAds);
          if (profile.allowReligionAds !== undefined) setAllowReligionAds(profile.allowReligionAds);
          if (profile.allowWeightLossAds !== undefined) setAllowWeightLossAds(profile.allowWeightLossAds);
          if (profile.appLockEnabled !== undefined) {
            setAppLockEnabled(profile.appLockEnabled);
            if (profile.appLockEnabled && !startupLockChecked.current) {
              startupLockChecked.current = true;
              // Temporarily disabled password lock startup overlay
              setIsAppLocked(false);
            }
          }
          if (profile.appLockPassword !== undefined) setAppLockPassword(profile.appLockPassword);
          if (profile.appLockDuration !== undefined) setAppLockDuration(profile.appLockDuration);
          if (profile.appLockBiometrics !== undefined) setAppLockBiometrics(profile.appLockBiometrics);
          if (profile.personalizeLocation !== undefined) setPersonalizeLocation(profile.personalizeLocation);
          if (profile.googleConnected !== undefined) {
            setGoogleConnected(profile.googleConnected);
          } else if (profile.email && profile.email.toLowerCase().endsWith('@gmail.com')) {
            setGoogleConnected(true);
            updateSettingOnBackend('googleConnected', true);
          }
        };

        // 1. Load local cache first for instant UI response
        const stored = await safeStorage.getItem('user_profile');
        let email = '';
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.fullName) {
            setUserName(parsed.fullName);
            setEditDisplayName(parsed.fullName);
          }
          if (parsed.username) setUserHandle(parsed.username);
          if (parsed.profileImage !== undefined) setProfileImage(parsed.profileImage);
          if (parsed.bannerImage !== undefined) setBannerImage(parsed.bannerImage);
          if (parsed.bio !== undefined) setEditBio(parsed.bio);
          if (parsed.socialLinksList !== undefined) {
            setSocialLinksList(parsed.socialLinksList);
          }
          if (parsed.is18Plus !== undefined) setIs18Plus(parsed.is18Plus);
          if (parsed.isContentVisible !== undefined) setIsContentVisible(parsed.isContentVisible);
          if (parsed.email) email = parsed.email;

          applySettings(parsed);
        }

        // Resolve email from session if missing in profile cache
        if (!email) {
          const sessionStr = await safeStorage.getItem('user_session');
          if (sessionStr) {
            const session = JSON.parse(sessionStr);
            if (session && session.email) {
              email = session.email;
            }
          }
        }

        // 2. Fetch fresh profile from AWS DynamoDB to sync changes (including images)
        if (email) {
          console.log('[HomeDashboard] Syncing fresh profile from AWS DynamoDB for:', email);
          const freshProfile = await authService.getUserProfile(email);
          if (freshProfile) {
            if (freshProfile.fullName) {
              setUserName(freshProfile.fullName);
              setEditDisplayName(freshProfile.fullName);
            }
            if (freshProfile.username) setUserHandle(freshProfile.username);
            if (freshProfile.profileImage !== undefined) setProfileImage(freshProfile.profileImage);
            if (freshProfile.bannerImage !== undefined) setBannerImage(freshProfile.bannerImage);
            if (freshProfile.bio !== undefined) setEditBio(freshProfile.bio);
            if (freshProfile.socialLinksList !== undefined) setSocialLinksList(freshProfile.socialLinksList);
            if (freshProfile.is18Plus !== undefined) setIs18Plus(freshProfile.is18Plus);
            if (freshProfile.isContentVisible !== undefined) setIsContentVisible(freshProfile.isContentVisible);

            applySettings(freshProfile);
            
            // Cache the fresh profile
            await safeStorage.setItem('user_profile', JSON.stringify(freshProfile));
          }
        }

        if (email) {
          setUserEmailAddress(email);
          setSwitchableAccounts(prev => prev.map(acc => {
            if (acc.username === 'devasanjay') {
              return { ...acc, email: email };
            }
            return acc;
          }));
        }
      } catch (e) {
        console.log('Error loading user profile:', e);
      }
    }
    loadUserProfile();
  }, [showLeftProfilePanel]);

  useEffect(() => {
    if (switchableAccounts && switchableAccounts.length > 0) {
      safeStorage.setItem('switchable_accounts', JSON.stringify(switchableAccounts));
    }
  }, [switchableAccounts]);

  const openLeftPanel = () => {
    setShowLeftProfilePanel(true);
    Animated.parallel([
      Animated.timing(leftPanelSlideAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(leftPanelFadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeLeftPanel = () => {
    Animated.parallel([
      Animated.timing(leftPanelSlideAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(leftPanelFadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowLeftProfilePanel(false);
    });
  };

  const pickBannerImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });
      if (result && !result.canceled && result.assets && result.assets.length > 0) {
        setBannerImage(result.assets[0].uri);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const pickProfileImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (result && !result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSaveProfile = async () => {
    let email = '';
    try {
      const stored = await safeStorage.getItem('user_profile');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email) {
          email = parsed.email;
        }
      }
      if (!email) {
        const sessionStr = await safeStorage.getItem('user_session');
        if (sessionStr) {
          const session = JSON.parse(sessionStr);
          if (session && session.email) {
            email = session.email;
          }
        }
      }
    } catch (e) {}

    // Upload picked images to AWS S3 if local
    let s3ProfileImage = profileImage;
    if (profileImage && !profileImage.startsWith('http')) {
      try {
        s3ProfileImage = await authService.uploadImageToS3(profileImage, 'avatars');
      } catch (e) {
        console.log('S3 Profile Upload Error:', e);
      }
    }

    let s3BannerImage = bannerImage;
    if (bannerImage && !bannerImage.startsWith('http')) {
      try {
        s3BannerImage = await authService.uploadImageToS3(bannerImage, 'banners');
      } catch (e) {
        console.log('S3 Banner Upload Error:', e);
      }
    }

    const updatedProfile = {
      fullName: editDisplayName,
      username: userHandle,
      email: email,
      profileImage: s3ProfileImage,
      bannerImage: s3BannerImage,
      bio: editBio,
      socialLinksList: socialLinksList,
      is18Plus,
      isContentVisible,
      isLoggedIn: true,
      isProfileCompleted: true,
      updatedAt: new Date().toISOString()
    };

    try {
      await safeStorage.setItem('user_profile', JSON.stringify(updatedProfile));
      await safeStorage.setItem('user_session', JSON.stringify({ isLoggedIn: true, email: email }));
      await authService.updateUserProfile(updatedProfile);
      setUserName(editDisplayName);
      Alert.alert("Success", "Profile settings saved successfully & updated on AWS!");
      setShowEditProfileModal(false);
    } catch (e) {
      Alert.alert("Error", "Could not save profile settings.");
    }
  };

  // Navigation & Modal Overlays States
  const [selectedPost, setSelectedPost] = useState(null); 
  const [showComments, setShowComments] = useState(false); 
  const [showShare, setShowShare] = useState(false); 
  const [showAwards, setShowAwards] = useState(false); 

  // Three-Dots Drawer & Search Overlays
  const [showThreeDotsDrawer, setShowThreeDotsDrawer] = useState(false);
  const [showSeeAllRecent, setShowSeeAllRecent] = useState(false);
  const [showStartCommunity, setShowStartCommunity] = useState(false);
  const [showSearchWindow, setShowSearchWindow] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Search History & Trending Expandable list states
  const [searchHistory, setSearchHistory] = useState([
    'Chennai Techies',
    'AI and Flutter jobs',
    'Desi Circles App',
    'Metro Phase 2 updates',
    'Chennai Rains alert'
  ]);
  const [isTrendingExpanded, setIsTrendingExpanded] = useState(false);

  const trendingListAll = [
    '# Chennai Rains',
    '# Metro Phase 2',
    '# AI Jobs',
    '# TN Budget 2025',
    '# IPL 2025',
    '# Clean Tech India',
    '# Startup India',
    '# Gold Price Today',
    '# Food Walk Chennai',
    '# Digital India'
  ];

  const clearSearchHistory = () => {
    setSearchHistory([]);
    Alert.alert("Cleared", "Search history cleared successfully!");
  };

  const exportSearchResults = () => {
    const payload = {
      history: searchHistory,
      timestamp: new Date().toISOString(),
      source: 'DesiCircle App Search Service'
    };
    Alert.alert("Export Results", JSON.stringify(payload, null, 2));
  };

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllCommunities, setShowAllCommunities] = useState(false);
  const [showAllMessages, setShowAllMessages] = useState(false);

  // New Community form state
  const [communityName, setCommunityName] = useState('');
  const [communityDesc, setCommunityDesc] = useState('');

  // Coin Balance
  const [coinsBalance, setCoinsBalance] = useState(1250);
  const [selectedAward, setSelectedAward] = useState(null);
  const [awardQuantity, setAwardQuantity] = useState(1);

  // Sorting for Comments
  const [commentSort, setCommentSort] = useState('Top'); 
  const [newCommentText, setNewCommentText] = useState('');

  // Animation values for smooth 3-dots drawer fade-in and slide-up
  const drawerFadeAnim = useRef(new Animated.Value(0)).current;
  const drawerSlideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (showThreeDotsDrawer) {
      Animated.parallel([
        Animated.timing(drawerFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.spring(drawerSlideAnim, {
          toValue: 0,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      drawerFadeAnim.setValue(0);
      drawerSlideAnim.setValue(300);
    }
  }, [showThreeDotsDrawer]);

  const closeDrawerWithAnim = (callback) => {
    Animated.parallel([
      Animated.timing(drawerFadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(drawerSlideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      setShowThreeDotsDrawer(false);
      if (callback) callback();
    });
  };

  // Handle Logout Confirmation
  const handleLogoutPress = () => {
    closeDrawerWithAnim(() => {
      setShowLogoutConfirm(true);
    });
  };

  const confirmLogoutAction = () => {
    setShowLogoutConfirm(false);
    if (onLogout) onLogout();
  };

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

  if (isAppLocked) {
    return (
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center', zIndex: 99999 }]}>
        <View style={{ width: '80%', alignItems: 'center', gap: 20 }}>
          <Ionicons name="lock-closed" size={64} color="#7C3AED" />
          <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }}>App Locked</Text>
          <Text style={{ color: '#9CA3AF', fontSize: 13, textAlign: 'center' }}>Enter passcode to unlock Desicircle:</Text>
          <TextInput
            style={{ borderColor: 'rgba(255, 255, 255, 0.2)', borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 24, color: '#FFFFFF', textAlign: 'center', width: '60%', letterSpacing: 12 }}
            maxLength={4}
            keyboardType="number-pad"
            placeholder="0000"
            placeholderTextColor="rgba(255, 255, 255, 0.3)"
            secureTextEntry
            value={unlockInputCode}
            onChangeText={(val) => {
              setUnlockInputCode(val);
              if (val === appLockPassword) {
                setIsAppLocked(false);
                setUnlockInputCode('');
                Alert.alert("Welcome Back", "App unlocked successfully!");
              } else if (val.length === 4) {
                Alert.alert("Incorrect Code", "The passcode you entered is incorrect.");
                setUnlockInputCode('');
              }
            }}
          />
          {appLockBiometrics && (
            <TouchableOpacity 
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 }}
              onPress={() => {
                setIsAppLocked(false);
                Alert.alert("Biometrics Verified", "App unlocked via fingerprint/Face ID emulations!");
              }}
            >
              <Ionicons name="finger-print" size={20} color="#7C3AED" />
              <Text style={{ color: '#7C3AED', fontSize: 13, fontWeight: '700' }}>Unlock with Biometrics</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* 1. Header with Image Background (assets/image.png), Dark Overlay & Time-Based Greeting */}
      {activeTab !== 'Communities' && (
        <Animated.View style={[styles.headerContainer]}>
          <Animated.View style={[StyleSheet.absoluteFill, {
            opacity: headerTransitionAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0.15]
            })
          }]}>
            <ImageBackground 
              source={headerBgImage} 
              style={{ width: '100%', height: '100%' }}
              imageStyle={styles.headerBgImgStyle}
            />
          </Animated.View>
          <LinearGradient 
            colors={['rgba(15, 23, 42, 0.65)', 'rgba(30, 27, 75, 0.85)']} 
            style={styles.headerGradientOverlay}
          >
            <Animated.View style={[
              styles.topHeader,
              {
                paddingTop: headerTransitionAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -8]
                }),
                paddingBottom: headerTransitionAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -4]
                }),
              }
            ]}>
              <View style={styles.headerRow}>
                <View style={styles.userProfile}>
                  <TouchableOpacity onPress={openLeftPanel}>
                    {profileImage ? (
                      <Image 
                        source={{ uri: profileImage }} 
                        style={styles.avatarImg} 
                      />
                    ) : (
                      <LinearGradient colors={['#7C3AED', '#F97316']} style={styles.initialAvatar}>
                        <Text style={styles.initialAvatarText}>
                          {userName.trim().charAt(0).toUpperCase() || 'D'}
                        </Text>
                      </LinearGradient>
                    )}
                  </TouchableOpacity>
                  <Animated.View style={[
                    styles.userText,
                    {
                      opacity: headerTransitionAnim.interpolate({
                        inputRange: [0, 0.7, 1],
                        outputRange: [1, 0, 0]
                      }),
                      maxWidth: headerTransitionAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [width * 0.5, 0]
                      }),
                      marginLeft: headerTransitionAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [12, 0]
                      }),
                    }
                  ]}>
                    <Text numberOfLines={1} style={styles.userName}>{userName}</Text>
                    <Text numberOfLines={1} style={styles.greetingText}>@{userHandle} • {getDynamicGreeting()}</Text>
                  </Animated.View>
                </View>

                {/* Animated Search Bar expanding into center */}
                <Animated.View style={[
                  styles.animatedSearchContainer,
                  {
                    flex: headerTransitionAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.0001, 1]
                    }),
                    marginLeft: headerTransitionAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 12]
                    }),
                    marginRight: headerTransitionAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 12]
                    }),
                    opacity: headerTransitionAnim,
                    transform: [
                      {
                        scaleX: headerTransitionAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.3, 1]
                        })
                      }
                    ]
                  }
                ]}>
                  <TouchableOpacity 
                    activeOpacity={0.9} 
                    style={styles.searchInnerContainer}
                    onPress={() => setShowSearchWindow(true)}
                  >
                    <Ionicons name="search" size={16} color="#FFFFFF" style={{ marginLeft: 12 }} />
                    <TextInput
                      placeholder={currentPlaceholder}
                      placeholderTextColor="rgba(255, 255, 255, 0.7)"
                      style={styles.headerSearchInput}
                      editable={false}
                      pointerEvents="none"
                    />
                  </TouchableOpacity>
                </Animated.View>
                
                <View style={styles.headerActions}>
                  {/* Small search button that fades out */}
                  <Animated.View style={{
                    width: headerTransitionAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [38, 0]
                    }),
                    opacity: headerTransitionAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [1, 0, 0]
                    }),
                    overflow: 'hidden',
                  }}>
                    <TouchableOpacity style={styles.actionIconButtonHeader} onPress={() => setShowSearchWindow(true)}>
                      <Ionicons name="search" size={19} color="#FFFFFF" />
                    </TouchableOpacity>
                  </Animated.View>
                  
                  <TouchableOpacity style={styles.actionIconButtonHeader} onPress={() => setShowThreeDotsDrawer(true)}>
                    <Ionicons name="ellipsis-vertical" size={19} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </LinearGradient>
        </Animated.View>
      )}

      {/* 2. Segmented Control Feed Tabs with Purple Sliding Accent */}
      {activeTab !== 'Communities' && (
        <View style={styles.tabsRowContainer}>
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
        </View>
      )}

      {/* 3. Feeds Scroll Container or Communities Screen */}
      {activeTab === 'Communities' ? (
        <CommunitiesScreen onBackToFeed={() => setActiveTab('Home Feed')} onStartCommunity={onGoToCommunityManager} />
      ) : (
        <ScrollView style={styles.mainFeed} showsVerticalScrollIndicator={false}>
        
        {/* Render Feed HOM_001 (Home Feed) */}
        {activeTab === 'Home Feed' && (
          <View>
            {posts.map(post => renderPostCard(post))}
          </View>
        )}

        {/* Render Feed HOM_002 (Local Feed) */}
        {activeTab === 'Local Feed' && (
          <View>
            <View style={styles.localLocationBar}>
              <Ionicons name="location" size={18} color="#7C3AED" />
              <Text style={styles.localLocationText}>Chennai, Tamil Nadu</Text>
              <Ionicons name="chevron-down" size={16} color="#6B7280" style={{ marginLeft: 6 }} />
            </View>

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

            <View style={styles.localPostsHeader}>
              <Text style={styles.localPostsTitle}>What's happening near you</Text>
              <TouchableOpacity><Text style={styles.seeAllLink}>See All →</Text></TouchableOpacity>
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
                tagColor: '#F59E0B',
                tagBg: '#FEF3C7',
              },
              {
                id: 'loc_2',
                title: 'Water Supply Update',
                desc: 'Water supply will be affected in Adyar, Besant Nagar area.',
                time: '3h ago',
                likes: 87,
                comments: 0,
                tag: 'Utility',
                tagColor: '#3B82F6',
                tagBg: '#DBEAFE',
              },
              {
                id: 'loc_3',
                title: 'Garbage Collection Drive',
                desc: 'Special drive starting this Sunday in Ward 112.',
                time: '4h ago',
                likes: 64,
                comments: 15,
                tag: 'Cleanliness',
                tagColor: '#10B981',
                tagBg: '#D1FAE5',
              }
            ].map((item) => (
              <View key={item.id} style={styles.localPostCard}>
                <View style={styles.localPostHeader}>
                  <View style={[styles.localTagBadge, { backgroundColor: item.tagBg }]}>
                    <Text style={[styles.localTagText, { color: item.tagColor }]}>{item.tag}</Text>
                  </View>
                  <Text style={styles.localPostTime}>{item.time}</Text>
                </View>
                <Text style={styles.localPostTitle}>{item.title}</Text>
                <Text style={styles.localPostDesc}>{item.desc}</Text>
                
                <View style={styles.localPostFooter}>
                  <TouchableOpacity style={styles.localStatBtn}>
                    <Ionicons name="heart-outline" size={16} color="#6B7280" />
                    <Text style={styles.localStatText}>{item.likes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.localStatBtn}>
                    <Ionicons name="chatbubble-outline" size={16} color="#6B7280" />
                    <Text style={styles.localStatText}>{item.comments}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.localShareBtn}>
                    <Ionicons name="share-social-outline" size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Render Feed HOM_003 (Trending Feed) */}
        {activeTab === 'Trending Feed' && (
          <View>
            <View style={styles.trendingTopicsCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🔥 Trending Topics</Text>
                <TouchableOpacity><Text style={styles.seeAllLink}>See All →</Text></TouchableOpacity>
              </View>

              <View style={styles.trendingTopicsList}>
                {[
                  { rank: '01', tag: '# Chennai Rains', count: '12.5K posts', trend: '+ 22%' },
                  { rank: '02', tag: '# AI Jobs', count: '8.1K posts', trend: '+ 18%' },
                  { rank: '03', tag: '# Metro Phase 2', count: '6.7K posts', trend: '+ 16%' },
                  { rank: '04', tag: '# TN Budget 2025', count: '5.3K posts', trend: '+ 12%' },
                  { rank: '05', tag: '# IPL 2025', count: '4.0K posts', trend: '+ 10%' }
                ].map((item) => (
                  <View key={item.rank} style={styles.topicRankRow}>
                    <Text style={styles.topicRankNumber}>{item.rank}</Text>
                    <View style={styles.topicRankInfo}>
                      <Text style={styles.topicRankTag}>{item.tag}</Text>
                      <Text style={styles.topicRankCount}>{item.count}</Text>
                    </View>
                    <View style={styles.topicTrendBadge}>
                      <Text style={styles.topicTrendText}>{item.trend}</Text>
                      <Ionicons name="trending-up" size={14} color="#10B981" />
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View style={{ marginTop: 16 }}>
              <Text style={styles.sectionTitle}>Trending Post</Text>
            </View>
            {posts.filter(p => p.id === 'post_2').map(post => renderPostCard(post))}
          </View>
        )}

        {/* Render Feed HOM_004 (Following Feed) */}
        {activeTab === 'Following Feed' && (
          <View>
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

            {posts.filter(p => p.id === 'post_3').map(post => renderPostCard(post))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
      )}

      {/* 4. Bottom Custom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Home Feed')}>
          <Ionicons name="home" size={24} color={activeTab === 'Home Feed' ? '#7C3AED' : '#9CA3AF'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Communities')}>
          <Ionicons name="compass-outline" size={24} color={activeTab === 'Communities' ? '#7C3AED' : '#9CA3AF'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButtonContainer} onPress={onCreatePress}>
          <LinearGradient colors={['#7C3AED', '#F97316']} style={styles.addButtonGradient}>
            <Ionicons name="add" size={28} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => Alert.alert('Chat', 'Messaging channel lists coming soon.')}>
          <Ionicons name="chatbubbles-outline" size={24} color="#9CA3AF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={openLeftPanel}>
          <Ionicons name="person-outline" size={24} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* THREE-DOTS NAVIGATION DRAWER MODAL WITH FADE-IN BACKDROP & SPRING SLIDE-UP */}
      <Modal visible={showThreeDotsDrawer} transparent animationType="none" onRequestClose={() => closeDrawerWithAnim()} statusBarTranslucent={true}>
        <View style={styles.modalFullContainer}>
          <Animated.View style={[styles.drawerOverlay, { opacity: drawerFadeAnim }]}>
            <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={() => closeDrawerWithAnim()} />
          </Animated.View>

          <Animated.View style={[styles.drawerContent, { transform: [{ translateY: drawerSlideAnim }] }]}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Menu</Text>
              <TouchableOpacity onPress={() => closeDrawerWithAnim()}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.drawerScroll} showsVerticalScrollIndicator={false}>
              <TouchableOpacity style={styles.drawerNavItem} onPress={() => closeDrawerWithAnim(() => { setActiveTab('Communities'); })}>
                <Ionicons name="compass-outline" size={22} color="#7C3AED" />
                <Text style={styles.drawerNavLabel}>Discover Communities</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.drawerNavItem} onPress={() => closeDrawerWithAnim(() => { if (onGoToCommunityManager) onGoToCommunityManager(); })}>
                <Ionicons name="add-circle-outline" size={22} color="#7C3AED" />
                <Text style={styles.drawerNavLabel}>Start a Community</Text>
              </TouchableOpacity>

              <View style={styles.drawerDivider} />

              <View style={styles.drawerSectionHeader}>
                <Text style={styles.drawerSectionTitle}>Recently Visited Communities</Text>
                <TouchableOpacity onPress={() => closeDrawerWithAnim(() => setShowSeeAllRecent(true))}>
                  <Text style={styles.seeAllText}>See All →</Text>
                </TouchableOpacity>
              </View>

              {recentCommunities.slice(0, 3).map(comm => (
                <TouchableOpacity key={comm.id} style={styles.communityRow} onPress={() => closeDrawerWithAnim(() => alert(`Opening ${comm.name}`))}>
                  <View style={[styles.communityIconBadge, { backgroundColor: `${comm.color}15` }]}>
                    <Ionicons name={comm.icon} size={18} color={comm.color} />
                  </View>
                  <View style={styles.communityMeta}>
                    <Text style={styles.communityName}>{comm.name}</Text>
                    <Text style={styles.communityMembers}>{comm.members} members</Text>
                  </View>
                </TouchableOpacity>
              ))}

              <View style={styles.drawerDivider} />

              <Text style={styles.drawerSectionTitle}>Your Communities</Text>
              {joinedCommunities.map(comm => (
                <TouchableOpacity key={comm.id} style={styles.communityRow} onPress={() => closeDrawerWithAnim(() => alert(`Opening ${comm.name}`))}>
                  <View style={[styles.communityIconBadge, { backgroundColor: `${comm.color}15` }]}>
                    <Ionicons name={comm.icon} size={18} color={comm.color} />
                  </View>
                  <View style={styles.communityMeta}>
                    <Text style={styles.communityName}>{comm.name}</Text>
                    <Text style={styles.communityMembers}>{comm.members} members</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.drawerLogoutBtn} onPress={handleLogoutPress}>
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              <Text style={styles.drawerLogoutText}>Logout</Text>
            </TouchableOpacity>
            <View style={{ height: 100, backgroundColor: '#FFFFFF', position: 'absolute', bottom: -100, left: 0, right: 0 }} />
          </Animated.View>
        </View>
      </Modal>

      {/* LOGOUT CONFIRMATION MODAL */}
      <Modal visible={showLogoutConfirm} animationType="fade" transparent>
        <View style={styles.modalBg}>
          <View style={styles.logoutConfirmCard}>
            <View style={styles.logoutIconCircle}>
              <Ionicons name="log-out" size={28} color="#EF4444" />
            </View>
            <Text style={styles.logoutConfirmTitle}>Are you sure you want to logout?</Text>
            <Text style={styles.logoutConfirmSubtitle}>You will need to sign in again to access your communities and feeds.</Text>

            <View style={styles.logoutActionRow}>
              <TouchableOpacity style={styles.cancelLogoutBtn} onPress={() => setShowLogoutConfirm(false)}>
                <Text style={styles.cancelLogoutText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmLogoutBtn} onPress={confirmLogoutAction}>
                <Text style={styles.confirmLogoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* SEE ALL RECENT COMMUNITIES MODAL */}
      <Modal visible={showSeeAllRecent} animationType="slide" transparent>
        <View style={styles.bottomSheetOverlay}>
          <View style={styles.commentSheetContent}>
            <View style={styles.sheetHeader}>
              <TouchableOpacity onPress={() => setShowSeeAllRecent(false)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
              <Text style={styles.sheetTitle}>Recently Visited Communities</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10 }}>
              {recentCommunities.map(comm => (
                <TouchableOpacity key={comm.id} style={styles.communityRow} onPress={() => { setShowSeeAllRecent(false); alert(`Opening ${comm.name}`); }}>
                  <View style={[styles.communityIconBadge, { backgroundColor: `${comm.color}15` }]}>
                    <Ionicons name={comm.icon} size={18} color={comm.color} />
                  </View>
                  <View style={styles.communityMeta}>
                    <Text style={styles.communityName}>{comm.name}</Text>
                    <Text style={styles.communityMembers}>{comm.members} members</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={{ height: 100, backgroundColor: '#FFFFFF', position: 'absolute', bottom: -100, left: 0, right: 0 }} />
          </View>
        </View>
      </Modal>

      {/* START A COMMUNITY MODAL */}
      <Modal visible={showStartCommunity} animationType="fade" transparent>
        <View style={styles.modalBg}>
          <View style={styles.startCommunityContent}>
            <Text style={styles.modalHeading}>Start a Community</Text>
            <TextInput
              style={styles.communityInput}
              placeholder="Community Name"
              placeholderTextColor="#9CA3AF"
              value={communityName}
              onChangeText={setCommunityName}
            />
            <TextInput
              style={[styles.communityInput, { height: 80, textAlignVertical: 'top' }]}
              placeholder="Description (Optional)"
              placeholderTextColor="#9CA3AF"
              multiline
              value={communityDesc}
              onChangeText={setCommunityDesc}
            />
            <View style={styles.communityActionRow}>
              <TouchableOpacity style={styles.cancelCommunityBtn} onPress={() => setShowStartCommunity(false)}>
                <Text style={styles.cancelCommunityText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.createCommunityBtn} 
                onPress={() => {
                  if (!communityName.trim()) { alert("Please enter a community name."); return; }
                  alert(`Community "${communityName}" created!`);
                  setCommunityName('');
                  setCommunityDesc('');
                  setShowStartCommunity(false);
                }}
              >
                <Text style={styles.createCommunityText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* SLIDE-UP SEARCH SHEET MODAL */}
      <Modal visible={showSearchWindow} animationType="slide" transparent statusBarTranslucent={true}>
        <View style={styles.searchPaneBg}>
          <TouchableOpacity style={{ flex: 0.2 }} onPress={() => setShowSearchWindow(false)} />
          
          <View style={styles.searchPaneContent}>
            {/* Search Header Bar */}
            <View style={styles.searchPaneHeader}>
              <View style={styles.searchBarInputContainer}>
                <Ionicons name="search" size={20} color="#7C3AED" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.searchWindowInput}
                  placeholder="Search communities, topics, or messages..."
                  placeholderTextColor="#9CA3AF"
                  value={searchQuery}
                  onChangeText={(txt) => {
                    setSearchQuery(txt);
                    if (txt.trim().length > 0 && !searchHistory.includes(txt.trim())) {
                      // Optionally add to history when search is complete
                    }
                  }}
                  onSubmitEditing={() => {
                    if (searchQuery.trim().length > 0 && !searchHistory.includes(searchQuery.trim())) {
                      setSearchHistory(prev => [searchQuery.trim(), ...prev].slice(0, 8));
                    }
                  }}
                  autoFocus
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity onPress={() => setShowSearchWindow(false)} style={styles.cancelSearchBtn}>
                <Text style={styles.cancelSearchText}>Close</Text>
              </TouchableOpacity>
            </View>

            {/* Content Area */}
            <ScrollView style={styles.searchPaneScroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
              {searchQuery.trim().length === 0 ? (
                /* DEFAULT VIEW: HISTORY & TRENDING TOPICS */
                <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
                  {/* Action Header Row */}
                  <View style={styles.searchActionHeaderRow}>
                    <Text style={styles.searchSectionTitleText}>Recent Searches</Text>
                    <View style={styles.searchActionButtonsRow}>
                      <TouchableOpacity onPress={exportSearchResults} style={styles.searchActionMiniBtn}>
                        <Ionicons name="share-outline" size={16} color="#7C3AED" />
                        <Text style={styles.searchActionMiniBtnText}>Export</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={clearSearchHistory} style={[styles.searchActionMiniBtn, { marginLeft: 10 }]}>
                        <Ionicons name="trash-outline" size={16} color="#EF4444" />
                        <Text style={[styles.searchActionMiniBtnText, { color: '#EF4444' }]}>Clear</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* History List */}
                  {searchHistory.length > 0 ? (
                    searchHistory.map((historyItem, idx) => (
                      <TouchableOpacity 
                        key={idx} 
                        style={styles.historyItemRow} 
                        onPress={() => setSearchQuery(historyItem)}
                      >
                        <Ionicons name="time-outline" size={18} color="#9CA3AF" style={{ marginRight: 10 }} />
                        <Text style={styles.historyItemText}>{historyItem}</Text>
                        <Ionicons name="arrow-up-sharp" size={14} color="#CBD5E1" style={{ marginLeft: 'auto', transform: [{ rotate: '-45deg' }] }} />
                      </TouchableOpacity>
                    ))
                  ) : (
                    <Text style={styles.emptyHistoryText}>No recent searches.</Text>
                  )}

                  {/* Expandable Trending Today Section */}
                  <Text style={[styles.searchSectionTitleText, { marginTop: 24, marginBottom: 12 }]}>🔥 Trending Fields</Text>
                  <View style={styles.trendingFieldsGrid}>
                    {(isTrendingExpanded ? trendingListAll : trendingListAll.slice(0, 5)).map((topic, index) => (
                      <TouchableOpacity 
                        key={index} 
                        style={styles.trendingFieldChip}
                        onPress={() => setSearchQuery(topic)}
                      >
                        <Text style={styles.trendingFieldChipRank}>#{String(index + 1).padStart(2, '0')}</Text>
                        <Text style={styles.trendingFieldChipText}>{topic}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Expand/Collapse Toggle */}
                  <TouchableOpacity 
                    style={styles.trendingExpandBtn}
                    onPress={() => setIsTrendingExpanded(!isTrendingExpanded)}
                  >
                    <Text style={styles.trendingExpandBtnText}>
                      {isTrendingExpanded ? 'See Less ↑' : 'Expand More ↓'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                /* QUERY ACTIVE VIEW: UNIFIED COMMUNITIES & POST RESULTS */
                <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
                  {/* Communities list (showing up to 9) */}
                  {(() => {
                    const matchedComm = [...recentCommunities, ...joinedCommunities].filter((c, idx, self) =>
                      self.findIndex(t => t.id === c.id) === idx &&
                      c.name.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                    const listToShow = showAllCommunities ? matchedComm : matchedComm.slice(0, 9);

                    return (
                      <View style={{ marginBottom: 20 }}>
                        <View style={styles.searchSectionHeaderRow}>
                          <Text style={styles.searchResultSectionTitle}>Communities ({matchedComm.length})</Text>
                          {matchedComm.length > 9 && !showAllCommunities && (
                            <TouchableOpacity onPress={() => setShowAllCommunities(true)}>
                              <Text style={styles.seeMoreBtnText}>See More →</Text>
                            </TouchableOpacity>
                          )}
                        </View>

                        {listToShow.length > 0 ? (
                          listToShow.map(comm => (
                            <TouchableOpacity 
                              key={comm.id} 
                              style={styles.searchResultRow} 
                              onPress={() => {
                                setShowSearchWindow(false);
                                if (!searchHistory.includes(searchQuery.trim())) {
                                  setSearchHistory(prev => [searchQuery.trim(), ...prev].slice(0, 8));
                                }
                                alert(`Navigating to ${comm.name}`);
                              }}
                            >
                              <View style={[styles.communityIconBadge, { backgroundColor: `${comm.color}15` }]}>
                                <Ionicons name={comm.icon} size={18} color={comm.color} />
                              </View>
                              <View style={styles.communityMeta}>
                                <Text style={styles.communityName}>{comm.name}</Text>
                                <Text style={styles.communityMembers}>{comm.members} members</Text>
                              </View>
                              <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                            </TouchableOpacity>
                          ))
                        ) : (
                          <Text style={styles.emptySearchText}>No matching communities found.</Text>
                        )}
                      </View>
                    );
                  })()}

                  <View style={styles.searchSectionDivider} />

                  {/* Posts & Messages */}
                  {(() => {
                    const matchedPosts = posts.filter(p => p.text.toLowerCase().includes(searchQuery.toLowerCase()));
                    const listToShow = showAllMessages ? matchedPosts : matchedPosts.slice(0, 5);

                    return (
                      <View style={{ marginTop: 10 }}>
                        <View style={styles.searchSectionHeaderRow}>
                          <Text style={styles.searchResultSectionTitle}>Posts & Messages ({matchedPosts.length})</Text>
                          {matchedPosts.length > 5 && !showAllMessages && (
                            <TouchableOpacity onPress={() => setShowAllMessages(true)}>
                              <Text style={styles.seeMoreBtnText}>See More →</Text>
                            </TouchableOpacity>
                          )}
                        </View>

                        {listToShow.length > 0 ? (
                          listToShow.map(post => (
                            <TouchableOpacity 
                              key={post.id} 
                              style={styles.searchPostResultCard} 
                              onPress={() => {
                                setShowSearchWindow(false);
                                if (!searchHistory.includes(searchQuery.trim())) {
                                  setSearchHistory(prev => [searchQuery.trim(), ...prev].slice(0, 8));
                                }
                                setSelectedPost(post);
                              }}
                            >
                              <View style={styles.searchPostAuthorRow}>
                                <Image source={{ uri: post.authorAvatar }} style={styles.searchPostAvatar} />
                                <Text style={styles.searchPostAuthorName}>{post.authorName}</Text>
                                <Text style={styles.searchPostTime}>• {post.time}</Text>
                              </View>
                              <Text style={styles.searchPostText} numberOfLines={2}>{post.text}</Text>
                            </TouchableOpacity>
                          ))
                        ) : (
                          <Text style={styles.emptySearchText}>No matching posts found.</Text>
                        )}
                      </View>
                    );
                  })()}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* REDESIGNED LEFT SLIDING SIDE DRAWER */}
      <Modal
        visible={showLeftProfilePanel}
        transparent
        animationType="none"
        onRequestClose={closeLeftPanel}
        statusBarTranslucent={true}
      >
        <View style={styles.leftPanelContainer}>
          {/* Fading Backdrop Overlay */}
          <Animated.View style={[styles.leftPanelBackdrop, { opacity: leftPanelFadeAnim }]}>
            <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={closeLeftPanel} />
          </Animated.View>

          {/* Sliding Content Panel (80% width) */}
          <Animated.View 
            style={[
              styles.leftPanelContent, 
              { transform: [{ translateX: leftPanelSlideAnim }] }
            ]}
          >
            <ImageBackground 
              source={require('../../assets/image.png')} 
              style={{ width: '100%', paddingTop: Platform.OS === 'android' ? 48 : 44 }}
              resizeMode="cover"
            >
              <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', paddingBottom: 16 }}>
                {/* Header */}
                <View style={[styles.leftPanelHeader, { borderBottomWidth: 0, backgroundColor: 'transparent' }]}>
                  <Text style={styles.leftPanelHeaderTitleWhite}>My Account</Text>
                  <TouchableOpacity onPress={closeLeftPanel} style={styles.leftPanelCloseBtnCircle}>
                    <Ionicons name="close" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                {/* Banner Area (Read Only) */}
                <View style={styles.panelBannerContainer}>
                  {bannerImage ? (
                    <Image source={{ uri: bannerImage }} style={styles.panelBannerImg} />
                  ) : (
                    <LinearGradient colors={['#7C3AED', '#F97316']} style={styles.panelBannerPlaceholder} />
                  )}
                </View>

                {/* Avatar & Info (Read Only) */}
                <View style={[styles.panelAvatarWrapper, { marginTop: -40, zIndex: 10 }]}>
                  <View style={styles.panelAvatarContainer}>
                    {profileImage ? (
                      <Image source={{ uri: profileImage }} style={styles.panelAvatarImg} />
                    ) : (
                      <LinearGradient colors={['#7C3AED', '#F97316']} style={styles.panelAvatarPlaceholder}>
                        <Text style={styles.panelAvatarLetter}>
                          {userName.trim().charAt(0).toUpperCase() || 'D'}
                        </Text>
                      </LinearGradient>
                    )}
                  </View>
                  <Text style={[styles.sidebarDisplayName, { color: '#FFFFFF', textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3 }]}>{userName}</Text>
                  <Text style={[styles.sidebarHandleText, { color: '#E5E7EB', textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3 }]}>@{userHandle}</Text>
                </View>
              </View>
            </ImageBackground>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              {/* Sidebar Menu Options */}
              <View style={styles.sidebarMenuSection}>
                {[
                  { label: 'Create Community / Mod Tools', icon: 'shield-checkmark-outline', action: () => { closeLeftPanel(); if (onGoToCommunityManager) onGoToCommunityManager(); } },
                  {label: 'Profile page', icon: 'person-circle-outline', action: () => { closeLeftPanel(); setShowProfilePageModal(true); }},
                  { label: 'Settings', icon: 'settings-outline', action: () => { closeLeftPanel(); setShowSettingsModal(true); } },
                  { label: 'Drafts', icon: 'document-text-outline', action: () => Alert.alert('Drafts', 'No saved drafts found.') },
                  { label: 'Saved', icon: 'bookmark-outline', action: () => Alert.alert('Saved', 'View your bookmark folder list.') },
                  { label: 'My Status', icon: 'pulse-outline', action: () => Alert.alert('Status', 'Configure your profile active status indicator.') },
                  { label: 'Style Avatar', icon: 'shirt-outline', action: () => Alert.alert('Style Avatar', 'MD3 avatar customization dashboard.') },
                  { label: 'Custom Feed', icon: 'list-outline', action: () => Alert.alert('Custom Feed', 'Curate your custom feeds list.') },
                ].map((item, idx) => (
                  <TouchableOpacity 
                    key={idx}
                    style={styles.sidebarMenuItem} 
                    onPress={item.action}
                  >
                    <Ionicons name={item.icon} size={22} color="#7C3AED" style={{ marginRight: 16 }} />
                    <Text style={styles.sidebarMenuLabel}>{item.label}</Text>
                    <Ionicons name="chevron-forward" size={16} color="#9CA3AF" style={{ marginLeft: 'auto' }} />
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>

      {/* FULL-SCREEN PROFILE PAGE MODAL */}
      <Modal
        visible={showProfilePageModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowProfilePageModal(false)}
        statusBarTranslucent={true}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          {/* Header */}
          <View style={[styles.editProfileHeader, { borderBottomWidth: 1, borderColor: '#F3F4F6' }]}>
            <TouchableOpacity onPress={() => setShowProfilePageModal(false)} style={styles.editHeaderCloseBtn}>
              <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.editHeaderTitle}>My Profile</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Banner Area */}
            <View style={[styles.panelBannerContainer, { height: 160 }]}>
              {bannerImage ? (
                <Image source={{ uri: bannerImage }} style={[styles.panelBannerImg, { height: 160 }]} />
              ) : (
                <LinearGradient colors={['#7C3AED', '#F97316']} style={[styles.panelBannerPlaceholder, { height: 160 }]} />
              )}
            </View>

            {/* Avatar & Info */}
            <View style={[styles.panelAvatarWrapper, { marginTop: -50, alignItems: 'center' }]}>
              <View style={[styles.panelAvatarContainer, { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: '#FFFFFF' }]}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={{ width: '100%', height: '100%', borderRadius: 50 }} />
                ) : (
                  <LinearGradient colors={['#7C3AED', '#F97316']} style={{ width: '100%', height: '100%', borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#FFFFFF', fontSize: 32, fontWeight: 'bold' }}>
                      {userName.trim().charAt(0).toUpperCase() || 'D'}
                    </Text>
                  </LinearGradient>
                )}
              </View>
              <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#1F2937', marginTop: 12 }}>{userName}</Text>
              <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 2 }}>@{userHandle}</Text>
            </View>

            {/* Profile Bio Details */}
            <View style={{ paddingHorizontal: 24, marginTop: 20 }}>
              <View style={{ backgroundColor: '#F9FAFB', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#F3F4F6' }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#9CA3AF', letterSpacing: 0.5, marginBottom: 8 }}>BIO</Text>
                <Text style={{ fontSize: 14, color: '#4B5563', lineHeight: 20 }}>
                  {editBio || "No bio added yet. Tell the world who you are!"}
                </Text>
              </View>
            </View>

            {/* Email Details Card */}
            <View style={{ paddingHorizontal: 24, marginTop: 14 }}>
              <View style={{ backgroundColor: '#F9FAFB', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#F3F4F6', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#9CA3AF', letterSpacing: 0.5, marginBottom: 4 }}>EMAIL ID</Text>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#1F2937' }}>{userEmailAddress}</Text>
                </View>
                <Ionicons name="mail-open" size={24} color="#7C3AED" />
              </View>
            </View>

            {/* Primary Action Buttons */}
            <View style={{ paddingHorizontal: 24, marginTop: 32, gap: 14 }}>
              <TouchableOpacity 
                style={{ backgroundColor: '#7C3AED', borderRadius: 14, paddingVertical: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }}
                onPress={() => {
                  setShowProfilePageModal(false);
                  setShowEditProfileModal(true);
                }}
              >
                <Ionicons name="create-outline" size={20} color="#FFFFFF" />
                <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '800' }}>Edit Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={{ backgroundColor: '#F3F4F6', borderRadius: 14, paddingVertical: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#E5E7EB' }}
                onPress={() => {
                  setShowProfilePageModal(false);
                  setShowChangePasswordModal(true);
                }}
              >
                <Ionicons name="key-outline" size={20} color="#374151" />
                <Text style={{ color: '#374151', fontSize: 14, fontWeight: '800' }}>Change Password</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* DEDICATED CHANGE PASSWORD MODAL */}
      <Modal
        visible={showChangePasswordModal}
        transparent
        animationType="fade"
        onRequestClose={() => { setShowChangePasswordModal(false); setShowProfilePageModal(true); }}
      >
        <View style={styles.bottomSheetOverlay}>
          <TouchableOpacity style={{ flex: 0.3 }} onPress={() => { setShowChangePasswordModal(false); setShowProfilePageModal(true); }} />
          <View style={[styles.darkModeSheetContent, { paddingBottom: 35 }]}>
            <View style={styles.sheetHeader}>
              <TouchableOpacity onPress={() => { setShowChangePasswordModal(false); setShowProfilePageModal(true); }}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
              <Text style={styles.sheetTitle}>Change Password</Text>
              <View style={{ width: 24 }} />
            </View>

            <View style={{ padding: 20, gap: 14 }}>
              <View style={{ gap: 6 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#4B5563' }}>Current Password</Text>
                <TextInput
                  style={{ borderColor: '#D1D5DB', borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 14, color: '#1F2937' }}
                  secureTextEntry
                  placeholder="Enter current password"
                  placeholderTextColor="#9CA3AF"
                  value={currentPasswordInput}
                  onChangeText={setCurrentPasswordInput}
                />
              </View>

              <View style={{ gap: 6 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#4B5563' }}>New Password</Text>
                <TextInput
                  style={{ borderColor: '#D1D5DB', borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 14, color: '#1F2937' }}
                  secureTextEntry
                  placeholder="Enter new password"
                  placeholderTextColor="#9CA3AF"
                  value={newPasswordInput}
                  onChangeText={setNewPasswordInput}
                />
              </View>

              <View style={{ gap: 6 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#4B5563' }}>Confirm New Password</Text>
                <TextInput
                  style={{ borderColor: '#D1D5DB', borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 14, color: '#1F2937' }}
                  secureTextEntry
                  placeholder="Confirm new password"
                  placeholderTextColor="#9CA3AF"
                  value={confirmNewPasswordInput}
                  onChangeText={setConfirmNewPasswordInput}
                />
              </View>

              <TouchableOpacity 
                style={{ backgroundColor: '#7C3AED', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 10 }}
                onPress={() => {
                  if (!currentPasswordInput || !newPasswordInput || !confirmNewPasswordInput) {
                    Alert.alert("Error", "Please fill in all password fields.");
                    return;
                  }
                  if (newPasswordInput !== confirmNewPasswordInput) {
                    Alert.alert("Error", "New passwords do not match.");
                    return;
                  }
                  if (newPasswordInput.length < 8) {
                    Alert.alert("Error", "New password must be at least 8 characters long.");
                    return;
                  }
                  
                  // Mock change success
                  Alert.alert("Success", "Password updated successfully!");
                  setCurrentPasswordInput('');
                  setNewPasswordInput('');
                  setConfirmNewPasswordInput('');
                  setShowChangePasswordModal(false);
                  setShowProfilePageModal(true);
                }}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 13 }}>Update Password</Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 100, backgroundColor: '#FFFFFF', position: 'absolute', bottom: -100, left: 0, right: 0 }} />
          </View>
        </View>
      </Modal>

      {/* GOOGLE CONNECT MODAL */}
      <Modal
        visible={showGoogleConnectModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGoogleConnectModal(false)}
      >
        <View style={styles.bottomSheetOverlay}>
          <TouchableOpacity style={{ flex: 0.4 }} onPress={() => setShowGoogleConnectModal(false)} />
          <View style={[styles.darkModeSheetContent, { paddingBottom: 35 }]}>
            <View style={styles.sheetHeader}>
              <TouchableOpacity onPress={() => setShowGoogleConnectModal(false)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
              <Text style={styles.sheetTitle}>Link Google Account</Text>
              <View style={{ width: 24 }} />
            </View>

            <View style={{ padding: 24, alignItems: 'center', gap: 16 }}>
              <Ionicons name="logo-google" size={48} color="#EA4335" />
              <Text style={{ fontSize: 13, color: '#4B5563', textAlign: 'center', lineHeight: 20 }}>
                Link your Desicircle account with Google for seamless access and profile integration.
              </Text>

              <TouchableOpacity 
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#FFFFFF',
                  borderColor: '#D1D5DB',
                  borderWidth: 1,
                  borderRadius: 12,
                  paddingVertical: 14,
                  paddingHorizontal: 20,
                  width: '100%',
                  gap: 10,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 2
                }}
                onPress={() => {
                  Alert.alert(
                    "Choose Google Account",
                    "Select an active Google account to connect:",
                    [
                      { text: "Cancel", style: "cancel" },
                      { 
                        text: `${userEmailAddress.endsWith('@example.com') ? 'devasanjay@gmail.com' : userEmailAddress}`, 
                        onPress: () => {
                          setGoogleConnected(true);
                          updateSettingOnBackend('googleConnected', true);
                          setShowGoogleConnectModal(false);
                          Alert.alert("Connected", "Successfully connected to Google account!");
                        }
                      },
                      { 
                        text: "creative.mind.circle@gmail.com", 
                        onPress: () => {
                          setGoogleConnected(true);
                          updateSettingOnBackend('googleConnected', true);
                          setShowGoogleConnectModal(false);
                          Alert.alert("Connected", "Successfully connected to Google account!");
                        }
                      }
                    ]
                  );
                }}
              >
                <Ionicons name="logo-google" size={20} color="#EA4335" />
                <Text style={{ color: '#374151', fontWeight: '800', fontSize: 14 }}>Connect with Google</Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 100, backgroundColor: '#FFFFFF', position: 'absolute', bottom: -100, left: 0, right: 0 }} />
          </View>
        </View>
      </Modal>

      {/* DEDICATED FULL-SCREEN EDIT PROFILE PAGE MODAL */}
      <Modal
        visible={showEditProfileModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowEditProfileModal(false)}
        statusBarTranslucent={true}
      >
        <KeyboardAvoidingView 
          style={styles.editProfileFullContainer} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Header Bar */}
          <View style={styles.editProfileHeader}>
            <TouchableOpacity onPress={() => setShowEditProfileModal(false)} style={styles.editHeaderCloseBtn}>
              <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.editHeaderTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={handleSaveProfile} style={styles.editHeaderSaveBtn}>
              <Text style={styles.editHeaderSaveText}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.editProfileScroll} 
            contentContainerStyle={styles.editProfileScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Banner Image Edit */}
            <TouchableOpacity style={styles.panelBannerContainer} onPress={pickBannerImage} activeOpacity={0.9}>
              {bannerImage ? (
                <Image source={{ uri: bannerImage }} style={styles.panelBannerImg} />
              ) : (
                <LinearGradient colors={['#7C3AED', '#F97316']} style={styles.panelBannerPlaceholder}>
                  <Ionicons name="image-outline" size={32} color="#FFFFFF" />
                  <Text style={styles.panelBannerText}>Add Banner Image</Text>
                </LinearGradient>
              )}
              <View style={styles.bannerEditIcon}>
                <Ionicons name="pencil" size={14} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            {/* Profile Avatar Edit (overlapping banner bottom-left) */}
            <View style={styles.panelAvatarWrapper}>
              <TouchableOpacity style={styles.panelAvatarContainer} onPress={pickProfileImage} activeOpacity={0.9}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.panelAvatarImg} />
                ) : (
                  <LinearGradient colors={['#7C3AED', '#F97316']} style={styles.panelAvatarPlaceholder}>
                    <Text style={styles.panelAvatarLetter}>
                      {editDisplayName.trim().charAt(0).toUpperCase() || 'D'}
                    </Text>
                  </LinearGradient>
                )}
                <View style={styles.panelAvatarCameraIcon}>
                  <Ionicons name="camera" size={12} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View style={styles.panelInputGroup}>
              <Text style={styles.panelLabel}>Display Name</Text>
              <TextInput
                style={styles.panelInput}
                placeholder="Enter Display Name"
                placeholderTextColor="#9CA3AF"
                value={editDisplayName}
                onChangeText={setEditDisplayName}
              />
            </View>

            <View style={styles.panelInputGroup}>
              <Text style={styles.panelLabel}>Username (Unique)</Text>
              <TextInput
                style={styles.panelInput}
                placeholder="username"
                placeholderTextColor="#9CA3AF"
                value={userHandle}
                onChangeText={setUserHandle}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.panelInputGroup}>
              <Text style={styles.panelLabel}>Bio</Text>
              <TextInput
                style={styles.panelTextArea}
                placeholder="Tell us about yourself..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                value={editBio}
                onChangeText={setEditBio}
              />
            </View>

            {/* Social Links List Section */}
            <View style={styles.socialLinksSection}>
              <Text style={styles.panelSectionTitle}>Social Links</Text>
              {socialLinksList.length > 0 ? (
                socialLinksList.map((item, idx) => (
                  <View key={idx} style={styles.socialLinkBadgeRow}>
                    <View style={styles.socialBadgeLeft}>
                      <Ionicons name="link-sharp" size={16} color="#7C3AED" style={{ marginRight: 8 }} />
                      <Text style={styles.socialBadgeLabel}>{item.platform}:</Text>
                      <Text style={styles.socialBadgeValue} numberOfLines={1}>{item.username}</Text>
                    </View>
                    <TouchableOpacity 
                      onPress={() => {
                        const filtered = socialLinksList.filter((_, i) => i !== idx);
                        setSocialLinksList(filtered);
                      }}
                      style={styles.socialBadgeDeleteBtn}
                    >
                      <Ionicons name="trash-outline" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={styles.emptySocialsText}>No social links added yet.</Text>
              )}

              {/* Add Social Links Button */}
              <TouchableOpacity 
                style={styles.addSocialBtnLink} 
                onPress={() => setShowAddSocialSheet(true)}
              >
                <Ionicons name="add" size={20} color="#7C3AED" />
                <Text style={styles.addSocialBtnText}>Add Social Media Links</Text>
              </TouchableOpacity>
            </View>

            {/* Visibility Toggles */}
            <View style={styles.panelToggleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleTitle}>18+ Content Filter</Text>
                <Text style={styles.toggleDesc}>Filter and manage sensitive content</Text>
              </View>
              <Switch
                value={is18Plus}
                onValueChange={setIs18Plus}
                trackColor={{ false: '#D1D5DB', true: '#C084FC' }}
                thumbColor={is18Plus ? '#7C3AED' : '#F3F4F6'}
              />
            </View>

            <View style={styles.panelToggleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleTitle}>Content Visibility</Text>
                <Text style={styles.toggleDesc}>Show your posts publicly on feeds</Text>
              </View>
              <Switch
                value={isContentVisible}
                onValueChange={setIsContentVisible}
                trackColor={{ false: '#D1D5DB', true: '#C084FC' }}
                thumbColor={isContentVisible ? '#7C3AED' : '#F3F4F6'}
              />
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      {/* SOCIAL MEDIA PLATFORMS BOTTOM SHEET */}
      <Modal
        visible={showAddSocialSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddSocialSheet(false)}
      >
        <View style={styles.bottomSheetOverlay}>
          <TouchableOpacity style={{ flex: 0.4 }} onPress={() => setShowAddSocialSheet(false)} />
          <View style={styles.socialPlatformSheetContent}>
            <View style={styles.sheetHeader}>
              <TouchableOpacity onPress={() => setShowAddSocialSheet(false)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
              <Text style={styles.sheetTitle}>Choose Social Platform</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView style={{ flex: 1, padding: 20 }}>
              {[
                { name: 'Instagram', icon: 'logo-instagram', color: '#E1306C', base: 'https://instagram.com/' },
                { name: 'LinkedIn', icon: 'logo-linkedin', color: '#0077B5', base: 'https://linkedin.com/in/' },
                { name: 'Twitter/X', icon: 'logo-twitter', color: '#1DA1F2', base: 'https://x.com/' },
                { name: 'Reddit', icon: 'logo-reddit', color: '#FF4500', base: 'https://reddit.com/u/' },
                { name: 'TikTok', icon: 'logo-tiktok', color: '#000000', base: 'https://tiktok.com/@' },
                { name: 'YouTube', icon: 'logo-youtube', color: '#FF0000', base: 'https://youtube.com/@' },
                { name: 'Buy Me a Coffee', icon: 'cafe-outline', color: '#FFDD00', base: 'https://buymeacoffee.com/' },
                { name: 'Cameo', icon: 'videocam-outline', color: '#FF007F', base: 'https://cameo.com/' },
                { name: 'Cash App', icon: 'cash-outline', color: '#00D632', base: 'https://cash.app/$' },
              ].map((platform) => (
                <TouchableOpacity 
                  key={platform.name} 
                  style={styles.platformRowItem}
                  onPress={() => {
                    setSelectedPlatformForInput(platform);
                    setSocialInputText('');
                    setShowAddSocialSheet(false);
                    setShowSocialInputDialog(true);
                  }}
                >
                  <View style={[styles.platformIconBox, { backgroundColor: `${platform.color}15` }]}>
                    <Ionicons name={platform.icon} size={20} color={platform.color} />
                  </View>
                  <Text style={styles.platformNameText}>{platform.name}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#9CA3AF" style={{ marginLeft: 'auto' }} />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={{ height: 100, backgroundColor: '#FFFFFF', position: 'absolute', bottom: -100, left: 0, right: 0 }} />
          </View>
        </View>
      </Modal>

      {/* SMALL SOCIAL USERNAME INPUT DIALOG */}
      <Modal
        visible={showSocialInputDialog}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSocialInputDialog(false)}
      >
        <View style={styles.dialogBgOverlay}>
          <View style={styles.socialInputDialogCard}>
            <Text style={styles.dialogTitle}>Add {selectedPlatformForInput?.name} Link</Text>
            <Text style={styles.dialogSubtitle}>Enter your username or profile identifier below:</Text>

            <View style={styles.dialogInputWrapper}>
              <TextInput
                style={styles.dialogInput}
                placeholder="Username / ID"
                placeholderTextColor="#9CA3AF"
                value={socialInputText}
                onChangeText={setSocialInputText}
                autoCapitalize="none"
                autoFocus
              />
            </View>

            {selectedPlatformForInput && socialInputText.trim().length > 0 && (
              <View style={styles.dialogLinkPreviewBox}>
                <Text style={styles.dialogPreviewLabel}>Generated Link Preview:</Text>
                <Text style={styles.dialogPreviewText} numberOfLines={1}>
                  {`${selectedPlatformForInput.base}${socialInputText.trim()}`}
                </Text>
              </View>
            )}

            <View style={styles.dialogActionRow}>
              <TouchableOpacity 
                style={styles.dialogCancelBtn} 
                onPress={() => setShowSocialInputDialog(false)}
              >
                <Text style={styles.dialogCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.dialogSaveBtn} 
                onPress={() => {
                  if (!socialInputText.trim()) {
                    Alert.alert("Required", "Please enter a username.");
                    return;
                  }
                  const newLink = {
                    platform: selectedPlatformForInput.name,
                    username: socialInputText.trim(),
                    link: `${selectedPlatformForInput.base}${socialInputText.trim()}`
                  };
                  setSocialLinksList(prev => [newLink, ...prev]);
                  setShowSocialInputDialog(false);
                }}
              >
                <Text style={styles.dialogSaveText}>Save Link</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* DEDICATED FULL-SCREEN SETTINGS MODAL */}
      <Modal
        visible={showSettingsModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => {
          if (settingsSubPage !== 'main') {
            setSettingsSubPage('main');
          } else {
            setShowSettingsModal(false);
          }
        }}
        statusBarTranslucent={true}
      >
        <View style={styles.settingsFullContainer}>
          {/* Header */}
          <View style={styles.settingsHeader}>
            <TouchableOpacity 
              onPress={() => {
                if (settingsSubPage !== 'main') {
                  setSettingsSubPage('main');
                } else {
                  setShowSettingsModal(false);
                }
              }} 
              style={styles.settingsHeaderCloseBtn}
            >
              <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.settingsHeaderTitle}>
              {settingsSubPage === 'main' ? 'Settings' :
               settingsSubPage === 'accountSettings' ? 'Account Settings' :
               settingsSubPage === 'language' ? 'Language & Translations' :
               settingsSubPage === 'viewOptions' ? 'View Options' :
               settingsSubPage === 'accessibility' ? 'Accessibility' :
               settingsSubPage === 'about' ? selectedAboutDoc :
               settingsSubPage === 'support' ? 'Support & Feedback' : 'Settings'}
            </Text>
            <View style={{ width: 32 }} />
          </View>

          <ScrollView style={styles.settingsScroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            {settingsSubPage === 'main' && (
              <View>
                {/* General Section */}
                <Text style={styles.settingsSectionTitle}>General</Text>
                <View style={styles.settingsCard}>
                  <TouchableOpacity 
                    style={styles.settingsRowItem}
                    onPress={() => {
                      setSettingsSubPage('accountSettings');
                    }}
                  >
                    <View style={styles.settingsRowLeft}>
                      <Ionicons name="person-outline" size={20} color="#7C3AED" style={{ marginRight: 12 }} />
                      <Text style={styles.settingsRowText}>Account Settings</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.settingsRowItem} onPress={() => setSettingsSubPage('language')}>
                    <View style={styles.settingsRowLeft}>
                      <Ionicons name="language-outline" size={20} color="#7C3AED" style={{ marginRight: 12 }} />
                      <View>
                        <Text style={styles.settingsRowText}>Language & Translations</Text>
                        <Text style={styles.settingsRowSubtext}>{appLanguage}</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.settingsRowItem} onPress={() => setSettingsSubPage('viewOptions')}>
                    <View style={styles.settingsRowLeft}>
                      <Ionicons name="eye-outline" size={20} color="#7C3AED" style={{ marginRight: 12 }} />
                      <View>
                        <Text style={styles.settingsRowText}>View Options</Text>
                        <Text style={styles.settingsRowSubtext}>{feedLayout} Layout • Autoplay: {autoplayMedia}</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                  </TouchableOpacity>

                  <View style={styles.settingsRowItemNoBtn}>
                    <View style={styles.settingsRowLeft}>
                      <Ionicons name="cellular-outline" size={20} color="#7C3AED" style={{ marginRight: 12 }} />
                      <View>
                        <Text style={styles.settingsRowText}>Data Saver</Text>
                        <Text style={styles.settingsRowSubtext}>Reduce image quality on mobile networks</Text>
                      </View>
                    </View>
                    <Switch
                      value={dataSaverEnabled}
                      onValueChange={setDataSaverEnabled}
                      trackColor={{ false: '#D1D5DB', true: '#C084FC' }}
                      thumbColor={dataSaverEnabled ? '#7C3AED' : '#F3F4F6'}
                    />
                  </View>

                  <TouchableOpacity style={styles.settingsRowItem} onPress={() => setSettingsSubPage('accessibility')}>
                    <View style={styles.settingsRowLeft}>
                      <Ionicons name="body-outline" size={20} color="#7C3AED" style={{ marginRight: 12 }} />
                      <View>
                        <Text style={styles.settingsRowText}>Accessibility</Text>
                        <Text style={styles.settingsRowSubtext}>Text Size: {textSize}</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.settingsRowItem, { borderBottomWidth: 0 }]} onPress={() => setShowDarkModeSheet(true)}>
                    <View style={styles.settingsRowLeft}>
                      <Ionicons name="moon-outline" size={20} color="#7C3AED" style={{ marginRight: 12 }} />
                      <View>
                        <Text style={styles.settingsRowText}>Dark Mode</Text>
                        <Text style={styles.settingsRowSubtext}>{darkModeSetting}</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>

                {/* Advanced Section */}
                <Text style={styles.settingsSectionTitle}>Advanced</Text>
                <View style={styles.settingsCard}>
                  <View style={styles.settingsRowItemNoBtn}>
                    <View style={styles.settingsRowLeft}>
                      <Ionicons name="link-outline" size={20} color="#7C3AED" style={{ marginRight: 12 }} />
                      <Text style={styles.settingsRowText}>Open External Links in Browser</Text>
                    </View>
                    <Switch
                      value={externalLinksEnabled}
                      onValueChange={setExternalLinksEnabled}
                      trackColor={{ false: '#D1D5DB', true: '#C084FC' }}
                      thumbColor={externalLinksEnabled ? '#7C3AED' : '#F3F4F6'}
                    />
                  </View>

                  <View style={styles.settingsRowItemNoBtn}>
                    <View style={styles.settingsRowLeft}>
                      <Ionicons name="download-outline" size={20} color="#7C3AED" style={{ marginRight: 12 }} />
                      <Text style={styles.settingsRowText}>Auto-save Images</Text>
                    </View>
                    <Switch
                      value={saveImagesEnabled}
                      onValueChange={setSaveImagesEnabled}
                      trackColor={{ false: '#D1D5DB', true: '#C084FC' }}
                      thumbColor={saveImagesEnabled ? '#7C3AED' : '#F3F4F6'}
                    />
                  </View>

                  <View style={styles.settingsRowItemNoBtn}>
                    <View style={styles.settingsRowLeft}>
                      <Ionicons name="chevron-down-circle-outline" size={20} color="#7C3AED" style={{ marginRight: 12 }} />
                      <Text style={styles.settingsRowText}>Comment Jump Button</Text>
                    </View>
                    <Switch
                      value={jumpButtonEnabled}
                      onValueChange={setJumpButtonEnabled}
                      trackColor={{ false: '#D1D5DB', true: '#C084FC' }}
                      thumbColor={jumpButtonEnabled ? '#7C3AED' : '#F3F4F6'}
                    />
                  </View>

                  <TouchableOpacity style={[styles.settingsRowItem, { borderBottomWidth: 0 }]} onPress={() => {
                    Alert.alert('Comment Sort', 'Choose default comment ranking', [
                      { text: 'Hot', onPress: () => setCommentSortSetting('Hot') },
                      { text: 'New', onPress: () => setCommentSortSetting('New') },
                      { text: 'Top', onPress: () => setCommentSortSetting('Top') },
                    ]);
                  }}>
                    <View style={styles.settingsRowLeft}>
                      <Ionicons name="funnel-outline" size={20} color="#7C3AED" style={{ marginRight: 12 }} />
                      <View>
                        <Text style={styles.settingsRowText}>Default Comment Sort</Text>
                        <Text style={styles.settingsRowSubtext}>{commentSortSetting}</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>

                {/* About Section */}
                <Text style={styles.settingsSectionTitle}>About</Text>
                <View style={styles.settingsCard}>
                  {['Community Rules', 'Privacy Policy', 'User Agreement', 'Acknowledgements', 'Open Source Licenses'].map((item, idx, arr) => (
                    <TouchableOpacity 
                      key={idx} 
                      style={[styles.settingsRowItem, idx === arr.length - 1 ? { borderBottomWidth: 0 } : {}]}
                      onPress={() => {
                        setSelectedAboutDoc(item);
                        setAboutDocContent(ABOUT_DOCS[item] || 'Document Content Empty.');
                        setSettingsSubPage('about');
                      }}
                    >
                      <View style={styles.settingsRowLeft}>
                        <Ionicons name="information-circle-outline" size={20} color="#7C3AED" style={{ marginRight: 12 }} />
                        <Text style={styles.settingsRowText}>{item}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Support Section */}
                <Text style={styles.settingsSectionTitle}>Support</Text>
                <View style={styles.settingsCard}>
                  {['Help Center', 'Contact Support', 'Report a Bug', 'Report an Issue', 'Send Feedback'].map((item, idx, arr) => (
                    <TouchableOpacity 
                      key={idx} 
                      style={[styles.settingsRowItem, idx === arr.length - 1 ? { borderBottomWidth: 0 } : {}]}
                      onPress={() => {
                        setSupportCategory(item);
                        setSettingsSubPage('support');
                      }}
                    >
                      <View style={styles.settingsRowLeft}>
                        <Ionicons name="help-buoy-outline" size={20} color="#7C3AED" style={{ marginRight: 12 }} />
                        <Text style={styles.settingsRowText}>{item}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Build Info Section (Read Only) */}
                <Text style={styles.settingsSectionTitle}>Build Information</Text>
                <View style={styles.settingsCard}>
                  {[
                    { label: 'Version', value: '1.0.0' },
                    { label: 'Build Number', value: '104' },
                    { label: 'Environment', value: 'Development' },
                    { label: 'API Version', value: 'v1.2.0' },
                    { label: 'Build Date', value: '2026-07-19' },
                  ].map((info, idx, arr) => (
                    <View key={idx} style={[styles.settingsRowInfo, idx === arr.length - 1 ? { borderBottomWidth: 0 } : {}]}>
                      <Text style={styles.infoLabelText}>{info.label}</Text>
                      <Text style={styles.infoValueText}>{info.value}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Language Sub-page */}
            {settingsSubPage === 'language' && (
              <View style={{ paddingTop: 12 }}>
                <View style={styles.settingsCard}>
                  {['English', 'Hindi (हिन्दी)', 'Tamil (தமிழ்)', 'Telugu (తెలుగు)', 'Spanish (Español)', 'French (Français)'].map((lang) => {
                    const shortName = lang.split(' ')[0];
                    return (
                      <TouchableOpacity 
                        key={lang} 
                        style={styles.settingsRowItem}
                        onPress={() => { setAppLanguage(shortName); setSettingsSubPage('main'); }}
                      >
                        <Text style={styles.settingsRowText}>{lang}</Text>
                        {appLanguage === shortName && <Ionicons name="checkmark" size={20} color="#7C3AED" />}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* View Options Sub-page */}
            {settingsSubPage === 'viewOptions' && (
              <View style={{ paddingTop: 12 }}>
                <Text style={styles.settingsSectionTitle}>Feed Layout Style</Text>
                <View style={styles.settingsCard}>
                  {['Classic', 'Card', 'Compact'].map((layout) => (
                    <TouchableOpacity 
                      key={layout} 
                      style={styles.settingsRowItem}
                      onPress={() => setFeedLayout(layout)}
                    >
                      <Text style={styles.settingsRowText}>{layout} Layout</Text>
                      {feedLayout === layout && <Ionicons name="checkmark" size={20} color="#7C3AED" />}
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.settingsSectionTitle}>Media Autoplay</Text>
                <View style={[styles.settingsCard, { marginTop: 8 }]}>
                  {['Always', 'Wi-Fi Only', 'Never'].map((mode) => (
                    <TouchableOpacity 
                      key={mode} 
                      style={styles.settingsRowItem}
                      onPress={() => setAutoplayMedia(mode)}
                    >
                      <Text style={styles.settingsRowText}>{mode}</Text>
                      {autoplayMedia === mode && <Ionicons name="checkmark" size={20} color="#7C3AED" />}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Accessibility Sub-page */}
            {settingsSubPage === 'accessibility' && (
              <View style={{ paddingTop: 12 }}>
                <Text style={styles.settingsSectionTitle}>Text Size</Text>
                <View style={styles.settingsCard}>
                  {['Small', 'Normal', 'Large', 'Extra Large'].map((sz) => (
                    <TouchableOpacity 
                      key={sz} 
                      style={styles.settingsRowItem}
                      onPress={() => setTextSize(sz)}
                    >
                      <Text style={[styles.settingsRowText, { fontSize: sz === 'Small' ? 11 : sz === 'Normal' ? 13 : sz === 'Large' ? 16 : 18 }]}>{sz}</Text>
                      {textSize === sz && <Ionicons name="checkmark" size={20} color="#7C3AED" />}
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.settingsSectionTitle}>Assistive Tools</Text>
                <View style={[styles.settingsCard, { marginTop: 8 }]}>
                  <View style={styles.settingsRowItemNoBtn}>
                    <View style={styles.settingsRowLeft}>
                      <Text style={styles.settingsRowText}>Screen Reader Voice Assist</Text>
                    </View>
                    <Switch
                      value={voiceAssistEnabled}
                      onValueChange={setVoiceAssistEnabled}
                      trackColor={{ false: '#D1D5DB', true: '#C084FC' }}
                      thumbColor={voiceAssistEnabled ? '#7C3AED' : '#F3F4F6'}
                    />
                  </View>
                </View>
              </View>
            )}

            {/* About Document Viewer Sub-page */}
            {settingsSubPage === 'about' && (
              <View style={{ paddingTop: 12 }}>
                <View style={[styles.settingsCard, { padding: 20 }]}>
                  <Text style={{ fontSize: 13, lineHeight: 20, color: '#374151' }}>
                    {aboutDocContent}
                  </Text>
                </View>
              </View>
            )}

            {/* Support Ticket Submission Sub-page */}
            {settingsSubPage === 'support' && (
              <View style={{ paddingTop: 12 }}>
                <Text style={styles.settingsSectionTitle}>Selected Category</Text>
                <View style={styles.settingsCard}>
                  {['Help Center', 'Contact Support', 'Report a Bug', 'Report an Issue', 'Send Feedback'].map((cat) => (
                    <TouchableOpacity 
                      key={cat} 
                      style={styles.settingsRowItem}
                      onPress={() => setSupportCategory(cat)}
                    >
                      <Text style={styles.settingsRowText}>{cat}</Text>
                      {supportCategory === cat && <Ionicons name="checkmark" size={20} color="#7C3AED" />}
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.settingsSectionTitle}>Ticket Details</Text>
                <View style={[styles.settingsCard, { padding: 12, minHeight: 120, justifyContent: 'flex-start' }]}>
                  <TextInput
                    style={{ minHeight: 100, textAlignVertical: 'top', fontSize: 13, color: '#1F2937', padding: 0 }}
                    placeholder="Describe your issue or provide feedback here..."
                    placeholderTextColor="#9CA3AF"
                    multiline
                    value={supportMessage}
                    onChangeText={setSupportMessage}
                  />
                </View>

                <TouchableOpacity 
                  style={{
                    backgroundColor: '#7C3AED',
                    borderRadius: 12,
                    paddingVertical: 14,
                    alignItems: 'center',
                    marginTop: 20,
                  }}
                  onPress={() => {
                    if (!supportMessage.trim()) {
                      Alert.alert('Required', 'Please write a message before submitting.');
                      return;
                    }
                    Alert.alert(
                      'Ticket Submitted',
                      `Your ticket has been uploaded to the support queue successfully! Category: ${supportCategory}.`,
                      [{ text: 'OK', onPress: () => { setSupportMessage(''); setSettingsSubPage('main'); } }]
                    );
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 13 }}>Submit Ticket</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Account Settings Sub-page */}
            {settingsSubPage === 'accountSettings' && (
              <View style={{ paddingTop: 12 }}>
                {/* 1. Base Setting Category */}
                <Text style={styles.settingsSectionTitle}>Base Settings</Text>
                <View style={styles.settingsCard}>
                  {/* Switch Accounts Row */}
                  <TouchableOpacity 
                    style={styles.settingsRowItem}
                    onPress={() => setShowSwitchAccountsModal(true)}
                  >
                    <View style={styles.settingsRowLeft}>
                      <Ionicons name="people-outline" size={20} color="#7C3AED" style={{ marginRight: 12 }} />
                      <View>
                        <Text style={styles.settingsRowText}>Switch Accounts</Text>
                        <Text style={styles.settingsRowSubtext}>Logged in as @{userHandle}</Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      {profileImage ? (
                        <Image source={{ uri: profileImage }} style={{ width: 24, height: 24, borderRadius: 12 }} />
                      ) : (
                        <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#7C3AED', justifyContent: 'center', alignItems: 'center' }}>
                          <Text style={{ color: '#FFF', fontSize: 10, fontWeight: 'bold' }}>
                            {userName.charAt(0).toUpperCase()}
                          </Text>
                        </View>
                      )}
                      <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
                    </View>
                  </TouchableOpacity>

                  {/* Update Email ID */}
                  <TouchableOpacity 
                    style={styles.settingsRowItem}
                    onPress={() => {
                      setEmailStep(1);
                      setEmailOtpInput('');
                      setNewEmailInput('');
                      setShowEmailModal(true);
                    }}
                  >
                    <View style={styles.settingsRowLeft}>
                      <Ionicons name="mail-outline" size={20} color="#7C3AED" style={{ marginRight: 12 }} />
                      <View>
                        <Text style={styles.settingsRowText}>Update Email ID</Text>
                        <Text style={styles.settingsRowSubtext}>{userEmailAddress}</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                  </TouchableOpacity>

                  {/* App Lock Settings Group */}
                  <View style={styles.settingsRowItemNoBtn}>
                    <View style={styles.settingsRowLeft}>
                      <Ionicons name="lock-closed-outline" size={20} color="#7C3AED" style={{ marginRight: 12 }} />
                      <View>
                        <Text style={styles.settingsRowText}>Enable App Lock</Text>
                        <Text style={styles.settingsRowSubtext}>{appLockEnabled ? 'Lock enabled' : 'Require passcode to enter'}</Text>
                      </View>
                    </View>
                    <Switch
                      value={appLockEnabled}
                      onValueChange={(val) => {
                        if (val) {
                          setPasscodeInput('');
                          setShowPasscodeSetup(true);
                        } else {
                          setAppLockEnabled(false);
                          setAppLockPassword('');
                          updateSettingOnBackend('appLockEnabled', false);
                          updateSettingOnBackend('appLockPassword', '');
                        }
                      }}
                      trackColor={{ false: '#D1D5DB', true: '#C084FC' }}
                      thumbColor={appLockEnabled ? '#7C3AED' : '#F3F4F6'}
                    />
                  </View>

                  {appLockEnabled && (
                    <>
                      <TouchableOpacity 
                        style={styles.settingsRowItem}
                        onPress={() => {
                          Alert.alert('Lock Timeout', 'Choose inactivity duration before locking', [
                            { text: 'Immediately', onPress: () => { setAppLockDuration('Immediately'); updateSettingOnBackend('appLockDuration', 'Immediately'); } },
                            { text: '1 hour', onPress: () => { setAppLockDuration('1 hr'); updateSettingOnBackend('appLockDuration', '1 hr'); } },
                            { text: '24 hours', onPress: () => { setAppLockDuration('24 hrs'); updateSettingOnBackend('appLockDuration', '24 hrs'); } },
                            { text: '72 hours', onPress: () => { setAppLockDuration('72 hrs'); updateSettingOnBackend('appLockDuration', '72 hrs'); } },
                          ]);
                        }}
                      >
                        <View style={[styles.settingsRowLeft, { paddingLeft: 24 }]}>
                          <Text style={styles.settingsRowText}>Lock after inactivity</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={[styles.settingsRowSubtext, { marginRight: 6 }]}>{appLockDuration}</Text>
                          <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
                        </View>
                      </TouchableOpacity>

                      <View style={styles.settingsRowItemNoBtn}>
                        <View style={[styles.settingsRowLeft, { paddingLeft: 24 }]}>
                          <Text style={styles.settingsRowText}>Use Biometrics</Text>
                        </View>
                        <Switch
                          value={appLockBiometrics}
                          onValueChange={(val) => {
                            setAppLockBiometrics(val);
                            updateSettingOnBackend('appLockBiometrics', val);
                          }}
                          trackColor={{ false: '#D1D5DB', true: '#C084FC' }}
                          thumbColor={appLockBiometrics ? '#7C3AED' : '#F3F4F6'}
                        />
                      </View>
                    </>
                  )}

                  {/* Location Customization */}
                  <View style={styles.settingsRowItemNoBtn}>
                    <View style={styles.settingsRowLeft}>
                      <Ionicons name="location-outline" size={20} color="#7C3AED" style={{ marginRight: 12 }} />
                      <View>
                        <Text style={styles.settingsRowText}>IP Location Customization</Text>
                        <Text style={styles.settingsRowSubtext} numberOfLines={1}>Personalize feed location automatically via IP</Text>
                      </View>
                    </View>
                    <Switch
                      value={personalizeLocation}
                      onValueChange={(val) => {
                        setPersonalizeLocation(val);
                        updateSettingOnBackend('personalizeLocation', val);
                      }}
                      trackColor={{ false: '#D1D5DB', true: '#C084FC' }}
                      thumbColor={personalizeLocation ? '#7C3AED' : '#F3F4F6'}
                    />
                  </View>

                  {/* Google Connection */}
                  <TouchableOpacity 
                    style={[styles.settingsRowItem, { borderBottomWidth: 0 }]}
                    onPress={() => setShowGoogleConnectModal(true)}
                  >
                    <View style={styles.settingsRowLeft}>
                      <Ionicons name="logo-google" size={20} color="#7C3AED" style={{ marginRight: 12 }} />
                      <View>
                        <Text style={styles.settingsRowText}>Connect to Google</Text>
                        <Text style={styles.settingsRowSubtext}>{googleConnected ? 'Connected as Google account' : 'Link Google account'}</Text>
                      </View>
                    </View>
                    <Switch
                      value={googleConnected}
                      onValueChange={(val) => {
                        if (val) {
                          setShowGoogleConnectModal(true);
                        } else {
                          setGoogleConnected(false);
                          updateSettingOnBackend('googleConnected', false);
                        }
                      }}
                      trackColor={{ false: '#D1D5DB', true: '#C084FC' }}
                      thumbColor={googleConnected ? '#7C3AED' : '#F3F4F6'}
                    />
                  </TouchableOpacity>
                </View>

                {/* 2. Contact Setting Category */}
                <Text style={styles.settingsSectionTitle}>Contact Setting</Text>
                <View style={styles.settingsCard}>
                  <View style={styles.settingsRowItemNoBtn}>
                    <View style={styles.settingsRowLeft}>
                      <Text style={styles.settingsRowText}>Push Notifications</Text>
                    </View>
                    <Switch 
                      value={notifPush} 
                      onValueChange={(val) => {
                        setNotifPush(val);
                        updateSettingOnBackend('notifPush', val);
                      }} 
                      trackColor={{ false: '#D1D5DB', true: '#C084FC' }} 
                      thumbColor={notifPush ? '#7C3AED' : '#F3F4F6'} 
                    />
                  </View>
                  <View style={styles.settingsRowItemNoBtn}>
                    <View style={styles.settingsRowLeft}>
                      <Text style={styles.settingsRowText}>Email Alerts</Text>
                    </View>
                    <Switch 
                      value={notifEmail} 
                      onValueChange={(val) => {
                        setNotifEmail(val);
                        updateSettingOnBackend('notifEmail', val);
                      }} 
                      trackColor={{ false: '#D1D5DB', true: '#C084FC' }} 
                      thumbColor={notifEmail ? '#7C3AED' : '#F3F4F6'} 
                    />
                  </View>
                  <View style={styles.settingsRowItemNoBtn}>
                    <View style={styles.settingsRowLeft}>
                      <Text style={styles.settingsRowText}>Direct Messages</Text>
                    </View>
                    <Switch 
                      value={notifDMs} 
                      onValueChange={(val) => {
                        setNotifDMs(val);
                        updateSettingOnBackend('notifDMs', val);
                      }} 
                      trackColor={{ false: '#D1D5DB', true: '#C084FC' }} 
                      thumbColor={notifDMs ? '#7C3AED' : '#F3F4F6'} 
                    />
                  </View>
                  <View style={[styles.settingsRowItemNoBtn, { borderBottomWidth: 0 }]}>
                    <View style={styles.settingsRowLeft}>
                      <Text style={styles.settingsRowText}>Comment Updates</Text>
                    </View>
                    <Switch 
                      value={notifComments} 
                      onValueChange={(val) => {
                        setNotifComments(val);
                        updateSettingOnBackend('notifComments', val);
                      }} 
                      trackColor={{ false: '#D1D5DB', true: '#C084FC' }} 
                      thumbColor={notifComments ? '#7C3AED' : '#F3F4F6'} 
                    />
                  </View>
                </View>

                {/* 3. Safety Category */}
                <Text style={styles.settingsSectionTitle}>Safety</Text>
                <View style={styles.settingsCard}>
                  <TouchableOpacity style={styles.settingsRowItem} onPress={() => setShowBlockedModal(true)}>
                    <View style={styles.settingsRowLeft}>
                      <Text style={styles.settingsRowText}>Manage Blocked Accounts</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={[styles.settingsRowSubtext, { marginRight: 6 }]}>{blockedAccountsList.length} users</Text>
                      <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.settingsRowItem} onPress={() => setShowMutedModal(true)}>
                    <View style={styles.settingsRowLeft}>
                      <Text style={styles.settingsRowText}>Manage Muted Communities</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={[styles.settingsRowSubtext, { marginRight: 6 }]}>{mutedCommunitiesList.length} muted</Text>
                      <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.settingsRowItem}
                    onPress={() => {
                      Alert.alert('Chat Permissions', 'Who can message you', [
                        { text: 'Everyone', onPress: () => { setChatPermissionsOption('Everyone'); updateSettingOnBackend('chatPermissionsOption', 'Everyone'); } },
                        { text: 'Accounts older than 30 days', onPress: () => { setChatPermissionsOption('30days'); updateSettingOnBackend('chatPermissionsOption', '30days'); } },
                        { text: 'Nobody', onPress: () => { setChatPermissionsOption('Nobody'); updateSettingOnBackend('chatPermissionsOption', 'Nobody'); } },
                      ]);
                    }}
                  >
                    <View style={styles.settingsRowLeft}>
                      <Text style={styles.settingsRowText}>Chat Permission</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={[styles.settingsRowSubtext, { marginRight: 6 }]}>
                        {chatPermissionsOption === '30days' ? 'Older than 30d' : chatPermissionsOption}
                      </Text>
                      <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
                    </View>
                  </TouchableOpacity>

                  <View style={[styles.settingsRowItemNoBtn, { borderBottomWidth: 0 }]}>
                    <View style={styles.settingsRowLeft}>
                      <View style={{ flex: 1, paddingRight: 10 }}>
                        <Text style={styles.settingsRowText}>Allow people to follow you</Text>
                        <Text style={styles.settingsRowSubtext}>Followers will be notified about posts you make to your profile and see them in their feed</Text>
                      </View>
                    </View>
                    <Switch
                      value={allowFollowers}
                      onValueChange={(val) => {
                        setAllowFollowers(val);
                        updateSettingOnBackend('allowFollowers', val);
                      }}
                      trackColor={{ false: '#D1D5DB', true: '#C084FC' }}
                      thumbColor={allowFollowers ? '#7C3AED' : '#F3F4F6'}
                    />
                  </View>
                </View>

                {/* 4. Privacy Category */}
                <Text style={styles.settingsSectionTitle}>Privacy</Text>
                <View style={styles.settingsCard}>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: '#6B7280', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 4, letterSpacing: 0.5 }}>CURATE YOUR PROFILE</Text>
                  
                  <View style={styles.settingsRowItemNoBtn}>
                    <View style={styles.settingsRowLeft}>
                      <Text style={styles.settingsRowText}>Show recommendations in home feed</Text>
                    </View>
                    <Switch 
                      value={showRecommendations} 
                      onValueChange={(val) => {
                        setShowRecommendations(val);
                        updateSettingOnBackend('showRecommendations', val);
                      }} 
                      trackColor={{ false: '#D1D5DB', true: '#C084FC' }} 
                      thumbColor={showRecommendations ? '#7C3AED' : '#F3F4F6'} 
                    />
                  </View>

                  <View style={styles.settingsRowItemNoBtn}>
                    <View style={styles.settingsRowLeft}>
                      <View style={{ flex: 1, paddingRight: 10 }}>
                        <Text style={styles.settingsRowText}>Show up in search results</Text>
                        <Text style={styles.settingsRowSubtext}>Allow search engines like Google to link to your profile in their search results.</Text>
                      </View>
                    </View>
                    <Switch 
                      value={showInSearchResults} 
                      onValueChange={(val) => {
                        setShowInSearchResults(val);
                        updateSettingOnBackend('showInSearchResults', val);
                      }} 
                      trackColor={{ false: '#D1D5DB', true: '#C084FC' }} 
                      thumbColor={showInSearchResults ? '#7C3AED' : '#F3F4F6'} 
                    />
                  </View>

                  <View style={[styles.settingsRowItemNoBtn, { borderBottomWidth: 0 }]}>
                    <View style={styles.settingsRowLeft}>
                      <View style={{ flex: 1, paddingRight: 10 }}>
                        <Text style={styles.settingsRowText}>Personalize ads based on partners</Text>
                        <Text style={styles.settingsRowSubtext}>Allow us to use information from our partners to show you better ads.</Text>
                      </View>
                    </View>
                    <Switch 
                      value={personalizeAdsFromPartners} 
                      onValueChange={(val) => {
                        setPersonalizeAdsFromPartners(val);
                        updateSettingOnBackend('personalizeAdsFromPartners', val);
                      }} 
                      trackColor={{ false: '#D1D5DB', true: '#C084FC' }} 
                      thumbColor={personalizeAdsFromPartners ? '#7C3AED' : '#F3F4F6'} 
                    />
                  </View>
                </View>

                {/* Sensitive Ad Categories */}
                <Text style={styles.settingsSectionTitle}>Sensitive Advertising Categories</Text>
                <View style={styles.settingsCard}>
                  <Text style={{ fontSize: 11, color: '#6B7280', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10, letterSpacing: 0, lineHeight: 16 }}>
                    Choose what categories you'd rather not see ads about and we'll do our best to limit them.
                  </Text>
                  
                  {[
                    { label: 'Allow alcohol ads', state: allowAlcoholAds, setter: setAllowAlcoholAds, key: 'allowAlcoholAds' },
                    { label: 'Allow dating ads', state: allowDatingAds, setter: setAllowDatingAds, key: 'allowDatingAds' },
                    { label: 'Allow gambling ads', state: allowGamblingAds, setter: setAllowGamblingAds, key: 'allowGamblingAds' },
                    { label: 'Allow politics and activism ads', state: allowPoliticsAds, setter: setAllowPoliticsAds, key: 'allowPoliticsAds' },
                    { label: 'Allow pregnancy and parenting ads', state: allowPregnancyAds, setter: setAllowPregnancyAds, key: 'allowPregnancyAds' },
                    { label: 'Allow religion and spirituality ads', state: allowReligionAds, setter: setAllowReligionAds, key: 'allowReligionAds' },
                    { label: 'Allow weight loss ads', state: allowWeightLossAds, setter: setAllowWeightLossAds, key: 'allowWeightLossAds' },
                  ].map((item, idx, arr) => (
                    <View key={idx} style={[styles.settingsRowItemNoBtn, idx === arr.length - 1 ? { borderBottomWidth: 0 } : {}]}>
                      <View style={styles.settingsRowLeft}>
                        <Text style={styles.settingsRowText}>{item.label}</Text>
                      </View>
                      <Switch 
                        value={item.state} 
                        onValueChange={(val) => {
                          item.setter(val);
                          updateSettingOnBackend(item.key, val);
                        }} 
                        trackColor={{ false: '#D1D5DB', true: '#C084FC' }} 
                        thumbColor={item.state ? '#7C3AED' : '#F3F4F6'} 
                      />
                    </View>
                  ))}
                </View>

                {/* Delete Account */}
                <TouchableOpacity 
                  style={{
                    backgroundColor: '#FEE2E2',
                    borderColor: '#EF4444',
                    borderWidth: 1,
                    borderRadius: 12,
                    paddingVertical: 14,
                    alignItems: 'center',
                    marginTop: 24,
                    marginBottom: 20,
                    marginHorizontal: 4,
                  }}
                  onPress={() => {
                    Alert.alert(
                      'Delete Account',
                      'Are you absolutely sure you want to permanently delete your account? This action is irreversible.',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { 
                          text: 'Delete', 
                          style: 'destructive',
                          onPress: () => {
                            setShowSettingsModal(false);
                            if (onLogout) onLogout();
                          }
                        }
                      ]
                    );
                  }}
                >
                  <Text style={{ color: '#EF4444', fontWeight: '800', fontSize: 13 }}>Delete Account</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* DARK MODE BOTTOM SHEET SELECTION */}
      <Modal
        visible={showDarkModeSheet}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDarkModeSheet(false)}
      >
        <View style={styles.bottomSheetOverlay}>
          <TouchableOpacity style={{ flex: 0.6 }} onPress={() => setShowDarkModeSheet(false)} />
          <View style={styles.darkModeSheetContent}>
            <View style={styles.sheetHeader}>
              <TouchableOpacity onPress={() => setShowDarkModeSheet(false)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
              <Text style={styles.sheetTitle}>Select Theme Mode</Text>
              <View style={{ width: 24 }} />
            </View>

            <View style={{ padding: 20, gap: 12 }}>
              {[
                { mode: 'Device', desc: 'Follow system settings', icon: 'phone-portrait-outline' },
                { mode: 'Light', desc: 'Classic light theme', icon: 'sunny-outline' },
                { mode: 'Dark', desc: 'Sleek dark theme', icon: 'moon-outline' },
                { mode: 'Sunrise to Sunset', desc: 'Automatic transition', icon: 'time-outline' },
              ].map((opt) => (
                <TouchableOpacity 
                  key={opt.mode} 
                  style={[
                    styles.themeOptionRow,
                    darkModeSetting === opt.mode ? styles.themeOptionRowSelected : {}
                  ]}
                  onPress={() => {
                    setDarkModeSetting(opt.mode);
                    setShowDarkModeSheet(false);
                  }}
                >
                  <View style={styles.themeOptionIconBox}>
                    <Ionicons name={opt.icon} size={20} color="#7C3AED" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.themeOptionText}>{opt.mode}</Text>
                    <Text style={styles.themeOptionSubtext}>{opt.desc}</Text>
                  </View>
                  {darkModeSetting === opt.mode && (
                    <Ionicons name="checkmark-circle" size={20} color="#7C3AED" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* SWITCH ACCOUNTS POPUP SHEET MODAL */}
      <Modal
        visible={showSwitchAccountsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSwitchAccountsModal(false)}
      >
        <View style={styles.bottomSheetOverlay}>
          <TouchableOpacity style={{ flex: 0.5 }} onPress={() => setShowSwitchAccountsModal(false)} />
          <View style={[styles.darkModeSheetContent, { paddingBottom: 30 }]}>
            <View style={styles.sheetHeader}>
              <TouchableOpacity onPress={() => setShowSwitchAccountsModal(false)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
              <Text style={styles.sheetTitle}>Switch Accounts</Text>
              <View style={{ width: 24 }} />
            </View>

            <View style={{ padding: 20, gap: 16 }}>
              {switchableAccounts.map((acc, idx) => (
                <View 
                  key={idx} 
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: acc.active ? 'rgba(124, 58, 237, 0.08)' : '#F9FAFB',
                    borderColor: acc.active ? '#7C3AED' : '#E5E7EB',
                    borderWidth: 1.5,
                    borderRadius: 16,
                    padding: 12,
                  }}
                >
                  <TouchableOpacity 
                    style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => {
                      setSwitchableAccounts(prev => prev.map(a => ({
                        ...a,
                        active: a.username === acc.username
                      })));
                      setUserName(acc.username === 'devasanjay' ? 'Devasanjay' : acc.username.toUpperCase());
                      setUserHandle(acc.username);
                      setProfileImage(acc.profileImage);
                      setUserEmailAddress(acc.email);
                      setShowSwitchAccountsModal(false);
                      Alert.alert("Account Switched", `Successfully logged in as @${acc.username}`);
                    }}
                  >
                    {acc.profileImage ? (
                      <Image source={{ uri: acc.profileImage }} style={{ width: 36, height: 36, borderRadius: 18 }} />
                    ) : (
                      <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#7C3AED', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 }}>
                          {acc.username.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    )}
                    <View style={{ marginLeft: 12 }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#1F2937' }}>@{acc.username}</Text>
                      <Text style={{ fontSize: 11, color: '#6B7280', marginTop: 1 }}>{acc.email}</Text>
                    </View>
                  </TouchableOpacity>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    {acc.active && (
                      <Ionicons name="checkmark-circle" size={20} color="#7C3AED" />
                    )}
                    <TouchableOpacity 
                      onPress={() => {
                        Alert.alert(
                          "Logout", 
                          `Are you sure you want to log out of @${acc.username}?`, 
                          [
                            { text: "Cancel", style: "cancel" },
                            { 
                              text: "Logout", 
                              style: "destructive",
                              onPress: () => {
                                if (switchableAccounts.length === 1) {
                                  setShowSwitchAccountsModal(false);
                                  setShowSettingsModal(false);
                                  if (onLogout) onLogout();
                                } else {
                                  const updated = switchableAccounts.filter(a => a.username !== acc.username);
                                  if (acc.active) {
                                    updated[0].active = true;
                                    setUserName(updated[0].username === 'devasanjay' ? 'Devasanjay' : updated[0].username.toUpperCase());
                                    setUserHandle(updated[0].username);
                                    setProfileImage(updated[0].profileImage);
                                    setUserEmailAddress(updated[0].email);
                                  }
                                  setSwitchableAccounts(updated);
                                }
                              }
                            }
                          ]
                        );
                      }}
                    >
                      <Ionicons name="log-out-outline" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              <TouchableOpacity 
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#7C3AED',
                  borderRadius: 14,
                  paddingVertical: 14,
                  marginTop: 10,
                  gap: 8,
                }}
                onPress={() => {
                  Alert.alert(
                    "Add Account",
                    "Choose an account profile to add:",
                    [
                      { text: "Cancel", style: "cancel" },
                      { 
                        text: "Add @creative_creator", 
                        onPress: () => {
                          if (switchableAccounts.some(a => a.username === 'creative_creator')) {
                            Alert.alert("Error", "Account already added!");
                            return;
                          }
                          setSwitchableAccounts(prev => [
                            ...prev,
                            { username: 'creative_creator', email: 'creator@example.com', active: false, profileImage: null }
                          ]);
                        }
                      },
                      { 
                        text: "Add @tech_pioneer", 
                        onPress: () => {
                          if (switchableAccounts.some(a => a.username === 'tech_pioneer')) {
                            Alert.alert("Error", "Account already added!");
                            return;
                          }
                          setSwitchableAccounts(prev => [
                            ...prev,
                            { username: 'tech_pioneer', email: 'pioneer@example.com', active: false, profileImage: null }
                          ]);
                        }
                      }
                    ]
                  );
                }}
              >
                <Ionicons name="add" size={18} color="#FFFFFF" />
                <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 13 }}>Add Account</Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: 100, backgroundColor: '#FFFFFF', position: 'absolute', bottom: -100, left: 0, right: 0 }} />
          </View>
        </View>
      </Modal>

      {/* UPDATE EMAIL ID SHEET MODAL */}
      <Modal
        visible={showEmailModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEmailModal(false)}
      >
        <View style={styles.bottomSheetOverlay}>
          <TouchableOpacity style={{ flex: 0.4 }} onPress={() => setShowEmailModal(false)} />
          <View style={[styles.darkModeSheetContent, { paddingBottom: 35 }]}>
            <View style={styles.sheetHeader}>
              <TouchableOpacity onPress={() => setShowEmailModal(false)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
              <Text style={styles.sheetTitle}>Update Email ID</Text>
              <View style={{ width: 24 }} />
            </View>

            <View style={{ padding: 20, gap: 14 }}>
              {emailStep === 1 && (
                <View style={{ gap: 12 }}>
                  <Text style={{ fontSize: 13, color: '#4B5563', lineHeight: 18 }}>
                    We will send a verification code to your current email address <Text style={{ fontWeight: 'bold' }}>{userEmailAddress}</Text> to verify your identity.
                  </Text>
                  <TouchableOpacity 
                    style={{ backgroundColor: '#7C3AED', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 10 }}
                    onPress={() => {
                      Alert.alert("Code Sent", "Verification code sent to your email. For testing, please use code '1234'.");
                      setEmailStep(2);
                      setEmailOtpInput('');
                    }}
                  >
                    <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 13 }}>Send Verification OTP</Text>
                  </TouchableOpacity>
                </View>
              )}

              {emailStep === 2 && (
                <View style={{ gap: 12 }}>
                  <Text style={{ fontSize: 13, color: '#4B5563', lineHeight: 18 }}>
                    An OTP was sent to your current email. Enter the 4-digit code (use <Text style={{ fontWeight: 'bold' }}>1234</Text> for testing):
                  </Text>
                  <TextInput
                    style={{ borderHeight: 1, borderColor: '#D1D5DB', borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 16, color: '#1F2937', textAlign: 'center', letterSpacing: 8 }}
                    maxLength={4}
                    keyboardType="number-pad"
                    placeholder="0000"
                    placeholderTextColor="#9CA3AF"
                    value={emailOtpInput}
                    onChangeText={setEmailOtpInput}
                  />
                  <TouchableOpacity 
                    style={{ backgroundColor: '#7C3AED', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 10 }}
                    onPress={() => {
                      if (emailOtpInput === '1234') {
                        setEmailStep(3);
                        setNewEmailInput('');
                      } else {
                        Alert.alert("Invalid Code", "Please enter the correct OTP ('1234' for testing).");
                      }
                    }}
                  >
                    <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 13 }}>Verify Code</Text>
                  </TouchableOpacity>
                </View>
              )}

              {emailStep === 3 && (
                <View style={{ gap: 12 }}>
                  <Text style={{ fontSize: 13, color: '#4B5563', lineHeight: 18 }}>
                    Identity verified! Please enter your new email address:
                  </Text>
                  <TextInput
                    style={{ borderHeight: 1, borderColor: '#D1D5DB', borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 14, color: '#1F2937' }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="new_email@example.com"
                    placeholderTextColor="#9CA3AF"
                    value={newEmailInput}
                    onChangeText={setNewEmailInput}
                  />
                  <TouchableOpacity 
                    style={{ backgroundColor: '#7C3AED', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 10 }}
                    onPress={() => {
                      if (!newEmailInput || !newEmailInput.includes('@')) {
                        Alert.alert("Invalid Email", "Please enter a valid email address.");
                        return;
                      }
                      Alert.alert("Code Sent", `Verification code sent to ${newEmailInput}. For testing, please use code '5678'.`);
                      setEmailStep(4);
                      setEmailOtpInput('');
                    }}
                  >
                    <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 13 }}>Send OTP to New Email</Text>
                  </TouchableOpacity>
                </View>
              )}

              {emailStep === 4 && (
                <View style={{ gap: 12 }}>
                  <Text style={{ fontSize: 13, color: '#4B5563', lineHeight: 18 }}>
                    An OTP was sent to your new email <Text style={{ fontWeight: 'bold' }}>{newEmailInput}</Text>. Enter the 4-digit code (use <Text style={{ fontWeight: 'bold' }}>5678</Text> for testing):
                  </Text>
                  <TextInput
                    style={{ borderHeight: 1, borderColor: '#D1D5DB', borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 16, color: '#1F2937', textAlign: 'center', letterSpacing: 8 }}
                    maxLength={4}
                    keyboardType="number-pad"
                    placeholder="0000"
                    placeholderTextColor="#9CA3AF"
                    value={emailOtpInput}
                    onChangeText={setEmailOtpInput}
                  />
                  <TouchableOpacity 
                    style={{ backgroundColor: '#7C3AED', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 10 }}
                    onPress={() => {
                      if (emailOtpInput === '5678') {
                        setUserEmailAddress(newEmailInput);
                        setShowEmailModal(false);
                        updateSettingOnBackend('email', newEmailInput);
                        Alert.alert("Success", `Email address updated successfully to ${newEmailInput}!`);
                      } else {
                        Alert.alert("Invalid Code", "Please enter the correct OTP ('5678' for testing).");
                      }
                    }}
                  >
                    <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 13 }}>Verify & Update Email</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={{ height: 100, backgroundColor: '#FFFFFF', position: 'absolute', bottom: -100, left: 0, right: 0 }} />
          </View>
        </View>
      </Modal>

      {/* APP LOCK PASSCODE SETUP MODAL */}
      <Modal
        visible={showPasscodeSetup}
        transparent
        animationType="fade"
        onRequestClose={() => { setShowPasscodeSetup(false); setAppLockEnabled(false); }}
      >
        <View style={styles.bottomSheetOverlay}>
          <TouchableOpacity style={{ flex: 0.5 }} onPress={() => { setShowPasscodeSetup(false); setAppLockEnabled(false); }} />
          <View style={[styles.darkModeSheetContent, { paddingBottom: 35 }]}>
            <View style={styles.sheetHeader}>
              <TouchableOpacity onPress={() => { setShowPasscodeSetup(false); setAppLockEnabled(false); }}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
              <Text style={styles.sheetTitle}>Set Passcode</Text>
              <View style={{ width: 24 }} />
            </View>

            <View style={{ padding: 20, gap: 14 }}>
              <Text style={{ fontSize: 13, color: '#4B5563', textAlign: 'center' }}>
                Set a 4-digit password for App Lock:
              </Text>
              <TextInput
                style={{ borderHeight: 1, borderColor: '#D1D5DB', borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 20, color: '#1F2937', textAlign: 'center', letterSpacing: 12 }}
                maxLength={4}
                keyboardType="number-pad"
                placeholder="0000"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={passcodeInput}
                onChangeText={setPasscodeInput}
              />
              <TouchableOpacity 
                style={{ backgroundColor: '#7C3AED', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 10 }}
                onPress={() => {
                  if (passcodeInput.length === 4) {
                    setAppLockPassword(passcodeInput);
                    setAppLockEnabled(true);
                    setShowPasscodeSetup(false);
                    updateSettingOnBackend('appLockPassword', passcodeInput);
                    updateSettingOnBackend('appLockEnabled', true);
                    Alert.alert("Passcode Configured", "App lock passcode set successfully!");
                  } else {
                    Alert.alert("Invalid passcode", "Please enter a 4-digit passcode.");
                  }
                }}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 13 }}>Enable Lock</Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: 100, backgroundColor: '#FFFFFF', position: 'absolute', bottom: -100, left: 0, right: 0 }} />
          </View>
        </View>
      </Modal>

      {/* BLOCKED ACCOUNTS MODAL */}
      <Modal
        visible={showBlockedModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBlockedModal(false)}
      >
        <View style={styles.bottomSheetOverlay}>
          <TouchableOpacity style={{ flex: 0.4 }} onPress={() => setShowBlockedModal(false)} />
          <View style={[styles.darkModeSheetContent, { paddingBottom: 35 }]}>
            <View style={styles.sheetHeader}>
              <TouchableOpacity onPress={() => setShowBlockedModal(false)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
              <Text style={styles.sheetTitle}>Blocked Accounts</Text>
              <View style={{ width: 24 }} />
            </View>

            <View style={{ padding: 20, gap: 14 }}>
              {blockedAccountsList.length === 0 ? (
                <Text style={{ textAlign: 'center', color: '#6B7280', paddingVertical: 12 }}>No blocked accounts.</Text>
              ) : (
                blockedAccountsList.map((user) => (
                  <View key={user} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#F3F4F6' }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#1F2937' }}>@{user}</Text>
                    <TouchableOpacity 
                      style={{ backgroundColor: '#EF444415', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}
                      onPress={() => {
                        const newList = blockedAccountsList.filter(u => u !== user);
                        setBlockedAccountsList(newList);
                        updateSettingOnBackend('blockedAccountsList', newList);
                        Alert.alert("Unblocked", `@${user} has been unblocked.`);
                      }}
                    >
                      <Text style={{ color: '#EF4444', fontSize: 11, fontWeight: '700' }}>Unblock</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}

              <TouchableOpacity 
                style={{ backgroundColor: '#7C3AED', borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginTop: 10 }}
                onPress={() => {
                  Alert.alert(
                    "Block User",
                    "Choose a user to block:",
                    [
                      { text: "Cancel", style: "cancel" },
                      { 
                        text: "Block @spammer_one", 
                        onPress: () => {
                          if (blockedAccountsList.includes('spammer_one')) return;
                          const newList = [...blockedAccountsList, 'spammer_one'];
                          setBlockedAccountsList(newList);
                          updateSettingOnBackend('blockedAccountsList', newList);
                        }
                      },
                      { 
                        text: "Block @annoying_bot", 
                        onPress: () => {
                          if (blockedAccountsList.includes('annoying_bot')) return;
                          const newList = [...blockedAccountsList, 'annoying_bot'];
                          setBlockedAccountsList(newList);
                          updateSettingOnBackend('blockedAccountsList', newList);
                        }
                      }
                    ]
                  );
                }}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 12 }}>Block New User</Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: 100, backgroundColor: '#FFFFFF', position: 'absolute', bottom: -100, left: 0, right: 0 }} />
          </View>
        </View>
      </Modal>

      {/* MUTED COMMUNITIES MODAL */}
      <Modal
        visible={showMutedModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMutedModal(false)}
      >
        <View style={styles.bottomSheetOverlay}>
          <TouchableOpacity style={{ flex: 0.4 }} onPress={() => setShowMutedModal(false)} />
          <View style={[styles.darkModeSheetContent, { paddingBottom: 35 }]}>
            <View style={styles.sheetHeader}>
              <TouchableOpacity onPress={() => setShowMutedModal(false)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
              <Text style={styles.sheetTitle}>Muted Communities</Text>
              <View style={{ width: 24 }} />
            </View>

            <View style={{ padding: 20, gap: 14 }}>
              {mutedCommunitiesList.length === 0 ? (
                <Text style={{ textAlign: 'center', color: '#6B7280', paddingVertical: 12 }}>No muted communities.</Text>
              ) : (
                mutedCommunitiesList.map((comm) => (
                  <View key={comm} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#F3F4F6' }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#1F2937' }}>c/{comm}</Text>
                    <TouchableOpacity 
                      style={{ backgroundColor: '#EF444415', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}
                      onPress={() => {
                        const newList = mutedCommunitiesList.filter(c => c !== comm);
                        setMutedCommunitiesList(newList);
                        updateSettingOnBackend('mutedCommunitiesList', newList);
                        Alert.alert("Unmuted", `c/${comm} has been unmuted.`);
                      }}
                    >
                      <Text style={{ color: '#EF4444', fontSize: 11, fontWeight: '700' }}>Unmute</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}

              <TouchableOpacity 
                style={{ backgroundColor: '#7C3AED', borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginTop: 10 }}
                onPress={() => {
                  Alert.alert(
                    "Mute Community",
                    "Choose community to mute:",
                    [
                      { text: "Cancel", style: "cancel" },
                      { 
                        text: "Mute c/memes_noise", 
                        onPress: () => {
                          if (mutedCommunitiesList.includes('memes_noise')) return;
                          const newList = [...mutedCommunitiesList, 'memes_noise'];
                          setMutedCommunitiesList(newList);
                          updateSettingOnBackend('mutedCommunitiesList', newList);
                        }
                      },
                      { 
                        text: "Mute c/spam_talks", 
                        onPress: () => {
                          if (mutedCommunitiesList.includes('spam_talks')) return;
                          const newList = [...mutedCommunitiesList, 'spam_talks'];
                          setMutedCommunitiesList(newList);
                          updateSettingOnBackend('mutedCommunitiesList', newList);
                        }
                      }
                    ]
                  );
                }}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 12 }}>Mute New Community</Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: 100, backgroundColor: '#FFFFFF', position: 'absolute', bottom: -100, left: 0, right: 0 }} />
          </View>
        </View>
      </Modal>

    </View>
  );

  // Helper Post Card Renderer
  function renderPostCard(post) {
    const isCommunity = post.isCommunity || false;
    const authorName = post.authorName || 'r/IPL';
    const authorAvatar = post.authorAvatar || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80';
    const isJoined = post.isJoined !== undefined ? post.isJoined : false;

    return (
      <View key={post.id} style={styles.postCard}>
        <View style={styles.postHeader}>
          <View style={styles.authorInfo}>
            <Image source={{ uri: authorAvatar }} style={styles.authorAvatar} />
            <View style={{ marginLeft: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.authorName}>{authorName}</Text>
                <Text style={styles.postTime}> • {post.time || '10h'}</Text>
                {post.views && (
                  <Text style={styles.postTime}> • {post.views}</Text>
                )}
              </View>
            </View>
          </View>

          {isCommunity && !isJoined && (
            <TouchableOpacity 
              style={styles.inlineJoinBtn} 
              onPress={() => {
                setPosts(prev => prev.map(p => p.id === post.id ? { ...p, isJoined: true } : p));
                Alert.alert('Joined', `You joined ${authorName}!`);
              }}
            >
              <Text style={styles.inlineJoinBtnText}>Join</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.moreBtn}>
            <Ionicons name="ellipsis-vertical" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => setSelectedPost(post)}>
          <Text style={styles.postTitleText}>{post.text}</Text>
        </TouchableOpacity>

        {post.image && (
          <TouchableOpacity onPress={() => setSelectedPost(post)}>
            <Image source={{ uri: post.image }} style={styles.postImage} resizeMode="cover" />
          </TouchableOpacity>
        )}

        {post.images && (
          <TouchableOpacity onPress={() => setSelectedPost(post)} style={styles.imageGridPreview}>
            {post.images.map((img, idx) => (
              <Image key={idx} source={{ uri: img }} style={styles.gridImageItemPreview} />
            ))}
          </TouchableOpacity>
        )}

        <View style={styles.postFooter}>
          {/* Vote Container */}
          <View style={styles.upvoteContainer}>
            <TouchableOpacity onPress={() => handleToggleLike(post.id)}>
              <Ionicons 
                name={post.isLiked ? "arrow-up-circle" : "arrow-up-outline"} 
                size={18} 
                color={post.isLiked ? "#FF4500" : "#6B7280"} 
              />
            </TouchableOpacity>
            <Text style={[styles.upvoteCount, post.isLiked && { color: '#FF4500', fontWeight: 'bold' }]}>
              {post.likes}
            </Text>
            <TouchableOpacity onPress={() => {}}>
              <Ionicons name="arrow-down-outline" size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Comments Button */}
          <TouchableOpacity style={styles.commentsPillContainer} onPress={() => { setSelectedPost(post); setShowComments(true); }}>
            <Ionicons name="chatbubble-outline" size={18} color="#6B7280" />
            <Text style={styles.actionCount}>{post.commentsCount}</Text>
          </TouchableOpacity>

          {/* Right actions container */}
          <View style={styles.rightActionsContainer}>
            <TouchableOpacity style={styles.circularActionButton} onPress={() => Alert.alert('Repost', 'Post reposted successfully!')}>
              <Ionicons name="repeat-outline" size={18} color="#4B5563" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.circularActionButton} onPress={() => { setSelectedPost(post); setShowShare(true); }}>
              <Ionicons name="share-social-outline" size={18} color="#4B5563" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerContainer: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  animatedSearchContainer: {
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  searchInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  headerSearchInput: {
    color: '#FFFFFF',
    fontSize: 13,
    marginLeft: 8,
    padding: 0,
    width: '100%',
    fontWeight: '500',
  },
  headerBg: {
    width: '100%',
  },
  headerBgImgStyle: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerGradientOverlay: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  topHeader: {},
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
  initialAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  initialAvatarText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: 'bold',
  },
  userText: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  greetingText: {
    fontSize: 11,
    color: '#CBD5E1',
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionIconButtonHeader: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsRowContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    position: 'relative',
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
    width: 28,
    height: 3,
    backgroundColor: '#7C3AED',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  mainFeed: {
    flex: 1,
  },

  // REDESIGNED HORIZONTAL TRENDING CARDS
  trendingSectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  seeAllLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7C3AED',
  },
  trendingCardsScroll: {
    paddingRight: 16,
    gap: 12,
  },
  redesignedTrendingCard: {
    width: 170,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  growthBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  growthText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
  },
  cardTagText: {
    fontSize: 13,
    fontWeight: '750',
    color: '#1F2937',
  },
  cardCountText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
    marginBottom: 10,
  },
  miniTrendBarBg: {
    height: 4,
    width: '100%',
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
    overflow: 'hidden',
  },
  miniTrendBarFill: {
    height: '100%',
    borderRadius: 2,
  },

  categoriesSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryItem: {
    alignItems: 'center',
  },
  categoryIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4B5563',
  },
  storiesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  storiesScroll: {
    paddingHorizontal: 12,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 14,
    width: 60,
  },
  storyRingGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyImageInner: {
    width: '100%',
    height: '100%',
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  storyRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    padding: 2,
    overflow: 'hidden',
  },
  storyImage: {
    width: '100%',
    height: '100%',
    borderRadius: 26,
  },
  storyName: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 8,
    borderColor: '#F3F4F6',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
  },
  authorName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  postTime: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  moreBtn: {
    padding: 4,
  },
  postText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 19,
    marginBottom: 10,
  },
  postTitleText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
    lineHeight: 20,
    marginHorizontal: 16,
  },
  avatarCircleSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  avatarCircleSmallText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  inlineJoinBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginLeft: 10,
  },
  inlineJoinBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  upvoteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  upvoteCount: {
    fontSize: 12,
    color: '#4B5563',
    marginHorizontal: 8,
    fontWeight: '600',
  },
  postImage: {
    height: 300,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  imageGridPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginHorizontal: 16,
  },
  gridImageItemPreview: {
    width: '32%',
    height: 90,
    borderRadius: 8,
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 16,
    paddingHorizontal: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentsPillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  rightActionsContainer: {
    marginLeft: 'auto',
    flexDirection: 'row',
    gap: 8,
  },
  circularActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionCount: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  bottomNav: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 4,
  },
  navItem: {
    padding: 8,
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

  // THREE DOTS ANIMATED DRAWER STYLES
  modalFullContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  drawerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawerContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    maxHeight: height * 0.82,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  drawerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  drawerScroll: {
    flexGrow: 0,
    paddingTop: 12,
  },
  drawerNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  drawerNavLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  drawerDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 14,
  },
  drawerSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  drawerSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  seeAllText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
  },
  communityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  communityIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  communityMeta: {
    flex: 1,
    marginLeft: 12,
  },
  communityName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  communityMembers: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 1,
  },
  drawerLogoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: '#FEE2E2',
    borderRadius: 14,
    marginTop: 12,
  },
  drawerLogoutText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EF4444',
  },

  // LOGOUT CONFIRMATION MODAL STYLES
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoutConfirmCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    padding: 24,
    alignItems: 'center',
  },
  logoutIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoutConfirmTitle: {
    fontSize: 16,
    fontWeight: '750',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  logoutConfirmSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  logoutActionRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelLogoutBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelLogoutText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
  confirmLogoutBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#EF4444',
    alignItems: 'center',
  },
  confirmLogoutText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // START COMMUNITY MODAL STYLES
  startCommunityContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    padding: 20,
  },
  modalHeading: {
    fontSize: 16,
    fontWeight: '750',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  communityInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1F2937',
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
  },
  communityActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 8,
  },
  cancelCommunityBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  cancelCommunityText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  createCommunityBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#7C3AED',
  },
  createCommunityText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // UNIFIED SEARCH SLIDE DOWN STYLES
  searchWindowContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 44,
  },
  searchWindowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 10,
  },
  searchBarInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 42,
  },
  searchWindowInput: {
    flex: 1,
    fontSize: 13,
    color: '#1F2937',
  },
  cancelSearchBtn: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  cancelSearchText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7C3AED',
  },
  searchResultsScroll: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  searchSectionBlock: {
    marginBottom: 20,
  },
  searchSectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchResultSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  seeMoreBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
  },
  searchResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  searchPostResultCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  searchPostAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  searchPostAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  searchPostAuthorName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1F2937',
  },
  searchPostTime: {
    fontSize: 10,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  searchPostText: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 17,
  },
  searchSectionDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  emptySearchText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  localLocationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  localLocationText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 4,
  },
  liveBanner: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  liveBannerContent: {
    flex: 1,
  },
  liveBannerTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  liveBannerSubtitle: {
    color: '#F3E8FF',
    fontSize: 11,
    marginTop: 2,
  },
  viewLiveBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  viewLiveBtnText: {
    color: '#7C3AED',
    fontSize: 10,
    fontWeight: '700',
  },
  liveBannerImg: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginLeft: 12,
  },
  localPostsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  localPostsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  localPostCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  localPostHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  localTagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  localTagText: {
    fontSize: 9,
    fontWeight: '700',
  },
  localPostTime: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  localPostTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  localPostDesc: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 16,
  },
  localPostFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 14,
  },
  localStatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  localStatText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
  },
  localShareBtn: {
    marginLeft: 'auto',
  },
  trendingTopicsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  trendingTopicsList: {
    marginTop: 8,
  },
  topicRankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  topicRankNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: '#7C3AED',
    width: 28,
  },
  topicRankInfo: {
    flex: 1,
  },
  topicRankTag: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  topicRankCount: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 1,
  },
  topicTrendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  topicTrendText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },
  bottomSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  commentSheetContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '75%',
    paddingBottom: 20,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sheetTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },

  // LEFT PROFILE PANEL STYLES
  leftPanelContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
  },
  leftPanelBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  leftPanelContent: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 16,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 4, height: 0 },
    paddingTop: 0,
    overflow: 'hidden',
  },
  leftPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  leftPanelHeaderImageBg: {
    width: '100%',
    height: 60,
    overflow: 'hidden',
  },
  leftPanelHeaderOverlay: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  leftPanelHeaderTitleWhite: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  leftPanelCloseBtnCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftPanelHeaderTitle: {
    fontSize: 15,
    fontWeight: '750',
    color: '#1F2937',
  },
  leftPanelCloseBtn: {
    padding: 4,
  },
  leftPanelScroll: {
    flex: 1,
  },
  leftPanelScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  panelBannerContainer: {
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginHorizontal: 16,
    marginTop: 10,
  },
  panelBannerImg: {
    width: '100%',
    height: '100%',
  },
  panelBannerPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  panelBannerText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  bannerEditIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  panelAvatarWrapper: {
    alignItems: 'flex-start',
    marginTop: -32,
    marginLeft: 16,
    marginBottom: 20,
  },
  panelAvatarContainer: {
    position: 'relative',
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    elevation: 4,
  },
  panelAvatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 33,
  },
  panelAvatarPlaceholder: {
    flex: 1,
    borderRadius: 33,
    justifyContent: 'center',
    alignItems: 'center',
  },
  panelAvatarLetter: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  panelAvatarCameraIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#7C3AED',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  panelInputGroup: {
    gap: 6,
    marginBottom: 16,
  },
  panelLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  panelInput: {
    height: 44,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 13,
    color: '#1F2937',
  },
  panelTextArea: {
    height: 70,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1F2937',
    textAlignVertical: 'top',
  },
  panelSectionTitle: {
    fontSize: 13,
    fontWeight: '750',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 12,
  },
  panelSocialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    padding: 10,
  },
  socialIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  socialLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4B5563',
  },
  socialInput: {
    fontSize: 12,
    color: '#1F2937',
    padding: 0,
    marginTop: 2,
  },
  customLinkCard: {
    backgroundColor: '#F3E8FF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E9D5FF',
    gap: 8,
  },
  customLinkTitle: {
    fontSize: 12,
    fontWeight: '750',
    color: '#6B21A8',
  },
  panelInputSmall: {
    height: 36,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 12,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  generatedLinkBox: {
    marginTop: 4,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
  },
  generatedLinkLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#6B21A8',
  },
  generatedLinkText: {
    fontSize: 11,
    color: '#7C3AED',
    marginTop: 2,
  },
  panelToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  toggleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  toggleDesc: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  bottomEditProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  bottomEditProfileText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7C3AED',
  },

  // OUTSIDE PANEL SAVE BUTTON STYLE (Vertical Floating on Right 20%)
  leftPanelOutsideContainer: {
    width: '20%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  panelSaveBtnOutside: {
    width: 56,
    height: 80,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#7C3AED',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  saveBtnGradientOutside: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnTextOutside: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },

  // SEARCH PANE SLIDE-UP STYLES
  searchPaneBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  searchPaneContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '92%',
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
  },
  searchPaneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchPaneScroll: {
    flex: 1,
  },
  searchActionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  searchSectionTitleText: {
    fontSize: 14,
    fontWeight: '750',
    color: '#1F2937',
  },
  searchActionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchActionMiniBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    gap: 4,
  },
  searchActionMiniBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
  },
  historyItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  historyItemText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
  },
  emptyHistoryText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 16,
  },
  trendingFieldsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  trendingFieldChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  trendingFieldChipRank: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C3AED',
    marginRight: 6,
  },
  trendingFieldChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  trendingExpandBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    marginTop: 8,
  },
  trendingExpandBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7C3AED',
  },

  // SIDEBAR & EDIT PROFILE STYLES
  sidebarDisplayName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
    marginTop: 8,
  },
  sidebarHandleText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  sidebarMenuSection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sidebarMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sidebarMenuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sidebarMenuLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  editProfileFullContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  editProfileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 44 : 44,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  editHeaderCloseBtn: {
    padding: 4,
  },
  editHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },
  editHeaderSaveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#7C3AED',
  },
  editHeaderSaveText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  editProfileScroll: {
    flex: 1,
  },
  editProfileScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  socialLinksSection: {
    marginBottom: 20,
  },
  socialLinkBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 8,
  },
  socialBadgeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  socialBadgeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
    marginRight: 6,
  },
  socialBadgeValue: {
    fontSize: 12,
    color: '#7C3AED',
    flex: 1,
  },
  socialBadgeDeleteBtn: {
    padding: 4,
  },
  emptySocialsText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  addSocialBtnLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#7C3AED',
    borderStyle: 'dashed',
    gap: 6,
    marginTop: 8,
  },
  addSocialBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7C3AED',
  },
  socialPlatformSheetContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '60%',
    paddingBottom: 20,
  },
  platformRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  platformIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  platformNameText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  dialogBgOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  socialInputDialogCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    elevation: 20,
  },
  dialogTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  dialogSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 16,
  },
  dialogInputWrapper: {
    height: 48,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    justifyContent: 'center',
    marginBottom: 12,
  },
  dialogInput: {
    fontSize: 13,
    color: '#1F2937',
  },
  dialogLinkPreviewBox: {
    padding: 10,
    backgroundColor: '#F3E8FF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E9D5FF',
    marginBottom: 20,
  },
  dialogPreviewLabel: {
    fontSize: 9,
    fontWeight: '750',
    color: '#6B21A8',
  },
  dialogPreviewText: {
    fontSize: 11,
    color: '#7C3AED',
    marginTop: 2,
  },
  dialogActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  dialogCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
  },
  dialogCancelText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  dialogSaveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#7C3AED',
  },
  dialogSaveText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  settingsFullContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  settingsHeader: {
    paddingTop: Platform.OS === 'android' ? 44 : 44,
    height: Platform.OS === 'android' ? 100 : 96,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  settingsHeaderCloseBtn: {
    padding: 4,
  },
  settingsHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },
  settingsScroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  settingsSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 20,
    marginBottom: 8,
    paddingLeft: 4,
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  settingsRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingsRowItemNoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingsRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsRowText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  settingsRowSubtext: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  settingsRowInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  infoValueText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  bottomSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  darkModeSheetContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 30,
    elevation: 20,
  },
  themeOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  themeOptionRowSelected: {
    borderColor: '#7C3AED',
    backgroundColor: '#FAF5FF',
  },
  themeOptionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#ECEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  themeOptionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  themeOptionSubtext: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
});
