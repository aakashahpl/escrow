
"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Star } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative pt-24 pb-24 lg:pt-32 lg:pb-32 overflow-hidden bg-gradient-to-b from-white to-gray-50/50">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    <div className="w-full lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-sm font-medium mb-6">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                Live: 450+ New Jobs Posted Today
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 tracking-tight mb-8">
                                Work <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Without Limits.</span>
                            </h1>

                            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg">
                                The decentralized marketplace where top talent meets ambitious clients. Zero complications, instant payments.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                <Link href="/login" className="px-8 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/10 flex items-center justify-center gap-2">
                                    Get Started <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link href="/marketplace" className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-100 font-bold rounded-full hover:border-emerald-600 hover:text-emerald-600 transition-all flex items-center justify-center shadow-sm">
                                    Find Talent
                                </Link>
                            </div>

                            <div className="flex items-center gap-8 text-sm font-medium text-gray-500">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                                    <span>Verified Pros</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                                    <span>Secure Escrow</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" style={{ backgroundImage: `url(https://api.dicebear.com/7.x/avataaars/svg?seed=${i})` }}></div>
                                        ))}
                                    </div>
                                    <span className="ml-2">10k+ Users</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="w-full lg:w-1/2 relative lg:h-[600px] flex items-center justify-center">

                        {/* Background Blob */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-emerald-100/50 to-blue-100/50 rounded-full blur-3xl -z-10 animate-pulse"></div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative w-full max-w-md"
                        >
                            {/* Main Card: Profile */}
                            <div className="bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-100 p-6 mb-6 relative z-20">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="Profile" className="w-14 h-14 rounded-full bg-emerald-50" />
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">Sarah Jenkins</h3>
                                            <p className="text-emerald-600 font-medium">Top Rated Plus</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-gray-900">$85/hr</div>
                                        <div className="flex items-center text-amber-400 text-sm">
                                            <Star className="w-4 h-4 fill-current" /> 5.0
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 mb-6">
                                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">React</span>
                                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">Next.js</span>
                                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">Node.js</span>
                                </div>
                                <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                                    <button className="flex-1 py-2 bg-emerald-600 text-white rounded-lg font-semibold text-sm hover:bg-emerald-700 transition-colors">
                                        Hire Me
                                    </button>
                                    <button className="flex-1 py-2 border border-gray-200 text-gray-700 rounded-lg font-semibold text-sm hover:border-emerald-600 hover:text-emerald-600 transition-colors">
                                        View Profile
                                    </button>
                                </div>
                            </div>

                            {/* Floating Element: Active Job */}
                            <motion.div
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.6 }}
                                className="absolute -right-8 top-1/2 p-4 bg-white rounded-xl shadow-xl border border-gray-100 w-64 z-30"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium uppercase">Job Status</p>
                                        <p className="font-bold text-gray-900 text-sm">Contract Started</p>
                                    </div>
                                </div>
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-full animate-progress-indeterminate"></div>
                                </div>
                            </motion.div>

                            {/* Floating Element: Earnings */}
                            <motion.div
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.6 }}
                                className="absolute -left-8 bottom-12 p-4 bg-gray-900 text-white rounded-xl shadow-xl w-56 z-30"
                            >
                                <p className="text-gray-400 text-sm mb-1">Total Earnings</p>
                                <p className="text-2xl font-bold">$12,450.00</p>
                                <div className="mt-2 flex items-center gap-2 text-emerald-400 text-xs font-medium">
                                    <span>+24% this month</span>
                                </div>
                            </motion.div>

                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
