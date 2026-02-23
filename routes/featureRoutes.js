const express = require('express');
const router = express.Router();
const { db } = require('../db');

let leaderboardCache = { data: null, lastFetch: 0 };
router.get('/leaderboard', async (req, res) => {
    const now = Date.now();
    // Cache for 60 seconds
    if (leaderboardCache.data && now - leaderboardCache.lastFetch < 60000) {
        return res.json(leaderboardCache.data);
    }

    try {
        if (typeof db.all !== 'function') throw new Error('db.all is not a function');
        const rows = await db.all('SELECT id, username, axp, level, avatar, socials FROM users ORDER BY axp DESC LIMIT 100');
        leaderboardCache.data = rows;
        leaderboardCache.lastFetch = now;
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'DB Error' });
    }
});

module.exports = router;
