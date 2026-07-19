import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ImageBackground 
      source={require('../../assets/image.png')} 
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar style="light" />
      <View style={styles.content}>
        {/* Flower / Clover Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoOuter}>
            <View style={styles.logoPetalTop} />
            <View style={styles.logoPetalBottom} />
            <View style={styles.logoPetalLeft} />
            <View style={styles.logoPetalRight} />
            <View style={styles.logoCenter} />
          </View>
        </View>
        
        <Text style={styles.title}>Inspire</Text>
        <Text style={styles.subtitle}>Connect. Share. Inspire.</Text>
      </View>
      
      <Text style={styles.footer}>Powered by DAWNS</Text>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 50,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoOuter: {
    width: 60,
    height: 60,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPetalTop: {
    position: 'absolute',
    top: 0,
    width: 26,
    height: 26,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 13,
    borderBottomRightRadius: 13,
    transform: [{ rotate: '-45deg' }],
  },
  logoPetalBottom: {
    position: 'absolute',
    bottom: 0,
    width: 26,
    height: 26,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 13,
    borderBottomRightRadius: 13,
    transform: [{ rotate: '135deg' }],
  },
  logoPetalLeft: {
    position: 'absolute',
    left: 0,
    width: 26,
    height: 26,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 13,
    borderBottomRightRadius: 13,
    transform: [{ rotate: '225deg' }],
  },
  logoPetalRight: {
    position: 'absolute',
    right: 0,
    width: 26,
    height: 26,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 13,
    borderBottomRightRadius: 13,
    transform: [{ rotate: '45deg' }],
  },
  logoCenter: {
    width: 12,
    height: 12,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#7C3AED',
    borderRadius: 6,
    position: 'absolute',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#F3F4F6',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  loaderContainer: {
    marginTop: 40,
  },
  footer: {
    fontSize: 12,
    color: '#E5E7EB',
    opacity: 0.8,
  },
});
