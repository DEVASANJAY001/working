# AI Multi-Agent Architecture Specification

This document defines the specialized AI Agent Blueprint for building, scaling, and maintaining the **SimpleAuth & Split Platform** across Web (`/src`) and Mobile (`/mobile`).

---

## Agent Map Overview

```
                                +---------------------------------------------+
                                |      1. PLATFORM ARCHITECT & DATA AGENT     |
                                |     - Cross-Platform Data Sync & Schemas    |
                                +----------------------+----------------------+
                                                       |
        +-------------------------+--------------------+--------------------+-------------------------+
        |                         |                                         |                         |
+-------v-----------------+ +-----v-------------------+             +-------v-----------------+ +-----v-------------------+
| 2. MOBILE NATIVE AGENT  | | 3. MOBILE UI/UX AGENT   |             | 4. WEB FRONTEND AGENT   | | 5. CLOUD AUTH & DATA  |
| - Expo prebuild         | | - Screen Navigator      |             | - React 19 + Vite       | | - AWS Cognito           |
| - TurboModules          | | - 17 Screen Flow        |             | - Tailwind v4           | | - AWS DynamoDB          |
| - Native Google SDK     | | - Micro-animations      |             | - Amplify Hub Listener  | | - OAuth Federation      |
+-------+-----------------+ +-----+-------------------+             +-------+-----------------+ +-----+-------------------+
        |                         |                                         |                         |
        +-------------------------+--------------------+--------------------+-------------------------+
                                                       |
                                +----------------------+----------------------+
                                |        6. DEVOPS & SECURITY AGENT           |
                                |     - Gradle / Android Native Compiles      |
                                |     - Keystores & SHA-1 Audits              |
                                |     - Token Storage & Redirect Validation   |
                                +---------------------------------------------+
```

---

## 1. Platform Architect & Data Agent

### System Responsibility
Acts as the central authority for data models, API interfaces, and state contracts shared across Web (`React + Vite`) and Mobile (`Expo React Native`).

### Key Capabilities & Tools
- **Files Owned**: `mobile/src/services/authService.js`, `src/services/authService.js`, `mobile/src/utils/storage.js`.
- **Core Directives**:
  1. Enforce strict JSON user profile schemas across Web and Mobile:
     ```json
     {
       "fullName": "string",
       "username": "string",
       "email": "string",
       "isLoggedIn": true,
       "isProfileCompleted": boolean,
       "googleConnected": boolean,
       "updatedAt": "ISOString"
     }
     ```
  2. Maintain fallback persistence mechanisms (AsyncStorage for mobile native, localStorage for web).
  3. Ensure API response structures remain deterministic regardless of environment.

---

## 2. Mobile Native & SDK Agent

### System Responsibility
Manages native OS bridges, Android/iOS compiled dependencies, TurboModules, and Expo native prebuilding.

### Key Capabilities & Tools
- **Files Owned**: `mobile/app.json`, `mobile/package.json`, `mobile/android/`, `mobile/ios/`.
- **Core Directives**:
  1. Manage `@react-native-google-signin/google-signin` native bindings for Android Credential Manager and iOS GIDSignIn.
  2. Execute native prebuild tasks: `npx expo prebuild` and `npx expo run:android`.
  3. Guard native module loading with safe try/catch imports to maintain JS bundle stability between Expo Go sandbox and compiled APK/IPA builds.

---

## 3. Mobile UI/UX & Flow Specialist Agent

### System Responsibility
Controls all 17 screens in the mobile application, page transitions, animations, dynamic layouts, and user interactions.

### Key Capabilities & Tools
- **Files Owned**: `mobile/src/screens/*` (17 screens), `mobile/src/components/ScreenNavigator.js`, `mobile/src/theme.js`.
- **Core Screen Pipeline**:
  - `SplashScreen.js` -> `GetStartedScreen.js` -> `LoginScreen.js` / `RegisterScreen.js`
  - `ForgotPasswordScreen.js` -> `ResetPasswordScreen.js` -> `EmailVerificationScreen.js` -> `PhoneNumberScreen.js`
  - `ProfileSetupScreen.js` -> `LanguageSelectionScreen.js` -> `InterestSelectionScreen.js` -> `AllSetScreen.js`
  - `HomeDashboardScreen.js` -> `CommunitiesScreen.js` -> `CommunityManagerScreen.js` -> `CreateContentScreen.js`
- **Core Directives**:
  1. Maintain 60 FPS animated screen slide transitions inside `ScreenNavigator.js`.
  2. Implement polished, high-contrast dark/light mode UI components.
  3. Ensure touch responsiveness and keyboard avoidance (`KeyboardAvoidingView`) across all form inputs.

---

## 4. Web Frontend Specialist Agent

### System Responsibility
Maintains the high-performance desktop and mobile web dashboard built on React 19, Vite, and Tailwind CSS v4.

### Key Capabilities & Tools
- **Files Owned**: `src/App.jsx`, `src/features/auth/AuthPage.jsx`, `src/features/dashboard/Dashboard.jsx`, `src/index.css`.
- **Core Directives**:
  1. Manage single-page app state and Amplify Hub event listeners (`signedIn`, `signedOut`).
  2. Build responsive, glassmorphic UI features using Tailwind CSS v4.
  3. Handle post-OAuth URL query parameters (`?code=...`) cleanly during browser navigation.

---

## 5. Cloud Auth & Infrastructure Agent

### System Responsibility
Oversees AWS Cognito User Pools, App Clients, Google Federated Identity Providers, and DynamoDB backend user sync.

### Key Capabilities & Tools
- **Files Owned**: `.env`, `.env.example`, `src/config/aws-config.js`.
- **Core Directives**:
  1. Configure Cognito OAuth parameters (`ap-south-1` region, scopes `openid`, `email`, `profile`).
  2. Maintain Google OAuth 2.0 Client IDs (Web Client ID, Android Client ID, iOS Client ID).
  3. Manage DynamoDB serverless user table read/write fallback simulation (`authService.js`).

---

## 6. DevOps, Security & Release Agent

### System Responsibility
Executes native Android/iOS compilation, keystore fingerprinting, security validation, and release preparation.

### Key Capabilities & Tools
- **Files Owned**: `mobile/android/app/build.gradle`, `.gitignore`, `vite.config.js`.
- **Core Directives**:
  1. Extract debug/release SHA-1 certificate fingerprints via `.\gradlew signingReport`.
  2. Audit client secrets, ensure `.env` file security, and validate HTTPS callback domains.
  3. Manage port allocation during dev server launches (`npm run dev`, `expo start`).

---

## Multi-Agent Execution Protocol

```
+------------------+       1. Change Request      +--------------------------+
|   User Request   | ---------------------------> | Platform Architect Agent |
+------------------+                              +------------+-------------+
                                                               |
                                                  2. Decomposes Tasks
                                                               |
             +----------------------+--------------------------+--------------------------+
             |                      |                                                     |
+------------v-------------+ +------v-------------------+                     +-----------v------------+
|  Mobile UI & Native      | |  Web Frontend Agent      |                     | Cloud & DevOps Agent   |
|  Agents (Implement UI)   | |  (Implement Web Changes) |                     | (Verify Build & Auth)  |
+--------------------------+ +--------------------------+                     +------------------------+
```
