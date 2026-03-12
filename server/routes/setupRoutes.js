const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { db } = require('../config/db');
const { authenticateToken } = require('./../middleware/auth');
const economy = require('./../services/economyService');

function cap(n) {
  const x = parseInt(n, 10);
  if (isNaN(x) || x < 0) return 0;
  if (x > 200) return 200;
  return x;
}

function isSensitivityValue(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 200;
}

function checksum(mode, g, r, s2, s4, s8) {
  const src = `${mode}|${g}|${r}|${s2}|${s4}|${s8}`;
  return crypto.createHash('sha256').update(src).digest('hex');
}

function apiError(res, status, code, message) {
  return res.status(status).json({ success: false, code, message });
}

async function awardAXP(userId, amount, reason) {
  const user = await db.get('SELECT id, xp_doubler_until FROM users WHERE id = ?', [userId]);
  let delta = amount;
  if (user && user.xp_doubler_until) {
    const until = new Date(user.xp_doubler_until).getTime();
    if (Date.now() < until) delta = amount * 2;
  }
  await economy.awardAXP(userId, delta, reason);
}

router.post('/submit', authenticateToken, async (req, res) => {
  try {
    const { mode, general, reddot, scope2x, scope4x, scope8x, comment, is_private, screen_size, current_sens, optimization_analysis } = req.body;

    if (!mode || (mode !== 'manual' && mode !== 'auto')) {
      return apiError(res, 400, 'SETUP_INVALID_MODE', 'Mode must be manual or auto.');
    }

    const sensitivityValues = { general, reddot, scope2x, scope4x, scope8x };
    const invalidField = Object.entries(sensitivityValues).find(([, value]) => !isSensitivityValue(value));
    if (invalidField) {
      return apiError(res, 400, 'SETUP_INVALID_SENSITIVITY', `Invalid value for ${invalidField[0]}. Expected number between 0 and 200.`);
    }

    if (!comment || String(comment).trim().length < 10) {
      return apiError(res, 400, 'SETUP_COMMENT_REQUIRED', 'Comment must be at least 10 characters.');
    }

    const g = cap(general), r = cap(reddot), s2 = cap(scope2x), s4 = cap(scope4x), s8 = cap(scope8x);
    const user = await db.get('SELECT is_premium FROM users WHERE id = ?', [req.user.id]);
    const priv = !!is_private;

    if (priv && (!user || !user.is_premium)) {
      return apiError(res, 403, 'SETUP_PREMIUM_REQUIRED', 'Premium is required for private setups.');
    }

    const sum = checksum(mode, g, r, s2, s4, s8);
    const exists = await db.get('SELECT id FROM setups WHERE user_id = ? AND checksum = ?', [req.user.id, sum]);
    if (exists) return res.json({ success: true, id: exists.id, status: 'already_exists' });

    const insert = await db.run(
      'INSERT INTO setups (user_id, mode, general, reddot, scope2x, scope4x, scope8x, comment, is_private, checksum, screen_size, current_sens, optimization_analysis) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [req.user.id, mode, g, r, s2, s4, s8, String(comment).trim(), priv ? 1 : 0, sum, screen_size || null, current_sens || null, optimization_analysis || null]
    );

    await db.run('UPDATE users SET last_generation_date = ? WHERE id = ?', [new Date().toISOString().split('T')[0], req.user.id]);

    await awardAXP(req.user.id, 50, 'Setup submitted');
    const cnt = await db.get('SELECT COUNT(*) as c FROM setups WHERE user_id = ?', [req.user.id]);
    if (cnt && cnt.c >= 10) await db.run('INSERT IGNORE INTO user_achievements (user_id, achievement_id) VALUES (?,?)', [req.user.id, 'verified_setup']);
    res.json({ success: true, id: insert.lastID });
  } catch (e) {
    console.error('[Setup Submit Error]', e);
    apiError(res, 500, 'SETUP_SUBMIT_FAILED', 'Failed to submit setup right now. Please try again.');
  }
});

router.post('/like/:id', authenticateToken, async (req, res) => {
  try {
    const setupId = parseInt(req.params.id, 10);
    if (!setupId) return apiError(res, 400, 'SETUP_INVALID_ID', 'Invalid setup id.');
    const setup = await db.get('SELECT id, user_id FROM setups WHERE id = ?', [setupId]);
    if (!setup) return apiError(res, 404, 'SETUP_NOT_FOUND', 'Setup not found.');
    const liked = await db.get('SELECT id FROM setup_likes WHERE setup_id = ? AND user_id = ?', [setupId, req.user.id]);
    if (liked) return res.json({ success: true });
    await db.run('INSERT INTO setup_likes (setup_id, user_id) VALUES (?,?)', [setupId, req.user.id]);
    await db.run('UPDATE setups SET likes = likes + 1 WHERE id = ?', [setupId]);
    await awardAXP(setup.user_id, 10, 'Setup liked');
    res.json({ success: true });
  } catch (e) {
    console.error('[Setup Like Error]', e);
    apiError(res, 500, 'SETUP_LIKE_FAILED', 'Failed to like setup right now.');
  }
});

router.post('/copy/:id', authenticateToken, async (req, res) => {
  try {
    const setupId = parseInt(req.params.id, 10);
    if (!setupId) return apiError(res, 400, 'SETUP_INVALID_ID', 'Invalid setup id.');
    const setup = await db.get('SELECT id, user_id FROM setups WHERE id = ?', [setupId]);
    if (!setup) return apiError(res, 404, 'SETUP_NOT_FOUND', 'Setup not found.');
    const copied = await db.get('SELECT id FROM setup_copies WHERE setup_id = ? AND user_id = ?', [setupId, req.user.id]);
    if (copied) return res.json({ success: true });
    await db.run('INSERT INTO setup_copies (setup_id, user_id) VALUES (?,?)', [setupId, req.user.id]);
    await db.run('UPDATE setups SET copies = copies + 1 WHERE id = ?', [setupId]);
    await awardAXP(setup.user_id, 20, 'Setup copied');
    res.json({ success: true });
  } catch (e) {
    console.error('[Setup Copy Error]', e);
    apiError(res, 500, 'SETUP_COPY_FAILED', 'Failed to copy setup right now.');
  }
});

router.get('/popular', async (req, res) => {
  try {
    const rows = await db.all('SELECT s.*, u.username FROM setups s JOIN users u ON s.user_id = u.id WHERE s.is_private = 0 ORDER BY (s.likes*2 + s.copies*3) DESC, s.created_at DESC LIMIT 100', []);
    res.json(rows);
  } catch (e) {
    console.error('[Setup Popular Error]', e);
    apiError(res, 500, 'SETUP_POPULAR_FAILED', 'Failed to fetch popular setups.');
  }
});

router.get('/user', authenticateToken, async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM setups WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json(rows);
  } catch (e) {
    console.error('[Setup User Error]', e);
    apiError(res, 500, 'SETUP_USER_LIST_FAILED', 'Failed to fetch your setups.');
  }
});

module.exports = router;
