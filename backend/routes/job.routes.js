import express from "express";
import {
  createJob,
  getJobById,
  getAllJobs,
  getJobsByUser,
  updateJob,
  linkEscrow,
  deleteJob,
} from "../controllers/job.controller.js";

const router = express.Router();

// POST   /api/jobs                  — post a new job
router.post("/", createJob);

// GET    /api/jobs                  — list all jobs (optional ?status= filter)
router.get("/", getAllJobs);

// GET    /api/jobs/user/:userId     — get all jobs posted by a user
router.get("/user/:userId", getJobsByUser);

// GET    /api/jobs/:id              — get single job by id
router.get("/:id", getJobById);

// PATCH  /api/jobs/:id              — update job details / status
router.patch("/:id", updateJob);

// PATCH  /api/jobs/:id/escrow       — attach an escrow to a job (hire a freelancer)
router.patch("/:id/escrow", linkEscrow);

// DELETE /api/jobs/:id              — delete job
router.delete("/:id", deleteJob);

export default router;
