import { Metadata } from 'next';
import SkillTreeVisualizer from '@/components/features/SkillTreeVisualizer';
import ComingSoonRoadmap from '@/components/features/ComingSoonRoadmap';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type Props = {
  params: Promise<{ id: string }>;
};

// Disable dynamic routes since this is a static build
export const dynamicParams = false;

interface RoadmapConfig {
  title: string;
  description: string;
  techDetails: string;
  isAvailable: boolean;
  visualizerPath?: 'Frontend' | 'Backend';
}

const ROADMAPS_CONFIG: Record<string, RoadmapConfig> = {
  frontend: {
    title: 'Frontend Developer Roadmap',
    description: 'Master modern frontend development with our curated step-by-step Frontend developer roadmap. Learn HTML/CSS, JavaScript, React, and Next.js.',
    techDetails: 'HTML/CSS, JavaScript, React, Next.js',
    isAvailable: true,
    visualizerPath: 'Frontend',
  },
  backend: {
    title: 'Backend Developer Roadmap',
    description: 'Learn backend engineering with our curated backend roadmap. Master databases, Node.js, and API development.',
    techDetails: 'Databases, Node.js, API design',
    isAvailable: true,
    visualizerPath: 'Backend',
  },
  devops: {
    title: 'DevOps Mastery Roadmap',
    description: 'DevOps learning path: Docker, Kubernetes, CI/CD, and AWS infrastructure.',
    techDetails: 'Docker & Kubernetes, CI/CD Pipelines, AWS Infrastructure',
    isAvailable: false,
  },
  'python-ai': {
    title: 'Python for AI Roadmap',
    description: 'Learn AI and machine learning: PyTorch, Neural Networks, and LLM Integration.',
    techDetails: 'PyTorch Fundamentals, Neural Networks, LLM Integration',
    isAvailable: false,
  },
  'full-stack-react': {
    title: 'Full Stack React Roadmap',
    description: 'Master Next.js App Router, Server Actions, PostgreSQL, and Prisma.',
    techDetails: 'Next.js App Router, Server Actions, PostgreSQL & Prisma',
    isAvailable: false,
  },
  'web3-development': {
    title: 'Web3 Development Roadmap',
    description: 'Step into Web3: Solidity Smart Contracts, Ethers.js, and DApp Architecture.',
    techDetails: 'Solidity Smart Contracts, Ethers.js, DApp Architecture',
    isAvailable: false,
  },
};

export async function generateStaticParams() {
  return Object.keys(ROADMAPS_CONFIG).map((id) => ({
    id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const config = ROADMAPS_CONFIG[resolvedParams.id];

  if (!config) {
    return {
      title: 'Roadmap Not Found | DevPath',
      description: 'The requested roadmap could not be found.',
    };
  }

  const fullTitle = `${config.title} | DevPath`;

  return {
    title: fullTitle,
    description: config.description,
    openGraph: {
      title: fullTitle,
      description: config.description,
      url: `https://devpath.community/roadmaps/${resolvedParams.id}`,
      siteName: 'DevPath',
      images: [
        {
          url: 'https://devpath.community/og-roadmaps.png',
          width: 1200,
          height: 630,
          alt: `${config.title} illustration on DevPath`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: config.description,
      images: ['https://devpath.community/og-roadmaps.png'],
    },
  };
}

export default async function RoadmapPage({ params }: Props) {
  const resolvedParams = await params;
  const config = ROADMAPS_CONFIG[resolvedParams.id];

  if (!config) {
    return (
      <div className="min-h-screen bg-[#0b0c10] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-extrabold text-white mb-2">Roadmap Not Found</h1>
        <p className="text-slate-400 text-sm mb-4">The requested roadmap does not exist.</p>
        <Link href="/paths" className="text-primary hover:underline text-sm">
          Return to Learning Paths
        </Link>
      </div>
    );
  }

  if (!config.isAvailable) {
    return <ComingSoonRoadmap title={config.title} techDetails={config.techDetails} />;
  }

  return (
    <main className="min-h-screen bg-[#0b0c10] pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col gap-2">
          <Link
            href="/paths"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group w-fit"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Paths</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-white mt-2">{config.title}</h1>
          <p className="text-sm text-slate-400 max-w-2xl">{config.description}</p>
        </div>

        <SkillTreeVisualizer initialPath={config.visualizerPath} />
      </div>
    </main>
  );
}
