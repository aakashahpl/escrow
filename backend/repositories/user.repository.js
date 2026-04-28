import { pool } from "../config/db.js";

export const createUser = async ({ walletAddress, username, email, role, bio }) => {
  const result = await pool.query(
    `INSERT INTO users (wallet_address, username, email, role, bio)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [walletAddress, username ?? null, email ?? null, role ?? "BUYER", bio ?? null],
  );
  return result.rows[0];
};

export const getUserById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE id = $1`,
    [id],
  );
  return result.rows[0];
};

export const getUserByWallet = async (walletAddress) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE wallet_address = $1`,
    [walletAddress],
  );
  return result.rows[0];
};

export const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT * FROM users ORDER BY created_at DESC`,
  );
  return result.rows;
};

export const updateUser = async (id, { username, email, role, bio }) => {
  const result = await pool.query(
    `UPDATE users
     SET username   = COALESCE($1, username),
         email      = COALESCE($2, email),
         role       = COALESCE($3, role),
         bio        = COALESCE($4, bio),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $5
     RETURNING *`,
    [username ?? null, email ?? null, role ?? null, bio ?? null, id],
  );
  return result.rows[0];
};

export const updateUserRating = async (id, rating) => {
  const result = await pool.query(
    `UPDATE users
     SET rating = $1,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *`,
    [rating, id],
  );
  return result.rows[0];
};

export const deleteUser = async (id) => {
  await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
};
