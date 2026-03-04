const { db, pool } = require('../db');

function todayISODate() {
    return new Date().toISOString().slice(0, 10);
}

async function snapshotAXP(userId, conn = null) {
    if (conn) {
        const [rows] = await conn.execute('SELECT axp FROM users WHERE id = ?', [userId]);
        if (!rows[0]) return;
        const axp = rows[0].axp || 0;
        await conn.execute(
            'INSERT INTO axp_history (user_id, axp, date) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE axp = VALUES(axp)',
            [userId, axp, todayISODate()]
        );
        return axp;
    }

    const user = await db.get('SELECT axp FROM users WHERE id = ?', [userId]);
    if (!user) return;
    await db.run(
        'INSERT INTO axp_history (user_id, axp, date) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE axp = ?',
        [userId, user.axp || 0, todayISODate(), user.axp || 0]
    );
    return user.axp || 0;
}

async function awardAXP(userId, amount, reason = null, conn = null) {
    const delta = Math.max(0, parseInt(amount, 10) || 0);
    if (!delta) return { success: true, delta: 0 };

    if (conn) {
        await conn.execute('UPDATE users SET axp = axp + ? WHERE id = ?', [delta, userId]);
        if (reason) {
            await conn.execute('INSERT INTO activity (user_id, text) VALUES (?, ?)', [userId, reason]);
        }
        const updated = await snapshotAXP(userId, conn);
        return { success: true, delta, axp: updated };
    }

    await db.run('UPDATE users SET axp = axp + ? WHERE id = ?', [delta, userId]);
    if (reason) await db.run('INSERT INTO activity (user_id, text) VALUES (?, ?)', [userId, reason]);
    const updated = await snapshotAXP(userId);
    return { success: true, delta, axp: updated };
}

async function chargeAXP(userId, amount, reason = null, conn = null) {
    const delta = Math.max(0, parseInt(amount, 10) || 0);
    if (!delta) return { success: true, delta: 0 };

    if (conn) {
        const [result] = await conn.execute('UPDATE users SET axp = axp - ? WHERE id = ? AND axp >= ?', [delta, userId, delta]);
        if (!result.affectedRows) return { success: false, error: 'INSUFFICIENT_AXP' };
        if (reason) {
            await conn.execute('INSERT INTO activity (user_id, text) VALUES (?, ?)', [userId, reason]);
        }
        const updated = await snapshotAXP(userId, conn);
        return { success: true, delta, axp: updated };
    }

    const result = await db.run('UPDATE users SET axp = axp - ? WHERE id = ? AND axp >= ?', [delta, userId, delta]);
    if (!result.changes) return { success: false, error: 'INSUFFICIENT_AXP' };
    if (reason) await db.run('INSERT INTO activity (user_id, text) VALUES (?, ?)', [userId, reason]);
    const updated = await snapshotAXP(userId);
    return { success: true, delta, axp: updated };
}

async function withTransaction(fn) {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const result = await fn(conn);
        await conn.commit();
        return result;
    } catch (err) {
        await conn.rollback();
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
};
