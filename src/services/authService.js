import {
    signUp as amplifySignUp,
    confirmSignUp as amplifyConfirmSignUp,
    signIn as amplifySignIn,
    signOut as amplifySignOut,
    getCurrentUser as amplifyGetCurrentUser,
    resetPassword as amplifyResetPassword,
    confirmResetPassword as amplifyConfirmResetPassword,
    signInWithRedirect,
} from "aws-amplify/auth";
import {
    clearStoredSession,
    findStoredUser,
    getStoredSession,
    saveStoredUser,
    setStoredSession,
} from "./localAuthStore";
import { authConfig } from "../config/authConfig";
import { ROLES } from "../constants/roles";

/* ---------------- Friendly Error Messages ---------------- */

function friendlyError(err) {
    const errors = {
        UsernameExistsException:
            "An account with this email or phone already exists.",

        UserNotFoundException:
            "No account found with this email or phone number.",

        NotAuthorizedException:
            "Incorrect password.",

        UserNotConfirmedException:
            "Please verify your account using the OTP sent to your email.",

        CodeMismatchException:
            "Incorrect verification code.",

        ExpiredCodeException:
            "Verification code expired.",

        InvalidPasswordException:
            "Password doesn't meet the required policy.",

        LimitExceededException:
            "Too many attempts. Please try again later.",

        TooManyRequestsException:
            "Too many requests. Please wait a moment.",

        NetworkError:
            "Please check your internet connection.",
    };

    return errors[err.name] || err.message || "Something went wrong.";
}

/* =======================================================
                    AUTH SERVICE
======================================================= */

const isAwsConfigured = Boolean(
    import.meta.env.VITE_AWS_USER_POOL_ID &&
    import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID &&
    import.meta.env.VITE_AWS_COGNITO_DOMAIN
);

function normalizeUsername(username) {
    return (username || "").trim().toLowerCase();
}

function createLocalUser(username, password, name) {
    return {
        id: `local-${Date.now()}`,
        fullName: name || "User",
        email: normalizeUsername(username),
        username: normalizeUsername(username),
        password,
        role: ROLES.USER,
        createdAt: new Date().toISOString(),
        profileImage: "",
        preferences: {},
        lastLogin: new Date().toISOString(),
        confirmed: false,
    };
}

function createLocalAuthError(name, message) {
    const error = new Error(message);
    error.name = name;
    return error;
}

export const authService = {
    /* ---------------- SIGN UP ---------------- */

    async signUp({ username, password, options }) {
        const normalizedUsername = normalizeUsername(username);
        const adminEmails = [
            normalizeUsername(authConfig.superAdminEmail),
            "aasithya.daven@gmail.com",
            "aadithya.davns@gmail.com",
            "aadithya.davns@gmai.com",
            "aadithya.danvs@gmai.com",
            "aadithya.danvs@gmail.com",
            "aasithya.daven@gmai.com"
        ];
        if (adminEmails.includes(normalizedUsername)) {
            throw createLocalAuthError(
                "UsernameExistsException",
                "Administrator accounts cannot be registered. Please sign in."
            );
        }

        if (!isAwsConfigured) {
            const existingUser = findStoredUser(normalizedUsername);
            if (existingUser) {
                throw createLocalAuthError(
                    "UsernameExistsException",
                    "An account with this email or phone already exists."
                );
            }

            const userAttributes = options?.userAttributes || [];
            const name = userAttributes.find((attr) => attr.Name === "name")?.Value || "User";
            saveStoredUser(createLocalUser(normalizedUsername, password, name));
            return { userConfirmed: false, userSub: `local-${Date.now()}` };
        }

        try {
            return await amplifySignUp({
                username,
                password,
                options,
            });
        } catch (err) {
            throw new Error(friendlyError(err));
        }
    },

    /* ---------------- OTP VERIFY ---------------- */

    async confirmSignUp({ username, confirmationCode }) {
        if (!isAwsConfigured) {
            const normalizedUsername = normalizeUsername(username);
            const existingUser = findStoredUser(normalizedUsername);
            if (!existingUser) {
                throw createLocalAuthError(
                    "UserNotFoundException",
                    "No account found with this email or phone number."
                );
            }
            if (!String(confirmationCode || "").trim()) {
                throw createLocalAuthError("CodeMismatchException", "Incorrect verification code.");
            }
            existingUser.confirmed = true;
            saveStoredUser(existingUser);
            return { success: true };
        }

        try {
            return await amplifyConfirmSignUp({
                username,
                confirmationCode,
            });
        } catch (err) {
            throw new Error(friendlyError(err));
        }
    },

    /* ---------------- LOGIN ---------------- */

    async signIn({ username, password }) {
        const normalizedUsername = normalizeUsername(username);
        const adminEmails = [
            normalizeUsername(authConfig.superAdminEmail),
            "aasithya.daven@gmail.com",
            "aadithya.davns@gmail.com",
            "aadithya.davns@gmai.com",
            "aadithya.danvs@gmai.com",
            "aadithya.danvs@gmail.com",
            "aasithya.daven@gmai.com"
        ];

        // Super User / Admin Authentication
        if (adminEmails.includes(normalizedUsername)) {
            if (password !== authConfig.superAdminPassword) {
                throw createLocalAuthError("NotAuthorizedException", "Incorrect password.");
            }
            const adminSession = {
                username: normalizedUsername,
                name: "Aadithya (Super User)",
                displayName: "Aadithya (Super User)",
                email: normalizedUsername,
                role: ROLES.SUPER_ADMIN,
                isAdmin: true,
                isAuthenticated: true,
                sessionToken: `session-${Date.now()}`,
                loginTimestamp: new Date().toISOString(),
            };
            setStoredSession(adminSession);
            return { isSignedIn: true, username: normalizedUsername, role: ROLES.SUPER_ADMIN, isAdmin: true, user: adminSession };
        }

        if (!isAwsConfigured) {
            const existingUser = findStoredUser(normalizedUsername);
            if (!existingUser) {
                throw createLocalAuthError(
                    "UserNotFoundException",
                    "Invalid email or password."
                );
            }
            if (existingUser.password !== password) {
                throw createLocalAuthError("NotAuthorizedException", "Invalid email or password.");
            }
            if (!existingUser.confirmed) {
                throw createLocalAuthError(
                    "UserNotConfirmedException",
                    "Please verify your account using the OTP sent to your email."
                );
            }

            // Update lastLogin
            existingUser.lastLogin = new Date().toISOString();
            saveStoredUser(existingUser);

            const userSession = {
                username: normalizedUsername,
                name: existingUser.fullName,
                displayName: existingUser.fullName,
                email: normalizedUsername,
                role: existingUser.role || ROLES.USER,
                isAuthenticated: true,
                sessionToken: `session-${Date.now()}`,
                loginTimestamp: new Date().toISOString(),
            };

            setStoredSession(userSession);
            return { isSignedIn: true, username: normalizedUsername, role: userSession.role, user: userSession };
        }

        try {
            const result = await amplifySignIn({
                username,
                password,
            });
            return result;
        } catch (err) {
            throw new Error(friendlyError(err));
        }
    },

    /* ---------------- FORGOT PASSWORD ---------------- */

    async resetPassword({ username }) {
        if (!isAwsConfigured) {
            const normalizedUsername = normalizeUsername(username);
            const existingUser = findStoredUser(normalizedUsername);
            if (!existingUser) {
                throw createLocalAuthError(
                    "UserNotFoundException",
                    "No account found with this email or phone number."
                );
            }
            return { codeDeliveryDetails: { destination: normalizedUsername } };
        }

        try {
            return await amplifyResetPassword({
                username,
            });
        } catch (err) {
            throw new Error(friendlyError(err));
        }
    },

    /* ---------------- RESET PASSWORD OTP ---------------- */

    async confirmResetPassword({
        username,
        confirmationCode,
        newPassword,
    }) {
        if (!isAwsConfigured) {
            const normalizedUsername = normalizeUsername(username);
            const existingUser = findStoredUser(normalizedUsername);
            if (!existingUser) {
                throw createLocalAuthError(
                    "UserNotFoundException",
                    "No account found with this email or phone number."
                );
            }
            if (!String(confirmationCode || "").trim()) {
                throw createLocalAuthError("CodeMismatchException", "Incorrect verification code.");
            }
            existingUser.password = newPassword;
            saveStoredUser(existingUser);
            return { success: true };
        }

        try {
            return await amplifyConfirmResetPassword({
                username,
                confirmationCode,
                newPassword,
            });
        } catch (err) {
            throw new Error(friendlyError(err));
        }
    },

    /* ---------------- GOOGLE / SOCIAL SIGN-IN ---------------- */

    async federatedSignIn(provider = "Google") {
        if (!isAwsConfigured) {
            throw new Error(
                "AWS Cognito is not configured for Google sign-in. Copy .env.example to .env and fill in VITE_AWS_USER_POOL_ID, VITE_AWS_USER_POOL_CLIENT_ID, VITE_AWS_COGNITO_DOMAIN, VITE_AWS_REDIRECT_SIGN_IN, and VITE_AWS_REDIRECT_SIGN_OUT."
            );
        }

        try {
            return await signInWithRedirect({ provider });
        } catch (err) {
            console.error("[federatedSignIn] Full error:", err);
            console.error("[federatedSignIn] Name:", err.name);
            console.error("[federatedSignIn] Message:", err.message);
            throw new Error(err.message || "Google sign-in failed.");
        }
    },

    /* ---------------- CURRENT USER ---------------- */

    async getCurrentUser() {
        const storedSession = getStoredSession();
        if (storedSession?.isAuthenticated) {
            return storedSession;
        }

        if (!isAwsConfigured) {
            return storedSession || null;
        }

        try {
            return await amplifyGetCurrentUser();
        } catch {
            return storedSession || null;
        }
    },

    /* ---------------- LOGOUT ---------------- */

    async signOut() {
        // Always clear local session data
        clearStoredSession();

        if (!isAwsConfigured) {
            return;
        }

        try {
            await amplifySignOut();
        } catch (err) {
            // Local session already cleared above
            throw new Error(friendlyError(err));
        }
    },
};