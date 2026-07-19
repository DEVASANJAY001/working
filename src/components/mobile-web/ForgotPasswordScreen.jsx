import React, { useState } from 'react';
import { ArrowLeft, Mail } from 'lucide-react';
import { authService } from '../../services/authService';
import forgotPasswordImage from '../../assets/forgot_password.png';

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
    <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white min-h-screen animate-fade-in overflow-y-auto">
      <div className="w-full max-w-md flex flex-col justify-between h-full min-h-[500px]">
        {/* Header */}
        <div>
          <button onClick={onBack} className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center my-6">
          <img
            src={forgotPasswordImage}
            alt="Forgot Password"
            className="w-40 h-40 object-contain mb-6"
          />

          <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
          <p className="text-sm text-gray-400 mt-2 leading-relaxed max-w-xs">
            No worries! Enter your email and we'll send you instructions to reset it.
          </p>

          {/* Error Alert */}
          {error && (
            <div className="w-full mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleContinue} className="w-full mt-8 space-y-4">
            <div className="space-y-1.5 text-left">
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
                  className="w-full py-3 pl-10 pr-4 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-13 rounded-full text-white font-bold text-base bg-gradient-to-r from-violet-600 to-orange-500 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center shadow-lg shadow-violet-500/25 mt-6 disabled:opacity-60 cursor-pointer"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Continue'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-sm text-gray-500 text-center mt-6">
          Remember your password?{' '}
          <span onClick={onGoToLogin} className="text-violet-600 font-bold hover:underline cursor-pointer">
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
