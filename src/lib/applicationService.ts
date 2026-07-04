import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp, 
  updateDoc,
  addDoc
} from 'firebase/firestore';
import { CommunityApplication, ApplicationStatus } from '@/types/application';

const COLLECTION_NAME = 'communityApplications';

/**
 * Submits a new community application or updates a draft.
 */
export const submitApplication = async (applicationData: Omit<CommunityApplication, 'status' | 'submittedAt'>): Promise<void> => {
  const finalData = {
    ...applicationData,
    status: 'Pending',
    submittedAt: serverTimestamp(),
  };

  if (applicationData.uid) {
    const applicationRef = doc(db, COLLECTION_NAME, applicationData.uid);
    await setDoc(applicationRef, finalData, { merge: true });
  } else {
    await addDoc(collection(db, COLLECTION_NAME), finalData);
  }
};

/**
 * Retrieves the application for a specific user. Returns null if none exists.
 */
export const getUserApplication = async (uid: string): Promise<CommunityApplication | null> => {
  const applicationRef = doc(db, COLLECTION_NAME, uid);
  const snap = await getDoc(applicationRef);
  if (snap.exists()) {
    return { applicationId: snap.id, ...snap.data() } as CommunityApplication;
  }
  return null;
};

/**
 * Retrieves all applications for the admin dashboard.
 */
export const getAllApplications = async (): Promise<CommunityApplication[]> => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('submittedAt', 'desc'));
  const snap = await getDocs(q);
  
  return snap.docs.map(doc => ({
    applicationId: doc.id,
    ...doc.data()
  })) as CommunityApplication[];
};

/**
 * Updates the status and adds admin notes to an application.
 */
export const updateApplicationStatus = async (
  uid: string, 
  status: ApplicationStatus, 
  notes: string, 
  adminId: string
): Promise<void> => {
  const applicationRef = doc(db, COLLECTION_NAME, uid);
  await updateDoc(applicationRef, {
    status,
    notes,
    reviewedBy: adminId,
    reviewedAt: serverTimestamp()
  });
};
