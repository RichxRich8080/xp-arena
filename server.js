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
    throw new Error('JWT_SECRET is required in production');
}
app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(compression());
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()) : ['*'];
if (allowedOrigins.includes('*')) {
    app.use(cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));
} else {
    app.use(cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));
}
app.use(express.json());

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: 'Too many requests from this IP, please try again later.' }
});

app.use(express.static(path.join(__dirname, 'public'), {
    extensions: ['html', 'htm']
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/:page', (req, res, next) => {
    const filePath = path.join(__dirname, 'public', `${req.params.page}.html`);
    res.sendFile(filePath, err => {
        if (err) next();
    });
});

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const featureRoutes = require('./routes/featureRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api', featureRoutes);

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
