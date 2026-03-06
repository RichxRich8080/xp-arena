const test = require('node:test');
const assert = require('node:assert/strict');

const app = require('../../server');

function createServer() {
  return new Promise((resolve) => {
    const server = app.listen(0, '127.0.0.1', () => {
      const address = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${address.port}` });
    });
  });
}

test('GET /health returns ok', async (t) => {
  const { server, baseUrl } = await createServer();
  t.after(() => server.close());

  const res = await fetch(`${baseUrl}/health`);
  assert.equal(res.status, 200);

  const body = await res.json();
  assert.equal(body.status, 'ok');
});

test('GET /api/health returns ok', async (t) => {
  const { server, baseUrl } = await createServer();
  t.after(() => server.close());

  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);

  const body = await res.json();
  assert.equal(body.status, 'ok');
});

test('GET /api/health/details returns status object', async (t) => {
  const { server, baseUrl } = await createServer();
  t.after(() => server.close());

  const res = await fetch(`${baseUrl}/api/health/details`);
  assert.ok([200, 503].includes(res.status));

  const body = await res.json();
  assert.ok(['ok', 'degraded'].includes(body.status));
  assert.equal(typeof body.uptimeSeconds, 'number');
  assert.equal(typeof body.checks, 'object');
  assert.equal(typeof body.checks.api.ok, 'boolean');
  assert.equal(typeof body.checks.database.ok, 'boolean');
});
