/**
 * Persistent Storage Service
 * Manages saved sensitivity presets with Backend Sync
 */

const STORAGE_KEY = 'xp_arena_setups';
const LAST_GEN_KEY = 'xp_last_gen_date';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : null;
};

export const saveSetup = async (setup) => {
    try {
        const headers = getAuthHeaders();
        let remoteId = null;

        if (headers) {
            const response = await fetch('/api/setups/submit', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    mode: 'auto',
                    general: setup.currentSens || setup.baseSens,
                    reddot: setup.reddot || 0,
                    scope2x: setup.scope2x || 0,
                    scope4x: setup.scope4x || 0,
                    scope8x: setup.scope8x || 0,
                    comment: `Auto-generated for ${setup.brand} ${setup.model} (${setup.playStyle})`,
                    screen_size: setup.screenSize,
                    current_sens: setup.currentSens,
                    optimization_analysis: setup.whyAnalysis || setup.analysis,
                    is_private: false
                })
            });
            const data = await response.json();
            if (data.success) {
                remoteId = data.id;
            }
        }

        const existing = getLocalSetups();
        const newSetup = {
            id: remoteId ? `DB-${remoteId}` : `SENS-${Date.now()}`,
            timestamp: new Date().toISOString(),
            ...setup
        };
        const updated = [newSetup, ...existing];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        localStorage.setItem(LAST_GEN_KEY, new Date().toDateString());

        return newSetup;
    } catch (error) {
        console.error('Failed to save setup:', error);
        return null;
    }
};

export const getLocalSetups = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

export const getSetups = async () => {
    const headers = getAuthHeaders();
    if (headers) {
        try {
            const response = await fetch('/api/setups/user', { headers });
            const remoteSetups = await response.json();
            if (Array.isArray(remoteSetups)) {
                // Return transformed remote setups
                return remoteSetups.map(s => ({
                    id: `DB-${s.id}`,
                    timestamp: s.created_at,
                    formData: {
                        brand: s.comment.split('for ')[1]?.split(' ')[0] || 'Unknown',
                        model: s.comment.split('for ')[1]?.split(' (')[0]?.split(' ').slice(1).join(' ') || 'Device',
                        playStyle: s.comment.split('(')[1]?.split(')')[0] || 'Balanced',
                        currentSens: s.current_sens,
                        screenSize: s.screen_size,
                        analysis: s.optimization_analysis
                    }
                }));
            }
        } catch {
            console.error('Backend sync failed, falling back to local storage');
        }
    }
    return getLocalSetups();
};

export const getLastGenerationDate = () => {
    return localStorage.getItem(LAST_GEN_KEY);
};

export const deleteSetup = (id) => {
    try {
        const existing = getLocalSetups();
        const updated = existing.filter(s => s.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return true;
    } catch (error) {
        console.error('Failed to delete setup:', error);
        return false;
    }
};
