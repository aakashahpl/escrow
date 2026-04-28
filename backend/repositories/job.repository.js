import { pool } from "../config/db.js";

export const createJob = async ({ postedBy, title, description, budget }) => {
  const result = await pool.query(
    `INSERT INTO jobs (posted_by, title, description, budget)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [postedBy, title, description, budget],
  );
  return result.rows[0];
};

export const getJobById = async (id) => {
  const result = await pool.query(
    `SELECT j.*, u.wallet_address AS poster_wallet, u.username AS poster_username
     FROM jobs j
     JOIN users u ON u.id = j.posted_by
     WHERE j.id = $1`,
    [id],
  );
  return result.rows[0];
};

export const getAllJobs = async ({ status } = {}) => {
  const conditions = [];
  const values = [];

  if (status) {
    conditions.push(`j.status = $${values.length + 1}`);
    values.push(status);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const result = await pool.query(
    `SELECT j.*, u.wallet_address AS poster_wallet, u.username AS poster_username
     FROM jobs j
     JOIN users u ON u.id = j.posted_by
     ${where}
     ORDER BY j.created_at DESC`,
    values,
  );
  return result.rows;
};

export const getJobsByUser = async (userId) => {
  const result = await pool.query(
    `SELECT j.*, u.wallet_address AS poster_wallet, u.username AS poster_username
     FROM jobs j
     JOIN users u ON u.id = j.posted_by
     WHERE j.posted_by = $1
     ORDER BY j.created_at DESC`,
    [userId],
  );
  return result.rows;
};

export const updateJob = async (id, { title, description, budget, status }) => {
  const result = await pool.query(
    `UPDATE jobs
     SET title       = COALESCE($1, title),
         description = COALESCE($2, description),
         budget      = COALESCE($3, budget),
         status      = COALESCE($4, status),
         updated_at  = CURRENT_TIMESTAMP
     WHERE id = $5
     RETURNING *`,
    [title ?? null, description ?? null, budget ?? null, status ?? null, id],
  );
  return result.rows[0];
};

export const attachEscrowToJob = async (jobId, escrowId) => {
  const result = await pool.query(
    `UPDATE jobs
     SET escrow_id  = $1,
         status     = 'IN_PROGRESS',
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *`,
    [escrowId, jobId],
  );
  return result.rows[0];
};

export const deleteJob = async (id) => {
  await pool.query(`DELETE FROM jobs WHERE id = $1`, [id]);
};
