import React, { useState, useEffect, useCallback } from 'react';
import { Hub } from 'aws-amplify/utils';
import { authService } from './services/authService';
import { adminStore } from './services/adminStore';
import { AuthProvider } from './auth/AuthProvider';
import { ROLES } from './constants/roles';
import { canAccessAdmin } from './utils/permissions';

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
import UserProfileScreen from './components/mobile-web/UserProfileScreen';
import SettingsScreen from './components/mobile-web/SettingsScreen';
import NotificationsScreen from './components/mobile-web/NotificationsScreen';

// ── URL ↔ Screen mapping ──────────────────────────────────
const SCREEN_TO_PATH = {
  GetStarted: '/',
  Login: '/login',
  Register: '/register',
  EmailVerification: '/verify-email',
  PhoneNumber: '/phone',
  ProfileSetup: '/profile-setup',
  LanguageSelection: '/language',
  InterestSelection: '/interests',
  Home: '/home',
  Admin: '/admin',
  CreateContent: '/create',
  ForgotPassword: '/forgot-password',
  ResetPassword: '/reset-password',
  Profile: '/profile',
  Settings: '/settings',
  Notifications: '/notifications',
};

function pathToScreen(pathname) {
  const map = {
    '/': 'GetStarted',
    '/login': 'Login',
    '/register': 'Register',
    '/verify-email': 'EmailVerification',
    '/phone': 'PhoneNumber',
    '/profile-setup': 'ProfileSetup',
    '/language': 'LanguageSelection',
    '/interests': 'InterestSelection',
    '/home': 'Home',
    '/admin': 'Admin',
    '/create': 'CreateContent',
    '/forgot-password': 'ForgotPassword',
    '/reset-password': 'ResetPassword',
    '/profile': 'Profile',
    '/settings': 'Settings',
    '/notifications': 'Notifications',
  };
  // Handle admin sub-paths like /admin/users, /admin/reports
  if (pathname.startsWith('/admin')) return 'Admin';
  return map[pathname] || null;
}

// ── Auth Screens (do NOT require login) ───────────────────
const AUTH_SCREENS = new Set([
  'Splash', 'GetStarted', 'Login', 'Register',
  'ForgotPassword', 'ResetPassword',
]);

// ── Screens that require authentication ───────────────────
const PROTECTED_SCREENS = new Set([
  'Home', 'Admin', 'CreateContent', 'Profile', 'Settings', 'Notifications',
  'EmailVerification', 'PhoneNumber',
  'ProfileSetup', 'LanguageSelection', 'InterestSelection',
]);

// ── Admin-only screens ────────────────────────────────────
const ADMIN_SCREENS = new Set(['Admin']);

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState('Splash');
  const [userEmail, setUserEmail] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settingsTab, setSettingsTab] = useState('Account');

  // ── Navigate to a screen and sync URL ───────────────────
  const navigateTo = useCallback((screen) => {
    setCurrentScreen(screen);
    const path = SCREEN_TO_PATH[screen];
    if (path && window.location.pathname !== path) {
      window.history.pushState({ screen }, '', path);
    }
  }, []);

  // ── Resolve the current user session ──
  async function checkUserSession() {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        setCurrentUser(user);

        // Determine target screen based on URL and role
        const urlScreen = pathToScreen(window.location.pathname);
        const userRole = user.role;

        if (urlScreen && ADMIN_SCREENS.has(urlScreen)) {
          // URL requests admin screen — verify permission
          if (canAccessAdmin(userRole)) {
            navigateTo('Admin');
          } else {
            navigateTo('Home');
          }
        } else if (urlScreen && PROTECTED_SCREENS.has(urlScreen)) {
          navigateTo(urlScreen);
        } else if (user.isAdmin || user.role === ROLES.SUPER_ADMIN || user.role === ROLES.ADMIN) {
          navigateTo('Admin');
        } else {
          navigateTo('Home');
        }
      } else {
        setCurrentUser(null);
        // Parse URL for auth screens
        const urlScreen = pathToScreen(window.location.pathname);
        if (urlScreen && AUTH_SCREENS.has(urlScreen)) {
          navigateTo(urlScreen);
        } else {
          setCurrentScreen(prev => (prev === 'Splash' ? 'GetStarted' : prev));
        }
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
          setLoading(false);
          navigateTo('GetStarted');
          break;

        case 'signedOut':
          navigateTo('GetStarted');
          break;

        default:
          break;
      }
    });

    // 3. Listen for browser back/forward navigation
    const handlePopState = (event) => {
      const screen = event.state?.screen || pathToScreen(window.location.pathname);
      if (screen) {
        // Enforce access control on back/forward
        if (ADMIN_SCREENS.has(screen) && currentUser && !canAccessAdmin(currentUser.role)) {
          navigateTo('Home');
          return;
        }
        if (PROTECTED_SCREENS.has(screen) && !currentUser) {
          navigateTo('Login');
          return;
        }
        setCurrentScreen(screen);
      }
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      unsubscribe();
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const checkBanStatus = () => {
      if (currentUser?.email && adminStore.isUserBanned(currentUser.email)) {
        handleLogout();
      }
    };

    checkBanStatus();
    const unsubBan = adminStore.subscribeBannedUsers(() => {
      checkBanStatus();
    });

    return () => unsubBan();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setCurrentUser(null);
      navigateTo('GetStarted');
    } catch (err) {
      setCurrentUser(null);
      navigateTo('GetStarted');
    }
  };

  const renderScreen = () => {
    // ── Route guard: protect admin screens ─────────────────
    if (ADMIN_SCREENS.has(currentScreen)) {
      if (!currentUser || !canAccessAdmin(currentUser.role)) {
        // Redirect silently — no admin content rendered
        setTimeout(() => {
          if (currentUser) {
            navigateTo('Home');
          } else {
            navigateTo('Login');
          }
        }, 0);
        return null;
      }
    }

    // ── Route guard: protect authenticated screens ────────
    if (PROTECTED_SCREENS.has(currentScreen) && !currentUser) {
      setTimeout(() => navigateTo('Login'), 0);
      return null;
    }

    switch (currentScreen) {
      case 'Splash':
        return <SplashScreen onFinish={() => navigateTo('GetStarted')} />;

      case 'GetStarted':
        return (
          <GetStartedScreen
            onLogin={() => navigateTo('Login')}
            onRegister={() => navigateTo('Register')}
          />
        );

      case 'Login':
        return (
          <LoginScreen
            onBack={() => navigateTo('GetStarted')}
            onLoginSuccess={(user) => {
              setCurrentUser(user);
              if (user?.isAdmin || user?.role === ROLES.SUPER_ADMIN || user?.role === ROLES.ADMIN) {
                navigateTo('Admin');
              } else {
                navigateTo('Home');
              }
            }}
            onForgotPassword={() => navigateTo('ForgotPassword')}
            onGoToRegister={() => navigateTo('Register')}
          />
        );

      case 'Register':
        return (
          <RegisterScreen
            onBack={() => navigateTo('GetStarted')}
            onRegisterSuccess={(email) => {
              setUserEmail(email);
              navigateTo('EmailVerification');
            }}
            onGoToLogin={() => navigateTo('Login')}
            onGoogleSuccess={() => navigateTo('Home')}
          />
        );

      case 'EmailVerification':
        return (
          <EmailVerificationScreen
            email={userEmail}
            onBack={() => navigateTo('Register')}
            onVerifySuccess={() => navigateTo('PhoneNumber')}
          />
        );

      case 'PhoneNumber':
        return (
          <PhoneNumberScreen
            onBack={() => navigateTo('EmailVerification')}
            onContinue={() => navigateTo('ProfileSetup')}
          />
        );

      case 'ProfileSetup':
        return (
          <ProfileSetupScreen
            onBack={() => navigateTo('PhoneNumber')}
            onContinue={() => navigateTo('LanguageSelection')}
          />
        );

      case 'LanguageSelection':
        return (
          <LanguageSelectionScreen
            onBack={() => navigateTo('ProfileSetup')}
            onContinue={() => navigateTo('InterestSelection')}
          />
        );

      case 'InterestSelection':
        return (
          <InterestSelectionScreen
            onBack={() => navigateTo('LanguageSelection')}
            onFinish={() => navigateTo('Home')}
          />
        );

      case 'Admin':
        return (
          <AdminDashboardScreen
            onLogout={handleLogout}
            onGoToFeed={() => navigateTo('Home')}
            currentUser={currentUser}
          />
        );

      case 'Home':
        return (
          <HomeDashboardScreen
            onLogout={handleLogout}
            onCreatePress={() => navigateTo('CreateContent')}
            onGoToAdmin={() => navigateTo('Admin')}
            currentUser={currentUser}
            onViewProfile={() => navigateTo('Profile')}
          />
        );

      case 'Profile':
        return (
          <UserProfileScreen
            currentUser={currentUser}
            onLogout={handleLogout}
            onCreatePress={() => navigateTo('CreateContent')}
            onGoToAdmin={() => navigateTo('Admin')}
            onGoToFeed={() => navigateTo('Home')}
            onGoToSettings={(tab) => {
              setSettingsTab(tab);
              navigateTo('Settings');
            }}
          />
        );

      case 'Settings':
        return (
          <SettingsScreen
            currentUser={currentUser}
            onLogout={handleLogout}
            onCreatePress={() => navigateTo('CreateContent')}
            onGoToAdmin={() => navigateTo('Admin')}
            onGoToFeed={() => navigateTo('Home')}
            initialTab={settingsTab}
          />
        );

      case 'Notifications':
        return (
          <NotificationsScreen
            currentUser={currentUser}
            onLogout={handleLogout}
            onCreatePress={() => navigateTo('CreateContent')}
            onGoToAdmin={() => navigateTo('Admin')}
            onGoToFeed={() => navigateTo('Home')}
            onViewProfile={() => navigateTo('Profile')}
          />
        );

      case 'CreateContent':
        return (
          <CreateContentScreen
            onBack={() => navigateTo('Home')}
            onPublish={(newPost) => {
              navigateTo('Home');
            }}
          />
        );

      case 'ForgotPassword':
        return (
          <ForgotPasswordScreen
            onBack={() => navigateTo('Login')}
            onContinue={(email) => {
              setUserEmail(email);
              navigateTo('ResetPassword');
            }}
            onGoToLogin={() => navigateTo('Login')}
          />
        );

      case 'ResetPassword':
        return (
          <ResetPasswordScreen
            email={userEmail}
            onBack={() => navigateTo('ForgotPassword')}
            onResetSuccess={() => navigateTo('Login')}
            onGoToLogin={() => navigateTo('Login')}
          />
        );

      default:
        return <GetStartedScreen onLogin={() => navigateTo('Login')} onRegister={() => navigateTo('Register')} />;
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

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
