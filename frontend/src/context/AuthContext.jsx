import React, { useState, useEffect } from 'react';
import { AuthContext } from './contexts';

import API_BASE from '../config/apiBase';

const rankFromAXP = (axp = 0) => {
    if (axp >= 2000) return 'Champion';
    if (axp >= 1000) return 'Elite';
    return 'Rookie';
};

const normalizeUser = (user) => {
    const axp = Number(user?.axp || 0);
    return {
        ...user,
        axp,
        rank: user?.rank || rankFromAXP(axp)
    };
};

const getStoredUser = () => {
    const storedUser = localStorage.getItem('xp_arena_user');
    if (!storedUser) return null;
    try {
        return normalizeUser(JSON.parse(storedUser));
    } catch {
        return null;
    }
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(getStoredUser);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifySession = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/auth/verify`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();

                if (!response.ok || !data?.success || !data?.user) {
                    throw new Error(data?.message || 'Session expired');
                }

                const normalized = normalizeUser(data.user);
                setUser(normalized);
                localStorage.setItem('xp_arena_user', JSON.stringify(normalized));
            } catch {
                localStorage.removeItem('token');
                localStorage.removeItem('xp_arena_user');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        verifySession();
    }, []);

    const login = async (username, password) => {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (!response.ok || !data?.success || !data?.token) {
            throw (data?.message || 'Invalid username or password');
        }

        const normalized = normalizeUser(data.user || { username });
        localStorage.setItem('token', data.token);
        localStorage.setItem('xp_arena_user', JSON.stringify(normalized));
        setUser(normalized);
        return normalized;
    };

    const signup = async (username, email, password) => {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        if (!response.ok || !data?.success) {
            throw (data?.message || 'Registration failed');
        }

        // Backend may require verification before issuing JWT, so user can log in next.
        return data;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('xp_arena_user');
    };

    const addAXP = (amount) => {
        if (user) {
            const updatedUser = normalizeUser({ ...user, axp: (user.axp || 0) + amount });
            setUser(updatedUser);
            localStorage.setItem('xp_arena_user', JSON.stringify(updatedUser));
        }
    };

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
        addAXP,
        isAuthenticated: !!user
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
