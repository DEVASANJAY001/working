# SimpleAuth — AWS Cognito + Google OAuth

A production-ready authentication web app built with **React + Vite**, **AWS Amplify v6**, **AWS Cognito**, and **Google Federated Sign-In**.

---

## Features

- **Email Sign-Up & Login** — OTP verification via AWS Cognito
- **Phone Number Sign-Up** — Indian mobile number (+91) with OTP confirmation
- **Forgot Password** — OTP-based reset with auto sign-in on success
- **Google Federated Sign-In** — Full OAuth 2.0 flow via Cognito Hosted UI
- **Amplify Hub Listener** — Correctly handles the post-OAuth redirect and updates React session state
- **Real AWS Cognito** — No mock mode; direct integration with real Cognito User Pool

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 |
| Auth | AWS Amplify v6 (`aws-amplify`) |
| Icons | Lucide React |
| Cloud | AWS Cognito (ap-south-1) |
| Social Login | Google OAuth 2.0 via Cognito Hosted UI |

---

## Project Structure

```
src/
├── config/
│   └── aws-config.js        # Amplify.configure() — Cognito + OAuth scopes
├── services/
│   └── authService.js       # Wrapper around Amplify auth methods
├── features/
│   ├── auth/
│   │   └── AuthPage.jsx     # Sign-in, Sign-up, OTP verify, Forgot password
│   └── dashboard/
│       └── Dashboard.jsx    # Protected page shown after login
├── App.jsx                  # Hub listener + session check + routing
└── main.jsx                 # Amplify OAuth listener bootstrap
```

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example file and fill in your real AWS values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_AWS_REGION=ap-south-1
VITE_AWS_USER_POOL_ID=ap-south-1_XXXXXXXXX
VITE_AWS_USER_POOL_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_AWS_COGNITO_DOMAIN=your-prefix.auth.ap-south-1.amazoncognito.com
VITE_AWS_REDIRECT_SIGN_IN=http://localhost:5173/
VITE_AWS_REDIRECT_SIGN_OUT=http://localhost:5173/
```

> **Never commit `.env`** — it is in `.gitignore`. Use `.env.example` as a reference.

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## AWS Cognito Setup

### Step 1 — Create a User Pool

1. Go to **AWS Console → Cognito → Create User Pool**
2. Sign-in options: ✅ Email ✅ Phone number
3. MFA: Optional (required for phone OTP)
4. Required attributes: `email`, `name`, `phone_number`

### Step 2 — Create an App Client

1. App type: **Public client** (no client secret)
2. **Allowed OAuth flows**: ✅ Authorization code grant
3. **Allowed OAuth scopes**: ✅ `openid` ✅ `email` ✅ `profile`
   > ⚠️ Do **not** add `phone` — Google does not grant it and it causes HTTP 400.
4. **Callback URL**: `http://localhost:5173/`
5. **Sign-out URL**: `http://localhost:5173/`
6. **Identity providers**: ✅ Google

### Step 3 — Create a Cognito Domain

In User Pool → **App integration → Domain**, create a domain prefix.  
It will look like: `your-prefix.auth.ap-south-1.amazoncognito.com`

Copy this exact value into `VITE_AWS_COGNITO_DOMAIN` in your `.env`.

### Step 4 — Add Google as a Federated Identity Provider

1. In User Pool → **Sign-in experience → Federated identity provider sign-in**
2. Add **Google**
3. Enter your Google **Client ID** and **Client Secret**
4. Scopes: `profile email openid`
5. Attribute mappings:
   | Google attribute | Cognito attribute |
   |-----------------|------------------|
   | `email` | `email` |
   | `name` | `name` |
   | `sub` | `username` |

---

## Google Cloud Console Setup

1. Go to **Google Cloud Console → APIs & Services → Credentials**
2. Create (or edit) an **OAuth 2.0 Client ID**
3. Set **Authorized JavaScript origins**:
   ```
   http://localhost:5173
   ```
4. Set **Authorized redirect URIs** — this must point to **Cognito**, not localhost:
   ```
   https://your-prefix.auth.ap-south-1.amazoncognito.com/oauth2/idpresponse
   ```

> ⚠️ A common mistake is setting the redirect URI to `http://localhost:5173/`. Google must redirect back to Cognito, which then redirects to your app.

---

## How the Google OAuth Flow Works

```
1. User clicks "Continue with Google"
2. React → signInWithRedirect({ provider: "Google" })
3. Browser → GET https://<cognito-domain>/oauth2/authorize
             ?identity_provider=Google
             &redirect_uri=http://localhost:5173/
             &response_type=code
             &scope=openid+email+profile
4. Cognito → redirects to Google Account Picker
5. User selects account
6. Google → POST to https://<cognito-domain>/oauth2/idpresponse
7. Cognito exchanges token with Google → creates federated user in User Pool
8. Cognito → redirects to http://localhost:5173/?code=...
9. Amplify (enable-oauth-listener) exchanges code for session
10. Hub fires "signedIn" event
11. App.jsx Hub listener calls getCurrentUser() → sets React state
12. Dashboard renders ✅
```

---

## Environment Variables Reference

| Variable | Description |
|----------|-------------|
| `VITE_AWS_REGION` | AWS region (e.g. `ap-south-1`) |
| `VITE_AWS_USER_POOL_ID` | Cognito User Pool ID |
| `VITE_AWS_USER_POOL_CLIENT_ID` | Cognito App Client ID (no secret) |
| `VITE_AWS_COGNITO_DOMAIN` | Hosted UI domain (no `https://`) |
| `VITE_AWS_REDIRECT_SIGN_IN` | OAuth callback URL (must match App Client) |
| `VITE_AWS_REDIRECT_SIGN_OUT` | Sign-out redirect URL (must match App Client) |

---

## Common Issues & Fixes

| Symptom | Root Cause | Fix |
|---------|-----------|-----|
| HTTP 400 after Google login | `phone` scope in Amplify config | Remove `phone`, keep `openid email profile` |
| `redirect_uri_mismatch` | Google redirect URI points to localhost | Set it to `https://<cognito-domain>/oauth2/idpresponse` |
| Dashboard never loads after Google login | No Amplify Hub listener | `Hub.listen('auth')` in App.jsx catches `signedIn` event |
| User not created in Cognito | Wrong App Client ID or mismatched pool | Verify `VITE_AWS_USER_POOL_ID` and `VITE_AWS_USER_POOL_CLIENT_ID` match the same pool |
| `invalid_scope` error | Scope not enabled on App Client | Enable `email`, `openid`, `profile` in App Client OAuth settings |
