const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: process.env.ENV_FILE || path.resolve(process.cwd(), '.env') });

const toInt = (value, fallback) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeOrigins = (value, isProduction) => {
    if (!value || !value.trim()) {
        return isProduction ? [] : ['http://localhost:3000', 'http://127.0.0.1:3000'];
    }

    return value
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
};

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

const env = {
    nodeEnv,
    isProduction,
    port: toInt(process.env.PORT, 3000),
    jwtSecret: process.env.JWT_SECRET || (!isProduction ? 'dev-only-insecure-secret' : undefined),
    db: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'xp_arena',
        port: toInt(process.env.DB_PORT, 3306),
        connectionLimit: toInt(process.env.DB_CONNECTION_LIMIT, 10),
        rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED
            ? process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true'
            : isProduction,
    },
    allowedOrigins: normalizeOrigins(process.env.ALLOWED_ORIGINS, isProduction),
    adminUsername: process.env.ADMIN_USERNAME,
};

function assertProductionReadiness() {
    if (!env.isProduction) return;
    if (!env.jwtSecret) {
        throw new Error('JWT_SECRET is required in production.');
    }
}

module.exports = { env, assertProductionReadiness };
