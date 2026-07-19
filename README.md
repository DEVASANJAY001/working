# Simple Authentication App (AWS Cognito)

This is a single-purpose, highly polished authentication web app built with React (Vite), Tailwind CSS v4, and AWS Amplify Auth.

## Features
- **OTP Sign In & Registration**: Enter an email address or phone number to receive a verification code (no password required).
- **Auto-Login on Reset**: Successful password reset immediately authenticates the user and logs them in.
- **Google Federated Sign-In**: Authenticates with Google Federated Sign-in.
- **Visuals**: Clean card layout, rounded corners, soft shadows, light green accents, and micro-animations.
- **Dual Mode (AWS / Mock Mode)**: Includes a fully functional Mock Auth Service to verify and run the UI locally out of the box without needing real AWS credentials.

---

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- AWS Account (for Cognito deployment, optional for local testing)

### 2. Quick Start (Local Mock Mode)
By default, the project runs in Mock Mode so you can inspect the interface and simulate full flows immediately.

1. Clone or download this project.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173).
5. **OTP Code for Mocking**: Enter any email or phone number. When prompted for the verification code, enter `123456`.

---

## Deploying & Connecting to AWS Cognito

To transition from Mock Mode to your production AWS Cognito backend:

### Step 1: Create a Cognito User Pool
1. Go to **AWS Console** -> **Cognito**.
2. Create a User Pool.
3. Select **Email** and **Phone number** as the sign-in aliases.
4. Set MFA/OTP to **Optional** or configure your Cognito custom auth flow triggers for custom OTP passwordless logins.

### Step 2: Configure Federated Identity Provider (Google)
1. Go to **Google Cloud Console** -> **Credentials** and create an OAuth 2.0 Client ID.
2. Add your Cognito User Pool Hosted UI domain to Authorized Redirect URIs: `https://<your-cognito-domain>.auth.<region>.amazoncognito.com/oauth2/idpresponse`.
3. In AWS Cognito User Pool Console: Add Google under **Federated identity providers**. Enter your Google Client ID and Client Secret.

### Step 3: Configure client app details
1. Create an App Client inside the User Pool (do NOT generate a client secret).
2. Configure your Cognito Hosted UI domains, redirect sign-in URL (`http://localhost:5173/`), and redirect sign-out URL (`http://localhost:5173/`).

### Step 4: Environment Settings
Create a `.env` file in the root directory (copy from `.env.example`) and edit details:
```env
# Disable Mock Mode
VITE_USE_MOCK_AUTH=false

# Real Cognito Settings:
VITE_AWS_REGION=us-east-1
VITE_AWS_USER_POOL_ID=us-east-1_xxxxxxxxx
VITE_AWS_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_AWS_COGNITO_DOMAIN=your-auth-domain.auth.us-east-1.amazoncognito.com
VITE_AWS_REDIRECT_SIGN_IN=http://localhost:5173/
VITE_AWS_REDIRECT_SIGN_OUT=http://localhost:5173/
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

---

## Tech Stack & Architecture
- **Frontend Framework**: [React](https://react.dev/) (Vite)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Auth Provider**: [AWS Amplify Auth](https://docs.amplify.aws/)
- **Icons**: [Lucide React](https://lucide.dev/)
