import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { authService } from '../services/authService';

export default function EmailVerificationScreen({ email, onBack, onVerifySuccess }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(45);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus next input
    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length < 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit code.');
      return;
    }
    setLoading(true);
    try {
      await authService.confirmSignUp(email || 'design@example.com', fullCode);
      setLoading(false);
      onVerifySuccess();
    } catch (error) {
      setLoading(false);
      Alert.alert('Verification Failed', error.message || 'An error occurred during verification.');
    }
  };

  const handleResend = () => {
    if (timer === 0) {
      setTimer(45);
      Alert.alert('Success', 'Verification code resent!');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Content & Illustration */}
      <View style={styles.content}>
        <Image
          source={require('../../assets/email_verification.png')}
          style={styles.illustrationImage}
          resizeMode="contain"
        />

        <Text style={styles.title}>Verify your email</Text>
        <Text style={styles.subtitle}>
          We've sent a verification code to{'\n'}
          <Text style={styles.emailText}>{email || 'design@example.com'}</Text>
        </Text>

        {/* 6 Digit Input Group */}
        <View style={styles.otpContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref)}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              placeholder="0"
              placeholderTextColor="#D1D5DB"
            />
          ))}
        </View>
      </View>

      {/* Button & Resend Footer */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.verifyButton} onPress={handleVerify} disabled={loading}>
          <ImageBackground
            source={require('../../assets/image.png')}
            style={styles.gradientButton}
            resizeMode="cover"
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.verifyButtonText}>Verify Email</Text>
            )}
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handleResend}
          disabled={timer > 0}
          style={styles.resendButton}
        >
          <Text style={[styles.resendText, timer > 0 && styles.resendTextDisabled]}>
            Didn't receive the code?{' '}
            <Text style={styles.resendLink}>
              Resend Email {timer > 0 ? `(${formatTimer(timer)})` : ''}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 50,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  header: {
    height: 48,
    justifyContent: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationImage: {
    width: 180,
    height: 180,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 36,
  },
  emailText: {
    fontWeight: 'bold',
    color: '#1F2937',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  otpInput: {
    width: 46,
    height: 52,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  actionContainer: {
    width: '100%',
  },
  verifyButton: {
    width: '100%',
    height: 54,
    borderRadius: 27,
    overflow: 'hidden',
    marginBottom: 20,
  },
  gradientButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  resendText: {
    fontSize: 14,
    color: '#6B7280',
  },
  resendTextDisabled: {
    color: '#9CA3AF',
  },
  resendLink: {
    color: '#7C3AED',
    fontWeight: 'bold',
  },
});
