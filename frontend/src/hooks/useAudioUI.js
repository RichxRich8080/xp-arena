import { useContext } from 'react';
import { AudioContext } from '../context/AudioContext';

export const useAudioUI = () => {
    const context = useContext(AudioContext);
    
    if (!context) {
        // Return no-ops if called outside provider to prevent crashes
        const noop = () => {};
        return {
            playClick: noop,
            playSuccess: noop,
            playXP: noop,
            playHover: noop,
            initAudio: noop
        };
    }

    return context;
};
