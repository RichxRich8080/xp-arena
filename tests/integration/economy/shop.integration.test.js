process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS || '*';

const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../../../server');
const {
  resetEconomyState,
  createUser,
  createShopItem,
  getSingleValue,
  pool
} = require('./helpers');

let server;
let baseUrl;

test.before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

test.beforeEach(async () => {
  await resetEconomyState();
});

test.after(async () => {
  if (server) {
    await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
  }
  await pool.end();
});

async function postWithAuth(path, token, payload) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  return {
    status: response.status,
    body: await response.json()
  };
}

test('POST /api/shop/buy succeeds and persists axp_history, inventory, stock, and balance', async () => {
  const user = await createUser({ username: 'buyer', email: 'buyer@example.com', axp: 5000 });
  const itemId = await createShopItem({ name: 'Limited Theme', priceAXP: 400, stock: 3 });

  const response = await postWithAuth('/api/shop/buy', user.token, { itemId });

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.new_axp, 4600);

  const axpHistory = await getSingleValue('SELECT axp FROM axp_history WHERE user_id = ? ORDER BY date DESC LIMIT 1', [user.id]);
  assert.equal(axpHistory.axp, 4600);

  const inventory = await getSingleValue('SELECT user_id, item_id FROM user_inventory WHERE user_id = ? AND item_id = ?', [user.id, itemId]);
  assert.deepEqual(inventory, { user_id: user.id, item_id: itemId });

  const stock = await getSingleValue('SELECT stock FROM shop_items WHERE id = ?', [itemId]);
  assert.equal(stock.stock, 2);

  const refreshedUser = await getSingleValue('SELECT axp FROM users WHERE id = ?', [user.id]);
  assert.equal(refreshedUser.axp, 4600);
});

test('POST /api/shop/buy returns 400 when user has insufficient AXP without side effects', async () => {
  const user = await createUser({ username: 'poor', email: 'poor@example.com', axp: 50 });
  const itemId = await createShopItem({ name: 'Expensive Badge', priceAXP: 500, stock: 10 });

  const response = await postWithAuth('/api/shop/buy', user.token, { itemId });

  assert.equal(response.status, 400);
  assert.match(response.body.error, /Not enough AXP/);

  const inventory = await getSingleValue('SELECT id FROM user_inventory WHERE user_id = ?', [user.id]);
  assert.equal(inventory, undefined);

  const stock = await getSingleValue('SELECT stock FROM shop_items WHERE id = ?', [itemId]);
  assert.equal(stock.stock, 10);

  const refreshedUser = await getSingleValue('SELECT axp FROM users WHERE id = ?', [user.id]);
  assert.equal(refreshedUser.axp, 50);

  const axpHistory = await getSingleValue('SELECT id FROM axp_history WHERE user_id = ?', [user.id]);
  assert.equal(axpHistory, undefined);
});

test('POST /api/shop/buy returns 400 when stock is exhausted', async () => {
  const user = await createUser({ username: 'stock-zero', email: 'stock-zero@example.com', axp: 2000 });
  const itemId = await createShopItem({ name: 'Sold Out Crate', priceAXP: 200, stock: 0 });

  const response = await postWithAuth('/api/shop/buy', user.token, { itemId });

  assert.equal(response.status, 400);
  assert.equal(response.body.error, 'Item out of stock');

  const inventory = await getSingleValue('SELECT id FROM user_inventory WHERE user_id = ?', [user.id]);
  assert.equal(inventory, undefined);

  const refreshedUser = await getSingleValue('SELECT axp FROM users WHERE id = ?', [user.id]);
  assert.equal(refreshedUser.axp, 2000);
});

test('handles concurrent purchase attempts on the same item with stock=1', async () => {
  const userA = await createUser({ username: 'racer-a', email: 'racer-a@example.com', axp: 1500 });
  const userB = await createUser({ username: 'racer-b', email: 'racer-b@example.com', axp: 1500 });
  const itemId = await createShopItem({ name: 'Race Reward', priceAXP: 700, stock: 1 });

  const [resA, resB] = await Promise.all([
    postWithAuth('/api/shop/buy', userA.token, { itemId }),
    postWithAuth('/api/shop/buy', userB.token, { itemId })
  ]);

  const statuses = [resA.status, resB.status].sort((a, b) => a - b);
  assert.deepEqual(statuses, [200, 400]);

  const winner = resA.status === 200 ? userA : userB;
  const loser = winner.id === userA.id ? userB : userA;

  const winnerInventory = await getSingleValue('SELECT id FROM user_inventory WHERE user_id = ? AND item_id = ?', [winner.id, itemId]);
  const loserInventory = await getSingleValue('SELECT id FROM user_inventory WHERE user_id = ? AND item_id = ?', [loser.id, itemId]);
  assert.ok(winnerInventory);
  assert.equal(loserInventory, undefined);

  const item = await getSingleValue('SELECT stock FROM shop_items WHERE id = ?', [itemId]);
  assert.equal(item.stock, 0);

  const winnerUser = await getSingleValue('SELECT axp FROM users WHERE id = ?', [winner.id]);
  const loserUser = await getSingleValue('SELECT axp FROM users WHERE id = ?', [loser.id]);
  assert.equal(winnerUser.axp, 800);
  assert.equal(loserUser.axp, 1500);
});

test('uses rename-card flow in /api/user/use-item and consumes inventory item', async () => {
  const user = await createUser({ username: 'rename-old', email: 'rename-old@example.com', axp: 2000 });
  const itemId = await createShopItem({ name: 'Rename Card', priceAXP: 300, stock: -1 });

  const buyResponse = await postWithAuth('/api/shop/buy', user.token, { itemId });
  assert.equal(buyResponse.status, 200);

  const useResponse = await postWithAuth('/api/user/use-item', user.token, {
    itemId,
    extra: { newUsername: 'rename-new' }
  });

  assert.equal(useResponse.status, 200);
  assert.equal(useResponse.body.success, true);
  assert.equal(useResponse.body.user.username, 'rename-new');

  const dbUser = await getSingleValue('SELECT username, name_changes, axp FROM users WHERE id = ?', [user.id]);
  assert.equal(dbUser.username, 'rename-new');
  assert.equal(dbUser.name_changes, 1);
  assert.equal(dbUser.axp, 1700);

  const inventory = await getSingleValue('SELECT id FROM user_inventory WHERE user_id = ? AND item_id = ?', [user.id, itemId]);
  assert.equal(inventory, undefined);

  const activity = await getSingleValue('SELECT text FROM activity WHERE user_id = ? ORDER BY id DESC LIMIT 1', [user.id]);
  assert.match(activity.text, /Used Rename Card/);

  const axpHistory = await getSingleValue('SELECT axp FROM axp_history WHERE user_id = ?', [user.id]);
  assert.equal(axpHistory.axp, 1700);
});
