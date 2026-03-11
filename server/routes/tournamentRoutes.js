const express = require('express');
const router = express.Router();
const { db } = require('../config/db');
const { authenticateToken } = require('./../middleware/auth');
const economy = require('./../services/economyService');
const { recordSeasonPoints } = require('./../services/seasonService');
const { errorResponse } = require('./../middleware/apiResponse');
const { validateRequest, isPositiveIntLike, isStringMin } = require('./validators');

async function chargeAXP(userId, amount, reason) {
  const charged = await economy.chargeAXP(userId, amount, reason);
  return charged.success;
}

async function awardAXP(userId, amount, reason) {
  await economy.awardAXP(userId, amount, reason);
}

router.post('/create', authenticateToken, validateRequest([
  { field: 'name', required: true, validate: isStringMin(3), issue: 'min_length_3' }
]), async (req, res) => {
  try {
    const { name, entry_fee_axp, prize_pool_axp, private_only } = req.body;
    const user = await db.get('SELECT is_premium FROM users WHERE id = ?', [req.user.id]);
    if (!user) return errorResponse(res, 404, 'USER_NOT_FOUND', 'User not found');
    if (!user.is_premium) {
      const ok = await chargeAXP(req.user.id, 300, 'Tournament creation fee');
      if (!ok) return errorResponse(res, 400, 'INSUFFICIENT_AXP', 'Not enough AXP');
    }
    const ins = await db.run('INSERT INTO tournaments (name, creator_user_id, entry_fee_axp, prize_pool_axp, private_only) VALUES (?,?,?,?,?)', [name, req.user.id, parseInt(entry_fee_axp || 0, 10), parseInt(prize_pool_axp || 0, 10), private_only ? 1 : 0]);
    res.json({ success: true, id: ins.lastID });
  } catch (e) {
    errorResponse(res, 500, 'TOURNAMENT_CREATE_FAILED', 'Server error');
  }
});

router.post('/join', authenticateToken, validateRequest([
  { field: 'tournament_id', required: true, validate: isPositiveIntLike, issue: 'positive_integer' }
]), async (req, res) => {
  try {
    const { tournament_id } = req.body;
    const tId = parseInt(tournament_id, 10);
    const t = await db.get('SELECT id, entry_fee_axp FROM tournaments WHERE id = ?', [tId]);
    if (!t) return errorResponse(res, 404, 'TOURNAMENT_NOT_FOUND', 'Not found');
    const mem = await db.get('SELECT id FROM tournament_participants WHERE tournament_id = ? AND user_id = ?', [tId, req.user.id]);
    if (mem) return res.json({ success: true });
    if (t.entry_fee_axp > 0) {
      const ok = await chargeAXP(req.user.id, t.entry_fee_axp, 'Tournament entry fee');
      if (!ok) return errorResponse(res, 400, 'INSUFFICIENT_AXP', 'Not enough AXP');
    }
    await db.run('INSERT INTO tournament_participants (tournament_id, user_id) VALUES (?,?)', [tId, req.user.id]);
    await recordSeasonPoints(req.user.id, { tournament: 25, meta: { event: 'join', tournamentId: tId } });
    res.json({ success: true });
  } catch (e) {
    errorResponse(res, 500, 'TOURNAMENT_JOIN_FAILED', 'Server error');
  }
});

router.post('/end', authenticateToken, validateRequest([
  { field: 'tournament_id', required: true, validate: isPositiveIntLike, issue: 'positive_integer' },
  { field: 'winner_user_id', required: true, validate: isPositiveIntLike, issue: 'positive_integer' }
]), async (req, res) => {
  try {
    const { tournament_id, winner_user_id, winner_axp } = req.body;
    const tId = parseInt(tournament_id, 10);
    const wId = parseInt(winner_user_id, 10);
    const t = await db.get('SELECT id, creator_user_id FROM tournaments WHERE id = ?', [tId]);
    if (!t) return errorResponse(res, 404, 'TOURNAMENT_NOT_FOUND', 'Not found');
    if (t.creator_user_id !== req.user.id) return errorResponse(res, 403, 'FORBIDDEN', 'Not allowed');
    await db.run('UPDATE tournaments SET winner_user_id = ? WHERE id = ?', [wId, tId]);
    if (winner_axp && parseInt(winner_axp, 10) > 0) await awardAXP(wId, parseInt(winner_axp, 10), 'Tournament winner');
    await recordSeasonPoints(wId, { tournament: Math.max(50, parseInt(winner_axp || 0, 10) || 0), meta: { event: 'winner', tournamentId: tId } });
    await recordSeasonPoints(req.user.id, { tournament: 15, meta: { event: 'host_end', tournamentId: tId } });
    res.json({ success: true });
  } catch (e) {
    errorResponse(res, 500, 'TOURNAMENT_END_FAILED', 'Server error');
  }
});

router.get('/list', async (req, res) => {
  try {
    const rows = await db.all('SELECT t.*, (SELECT COUNT(*) FROM tournament_participants p WHERE p.tournament_id = t.id) as participants FROM tournaments t ORDER BY t.created_at DESC LIMIT 100', []);
    res.json(rows);
  } catch (e) {
    errorResponse(res, 500, 'TOURNAMENT_LIST_FAILED', 'Server error');
  }
});

module.exports = router;
