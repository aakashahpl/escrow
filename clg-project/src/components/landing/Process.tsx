
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Search, FileSignature, CreditCard, Briefcase, Trophy, Sparkles } from 'lucide-react';

const clientSteps = [
    {
        icon: <Search className="w-6 h-6 text-white" />,
        title: "Post a Job",
        desc: "Describe your project and the skills you need. Our AI matches you with top talent instantly.",
        color: "bg-blue-500"
    },
    {
        icon: <FileSignature className="w-6 h-6 text-white" />,
        title: "Hire & Collaborate",
        desc: "Review proposals, interview candidates, and start working with your dedicated workspace.",
        color: "bg-purple-500"
    },
    {
        icon: <CreditCard className="w-6 h-6 text-white" />,
        title: "Pay Securely",
        desc: "Only pay when you're 100% satisfied. Our escrow system protects your funds until approval.",
        color: "bg-emerald-500"
    }
];

const freelancerSteps = [
    {
        icon: <User className="w-6 h-6 text-white" />,
        title: "Create Profile",
        desc: "Showcase your portfolio, skills, and work history to stand out to global clients.",
        color: "bg-orange-500"
    },
    {
        icon: <Briefcase className="w-6 h-6 text-white" />,
        title: "Find Great Work",
        desc: "Search for jobs that match your skills and apply with a customized proposal.",
        color: "bg-pink-500"
    },
    {
        icon: <Trophy className="w-6 h-6 text-white" />,
        title: "Get Paid",
        desc: "Receive payments quickly and securely with industry-low fees.",
        color: "bg-teal-500"
    }
];

export default function Process() {
    const [activeTab, setActiveTab] = useState<'client' | 'freelancer'>('client');

    const steps = activeTab === 'client' ? clientSteps : freelancerSteps;

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-emerald-600 font-semibold tracking-wider text-sm uppercase mb-2 block">Workflow</span>
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">Get work done, your way</h2>

                    <div className="inline-flex bg-gray-100 p-1 rounded-full relative">
                        <div
                            className={`absolute top-1 bottom-1 w-1/2 bg-white rounded-full shadow-sm transition-all duration-300 ease-out ${activeTab === 'client' ? 'left-1' : 'left-[calc(50%-4px)] translate-x-[calc(0%+4px)]'}`}
                        ></div>
                        <button
                            onClick={() => setActiveTab('client')}
                            className={`relative z-10 px-8 py-3 rounded-full text-sm font-semibold transition-colors duration-300 ${activeTab === 'client' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            I want to Hire
                        </button>
                        <button
                            onClick={() => setActiveTab('freelancer')}
                            className={`relative z-10 px-8 py-3 rounded-full text-sm font-semibold transition-colors duration-300 ${activeTab === 'freelancer' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            I want to Work
                        </button>
                    </div>
                </div>

                <div className="relative">
                    {/* Connection Line */}
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 hidden md:block -z-10"></div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <AnimatePresence mode="wait">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={step.title + activeTab}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: index * 0.1, duration: 0.4 }}
                                    className="bg-white p-6 rounded-2xl text-center group"
                                >
                                    <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-gray-200 group-hover:scale-110 transition-transform duration-300`}>
                                        {step.icon}
                                    </div>
                                    <div className="mb-2 inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-bold text-gray-500 border border-gray-200">
                                        {index + 1}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {step.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <button className="text-emerald-600 font-semibold flex items-center justify-center gap-2 mx-auto hover:text-emerald-700 transition-colors">
                        <Sparkles className="w-5 h-5" />
                        Learn more about our process
                    </button>
                </div>
            </div>
        </section>
    );
}
