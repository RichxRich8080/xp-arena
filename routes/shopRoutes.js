const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { authenticateToken } = require('../middleware/auth');

/**
 * Get all active shop items
 */
router.get('/items', async (req, res) => {
    try {
        const items = await db.all('SELECT * FROM shop_items WHERE active = 1 ORDER BY price_axp ASC');
        res.json(items);
    } catch (err) {
        console.error('[Shop] Fetch items error:', err);
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});

/**
 * Purchase an item
 */
router.post('/buy', authenticateToken, async (req, res) => {
    const { itemId } = req.body;
    if (!itemId) return res.status(400).json({ error: 'Item ID required' });

    try {
        // 1. Get item details
        const item = await db.get('SELECT * FROM shop_items WHERE id = ? AND active = 1', [itemId]);
        if (!item) return res.status(404).json({ error: 'Item not found' });

        // 2. Check user AXP
        const user = await db.get('SELECT axp FROM users WHERE id = ?', [req.user.id]);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (user.axp < item.price_axp) {
            return res.status(400).json({ error: `Not enough AXP. This item costs ${item.price_axp} AXP.` });
        }

        // 3. Check if user already owns it (if it's not a consumable/booster)
        if (item.type !== 'booster') {
            const owned = await db.get('SELECT id FROM user_inventory WHERE user_id = ? AND item_id = ?', [req.user.id, itemId]);
            if (owned) return res.status(400).json({ error: 'You already own this item' });
        }

        // 4. Check stock
        if (item.stock !== -1 && item.stock <= 0) {
            return res.status(400).json({ error: 'Item out of stock' });
        }

        // 5. Atomic-ish transaction (using helper run sequentially)
        // Deduct AXP
        await db.run('UPDATE users SET axp = axp - ? WHERE id = ?', [item.price_axp, req.user.id]);

        // Add to inventory
        await db.run('INSERT INTO user_inventory (user_id, item_id) VALUES (?, ?)', [req.user.id, itemId]);

        // Log activity
        await db.run('INSERT INTO activity (user_id, text) VALUES (?, ?)', [req.user.id, `Purchased ${item.name} from the Armory for ${item.price_axp} AXP.`]);

        // Update stock if applicable
        if (item.stock !== -1) {
            await db.run('UPDATE shop_items SET stock = stock - 1 WHERE id = ?', [itemId]);
        }

        // Special logic for boosters
        if (item.type === 'booster') {
            const durationHours = item.name.includes('24h') ? 24 : 48;
            const until = new Date(Date.now() + durationHours * 60 * 60 * 1000);
            await db.run('UPDATE users SET xp_doubler_until = ? WHERE id = ?', [until, req.user.id]);
        }

        // Special logic for Premium upgrade (if we sell it for AXP)
        if (item.name.toLowerCase().includes('premium')) {
            await db.run('UPDATE users SET is_premium = 1 WHERE id = ?', [req.user.id]);
        }

        res.json({ success: true, message: `Successfully purchased ${item.name}!`, new_axp: user.axp - item.price_axp });
    } catch (err) {
        console.error('[Shop] Purchase error:', err);
        res.status(500).json({ error: 'Server error during purchase' });
    }
});

/**
 * Get user inventory
 */
router.get('/inventory', authenticateToken, async (req, res) => {
    try {
        const inventory = await db.all(`
            SELECT i.*, s.name, s.description, s.type, s.icon, s.rarity 
            FROM user_inventory i 
            JOIN shop_items s ON i.item_id = s.id 
            WHERE i.user_id = ?
        `, [req.user.id]);
        res.json(inventory);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch inventory' });
    }
});

module.exports = router;
