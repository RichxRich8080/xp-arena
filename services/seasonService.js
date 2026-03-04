const { db } = require('../db');

const SEASON_REWARDS = [
  { tier: 1, score: 250, type: 'title', name: 'Neon Vanguard' },
  { tier: 2, score: 700, type: 'cosmetic', name: 'Photon Profile Frame' },
  { tier: 3, score: 1400, type: 'boost_card', name: '2x Boost Card (24h)' },
  { tier: 4, score: 2200, type: 'title', name: 'Ecosystem Marshal' },
  { tier: 5, score: 3200, type: 'cosmetic', name: 'Season Aura Trail' }
];

function toSqlDateTime(date) {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

function getSeasonWindow(now = new Date()) {
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  const start = new Date(Date.UTC(y, m, 1, 0, 0, 0));
  const end = new Date(Date.UTC(y, m + 1, 1, 0, 0, 0));
  const seasonId = `${y}-${String(m + 1).padStart(2, '0')}`;
  return {
    seasonId,
    startsAt: start,
    endsAt: end,
    resetWindows: {
      dailyResetUtc: '00:00',
      weeklyResetUtc: 'Monday 00:00',
      seasonResetUtc: toSqlDateTime(end)
    }
  };
}

async function ensureSeasonTables() {
  await db.run(`CREATE TABLE IF NOT EXISTS seasons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    season_id VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(120) NOT NULL,
    starts_at DATETIME NOT NULL,
    ends_at DATETIME NOT NULL,
    reset_windows_json TEXT,
    rewards_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  await db.run(`CREATE TABLE IF NOT EXISTS season_user_scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    season_id VARCHAR(20) NOT NULL,
    user_id INT NOT NULL,
    score INT NOT NULL DEFAULT 0,
    daily_login_points INT NOT NULL DEFAULT 0,
    tournament_points INT NOT NULL DEFAULT 0,
    guild_war_points INT NOT NULL DEFAULT 0,
    aura_points INT NOT NULL DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uniq_season_user (season_id, user_id),
    INDEX idx_season_score (season_id, score)
  )`);

  await db.run(`CREATE TABLE IF NOT EXISTS season_score_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    season_id VARCHAR(20) NOT NULL,
    user_id INT NOT NULL,
    source VARCHAR(40) NOT NULL,
    points INT NOT NULL DEFAULT 0,
    meta_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_season_events (season_id, user_id, source)
  )`);
}

async function ensureSeasonRecord(now = new Date()) {
  await ensureSeasonTables();
  const window = getSeasonWindow(now);
  const title = `Season ${window.seasonId}`;
  await db.run(
    `INSERT INTO seasons (season_id, title, starts_at, ends_at, reset_windows_json, rewards_json)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
      title = VALUES(title),
      starts_at = VALUES(starts_at),
      ends_at = VALUES(ends_at),
      reset_windows_json = VALUES(reset_windows_json),
      rewards_json = VALUES(rewards_json)`,
    [
      window.seasonId,
      title,
      toSqlDateTime(window.startsAt),
      toSqlDateTime(window.endsAt),
      JSON.stringify(window.resetWindows),
      JSON.stringify(SEASON_REWARDS)
    ]
  );
  return window;
}

function parseAura(socials, streak) {
  let parsed = {};
  try {
    parsed = socials ? JSON.parse(socials) : {};
  } catch {
    parsed = {};
  }
  const likes = Number(parsed.likes || parsed.total_likes || parsed.totalLikes || 0) || 0;
  const wins = Number(parsed.wins || parsed.total_wins || parsed.totalWins || 0) || 0;
  return Math.max(0, Math.round((likes * 0.7) + (wins * 12) + ((Number(streak) || 0) * 3)));
}

async function ensureSeasonUserScore(seasonId, userId) {
  await db.run(
    `INSERT INTO season_user_scores (season_id, user_id, score)
     VALUES (?, ?, 0)
     ON DUPLICATE KEY UPDATE season_id = season_id`,
    [seasonId, userId]
  );
}

async function recomputeTotalScore(seasonId, userId) {
  await db.run(
    `UPDATE season_user_scores
     SET score = daily_login_points + tournament_points + guild_war_points + aura_points
     WHERE season_id = ? AND user_id = ?`,
    [seasonId, userId]
  );
}

async function recordSeasonPoints(userId, payload = {}) {
  const window = await ensureSeasonRecord();
  const seasonId = window.seasonId;
  await ensureSeasonUserScore(seasonId, userId);

  const daily = Number(payload.dailyLogin || 0);
  const tourney = Number(payload.tournament || 0);
  const guild = Number(payload.guildWar || 0);

  if (daily || tourney || guild) {
    await db.run(
      `UPDATE season_user_scores
       SET daily_login_points = daily_login_points + ?,
           tournament_points = tournament_points + ?,
           guild_war_points = guild_war_points + ?
       WHERE season_id = ? AND user_id = ?`,
      [daily, tourney, guild, seasonId, userId]
    );
  }

  const entries = [
    ['daily_login', daily],
    ['tournament', tourney],
    ['guild_war', guild]
  ].filter(([, points]) => points > 0);

  for (const [source, points] of entries) {
    await db.run(
      'INSERT INTO season_score_events (season_id, user_id, source, points, meta_json) VALUES (?, ?, ?, ?, ?)',
      [seasonId, userId, source, points, JSON.stringify(payload.meta || {})]
    );
  }

  await recomputeTotalScore(seasonId, userId);
  return seasonId;
}

async function syncAuraPoints(userIds) {
  const window = await ensureSeasonRecord();
  const seasonId = window.seasonId;
  if (!Array.isArray(userIds) || userIds.length === 0) return seasonId;

  const placeholders = userIds.map(() => '?').join(',');
  const users = await db.all(`SELECT id, socials, streak FROM users WHERE id IN (${placeholders})`, userIds);
  for (const user of users) {
    const aura = parseAura(user.socials, user.streak);
    await ensureSeasonUserScore(seasonId, user.id);
    await db.run(
      `UPDATE season_user_scores
       SET aura_points = ?
       WHERE season_id = ? AND user_id = ?`,
      [aura, seasonId, user.id]
    );
    await recomputeTotalScore(seasonId, user.id);
  }
  return seasonId;
}

async function getSeasonProgress(userId) {
  const window = await ensureSeasonRecord();
  const seasonId = await syncAuraPoints([userId]);

  const row = await db.get(
    `SELECT score, daily_login_points, tournament_points, guild_war_points, aura_points
     FROM season_user_scores
     WHERE season_id = ? AND user_id = ?`,
    [seasonId, userId]
  );

  const rankRow = await db.get(
    `SELECT COUNT(*) + 1 AS position
     FROM season_user_scores
     WHERE season_id = ? AND score > ?`,
    [seasonId, Number(row?.score || 0)]
  );

  const participantsRow = await db.get(
    'SELECT COUNT(*) AS total FROM season_user_scores WHERE season_id = ?',
    [seasonId]
  );

  const unlockedRewards = SEASON_REWARDS.filter(r => Number(row?.score || 0) >= r.score);
  const nextReward = SEASON_REWARDS.find(r => Number(row?.score || 0) < r.score) || null;

  return {
    seasonId,
    window,
    score: Number(row?.score || 0),
    breakdown: {
      dailyLogin: Number(row?.daily_login_points || 0),
      tournaments: Number(row?.tournament_points || 0),
      guildWars: Number(row?.guild_war_points || 0),
      leaderboardAura: Number(row?.aura_points || 0)
    },
    rank: Number(rankRow?.position || 1),
    participants: Number(participantsRow?.total || 0),
    rewards: {
      unlocked: unlockedRewards,
      next: nextReward
    }
  };
}

async function getSeasonSummary() {
  const window = await ensureSeasonRecord();
  const seasonId = window.seasonId;

  const top = await db.all(
    `SELECT s.user_id, s.score, u.username
     FROM season_user_scores s
     JOIN users u ON u.id = s.user_id
     WHERE s.season_id = ?
     ORDER BY s.score DESC
     LIMIT 5`,
    [seasonId]
  );
  const participantsRow = await db.get('SELECT COUNT(*) AS total FROM season_user_scores WHERE season_id = ?', [seasonId]);

  return {
    seasonId,
    startsAt: toSqlDateTime(window.startsAt),
    endsAt: toSqlDateTime(window.endsAt),
    resetWindows: window.resetWindows,
    participants: Number(participantsRow?.total || 0),
    leaders: top
  };
}

module.exports = {
  SEASON_REWARDS,
  parseAura,
  ensureSeasonRecord,
  recordSeasonPoints,
  syncAuraPoints,
  getSeasonSummary,
  getSeasonProgress,
};
