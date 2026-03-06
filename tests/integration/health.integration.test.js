const test = require('node:test');
const assert = require('node:assert/strict');

const app = require('../../server');
const { db } = require('../../db');

let server;
let baseUrl;

test.before(async () => {
    await new Promise((resolve) => {
        server = app.listen(0, '127.0.0.1', () => {
            const address = server.address();
            baseUrl = `http://127.0.0.1:${address.port}`;
            resolve();
        });
    });
});

test.after(async () => {
    if (server) {
        await new Promise((resolve, reject) => {
            server.close((err) => (err ? reject(err) : resolve()));
        });
    }
    await db.close();
});

test('GET /health returns ok', async () => {
    const res = await fetch(`${baseUrl}/health`);
    assert.equal(res.status, 200);

    const body = await res.json();
    assert.equal(body.status, 'ok');
});

test('GET /api/health returns ok', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.equal(res.status, 200);

    const body = await res.json();
    assert.equal(body.status, 'ok');
});

test('GET /api/health/details returns status object', async () => {
    const res = await fetch(`${baseUrl}/api/health/details`);
    assert.ok([200, 503].includes(res.status));

    const body = await res.json();
    assert.ok(['ok', 'degraded'].includes(body.status));
    assert.equal(typeof body.uptimeSeconds, 'number');
    assert.equal(typeof body.checks, 'object');
    assert.equal(typeof body.checks.api.ok, 'boolean');
    assert.equal(typeof body.checks.database.ok, 'boolean');
});
