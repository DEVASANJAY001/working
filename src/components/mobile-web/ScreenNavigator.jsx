import React, { useState, useEffect } from 'react';
import './ScreenNavigator.css';

const SCREEN_DEPTHS = {
  Splash: 0,
  GetStarted: 1,
  Login: 2,
  Register: 2,
  ForgotPassword: 3,
  ResetPassword: 4,
  EmailVerification: 3,
  PhoneNumber: 4,
  ProfileSetup: 5,
  LanguageSelection: 6,
  InterestSelection: 7,
  Home: 9,
  CreateContent: 10,
};

export default function ScreenNavigator({ currentScreen, renderScreen }) {
  const [screens, setScreens] = useState({
    active: currentScreen,
    exiting: null,
    direction: 'forward',
    animating: false,
  });

  useEffect(() => {
    if (currentScreen !== screens.active) {
      const prevScreen = screens.active;
      const nextScreen = currentScreen;

      const prevDepth = SCREEN_DEPTHS[prevScreen] ?? 0;
      const nextDepth = SCREEN_DEPTHS[nextScreen] ?? 0;
      const direction = nextDepth >= prevDepth ? 'forward' : 'backward';

      setScreens({
        active: nextScreen,
        exiting: prevScreen,
        direction,
        animating: true,
      });

      const timer = setTimeout(() => {
        setScreens(prev => ({
          ...prev,
          exiting: null,
          animating: false,
        }));
      }, 350);

      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const { active, exiting, direction, animating } = screens;

  if (!exiting) {
    return (
      <div className="web-navigator-container">
        {renderScreen(active)}
      </div>
    );
  }

  return (
    <div className="web-navigator-container">
      {/* Exiting Screen */}
      <div
        className={`web-screen exiting ${direction} ${animating ? 'active-transition' : ''}`}
      >
        {renderScreen(exiting)}
      </div>

      {/* Active Screen */}
      <div
        className={`web-screen entering ${direction} ${animating ? 'active-transition' : ''}`}
      >
        {renderScreen(active)}
      </div>
    </div>
  );
}
