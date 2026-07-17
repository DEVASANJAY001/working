import { amplifyConfig, isMock } from '../aws-exports';
import { Amplify } from 'aws-amplify';
import * as AmplifyAuth from 'aws-amplify/auth';

// Only configure Amplify if we are not purely in mock mode and have configuration
if (!isMock && amplifyConfig.Auth.Cognito.userPoolId) {
  try {
    Amplify.configure(amplifyConfig);
  } catch (error) {
    console.error('Failed to configure AWS Amplify:', error);
  }
}

// Local mock storage key
const MOCK_USER_KEY = 'simple_auth_app_mock_user';

// --- MOCK SERVICE IMPLEMENTATION ---
const mockService = {
  getCurrentUser: async () => {
    const userJson = localStorage.getItem(MOCK_USER_KEY);
    if (!userJson) throw new Error('No user signed in');
    return JSON.parse(userJson);
  },

  signUp: async ({ username, options }) => {
    // Simulating signup verification flow
    console.log(`[Mock Auth] Signing up user: ${username}`);
    // Options can contain userAttributes like email or phone_number
    return {
      isSignUpComplete: false,
      nextStep: {
        signUpStep: 'CONFIRM_SIGN_UP_STEP',
        codeDeliveryDetails: {
          deliveryMedium: username.includes('@') ? 'EMAIL' : 'SMS',
          destination: username,
        }
      }
    };
  },

  confirmSignUp: async ({ username, confirmationCode }) => {
    console.log(`[Mock Auth] Confirming signup for: ${username} with code: ${confirmationCode}`);
    if (confirmationCode !== '123456') {
      throw new Error('Invalid verification code (Use "123456" for mock testing)');
    }
    const mockUser = {
      username,
      userId: 'mock-uuid-' + Math.random().toString(36).substr(2, 9),
      signInDetails: { loginId: username }
    };
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
    return { isSignUpComplete: true, nextStep: { signUpStep: 'DONE' } };
  },

  signIn: async ({ username, password }) => {
    console.log(`[Mock Auth] Initiating OTP Sign In for: ${username}`);
    // Standard Cognito custom OTP flow simulation
    return {
      isSignedIn: false,
      nextStep: {
        signInStep: 'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE',
        codeDeliveryDetails: {
          deliveryMedium: username.includes('@') ? 'EMAIL' : 'SMS',
          destination: username,
        }
      }
    };
  },

  confirmSignIn: async ({ challengeResponse }) => {
    console.log(`[Mock Auth] Confirming OTP challenge: ${challengeResponse}`);
    if (challengeResponse !== '123456') {
      throw new Error('Invalid OTP (Use "123456" for mock testing)');
    }
    // Retrieve transient/pending login username from session (simulate via fallback or prompt-based loginId)
    // For mock simplicity, we will log in with a generic user or retrieve last active
    const mockUser = {
      username: 'user@example.com',
      userId: 'mock-uuid-authenticated',
      signInDetails: { loginId: 'user@example.com' }
    };
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
    return { isSignedIn: true, nextStep: { signInStep: 'DONE' } };
  },

  // Simulating custom login where user identifier is explicitly provided
  mockOtpLoginDirect: async (identifier, otp) => {
    if (otp !== '123456') {
      throw new Error('Invalid OTP (Use "123456" for mock testing)');
    }
    const mockUser = {
      username: identifier,
      userId: 'mock-uuid-' + Math.random().toString(36).substr(2, 9),
      signInDetails: { loginId: identifier }
    };
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
    return mockUser;
  },

  resetPassword: async ({ username }) => {
    console.log(`[Mock Auth] Requesting password reset for: ${username}`);
    return {
      isPasswordReset: false,
      nextStep: {
        resetPasswordStep: 'CONFIRM_RESET_PASSWORD_WITH_CODE',
        codeDeliveryDetails: {
          deliveryMedium: username.includes('@') ? 'EMAIL' : 'SMS',
          destination: username,
        }
      }
    };
  },

  confirmResetPassword: async ({ username, confirmationCode, newPassword }) => {
    console.log(`[Mock Auth] Resetting password for: ${username} with code: ${confirmationCode}`);
    if (confirmationCode !== '123456') {
      throw new Error('Invalid code (Use "123456" for mock testing)');
    }
    // Auto-login upon successful password reset
    const mockUser = {
      username,
      userId: 'mock-uuid-' + Math.random().toString(36).substr(2, 9),
      signInDetails: { loginId: username }
    };
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
    return { isPasswordReset: true };
  },

  signOut: async () => {
    localStorage.removeItem(MOCK_USER_KEY);
    console.log('[Mock Auth] Logged out');
    return {};
  },

  federatedSignIn: async ({ provider }) => {
    console.log(`[Mock Auth] Federated Sign-In initiated for provider: ${provider}`);
    // Simulate redirection delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const mockUser = {
      username: 'google-user@gmail.com',
      userId: 'mock-google-id-123456',
      signInDetails: { loginId: 'google-user@gmail.com' }
    };
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
    window.location.reload();
  }
};

// --- AWS COGNITO SERVICE IMPLEMENTATION ---
const cognitoService = {
  getCurrentUser: async () => {
    return await AmplifyAuth.getCurrentUser();
  },

  signUp: async ({ username, options }) => {
    // Map email/phone standard parameters for Cognito signUp
    // Phone numbers must be in E.164 format (e.g. +1234567890)
    const isEmail = username.includes('@');
    const userAttributes = {};
    if (isEmail) {
      userAttributes.email = username;
    } else {
      userAttributes.phone_number = username;
    }

    return await AmplifyAuth.signUp({
      username,
      password: 'TemporaryPassword123!', // Standard password placeholder since Cognito requires a password by default unless custom OTP auth flow is configured in Lambda.
      options: {
        userAttributes,
        ...options
      }
    });
  },

  confirmSignUp: async ({ username, confirmationCode }) => {
    const result = await AmplifyAuth.confirmSignUp({
      username,
      confirmationCode
    });
    // Auto sign in the user after verification if password was cached or standard
    try {
      await AmplifyAuth.signIn({
        username,
        password: 'TemporaryPassword123!'
      });
    } catch (e) {
      console.warn('Auto sign-in omitted; requires manual credentials input.', e);
    }
    return result;
  },

  signIn: async ({ username }) => {
    // For standard Cognito without Lambda custom triggers, OTP sign-in relies on
    // user resetPassword or Custom Auth Flow triggers.
    // In standard Amplify we use sign-in with passwordless custom authentication if configured.
    // Here we support standard Amplify custom flows if defined in user pool:
    return await AmplifyAuth.signIn({
      username,
      options: {
        authFlowType: 'CUSTOM_WITHOUT_PASSWORD' // Cognito passwordless auth flow (requires Custom Message & Define/Create/Verify Auth Challenge lambdas)
      }
    });
  },

  confirmSignIn: async ({ challengeResponse }) => {
    return await AmplifyAuth.confirmSignIn({
      challengeResponse
    });
  },

  // Helper logic to sign in directly using email/phone OTP confirmation
  mockOtpLoginDirect: async (identifier, otp) => {
    // Since real AWS Cognito passwordless OTP requires custom challenge handlers:
    // This will invoke confirmSignIn passing the OTP code
    return await AmplifyAuth.confirmSignIn({
      challengeResponse: otp
    });
  },

  resetPassword: async ({ username }) => {
    return await AmplifyAuth.resetPassword({ username });
  },

  confirmResetPassword: async ({ username, confirmationCode, newPassword }) => {
    return await AmplifyAuth.confirmResetPassword({
      username,
      confirmationCode,
      newPassword
    });
  },

  signOut: async () => {
    return await AmplifyAuth.signOut();
  },

  federatedSignIn: async ({ provider }) => {
    // Redirects browser to the Cognito Hosted UI Login Screen configured for Google OAuth provider
    return await AmplifyAuth.signInWithRedirect({
      provider
    });
  }
};

// Export active service based on config
export const authService = isMock ? mockService : cognitoService;
