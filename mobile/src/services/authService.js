const COGNITO_REGION = 'ap-south-1';
const CLIENT_ID = '5b2gdlk67706hr63m8rae3bouo';
const ENDPOINT = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com`;

const cognitoFetch = async (action, payload) => {
  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-amz-json-1.1',
        'X-Amz-Target': `AWSCognitoIdentityProviderService.${action}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.message || json.__type || 'An error occurred.');
    }
    return json;
  } catch (error) {
    console.error(`Cognito ${action} error:`, error);
    throw error;
  }
};

export const authService = {
  // Sign Up
  async signUp(email, name, password) {
    return await cognitoFetch('SignUp', {
      ClientId: CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'name', Value: name },
      ],
    });
  },

  // Confirm Sign Up (Email Code Verification)
  async confirmSignUp(email, code) {
    return await cognitoFetch('ConfirmSignUp', {
      ClientId: CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
    });
  },

  // Sign In
  async signIn(emailOrPhone, password) {
    return await cognitoFetch('InitiateAuth', {
      ClientId: CLIENT_ID,
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: emailOrPhone,
        PASSWORD: password,
      },
    });
  },

  // Forgot Password
  async forgotPassword(email) {
    return await cognitoFetch('ForgotPassword', {
      ClientId: CLIENT_ID,
      Username: email,
    });
  },

  // Confirm Forgot Password (Reset Password)
  async confirmForgotPassword(email, code, newPassword) {
    return await cognitoFetch('ConfirmForgotPassword', {
      ClientId: CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword,
    });
  },
};
