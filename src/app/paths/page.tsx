'use client';

import React, { useState } from 'react';
import LearningPaths from '@/components/home/LearningPaths';
import SkillTreeVisualizer from '@/components/features/SkillTreeVisualizer';

export default function LearningPathsPage() {
  const [view, setView] = useState<'card' | 'tree'>('card');

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Learning Paths</h1>

        {/* Toggle Button */}
        <div className="flex gap-2 bg-github-dark p-1 rounded-lg border border-github-border">
          <button
            aria-label="Action button"
            onClick={() => setView('card')}
            className={`px-4 py-2 rounded-md ${view === 'card' ? 'bg-github-green text-white' : 'text-github-muted'}`}
          >
            Card View
          </button>
          <button
            aria-label="Action button"
            onClick={() => setView('tree')}
            className={`px-4 py-2 rounded-md ${view === 'tree' ? 'bg-github-green text-white' : 'text-github-muted'}`}
          >
            Tree View
          </button>
        </div>
      </div>

      {view === 'card' ? <LearningPaths /> : <SkillTreeVisualizer />}
    </main>
  );
}
