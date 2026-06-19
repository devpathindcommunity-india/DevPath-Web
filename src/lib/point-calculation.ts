import { BADGE_RARITY_POINTS, POINTS } from './points';
import type { BadgeRarity } from './points';

export const SOCIAL_BADGES = [
  'social-github',
  'social-linkedin',
  'social-instagram',
];

export const BADGE_RARITY_BY_ID: Record<string, BadgeRarity> = {
  'profile-perfect': 'uncommon',
  storyteller: 'common',
  'face-of-community': 'common',
  'local-hero': 'common',
  'connector-social': 'rare',
  'social-github': 'rare',
  'social-linkedin': 'rare',
  'social-instagram': 'rare',
  'builder-1': 'uncommon',
  'builder-3': 'rare',
  'builder-5': 'epic',
  'builder-10': 'legendary',
  'streak-7': 'rare',
  'early-adopter': 'legendary',
};

export interface UserData {
  uid: string;
  name?: string;
  bio?: string;
  photoURL?: string;
  role?: string;
  github?: string;
  linkedin?: string;
  instagram?: string;
  city?: string;
  state?: string;
  followers?: string[];
  streak?: number;
  achievements?: string[];
}

export interface ProjectData {
  stars?: string[];
}

/**
 * Returns the XP value for a single badge.
 * Social badges (GitHub, LinkedIn, Instagram) award more XP than standard badges.
 */
export function getBadgeXp(badgeId: string): number {
  const rarity = BADGE_RARITY_BY_ID[badgeId];

  if (rarity) {
    return BADGE_RARITY_POINTS[rarity];
  }

  return SOCIAL_BADGES.includes(badgeId)
    ? POINTS.SOCIAL_BADGE_EARNED
    : POINTS.BADGE_EARNED;
}

/**
 * Determines which badges a user has earned based on their current profile
 * and project data. Returns only the badge list — it does NOT calculate
 * or return a point total, because total points include transactional XP
 * (event participation, hackathon wins, daily logins, community follows)
 * that cannot be derived from profile state alone.
 *
 * Callers should use Firestore `increment()` to award XP for newly unlocked
 * badges rather than overwriting the user's total point value.
 */
export function determineBadges(
  user: UserData,
  projects: ProjectData[]
): string[] {
  const earned: string[] = [];

  // Early Adopter is time-limited — preserve if already held
  if (user.achievements?.includes('early-adopter')) {
    earned.push('early-adopter');
  }

  // Profile completeness
  if (user.name && user.bio && user.photoURL && user.role)
    earned.push('profile-perfect');
  if (user.bio && user.bio.length > 20) earned.push('storyteller');
  if (user.photoURL) earned.push('face-of-community');
  if (user.city || user.state) earned.push('local-hero');

  // Social links
  if (user.github && user.linkedin && user.instagram)
    earned.push('connector-social');
  if (user.github) earned.push('social-github');
  if (user.linkedin) earned.push('social-linkedin');
  if (user.instagram) earned.push('social-instagram');

  // Projects
  const projectCount = projects.length;
  if (projectCount >= 1) earned.push('builder-1');
  if (projectCount >= 3) earned.push('builder-3');
  if (projectCount >= 5) earned.push('builder-5');
  if (projectCount >= 10) earned.push('builder-10');

  // Streak
  if ((user.streak || 0) >= 7) earned.push('streak-7');

  return earned;
}

/**
 * @deprecated Use `determineBadges` instead.
 * This function returned an absolute `points` total that incorrectly
 * overwrote transactional XP. Kept as a re-export shim so any remaining
 * callers compile without changes while the migration is in progress.
 */
export function calculateUserPointsAndBadges(
  user: UserData,
  projects: ProjectData[]
) {
  const achievements = determineBadges(user, projects);
  return { achievements, points: null };
}
