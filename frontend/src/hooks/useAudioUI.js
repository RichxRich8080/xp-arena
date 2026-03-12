/**
 * Audio UI hook disabled intentionally.
 * Product requirement: remove all SFX/audio side effects.
 */
export const useAudioUI = () => {
    const noop = () => {};

    return {
        playClick: noop,
        playSuccess: noop,
        playError: noop,
        playHover: noop,
    };
};
