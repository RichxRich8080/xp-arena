const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../db');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

router.post('/password', authenticateToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        if (typeof db.get !== 'function') throw new Error('db.get is not a function');
        const user = await db.get('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const match = await bcrypt.compare(currentPassword, user.password_hash);
        if (!match) return res.status(400).json({ error: 'Incorrect current password' });

        const hash = await bcrypt.hash(newPassword, 10);
        await db.run('UPDATE users SET password_hash = ? WHERE id = ?', [hash, req.user.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/nickname', authenticateToken, async (req, res) => {
    const { newUsername } = req.body;
    if (!newUsername || newUsername.length < 3) return res.status(400).json({ error: 'Invalid username' });

    try {
        const user = await db.get('SELECT name_changes, axp FROM users WHERE id = ?', [req.user.id]);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const cost = user.name_changes > 0 ? 500 : 0;
        if (user.axp < cost) return res.status(400).json({ error: `Not enough AXP. Changing name costs ${cost} AXP.` });

        await db.run('UPDATE users SET username = ?, axp = axp - ?, name_changes = name_changes + 1 WHERE id = ?', [newUsername, cost, req.user.id]);

        if (cost > 0) {
            await db.run('INSERT INTO activity (user_id, text) VALUES (?, ?)', [req.user.id, `Spent ${cost} AXP to change username.`]);
        }

        const token = jwt.sign({ id: req.user.id, username: newUsername }, JWT_SECRET);
        res.json({ success: true, token, user: { id: req.user.id, username: newUsername }, cost });
    } catch (err) {
        if ((err && err.code === 'ER_DUP_ENTRY') || (err.message && err.message.includes('UNIQUE'))) {
            return res.status(400).json({ error: 'Username already taken' });
        }
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await db.get('SELECT * FROM users WHERE id = ?', [req.user.id]);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const [activities, vault, presets, history, clips, achievements] = await Promise.all([
            db.all('SELECT * FROM activity WHERE user_id = ? ORDER BY timestamp DESC LIMIT 20', [req.user.id]),
            db.all('SELECT * FROM vault WHERE user_id = ? ORDER BY timestamp DESC', [req.user.id]),
            db.all('SELECT * FROM presets WHERE user_id = ? ORDER BY timestamp DESC', [req.user.id]),
            db.all('SELECT * FROM history WHERE user_id = ? ORDER BY timestamp DESC', [req.user.id]),
            db.all('SELECT * FROM clips WHERE user_id = ? ORDER BY timestamp DESC', [req.user.id]),
            db.all('SELECT achievement_id FROM user_achievements WHERE user_id = ?', [req.user.id])
        ]);

        res.json({
            user,
            activities: activities || [],
            vault: vault ? vault.map(v => ({ ...JSON.parse(v.settings_json), id: v.id, timestamp: v.timestamp })) : [],
            presets: presets ? presets.map(p => ({ ...JSON.parse(p.settings_json), id: p.id, name: p.name, timestamp: p.timestamp })) : [],
            history: history || [],
            clips: clips || [],
            achievements: achievements ? achievements.map(a => a.achievement_id) : []
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/axp', authenticateToken, async (req, res) => {
    const { amount, reason } = req.body;
    try {
        await db.run('UPDATE users SET axp = axp + ? WHERE id = ?', [amount, req.user.id]);
        if (reason) await db.run('INSERT INTO activity (user_id, text) VALUES (?, ?)', [req.user.id, reason]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'DB Error' });
    }
});

router.post('/avatar', authenticateToken, async (req, res) => {
    const { avatar } = req.body;
    try {
        await db.run('UPDATE users SET avatar = ? WHERE id = ?', [avatar, req.user.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'DB Error' });
    }
});

router.post('/socials', authenticateToken, async (req, res) => {
    const { socials } = req.body;
    const socialsStr = typeof socials === 'string' ? socials : JSON.stringify(socials);
    try {
        await db.run('UPDATE users SET socials = ? WHERE id = ?', [socialsStr, req.user.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'DB Error' });
    }
});

router.post('/vault', authenticateToken, async (req, res) => {
    const { settings } = req.body;
    try {
        await db.run('INSERT INTO vault (user_id, settings_json) VALUES (?, ?)', [req.user.id, JSON.stringify(settings)]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'DB Error' });
    }
});

router.post('/preset', authenticateToken, async (req, res) => {
    const { name, settings } = req.body;
    try {
        await db.run('DELETE FROM presets WHERE user_id = ? AND name = ?', [req.user.id, name]);
        await db.run('INSERT INTO presets (user_id, name, settings_json) VALUES (?, ?, ?)', [req.user.id, name, JSON.stringify(settings)]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'DB Error' });
    }
});

router.post('/history', authenticateToken, async (req, res) => {
    const { device, general_mid, general_range } = req.body;
    try {
        await db.run('INSERT INTO history (user_id, device, general_mid, general_range) VALUES (?, ?, ?, ?)', [req.user.id, device, general_mid, general_range]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'DB Error' });
    }
});

router.post('/clip', authenticateToken, async (req, res) => {
    const { url, title, device } = req.body;
    try {
        await db.run('INSERT INTO clips (user_id, url, title, device) VALUES (?, ?, ?, ?)', [req.user.id, url, title, device]);
        await db.run('UPDATE users SET axp = axp + 50 WHERE id = ?', [req.user.id]);
        await db.run('INSERT INTO activity (user_id, text) VALUES (?, ?)', [req.user.id, `Submitted a gameplay clip on ${device}`]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'DB Error' });
    }
});

module.exports = router;
