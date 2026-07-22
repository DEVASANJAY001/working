import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, Animated, Text, TextInput, Platform, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

import { safeStorage } from './src/utils/storage';
import { authService } from './src/services/authService';

// Global JS Exception Handler to log crashes to persistent storage
import { Alert } from 'react-native';

const logCrashToStorage = async (error, isFatal) => {
  try {
    const logMsg = `[CRASH] Fatal: ${isFatal} | Time: ${new Date().toISOString()} | Msg: ${error.message}\nStack: ${error.stack}\n\n`;
    const existingLogs = await safeStorage.getItem('app_crash_logs') || '';
    await safeStorage.setItem('app_crash_logs', existingLogs + logMsg);
    console.log('Crash logged persistently:', logMsg);
  } catch (e) {
    console.log('Failed to write crash log:', e);
  }
};

if (Platform.OS !== 'web') {
  const defaultHandler = ErrorUtils.getGlobalHandler();
  ErrorUtils.setGlobalHandler(async (error, isFatal) => {
    await logCrashToStorage(error, isFatal);
    if (defaultHandler) {
      defaultHandler(error, isFatal);
    }
  });
}

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    logCrashToStorage(error, false);
  }
  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#EF4444', marginBottom: 12 }}>App Crash Detected</Text>
          <Text style={{ fontSize: 13, color: '#4B5563', textAlign: 'center', marginBottom: 24 }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </Text>
          <TouchableOpacity 
            style={{ backgroundColor: '#7C3AED', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }}
            onPress={async () => {
              try {
                const logs = await safeStorage.getItem('app_crash_logs');
                Alert.alert('Crash Diagnostics Log', logs || 'No crash logs registered yet.');
              } catch (e) {}
            }}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Show Diagnostic Logs</Text>
          </TouchableOpacity>
        </SafeAreaView>
      );
    }
    return this.props.children;
  }
}

// Import Screens
import SplashScreen from './src/screens/SplashScreen';
import GetStartedScreen from './src/screens/GetStartedScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import EmailVerificationScreen from './src/screens/EmailVerificationScreen';
import PhoneNumberScreen from './src/screens/PhoneNumberScreen';
import ProfileSetupScreen from './src/screens/ProfileSetupScreen';
import AllSetScreen from './src/screens/AllSetScreen';
import LanguageSelectionScreen from './src/screens/LanguageSelectionScreen';
import InterestSelectionScreen from './src/screens/InterestSelectionScreen';
import HomeDashboardScreen from './src/screens/HomeDashboardScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import CreateContentScreen from './src/screens/CreateContentScreen';
import LoginLoadingScreen from './src/screens/LoginLoadingScreen';
import CommunityManagerScreen from './src/screens/CommunityManagerScreen';
import ScreenNavigator from './src/components/ScreenNavigator';

// Globally monkey-patch Text & TextInput to set Inter Font Family based on fontWeight
const patchComponentFont = (Component) => {
  let target = Component;
  if (Component.type && Component.type.render) {
    target = Component.type;
  }
  if (target && target.render) {
    const oldRender = target.render;
    target.render = function (...args) {
      const origin = oldRender.apply(this, args);
      const originStyle = StyleSheet.flatten(origin.props.style);
      
      let fontFamily = 'Inter-Regular';
      if (originStyle) {
        if (originStyle.fontWeight === 'bold' || originStyle.fontWeight === '700') {
          fontFamily = 'Inter-Bold';
        } else if (originStyle.fontWeight === '600' || originStyle.fontWeight === '500') {
          fontFamily = 'Inter-Medium';
        }
      }
      return React.cloneElement(origin, {
        style: [{ fontFamily }, origin.props.style],
      });
    };
  }
};

if (Platform.OS !== 'web') {
  patchComponentFont(Text);
  patchComponentFont(TextInput);
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Splash');
  const [userEmail, setUserEmail] = useState('');
  const [hasSession, setHasSession] = useState(false);
  const [isProfileCompleted, setIsProfileCompleted] = useState(false);
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const val = await safeStorage.getItem('user_session');
        const prof = await safeStorage.getItem('user_profile');
        
        let email = '';
        if (val) {
          const parsed = JSON.parse(val);
          if (parsed && parsed.isLoggedIn) {
            setHasSession(true);
            if (parsed.email) {
              email = parsed.email;
              setUserEmail(parsed.email);
            }
            
            // Check local cache first
            if (prof) {
              const parsedProf = JSON.parse(prof);
              if (parsedProf && parsedProf.isProfileCompleted) {
                setIsProfileCompleted(true);
              }
            }
          }
        }

        // Fetch fresh profile state from AWS DynamoDB on startup/restart
        if (email) {
          console.log('[App] Loading fresh profile from AWS DynamoDB on restart for:', email);
          const freshProfile = await authService.getUserProfile(email);
          if (freshProfile) {
            await safeStorage.setItem('user_profile', JSON.stringify(freshProfile));
            if (freshProfile.isProfileCompleted) {
              setIsProfileCompleted(true);
            }
          }
        }
      } catch (e) {
        console.log(e);
      } finally {
        setIsSessionLoaded(true);
      }
    }
    checkSession();
  }, []);

  useEffect(() => {
    if (isSessionLoaded && hasSession) {
      if (isProfileCompleted) {
        setCurrentScreen('Home');
      } else {
        setCurrentScreen('ProfileSetup');
      }
    }
  }, [isSessionLoaded, hasSession, isProfileCompleted]);

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  // Animation is now delegated to ScreenNavigator component

  const renderScreen = (screenName = currentScreen) => {
    switch (screenName) {
      case 'Splash':
        return (
          <SplashScreen 
            onFinish={() => {
              if (hasSession) {
                if (isProfileCompleted) {
                  setCurrentScreen('Home');
                } else {
                  setCurrentScreen('ProfileSetup');
                }
              } else {
                setCurrentScreen('GetStarted');
              }
            }} 
          />
        );
      
      case 'GetStarted':
        return (
          <GetStartedScreen
            onLogin={() => setCurrentScreen('Login')}
            onRegister={() => setCurrentScreen('Register')}
          />
        );
      
      case 'Login':
        return (
          <LoginScreen
            onBack={() => setCurrentScreen('GetStarted')}
            onLoginSuccess={(email) => {
              setUserEmail(email);
              setCurrentScreen('LoginLoading');
            }}
            onForgotPassword={() => setCurrentScreen('ForgotPassword')}
            onGoToRegister={() => setCurrentScreen('Register')}
          />
        );

      case 'LoginLoading':
        return (
          <LoginLoadingScreen
            emailOrPhone={userEmail}
            onFinish={(hasProfile, profile) => {
              if (hasProfile) {
                setHasSession(true);
                setIsProfileCompleted(true);
                setCurrentScreen('Home');
              } else {
                setHasSession(true);
                setIsProfileCompleted(false);
                setCurrentScreen('ProfileSetup');
              }
            }}
          />
        );
      
      case 'Register':
        return (
          <RegisterScreen
            onBack={() => setCurrentScreen('GetStarted')}
            onRegisterSuccess={async (email) => {
              try {
                await safeStorage.removeItem('user_session');
                await safeStorage.removeItem('user_profile');
              } catch (e) {}
              setIsProfileCompleted(false);
              setUserEmail(email);
              setCurrentScreen('EmailVerification');
            }}
            onGoToLogin={() => setCurrentScreen('Login')}
          />
        );
      
      case 'EmailVerification':
        return (
          <EmailVerificationScreen
            email={userEmail}
            onBack={() => setCurrentScreen('Register')}
            onVerifySuccess={() => setCurrentScreen('PhoneNumber')}
          />
        );
      
      case 'PhoneNumber':
        return (
          <PhoneNumberScreen
            onBack={() => setCurrentScreen('EmailVerification')}
            onContinue={() => setCurrentScreen('ProfileSetup')}
          />
        );
      
      case 'ProfileSetup':
        return (
          <ProfileSetupScreen
            onBack={() => setCurrentScreen('PhoneNumber')}
            initialUserData={{ email: userEmail }}
            onContinue={(profileData) => {
              setCurrentScreen('LanguageSelection');
            }}
          />
        );

      case 'LanguageSelection':
        return (
          <LanguageSelectionScreen
            onBack={() => setCurrentScreen('ProfileSetup')}
            onContinue={(selectedLang) => {
              setCurrentScreen('InterestSelection');
            }}
          />
        );
      
      case 'InterestSelection':
        return (
          <InterestSelectionScreen
            onBack={() => setCurrentScreen('LanguageSelection')}
            onFinish={() => {
              setIsProfileCompleted(true);
              setHasSession(true);
              setCurrentScreen('AllSet');
            }}
          />
        );

      case 'AllSet':
        return (
          <AllSetScreen
            onEnter={() => setCurrentScreen('Home')}
          />
        );
      
      case 'Home':
        return (
          <HomeDashboardScreen 
            onLogout={async () => {
              try {
                await safeStorage.removeItem('user_session');
                await safeStorage.removeItem('user_profile');
              } catch (e) {}
              setHasSession(false);
              setIsProfileCompleted(false);
              setCurrentScreen('GetStarted');
            }} 
            onCreatePress={() => setCurrentScreen('CreateContent')}
            onGoToCommunityManager={() => setCurrentScreen('CommunityManager')}
          />
        );

      case 'CommunityManager':
        return (
          <CommunityManagerScreen
            onBack={() => setCurrentScreen('Home')}
          />
        );
      
      case 'CreateContent':
        return (
          <CreateContentScreen
            onBack={() => setCurrentScreen('Home')}
            onPublish={async (newPost) => {
              try {
                await safeStorage.setItem('new_published_post', JSON.stringify(newPost));
              } catch (e) {}
              setCurrentScreen('Home');
            }}
          />
        );
      
      case 'ForgotPassword':
        return (
          <ForgotPasswordScreen
            onBack={() => setCurrentScreen('Login')}
            onCodeSent={(email) => {
              setUserEmail(email);
              setCurrentScreen('ResetPassword');
            }}
          />
        );
      
      case 'ResetPassword':
        return (
          <ResetPasswordScreen
            email={userEmail}
            onBack={() => setCurrentScreen('ForgotPassword')}
            onResetSuccess={() => setCurrentScreen('Login')}
          />
        );
      
      default:
        return (
          <GetStartedScreen
            onLogin={() => setCurrentScreen('Login')}
            onRegister={() => setCurrentScreen('Register')}
          />
        );
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <ScreenNavigator currentScreen={currentScreen} renderScreen={renderScreen} />
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? 32 : 12,
    paddingBottom: Platform.OS === 'android' ? 12 : 8,
  },
  animatedScreen: {
    flex: 1,
  },
});
