// src/components/profile/PathProgressSection.tsx
'use client';

import type { PathProgress } from '@/types/portfolio';

interface Props {
  paths: PathProgress[];
}

const PATH_COLORS: Record<string, string> = {
  Frontend: 'from-[#4F9EFF] to-[#818CF8]',
  Backend: 'from-[#34D399] to-[#10B981]',
  Database: 'from-[#FBBF24] to-[#F59E0B]',
  DevOps: 'from-[#F472B6] to-[#EC4899]',
  Mobile: 'from-[#A78BFA] to-[#8B5CF6]',
  default: 'from-[#60A5FA] to-[#3B82F6]',
};

function getColor(pathName: string): string {
  for (const key of Object.keys(PATH_COLORS)) {
    if (pathName.toLowerCase().includes(key.toLowerCase()))
      return PATH_COLORS[key];
  }
  return PATH_COLORS.default;
}

export function PathProgressSection({ paths }: Props) {
  if (!paths?.length) return null;

  return (
    <section>
      <SectionTitle icon="⚡" title="Dev Progress" />
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {paths.map((path) => (
          <PathCard key={path.pathId} path={path} />
        ))}
      </div>
    </section>
  );
}

function PathCard({ path }: { path: PathProgress }) {
  const color = getColor(path.pathName);
  const pct = Math.min(100, Math.round(path.percentage));

  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-5">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-semibold text-white">
          {path.pathName}
        </span>
        <span className="text-xs font-mono text-gray-400">
          {path.completedNodes}/{path.totalNodes} nodes
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <p
        className={`mt-2 text-right text-sm font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}
      >
        {pct}% Complete
      </p>
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xl">{icon}</span>
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
    </div>
  );
}
