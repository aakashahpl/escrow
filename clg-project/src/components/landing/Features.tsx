
"use client";

import { UserPlus, Search, DollarSign, ShieldCheck } from 'lucide-react';

const features = [
    {
        icon: <UserPlus className="w-8 h-8 text-emerald-600" />,
        title: "Create Profile",
        description: "Sign up and build your comprehensive professional profile to showcase your skills."
    },
    {
        icon: <Search className="w-8 h-8 text-emerald-600" />,
        title: "Find Work",
        description: "Browse thousands of high-quality jobs or talent that match your requirements."
    },
    {
        icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />,
        title: "Do Work",
        description: "Collaborate using our workspace tools and track your progress securely."
    },
    {
        icon: <DollarSign className="w-8 h-8 text-emerald-600" />,
        title: "Get Paid",
        description: "Receive payments instantly and securely with our escrow protection."
    }
];

export default function Features() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">How WorkSphere Works</h2>
                    <p className="text-gray-600">A simple, transparent, and efficient process for clients and freelancers.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100 group">
                            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
