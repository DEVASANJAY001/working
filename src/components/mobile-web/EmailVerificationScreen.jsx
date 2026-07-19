import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { authService } from '../../services/authService';
import emailVerificationImage from '../../assets/email_verification.png';

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
    <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white min-h-screen animate-fade-in overflow-y-auto">
      <div className="w-full max-w-md flex flex-col justify-between h-full min-h-[500px]">
        {/* Header */}
        <div>
          <button onClick={onBack} className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
        </div>

        {/* Content & Illustration */}
        <div className="flex-1 flex flex-col items-center justify-center text-center my-6">
          <img
            src={emailVerificationImage}
            alt="Verify Email"
            className="w-40 h-40 object-contain mb-6"
          />

          <h2 className="text-2xl font-bold text-gray-900">Verify your email</h2>
          <p className="text-sm text-gray-400 mt-2 leading-relaxed max-w-xs">
            We've sent a verification code to<br />
            <span className="font-semibold text-gray-800">{email || 'design@example.com'}</span>
          </p>

          {/* Error Alert */}
          {error && (
            <div className="w-full mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Code Inputs */}
          <form onSubmit={handleVerify} className="w-full mt-8">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full h-13 rounded-full text-white font-bold text-base bg-gradient-to-r from-violet-600 to-orange-500 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center shadow-lg shadow-violet-500/25 mt-8 disabled:opacity-60 cursor-pointer"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Verify Email'}
            </button>
          </form>

          <button
            onClick={handleResend}
            disabled={timer > 0}
            className="mt-6 flex items-center justify-center text-sm font-semibold text-gray-400 disabled:opacity-60 cursor-pointer"
          >
            Didn't receive the code?{' '}
            <span className="text-violet-600 font-bold hover:underline ml-1">
              Resend Email {timer > 0 ? `(${formatTimer(timer)})` : ''}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
