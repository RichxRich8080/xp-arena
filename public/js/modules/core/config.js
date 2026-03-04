export function getConfig() {
    const safeConfig = window.CONFIG || {};
    const apiBase = safeConfig.API_BASE || ((location.hostname === 'localhost' || location.hostname === '127.0.0.1') ? 'http://localhost:3000' : '');
    return { ...safeConfig, API_BASE: apiBase };
}

export function applyGlobalConfig() {
    const config = getConfig();
    window.API_URL = config.API_BASE;
    return config;
}
