import express from "express";
import {
  submitProposal,
  getProposalsByJob,
  getProposalsByFreelancer,
  checkApplied,
  updateStatus,
  acceptProposal,
  deleteProposal,
} from "../controllers/proposal.controller.js";

const router = express.Router();

// POST   /api/proposals                         — submit a proposal
router.post("/", submitProposal);

// GET    /api/proposals/check?jobId=&freelancerId= — has freelancer already applied?
router.get("/check", checkApplied);

// GET    /api/proposals/job/:jobId              — all proposals for a job (client view)
router.get("/job/:jobId", getProposalsByJob);

// GET    /api/proposals/freelancer/:freelancerId — all proposals by a freelancer
router.get("/freelancer/:freelancerId", getProposalsByFreelancer);

// POST   /api/proposals/:id/accept             — accept proposal, deploy escrow, start job
router.post("/:id/accept", acceptProposal);

// PATCH  /api/proposals/:id/status              — manually update status
router.patch("/:id/status", updateStatus);

// DELETE /api/proposals/:id                     — withdraw a proposal
router.delete("/:id", deleteProposal);

export default router;
