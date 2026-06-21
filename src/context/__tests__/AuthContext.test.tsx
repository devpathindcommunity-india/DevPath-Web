import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';

const mockSignIn = jest.fn();
const mockSignOut = jest.fn();
const mockOnAuthStateChanged = jest.fn(() => jest.fn());
const mockOnSnapshot = jest.fn(
  (
    _ref: unknown,
    cb: (snapshot: { exists: () => boolean; data?: () => Record<string, unknown> }) => void
  ) => {
    cb({ exists: () => false });
    return jest.fn();
  }
);

const firebaseMock = {
  auth: {},
  db: {},
  firebaseAvailable: true,
  firebaseConfig: {},
};

jest.mock('firebase/auth', () => ({
  getAuth: () => ({}),
  onAuthStateChanged: (...args: unknown[]) => mockOnAuthStateChanged(...args),
  signInWithEmailAndPassword: (...args: unknown[]) => mockSignIn(...args),
  signOut: (...args: unknown[]) => mockSignOut(...args),
  setPersistence: jest.fn(() => Promise.resolve()),
  browserLocalPersistence: {},
}));

jest.mock('@/lib/firebase', () => ({
  get auth() {
    return firebaseMock.auth;
  },
  get db() {
    return firebaseMock.db;
  },
  get firebaseAvailable() {
    return firebaseMock.firebaseAvailable;
  },
  get firebaseConfig() {
    return firebaseMock.firebaseConfig;
  },
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(() => ({})),
  getDoc: jest.fn(() => Promise.resolve({ exists: () => false })),
  setDoc: jest.fn(() => Promise.resolve()),
  onSnapshot: (
    ref: unknown,
    cb: (snapshot: { exists: () => boolean; data?: () => Record<string, unknown> }) => void,
    errorCb?: (error: Error) => void
  ) => mockOnSnapshot(ref, cb, errorCb),
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
  const { user, isLoading, login, logout } = useAuth();
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
      <span data-testid="loading-status">{isLoading ? 'loading' : 'done'}</span>
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
  mockOnAuthStateChanged.mockImplementation(() => jest.fn());
  mockOnSnapshot.mockImplementation(
    (
      _ref: unknown,
      cb: (snapshot: { exists: () => boolean; data?: () => Record<string, unknown> }) => void
    ) => {
      cb({ exists: () => false });
      return jest.fn();
    }
  );
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
      firebaseMock.firebaseAvailable = false;

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

      firebaseMock.firebaseAvailable = true;
    });
  });

  describe('Firestore onSnapshot loading state', () => {
    it('sets isLoading to false when Firestore sync succeeds', async () => {
      mockOnAuthStateChanged.mockImplementation((_auth: unknown, callback: (user: { uid: string; email: string | null; displayName: string | null } | null) => void) => {
        callback({ uid: 'test-uid', email: 'test@example.com', displayName: 'Test User' });
        return jest.fn();
      });

      mockOnSnapshot.mockImplementation(
        (
          _ref: unknown,
          cb: (snapshot: { exists: () => boolean; data?: () => Record<string, unknown> }) => void
        ) => {
          cb({
            exists: () => true,
            data: () => ({
              role: 'member',
              points: 100,
            }),
          });
          return jest.fn();
        }
      );

      renderWithAuth();

      await waitFor(() => {
        expect(screen.getByTestId('loading-status')).toHaveTextContent('done');
      });
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    });

    it('sets isLoading to false and does not hang when Firestore sync fails', async () => {
      mockOnAuthStateChanged.mockImplementation((_auth: unknown, callback: (user: { uid: string; email: string | null; displayName: string | null } | null) => void) => {
        callback({ uid: 'test-uid-error', email: 'test-error@example.com', displayName: 'Test User Error' });
        return jest.fn();
      });

      mockOnSnapshot.mockImplementation(
        (
          _ref: unknown,
          _cb: (snapshot: { exists: () => boolean; data?: () => Record<string, unknown> }) => void,
          errorCb?: (error: Error) => void
        ) => {
          if (errorCb) {
            errorCb(new Error('Mocked Firestore Permission Denied'));
          }
          return jest.fn();
        }
      );

      renderWithAuth();

      await waitFor(() => {
        expect(screen.getByTestId('loading-status')).toHaveTextContent('done');
      });
    });
  });
});
