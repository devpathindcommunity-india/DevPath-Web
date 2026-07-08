'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useLearningProgress } from '@/hooks/useLearningProgress';
import { useAuth } from '@/context/AuthContext';
import { calculatePace, ROADMAPS_PACE_DATA, PacePredictorInput } from '@/utils/pacePredictor';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  RefreshCw, 
  Compass, 
  Sliders, 
  Target 
} from 'lucide-react';
import Button from '../ui/Button';

export default function LearningPacePredictor() {
  const { user } = useAuth();
  const { completedNodes, loading: progressLoading, isNodeCompleted } = useLearningProgress();

  // Inputs state
  const [roadmapId, setRoadmapId] = useState<string>('frontend');
  const [studyHours, setStudyHours] = useState<number>(2);
  const [studyMinutes, setStudyMinutes] = useState<number>(0);
  const [useManualProgress, setUseManualProgress] = useState<boolean>(false);
  const [manualPercent, setManualPercent] = useState<number>(30);
  const [targetDate, setTargetDate] = useState<string>('');
  
  // Custom roadmap inputs
  const [customTotal, setCustomTotal] = useState<number>(6);
  const [customHoursPerMilestone, setCustomHoursPerMilestone] = useState<number>(20);
  const [customCompletedCount, setCustomCompletedCount] = useState<number>(2);

  // Manual completed checklist overrides
  const [localCompletedNodes, setLocalCompletedNodes] = useState<Record<string, string[]>>({
    frontend: [],
    backend: [],
  });

  // Sync Firebase completed nodes initially when progress finishes loading
  useEffect(() => {
    if (!progressLoading && user) {
      const frontendCompleted = ['1', '2', '3', '4', '5'].filter(id => isNodeCompleted('Frontend', id));
      const backendCompleted = ['1', '2', '3'].filter(id => isNodeCompleted('Backend', id));
      
      setLocalCompletedNodes(prev => {
        const isFrontendSame = prev.frontend.length === frontendCompleted.length && 
          prev.frontend.every((v, i) => v === frontendCompleted[i]);
        const isBackendSame = prev.backend.length === backendCompleted.length && 
          prev.backend.every((v, i) => v === backendCompleted[i]);
          
        if (isFrontendSame && isBackendSame) {
          return prev;
        }
        return {
          frontend: frontendCompleted,
          backend: backendCompleted,
        };
      });
    }
  }, [progressLoading, user]);


  // Handle roadmap selection change
  const handleRoadmapChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoadmapId(e.target.value);
  };

  // Toggle milestone completion locally
  const toggleLocalMilestone = (id: string) => {
    setLocalCompletedNodes(prev => {
      const currentList = prev[roadmapId] || [];
      const updatedList = currentList.includes(id)
        ? currentList.filter(item => item !== id)
        : [...currentList, id];
      return { ...prev, [roadmapId]: updatedList };
    });
  };

  // Calculate study hours per day
  const studyHoursPerDay = useMemo(() => {
    const total = studyHours + studyMinutes / 60;
    return isNaN(total) ? 0 : Math.max(0, total);
  }, [studyHours, studyMinutes]);

  // Predictor calculations
  const prediction = useMemo(() => {
    const input: PacePredictorInput = {
      roadmapId,
      studyHoursPerDay,
      useManualProgress,
      manualProgressPercent: manualPercent,
      completedMilestoneIds: localCompletedNodes[roadmapId] || [],
      targetCompletionDate: targetDate || undefined,
      customTotalMilestones: customTotal,
      customTypicalHoursPerMilestone: customHoursPerMilestone,
      customCompletedMilestonesCount: customCompletedCount,
    };
    return calculatePace(input);
  }, [
    roadmapId,
    studyHoursPerDay,
    useManualProgress,
    manualPercent,
    localCompletedNodes,
    targetDate,
    customTotal,
    customHoursPerMilestone,
    customCompletedCount,
  ]);

  const activeRoadmapConfig = ROADMAPS_PACE_DATA[roadmapId];

  // Helper to format date
  const formatDateString = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Reset predictor inputs
  const handleReset = () => {
    setStudyHours(2);
    setStudyMinutes(0);
    setUseManualProgress(false);
    setManualPercent(0);
    setTargetDate('');
    setCustomTotal(6);
    setCustomHoursPerMilestone(20);
    setCustomCompletedCount(0);
    
    // Reset local checklist to user progress if logged in, else empty
    if (user) {
      const frontendCompleted = ['1', '2', '3', '4', '5'].filter(id => isNodeCompleted('Frontend', id));
      const backendCompleted = ['1', '2', '3'].filter(id => isNodeCompleted('Backend', id));
      setLocalCompletedNodes({
        frontend: frontendCompleted,
        backend: backendCompleted,
      });
    } else {
      setLocalCompletedNodes({
        frontend: [],
        backend: [],
      });
    }
  };

  return (
    <div className="w-full bg-[#0b0c10]/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="text-cyan-400" size={24} />
            Smart Learning Pace Predictor
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Predict when you will finish your learning roadmap based on daily study time.
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={handleReset}
          className="flex items-center gap-2 text-xs !py-1.5 !px-3"
          aria-label="Reset Predictor"
        >
          <RefreshCw size={14} />
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs Panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* Roadmap Selection */}
          <div className="flex flex-col gap-2">
            <label htmlFor="roadmap-select" className="text-sm font-semibold text-slate-300">
              Select Learning Roadmap
            </label>
            <select
              id="roadmap-select"
              value={roadmapId}
              onChange={handleRoadmapChange}
              className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-4 py-3 outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="frontend">Frontend Developer Roadmap</option>
              <option value="backend">Backend Developer Roadmap</option>
              <option value="custom">Custom / Generic Roadmap</option>
            </select>
          </div>

          {/* Daily Study Time */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-300">Daily Study Time</span>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2">
                <input
                  id="study-hours-input"
                  type="number"
                  min="0"
                  max="24"
                  value={studyHours}
                  onChange={(e) => setStudyHours(Math.max(0, Math.min(24, parseInt(e.target.value) || 0)))}
                  className="w-full bg-transparent text-white font-semibold text-lg outline-none text-center"
                  placeholder="0"
                  aria-label="Study hours per day"
                />
                <span className="text-xs text-slate-500">hours</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2">
                <input
                  id="study-minutes-input"
                  type="number"
                  min="0"
                  max="59"
                  value={studyMinutes}
                  onChange={(e) => setStudyMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                  className="w-full bg-transparent text-white font-semibold text-lg outline-none text-center"
                  placeholder="0"
                  aria-label="Study minutes per day"
                />
                <span className="text-xs text-slate-500">mins</span>
              </div>
            </div>
          </div>

          {/* Optional Target Date */}
          <div className="flex flex-col gap-2">
            <label htmlFor="target-date" className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
              <Target size={16} className="text-purple-400" />
              Target Completion Date (Optional)
            </label>
            <input
              id="target-date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-4 py-3 outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Mode Toggle: Checklist vs Slider */}
          {roadmapId !== 'custom' && (
            <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-800/60">
              <div className="flex items-center gap-2">
                <Sliders size={18} className="text-cyan-400" />
                <span className="text-sm font-semibold text-slate-300">Use Manual Percentage Slider</span>
              </div>
              <button
                type="button"
                onClick={() => setUseManualProgress(!useManualProgress)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  useManualProgress ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
                aria-label="Toggle percentage slider mode"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    useManualProgress ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          )}

          {/* Dynamic Progress Input Section */}
          <div className="p-5 bg-slate-900/30 rounded-xl border border-slate-800/80">
            <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
              <Compass size={16} className="text-cyan-400" />
              Track Progress
            </h3>

            {roadmapId === 'custom' ? (
              // Custom roadmap Inputs
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="custom-milestones" className="text-xs text-slate-400">Total Milestones</label>
                    <input
                      id="custom-milestones"
                      type="number"
                      min="1"
                      value={customTotal}
                      onChange={(e) => setCustomTotal(Math.max(1, parseInt(e.target.value) || 1))}
                      className="bg-slate-900 border border-slate-800 text-white text-sm rounded-lg p-2.5 outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="custom-hours" className="text-xs text-slate-400">Hours per Milestone</label>
                    <input
                      id="custom-hours"
                      type="number"
                      min="1"
                      value={customHoursPerMilestone}
                      onChange={(e) => setCustomHoursPerMilestone(Math.max(1, parseInt(e.target.value) || 1))}
                      className="bg-slate-900 border border-slate-800 text-white text-sm rounded-lg p-2.5 outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="custom-completed" className="text-xs text-slate-400 flex justify-between">
                    <span>Completed Milestones:</span>
                    <span className="font-bold text-cyan-400">{customCompletedCount} / {customTotal}</span>
                  </label>
                  <input
                    id="custom-completed"
                    type="range"
                    min="0"
                    max={customTotal}
                    value={customCompletedCount}
                    onChange={(e) => setCustomCompletedCount(parseInt(e.target.value) || 0)}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>
              </div>
            ) : useManualProgress ? (
              // Manual Percentage Slider
              <div className="space-y-3">
                <div className="flex justify-between text-xs text-slate-400 font-semibold">
                  <span>Current Progress</span>
                  <span className="text-cyan-400 font-bold">{manualPercent}%</span>
                </div>
                <input
                  id="progress-percent-slider"
                  type="range"
                  min="0"
                  max="100"
                  value={manualPercent}
                  onChange={(e) => setManualPercent(parseInt(e.target.value) || 0)}
                  className="w-full accent-cyan-500 cursor-pointer"
                  aria-label="Progress percentage"
                />
              </div>
            ) : (
              // Milestone Checklist (derived from firebase nodes / local overrides)
              <div className="space-y-3">
                <p className="text-xs text-slate-400 mb-2">Check off the milestones you have completed:</p>
                {activeRoadmapConfig?.milestones.map((m) => {
                  const isChecked = (localCompletedNodes[roadmapId] || []).includes(m.id);
                  return (
                    <button
                      key={m.id}
                      onClick={() => toggleLocalMilestone(m.id)}
                      className={`flex items-center justify-between w-full p-3 rounded-lg border text-left transition-all ${
                        isChecked 
                          ? 'bg-cyan-500/10 border-cyan-500/30 text-white' 
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2 
                          size={18} 
                          className={isChecked ? 'text-cyan-400' : 'text-slate-600'} 
                        />
                        <span className="text-sm font-semibold">{m.label}</span>
                      </div>
                      <span className="text-xs text-slate-500 font-mono">{m.typicalHours} hrs</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Prediction Dashboard */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Predictor Hero Panel */}
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-[#0a0f1d] border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col justify-between min-h-[220px]">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Calendar size={120} className="text-cyan-400" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-3 py-1 rounded-full">
                Estimated Completion Date
              </span>

              {studyHoursPerDay === 0 ? (
                <div className="mt-4 flex items-center gap-3 text-amber-400 bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
                  <AlertCircle size={20} className="flex-shrink-0" />
                  <p className="text-sm font-semibold">
                    Please increase your study hours. At 0 hours/day, you will never finish!
                  </p>
                </div>
              ) : prediction.remainingHours === 0 ? (
                <div className="mt-4">
                  <h3 className="text-4xl md:text-5xl font-extrabold text-white mt-2">
                    Completed! 🎉
                  </h3>
                  <p className="text-sm text-slate-400 mt-2">
                    Congratulations! You have completed all milestones for this roadmap.
                  </p>
                </div>
              ) : (
                <div className="mt-4">
                  <h3 className="text-4xl md:text-5xl font-extrabold text-white mt-1">
                    {formatDateString(prediction.estimatedCompletionDate)}
                  </h3>
                  <p className="text-sm text-slate-400 mt-2">
                    Targeting a finish in <span className="text-cyan-400 font-bold font-mono">{prediction.estimatedDaysToComplete} days</span> ({Math.ceil(prediction.estimatedDaysToComplete / 7)} weeks).
                  </p>
                </div>
              )}
            </div>

            {/* Progress Micro-Bar */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Roadmap Progress</span>
                <span className="font-bold text-white">{prediction.progressPercent}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${prediction.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Calculation Metrics Breakdown Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5">
              <span className="text-xs text-slate-500 font-semibold block mb-1">REMAINING EFFORT</span>
              <span className="text-2xl font-bold text-white font-mono">{prediction.remainingHours}</span>
              <span className="text-xs text-slate-400 font-semibold ml-1">hours</span>
              <span className="text-xs text-slate-500 block mt-1">Total: {prediction.totalRoadmapHours} hours</span>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5">
              <span className="text-xs text-slate-500 font-semibold block mb-1">REMAINING MILESTONES</span>
              <span className="text-2xl font-bold text-white font-mono">{prediction.remainingMilestonesCount}</span>
              <span className="text-xs text-slate-400 font-semibold ml-1">/ {prediction.totalMilestones}</span>
              <span className="text-xs text-slate-500 block mt-1">Completed: {prediction.completedMilestonesCount}</span>
            </div>
          </div>

          {/* Target Date Feedback and Recommendations */}
          <AnimatePresence mode="wait">
            {targetDate && studyHoursPerDay > 0 && prediction.remainingHours > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-5 rounded-xl border transition-all ${
                  prediction.targetMeetsDeadline
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                    : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                }`}
              >
                <div className="flex gap-3">
                  <div className="mt-0.5">
                    {prediction.targetMeetsDeadline ? (
                      <CheckCircle2 className="text-emerald-400 flex-shrink-0" size={20} />
                    ) : (
                      <AlertCircle className="text-amber-400 flex-shrink-0" size={20} />
                    )}
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-sm">
                      {prediction.targetMeetsDeadline 
                        ? "You're on track! 🚀" 
                        : 'Adjustments recommended to hit target date'}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {prediction.targetMeetsDeadline
                        ? `At your current pace of ${studyHoursPerDay} hrs/day, you will complete the roadmap around ${prediction.daysToTargetDate && prediction.estimatedDaysToComplete ? prediction.daysToTargetDate - prediction.estimatedDaysToComplete : 0} days ahead of your target date.`
                        : `To complete your roadmap by ${formatDateString(targetDate)}, you need to increase your daily study time to at least:`}
                    </p>

                    {!prediction.targetMeetsDeadline && prediction.suggestedStudyHoursPerDay && (
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-white font-mono">
                          {prediction.suggestedStudyHoursPerDay}
                        </span>
                        <span className="text-xs text-slate-400">hours / day</span>
                        {prediction.suggestedStudyHoursPerDay > 10 && (
                          <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-2.5 py-0.5 rounded-full font-bold ml-2">
                            ⚠️ Intensive Pace
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
