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
    console.log("[ARENI] Initializing Syndicate Provider...");
    const { triggerLightHaptic, triggerHeavyHaptic } = useNeuralHaptics();

    // Global Persistent Player State (Overrides previous memory resets)
    const [axp, setAxp] = useStickyState(2500, 'areni_axp');
    const [level, setLevel] = useStickyState(42, 'areni_level');
    const [xp, setXp] = useStickyState(4500, 'areni_xp');
    const [lastLoginString, setLastLoginString] = useStickyState(null, 'areni_lastLogin');

    // Toast Notification System
    const [toast, setToast] = useState(null);

    const showAreniAlert = useCallback((message, type = 'success') => {
        if (type === 'success') triggerLightHaptic();
        else triggerHeavyHaptic();

        setToast({ message, type, id: Date.now() });

        setTimeout(() => {
            setToast((current) => current?.id === toast?.id ? null : current);
        }, 3000); // 3 seconds
    }, [triggerLightHaptic, triggerHeavyHaptic, toast]);

    const syncGlobalXP = useCallback(() => {
        // Imitate backend sync and deduction logic
        if (axp >= 500) {
            setAxp(prev => prev - 500); // Arbitrary sync cost
            setXp(prev => prev + 1000); // Grant 1000 regular XP
            showAreniAlert("XP Synced Successfully! -500 AXP", "success");
            return true;
        } else {
            showAreniAlert("Insufficient AXP for Sync.", "error");
            return false;
        }
    }, [axp, showAreniAlert]);

    // Zero-Fail Economy Action Handler
    const buyItem = useCallback((cost, itemName) => {
        if (axp >= cost) {
            setAxp(prev => prev - cost);
            showAreniAlert(`Purchased Vault Item: ${itemName}`, "success");
            return true;
        }
        showAreniAlert(`Insufficient AXP. Required: ${cost}`, "error");
        return false;
    }, [axp, showAreniAlert, setAxp]);

    // Daily Check-In Persistence Handling
    const claimDaily = useCallback(() => {
        const today = new Date().toDateString();
        if (lastLoginString === today) {
            showAreniAlert("Daily Check-in already claimed today.", "error");
            return false;
        }
        setAxp(prev => prev + 50);
        setLastLoginString(today);
        showAreniAlert("Daily Claimed! +50 AXP Added.", "success");
        return true;
    }, [lastLoginString, setAxp, setLastLoginString, showAreniAlert]);

    return (
        <AreniContext.Provider value={{ axp, level, xp, syncGlobalXP, buyItem, showAreniAlert, claimDaily, lastLoginString }}>
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
