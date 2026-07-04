import type { FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
} from 'firebase/firestore';

/**
 * Initialize Firestore with IndexedDB offline persistence (client-only).
 * Uses persistentMultipleTabManager so multiple tabs can share the cache.
 */
export function createFirestoreWithOfflineSupport(
  firebaseApp: FirebaseApp
): Firestore {
  if (typeof window === 'undefined') {
    return getFirestore(firebaseApp);
  }

  try {
    return initializeFirestore(firebaseApp, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
  } catch (error) {
    const firestoreError = error as { code?: string; message?: string };

    if (firestoreError.code === 'failed-precondition') {
      console.warn(
        'Firestore offline persistence: failed-precondition — another tab may already own the cache. Using default Firestore instance.'
      );
    } else if (firestoreError.code === 'unimplemented') {
      console.warn(
        'Firestore offline persistence is not supported in this browser. Using default Firestore instance.'
      );
    } else {
      console.warn(
        'Firestore offline persistence could not be enabled:',
        firestoreError
      );
    }

    return getFirestore(firebaseApp);
  }
}
