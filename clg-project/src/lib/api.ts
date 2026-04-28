// Real HTTP client that mirrors the mockApi surface.
// Auth is now wallet-first: callers pass the real wallet address obtained from MetaMask.
// Applications (apply/get) are still localStorage stubs — no backend route exists yet.

import type { User, UserRole, Job, JobFilter, Application } from './mockApi';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

// ---------- helpers ----------

async function http<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
        headers: { 'Content-Type': 'application/json', ...init?.headers },
        ...init,
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
    }

    return res.json() as Promise<T>;
}

const getStorage = <T>(key: string, fallback: T): T => {
    if (typeof window === 'undefined') return fallback;
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
};

const setStorage = (key: string, value: unknown) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
};

// ---------- backend response shapes ----------

interface BackendUser {
    id: number;
    wallet_address: string;
    username: string | null;
    email: string | null;
    role: 'BUYER' | 'SELLER' | 'BOTH';
    bio: string | null;
    rating?: number;
    created_at: string;
    updated_at: string;
}

interface BackendJob {
    id: number;
    posted_by: number;
    poster_wallet: string;
    poster_username: string | null;
    title: string;
    description: string;
    budget: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    escrow_id: number | null;
    created_at: string;
    updated_at: string;
}

// ---------- backend proposal shape ----------

interface BackendProposal {
    id: number;
    job_id: number;
    freelancer_id: number;
    freelancer_name: string | null;
    freelancer_wallet: string;
    job_title?: string;
    cover_letter: string;
    bid_amount: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    created_at: string;
    updated_at: string;
}

function mapProposal(p: BackendProposal): Application & { jobTitle?: string } {
    return {
        id: String(p.id),
        jobId: String(p.job_id),
        freelancerId: String(p.freelancer_id),
        freelancerName: p.freelancer_name ?? p.freelancer_wallet,
        coverLetter: p.cover_letter,
        bidAmount: Number(p.bid_amount),
        status: p.status.toLowerCase() as Application['status'],
        createdAt: p.created_at,
        ...(p.job_title ? { jobTitle: p.job_title } : {}),
    };
}

// ---------- mappers ----------

function mapUser(u: BackendUser): User {
    return {
        id: String(u.id),
        name: u.username ?? `${u.wallet_address.slice(0, 6)}...${u.wallet_address.slice(-4)}`,
        email: u.email ?? '',
        role: u.role === 'SELLER' ? 'freelancer' : 'client',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.wallet_address}`,
        bio: u.bio ?? undefined,
        rating: typeof u.rating === 'number' ? u.rating : undefined,
    };
}

function mapJob(j: BackendJob): Job {
    const statusMap: Record<string, Job['status']> = {
        OPEN: 'open',
        IN_PROGRESS: 'in-progress',
        COMPLETED: 'completed',
        CANCELLED: 'completed',
    };
    return {
        id: String(j.id),
        clientId: String(j.posted_by),
        clientName: j.poster_username ?? j.poster_wallet,
        title: j.title,
        description: j.description,
        budget: Number(j.budget),
        budgetType: 'fixed',
        deadline: '',
        skillsRequired: [],
        status: statusMap[j.status] ?? 'open',
        createdAt: j.created_at,
        postedTimeAgo: timeAgo(j.created_at),
    };
}

function timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} minute${mins !== 1 ? 's' : ''} ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hour${hrs !== 1 ? 's' : ''} ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
}

// ---------- exported API ----------

export const realApi = {
    // Auth — takes the real wallet address from MetaMask/wagmi.
    // Looks up the user by wallet; registers them if they don't exist yet.
    connectWallet: async (walletAddress: string): Promise<User> => {
        // Try to fetch existing user
        try {
            const existing = await http<BackendUser>(`/users/wallet/${walletAddress}`);
            const user = mapUser(existing);
            setStorage('currentUser', user);
            return user;
        } catch {
            // Not registered yet — create them now
        }

        // Auto-generate a short username from the wallet address
        const username = `user_${walletAddress.slice(2, 8).toLowerCase()}`;
        const created = await http<{ success: boolean; user: BackendUser }>('/users', {
            method: 'POST',
            body: JSON.stringify({ walletAddress, username, role: 'BUYER' }),
        });

        const user = mapUser(created.user);
        setStorage('currentUser', user);
        return user;
    },

    getCurrentUser: (): User | null => {
        return getStorage<User | null>('currentUser', null);
    },

    logout: async () => {
        if (typeof window !== 'undefined') localStorage.removeItem('currentUser');
    },

    // Update role on the backend then refresh localStorage
    updateRole: async (userId: string, role: UserRole): Promise<void> => {
        const backendRole = role === 'client' ? 'BUYER' : 'SELLER';
        await http<{ success: boolean; user: BackendUser }>(`/users/${userId}`, {
            method: 'PATCH',
            body: JSON.stringify({ role: backendRole }),
        });
        const current = getStorage<User | null>('currentUser', null);
        if (current) {
            setStorage('currentUser', { ...current, role });
        }
    },

    // Jobs
    getJobs: async (filter?: JobFilter): Promise<Job[]> => {
        const params = new URLSearchParams();
        params.set('status', 'OPEN');

        const jobs = await http<BackendJob[]>(`/jobs?${params.toString()}`);
        let mapped = jobs.map(mapJob);

        if (filter?.searchTerm) {
            const term = filter.searchTerm.toLowerCase();
            mapped = mapped.filter(
                (j) =>
                    j.title.toLowerCase().includes(term) ||
                    j.description.toLowerCase().includes(term),
            );
        }
        if (filter?.minBudget) {
            mapped = mapped.filter((j) => j.budget >= filter.minBudget!);
        }
        if (filter?.maxBudget) {
            mapped = mapped.filter((j) => j.budget <= filter.maxBudget!);
        }

        return mapped;
    },

    getJobById: async (id: string): Promise<Job | null> => {
        try {
            const job = await http<BackendJob>(`/jobs/${id}`);
            return mapJob(job);
        } catch {
            return null;
        }
    },

    postJob: async (jobData: Partial<Job>, postedBy: string): Promise<Job> => {
        const result = await http<{ success: boolean; job: BackendJob }>('/jobs', {
            method: 'POST',
            body: JSON.stringify({
                postedBy: Number(postedBy),
                title: jobData.title,
                description: jobData.description,
                budget: jobData.budget,
            }),
        });
        return mapJob(result.job);
    },

    getClientJobs: async (clientId: string): Promise<Job[]> => {
        const jobs = await http<BackendJob[]>(`/jobs/user/${clientId}`);
        return jobs.map(mapJob);
    },

    // Proposals — real backend calls
    applyToJob: async (
        jobId: string,
        coverLetter: string,
        bidAmount: number,
    ): Promise<Application> => {
        const user = getStorage<User | null>('currentUser', null);
        if (!user) throw new Error('Unauthorized');

        const result = await http<{ success: boolean; proposal: BackendProposal }>('/proposals', {
            method: 'POST',
            body: JSON.stringify({
                jobId: Number(jobId),
                freelancerId: Number(user.id),
                coverLetter,
                bidAmount,
            }),
        });
        return mapProposal(result.proposal);
    },

    getApplicationsForJob: async (jobId: string): Promise<Application[]> => {
        const proposals = await http<BackendProposal[]>(`/proposals/job/${jobId}`);
        return proposals.map(mapProposal);
    },

    getFreelancerApplications: async (freelancerId: string): Promise<(Application & { jobTitle?: string })[]> => {
        const proposals = await http<BackendProposal[]>(`/proposals/freelancer/${freelancerId}`);
        return proposals.map(mapProposal);
    },

    hasApplied: async (jobId: string, freelancerId: string): Promise<boolean> => {
        const result = await http<{ applied: boolean }>(`/proposals/check?jobId=${jobId}&freelancerId=${freelancerId}`);
        return result.applied;
    },

    acceptProposal: async (proposalId: string): Promise<{
        success: boolean;
        proposal: Application;
        escrowId: number;
        contractAddress: string;
    }> => {
        const result = await http<{
            success: boolean;
            proposal: BackendProposal;
            escrowId: number;
            contractAddress: string;
        }>(`/proposals/${proposalId}/accept`, { method: 'POST' });
        return {
            ...result,
            proposal: mapProposal(result.proposal),
        };
    },

    getProposalCountForJob: async (jobId: string): Promise<number> => {
        const proposals = await http<BackendProposal[]>(`/proposals/job/${jobId}`);
        return proposals.length;
    },

    // Escrow details + milestone actions
    getEscrowDetails: async (escrowId: string | number): Promise<{
        id: number;
        contract_address: string;
        buyer_address: string;
        seller_address: string;
        total_amount: string;
        status: string;
        milestones: Array<{
            id: number;
            milestone_index: number;
            amount: string;
            funded: boolean;
            approved: boolean;
            released: boolean;
        }>;
    }> => {
        return http(`/escrow/${escrowId}/details`);
    },

    fundMilestone: async (escrowId: string | number, milestoneIndex: number): Promise<{
        success: boolean;
        contractAddress: string;
        milestoneIndex: number;
        txHash: string;
    }> => {
        return http('/escrow/fund', {
            method: 'POST',
            body: JSON.stringify({ escrowId: Number(escrowId), milestoneIndex }),
        });
    },

    approveMilestone: async (escrowId: string | number, milestoneIndex: number): Promise<{
        success: boolean;
        contractAddress: string;
        milestoneIndex: number;
        txHash: string;
    }> => {
        return http('/escrow/approve', {
            method: 'POST',
            body: JSON.stringify({ escrowId: Number(escrowId), milestoneIndex }),
        });
    },

    // Disputes
    openDispute: async (
        escrowId: string | number,
        requesterWalletAddress: string,
        txHash?: string,
    ): Promise<{
        success: boolean;
        dispute: unknown;
        txHash: string | null;
    }> => {
        return http('/disputes/open', {
            method: 'POST',
            body: JSON.stringify({ escrowId: Number(escrowId), requesterWalletAddress, txHash: txHash ?? null }),
        });
    },

    listDisputes: async (requesterWalletAddress: string): Promise<{
        success: boolean;
        disputes: Array<{
            id: number;
            escrow_id: number;
            status: string;
            opened_at: string;
            resolved_at: string | null;
            contract_address: string;
            buyer_address: string;
            seller_address: string;
            total_amount: string;
            vote_count: number;
        }>;
    }> => {
        const params = new URLSearchParams({ requesterWalletAddress });
        return http(`/disputes?${params.toString()}`);
    },

    voteDispute: async (
        disputeId: number,
        requesterWalletAddress: string,
        txHash?: string,
    ): Promise<{
        success: boolean;
        votes: number;
        txHash: string | null;
        dispute: unknown;
    }> => {
        return http(`/disputes/${disputeId}/vote`, {
            method: 'POST',
            body: JSON.stringify({ requesterWalletAddress, txHash: txHash ?? null }),
        });
    },

    refundDisputeAfterTimeout: async (disputeId: number, txHash?: string): Promise<{
        success: boolean;
        txHash: string | null;
        dispute: unknown;
    }> => {
        return http(`/disputes/${disputeId}/refund-timeout`, {
            method: 'POST',
            body: JSON.stringify({ txHash: txHash ?? null }),
        });
    },
};
