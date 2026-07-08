'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

// localStorage key for guest progress persistence
const LOCAL_STORAGE_KEY = 'devpath_roadmap_progress';

/** Read the guest progress map from localStorage. */
function readLocalProgress(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

/** Write the guest progress map to localStorage. */
function writeLocalProgress(data: Record<string, boolean>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage may be unavailable (private browsing quota exceeded, etc.)
  }
}

export interface UseLearningProgressResult {
  completedNodes: string[];
  loading: boolean;
  toggleNode: (pathId: string, nodeId: string) => Promise<void>;
  isNodeCompleted: (pathId: string, nodeId: string) => boolean;
  resetProgress: (pathId?: string) => Promise<void>;
}

export function useLearningProgress(): UseLearningProgressResult {
  const { user } = useAuth();
  const [completedNodes, setCompletedNodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Authenticated path: Firestore real-time sync ──────────────────────────
  useEffect(() => {
    if (!user) {
      // Guest path: load from localStorage
      const localData = readLocalProgress();
      const keys = Object.keys(localData).filter((k) => localData[k]);
      setCompletedNodes(keys);
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'user_progress', user.uid);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setCompletedNodes(data.completedNodes || []);
        } else {
          setCompletedNodes([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to learning progress:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Derive state based on user authentication status to avoid cascading renders
  const actualCompletedNodes = completedNodes;
  const actualLoading = user ? loading : false;

  // ── Toggle a node (complete / incomplete) ─────────────────────────────────
  const toggleNode = useCallback(
    async (pathId: string, nodeId: string) => {
      const nodeKey = `${pathId}-${nodeId}`;
      const isCompleted = actualCompletedNodes.includes(nodeKey);
      const nextCompletedNodes = isCompleted
        ? actualCompletedNodes.filter((id) => id !== nodeKey)
        : [...actualCompletedNodes, nodeKey];

      if (!user) {
        // Guest: persist to localStorage and update local state immediately
        const localData = readLocalProgress();
        if (isCompleted) {
          delete localData[nodeKey];
        } else {
          localData[nodeKey] = true;
        }
        writeLocalProgress(localData);
        setCompletedNodes(nextCompletedNodes);
        return;
      }

      // Authenticated: persist to Firestore (latency compensation via onSnapshot)
      try {
        const docRef = doc(db, 'user_progress', user.uid);
        await setDoc(
          docRef,
          {
            userId: user.uid,
            completedNodes: nextCompletedNodes,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (error) {
        console.error('Failed to save learning progress:', error);
      }
    },
    [user, actualCompletedNodes]
  );

  // ── Reset progress for a specific path (or all) ───────────────────────────
  const resetProgress = useCallback(
    async (pathId?: string) => {
      if (!user) {
        // Guest: clear from localStorage
        if (pathId) {
          const localData = readLocalProgress();
          const filtered = Object.fromEntries(
            Object.entries(localData).filter(([key]) => !key.startsWith(`${pathId}-`))
          );
          writeLocalProgress(filtered);
          setCompletedNodes((prev) => prev.filter((key) => !key.startsWith(`${pathId}-`)));
        } else {
          writeLocalProgress({});
          setCompletedNodes([]);
        }
        return;
      }

      // Authenticated: reset in Firestore
      try {
        const docRef = doc(db, 'user_progress', user.uid);
        const nextNodes = pathId
          ? actualCompletedNodes.filter((key) => !key.startsWith(`${pathId}-`))
          : [];
        await setDoc(
          docRef,
          {
            userId: user.uid,
            completedNodes: nextNodes,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (error) {
        console.error('Failed to reset learning progress:', error);
      }
    },
    [user, actualCompletedNodes]
  );

  const isNodeCompleted = useCallback(
    (pathId: string, nodeId: string) => {
      return actualCompletedNodes.includes(`${pathId}-${nodeId}`);
    },
    [actualCompletedNodes]
  );

  return {
    completedNodes: actualCompletedNodes,
    loading: actualLoading,
    toggleNode,
    isNodeCompleted,
    resetProgress,
  };
}
