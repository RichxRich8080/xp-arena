const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const db = require('../db');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 requests per windowMs
    message: { error: 'Too many requests from this IP, please try again later.' }
});

// Register
router.post('/register', authLimiter, async (req, res) => {
    const { username, email, password } = req.body;
    console.log(`[Auth] Attempting to register user: ${username} (${email})`);

    if (!username || !email || !password) return res.status(400).json({ error: 'Username, email, and password required' });

    try {
        console.log('[Auth] Hashing password...');
        const hash = await bcrypt.hash(password, 10);
        console.log('[Auth] Password hashed successfully. Saving to DB...');

        const result = await db.run('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', [username, email, hash]);
        const userId = result.lastID;
        console.log(`[Auth] User saved with ID: ${userId}. Updating initial stats...`);

        // Initial Activity and AXP
        await db.run('UPDATE users SET axp = 100 WHERE id = ?', [userId]);
        await db.run('INSERT INTO activity (user_id, text) VALUES (?, ?)', [userId, 'Account created! Welcome bonus awarded.']);

        console.log('[Auth] Registration complete. Generating token...');
        const token = jwt.sign({ id: userId, username }, JWT_SECRET);
        res.json({ success: true, token, user: { id: userId, username, email } });
    } catch (err) {
        console.error('[Auth] Registration Error:', err);
        if (err.code === 'ER_DUP_ENTRY' || err.message.includes('UNIQUE')) {
            return res.status(400).json({ error: 'Username or email already taken' });
        }
        res.status(500).json({ error: 'Server error: ' + (err.message || 'Unknown error') });
    }
});

// Login
router.post('/login', authLimiter, async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    try {
        const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
        if (!user) return res.status(400).json({ error: 'Invalid username or password' });

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(400).json({ error: 'Invalid username or password' });

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
        res.json({ success: true, token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Verify Session
router.get('/verify', authenticateToken, async (req, res) => {
    try {
        const user = await db.get('SELECT id, username, axp, level, avatar, streak, socials, created_at FROM users WHERE id = ?', [req.user.id]);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Reset Password
router.post('/reset', authLimiter, async (req, res) => {
    return res.status(403).json({ error: 'Password reset is disabled for security reasons in this environment. Please contact support.' });
});

module.exports = router;
