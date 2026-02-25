const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const { db } = require('../db');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');
const emailService = require('../services/emailService');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 requests per windowMs
    message: { error: 'Too many requests from this IP, please try again later.' }
});

const strictLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10,
    message: { error: 'Too many sensitive requests, please try again later.' }
});

// Helper for DATETIME
function getFutureDateTime(minutes) {
    const d = new Date(Date.now() + minutes * 60000);
    return d.toISOString().slice(0, 19).replace('T', ' ');
}

// Generate referral code
function generateReferralCode() {
    return crypto.randomBytes(4).toString('hex').toUpperCase(); // 8 chars
}

// Register
router.post('/register', authLimiter, async (req, res) => {
    const { username, email, password, ref } = req.body;
    console.log(`[Auth] Attempting to register user: ${username} (${email})`);

    if (!username || !email || !password) return res.status(400).json({ error: 'Username, email, and password required' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
    if (username.length < 3) return res.status(400).json({ error: 'Username must be at least 3 characters' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Invalid email address' });

    try {
        const hash = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
        const vExpires = getFutureDateTime(15);
        const refCode = generateReferralCode();

        let referredBy = null;
        if (ref) {
            const referrer = await db.get('SELECT id FROM users WHERE referral_code = ?', [ref]);
            if (referrer) referredBy = referrer.id;
        }

        const result = await db.run(
            `INSERT INTO users (username, email, password_hash, email_verified, verification_token, verification_expires, referral_code, referred_by)
             VALUES (?, ?, ?, 0, ?, ?, ?, ?)`,
            [username, email, hash, verificationToken, vExpires, refCode, referredBy]
        );
        const userId = result.lastID;

        // Initial Activity and AXP (Welcome bonus)
        await db.run('UPDATE users SET axp = 100 WHERE id = ?', [userId]);
        await db.run('INSERT INTO activity (user_id, text) VALUES (?, ?)', [userId, 'Account created! Welcome bonus awarded.']);

        // Track referral relationship if exists
        if (referredBy) {
            await db.run('INSERT INTO referrals (referrer_id, referred_id) VALUES (?, ?)', [referredBy, userId]);
        }

        // Send email
        await emailService.sendVerificationEmail(email, verificationToken);

        res.json({ success: true, requires_verification: true, username, email });
    } catch (err) {
        console.error('[Auth] Registration Error:', err);
        if (err.code === 'ER_DUP_ENTRY' || err.message.includes('UNIQUE')) {
            return res.status(400).json({ error: 'Username or email already taken' });
        }
        res.status(500).json({ error: 'Server error: ' + (err.message || 'Unknown error') });
    }
});

// Verify Email
router.post('/verify-email', strictLimiter, async (req, res) => {
    const { username, code } = req.body;
    if (!username || !code) return res.status(400).json({ error: 'Username and code required' });

    try {
        const user = await db.get('SELECT id, verification_token, verification_expires FROM users WHERE username = ? OR email = ?', [username, username]);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (user.verification_token !== code) return res.status(400).json({ error: 'Invalid verification code' });

        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
        if (user.verification_expires < now) return res.status(400).json({ error: 'Verification code expired' });

        // Verify successful
        await db.run('UPDATE users SET email_verified = 1, verification_token = NULL, verification_expires = NULL WHERE id = ?', [user.id]);

        // Generate initial login token
        const token = jwt.sign({ id: user.id, username }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ success: true, token, user: { id: user.id, username } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
router.post('/login', authLimiter, async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    try {
        const user = await db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, username]);
        if (!user) return res.status(400).json({ error: 'Invalid username or password' });
        if (user.banned) return res.status(403).json({ error: 'Account banned: ' + (user.ban_reason || 'No reason provided') });

        // Account Lockout check
        if (user.lockout_until) {
            const lockoutTime = new Date(user.lockout_until);
            if (lockoutTime > new Date()) {
                const mins = Math.ceil((lockoutTime - new Date()) / 60000);
                return res.status(403).json({ error: `Account locked. Try again in ${mins} minutes.` });
            }
        }

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            const attempts = (user.login_attempts || 0) + 1;
            if (attempts >= 5) {
                const lockout = getFutureDateTime(15);
                await db.run('UPDATE users SET login_attempts = ?, lockout_until = ? WHERE id = ?', [attempts, lockout, user.id]);
                return res.status(403).json({ error: 'Too many failed attempts. Account locked for 15 minutes.' });
            } else {
                await db.run('UPDATE users SET login_attempts = ? WHERE id = ?', [attempts, user.id]);
                return res.status(400).json({ error: 'Invalid username or password' });
            }
        }

        // Success - Reset attempts
        await db.run('UPDATE users SET login_attempts = 0, lockout_until = NULL WHERE id = ?', [user.id]);

        if (user.email_verified === 0) {
            // Re-generate and resend code if expired or requested
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            const expires = getFutureDateTime(15);
            await db.run('UPDATE users SET verification_token = ?, verification_expires = ? WHERE id = ?', [code, expires, user.id]);
            await emailService.sendVerificationEmail(user.email, code);
            return res.status(403).json({ requires_verification: true, username: user.username, email: user.email, error: 'Please verify your email to log in. A new code has been sent.' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ success: true, token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Verify Session
router.get('/verify', authenticateToken, async (req, res) => {
    try {
        const user = await db.get('SELECT id, username, axp, level, avatar, streak, socials, referral_code, created_at FROM users WHERE id = ?', [req.user.id]);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Forgot Password
router.post('/forgot-password', strictLimiter, async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    try {
        const user = await db.get('SELECT id, username, email FROM users WHERE email = ?', [email]);
        if (!user) {
            // Always return success to prevent email enumeration
            return res.json({ success: true, message: 'If that email exists, a reset link was sent.' });
        }

        const token = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits for easier entry
        const expires = getFutureDateTime(30);

        await db.run('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?', [token, expires, user.id]);
        await emailService.sendResetEmail(user.email, token);

        res.json({ success: true, message: 'Recovery code sent to your email.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Reset Password
router.post('/reset-password', strictLimiter, async (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ error: 'Token and new password required' });

    try {
        const user = await db.get('SELECT id, reset_token_expires FROM users WHERE reset_token = ? AND reset_token IS NOT NULL', [token]);
        if (!user) return res.status(400).json({ error: 'Invalid or expired recovery code' });

        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
        if (user.reset_token_expires < now) return res.status(400).json({ error: 'Token has expired' });

        const hash = await bcrypt.hash(newPassword, 10);
        await db.run('UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?', [hash, user.id]);

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
