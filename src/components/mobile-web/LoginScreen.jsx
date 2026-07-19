import React, { useState } from 'react';
import { Mail, Phone, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { authService } from '../../services/authService';

export default function LoginScreen({ onBack, onLoginSuccess, onForgotPassword, onGoToRegister }) {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-white text-gray-900 animate-fade-in">
      {/* Left Banner on Desktop */}
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
        
        <h1 className="text-3xl font-extrabold tracking-wider">Welcome back! 👋</h1>
        <p className="text-gray-100 text-xs mt-2 tracking-wide max-w-xs leading-relaxed opacity-90">
          Unlock your community and continue sharing what matters to you.
        </p>
      </div>

      {/* Right Form Container */}
      <div className="flex-1 md:w-1/2 flex flex-col justify-between py-8 px-6 md:px-16 lg:px-24 overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          {/* Header */}
          <button onClick={onBack} className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
          
          {/* Welcome Title */}
          <div className="mt-4 mb-6">
            <h2 className="text-2xl font-extrabold text-gray-900">Sign in</h2>
            <p className="text-sm text-gray-400 mt-1">Please enter your credentials below</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Email or Phone</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  {emailOrPhone && !emailOrPhone.includes('@') ? (
                    <Phone className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Mail className="w-4 h-4 text-gray-400" />
                  )}
                </span>
                <input
                  type="text"
                  placeholder="Enter your email or phone"
                  value={emailOrPhone}
                  onChange={e => setEmailOrPhone(e.target.value)}
                  className="w-full py-3 pl-10 pr-4 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-gray-400" />
                </span>
                <input
                  type={secureText ? 'password' : 'text'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full py-3 pl-10 pr-12 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setSecureText(!secureText)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {secureText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-xs text-violet-600 font-semibold hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-13 rounded-full text-white font-bold text-base bg-gradient-to-r from-violet-600 to-orange-500 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center shadow-lg shadow-violet-500/25 mt-6 disabled:opacity-60 cursor-pointer"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Login'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400 font-semibold">or continue with</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Social */}
          <div className="flex justify-between gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 h-12 border border-gray-200 hover:bg-gray-50 active:scale-[0.98] transition-all rounded-xl text-sm font-bold text-gray-700 bg-white cursor-pointer">
              <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-[10px] text-red-600 font-bold">G</span>
              Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 h-12 border border-gray-200 hover:bg-gray-50 active:scale-[0.98] transition-all rounded-xl text-sm font-bold text-gray-700 bg-white cursor-pointer">
              <span className="w-5 h-5 bg-black rounded-full flex items-center justify-center text-[10px] text-white font-bold">A</span>
              Apple
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-sm text-gray-500 text-center mt-8">
          Don't have an account?{' '}
          <span onClick={onGoToRegister} className="text-violet-600 font-bold hover:underline cursor-pointer">
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
