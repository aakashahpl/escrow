import { pool } from "../config/db.js";

export const getDisputeByEscrowId = async (escrowId) => {
  const result = await pool.query(
    `SELECT *
     FROM disputes
     WHERE escrow_id = $1`,
    [escrowId],
  );
  return result.rows[0];
};

export const getDisputeById = async (id) => {
  const result = await pool.query(`SELECT * FROM disputes WHERE id = $1`, [id]);
  return result.rows[0];
};

export const createDispute = async ({ escrowId, openedByUserId }) => {
  const result = await pool.query(
    `INSERT INTO disputes (escrow_id, opened_by_user_id, status)
     VALUES ($1, $2, 'OPEN')
     RETURNING *`,
    [escrowId, openedByUserId ?? null],
  );
  return result.rows[0];
};

export const listOpenDisputes = async () => {
  const result = await pool.query(
    `SELECT d.*,
            e.contract_address,
            e.buyer_address,
            e.seller_address,
            e.total_amount,
            (SELECT COUNT(*)::int FROM dispute_votes dv WHERE dv.dispute_id = d.id) AS vote_count
     FROM disputes d
     JOIN escrows e ON e.id = d.escrow_id
     WHERE d.status = 'OPEN'
     ORDER BY d.opened_at DESC`,
  );
  return result.rows;
};

export const addDisputeVote = async ({ disputeId, voterUserId }) => {
  const result = await pool.query(
    `INSERT INTO dispute_votes (dispute_id, voter_user_id)
     VALUES ($1, $2)
     RETURNING *`,
    [disputeId, voterUserId],
  );
  return result.rows[0];
};

export const countDisputeVotes = async (disputeId) => {
  const result = await pool.query(
    `SELECT COUNT(*)::int AS count
     FROM dispute_votes
     WHERE dispute_id = $1`,
    [disputeId],
  );
  return result.rows[0]?.count ?? 0;
};

export const resolveDispute = async ({ disputeId, status, txHash }) => {
  const result = await pool.query(
    `UPDATE disputes
     SET status = $2,
         resolved_at = CURRENT_TIMESTAMP,
         resolved_tx_hash = $3
     WHERE id = $1
     RETURNING *`,
    [disputeId, status, txHash ?? null],
  );
  return result.rows[0];
};

