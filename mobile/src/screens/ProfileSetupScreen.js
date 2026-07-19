import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ScrollView, 
  Modal, 
  FlatList, 
  Image, 
  ImageBackground 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { safeStorage } from '../utils/storage';
import { authService } from '../services/authService';

// Sample Avatar / Cropping Options
const presetAvatars = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
];

export default function ProfileSetupScreen({ onBack, onContinue, initialUserData }) {
  const [fullName, setFullName] = useState(initialUserData?.fullName || 'Devasanjay');
  const [username, setUsername] = useState(initialUserData?.username || 'devasanjay');
  const [profileImage, setProfileImage] = useState(null);
  const [dob, setDob] = useState('15/08/1998');
  const [gender, setGender] = useState('Male');
  const [bio, setBio] = useState('Exploring clean tech & innovative digital experiences! 🚀');

  // Modals
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [imagePickerModalVisible, setImagePickerModalVisible] = useState(false);

  const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

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

    const userProfile = {
      fullName: fullName.trim(),
      username: cleanUsername,
      profileImage: profileImage,
      dob: dob,
      gender: gender,
      bio: bio.trim(),
      isLoggedIn: true,
      isProfileCompleted: true,
      updatedAt: new Date().toISOString()
    };

    try {
      // Save profile and active session into safeStorage
      await safeStorage.setItem('user_profile', JSON.stringify(userProfile));
      await safeStorage.setItem('user_session', JSON.stringify(userProfile));

      // Sync user profile payload with AWS Auth Service / DynamoDB mock
      await authService.updateUserProfile(userProfile);
    } catch (e) {
      console.log('Error saving profile:', e);
    }

    if (onContinue) {
      onContinue(userProfile);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.container} showsVerticalScrollIndicator={false}>
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

          {/* Camera Badge Positioned OUTSIDE the Circle */}
          <TouchableOpacity 
            style={styles.cameraBadgeOutside}
            onPress={() => setImagePickerModalVisible(true)}
            activeOpacity={0.85}
          >
            <Ionicons name="camera" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => setImagePickerModalVisible(true)}>
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

        {/* Date of Birth */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date of Birth (DOB)</Text>
          <TouchableOpacity style={styles.pickerTrigger} onPress={() => setDob('15/08/1998')}>
            <Text style={[styles.pickerValue, !dob && styles.pickerPlaceholder]}>
              {dob ? dob : 'Select your date of birth'}
            </Text>
            <Ionicons name="calendar-outline" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Gender */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gender</Text>
          <TouchableOpacity style={styles.pickerTrigger} onPress={() => setGenderModalVisible(true)}>
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

      {/* Gender Selection Modal */}
      <Modal
        visible={genderModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setGenderModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setGenderModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Gender</Text>
            {genderOptions.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.modalOption}
                onPress={() => {
                  setGender(item);
                  setGenderModalVisible(false);
                }}
              >
                <Text style={styles.modalOptionText}>{item}</Text>
                {gender === item && (
                  <Ionicons name="checkmark" size={20} color="#7C3AED" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Profile Picture Picker & Crop Modal */}
      <Modal
        visible={imagePickerModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setImagePickerModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setImagePickerModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Profile Picture</Text>
            <Text style={styles.modalSubtitle}>Select an avatar or custom photo</Text>

            <View style={styles.presetGrid}>
              {presetAvatars.map((uri, idx) => (
                <TouchableOpacity 
                  key={idx} 
                  onPress={() => {
                    setProfileImage(uri);
                    setImagePickerModalVisible(false);
                  }}
                  style={styles.presetChoice}
                >
                  <Image source={{ uri }} style={styles.presetThumb} />
                </TouchableOpacity>
              ))}
            </View>

            {profileImage && (
              <TouchableOpacity 
                style={styles.removeImageBtn}
                onPress={() => {
                  setProfileImage(null);
                  setImagePickerModalVisible(false);
                }}
              >
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
                <Text style={styles.removeImageText}>Remove Photo (Use Letter Initial)</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={styles.cancelModalBtn}
              onPress={() => setImagePickerModalVisible(false)}
            >
              <Text style={styles.cancelModalText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

    </ScrollView>
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

  // CAMERA ICON POSITIONED OUTSIDE THE CIRCLE (BOTTOM RIGHT BADGE)
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
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
  presetGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  presetChoice: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#7C3AED',
  },
  presetThumb: {
    width: '100%',
    height: '100%',
  },
  removeImageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    marginBottom: 12,
  },
  removeImageText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF4444',
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
