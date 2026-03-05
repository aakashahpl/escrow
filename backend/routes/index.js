import express from "express";
import escrowRoutes from "./escrow.routes.js";
import userRoutes from "./user.routes.js";
import jobRoutes from "./job.routes.js";

const router = express.Router();

router.use("/escrow", escrowRoutes);
router.use("/users", userRoutes);
router.use("/jobs", jobRoutes);

export default router;
