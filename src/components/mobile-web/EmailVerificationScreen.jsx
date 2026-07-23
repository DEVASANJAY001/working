import React, { useState, useRef, useEffect } from 'react';
import { authService } from '../../services/authService';
import emailVerificationImage from '../../assets/email_verification.png';
import AuthLayout from './AuthLayout';
import { AuthHeader, AuthErrorAlert, AuthButton } from './AuthComponents';

export default function EmailVerificationScreen({ email, onBack, onVerifySuccess }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(45);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputs = useRef([]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (val, index) => {
    const cleanVal = val.replace(/\D/g, '').slice(-1);
    const newCode = [...code];
    newCode[index] = cleanVal;
    setCode(newCode);

    if (cleanVal && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    const fullCode = code.join('');

    if (fullCode.length < 6) {
      setError('Please enter the complete 6-digit code.');
      return;
    }

    setLoading(true);
    try {
      await authService.confirmSignUp({
        username: email || 'design@example.com',
        confirmationCode: fullCode,
      });

      setLoading(false);
      onVerifySuccess();
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Verification failed.');
    }
  };

  const handleResend = async () => {
    if (timer === 0) {
      setTimer(45);
      setError('');
      try {
        await authService.resetPassword({ username: email });
        alert('Verification code resent!');
      } catch (err) {
        setError(err.message || 'Failed to resend code.');
      }
    }
  };

  return (
    <AuthLayout
      screenKey="email-verification"
      heroTitle="Security Verification 🛡️"
      heroSubtitle="Check your email for the verification code to activate your account."
    >
      <div className="w-full max-w-md mx-auto my-auto flex flex-col items-center">
        <div className="w-full">
          <AuthHeader
            title="Verify your email"
            subtitle={
              <span>
                We've sent a code to <strong className="text-gray-800">{email || 'design@example.com'}</strong>
              </span>
            }
            onBack={onBack}
          />

          <div className="flex justify-center my-3">
            <img
              src={emailVerificationImage}
              alt="Verify Email"
              className="w-28 h-28 md:w-32 md:h-32 object-contain"
            />
          </div>

          <AuthErrorAlert error={error} />

          <form onSubmit={handleVerify} className="w-full mt-4">
            <div className="flex justify-between gap-2 max-w-xs mx-auto">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(ref) => (inputs.current[index] = ref)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-11 h-13 text-center text-xl font-bold border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
                />
              ))}
            </div>

            <AuthButton type="submit" loading={loading} className="mt-6">
              Verify Email
            </AuthButton>
          </form>

          <button
            onClick={handleResend}
            disabled={timer > 0}
            className="mt-6 w-full flex items-center justify-center text-sm font-semibold text-gray-400 disabled:opacity-60 cursor-pointer"
          >
            Didn't receive the code?{' '}
            <span className="text-violet-600 font-bold hover:underline ml-1">
              Resend Email {timer > 0 ? `(${formatTimer(timer)})` : ''}
            </span>
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
