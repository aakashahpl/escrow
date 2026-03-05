import express from "express";
import escrowRoutes from "./escrow.routes.js";

const router = express.Router();

router.use("/escrow", escrowRoutes);

export default router;
