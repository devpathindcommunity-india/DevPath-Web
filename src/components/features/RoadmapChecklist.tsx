'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Trophy,
  Flame,
  Zap,
} from 'lucide-react';
import { useLearningProgress } from '@/hooks/useLearningProgress';
import { useAuth } from '@/context/AuthContext';

// ── Types ──────────────────────────────────────────────────────────────────

interface ChecklistNode {
  id: string;
  label: string;
  desc: string;
}

interface RoadmapChecklistProps {
  /** The path identifier, e.g. "Frontend" or "Backend" */
  pathId: string;
  /** Human-readable title for this roadmap, e.g. "Frontend Developer Roadmap" */
  title: string;
  /** All nodes in this roadmap */
  nodes: ChecklistNode[];
}

// ── Helper: motivational label based on progress ──────────────────────────

function getMotivationalLabel(percent: number): { text: string; emoji: string } {
  if (percent === 0) return { text: 'Ready to begin your journey?', emoji: '🚀' };
  if (percent < 25) return { text: 'Great start! Keep going!', emoji: '🌱' };
  if (percent < 50) return { text: "You're building momentum!", emoji: '⚡' };
  if (percent < 75) return { text: 'More than halfway there!', emoji: '🔥' };
  if (percent < 100) return { text: 'Almost mastered! Push through!', emoji: '🏆' };
  return { text: 'Path mastered! Legendary!', emoji: '🎉' };
}

// ── Sub-component: individual checklist row ───────────────────────────────

function ChecklistRow({
  node,
  pathId,
  index,
}: {
  node: ChecklistNode;
  pathId: string;
  index: number;
}) {
  const { isNodeCompleted, toggleNode } = useLearningProgress();
  const isCompleted = isNodeCompleted(pathId, node.id);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className={`
        group relative flex flex-col rounded-xl border transition-all duration-300 overflow-hidden
        ${
          isCompleted
            ? 'border-emerald-500/40 bg-emerald-950/20'
            : 'border-slate-700/50 bg-slate-900/30 hover:border-slate-600/70'
        }
      `}
    >
      <div className="flex items-center gap-4 p-4">
        {/* Checkbox button */}
        <button
          id={`checklist-node-${pathId}-${node.id}`}
          aria-label={`Mark "${node.label}" as ${isCompleted ? 'incomplete' : 'complete'}`}
          onClick={() => toggleNode(pathId, node.id)}
          className="flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-full transition-transform hover:scale-110 active:scale-95"
        >
          <AnimatePresence mode="wait">
            {isCompleted ? (
              <motion.span
                key="checked"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <CheckCircle2 size={26} className="text-emerald-500 drop-shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
              </motion.span>
            ) : (
              <motion.span
                key="unchecked"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <Circle size={26} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Node step number badge */}
        <span
          className={`
            flex-shrink-0 text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center
            ${isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}
          `}
        >
          {index + 1}
        </span>

        {/* Label */}
        <span
          className={`flex-1 text-sm font-semibold tracking-wide transition-colors duration-200 ${
            isCompleted ? 'text-emerald-400 line-through decoration-emerald-600/50' : 'text-slate-200'
          }`}
        >
          {node.label}
        </span>

        {/* Expand toggle */}
        <button
          aria-label={isExpanded ? 'Collapse description' : 'Expand description'}
          onClick={() => setIsExpanded((v) => !v)}
          className="flex-shrink-0 text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-slate-800/60"
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Expandable description */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key="desc"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-14 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
              {node.desc}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completed shimmer accent */}
      {isCompleted && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.4 }}
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
        />
      )}
    </motion.div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function RoadmapChecklist({ pathId, title, nodes }: RoadmapChecklistProps) {
  const { user } = useAuth();
  const { isNodeCompleted, resetProgress } = useLearningProgress();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const completedCount = nodes.filter((n) => isNodeCompleted(pathId, n.id)).length;
  const totalCount = nodes.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const { text: motivationalText, emoji } = getMotivationalLabel(progressPercent);

  const handleReset = async () => {
    await resetProgress(pathId);
    setShowResetConfirm(false);
  };

  return (
    <section
      id={`roadmap-checklist-${pathId.toLowerCase()}`}
      aria-label={`${title} checklist tracker`}
      className="w-full max-w-[800px] mx-auto mt-2"
    >
      {/* ── Header Card ── */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-900 via-[#0f1115] to-slate-950 shadow-2xl mb-4">
        {/* Decorative glow orbs */}
        <div className="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full bg-emerald-500/8 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-teal-500/6 blur-3xl" />

        <div className="relative p-6">
          {/* Title row */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <Flame size={18} className="text-orange-500 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Checklist Tracker
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-white leading-tight">{title}</h2>
              <p className="text-xs text-slate-400 max-w-xs">
                {user
                  ? 'Progress synced to your account in real-time.'
                  : 'Progress saved locally in your browser. Sign in to sync across devices.'}
              </p>
            </div>

            {/* Stats bubble */}
            <div className="flex flex-col items-start sm:items-end gap-1 flex-shrink-0">
              <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-2">
                <Zap size={14} className={progressPercent > 0 ? 'text-yellow-400' : 'text-slate-600'} />
                <span className="text-2xl font-black text-white font-mono">{progressPercent}%</span>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {completedCount} / {totalCount} completed
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="h-3 w-full bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/40">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 relative"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                {progressPercent > 10 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-transparent rounded-full" />
                )}
              </motion.div>
            </div>

            {/* Motivational label */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {emoji} {motivationalText}
              </span>
              {progressPercent === 100 && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-3 py-0.5">
                  <Trophy size={12} />
                  Path Mastered!
                </span>
              )}
            </div>
          </div>

          {/* Reset button row */}
          <div className="flex items-center justify-end mt-4 pt-4 border-t border-slate-800/60">
            <AnimatePresence mode="wait">
              {!showResetConfirm ? (
                <motion.button
                  key="reset-btn"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowResetConfirm(true)}
                  disabled={completedCount === 0}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200 py-1 px-2 rounded-lg hover:bg-red-950/30"
                >
                  <RotateCcw size={13} />
                  Reset Progress
                </motion.button>
              ) : (
                <motion.div
                  key="confirm-row"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-xs text-red-400">Reset all progress for this path?</span>
                  <button
                    onClick={handleReset}
                    className="text-xs font-semibold text-red-400 border border-red-500/40 rounded-lg px-3 py-1 hover:bg-red-950/40 transition-colors"
                  >
                    Yes, reset
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="text-xs text-slate-400 border border-slate-700/50 rounded-lg px-3 py-1 hover:bg-slate-800/60 transition-colors"
                  >
                    Cancel
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Checklist Rows ── */}
      <div className="space-y-2.5" role="list" aria-label="Roadmap topics checklist">
        {nodes.map((node, index) => (
          <ChecklistRow
            key={node.id}
            node={node}
            pathId={pathId}
            index={index}
          />
        ))}
      </div>

      {/* ── Guest CTA ── */}
      {!user && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 rounded-xl border border-slate-700/40 bg-slate-900/30 px-5 py-4 text-center"
        >
          <p className="text-xs text-slate-500 leading-relaxed">
            🔒 Your progress is saved in this browser only.{' '}
            <a
              href="/login"
              className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors font-medium"
            >
              Sign in
            </a>{' '}
            to sync your progress across all your devices.
          </p>
        </motion.div>
      )}
    </section>
  );
}
