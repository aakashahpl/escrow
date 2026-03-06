
"use client";

import { useAuth } from '@/context/AuthContext';
import { User, Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function RoleSelectionPage() {
    const { updateRole } = useAuth();
    const [selected, setSelected] = useState<'client' | 'freelancer' | null>(null);
    const [loading, setLoading] = useState(false);

    const handleContinue = async () => {
        if (!selected) return;
        setLoading(true);
        await updateRole(selected);
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
            <div className="max-w-3xl w-full">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
                    Join as a Client or Freelancer
                </h1>
                <p className="text-center text-gray-600 mb-12">
                    Choose your primary role to get started. You can still use both features later.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <button
                        onClick={() => setSelected('client')}
                        className={`p-8 rounded-2xl border-2 text-left transition-all relative overflow-hidden group hover:shadow-lg ${selected === 'client'
                            ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600 ring-offset-2'
                            : 'border-gray-200 hover:border-emerald-400 bg-white'
                            }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${selected === 'client' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-emerald-100 group-hover:text-emerald-600'
                                }`}>
                                <User className="w-6 h-6" />
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected === 'client' ? 'border-emerald-600' : 'border-gray-300'
                                }`}>
                                {selected === 'client' && <div className="w-3 h-3 bg-emerald-600 rounded-full" />}
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">I&apos;m a Client, hiring for a project</h3>
                        <p className="text-gray-500 text-sm">
                            Find top talent, post jobs, and manage your projects securely.
                        </p>
                    </button>

                    <button
                        onClick={() => setSelected('freelancer')}
                        className={`p-8 rounded-2xl border-2 text-left transition-all relative overflow-hidden group hover:shadow-lg ${selected === 'freelancer'
                            ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600 ring-offset-2'
                            : 'border-gray-200 hover:border-emerald-400 bg-white'
                            }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${selected === 'freelancer' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-emerald-100 group-hover:text-emerald-600'
                                }`}>
                                <Search className="w-6 h-6" />
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected === 'freelancer' ? 'border-emerald-600' : 'border-gray-300'
                                }`}>
                                {selected === 'freelancer' && <div className="w-3 h-3 bg-emerald-600 rounded-full" />}
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">I&apos;m a Freelancer, looking for work</h3>
                        <p className="text-gray-500 text-sm">
                            Browse jobs, apply with confidence, and build your reputation.
                        </p>
                    </button>
                </div>

                <div className="text-center">
                    <Button
                        onClick={handleContinue}
                        disabled={!selected}
                        size="lg"
                        isLoading={loading}
                        className="w-full md:w-auto min-w-[200px]"
                    >
                        {selected ? 'Create Account' : 'Select a Role'}
                    </Button>
                    <p className="mt-4 text-sm text-gray-500">
                        Already have an account? <a href="/login" className="text-emerald-600 font-medium hover:underline">Log In</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
