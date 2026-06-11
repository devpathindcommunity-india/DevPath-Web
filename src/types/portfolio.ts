// src/types/portfolio.ts
// JSON Resume standard: https://jsonresume.org/schema/

export interface UserPortfolioProfile {
  userId: string;
  username: string;
  isPublic: boolean;
  tagline: string;
  displayName: string;
  avatarUrl?: string;
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  // Auto-aggregated from roadmap progress
  skills: PortfolioSkill[];
  // Auto-compiled from project-verified nodes
  projects: PortfolioProject[];
  // Path completions
  paths: PathProgress[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PortfolioSkill {
  nodeId: string;
  skillName: string;
  category: string; // e.g., "Frontend", "Database", "DevOps"
  level?: 'beginner' | 'intermediate' | 'advanced';
  completedAt: Date;
}

export interface PortfolioProject {
  nodeId: string;
  projectName: string;
  description: string;
  githubUrl: string;
  liveUrl?: string;
  techStack?: string[];
  completedAt: Date;
}

export interface PathProgress {
  pathId: string;
  pathName: string;
  completedNodes: number;
  totalNodes: number;
  percentage: number;
}

// JSON Resume standard schema
export interface JSONResume {
  basics: {
    name: string;
    label: string;
    email?: string;
    url?: string;
    summary: string;
    profiles: Array<{
      network: string;
      username: string;
      url: string;
    }>;
  };
  skills: Array<{
    name: string;
    level: string;
    keywords: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    highlights: string[];
    url?: string;
    roles: string[];
    entity?: string;
    type: string;
  }>;
  meta: {
    canonical: string;
    version: string;
    lastModified: string;
  };
}
