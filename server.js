require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const { db } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    console.error('⚠️ [CRITICAL] JWT_SECRET is missing in production environment. Shutting down for safety.');
    process.exit(1);
}
app.set('trust proxy', 1);

// HTTPS Enforcement in production
app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] === 'http') {
        const httpsUrl = 'https://' + req.hostname + req.url;
        return res.redirect(301, httpsUrl);
    }
    next();
});

app.disable('x-powered-by');
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:*"],
            connectSrc: ["'self'", "https:*"],
        },
    },
}));
app.use(compression());
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()) : [];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes('*') && process.env.NODE_ENV !== 'production') return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());


const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: 'Too many requests from this IP, please try again later.' }
});
const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(express.static(path.join(__dirname, 'public'), {
    extensions: ['html', 'htm'],
    maxAge: '1d',
    etag: true,
    setHeaders: (res, filePath) => {
        if (path.extname(filePath) === '.html') {
            res.setHeader('Cache-Control', 'no-cache');
        }
    }
}));

app.use('/api', apiLimiter);

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const featureRoutes = require('./routes/featureRoutes');
const setupRoutes = require('./routes/setupRoutes');
const guildRoutes = require('./routes/guildRoutes');
const tournamentRoutes = require('./routes/tournamentRoutes');
const creatorRoutes = require('./routes/creatorRoutes');
const adminRoutes = require('./routes/adminRoutes');
const pushRoutes = require('./routes/pushRoutes');
const shopRoutes = require('./routes/shopRoutes');
const seasonRoutes = require('./routes/seasonRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api', featureRoutes);
app.use('/api/setups', setupRoutes);
app.use('/api/guilds', guildRoutes);
app.use('/api/guild', guildRoutes); // Alias for singular support
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/creators', creatorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/push', pushRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/season', seasonRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use((err, req, res, next) => {
    res.status(500).json({ error: 'Server error' });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}
module.exports = app;
