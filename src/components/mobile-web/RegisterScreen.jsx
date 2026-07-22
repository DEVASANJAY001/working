import React, { useState } from 'react';
import { Mail, Phone, Lock, Eye, EyeOff, User, ArrowLeft } from 'lucide-react';
import { authService } from '../../services/authService';

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
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-white text-gray-900 animate-fade-in">
      {/* Left side banner */}
      <div className="md:w-1/2 bg-gradient-to-br from-violet-600 via-pink-500 to-orange-500 text-white hidden md:flex flex-col items-center justify-center p-8 text-center select-none relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />

        {/* Flower / Clover Logo */}
        <div className="w-16 h-16 relative flex items-center justify-center mb-4">
          <div className="absolute top-0 w-5.5 h-5.5 bg-white rounded-tl-2xl rounded-br-2xl -rotate-45" />
          <div className="absolute bottom-0 w-5.5 h-5.5 bg-white rounded-tl-2xl rounded-br-2xl rotate-[135deg]" />
          <div className="absolute left-0 w-5.5 h-5.5 bg-white rounded-tl-2xl rounded-br-2xl rotate-[225deg]" />
          <div className="absolute right-0 w-5.5 h-5.5 bg-white rounded-tl-2xl rounded-br-2xl rotate 45" />
          <div className="absolute w-2 h-2 border-2 border-violet-600 rounded-full" />
        </div>

        <h1 className="text-3xl font-extrabold tracking-wider">Start Your Journey 🚀</h1>
        <p className="text-gray-100 text-xs mt-2 tracking-wide max-w-xs leading-relaxed opacity-90">
          Create an account and connect with a fast, modern, and beautiful community portal.
        </p>
      </div>

      {/* Right form side */}
      <div className="flex-1 md:w-1/2 flex flex-col justify-between py-6 px-6 md:px-16 lg:px-24 overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <button onClick={onBack} className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </button>

          {/* Title */}
          <div className="mt-2 mb-4">
            <h2 className="text-2xl font-extrabold text-gray-900">Create your account</h2>
            <p className="text-sm text-gray-400 mt-1">Join us and start your journey</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-gray-400" />
                </span>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full py-2.5 pl-10 pr-4 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-gray-400" />
                </span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full py-2.5 pl-10 pr-4 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all text-sm"
                />
              </div>
            </div>

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
                  onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                  className="flex-1 py-2.5 px-4 border border-gray-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-violet-500 bg-gray-50 focus:bg-white transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-gray-400" />
                </span>
                <input
                  type={secureText ? 'password' : 'text'}
                  placeholder="Create a password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full py-2.5 pl-10 pr-12 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setSecureText(!secureText)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {secureText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-gray-400" />
                </span>
                <input
                  type={secureTextConfirm ? 'password' : 'text'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full py-2.5 pl-10 pr-12 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setSecureTextConfirm(!secureTextConfirm)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {secureTextConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Checkbox */}
            <label className="flex items-start gap-3 mt-4 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="mt-1 accent-violet-600 rounded cursor-pointer"
              />
              <span className="text-xs text-gray-500 leading-normal">
                I agree to the <span className="text-violet-600 font-bold hover:underline">Terms of Service</span> and{' '}
                <span className="text-violet-600 font-bold hover:underline">Privacy Policy</span>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-13 rounded-full text-white font-bold text-base bg-gradient-to-r from-violet-600 to-orange-500 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center shadow-lg shadow-violet-500/25 mt-6 disabled:opacity-60 cursor-pointer"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400 font-semibold">or sign up with</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Social */}
          <div className="flex justify-between gap-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2.5 h-12 border border-gray-200 hover:bg-gray-50 active:scale-[0.98] transition-all rounded-xl text-sm font-bold text-gray-700 bg-white cursor-pointer disabled:opacity-60"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 h-12 border border-gray-200 hover:bg-gray-50 active:scale-[0.98] transition-all rounded-xl text-sm font-bold text-gray-700 bg-white cursor-pointer">
              <span className="w-5 h-5 bg-black rounded-full flex items-center justify-center text-[10px] text-white font-bold">A</span>
              Apple
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-sm text-gray-500 text-center mt-6">
          Already have an account?{' '}
          <span onClick={onGoToLogin} className="text-violet-600 font-bold hover:underline cursor-pointer">
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
