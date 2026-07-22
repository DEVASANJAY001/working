import { Amplify } from "aws-amplify";

// ── Environment variable checks ──────────────────────────
const region     = import.meta.env.VITE_AWS_REGION             || "ap-south-1";
const userPoolId = import.meta.env.VITE_AWS_USER_POOL_ID;
const clientId   = import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID;
const domain     = import.meta.env.VITE_AWS_COGNITO_DOMAIN;
const redirectIn = import.meta.env.VITE_AWS_REDIRECT_SIGN_IN;
const redirectOut= import.meta.env.VITE_AWS_REDIRECT_SIGN_OUT;

// Derive the redirect URL: prefer env var, fallback to current origin
const getRedirectUrl = (envValue) => {
  if (envValue && envValue.trim()) return envValue.trim();
  if (typeof window !== "undefined") return `${window.location.origin}/`;
  return "http://localhost:5173/";
};

const signInRedirect  = getRedirectUrl(redirectIn);
const signOutRedirect = getRedirectUrl(redirectOut);

// ── Startup diagnostic log ────────────────────────────────
const isConfigured = Boolean(userPoolId && clientId && domain);

if (import.meta.env.DEV) {
  if (isConfigured) {
    console.log(
      "%c[Amplify] ✅ AWS Cognito configured",
      "color: #10B981; font-weight: bold"
    );
    console.log(`  Region:       ${region}`);
    console.log(`  UserPool:     ${userPoolId}`);
    console.log(`  ClientId:     ${clientId}`);
    console.log(`  Domain:       ${domain}`);
    console.log(`  RedirectIn:   ${signInRedirect}`);
    console.log(`  RedirectOut:  ${signOutRedirect}`);
  } else {
    console.warn(
      "%c[Amplify] ⚠️  Missing .env variables — running in local-only mode",
      "color: #F59E0B; font-weight: bold"
    );
  }
}

// ── Configure Amplify ─────────────────────────────────────
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId,
      userPoolClientId: clientId,

      loginWith: {
        email: true,

        oauth: {
          // The Cognito Hosted UI domain (no https://)
          domain,

          // Scopes required for Google identity token exchange.
          // "phone" is intentionally omitted — Google doesn't return it
          // and Cognito will reject the token exchange with HTTP 400 invalid_scope.
          scopes: ["openid", "email", "profile"],

          // Must exactly match the Callback URLs configured in your Cognito App Client.
          redirectSignIn:  [signInRedirect],
          redirectSignOut: [signOutRedirect],

          // Authorization-code flow (PKCE) – most secure for SPAs.
          responseType: "code",
        },
      },
    },
  },
});