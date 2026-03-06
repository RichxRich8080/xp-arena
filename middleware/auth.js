const jwt = require('jsonwebtoken');
const { db } = require('../db');
const { env } = require('../config/env');

const JWT_SECRET = env.jwtSecret;
if (!JWT_SECRET && env.isProduction) {
const JWT_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV !== 'production' ? 'dev-only-insecure-secret' : undefined);
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
    console.error('⚠️ [CRITICAL] JWT_SECRET is missing. Authentication disabled for safety.');
    process.exit(1);
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    if (!JWT_SECRET) {
        console.error('[Middleware] JWT_SECRET not configured.');
        return res.status(500).json({ error: 'Server authentication configuration error.' });
    }

    jwt.verify(token, JWT_SECRET, async (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
        try {
            if (env.adminUsername && user && user.username === env.adminUsername) {
                user.is_owner_admin = true;
            }
            const u = await db.get('SELECT banned FROM users WHERE id = ?', [user.id]);
            if (u && u.banned) return res.status(403).json({ error: 'Account banned' });
            req.user = user;
            return next();
        } catch {
            return res.status(500).json({ error: 'Server error' });
        }
    });
}

module.exports = { authenticateToken, JWT_SECRET };
