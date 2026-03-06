
"use client";

import { AuthProvider } from "@/context/AuthContext";
import { Web3Provider } from "@/context/Web3Provider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Web3Provider>
            <AuthProvider>
                <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow pt-20 bg-gray-50/50">
                        {children}
                    </main>
                    <Footer />
                </div>
            </AuthProvider>
        </Web3Provider>
    );
}
