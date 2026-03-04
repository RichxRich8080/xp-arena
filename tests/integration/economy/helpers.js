const jwt = require('jsonwebtoken');
const { pool } = require('../../../db');

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

async function resetEconomyState() {
  const conn = await pool.getConnection();
  try {
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');
    await conn.query('TRUNCATE TABLE axp_history');
    await conn.query('TRUNCATE TABLE activity');
    await conn.query('TRUNCATE TABLE user_inventory');
    await conn.query('TRUNCATE TABLE shop_items');
    await conn.query('TRUNCATE TABLE users');
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');
  } finally {
    conn.release();
  }
}

async function createUser({ username, email, axp = 0, nameChanges = 0 }) {
  const [result] = await pool.execute(
    'INSERT INTO users (username, email, password_hash, axp, name_changes) VALUES (?, ?, ?, ?, ?)',
    [username, email, 'hashed-password', axp, nameChanges]
  );

  return {
    id: result.insertId,
    username,
    token: jwt.sign({ id: result.insertId, username }, JWT_SECRET, { expiresIn: '1h' })
  };
}

async function createShopItem({
  name,
  priceAXP,
  stock,
  type = 'cosmetic',
  active = 1
}) {
  const [result] = await pool.execute(
    'INSERT INTO shop_items (name, description, price_axp, type, icon, rarity, stock, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [name, `${name} description`, priceAXP, type, 'fas fa-box', 'rare', stock, active]
  );

  return result.insertId;
}

async function getSingleValue(sql, params) {
  const [rows] = await pool.execute(sql, params);
  return rows[0];
}

module.exports = {
  resetEconomyState,
  createUser,
  createShopItem,
  getSingleValue,
  pool
};
