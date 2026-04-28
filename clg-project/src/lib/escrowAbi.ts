// Minimal ABI for the Escrow contract functions used in the UI.
export const escrowAbi = [
  {
    inputs: [],
    name: "openDispute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "voteDispute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "refundAfterTimeout",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

