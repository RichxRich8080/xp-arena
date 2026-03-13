import React, { useState, useEffect } from 'react';
import { AuthContext } from './contexts';
import { authService } from '../services/api';

const rankFromPoints = (points = 0) => {
    if (points >= 5000) return 'Elite';
    if (points >= 2000) return 'Professional';
    if (points >= 1000) return 'Advanced';
    return 'Beginner';
};

const normalizeUser = (user) => {
    const axp = Number(user?.axp || 0);
    return {
        ...user,
        axp,
        rank: user?.rank || rankFromPoints(axp)
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
                const { data } = await authService.verifySession();
                if (!data?.success || !data?.user) {
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
        let data;
        try {
            ({ data } = await authService.login(username, password));
        } catch (error) {
            throw (error?.message || 'Network error. Please check your connection.');
        }

        if (!data?.success || !data?.token) {
            throw (data?.message || 'Invalid username or password');
        }

        const normalized = normalizeUser(data.user || { username });
        localStorage.setItem('token', data.token);
        localStorage.setItem('xp_arena_user', JSON.stringify(normalized));
        setUser(normalized);
        return normalized;
    };
    const signup = async (username, email, password) => {
        try {
            const { data } = await authService.signup(username, email, password);
            if (!data?.success) {
                throw new Error(data?.message || 'Registration failed');
            }
            return data;
        } catch (error) {
            throw (error?.message || 'Network error. Please check your connection.');
        }
    };


    const updateUser = (patch) => {
        if (!user) return null;
        const merged = normalizeUser({ ...user, ...patch });
        setUser(merged);
        localStorage.setItem('xp_arena_user', JSON.stringify(merged));
        return merged;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('xp_arena_user');
    };

    const addPoints = (amount) => {
        if (!user) return;
        const nextPoints = (user.axp || 0) + amount;
        updateUser({ axp: nextPoints });
    };

    const triggerSystemPulse = () => {
        // Standard system pulse logic
        console.log('System pulse synchronized');
    };

    const syncUser = async () => {
        if (!localStorage.getItem('token')) return;
        try {
            const user = await userService.syncProfile();
            if (user) {
                const normalized = normalizeUser(user);
                setUser(normalized);
                localStorage.setItem('xp_arena_user', JSON.stringify(normalized));
            }
        } catch (err) {
            console.error('Failed to sync user data:', err);
        }
    };

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
        syncUser,
        updateUser,
        addPoints,
        triggerSystemPulse,
        isAuthenticated: !!user
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
