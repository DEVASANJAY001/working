import React, { useState } from 'react';
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { authService } from '../../services/authService';
import resetPasswordImage from '../../assets/reset_password.png';

export default function ResetPasswordScreen({ email, onBack, onResetSuccess, onGoToLogin }) {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [secureTextConfirm, setSecureTextConfirm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Requirement validations
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumberOrSymbol = /[\d!@#$%^&*(),.?":{}|<>]/.test(password);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    if (!code || !password || !confirmPassword) {
      setError('Please fill in all fields (including the verification code).');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!hasMinLength || !hasUppercase || !hasNumberOrSymbol) {
      setError('Password does not meet the complexity requirements.');
      return;
    }

    setLoading(true);
    try {
      await authService.confirmResetPassword({
        username: email || 'design@example.com',
        confirmationCode: code,
        newPassword: password,
      });

      setLoading(false);
      alert('Password Reset Successful!');
      onResetSuccess();
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to reset password.');
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
        <div className="flex-1 flex flex-col items-center justify-center my-6">
          <img
            src={resetPasswordImage}
            alt="Reset Password"
            className="w-32 h-32 object-contain mb-4"
          />

          <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
          <p className="text-sm text-gray-400 mt-1 leading-relaxed max-w-xs text-center">
            Create a new password for your account
          </p>

          {/* Error Alert */}
          {error && (
            <div className="w-full mt-3 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSave} className="w-full mt-6 space-y-3.5">
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Verification Code</label>
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit code"
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                className="w-full py-2.5 px-4 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all text-sm"
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">New Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-gray-400" />
                </span>
                <input
                  type={secureText ? 'password' : 'text'}
                  placeholder="Enter new password"
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

            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-gray-400" />
                </span>
                <input
                  type={secureTextConfirm ? 'password' : 'text'}
                  placeholder="Confirm new password"
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

            {/* Validation Checklist */}
            <div className="text-left bg-gray-50 border border-gray-100 rounded-xl p-3.5">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-2">Password must contain:</span>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle className={`w-4 h-4 transition-colors ${hasMinLength ? 'text-green-500' : 'text-gray-300'}`} />
                  <span className={`text-xs transition-colors ${hasMinLength ? 'text-green-700 font-semibold' : 'text-gray-400'}`}>At least 8 characters</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className={`w-4 h-4 transition-colors ${hasUppercase ? 'text-green-500' : 'text-gray-300'}`} />
                  <span className={`text-xs transition-colors ${hasUppercase ? 'text-green-700 font-semibold' : 'text-gray-400'}`}>One uppercase letter</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className={`w-4 h-4 transition-colors ${hasNumberOrSymbol ? 'text-green-500' : 'text-gray-300'}`} />
                  <span className={`text-xs transition-colors ${hasNumberOrSymbol ? 'text-green-700 font-semibold' : 'text-gray-400'}`}>One number or symbol</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-13 rounded-full text-white font-bold text-base bg-gradient-to-r from-violet-600 to-orange-500 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center shadow-lg shadow-violet-500/25 mt-4 disabled:opacity-60 cursor-pointer"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Save Password'}
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
