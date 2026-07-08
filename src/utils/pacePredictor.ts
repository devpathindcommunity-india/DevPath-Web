export interface MilestoneConfig {
  id: string;
  label: string;
  typicalHours: number;
}

export interface RoadmapConfig {
  id: string;
  title: string;
  milestones: MilestoneConfig[];
}

export const ROADMAPS_PACE_DATA: Record<string, RoadmapConfig> = {
  frontend: {
    id: 'frontend',
    title: 'Frontend Developer Roadmap',
    milestones: [
      { id: '1', label: 'HTML/CSS', typicalHours: 30 },
      { id: '2', label: 'JavaScript', typicalHours: 50 },
      { id: '3', label: 'Version Ctrl', typicalHours: 15 },
      { id: '4', label: 'React', typicalHours: 65 },
      { id: '5', label: 'Next.js', typicalHours: 45 },
    ],
  },
  backend: {
    id: 'backend',
    title: 'Backend Developer Roadmap',
    milestones: [
      { id: '1', label: 'Databases', typicalHours: 40 },
      { id: '2', label: 'Node.js', typicalHours: 60 },
      { id: '3', label: 'APIs', typicalHours: 50 },
    ],
  },
};

export interface PacePredictorInput {
  roadmapId: string; // 'frontend', 'backend', or 'custom'
  studyHoursPerDay: number; // Decimal hours, e.g. 1.5
  useManualProgress: boolean;
  manualProgressPercent: number; // 0 to 100
  completedMilestoneIds: string[]; // List of completed milestone IDs
  targetCompletionDate?: string; // YYYY-MM-DD
  // For 'custom' roadmap
  customTotalMilestones?: number;
  customTypicalHoursPerMilestone?: number;
  customCompletedMilestonesCount?: number;
}

export interface PacePredictorResult {
  totalMilestones: number;
  completedMilestonesCount: number;
  remainingMilestonesCount: number;
  totalRoadmapHours: number;
  completedHours: number;
  remainingHours: number;
  progressPercent: number;
  estimatedDaysToComplete: number;
  estimatedCompletionDate: string | null;
  targetMeetsDeadline: boolean | null;
  daysToTargetDate: number | null;
  suggestedStudyHoursPerDay: number | null; // Null if no target date or already meets deadline
}

export function calculatePace(input: PacePredictorInput): PacePredictorResult {
  const {
    roadmapId,
    studyHoursPerDay,
    useManualProgress,
    manualProgressPercent,
    completedMilestoneIds,
    targetCompletionDate,
    customTotalMilestones = 5,
    customTypicalHoursPerMilestone = 20,
    customCompletedMilestonesCount = 0,
  } = input;

  let totalMilestones = 0;
  let completedMilestonesCount = 0;
  let remainingMilestonesCount = 0;
  let totalRoadmapHours = 0;
  let remainingHours = 0;
  let completedHours = 0;
  let progressPercent = 0;

  if (roadmapId === 'custom') {
    totalMilestones = Math.max(1, customTotalMilestones);
    totalRoadmapHours = totalMilestones * Math.max(1, customTypicalHoursPerMilestone);

    if (useManualProgress) {
      progressPercent = Math.max(0, Math.min(100, manualProgressPercent));
      completedHours = (progressPercent / 100) * totalRoadmapHours;
      remainingHours = totalRoadmapHours - completedHours;
      completedMilestonesCount = Math.round((progressPercent / 100) * totalMilestones);
      remainingMilestonesCount = totalMilestones - completedMilestonesCount;
    } else {
      completedMilestonesCount = Math.max(0, Math.min(totalMilestones, customCompletedMilestonesCount));
      remainingMilestonesCount = totalMilestones - completedMilestonesCount;
      completedHours = completedMilestonesCount * Math.max(1, customTypicalHoursPerMilestone);
      remainingHours = totalRoadmapHours - completedHours;
      progressPercent = totalRoadmapHours > 0 ? Math.round((completedHours / totalRoadmapHours) * 100) : 0;
    }
  } else {
    const roadmap = ROADMAPS_PACE_DATA[roadmapId];
    if (!roadmap) {
      // Fallback
      return {
        totalMilestones: 0,
        completedMilestonesCount: 0,
        remainingMilestonesCount: 0,
        totalRoadmapHours: 0,
        completedHours: 0,
        remainingHours: 0,
        progressPercent: 0,
        estimatedDaysToComplete: 0,
        estimatedCompletionDate: null,
        targetMeetsDeadline: null,
        daysToTargetDate: null,
        suggestedStudyHoursPerDay: null,
      };
    }

    totalMilestones = roadmap.milestones.length;
    totalRoadmapHours = roadmap.milestones.reduce((acc, m) => acc + m.typicalHours, 0);

    if (useManualProgress) {
      progressPercent = Math.max(0, Math.min(100, manualProgressPercent));
      completedHours = (progressPercent / 100) * totalRoadmapHours;
      remainingHours = totalRoadmapHours - completedHours;
      completedMilestonesCount = Math.round((progressPercent / 100) * totalMilestones);
      remainingMilestonesCount = totalMilestones - completedMilestonesCount;
    } else {
      // Calculate from checklist completedMilestoneIds
      const completedSet = new Set(completedMilestoneIds);
      roadmap.milestones.forEach((m) => {
        if (completedSet.has(m.id)) {
          completedHours += m.typicalHours;
          completedMilestonesCount++;
        } else {
          remainingHours += m.typicalHours;
        }
      });
      remainingMilestonesCount = totalMilestones - completedMilestonesCount;
      progressPercent = totalRoadmapHours > 0 ? Math.round((completedHours / totalRoadmapHours) * 100) : 0;
    }
  }

  // Calculate estimated days
  let estimatedDaysToComplete = 0;
  let estimatedCompletionDate: string | null = null;

  if (remainingHours > 0) {
    if (studyHoursPerDay > 0) {
      estimatedDaysToComplete = Math.ceil(remainingHours / studyHoursPerDay);
      
      const compDate = new Date();
      compDate.setDate(compDate.getDate() + estimatedDaysToComplete);
      estimatedCompletionDate = compDate.toISOString().split('T')[0];
    } else {
      estimatedDaysToComplete = Infinity;
    }
  } else {
    estimatedDaysToComplete = 0;
    estimatedCompletionDate = new Date().toISOString().split('T')[0];
  }

  // Handle optional target completion date
  let targetMeetsDeadline: boolean | null = null;
  let daysToTargetDate: number | null = null;
  let suggestedStudyHoursPerDay: number | null = null;

  if (targetCompletionDate && remainingHours > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const target = new Date(targetCompletionDate);
    target.setHours(0, 0, 0, 0);

    // Difference in days
    const diffTime = target.getTime() - today.getTime();
    daysToTargetDate = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysToTargetDate > 0) {
      targetMeetsDeadline = estimatedDaysToComplete <= daysToTargetDate;
      if (!targetMeetsDeadline) {
        // Calculate needed study hours per day
        suggestedStudyHoursPerDay = Number((remainingHours / daysToTargetDate).toFixed(2));
      }
    } else {
      // Target date in the past or today
      targetMeetsDeadline = false;
      daysToTargetDate = daysToTargetDate <= 0 ? daysToTargetDate : 0;
      suggestedStudyHoursPerDay = remainingHours; // Requires doing all remaining work today
    }
  }

  return {
    totalMilestones,
    completedMilestonesCount,
    remainingMilestonesCount,
    totalRoadmapHours,
    completedHours: Math.round(completedHours),
    remainingHours: Math.round(remainingHours),
    progressPercent,
    estimatedDaysToComplete,
    estimatedCompletionDate,
    targetMeetsDeadline,
    daysToTargetDate,
    suggestedStudyHoursPerDay,
  };
}
