import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  Image, 
  ImageBackground,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { authService } from '../services/authService';

export default function ForgotPasswordScreen({ onBack, onContinue, onGoToLogin }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setLoading(false);
      onContinue(email);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', error.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#FFFFFF' }} 
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
              source={require('../../assets/forgot_password.png')}
              style={styles.illustrationImage}
              resizeMode="contain"
            />

            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              No worries! Enter your email and we'll{'\n'}send you instructions to reset it.
            </Text>

            {/* Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={18} color="#6B7280" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>
          </View>

          {/* Action Footer */}
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.continueButton} onPress={handleContinue} disabled={loading}>
              <ImageBackground
                source={require('../../assets/image.png')}
                style={styles.gradientButton}
                resizeMode="cover"
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.continueText}>Continue</Text>
                )}
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity onPress={onGoToLogin} style={styles.loginLinkButton}>
              <Text style={styles.loginLinkText}>
                Remember your password? <Text style={styles.loginLinkBold}>Login</Text>
              </Text>
            </TouchableOpacity>
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
    paddingTop: 50,
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationImage: {
    width: 180,
    height: 180,
    marginBottom: 24,
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
  inputGroup: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    backgroundColor: '#F9FAFB',
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#1F2937',
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
    marginBottom: 20,
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
  loginLinkButton: {
    paddingVertical: 10,
  },
  loginLinkText: {
    fontSize: 14,
    color: '#6B7280',
  },
  loginLinkBold: {
    color: '#7C3AED',
    fontWeight: 'bold',
  },
});
