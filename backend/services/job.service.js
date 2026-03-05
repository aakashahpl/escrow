import {
  createJob,
  getJobById,
  getAllJobs,
  getJobsByUser,
  updateJob,
  attachEscrowToJob,
  deleteJob,
} from "../repositories/job.repository.js";
import { getUserById } from "../repositories/user.repository.js";
import { getEscrowById } from "../repositories/escrow.repository.js";

const VALID_STATUSES = ["OPEN", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

export const postJob = async ({ postedBy, title, description, budget }) => {
  if (!postedBy || !title || !description || !budget) {
    throw new Error("postedBy, title, description, and budget are required");
  }

  const user = await getUserById(postedBy);
  if (!user) throw new Error("Poster user not found");

  const job = await createJob({ postedBy, title, description, budget });
  return { success: true, job };
};

export const fetchJobById = async (id) => {
  const job = await getJobById(id);
  if (!job) throw new Error("Job not found");
  return job;
};

export const fetchAllJobs = async ({ status } = {}) => {
  if (status && !VALID_STATUSES.includes(status)) {
    throw new Error(`status must be one of: ${VALID_STATUSES.join(", ")}`);
  }
  return getAllJobs({ status });
};

export const fetchJobsByUser = async (userId) => {
  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");
  return getJobsByUser(userId);
};

export const editJob = async (id, fields) => {
  if (fields.status && !VALID_STATUSES.includes(fields.status)) {
    throw new Error(`status must be one of: ${VALID_STATUSES.join(", ")}`);
  }

  const job = await getJobById(id);
  if (!job) throw new Error("Job not found");

  const updated = await updateJob(id, fields);
  return { success: true, job: updated };
};

export const linkEscrowToJob = async ({ jobId, escrowId }) => {
  if (!jobId || !escrowId) {
    throw new Error("jobId and escrowId are required");
  }

  const job = await getJobById(jobId);
  if (!job) throw new Error("Job not found");

  const escrow = await getEscrowById(escrowId);
  if (!escrow) throw new Error("Escrow not found");

  const updated = await attachEscrowToJob(jobId, escrowId);
  return { success: true, job: updated };
};

export const removeJob = async (id) => {
  const job = await getJobById(id);
  if (!job) throw new Error("Job not found");

  await deleteJob(id);
  return { success: true };
};
