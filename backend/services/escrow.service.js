import { deployEscrow, fundMilestoneTx,approveMilestoneTx } from "./blockchain.service.js";
import {
  insertEscrowWithMilestones,
  getEscrowById,
  getMilestone,
  markMilestoneFunded,
  markMilestoneApprovedAndReleased,
} from "../repositories/escrow.repository.js";

import { ethers } from "ethers";

export const createEscrow = async ({ buyer, seller, milestones }) => {
  if (
    !buyer ||
    !seller ||
    !Array.isArray(milestones) ||
    milestones.length === 0
  ) {
    throw new Error("Invalid escrow payload");
  }

  const milestoneAmounts = milestones.map((m) =>
    ethers.parseEther(m.amount.toString()),
  );

  const { contractAddress } = await deployEscrow(
    buyer,
    seller,
    milestoneAmounts,
  );

  const totalAmount = milestoneAmounts
    .map((a) => BigInt(a))
    .reduce((a, b) => a + b, 0n)
    .toString();

  const escrowId = await insertEscrowWithMilestones({
    contractAddress,
    buyer,
    seller,
    totalAmount,
    milestones,
  });

  return {
    success: true,
    escrowId,
    contractAddress,
  };
};

export const fundMilestone = async ({ escrowId, milestoneIndex }) => {
  const escrow = await getEscrowById(escrowId);
  if (!escrow) {
    throw new Error("Escrow not found");
  }

  const milestone = await getMilestone(escrowId, milestoneIndex);
  if (!milestone) {
    throw new Error("Milestone not found");
  }

  const contractAddress = escrow.contract_address;
  const amount = milestone.amount;

  let txHash;

  try {
    txHash = await fundMilestoneTx(contractAddress, milestoneIndex, amount);
  } catch (err) {
    if (err.reason) {
      throw new Error(err.reason);
    }

    if (err.shortMessage) {
      throw new Error(err.shortMessage);
    }

    throw err;
  }

  await markMilestoneFunded(escrowId, milestoneIndex);

  return {
    success: true,
    contractAddress,
    milestoneIndex,
    txHash,
  };
};

export const approveMilestone = async ({ escrowId, milestoneIndex }) => {
  const escrow = await getEscrowById(escrowId);

  if (!escrow) {
    throw new Error("Escrow not found");
  }

  const milestone = await getMilestone(escrowId, milestoneIndex);

  if (!milestone) {
    throw new Error("Milestone not found");
  }

  const contractAddress = escrow.contract_address;

  let txHash;

  try {
    txHash = await approveMilestoneTx(contractAddress, milestoneIndex);
  } catch (err) {
    console.error("Blockchain error:", err);

    if (err.shortMessage) {
      const msg = err.shortMessage
        .replace('execution reverted: "', "")
        .replace('"', "");

      throw new Error(msg);
    }

    if (err.reason) {
      throw new Error(err.reason);
    }

    if (err.revert && err.revert.args && err.revert.args.length > 0) {
      throw new Error(err.revert.args[0]);
    }

    throw err;
  }

  await markMilestoneApprovedAndReleased(escrowId, milestoneIndex);

  return {
    success: true,
    contractAddress,
    milestoneIndex,
    txHash,
  };
};