/**
 * XP ARENA EXODUS: Global Configuration Engine
 */
const ENV = {
    IS_DEV: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    VERSION: '1.2.0-EXODUS',
    LOG_LEVEL: 'DEBUG'
};

const CONFIG = {
    API_BASE: ENV.IS_DEV ? 'http://localhost:3000' : '',
    ENDPOINTS: {
        USER_PROFILE: '/api/user/profile',
        SHOP_ITEMS: '/api/shop/items',
        SHOP_BUY: '/api/shop/buy',
        GUILD_LEADERBOARD: '/api/guilds/leaderboard',
        GLOBAL_LEADERBOARD: '/api/leaderboard'
    },
    STORAGE_KEYS: {
        TOKEN: 'xp_token',
        USER: 'xp_current_user',
        ACCENT: 'xp_accent_color',
        CLOUD_SYNC: 'xp_cloud_sync',
        STORAGE_PREFIX: 'xp_stats_'
    }
};

window.CONFIG = CONFIG;
window.ENV = ENV;
