
import { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(
        () => localStorage.getItem('rydely-token')
    );
    const [authLoading, setAuthLoading] = useState(true);

    const fetchUser = async (authToken) => {
        try {
            const data = await apiRequest('/api/user/data', {
                headers: {
                    Authorization: authToken,
                },
            });

            if (!data.success) {
                throw new Error(data.message || 'Unable to fetch user');
            }

            setUser(data.user);
            return data.user;
        } catch (error) {
            localStorage.removeItem('rydely-token');
            setToken(null);
            setUser(null);
            throw error;
        }
    };

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
    }, []);

    const login = async (email, password) => {
        const data = await apiRequest('/api/user/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (!data.success) {
            throw new Error(data.message || 'Login failed');
        }

        localStorage.setItem('rydely-token', data.token);
        setToken(data.token);

        try {
            await fetchUser(data.token);
        } catch (error) {
            throw new Error('Login succeeded, but we could not load your profile.');
        }
    };

    const register = async (name, email, password) => {
        const data = await apiRequest('/api/user/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        });

        if (!data.success) {
            throw new Error(data.message || 'Registration failed');
        }

        localStorage.setItem('rydely-token', data.token);
        setToken(data.token);

        try {
            await fetchUser(data.token);
        } catch (error) {
            throw new Error('Account created, but we could not load your profile.');
        }
    };

    const logout = () => {
        localStorage.removeItem('rydely-token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                authLoading,
                login,
                register,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
