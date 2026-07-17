// AWS Amplify Configuration mapping helper.
// In Amplify v6, configuration structure is simpler.

const isMock = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID || '',
      userPoolClientId: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID || '',
      signUpVerificationMethod: 'code', // 'code' | 'link'
      loginWith: {
        email: true,
        phone: true,
      },
    }
  }
};

// If OAuth / Hosted UI is used:
if (import.meta.env.VITE_AWS_COGNITO_DOMAIN) {
  amplifyConfig.Auth.Cognito.loginWith.oauth = {
    domain: import.meta.env.VITE_AWS_COGNITO_DOMAIN,
    scopes: ['openid', 'email', 'profile', 'phone'],
    redirectSignIn: [import.meta.env.VITE_AWS_REDIRECT_SIGN_IN || 'http://localhost:5173/'],
    redirectSignOut: [import.meta.env.VITE_AWS_REDIRECT_SIGN_OUT || 'http://localhost:5173/'],
    responseType: 'code',
  };
}

export { amplifyConfig, isMock };
