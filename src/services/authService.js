import { amplifyConfig, isMock } from '../aws-exports';
import { Amplify } from 'aws-amplify';
import * as AmplifyAuth from 'aws-amplify/auth';

if (!isMock && amplifyConfig.Auth.Cognito.userPoolId) {
  try { Amplify.configure(amplifyConfig); }
  catch (e) { console.error('Amplify config error:', e); }
}

/* ── Mock storage keys ── */
const MOCK_SESSION_KEY = 'simpleauth_session';
const MOCK_USERS_KEY   = 'simpleauth_users';      // { [username]: { name, password } }
const MOCK_PENDING_KEY = 'simpleauth_pending_otp'; // { username, otp }

const getUsers = () => JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '{}');
const saveUsers = (u) => localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(u));

/* ═══════════════════════════════
   MOCK SERVICE
════════════════════════════════ */
const mockService = {
  getCurrentUser: async () => {
    const s = localStorage.getItem(MOCK_SESSION_KEY);
    if (!s) throw new Error('No session');
    return JSON.parse(s);
  },

  /** Standard password sign-up — stores pending + simulates OTP */
  signUp: async ({ username, password, options }) => {
    const name = options?.userAttributes?.name || username.split('@')[0];
    // Check if already registered
    const users = getUsers();
    if (users[username]) throw new Error('An account with this email/phone already exists.');
    // Store as pending (not confirmed yet)
    localStorage.setItem(MOCK_PENDING_KEY, JSON.stringify({ username, password, name, otp: '123456' }));
    console.log(`[Mock] OTP sent to ${username}. Use 123456.`);
    return { isSignUpComplete: false };
  },

  /** Confirm OTP after sign-up */
  confirmSignUp: async ({ username, confirmationCode }) => {
    const pending = JSON.parse(localStorage.getItem(MOCK_PENDING_KEY) || 'null');
    if (!pending || pending.username !== username)
      throw new Error('Session expired. Please sign up again.');
    if (confirmationCode !== pending.otp)
      throw new Error('Incorrect verification code. (Demo code: 123456)');
    // Move from pending → registered
    const users = getUsers();
    users[username] = { name: pending.name, password: pending.password };
    saveUsers(users);
    localStorage.removeItem(MOCK_PENDING_KEY);
    // Auto sign in
    const session = { username, userId: 'uid-' + Date.now(), signInDetails: { loginId: username }, name: pending.name };
    localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(session));
    return { isSignUpComplete: true };
  },

  /** Password-based sign in */
  signIn: async ({ username, password }) => {
    const users = getUsers();
    const user = users[username];
    if (!user) throw new Error('No account found with this email or phone number.');
    if (user.password !== password) throw new Error('Incorrect password. Please try again.');
    const session = { username, userId: 'uid-' + Date.now(), signInDetails: { loginId: username }, name: user.name };
    localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(session));
    return { isSignedIn: true };
  },

  /** Forgot password — sends mock OTP */
  resetPassword: async ({ username }) => {
    const users = getUsers();
    if (!users[username]) throw new Error('No account found with this email or phone number.');
    localStorage.setItem(MOCK_PENDING_KEY, JSON.stringify({ username, otp: '123456', type: 'reset' }));
    console.log(`[Mock] Reset OTP sent to ${username}. Use 123456.`);
    return { isPasswordReset: false };
  },

  /** Confirm reset OTP + new password → auto sign in */
  confirmResetPassword: async ({ username, confirmationCode, newPassword }) => {
    const pending = JSON.parse(localStorage.getItem(MOCK_PENDING_KEY) || 'null');
    if (!pending || pending.username !== username || pending.type !== 'reset')
      throw new Error('Session expired. Please request a new reset code.');
    if (confirmationCode !== pending.otp)
      throw new Error('Incorrect verification code. (Demo code: 123456)');
    if (!newPassword || newPassword.length < 8)
      throw new Error('Password must be at least 8 characters.');
    // Update password
    const users = getUsers();
    users[username] = { ...users[username], password: newPassword };
    saveUsers(users);
    localStorage.removeItem(MOCK_PENDING_KEY);
    // Auto sign in
    const session = { username, userId: 'uid-' + Date.now(), signInDetails: { loginId: username }, name: users[username]?.name };
    localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(session));
    return { isPasswordReset: true };
  },

  signOut: async () => {
    localStorage.removeItem(MOCK_SESSION_KEY);
  },

  federatedSignIn: async ({ provider }) => {
    await new Promise(r => setTimeout(r, 900));
    const session = {
      username: 'googleuser@gmail.com', userId: 'google-uid-123',
      signInDetails: { loginId: 'googleuser@gmail.com' }, name: 'Google User'
    };
    localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(session));
    window.location.reload();
  }
};

/* ═══════════════════════════════
   COGNITO (REAL) SERVICE
════════════════════════════════ */
const cognitoService = {
  getCurrentUser: async () => await AmplifyAuth.getCurrentUser(),

  signUp: async ({ username, password, options }) => {
    return await AmplifyAuth.signUp({ username, password, options });
  },

  confirmSignUp: async ({ username, confirmationCode }) => {
    const res = await AmplifyAuth.confirmSignUp({ username, confirmationCode });
    // Auto sign-in after confirm (Cognito supports this)
    try { await AmplifyAuth.autoSignIn(); } catch (_) {}
    return res;
  },

  signIn: async ({ username, password }) => {
    return await AmplifyAuth.signIn({ username, password });
  },

  resetPassword: async ({ username }) => {
    return await AmplifyAuth.resetPassword({ username });
  },

  confirmResetPassword: async ({ username, confirmationCode, newPassword }) => {
    await AmplifyAuth.confirmResetPassword({ username, confirmationCode, newPassword });
    await AmplifyAuth.signIn({ username, password: newPassword });
    return { isPasswordReset: true };
  },

  signOut: async () => await AmplifyAuth.signOut(),

  federatedSignIn: async ({ provider }) => {
    return await AmplifyAuth.signInWithRedirect({ provider });
  }
};

export const authService = isMock ? mockService : cognitoService;
