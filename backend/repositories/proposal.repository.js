import { pool } from "../config/db.js";

export const createProposal = async ({ jobId, freelancerId, coverLetter, bidAmount }) => {
  const result = await pool.query(
    `INSERT INTO proposals (job_id, freelancer_id, cover_letter, bid_amount)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [jobId, freelancerId, coverLetter, bidAmount],
  );
  return result.rows[0];
};

export const getProposalsByJob = async (jobId) => {
  const result = await pool.query(
    `SELECT p.*,
            u.username   AS freelancer_name,
            u.wallet_address AS freelancer_wallet
     FROM proposals p
     JOIN users u ON u.id = p.freelancer_id
     WHERE p.job_id = $1
     ORDER BY p.created_at DESC`,
    [jobId],
  );
  return result.rows;
};

export const getProposalsByFreelancer = async (freelancerId) => {
  const result = await pool.query(
    `SELECT p.*,
            j.title AS job_title
     FROM proposals p
     JOIN jobs j ON j.id = p.job_id
     WHERE p.freelancer_id = $1
     ORDER BY p.created_at DESC`,
    [freelancerId],
  );
  return result.rows;
};

export const getProposalById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM proposals WHERE id = $1`,
    [id],
  );
  return result.rows[0];
};

export const getProposalByJobAndFreelancer = async (jobId, freelancerId) => {
  const result = await pool.query(
    `SELECT * FROM proposals
     WHERE job_id = $1 AND freelancer_id = $2`,
    [jobId, freelancerId],
  );
  return result.rows[0];
};

export const updateProposalStatus = async (id, status) => {
  const result = await pool.query(
    `UPDATE proposals
     SET status     = $1,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *`,
    [status, id],
  );
  return result.rows[0];
};

export const deleteProposal = async (id) => {
  await pool.query(`DELETE FROM proposals WHERE id = $1`, [id]);
};
