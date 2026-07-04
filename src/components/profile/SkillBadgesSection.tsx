// src/components/profile/SkillBadgesSection.tsx
'use client';

import type { PortfolioSkill } from '@/types/portfolio';

interface Props {
  skills: PortfolioSkill[];
}

const CATEGORY_COLORS: Record<
  string,
  { bg: string; text: string; ring: string }
> = {
  Frontend: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    ring: 'ring-blue-500/20',
  },
  Backend: {
    bg: 'bg-green-500/10',
    text: 'text-green-400',
    ring: 'ring-green-500/20',
  },
  Database: {
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-400',
    ring: 'ring-yellow-500/20',
  },
  DevOps: {
    bg: 'bg-pink-500/10',
    text: 'text-pink-400',
    ring: 'ring-pink-500/20',
  },
  Mobile: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    ring: 'ring-purple-500/20',
  },
  default: {
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
    ring: 'ring-sky-500/20',
  },
};

function getStyle(category: string) {
  return CATEGORY_COLORS[category] ?? CATEGORY_COLORS.default;
}

export function SkillBadgesSection({ skills }: Props) {
  if (!skills?.length) return null;

  // Group by category
  const grouped = skills.reduce<Record<string, PortfolioSkill[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  return (
    <section>
      <div className="flex items-center gap-2 mb-5">
        <span className="text-xl">🏅</span>
        <h2 className="text-xl font-bold tracking-tight">
          Verified Tech Stack
        </h2>
        <span className="ml-1 px-2 py-0.5 rounded-full bg-white/10 text-xs font-mono text-gray-400">
          {skills.length} skills
        </span>
      </div>

      <div className="space-y-5">
        {Object.entries(grouped).map(([category, catSkills]) => {
          const style = getStyle(category);
          return (
            <div key={category}>
              <h3
                className={`text-xs font-semibold uppercase tracking-widest mb-2 ${style.text}`}
              >
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {catSkills.map((skill) => (
                  <SkillBadge key={skill.nodeId} skill={skill} style={style} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SkillBadge({
  skill,
  style,
}: {
  skill: PortfolioSkill;
  style: { bg: string; text: string; ring: string };
}) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ring-1 ${style.bg} ${style.text} ${style.ring}`}
      title={`Verified ${skill.completedAt.toLocaleDateString()}`}
    >
      {/* checkmark */}
      <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 12 12" fill="none">
        <path
          d="M2 6l3 3 5-5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {skill.skillName}
    </div>
  );
}
