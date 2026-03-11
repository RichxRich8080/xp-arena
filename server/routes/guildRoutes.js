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

router.post('/create', authenticateToken, validateRequest([
  { field: 'name', required: true, validate: isStringMin(3), issue: 'min_length_3' }
]), async (req, res) => {
  try {
    const { name } = req.body;
    economy.economyLog('log', 'guild.create.start', { userId: req.user.id, guildName: name });
    if (!name || name.length < 3) return res.status(400).json({ error: 'Invalid name' });
    const user = await db.get('SELECT is_premium FROM users WHERE id = ?', [req.user.id]);
    if (!user) return errorResponse(res, 404, 'USER_NOT_FOUND', 'User not found');
    if (!user.is_premium) {
      const ok = await chargeAXP(req.user.id, 500, 'Guild creation fee');
      if (!ok) {
        await economy.recordEconomyEvent({ userId: req.user.id, eventType: 'guild_create', source: 'routes.guild.create', status: 'failure', amount: -500, metadata: { reason: 'insufficient_axp' } });
        return res.status(400).json({ error: 'Not enough AXP' });
      }
      if (!ok) return errorResponse(res, 400, 'INSUFFICIENT_AXP', 'Not enough AXP');
    }
    const exists = await db.get('SELECT id FROM guilds WHERE name = ?', [name]);
    if (exists) return errorResponse(res, 400, 'GUILD_NAME_TAKEN', 'Name taken');
    const ins = await db.run('INSERT INTO guilds (name, owner_user_id, premium_only) VALUES (?,?,?)', [name, req.user.id, user.is_premium ? 1 : 0]);
    await db.run('INSERT INTO guild_members (guild_id, user_id, role) VALUES (?,?,?)', [ins.lastID, req.user.id, 'owner']);
    await db.run('UPDATE users SET guild_id = ? WHERE id = ?', [ins.lastID, req.user.id]);
    await economy.recordEconomyEvent({ userId: req.user.id, eventType: 'guild_create', source: 'routes.guild.create', amount: 0, metadata: { guildId: ins.lastID, name } });
    economy.economyLog('log', 'guild.create.success', { userId: req.user.id, guildId: ins.lastID });
    res.json({ success: true, guild_id: ins.lastID });
  } catch (e) {
    economy.economyLog('error', 'guild.create.failure', { userId: req.user.id, error: e.message });
    res.status(500).json({ error: 'Server error' });
    errorResponse(res, 500, 'GUILD_CREATE_FAILED', 'Server error');
  }
});

router.post('/filters', authenticateToken, validateRequest([
  { field: 'guild_id', required: true, validate: isPositiveIntLike, issue: 'positive_integer' }
]), async (req, res) => {
  try {
    const { guild_id, min_level, min_axp } = req.body;
    const gid = parseInt(guild_id, 10);
    const g = await db.get('SELECT id, owner_user_id FROM guilds WHERE id = ?', [gid]);
    if (!g) return res.status(404).json({ error: 'Not found' });
    if (g.owner_user_id !== req.user.id) return res.status(403).json({ error: 'Not allowed' });
    if (!g) return errorResponse(res, 404, 'GUILD_NOT_FOUND', 'Not found');
    if (g.owner_user_id !== req.user.id) return errorResponse(res, 403, 'FORBIDDEN', 'Not allowed');
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
    errorResponse(res, 500, 'GUILD_FILTERS_UPDATE_FAILED', 'Server error');
  }
});

router.post('/join', authenticateToken, validateRequest([
  { field: 'guild_id', required: true, validate: isPositiveIntLike, issue: 'positive_integer' }
]), async (req, res) => {
  try {
    const gid = parseInt(req.body.guild_id, 10);
    const g = await db.get('SELECT id FROM guilds WHERE id = ?', [gid]);
    if (!g) return res.status(404).json({ error: 'Not found' });
    if (!g) return errorResponse(res, 404, 'GUILD_NOT_FOUND', 'Not found');
    try {
      await db.run(`CREATE TABLE IF NOT EXISTS guild_rules (
        guild_id INT PRIMARY KEY,
        min_level INT DEFAULT 0,
        min_axp INT DEFAULT 0
      )`);
    } catch { }
    const rules = await db.get('SELECT min_level, min_axp FROM guild_rules WHERE guild_id = ?', [gid]);
    if (rules) {
      const u = await db.get('SELECT axp FROM users WHERE id = ?', [req.user.id]);
      const level = u ? Math.floor((u.axp || 0) / 500) + 1 : 1;
      if (rules.min_level && level < rules.min_level) return errorResponse(res, 403, 'GUILD_LEVEL_REQUIREMENT', `Requires level ${rules.min_level}+`);
      if (rules.min_axp && (u.axp || 0) < rules.min_axp) return errorResponse(res, 403, 'GUILD_AXP_REQUIREMENT', `Requires ${Number(rules.min_axp).toLocaleString()}+ AXP`);
    }
    const mem = await db.get('SELECT id FROM guild_members WHERE guild_id = ? AND user_id = ?', [gid, req.user.id]);
    if (mem) return res.json({ success: true });
    await db.run('INSERT INTO guild_members (guild_id, user_id, role) VALUES (?,?,?)', [gid, req.user.id, 'member']);
    await db.run('UPDATE users SET guild_id = ? WHERE id = ?', [gid, req.user.id]);
    await economy.recordEconomyEvent({ userId: req.user.id, eventType: 'guild_join', source: 'routes.guild.join', metadata: { guildId: gid } });
    res.json({ success: true });
  } catch (e) {
    economy.economyLog('error', 'guild.join.failure', { userId: req.user.id, error: e.message });
    res.status(500).json({ error: 'Server error' });
    errorResponse(res, 500, 'GUILD_JOIN_FAILED', 'Server error');
  }
});

router.post('/leave', authenticateToken, async (req, res) => {
  try {
    const user = await db.get('SELECT guild_id FROM users WHERE id = ?', [req.user.id]);
    if (!user || !user.guild_id) return res.json({ success: true });
    await db.run('DELETE FROM guild_members WHERE guild_id = ? AND user_id = ?', [user.guild_id, req.user.id]);
    await db.run('UPDATE users SET guild_id = NULL WHERE id = ?', [req.user.id]);
    await economy.recordEconomyEvent({ userId: req.user.id, eventType: 'guild_leave', source: 'routes.guild.leave', metadata: { guildId: user.guild_id } });
    res.json({ success: true });
  } catch (e) {
    errorResponse(res, 500, 'GUILD_LEAVE_FAILED', 'Server error');
  }
});

router.get('/leaderboard', async (req, res) => {
  try {
    const rows = await db.all('SELECT g.id, g.name, g.badge, COUNT(m.user_id) as members, COALESCE(SUM(u.axp),0) as axp FROM guilds g LEFT JOIN guild_members m ON g.id = m.guild_id LEFT JOIN users u ON m.user_id = u.id GROUP BY g.id ORDER BY axp DESC LIMIT 100', []);
    res.json(rows);
  } catch (e) {
    errorResponse(res, 500, 'GUILD_LEADERBOARD_FAILED', 'Server error');
  }
});

router.post('/badge', authenticateToken, validateRequest([
  { field: 'guild_id', required: true, validate: isPositiveIntLike, issue: 'positive_integer' }
]), async (req, res) => {
  try {
    const { guild_id, badge } = req.body;
    const gid = parseInt(guild_id, 10);
    const g = await db.get('SELECT id, owner_user_id FROM guilds WHERE id = ?', [gid]);
    if (!g) return errorResponse(res, 404, 'GUILD_NOT_FOUND', 'Not found');
    if (g.owner_user_id !== req.user.id) return errorResponse(res, 403, 'FORBIDDEN', 'Not allowed');
    await db.run('UPDATE guilds SET badge = ? WHERE id = ?', [String(badge||'').slice(0,10), gid]);
    res.json({ success: true });
  } catch (e) {
    errorResponse(res, 500, 'GUILD_BADGE_UPDATE_FAILED', 'Server error');
  }
});

router.get('/members', authenticateToken, validateRequest([
  { in: 'query', field: 'guild_id', required: true, validate: isPositiveIntLike, issue: 'positive_integer' }
]), async (req, res) => {
  try {
    const gid = parseInt(req.query.guild_id, 10);
    const rows = await db.all('SELECT u.id, u.username, u.axp, gm.role FROM guild_members gm JOIN users u ON u.id = gm.user_id WHERE gm.guild_id = ? ORDER BY gm.role DESC, u.axp DESC', [gid]);
    res.json(rows);
  } catch (e) {
    errorResponse(res, 500, 'GUILD_MEMBERS_FAILED', 'Server error');
  }
});

router.get('/filters', validateRequest([
  { in: 'query', field: 'guild_id', required: true, validate: isPositiveIntLike, issue: 'positive_integer' }
]), async (req, res) => {
  try {
    const gid = parseInt(req.query.guild_id, 10);
    try {
      await db.run(`CREATE TABLE IF NOT EXISTS guild_rules (
        guild_id INT PRIMARY KEY,
        min_level INT DEFAULT 0,
        min_axp INT DEFAULT 0
      )`);
    } catch { }
    const rules = await db.get('SELECT min_level, min_axp FROM guild_rules WHERE guild_id = ?', [gid]);
    res.json({ guild_id: gid, min_level: (rules && rules.min_level) || 0, min_axp: (rules && rules.min_axp) || 0 });
  } catch (e) {
    errorResponse(res, 500, 'GUILD_FILTERS_FAILED', 'Server error');
  }
});

router.post('/remove-member', authenticateToken, validateRequest([
  { field: 'guild_id', required: true, validate: isPositiveIntLike, issue: 'positive_integer' },
  { field: 'user_id', required: true, validate: isPositiveIntLike, issue: 'positive_integer' }
]), async (req, res) => {
  try {
    const gid = parseInt(req.body.guild_id, 10);
    const uid = parseInt(req.body.user_id, 10);
    const g = await db.get('SELECT id, owner_user_id FROM guilds WHERE id = ?', [gid]);
    if (!g) return errorResponse(res, 404, 'GUILD_NOT_FOUND', 'Not found');
    if (g.owner_user_id !== req.user.id) return errorResponse(res, 403, 'FORBIDDEN', 'Not allowed');
    await db.run('DELETE FROM guild_members WHERE guild_id = ? AND user_id = ?', [gid, uid]);
    await db.run('UPDATE users SET guild_id = NULL WHERE id = ?', [uid]);
    await economy.recordEconomyEvent({ userId: req.user.id, eventType: 'guild_remove_member', source: 'routes.guild.remove-member', metadata: { guildId: gid, targetUserId: uid } });
    res.json({ success: true });
  } catch (e) {
    errorResponse(res, 500, 'GUILD_REMOVE_MEMBER_FAILED', 'Server error');
  }
});

router.post('/war/apply', authenticateToken, validateRequest([
  { field: 'guild_id', required: true, validate: isPositiveIntLike, issue: 'positive_integer' }
]), async (req, res) => {
  try {
    const { guild_id, note } = req.body;
    const gid = parseInt(guild_id, 10);
    const g = await db.get('SELECT id, owner_user_id FROM guilds WHERE id = ?', [gid]);
    if (!g) return res.status(404).json({ error: 'Not found' });
    if (g.owner_user_id !== req.user.id) return res.status(403).json({ error: 'Not allowed' });
    await db.run('INSERT INTO guild_war_applications (guild_id, note) VALUES (?, ?)', [gid, String(note || '').slice(0, 255)]);
    await economy.recordEconomyEvent({ userId: req.user.id, eventType: 'guild_war_apply', source: 'routes.guild.war.apply', metadata: { guildId: gid } });
    if (!g) return errorResponse(res, 404, 'GUILD_NOT_FOUND', 'Not found');
    if (g.owner_user_id !== req.user.id) return errorResponse(res, 403, 'FORBIDDEN', 'Not allowed');
    await db.run('INSERT INTO guild_war_applications (guild_id, note) VALUES (?, ?)', [gid, String(note||'').slice(0,255)]);
    await recordSeasonPoints(req.user.id, { guildWar: 40, meta: { guildId: gid } });
    res.json({ success: true });
  } catch (e) {
    errorResponse(res, 500, 'GUILD_WAR_APPLY_FAILED', 'Server error');
  }
});

router.get('/war/list', async (req, res) => {
  try {
    const rows = await db.all('SELECT gwa.id, gwa.guild_id, g.name, g.badge, gwa.note, gwa.created_at FROM guild_war_applications gwa JOIN guilds g ON g.id = gwa.guild_id ORDER BY gwa.created_at DESC LIMIT 100', []);
    res.json(rows);
  } catch (e) {
    errorResponse(res, 500, 'GUILD_WAR_LIST_FAILED', 'Server error');
  }
});

module.exports = router;
