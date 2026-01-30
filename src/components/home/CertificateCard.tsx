"use client";

import { Award, ArrowRight, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function CertificateCard() {
    const router = useRouter();

    const handleClick = () => {
        router.push('/certificate');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={handleClick}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-2xl cursor-pointer h-full min-h-[300px] flex flex-col"
        >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
            <div className="absolute -left-20 -top-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors duration-500" />

            <div className="relative z-10 p-8 flex flex-col h-full">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 w-fit mb-6">
                    <Download size={14} />
                    <span>Now Available</span>
                </div>

                <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-primary transition-colors">
                    HackFiesta <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Certificate</span>
                </h3>

                <p className="text-slate-400 text-lg mb-8 flex-grow">
                    Official participation certificates are ready. Verify your identity and download your certificate instantly.
                </p>

                <div className="flex items-center gap-2 text-white font-semibold group-hover:translate-x-2 transition-transform duration-300 mt-auto">
                    Get Certificate <ArrowRight size={20} className="text-primary" />
                </div>
            </div>

            {/* Decorative Icon */}
            <Award
                className="absolute -bottom-6 -right-6 text-white/5 group-hover:text-white/10 transition-colors duration-500 transform -rotate-12 group-hover:rotate-0 group-hover:scale-110"
                size={180}
                strokeWidth={1}
            />
        </motion.div>
    );
}
