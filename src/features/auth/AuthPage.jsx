import React, { useState } from 'react';
import {
  Mail, Phone, Lock, Eye, EyeOff, ArrowRight, ArrowLeft,
  ShieldCheck, User, AlertCircle, CheckCircle2,
  RefreshCw, Smartphone, MessageSquare
} from 'lucide-react';
import { authService } from '../../services/authService';

/* ═══════════════════════════════════════════
   SHARED UI PRIMITIVES
════════════════════════════════════════════ */

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
    <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 14.98 1 12 1 7.35 1 3.37 3.65 1.43 7.54l3.85 2.99C6.2 7.42 8.87 5.04 12 5.04z" />
    <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.76 2.91c2.2-2.03 3.67-5.01 3.67-8.66z" />
    <path fill="#FBBC05" d="M5.28 14.71c-.24-.71-.38-1.47-.38-2.26s.14-1.55.38-2.26L1.43 7.2C.52 9.02 0 11.01 0 13.1s.52 4.08 1.43 5.9l3.85-2.99z" />
    <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.76-2.91c-1.1.74-2.52 1.18-4.2 1.18-3.13 0-5.8-2.38-6.72-5.49L1.43 16C3.37 19.89 7.35 22.5 12 22.5z" />
  </svg>
);

const AppLogo = ({ size = 'md' }) => {
  const iconSize = size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';
  const logoSize = size === 'lg' ? 'w-20 h-20 rounded-3xl' : 'w-12 h-12 rounded-2xl';
  const textSize = size === 'lg' ? 'text-4xl' : 'text-xl';
  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`${logoSize} bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/30`}>
        <ShieldCheck className={`${iconSize} text-white`} />
      </div>
      {size === 'lg' && (
        <div className="text-center">
          <h1 className={`${textSize} font-bold text-gray-900 tracking-tight`}>
            Simple<span className="text-emerald-600">Auth</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Secure • Fast • Simple</p>
        </div>
      )}
    </div>
  );
};

const Alert = ({ type, message }) => {
  if (!message) return null;
  if (type === 'error') return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-xl border bg-red-50 border-red-200 text-red-700 text-sm">
      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" />
      <span>{message}</span>
    </div>
  );
  return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-800 text-sm">
      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-600" />
      <span>{message}</span>
    </div>
  );
};

const ChannelBadge = ({ identifier }) => {
  const isEmail = identifier.includes('@');
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${isEmail ? 'bg-blue-100' : 'bg-purple-100'}`}>
        {isEmail
          ? <Mail className="w-4 h-4 text-blue-600" />
          : <MessageSquare className="w-4 h-4 text-purple-600" />}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 font-medium">{isEmail ? 'Code sent to email' : 'Code sent via SMS'}</p>
        <p className="text-sm font-semibold text-gray-700 truncate">{identifier}</p>
      </div>
    </div>
  );
};

/* OTP — 6 separate digit boxes */
const OtpBoxes = ({ value, onChange, id = 'otp' }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">Verification Code</label>
    <div className="flex gap-2">
      {Array(6).fill(0).map((_, i) => (
        <input
          key={i}
          id={`${id}-${i}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          autoFocus={i === 0}
          value={value[i] || ''}
          onChange={e => {
            const v = e.target.value.replace(/\D/g, '');
            const arr = (value + '      ').split('').slice(0, 6);
            arr[i] = v.slice(-1);
            onChange(arr.join('').trimEnd());
            if (v && i < 5) document.getElementById(`${id}-${i + 1}`)?.focus();
          }}
          onKeyDown={e => {
            if (e.key === 'Backspace' && !value[i] && i > 0) {
              document.getElementById(`${id}-${i - 1}`)?.focus();
            }
          }}
          onPaste={e => {
            e.preventDefault();
            const p = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
            onChange(p);
            document.getElementById(`${id}-${Math.min(p.length, 5)}`)?.focus();
          }}
          className="flex-1 h-12 min-w-0 text-center text-xl font-bold border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all caret-transparent"
        />
      ))}
    </div>
    <p className="text-xs text-gray-400">
      Check your email or phone for the 6-digit code sent by AWS.
    </p>
  </div>
);

/* Single text input with optional left icon and right button */
const Field = ({ id, label, type = 'text', icon: Icon, value, onChange, placeholder, hint, autoFocus, right, required = true }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Icon className="text-gray-400" style={{ width: 17, height: 17 }} />
        </div>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        required={required}
        className={`w-full py-3 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 text-sm
          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 hover:border-gray-300 transition-all
          ${Icon ? 'pl-10' : 'pl-4'} ${right ? 'pr-12' : 'pr-4'}`}
      />
      {right && (
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">{right}</div>
      )}
    </div>
    {hint && <p className="text-xs text-gray-400">{hint}</p>}
  </div>
);

/* Password field with show/hide */
const PasswordField = ({ id, label, value, onChange, placeholder = '••••••••', hint, autoFocus }) => {
  const [show, setShow] = useState(false);
  return (
    <Field
      id={id} label={label} type={show ? 'text' : 'password'}
      icon={Lock} value={value} onChange={onChange}
      placeholder={placeholder} hint={hint} autoFocus={autoFocus}
      right={
        <button type="button" onClick={() => setShow(v => !v)}
          className="text-gray-400 hover:text-gray-600 transition-colors">
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      }
    />
  );
};

/* Primary CTA button */
const Btn = ({ children, loading, type = 'submit', onClick, variant = 'primary', disabled }) => {
  const base = 'w-full flex items-center justify-center gap-2 py-3 px-4 font-semibold rounded-xl text-sm transition-all duration-150 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed';
  const styles = variant === 'primary'
    ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-md shadow-emerald-600/25'
    : 'bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700';
  return (
    <button type={type} onClick={onClick} disabled={loading || disabled} className={`${base} ${styles}`}>
      {loading ? <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : children}
    </button>
  );
};

const Divider = ({ label = 'or' }) => (
  <div className="flex items-center gap-3">
    <div className="flex-1 h-px bg-gray-100" />
    <span className="text-xs text-gray-400 font-medium">{label}</span>
    <div className="flex-1 h-px bg-gray-100" />
  </div>
);

const GoogleBtn = ({ onClick, loading }) => (
  <button type="button" onClick={onClick} disabled={loading}
    className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl text-sm transition-all active:scale-[0.98] disabled:opacity-60">
    <GoogleIcon /> Continue with Google
  </button>
);

const Back = ({ onClick, label = 'Back' }) => (
  <button type="button" onClick={onClick}
    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-5">
    <ArrowLeft className="w-4 h-4" /> {label}
  </button>
);

const FooterLink = ({ text, linkText, onClick }) => (
  <p className="text-center text-sm text-gray-500">
    {text}{' '}
    <button type="button" onClick={onClick}
      className="text-emerald-600 font-semibold hover:underline hover:text-emerald-700">
      {linkText}
    </button>
  </p>
);

/* Page shell */
const Page = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-br from-[#edfaf2] via-white to-[#e8f4ff] flex flex-col items-center justify-center p-4">
    <div className="w-full max-w-md">
      {children}
    </div>
  </div>
);

const Card = ({ children }) => (
  <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/70 border border-gray-100 overflow-hidden">
    <div className="h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400" />
    <div className="px-8 py-7 space-y-5">{children}</div>
  </div>
);

/* Validation helpers */
const validEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v?.trim());
const validPhone = (phone) => {
  const clean = phone.replace(/\D/g, "");

  if (clean.length !== 10)
    return "Phone number must contain exactly 10 digits.";

  if (!/^[6-9]/.test(clean))
    return "Enter a valid Indian mobile number.";

  return "";
};

const formatPhoneForCognito = (phone) => {
  return `+91${phone.replace(/\D/g, "")}`;
};

const normalizeUsername = (value) => {
  const input = value.trim();
  if (input.includes("@")) {
    return input.toLowerCase();
  }
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("91")) {
    return `+${digits}`;
  }
  return `+91${digits}`;
};

const validIdentifier = v => {
  if (!v?.trim()) return 'Please enter your email or phone number.';
  if (v.includes('@') && !validEmail(v)) return 'Enter a valid email address.';
  if (!v.includes('@') && !validPhone(v)) return 'Enter a valid phone number (e.g. +91 98765 43210).';
  return '';
};

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
export default function AuthPage({ onLoginSuccess }) {
  /**
   * Screens:
   *  welcome      → landing
   *  signin       → email/phone + password
   *  signup       → name + email/phone + password + confirm
   *  signup-otp   → verify OTP sent to email/phone after registration
   *  forgot       → enter email/phone to receive reset OTP
   *  forgot-otp   → enter OTP + new password
   */
  const [screen, setScreen] = useState('welcome');

  // form fields
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [identifier, setIdentifier] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [otp, setOtp] = useState("");

  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const clearFeedback = () => { setError(''); setInfo(''); };

  const goTo = (s) => {
    clearFeedback();
    setOtp('');
    setScreen(s);
  };

  /* ── Google ── */
  const handleGoogle = async () => {
    clearFeedback(); setLoading(true);
    try { await authService.federatedSignIn('Google'); }
    catch (e) { setError(e.message || 'Google sign-in failed.'); setLoading(false); }
  };

  /* ── SIGN IN ── */
  const handleSignIn = async (e) => {
    e.preventDefault(); clearFeedback();
    if (!identifier.trim()) {
      setError('Please enter your email or phone number.');
      return;
    }
    if (!password) { setError('Please enter your password.'); return; }
    setLoading(true);
    try {
      const username = normalizeUsername(identifier);
      await authService.signIn({ username, password });
      const user = await authService.getCurrentUser();
      onLoginSuccess(user);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  /* ── SIGN UP: submit form ── */
  const handleSignUp = async (e) => {
    e.preventDefault(); clearFeedback();
    if (!name.trim()) { setError('Please enter your full name.'); return; }
    if (!validEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const phoneError = validPhone(phone);

    if (phoneError) {
      setError(phoneError);
      return;
    }

    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPw) {
      setError("Passwords do not match.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }
    if (password !== confirmPw) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      await authService.signUp({
        username: email.trim(),
        password,
        options: {
          userAttributes: {
            email: email.trim(),
            name: name.trim(),
            phone_number: formatPhoneForCognito(phone),
          },
        },
      });
      setIdentifier(email);

      setInfo(
        `A verification code has been sent to ${email}.`
      ); goTo('signup-otp');
    } catch (err) { setError(err.message || 'Failed to create account.'); }
    finally { setLoading(false); }
  };

  /* ── SIGN UP: verify OTP ── */
  const handleConfirmSignUp = async (e) => {
    e.preventDefault();
    clearFeedback();

    if (otp.replace(/\s/g, "").length < 6) {
      setError("Enter the complete 6-digit code.");
      return;
    }

    setLoading(true);

    try {
      await authService.confirmSignUp({
        username: identifier.trim(),
        confirmationCode: otp,
      });

      await authService.signIn({
        username: identifier.trim(),
        password,
      });

      const user = await authService.getCurrentUser();

      onLoginSuccess(user);
    } catch (err) {
      setError(err.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  /* ── FORGOT: request OTP ── */
  const handleForgotRequest = async (e) => {
    e.preventDefault(); clearFeedback();
    const ve = validIdentifier(identifier);
    if (ve) { setError(ve); return; }
    setLoading(true);
    try {
      await authService.resetPassword({ username: identifier.trim() });
      setInfo(`A reset code has been sent to ${identifier.trim()}.`);
      goTo('forgot-otp');
    } catch (err) { setError(err.message || 'Failed to send reset code.'); }
    finally { setLoading(false); }
  };

  /* ── FORGOT: confirm OTP + new password ── */
  const handleForgotConfirm = async (e) => {
    e.preventDefault(); clearFeedback();
    if (otp.replace(/\s/g, '').length < 6) { setError('Enter the complete 6-digit code.'); return; }
    if (!password || password.length < 8) { setError('New password must be at least 8 characters.'); return; }
    if (password !== confirmPw) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      await authService.confirmResetPassword({ username: identifier.trim(), confirmationCode: otp, newPassword: password });
      const user = await authService.getCurrentUser();
      onLoginSuccess(user);
    } catch (err) { setError(err.message || 'Failed to reset password.'); }
    finally { setLoading(false); }
  };

  /* ══════════════════════════════════════════════
     WELCOME
  ════════════════════════════════════════════ */
  if (screen === 'welcome') return (
    <Page>
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/70 border border-gray-100 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400" />
        <div className="px-8 pt-10 pb-8 text-center space-y-6">
          <AppLogo size="lg" />
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
            Passwordless verification powered by OTP and Google. Simple, fast, and secure.
          </p>
          <div className="space-y-3 pt-1">
            <Btn type="button" onClick={() => goTo('signin')}>
              Sign In <ArrowRight className="w-4 h-4" />
            </Btn>
            <Btn type="button" variant="outline" onClick={() => goTo('signup')}>
              Create Account
            </Btn>
          </div>
          <Divider />
          <GoogleBtn onClick={handleGoogle} loading={loading} />
          {error && <Alert type="error" message={error} />}
        </div>
      </div>
      <p className="mt-5 text-center text-xs text-gray-400">
        By continuing, you agree to our Terms & Privacy Policy.
      </p>
    </Page>
  );

  /* ══════════════════════════════════════════════
     SIGN IN
  ════════════════════════════════════════════ */
  if (screen === 'signin') return (
    <Page>
      <Card>
        <Back onClick={() => goTo('welcome')} />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sign in</h2>
          <p className="text-sm text-gray-500 mt-1">Welcome back! Enter your credentials.</p>
        </div>

        <Alert type="error" message={error} />

        <form onSubmit={handleSignIn} className="space-y-4">
          <Field
            id="si-id"
            label="Email or Phone Number"
            icon={identifier && !identifier.includes('@') ? Phone : Mail}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="name@email.com or +91 98765 43210"
            autoFocus
          />
          <div className="space-y-1">
            <PasswordField id="si-pw" label="Password" value={password} onChange={e => setPassword(e.target.value)} />
            {/* Forgot Password inline link */}
            <div className="flex justify-end">
              <button type="button" onClick={() => { clearFeedback(); goTo('forgot'); }}
                className="text-xs text-emerald-600 hover:underline hover:text-emerald-700 font-medium pt-1">
                Forgot password?
              </button>
            </div>
          </div>
          <Btn loading={loading}>
            Sign In <ArrowRight className="w-4 h-4" />
          </Btn>
        </form>

        <Divider />
        <GoogleBtn onClick={handleGoogle} loading={loading} />

        <FooterLink text="Don't have an account?" linkText="Create one" onClick={() => goTo('signup')} />
      </Card>
    </Page>
  );

  /* ══════════════════════════════════════════════
     SIGN UP
  ════════════════════════════════════════════ */
  if (screen === 'signup') return (
    <Page>
      <Card>
        <Back onClick={() => goTo('welcome')} />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Create account</h2>
          <p className="text-sm text-gray-500 mt-1">Fill in your details. We'll verify your email or phone with an OTP.</p>
        </div>

        <Alert type="error" message={error} />

        <form onSubmit={handleSignUp} className="space-y-4">
          {/* Name */}
          <Field
            id="su-name" label="Full Name"
            icon={User} value={name} onChange={e => setName(e.target.value)}
            placeholder="Jane Doe" autoFocus
          />

          {/* Email or Phone */}
          <Field
            id="su-email"
            label="Email Address"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>

            <div className="flex">
              <div className="px-4 flex items-center rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-sm font-medium text-gray-600">
                🇮🇳 +91
              </div>

              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="9876543210"
                className="flex-1 py-3 px-4 border border-gray-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>






          {/* Password */}
          <PasswordField
            id="su-pw" label="Password" value={password}
            onChange={e => setPassword(e.target.value)}
            hint="At least 8 characters"
          />

          {/* Confirm Password */}
          <PasswordField
            id="su-cpw" label="Confirm Password" value={confirmPw}
            onChange={e => setConfirmPw(e.target.value)}
            placeholder="Re-enter password"
          />

          <Btn loading={loading}>
            Create Account <ArrowRight className="w-4 h-4" />
          </Btn>
        </form>

        <Divider />
        <GoogleBtn onClick={handleGoogle} loading={loading} />

        <FooterLink text="Already have an account?" linkText="Sign in" onClick={() => goTo('signin')} />
      </Card>
    </Page>
  );

  /* ══════════════════════════════════════════════
     SIGN UP — OTP VERIFY
  ════════════════════════════════════════════ */
  if (screen === 'signup-otp') return (
    <Page>
      <Card>
        <Back onClick={() => goTo('signup')} />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Verify your account</h2>
          <p className="text-sm text-gray-500 mt-1">Enter the 6-digit code to confirm your identity and activate your account.</p>
        </div>

        <ChannelBadge identifier={identifier} />
        <Alert type="error" message={error} />
        <Alert type="info" message={info} />

        <form onSubmit={handleConfirmSignUp} className="space-y-4">
          <OtpBoxes id="su-otp" value={otp} onChange={setOtp} />
          <Btn loading={loading}>
            Confirm & Activate <ArrowRight className="w-4 h-4" />
          </Btn>
        </form>

        <button type="button"
          onClick={() => handleSignUp({ preventDefault: () => { } })}
          className="w-full flex items-center justify-center gap-1.5 text-sm text-gray-400 hover:text-emerald-600 transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> Resend code
        </button>
      </Card>
    </Page>
  );

  /* ══════════════════════════════════════════════
     FORGOT PASSWORD — Request
  ════════════════════════════════════════════ */
  if (screen === 'forgot') return (
    <Page>
      <Card>
        <Back onClick={() => goTo('signin')} />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Forgot password?</h2>
          <p className="text-sm text-gray-500 mt-1">Enter your registered email or phone and we'll send a reset code.</p>
        </div>

        <Alert type="error" message={error} />
        <Alert type="info" message={info} />

        <form onSubmit={handleForgotRequest} className="space-y-4">
          <Field
            id="fp-id" label="Email or Phone number"
            icon={identifier && !identifier.includes('@') ? Phone : Mail}
            value={identifier} onChange={e => setIdentifier(e.target.value)}
            placeholder="name@email.com or +91 98765 43210" autoFocus
          />
          <Btn loading={loading}>
            Send Reset Code <ArrowRight className="w-4 h-4" />
          </Btn>
        </form>

        <FooterLink text="Remembered it?" linkText="Back to sign in" onClick={() => goTo('signin')} />
      </Card>
    </Page>
  );

  /* ══════════════════════════════════════════════
     FORGOT PASSWORD — OTP + New Password
  ════════════════════════════════════════════ */
  if (screen === 'forgot-otp') return (
    <Page>
      <Card>
        <Back onClick={() => goTo('forgot')} />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Set new password</h2>
          <p className="text-sm text-gray-500 mt-1">Enter the code we sent and choose a new password.</p>
        </div>

        <ChannelBadge identifier={identifier} />
        <Alert type="error" message={error} />
        <Alert type="info" message={info} />

        <form onSubmit={handleForgotConfirm} className="space-y-4">
          <OtpBoxes id="fp-otp" value={otp} onChange={setOtp} />

          <PasswordField
            id="fp-pw" label="New Password" value={password}
            onChange={e => setPassword(e.target.value)}
            hint="At least 8 characters"
          />
          <PasswordField
            id="fp-cpw" label="Confirm New Password" value={confirmPw}
            onChange={e => setConfirmPw(e.target.value)}
            placeholder="Re-enter new password"
          />

          <Btn loading={loading}>
            Reset Password & Sign In <ArrowRight className="w-4 h-4" />
          </Btn>
        </form>

        <button type="button"
          onClick={() => handleForgotRequest({ preventDefault: () => { } })}
          className="w-full flex items-center justify-center gap-1.5 text-sm text-gray-400 hover:text-emerald-600 transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> Resend code
        </button>
      </Card>
    </Page>
  );

  return null;
}
