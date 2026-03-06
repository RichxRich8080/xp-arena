const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const { db } = require('./db');
const { env, assertProductionReadiness } = require('./config/env');

const app = express();
const PORT = env.port;

try {
    assertProductionReadiness();
} catch (error) {
    console.error(`⚠️ [CRITICAL] ${error.message} Shutting down for safety.`);
    process.exit(1);
}

app.set('trust proxy', 1);

app.use((req, res, next) => {
    if (env.isProduction && req.headers['x-forwarded-proto'] === 'http') {
        const httpsUrl = `https://${req.hostname}${req.url}`;
        return res.redirect(301, httpsUrl);
    }
    return next();
});

app.disable('x-powered-by');
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://cdn.jsdelivr.net'],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            imgSrc: ["'self'", 'data:', 'https:*'],
            connectSrc: ["'self'", 'https:*'],
        },
    },
}));
app.use(compression());

const corsIsOpen = env.allowedOrigins.length === 0;
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || corsIsOpen) return callback(null, true);
        if (env.allowedOrigins.includes('*') && !env.isProduction) return callback(null, true);
        if (env.allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests from this IP, please try again later.' },
});

const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

app.use(express.static(path.join(__dirname, 'public'), {
    extensions: ['html', 'htm'],
    maxAge: '1d',
    etag: true,
    setHeaders: (res, filePath) => {
        if (path.extname(filePath) === '.html') {
            res.setHeader('Cache-Control', 'no-cache');
        }
    },
}));

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
app.use('/api/guild', guildRoutes);
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

app.get('/api/health/details', async (req, res) => {
    const startedAt = process.uptime();
    const checks = {
        api: { ok: true },
        database: { ok: false },
    };

    try {
        await db.get('SELECT 1 AS ok');
        checks.database.ok = true;
    } catch (error) {
        checks.database.error = error.code || 'DB_UNAVAILABLE';
    }

    const ok = checks.api.ok && checks.database.ok;
    res.status(ok ? 200 : 503).json({
        status: ok ? 'ok' : 'degraded',
        timestamp: new Date().toISOString(),
        uptimeSeconds: Math.floor(startedAt),
        checks,
    });
});

app.use('/api', (req, res) => {
    res.status(404).json({ error: 'API route not found' });
});

app.use((err, req, res, next) => {
    const status = err.status || err.statusCode || 500;
    const payload = {
        error: status >= 500 ? 'Server error' : (err.message || 'Request failed'),
    };
    if (!env.isProduction && err.stack) {
        payload.debug = err.stack;
    }
    if (status >= 500) {
        console.error('[UnhandledError]', err);
    }
    res.status(status).json(payload);
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;
