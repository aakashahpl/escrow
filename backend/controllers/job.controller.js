import * as jobService from "../services/job.service.js";

export const createJob = async (req, res, next) => {
  try {
    const { postedBy, title, description, budget } = req.body;
    if (!postedBy || !title || !description || !budget) {
      return res.status(400).json({ error: "postedBy, title, description, and budget are required" });
    }
    const result = await jobService.postJob({ postedBy, title, description, budget });
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const job = await jobService.fetchJobById(Number(req.params.id));
    return res.json(job);
  } catch (err) {
    next(err);
  }
};

export const getAllJobs = async (req, res, next) => {
  try {
    const { status } = req.query;
    const jobs = await jobService.fetchAllJobs({ status });
    return res.json(jobs);
  } catch (err) {
    next(err);
  }
};

export const getJobsByUser = async (req, res, next) => {
  try {
    const jobs = await jobService.fetchJobsByUser(Number(req.params.userId));
    return res.json(jobs);
  } catch (err) {
    next(err);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const { title, description, budget, status } = req.body;
    const result = await jobService.editJob(Number(req.params.id), { title, description, budget, status });
    return res.json(result);
  } catch (err) {
    next(err);
  }
};

export const linkEscrow = async (req, res, next) => {
  try {
    const { escrowId } = req.body;
    if (!escrowId) {
      return res.status(400).json({ error: "escrowId is required" });
    }
    const result = await jobService.linkEscrowToJob({ jobId: Number(req.params.id), escrowId });
    return res.json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const result = await jobService.removeJob(Number(req.params.id));
    return res.json(result);
  } catch (err) {
    next(err);
  }
};
