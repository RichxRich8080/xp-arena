const { pool } = require('./db');
const fs = require('fs');
const path = require('path');

async function resetDatabase() {
    console.log('🗑️ Starting TiDB Database Reset...');

    let connection;
    try {
        connection = await pool.getConnection();
        console.log('📡 Connected to database.');

        // 1. Disable foreign key checks to allow dropping tables in any order
        await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
        console.log('🔓 Foreign key checks disabled.');

        // 2. Get all tables in the current database
        const [tables] = await connection.query('SHOW TABLES;');
        const dbName = process.env.DB_NAME || 'xp_arena';
        const tableKey = `Tables_in_${dbName}`;

        if (tables.length > 0) {
            console.log(`🧹 Dropping ${tables.length} existing tables...`);
            for (const row of tables) {
                const tableName = row[Object.keys(row)[0]];
                await connection.query(`DROP TABLE IF EXISTS \`${tableName}\`;`);
                console.log(`   - Dropped table: ${tableName}`);
            }
        } else {
            console.log('ℹ️ No tables found to drop.');
        }

        // 3. Read and execute tidb-schema.sql
        const schemaPath = path.join(__dirname, 'tidb-schema.sql');
        console.log(`📜 Reading schema from ${schemaPath}...`);
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Split by semicolon and filter out empty statements
        // Note: Simple split might break if semicolons are inside strings, but for standard SQL files it's usually fine
        const statements = schemaSql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        console.log(`🚀 Executing ${statements.length} SQL statements...`);
        for (let i = 0; i < statements.length; i++) {
            try {
                await connection.query(statements[i]);
            } catch (statementErr) {
                console.error(`❌ Error in statement ${i + 1}:`, statements[i]);
                throw statementErr;
            }
        }

        // 4. Re-enable foreign key checks
        await connection.query('SET FOREIGN_KEY_CHECKS = 1;');
        console.log('🔒 Foreign key checks re-enabled.');

        // 5. Seed Shop Items
        console.log('💎 Seeding Armory Items...');
        const shopItems = [
            ['XP Booster (24h)', 'Double your AXP gain for 24 hours', 500, 'booster', 'fas fa-bolt', 'rare'],
            ['XP Booster (48h)', 'Double your AXP gain for 48 hours', 800, 'booster', 'fas fa-bolt', 'epic'],
            ['Premium Theme: Gold', 'Unlock the luxurious Gold accent theme', 2500, 'cosmetic', 'fas fa-palette', 'epic'],
            ['VIP Badge', 'Exclusive V verified badge next to your name', 5000, 'badge', 'fas fa-check-circle', 'legendary'],
            ['Areni Pro Avatar', 'Special pro player silhouette avatar', 1200, 'avatar', 'fas fa-user-astronaut', 'rare'],
            ['Global Premium Upgrade', 'One-time AXP purchase for permanent Premium status', 25000, 'cosmetic', 'fas fa-gem', 'legendary']
        ];

        for (const item of shopItems) {
            await connection.query(
                'INSERT IGNORE INTO shop_items (name, description, price_axp, type, icon, rarity) VALUES (?, ?, ?, ?, ?, ?)',
                item
            );
        }
        console.log('✅ Armory seeded.');

        console.log('✅ TiDB Database reset and recreation complete!');

    } catch (err) {
        console.error('❌ Reset failed:', err.message);
        if (connection) {
            await connection.query('SET FOREIGN_KEY_CHECKS = 1;');
        }
    } finally {
        if (connection) connection.release();
        await pool.end();
        process.exit(0);
    }
}

resetDatabase();
