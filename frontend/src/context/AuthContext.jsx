/**
 * AuthContext.jsx — Manages user authentication state for the entire app.
 *
 * This context provides:
 *   - `user`             → the logged-in user object (or null)
 *   - `token`            → the JWT auth token stored in localStorage
 *   - `authLoading`      → true while we're checking if a saved session exists
 *   - `login(email, pw)` → logs in and fetches the user profile
 *   - `register(name, email, pw)` → creates account and fetches the user profile
 *   - `logout()`         → clears the session
 *   - `refreshUser()`    → re-fetches user data from the server (e.g. after role change)
 *   - `isAuthenticated`  → boolean shortcut: true if user is logged in
 *   - `isOwner`          → boolean shortcut: true if user has the "owner" role
 *
 * How it works:
 *   On first load, it checks localStorage for a saved token. If found, it calls
 *   the backend to fetch the user's profile. If the token is invalid (401), the
 *   session is cleared automatically.
 */

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiRequest } from '../services/api';

// --- Create the context (starts as null, filled by AuthProvider) ---
const AuthContext = createContext(null);

// ============================================================
// AuthProvider — Wraps the app and provides auth state to all children
// ============================================================
export const AuthProvider = ({ children }) => {
    // --- Authentication State ---
    const [user, setUser] = useState(null);                       // The current user object from the backend
    const [token, setToken] = useState(                           // JWT token, initialised from localStorage
        () => localStorage.getItem('rydely-token')
    );
    const [authLoading, setAuthLoading] = useState(true);         // True until the initial session check finishes

    // --- Clear Session ---
    // Removes the token from storage and resets user state to logged-out
    const clearSession = useCallback(() => {
        localStorage.removeItem('rydely-token');
        setToken(null);
        setUser(null);
    }, []);

    // --- Listen for 401 Unauthorized Events ---
    // When the api.js service gets a 401 response, it fires a custom DOM event.
    // We listen for it here and automatically log the user out.
    useEffect(() => {
        const handleUnauthorized = () => clearSession();
        window.addEventListener('rydely:unauthorized', handleUnauthorized);
        return () => window.removeEventListener('rydely:unauthorized', handleUnauthorized);
    }, [clearSession]);

    // --- Fetch User Profile from Backend ---
    // Calls the /api/user/data endpoint using the given token to get user info.
    const fetchUser = useCallback(async (authToken) => {
        try {
            const data = await apiRequest('/api/user/data', {
                headers: { Authorization: authToken },
            });
            setUser(data.user);
            return data.user;
        } catch (error) {
            // Only clear session on auth failures (401), NOT on network errors
            if (error.status === 401) {
                clearSession();
            }
            throw error;
        }
    }, [clearSession]);

    // --- Restore Session on App Load ---
    // When the app first opens, check if there's a saved token and try to load the user.
    useEffect(() => {
        const restoreSession = async () => {
            if (!token) {
                setAuthLoading(false);
                return;
            }
            try {
                await fetchUser(token);
            } catch (error) {
                console.error('Session restoration failed:', error.message);
            } finally {
                setAuthLoading(false);
            }
        };
        restoreSession();
    }, [token, fetchUser]);

    // --- Login ---
    // Sends email & password to the backend, saves the token, and fetches the user profile.
    const login = async (email, password) => {
        const data = await apiRequest('/api/user/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        localStorage.setItem('rydely-token', data.token);
        setToken(data.token);

        try {
            await fetchUser(data.token);
        } catch (error) {
            throw new Error('Login succeeded, but we could not load your profile.', { cause: error });
        }
    };

    // --- Register ---
    // Sends name, email & password to create a new account, then fetches the user profile.
    const register = async (name, email, password) => {
        const data = await apiRequest('/api/user/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        });

        localStorage.setItem('rydely-token', data.token);
        setToken(data.token);

        try {
            await fetchUser(data.token);
        } catch (error) {
            throw new Error('Account created, but we could not load your profile.', { cause: error });
        }
    };

    // --- Logout ---
    // Simply clears the saved session (token + user state).
    const logout = useCallback(() => {
        clearSession();
    }, [clearSession]);

    // --- Refresh User ---
    // Re-fetches the current user from the server (useful after changing role, etc.).
    const refreshUser = useCallback(async () => {
        const currentToken = localStorage.getItem('rydely-token');
        if (currentToken) await fetchUser(currentToken);
    }, [fetchUser]);

    // --- Provide Auth Values to All Children ---
    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                authLoading,
                login,
                register,
                logout,
                refreshUser,
                isAuthenticated: !!user,          // true if a user object exists
                isOwner: user?.role === 'owner',   // true if user has the "owner" role
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// --- useAuth Hook ---
// Convenience hook so components can do: const { user, login } = useAuth();
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext);
};
