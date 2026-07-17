import React, { useState } from 'react';
import {
  Mail, Phone, Lock, ArrowRight, ArrowLeft,
  Eye, EyeOff, CheckCircle2, AlertCircle,
  Smartphone, RefreshCw, ShieldCheck
} from 'lucide-react';
import { authService } from '../services/authService';

/* ─────────────────── Shared helpers ─────────────────── */
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
    <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 14.98 1 12 1 7.35 1 3.37 3.65 1.43 7.54l3.85 2.99C6.2 7.42 8.87 5.04 12 5.04z"/>
    <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.76 2.91c2.2-2.03 3.67-5.01 3.67-8.66z"/>
    <path fill="#FBBC05" d="M5.28 14.71c-.24-.71-.38-1.47-.38-2.26s.14-1.55.38-2.26L1.43 7.2C.52 9.02 0 11.01 0 13.1s.52 4.08 1.43 5.9l3.85-2.99z"/>
    <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.76-2.91c-1.1.74-2.52 1.18-4.2 1.18-3.13 0-5.8-2.38-6.72-5.49L1.43 16C3.37 19.89 7.35 22.5 12 22.5z"/>
  </svg>
);

const Logo = () => (
  <div className="flex items-center justify-center gap-2 mb-2">
    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
      <ShieldCheck className="w-5 h-5 text-white" />
    </div>
    <span className="text-2xl font-bold text-gray-900 tracking-tight">
      Simple<span className="text-emerald-600">Auth</span>
    </span>
  </div>
);

const Alert = ({ type, message }) => {
  if (!message) return null;
  const styles = type === 'error'
    ? 'bg-red-50 border-red-200 text-red-700'
    : 'bg-emerald-50 border-emerald-200 text-emerald-700';
  const Icon = type === 'error' ? AlertCircle : CheckCircle2;
  const iconStyle = type === 'error' ? 'text-red-500' : 'text-emerald-500';
  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm ${styles}`}>
      <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${iconStyle}`} />
      <span>{message}</span>
    </div>
  );
};

const InputField = ({ label, id, type = 'text', icon: Icon, value, onChange, placeholder, maxLength, autoFocus, rightElement, hint }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Icon className="w-4.5 h-4.5 text-gray-400 w-[18px] h-[18px]" />
        </div>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        autoFocus={autoFocus}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} ${rightElement ? 'pr-12' : 'pr-4'} py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 hover:border-gray-300`}
        required
      />
      {rightElement && (
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
          {rightElement}
        </div>
      )}
    </div>
    {hint && <p className="text-xs text-gray-400">{hint}</p>}
  </div>
);

const PrimaryBtn = ({ children, loading, disabled, onClick, type = 'submit' }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={loading || disabled}
    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-xl text-sm shadow-md shadow-emerald-600/25 transition-all duration-150 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
  >
    {loading
      ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      : children}
  </button>
);

const Divider = ({ label = 'or continue with' }) => (
  <div className="flex items-center gap-3">
    <div className="flex-1 h-px bg-gray-100" />
    <span className="text-xs text-gray-400 font-medium whitespace-nowrap">{label}</span>
    <div className="flex-1 h-px bg-gray-100" />
  </div>
);

const GoogleBtn = ({ onClick, loading }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-gray-200 hover:bg-gray-50 active:bg-gray-100 text-gray-700 font-medium rounded-xl text-sm transition-all duration-150 active:scale-[0.98] disabled:opacity-60"
  >
    <GoogleIcon />
    <span>Continue with Google</span>
  </button>
);

const BackBtn = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors duration-150 mb-4"
  >
    <ArrowLeft className="w-4 h-4" />
    Back
  </button>
);

const validateIdentifier = (value) => {
  if (!value?.trim()) return 'Please enter your email address or phone number.';
  if (value.includes('@')) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address.';
  } else {
    const n = value.replace(/[\s\-()]/g, '');
    if (!/^\+?[1-9]\d{6,14}$/.test(n)) return 'Please enter a valid phone number (e.g. +91 9876543210).';
  }
  return '';
};

/* ─────────────────── Main export ─────────────────── */
export default function AuthPage({ onLoginSuccess }) {
  // screen: 'welcome' | 'signin' | 'signin-otp' | 'signup' | 'signup-otp' | 'forgot' | 'forgot-otp'
  const [screen, setScreen] = useState('welcome');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const clearFeedback = () => { setError(''); setInfo(''); };
  const goTo = (s) => { clearFeedback(); setOtp(''); setPassword(''); setScreen(s); };

  /* ── Handlers ── */
  const handleGoogleSignIn = async () => {
    clearFeedback();
    setLoading(true);
    try { await authService.federatedSignIn({ provider: 'Google' }); }
    catch (e) { setError(e.message || 'Google Sign-In failed.'); setLoading(false); }
  };

  const handleSendSignInOtp = async (e) => {
    e.preventDefault(); clearFeedback();
    const ve = validateIdentifier(identifier);
    if (ve) { setError(ve); return; }
    setLoading(true);
    try {
      await authService.signIn({ username: identifier });
      setInfo(`Verification code sent to ${identifier}. (Use 123456 for demo)`);
      goTo('signin-otp');
    } catch (err) { setError(err.message || 'Failed to send code.'); }
    finally { setLoading(false); }
  };

  const handleVerifySignInOtp = async (e) => {
    e.preventDefault(); clearFeedback();
    if (otp.length < 4) { setError('Please enter the full verification code.'); return; }
    setLoading(true);
    try {
      const session = await authService.mockOtpLoginDirect(identifier, otp);
      onLoginSuccess(session);
    } catch (err) { setError(err.message || 'Invalid code. Please try again.'); }
    finally { setLoading(false); }
  };

  const handleSendSignUpOtp = async (e) => {
    e.preventDefault(); clearFeedback();
    const ve = validateIdentifier(identifier);
    if (ve) { setError(ve); return; }
    setLoading(true);
    try {
      await authService.signUp({ username: identifier });
      setInfo(`Verification code sent to ${identifier}. (Use 123456 for demo)`);
      goTo('signup-otp');
    } catch (err) { setError(err.message || 'Failed to create account.'); }
    finally { setLoading(false); }
  };

  const handleVerifySignUpOtp = async (e) => {
    e.preventDefault(); clearFeedback();
    if (otp.length < 4) { setError('Please enter the full verification code.'); return; }
    setLoading(true);
    try {
      await authService.confirmSignUp({ username: identifier, confirmationCode: otp });
      const session = await authService.getCurrentUser();
      onLoginSuccess(session);
    } catch (err) { setError(err.message || 'Invalid code.'); }
    finally { setLoading(false); }
  };

  const handleForgotRequest = async (e) => {
    e.preventDefault(); clearFeedback();
    const ve = validateIdentifier(identifier);
    if (ve) { setError(ve); return; }
    setLoading(true);
    try {
      await authService.resetPassword({ username: identifier });
      setInfo(`Reset code sent to ${identifier}. (Use 123456 for demo)`);
      goTo('forgot-otp');
    } catch (err) { setError(err.message || 'Failed to send reset code.'); }
    finally { setLoading(false); }
  };

  const handleForgotConfirm = async (e) => {
    e.preventDefault(); clearFeedback();
    if (otp.length < 4) { setError('Please enter the verification code.'); return; }
    if (!password || password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      await authService.confirmResetPassword({ username: identifier, confirmationCode: otp, newPassword: password });
      const session = await authService.getCurrentUser();
      onLoginSuccess(session);
    } catch (err) { setError(err.message || 'Failed to reset password.'); }
    finally { setLoading(false); }
  };

  /* ── Layout wrapper ── */
  const Card = ({ children, wide }) => (
    <div className="min-h-screen bg-gradient-to-br from-[#F0FAF4] via-white to-[#E8F5FF] flex flex-col items-center justify-center p-4">
      <div className={`w-full ${wide ? 'max-w-lg' : 'max-w-md'} bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 overflow-hidden`}>
        {children}
      </div>
    </div>
  );

  const CardBody = ({ children }) => <div className="px-8 pb-8 pt-6 space-y-5">{children}</div>;

  const CardTop = ({ children }) => (
    <div className="px-8 pt-8 pb-0">
      <div className="flex justify-center mb-6"><Logo /></div>
      {children}
    </div>
  );

  /* ─────────── SCREEN: Welcome ─────────── */
  if (screen === 'welcome') return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0FAF4] via-white to-[#E8F5FF] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 overflow-hidden">
        {/* Hero Band */}
        <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400" />
        <div className="px-8 pt-10 pb-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Simple<span className="text-emerald-600">Auth</span>
            </h1>
            <p className="mt-2 text-gray-500 text-sm leading-relaxed">
              Secure, passwordless authentication.<br />Sign in with OTP or Google — no passwords needed.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <PrimaryBtn type="button" onClick={() => goTo('signin')}>
              Sign In
              <ArrowRight className="w-4 h-4" />
            </PrimaryBtn>
            <button
              type="button"
              onClick={() => goTo('signup')}
              className="w-full py-3 px-4 border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-semibold rounded-xl text-sm transition-all duration-150 active:scale-[0.98]"
            >
              Create Account
            </button>
          </div>

          <Divider />

          <GoogleBtn onClick={handleGoogleSignIn} loading={loading} />

          {error && <Alert type="error" message={error} />}
        </div>
      </div>

      <p className="mt-6 text-xs text-gray-400 text-center">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );

  /* ─────────── SCREEN: Sign In ─────────── */
  if (screen === 'signin') return (
    <Card>
      <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400" />
      <CardTop>
        <BackBtn onClick={() => goTo('welcome')} />
        <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
        <p className="mt-1 text-sm text-gray-500">Enter your email or phone to receive a sign-in code</p>
      </CardTop>
      <CardBody>
        <Alert type="error" message={error} />
        <Alert type="info" message={info} />
        <form onSubmit={handleSendSignInOtp} className="space-y-4">
          <InputField
            id="signin-identifier"
            label="Email or Phone number"
            icon={identifier && !identifier.includes('@') ? Phone : Mail}
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            placeholder="name@email.com or +1234567890"
            autoFocus
          />
          <PrimaryBtn loading={loading}>
            Send Verification Code
            <ArrowRight className="w-4 h-4" />
          </PrimaryBtn>
        </form>

        <Divider />
        <GoogleBtn onClick={handleGoogleSignIn} loading={loading} />

        {/* Footer links */}
        <div className="flex flex-col items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => { clearFeedback(); goTo('forgot'); }}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium hover:underline transition-colors"
          >
            Forgot password?
          </button>
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => goTo('signup')}
              className="text-emerald-600 font-semibold hover:underline hover:text-emerald-700"
            >
              Create one
            </button>
          </p>
        </div>
      </CardBody>
    </Card>
  );

  /* ─────────── SCREEN: Sign In OTP ─────────── */
  if (screen === 'signin-otp') return (
    <Card>
      <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400" />
      <CardTop>
        <BackBtn onClick={() => goTo('signin')} />
        <h2 className="text-2xl font-bold text-gray-900">Check your inbox</h2>
        <p className="mt-1 text-sm text-gray-500">
          We sent a 6-digit code to <span className="font-semibold text-gray-700">{identifier}</span>
        </p>
      </CardTop>
      <CardBody>
        <Alert type="error" message={error} />
        <Alert type="info" message={info} />
        <form onSubmit={handleVerifySignInOtp} className="space-y-4">
          <InputField
            id="signin-otp"
            label="Verification Code"
            icon={Smartphone}
            value={otp}
            onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="123456"
            maxLength={6}
            autoFocus
            hint="Enter the 6-digit code. For demo, use: 123456"
          />
          <PrimaryBtn loading={loading}>
            Verify & Sign In
            <ArrowRight className="w-4 h-4" />
          </PrimaryBtn>
        </form>
        <div className="text-center">
          <button
            type="button"
            onClick={() => goTo('signin')}
            className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1.5 mx-auto transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Resend code
          </button>
        </div>
      </CardBody>
    </Card>
  );

  /* ─────────── SCREEN: Sign Up ─────────── */
  if (screen === 'signup') return (
    <Card>
      <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400" />
      <CardTop>
        <BackBtn onClick={() => goTo('welcome')} />
        <h2 className="text-2xl font-bold text-gray-900">Create an account</h2>
        <p className="mt-1 text-sm text-gray-500">Sign up with your email or phone — no password required</p>
      </CardTop>
      <CardBody>
        <Alert type="error" message={error} />
        <Alert type="info" message={info} />
        <form onSubmit={handleSendSignUpOtp} className="space-y-4">
          <InputField
            id="signup-identifier"
            label="Email or Phone number"
            icon={identifier && !identifier.includes('@') ? Phone : Mail}
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            placeholder="name@email.com or +1234567890"
            autoFocus
          />
          <PrimaryBtn loading={loading}>
            Create Account
            <ArrowRight className="w-4 h-4" />
          </PrimaryBtn>
        </form>

        <Divider />
        <GoogleBtn onClick={handleGoogleSignIn} loading={loading} />

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => goTo('signin')}
            className="text-emerald-600 font-semibold hover:underline hover:text-emerald-700"
          >
            Sign in
          </button>
        </p>
      </CardBody>
    </Card>
  );

  /* ─────────── SCREEN: Sign Up OTP ─────────── */
  if (screen === 'signup-otp') return (
    <Card>
      <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400" />
      <CardTop>
        <BackBtn onClick={() => goTo('signup')} />
        <h2 className="text-2xl font-bold text-gray-900">Verify your account</h2>
        <p className="mt-1 text-sm text-gray-500">
          Enter the code sent to <span className="font-semibold text-gray-700">{identifier}</span>
        </p>
      </CardTop>
      <CardBody>
        <Alert type="error" message={error} />
        <Alert type="info" message={info} />
        <form onSubmit={handleVerifySignUpOtp} className="space-y-4">
          <InputField
            id="signup-otp"
            label="Verification Code"
            icon={Smartphone}
            value={otp}
            onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="123456"
            maxLength={6}
            autoFocus
            hint="Enter the 6-digit code. For demo, use: 123456"
          />
          <PrimaryBtn loading={loading}>
            Confirm & Activate
            <ArrowRight className="w-4 h-4" />
          </PrimaryBtn>
        </form>
        <div className="text-center">
          <button
            type="button"
            onClick={() => goTo('signup')}
            className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1.5 mx-auto transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Resend code
          </button>
        </div>
      </CardBody>
    </Card>
  );

  /* ─────────── SCREEN: Forgot Password ─────────── */
  if (screen === 'forgot') return (
    <Card>
      <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400" />
      <CardTop>
        <BackBtn onClick={() => goTo('signin')} />
        <h2 className="text-2xl font-bold text-gray-900">Reset your password</h2>
        <p className="mt-1 text-sm text-gray-500">
          Enter your registered email or phone and we'll send a reset code
        </p>
      </CardTop>
      <CardBody>
        <Alert type="error" message={error} />
        <Alert type="info" message={info} />
        <form onSubmit={handleForgotRequest} className="space-y-4">
          <InputField
            id="forgot-identifier"
            label="Email or Phone number"
            icon={identifier && !identifier.includes('@') ? Phone : Mail}
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            placeholder="name@email.com or +1234567890"
            autoFocus
          />
          <PrimaryBtn loading={loading}>
            Send Reset Code
            <ArrowRight className="w-4 h-4" />
          </PrimaryBtn>
        </form>
        <p className="text-center text-sm text-gray-500">
          Remembered it?{' '}
          <button
            type="button"
            onClick={() => goTo('signin')}
            className="text-emerald-600 font-semibold hover:underline hover:text-emerald-700"
          >
            Sign in instead
          </button>
        </p>
      </CardBody>
    </Card>
  );

  /* ─────────── SCREEN: Forgot OTP + New Password ─────────── */
  if (screen === 'forgot-otp') return (
    <Card>
      <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400" />
      <CardTop>
        <BackBtn onClick={() => goTo('forgot')} />
        <h2 className="text-2xl font-bold text-gray-900">Set new password</h2>
        <p className="mt-1 text-sm text-gray-500">
          Enter the code sent to <span className="font-semibold text-gray-700">{identifier}</span> and choose a new password
        </p>
      </CardTop>
      <CardBody>
        <Alert type="error" message={error} />
        <Alert type="info" message={info} />
        <form onSubmit={handleForgotConfirm} className="space-y-4">
          <InputField
            id="forgot-otp"
            label="Verification Code"
            icon={Smartphone}
            value={otp}
            onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="123456"
            maxLength={6}
            autoFocus
            hint="For demo, use: 123456"
          />

          {/* Password field with show/hide toggle */}
          <div className="space-y-1.5">
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="w-[18px] h-[18px] text-gray-400" />
              </div>
              <input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full pl-10 pr-12 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 hover:border-gray-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-400">Must be at least 8 characters</p>
          </div>

          <PrimaryBtn loading={loading}>
            Reset & Sign In
            <ArrowRight className="w-4 h-4" />
          </PrimaryBtn>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => goTo('forgot')}
            className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1.5 mx-auto transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Resend code
          </button>
        </div>
      </CardBody>
    </Card>
  );

  return null;
}
