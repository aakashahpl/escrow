import * as proposalService from "../services/proposal.service.js";

// POST /api/proposals
export const submitProposal = async (req, res, next) => {
  try {
    const { jobId, freelancerId, coverLetter, bidAmount } = req.body;
    if (!jobId || !freelancerId || !coverLetter || !bidAmount) {
      return res.status(400).json({ error: "jobId, freelancerId, coverLetter, and bidAmount are required" });
    }
    const result = await proposalService.submitProposal({ jobId, freelancerId, coverLetter, bidAmount });
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

// GET /api/proposals/job/:jobId
export const getProposalsByJob = async (req, res, next) => {
  try {
    const proposals = await proposalService.fetchProposalsByJob(Number(req.params.jobId));
    return res.json(proposals);
  } catch (err) {
    next(err);
  }
};

// GET /api/proposals/freelancer/:freelancerId
export const getProposalsByFreelancer = async (req, res, next) => {
  try {
    const proposals = await proposalService.fetchProposalsByFreelancer(Number(req.params.freelancerId));
    return res.json(proposals);
  } catch (err) {
    next(err);
  }
};

// GET /api/proposals/check?jobId=&freelancerId=
export const checkApplied = async (req, res, next) => {
  try {
    const { jobId, freelancerId } = req.query;
    if (!jobId || !freelancerId) {
      return res.status(400).json({ error: "jobId and freelancerId query params are required" });
    }
    const result = await proposalService.hasFreelancerApplied(Number(jobId), Number(freelancerId));
    return res.json(result);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/proposals/:id/status
export const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: "status is required" });
    const result = await proposalService.changeProposalStatus(Number(req.params.id), status);
    return res.json(result);
  } catch (err) {
    next(err);
  }
};

// POST /api/proposals/:id/accept
export const acceptProposal = async (req, res, next) => {
  try {
    const result = await proposalService.acceptProposal(Number(req.params.id));
    return res.json(result);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/proposals/:id
export const deleteProposal = async (req, res, next) => {
  try {
    const result = await proposalService.removeProposal(Number(req.params.id));
    return res.json(result);
  } catch (err) {
    next(err);
  }
};
