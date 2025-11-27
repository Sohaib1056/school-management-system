import { query } from '../config/db.js';

export const findUserByEmail = async (email) => {
  const { rows } = await query('SELECT id, email, password_hash, role, name FROM users WHERE email = $1', [email]);
  return rows[0] || null;
};

export const findUserById = async (id) => {
  const { rows } = await query('SELECT id, email, role, name FROM users WHERE id = $1', [id]);
  return rows[0] || null;
};

export const createUser = async ({ email, passwordHash, role = 'student', name }) => {
  const { rows } = await query(
    'INSERT INTO users (email, password_hash, role, name) VALUES ($1,$2,$3,$4) RETURNING id, email, role, name',
    [email, passwordHash, role, name || email]
  );
  return rows[0];
};

export const listUsers = async () => {
  const { rows } = await query('SELECT id, email, role, name FROM users ORDER BY id ASC');
  return rows;
};
