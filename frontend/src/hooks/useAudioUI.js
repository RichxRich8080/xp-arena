import { useCallback, useRef, useEffect } from 'react';

// Maps to native WebAudio SFX requirement to feel like a mobile game
export const useAudioUI = () => {
    const audioCtxRef = useRef(null);

    useEffect(() => {
        // Initialize standard Web Audio API without needing real files
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            audioCtxRef.current = new AudioContext();
        }

        return () => {
            if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
                audioCtxRef.current.close();
            }
        };
    }, []);

    const playTone = useCallback((frequency, type, duration, vol = 0.1) => {
        if (!audioCtxRef.current) return;
        try {
            if (audioCtxRef.current.state === 'suspended') {
                audioCtxRef.current.resume();
            }

            const oscillator = audioCtxRef.current.createOscillator();
            const gainNode = audioCtxRef.current.createGain();

            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, audioCtxRef.current.currentTime);

            // Exponential volume fade out to sound natural
            gainNode.gain.setValueAtTime(vol, audioCtxRef.current.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + duration);

            oscillator.connect(gainNode);
            gainNode.connect(audioCtxRef.current.destination);

            oscillator.start();
            oscillator.stop(audioCtxRef.current.currentTime + duration);
        } catch (e) {
            console.warn("AudioContext blocked or failed: ", e);
        }
    }, []);

    const playClick = useCallback(() => playTone(800, 'sine', 0.1, 0.05), [playTone]);
    const playError = useCallback(() => playTone(150, 'sawtooth', 0.3, 0.15), [playTone]);
    const playSuccess = useCallback(() => {
        // Rapid ascending arpeggio for "item unlocked/success" feel
        playTone(440, 'sine', 0.1, 0.1); // A4
        setTimeout(() => playTone(659.25, 'sine', 0.1, 0.1), 100); // E5
        setTimeout(() => playTone(880, 'sine', 0.3, 0.1), 200); // A5
    }, [playTone]);

    return { playClick, playError, playSuccess };
};
