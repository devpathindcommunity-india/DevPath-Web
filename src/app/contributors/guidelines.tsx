'use client';

import React, { useState } from 'react';
import {
  Users,
  GitBranch,
  Code,
  ShieldCheck,
  BookOpen,
  Lightbulb,
  Bug,
  Star,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const sections: Section[] = [
  {
    id: 'code-of-conduct',
    title: 'Code of Conduct',
    icon: <ShieldCheck className="w-5 h-5" />,
  },
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    id: 'environment',
    title: 'Environment Setup',
    icon: <Code className="w-5 h-5" />,
  },
  {
    id: 'running',
    title: 'Running the Project',
    icon: <GitBranch className="w-5 h-5" />,
  },
  {
    id: 'branching',
    title: 'Branch Naming',
    icon: <GitBranch className="w-5 h-5" />,
  },
  {
    id: 'making-changes',
    title: 'Making Changes',
    icon: <Users className="w-5 h-5" />,
  },
  {
    id: 'commits',
    title: 'Commit Guidelines',
    icon: <Code className="w-5 h-5" />,
  },
  { id: 'pr', title: 'Pull Requests', icon: <Star className="w-5 h-5" /> },
  { id: 'bugs', title: 'Reporting Bugs', icon: <Bug className="w-5 h-5" /> },
  {
    id: 'features',
    title: 'Suggesting Features',
    icon: <Lightbulb className="w-5 h-5" />,
  },
  {
    id: 'gssoc',
    title: 'GSSoC Guidelines',
    icon: <Users className="w-5 h-5" />,
  },
];

export default function GuidelinesPage() {
  const [activeSection, setActiveSection] = useState('code-of-conduct');
  const [copied, setCopied] = useState(false);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl mb-6 border border-white/20">
              <Users className="w-8 h-8" />
              <span className="text-lg font-medium">Community First</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-6">
              Contribution{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                Guidelines
              </span>
            </h1>
            <p className="max-w-2xl text-xl text-white/80 mb-10">
              Welcome to DevPath Web. Every contribution matters. Follow these
              guidelines to help us build a better platform together.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => scrollToSection('code-of-conduct')}
                className="bg-white text-black px-8 py-4 rounded-2xl font-semibold flex items-center gap-3 hover:bg-white/90 transition-all active:scale-95"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </button>
              <a
                href="https://github.com/devpathindcommunity-india/DevPath-Web"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/30 hover:bg-white/10 px-8 py-4 rounded-2xl font-medium transition-all flex items-center gap-3"
              >
                View Repository
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 flex gap-12">
        {/* LEFT COLUMN - Navigation Sidebar */}
        <div className="w-80 hidden lg:block sticky top-8 self-start">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <div className="uppercase text-xs tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              NAVIGATION
            </div>

            <div className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left px-5 py-4 rounded-2xl flex items-center gap-3 transition-all group ${
                    activeSection === section.id
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                      : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="text-violet-400 group-hover:text-violet-300 transition-colors">
                    {section.icon}
                  </div>
                  <span className="font-medium">{section.title}</span>
                </button>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-zinc-800">
              <div className="flex items-center gap-4 text-sm text-zinc-400">
                <div className="bg-zinc-800 h-px flex-1"></div>
                <span>Quick Links</span>
                <div className="bg-zinc-800 h-px flex-1"></div>
              </div>

              <div className="mt-6 space-y-4 text-sm">
                <a
                  href="#code-of-conduct"
                  className="block hover:text-white transition-colors flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Our Values
                </a>
                <a
                  href="https://github.com/devpathindcommunity-india/DevPath-Web/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-white transition-colors flex items-center gap-2"
                >
                  <Bug className="w-4 h-4" /> Report an Issue
                </a>
                <a
                  href="https://github.com/devpathindcommunity-india/DevPath-Web/pulls"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-white transition-colors flex items-center gap-2"
                >
                  <Star className="w-4 h-4" /> Open PRs
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Main Content */}
        <div className="flex-1 space-y-24 max-w-3xl">
          {/* Code of Conduct */}
          <section id="code-of-conduct" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-violet-500/10 text-violet-400 p-3 rounded-2xl">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <div className="uppercase tracking-widest text-xs text-violet-400">
                  First Things First
                </div>
                <h2 className="text-4xl font-bold tracking-tight">
                  Code of Conduct
                </h2>
              </div>
            </div>

            <div className="prose prose-invert prose-zinc max-w-none">
              <p className="text-xl text-zinc-300">
                We pledge to make participation in our community a
                harassment-free experience for everyone.
              </p>

              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 my-12">
                <h3 className="text-2xl font-semibold mb-8">Our Pledge</h3>
                <p className="text-lg leading-relaxed">
                  We as members, contributors, and leaders pledge to make
                  participation in our community a harassment-free experience
                  for everyone, regardless of age, body size, visible or
                  invisible disability, ethnicity, sex characteristics, gender
                  identity and expression, level of experience, education,
                  socio-economic status, nationality, personal appearance, race,
                  caste, color, religion, or sexual identity and orientation.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-zinc-900/70 border border-emerald-900/50 rounded-3xl p-8">
                  <h4 className="font-semibold mb-6 text-emerald-400 flex items-center gap-2">
                    ✅ Positive Behaviors
                  </h4>
                  <ul className="space-y-4 text-sm">
                    <li className="flex gap-3">
                      • Demonstrating empathy and kindness
                    </li>
                    <li className="flex gap-3">
                      • Respecting differing opinions
                    </li>
                    <li className="flex gap-3">
                      • Giving and accepting constructive feedback
                    </li>
                    <li className="flex gap-3">
                      • Focusing on the community’s best interest
                    </li>
                  </ul>
                </div>

                <div className="bg-zinc-900/70 border border-rose-900/50 rounded-3xl p-8">
                  <h4 className="font-semibold mb-6 text-rose-400 flex items-center gap-2">
                    ❌ Unacceptable Behaviors
                  </h4>
                  <ul className="space-y-4 text-sm">
                    <li className="flex gap-3">
                      • Sexualized language or imagery
                    </li>
                    <li className="flex gap-3">
                      • Trolling, insults, or personal attacks
                    </li>
                    <li className="flex gap-3">
                      • Harassment or publishing private info
                    </li>
                    <li className="flex gap-3">
                      • Any inappropriate professional conduct
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Getting Started */}
          <section id="getting-started" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-amber-500/10 text-amber-400 p-3 rounded-2xl">
                <BookOpen className="w-8 h-8" />
              </div>
              <h2 className="text-4xl font-bold tracking-tight">
                Getting Started
              </h2>
            </div>

            <div className="bg-zinc-900 rounded-3xl p-10 border border-zinc-800">
              <h3 className="text-2xl font-semibold mb-6">Prerequisites</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['Git', 'Node.js (LTS)', 'npm', 'VS Code (recommended)'].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex items-center gap-4 bg-zinc-950 rounded-2xl px-6 py-5 border border-zinc-800"
                    >
                      <CheckCircle className="w-6 h-6 text-emerald-500" />
                      <span className="font-medium">{item}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </section>

          {/* Environment Setup */}
          <section id="environment" className="scroll-mt-24">
            <h2 className="text-4xl font-bold tracking-tight mb-10">
              Environment Setup
            </h2>

            <div className="space-y-8">
              <div>
                <div className="font-mono bg-black p-5 rounded-2xl border border-zinc-800 mb-3 flex items-center justify-between group">
                  <code className="text-emerald-400">npm install</code>
                  <button
                    onClick={() => copyCommand('npm install')}
                    className="text-xs bg-zinc-900 px-4 py-2 rounded-xl opacity-70 hover:opacity-100 transition"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-sm text-zinc-400">
                  Install all project dependencies
                </p>
              </div>

              <div>
                <div className="font-mono bg-black p-5 rounded-2xl border border-zinc-800 mb-3 flex items-center justify-between group">
                  <code>cp .env.example .env.local</code>
                  <button
                    onClick={() => copyCommand('cp .env.example .env.local')}
                    className="text-xs bg-zinc-900 px-4 py-2 rounded-xl opacity-70 hover:opacity-100 transition"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-sm text-zinc-400">
                  Copy environment variables (Windows users: use Copy-Item)
                </p>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 p-8 rounded-3xl text-amber-400">
                <strong>Important:</strong> Never commit your{' '}
                <code>.env.local</code> file or any secret keys.
              </div>
            </div>
          </section>

          {/* Running the Project */}
          <section id="running" className="scroll-mt-24">
            <h2 className="text-4xl font-bold tracking-tight mb-8">
              Running the Project
            </h2>
            <div className="font-mono bg-zinc-950 border border-zinc-800 p-10 rounded-3xl space-y-6">
              <div className="flex items-center gap-6">
                <div className="bg-emerald-500/10 text-emerald-400 px-5 py-2 rounded-2xl">
                  npm run dev
                </div>
                <span className="text-zinc-400">
                  — Start development server
                </span>
              </div>
              <div className="text-2xl font-light text-white/60">
                Visit → http://localhost:3000
              </div>
            </div>
          </section>

          {/* Branch Naming & Making Changes */}
          <section id="branching" className="scroll-mt-24">
            <h2 className="text-4xl font-bold tracking-tight mb-8">
              Branch Naming Conventions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { type: 'feature', example: 'feature/add-events-section' },
                { type: 'fix', example: 'fix/navbar-mobile-menu' },
                { type: 'docs', example: 'docs/contributing-guide' },
                { type: 'chore', example: 'chore/update-dependencies' },
              ].map((item) => (
                <div
                  key={item.type}
                  className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-violet-500/50 transition-colors"
                >
                  <div className="text-violet-400 font-mono mb-2">
                    {item.type}:
                  </div>
                  <div className="font-medium text-lg">{item.example}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Commit & PR Guidelines */}
          <section id="commits" className="scroll-mt-24">
            <h2 className="text-4xl font-bold tracking-tight mb-8">
              Commit Message Guidelines
            </h2>
            <div className="bg-zinc-900 p-10 rounded-3xl border border-zinc-800">
              <div className="font-mono text-lg mb-6 text-violet-400">
                type: short description
              </div>
              <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm">
                <div>feat: new feature</div>
                <div>fix: bug fix</div>
                <div>docs: documentation</div>
                <div>style: formatting</div>
                <div>refactor: code restructure</div>
                <div>chore: maintenance</div>
              </div>
            </div>
          </section>

          <section id="pr" className="scroll-mt-24">
            <h2 className="text-4xl font-bold tracking-tight mb-8">
              Pull Request Guidelines
            </h2>
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-violet-500/30 rounded-3xl p-12">
              <h3 className="text-2xl mb-8">PR Checklist</h3>
              <ul className="space-y-6">
                {[
                  'Branch updated with latest master',
                  'Project runs locally without errors',
                  'Linting passed',
                  'Changes focused only on assigned issue',
                  'No sensitive files committed',
                  'Self-reviewed changes',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="mt-1 w-6 h-6 bg-emerald-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Bugs & Features */}
          <section id="bugs" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-8">
              <Bug className="w-9 h-9 text-rose-400" />
              <h2 className="text-4xl font-bold tracking-tight">
                Reporting Bugs
              </h2>
            </div>
            <div className="text-zinc-400 leading-relaxed">
              Provide clear title, reproduction steps, expected vs actual
              behavior, screenshots, and device info.
            </div>
          </section>

          <section id="features" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-8">
              <Lightbulb className="w-9 h-9 text-amber-400" />
              <h2 className="text-4xl font-bold tracking-tight">
                Suggesting Features
              </h2>
            </div>
            <p className="text-zinc-300">
              Describe the feature, why it’s useful, possible implementation,
              and include visuals if possible.
            </p>
          </section>

          {/* GSSoC */}
          <section
            id="gssoc"
            className="scroll-mt-24 bg-zinc-900 border border-amber-500/20 rounded-3xl p-12"
          >
            <h2 className="text-4xl font-bold tracking-tight mb-10 flex items-center gap-4">
              <span>GSSoC Contributor Guidelines</span>
              <span className="text-xs bg-amber-500 text-black px-3 py-1 rounded-full font-mono">
                2026
              </span>
            </h2>

            <ul className="space-y-6 text-lg">
              <li className="flex gap-4">
                <span className="text-amber-400 font-mono">01</span> Get
                assigned before working
              </li>
              <li className="flex gap-4">
                <span className="text-amber-400 font-mono">02</span> One issue
                at a time
              </li>
              <li className="flex gap-4">
                <span className="text-amber-400 font-mono">03</span> Original
                work only
              </li>
              <li className="flex gap-4">
                <span className="text-amber-400 font-mono">04</span> Respectful
                communication
              </li>
            </ul>
          </section>

          <div className="pt-16 border-t border-zinc-800 text-center text-zinc-500">
            Thank you for contributing to{' '}
            <span className="text-white">DevPath Web</span>. Together we build
            better tools for developers.
          </div>
        </div>
      </div>
    </div>
  );
}
