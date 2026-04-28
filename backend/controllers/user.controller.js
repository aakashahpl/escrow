import * as userService from "../services/user.service.js";

export const registerUser = async (req, res, next) => {
  try {
    const { walletAddress, username, email, role, bio } = req.body;
    if (!walletAddress) {
      return res.status(400).json({ error: "walletAddress is required" });
    }
    const result = await userService.registerUser({ walletAddress, username, email, role, bio });
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await userService.fetchUserById(Number(req.params.id));
    return res.json(user);
  } catch (err) {
    next(err);
  }
};

export const getUserByWallet = async (req, res, next) => {
  try {
    const user = await userService.fetchUserByWallet(req.params.walletAddress);
    return res.json(user);
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.fetchAllUsers();
    return res.json(users);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { username, email, role, bio } = req.body;
    const result = await userService.editUser(Number(req.params.id), { username, email, role, bio });
    return res.json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const result = await userService.removeUser(Number(req.params.id));
    return res.json(result);
  } catch (err) {
    next(err);
  }
};

export const updateUserRating = async (req, res, next) => {
  try {
    const { rating } = req.body;
    const result = await userService.setUserRating(Number(req.params.id), rating);
    return res.json(result);
  } catch (err) {
    next(err);
  }
};
