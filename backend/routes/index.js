import express from "express";
import escrowRoutes from "./escrow.routes.js";
import userRoutes from "./user.routes.js";
import jobRoutes from "./job.routes.js";
import proposalRoutes from "./proposal.routes.js";

const router = express.Router();

router.use("/escrow", escrowRoutes);
router.use("/users", userRoutes);
router.use("/jobs", jobRoutes);
router.use("/proposals", proposalRoutes);

export default router;
