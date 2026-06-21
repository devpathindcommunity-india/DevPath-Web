// src/components/profile/ProjectShowcaseSection.tsx
'use client';

import { useState } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import type { PortfolioProject } from '@/types/portfolio';

interface Props {
  projects: PortfolioProject[];
}

const ITEMS_PER_PAGE = 6;

export function ProjectShowcaseSection({ projects }: Props) {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  if (!projects?.length) return null;

  const visibleProjects = projects.slice(0, visibleCount);
  const hasMore = visibleCount < projects.length;

  return (
    <section>
      <div className="flex items-center gap-2 mb-5">
        <span className="text-xl">🚀</span>
        <h2 className="text-xl font-bold tracking-tight">Project Showcase</h2>
        <span className="ml-1 px-2 py-0.5 rounded-full bg-white/10 text-xs font-mono text-gray-400">
          {projects.length} verified
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleProjects.map((project) => (
          <ProjectCard key={project.nodeId} project={project} />
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() =>
              setVisibleCount((prev) =>
                Math.min(prev + ITEMS_PER_PAGE, projects.length)
              )
            }
            className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm font-medium text-white transition-colors"
          >
            Load More ({projects.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </section>
  );
}

function ProjectCard({ project }: { project: PortfolioProject }) {
  return (
    <article className="group relative rounded-xl bg-white/5 border border-white/10 p-5 flex flex-col gap-3 hover:border-[#4F9EFF]/40 hover:bg-white/[0.07] transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-white leading-tight">
          {project.projectName}
        </h3>
        <span className="flex-shrink-0 px-1.5 py-0.5 text-[10px] font-mono rounded bg-[#4F9EFF]/20 text-[#4F9EFF]">
          verified
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 flex-1">
        {project.description}
      </p>

      {/* Tech stack pills */}
      {project.techStack && project.techStack.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-xs rounded-md bg-white/8 text-gray-400 font-mono"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span className="px-2 py-0.5 text-xs rounded-md bg-white/8 text-gray-400 font-mono">
              +{project.techStack.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Links */}
      <div className="flex items-center gap-3 pt-1 border-t border-white/10">
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <Github size={13} />
          Repo
        </a>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#4F9EFF] hover:text-white transition-colors"
          >
            <ExternalLink size={13} />
            Live Demo
          </a>
        )}
        <span className="ml-auto text-[10px] font-mono text-gray-600">
          {project.completedAt.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
          })}
        </span>
      </div>
    </article>
  );
}
