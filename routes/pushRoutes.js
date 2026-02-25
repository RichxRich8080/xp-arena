const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { verifyToken } = require('../middleware/authMiddleware');
const pushService = require('../services/pushService');

// GET /api/push/public-key
// Returns the VAPID public key for the frontend to use
router.get('/public-key', (req, res) => {
    res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

// POST /api/push/subscribe
// Save the user's push subscription
router.post('/subscribe', verifyToken, async (req, res) => {
    try {
        const { subscription } = req.body;
        const userId = req.user.id;

        if (!subscription || !subscription.endpoint) {
            return res.status(400).json({ error: 'Invalid subscription object' });
        }

        // Store subscription in database
        const subscriptionJson = JSON.stringify(subscription);
        const query = `
            INSERT INTO push_subscriptions (user_id, subscription_json)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE subscription_json = ?
        `;
        await db.execute(query, [userId, subscriptionJson, subscriptionJson]);

        res.status(201).json({ success: true, message: 'Subscribed successfully' });
    } catch (err) {
        console.error('Push Subscription Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/push/send
// Send a notification (Admin only or system triggered)
router.post('/send', verifyToken, async (req, res) => {
    try {
        const { targetUserId, title, body, icon, url } = req.body;

        // Basic ACL check - either admin or sending to self (for testing)
        // In a real app you'd enforce admin role strictly
        if (req.user.id !== parseInt(targetUserId) && !req.user.is_admin) {
            return res.status(403).json({ error: 'Unauthorized to send push notifications to others' });
        }

        const [rows] = await db.query('SELECT subscription_json FROM push_subscriptions WHERE user_id = ?', [targetUserId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'User has no active push subscription' });
        }

        const subscription = JSON.parse(rows[0].subscription_json);
        const payload = { title, body, icon, data: { url } };

        const result = await pushService.sendNotification(subscription, payload);

        if (result.success) {
            res.json({ success: true, message: 'Notification sent successfully' });
        } else {
            if (result.stale) {
                // Remove stale subscription
                await db.query('DELETE FROM push_subscriptions WHERE user_id = ?', [targetUserId]);
                return res.status(410).json({ error: 'Subscription was stale and has been removed' });
            }
            res.status(500).json({ error: 'Failed to send notification: ' + result.error });
        }
    } catch (err) {
        console.error('Push Send Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
