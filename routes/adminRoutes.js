const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { authenticateToken } = require('../middleware/auth');

async function isAdmin(userId) {
  const u = await db.get('SELECT is_admin FROM users WHERE id = ?', [userId]);
  return !!(u && u.is_admin);
}

router.use(authenticateToken);

router.use(async (req, res, next) => {
  try {
    if (!(await isAdmin(req.user.id))) return res.status(403).json({ error: 'Admin only' });
    next();
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/overview', async (req, res) => {
  try {
    const [users, setups, tournaments, guilds, creators] = await Promise.all([
      db.get('SELECT COUNT(*) as c FROM users', []),
      db.get('SELECT COUNT(*) as c FROM setups', []),
      db.get('SELECT COUNT(*) as c FROM tournaments', []),
      db.get('SELECT COUNT(*) as c FROM guilds', []),
      db.get('SELECT COUNT(*) as c FROM creators', []),
    ]);
    res.json({
      users: users ? users.c : 0,
      setups: setups ? setups.c : 0,
      tournaments: tournaments ? tournaments.c : 0,
      guilds: guilds ? guilds.c : 0,
      creators: creators ? creators.c : 0,
    });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/analytics', async (req, res) => {
  try {
    // 1. Registrations over last 30 days
    const regs = await db.all(`
      SELECT DATE(created_at) as date, COUNT(*) as count 
      FROM users 
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) 
      GROUP BY DATE(created_at) 
      ORDER BY date ASC
    `, []);

    // 2. AXP Distribution (bucketed)
    const axpDist = await db.all(`
      SELECT 
        CASE 
          WHEN axp < 500 THEN 'Bronze (0-499)'
          WHEN axp < 1500 THEN 'Silver (500-1499)'
          WHEN axp < 3000 THEN 'Gold (1500-2999)'
          WHEN axp < 5000 THEN 'Platinum (3000-4999)'
          WHEN axp < 8000 THEN 'Diamond (5000-7999)'
          WHEN axp < 12000 THEN 'Master (8000-11999)'
          ELSE 'Champion (12000+)'
        END as rank_bucket,
        COUNT(*) as count
      FROM users
      GROUP BY rank_bucket
    `, []);

    // 3. Daily Active Users (DAU) over last 14 days (approx from activity table)
    const dau = await db.all(`
      SELECT DATE(timestamp) as date, COUNT(DISTINCT user_id) as count
      FROM activity
      WHERE timestamp >= DATE_SUB(CURDATE(), INTERVAL 14 DAY)
      GROUP BY DATE(timestamp)
      ORDER BY date ASC
    `, []);

    res.json({ registrations: regs, axpDistribution: axpDist, dau });
  } catch (e) {
    console.error('Analytics error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/activity', async (req, res) => {
  try {
    const logs = await db.all('SELECT a.id, a.user_id, u.username, a.text, a.timestamp FROM activity a JOIN users u ON u.id = a.user_id ORDER BY a.timestamp DESC LIMIT 200', []);
    res.json(logs);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/popular-setups', async (req, res) => {
  try {
    const rows = await db.all('SELECT s.*, u.username FROM setups s JOIN users u ON u.id = s.user_id ORDER BY (s.likes*2 + s.copies*3) DESC, s.created_at DESC LIMIT 200', []);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/guild-war-apps', async (req, res) => {
  try {
    const rows = await db.all('SELECT gwa.*, g.name, g.badge FROM guild_war_applications gwa JOIN guilds g ON g.id = gwa.guild_id ORDER BY gwa.created_at DESC LIMIT 200', []);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const sort = String(req.query.sort || 'axp');
    let orderBy = 'axp DESC';
    if (sort === 'streak') orderBy = 'streak DESC';
    if (sort === 'date') orderBy = 'created_at DESC';

    const rows = await db.all(`SELECT id, username, axp, streak, is_premium, is_admin, banned, created_at FROM users ORDER BY ${orderBy} LIMIT 200`, []);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/search-users', async (req, res) => {
  try {
    const q = String(req.query.q || '').trim();
    if (!q || q.length < 2) return res.json([]);
    const rows = await db.all('SELECT id, username, axp, is_premium, is_admin, banned FROM users WHERE username LIKE ? ORDER BY axp DESC LIMIT 50', [`%${q}%`]);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/users/axp', async (req, res) => {
  try {
    const { user_id, delta, reason } = req.body;
    const uid = parseInt(user_id, 10);
    const d = parseInt(delta, 10);
    if (!uid || isNaN(d)) return res.status(400).json({ error: 'Invalid input' });
    await db.run('UPDATE users SET axp = axp + ? WHERE id = ?', [d, uid]);
    if (reason) await db.run('INSERT INTO activity (user_id, text) VALUES (?, ?)', [uid, `Admin: ${reason} (${d > 0 ? '+' : ''}${d} AXP)`]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/users/premium', async (req, res) => {
  try {
    const { user_id, value } = req.body;
    const uid = parseInt(user_id, 10);
    const v = !!value ? 1 : 0;
    if (!uid) return res.status(400).json({ error: 'Invalid input' });
    await db.run('UPDATE users SET is_premium = ? WHERE id = ?', [v, uid]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/users/admin', async (req, res) => {
  try {
    // Only owner admin can toggle other admins
    if (!req.user.is_owner_admin) return res.status(403).json({ error: 'Owner admin only' });
    const { user_id, value } = req.body;
    const uid = parseInt(user_id, 10);
    const v = !!value ? 1 : 0;
    if (!uid) return res.status(400).json({ error: 'Invalid input' });
    await db.run('UPDATE users SET is_admin = ? WHERE id = ?', [v, uid]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/users/ban', async (req, res) => {
  try {
    const { user_id, reason } = req.body;
    const uid = parseInt(user_id, 10);
    if (!uid) return res.status(400).json({ error: 'Invalid input' });
    await db.run('UPDATE users SET banned = 1, ban_reason = ? WHERE id = ?', [String(reason || '').slice(0, 255), uid]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/users/unban', async (req, res) => {
  try {
    const { user_id } = req.body;
    const uid = parseInt(user_id, 10);
    if (!uid) return res.status(400).json({ error: 'Invalid input' });
    await db.run('UPDATE users SET banned = 0, ban_reason = NULL WHERE id = ?', [uid]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/users/vip', async (req, res) => {
  try {
    const { user_id, value } = req.body;
    const uid = parseInt(user_id, 10);
    const v = !!value ? 1 : 0;
    if (!uid) return res.status(400).json({ error: 'Invalid input' });
    await db.run('UPDATE users SET vip_badge = ? WHERE id = ?', [v, uid]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/setups/:id', async (req, res) => {
  try {
    const sid = parseInt(req.params.id, 10);
    if (!sid) return res.status(400).json({ error: 'Invalid id' });
    await db.run('DELETE FROM setups WHERE id = ?', [sid]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});
module.exports = router;
