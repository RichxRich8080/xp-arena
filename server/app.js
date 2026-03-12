require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const { checkDatabaseConnection } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

let dbReady = false;

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    console.error('⚠️ [CRITICAL] JWT_SECRET is missing. Authentication node will return errors.');
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
            scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://cdn.jsdelivr.net'],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            imgSrc: ["'self'", 'data:', 'https:*'],
            connectSrc: ["'self'", 'https:*'],
        },
    },
}));
app.use(compression());
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()) : [];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        // If no explicit ALLOWED_ORIGINS is configured, allow same-origin traffic.
        if (allowedOrigins.length === 0) return callback(null, true);

        if (allowedOrigins.includes('*') && process.env.NODE_ENV !== 'production') return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());

const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(express.static(path.join(__dirname, '../frontend/dist'), {
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
    const status = dbReady ? 'ok' : 'degraded';
    res.status(dbReady ? 200 : 503).json({ status, checks: { database: dbReady ? 'ok' : 'down' } });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/api/ready', (req, res) => {
    if (!dbReady) {
        return res.status(503).json({
            success: false,
            code: 'SERVICE_NOT_READY',
            message: 'Service is not ready yet. Database connectivity is unavailable.'
        });
    }

    return res.json({ success: true, status: 'ready' });
});

// SPA Routing Fallback (Must be after all API routes)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

app.use((err, req, res, next) => {
    console.error(`[ERROR] ${new Date().toISOString()}`);
    console.error(`Method: ${req.method} | Path: ${req.url}`);
    console.error(err.stack);

    res.status(500).json({
        success: false,
        code: 'INTERNAL_SERVER_ERROR',
        message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred.' : err.message
    });
});

process.on('unhandledRejection', (reason) => {
    console.error('⚠️ [CRITICAL] Unhandled Promise Rejection:', reason);
});

async function refreshDatabaseReadiness() {
    try {
        await checkDatabaseConnection();
        dbReady = true;
    } catch (error) {
        dbReady = false;
        console.error('[Readiness] Database connectivity check failed:', error.code || error.message);
    }
}

if (require.main === module) {
    (async () => {
        await refreshDatabaseReadiness();
        if (process.env.REQUIRE_DB_ON_BOOT === 'true' && !dbReady) {
            console.error('[Startup] REQUIRE_DB_ON_BOOT=true and database is unreachable. Exiting.');
            process.exit(1);
        }

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

        const readinessTimer = setInterval(refreshDatabaseReadiness, 30000);
        readinessTimer.unref();
    })();
}

module.exports = app;
