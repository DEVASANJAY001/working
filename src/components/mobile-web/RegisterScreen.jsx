import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { authService } from '../../services/authService';
import AuthLayout from './AuthLayout';
import { AuthHeader, AuthErrorAlert, AuthInput, AuthButton, SocialAuthButtons } from './AuthComponents';

export default function RegisterScreen({ onBack, onRegisterSuccess, onGoToLogin, onGoogleSuccess }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [secureTextConfirm, setSecureTextConfirm] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await authService.federatedSignIn('Google');
      setLoading(false);
      if (onGoogleSuccess) {
        onGoogleSuccess();
      } else {
        onGoToLogin();
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Google sign-in failed.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !phoneNumber || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreed) {
      setError('You must agree to the Terms of Service & Privacy Policy.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      const cleanPhone = phoneNumber.replace(/\D/g, "");
      const cognitoPhone = `+91${cleanPhone}`;

      await authService.signUp({
        username: email.trim(),
        password,
        options: {
          userAttributes: {
            email: email.trim(),
            name: fullName.trim(),
            phone_number: cognitoPhone,
          },
        },
      });

      setLoading(false);
      onRegisterSuccess(email.trim());
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Registration failed.');
    }
  };

  return (
    <AuthLayout
      screenKey="register"
      heroTitle="Start Your Journey 🚀"
      heroSubtitle="Create an account and connect with a fast, modern, and beautiful community portal."
    >
      <div className="w-full max-w-md mx-auto my-auto">
        <AuthHeader
          title="Create your account"
          subtitle="Join us and start your journey"
          onBack={onBack}
        />

        <AuthErrorAlert error={error} />

        <form onSubmit={handleRegister} className="space-y-3">
          <AuthInput
            label="Full Name"
            icon={User}
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <AuthInput
            label="Email"
            icon={Mail}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Phone Number</label>
            <div className="flex">
              <div className="px-3 flex items-center rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-xs font-bold text-gray-600">
                🇮🇳 +91
              </div>
              <input
                type="tel"
                maxLength={10}
                placeholder="9876543210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                className="flex-1 py-2.5 px-4 border border-gray-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-violet-500 bg-gray-50 focus:bg-white transition-all text-sm"
              />
            </div>
          </div>

          <AuthInput
            label="Password"
            icon={Lock}
            type={secureText ? 'password' : 'text'}
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            rightElement={
              <button
                type="button"
                onClick={() => setSecureText(!secureText)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                {secureText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          <AuthInput
            label="Confirm Password"
            icon={Lock}
            type={secureTextConfirm ? 'password' : 'text'}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            rightElement={
              <button
                type="button"
                onClick={() => setSecureTextConfirm(!secureTextConfirm)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                {secureTextConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          <label className="flex items-start gap-3 mt-4 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 accent-violet-600 rounded cursor-pointer"
            />
            <span className="text-xs text-gray-500 leading-normal">
              I agree to the <span className="text-violet-600 font-bold hover:underline">Terms of Service</span> and{' '}
              <span className="text-violet-600 font-bold hover:underline">Privacy Policy</span>
            </span>
          </label>

          <AuthButton type="submit" loading={loading} className="mt-5">
            Create Account
          </AuthButton>
        </form>

        <SocialAuthButtons onGoogleSignIn={handleGoogleSignIn} loading={loading} />

        <p className="text-sm text-gray-500 text-center mt-6">
          Already have an account?{' '}
          <span onClick={onGoToLogin} className="text-violet-600 font-bold hover:underline cursor-pointer">
            Login
          </span>
        </p>
      </div>
    </AuthLayout>
  );
}
