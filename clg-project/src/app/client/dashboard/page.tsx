
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Job } from '@/lib/mockApi';
import { realApi as api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Plus, Users, Clock, CheckCircle, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

export default function ClientDashboard() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            const myJobs = await api.getClientJobs(user.id);
            setJobs(myJobs);
            setLoading(false);
        };
        fetchData();
    }, [user]);

    if (!user) return null;

    return (
        <div className="container mx-auto px-6 py-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
                <Link href="/client/post-job">
                    <Button className="gap-2 shadow-emerald-600/20 shadow-lg">
                        <Plus className="w-5 h-5" /> Post a New Job
                    </Button>
                </Link>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Clock className="w-6 h-6" />
                        </div>
                        <span className="text-gray-400 text-sm">Total</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{jobs.filter(j => j.status === 'open').length}</div>
                    <div className="text-sm text-gray-500">Open Jobs</div>
                </div>
                <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                            <Users className="w-6 h-6" />
                        </div>
                        <span className="text-gray-400 text-sm">Active</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{jobs.filter(j => j.status === 'in-progress').length}</div>
                    <div className="text-sm text-gray-500">Hired / In Progress</div>
                </div>
                <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <span className="text-gray-400 text-sm">Completed</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{jobs.filter(j => j.status === 'completed').length}</div>
                    <div className="text-sm text-gray-500">Past Projects</div>
                </div>
            </div>

            {/* Jobs List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="font-bold text-gray-900">Your Job Postings</h2>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-gray-400">Loading...</div>
                ) : jobs.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {jobs.map((job) => (
                            <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                                        <Link href={`/jobs/${job.id}`} className="hover:text-emerald-600">
                                            {job.title}
                                        </Link>
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span>Posted {job.postedTimeAgo}</span>
                                        <span>•</span>
                                        <span>{job.budgetType} - ${job.budget}</span>
                                        <span>•</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden sm:block">
                                        <div className="text-2xl font-bold text-gray-900">0</div>
                                        <div className="text-xs text-gray-500">Proposals</div>
                                    </div>
                                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <Plus className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No jobs posted yet</h3>
                        <p className="text-gray-500 mb-6">Create your first job post to find talent.</p>
                        <Link href="/client/post-job">
                            <Button>Post a Job</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
