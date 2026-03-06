"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/lib/mockApi';
import { realApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useDisconnect } from 'wagmi';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    // Called after wagmi connects — walletAddress is the real MetaMask address
    loginWithWallet: (walletAddress: string) => Promise<void>;
    logout: () => void;
    updateRole: (role: 'client' | 'freelancer') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { disconnect } = useDisconnect();

    // Restore session from localStorage on mount
    useEffect(() => {
        const currentUser = realApi.getCurrentUser();
        setUser(currentUser);
        setLoading(false);
    }, []);

    const loginWithWallet = async (walletAddress: string) => {
        setLoading(true);
        try {
            const loggedInUser = await realApi.connectWallet(walletAddress);
            setUser(loggedInUser);
            router.push('/role-selection');
        } catch (error) {
            console.error('Wallet login failed', error);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await realApi.logout();
        disconnect(); // also disconnect from MetaMask
        setUser(null);
        router.push('/');
    };

    const updateRole = async (role: 'client' | 'freelancer') => {
        if (!user) return;
        try {
            await realApi.updateRole(user.id, role);
            setUser({ ...user, role });
        } catch (error) {
            console.error('Role update failed', error);
        }

        if (role === 'client') {
            router.push('/client/dashboard');
        } else {
            router.push('/freelancer/dashboard');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginWithWallet, logout, updateRole }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
