"use client";

import { useEffect, useState, use } from 'react';
import { realApi as api } from '@/lib/api';
import { Application } from '@/lib/mockApi';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    Loader2,
    User,
    DollarSign,
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    Zap,
} from 'lucide-react';

type Proposal = Application & { jobTitle?: string };

const statusConfig = {
    pending: { label: 'Pending', icon: Clock, className: 'bg-amber-100 text-amber-700' },
    accepted: { label: 'Accepted', icon: CheckCircle, className: 'bg-emerald-100 text-emerald-700' },
    rejected: { label: 'Rejected', icon: XCircle, className: 'bg-red-100 text-red-700' },
};

export default function JobProposalsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: jobId } = use(params);
    const { user } = useAuth();
    const router = useRouter();

    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [jobTitle, setJobTitle] = useState('');
    const [jobStatus, setJobStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [accepting, setAccepting] = useState<string | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const [job, props] = await Promise.all([
                    api.getJobById(jobId),
                    api.getApplicationsForJob(jobId),
                ]);
                if (job) {
                    setJobTitle(job.title);
                    setJobStatus(job.status);
                }
                setProposals(props as Proposal[]);
            } catch {
                setError('Failed to load proposals.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [jobId, user]);

    const handleAccept = async (proposal: Proposal) => {
        setAccepting(proposal.id);
        setError('');
        try {
            const result = await api.acceptProposal(proposal.id);
            // Update local state: mark accepted, reject others
            setProposals((prev) =>
                prev.map((p) =>
                    p.id === proposal.id
                        ? { ...p, status: 'accepted' as const }
                        : p.status === 'pending'
                        ? { ...p, status: 'rejected' as const }
                        : p,
                ),
            );
            setJobStatus('in-progress');
            alert(
                `Contract deployed!\nEscrow ID: ${result.escrowId}\nContract: ${result.contractAddress}`,
            );
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to accept proposal.');
        } finally {
            setAccepting(null);
        }
    };

    const jobIsOpen = jobStatus === 'open';

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-10 max-w-4xl">
            {/* Back link */}
            <Link
                href="/client/dashboard"
                className="inline-flex items-center text-gray-500 hover:text-emerald-600 mb-6 transition-colors text-sm"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{jobTitle}</h1>
                    <p className="text-gray-500 mt-1 text-sm">
                        {proposals.length} proposal{proposals.length !== 1 ? 's' : ''} received
                    </p>
                </div>
                <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                        jobIsOpen
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                    }`}
                >
                    {jobIsOpen ? <Clock className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                    {jobStatus === 'in-progress' ? 'In Progress' : jobStatus.charAt(0).toUpperCase() + jobStatus.slice(1)}
                </span>
            </div>

            {/* Error banner */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700 flex items-center gap-2">
                    <XCircle className="w-4 h-4 shrink-0" /> {error}
                </div>
            )}

            {/* Proposal list */}
            {proposals.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
                    <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-7 h-7 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No proposals yet</h3>
                    <p className="text-gray-500 text-sm">Freelancers haven&apos;t applied to this job yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {proposals.map((proposal) => {
                        const { label, icon: StatusIcon, className: statusCls } = statusConfig[proposal.status] ?? statusConfig.pending;
                        const isAccepting = accepting === proposal.id;

                        return (
                            <div
                                key={proposal.id}
                                className={`bg-white rounded-2xl border p-6 shadow-sm transition-all ${
                                    proposal.status === 'accepted'
                                        ? 'border-emerald-300 ring-2 ring-emerald-100'
                                        : 'border-gray-100 hover:border-gray-200'
                                }`}
                            >
                                {/* Top row: freelancer + status + bid */}
                                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">{proposal.freelancerName}</div>
                                            <div className="text-xs text-gray-400">
                                                {new Date(proposal.createdAt).toLocaleDateString(undefined, {
                                                    month: 'short', day: 'numeric', year: 'numeric',
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {/* Bid amount */}
                                        <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5">
                                            <DollarSign className="w-4 h-4 text-emerald-500" />
                                            <span className="font-bold text-gray-900">{proposal.bidAmount.toLocaleString()}</span>
                                        </div>
                                        {/* Status badge */}
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${statusCls}`}>
                                            <StatusIcon className="w-3.5 h-3.5" /> {label}
                                        </span>
                                    </div>
                                </div>

                                {/* Cover letter */}
                                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed mb-5 whitespace-pre-wrap">
                                    {proposal.coverLetter}
                                </div>

                                {/* Accept button — only shown if job is open and proposal is pending */}
                                {jobIsOpen && proposal.status === 'pending' && (
                                    <div className="flex items-center gap-3">
                                        <Button
                                            size="lg"
                                            className="gap-2"
                                            isLoading={isAccepting}
                                            onClick={() => handleAccept(proposal)}
                                            disabled={!!accepting}
                                        >
                                            <Zap className="w-4 h-4" />
                                            {isAccepting ? 'Deploying Contract…' : 'Accept & Deploy Contract'}
                                        </Button>
                                    </div>
                                )}

                                {/* Accepted state — link to escrow management */}
                                {proposal.status === 'accepted' && (
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 text-sm text-emerald-700 font-medium">
                                            <CheckCircle className="w-4 h-4" />
                                            Accepted — escrow contract deployed
                                        </div>
                                        <Link href={`/client/jobs/${jobId}/escrow`}>
                                            <Button size="sm" variant="outline" className="gap-1.5">
                                                Manage Contract →
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
