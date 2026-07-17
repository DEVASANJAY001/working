import React, { useState, useEffect } from 'react';
import { Mail, Phone, Lock, KeyRound, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';

export default function AuthPage({ onLoginSuccess }) {
  const [tab, setTab] = useState('login'); // 'login' | 'register' | 'forgot'
  const [identifier, setIdentifier] = useState(''); // Email or Phone number
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState('input'); // 'input' | 'verify'
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  // Clear states when toggling tabs
  useEffect(() => {
    setError('');
    setInfo('');
    setOtp('');
    setPassword('');
    setStep('input');
  }, [tab]);

  // Clean validation helper
  const validateIdentifier = (value) => {
    if (!value) return 'Please enter an email address or phone number.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Basic phone format regex (optional + prefix, followed by digits)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    
    if (value.includes('@')) {
      if (!emailRegex.test(value)) return 'Please enter a valid email address.';
    } else {
      // Remove space and dash formatting for check
      const normalized = value.replace(/[\s-()]/g, '');
      if (!phoneRegex.test(normalized)) {
        return 'Please enter a valid phone number (e.g. +1234567890).';
      }
    }
    return '';
  };

  // 1. Submit email or phone to receive OTP (Login or Register)
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    const validationError = validateIdentifier(identifier);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      if (tab === 'login') {
        // Initiate Login
        await authService.signIn({ username: identifier });
        setInfo(`A verification code has been sent to ${identifier}. Use code 123456 for testing.`);
        setStep('verify');
      } else if (tab === 'register') {
        // Initiate Registration
        await authService.signUp({ username: identifier });
        setInfo(`A verification code has been sent to ${identifier}. Use code 123456 for testing.`);
        setStep('verify');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify OTP code (Login or Register)
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (!otp) {
      setError('Please enter the 6-digit confirmation code.');
      return;
    }

    setLoading(true);
    try {
      if (tab === 'login') {
        // Complete custom OTP login
        const session = await authService.mockOtpLoginDirect(identifier, otp);
        onLoginSuccess(session);
      } else if (tab === 'register') {
        // Complete sign up and auto-login
        await authService.confirmSignUp({ username: identifier, confirmationCode: otp });
        const session = await authService.getCurrentUser();
        onLoginSuccess(session);
      }
    } catch (err) {
      setError(err.message || 'Invalid verification code.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Forgot Password request
  const handleForgotPasswordRequest = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    const validationError = validateIdentifier(identifier);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({ username: identifier });
      setInfo(`A password reset code has been sent to ${identifier}. Use code 123456 for testing.`);
      setStep('verify');
    } catch (err) {
      setError(err.message || 'Failed to request password reset.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Reset Password confirmation
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (!otp) {
      setError('Please enter the verification code.');
      return;
    }
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      // Auto-logs user in on success according to specification
      await authService.confirmResetPassword({
        username: identifier,
        confirmationCode: otp,
        newPassword: password
      });
      const session = await authService.getCurrentUser();
      onLoginSuccess(session);
    } catch (err) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  // 5. Google Federated Sign-in
  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await authService.federatedSignIn({ provider: 'Google' });
    } catch (err) {
      setError(err.message || 'Failed to sign in with Google.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F5FBF7]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
        
        {/* Decorative Top Bar */}
        <div className="h-2 bg-gradient-to-r from-emerald-400 via-green-500 to-lime-400"></div>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Simple<span className="text-emerald-600">Auth</span>
            </h1>
            <p className="mt-2 text-sm text-gray-500">Secure passwordless verification</p>
          </div>

          {/* Navigation Tabs (Only show if not verifying code) */}
          {step === 'input' && (
            <div className="flex border-b border-gray-100 mb-6">
              <button
                onClick={() => setTab('login')}
                className={`flex-1 pb-3 text-sm font-semibold transition-colors duration-200 border-b-2 ${
                  tab === 'login'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setTab('register')}
                className={`flex-1 pb-3 text-sm font-semibold transition-colors duration-200 border-b-2 ${
                  tab === 'register'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                Register
              </button>
              <button
                onClick={() => setTab('forgot')}
                className={`flex-1 pb-3 text-sm font-semibold transition-colors duration-200 border-b-2 ${
                  tab === 'forgot'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                Forgot
              </button>
            </div>
          )}

          {/* Error and Success Feedback Alerts */}
          {error && (
            <div className="flex items-center gap-3 p-4 mb-5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm animate-pulse">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {info && (
            <div className="flex items-center gap-3 p-4 mb-5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-500" />
              <span>{info}</span>
            </div>
          )}

          {/* Main Card Forms */}
          {step === 'input' && (
            <div className="space-y-6">
              <form onSubmit={tab === 'forgot' ? handleForgotPasswordRequest : handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Email address or Phone number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {identifier.includes('@') || !identifier ? (
                        <Mail className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Phone className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="name@email.com or +1234567890"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all shadow-md shadow-emerald-600/20 active:scale-95 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : tab === 'forgot' ? (
                    'Send Reset Code'
                  ) : (
                    'Continue'
                  )}
                </button>
              </form>

              {/* Federated Social Logins (Google) - Only for Sign In / Sign Up */}
              {tab !== 'forgot' && (
                <>
                  <div className="relative flex items-center justify-center">
                    <div className="border-t border-gray-100 w-full"></div>
                    <span className="absolute px-3 bg-white text-xs text-gray-400 uppercase tracking-wider">
                      Or continue with
                    </span>
                  </div>

                  <button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-all text-sm active:scale-95"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" width="24" height="24">
                      <path
                        fill="#EA4335"
                        d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 14.98 1 12 1 7.35 1 3.37 3.65 1.43 7.54l3.85 2.99C6.2 7.42 8.87 5.04 12 5.04z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.76 2.91c2.2-2.03 3.67-5.01 3.67-8.66z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.71c-.24-.71-.38-1.47-.38-2.26s.14-1.55.38-2.26L1.43 7.2C.52 9.02 0 11.01 0 13.1s.52 4.08 1.43 5.9l3.85-2.99c-.24-.71-.38-1.47-.38-2.26z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.76-2.91c-1.1.74-2.52 1.18-4.2 1.18-3.13 0-5.8-2.38-6.72-5.49L1.43 16C3.37 19.89 7.35 22.5 12 22.5z"
                      />
                    </svg>
                    Google
                  </button>
                </>
              )}
            </div>
          )}

          {/* Verification Code Submission Screen */}
          {step === 'verify' && (
            <div className="space-y-6">
              <form
                onSubmit={tab === 'forgot' ? handleForgotPasswordSubmit : handleVerifyOtp}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Enter Verification Code
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeyRound className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="e.g. 123456"
                      maxLength={6}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm tracking-widest text-center font-bold"
                      required
                    />
                  </div>
                </div>

                {/* Password field only shown for Forgot Password Flow */}
                {tab === 'forgot' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
                        required
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all shadow-md shadow-emerald-600/20 active:scale-95 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Verify & Authenticate'
                  )}
                </button>
              </form>

              <button
                onClick={() => setStep('input')}
                disabled={loading}
                className="w-full py-2 bg-transparent hover:bg-gray-50 text-gray-500 font-medium rounded-xl transition-all text-xs"
              >
                Go Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
