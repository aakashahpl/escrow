import express from "express";
import {
  openDispute,
  listDisputes,
  voteDispute,
  refundAfterTimeout,
} from "../controllers/dispute.controller.js";

const router = express.Router();

// POST /api/disputes/open
router.post("/open", openDispute);

// GET /api/disputes?requesterWalletAddress=0x...
router.get("/", listDisputes);

// POST /api/disputes/:id/vote
router.post("/:id/vote", voteDispute);

// POST /api/disputes/:id/refund-timeout
router.post("/:id/refund-timeout", refundAfterTimeout);

export default router;

