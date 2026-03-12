const express = require('express');
const router = express.Router();
const { db } = require('../config/db');
const { parseAura, syncAuraPoints, ensureSeasonRecord } = require('./../services/seasonService');

const FALLBACK_LEADERBOARD = [
    { id: 1, username: 'NovaKing', axp: 4500, level: 18, streak: 7, avatar: null, is_premium: 1, vip_badge: 1, socials: '{}' },
    { id: 2, username: 'FlashX', axp: 3800, level: 16, streak: 6, avatar: null, is_premium: 0, vip_badge: 0, socials: '{}' },
    { id: 3, username: 'ZeroPing', axp: 2950, level: 14, streak: 5, avatar: null, is_premium: 0, vip_badge: 0, socials: '{}' },
];

const FALLBACK_ACTIVITY = [
    { text: 'Leaderboard is in fallback mode while services reconnect.', timestamp: new Date().toISOString(), username: 'System', avatar: null }
];

async function getSeasonScoreMap(userIds) {
    if (!userIds.length) return new Map();
    const seasonWindow = await ensureSeasonRecord();
    await syncAuraPoints(userIds);
    const placeholders = userIds.map(() => '?').join(',');
    const seasonRows = await db.all(
        `SELECT user_id, score FROM season_user_scores WHERE season_id = ? AND user_id IN (${placeholders})`,
        [seasonWindow.seasonId, ...userIds]
    );
    return new Map((seasonRows || []).map(r => [Number(r.user_id), Number(r.score || 0)]));
}

const toFormattedLeaderboard = async (users) => {
    const userIds = users.map(u => u.id).filter(Boolean);
    const seasonScoreMap = await getSeasonScoreMap(userIds);
    return users.map(u => ({
        ...u,
        aura_score: parseAura(u.socials, u.streak),
        seasonal_score: seasonScoreMap.get(Number(u.id)) || 0,
        badges: {
            premium: !!u.is_premium,
            v_badge: !!u.vip_badge
        }
    }));
};

router.get('/activity/live', async (req, res) => {
    try {
        const activities = await db.all(`
            SELECT a.text, a.timestamp, u.username, u.avatar
            FROM activity a
            JOIN users u ON a.user_id = u.id
            ORDER BY a.timestamp DESC
            LIMIT 20
        `);
        res.json(activities);
    } catch (err) {
        console.error('[Activity Live] fallback mode:', err.code || err.message);
        res.json(FALLBACK_ACTIVITY);
    }
});

router.get('/leaderboard', async (req, res) => {
    try {
        const users = await db.all(`
            SELECT id, username, axp, level, streak, avatar, is_premium, vip_badge, socials
            FROM users
            WHERE email_verified = 1
            ORDER BY axp DESC
            LIMIT 100
        `);
        const formatted = await toFormattedLeaderboard(users);
        res.json(formatted);
    } catch (err) {
        console.error('[Leaderboard] fallback mode:', err.code || err.message);
        const formatted = FALLBACK_LEADERBOARD.map((u) => ({
            ...u,
            aura_score: parseAura(u.socials, u.streak),
            seasonal_score: 0,
            badges: { premium: !!u.is_premium, v_badge: !!u.vip_badge }
        }));
        res.json(formatted);
    }
});

router.get('/leaderboard/weekly', async (req, res) => {
    try {
        const rows = await db.all(`
            SELECT
                u.id, u.username, u.level, u.streak, u.avatar, u.is_premium, u.vip_badge, u.axp as total_axp, u.socials,
                GREATEST(COALESCE(t.axp, 0) - COALESCE(w.axp, 0), 0) AS axp
            FROM users u
            LEFT JOIN (SELECT user_id, axp FROM axp_history WHERE date = CURDATE()) t ON t.user_id = u.id
            LEFT JOIN (SELECT user_id, axp FROM axp_history WHERE date = DATE_SUB(CURDATE(), INTERVAL 7 DAY)) w ON w.user_id = u.id
            WHERE u.email_verified = 1
            ORDER BY axp DESC
            LIMIT 100
        `, []);
        const formatted = await toFormattedLeaderboard(rows);
        res.json(formatted);
    } catch (err) {
        console.error('[Leaderboard Weekly] fallback mode:', err.code || err.message);
        res.json(FALLBACK_LEADERBOARD);
    }
});

router.get('/leaderboard/today', async (req, res) => {
    try {
        const rows = await db.all(`
            SELECT
                u.id, u.username, u.level, u.streak, u.avatar, u.is_premium, u.vip_badge, u.axp as total_axp, u.socials,
                GREATEST(COALESCE(t.axp, 0) - COALESCE(y.axp, 0), 0) AS axp
            FROM users u
            LEFT JOIN (SELECT user_id, axp FROM axp_history WHERE date = CURDATE()) t ON t.user_id = u.id
            LEFT JOIN (SELECT user_id, axp FROM axp_history WHERE date = DATE_SUB(CURDATE(), INTERVAL 1 DAY)) y ON y.user_id = u.id
            WHERE u.email_verified = 1
            ORDER BY axp DESC
            LIMIT 100
        `, []);
        const formatted = await toFormattedLeaderboard(rows);
        res.json(formatted);
    } catch (err) {
        console.error('[Leaderboard Today] fallback mode:', err.code || err.message);
        res.json(FALLBACK_LEADERBOARD);
    }
});

router.get('/pro-players', async (req, res) => {
    const pros = [
        { id: 1, name: 'NOBRU', team: 'FLUXO', sensitivity: 'General: 95, RedDot: 80', device: 'iPhone 13 Pro', verified: true, avatar: '👑' },
        { id: 2, name: 'THW2N', team: 'LOUD', sensitivity: 'General: 100, RedDot: 92', device: 'iPad Pro', verified: true, avatar: '🎯' },
        { id: 3, name: 'BAK', team: 'NOISE', sensitivity: 'General: 98, RedDot: 85', device: 'Poco X3 Pro', verified: true, avatar: '🔥' }
    ];
    res.json(pros);
});

router.get('/nexus/summary', async (req, res) => {
    try {
        const [usersRow, guildsRow, topAuraRow, avgApxRow] = await Promise.all([
            db.get('SELECT COUNT(*) as total FROM users WHERE email_verified = 1', []),
            db.get('SELECT COUNT(*) as total FROM guilds', []),
            db.get(`SELECT MAX((
                    COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(socials, '$.likes')) AS UNSIGNED), 0) * 0.7 +
                    COALESCE(CAST(JSON_UNQUOTE(JSON_EXTRACT(socials, '$.wins')) AS UNSIGNED), 0) * 12 +
                    COALESCE(streak, 0) * 3
                )) as top_aura FROM users WHERE email_verified = 1`, []),
            db.get('SELECT ROUND(AVG(axp), 0) as avg_axp FROM users WHERE email_verified = 1', []),
        ]);

        res.json({
            users: Number(usersRow?.total || 0),
            guilds: Number(guildsRow?.total || 0),
            topAura: Number(topAuraRow?.top_aura || 0),
            avgAXP: Number(avgApxRow?.avg_axp || 0),
        });
    } catch (err) {
        console.error('[Nexus Summary] fallback mode:', err.code || err.message);
        res.json({ users: 0, guilds: 0, topAura: 0, avgAXP: 0, degraded: true });
    }
});

module.exports = router;
