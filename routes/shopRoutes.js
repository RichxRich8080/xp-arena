const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { db, pool } = require('../db');
const { authenticateToken } = require('../middleware/auth');
const economy = require('../services/economyService');
const idempotency = require('../services/idempotencyService');
const security = require('../services/securityService');

const buyLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 8,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many purchase attempts. Please wait before retrying.' }
});

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
 * Seed default items if shop is empty
 */
router.post('/seed-defaults', async (req, res) => {
    try {
        const countRow = await db.get('SELECT COUNT(*) AS c FROM shop_items');
        if (countRow && countRow.c > 0) return res.json({ success: true, seeded: false });
        const defaults = [
            ['XP Doubler (1h)', 'Double your AXP gain for 1 hour', 100, 'booster', 'fas fa-hourglass-half', 'common'],
            ['XP Booster (24h)', 'Double your AXP gain for 24 hours', 500, 'booster', 'fas fa-bolt', 'rare'],
            ['XP Booster (48h)', 'Double your AXP gain for 48 hours', 800, 'booster', 'fas fa-bolt', 'epic'],
            ['XP Doubler (6h)', 'Double AXP gain for 6 hours', 300, 'booster', 'fas fa-hourglass', 'rare'],
            ['XP Doubler (12h)', 'Double AXP gain for 12 hours', 600, 'booster', 'fas fa-hourglass', 'epic'],
            ['Premium Theme: Gold', 'Unlock the luxurious Gold accent theme', 2500, 'cosmetic', 'fas fa-palette', 'epic'],
            ['Premium Theme: Neon Cyan', 'Switch to the classic XP ARENA cyan glow theme', 2000, 'cosmetic', 'fas fa-palette', 'rare'],
            ['Premium Theme: Ghost Purple', 'Dark purple spectral theme for elites', 2000, 'cosmetic', 'fas fa-palette', 'rare'],
            ['Premium Theme: Elite Black', 'Minimal blacked-out visor theme', 3000, 'cosmetic', 'fas fa-palette', 'epic'],
            ['VIP Badge', 'Exclusive V verified badge next to your name', 5000, 'badge', 'fas fa-check-circle', 'legendary'],
            ['Areni Pro Avatar', 'Special pro player silhouette avatar', 1200, 'avatar', 'fas fa-user-astronaut', 'rare'],
            ['Avatar: Sentinel', 'Guardian silhouette avatar with photon edge', 900, 'avatar', 'fas fa-user-shield', 'rare'],
            ['Avatar: Phantom', 'Spectral shadow avatar with ghost trail', 900, 'avatar', 'fas fa-user-secret', 'rare'],
            ['Profile Frame: Photon Edge', 'Neon cyan frame around your profile card', 1000, 'cosmetic', 'fas fa-square', 'rare'],
            ['Victory Emote: Satellite Pulse', 'Animated victory signal for leaderboard entries', 800, 'cosmetic', 'fas fa-satellite-dish', 'common'],
            ['Kill Banner: Neon Surge', 'Cosmetic kill banner effect in profile stats', 1500, 'cosmetic', 'fas fa-bolt', 'epic'],
            ['Global Premium Upgrade', 'One-time AXP purchase for permanent Premium status', 25000, 'cosmetic', 'fas fa-gem', 'legendary'],
            ['Rename Card', 'Change your operative identity. Single use.', 1000, 'cosmetic', 'fas fa-id-card', 'rare']
        ];
        for (const row of defaults) {
            await db.run('INSERT INTO shop_items (name, description, price_axp, type, icon, rarity, stock, active) VALUES (?,?,?,?,?,?,-1,1)', row);
        }
        res.json({ success: true, seeded: true });
    } catch (e) {
        console.error('[Shop] Seed defaults error:', e);
        res.status(500).json({ error: 'Failed to seed defaults' });
    }
});

/**
 * Purchase an item
 */
router.post('/buy', authenticateToken, buyLimiter, async (req, res) => {
    const { itemId } = req.body;
    if (!itemId) return res.status(400).json({ error: 'Item ID required' });

    let idemKey;
    try {
        idemKey = idempotency.readIdempotencyKey(req);
        await idempotency.reserveKey({ userId: req.user.id, endpointScope: 'shop:buy', key: idemKey });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            const existing = await idempotency.getStoredResponse({ userId: req.user.id, endpointScope: 'shop:buy', key: req.get('Idempotency-Key') });
            if (existing && existing.status === 'completed') {
                const body = existing.response_body ? JSON.parse(existing.response_body) : { success: true };
                res.set('Idempotent-Replay', 'true');
                return res.status(existing.response_status || 200).json(body);
            }
            return res.status(409).json({ error: 'Purchase with this idempotency key is already in progress' });
        }
        return res.status(err.status || 500).json({ error: err.message || 'Failed to reserve idempotency key' });
    }

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
            const [premiumRows] = await conn.execute('SELECT is_premium FROM users WHERE id = ? FOR UPDATE', [req.user.id]);
            const wasPremium = !!(premiumRows[0] && premiumRows[0].is_premium);
            await conn.execute('UPDATE users SET is_premium = 1 WHERE id = ?', [req.user.id]);
            if (!wasPremium) {
                await security.writeAuditLog({
                    userId: req.user.id,
                    actorUserId: req.user.id,
                    eventType: 'premium_status_changed',
                    metadata: { source: 'shop_buy', from: false, to: true, itemId, itemName: item.name },
                    conn,
                });
            }
        }

        const updatedAxp = await economy.snapshotAXP(req.user.id, conn);
        await security.writeAuditLog({
            userId: req.user.id,
            actorUserId: req.user.id,
            eventType: 'shop_purchase',
            metadata: { itemId, itemName: item.name, priceAXP: item.price_axp, newAXP: updatedAxp },
            conn,
        });

        await conn.commit();
        const payload = { success: true, message: `Successfully purchased ${item.name}!`, new_axp: updatedAxp };
        await idempotency.completeKey({ userId: req.user.id, endpointScope: 'shop:buy', key: idemKey, statusCode: 200, responseBody: payload });
        res.json(payload);
    } catch (err) {
        if (conn) await conn.rollback();
        await idempotency.releaseKey({ userId: req.user.id, endpointScope: 'shop:buy', key: idemKey });
        if ((err.status >= 400 && err.status < 500) || String(err.message || '').includes('Insufficient AXP')) {
            await security.recordFailedPurchaseAttempt({ userId: req.user.id, ipAddress: req.ip, reason: err.message || 'purchase_failed' });
        }
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
