const { db } = require('./db');

console.log('Testing DB helper...');
console.log('DB object:', db);
if (db && typeof db.run === 'function') {
    console.log('✅ db.run is a function');
} else {
    console.error('❌ db.run is NOT a function');
    console.log('Type of db:', typeof db);
    if (db) console.log('Keys of db:', Object.keys(db));
}

process.exit(0);
