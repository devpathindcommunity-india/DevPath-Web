import { StreakCalendar } from '@/components/gamification/StreakCalendar';
import { BadgeGrid } from '@/components/gamification/BadgeGrid';
import { XPBar } from '@/components/gamification/XPBar';
import { Leaderboard } from '@/components/gamification/Leaderboard';
import LearningPacePredictor from '@/components/features/LearningPacePredictor';

// This would get real data from auth + firestore
export default function ProgressPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      <h1 className="text-3xl font-extrabold text-white">Your Progress Dashboard</h1>
      
      <section>
        <LearningPacePredictor />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3 text-slate-200">🔥 Learning Streak</h2>
        <StreakCalendar activityDates={[]} />
      </section>
      
      <section>
        <h2 className="text-lg font-semibold mb-3 text-slate-200">⚡ XP & Tier</h2>
        <XPBar xp={0} />
      </section>
      
      <section>
        <h2 className="text-lg font-semibold mb-3 text-slate-200">🏅 Badges</h2>
        <BadgeGrid earned={[]} />
      </section>
      
      <section>
        <h2 className="text-lg font-semibold mb-3 text-slate-200">🏆 Leaderboard</h2>
        <Leaderboard />
      </section>
    </main>
  );
}

