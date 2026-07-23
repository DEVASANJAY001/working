import React, { useState } from 'react';
import { Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { authService } from '../../services/authService';
import AuthLayout from './AuthLayout';
import { AuthHeader, AuthErrorAlert, AuthInput, AuthButton, SocialAuthButtons } from './AuthComponents';

export default function LoginScreen({ onBack, onLoginSuccess, onForgotPassword, onGoToRegister }) {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await authService.federatedSignIn('Google');
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setLoading(false);
        onLoginSuccess(currentUser);
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Google sign-in failed.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!emailOrPhone || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const clean = emailOrPhone.trim();
      let username = clean;
      if (!clean.includes('@')) {
        const digits = clean.replace(/\D/g, "");
        username = digits.startsWith("91") ? `+${digits}` : `+91${digits}`;
      } else {
        username = clean.toLowerCase();
      }

      await authService.signIn({ username, password });
      const currentUser = await authService.getCurrentUser();
      setLoading(false);
      onLoginSuccess(currentUser);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'An error occurred during login.');
    }
  };

  return (
    <AuthLayout
      screenKey="login"
      heroTitle="Welcome back! 👋"
      heroSubtitle="Unlock your community and continue sharing what matters to you."
    >
      <div className="w-full max-w-md mx-auto my-auto">
        <AuthHeader
          title="Sign in"
          subtitle="Please enter your credentials below"
          onBack={onBack}
        />

        <AuthErrorAlert error={error} />

        <form onSubmit={handleLogin} className="space-y-4">
          <AuthInput
            label="Email or Phone"
            icon={emailOrPhone && !emailOrPhone.includes('@') ? Phone : Mail}
            placeholder="Enter your email or phone"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            required
          />

          <div>
            <AuthInput
              label="Password"
              icon={Lock}
              type={secureText ? 'password' : 'text'}
              placeholder="Enter your password"
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
            <div className="flex justify-end mt-1.5">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-xs text-violet-600 font-semibold hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          <AuthButton type="submit" loading={loading} className="mt-6">
            Login
          </AuthButton>
        </form>

        <SocialAuthButtons onGoogleSignIn={handleGoogleSignIn} loading={loading} />

        <p className="text-sm text-gray-500 text-center mt-8">
          Don't have an account?{' '}
          <span onClick={onGoToRegister} className="text-violet-600 font-bold hover:underline cursor-pointer">
            Register
          </span>
        </p>
      </div>
    </AuthLayout>
  );
}
