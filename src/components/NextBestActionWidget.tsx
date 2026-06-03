"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRecentCategories } from "@/utils/activityTracker";
import { getRecommendations, Recommendation } from "@/utils/recommendations";

const ICON_MAP: Record<string, string> = {
  laptop: "💻", code: "🐙", file: "📄", calendar: "📅",
  ticket: "🎟", map: "🗺", users: "👋", chart: "📊", rocket: "🚀",
};

export default function NextBestActionWidget() {
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const categories = getRecentCategories();
    setRecs(getRecommendations(categories, 3));
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  return (
    <section aria-label="Recommended next steps" className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-lg">
          ✨
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 leading-tight">Your next best action</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Personalised to your recent activity</p>
        </div>
      </div>
      {recs.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 py-2">Explore DevPath and we will suggest your next step here.</p>
      ) : (
        <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-3">
          {recs.map((rec, i) => (
            <article key={rec.id} className="flex flex-col gap-2 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-750 hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-sm transition-all duration-150" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex items-center justify-between">
                <span className="text-2xl">{ICON_MAP[rec.icon] ?? "📌"}</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">{rec.tag}</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug">{rec.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed flex-1">{rec.description}</p>
              <Link href={rec.href} className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline underline-offset-2 mt-1" aria-label={rec.cta}>
                {rec.cta} →
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
