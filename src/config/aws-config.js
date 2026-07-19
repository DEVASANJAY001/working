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

          // "phone" is intentionally removed:
          //   - Google does NOT return a phone scope.
          //   - Cognito rejects the token exchange with HTTP 400 invalid_scope
          //     when the App Client scope list doesn't include "phone" OR when
          //     the upstream IdP (Google) doesn't grant it.
          // "profile" is required to map the Google "name" attribute into Cognito.
          scopes: [
            "openid",
            "email",
            "profile",
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