import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  Image, 
  ImageBackground,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function PhoneNumberScreen({ onBack, onContinue }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');

  const handleContinue = () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter your phone number.');
      return;
    }
    // As per user instructions: no OTP check required, directly route to next screen
    onContinue(phoneNumber);
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <StatusBar style="dark" />
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Image
              source={require('../../assets/phone_input.png')}
              style={styles.illustrationImage}
              resizeMode="contain"
            />

            <Text style={styles.title}>Enter your phone number</Text>
            <Text style={styles.subtitle}>
              We'll send you an OTP to verify
            </Text>

            {/* Phone Input Box */}
            <View style={styles.inputContainer}>
              <View style={styles.countryPicker}>
                <Text style={styles.flag}>🇮🇳</Text>
                <Text style={styles.countryCode}>India ({countryCode})</Text>
                <Ionicons name="chevron-down" size={16} color="#6B7280" />
              </View>
              
              <View style={styles.numberInputContainer}>
                <Text style={styles.numberLabel}>Phone Number</Text>
                <TextInput
                  style={styles.numberInput}
                  keyboardType="phone-pad"
                  placeholder="98765 43210"
                  placeholderTextColor="#9CA3AF"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
              </View>
            </View>
          </View>

          {/* Action Footer */}
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
              <ImageBackground
                source={require('../../assets/image.png')}
                style={styles.gradientButton}
                resizeMode="cover"
              >
                <Text style={styles.continueText}>Continue</Text>
              </ImageBackground>
            </TouchableOpacity>
            
            <Text style={styles.infoText}>Your number is safe with us</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 10,
    justifyContent: 'space-between',
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
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationImage: {
    width: 130,
    height: 130,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 36,
  },
  inputContainer: {
    width: '100%',
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 52,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    marginBottom: 16,
  },
  flag: {
    fontSize: 20,
    marginRight: 8,
  },
  countryCode: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '500',
  },
  numberInputContainer: {
    width: '100%',
    height: 60,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
  },
  numberLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  numberInput: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
    marginTop: 2,
  },
  actionContainer: {
    width: '100%',
    alignItems: 'center',
  },
  continueButton: {
    width: '100%',
    height: 54,
    borderRadius: 27,
    overflow: 'hidden',
    marginBottom: 16,
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
  infoText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
