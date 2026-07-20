import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, ActivityIndicator, Animated } from 'react-native';
import { safeStorage } from '../utils/storage';
import { authService } from '../services/authService';

export default function LoginLoadingScreen({ emailOrPhone, onFinish }) {
  const [profilePic, setProfilePic] = useState(null);
  const [profileLetter, setProfileLetter] = useState('?');
  const [showDP, setShowDP] = useState(false);
  
  const dpOpacity = useRef(new Animated.Value(0)).current;
  const fetchedProfileRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function checkAndFetchProfile() {
      try {
        console.log('[LoginLoading] Fetching profile for:', emailOrPhone);
        const profile = await authService.getUserProfile(emailOrPhone);
        if (profile && isMounted) {
          fetchedProfileRef.current = profile;
          if (profile.profileImage) {
            setProfilePic(profile.profileImage);
          } else if (profile.fullName) {
            setProfileLetter(profile.fullName.trim().charAt(0).toUpperCase());
          }
          await safeStorage.setItem('user_profile', JSON.stringify(profile));
        }
      } catch (e) {
        console.log('[LoginLoading] Error checking profile:', e);
      }
    }

    checkAndFetchProfile();

    // 1st Second: Keep user profile hidden, show loading spin. After 1s, fade DP in and hide loader
    const dpTimer = setTimeout(() => {
      if (isMounted && fetchedProfileRef.current) {
        setShowDP(true);
        Animated.timing(dpOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }
    }, 1000);

    // 4th Second: Finish loading and transition to Home/Setup screen
    const finishTimer = setTimeout(() => {
      if (isMounted) {
        onFinish(!!fetchedProfileRef.current, fetchedProfileRef.current);
      }
    }, 4000);

    return () => {
      isMounted = false;
      clearTimeout(dpTimer);
      clearTimeout(finishTimer);
    };
  }, [emailOrPhone]);

  return (
    <ImageBackground
      source={require('../../assets/image.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* White Center Circle Container (Mic Size) */}
        <View style={styles.centerContainer}>
          <View style={styles.circleContainer}>
            {/* If showDP is true, show the profile picture / letters faded in */}
            {showDP ? (
              <Animated.View style={[styles.avatarWrapper, { opacity: dpOpacity }]}>
                {profilePic ? (
                  <Image source={{ uri: profilePic }} style={styles.profileImage} />
                ) : (
                  <View style={styles.letterAvatar}>
                    <Text style={styles.avatarLetter}>{profileLetter}</Text>
                  </View>
                )}
              </Animated.View>
            ) : null}

            {/* Spinning Curved Loading Symbol (only shown for 1st second, then hides when showDP is true) */}
            {!showDP && (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#7C3AED" />
              </View>
            )}
          </View>
          <Text style={styles.loadingText}>
            {showDP ? 'Welcome back!' : 'Verifying account details...'}
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  circleContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    position: 'relative',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  avatarWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 55,
  },
  letterAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 55,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: {
    color: '#FFFFFF',
    fontSize: 44,
    fontWeight: 'bold',
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
});
