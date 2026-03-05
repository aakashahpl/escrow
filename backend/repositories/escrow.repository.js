import { pool } from "../config/db.js";

export const insertEscrowWithMilestones = async ({
  contractAddress,
  buyer,
  seller,
  totalAmount,
  milestones,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Insert escrow
    const escrowResult = await client.query(
      `
      INSERT INTO escrows
      (contract_address, buyer_address, seller_address, total_amount)
      VALUES ($1, $2, $3, $4)
      RETURNING id
      `,
      [contractAddress, buyer, seller, totalAmount],
    );

    const escrowId = escrowResult.rows[0].id;

    // Insert milestones
    for (let i = 0; i < milestones.length; i++) {
      const milestone = milestones[i];

      await client.query(
        `INSERT INTO milestones (
          escrow_id,
          milestone_index,
          amount,
          funded,
          approved,
          released
      )
      VALUES ($1,$2,$3,false,false,false)`,
        [escrowId, i, milestone.amount],
      );
    }

    await client.query("COMMIT");

    return escrowId;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const getEscrowById = async (escrowId) => {
  const result = await pool.query(
    `SELECT contract_address
     FROM escrows
     WHERE id = $1`,
    [escrowId],
  );

  return result.rows[0];
};

export const getMilestone = async (escrowId, milestoneIndex) => {
  const result = await pool.query(
    `SELECT amount
     FROM milestones
     WHERE escrow_id = $1
     AND milestone_index = $2`,
    [escrowId, milestoneIndex],
  );

  return result.rows[0];
};

export const markMilestoneFunded = async (escrowId, milestoneIndex) => {
  await pool.query(
    `UPDATE milestones
     SET funded = TRUE
     WHERE escrow_id = $1
     AND milestone_index = $2`,
    [escrowId, milestoneIndex],
  );
};

export const markMilestoneApprovedAndReleased = async (
  escrowId,
  milestoneIndex,
) => {
  await pool.query(
    `UPDATE milestones
     SET approved = TRUE,
         released = TRUE
     WHERE escrow_id = $1
     AND milestone_index = $2`,
    [escrowId, milestoneIndex],
  );
};