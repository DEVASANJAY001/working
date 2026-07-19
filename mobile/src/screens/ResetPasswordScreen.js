import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image, ImageBackground, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { authService } from '../services/authService';

export default function ResetPasswordScreen({ email, onBack, onResetSuccess, onGoToLogin }) {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [secureTextConfirm, setSecureTextConfirm] = useState(true);
  const [loading, setLoading] = useState(false);

  // Requirement validations
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const handleSave = async () => {
    if (!code || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields (including the verification code).');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    if (!hasMinLength || !hasUppercase || !hasNumber || !hasSymbol) {
      Alert.alert('Error', 'Password does not meet the complexity requirements.');
      return;
    }
    
    setLoading(true);
    try {
      await authService.confirmForgotPassword(email || 'design@example.com', code, password);
      setLoading(false);
      Alert.alert('Success', 'Password Reset Successful!', [
        { text: 'OK', onPress: onResetSuccess }
      ]);
    } catch (error) {
      setLoading(false);
      Alert.alert('Reset Failed', error.message || 'An error occurred during password reset.');
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

      {/* Content */}
      <View style={styles.content}>
        <Image
          source={require('../../assets/reset_password.png')}
          style={styles.illustrationImage}
          resizeMode="contain"
        />

        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Create a new password for your account
        </Text>

        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Verification Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter 6-digit code"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              maxLength={6}
              value={code}
              onChangeText={setCode}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter new password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={secureText}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                <Ionicons
                  name={secureText ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm new password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={secureTextConfirm}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setSecureTextConfirm(!secureTextConfirm)}>
                <Ionicons
                  name={secureTextConfirm ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Validation Indicators */}
          <View style={styles.requirementsContainer}>
            <Text style={styles.reqTitle}>Password must contain:</Text>
            
            <View style={styles.reqRow}>
              <Ionicons 
                name={hasMinLength ? "checkmark-circle" : "ellipse-outline"} 
                size={16} 
                color={hasMinLength ? "#10B981" : "#9CA3AF"} 
              />
              <Text style={[styles.reqText, hasMinLength && styles.reqTextSuccess]}>At least 8 characters</Text>
            </View>

            <View style={styles.reqRow}>
              <Ionicons 
                name={hasUppercase ? "checkmark-circle" : "ellipse-outline"} 
                size={16} 
                color={hasUppercase ? "#10B981" : "#9CA3AF"} 
              />
              <Text style={[styles.reqText, hasUppercase && styles.reqTextSuccess]}>One uppercase letter</Text>
            </View>

            <View style={styles.reqRow}>
              <Ionicons 
                name={hasNumber ? "checkmark-circle" : "ellipse-outline"} 
                size={16} 
                color={hasNumber ? "#10B981" : "#9CA3AF"} 
              />
              <Text style={[styles.reqText, hasNumber && styles.reqTextSuccess]}>One numeric character</Text>
            </View>

            <View style={styles.reqRow}>
              <Ionicons 
                name={hasSymbol ? "checkmark-circle" : "ellipse-outline"} 
                size={16} 
                color={hasSymbol ? "#10B981" : "#9CA3AF"} 
              />
              <Text style={[styles.reqText, hasSymbol && styles.reqTextSuccess]}>One special symbol</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Action Footer */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
          <ImageBackground
            source={require('../../assets/image.png')}
            style={styles.gradientButton}
            resizeMode="cover"
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.saveText}>Save Password</Text>
            )}
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity onPress={onGoToLogin} style={styles.loginLinkButton}>
          <Text style={styles.loginLinkText}>
            Remember your password? <Text style={styles.loginLinkBold}>Login</Text>
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
    marginBottom: 20,
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
    marginBottom: 24,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 52,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 52,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
  },
  passwordInput: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    height: '100%',
  },
  requirementsContainer: {
    marginTop: 8,
  },
  reqTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 8,
  },
  reqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  reqText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 8,
  },
  reqTextSuccess: {
    color: '#10B981',
    fontWeight: '500',
  },
  actionContainer: {
    width: '100%',
    alignItems: 'center',
  },
  saveButton: {
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
  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLinkButton: {
    paddingVertical: 10,
  },
  loginLinkText: {
    fontSize: 14,
    color: '#6B7280',
  },
  loginLinkBold: {
    color: '#7C3AED',
    fontWeight: 'bold',
  },
  formContainer: {
    alignSelf: 'stretch',
  },
});
