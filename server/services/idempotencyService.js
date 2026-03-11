const { db } = require('../config/db');

function readIdempotencyKey(req) {
    const fromHeader = req.get('Idempotency-Key');
    const key = (fromHeader || '').trim();
    if (!key) {
        const err = new Error('Idempotency-Key header is required');
        err.status = 400;
        throw err;
    }
    if (key.length < 8 || key.length > 128) {
        const err = new Error('Invalid Idempotency-Key length');
        err.status = 400;
        throw err;
    }
    return key;
}

async function getStoredResponse({ userId, endpointScope, key }) {
    return db.get(
        `SELECT id, status, response_status, response_body
         FROM idempotency_keys
         WHERE user_id = ? AND endpoint_scope = ? AND idempotency_key = ?`,
        [userId, endpointScope, key]
    );
}

async function reserveKey({ userId, endpointScope, key }) {
    return db.run(
        `INSERT INTO idempotency_keys (user_id, endpoint_scope, idempotency_key, status)
         VALUES (?, ?, ?, 'pending')`,
        [userId, endpointScope, key]
    );
}

async function completeKey({ userId, endpointScope, key, statusCode = 200, responseBody = {} }) {
    return db.run(
        `UPDATE idempotency_keys
         SET status = 'completed', response_status = ?, response_body = ?
         WHERE user_id = ? AND endpoint_scope = ? AND idempotency_key = ?`,
        [statusCode, JSON.stringify(responseBody || {}), userId, endpointScope, key]
    );
}

async function releaseKey({ userId, endpointScope, key }) {
    return db.run(
        `DELETE FROM idempotency_keys
         WHERE user_id = ? AND endpoint_scope = ? AND idempotency_key = ? AND status = 'pending'`,
        [userId, endpointScope, key]
    );
}

module.exports = {
    readIdempotencyKey,
    getStoredResponse,
    reserveKey,
    completeKey,
    releaseKey,
};
