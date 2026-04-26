const express = require('express');
const router = express.Router();
const { db } = require('../config/db');
const { authenticateToken } = require('./../middleware/auth');
const economy = require('./../services/economyService');
const { recordSeasonPoints } = require('./../services/seasonService');
const { errorResponse } = require('./../middleware/apiResponse');

// Fetch all quests with user progress
router.get('/', authenticateToken, async (req, res) => {
    try {
        const rows = await db.all(`
            SELECT q.*, 
                   COALESCE(uq.current_value, 0) as current_value,
                   COALESCE(uq.status, 'active') as user_status
            FROM quests q
            LEFT JOIN user_quests uq ON q.id = uq.quest_id AND uq.user_id = ?
            ORDER BY q.quest_type ASC, q.created_at DESC
        `, [req.user.id]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        errorResponse(res, 500, 'QUEST_FETCH_FAILED', 'Server error');
    }
});

// Claim quest reward
router.post('/claim/:id', authenticateToken, async (req, res) => {
    const questId = req.params.id;
    try {
        const userQuest = await db.get(`
            SELECT uq.*, q.reward_axp, q.title
            FROM user_quests uq
            JOIN quests q ON uq.quest_id = q.id
            WHERE uq.quest_id = ? AND uq.user_id = ?
        `, [questId, req.user.id]);

        if (!userQuest) return errorResponse(res, 404, 'QUEST_NOT_FOUND', 'Quest not found or no progress');
        if (userQuest.status === 'claimed') return errorResponse(res, 400, 'QUEST_ALREADY_CLAIMED', 'Already claimed');
        if (userQuest.current_value < userQuest.target_value && userQuest.status !== 'completed') {
             return errorResponse(res, 400, 'QUEST_NOT_COMPLETED', 'Quest not completed yet');
        }

        await db.run('UPDATE user_quests SET status = "claimed" WHERE id = ?', [userQuest.id]);
        await economy.awardAXP(req.user.id, userQuest.reward_axp, `Quest Complete: ${userQuest.title}`);
        await recordSeasonPoints(req.user.id, { dailyLogin: Math.round(userQuest.reward_axp / 10) }); // Example mapping

        res.json({ success: true, reward: userQuest.reward_axp });
    } catch (err) {
        console.error(err);
        errorResponse(res, 500, 'QUEST_CLAIM_FAILED', 'Server error');
    }
});

// Helper: Track progress (internal use or trigger based)
async function trackQuestProgress(userId, category, value = 1) {
    try {
        const activeQuests = await db.all('SELECT id, target_value FROM quests WHERE category = ?', [category]);
        for (const q of activeQuests) {
            await db.run(`
                INSERT INTO user_quests (user_id, quest_id, current_value, status)
                VALUES (?, ?, ?, 'active')
                ON DUPLICATE KEY UPDATE 
                    current_value = current_value + ?,
                    status = CASE WHEN current_value + ? >= ? THEN 'completed' ELSE status END
            `, [userId, q.id, value, value, value, q.target_value]);
        }
    } catch (err) {
        console.error('[Quest Progress Error]', err);
    }
}

module.exports = { router, trackQuestProgress };
