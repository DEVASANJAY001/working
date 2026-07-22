import React, { useState, useEffect } from 'react';
import { Hub } from 'aws-amplify/utils';
import { authService } from './services/authService';

// Import Web Screen Components
import SplashScreen from './components/mobile-web/SplashScreen';
import GetStartedScreen from './components/mobile-web/GetStartedScreen';
import LoginScreen from './components/mobile-web/LoginScreen';
import RegisterScreen from './components/mobile-web/RegisterScreen';
import EmailVerificationScreen from './components/mobile-web/EmailVerificationScreen';
import PhoneNumberScreen from './components/mobile-web/PhoneNumberScreen';
import ProfileSetupScreen from './components/mobile-web/ProfileSetupScreen';
import LanguageSelectionScreen from './components/mobile-web/LanguageSelectionScreen';
import InterestSelectionScreen from './components/mobile-web/InterestSelectionScreen';
import HomeDashboardScreen from './components/mobile-web/HomeDashboardScreen';
import ForgotPasswordScreen from './components/mobile-web/ForgotPasswordScreen';
import ResetPasswordScreen from './components/mobile-web/ResetPasswordScreen';
import CreateContentScreen from './components/mobile-web/CreateContentScreen';
import AdminDashboardScreen from './components/mobile-web/AdminDashboardScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Splash');
  const [userEmail, setUserEmail] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Resolve the current user session ──
  async function checkUserSession() {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        if (user.isAdmin || user.role === 'admin') {
          setCurrentScreen('Admin');
        } else {
          setCurrentScreen('Home');
        }
      } else {
        setCurrentUser(null);
        // Only reset to Splash/GetStarted if not on auth sub-screens
        setCurrentScreen(prev => (prev === 'Splash' ? 'GetStarted' : prev));
      }
    } catch (err) {
      setCurrentUser(null);
      setCurrentScreen(prev => (prev === 'Splash' ? 'GetStarted' : prev));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // 1. Check for active session on mount
    checkUserSession();

    // 2. Listen for Amplify auth events (Google OAuth redirects, signs in, etc.)
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
          checkUserSession();
          break;

        case 'signInWithRedirect':
          setLoading(true);
          break;

        case 'signInWithRedirect_failure':
          console.error('OAuth sign-in failed:', payload.data);
          setLoading(false);
          setCurrentScreen('GetStarted');
          break;

        case 'signedOut':
          setCurrentScreen('GetStarted');
          break;

        default:
          break;
      }
    });

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setCurrentScreen('GetStarted');
    } catch (err) {
      setCurrentScreen('GetStarted');
    }
  };

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
            onLoginSuccess={(user) => {
              if (user?.isAdmin || user?.role === 'admin') {
                setCurrentScreen('Admin');
              } else {
                setCurrentScreen('Home');
              }
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
            onGoogleSuccess={() => setCurrentScreen('Home')}
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
      
      case 'Admin':
        return (
          <AdminDashboardScreen
            onLogout={handleLogout}
            onGoToFeed={() => setCurrentScreen('Home')}
            currentUser={currentUser}
          />
        );

      case 'Home':
        return (
          <HomeDashboardScreen 
            onLogout={handleLogout} 
            onCreatePress={() => setCurrentScreen('CreateContent')}
            onGoToAdmin={() => setCurrentScreen('Admin')}
            currentUser={currentUser}
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5FBF7]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-500 font-medium text-sm">Initializing app...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F7F8] flex flex-col font-sans">
      {renderScreen()}
    </div>
  );
}
