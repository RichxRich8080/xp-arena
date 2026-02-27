const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { authenticateToken } = require('../middleware/auth');

async function chargeAXP(userId, amount, reason) {
  const u = await db.get('SELECT axp FROM users WHERE id = ?', [userId]);
  if (!u || u.axp < amount) return false;
  await db.run('UPDATE users SET axp = axp - ? WHERE id = ?', [amount, userId]);
  if (reason) await db.run('INSERT INTO activity (user_id, text) VALUES (?, ?)', [userId, reason]);
  return true;
}

router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.length < 3) return res.status(400).json({ error: 'Invalid name' });
    const user = await db.get('SELECT is_premium FROM users WHERE id = ?', [req.user.id]);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.is_premium) {
      const ok = await chargeAXP(req.user.id, 500, 'Guild creation fee');
      if (!ok) return res.status(400).json({ error: 'Not enough AXP' });
    }
    const exists = await db.get('SELECT id FROM guilds WHERE name = ?', [name]);
    if (exists) return res.status(400).json({ error: 'Name taken' });
    const ins = await db.run('INSERT INTO guilds (name, owner_user_id, premium_only) VALUES (?,?,?)', [name, req.user.id, user.is_premium ? 1 : 0]);
    await db.run('INSERT INTO guild_members (guild_id, user_id, role) VALUES (?,?,?)', [ins.lastID, req.user.id, 'owner']);
    await db.run('UPDATE users SET guild_id = ? WHERE id = ?', [ins.lastID, req.user.id]);
    res.json({ success: true, guild_id: ins.lastID });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Set recruitment filters (owner only)
router.post('/filters', authenticateToken, async (req, res) => {
  try {
    const { guild_id, min_level, min_axp } = req.body;
    const gid = parseInt(guild_id, 10);
    if (!gid) return res.status(400).json({ error: 'Invalid id' });
    const g = await db.get('SELECT id, owner_user_id FROM guilds WHERE id = ?', [gid]);
    if (!g) return res.status(404).json({ error: 'Not found' });
    if (g.owner_user_id !== req.user.id) return res.status(403).json({ error: 'Not allowed' });
    // Create table on first use
    await db.run(`CREATE TABLE IF NOT EXISTS guild_rules (
      guild_id INT PRIMARY KEY,
      min_level INT DEFAULT 0,
      min_axp INT DEFAULT 0
    )`);
    const ml = Math.max(0, parseInt(min_level || 0, 10));
    const ma = Math.max(0, parseInt(min_axp || 0, 10));
    const exists = await db.get('SELECT guild_id FROM guild_rules WHERE guild_id = ?', [gid]);
    if (exists) {
      await db.run('UPDATE guild_rules SET min_level = ?, min_axp = ? WHERE guild_id = ?', [ml, ma, gid]);
    } else {
      await db.run('INSERT INTO guild_rules (guild_id, min_level, min_axp) VALUES (?,?,?)', [gid, ml, ma]);
    }
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/join', authenticateToken, async (req, res) => {
  try {
    const { guild_id } = req.body;
    const gid = parseInt(guild_id, 10);
    if (!gid) return res.status(400).json({ error: 'Invalid id' });
    const g = await db.get('SELECT id FROM guilds WHERE id = ?', [gid]);
    if (!g) return res.status(404).json({ error: 'Not found' });
    // Enforce recruitment filters
    try {
      await db.run(`CREATE TABLE IF NOT EXISTS guild_rules (
        guild_id INT PRIMARY KEY,
        min_level INT DEFAULT 0,
        min_axp INT DEFAULT 0
      )`);
    } catch {}
    const rules = await db.get('SELECT min_level, min_axp FROM guild_rules WHERE guild_id = ?', [gid]);
    if (rules) {
      const u = await db.get('SELECT axp FROM users WHERE id = ?', [req.user.id]);
      const level = u ? Math.floor((u.axp || 0) / 500) + 1 : 1;
      if (rules.min_level && level < rules.min_level) return res.status(403).json({ error: `Requires level ${rules.min_level}+` });
      if (rules.min_axp && (u.axp || 0) < rules.min_axp) return res.status(403).json({ error: `Requires ${Number(rules.min_axp).toLocaleString()}+ AXP` });
    }
    const mem = await db.get('SELECT id FROM guild_members WHERE guild_id = ? AND user_id = ?', [gid, req.user.id]);
    if (mem) return res.json({ success: true });
    await db.run('INSERT INTO guild_members (guild_id, user_id, role) VALUES (?,?,?)', [gid, req.user.id, 'member']);
    await db.run('UPDATE users SET guild_id = ? WHERE id = ?', [gid, req.user.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/leave', authenticateToken, async (req, res) => {
  try {
    const user = await db.get('SELECT guild_id FROM users WHERE id = ?', [req.user.id]);
    if (!user || !user.guild_id) return res.json({ success: true });
    await db.run('DELETE FROM guild_members WHERE guild_id = ? AND user_id = ?', [user.guild_id, req.user.id]);
    await db.run('UPDATE users SET guild_id = NULL WHERE id = ?', [req.user.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/leaderboard', async (req, res) => {
  try {
    const rows = await db.all('SELECT g.id, g.name, g.badge, COUNT(m.user_id) as members, COALESCE(SUM(u.axp),0) as axp FROM guilds g LEFT JOIN guild_members m ON g.id = m.guild_id LEFT JOIN users u ON m.user_id = u.id GROUP BY g.id ORDER BY axp DESC LIMIT 100', []);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/badge', authenticateToken, async (req, res) => {
  try {
    const { guild_id, badge } = req.body;
    const gid = parseInt(guild_id, 10);
    if (!gid) return res.status(400).json({ error: 'Invalid id' });
    const g = await db.get('SELECT id, owner_user_id FROM guilds WHERE id = ?', [gid]);
    if (!g) return res.status(404).json({ error: 'Not found' });
    if (g.owner_user_id !== req.user.id) return res.status(403).json({ error: 'Not allowed' });
    await db.run('UPDATE guilds SET badge = ? WHERE id = ?', [String(badge||'').slice(0,10), gid]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/members', authenticateToken, async (req, res) => {
  try {
    const gid = parseInt(req.query.guild_id, 10);
    if (!gid) return res.status(400).json({ error: 'Invalid id' });
    const rows = await db.all('SELECT u.id, u.username, u.axp, gm.role FROM guild_members gm JOIN users u ON u.id = gm.user_id WHERE gm.guild_id = ? ORDER BY gm.role DESC, u.axp DESC', [gid]);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get recruitment filters for a guild
router.get('/filters', async (req, res) => {
  try {
    const gid = parseInt(req.query.guild_id, 10);
    if (!gid) return res.status(400).json({ error: 'Invalid id' });
    try {
      await db.run(`CREATE TABLE IF NOT EXISTS guild_rules (
        guild_id INT PRIMARY KEY,
        min_level INT DEFAULT 0,
        min_axp INT DEFAULT 0
      )`);
    } catch {}
    const rules = await db.get('SELECT min_level, min_axp FROM guild_rules WHERE guild_id = ?', [gid]);
    res.json({ guild_id: gid, min_level: (rules && rules.min_level) || 0, min_axp: (rules && rules.min_axp) || 0 });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/remove-member', authenticateToken, async (req, res) => {
  try {
    const { guild_id, user_id } = req.body;
    const gid = parseInt(guild_id, 10);
    const uid = parseInt(user_id, 10);
    if (!gid || !uid) return res.status(400).json({ error: 'Invalid ids' });
    const g = await db.get('SELECT id, owner_user_id FROM guilds WHERE id = ?', [gid]);
    if (!g) return res.status(404).json({ error: 'Not found' });
    if (g.owner_user_id !== req.user.id) return res.status(403).json({ error: 'Not allowed' });
    await db.run('DELETE FROM guild_members WHERE guild_id = ? AND user_id = ?', [gid, uid]);
    await db.run('UPDATE users SET guild_id = NULL WHERE id = ?', [uid]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/war/apply', authenticateToken, async (req, res) => {
  try {
    const { guild_id, note } = req.body;
    const gid = parseInt(guild_id, 10);
    if (!gid) return res.status(400).json({ error: 'Invalid id' });
    const g = await db.get('SELECT id, owner_user_id FROM guilds WHERE id = ?', [gid]);
    if (!g) return res.status(404).json({ error: 'Not found' });
    if (g.owner_user_id !== req.user.id) return res.status(403).json({ error: 'Not allowed' });
    await db.run('INSERT INTO guild_war_applications (guild_id, note) VALUES (?, ?)', [gid, String(note||'').slice(0,255)]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/war/list', async (req, res) => {
  try {
    const rows = await db.all('SELECT gwa.id, gwa.guild_id, g.name, g.badge, gwa.note, gwa.created_at FROM guild_war_applications gwa JOIN guilds g ON g.id = gwa.guild_id ORDER BY gwa.created_at DESC LIMIT 100', []);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
