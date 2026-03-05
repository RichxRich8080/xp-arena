const express = require('express');
const router = express.Router();
const { db, pool } = require('../db');
const { authenticateToken } = require('../middleware/auth');
const economy = require('../services/economyService');

/**
 * Get all active shop items
 */
router.get('/items', async (req, res) => {
    try {
        const items = await db.all('SELECT * FROM shop_items WHERE active = 1 ORDER BY price_axp ASC');
        res.json(items);
    } catch (err) {
        console.error('[Shop] Fetch items error:', err);
        // Fallback to empty array if table doesn't exist yet
        res.json([]);
    }
});

/**
 * Purchase an item
 */
router.post('/buy', authenticateToken, async (req, res) => {
    const { itemId } = req.body;
    if (!itemId) return res.status(400).json({ error: 'Item ID required' });

    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();

        // 1. Get item details
        const [itemRows] = await conn.execute('SELECT * FROM shop_items WHERE id = ? AND active = 1 FOR UPDATE', [itemId]);
        const item = itemRows[0];
        if (!item) {
            const e = new Error('Item not found');
            e.status = 404;
            throw e;
        }

        // 2. Check user AXP
        const [userRows] = await conn.execute('SELECT axp FROM users WHERE id = ? FOR UPDATE', [req.user.id]);
        const user = userRows[0];
        if (!user) {
            const e = new Error('User not found');
            e.status = 404;
            throw e;
        }

        if (user.axp < item.price_axp) {
            const e = new Error(`Not enough AXP. This item costs ${item.price_axp} AXP.`);
            e.status = 400;
            throw e;
        }

        // 3. Check if user already owns it (if it's not a consumable/booster)
        if (item.type !== 'booster') {
            const [ownedRows] = await conn.execute('SELECT id FROM user_inventory WHERE user_id = ? AND item_id = ? FOR UPDATE', [req.user.id, itemId]);
            const owned = ownedRows[0];
            if (owned) {
                const e = new Error('You already own this item');
                e.status = 400;
                throw e;
            }
        }

        // 4. Check stock
        if (item.stock !== -1 && item.stock <= 0) {
            const e = new Error('Item out of stock');
            e.status = 400;
            throw e;
        }

        // Deduct AXP (Atomic UPDATE)
        const [deductRes] = await conn.execute('UPDATE users SET axp = axp - ? WHERE id = ? AND axp >= ?', [item.price_axp, req.user.id, item.price_axp]);
        if (!deductRes.affectedRows) {
            const e = new Error('Transaction failed: Insufficient AXP');
            e.status = 400;
            throw e;
        }

        // Add to inventory
        await conn.execute('INSERT INTO user_inventory (user_id, item_id) VALUES (?, ?)', [req.user.id, itemId]);

        // Log activity
        await conn.execute('INSERT INTO activity (user_id, text) VALUES (?, ?)', [req.user.id, `Purchased ${item.name} from the Armory for ${item.price_axp} AXP.`]);

        // Update stock if applicable
        if (item.stock !== -1) {
            const [stockRes] = await conn.execute('UPDATE shop_items SET stock = stock - 1 WHERE id = ? AND stock > 0', [itemId]);
            if (!stockRes.affectedRows) {
                const e = new Error('Item out of stock');
                e.status = 400;
                throw e;
            }
        }

        // Special logic for boosters
        if (item.type === 'booster') {
            let durationHours = 48;
            const match = String(item.name || '').match(/(\d+)\s*h/i);
            if (match) {
                durationHours = parseInt(match[1], 10);
            } else if (item.name.includes('24h')) {
                durationHours = 24;
            }
            const until = new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');
            await conn.execute('UPDATE users SET xp_doubler_until = ? WHERE id = ?', [until, req.user.id]);
        }

        // Special logic for Premium upgrade
        if (item.name.toLowerCase().includes('premium')) {
            await conn.execute('UPDATE users SET is_premium = 1 WHERE id = ?', [req.user.id]);
        }

        const updatedAxp = await economy.snapshotAXP(req.user.id, conn);

        await conn.commit();
        res.json({ success: true, message: `Successfully purchased ${item.name}!`, new_axp: updatedAxp });
    } catch (err) {
        if (conn) await conn.rollback();
        console.error('[Shop] Purchase error:', err);
        res.status(err.status || 500).json({ error: err.message || 'Server error during purchase' });
    } finally {
        if (conn) conn.release();
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
