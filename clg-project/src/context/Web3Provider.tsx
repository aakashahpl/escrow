"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, sepolia, hardhat } from 'wagmi/chains';
import { injected, metaMask } from 'wagmi/connectors';

// Wagmi config — supports MetaMask (and any injected wallet) on mainnet,
// Sepolia testnet, and local Hardhat node.
export const wagmiConfig = createConfig({
    chains: [mainnet, sepolia, hardhat],
    connectors: [
        metaMask(),
        injected(), // catches other injected wallets (Coinbase, Brave, etc.)
    ],
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        [hardhat.id]: http('http://127.0.0.1:8545'),
    },
});

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
}
