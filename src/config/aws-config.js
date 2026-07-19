import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID,

      loginWith: {
        email: true,
        oauth: {
          domain: import.meta.env.VITE_AWS_COGNITO_DOMAIN,

          scopes: [
            "openid",
            "email",
            "phone",
          ],

          redirectSignIn: [
            import.meta.env.VITE_AWS_REDIRECT_SIGN_IN,
          ],

          redirectSignOut: [
            import.meta.env.VITE_AWS_REDIRECT_SIGN_OUT,
          ],

          responseType: "code",
        },
      },
    },
  },
});