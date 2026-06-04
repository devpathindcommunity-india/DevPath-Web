"use client";
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import RankingsTable from '@/components/certificate/RankingsTable';

export default function CertificatePage() {
    return (
        <div className="min-h-screen bg-surface-deep text-white relative flex flex-col items-center">
            {/* Background Gradients */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="w-full pt-24 pb-12 px-4 relative z-10 flex flex-col items-center gap-12">
                <div className="max-w-6xl mx-auto w-full flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6 max-w-3xl"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium mx-auto">
                            <Award size={16} />
                            <span>Event Completed</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                HackFiesta Rankings
                            </span>
                        </h1>
                        <p className="text-xl text-slate-400 font-light">
                            National Level 24-Hour Online Hackathon Results
                        </p>
                        <p className="text-slate-500 text-md leading-relaxed">
                            Congratulations to all participants! Check out the final standings and project scores below.
                        </p>
                    </motion.div>
                </div>

                {/* Rankings Section */}
                <div className="w-full max-w-6xl mx-auto relative z-10">
                    <RankingsTable />
                </div>
            </div>
        </div>
    );
}
