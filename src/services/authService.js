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
        username: normalizeUsername(username),
        password,
        name: name || "User",
        confirmed: false,
        createdAt: new Date().toISOString(),
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
        if (!isAwsConfigured) {
            const normalizedUsername = normalizeUsername(username);
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
            "aasithya.daven@gmail.com",
            "aadithya.danvs@gmai.com",
            "aadithya.danvs@gmail.com"
        ];

        // Super User / Admin Authentication
        if (adminEmails.includes(normalizedUsername)) {
            if (password !== "Aadithya1234#") {
                throw createLocalAuthError("NotAuthorizedException", "Incorrect password.");
            }
            const adminSession = {
                username: normalizedUsername,
                name: "Aadithya (Super User)",
                email: normalizedUsername,
                role: "admin",
                isAdmin: true,
                isAuthenticated: true,
            };
            setStoredSession(adminSession);
            return { isSignedIn: true, username: normalizedUsername, role: "admin", isAdmin: true };
        }

        if (!isAwsConfigured) {
            const existingUser = findStoredUser(normalizedUsername);
            if (!existingUser) {
                throw createLocalAuthError(
                    "UserNotFoundException",
                    "No account found with this email or phone number."
                );
            }
            if (existingUser.password !== password) {
                throw createLocalAuthError("NotAuthorizedException", "Incorrect password.");
            }
            if (!existingUser.confirmed) {
                throw createLocalAuthError(
                    "UserNotConfirmedException",
                    "Please verify your account using the OTP sent to your email."
                );
            }

            setStoredSession({
                username: normalizedUsername,
                name: existingUser.name,
                isAuthenticated: true,
            });
            return { isSignedIn: true, username: normalizedUsername };
        }

        try {
            return await amplifySignIn({
                username,
                password,
            });
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
        if (storedSession?.isAdmin) {
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
        if (!isAwsConfigured) {
            clearStoredSession();
            return;
        }

        try {
            await amplifySignOut();
        } catch (err) {
            throw new Error(friendlyError(err));
        }
    },
};