"use client";
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Award, Loader2, AlertCircle } from 'lucide-react';
import { PARTICIPANTS } from '@/data/participants';

export default function CertificatePage() {
    const [name, setName] = useState('');
    const [status, setStatus] = useState<'idle' | 'verifying' | 'verified' | 'generating' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setStatus('verifying');

        // Simulate Verification Delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Normalize input and data for comparison
        const normalizedInput = name.trim().toLowerCase();
        const participant = PARTICIPANTS.find(p =>
            p.name.toLowerCase() === normalizedInput
        );

        if (!participant) {
            setStatus('error');
            return;
        }

        // Success: Verified
        setStatus('verified');
        await new Promise(resolve => setTimeout(resolve, 2000)); // Show verified state

        // Start Generating
        setStatus('generating');

        try {
            await generateCertificateImage(participant);
            setStatus('idle');
        } catch (err) {
            console.error(err);
            setError("Failed to generate certificate. Please try again.");
            setStatus('idle');
        }
    };

    const generateCertificateImage = (participant: typeof PARTICIPANTS[0]) => {
        return new Promise<void>((resolve, reject) => {
            const canvas = canvasRef.current;
            if (!canvas) return reject("Canvas not found");

            const ctx = canvas.getContext('2d');
            if (!ctx) return reject("Context not found");

            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = "/certificate-template.png";

            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;

                // Draw Template
                ctx.drawImage(img, 0, 0);

                // Common settings
                ctx.textBaseline = 'bottom';
                ctx.fillStyle = '#000000';

                // 1. Participant Name
                // Font: 45px "Times New Roman" (scaling down if long)
                // Position: X = center, Y = 435
                let nameFontSize = 45;
                if (participant.name.length > 20) nameFontSize = 38;

                ctx.font = `${nameFontSize}px "Times New Roman", serif`;
                ctx.textAlign = 'center';
                ctx.fillText(participant.name, canvas.width / 2, 435);

                // 2. Team Name
                // Font: 32px "Times New Roman"
                // Position: X = 280, Y = 480
                // Logic based on legacy code: Left aligned at 300 (adjusted to 280)
                const teamName = participant.team || '-';

                let teamFontSize = 32;
                ctx.font = `${teamFontSize}px "Times New Roman", serif`;
                ctx.textAlign = 'left';

                // Auto-scale team name if too long (width > 250px)
                const maxTeamWidth = 250;
                let teamWidth = ctx.measureText(teamName).width;
                while (teamWidth > maxTeamWidth && teamFontSize > 12) {
                    teamFontSize -= 2;
                    ctx.font = `${teamFontSize}px "Times New Roman", serif`;
                    teamWidth = ctx.measureText(teamName).width;
                }

                ctx.fillText(teamName, 280, 480);

                // Create Download Link
                const link = document.createElement('a');
                link.download = `HackFiesta_Certificate_${participant.name.replace(/\s+/g, '_')}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
                resolve();
            };

            img.onerror = () => reject("Failed to load template");
        });
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-[#0B0F19] text-white relative overflow-hidden flex items-center">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-6xl mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                {/* Left Column: Event Details */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-8 text-center lg:text-left"
                >
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium">
                            <Award size={16} />
                            <span>Event Completed</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                HackFiesta
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-300 font-light">
                            National Level 24-Hour Online Hackathon
                        </p>
                        <p className="text-slate-400 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                            We celebrated innovation, code, and community. Developers from across the nation came together to build solutions for the future. Thank you for being part of this journey!
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                            <div className="text-3xl font-bold text-white mb-1">650+</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Applications</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                            <div className="text-3xl font-bold text-white mb-1">64</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Projects</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                            <div className="text-3xl font-bold text-white mb-1">4.5</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Rating</div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Column: Certificate Form */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="bg-black/40 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden group min-h-[400px] flex flex-col justify-center">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                        <AnimatePresence mode='wait'>
                            {status === 'idle' && (
                                <motion.div
                                    key="idle"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="space-y-6 relative"
                                >
                                    <div className="text-center space-y-4 mb-8">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-purple-600 p-[1px] mx-auto">
                                            <div className="w-full h-full rounded-2xl bg-[#0B0F19] flex items-center justify-center">
                                                <Download className="text-white" size={32} />
                                            </div>
                                        </div>
                                        <h2 className="text-2xl font-bold text-white">Get Your Certificate</h2>
                                        <p className="text-slate-400 text-sm">
                                            Enter your registered name to generate your official certificate of participation.
                                        </p>
                                    </div>

                                    <form onSubmit={handleGenerate} className="space-y-6">
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
                                            <div className="relative">
                                                <input
                                                    id="name"
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="e.g. Vaibhav Kaushik"
                                                    required
                                                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-slate-600 text-white pl-11"
                                                />
                                                <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={!name.trim()}
                                            className="w-full h-14 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
                                        >
                                            Generate Now <Download size={20} />
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {status === 'verifying' && (
                                <motion.div
                                    key="verifying"
                                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                    className="flex flex-col items-center justify-center space-y-6 py-8"
                                >
                                    <div className="relative w-24 h-24">
                                        <div className="absolute inset-0 rounded-full border-4 border-slate-700" />
                                        <motion.div
                                            className="absolute inset-0 rounded-full border-t-4 border-primary"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        />
                                        <div className="absolute inset-4 rounded-full bg-primary/20 flex items-center justify-center">
                                            <Award className="text-primary animate-pulse" size={40} />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-xl font-bold text-white mb-2">Verifying Authenticity</h3>
                                        <p className="text-slate-400">Checking hackathon records...</p>
                                    </div>
                                </motion.div>
                            )}

                            {status === 'verified' && (
                                <motion.div
                                    key="verified"
                                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                    className="flex flex-col items-center justify-center space-y-6 py-8"
                                >
                                    <div className="relative w-24 h-24 flex items-center justify-center bg-green-500/10 rounded-full">
                                        <motion.div
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{ pathLength: 1, opacity: 1 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                                                <motion.svg viewBox="0 0 24 24" className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth={3}>
                                                    <motion.path d="M20 6L9 17l-5-5" key="check" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.2 }} />
                                                </motion.svg>
                                            </div>
                                        </motion.div>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-2xl font-bold text-green-400 mb-2">Authenticity Verified</h3>
                                        <p className="text-slate-400">Record found! Proceeding...</p>
                                    </div>
                                </motion.div>
                            )}

                            {status === 'generating' && (
                                <motion.div
                                    key="generating"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center space-y-6 py-8"
                                >
                                    <div className="relative w-20 h-20">
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-purple-600 animate-spin blur-md opacity-50" />
                                        <div className="absolute inset-1 bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                                            <Loader2 className="animate-spin text-primary" size={40} />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-xl font-bold text-white mb-2">Generating Certificate</h3>
                                        <p className="text-slate-400">Personalizing your award...</p>
                                    </div>
                                </motion.div>
                            )}

                            {status === 'error' && (
                                <motion.div
                                    key="error"
                                    initial={{ opacity: 0, x: 0 }}
                                    animate={{ opacity: 1, x: [0, -10, 10, -10, 10, 0] }}
                                    transition={{ duration: 0.5 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center space-y-6 py-8"
                                >
                                    <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
                                        <AlertCircle className="text-red-500" size={48} />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-xl font-bold text-red-500 mb-2">Access Denied</h3>
                                        <p className="text-slate-300 text-lg">Let's Participate next time</p>
                                    </div>
                                    <button
                                        onClick={() => setStatus('idle')}
                                        className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors"
                                    >
                                        Try Again
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>
                </motion.div>

                {/* Hidden Canvas for Generation */}
                <canvas ref={canvasRef} className="hidden" />
            </div>
        </div>
    );
}
