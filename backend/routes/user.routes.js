import express from "express";
import {
  registerUser,
  getUserById,
  getUserByWallet,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

const router = express.Router();

// POST   /api/users                          — register a new user
router.post("/", registerUser);

// GET    /api/users                          — list all users
router.get("/", getAllUsers);

// GET    /api/users/wallet/:walletAddress    — get user by wallet address
router.get("/wallet/:walletAddress", getUserByWallet);

// GET    /api/users/:id                      — get user by DB id
router.get("/:id", getUserById);

// PATCH  /api/users/:id                      — update user profile
router.patch("/:id", updateUser);

// DELETE /api/users/:id                      — delete user
router.delete("/:id", deleteUser);

export default router;
