const express = require('express');
const router = express.Router();
const { db } = require('../db');

let leaderboardCache = { data: null, lastFetch: 0 };
/**
 * Global Live Activity Feed
 */
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
        res.status(500).json({ error: 'Failed to fetch live feed' });
    }
});

/**
 * Global Leaderboard (Top Arenis)
 */
router.get('/leaderboard', async (req, res) => {
    try {
        const users = await db.all(`
            SELECT id, username, axp, level, streak, avatar, is_premium, vip_badge
            FROM users 
            WHERE email_verified = 1
            ORDER BY axp DESC 
            LIMIT 100
        `);
        // Format for frontend expectations
        const formatted = users.map(u => ({
            ...u,
            badges: {
                premium: !!u.is_premium,
                v_badge: !!u.vip_badge
            }
        }));
        res.json(formatted);
    } catch (err) {
        console.error('[Leaderboard] Error:', err);
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});

/**
 * Leaderboard (Weekly delta): Order by AXP gained in last 7 days
 * Uses axp_history snapshots; falls back to 0 when history is missing
 */
router.get('/leaderboard/weekly', async (req, res) => {
    try {
        const rows = await db.all(`
            SELECT 
                u.id, u.username, u.level, u.streak, u.avatar, u.is_premium, u.vip_badge, u.axp as total_axp,
                GREATEST(COALESCE(t.axp, 0) - COALESCE(w.axp, 0), 0) AS axp
            FROM users u
            LEFT JOIN (SELECT user_id, axp FROM axp_history WHERE date = CURDATE()) t ON t.user_id = u.id
            LEFT JOIN (SELECT user_id, axp FROM axp_history WHERE date = DATE_SUB(CURDATE(), INTERVAL 7 DAY)) w ON w.user_id = u.id
            WHERE u.email_verified = 1
            ORDER BY axp DESC
            LIMIT 100
        `, []);
        const formatted = rows.map(u => ({
            ...u,
            badges: {
                premium: !!u.is_premium,
                v_badge: !!u.vip_badge
            }
        }));
        res.json(formatted);
    } catch (err) {
        console.error('[Leaderboard Weekly] Error:', err);
        res.status(500).json({ error: 'Failed to fetch weekly leaderboard' });
    }
});

/**
 * Leaderboard (Today delta): Order by AXP gained today
 */
router.get('/leaderboard/today', async (req, res) => {
    try {
        const rows = await db.all(`
            SELECT 
                u.id, u.username, u.level, u.streak, u.avatar, u.is_premium, u.vip_badge, u.axp as total_axp,
                GREATEST(COALESCE(t.axp, 0) - COALESCE(y.axp, 0), 0) AS axp
            FROM users u
            LEFT JOIN (SELECT user_id, axp FROM axp_history WHERE date = CURDATE()) t ON t.user_id = u.id
            LEFT JOIN (SELECT user_id, axp FROM axp_history WHERE date = DATE_SUB(CURDATE(), INTERVAL 1 DAY)) y ON y.user_id = u.id
            WHERE u.email_verified = 1
            ORDER BY axp DESC
            LIMIT 100
        `, []);
        const formatted = rows.map(u => ({
            ...u,
            badges: {
                premium: !!u.is_premium,
                v_badge: !!u.vip_badge
            }
        }));
        res.json(formatted);
    } catch (err) {
        console.error('[Leaderboard Today] Error:', err);
        res.status(500).json({ error: 'Failed to fetch today leaderboard' });
    }
});

/**
 * Pro Player Database
 */
router.get('/pro-players', async (req, res) => {
    try {
        // For now, these are hardcoded verified pros
        const pros = [
            { id: 1, name: 'NOBRU', team: 'FLUXO', sensitivity: 'General: 95, RedDot: 80', device: 'iPhone 13 Pro', verified: true, avatar: '👑' },
            { id: 2, name: 'THW2N', team: 'LOUD', sensitivity: 'General: 100, RedDot: 92', device: 'iPad Pro', verified: true, avatar: '🎯' },
            { id: 3, name: 'BAK', team: 'NOISE', sensitivity: 'General: 98, RedDot: 85', device: 'Poco X3 Pro', verified: true, avatar: '🔥' }
        ];
        res.json(pros);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch pros' });
    }
});

module.exports = router;
