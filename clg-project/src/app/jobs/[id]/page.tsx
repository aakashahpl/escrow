
"use client";

import { useEffect, useState, use } from 'react';
import { Job } from '@/lib/mockApi';
import { realApi as api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Calendar, ShieldCheck, Flag, ArrowLeft, Heart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { user } = useAuth();

    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasApplied, setHasApplied] = useState(false);
    const [isApplying, setIsApplying] = useState(true);

    // Application Form State
    const [coverLetter, setCoverLetter] = useState('');
    const [bidAmount, setBidAmount] = useState<number>(0);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const jobData = await api.getJobById(id);
            setJob(jobData);

            if (user && user.role === 'freelancer' && jobData) {
                setBidAmount(jobData.budget);
                const applied = await api.hasApplied(id, user.id);
                setHasApplied(applied);
            }

            setLoading(false);
        };
        fetchData();
    }, [id, user]);

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!job) return;

        setSubmitting(true);
        try {
            await api.applyToJob(job.id, coverLetter, bidAmount);
            setHasApplied(true);
            setIsApplying(false);
        } catch (err) {
            console.error("Failed to apply", err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="h-[50vh] flex items-center justify-center">Loading...</div>;
    if (!job) return <div className="h-[50vh] flex items-center justify-center">Job not found</div>;

    return (
        <div className="container mx-auto px-6 py-10">
            <Link href="/marketplace" className="inline-flex items-center text-gray-500 hover:text-emerald-600 mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to jobs
            </Link>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-grow">
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>

                        <div className="flex flex-wrap gap-6 text-sm text-gray-500 border-b border-gray-100 pb-6 mb-6">
                            <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                                {job.budgetType === 'fixed' ? <ShieldCheck className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                {job.budgetType === 'fixed' ? 'Fixed Price' : 'Hourly Rate'}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                Posted {job.postedTimeAgo}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4" />
                                Remote
                            </span>
                        </div>

                        <div className="prose prose-emerald max-w-none text-gray-600 mb-8">
                            <h3 className="text-gray-900 font-semibold text-lg mb-2">Job Description</h3>
                            <p className="whitespace-pre-wrap">{job.description}</p>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-gray-900 font-semibold text-lg mb-3">Required Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {job.skillsRequired.map((skill) => (
                                    <span key={skill} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Application Form */}
                    {isApplying && (
                        <div className="bg-white rounded-2xl border border-emerald-200 ring-4 ring-emerald-50 p-8 shadow-lg mt-6 animate-in fade-in slide-in-from-bottom-4">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Submit a Proposal</h3>
                            <form onSubmit={handleApply}>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Bid Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                        <input
                                            type="number"
                                            value={bidAmount}
                                            onChange={(e) => setBidAmount(Number(e.target.value))}
                                            className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter</label>
                                    <textarea
                                        value={coverLetter}
                                        onChange={(e) => setCoverLetter(e.target.value)}
                                        rows={6}
                                        placeholder="Describe why you are a good fit..."
                                        className="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                                        required
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <Button type="submit" size="lg" isLoading={submitting}>Submit Proposal</Button>
                                    <Button type="button" variant="ghost" onClick={() => setIsApplying(false)}>Cancel</Button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                <div className="w-full lg:w-96 flex-shrink-0">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-24">
                        <div className="mb-6">
                            <Button
                                size="lg"
                                className="w-full mb-3"
                                disabled={!user || user.role === 'client' || hasApplied || isApplying}
                                onClick={() => setIsApplying(true)}
                            >
                                {hasApplied ? 'Applied' : user?.role === 'client' ? 'Client View' : 'Apply Now'}
                            </Button>
                            <Button variant="outline" className="w-full gap-2">
                                <Heart className="w-4 h-4" /> Save Job
                            </Button>
                        </div>

                        <div className="border-t border-gray-100 pt-6">
                            <h4 className="font-semibold text-gray-900 mb-4">About the Client</h4>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
                                    {job.clientName.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">{job.clientName}</div>
                                    <div className="text-xs text-gray-500">Member since 2023</div>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                    <span>Payment Method Verified</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Flag className="w-4 h-4 text-gray-400" />
                                    <span>United States</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex text-amber-400">★★★★★</div>
                                    <span>5.0 of 12 reviews</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
