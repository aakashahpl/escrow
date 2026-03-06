import {
  createProposal,
  getProposalById,
  getProposalsByJob,
  getProposalsByFreelancer,
  getProposalByJobAndFreelancer,
  updateProposalStatus,
  deleteProposal,
} from "../repositories/proposal.repository.js";
import { getJobById, attachEscrowToJob } from "../repositories/job.repository.js";
import { getUserById } from "../repositories/user.repository.js";
import { createEscrow } from "./escrow.service.js";

const VALID_STATUSES = ["PENDING", "ACCEPTED", "REJECTED"];

export const submitProposal = async ({ jobId, freelancerId, coverLetter, bidAmount }) => {
  if (!jobId || !freelancerId || !coverLetter || !bidAmount) {
    throw new Error("jobId, freelancerId, coverLetter, and bidAmount are required");
  }

  const job = await getJobById(jobId);
  if (!job) throw new Error("Job not found");
  if (job.status !== "OPEN") throw new Error("Job is not open for proposals");

  const freelancer = await getUserById(freelancerId);
  if (!freelancer) throw new Error("Freelancer not found");

  const existing = await getProposalByJobAndFreelancer(jobId, freelancerId);
  if (existing) throw new Error("You have already submitted a proposal for this job");

  const proposal = await createProposal({ jobId, freelancerId, coverLetter, bidAmount });
  return { success: true, proposal };
};

export const fetchProposalsByJob = async (jobId) => {
  const job = await getJobById(jobId);
  if (!job) throw new Error("Job not found");
  return getProposalsByJob(jobId);
};

export const fetchProposalsByFreelancer = async (freelancerId) => {
  const freelancer = await getUserById(freelancerId);
  if (!freelancer) throw new Error("Freelancer not found");
  return getProposalsByFreelancer(freelancerId);
};

export const hasFreelancerApplied = async (jobId, freelancerId) => {
  const proposal = await getProposalByJobAndFreelancer(jobId, freelancerId);
  return { applied: !!proposal, proposal: proposal ?? null };
};

export const changeProposalStatus = async (id, status) => {
  if (!VALID_STATUSES.includes(status)) {
    throw new Error(`status must be one of: ${VALID_STATUSES.join(", ")}`);
  }
  const updated = await updateProposalStatus(id, status);
  if (!updated) throw new Error("Proposal not found");
  return { success: true, proposal: updated };
};

// Accept a proposal: deploy a single-milestone escrow contract, link it to the
// job, mark this proposal ACCEPTED, and reject all other pending proposals.
export const acceptProposal = async (proposalId) => {
  const proposal = await getProposalById(proposalId);
  if (!proposal) throw new Error("Proposal not found");
  if (proposal.status !== "PENDING") throw new Error("Proposal is no longer pending");

  const job = await getJobById(proposal.job_id);
  if (!job) throw new Error("Job not found");
  if (job.status !== "OPEN") throw new Error("Job is no longer open");

  const freelancer = await getUserById(proposal.freelancer_id);
  if (!freelancer) throw new Error("Freelancer not found");

  // buyer wallet comes from the job's poster
  const buyerWallet = job.poster_wallet;
  const sellerWallet = freelancer.wallet_address;

  // Deploy a single-milestone escrow using the proposal's bid amount
  const { escrowId, contractAddress } = await createEscrow({
    buyer: buyerWallet,
    seller: sellerWallet,
    milestones: [{ amount: proposal.bid_amount.toString() }],
  });

  // Link the escrow to the job (also sets job status → IN_PROGRESS)
  await attachEscrowToJob(proposal.job_id, escrowId);

  // Mark this proposal ACCEPTED
  const accepted = await updateProposalStatus(proposalId, "ACCEPTED");

  // Reject all other pending proposals for the same job
  const others = await getProposalsByJob(proposal.job_id);
  for (const other of others) {
    if (other.id !== proposalId && other.status === "PENDING") {
      await updateProposalStatus(other.id, "REJECTED");
    }
  }

  return {
    success: true,
    proposal: accepted,
    escrowId,
    contractAddress,
  };
};

export const removeProposal = async (id) => {
  await deleteProposal(id);
  return { success: true };
};
