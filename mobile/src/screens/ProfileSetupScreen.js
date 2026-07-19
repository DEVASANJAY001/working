import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Modal, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function ProfileSetupScreen({ onBack, onContinue }) {
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [bio, setBio] = useState('');
  const [genderModalVisible, setGenderModalVisible] = useState(false);

  const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

  const handleContinue = () => {
    if (!fullName) {
      Alert.alert('Error', 'Full Name is required.');
      return;
    }
    onContinue({ fullName, dob, gender, bio });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Let's set up your profile</Text>
        <Text style={styles.subtitle}>This helps others recognize you</Text>
      </View>

      {/* Avatar Container */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatarOutline}>
          <LinearGradient
            colors={['#A855F7', '#F97316']}
            style={styles.avatarGradient}
          >
            <Ionicons name="person" size={54} color="#FFFFFF" />
            <TouchableOpacity style={styles.cameraBadge}>
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </LinearGradient>
        </View>
        <Text style={styles.uploadText}>Upload Photo</Text>
      </View>

      {/* Form Fields */}
      <View style={styles.form}>
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

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity style={styles.pickerTrigger} onPress={() => setDob('15/08/1998')}>
            <Text style={[styles.pickerValue, !dob && styles.pickerPlaceholder]}>
              {dob ? dob : 'Select your date of birth'}
            </Text>
            <Ionicons name="calendar-outline" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gender <Text style={styles.optionalText}>(Optional)</Text></Text>
          <TouchableOpacity style={styles.pickerTrigger} onPress={() => setGenderModalVisible(true)}>
            <Text style={[styles.pickerValue, !gender && styles.pickerPlaceholder]}>
              {gender ? gender : 'Select your gender'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.bioHeader}>
            <Text style={styles.label}>Bio <Text style={styles.optionalText}>(Optional)</Text></Text>
            <Text style={styles.charCount}>{bio.length}/150</Text>
          </View>
          <TextInput
            style={styles.textArea}
            placeholder="Tell us about yourself"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            maxLength={150}
            value={bio}
            onChangeText={setBio}
          />
        </View>
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <LinearGradient
          colors={['#7C3AED', '#F97316']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          <Text style={styles.continueText}>Continue</Text>
        </LinearGradient>
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
            <FlatList
              data={genderOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
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
              )}
            />
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
    paddingTop: 50,
    paddingBottom: 40,
  },
  header: {
    height: 48,
    justifyContent: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  titleContainer: {
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 4,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatarOutline: {
    width: 106,
    height: 106,
    borderRadius: 53,
    borderWidth: 3,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#000000',
    opacity: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  uploadText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: 'bold',
    marginTop: 8,
  },
  form: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  optionalText: {
    color: '#9CA3AF',
    fontWeight: 'normal',
  },
  input: {
    width: '100%',
    height: 52,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  pickerTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 52,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
  },
  pickerValue: {
    fontSize: 15,
    color: '#1F2937',
  },
  pickerPlaceholder: {
    color: '#9CA3AF',
  },
  bioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  charCount: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  textArea: {
    width: '100%',
    height: 100,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 15,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
    textAlignVertical: 'top',
  },
  continueButton: {
    width: '100%',
    height: 54,
    borderRadius: 27,
    overflow: 'hidden',
  },
  gradientButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    maxHeight: '50%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#374151',
  },
});
