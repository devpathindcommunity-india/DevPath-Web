import {
  calculateUserPointsAndBadges,
  determineBadges,
  getBadgeXp,
} from '../point-calculation';
import { BADGE_RARITY_POINTS, POINTS } from '../points';

describe('point calculation', () => {
  it('awards badge XP based on badge rarity', () => {
    expect(getBadgeXp('builder-10')).toBe(BADGE_RARITY_POINTS.legendary);
    expect(getBadgeXp('builder-5')).toBe(BADGE_RARITY_POINTS.epic);
    expect(getBadgeXp('social-github')).toBe(BADGE_RARITY_POINTS.rare);
  });

  it('falls back to standard badge XP for unknown badges', () => {
    expect(getBadgeXp('custom-community-badge')).toBe(POINTS.BADGE_EARNED);
  });

  it('derives earned badges from profile and project activity', () => {
    const badges = determineBadges(
      {
        uid: 'member-1',
        name: 'DevPath Member',
        bio: 'Building projects and helping the community.',
        photoURL: '/avatar.png',
        role: 'Developer',
        github: 'https://github.com/member',
        linkedin: 'https://linkedin.com/in/member',
        instagram: 'https://instagram.com/member',
        streak: 7,
      },
      [{}, {}, {}]
    );

    expect(badges).toEqual(
      expect.arrayContaining([
        'profile-perfect',
        'connector-social',
        'builder-1',
        'builder-3',
        'streak-7',
      ])
    );
  });

  it('keeps the legacy shim from overwriting transactional points', () => {
    const result = calculateUserPointsAndBadges(
      { uid: 'member-1', streak: 7 },
      []
    );

    expect(result.achievements).toContain('streak-7');
    expect(result.points).toBeNull();
  });
});
