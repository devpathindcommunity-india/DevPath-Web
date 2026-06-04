export const POINTS = {
    DAILY_LOGIN: 1, // Base login is 1
    WEEKLY_STREAK_BONUS: 20,
    FOLLOW_COMMUNITY: 500,
    BADGE_EARNED: 20, // Standard badge
    SOCIAL_BADGE_EARNED: 50, // GitHub, LinkedIn, Instagram
    FOLLOWER_GAINED: 10,
    PROJECT_STAR: 50,
    CREATE_PROJECT: 200,
    CREATE_DISCUSSION: 100,
    EVENT_PARTICIPATION: 500,
    HACKATHON_WIN: 5000,
    STREAK_BONUS_PER_DAY: 1
};

export const LEVELS = [
    { name: 'Shishya', min: 0, max: 5000, color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'rgba(107,114,128,0.2)' },
    { name: 'Abhyasi', min: 5001, max: 15000, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'rgba(100,116,139,0.2)' },
    { name: 'Sadhak', min: 15001, max: 35000, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'rgba(59,130,246,0.2)' },
    { name: 'Yogi', min: 35001, max: 75000, color: 'text-green-500', bg: 'bg-green-500/10', border: 'rgba(34,197,94,0.2)' },
    { name: 'Amatya', min: 75001, max: 150000, color: 'text-teal-500', bg: 'bg-teal-500/10', border: 'rgba(20,184,166,0.2)' },
    { name: 'Senapati', min: 150001, max: 300000, color: 'text-cyan-500', bg: 'bg-cyan-500/10', border: 'rgba(6,182,212,0.2)' },
    { name: 'Samrat', min: 300001, max: 750000, color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'rgba(99,102,241,0.2)' },
    { name: 'Chakravarti', min: 750001, max: 2000000, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'rgba(168,85,247,0.2)' },
    { name: 'Rajadhiraj', min: 2000001, max: 5000000, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'rgba(244,63,94,0.2)' },
    { name: 'Path-Nirmata', min: 5000001, max: 9999999, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'rgba(249,115,22,0.2)' },
    { name: 'Sanrakshak', min: 10000000, max: Infinity, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'rgba(16,185,129,0.2)' },
];

export function calculateLevel(points: number) {
    // Ensure points is a number
    const safePoints = points || 0;
    const level = LEVELS.find(l => safePoints >= l.min && safePoints <= l.max) || LEVELS[LEVELS.length - 1];

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
        nextLevelPoints
    };
}

export function getPointsForAction(action: keyof typeof POINTS) {
    return POINTS[action] || 0;
}
