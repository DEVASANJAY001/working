import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function GetStartedScreen({ onLogin, onRegister }) {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Illustration Area */}
      <View style={styles.illustrationContainer}>
        <Image
          source={require('../../assets/get_started_community.png')}
          style={styles.illustrationImage}
          resizeMode="contain"
        />
      </View>

      {/* Text Area */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Everything your</Text>
        <Text style={styles.titleBold}>community needs.</Text>
        
        <Text style={styles.subtitle}>
          Join, connect and stay updated with what matters to you.
        </Text>
      </View>

      {/* Buttons Area */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={onLogin}>
          <ImageBackground
            source={require('../../assets/image.png')}
            style={styles.gradientButton}
            resizeMode="cover"
          >
            <Text style={styles.loginText}>Login</Text>
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerButton} onPress={onRegister}>
          <Text style={styles.registerText}>Create Account</Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By continuing, you agree to our{' '}
          <Text style={styles.link}>Privacy Policy</Text> and{' '}
          <Text style={styles.link}>Terms of Service</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 50,
  },
  illustrationContainer: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationImage: {
    width: 280,
    height: 280,
  },
  textContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 26,
    color: '#1F2937',
    textAlign: 'center',
  },
  titleBold: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  loginButton: {
    width: '100%',
    height: 54,
    borderRadius: 27,
    overflow: 'hidden',
    marginBottom: 16,
  },
  gradientButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    width: '100%',
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 24,
  },
  registerText: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  link: {
    color: '#7C3AED',
    textDecorationLine: 'underline',
  },
});
