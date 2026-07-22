import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

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
  AllSet: 8,
  Home: 9,
  CommunityManager: 10,
  CreateContent: 10,
};

export default function ScreenNavigator({ currentScreen, renderScreen }) {
  const [screens, setScreens] = useState({
    active: currentScreen,
    exiting: null,
    direction: 'forward',
  });

  const anim = useRef(new Animated.Value(0)).current;

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
      });

      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }).start(() => {
        setScreens(prev => ({
          ...prev,
          exiting: null,
        }));
      });
    }
  }, [currentScreen]);

  const { active, exiting, direction } = screens;

  if (!exiting) {
    return (
      <View style={styles.container}>
        {renderScreen(active)}
      </View>
    );
  }

  // Animation configurations:
  // Forward:
  // - Incoming (active) starts at width (right), slides to 0.
  // - Outgoing (exiting) starts at 0, slides to -width * 0.3 (left).
  // Backward:
  // - Incoming (active) starts at -width * 0.3, slides to 0.
  // - Outgoing (exiting) starts at 0, slides to width.

  const activeTranslateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: direction === 'forward' ? [width, 0] : [-width * 0.3, 0],
  });

  const exitingTranslateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: direction === 'forward' ? [0, -width * 0.3] : [0, width],
  });

  const exitingOpacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.5],
  });

  const activeShadowOpacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: direction === 'forward' ? [0.3, 0] : [0, 0],
  });

  return (
    <View style={styles.container}>
      {/* Exiting Screen (renders behind incoming when moving forward) */}
      <Animated.View
        style={[
          styles.screen,
          {
            transform: [{ translateX: exitingTranslateX }],
            opacity: exitingOpacity,
            zIndex: direction === 'forward' ? 1 : 2,
          },
        ]}
      >
        {renderScreen(exiting)}
      </Animated.View>

      {/* Active Screen */}
      <Animated.View
        style={[
          styles.screen,
          {
            transform: [{ translateX: activeTranslateX }],
            zIndex: direction === 'forward' ? 2 : 1,
            shadowColor: '#000',
            shadowOffset: { width: -2, height: 0 },
            shadowRadius: 5,
            shadowOpacity: activeShadowOpacity,
            elevation: direction === 'forward' ? 5 : 0,
          },
        ]}
      >
        {renderScreen(active)}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  screen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
  },
});
