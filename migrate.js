const { pool } = require('./db');

async function ensureColumn(table, column, definition) {
  const [rows] = await pool.query(
    'SELECT COUNT(*) AS c FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?',
    [table, column]
  );
  if (rows[0].c === 0) {
    await pool.query(`ALTER TABLE ${table} ADD ${column} ${definition}`);
  }
}

async function ensureIndex(table, indexName, columns) {
  const [rows] = await pool.query(
    'SELECT COUNT(1) AS c FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ?',
    [table, indexName]
  );
  if (rows[0].c === 0) {
    await pool.query(`ALTER TABLE ${table} ADD INDEX ${indexName} (${columns})`);
  }
}

async function ensureTable(sql) {
  await pool.query(sql);
}

async function run() {
  await ensureTable(`
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
  await ensureTable(`
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
  await ensureTable(`
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
  await ensureTable(`
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
  await ensureTable(`
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
  await ensureTable(`
    CREATE TABLE IF NOT EXISTS guild_war_applications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      guild_id INT NOT NULL,
      note VARCHAR(255),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (guild_id) REFERENCES guilds(id) ON DELETE CASCADE
    )
  `);
  await ensureTable(`
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
  await ensureTable(`
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
  await ensureTable(`
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
  await ensureTable(`
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

  await ensureColumn('users', 'is_premium', 'TINYINT(1) DEFAULT 0');
  await ensureColumn('users', 'premium_name_color', 'VARCHAR(20)');
  await ensureColumn('users', 'premium_glow', 'TINYINT(1) DEFAULT 0');
  await ensureColumn('users', 'vip_badge', 'TINYINT(1) DEFAULT 0');
  await ensureColumn('users', 'guild_id', 'INT NULL');
  await ensureColumn('users', 'xp_doubler_until', 'DATETIME NULL');
  await ensureColumn('users', 'is_admin', 'TINYINT(1) DEFAULT 0');
  await ensureColumn('users', 'banned', 'TINYINT(1) DEFAULT 0');
  await ensureColumn('users', 'ban_reason', 'VARCHAR(255)');

  await ensureIndex('users', 'idx_users_axp', 'axp');
  await ensureIndex('users', 'idx_users_guild', 'guild_id');
  await ensureIndex('activity', 'idx_activity_user_time', 'user_id, timestamp');
  await ensureIndex('setups', 'idx_setups_user_time', 'user_id, created_at');
  await ensureIndex('setups', 'idx_setups_priv_time', 'is_private, created_at');
  await ensureIndex('setups', 'idx_setups_pop', 'likes, copies');
  await ensureIndex('guild_members', 'idx_guild_members_user', 'user_id');
  await ensureIndex('tournaments', 'idx_tournaments_time', 'created_at');
  await ensureIndex('creator_followers', 'idx_creator_followers_creator', 'creator_user_id');
}

run()
  .then(() => {
    console.log('Migration complete');
    process.exit(0);
  })
  .catch(err => {
    console.error('Migration failed', err);
    process.exit(1);
  });
