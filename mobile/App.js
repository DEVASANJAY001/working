import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';

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

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Splash');
  const [userEmail, setUserEmail] = useState('');

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
        return <SplashScreen onFinish={() => setCurrentScreen('GetStarted')} />;
      
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
            onLoginSuccess={() => setCurrentScreen('Home')}
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
            onContinue={() => setCurrentScreen('LanguageSelection')}
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
        return <HomeDashboardScreen onLogout={() => setCurrentScreen('GetStarted')} />;
      
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
      
      default:
        return <GetStartedScreen onLogin={() => setCurrentScreen('Login')} onRegister={() => setCurrentScreen('Register')} />;
    }
  };

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
