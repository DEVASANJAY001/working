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

export const authService = {
    /* ---------------- SIGN UP ---------------- */

    async signUp({ username, password, options }) {
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

    // Fixed: now correctly accepts and uses the `provider` argument.
    // Previously, the function signature ignored its argument and hard-coded "Google".
    async federatedSignIn(provider = "Google") {
        try {
            return await signInWithRedirect({ provider });
        } catch (err) {
            // Log the full error for debugging OAuth issues
            console.error("[federatedSignIn] Full error:", err);
            console.error("[federatedSignIn] Name:", err.name);
            console.error("[federatedSignIn] Message:", err.message);
            throw err;
        }
    },

    /* ---------------- CURRENT USER ---------------- */

    async getCurrentUser() {
        try {
            return await amplifyGetCurrentUser();
        } catch {
            return null;
        }
    },

    /* ---------------- LOGOUT ---------------- */

    async signOut() {
        try {
            await amplifySignOut();
        } catch (err) {
            throw new Error(friendlyError(err));
        }
    },
};