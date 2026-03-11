const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./../middleware/auth');
const { SEASON_REWARDS, getSeasonSummary, getSeasonProgress } = require('./../services/seasonService');

router.get('/summary', async (req, res) => {
  try {
    const summary = await getSeasonSummary();
    res.json(summary);
  } catch (e) {
    console.error('[Season] summary error', e);
    res.status(500).json({ error: 'Failed to fetch season summary' });
  }
});

router.get('/rewards', async (req, res) => {
  try {
    const summary = await getSeasonSummary();
    res.json({
      seasonId: summary.seasonId,
      rewards: SEASON_REWARDS,
      resetWindows: summary.resetWindows
    });
  } catch (e) {
    console.error('[Season] rewards error', e);
    res.status(500).json({ error: 'Failed to fetch season rewards' });
  }
});

router.get('/progress', authenticateToken, async (req, res) => {
  try {
    const progress = await getSeasonProgress(req.user.id);
    res.json(progress);
  } catch (e) {
    console.error('[Season] progress error', e);
    res.status(500).json({ error: 'Failed to fetch season progress' });
  }
});

module.exports = router;
