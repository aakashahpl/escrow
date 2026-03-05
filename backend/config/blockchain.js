import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

export const wallet = new ethers.Wallet(
  process.env.DEPLOYER_PRIVATE_KEY,
  provider,
);
