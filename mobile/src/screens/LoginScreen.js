import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  ImageBackground,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { safeStorage } from '../utils/storage';
import { authService } from '../services/authService';

let GoogleSignin = null;
let statusCodes = {};
try {
  const googleModule = require('@react-native-google-signin/google-signin');
  GoogleSignin = googleModule.GoogleSignin;
  statusCodes = googleModule.statusCodes;
  
  if (GoogleSignin) {
    GoogleSignin.configure({
      webClientId: '1070529505739-g4pbc55p8egcf624c9kth6oec3ad9998.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }
} catch (e) {
  console.log('[GoogleSignin] Native TurboModule RNGoogleSignin not linked in standard Expo Go sandbox.');
}

export default function LoginScreen({ onBack, onLoginSuccess, onForgotPassword, onGoToRegister }) {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    if (!GoogleSignin) {
      Alert.alert(
        'Native Build Required',
        'RNGoogleSignin is a native C++/Java TurboModule not compiled inside standard Expo Go app.\n\nTo test real Google Sign-In, please run a Native Development Build:\n\nnpx expo run:android'
      );
      return;
    }

    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const response = await GoogleSignin.signIn();
      const user = response.data?.user || response.user;
      const email = user?.email;
      const name = user?.name || user?.email?.split('@')[0] || 'User';

      if (!email) {
        throw new Error('Google Sign-In did not return an email address.');
      }

      let profile = await authService.getUserProfile(email);
      if (!profile) {
        try {
          await authService.signUp(email, name.replace(/\s+/g, '_').toLowerCase(), 'GooglePass123!');
        } catch (signUpErr) {
          // Ignore if user already exists
        }
        profile = {
          fullName: name,
          username: name.replace(/\s+/g, '_').toLowerCase(),
          email: email,
          isLoggedIn: true,
          isProfileCompleted: false,
          googleConnected: true,
          updatedAt: new Date().toISOString()
        };
        await authService.updateUserProfile(profile);
      } else {
        profile.googleConnected = true;
        await authService.updateUserProfile(profile);
      }

      await safeStorage.setItem('user_profile', JSON.stringify(profile));
      await safeStorage.setItem('user_session', JSON.stringify({ isLoggedIn: true, email: email }));

      setLoading(false);
      onLoginSuccess(email);
    } catch (error) {
      setLoading(false);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the Google Sign-In flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Sign In Progress', 'Google Sign-In is already in progress.');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Play Services Error', 'Google Play Services is not available or outdated on this device.');
      } else {
        Alert.alert('Google Sign-In Error', error.message || 'An error occurred during Google Sign-In.');
      }
    }
  };

  const handleLogin = async () => {
    if (!emailOrPhone || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await authService.signIn(emailOrPhone, password);
      // Fetch user profile from AWS DynamoDB simulation
      const profile = await authService.getUserProfile(emailOrPhone);
      if (profile) {
        await safeStorage.setItem('user_profile', JSON.stringify(profile));
      }
      await safeStorage.setItem('user_session', JSON.stringify({ isLoggedIn: true, email: emailOrPhone }));
      setLoading(false);
      onLoginSuccess(emailOrPhone);
    } catch (error) {
      setLoading(false);
      Alert.alert('Login Failed', error.message || 'An error occurred during login.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#FFFFFF' }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', paddingBottom: 40, backgroundColor: '#FFFFFF' }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
            <StatusBar style="dark" />
            
            {/* Header Area */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={onBack}>
                <Ionicons name="arrow-back" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>

            {/* Welcome Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Welcome back! 👋</Text>
              <Text style={styles.subtitle}>Login to continue</Text>
            </View>

            {/* Form Fields */}
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email or Phone</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email or phone"
                  placeholderTextColor="#9CA3AF"
                  value={emailOrPhone}
                  onChangeText={setEmailOrPhone}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={secureText}
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                    <Ionicons
                      name={secureText ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.forgotPassword} onPress={onForgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Buttons */}
            <View style={styles.actionContainer}>
              <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
                <ImageBackground
                  source={require('../../assets/image.png')}
                  style={styles.gradientButton}
                  resizeMode="cover"
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.loginText}>Login</Text>
                  )}
                </ImageBackground>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Buttons */}
              <View style={styles.socialContainer}>
                <TouchableOpacity 
                  style={[styles.socialButton, { width: '100%' }]}
                  onPress={handleGoogleLogin}
                >
                  <Ionicons name="logo-google" size={20} color="#EA4335" style={styles.socialIcon} />
                  <Text style={styles.socialButtonText}>Continue with Google</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Don't have an account?{' '}
                <Text style={styles.footerLink} onPress={onGoToRegister}>
                  Register
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
    KeyboardAvoidingView: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 24,
      paddingTop: 30,
      justifyContent: 'space-between',
      paddingBottom: 30,
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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 6,
  },
  form: {
    marginVertical: 10,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 52,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
  },
  passwordInput: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    height: '100%',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    fontSize: 13,
    color: '#7C3AED',
    fontWeight: '600',
  },
  actionContainer: {
    marginVertical: 10,
  },
  loginButton: {
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
  loginText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 13,
    color: '#9CA3AF',
    marginHorizontal: 12,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  socialIcon: {
    marginRight: 8,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  footerLink: {
    color: '#7C3AED',
    fontWeight: 'bold',
  },

  // Google Account Chooser Popup Styles
  googleOverlayBg: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  googleDismissOverlay: {
    flex: 1,
  },
  googleAccountSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  googleSheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginBottom: 16,
  },
  googleBrandHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  googleSheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
    marginTop: 8,
  },
  googleSheetSub: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  googleAccountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  googleAvatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  googleAvatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  googleAccountName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  googleAccountEmail: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },
  googleDisclaimer: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 15,
  },
});
