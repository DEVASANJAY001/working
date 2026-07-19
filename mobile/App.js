import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, Animated, Text, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

import { safeStorage } from './src/utils/storage';

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
  const [isProfileCompleted, setIsProfileCompleted] = useState(false);
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const val = await safeStorage.getItem('user_session');
        const prof = await safeStorage.getItem('user_profile');
        if (val) {
          const parsed = JSON.parse(val);
          if (parsed && parsed.isLoggedIn) {
            setHasSession(true);
            if (prof) {
              const parsedProf = JSON.parse(prof);
              if (parsedProf && parsedProf.isProfileCompleted) {
                setIsProfileCompleted(true);
              }
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

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    // Trigger smooth fade-in and slide-up transition when screen changes
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
            onLoginSuccess={async () => {
              const prof = await safeStorage.getItem('user_profile');
              if (prof) {
                const parsed = JSON.parse(prof);
                if (parsed && parsed.isProfileCompleted) {
                  setHasSession(true);
                  setIsProfileCompleted(true);
                  setCurrentScreen('Home');
                  return;
                }
              }
              setHasSession(true);
              setIsProfileCompleted(false);
              setCurrentScreen('ProfileSetup');
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
          />
        );
      
      case 'CreateContent':
        return (
          <CreateContentScreen
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
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Animated.View 
        style={[
          styles.animatedScreen, 
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
  animatedScreen: {
    flex: 1,
  },
});
