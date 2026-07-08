import { calculatePace } from '../pacePredictor';

describe('pacePredictor calculatePace', () => {
  beforeEach(() => {
    // Lock system time to 2026-07-07T00:00:00.000Z
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-07-07T00:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('correctly calculates remaining pace for Frontend roadmap with manual percentage', () => {
    const result = calculatePace({
      roadmapId: 'frontend',
      studyHoursPerDay: 2,
      useManualProgress: true,
      manualProgressPercent: 50,
      completedMilestoneIds: [],
    });

    // Frontend typical total hours = 30 + 50 + 15 + 65 + 45 = 205
    // 50% progress = 102.5 hours remaining.
    // 102.5 / 2 = 51.25 -> rounded up to 52 days
    expect(result.totalRoadmapHours).toBe(205);
    expect(result.remainingHours).toBe(103); // Math.round(102.5)
    expect(result.estimatedDaysToComplete).toBe(52);
    expect(result.estimatedCompletionDate).toBe('2026-08-28'); // 7 July + 52 days = 28 August
  });

  it('correctly calculates remaining pace for Backend roadmap with checklist', () => {
    const result = calculatePace({
      roadmapId: 'backend',
      studyHoursPerDay: 1.5,
      useManualProgress: false,
      manualProgressPercent: 0,
      completedMilestoneIds: ['1'], // Databases is completed
    });

    // Backend typical total hours = 40 + 60 + 50 = 150
    // Databases (id 1) completed = 40 hours completed.
    // Remaining hours = 110.
    // 110 / 1.5 = 73.33 -> 74 days
    expect(result.totalRoadmapHours).toBe(150);
    expect(result.remainingHours).toBe(110);
    expect(result.completedMilestonesCount).toBe(1);
    expect(result.estimatedDaysToComplete).toBe(74);
    expect(result.estimatedCompletionDate).toBe('2026-09-19'); // 7 July + 74 days = 19 September
  });

  it('suggests increased daily study hours when target completion date is not met', () => {
    // 205 hours remaining, 2 hours/day study -> 103 days.
    // Target completion date is in 50 days (2026-08-26).
    const result = calculatePace({
      roadmapId: 'frontend',
      studyHoursPerDay: 2,
      useManualProgress: true,
      manualProgressPercent: 0,
      completedMilestoneIds: [],
      targetCompletionDate: '2026-08-26', // 50 days from 2026-07-07
    });

    expect(result.estimatedDaysToComplete).toBe(103);
    expect(result.targetMeetsDeadline).toBe(false);
    expect(result.daysToTargetDate).toBe(50);
    // 205 hours / 50 days = 4.1 hours/day
    expect(result.suggestedStudyHoursPerDay).toBe(4.1);
  });

  it('handles edge cases like zero study hours', () => {
    const result = calculatePace({
      roadmapId: 'frontend',
      studyHoursPerDay: 0,
      useManualProgress: true,
      manualProgressPercent: 50,
      completedMilestoneIds: [],
    });

    expect(result.estimatedDaysToComplete).toBe(Infinity);
    expect(result.estimatedCompletionDate).toBeNull();
  });

  it('handles completed roadmaps', () => {
    const result = calculatePace({
      roadmapId: 'frontend',
      studyHoursPerDay: 2,
      useManualProgress: true,
      manualProgressPercent: 100,
      completedMilestoneIds: [],
    });

    expect(result.remainingHours).toBe(0);
    expect(result.estimatedDaysToComplete).toBe(0);
    expect(result.estimatedCompletionDate).toBe('2026-07-07');
  });
});
