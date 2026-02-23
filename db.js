const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool to MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'xp_arena',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Helper for single queries (compatibility with sqlite3-like interface where possible)
const db = {
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
        return { lastID: results.insertId, changes: results.affectedRows };
    }
};

// Export both the pool and the helper
module.exports = { pool, db };
