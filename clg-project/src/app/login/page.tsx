"use client";

import { useEffect, useState } from 'react';
import { useConnect, useAccount } from 'wagmi';
import { useAuth } from '@/context/AuthContext';
import { Wallet, ShieldCheck, Zap, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const { connectors, connect, isPending, error } = useConnect();
    const { address, isConnected } = useAccount();
    const { loginWithWallet, user } = useAuth();
    const router = useRouter();
    const [registering, setRegistering] = useState(false);

    // Once wagmi reports a connected wallet, register/login against the backend
    useEffect(() => {
        if (isConnected && address && !user) {
            setRegistering(true);
            loginWithWallet(address).finally(() => setRegistering(false));
        }
    }, [isConnected, address, user, loginWithWallet]);

    // If already logged in, send straight to dashboard
    useEffect(() => {
        if (user) {
            router.push(user.role === 'client' ? '/client/dashboard' : '/freelancer/dashboard');
        }
    }, [user, router]);

    const isLoading = isPending || registering;

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Wallet className="w-7 h-7 text-emerald-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Connect Your Wallet</h1>
                    <p className="text-gray-500 mt-2 text-sm">
                        Sign in securely with your Web3 wallet — no password needed.
                    </p>
                </div>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-6 mb-8 text-xs text-gray-400">
                    <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" /> Non-custodial
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-emerald-500" /> Instant access
                    </span>
                </div>

                {/* Wallet connector buttons */}
                <div className="space-y-3">
                    {connectors.map((connector) => (
                        <button
                            key={connector.uid}
                            onClick={() => connect({ connector })}
                            disabled={isLoading}
                            className="w-full flex items-center gap-4 px-5 py-4 rounded-xl border border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {/* Connector icon */}
                            {connector.icon ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={connector.icon}
                                    alt={connector.name}
                                    className="w-8 h-8 rounded-lg"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <Wallet className="w-4 h-4 text-gray-500" />
                                </div>
                            )}

                            <span className="font-medium text-gray-800 group-hover:text-emerald-700 transition-colors">
                                {isPending ? 'Connecting...' : connector.name}
                            </span>

                            {isLoading && (
                                <svg
                                    className="ml-auto w-4 h-4 animate-spin text-emerald-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>

                {/* Error message */}
                {error && (
                    <div className="mt-5 flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{error.message}</span>
                    </div>
                )}

                <p className="text-center mt-8 text-xs text-gray-400">
                    By connecting, you agree to our{' '}
                    <span className="text-emerald-600 cursor-pointer hover:underline">Terms of Service</span>.
                    <br />
                    Your wallet address is your identity on this platform.
                </p>
            </div>
        </div>
    );
}
