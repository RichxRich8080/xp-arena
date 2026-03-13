const express = require('express');
const router = express.Router();
const { db } = require('../config/db');
const { authenticateToken } = require('./../middleware/auth');
const economy = require('./../services/economyService');
const { errorResponse } = require('./../middleware/apiResponse');

router.post('/open', authenticateToken, async (req, res) => {
    const COST = 500;
    
    try {
        // Atomic transaction check and charge
        const result = await economy.chargeAXP(req.user.id, COST, 'Mystery Vault decryption');
        
        if (!result.success) {
            return errorResponse(res, 400, 'INSUFFICIENT_AXP', 'Not enough AXP to decrypt this node.');
        }

        // Weighted random reward selection
        const rand = Math.random() * 100;
        let reward;
        
        if (rand < 5) { // 5% Elite
            reward = { type: 'AXP', val: 5000, name: 'MATRIX_BREAKER', rarity: 'ELITE', color: 'text-axp-gold' };
        } else if (rand < 30) { // 25% Rare
            reward = { type: 'AXP', val: 1200, name: 'NEURAL_OVERLOAD', rarity: 'RARE', color: 'text-accent-cyan' };
        } else { // 70% Common
            reward = { type: 'AXP', val: 600, name: 'SIGNAL_BOOST', rarity: 'COMMON', color: 'text-gray-400' };
        }

        // Grant reward
        await economy.awardAXP(req.user.id, reward.val, `Mystery Vault reward: ${reward.name}`);
        
        // Final user state
        const user = await db.get('SELECT axp, level FROM users WHERE id = ?', [req.user.id]);

        res.json({
            success: true,
            reward,
            newBalance: user.axp
        });
        
    } catch (err) {
        console.error('[Mystery Route Error]', err);
        errorResponse(res, 500, 'MYSTERY_DECRYPT_FAILED', 'Failed to decrypt node. Token refunded.');
    }
});

module.exports = router;
