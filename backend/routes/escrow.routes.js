import express from "express";
import { createEscrow,fundMilestoneController,approveMilestoneController } from "../controllers/escrow.controller.js";


const router = express.Router();

router.post("/create", createEscrow);
router.post("/fund", fundMilestoneController);
router.post("/approve", approveMilestoneController);

export default router;
