import * as disputeService from "../services/dispute.service.js";

export const openDispute = async (req, res, next) => {
  try {
    const { escrowId, requesterWalletAddress, txHash } = req.body;
    const result = await disputeService.openSellerDispute({
      escrowId,
      requesterWalletAddress,
      txHash,
    });
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const listDisputes = async (req, res, next) => {
  try {
    const requesterWalletAddress =
      req.query.requesterWalletAddress ?? req.body?.requesterWalletAddress;

    const result = await disputeService.listDisputesForEligibleUser({
      requesterWalletAddress,
    });
    return res.json(result);
  } catch (err) {
    next(err);
  }
};

export const voteDispute = async (req, res, next) => {
  try {
    const { requesterWalletAddress, txHash } = req.body;
    const disputeId = Number(req.params.id);
    const result = await disputeService.voteOnDispute({
      disputeId,
      requesterWalletAddress,
      txHash,
    });
    return res.json(result);
  } catch (err) {
    next(err);
  }
};

export const refundAfterTimeout = async (req, res, next) => {
  try {
    const disputeId = Number(req.params.id);
    const { txHash } = req.body ?? {};
    const result = await disputeService.refundDisputeAfterTimeout({ disputeId, txHash });
    return res.json(result);
  } catch (err) {
    next(err);
  }
};

