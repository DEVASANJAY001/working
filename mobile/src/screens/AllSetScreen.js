import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ImageBackground, 
  TouchableOpacity, 
  Animated, 
  Easing 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

const bgImage = require('../../assets/image.png');

export default function AllSetScreen({ onEnter }) {
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const fadeOutAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Entrance animation: Scale up checkmark and fade in text
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Auto transition after 2 seconds (2000ms) with smooth fade out
    const timer = setTimeout(() => {
      handleEnter();
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    Animated.timing(fadeOutAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
      easing: Easing.out(Easing.quad),
    }).start(() => {
      if (onEnter) onEnter();
    });
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeOutAnim }]}>
      <StatusBar style="light" />
      
      <ImageBackground 
        source={bgImage} 
        style={styles.bgImage}
        resizeMode="cover"
      >
        <LinearGradient 
          colors={['rgba(15, 23, 42, 0.75)', 'rgba(88, 28, 135, 0.85)']} 
          style={styles.gradientOverlay}
        >
          <Animated.View 
            style={[
              styles.content, 
              { 
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim 
              }
            ]}
          >
            {/* Animated Checkmark Badge */}
            <LinearGradient colors={['#7C3AED', '#F97316']} style={styles.checkmarkBadge}>
              <View style={styles.innerBadge}>
                <Ionicons name="checkmark-done-sharp" size={64} color="#FFFFFF" />
              </View>
            </LinearGradient>

            <Text style={styles.title}>You're All Set! 🎉</Text>
            <Text style={styles.subtitle}>Your profile is ready. Welcome to your personalized workspace & community feed!</Text>

            {/* Manual Enter Button */}
            <TouchableOpacity style={styles.enterButton} onPress={handleEnter} activeOpacity={0.8}>
              <LinearGradient colors={['#7C3AED', '#F97316']} style={styles.enterGradient}>
                <Text style={styles.enterText}>Enter App Now</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </LinearGradient>
      </ImageBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  checkmarkBadge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#7C3AED',
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    marginBottom: 28,
  },
  innerBadge: {
    width: '100%',
    height: '100%',
    borderRadius: 58,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 36,
    paddingHorizontal: 16,
  },
  enterButton: {
    width: '85%',
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    elevation: 4,
  },
  enterGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  enterText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
