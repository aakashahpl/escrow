
import Link from 'next/link';
import { Briefcase, Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-white mb-4">
                            <Briefcase className="w-6 h-6 text-emerald-500" />
                            <span>WorkSphere</span>
                        </Link>
                        <p className="text-sm leading-relaxed">
                            The world&apos;s most advanced decentralized freelance marketplace. Connect, collaborate, and get paid securely.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">For Clients</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:text-emerald-500 transition-colors">How to hire</Link></li>
                            <li><Link href="#" className="hover:text-emerald-500 transition-colors">Talent Marketplace</Link></li>
                            <li><Link href="#" className="hover:text-emerald-500 transition-colors">Payroll Services</Link></li>
                            <li><Link href="#" className="hover:text-emerald-500 transition-colors">Hire Worldwide</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">For Talent</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:text-emerald-500 transition-colors">How to find work</Link></li>
                            <li><Link href="#" className="hover:text-emerald-500 transition-colors">Direct Contracts</Link></li>
                            <li><Link href="#" className="hover:text-emerald-500 transition-colors">Find Freelance Jobs</Link></li>
                            <li><Link href="#" className="hover:text-emerald-500 transition-colors">Creator Rewards</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Company</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:text-emerald-500 transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-emerald-500 transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-emerald-500 transition-colors">Press</Link></li>
                            <li><Link href="#" className="hover:text-emerald-500 transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-800">
                    <p className="text-sm">&copy; 2024 WorkSphere Global Inc.</p>
                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                        <a href="#" className="hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
                        <a href="#" className="hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
