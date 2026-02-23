require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const { db } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'xpare123secretkey'; // Fallback for prototyping

// Middleware
// Security headers
app.use(helmet({
    contentSecurityPolicy: false, // Disabling CSP for prototyping to avoid breaking inline scripts/styles
}));
// Compress responses
app.use(compression());
app.use(cors({
    origin: '*', // For prototyping, allowing all origins. Should be restricted in production.
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Rate Limiting for Auth
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 requests per windowMs
    message: { error: 'Too many requests from this IP, please try again later.' }
});

// Serve static elements from public directory with extension support
app.use(express.static(path.join(__dirname, 'public'), {
    extensions: ['html', 'htm']
}));

// Explicitly serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve HTML files without .html extension as a fallback before API routes
app.get('/:page', (req, res, next) => {
    const filePath = path.join(__dirname, 'public', `${req.params.page}.html`);
    res.sendFile(filePath, err => {
        if (err) next();
    });
});

// Modular Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const featureRoutes = require('./routes/featureRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api', featureRoutes);

// Start Server (only if not running as a function)
if (process.env.NODE_ENV !== 'production' && require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

// Export app for Netlify/Vercel functions
module.exports = app;
