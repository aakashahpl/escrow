
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Job, JobFilter } from '@/lib/mockApi';
import { realApi as api } from '@/lib/api';
import JobCard from '@/components/jobs/JobCard';
import { Search, Filter, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MarketplacePage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Filter States
    const [showFilters, setShowFilters] = useState(false);
    const [budgetType, setBudgetType] = useState<'all' | 'fixed' | 'hourly'>('all');
    const [minBudget, setMinBudget] = useState<string>('');
    const [maxBudget, setMaxBudget] = useState<string>('');

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        try {
            const filter: JobFilter = {
                searchTerm,
                budgetType,
                minBudget: minBudget ? Number(minBudget) : undefined,
                maxBudget: maxBudget ? Number(maxBudget) : undefined
            };
            const data = await api.getJobs(filter);
            setJobs(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, budgetType, minBudget, maxBudget]);

    // Debounce Search
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchJobs();
        }, 500); // 500ms debounce

        return () => {
            clearTimeout(handler);
        };
    }, [fetchJobs]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchJobs(); // Trigger immediately on submit
    };

    const clearFilters = () => {
        setBudgetType('all');
        setMinBudget('');
        setMaxBudget('');
        setSearchTerm('');
    };

    return (
        <div className="container mx-auto px-6 py-10 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Work</h1>
                    <p className="text-gray-500">Browse the latest freelance opportunities.</p>
                </div>
                <div className="w-full md:w-auto flex gap-3">
                    <div className="relative">
                        <Button
                            variant={showFilters ? "secondary" : "outline"}
                            className="gap-2"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter className="w-4 h-4" /> {showFilters ? 'Hide Filters' : 'Filters'}
                        </Button>
                    </div>
                    <div className="relative">
                        <Button variant="primary">
                            Saved Jobs
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* Search & Filters Sidebar (Mobile: Stacked, Desktop: Sticky Sidebar if filters open) */}
                <div className={`w-full lg:w-1/4 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>

                    {/* Filters Panel */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-900">Filter By</h3>
                            {(budgetType !== 'all' || minBudget || maxBudget) && (
                                <button onClick={clearFilters} className="text-sm text-emerald-600 hover:underline">
                                    Clear all
                                </button>
                            )}
                        </div>

                        {/* Budget Type */}
                        <div className="mb-6">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Job Type</h4>
                            <div className="space-y-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${budgetType === 'all' ? 'bg-emerald-600 border-emerald-600' : 'border-gray-300 bg-white'}`}>
                                        {budgetType === 'all' && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <input type="radio" name="budgetType" className="hidden" checked={budgetType === 'all'} onChange={() => setBudgetType('all')} />
                                    <span className="text-gray-600 group-hover:text-gray-900">All Types</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${budgetType === 'fixed' ? 'bg-emerald-600 border-emerald-600' : 'border-gray-300 bg-white'}`}>
                                        {budgetType === 'fixed' && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <input type="radio" name="budgetType" className="hidden" checked={budgetType === 'fixed'} onChange={() => setBudgetType('fixed')} />
                                    <span className="text-gray-600 group-hover:text-gray-900">Fixed Price</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${budgetType === 'hourly' ? 'bg-emerald-600 border-emerald-600' : 'border-gray-300 bg-white'}`}>
                                        {budgetType === 'hourly' && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <input type="radio" name="budgetType" className="hidden" checked={budgetType === 'hourly'} onChange={() => setBudgetType('hourly')} />
                                    <span className="text-gray-600 group-hover:text-gray-900">Hourly Rate</span>
                                </label>
                            </div>
                        </div>

                        {/* Budget Range */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Budget</h4>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={minBudget}
                                    onChange={(e) => setMinBudget(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                                <span className="text-gray-400">-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={maxBudget}
                                    onChange={(e) => setMaxBudget(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full lg:w-3/4">
                    {/* Search Bar */}
                    <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 mb-8 sticky top-4 z-40">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="relative flex-grow">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by title, skill, or keyword..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-transparent rounded-lg focus:bg-gray-50 outline-none transition-colors"
                                />
                            </div>
                            <Button type="submit" size="lg" className="px-8 hidden sm:flex">Search</Button>
                        </form>
                    </div>

                    {/* Results */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
                            <p className="text-gray-500 animate-pulse">Finding matching jobs...</p>
                        </div>
                    ) : jobs.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {jobs.map((job) => (
                                <JobCard key={job.id} job={job} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">No jobs found</h3>
                            <p className="text-gray-500 max-w-sm mx-auto">
                                We couldn&apos;t find any jobs matching your search and filters. Try adjusting your criteria.
                            </p>
                            <button onClick={clearFilters} className="mt-4 text-emerald-600 font-semibold hover:underline">
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
