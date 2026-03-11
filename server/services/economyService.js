const { db, pool } = require('../config/db');

function economyLog(level, operation, payload = {}) {
    const entry = {
        timestamp: new Date().toISOString(),
        level,
        service: 'economy',
        operation,
        ...payload,
    };
    console[level === 'error' ? 'error' : 'log'](JSON.stringify(entry));
}

function normalizeMetadata(metadata) {
    if (!metadata) return null;
    try {
        return JSON.stringify(metadata);
    } catch (err) {
        return JSON.stringify({ serializationError: true });
    }
}

function todayISODate() {
    return new Date().toISOString().slice(0, 10);
}

async function recordEconomyEvent(event = {}, conn = null) {
    const {
        userId,
        eventType = 'unknown',
        source = 'unspecified',
        amount = 0,
        status = 'success',
        metadata = null,
    } = event;
    const serializedMetadata = normalizeMetadata(metadata);

    if (conn) {
        await conn.execute(
            `INSERT INTO economy_events (user_id, event_type, source, amount, status, metadata)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [userId || null, eventType, source, amount, status, serializedMetadata]
        );
        return;
    }

    await db.run(
        `INSERT INTO economy_events (user_id, event_type, source, amount, status, metadata)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId || null, eventType, source, amount, status, serializedMetadata]
    );
}

async function snapshotAXP(userId, conn = null, options = {}) {
    const eventType = options.eventType || 'snapshot';
    const source = options.source || 'economy.snapshotAXP';
    const metadata = normalizeMetadata(options.metadata);

    if (conn) {
        const [rows] = await conn.execute('SELECT axp FROM users WHERE id = ?', [userId]);
        if (!rows[0]) return;
        const axp = rows[0].axp || 0;
        await conn.execute(
            `INSERT INTO axp_history (user_id, axp, date, event_type, source, metadata)
             VALUES (?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE axp = VALUES(axp), event_type = VALUES(event_type), source = VALUES(source), metadata = VALUES(metadata)`,
            [userId, axp, todayISODate(), eventType, source, metadata]
        );
        return axp;
    }

    const user = await db.get('SELECT axp FROM users WHERE id = ?', [userId]);
    if (!user) return;
    await db.run(
        `INSERT INTO axp_history (user_id, axp, date, event_type, source, metadata)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE axp = VALUES(axp), event_type = VALUES(event_type), source = VALUES(source), metadata = VALUES(metadata)`,
        [userId, user.axp || 0, todayISODate(), eventType, source, metadata]
    );
    return user.axp || 0;
}

async function awardAXP(userId, amount, reason = null, conn = null) {
    const delta = Math.max(0, parseInt(amount, 10) || 0);
    if (!delta) return { success: true, delta: 0 };

    economyLog('log', 'awardAXP.start', { userId, delta, reason });

    if (conn) {
        await conn.execute('UPDATE users SET axp = axp + ? WHERE id = ?', [delta, userId]);
        if (reason) {
            await conn.execute('INSERT INTO activity (user_id, text) VALUES (?, ?)', [userId, reason]);
        }
        await recordEconomyEvent({ userId, eventType: 'reward', source: 'economy.awardAXP', amount: delta, metadata: { reason } }, conn);
        const updated = await snapshotAXP(userId, conn, { eventType: 'reward', source: 'economy.awardAXP', metadata: { reason, delta } });
        economyLog('log', 'awardAXP.success', { userId, delta, axp: updated });
        return { success: true, delta, axp: updated };
    }

    await db.run('UPDATE users SET axp = axp + ? WHERE id = ?', [delta, userId]);
    if (reason) await db.run('INSERT INTO activity (user_id, text) VALUES (?, ?)', [userId, reason]);
    await recordEconomyEvent({ userId, eventType: 'reward', source: 'economy.awardAXP', amount: delta, metadata: { reason } });
    const updated = await snapshotAXP(userId, null, { eventType: 'reward', source: 'economy.awardAXP', metadata: { reason, delta } });
    economyLog('log', 'awardAXP.success', { userId, delta, axp: updated });
    return { success: true, delta, axp: updated };
}

async function chargeAXP(userId, amount, reason = null, conn = null) {
    const delta = Math.max(0, parseInt(amount, 10) || 0);
    if (!delta) return { success: true, delta: 0 };

    economyLog('log', 'chargeAXP.start', { userId, delta, reason });

    if (conn) {
        const [result] = await conn.execute('UPDATE users SET axp = axp - ? WHERE id = ? AND axp >= ?', [delta, userId, delta]);
        if (!result.affectedRows) {
            await recordEconomyEvent({ userId, eventType: 'transaction_failure', source: 'economy.chargeAXP', amount: -delta, status: 'failure', metadata: { reason, code: 'INSUFFICIENT_AXP' } }, conn);
            economyLog('error', 'chargeAXP.failure', { userId, delta, code: 'INSUFFICIENT_AXP' });
            return { success: false, error: 'INSUFFICIENT_AXP' };
        }
        if (reason) {
            await conn.execute('INSERT INTO activity (user_id, text) VALUES (?, ?)', [userId, reason]);
        }
        await recordEconomyEvent({ userId, eventType: 'charge', source: 'economy.chargeAXP', amount: -delta, metadata: { reason } }, conn);
        const updated = await snapshotAXP(userId, conn, { eventType: 'charge', source: 'economy.chargeAXP', metadata: { reason, delta } });
        economyLog('log', 'chargeAXP.success', { userId, delta, axp: updated });
        return { success: true, delta, axp: updated };
    }

    const result = await db.run('UPDATE users SET axp = axp - ? WHERE id = ? AND axp >= ?', [delta, userId, delta]);
    if (!result.changes) {
        await recordEconomyEvent({ userId, eventType: 'transaction_failure', source: 'economy.chargeAXP', amount: -delta, status: 'failure', metadata: { reason, code: 'INSUFFICIENT_AXP' } });
        economyLog('error', 'chargeAXP.failure', { userId, delta, code: 'INSUFFICIENT_AXP' });
        return { success: false, error: 'INSUFFICIENT_AXP' };
    }
    if (reason) await db.run('INSERT INTO activity (user_id, text) VALUES (?, ?)', [userId, reason]);
    await recordEconomyEvent({ userId, eventType: 'charge', source: 'economy.chargeAXP', amount: -delta, metadata: { reason } });
    const updated = await snapshotAXP(userId, null, { eventType: 'charge', source: 'economy.chargeAXP', metadata: { reason, delta } });
    economyLog('log', 'chargeAXP.success', { userId, delta, axp: updated });
    return { success: true, delta, axp: updated };
}

async function withTransaction(fn, context = {}) {
    const conn = await pool.getConnection();
    economyLog('log', 'transaction.start', context);
    try {
        await conn.beginTransaction();
        const result = await fn(conn);
        await conn.commit();
        economyLog('log', 'transaction.success', context);
        return result;
    } catch (err) {
        await conn.rollback();
        economyLog('error', 'transaction.failure', { ...context, error: err.message });
        throw err;
    } finally {
        conn.release();
    }
}

module.exports = {
    snapshotAXP,
    awardAXP,
    chargeAXP,
    withTransaction,
    recordEconomyEvent,
    economyLog,
};
