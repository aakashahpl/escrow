
// --- Types ---

export type UserRole = 'client' | 'freelancer';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar: string;
    title?: string;
    bio?: string;
    skills?: string[];
    hourlyRate?: number;
    rating?: number;
    jobsCompleted?: number;
}

export type JobStatus = 'open' | 'in-progress' | 'completed';

export interface Job {
    id: string;
    clientId: string;
    clientName: string;
    title: string;
    description: string;
    budget: number;
    budgetType: 'fixed' | 'hourly';
    deadline: string;
    skillsRequired: string[];
    status: JobStatus;
    createdAt: string;
    postedTimeAgo: string;
}

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export interface Application {
    id: string;
    jobId: string;
    freelancerId: string;
    freelancerName: string;
    coverLetter: string;
    bidAmount: number;
    status: ApplicationStatus;
    createdAt: string;
}

export interface JobFilter {
    searchTerm?: string;
    budgetType?: 'fixed' | 'hourly' | 'all';
    minBudget?: number;
    maxBudget?: number;
}

// --- Mock Data ---

const MOCK_USERS: User[] = [
    {
        id: 'client-1',
        name: 'Alex Sterling',
        email: 'alex@techcorp.com',
        role: 'client',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    },
    {
        id: 'freelancer-1',
        name: 'Sarah Jenkins',
        email: 'sarah@dev.com',
        role: 'freelancer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        title: 'Full Stack Developer',
        bio: 'Expert in React, Node.js, and Cloud Architecture.',
        skills: ['React', 'Next.js', 'Node.js', 'TypeScript', 'AWS'],
        hourlyRate: 85,
        rating: 4.9,
        jobsCompleted: 142
    }
];

const MOCK_JOBS: Job[] = [
    {
        id: 'job-1',
        clientId: 'client-1',
        clientName: 'TechCorp Inc.',
        title: 'Build a Modern E-commerce Dashboard',
        description: 'We are looking for an experienced React developer to build a responsive admin dashboard for our e-commerce platform. Must be proficient in Next.js, Tailwind CSS, and Recharts.',
        budget: 1500,
        budgetType: 'fixed',
        deadline: '2023-12-01',
        skillsRequired: ['React', 'Next.js', 'Tailwind CSS', 'Redux'],
        status: 'open',
        createdAt: new Date().toISOString(),
        postedTimeAgo: '2 hours ago'
    },
    {
        id: 'job-2',
        clientId: 'client-2',
        clientName: 'Startup Studio',
        title: 'Mobile App UI Design',
        description: 'Need a creative UI/UX designer to design screens for a fintech mobile app. Deliverables should be in Figma.',
        budget: 800,
        budgetType: 'fixed',
        deadline: '2023-11-20',
        skillsRequired: ['Figma', 'UI/UX', 'Mobile Design'],
        status: 'open',
        createdAt: new Date().toISOString(),
        postedTimeAgo: '5 hours ago'
    },
    {
        id: 'job-3',
        clientId: 'client-3',
        clientName: 'Green Energy Co.',
        title: 'Blockchain Smart Contract Developer',
        description: 'Developing a token for a renewable energy project. Solidity expertise required.',
        budget: 5000,
        budgetType: 'fixed',
        deadline: '2024-01-15',
        skillsRequired: ['Solidity', 'Ethereum', 'Web3.js'],
        status: 'open',
        createdAt: new Date().toISOString(),
        postedTimeAgo: '1 day ago'
    },
    {
        id: 'job-4',
        clientId: 'client-1',
        clientName: 'TechCorp Inc.',
        title: 'Fix API Performance Issues',
        description: 'Our Node.js API is experiencing high latency. We need an expert to optimize database queries and implement caching.',
        budget: 60,
        budgetType: 'hourly',
        deadline: '2023-11-10',
        skillsRequired: ['Node.js', 'PostgreSQL', 'Redis'],
        status: 'in-progress',
        createdAt: new Date().toISOString(),
        postedTimeAgo: '3 days ago'
    },
    {
        id: 'job-5',
        clientId: 'client-4',
        clientName: 'FinSight Analytics',
        title: 'Python Data Scraper Needed',
        description: 'Looking for a Python expert to build a robust web scraper for financial news sites. Data needs to be cleaned and stored in MongoDB.',
        budget: 300,
        budgetType: 'fixed',
        deadline: '2023-11-25',
        skillsRequired: ['Python', 'BeautifulSoup', 'MongoDB', 'Scrapy'],
        status: 'open',
        createdAt: new Date().toISOString(),
        postedTimeAgo: '4 hours ago'
    },
    {
        id: 'job-6',
        clientId: 'client-5',
        clientName: 'Creative Wonders',
        title: 'Logo Design for New Coffee Brand',
        description: 'We need a minimalist logo for our organic coffee brand. Earthy tones and modern typography desired.',
        budget: 200,
        budgetType: 'fixed',
        deadline: '2023-11-15',
        skillsRequired: ['Graphic Design', 'Illustrator', 'Branding'],
        status: 'open',
        createdAt: new Date().toISOString(),
        postedTimeAgo: '6 hours ago'
    },
    {
        id: 'job-7',
        clientId: 'client-2',
        clientName: 'Startup Studio',
        title: 'Senior DevOps Engineer',
        description: 'Set up a CI/CD pipeline using GitHub Actions and AWS. ECS/Fargate experience is a must.',
        budget: 120,
        budgetType: 'hourly',
        deadline: '2023-11-30',
        skillsRequired: ['AWS', 'DevOps', 'Docker', 'GitHub Actions'],
        status: 'open',
        createdAt: new Date().toISOString(),
        postedTimeAgo: '12 hours ago'
    },
    {
        id: 'job-8',
        clientId: 'client-6',
        clientName: 'EduLearn Systems',
        title: 'LMS Platform Maintenance',
        description: 'Ongoing maintenance for a Moodle-based LMS. PHP and MySQL skills required.',
        budget: 45,
        budgetType: 'hourly',
        deadline: '2023-12-30',
        skillsRequired: ['PHP', 'Moodle', 'MySQL'],
        status: 'open',
        createdAt: new Date().toISOString(),
        postedTimeAgo: '1 day ago'
    },
    {
        id: 'job-9',
        clientId: 'client-7',
        clientName: 'HealthPlus',
        title: 'React Native Developer for Fitness App',
        description: 'Build new features for our existing fitness tracking app. Integration with Apple HealthKit required.',
        budget: 2500,
        budgetType: 'fixed',
        deadline: '2024-01-01',
        skillsRequired: ['React Native', 'Mobile Development', 'HealthKit'],
        status: 'open',
        createdAt: new Date().toISOString(),
        postedTimeAgo: '2 days ago'
    },
    {
        id: 'job-10',
        clientId: 'client-3',
        clientName: 'Green Energy Co.',
        title: 'Sustainability Report Writer',
        description: 'Write a comprehensive annual sustainability report. Technical writing and environmental science background preferred.',
        budget: 1000,
        budgetType: 'fixed',
        deadline: '2023-12-10',
        skillsRequired: ['Technical Writing', 'Copywriting', 'Research'],
        status: 'open',
        createdAt: new Date().toISOString(),
        postedTimeAgo: '2 days ago'
    }
];



// --- API Simulation ---

const DELAY_MS = 300; // Decreased delay for snappier feel

const delay = () => new Promise((resolve) => setTimeout(resolve, DELAY_MS));

// Helper to access localStorage safely (client-side only)
const getStorage = <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
};

const setStorage = (key: string, value: unknown) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
};

export const api = {
    // Auth
    login: async (email: string): Promise<User> => {
        await delay();
        let user = getStorage<User | null>('currentUser', null);

        if (email.includes('client')) {
            user = MOCK_USERS[0];
        } else {
            user = MOCK_USERS[1];
        }
        setStorage('currentUser', user);
        return user;
    },

    getCurrentUser: (): User | null => {
        return getStorage<User | null>('currentUser', null);
    },

    logout: async () => {
        await delay();
        if (typeof window !== 'undefined') {
            localStorage.removeItem('currentUser');
        }
    },

    setRole: async (role: UserRole): Promise<User | null> => {
        await delay();
        const user = getStorage<User | null>('currentUser', null);
        if (user) {
            const updatedUser = { ...user, role };
            setStorage('currentUser', updatedUser);
            return updatedUser;
        }
        return null;
    },

    // Jobs
    getJobs: async (filter?: JobFilter): Promise<Job[]> => {
        await delay();

        let jobs = getStorage<Job[]>('jobs', []);
        if (jobs.length === 0) {
            jobs = MOCK_JOBS;
            // Don't persist MOCK_JOBS to storage permanently if we want to add new ones on refresh during dev
            // But for this "simulation" let's just use MOCK_JOBS as base if empty
        }

        // Apply filters
        let filteredJobs = [...jobs];

        if (filter?.searchTerm) {
            const lowerTerm = filter.searchTerm.toLowerCase();
            filteredJobs = filteredJobs.filter((j: Job) =>
                j.title.toLowerCase().includes(lowerTerm) ||
                j.description.toLowerCase().includes(lowerTerm) ||
                j.skillsRequired.some(s => s.toLowerCase().includes(lowerTerm))
            );
        }

        if (filter?.budgetType && filter.budgetType !== 'all') {
            filteredJobs = filteredJobs.filter(j => j.budgetType === filter.budgetType);
        }

        if (filter?.minBudget) {
            filteredJobs = filteredJobs.filter(j => j.budget >= filter.minBudget!);
        }

        if (filter?.maxBudget) {
            filteredJobs = filteredJobs.filter(j => j.budget <= filter.maxBudget!);
        }

        // Sort by newest by default (simulated by just reverse order of mocks usually but let's do nothing for now)
        return filteredJobs;
    },

    getJobById: async (id: string): Promise<Job | null> => {
        await delay();
        const jobs = getStorage<Job[]>('jobs', MOCK_JOBS);
        return jobs.find((j: Job) => j.id === id) || null;
    },

    postJob: async (jobData: Partial<Job>): Promise<Job> => {
        await delay();
        const user = getStorage<User | null>('currentUser', null);
        if (!user) throw new Error("Unauthorized");

        const newJob: Job = {
            id: `job-${Date.now()}`,
            clientId: user.id,
            clientName: user.name,
            title: jobData.title!,
            description: jobData.description!,
            budget: jobData.budget!,
            budgetType: jobData.budgetType || 'fixed',
            deadline: jobData.deadline!,
            skillsRequired: jobData.skillsRequired || [],
            status: 'open',
            createdAt: new Date().toISOString(),
            postedTimeAgo: 'Just now'
        };

        const jobs = getStorage<Job[]>('jobs', MOCK_JOBS);
        const updatedJobs = [newJob, ...jobs];
        setStorage('jobs', updatedJobs);
        return newJob;
    },

    getClientJobs: async (clientId: string): Promise<Job[]> => {
        await delay();
        const jobs = getStorage<Job[]>('jobs', MOCK_JOBS);
        return jobs.filter((j: Job) => j.clientId === clientId);
    },

    // Applications
    applyToJob: async (jobId: string, coverLetter: string, bidAmount: number): Promise<Application> => {
        await delay();
        const user = getStorage<User | null>('currentUser', null);
        if (!user) throw new Error("Unauthorized");

        const newApp: Application = {
            id: `app-${Date.now()}`,
            jobId,
            freelancerId: user.id,
            freelancerName: user.name,
            coverLetter,
            bidAmount,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        const apps = getStorage<Application[]>('applications', []);
        setStorage('applications', [...apps, newApp]);
        return newApp;
    },

    getApplicationsForJob: async (jobId: string): Promise<Application[]> => {
        await delay();
        const apps = getStorage<Application[]>('applications', []);
        return apps.filter((a: Application) => a.jobId === jobId);
    },

    getFreelancerApplications: async (freelancerId: string): Promise<Application[]> => {
        await delay();
        const apps = getStorage<Application[]>('applications', []);
        return apps.filter((a: Application) => a.freelancerId === freelancerId);
    }
};