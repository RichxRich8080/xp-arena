const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { db, pool } = require('../config/db');
const { authenticateToken, JWT_SECRET } = require('./../middleware/auth');
const economy = require('./../services/economyService');
const { recordSeasonPoints } = require('./../services/seasonService');
const { errorResponse } = require('./../middleware/apiResponse');
const { validateRequest, isPositiveIntLike, isStringMin } = require('./validators');
const security = require('./../services/securityService');

const rewardClaimLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: { error: 'Frequent reward claims detected. Please wait 15 minutes.' }
});

function todayDateStr(d) {
    const x = d || new Date();
    return `${x.getFullYear()}-${x.getMonth() + 1}-${x.getDate()}`;
}

router.post('/password', authenticateToken, validateRequest([{ field: 'currentPassword', required: true }, { field: 'newPassword', required: true, validate: isStringMin(6), issue: 'min_length_6' }]), async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        if (typeof db.get !== 'function') throw new Error('db.get is not a function');
        const user = await db.get('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
        if (!user) return errorResponse(res, 404, 'USER_ROUTE_ERROR', 'User not found');

        const match = await bcrypt.compare(currentPassword, user.password_hash);
        if (!match) return errorResponse(res, 400, 'USER_ROUTE_ERROR', 'Incorrect current password');

        const hash = await bcrypt.hash(newPassword, 10);
        await db.run('UPDATE users SET password_hash = ? WHERE id = ?', [hash, req.user.id]);
        res.json({ success: true });
    } catch (err) {
        errorResponse(res, 500, 'USER_SERVER_ERROR', 'Server error');
    }
});

router.post('/nickname', authenticateToken, validateRequest([{ field: 'newUsername', required: true, validate: isStringMin(3), issue: 'min_length_3' }]), async (req, res) => {
    const { newUsername } = req.body;

    try {
        economy.economyLog('log', 'user.nickname.start', { userId: req.user.id, newUsername });
        const user = await db.get('SELECT name_changes, axp FROM users WHERE id = ?', [req.user.id]);
        if (!user) return errorResponse(res, 404, 'USER_ROUTE_ERROR', 'User not found');

        const cost = user.name_changes > 0 ? 500 : 0;
        if (user.axp < cost) return errorResponse(res, 400, 'INSUFFICIENT_AXP', `Not enough AXP. Changing name costs ${cost} AXP.`);

        // Deduct AXP, update username, and increment name_changes atomically
        if (cost > 0) {
            await db.run('UPDATE users SET username = ?, axp = axp - ?, name_changes = name_changes + 1 WHERE id = ?', [newUsername, cost, req.user.id]);
            await db.run('INSERT INTO activity (user_id, text) VALUES (?, ?)', [req.user.id, `Spent ${cost} AXP to change username.`]);
            await economy.recordEconomyEvent({ userId: req.user.id, eventType: 'rename', source: 'routes.user.nickname', amount: -cost, metadata: { newUsername, method: 'direct_change' } });
            await economy.snapshotAXP(req.user.id, null, { eventType: 'rename', source: 'routes.user.nickname', metadata: { newUsername, cost } });
        } else {
            await db.run('UPDATE users SET username = ?, name_changes = name_changes + 1 WHERE id = ?', [newUsername, req.user.id]);
        }

        const token = jwt.sign({ id: req.user.id, username: newUsername }, JWT_SECRET, { expiresIn: '7d' });
        economy.economyLog('log', 'user.nickname.success', { userId: req.user.id, cost });
        res.json({ success: true, token, user: { id: req.user.id, username: newUsername }, cost });
    } catch (err) {
        if ((err && err.code === 'ER_DUP_ENTRY') || (err.message && err.message.includes('UNIQUE'))) {
            return errorResponse(res, 400, 'USER_ROUTE_ERROR', 'Username already taken');
        }
        economy.economyLog('error', 'user.nickname.failure', { userId: req.user.id, error: err.message });
        return errorResponse(res, 500, 'USER_ROUTE_ERROR', 'Database error');
    }
});

router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await db.get('SELECT * FROM users WHERE id = ?', [req.user.id]);
        if (!user) return errorResponse(res, 404, 'USER_ROUTE_ERROR', 'User not found');

        const [activities, vault, presets, history, clips, achievements, setups, guild, transactions] = await Promise.all([
            db.all('SELECT * FROM activity WHERE user_id = ? ORDER BY timestamp DESC LIMIT 20', [req.user.id]),
            db.all('SELECT * FROM vault WHERE user_id = ? ORDER BY timestamp DESC', [req.user.id]),
            db.all('SELECT * FROM presets WHERE user_id = ? ORDER BY timestamp DESC', [req.user.id]),
            db.all('SELECT * FROM history WHERE user_id = ? ORDER BY timestamp DESC', [req.user.id]),
            db.all('SELECT * FROM clips WHERE user_id = ? ORDER BY timestamp DESC', [req.user.id]),
            db.all('SELECT achievement_id FROM user_achievements WHERE user_id = ?', [req.user.id]),
            db.all('SELECT id, mode, general, reddot, scope2x, scope4x, scope8x, likes, copies, created_at FROM setups WHERE user_id = ? ORDER BY created_at DESC LIMIT 20', [req.user.id]),
            db.get('SELECT g.id, g.name, g.badge FROM guilds g JOIN users u ON u.guild_id = g.id WHERE u.id = ?', [req.user.id]),
            db.all(`SELECT ui.id, ui.item_id, ui.purchased_at, s.name, s.price_axp, s.rarity, s.type
                    FROM user_inventory ui
                    JOIN shop_items s ON ui.item_id = s.id
                    WHERE ui.user_id = ?
                    ORDER BY ui.purchased_at DESC`, [req.user.id])
        ]);

        const safeParse = (str, fallback = []) => {
            try { return str ? JSON.parse(str) : fallback; }
            catch (e) { return fallback; }
        };

        res.json({
            user,
            activities: activities || [],
            vault: vault ? vault.map(v => ({ ...safeParse(v.settings_json, {}), id: v.id, timestamp: v.timestamp })) : [],
            presets: presets ? presets.map(p => ({ ...safeParse(p.settings_json, {}), id: p.id, name: p.name, timestamp: p.timestamp })) : [],
            history: history || [],
            clips: clips || [],
            achievements: achievements ? achievements.map(a => a.achievement_id) : [],
            setups: setups || [],
            guild: guild || null,
            transactions: transactions || []
        });
    } catch (err) {
        console.error(err);
        errorResponse(res, 500, 'USER_SERVER_ERROR', 'Server error');
    }
});

// [REMOVED] Insecure arbitrary AXP endpoint.
// AXP is now only awarded server-side during specific actions (clips, setups, daily login).

router.post('/daily-login', authenticateToken, rewardClaimLimiter, async (req, res) => {
    try {
        const u = await db.get('SELECT streak, last_login FROM users WHERE id = ?', [req.user.id]);
        const now = new Date();
        const today = todayDateStr(now);
        let streak = 1;
        if (u && u.last_login) {
            const last = new Date(u.last_login);
            const diff = Math.floor((now - last) / (1000 * 60 * 60 * 24));
            if (diff === 0) return errorResponse(res, 400, 'USER_ROUTE_ERROR', 'Already claimed');
            if (diff === 1) streak = (u.streak || 0) + 1;
        }
        const base = 20;
        const bonus = Math.min(streak, 7) * 5;
        const total = base + bonus;
        await db.run('UPDATE users SET streak = ?, last_login = CURRENT_TIMESTAMP WHERE id = ?', [streak, req.user.id]);
        await db.run('UPDATE users SET axp = axp + ? WHERE id = ?', [total, req.user.id]);
        await db.run('INSERT INTO activity (user_id, text) VALUES (?, ?)', [req.user.id, `Daily login +${total} AXP`]);
        await recordSeasonPoints(req.user.id, { dailyLogin: total, meta: { streak } });

        // Record AXP History snapshot
        const updatedUser = await db.get('SELECT axp FROM users WHERE id = ?', [req.user.id]);
        await db.run(`INSERT INTO axp_history (user_id, axp, date, event_type, source, metadata)
                      VALUES (?, ?, ?, ?, ?, ?)
                      ON DUPLICATE KEY UPDATE axp = VALUES(axp), event_type = VALUES(event_type), source = VALUES(source), metadata = VALUES(metadata)`,
            [req.user.id, updatedUser.axp, today, 'daily_login', 'routes.user.daily-login', JSON.stringify({ streak, reward: total })]);

        // Perfect Week auto-bonus (server-confirmed)
        // Compute week start (Monday)
        const d = new Date(now);
        const day = d.getDay(); // 0=Sun..6=Sat
        const diffToMonday = (day === 0 ? -6 : 1) - day;
        const monday = new Date(d);
        monday.setDate(d.getDate() + diffToMonday);
        const weekStart = `${monday.getFullYear()}-${monday.getMonth() + 1}-${monday.getDate()}`;
        const wb = await db.get('SELECT id FROM weekly_bonus WHERE user_id = ? AND week_start = ? AND awarded = 1', [req.user.id, weekStart]);
        if (!wb && streak >= 7) {
            const weekBonus = total; // 2× today by adding +total again
            await db.run('UPDATE users SET axp = axp + ? WHERE id = ?', [weekBonus, req.user.id]);
            await db.run('INSERT INTO activity (user_id, text) VALUES (?, ?)', [req.user.id, `Perfect Week bonus +${weekBonus} AXP`]);
            await db.run('INSERT INTO weekly_bonus (user_id, week_start, awarded) VALUES (?,?,1)', [req.user.id, weekStart]);
            // Achievement unlock (id: perfect_week)
            try {
                const ach = await db.get('SELECT achievement_id FROM user_achievements WHERE user_id = ? AND achievement_id = ?', [req.user.id, 'perfect_week']);
                if (!ach) {
                    await db.run('INSERT INTO user_achievements (user_id, achievement_id) VALUES (?, ?)', [req.user.id, 'perfect_week']);
                }
            } catch (achErr) { }
            return res.json({ success: true, streak, axp: total, week_bonus: weekBonus, date: today, week_start: weekStart });
        }

        res.json({ success: true, streak, axp: total, date: today });
    } catch (e) {
        errorResponse(res, 500, 'USER_SERVER_ERROR', 'Server error');
    }
});

// Admin: Reset weekly bonus (testing only)
router.post('/admin/reset-week-bonus', authenticateToken, async (req, res) => {
    try {
        const admin = await db.get('SELECT is_admin FROM users WHERE id = ?', [req.user.id]);
        if (!admin || !admin.is_admin) return errorResponse(res, 403, 'USER_ROUTE_ERROR', 'Admin only');
        const { user_id, week_start } = req.body;
        if (!user_id) return errorResponse(res, 400, 'USER_ROUTE_ERROR', 'user_id required');
        if (week_start) {
            await db.run('DELETE FROM weekly_bonus WHERE user_id = ? AND week_start = ?', [user_id, week_start]);
        } else {
            await db.run('DELETE FROM weekly_bonus WHERE user_id = ?', [user_id]);
        }
        res.json({ success: true });
    } catch (e) {
        errorResponse(res, 500, 'USER_SERVER_ERROR', 'Server error');
    }
});

router.get('/axp-history', authenticateToken, async (req, res) => {
    try {
        const history = await db.all('SELECT axp, date, event_type, source, metadata FROM axp_history WHERE user_id = ? ORDER BY date ASC LIMIT 30', [req.user.id]);
        res.json(history);
    } catch (e) {
        errorResponse(res, 500, 'USER_SERVER_ERROR', 'Server error');
    }
});

router.post('/xp-doubler/activate', authenticateToken, async (req, res) => {
    try {
        const { hours } = req.body;
        const h = Math.min(parseInt(hours || 24, 10), 48);
        const until = new Date(Date.now() + h * 60 * 60 * 1000);
        await db.run('UPDATE users SET xp_doubler_until = ? WHERE id = ?', [until, req.user.id]);
        await db.run('INSERT INTO activity (user_id, text) VALUES (?, ?)', [req.user.id, `XP doubler active for ${h}h`]);
        res.json({ success: true, until });
    } catch (e) {
        errorResponse(res, 500, 'USER_SERVER_ERROR', 'Server error');
    }
});

router.post('/avatar', authenticateToken, async (req, res) => {
    const { avatar } = req.body;
    try {
        await db.run('UPDATE users SET avatar = ? WHERE id = ?', [avatar, req.user.id]);
        res.json({ success: true });
    } catch (err) {
        errorResponse(res, 500, 'USER_DB_ERROR', 'DB Error');
    }
});

router.post('/socials', authenticateToken, async (req, res) => {
    const { socials } = req.body;
    const socialsStr = typeof socials === 'string' ? socials : JSON.stringify(socials);
    try {
        await db.run('UPDATE users SET socials = ? WHERE id = ?', [socialsStr, req.user.id]);
        res.json({ success: true });
    } catch (err) {
        errorResponse(res, 500, 'USER_DB_ERROR', 'DB Error');
    }
});

router.post('/vault', authenticateToken, async (req, res) => {
    const { settings } = req.body;
    try {
        await db.run('INSERT INTO vault (user_id, settings_json) VALUES (?, ?)', [req.user.id, JSON.stringify(settings)]);
        res.json({ success: true });
    } catch (err) {
        errorResponse(res, 500, 'USER_DB_ERROR', 'DB Error');
    }
});

router.post('/preset', authenticateToken, async (req, res) => {
    const { name, settings } = req.body;
    try {
        await db.run('DELETE FROM presets WHERE user_id = ? AND name = ?', [req.user.id, name]);
        await db.run('INSERT INTO presets (user_id, name, settings_json) VALUES (?, ?, ?)', [req.user.id, name, JSON.stringify(settings)]);
        res.json({ success: true });
    } catch (err) {
        errorResponse(res, 500, 'USER_DB_ERROR', 'DB Error');
    }
});

router.post('/history', authenticateToken, async (req, res) => {
    const { device, general_mid, general_range } = req.body;
    try {
        await db.run('INSERT INTO history (user_id, device, general_mid, general_range) VALUES (?, ?, ?, ?)', [req.user.id, device, general_mid, general_range]);
        res.json({ success: true });
    } catch (err) {
        errorResponse(res, 500, 'USER_DB_ERROR', 'DB Error');
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
        errorResponse(res, 500, 'USER_DB_ERROR', 'DB Error');
    }
});

router.post('/avatar-url', authenticateToken, async (req, res) => {
    const { url } = req.body;
    try {
        const u = await db.get('SELECT is_premium FROM users WHERE id = ?', [req.user.id]);
        if (!u || !u.is_premium) return errorResponse(res, 403, 'USER_ROUTE_ERROR', 'Premium required');
        if (!url || !/^https?:\/\//i.test(url)) return errorResponse(res, 400, 'USER_ROUTE_ERROR', 'Invalid URL');

        // Comprehensive SSRF / Restricted URL Protection
        let urlObj;
        try {
            urlObj = new URL(url);
        } catch {
            return errorResponse(res, 400, 'USER_ROUTE_ERROR', 'Invalid URL format');
        }

        const hostname = urlObj.hostname.toLowerCase();
        const restrictedPatterns = [
            'localhost', '127.0.0.1', '0.0.0.0', '::1',
            '.local', 'internal', 'metadata.google.internal',
            '169.254.169.254' // Cloud metadata
        ];
        
        // Block private IP ranges (IPv4)
        const isPrivateIp = /^(127\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.)/.test(hostname);
        
        if (isPrivateIp || restrictedPatterns.some(p => hostname === p || hostname.endsWith(p))) {
            return errorResponse(res, 400, 'USER_ROUTE_ERROR', 'Restricted or internal URL detected');
        }

        await db.run('UPDATE users SET avatar = ? WHERE id = ?', [url, req.user.id]);
        res.json({ success: true });
    } catch (err) {
        errorResponse(res, 500, 'USER_DB_ERROR', 'DB Error');
    }
});

// Daily Mystery Protocol Reward
router.post('/daily-protocol', authenticateToken, rewardClaimLimiter, async (req, res) => {
    try {
        const todayAt = new Date().toISOString().split('T')[0];
        const lastProtocol = await db.get('SELECT last_protocol_date FROM users WHERE id = ?', [req.user.id]);

        if (lastProtocol && lastProtocol.last_protocol_date === todayAt) {
            return errorResponse(res, 400, 'USER_ROUTE_ERROR', 'Protocol already completed for today');
        }

        const axpReward = 200;
        await db.run('UPDATE users SET axp = axp + ?, last_protocol_date = ? WHERE id = ?', [axpReward, todayAt, req.user.id]);
        await db.run('INSERT INTO activity (user_id, text) VALUES (?, ?)', [req.user.id, `Completed the Secret Protocol today (+${axpReward} AXP)`]);

        res.json({ success: true, axp: axpReward });
    } catch (err) {
        console.error(err);
        errorResponse(res, 500, 'USER_SERVER_ERROR', 'Server error');
    }
});

router.post('/premium/style', authenticateToken, async (req, res) => {
    const { name_color, glow } = req.body;
    try {
        const u = await db.get('SELECT is_premium FROM users WHERE id = ?', [req.user.id]);
        if (!u || !u.is_premium) return errorResponse(res, 403, 'USER_ROUTE_ERROR', 'Premium required');
        await db.run('UPDATE users SET premium_name_color = ?, premium_glow = ? WHERE id = ?', [name_color || null, glow ? 1 : 0, req.user.id]);
        res.json({ success: true });
    } catch (e) {
        errorResponse(res, 500, 'USER_SERVER_ERROR', 'Server error');
    }
});

router.delete('/vault/:id', authenticateToken, validateRequest([{ in: 'params', field: 'id', required: true, validate: isPositiveIntLike, issue: 'positive_integer' }]), async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!id) return errorResponse(res, 400, 'USER_ROUTE_ERROR', 'Invalid id');
    try {
        await db.run('DELETE FROM vault WHERE id = ? AND user_id = ?', [id, req.user.id]);
        res.json({ success: true });
    } catch (err) {
        errorResponse(res, 500, 'USER_DB_ERROR', 'DB Error');
    }
});

router.delete('/preset/:id', authenticateToken, validateRequest([{ in: 'params', field: 'id', required: true, validate: isPositiveIntLike, issue: 'positive_integer' }]), async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!id) return errorResponse(res, 400, 'USER_ROUTE_ERROR', 'Invalid id');
    try {
        await db.run('DELETE FROM presets WHERE id = ? AND user_id = ?', [id, req.user.id]);
        res.json({ success: true });
    } catch (err) {
        errorResponse(res, 500, 'USER_DB_ERROR', 'DB Error');
    }
});

router.delete('/history/:id', authenticateToken, validateRequest([{ in: 'params', field: 'id', required: true, validate: isPositiveIntLike, issue: 'positive_integer' }]), async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!id) return errorResponse(res, 400, 'USER_ROUTE_ERROR', 'Invalid id');
    try {
        await db.run('DELETE FROM history WHERE id = ? AND user_id = ?', [id, req.user.id]);
        res.json({ success: true });
    } catch (err) {
        errorResponse(res, 500, 'USER_DB_ERROR', 'DB Error');
    }
});

router.post('/premium/buy', authenticateToken, async (req, res) => {
    try {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();
            const [userRows] = await conn.execute('SELECT is_premium FROM users WHERE id = ? FOR UPDATE', [req.user.id]);
            const user = userRows[0];
            if (!user) {
                const e = new Error('User not found');
                e.status = 404;
                throw e;
            }
            if (user.is_premium) {
                const e = new Error('Already Premium');
                e.status = 400;
                throw e;
            }

            const [inventoryRows] = await conn.execute(
                `SELECT ui.id
                 FROM user_inventory ui
                 JOIN shop_items si ON si.id = ui.item_id
                 WHERE ui.user_id = ? AND LOWER(si.name) LIKE '%premium%'
                 ORDER BY ui.id ASC
                 LIMIT 1
                 FOR UPDATE`,
                [req.user.id]
            );
            const entitlement = inventoryRows[0];
            if (!entitlement) {
                const e = new Error('Premium entitlement not found in inventory');
                e.status = 403;
                throw e;
            }
            const u = await db.get('SELECT is_premium FROM users WHERE id = ?', [req.user.id]);
            if (u && u.is_premium) return errorResponse(res, 400, 'USER_ROUTE_ERROR', 'Already Premium');

            await conn.execute('DELETE FROM user_inventory WHERE id = ?', [entitlement.id]);
            await conn.execute('UPDATE users SET is_premium = 1 WHERE id = ?', [req.user.id]);
            await conn.execute('INSERT INTO activity (user_id, text) VALUES (?, ?)', [req.user.id, 'Upgraded to Premium Areni Status']);
            await security.writeAuditLog({
                userId: req.user.id,
                actorUserId: req.user.id,
                eventType: 'premium_status_changed',
                metadata: { source: 'premium_buy_endpoint', from: false, to: true },
                conn,
            });
            await conn.commit();
        } catch (txErr) {
            await conn.rollback();
            throw txErr;
        } finally {
            conn.release();
        }
        res.json({ success: true });
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message || 'DB Error' });
    }
});

router.post('/easter-egg', authenticateToken, rewardClaimLimiter, async (req, res) => {
    try {
        const achievementId = 'easter_egg_hack';
        const u = await db.get('SELECT achievement_id FROM user_achievements WHERE user_id = ? AND achievement_id = ?', [req.user.id, achievementId]);
        if (u) {
            return errorResponse(res, 400, 'USER_ROUTE_ERROR', 'Reward already claimed');
        }

        await db.run('INSERT INTO user_achievements (user_id, achievement_id) VALUES (?, ?)', [req.user.id, achievementId]);
        await db.run('UPDATE users SET axp = axp + 500 WHERE id = ?', [req.user.id]);
        await db.run('INSERT INTO activity (user_id, text) VALUES (?, ?)', [req.user.id, 'Hidden protocol reward claimed (+500 AXP)']);

        res.json({ success: true, axp: 500 });
    } catch (err) {
        console.error(err);
        errorResponse(res, 500, 'USER_DB_ERROR', 'DB Error');
    }
});

router.post('/use-item', authenticateToken, validateRequest([{ field: 'itemId', required: true, validate: isPositiveIntLike, issue: 'positive_integer' }]), async (req, res) => {
    const { itemId, extra } = req.body;

    try {
        // 1. Check if user owns the item
        const inventoryItem = await db.get(`
            SELECT ui.id, si.name, si.type 
            FROM user_inventory ui 
            JOIN shop_items si ON ui.item_id = si.id 
            WHERE ui.user_id = ? AND ui.item_id = ?
        `, [req.user.id, itemId]);

        if (!inventoryItem) return errorResponse(res, 404, 'USER_ROUTE_ERROR', 'Item not found in inventory');

        // 2. Handle specific item logic
        if (inventoryItem.name === 'Rename Card') {
            const { newUsername } = extra || {};
            if (!newUsername || newUsername.length < 3) {
                return errorResponse(res, 400, 'USER_ROUTE_ERROR', 'Invalid new username provided');
            }

            // Atomic update: Change name + consume card + log activity
            const conn = await pool.getConnection();
            try {
                await conn.beginTransaction();
                const [takenRows] = await conn.execute('SELECT id FROM users WHERE username = ? FOR UPDATE', [newUsername]);
                if (takenRows[0]) {
                    await conn.rollback();
                    conn.release();
                    return errorResponse(res, 400, 'USER_ROUTE_ERROR', 'Username already taken');
                }

                const [itemRows] = await conn.execute('SELECT id FROM user_inventory WHERE id = ? AND user_id = ? FOR UPDATE', [inventoryItem.id, req.user.id]);
                if (!itemRows[0]) {
                    await conn.rollback();
                    conn.release();
                    return errorResponse(res, 404, 'USER_ROUTE_ERROR', 'Rename Card no longer available');
                }

                await conn.execute('UPDATE users SET username = ?, name_changes = name_changes + 1 WHERE id = ?', [newUsername, req.user.id]);
                await conn.execute('DELETE FROM user_inventory WHERE id = ?', [inventoryItem.id]);
                await conn.execute('INSERT INTO activity (user_id, text) VALUES (?, ?)', [req.user.id, `Used Rename Card to change identity to ${newUsername}`]);
                await security.writeAuditLog({
                    userId: req.user.id,
                    actorUserId: req.user.id,
                    eventType: 'username_changed',
                    metadata: { newUsername, method: 'rename_card' },
                    conn,
                });
                await economy.recordEconomyEvent({ userId: req.user.id, eventType: 'rename', source: 'routes.user.use-item', amount: 0, metadata: { newUsername, method: 'rename_card', itemId } }, conn);
                await economy.snapshotAXP(req.user.id, conn, { eventType: 'rename', source: 'routes.user.use-item', metadata: { newUsername, method: 'rename_card' } });
                await conn.commit();
            } catch (txErr) {
                await conn.rollback();
                conn.release();
                throw txErr;
            }
            conn.release();

            const token = jwt.sign({ id: req.user.id, username: newUsername }, JWT_SECRET, { expiresIn: '7d' });
            return res.json({ success: true, message: 'Identity successfully updated', token, user: { id: req.user.id, username: newUsername } });
        }

        errorResponse(res, 400, 'USER_ROUTE_ERROR', 'Item not usable or logic not implemented');
    } catch (err) {
        console.error('[User] Use item error:', err);
        errorResponse(res, 500, 'USER_ROUTE_ERROR', 'Server error using item');
    }
});

router.get('/status', authenticateToken, async (req, res) => {
    try {
        const user = await db.get('SELECT axp, level, last_generation_date FROM users WHERE id = ?', [req.user.id]);
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
