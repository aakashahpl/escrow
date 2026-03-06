
"use client";

import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
    {
        name: "Sarah Jenkins",
        role: "Full Stack Developer",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        content: "WorkSphere changed how I freelance. The payments are instant, and the clients are top-tier. I've doubled my income in just three months.",
        company: "Freelancer"
    },
    {
        name: "Michael Chen",
        role: "CTO at StartupX",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
        content: "Finding specialized talent for our blockchain projects was a nightmare until we found WorkSphere. The verification process is a game changer.",
        company: "Client"
    },
    {
        name: "Elena Rodriguez",
        role: "UX Designer",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
        content: "The dashboard and project management tools are beautiful. It feels like a platform built by designers for designers.",
        company: "Freelancer"
    }
];

export default function Testimonials() {
    return (
        <section className="py-20 bg-gray-50 border-y border-gray-100">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Experts</h2>
                    <p className="text-gray-600">See what our community has to say about the future of work.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex gap-1 mb-6 text-amber-400">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} className="w-5 h-5 fill-current" />
                                ))}
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-8 italic">&quot;{item.content}&quot;</p>
                            <div className="flex items-center gap-4">
                                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-full bg-gray-100" />
                                <div>
                                    <h4 className="font-bold text-gray-900">{item.name}</h4>
                                    <p className="text-sm text-gray-500">{item.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
