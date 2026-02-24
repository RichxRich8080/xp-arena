const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { db } = require('../db');
const { authenticateToken } = require('../middleware/auth');

function cap(n) {
  const x = parseInt(n, 10);
  if (isNaN(x) || x < 0) return 0;
  if (x > 200) return 200;
  return x;
}

function checksum(mode, g, r, s2, s4, s8) {
  const src = `${mode}|${g}|${r}|${s2}|${s4}|${s8}`;
  return crypto.createHash('sha256').update(src).digest('hex');
}

async function awardAXP(userId, amount, reason) {
  const user = await db.get('SELECT id, xp_doubler_until FROM users WHERE id = ?', [userId]);
  let delta = amount;
  if (user && user.xp_doubler_until) {
    const until = new Date(user.xp_doubler_until).getTime();
    if (Date.now() < until) delta = amount * 2;
  }
  await db.run('UPDATE users SET axp = axp + ? WHERE id = ?', [delta, userId]);
  if (reason) await db.run('INSERT INTO activity (user_id, text) VALUES (?, ?)', [userId, reason]);
}

router.post('/submit', authenticateToken, async (req, res) => {
  try {
    const { mode, general, reddot, scope2x, scope4x, scope8x, comment, is_private } = req.body;
    if (!mode || (mode !== 'manual' && mode !== 'auto')) return res.status(400).json({ error: 'Invalid mode' });
    if (!comment || String(comment).trim().length < 10) return res.status(400).json({ error: 'Comment required' });
    const g = cap(general), r = cap(reddot), s2 = cap(scope2x), s4 = cap(scope4x), s8 = cap(scope8x);
    const user = await db.get('SELECT is_premium FROM users WHERE id = ?', [req.user.id]);
    const priv = !!is_private;
    if (priv && (!user || !user.is_premium)) return res.status(403).json({ error: 'Premium required for private setups' });
    const sum = checksum(mode, g, r, s2, s4, s8);
    const exists = await db.get('SELECT id FROM setups WHERE user_id = ? AND checksum = ?', [req.user.id, sum]);
    if (exists) return res.status(400).json({ error: 'Duplicate setup' });
    const insert = await db.run('INSERT INTO setups (user_id, mode, general, reddot, scope2x, scope4x, scope8x, comment, is_private, checksum) VALUES (?,?,?,?,?,?,?,?,?,?)', [req.user.id, mode, g, r, s2, s4, s8, String(comment).trim(), priv ? 1 : 0, sum]);
    await awardAXP(req.user.id, 50, 'Setup submitted');
    const cnt = await db.get('SELECT COUNT(*) as c FROM setups WHERE user_id = ?', [req.user.id]);
    if (cnt && cnt.c >= 10) await db.run('INSERT IGNORE INTO user_achievements (user_id, achievement_id) VALUES (?,?)', [req.user.id, 'verified_setup']);
    res.json({ success: true, id: insert.lastID });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/like/:id', authenticateToken, async (req, res) => {
  try {
    const setupId = parseInt(req.params.id, 10);
    if (!setupId) return res.status(400).json({ error: 'Invalid id' });
    const setup = await db.get('SELECT id, user_id FROM setups WHERE id = ?', [setupId]);
    if (!setup) return res.status(404).json({ error: 'Not found' });
    const liked = await db.get('SELECT id FROM setup_likes WHERE setup_id = ? AND user_id = ?', [setupId, req.user.id]);
    if (liked) return res.json({ success: true });
    await db.run('INSERT INTO setup_likes (setup_id, user_id) VALUES (?,?)', [setupId, req.user.id]);
    await db.run('UPDATE setups SET likes = likes + 1 WHERE id = ?', [setupId]);
    await awardAXP(setup.user_id, 10, 'Setup liked');
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/copy/:id', authenticateToken, async (req, res) => {
  try {
    const setupId = parseInt(req.params.id, 10);
    if (!setupId) return res.status(400).json({ error: 'Invalid id' });
    const setup = await db.get('SELECT id, user_id FROM setups WHERE id = ?', [setupId]);
    if (!setup) return res.status(404).json({ error: 'Not found' });
    const copied = await db.get('SELECT id FROM setup_copies WHERE setup_id = ? AND user_id = ?', [setupId, req.user.id]);
    if (copied) return res.json({ success: true });
    await db.run('INSERT INTO setup_copies (setup_id, user_id) VALUES (?,?)', [setupId, req.user.id]);
    await db.run('UPDATE setups SET copies = copies + 1 WHERE id = ?', [setupId]);
    await awardAXP(setup.user_id, 20, 'Setup copied');
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/popular', async (req, res) => {
  try {
    const rows = await db.all('SELECT s.*, u.username FROM setups s JOIN users u ON s.user_id = u.id WHERE s.is_private = 0 ORDER BY (s.likes*2 + s.copies*3) DESC, s.created_at DESC LIMIT 100', []);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/user', authenticateToken, async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM setups WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
