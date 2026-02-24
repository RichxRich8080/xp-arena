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

async function awardAXP(userId, amount, reason) {
  await db.run('UPDATE users SET axp = axp + ? WHERE id = ?', [amount, userId]);
  if (reason) await db.run('INSERT INTO activity (user_id, text) VALUES (?, ?)', [userId, reason]);
}

router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { name, entry_fee_axp, prize_pool_axp, private_only } = req.body;
    if (!name || name.length < 3) return res.status(400).json({ error: 'Invalid name' });
    const user = await db.get('SELECT is_premium FROM users WHERE id = ?', [req.user.id]);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.is_premium) {
      const ok = await chargeAXP(req.user.id, 300, 'Tournament creation fee');
      if (!ok) return res.status(400).json({ error: 'Not enough AXP' });
    }
    const ins = await db.run('INSERT INTO tournaments (name, creator_user_id, entry_fee_axp, prize_pool_axp, private_only) VALUES (?,?,?,?,?)', [name, req.user.id, parseInt(entry_fee_axp || 0, 10), parseInt(prize_pool_axp || 0, 10), private_only ? 1 : 0]);
    res.json({ success: true, id: ins.lastID });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/join', authenticateToken, async (req, res) => {
  try {
    const { tournament_id } = req.body;
    const tId = parseInt(tournament_id, 10);
    if (!tId) return res.status(400).json({ error: 'Invalid id' });
    const t = await db.get('SELECT id, entry_fee_axp FROM tournaments WHERE id = ?', [tId]);
    if (!t) return res.status(404).json({ error: 'Not found' });
    const mem = await db.get('SELECT id FROM tournament_participants WHERE tournament_id = ? AND user_id = ?', [tId, req.user.id]);
    if (mem) return res.json({ success: true });
    if (t.entry_fee_axp > 0) {
      const ok = await chargeAXP(req.user.id, t.entry_fee_axp, 'Tournament entry fee');
      if (!ok) return res.status(400).json({ error: 'Not enough AXP' });
    }
    await db.run('INSERT INTO tournament_participants (tournament_id, user_id) VALUES (?,?)', [tId, req.user.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/end', authenticateToken, async (req, res) => {
  try {
    const { tournament_id, winner_user_id, winner_axp } = req.body;
    const tId = parseInt(tournament_id, 10);
    const wId = parseInt(winner_user_id, 10);
    if (!tId || !wId) return res.status(400).json({ error: 'Invalid ids' });
    const t = await db.get('SELECT id, creator_user_id FROM tournaments WHERE id = ?', [tId]);
    if (!t) return res.status(404).json({ error: 'Not found' });
    if (t.creator_user_id !== req.user.id) return res.status(403).json({ error: 'Not allowed' });
    await db.run('UPDATE tournaments SET winner_user_id = ? WHERE id = ?', [wId, tId]);
    if (winner_axp && parseInt(winner_axp, 10) > 0) await awardAXP(wId, parseInt(winner_axp, 10), 'Tournament winner');
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/list', async (req, res) => {
  try {
    const rows = await db.all('SELECT t.*, (SELECT COUNT(*) FROM tournament_participants p WHERE p.tournament_id = t.id) as participants FROM tournaments t ORDER BY t.created_at DESC LIMIT 100', []);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
