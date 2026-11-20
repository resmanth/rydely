
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiRequest } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(
        () => localStorage.getItem('rydely-token')
    );
    const [authLoading, setAuthLoading] = useState(true);

    const clearSession = useCallback(() => {
        localStorage.removeItem('rydely-token');
        setToken(null);
        setUser(null);
    }, []);

    // Listen for 401 events dispatched by apiRequest
    useEffect(() => {
        const handler = () => clearSession();
        window.addEventListener('rydely:unauthorized', handler);
        return () => window.removeEventListener('rydely:unauthorized', handler);
    }, [clearSession]);

    const fetchUser = useCallback(async (authToken) => {
        try {
            const data = await apiRequest('/api/user/data', {
                headers: { Authorization: authToken },
            });
            setUser(data.user);
            return data.user;
        } catch (error) {
            // Only clear session on auth failures, NOT on network errors
            if (error.status === 401) {
                clearSession();
            }
            throw error;
        }
    }, [clearSession]);

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

    const logout = useCallback(() => {
        clearSession();
    }, [clearSession]);

    /** Re-fetch the current user from the server (e.g. after change-role). */
    const refreshUser = useCallback(async () => {
        const t = localStorage.getItem('rydely-token');
        if (t) await fetchUser(t);
    }, [fetchUser]);

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
                isAuthenticated: !!user,
                isOwner: user?.role === 'owner',
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext);
};
