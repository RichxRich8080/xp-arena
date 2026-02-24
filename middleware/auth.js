const jwt = require('jsonwebtoken');
const { db } = require('../db');
const JWT_SECRET = process.env.NODE_ENV === 'production'
  ? process.env.JWT_SECRET
  : (process.env.JWT_SECRET || 'xpare123secretkey');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    jwt.verify(token, JWT_SECRET, async (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
        try {
            // Optional owner override via env
            const adminName = process.env.ADMIN_USERNAME;
            if (adminName && user && user.username === adminName) {
                user.is_owner_admin = true;
            }
            // Banned check
            const u = await db.get('SELECT banned FROM users WHERE id = ?', [user.id]);
            if (u && u.banned) return res.status(403).json({ error: 'Account banned' });
            req.user = user;
            next();
        } catch {
            return res.status(500).json({ error: 'Server error' });
        }
    });
}

module.exports = { authenticateToken, JWT_SECRET };
