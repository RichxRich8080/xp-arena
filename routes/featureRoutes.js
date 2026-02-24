const express = require('express');
const router = express.Router();
const { db } = require('../db');

let leaderboardCache = { data: null, lastFetch: 0 };
router.get('/leaderboard', async (req, res) => {
    const now = Date.now();
    if (leaderboardCache.data && now - leaderboardCache.lastFetch < 60000) {
        return res.json(leaderboardCache.data);
    }

    try {
        if (typeof db.all !== 'function') throw new Error('db.all is not a function');
        const users = await db.all('SELECT id, username, axp, level, avatar, socials, is_premium, vip_badge FROM users ORDER BY axp DESC LIMIT 200');
        const result = [];
        for (const u of users) {
            let rank = 'Rookie';
            if (u.axp >= 100000) rank = 'Legend';
            if (u.axp >= 200000) rank = 'Arena Master';
            else if (u.axp >= 50000) rank = 'Champion';
            else if (u.axp >= 10000) rank = 'Elite';
            else if (u.axp >= 1000) rank = 'Grinder';
            const latest = await db.get('SELECT mode FROM setups WHERE user_id = ? AND is_private = 0 ORDER BY created_at DESC LIMIT 1', [u.id]);
            const setupsCount = await db.get('SELECT COUNT(*) as c FROM setups WHERE user_id = ?', [u.id]);
            const verifiedSetup = setupsCount && setupsCount.c >= 10;
            const vBadge = u.vip_badge || u.axp >= 100000 ? true : false;
            result.push({
                id: u.id,
                username: u.username,
                axp: u.axp,
                rank,
                avatar: u.avatar,
                setup_type: latest ? latest.mode : null,
                badges: {
                    verified_setup: verifiedSetup,
                    v_badge: vBadge,
                    premium: !!u.is_premium
                }
            });
        }
        leaderboardCache.data = result.slice(0, 100);
        leaderboardCache.lastFetch = now;
        res.json(leaderboardCache.data);
    } catch (err) {
        res.status(500).json({ error: 'DB Error' });
    }
});

module.exports = router;
