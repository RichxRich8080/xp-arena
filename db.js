const mysql = require('mysql2/promise');
require('dotenv').config();

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
    ssl: {
        rejectUnauthorized: false // Required for TiDB Cloud
    }
});

// Test connection and log errors
console.log(`📡 Attempting to connect to TiDB at ${process.env.DB_HOST}:${process.env.DB_PORT || 3306}...`);

pool.getConnection()
    .then(conn => {
        console.log('✅ Successfully connected to TiDB database');
        conn.release();
    })
    .catch(err => {
        console.error('❌ Critical Database Connection Error!');
        console.error('Error Code:', err.code);
        console.error('Error Message:', err.message);
        console.error('Action: Check DB_HOST, DB_USER, DB_PASSWORD, DB_PORT and IP Whitelist on TiDB Cloud.');
    });

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

// Export both the pool and the helper
module.exports = {
    pool,
    db: databaseHelper
};
