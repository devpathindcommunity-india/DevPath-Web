export interface Recommendation {
  id: string;
  trigger: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  icon: string;
  tag: string;
  priority: number;
}

const RULES: Recommendation[] = [
  {
    id: 'web-dev-project',
    trigger: 'web-development',
    title: 'Build your first web project',
    description:
      'You have been exploring the Web Dev pathway - try a beginner project to lock in what you have learned.',
    cta: 'Browse starter projects',
    href: '/paths',
    icon: 'laptop',
    tag: 'Recommended for you',
    priority: 1,
  },
  {
    id: 'open-source-issues',
    trigger: 'open-source',
    title: 'Find a beginner-friendly issue',
    description:
      'You have been checking out open-source - here are curated good first issue tickets waiting for you.',
    cta: 'Browse open issues',
    href: '/opensource',
    icon: 'code',
    tag: 'Good first issue',
    priority: 1,
  },
  {
    id: 'internship-resume',
    trigger: 'internships',
    title: 'Polish your resume before applying',
    description:
      'Spotted an internship? Make sure your resume is ready with our templates and review checklist.',
    cta: 'Resume resources',
    href: '/resources?topic=resume',
    icon: 'file',
    tag: 'Apply smarter',
    priority: 1,
  },
  {
    id: 'internship-deadlines',
    trigger: 'internships',
    title: 'Check upcoming application deadlines',
    description:
      'Several internship cycles close soon - view the calendar so you do not miss a deadline.',
    cta: 'Open deadline calendar',
    href: '/resources?open=internship-calendar',
    icon: 'calendar',
    tag: 'Time-sensitive',
    priority: 2,
  },
  {
    id: 'events-rsvp',
    trigger: 'events',
    title: 'RSVP for an upcoming event',
    description:
      'There are sessions this week you have not registered for yet.',
    cta: 'See this weeks events',
    href: '/events?view=upcoming',
    icon: 'ticket',
    tag: 'This week',
    priority: 1,
  },
  {
    id: 'resources-pathway',
    trigger: 'resources',
    title: 'Turn resources into a learning path',
    description:
      'Combine the resources you have been exploring into a structured pathway to stay consistent.',
    cta: 'Explore pathways',
    href: '/paths',
    icon: 'map',
    tag: 'Stay consistent',
    priority: 1,
  },
  {
    id: 'community-introduce',
    trigger: 'community',
    title: 'Introduce yourself to the community',
    description:
      'Drop a quick intro post and start connecting with fellow learners.',
    cta: 'Go to community',
    href: '/community',
    icon: 'users',
    tag: 'Say hello',
    priority: 1,
  },
  {
    id: 'data-science-notebook',
    trigger: 'data-science',
    title: 'Try a beginner data notebook',
    description:
      'Start with a guided project to practise the data-science concepts you have been reading about.',
    cta: 'Explore data projects',
    href: '/paths',
    icon: 'chart',
    tag: 'Hands-on',
    priority: 1,
  },
  {
    id: 'default-explore',
    trigger: 'general',
    title: 'Explore DevPath pathways',
    description:
      'Not sure where to start? Browse our curated learning pathways and find the one that fits your goals.',
    cta: 'View all pathways',
    href: '/paths',
    icon: 'rocket',
    tag: 'Get started',
    priority: 99,
  },
];

export function getRecommendations(
  recentCategories: string[],
  limit = 3
): Recommendation[] {
  const seen = new Set<string>();
  const results: Recommendation[] = [];
  for (const category of recentCategories) {
    const matching = RULES.filter((r) => r.trigger === category).sort(
      (a, b) => a.priority - b.priority
    );
    for (const rule of matching) {
      if (!seen.has(rule.id)) {
        seen.add(rule.id);
        results.push(rule);
        if (results.length >= limit) return results;
      }
    }
  }
  if (results.length === 0) {
    const fallback = RULES.find((r) => r.trigger === 'general');
    if (fallback) results.push(fallback);
  }
  return results.slice(0, limit);
}
