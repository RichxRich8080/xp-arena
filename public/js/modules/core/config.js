export function getConfig() {
    const safeConfig = window.CONFIG || {};
    const apiBase = safeConfig.API_BASE || '';
    return { ...safeConfig, API_BASE: apiBase };
}

export function applyGlobalConfig() {
    const config = getConfig();
    window.API_URL = config.API_BASE;
    return config;
}
