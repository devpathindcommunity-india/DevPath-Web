import type { Metadata } from 'next';
import ProfileClient from '../client';
import { db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';

export const dynamicParams = false;

export async function generateStaticParams() {
  return [{ uid: 'dummy' }, { uid: 'kew7p1pbj7WoX66uGH2ZMcg79RB3' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ uid: string }>;
}): Promise<Metadata> {
  const { uid } = await params;

  let title = 'DevPath User Profile';
  let description = 'View a public DevPath community profile.';
  let imageUrl = '/DevPath-logo.webp';

  if (db) {
    try {
      let userDoc = await getDoc(doc(db, 'members', uid));

      if (!userDoc.exists()) {
        const q = query(collection(db, 'members'), where('uid', '==', uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          userDoc = querySnapshot.docs[0];
        }
      }

      if (!userDoc.exists()) {
        userDoc = await getDoc(doc(db, 'admins', uid));
        if (!userDoc.exists()) {
          const q = query(collection(db, 'admins'), where('uid', '==', uid));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            userDoc = querySnapshot.docs[0];
          }
        }
      }

      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data?.privacySettings?.isPublic !== false) {
          title = data.name ? `${data.name} | DevPath Profile` : title;
          description =
            data.bio ||
            `Check out ${data.name || 'this user'}'s profile on DevPath.`;
          if (data.photoURL) {
            imageUrl = data.photoURL;
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user metadata:', error);
    }
  }

  return {
    title,
    description,
    alternates: {
      canonical: `/u/${uid}`,
    },
    openGraph: {
      title,
      description,
      url: `/u/${uid}`,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: title,
        },
      ],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ uid: string }>;
}) {
  const { uid } = await params;

  return <ProfileClient uid={uid} />;
}
