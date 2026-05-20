// Helper to get date string in IST (UTC+5:30)
function getISTDateString(date: Date = new Date()): string {
    const options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' } as const;
    const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(date);
    const year = parts.find(p => p.type === 'year')?.value;
    const month = parts.find(p => p.type === 'month')?.value;
    const day = parts.find(p => p.type === 'day')?.value;
    return `${year}-${month}-${day}`;
}

// Helper to subtract/add calendar days in UTC to avoid DST and timezone shifts
function getISTDateOffset(dateString: string, offsetDays: number): string {
    const [year, month, day] = dateString.split('-').map(Number);
    const d = new Date(Date.UTC(year, month - 1, day + offsetDays));
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dayStr = String(d.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${dayStr}`;
}

export function calculateStreak(loginDates: string[] = []) {
    if (!loginDates || !Array.isArray(loginDates) || !loginDates.length) return { currentStreak: 0, maxStreak: 0 };

    const sortedDates = [...new Set(loginDates)].sort();
    let current = 0;
    let max = 0;

    // Check current streak using IST
    const today = getISTDateString(new Date());
    const yesterday = getISTDateOffset(today, -1);

    if (sortedDates.includes(today)) {
        current = 1;
        let offset = -1;

        while (sortedDates.includes(getISTDateOffset(today, offset))) {
            current++;
            offset--;
        }
    } else if (sortedDates.includes(yesterday)) {
        let offset = -1;
        let streak = 0;

        while (sortedDates.includes(getISTDateOffset(today, offset))) {
            streak++;
            offset--;
        }
        current = streak;
    }

    // Max Streak
    let streak = 0;
    for (let i = 0; i < sortedDates.length; i++) {
        if (i > 0) {
            const prev = new Date(sortedDates[i - 1]);
            const curr = new Date(sortedDates[i]);
            const diffTime = Math.abs(curr.getTime() - prev.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                streak++;
            } else {
                streak = 1;
            }
        } else {
            streak = 1;
        }
        if (streak > max) max = streak;
    }

    return { currentStreak: current, maxStreak: max };
}

export { getISTDateString };
