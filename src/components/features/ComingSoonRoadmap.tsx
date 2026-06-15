'use client';

import React, { useState } from 'react';
import { Bell, ArrowLeft, Mail, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface ComingSoonRoadmapProps {
  title: string;
  techDetails: string;
}

export default function ComingSoonRoadmap({ title, techDetails }: ComingSoonRoadmapProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-xl z-10 space-y-8">
        {/* Back Link */}
        <Link
          href="/paths"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Learning Paths</span>
        </Link>

        {/* Card */}
        <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-primary to-purple-500"></div>

          {!isSubmitted ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-2">
                  <Sparkles size={12} />
                  Roadmap Under Construction
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                  {title}
                </h1>
                <p className="text-sm text-slate-400 leading-relaxed">
                  We are currently crafting a comprehensive curriculum for <strong className="text-slate-200">{title}</strong>. This roadmap will outline step-by-step topics, milestones, and guided project recommendations.
                </p>
              </div>

              {/* Stack Preview */}
              <div className="p-4 bg-slate-900/30 border border-slate-900 rounded-xl space-y-1.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Curriculum Highlights</span>
                <p className="text-sm text-emerald-400 font-semibold">{techDetails}</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="email" className="text-xs font-semibold text-slate-400">
                    Get notified when this roadmap launches
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:border-primary focus:outline-none transition-colors text-white placeholder:text-slate-600"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Bell size={16} />
                  <span>Notify Me</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-3xl mx-auto animate-bounce">
                ✨
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">You&apos;re on the list!</h3>
                <p className="text-sm text-slate-400 max-w-sm mx-auto">
                  Thank you! We have registered your email <strong className="text-slate-200">{email}</strong>. We will reach out as soon as the <strong className="text-slate-200">{title}</strong> learning path is published.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="px-6 py-2 border border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/60 rounded-xl text-xs font-semibold transition-colors"
              >
                Change Email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
