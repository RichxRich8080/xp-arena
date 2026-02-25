const { pool } = require('./db');

async function ensureTable(name, sql) {
  try {
    await pool.query(sql);
    console.log(`✅ Table checked/created: ${name}`);
  } catch (err) {
    console.error(`❌ Error ensuring table ${name}:`, err.message);
    throw err;
  }
}

async function ensureColumn(table, column, definition) {
  try {
    const [rows] = await pool.query(
      'SELECT COUNT(*) AS c FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?',
      [table, column]
    );
    if (rows[0].c === 0) {
      await pool.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
      console.log(`✅ Column added: ${table}.${column}`);
    }
  } catch (err) {
    console.error(`❌ Error ensuring column ${table}.${column}:`, err.message);
  }
}

async function ensureIndex(table, indexName, columns) {
  try {
    const [rows] = await pool.query(
      'SELECT COUNT(1) AS c FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ?',
      [table, indexName]
    );
    if (rows[0].c === 0) {
      await pool.query(`ALTER TABLE ${table} ADD INDEX ${indexName} (${columns})`);
      console.log(`✅ Index added: ${table}.${indexName}`);
    }
  } catch (err) {
    console.error(`❌ Error ensuring index ${table}.${indexName}:`, err.message);
  }
}

async function run() {
  console.log('🚀 Starting DB Migration...');

  // 1. Core Tables
  await ensureTable('users', `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      axp INT DEFAULT 0,
      level INT DEFAULT 1,
      avatar VARCHAR(255) DEFAULT '👤',
      streak INT DEFAULT 0,
      last_login DATETIME,
      socials TEXT,
      name_changes INT DEFAULT 0,
      is_premium TINYINT(1) DEFAULT 0,
      premium_name_color VARCHAR(20),
      premium_glow TINYINT(1) DEFAULT 0,
      vip_badge TINYINT(1) DEFAULT 0,
      guild_id INT,
      xp_doubler_until DATETIME,
      is_admin TINYINT(1) DEFAULT 0,
      banned TINYINT(1) DEFAULT 0,
      ban_reason VARCHAR(255),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await ensureTable('activity', `
    CREATE TABLE IF NOT EXISTS activity (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      text VARCHAR(255) NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await ensureTable('history', `
    CREATE TABLE IF NOT EXISTS history (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      device VARCHAR(255),
      general_mid DOUBLE,
      general_range VARCHAR(50),
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await ensureTable('presets', `
    CREATE TABLE IF NOT EXISTS presets (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      name VARCHAR(255),
      settings_json TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await ensureTable('vault', `
    CREATE TABLE IF NOT EXISTS vault (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      settings_json TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await ensureTable('clips', `
    CREATE TABLE IF NOT EXISTS clips (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      url VARCHAR(255),
      title VARCHAR(255),
      device VARCHAR(255),
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await ensureTable('user_achievements', `
    CREATE TABLE IF NOT EXISTS user_achievements (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      achievement_id VARCHAR(100),
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE KEY (user_id, achievement_id)
    )
  `);

  await ensureTable('setups', `
    CREATE TABLE IF NOT EXISTS setups (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      mode ENUM('manual','auto') NOT NULL,
      general INT NOT NULL,
      reddot INT NOT NULL,
      scope2x INT NOT NULL,
      scope4x INT NOT NULL,
      scope8x INT NOT NULL,
      comment TEXT NOT NULL,
      is_private TINYINT(1) DEFAULT 0,
      likes INT DEFAULT 0,
      copies INT DEFAULT 0,
      checksum VARCHAR(64) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE KEY uniq_user_checksum (user_id, checksum)
    )
  `);

  await ensureTable('setup_likes', `
    CREATE TABLE IF NOT EXISTS setup_likes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      setup_id INT NOT NULL,
      user_id INT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (setup_id) REFERENCES setups(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE KEY uniq_like (setup_id, user_id)
    )
  `);

  await ensureTable('setup_copies', `
    CREATE TABLE IF NOT EXISTS setup_copies (
      id INT AUTO_INCREMENT PRIMARY KEY,
      setup_id INT NOT NULL,
      user_id INT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (setup_id) REFERENCES setups(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE KEY uniq_copy (setup_id, user_id)
    )
  `);

  await ensureTable('guilds', `
    CREATE TABLE IF NOT EXISTS guilds (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      owner_user_id INT NOT NULL,
      premium_only TINYINT(1) DEFAULT 0,
      badge VARCHAR(10),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await ensureTable('guild_members', `
    CREATE TABLE IF NOT EXISTS guild_members (
      id INT AUTO_INCREMENT PRIMARY KEY,
      guild_id INT NOT NULL,
      user_id INT NOT NULL,
      role ENUM('owner','admin','member') DEFAULT 'member',
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (guild_id) REFERENCES guilds(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE KEY uniq_member (guild_id, user_id)
    )
  `);

  await ensureTable('guild_war_applications', `
    CREATE TABLE IF NOT EXISTS guild_war_applications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      guild_id INT NOT NULL,
      note VARCHAR(255),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (guild_id) REFERENCES guilds(id) ON DELETE CASCADE
    )
  `);

  await ensureTable('tournaments', `
    CREATE TABLE IF NOT EXISTS tournaments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      creator_user_id INT NOT NULL,
      entry_fee_axp INT DEFAULT 0,
      prize_pool_axp INT DEFAULT 0,
      winner_user_id INT,
      private_only TINYINT(1) DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (creator_user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (winner_user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  await ensureTable('tournament_participants', `
    CREATE TABLE IF NOT EXISTS tournament_participants (
      id INT AUTO_INCREMENT PRIMARY KEY,
      tournament_id INT NOT NULL,
      user_id INT NOT NULL,
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE KEY uniq_participant (tournament_id, user_id)
    )
  `);

  await ensureTable('creators', `
    CREATE TABLE IF NOT EXISTS creators (
      user_id INT PRIMARY KEY,
      slug VARCHAR(100) UNIQUE NOT NULL,
      bio TEXT,
      banner_url VARCHAR(255),
      verified TINYINT(1) DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await ensureTable('creator_followers', `
    CREATE TABLE IF NOT EXISTS creator_followers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      creator_user_id INT NOT NULL,
      follower_user_id INT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (creator_user_id) REFERENCES creators(user_id) ON DELETE CASCADE,
      FOREIGN KEY (follower_user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE KEY uniq_creator_follower (creator_user_id, follower_user_id)
    )
  `);

  await ensureTable('push_subscriptions', `
    CREATE TABLE IF NOT EXISTS push_subscriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        subscription_json TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY (user_id)
    )
  `);

  await ensureTable('axp_history', `
    CREATE TABLE IF NOT EXISTS axp_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        axp INT NOT NULL,
        date DATE NOT NULL,
        UNIQUE KEY user_date_uniq (user_id, date),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await ensureTable('premium_codes', `
    CREATE TABLE IF NOT EXISTS premium_codes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        duration_days INT DEFAULT 30,
        used_by INT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME,
        FOREIGN KEY (used_by) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  await ensureTable('shop_items', `
    CREATE TABLE IF NOT EXISTS shop_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        type ENUM('booster', 'cosmetic', 'item') DEFAULT 'item',
        price_axp INT NOT NULL,
        stock INT DEFAULT -1,
        icon VARCHAR(50),
        rarity ENUM('common', 'uncommon', 'rare', 'epic', 'legendary') DEFAULT 'common',
        active TINYINT(1) DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await ensureTable('user_inventory', `
    CREATE TABLE IF NOT EXISTS user_inventory (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        item_id INT NOT NULL,
        purchased_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (item_id) REFERENCES shop_items(id) ON DELETE CASCADE
    )
  `);

  // 2. Structural checks (columns that might be missing in older versions)
  await ensureColumn('users', 'is_premium', 'TINYINT(1) DEFAULT 0');
  await ensureColumn('users', 'premium_name_color', 'VARCHAR(20)');
  await ensureColumn('users', 'premium_glow', 'TINYINT(1) DEFAULT 0');
  await ensureColumn('users', 'vip_badge', 'TINYINT(1) DEFAULT 0');
  await ensureColumn('users', 'guild_id', 'INT NULL');
  await ensureColumn('users', 'xp_doubler_until', 'DATETIME NULL');
  await ensureColumn('users', 'is_admin', 'TINYINT(1) DEFAULT 0');
  await ensureColumn('users', 'banned', 'TINYINT(1) DEFAULT 0');
  await ensureColumn('users', 'ban_reason', 'VARCHAR(255)');
  await ensureColumn('users', 'avatar', "VARCHAR(255) DEFAULT '👤'");
  await ensureColumn('users', 'email_verified', 'TINYINT(1) DEFAULT 0');
  await ensureColumn('users', 'verification_token', 'VARCHAR(10)');
  await ensureColumn('users', 'verification_expires', 'DATETIME');
  await ensureColumn('users', 'reset_token', 'VARCHAR(10)');
  await ensureColumn('users', 'reset_token_expires', 'DATETIME');
  await ensureColumn('users', 'referral_code', 'VARCHAR(20)');
  await ensureColumn('users', 'referred_by', 'INT');
  await ensureColumn('users', 'login_attempts', 'INT DEFAULT 0');
  await ensureColumn('users', 'lockout_until', 'DATETIME');
  await ensureColumn('users', 'last_protocol_date', 'DATE');

  // 3. Optimization checks (Indices)
  await ensureIndex('users', 'idx_users_axp', 'axp');
  await ensureIndex('users', 'idx_users_guild', 'guild_id');
  await ensureIndex('activity', 'idx_activity_user_time', 'user_id, timestamp');
  await ensureIndex('setups', 'idx_setups_user_time', 'user_id, created_at');
  await ensureIndex('setups', 'idx_setups_priv_time', 'is_private, created_at');
  await ensureIndex('setups', 'idx_setups_pop', 'likes, copies');
  await ensureIndex('guild_members', 'idx_guild_members_user', 'user_id');
  await ensureIndex('tournaments', 'idx_tournaments_time', 'created_at');
  await ensureIndex('creator_followers', 'idx_creator_followers_creator', 'creator_user_id');

  console.log('✅ Migration finished successfully');
}

run()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  });
