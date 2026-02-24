const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../db');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

function todayDateStr(d) {
    const x = d || new Date();
    return `${x.getFullYear()}-${x.getMonth()+1}-${x.getDate()}`;
}

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

        const token = jwt.sign({ id: req.user.id, username: newUsername }, JWT_SECRET, { expiresIn: '7d' });
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

        const [activities, vault, presets, history, clips, achievements, setups, guild] = await Promise.all([
            db.all('SELECT * FROM activity WHERE user_id = ? ORDER BY timestamp DESC LIMIT 20', [req.user.id]),
            db.all('SELECT * FROM vault WHERE user_id = ? ORDER BY timestamp DESC', [req.user.id]),
            db.all('SELECT * FROM presets WHERE user_id = ? ORDER BY timestamp DESC', [req.user.id]),
            db.all('SELECT * FROM history WHERE user_id = ? ORDER BY timestamp DESC', [req.user.id]),
            db.all('SELECT * FROM clips WHERE user_id = ? ORDER BY timestamp DESC', [req.user.id]),
            db.all('SELECT achievement_id FROM user_achievements WHERE user_id = ?', [req.user.id]),
            db.all('SELECT id, mode, general, reddot, scope2x, scope4x, scope8x, likes, copies, created_at FROM setups WHERE user_id = ? ORDER BY created_at DESC LIMIT 20', [req.user.id]),
            db.get('SELECT g.id, g.name, g.badge FROM guilds g JOIN users u ON u.guild_id = g.id WHERE u.id = ?', [req.user.id])
        ]);

        res.json({
            user,
            activities: activities || [],
            vault: vault ? vault.map(v => ({ ...JSON.parse(v.settings_json), id: v.id, timestamp: v.timestamp })) : [],
            presets: presets ? presets.map(p => ({ ...JSON.parse(p.settings_json), id: p.id, name: p.name, timestamp: p.timestamp })) : [],
            history: history || [],
            clips: clips || [],
            achievements: achievements ? achievements.map(a => a.achievement_id) : [],
            setups: setups || [],
            guild: guild || null
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/axp', authenticateToken, async (req, res) => {
    const { amount, reason } = req.body;
    try {
        const u = await db.get('SELECT xp_doubler_until FROM users WHERE id = ?', [req.user.id]);
        let delta = parseInt(amount || 0, 10);
        if (u && u.xp_doubler_until) {
            const until = new Date(u.xp_doubler_until).getTime();
            if (Date.now() < until) delta = delta * 2;
        }
        await db.run('UPDATE users SET axp = axp + ? WHERE id = ?', [delta, req.user.id]);
        if (reason) await db.run('INSERT INTO activity (user_id, text) VALUES (?, ?)', [req.user.id, reason]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'DB Error' });
    }
});

router.post('/daily-login', authenticateToken, async (req, res) => {
    try {
        const u = await db.get('SELECT streak, last_login FROM users WHERE id = ?', [req.user.id]);
        const now = new Date();
        const today = todayDateStr(now);
        let streak = 1;
        if (u && u.last_login) {
            const last = new Date(u.last_login);
            const diff = Math.floor((now - last) / (1000*60*60*24));
            if (diff === 0) return res.status(400).json({ error: 'Already claimed' });
            if (diff === 1) streak = (u.streak || 0) + 1;
        }
        const base = 20;
        const bonus = Math.min(streak, 7) * 5;
        const total = base + bonus;
        await db.run('UPDATE users SET streak = ?, last_login = CURRENT_TIMESTAMP WHERE id = ?', [streak, req.user.id]);
        await db.run('UPDATE users SET axp = axp + ? WHERE id = ?', [total, req.user.id]);
        await db.run('INSERT INTO activity (user_id, text) VALUES (?, ?)', [req.user.id, `Daily login +${total} AXP`]);
        res.json({ success: true, streak, axp: total, date: today });
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/xp-doubler/activate', authenticateToken, async (req, res) => {
    try {
        const { hours } = req.body;
        const h = Math.min(parseInt(hours || 24, 10), 48);
        const until = new Date(Date.now() + h*60*60*1000);
        await db.run('UPDATE users SET xp_doubler_until = ? WHERE id = ?', [until, req.user.id]);
        await db.run('INSERT INTO activity (user_id, text) VALUES (?, ?)', [req.user.id, `XP doubler active for ${h}h`]);
        res.json({ success: true, until });
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
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

router.post('/avatar-url', authenticateToken, async (req, res) => {
    const { url } = req.body;
    try {
        const u = await db.get('SELECT is_premium FROM users WHERE id = ?', [req.user.id]);
        if (!u || !u.is_premium) return res.status(403).json({ error: 'Premium required' });
        if (!url || !/^https?:\/\//i.test(url)) return res.status(400).json({ error: 'Invalid URL' });
        await db.run('UPDATE users SET avatar = ? WHERE id = ?', [url, req.user.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'DB Error' });
    }
});

router.post('/premium/style', authenticateToken, async (req, res) => {
    const { name_color, glow } = req.body;
    try {
        const u = await db.get('SELECT is_premium FROM users WHERE id = ?', [req.user.id]);
        if (!u || !u.is_premium) return res.status(403).json({ error: 'Premium required' });
        await db.run('UPDATE users SET premium_name_color = ?, premium_glow = ? WHERE id = ?', [name_color || null, glow ? 1 : 0, req.user.id]);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/vault/:id', authenticateToken, async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    try {
        await db.run('DELETE FROM vault WHERE id = ? AND user_id = ?', [id, req.user.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'DB Error' });
    }
});

router.delete('/preset/:id', authenticateToken, async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    try {
        await db.run('DELETE FROM presets WHERE id = ? AND user_id = ?', [id, req.user.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'DB Error' });
    }
});

router.delete('/history/:id', authenticateToken, async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    try {
        await db.run('DELETE FROM history WHERE id = ? AND user_id = ?', [id, req.user.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'DB Error' });
    }
});

module.exports = router;
