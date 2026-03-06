"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Application } from '@/lib/mockApi';
import { realApi as api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

import { Loader2, Briefcase, DollarSign, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

import Link from 'next/link';

export default function FreelancerDashboard() {
    const { user } = useAuth();
    const [applications, setApplications] = useState<(Application & { jobTitle: string })[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            // job_title comes back from the backend JOIN — no extra fetches needed
            const apps = await api.getFreelancerApplications(user.id);
            setApplications(apps.map(app => ({
                ...app,
                jobTitle: (app as Application & { jobTitle?: string }).jobTitle ?? 'Unknown Job',
            })));
            setLoading(false);
        };
        fetchData();
    }, [user]);

    if (!user) return null; // Or redirect

    return (
        <div className="container mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome back, {user.name.split(' ')[0]}</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">$12,450</div>
                            <div className="text-sm text-gray-500">Total Earnings</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">14</div>
                            <div className="text-sm text-gray-500">Completed Jobs</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                            <Star className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">4.9/5</div>
                            <div className="text-sm text-gray-500">Client Rating</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-grow">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
                        <Link href="/marketplace" className="text-sm text-emerald-600 font-medium hover:underline">Find more work</Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-gray-300" /></div>
                    ) : applications.length > 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Job</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Applied</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Bid</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {applications.map((app) => (
                                            <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <Link href={`/jobs/${app.jobId}`} className="font-medium text-gray-900 hover:text-emerald-600">
                                                        {app.jobTitle}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {new Date(app.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                    {formatCurrency(app.bidAmount)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                        app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 text-center">
                            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Briefcase className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No active applications</h3>
                            <p className="text-gray-500 mb-6">Start browsing jobs to find your next opportunity.</p>
                            <Link href="/marketplace">
                                <Button>Browse Jobs</Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
                    <div className="bg-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                        <h3 className="font-bold text-lg mb-2">Upgrade to Plus</h3>
                        <p className="text-emerald-100 text-sm mb-4">Get 80 connects per month and see competitor bids.</p>
                        <Button variant="secondary" size="sm" className="w-full bg-white text-emerald-600 hover:bg-emerald-50">Learn More</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
