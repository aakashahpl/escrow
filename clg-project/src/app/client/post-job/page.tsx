
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { realApi as api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PostJobPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        budget: '',
        budgetType: 'fixed',
        skills: '', // comma separated input
        deadline: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        try {
            await api.postJob(
                {
                    title: formData.title,
                    description: formData.description,
                    budget: Number(formData.budget),
                    budgetType: formData.budgetType as 'fixed' | 'hourly',
                    skillsRequired: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
                    deadline: formData.deadline,
                },
                user.id,
            );
            router.push('/client/dashboard');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-6 py-10 max-w-3xl">
            <Link href="/client/dashboard" className="inline-flex items-center text-gray-500 hover:text-emerald-600 mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Post a New Job</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                        <input
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Senior React Developer needed for E-commerce site"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            required
                            rows={6}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the project, requirements, and deliverables..."
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none resize-y"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Budget Type</label>
                            <select
                                name="budgetType"
                                value={formData.budgetType}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                            >
                                <option value="fixed">Fixed Price</option>
                                <option value="hourly">Hourly Rate</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Budget Amount ($)</label>
                            <input
                                type="number"
                                name="budget"
                                required
                                value={formData.budget}
                                onChange={handleChange}
                                placeholder="e.g. 5000"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills (Comma separated)</label>
                        <input
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            placeholder="e.g. React, Node.js, TypeScript, AWS"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                        <input
                            type="date"
                            name="deadline"
                            required
                            value={formData.deadline}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>

                    <div className="pt-6 flex items-center justify-end gap-4">
                        <Link href="/client/dashboard">
                            <Button type="button" variant="ghost">Cancel</Button>
                        </Link>
                        <Button type="submit" size="lg" isLoading={loading}>Post Job Now</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
