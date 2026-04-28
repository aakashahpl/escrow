
"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Briefcase, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-emerald-600 tracking-tight">
                    <Briefcase className="w-8 h-8" />
                    <span>WorkSphere</span>
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                    <Link href="/marketplace" className="hover:text-emerald-600 transition-colors">Find Talent</Link>
                    <Link href="/marketplace" className="hover:text-emerald-600 transition-colors">Find Work</Link>
                    <Link href="/why-us" className="hover:text-emerald-600 transition-colors">Why WorkSphere</Link>
                    <Link href="/enterprise" className="hover:text-emerald-600 transition-colors">Enterprise</Link>
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link
                                href={user.role === 'client' ? '/client/dashboard' : '/freelancer/dashboard'}
                                className="hidden md:block text-sm font-medium hover:text-emerald-600"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/disputes"
                                className="hidden md:block text-sm font-medium hover:text-emerald-600"
                            >
                                Disputes
                            </Link>
                            <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-medium text-gray-900 hidden md:block">{user.name}</span>
                                <button onClick={logout} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500" title="Disconnect wallet">
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-medium hover:text-emerald-600 transition-colors">
                                Log In
                            </Link>
                            <Link href="/login" className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-full hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
                                Connect Wallet
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
