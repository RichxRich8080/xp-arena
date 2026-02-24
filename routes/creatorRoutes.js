const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { authenticateToken } = require('../middleware/auth');

router.post('/enable', authenticateToken, async (req, res) => {
  try {
    const { slug, bio, banner_url } = req.body;
    const u = await db.get('SELECT is_premium FROM users WHERE id = ?', [req.user.id]);
    if (!u || !u.is_premium) return res.status(403).json({ error: 'Premium required' });
    if (!slug || !/^[a-z0-9\-]{3,}$/.test(slug)) return res.status(400).json({ error: 'Invalid slug' });
    const exists = await db.get('SELECT user_id FROM creators WHERE slug = ?', [slug]);
    if (exists) return res.status(400).json({ error: 'Slug taken' });
    await db.run('INSERT INTO creators (user_id, slug, bio, banner_url) VALUES (?,?,?,?)', [req.user.id, slug, bio || '', banner_url || '']);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const cr = await db.get('SELECT * FROM creators WHERE user_id = ?', [req.user.id]);
    res.json({ creator: cr || null });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/follow/:userId', authenticateToken, async (req, res) => {
  try {
    const creatorId = parseInt(req.params.userId, 10);
    if (!creatorId) return res.status(400).json({ error: 'Invalid id' });
    const cr = await db.get('SELECT user_id FROM creators WHERE user_id = ?', [creatorId]);
    if (!cr) return res.status(404).json({ error: 'Not found' });
    const exist = await db.get('SELECT id FROM creator_followers WHERE creator_user_id = ? AND follower_user_id = ?', [creatorId, req.user.id]);
    if (exist) return res.json({ success: true });
    await db.run('INSERT INTO creator_followers (creator_user_id, follower_user_id) VALUES (?,?)', [creatorId, req.user.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;
    const cr = await db.get('SELECT c.*, u.username FROM creators c JOIN users u ON c.user_id = u.id WHERE c.slug = ?', [slug]);
    if (!cr) return res.status(404).json({ error: 'Not found' });
    const followers = await db.get('SELECT COUNT(*) as c FROM creator_followers WHERE creator_user_id = ?', [cr.user_id]);
    const setups = await db.all('SELECT * FROM setups WHERE user_id = ? AND is_private = 0 ORDER BY created_at DESC LIMIT 20', [cr.user_id]);
    res.json({ creator: cr, followers: followers ? followers.c : 0, setups });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
