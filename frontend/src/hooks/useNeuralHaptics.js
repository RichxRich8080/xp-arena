import { useCallback } from 'react';

// Maps to initNeuralHaptics() specification
export const useNeuralHaptics = () => {
    const triggerHaptic = useCallback((pattern = 10) => {
        // Check if the current device/browser supports vibrating
        if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
            try {
                window.navigator.vibrate(pattern);
            } catch {
                console.warn("Haptic engine disabled by user/browser.");
            }
        }
    }, []);

    const triggerHeavyHaptic = useCallback(() => triggerHaptic([30, 50, 30]), [triggerHaptic]);
    const triggerLightHaptic = useCallback(() => triggerHaptic(10), [triggerHaptic]);

    return { triggerHaptic, triggerHeavyHaptic, triggerLightHaptic };
};
