import {
  createUser,
  getUserById,
  getUserByWallet,
  getAllUsers,
  updateUser,
  updateUserRating,
  deleteUser,
} from "../repositories/user.repository.js";

const VALID_ROLES = ["BUYER", "SELLER", "BOTH"];

export const registerUser = async ({ walletAddress, username, email, role, bio }) => {
  if (!walletAddress) {
    throw new Error("walletAddress is required");
  }

  if (role && !VALID_ROLES.includes(role)) {
    throw new Error(`role must be one of: ${VALID_ROLES.join(", ")}`);
  }

  const existing = await getUserByWallet(walletAddress);
  if (existing) {
    throw new Error("A user with this wallet address already exists");
  }

  const user = await createUser({ walletAddress, username, email, role, bio });
  return { success: true, user };
};

export const fetchUserById = async (id) => {
  const user = await getUserById(id);
  if (!user) throw new Error("User not found");
  return user;
};

export const fetchUserByWallet = async (walletAddress) => {
  const user = await getUserByWallet(walletAddress);
  if (!user) throw new Error("User not found");
  return user;
};

export const fetchAllUsers = async () => {
  return getAllUsers();
};

export const editUser = async (id, fields) => {
  if (fields.role && !VALID_ROLES.includes(fields.role)) {
    throw new Error(`role must be one of: ${VALID_ROLES.join(", ")}`);
  }

  const user = await getUserById(id);
  if (!user) throw new Error("User not found");

  const updated = await updateUser(id, fields);
  return { success: true, user: updated };
};

export const setUserRating = async (id, rating) => {
  const user = await getUserById(id);
  if (!user) throw new Error("User not found");

  const num = Number(rating);
  if (!Number.isFinite(num) || num < 0 || num > 5) {
    throw new Error("rating must be a number between 0 and 5");
  }

  const updated = await updateUserRating(id, num);
  return { success: true, user: updated };
};

export const removeUser = async (id) => {
  const user = await getUserById(id);
  if (!user) throw new Error("User not found");

  await deleteUser(id);
  return { success: true };
};
