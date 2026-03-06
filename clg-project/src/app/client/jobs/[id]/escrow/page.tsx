"use client";

import { useEffect, useState, use } from 'react';
import { realApi as api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    Loader2,
    CheckCircle,
    XCircle,
    Clock,
    Lock,
    Unlock,
    Zap,
    ExternalLink,
    Copy,
} from 'lucide-react';

type Milestone = {
    id: number;
    milestone_index: number;
    amount: string;
    funded: boolean;
    approved: boolean;
    released: boolean;
};

type EscrowDetails = {
    id: number;
    contract_address: string;
    buyer_address: string;
    seller_address: string;
    total_amount: string;
    status: string;
    milestones: Milestone[];
};

type TxStep = 'idle' | 'pending' | 'done' | 'error';

function shortenAddress(addr: string) {
    return `${addr.slice(0, 8)}…${addr.slice(-6)}`;
}

function getMilestoneStage(m: Milestone): 'unfunded' | 'funded' | 'released' {
    if (m.released) return 'released';
    if (m.funded) return 'funded';
    return 'unfunded';
}

export default function EscrowPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: jobId } = use(params);
    const { user } = useAuth();

    const [escrow, setEscrow] = useState<EscrowDetails | null>(null);
    const [jobTitle, setJobTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Per-milestone action states: { milestoneIndex → TxStep }
    const [fundingStep, setFundingStep] = useState<Record<number, TxStep>>({});
    const [approveStep, setApproveStep] = useState<Record<number, TxStep>>({});
    const [txHashes, setTxHashes] = useState<Record<number, string>>({});
    const [actionError, setActionError] = useState<Record<number, string>>({});

    useEffect(() => {
        const load = async () => {
            if (!user) return;
            setLoading(true);
            try {
                // Fetch job to get escrow_id and title
                const job = await api.getJobById(jobId);
                if (!job) { setError('Job not found.'); setLoading(false); return; }
                setJobTitle(job.title);

                // job.id maps to backend jobs.escrow_id via the job object
                // We need the raw escrowId — fetch it from the full job shape
                // api.getJobById returns mapped Job which doesn't expose escrow_id directly.
                // So we fetch all client jobs and find the matching one.
                const clientJobs = await api.getClientJobs(user.id);
                const fullJob = clientJobs.find(j => j.id === job.id);

                // The escrow_id is stored in BackendJob — we surfaced it in mapJob as a field
                // we need to add. For now, fetch escrow by reading the proposals page approach:
                // we stored escrowId in the acceptProposal response. Instead, we expose it via
                // a dedicated route: GET /api/jobs/:id/escrow redirects to escrow details.
                // Simplest approach: add escrow_id to the mapJob function.
                // However, since we haven't done that yet, we use a workaround:
                // call GET /api/jobs/:id (raw) to get escrow_id, then GET /api/escrow/:escrow_id/details.
                const rawJobRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}`,
                );
                const rawJob = await rawJobRes.json();
                const escrowId = rawJob.escrow_id;

                if (!escrowId) {
                    setError('No escrow contract linked to this job yet.');
                    setLoading(false);
                    return;
                }

                const details = await api.getEscrowDetails(escrowId);
                setEscrow(details);
            } catch {
                setError('Failed to load escrow details.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [jobId, user]);

    const handleFund = async (m: Milestone) => {
        if (!escrow) return;
        setFundingStep(s => ({ ...s, [m.milestone_index]: 'pending' }));
        setActionError(e => ({ ...e, [m.milestone_index]: '' }));
        try {
            const result = await api.fundMilestone(escrow.id, m.milestone_index);
            setTxHashes(h => ({ ...h, [m.milestone_index]: result.txHash }));
            setFundingStep(s => ({ ...s, [m.milestone_index]: 'done' }));
            // Refresh escrow state
            const updated = await api.getEscrowDetails(escrow.id);
            setEscrow(updated);
        } catch (err: unknown) {
            setFundingStep(s => ({ ...s, [m.milestone_index]: 'error' }));
            setActionError(e => ({
                ...e,
                [m.milestone_index]: err instanceof Error ? err.message : 'Transaction failed.',
            }));
        }
    };

    const handleApprove = async (m: Milestone) => {
        if (!escrow) return;
        setApproveStep(s => ({ ...s, [m.milestone_index]: 'pending' }));
        setActionError(e => ({ ...e, [m.milestone_index]: '' }));
        try {
            const result = await api.approveMilestone(escrow.id, m.milestone_index);
            setTxHashes(h => ({ ...h, [m.milestone_index]: result.txHash }));
            setApproveStep(s => ({ ...s, [m.milestone_index]: 'done' }));
            // Refresh escrow state
            const updated = await api.getEscrowDetails(escrow.id);
            setEscrow(updated);
        } catch (err: unknown) {
            setApproveStep(s => ({ ...s, [m.milestone_index]: 'error' }));
            setActionError(e => ({
                ...e,
                [m.milestone_index]: err instanceof Error ? err.message : 'Transaction failed.',
            }));
        }
    };

    const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-6 py-10 max-w-3xl">
                <Link href="/client/dashboard" className="inline-flex items-center text-gray-500 hover:text-emerald-600 mb-6 text-sm">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Link>
                <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-red-700 flex items-center gap-3">
                    <XCircle className="w-5 h-5 shrink-0" /> {error}
                </div>
            </div>
        );
    }

    if (!escrow) return null;

    const allReleased = escrow.milestones.every(m => m.released);

    return (
        <div className="container mx-auto px-6 py-10 max-w-3xl">
            {/* Back */}
            <Link
                href={`/client/jobs/${jobId}/proposals`}
                className="inline-flex items-center text-gray-500 hover:text-emerald-600 mb-6 text-sm transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Proposals
            </Link>

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Escrow Contract</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{jobTitle}</h1>
                <p className="text-sm text-gray-500">
                    Manage milestone funding and approve completed work to release payment.
                </p>
            </div>

            {/* Contract info card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                <h2 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wider">Contract Details</h2>
                <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-500">Contract Address</span>
                        <div className="flex items-center gap-2 font-mono text-gray-800">
                            <span>{shortenAddress(escrow.contract_address)}</span>
                            <button onClick={() => copyToClipboard(escrow.contract_address)} className="text-gray-400 hover:text-emerald-600 transition-colors" title="Copy">
                                <Copy className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-500">Buyer</span>
                        <span className="font-mono text-gray-800">{shortenAddress(escrow.buyer_address)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-500">Seller</span>
                        <span className="font-mono text-gray-800">{shortenAddress(escrow.seller_address)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-500">Total Value</span>
                        <span className="font-bold text-gray-900">{Number(escrow.total_amount) / 1e18} ETH</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-500">Status</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${allReleased ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                            {allReleased ? 'Complete' : escrow.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* Milestones */}
            <div className="space-y-4">
                <h2 className="font-bold text-gray-900 text-lg">Milestones</h2>
                {escrow.milestones.map((m) => {
                    const stage = getMilestoneStage(m);
                    const isFunding = fundingStep[m.milestone_index] === 'pending';
                    const isApproving = approveStep[m.milestone_index] === 'pending';
                    const txHash = txHashes[m.milestone_index];
                    const milestoneError = actionError[m.milestone_index];
                    const amountEth = (Number(m.amount) / 1e18).toFixed(4);

                    return (
                        <div
                            key={m.id}
                            className={`bg-white rounded-2xl border p-6 shadow-sm transition-all ${
                                stage === 'released'
                                    ? 'border-emerald-200 bg-emerald-50/30'
                                    : stage === 'funded'
                                    ? 'border-blue-200 bg-blue-50/20'
                                    : 'border-gray-100'
                            }`}
                        >
                            {/* Milestone header */}
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Milestone {m.milestone_index + 1}
                                    </span>
                                    <div className="text-xl font-bold text-gray-900 mt-0.5">{amountEth} ETH</div>
                                </div>

                                {/* Stage badge */}
                                {stage === 'released' && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                                        <CheckCircle className="w-3.5 h-3.5" /> Payment Released
                                    </span>
                                )}
                                {stage === 'funded' && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                        <Lock className="w-3.5 h-3.5" /> Funded — Awaiting Approval
                                    </span>
                                )}
                                {stage === 'unfunded' && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                                        <Clock className="w-3.5 h-3.5" /> Not Funded Yet
                                    </span>
                                )}
                            </div>

                            {/* Progress steps */}
                            <div className="flex items-center gap-2 mb-5">
                                {/* Step 1: Fund */}
                                <div className={`flex items-center gap-1.5 text-xs font-medium ${m.funded ? 'text-emerald-600' : 'text-gray-400'}`}>
                                    {m.funded
                                        ? <CheckCircle className="w-4 h-4" />
                                        : <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center text-[10px] font-bold text-gray-400">1</div>
                                    }
                                    Fund
                                </div>
                                <div className={`flex-1 h-px ${m.funded ? 'bg-emerald-200' : 'bg-gray-200'}`} />
                                {/* Step 2: Work done */}
                                <div className={`flex items-center gap-1.5 text-xs font-medium ${m.funded && !m.released ? 'text-blue-600' : m.released ? 'text-emerald-600' : 'text-gray-400'}`}>
                                    {m.released
                                        ? <CheckCircle className="w-4 h-4" />
                                        : <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${m.funded ? 'border-blue-400 text-blue-600' : 'border-gray-300 text-gray-400'}`}>2</div>
                                    }
                                    Work Done
                                </div>
                                <div className={`flex-1 h-px ${m.released ? 'bg-emerald-200' : 'bg-gray-200'}`} />
                                {/* Step 3: Release */}
                                <div className={`flex items-center gap-1.5 text-xs font-medium ${m.released ? 'text-emerald-600' : 'text-gray-400'}`}>
                                    {m.released
                                        ? <CheckCircle className="w-4 h-4" />
                                        : <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center text-[10px] font-bold text-gray-400">3</div>
                                    }
                                    Released
                                </div>
                            </div>

                            {/* Error */}
                            {milestoneError && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-700 flex items-center gap-2">
                                    <XCircle className="w-4 h-4 shrink-0" /> {milestoneError}
                                </div>
                            )}

                            {/* Tx hash */}
                            {txHash && (
                                <div className="mb-4 p-3 bg-gray-50 rounded-xl text-xs text-gray-600 flex items-center justify-between gap-2">
                                    <span className="font-mono truncate">{txHash}</span>
                                    <button onClick={() => copyToClipboard(txHash)} className="text-gray-400 hover:text-emerald-600 shrink-0">
                                        <Copy className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}

                            {/* Actions */}
                            {stage === 'unfunded' && (
                                <Button
                                    size="lg"
                                    className="gap-2 w-full sm:w-auto"
                                    isLoading={isFunding}
                                    onClick={() => handleFund(m)}
                                >
                                    <Unlock className="w-4 h-4" />
                                    {isFunding ? 'Sending ETH to contract…' : `Fund Milestone — ${amountEth} ETH`}
                                </Button>
                            )}

                            {stage === 'funded' && (
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button
                                        size="lg"
                                        className="gap-2"
                                        isLoading={isApproving}
                                        onClick={() => handleApprove(m)}
                                    >
                                        <Zap className="w-4 h-4" />
                                        {isApproving ? 'Releasing payment…' : 'Approve & Release Payment'}
                                    </Button>
                                    <p className="text-xs text-gray-400 self-center">
                                        Confirm the work is done before approving — this transfers ETH directly to the seller.
                                    </p>
                                </div>
                            )}

                            {stage === 'released' && (
                                <div className="flex items-center gap-2 text-sm text-emerald-700 font-medium">
                                    <CheckCircle className="w-4 h-4" />
                                    {amountEth} ETH sent to seller&apos;s wallet
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* All complete */}
            {allReleased && (
                <div className="mt-6 p-6 bg-emerald-50 border border-emerald-100 rounded-2xl text-center">
                    <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                    <h3 className="font-bold text-emerald-800 text-lg mb-1">All payments released!</h3>
                    <p className="text-emerald-600 text-sm">This contract is complete. The seller has received full payment.</p>
                </div>
            )}
        </div>
    );
}
