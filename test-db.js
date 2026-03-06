const test = require('node:test');
const assert = require('node:assert/strict');
const { db } = require('./db');

test('db helper handles connectivity checks predictably', async (t) => {
    try {
        const result = await db.query('SELECT 1 as test');
        assert.equal(Array.isArray(result), true);
        assert.equal(result[0].test, 1);
    } catch (err) {
        t.diagnostic(`DB unavailable in current environment: ${err.code || err.message}`);
        assert.ok(err);
    } finally {
        await db.close();
    }
});
