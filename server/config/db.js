const fs = require('fs');
const mysql = require('mysql2/promise');
require('dotenv').config();

const shouldUseSsl = process.env.DB_SSL !== 'false';
const allowInsecureTls = process.env.DB_SSL_INSECURE === 'true';
const sslCaPath = process.env.DB_SSL_CA_PATH;

const sslConfig = shouldUseSsl
    ? {
        rejectUnauthorized: !allowInsecureTls,
        ...(sslCaPath ? { ca: fs.readFileSync(sslCaPath, 'utf8') } : {})
    }
    : undefined;

// Create a connection pool optimized for TiDB
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'xp_arena',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: process.env.DB_CONNECTION_LIMIT ? parseInt(process.env.DB_CONNECTION_LIMIT, 10) : 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    ...(sslConfig ? { ssl: sslConfig } : {})
});

async function checkDatabaseConnection() {
    await pool.query('SELECT 1');
    return true;
}

// Helper for single queries (compatible with sqlite3-like interface where possible)
const databaseHelper = {
    async query(sql, params) {
        const [results] = await pool.execute(sql, params);
        return results;
    },

    async get(sql, params) {
        const [results] = await pool.execute(sql, params);
        return results[0];
    },

    async all(sql, params) {
        const [results] = await pool.execute(sql, params);
        return results;
    },

    async run(sql, params) {
        const [results] = await pool.execute(sql, params);
        return {
            lastID: results.insertId,
            changes: results.affectedRows
        };
    }
};

module.exports = {
    pool,
    db: databaseHelper,
    checkDatabaseConnection
};
