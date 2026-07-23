import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { authService } from '../../services/authService';
import forgotPasswordImage from '../../assets/forgot_password.png';
import AuthLayout from './AuthLayout';
import { AuthHeader, AuthErrorAlert, AuthInput, AuthButton } from './AuthComponents';

export default function ForgotPasswordScreen({ onBack, onContinue, onGoToLogin }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({ username: email.trim() });
      setLoading(false);
      onContinue(email.trim());
    } catch (err) {
      setLoading(false);
      setError(err.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <AuthLayout
      screenKey="forgot-password"
      heroTitle="Reset Password 🔒"
      heroSubtitle="Don't worry, we'll help you get back into your account securely."
    >
      <div className="w-full max-w-md mx-auto my-auto flex flex-col items-center">
        <div className="w-full">
          <AuthHeader
            title="Forgot Password?"
            subtitle="Enter your email and we'll send instructions to reset it."
            onBack={onBack}
          />

          <div className="flex justify-center my-4">
            <img
              src={forgotPasswordImage}
              alt="Forgot Password"
              className="w-32 h-32 md:w-36 md:h-36 object-contain"
            />
          </div>

          <AuthErrorAlert error={error} />

          <form onSubmit={handleContinue} className="space-y-4 w-full mt-2">
            <AuthInput
              label="Email"
              icon={Mail}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <AuthButton type="submit" loading={loading} className="mt-6">
              Continue
            </AuthButton>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            Remember your password?{' '}
            <span onClick={onGoToLogin} className="text-violet-600 font-bold hover:underline cursor-pointer">
              Login
            </span>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
