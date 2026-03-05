const { db } = require('../db');

const AXP_SPIKE_THRESHOLD = 1000;
const PURCHASE_FAILURE_BURST_THRESHOLD = 5;
const PURCHASE_FAILURE_BURST_WINDOW_MINUTES = 10;

async function writeAuditLog({ userId, actorUserId = null, eventType, metadata = {}, conn = null }) {
    const safeMetadata = JSON.stringify(metadata || {});
    if (conn) {
        await conn.execute(
            'INSERT INTO audit_logs (user_id, actor_user_id, event_type, metadata_json) VALUES (?, ?, ?, ?)',
            [userId || null, actorUserId || null, eventType, safeMetadata]
        );
        return;
    }
    await db.run(
        'INSERT INTO audit_logs (user_id, actor_user_id, event_type, metadata_json) VALUES (?, ?, ?, ?)',
        [userId || null, actorUserId || null, eventType, safeMetadata]
    );
}

async function writeSecurityEvent({ userId, eventType, severity = 'warning', metadata = {}, conn = null }) {
    const safeMetadata = JSON.stringify(metadata || {});
    if (conn) {
        await conn.execute(
            'INSERT INTO security_events (user_id, event_type, severity, metadata_json) VALUES (?, ?, ?, ?)',
            [userId || null, eventType, severity, safeMetadata]
        );
        return;
    }
    await db.run(
        'INSERT INTO security_events (user_id, event_type, severity, metadata_json) VALUES (?, ?, ?, ?)',
        [userId || null, eventType, severity, safeMetadata]
    );
}

async function detectAXPSpike({ userId, beforeAXP, afterAXP, reason = 'unknown', conn = null }) {
    const delta = Math.max(0, (afterAXP || 0) - (beforeAXP || 0));
    if (delta < AXP_SPIKE_THRESHOLD) return;
    await writeSecurityEvent({
        userId,
        eventType: 'sudden_axp_spike',
        severity: 'critical',
        metadata: { beforeAXP, afterAXP, delta, reason },
        conn,
    });
}

async function recordFailedPurchaseAttempt({ userId, ipAddress, reason = 'unknown' }) {
    await writeSecurityEvent({
        userId,
        eventType: 'purchase_failed',
        severity: 'warning',
        metadata: { ipAddress: ipAddress || null, reason },
    });

    const recent = await db.get(
        `SELECT COUNT(*) AS c
         FROM security_events
         WHERE user_id = ?
           AND event_type = 'purchase_failed'
           AND created_at >= (NOW() - INTERVAL ? MINUTE)`,
        [userId, PURCHASE_FAILURE_BURST_WINDOW_MINUTES]
    );

    const count = parseInt(recent && recent.c, 10) || 0;
    if (count >= PURCHASE_FAILURE_BURST_THRESHOLD) {
        await writeSecurityEvent({
            userId,
            eventType: 'purchase_failed_burst',
            severity: 'critical',
            metadata: { ipAddress: ipAddress || null, failuresInWindow: count, reason },
        });
    }
}

module.exports = {
    writeAuditLog,
    writeSecurityEvent,
    detectAXPSpike,
    recordFailedPurchaseAttempt,
};
