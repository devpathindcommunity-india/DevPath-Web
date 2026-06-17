import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import * as firebaseLib from '@/lib/firebase';

const mockSignIn = jest.fn();
const mockSignOut = jest.fn();

jest.mock('firebase/auth', () => ({
  getAuth: () => ({}),
  onAuthStateChanged: jest.fn(() => jest.fn()),
  signInWithEmailAndPassword: (...args: unknown[]) => mockSignIn(...args),
  signOut: (...args: unknown[]) => mockSignOut(...args),
  setPersistence: jest.fn(() => Promise.resolve()),
  browserLocalPersistence: {},
}));

jest.mock('@/lib/firebase', () => ({
  auth: {},
  db: {},
  firebaseAvailable: true,
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(() => ({})),
  getDoc: jest.fn(() => Promise.resolve({ exists: () => false })),
  setDoc: jest.fn(() => Promise.resolve()),
  onSnapshot: jest.fn(
    (_ref: unknown, cb: (snapshot: { exists: () => boolean }) => void) => {
      cb({ exists: () => false });
      return jest.fn();
    }
  ),
  writeBatch: jest.fn(() => ({
    commit: jest.fn(),
    set: jest.fn(),
    update: jest.fn(),
  })),
  increment: jest.fn((n: number) => n),
  arrayUnion: jest.fn((...args: unknown[]) => args),
  arrayRemove: jest.fn((...args: unknown[]) => args),
  getFirestore: jest.fn(() => ({})),
}));

jest.mock('@/lib/leaderboard-sync-error', () => ({
  leaderboardSyncErrorEmitter: { subscribe: jest.fn(), emit: jest.fn() },
}));

jest.mock('@/lib/streakUtils', () => ({
  calculateStreak: jest.fn(() => ({ currentStreak: 0, maxStreak: 0 })),
  getISTDateString: jest.fn(() => '2026-06-02'),
}));

jest.mock('@/lib/points', () => ({
  POINTS: {
    DAILY_LOGIN: 1,
    WEEKLY_STREAK_BONUS: 20,
    STREAK_BONUS_PER_DAY: 1,
  },
}));

function TestHarness() {
  const { user, login, logout } = useAuth();
  const [error, setError] = React.useState<string | null>(null);
  const handleLogin = async () => {
    try {
      await login('test@test.com', 'pass123');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };
  return (
    <div>
      <span data-testid="user-email">{user?.email || 'null'}</span>
      <span data-testid="error">{error || ''}</span>
      <button data-testid="login-btn" onClick={handleLogin}>
        login
      </button>
      <button data-testid="logout-btn" onClick={logout}>
        logout
      </button>
    </div>
  );
}

function renderWithAuth() {
  return render(
    <AuthProvider>
      <TestHarness />
    </AuthProvider>
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

describe('AuthContext', () => {
  describe('login', () => {
    it('calls signInWithEmailAndPassword with correct credentials', async () => {
      mockSignIn.mockResolvedValue({
        user: { uid: '123', email: 'test@test.com' },
      });
      renderWithAuth();
      await act(async () => {
        screen.getByTestId('login-btn').click();
      });
      expect(mockSignIn).toHaveBeenCalledWith({}, 'test@test.com', 'pass123');
    });

    it('sets localStorage sessionId on success', async () => {
      mockSignIn.mockResolvedValue({
        user: { uid: '123', email: 'test@test.com' },
      });
      renderWithAuth();
      await act(async () => {
        screen.getByTestId('login-btn').click();
      });
      expect(localStorage.getItem('devpath_session_id')).toBeTruthy();
    });
  });

  describe('logout', () => {
    it('clears localStorage sessionId', async () => {
      localStorage.setItem('devpath_session_id', 'test-session');
      renderWithAuth();
      await act(async () => {
        screen.getByTestId('logout-btn').click();
      });
      expect(localStorage.getItem('devpath_session_id')).toBeNull();
    });

    it('calls signOut', async () => {
      renderWithAuth();
      await act(async () => {
        screen.getByTestId('logout-btn').click();
      });
      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  describe('error conditions', () => {
    it('propagates signInWithEmailAndPassword errors', async () => {
      mockSignIn.mockRejectedValue(
        new Error('Firebase: Error (auth/invalid-credential).')
      );
      renderWithAuth();
      await act(async () => {
        screen.getByTestId('login-btn').click();
      });
      await screen.findByTestId('error');
      expect(screen.getByTestId('error')).toHaveTextContent(
        'auth/invalid-credential'
      );
    });

    it('throws readable error when Firebase is unavailable', async () => {
      jest.replaceProperty(firebaseLib, 'firebaseAvailable', false);

      let error: string | null = null;
      function TestPage() {
        const { login } = useAuth();
        return (
          <button
            onClick={async () => {
              try {
                await login('a@b.com', 'p');
              } catch (e: unknown) {
                error = e instanceof Error ? e.message : String(e);
              }
            }}
          >
            login
          </button>
        );
      }

      render(
        <AuthProvider>
          <TestPage />
        </AuthProvider>
      );
      await act(async () => {
        screen.getByText('login').click();
      });
      expect(error).toBe(
        'Firebase is not configured. Login is unavailable in local UI-only mode.'
      );

      jest.replaceProperty(firebaseLib, 'firebaseAvailable', true);
    });
  });
});
