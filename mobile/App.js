import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Animated, Text, TextInput, View, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

import { safeStorage } from './src/utils/storage';
import { getCognitoUserInfo, getStoredTokens } from './src/services/apiService';

// Import Screens
import SplashScreen from './src/screens/SplashScreen';
import GetStartedScreen from './src/screens/GetStartedScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import EmailVerificationScreen from './src/screens/EmailVerificationScreen';
import PhoneNumberScreen from './src/screens/PhoneNumberScreen';
import ProfileSetupScreen from './src/screens/ProfileSetupScreen';
import LanguageSelectionScreen from './src/screens/LanguageSelectionScreen';
import InterestSelectionScreen from './src/screens/InterestSelectionScreen';
import HomeDashboardScreen from './src/screens/HomeDashboardScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import CreateContentScreen from './src/screens/CreateContentScreen';
import CommunitiesScreen from './src/screens/CommunitiesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import DiscoverScreen from './src/screens/DiscoverScreen';

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

patchComponentFont(Text);
patchComponentFont(TextInput);

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Splash');
  const [userEmail, setUserEmail] = useState('');
  const [hasSession, setHasSession] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // logged-in user info

  useEffect(() => {
    async function checkSession() {
      try {
        const val = await safeStorage.getItem('user_session');
        if (val) {
          const parsed = JSON.parse(val);
          if (parsed && parsed.isLoggedIn) {
            setHasSession(true);
            if (parsed.user) {
              setCurrentUser(parsed.user);
            }
          }
        }
        // Also try to refresh user info from Cognito tokens
        const tokens = await getStoredTokens();
        if (tokens?.AccessToken) {
          const freshUser = await getCognitoUserInfo(tokens.AccessToken);
          if (freshUser) {
            setCurrentUser(freshUser);
            // Update stored session
            const sessionStr = await safeStorage.getItem('user_session');
            if (sessionStr) {
              const session = JSON.parse(sessionStr);
              session.user = freshUser;
              await safeStorage.setItem('user_session', JSON.stringify(session));
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
    checkSession();
  }, []);

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(15);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentScreen]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Splash':
        return (
          <SplashScreen 
            onFinish={() => {
              if (hasSession) {
                setCurrentScreen('Home');
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
            onLoginSuccess={(userInfo) => {
              if (userInfo) setCurrentUser(userInfo);
              setCurrentScreen('Home');
            }}
            onForgotPassword={() => setCurrentScreen('ForgotPassword')}
            onGoToRegister={() => setCurrentScreen('Register')}
          />
        );
      
      case 'Register':
        return (
          <RegisterScreen
            onBack={() => setCurrentScreen('GetStarted')}
            onRegisterSuccess={(email) => {
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
            onContinue={(profileData) => {
              if (profileData?.name) {
                setCurrentUser(prev => ({ ...prev, ...profileData }));
              }
              setCurrentScreen('LanguageSelection');
            }}
          />
        );
      
      case 'LanguageSelection':
        return (
          <LanguageSelectionScreen
            onBack={() => setCurrentScreen('ProfileSetup')}
            onContinue={() => setCurrentScreen('InterestSelection')}
          />
        );
      
      case 'InterestSelection':
        return (
          <InterestSelectionScreen
            onBack={() => setCurrentScreen('LanguageSelection')}
            onFinish={() => setCurrentScreen('Home')}
          />
        );
      
      case 'Home':
        return (
          <HomeDashboardScreen 
            currentUser={currentUser}
            onLogout={async () => {
              try {
                await safeStorage.removeItem('user_session');
                await safeStorage.removeItem('auth_tokens');
              } catch (e) {}
              setHasSession(false);
              setCurrentUser(null);
              setCurrentScreen('GetStarted');
            }} 
            onCreatePress={() => setCurrentScreen('CreateContent')}
            onNavigate={(screen) => setCurrentScreen(screen)}
          />
        );
      
      case 'CreateContent':
        return (
          <CreateContentScreen
            currentUser={currentUser}
            onBack={() => setCurrentScreen('Home')}
            onPublish={(newPost) => {
              setCurrentScreen('Home');
            }}
          />
        );
      
      case 'ForgotPassword':
        return (
          <ForgotPasswordScreen
            onBack={() => setCurrentScreen('Login')}
            onContinue={(email) => {
              setUserEmail(email);
              setCurrentScreen('ResetPassword');
            }}
            onGoToLogin={() => setCurrentScreen('Login')}
          />
        );
      
      case 'ResetPassword':
        return (
          <ResetPasswordScreen
            email={userEmail}
            onBack={() => setCurrentScreen('ForgotPassword')}
            onResetSuccess={() => setCurrentScreen('Login')}
            onGoToLogin={() => setCurrentScreen('Login')}
          />
        );
      
      case 'Communities':
        return (
          <CommunitiesScreen
            currentUser={currentUser}
            onBack={() => setCurrentScreen('Home')}
          />
        );

      case 'Profile':
        return (
          <ProfileScreen
            currentUser={currentUser}
            onBack={() => setCurrentScreen('Home')}
            onLogout={async () => {
              try {
                await safeStorage.removeItem('user_session');
                await safeStorage.removeItem('auth_tokens');
              } catch (e) {}
              setHasSession(false);
              setCurrentUser(null);
              setCurrentScreen('GetStarted');
            }}
          />
        );

      case 'Messages':
        return (
          <MessagesScreen
            currentUser={currentUser}
            onBack={() => setCurrentScreen('Home')}
          />
        );

      case 'Notifications':
        return (
          <NotificationsScreen
            currentUser={currentUser}
            onBack={() => setCurrentScreen('Home')}
          />
        );

      case 'Discover':
        return (
          <DiscoverScreen
            currentUser={currentUser}
            onBack={() => setCurrentScreen('Home')}
          />
        );
      
      default:
        return <GetStartedScreen onLogin={() => setCurrentScreen('Login')} onRegister={() => setCurrentScreen('Register')} />;
    }
  };

  if (!fontsLoaded) {
    return <SplashScreen onFinish={() => {}} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Animated.View 
        style={[
          styles.screenContainer, 
          { 
            opacity: fadeAnim, 
            transform: [{ translateY: slideAnim }] 
          }
        ]}
      >
        {renderScreen()}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  screenContainer: {
    flex: 1,
  },
});
