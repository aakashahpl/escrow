import { fetchUserByWallet } from "./user.service.js";
import {
  createDispute,
  getDisputeByEscrowId,
  getDisputeById,
  listOpenDisputes,
  addDisputeVote,
  countDisputeVotes,
  resolveDispute,
} from "../repositories/dispute.repository.js";
import {
  getEscrowPartiesById,
  hasAnyFundedMilestone,
} from "../repositories/escrow.repository.js";

export const openSellerDispute = async ({
  escrowId,
  requesterWalletAddress,
  txHash,
}) => {
  if (!escrowId || !requesterWalletAddress) {
    throw new Error("escrowId and requesterWalletAddress are required");
  }

  const escrow = await getEscrowPartiesById(Number(escrowId));
  if (!escrow) throw new Error("Escrow not found");

  if (
    escrow.seller_address.toLowerCase() !== requesterWalletAddress.toLowerCase()
  ) {
    throw new Error("Only escrow seller can open dispute");
  }

  const anyFunded = await hasAnyFundedMilestone(Number(escrowId));
  if (!anyFunded) {
    throw new Error("Seller cannot dispute before any milestone is funded");
  }

  const existing = await getDisputeByEscrowId(Number(escrowId));
  if (existing && existing.status === "OPEN") {
    return { success: true, dispute: existing };
  }

  const openedByUser = await fetchUserByWallet(requesterWalletAddress);
  const dispute = await createDispute({
    escrowId: Number(escrowId),
    openedByUserId: openedByUser?.id,
  });
  return { success: true, dispute, txHash: txHash ?? null };
};

export const listDisputesForEligibleUser = async ({
  requesterWalletAddress,
}) => {
  if (!requesterWalletAddress) {
    throw new Error("requesterWalletAddress is required");
  }

  const user = await fetchUserByWallet(requesterWalletAddress);
  if (!user) throw new Error("User not found");

  const disputes = await listOpenDisputes();
  return { success: true, disputes };
};

export const voteOnDispute = async ({
  disputeId,
  requesterWalletAddress,
  txHash,
}) => {
  if (!disputeId || !requesterWalletAddress) {
    throw new Error("disputeId and requesterWalletAddress are required");
  }

  const user = await fetchUserByWallet(requesterWalletAddress);
  if (!user) throw new Error("User not found");

  const dispute = await getDisputeById(Number(disputeId));
  if (!dispute) throw new Error("Dispute not found");
  if (dispute.status !== "OPEN") throw new Error("Dispute is not open");

  const escrow = await getEscrowPartiesById(Number(dispute.escrow_id));
  if (!escrow) throw new Error("Escrow not found");

  const req = requesterWalletAddress.toLowerCase();
  if (
    escrow.buyer_address.toLowerCase() === req ||
    escrow.seller_address.toLowerCase() === req
  ) {
    throw new Error("Buyer or seller cannot vote on dispute");
  }

  await addDisputeVote({ disputeId: dispute.id, voterUserId: user.id });
  const votes = await countDisputeVotes(dispute.id);

  let updatedDispute = dispute;
  if (votes >= 2) {
    updatedDispute = await resolveDispute({
      disputeId: dispute.id,
      status: "RESOLVED_TO_SELLER",
      txHash,
    });
  }

  return { success: true, dispute: updatedDispute, votes, txHash: txHash ?? null };
};

export const refundDisputeAfterTimeout = async ({ disputeId, txHash }) => {
  if (!disputeId) throw new Error("disputeId is required");

  const dispute = await getDisputeById(Number(disputeId));
  if (!dispute) throw new Error("Dispute not found");
  if (dispute.status !== "OPEN") throw new Error("Dispute is not open");

  const escrow = await getEscrowPartiesById(Number(dispute.escrow_id));
  if (!escrow) throw new Error("Escrow not found");

  const updated = await resolveDispute({
    disputeId: dispute.id,
    status: "REFUNDED_TO_BUYER",
    txHash,
  });

  return { success: true, dispute: updated, txHash: txHash ?? null };
};

