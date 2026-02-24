-- XP Arena MySQL Schema
-- TIP: If you get "Unknown database", look at the top-right of TiDB 
-- and select the "test" database instead of "xp_arena".
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    axp INT DEFAULT 0,
    level INT DEFAULT 1,
    avatar VARCHAR(50) DEFAULT '👤',
    streak INT DEFAULT 0,
    last_login DATETIME,
    socials TEXT,
    -- JSON string
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
);
CREATE TABLE IF NOT EXISTS activity (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    text VARCHAR(255) NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    device VARCHAR(255),
    general_mid DOUBLE,
    general_range VARCHAR(50),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS presets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255),
    settings_json TEXT,
    -- JSON string
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS vault (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    settings_json TEXT,
    -- JSON string
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS clips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    url VARCHAR(255),
    title VARCHAR(255),
    device VARCHAR(255),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS user_achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    achievement_id VARCHAR(100),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY (user_id, achievement_id)
);

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
);

CREATE TABLE IF NOT EXISTS setup_likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setup_id INT NOT NULL,
    user_id INT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (setup_id) REFERENCES setups(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uniq_like (setup_id, user_id)
);

CREATE TABLE IF NOT EXISTS setup_copies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setup_id INT NOT NULL,
    user_id INT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (setup_id) REFERENCES setups(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uniq_copy (setup_id, user_id)
);

CREATE TABLE IF NOT EXISTS guilds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    owner_user_id INT NOT NULL,
    premium_only TINYINT(1) DEFAULT 0,
    badge VARCHAR(10),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS guild_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    guild_id INT NOT NULL,
    user_id INT NOT NULL,
    role ENUM('owner','admin','member') DEFAULT 'member',
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (guild_id) REFERENCES guilds(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uniq_member (guild_id, user_id)
);

CREATE TABLE IF NOT EXISTS guild_war_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    guild_id INT NOT NULL,
    note VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (guild_id) REFERENCES guilds(id) ON DELETE CASCADE
);

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
);

CREATE TABLE IF NOT EXISTS tournament_participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tournament_id INT NOT NULL,
    user_id INT NOT NULL,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uniq_participant (tournament_id, user_id)
);

CREATE TABLE IF NOT EXISTS creators (
    user_id INT PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    bio TEXT,
    banner_url VARCHAR(255),
    verified TINYINT(1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS creator_followers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    creator_user_id INT NOT NULL,
    follower_user_id INT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_user_id) REFERENCES creators(user_id) ON DELETE CASCADE,
    FOREIGN KEY (follower_user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uniq_creator_follower (creator_user_id, follower_user_id)
);

CREATE INDEX idx_users_axp ON users(axp);
CREATE INDEX idx_users_guild ON users(guild_id);
CREATE INDEX idx_activity_user_time ON activity(user_id, timestamp);
CREATE INDEX idx_setups_user_time ON setups(user_id, created_at);
CREATE INDEX idx_setups_priv_time ON setups(is_private, created_at);
CREATE INDEX idx_setups_pop ON setups(likes, copies);
CREATE INDEX idx_guild_members_user ON guild_members(user_id);
CREATE INDEX idx_tournaments_time ON tournaments(created_at);
CREATE INDEX idx_creator_followers_creator ON creator_followers(creator_user_id);
