export const POINTS = {
  DAILY_LOGIN: 1, // Base login is 1
  WEEKLY_STREAK_BONUS: 20,
  FOLLOW_COMMUNITY: 50,
  BADGE_EARNED: 20, // Standard badge
  SOCIAL_BADGE_EARNED: 50, // GitHub, LinkedIn, Instagram
  FOLLOWER_GAINED: 10,
  PROJECT_STAR: 50,
  CREATE_PROJECT: 50,
  CREATE_DISCUSSION: 10,
  EVENT_PARTICIPATION: 100,
  HACKATHON_WIN: 1000,
  STREAK_BONUS_PER_DAY: 1,
  PROFILE_COMPLETION: 25,
  FIRST_PROJECT_UPLOAD: 50,
  REPOSITORY_CONTRIBUTION: 20,
  PULL_REQUEST_MERGED: 50,
  ISSUE_RESOLUTION: 30,
  COMMUNITY_POST_CREATION: 10,
  HELPFUL_COMMENT_RECEIVED: 5,
  CONSECUTIVE_WEEKLY_ACTIVITY: 100,
  OPEN_SOURCE_CONTRIBUTION: 75,
  MENTOR_RECOGNITION: 200,
};

export const BADGE_RARITY_POINTS = {
  common: 20,
  uncommon: 25,
  rare: 50,
  epic: 100,
  legendary: 200,
} as const;

export type BadgeRarity = keyof typeof BADGE_RARITY_POINTS;

export const LEVELS = [
  {
    name: 'Shishya',
    min: 0,
    max: 5000,
    color: 'text-gray-400',
    bg: 'bg-gray-500/10',
    border: 'rgba(107,114,128,0.2)',
  },
  {
    name: 'Abhyasi',
    min: 5001,
    max: 15000,
    color: 'text-slate-400',
    bg: 'bg-slate-500/10',
    border: 'rgba(100,116,139,0.2)',
  },
  {
    name: 'Sadhak',
    min: 15001,
    max: 35000,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'rgba(59,130,246,0.2)',
  },
  {
    name: 'Yogi',
    min: 35001,
    max: 75000,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'rgba(34,197,94,0.2)',
  },
  {
    name: 'Amatya',
    min: 75001,
    max: 150000,
    color: 'text-teal-500',
    bg: 'bg-teal-500/10',
    border: 'rgba(20,184,166,0.2)',
  },
  {
    name: 'Senapati',
    min: 150001,
    max: 300000,
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
    border: 'rgba(6,182,212,0.2)',
  },
  {
    name: 'Samrat',
    min: 300001,
    max: 750000,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
    border: 'rgba(99,102,241,0.2)',
  },
  {
    name: 'Chakravarti',
    min: 750001,
    max: 2000000,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'rgba(168,85,247,0.2)',
  },
  {
    name: 'Rajadhiraj',
    min: 2000001,
    max: 5000000,
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
    border: 'rgba(244,63,94,0.2)',
  },
  {
    name: 'Path-Nirmata',
    min: 5000001,
    max: 9999999,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    border: 'rgba(249,115,22,0.2)',
  },
  {
    name: 'Sanrakshak',
    min: 10000000,
    max: Infinity,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'rgba(16,185,129,0.2)',
  },
];

export function calculateLevel(points: number) {
  // Ensure points is a number
  const safePoints = points || 0;
  const level =
    LEVELS.find((l) => safePoints >= l.min && safePoints <= l.max) ||
    LEVELS[LEVELS.length - 1];

  // Calculate progress to next level
  let progress = 0;
  let nextLevelPoints = 0;

  if (level.max !== Infinity) {
    const range = level.max - level.min;
    const current = safePoints - level.min;
    progress = Math.min(100, Math.max(0, (current / range) * 100));
    nextLevelPoints = level.max + 1;
  } else {
    progress = 100; // Max level reached
  }

  return {
    currentLevel: level,
    progress,
    nextLevelPoints,
  };
}

export function getPointsForAction(action: keyof typeof POINTS) {
  return POINTS[action] || 0;
}
