'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

export interface UseLearningProgressResult {
  completedNodes: string[];
  loading: boolean;
  toggleNode: (pathId: string, nodeId: string) => Promise<void>;
  isNodeCompleted: (pathId: string, nodeId: string) => boolean;
}

export function useLearningProgress(): UseLearningProgressResult {
  const { user } = useAuth();
  const [completedNodes, setCompletedNodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
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
  const actualCompletedNodes = user ? completedNodes : [];
  const actualLoading = user ? loading : false;

  const toggleNode = async (pathId: string, nodeId: string) => {
    if (!user) return;

    const nodeKey = `${pathId}-${nodeId}`;
    const isCompleted = actualCompletedNodes.includes(nodeKey);

    const nextCompletedNodes = isCompleted
      ? actualCompletedNodes.filter((id) => id !== nodeKey)
      : [...actualCompletedNodes, nodeKey];

    // Rely exclusively on Firestore's native latency compensation (which instantly triggers
    // the onSnapshot listener locally) instead of manually maintaining optimistic state
    // which leads to race conditions.
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
  };

  const isNodeCompleted = (pathId: string, nodeId: string) => {
    return actualCompletedNodes.includes(`${pathId}-${nodeId}`);
  };

  return {
    completedNodes: actualCompletedNodes,
    loading: actualLoading,
    toggleNode,
    isNodeCompleted,
  };
}
