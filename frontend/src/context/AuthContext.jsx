import React, { useState, useEffect } from 'react';
import { AuthContext } from './contexts';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('xp_arena_user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 0);
        return () => clearTimeout(timer);
    }, []);

    const login = async (username, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (password === 'password') {
                    const mockUser = {
                        id: 1,
                        username,
                        axp: 1250,
                        rank: 'Elite',
                        joinDate: '2026-01-15',
                        setups: 5
                    };
                    setUser(mockUser);
                    localStorage.setItem('xp_arena_user', JSON.stringify(mockUser));
                    resolve(mockUser);
                } else {
                    reject('Invalid credentials (use any username + "password")');
                }
            }, 800);
        });
    };

    const signup = async (username, email) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockUser = {
                    id: Date.now(),
                    username,
                    email,
                    axp: 0,
                    rank: 'Rookie',
                    joinDate: new Date().toISOString().split('T')[0],
                    setups: 0
                };
                setUser(mockUser);
                localStorage.setItem('xp_arena_user', JSON.stringify(mockUser));
                resolve(mockUser);
            }, 800);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('xp_arena_user');
    };

    const addAXP = (amount) => {
        if (user) {
            const updatedUser = { ...user, axp: user.axp + amount };
            if (updatedUser.axp >= 2000) updatedUser.rank = 'Champion';
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
