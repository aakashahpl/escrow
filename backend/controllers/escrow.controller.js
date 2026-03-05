import * as escrowService from "../services/escrow.service.js";

export const createEscrow = async (req, res, next) => {
  try {
    const { buyer, seller, milestones } = req.body;

    if (!buyer || !seller || !milestones?.length) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const result = await escrowService.createEscrow({
      buyer,
      seller,
      milestones,
    });

    return res.json(result);
  } catch (err) {
    next(err);
  }
};

export const fundMilestoneController = async (req, res, next) => {
  try {
    const { escrowId, milestoneIndex } = req.body;

    const result = await escrowService.fundMilestone({
      escrowId,
      milestoneIndex,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};



export const approveMilestoneController = async (req, res, next) => {
  try {
    const { escrowId, milestoneIndex } = req.body;

    const result = await escrowService.approveMilestone({
      escrowId,
      milestoneIndex,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};