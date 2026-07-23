import React, { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { authService } from '../../services/authService';
import resetPasswordImage from '../../assets/reset_password.png';
import AuthLayout from './AuthLayout';
import { AuthHeader, AuthErrorAlert, AuthInput, AuthButton } from './AuthComponents';

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
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

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
    if (!hasMinLength || !hasUppercase || !hasNumber || !hasSymbol) {
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
      onResetSuccess();
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to reset password.');
    }
  };

  return (
    <AuthLayout
      screenKey="reset-password"
      heroTitle="Create New Password 🔑"
      heroSubtitle="Your new password must be unique and satisfy complexity requirements."
    >
      <div className="w-full max-w-md mx-auto my-auto flex flex-col items-center">
        <div className="w-full">
          <AuthHeader
            title="Reset Password"
            subtitle="Create a new password for your account"
            onBack={onBack}
          />

          <div className="flex justify-center my-3">
            <img
              src={resetPasswordImage}
              alt="Reset Password"
              className="w-24 h-24 md:w-28 md:h-28 object-contain"
            />
          </div>

          <AuthErrorAlert error={error} />

          <form onSubmit={handleSave} className="space-y-3 w-full mt-2">
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Verification Code</label>
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className="w-full py-2.5 px-4 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all text-sm"
              />
            </div>

            <AuthInput
              label="New Password"
              icon={Lock}
              type={secureText ? 'password' : 'text'}
              placeholder="Enter new password"
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
              placeholder="Confirm new password"
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

            {/* Validation Checklist */}
            <div className="text-left bg-gray-50 border border-gray-100 rounded-xl p-3">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Password requirements:</span>
              <div className="grid grid-cols-2 gap-1.5">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className={`w-3.5 h-3.5 transition-colors ${hasMinLength ? 'text-green-500' : 'text-gray-300'}`} />
                  <span className={`text-[11px] transition-colors ${hasMinLength ? 'text-green-700 font-semibold' : 'text-gray-400'}`}>8+ chars</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className={`w-3.5 h-3.5 transition-colors ${hasUppercase ? 'text-green-500' : 'text-gray-300'}`} />
                  <span className={`text-[11px] transition-colors ${hasUppercase ? 'text-green-700 font-semibold' : 'text-gray-400'}`}>1 Uppercase</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className={`w-3.5 h-3.5 transition-colors ${hasNumber ? 'text-green-500' : 'text-gray-300'}`} />
                  <span className={`text-[11px] transition-colors ${hasNumber ? 'text-green-700 font-semibold' : 'text-gray-400'}`}>1 Number</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className={`w-3.5 h-3.5 transition-colors ${hasSymbol ? 'text-green-500' : 'text-gray-300'}`} />
                  <span className={`text-[11px] transition-colors ${hasSymbol ? 'text-green-700 font-semibold' : 'text-gray-400'}`}>1 Symbol</span>
                </div>
              </div>
            </div>

            <AuthButton type="submit" loading={loading} className="mt-4">
              Save Password
            </AuthButton>
          </form>

          <p className="text-sm text-gray-500 text-center mt-5">
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
