
"use client";

import { Job } from '@/lib/mockApi';
import { formatCurrency } from '@/lib/utils';
import { Heart, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';

interface JobCardProps {
    job: Job;
}

export default function JobCard({ job }: JobCardProps) {
    return (
        <div className="group relative bg-white p-6 rounded-2xl border border-gray-100 hover:border-emerald-200 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
                        <Link href={`/jobs/${job.id}`}>
                            {job.title}
                        </Link>
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="font-medium text-gray-900">{job.budgetType === 'fixed' ? 'Fixed Price' : 'Hourly'}</span>
                        <span>•</span>
                        <span>Est. Budget: {formatCurrency(job.budget)}</span>
                        <span>•</span>
                        <span>Posted {job.postedTimeAgo}</span>
                    </div>
                </div>
                <button className="p-2 rounded-full hover:bg-gray-50 text-gray-400 hover:text-emerald-500 transition-colors">
                    <Heart className="w-5 h-5" />
                </button>
            </div>

            <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                {job.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
                {job.skillsRequired.slice(0, 4).map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium hover:bg-emerald-50 hover:text-emerald-600 transition-colors cursor-default">
                        {skill}
                    </span>
                ))}
                {job.skillsRequired.length > 4 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        +{job.skillsRequired.length - 4} more
                    </span>
                )}
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-4">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    Payment Verified
                </div>
                <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Remote
                </div>
                <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Deadline: {new Date(job.deadline).toLocaleDateString()}
                </div>
            </div>

            <Link href={`/jobs/${job.id}`} className="absolute inset-0 z-0"></Link>
        </div>
    );
}
