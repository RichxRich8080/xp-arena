const { db, pool } = require('./db');

async function testConnection() {
    console.log('Testing DB helper...');
    console.log('DB object:', Object.keys(db));

    try {
        console.log('Running query: SELECT 1...');
        const result = await db.query('SELECT 1 as test');
        console.log('✅ Query successful:', result);
    } catch (err) {
        console.error('❌ Query failed:', err.message);
        console.error('Error Code:', err.code);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

testConnection();
