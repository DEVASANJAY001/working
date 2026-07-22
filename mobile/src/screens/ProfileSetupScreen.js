import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ScrollView, 
  Modal, 
  Image, 
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { safeStorage } from '../utils/storage';
import { authService } from '../services/authService';

const monthsList = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function ProfileSetupScreen({ onBack, onContinue, initialUserData }) {
  const [fullName, setFullName] = useState(initialUserData?.fullName || 'Devasanjay');
  const [username, setUsername] = useState(initialUserData?.username || 'devasanjay');
  const [profileImage, setProfileImage] = useState(null);
  const [dob, setDob] = useState('15/08/1998');
  const [gender, setGender] = useState('Male');
  const [bio, setBio] = useState('Exploring clean tech & innovative digital experiences! 🚀');

  // Google Account Linking State
  const [googleConnected, setGoogleConnected] = useState(initialUserData?.googleConnected || false);
  const [googleEmail, setGoogleEmail] = useState(initialUserData?.googleEmail || initialUserData?.email || '');
  const [linkingLoading, setLinkingLoading] = useState(false);

  useEffect(() => {
    if (initialUserData) {
      if (initialUserData.googleConnected !== undefined) setGoogleConnected(initialUserData.googleConnected);
      if (initialUserData.googleEmail) setGoogleEmail(initialUserData.googleEmail);
    }
  }, [initialUserData]);

  // Handle Native Google Link
  const handleLinkGoogle = async () => {
    let GoogleSignin = null;
    let statusCodes = {};
    try {
      const googleModule = require('@react-native-google-signin/google-signin');
      GoogleSignin = googleModule.GoogleSignin;
      statusCodes = googleModule.statusCodes;
    } catch (e) {
      console.log('[GoogleSignin] Native TurboModule RNGoogleSignin not linked in standard Expo Go sandbox.');
    }

    if (!GoogleSignin) {
      Alert.alert(
        'Native Build Required',
        'RNGoogleSignin is a native C++/Java TurboModule not compiled inside standard Expo Go app.\n\nTo test native Google Account linking, please run a Native Development Build:\n\nnpx expo run:android'
      );
      return;
    }

    if (googleConnected) {
      Alert.alert('Already Connected', 'A Google account is already linked to your profile.');
      return;
    }

    setLinkingLoading(true);
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const response = await GoogleSignin.signIn();
      const user = response.data?.user || response.user;
      const pickedGoogleEmail = user?.email;
      const pickedGoogleName = user?.name || user?.email?.split('@')[0] || 'User';

      if (!pickedGoogleEmail) {
        throw new Error('Google Sign-In did not return an email address.');
      }

      const currentEmail = initialUserData?.email || googleEmail || 'devasanjay@gmail.com';

      // Link identity in backend database
      const updatedProfile = await authService.linkGoogleAccount(currentEmail, pickedGoogleEmail, pickedGoogleName);

      setGoogleConnected(true);
      setGoogleEmail(pickedGoogleEmail);
      await safeStorage.setItem('user_profile', JSON.stringify(updatedProfile));

      setLinkingLoading(false);
      Alert.alert('Success', `Successfully connected Google account (${pickedGoogleEmail}).`);
    } catch (error) {
      setLinkingLoading(false);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // User cancelled native picker: Fail silently / gracefully
        console.log('User cancelled native Google account picker');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('In Progress', 'Google Sign-In is already in progress.');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Play Services Unavailable', 'Google Play Services is not available or outdated on this device.');
      } else if (error.message === 'ALREADY_LINKED_TO_OTHER') {
        Alert.alert('Linking Error', 'This Google account is already connected to another user in our system.');
      } else {
        Alert.alert('Linking Failed', error.message || 'Could not link Google account.');
      }
    }
  };

  // Handle Unlink Google
  const handleUnlinkGoogle = async () => {
    const currentEmail = initialUserData?.email || googleEmail || 'devasanjay@gmail.com';
    setLinkingLoading(true);
    try {
      const updatedProfile = await authService.unlinkGoogleAccount(currentEmail);
      setGoogleConnected(false);
      setGoogleEmail('');
      await safeStorage.setItem('user_profile', JSON.stringify(updatedProfile));
      setLinkingLoading(false);
      Alert.alert('Disconnected', 'Google account has been disconnected.');
    } catch (error) {
      setLinkingLoading(false);
      if (error.message === 'NO_PASSWORD_SET') {
        Alert.alert(
          'Cannot Disconnect',
          'You registered via Google and do not have a password set yet. Please set a password first before disconnecting your Google account.'
        );
      } else {
        Alert.alert('Disconnect Failed', error.message || 'Could not disconnect Google account.');
      }
    }
  };

  // Calendar State
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [calYear, setCalYear] = useState(1998);
  const [calMonth, setCalMonth] = useState(7); // August (0-indexed)
  const [calDay, setCalDay] = useState(15);

  // Modals
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [imagePickerModalVisible, setImagePickerModalVisible] = useState(false);

  // Animation values for slow fade-in and fade-out backdrop
  const fadeOverlayAnim = useRef(new Animated.Value(0)).current;

  const animateFadeIn = () => {
    Animated.timing(fadeOverlayAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
      easing: Easing.out(Easing.quad),
    }).start();
  };

  const animateFadeOut = (onComplete) => {
    Animated.timing(fadeOverlayAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.in(Easing.quad),
    }).start(() => {
      if (onComplete) onComplete();
    });
  };

  const openGenderModal = () => {
    setGenderModalVisible(true);
    animateFadeIn();
  };

  const closeGenderModal = () => {
    animateFadeOut(() => setGenderModalVisible(false));
  };

  const openImagePickerModal = () => {
    setImagePickerModalVisible(true);
    animateFadeIn();
  };

  const closeImagePickerModal = () => {
    animateFadeOut(() => setImagePickerModalVisible(false));
  };

  const openCalendarModal = () => {
    setCalendarModalVisible(true);
    animateFadeIn();
  };

  const closeCalendarModal = () => {
    animateFadeOut(() => setCalendarModalVisible(false));
  };

  const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

  // Access Android Device Photo Albums / Gallery
  const pickImageFromGallery = async () => {
    try {
      if (typeof ImagePicker.requestMediaLibraryPermissionsAsync === 'function') {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult && !permissionResult.granted) {
          Alert.alert("Permission Required", "Please allow access to your photo album to upload a profile picture.");
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result && !result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
        closeImagePickerModal();
      }
    } catch (error) {
      console.log("Error picking image from gallery:", error);
      Alert.alert("Gallery Access", "Could not open photo albums on this device environment.");
    }
  };

  // Capture Photo with Camera
  const takePhotoWithCamera = async () => {
    try {
      if (typeof ImagePicker.requestCameraPermissionsAsync === 'function') {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult && !permissionResult.granted) {
          Alert.alert("Permission Required", "Please allow camera access to take a profile picture.");
          return;
        }
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result && !result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
        closeImagePickerModal();
      }
    } catch (error) {
      console.log("Error taking photo:", error);
      Alert.alert("Camera Access", "Could not launch camera on this device environment.");
    }
  };

  // Confirm selected Date of Birth
  const selectCalendarDate = (day) => {
    setCalDay(day);
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const monthNum = calMonth + 1;
    const formattedMonth = monthNum < 10 ? `0${monthNum}` : `${monthNum}`;
    setDob(`${formattedDay}/${formattedMonth}/${calYear}`);
    closeCalendarModal();
  };

  const handleContinue = async () => {
    if (!fullName.trim()) {
      Alert.alert('Required', 'Please enter your Full Name.');
      return;
    }
    if (!username.trim()) {
      Alert.alert('Required', 'Please enter a unique Username.');
      return;
    }

    const cleanUsername = username.replace(/^@/, '').trim();

    // Upload picked profile image to AWS S3
    let s3ProfileImage = profileImage;
    if (profileImage && !profileImage.startsWith('http')) {
      try {
        s3ProfileImage = await authService.uploadImageToS3(profileImage, 'avatars');
      } catch (e) {
        console.log('S3 Upload Error:', e);
      }
    }

    const userProfile = {
      fullName: fullName.trim(),
      username: cleanUsername,
      email: initialUserData?.email || '',
      profileImage: s3ProfileImage,
      dob: dob,
      gender: gender,
      bio: bio.trim(),
      isLoggedIn: true,
      isProfileCompleted: true,
      updatedAt: new Date().toISOString()
    };

    try {
      await safeStorage.setItem('user_profile', JSON.stringify(userProfile));
      await safeStorage.setItem('user_session', JSON.stringify(userProfile));
      await authService.updateUserProfile(userProfile);
    } catch (e) {
      console.log('Error saving profile:', e);
    }

    if (onContinue) {
      onContinue(userProfile);
    }
  };

  // Helper to generate days matrix in selected month
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <StatusBar style="dark" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Set up your profile</Text>
          <Text style={styles.subtitle}>Customize your account & public identity</Text>
        </View>

        {/* Avatar Container with Camera Icon Positioned OUTSIDE the Circle */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatarImg} />
            ) : (
              <LinearGradient
                colors={['#7C3AED', '#F97316']}
                style={styles.avatarGradient}
              >
                <Text style={styles.avatarInitialText}>
                  {fullName.trim().charAt(0).toUpperCase() || 'D'}
                </Text>
              </LinearGradient>
            )}

            {/* Floating Camera Badge Positioned OUTSIDE the Circle */}
            <TouchableOpacity 
              style={styles.cameraBadgeOutside}
              onPress={openImagePickerModal}
              activeOpacity={0.85}
            >
              <Ionicons name="camera" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={openImagePickerModal}>
            <Text style={styles.uploadText}>
              {profileImage ? 'Change Photo' : 'Upload Photo'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#9CA3AF"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          {/* Unique Username */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username (Unique)</Text>
            <View style={styles.usernameInputWrapper}>
              <Text style={styles.atPrefix}>@</Text>
              <TextInput
                style={styles.usernameInput}
                placeholder="username"
                placeholderTextColor="#9CA3AF"
                value={username.replace(/^@/, '')}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Date of Birth Field with Working Interactive Calendar Picker */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date of Birth (DOB)</Text>
            <TouchableOpacity style={styles.pickerTrigger} onPress={openCalendarModal} activeOpacity={0.8}>
              <Text style={[styles.pickerValue, !dob && styles.pickerPlaceholder]}>
                {dob ? dob : 'Select your date of birth'}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#7C3AED" />
            </TouchableOpacity>
          </View>

          {/* Gender */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender</Text>
            <TouchableOpacity style={styles.pickerTrigger} onPress={openGenderModal} activeOpacity={0.8}>
              <Text style={[styles.pickerValue, !gender && styles.pickerPlaceholder]}>
                {gender ? gender : 'Select your gender'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Bio */}
          <View style={styles.inputGroup}>
            <View style={styles.bioHeader}>
              <Text style={styles.label}>Bio <Text style={styles.optionalText}>(Optional)</Text></Text>
              <Text style={styles.charCount}>{bio.length}/150</Text>
            </View>
            <TextInput
              style={styles.textArea}
              placeholder="Tell us about yourself..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              maxLength={150}
              value={bio}
              onChangeText={setBio}
            />
          </View>

          {/* Connected Accounts & Identity Linking Section */}
          <View style={[styles.inputGroup, { marginTop: 12 }]}>
            <Text style={styles.label}>Connected Accounts</Text>
            <View style={styles.accountLinkCard}>
              <View style={styles.accountLinkMeta}>
                <Ionicons name="logo-google" size={22} color="#EA4335" style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.accountLinkTitle}>Google Account</Text>
                  <Text style={styles.accountLinkSub}>
                    {googleConnected && googleEmail 
                      ? `Connected as ${googleEmail}` 
                      : 'Not connected'}
                  </Text>
                </View>
              </View>

              {googleConnected ? (
                <TouchableOpacity 
                  style={styles.unlinkBtn} 
                  onPress={handleUnlinkGoogle}
                  disabled={linkingLoading}
                >
                  <Text style={styles.unlinkBtnText}>
                    {linkingLoading ? 'Disconnecting...' : 'Disconnect'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={styles.linkBtn} 
                  onPress={handleLinkGoogle}
                  disabled={linkingLoading}
                >
                  <Text style={styles.linkBtnText}>
                    {linkingLoading ? 'Connecting...' : 'Connect'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.85}>
          <ImageBackground
            source={require('../../assets/image.png')}
            style={styles.gradientButton}
            resizeMode="cover"
          >
            <Text style={styles.continueText}>Complete Profile →</Text>
          </ImageBackground>
        </TouchableOpacity>

        {/* WORKING INTERACTIVE CALENDAR PICKER MODAL */}
        <Modal
          visible={calendarModalVisible}
          transparent
          animationType="none"
          onRequestClose={closeCalendarModal}
        >
          <View style={styles.modalFullContainer}>
            <Animated.View style={[styles.modalOverlay, { opacity: fadeOverlayAnim }]}>
              <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={closeCalendarModal} />
            </Animated.View>

            <View style={styles.modalContent}>
              <View style={styles.calendarHeaderRow}>
                <TouchableOpacity onPress={() => setCalYear(prev => prev - 1)} style={styles.calNavBtn}>
                  <Ionicons name="chevron-back" size={20} color="#7C3AED" />
                </TouchableOpacity>

                <Text style={styles.calendarTitle}>
                  {monthsList[calMonth]} {calYear}
                </Text>

                <TouchableOpacity onPress={() => setCalYear(prev => prev + 1)} style={styles.calNavBtn}>
                  <Ionicons name="chevron-forward" size={20} color="#7C3AED" />
                </TouchableOpacity>
              </View>

              {/* Month Selector Carousel */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthScroll}>
                {monthsList.map((m, idx) => (
                  <TouchableOpacity 
                    key={m} 
                    style={[styles.monthChip, calMonth === idx && styles.monthChipActive]}
                    onPress={() => setCalMonth(idx)}
                  >
                    <Text style={[styles.monthChipText, calMonth === idx && styles.monthChipTextActive]}>
                      {m.substring(0, 3)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Day Grid */}
              <View style={styles.dayGrid}>
                {Array.from({ length: getDaysInMonth(calMonth, calYear) }, (_, i) => i + 1).map((day) => {
                  const isSelected = calDay === day;
                  return (
                    <TouchableOpacity
                      key={day}
                      style={[styles.dayCell, isSelected && styles.dayCellSelected]}
                      onPress={() => selectCalendarDate(day)}
                    >
                      <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>{day}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TouchableOpacity style={styles.cancelModalBtn} onPress={closeCalendarModal}>
                <Text style={styles.cancelModalText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* GENDER SELECTION MODAL WITH SLOW FADE OVERLAY */}
        <Modal
          visible={genderModalVisible}
          transparent
          animationType="none"
          onRequestClose={closeGenderModal}
        >
          <View style={styles.modalFullContainer}>
            <Animated.View style={[styles.modalOverlay, { opacity: fadeOverlayAnim }]}>
              <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={closeGenderModal} />
            </Animated.View>

            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Gender</Text>
              {genderOptions.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.modalOption}
                  onPress={() => {
                    setGender(item);
                    closeGenderModal();
                  }}
                >
                  <Text style={styles.modalOptionText}>{item}</Text>
                  {gender === item && (
                    <Ionicons name="checkmark" size={20} color="#7C3AED" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        {/* ANDROID PHOTO ALBUM MODAL WITH SLOW FADE OVERLAY */}
        <Modal
          visible={imagePickerModalVisible}
          transparent
          animationType="none"
          onRequestClose={closeImagePickerModal}
        >
          <View style={styles.modalFullContainer}>
            <Animated.View style={[styles.modalOverlay, { opacity: fadeOverlayAnim }]}>
              <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={closeImagePickerModal} />
            </Animated.View>

            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Upload Profile Picture</Text>
              <Text style={styles.modalSubtitle}>Choose a photo from your Android device</Text>

              <View style={styles.pickerActionList}>
                <TouchableOpacity style={styles.pickerActionRow} onPress={pickImageFromGallery}>
                  <View style={[styles.actionIconBox, { backgroundColor: '#F3E8FF' }]}>
                    <Ionicons name="images" size={22} color="#7C3AED" />
                  </View>
                  <View style={styles.actionMeta}>
                    <Text style={styles.actionTitle}>Choose from Photo Album</Text>
                    <Text style={styles.actionDesc}>Pick an existing picture from your device gallery</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.pickerActionRow} onPress={takePhotoWithCamera}>
                  <View style={[styles.actionIconBox, { backgroundColor: '#FEF3C7' }]}>
                    <Ionicons name="camera" size={22} color="#F59E0B" />
                  </View>
                  <View style={styles.actionMeta}>
                    <Text style={styles.actionTitle}>Take Photo with Camera</Text>
                    <Text style={styles.actionDesc}>Capture a new profile picture right now</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </TouchableOpacity>

                {profileImage && (
                  <TouchableOpacity 
                    style={styles.pickerActionRow}
                    onPress={() => {
                      setProfileImage(null);
                      closeImagePickerModal();
                    }}
                  >
                    <View style={[styles.actionIconBox, { backgroundColor: '#FEE2E2' }]}>
                      <Ionicons name="trash-outline" size={22} color="#EF4444" />
                    </View>
                    <View style={styles.actionMeta}>
                      <Text style={[styles.actionTitle, { color: '#EF4444' }]}>Use Name Initial Badge</Text>
                      <Text style={styles.actionDesc}>Remove custom photo and display initial letter badge</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity style={styles.cancelModalBtn} onPress={closeImagePickerModal}>
                <Text style={styles.cancelModalText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 44,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarWrapper: {
    position: 'relative',
    width: 96,
    height: 96,
    marginBottom: 8,
  },
  avatarImg: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: '#7C3AED',
  },
  avatarGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  avatarInitialText: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: 'bold',
  },
  cameraBadgeOutside: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#7C3AED',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  uploadText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7C3AED',
    marginTop: 4,
  },
  form: {
    gap: 16,
    marginBottom: 28,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  optionalText: {
    fontWeight: '400',
    color: '#9CA3AF',
  },
  input: {
    height: 48,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#1F2937',
  },
  usernameInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 16,
  },
  atPrefix: {
    fontSize: 15,
    fontWeight: '700',
    color: '#7C3AED',
    marginRight: 4,
  },
  usernameInput: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
  },
  pickerTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 16,
  },
  pickerValue: {
    fontSize: 14,
    color: '#1F2937',
  },
  pickerPlaceholder: {
    color: '#9CA3AF',
  },
  bioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  charCount: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  textArea: {
    height: 90,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1F2937',
    textAlignVertical: 'top',
  },

  // Connected Accounts Card Styles
  accountLinkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  accountLinkMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  accountLinkTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  accountLinkSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  linkBtn: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  linkBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  unlinkBtn: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  unlinkBtnText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
  },

  continueButton: {
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    elevation: 3,
  },
  gradientButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  // MODAL SLOW FADE BACKDROP STYLES
  modalFullContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '750',
    color: '#1F2937',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 16,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },

  // CALENDAR PICKER STYLES
  calendarHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  calNavBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  monthScroll: {
    flexGrow: 0,
    marginBottom: 16,
  },
  monthChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  monthChipActive: {
    backgroundColor: '#7C3AED',
  },
  monthChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  monthChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  dayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  dayCell: {
    width: '12%',
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  dayCellSelected: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  dayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  pickerActionList: {
    gap: 12,
    marginBottom: 20,
  },
  pickerActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionMeta: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  actionDesc: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  cancelModalBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  cancelModalText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
});
