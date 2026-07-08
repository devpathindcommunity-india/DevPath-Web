import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LearningPacePredictor from '../LearningPacePredictor';

// Mock auth hook
jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: 'user-123' },
  }),
}));

// Mock learning progress hook
jest.mock('@/hooks/useLearningProgress', () => ({
  useLearningProgress: () => ({
    completedNodes: ['Frontend-1', 'Frontend-2'],
    loading: false,
    isNodeCompleted: (pathId: string, nodeId: string) => {
      if (pathId === 'Frontend' && (nodeId === '1' || nodeId === '2')) {
        return true;
      }
      return false;
    },
  }),
}));

// Mock framer motion with a Proxy to handle any motion element (e.g. motion.button, motion.div)
jest.mock('framer-motion', () => {
  const React = require('react');
  const mockMotion = new Proxy(
    {},
    {
      get: (target, prop) => {
        return React.forwardRef(({ children, ...props }: any, ref: any) => {
          const Tag = prop as string;
          return React.createElement(Tag, { ...props, ref }, children);
        });
      },
    }
  );
  return {
    motion: mockMotion,
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

describe('LearningPacePredictor Component', () => {
  const originalDate = Date;

  beforeAll(() => {
    const mockDate = new Date('2026-07-07T00:00:00.000Z');
    global.Date = class extends Date {
      constructor(...args: any[]) {
        if (args.length > 0) {
          return new originalDate(...args as [any]);
        }
        return mockDate;
      }
    } as any;
  });

  afterAll(() => {
    global.Date = originalDate;
  });

  it('renders the predictor title and initial state', () => {
    render(<LearningPacePredictor />);
    expect(screen.getByText('Smart Learning Pace Predictor')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Learning Roadmap')).toHaveValue('frontend');
  });

  it('correctly calculates and displays the prediction on input change', () => {
    render(<LearningPacePredictor />);

    const hoursInput = screen.getByLabelText('Study hours per day');
    fireEvent.change(hoursInput, { target: { value: '4' } });

    // Progress: HTML/CSS (30) + JS (50) completed = 80 completed out of 205.
    // Remaining hours: 125.
    // 125 / 4 = 31.25 -> 32 days
    expect(screen.getByText(/Targeting a finish in/)).toHaveTextContent('32 days');
  });

  it('handles optional target date recommendations', () => {
    render(<LearningPacePredictor />);

    const targetDateInput = screen.getByLabelText(/Target Completion Date/);
    // Setting target date to 2026-08-26 (50 days out)
    fireEvent.change(targetDateInput, { target: { value: '2026-08-26' } });

    // With 2 hours/day study time, 125 remaining hours -> 63 days
    // 63 days > 50 days target -> shows warning and suggestions
    expect(screen.getByText('Adjustments recommended to hit target date')).toBeInTheDocument();
  });
});
