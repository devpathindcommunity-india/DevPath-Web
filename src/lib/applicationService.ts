import { db, storage } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp, 
  updateDoc 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { CommunityApplication, ApplicationStatus } from '@/types/application';

const COLLECTION_NAME = 'communityApplications';

/**
 * Uploads a resume PDF to Firebase Storage and returns the download URL.
 */
export const uploadResume = async (uid: string, file: File): Promise<string> => {
  if (file.type !== 'application/pdf') {
    throw new Error('Only PDF files are allowed.');
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size exceeds the 5MB limit.');
  }

  const storageRef = ref(storage, `resumes/${uid}/${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

/**
 * Submits a new community application or updates a draft.
 */
export const submitApplication = async (applicationData: Omit<CommunityApplication, 'status' | 'submittedAt'>): Promise<void> => {
  const applicationRef = doc(db, COLLECTION_NAME, applicationData.uid);
  
  await setDoc(applicationRef, {
    ...applicationData,
    status: 'Pending',
    submittedAt: serverTimestamp(),
  }, { merge: true }); // Use merge in case we update existing instead of creating anew
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
