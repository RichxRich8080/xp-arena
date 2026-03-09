import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNeuralHaptics } from '../hooks/useNeuralHaptics';

const AreniContext = createContext(null);

export const useAreni = () => {
    const context = useContext(AreniContext);
    if (!context) {
        console.warn("[ARENI] useAreni used outside of Provider. Falling back to empty state.");
    }
    return context || {};
};

// Custom hook to sync state with localStorage
function useStickyState(defaultValue, key) {
    const [value, setValue] = useState(() => {
        try {
            const stickyValue = window.localStorage.getItem(key);
            return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
        } catch (e) {
            console.error(`[ARENI] Failed to parse ${key}:`, e);
            return defaultValue;
        }
    });
    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);
    return [value, setValue];
}

export const AreniProvider = ({ children }) => {
    const { triggerLightHaptic, triggerHeavyHaptic } = useNeuralHaptics();
    const { playSuccess, playError } = useAudioUI();

    // Global Player State (Backed by Backend)
    const [axp, setAxp] = useState(0);
    const [level, setLevel] = useState(1);
    const [xp, setXp] = useState(0);
    const [user, setUser] = useState(null);
    const [lastLoginString, setLastLoginString] = useState(null);
    const [loading, setLoading] = useState(true);

    // Toast Notification System
    const [toast, setToast] = useState(null);

    const showAreniAlert = useCallback((message, type = 'success') => {
        if (type === 'success') triggerLightHaptic();
        else triggerHeavyHaptic();
        setToast({ message, type, id: Date.now() });
        setTimeout(() => setToast(null), 3000);
    }, [triggerLightHaptic, triggerHeavyHaptic]);

    // Initial Sync with Backend
    useEffect(() => {
        const syncProfile = async () => {
            const token = localStorage.getItem('areni_token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch('/api/auth/verify', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setUser(data.user);
                    setAxp(data.user.axp);
                    setLevel(data.user.level);
                    setLastLoginString(data.user.last_login ? new Date(data.user.last_login).toDateString() : null);
                }
            } catch (err) {
                console.error("[ARENI] Profile Sync Failed:", err);
            } finally {
                setLoading(false);
            }
        };

        syncProfile();
    }, []);

    const syncGlobalXP = useCallback(async () => {
        const token = localStorage.getItem('areni_token');
        if (!token) return false;

        try {
            const res = await fetch('/api/user/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.user) {
                setUser(data.user);
                setAxp(data.user.axp);
                setLevel(data.user.level);
                showAreniAlert("Cloud Sync Successful", "success");
                return true;
            }
        } catch (err) {
            showAreniAlert("Uplink Failure: Node Unreachable", "error");
        }
        return false;
    }, [showAreniAlert]);

    const buyItem = useCallback(async (cost, itemName) => {
        const token = localStorage.getItem('areni_token');
        if (axp < cost) {
            showAreniAlert(`Insufficient AXP: ${cost} Required`, "error");
            return false;
        }

        try {
            // Real backend purchase logic would go here
            setAxp(prev => prev - cost);
            showAreniAlert(`Purchased: ${itemName}`, "success");
            return true;
        } catch (err) {
            showAreniAlert("Transaction Failed", "error");
            return false;
        }
    }, [axp, showAreniAlert]);

    const claimDaily = useCallback(async () => {
        const token = localStorage.getItem('areni_token');
        if (!token) return false;

        try {
            const res = await fetch('/api/user/daily-login', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setAxp(prev => prev + data.axp);
                setLastLoginString(new Date().toDateString());
                showAreniAlert(`Daily Reward Claimed: +${data.axp} AXP`, "success");
                return true;
            } else {
                showAreniAlert(data.message || "Reward Unavailable", "error");
            }
        } catch (err) {
            showAreniAlert("Reward Uplink Failed", "error");
        }
        return false;
    }, [showAreniAlert]);

    return (
        <AreniContext.Provider value={{
            axp, level, xp, user, loading,
            syncGlobalXP, buyItem, showAreniAlert, claimDaily, lastLoginString
        }}>
            {children}

            {/* Global Notification Toast HUD */}
            {toast && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-[100] neural-stagger">
                    <div className={`p-4 rounded-xl backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)] border flex items-center gap-3 ${toast.type === 'error'
                        ? 'bg-red-900/80 border-red-500 text-white'
                        : 'bg-indigo-900/80 border-indigo-500 text-white'
                        }`}>
                        <div className="text-xl">{toast.type === 'success' ? '⚡' : '⚠️'}</div>
                        <div className="text-sm font-bold uppercase tracking-widest">{toast.message}</div>
                    </div>
                </div>
            )}
        </AreniContext.Provider>
    );
};
