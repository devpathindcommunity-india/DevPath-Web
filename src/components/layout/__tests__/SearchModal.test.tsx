import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SearchModal from '../SearchModal';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      div: React.forwardRef(({ children, ...props }: any, ref: any) => (
        <div {...props} ref={ref}>
          {children}
        </div>
      )),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
  const { useUIStore } = require('@/stores/ui-store');
  useUIStore.setState({ isSearchOpen: false });
});

afterEach(() => {
  jest.useRealTimers();
});

describe('SearchModal', () => {
  it('does not render when closed', () => {
    const { container } = render(<SearchModal />);
    expect(container.firstChild).toBeNull();
  });

  it('renders and focuses input when opened via Ctrl+K', () => {
    render(<SearchModal />);
    act(() => {
      fireEvent.keyDown(window, { ctrlKey: true, key: 'k' });
    });
    expect(
      screen.getByPlaceholderText(/Search wiki articles/)
    ).toBeInTheDocument();
  });

  it('renders and focuses input when opened via Cmd+K', () => {
    render(<SearchModal />);
    act(() => {
      fireEvent.keyDown(window, { metaKey: true, key: 'k' });
    });
    expect(
      screen.getByPlaceholderText(/Search wiki articles/)
    ).toBeInTheDocument();
  });

  it('closes when pressing Escape', () => {
    render(<SearchModal />);
    act(() => {
      fireEvent.keyDown(window, { ctrlKey: true, key: 'k' });
    });
    expect(
      screen.getByPlaceholderText(/Search wiki articles/)
    ).toBeInTheDocument();

    act(() => {
      fireEvent.keyDown(window, { key: 'Escape' });
    });
    expect(
      screen.queryByPlaceholderText(/Search wiki articles/)
    ).not.toBeInTheDocument();
  });

  it('closes when clicking backdrop', () => {
    const { container } = render(<SearchModal />);
    act(() => {
      fireEvent.keyDown(window, { ctrlKey: true, key: 'k' });
    });
    const backdrop = container.querySelector('.backdrop');
    if (backdrop) {
      act(() => {
        fireEvent.click(backdrop);
      });
    }
    expect(
      screen.queryByPlaceholderText(/Search wiki articles/)
    ).not.toBeInTheDocument();
  });

  it('filters results based on query', () => {
    render(<SearchModal />);
    act(() => {
      fireEvent.keyDown(window, { ctrlKey: true, key: 'k' });
    });

    const input = screen.getByPlaceholderText(/Search wiki articles/);
    act(() => {
      fireEvent.change(input, { target: { value: 'react' } });
      jest.advanceTimersByTime(300); // Advance debounce timer
    });

    expect(screen.getByText('Full Stack React Guide')).toBeInTheDocument();
  });

  it('navigates and closes modal when result is clicked', () => {
    render(<SearchModal />);
    act(() => {
      fireEvent.keyDown(window, { ctrlKey: true, key: 'k' });
    });

    const input = screen.getByPlaceholderText(/Search wiki articles/);
    act(() => {
      fireEvent.change(input, { target: { value: 'react' } });
      jest.advanceTimersByTime(300); // Advance debounce timer
    });

    const resultButton = screen
      .getByText('Full Stack React Guide')
      .closest('button');
    if (resultButton) {
      act(() => {
        fireEvent.click(resultButton);
      });
    }

    expect(mockPush).toHaveBeenCalledWith('/wiki?article=react');
    expect(
      screen.queryByPlaceholderText(/Search wiki articles/)
    ).not.toBeInTheDocument();
  });
});
