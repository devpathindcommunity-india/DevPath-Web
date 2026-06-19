// src/lib/portfolio-service.ts
// Firestore data layer for the Automated Profile Hub

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase'; // your existing firebase init
import type {
  UserPortfolioProfile,
  PortfolioSkill,
  PortfolioProject,
  PathProgress,
  JSONResume,
} from '@/types/portfolio';

// ─── Collection helpers ──────────────────────────────────────────────────────

const profilesCol = () => collection(db, 'portfolios');
const profileDoc = (userId: string) => doc(db, 'portfolios', userId);

// ─── Read ────────────────────────────────────────────────────────────────────

/**
 * Fetch a portfolio by userId (owner access, always returns regardless of isPublic).
 */
export async function getPortfolioByUserId(
  userId: string
): Promise<UserPortfolioProfile | null> {
  const snap = await getDoc(profileDoc(userId));
  if (!snap.exists()) return null;
  return fromFirestore(snap.data());
}

/**
 * Fetch a portfolio by public username (only returns if isPublic === true).
 */
export async function getPublicProfileByUsername(
  username: string
): Promise<UserPortfolioProfile | null> {
  try {
    const q = query(
      profilesCol(),
      where('username', '==', username),
      where('isPublic', '==', true)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return fromFirestore(snap.docs[0].data());
  } catch (error) {
    console.warn(`[Build Warning] Failed to fetch profile ${username}:`, error);
    return null;
  }
}

// ─── Write ───────────────────────────────────────────────────────────────────

/**
 * Create or overwrite an entire portfolio document.
 * Called once during user onboarding.
 */
export async function createPortfolio(
  userId: string,
  data: Omit<UserPortfolioProfile, 'userId' | 'createdAt' | 'updatedAt'>
): Promise<void> {
  await setDoc(profileDoc(userId), {
    ...data,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Toggle public / private visibility.
 */
export async function setProfileVisibility(
  userId: string,
  isPublic: boolean
): Promise<void> {
  await updateDoc(profileDoc(userId), {
    isPublic,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Update profile metadata (tagline, socials, etc.)
 */
export async function updateProfileMeta(
  userId: string,
  patch: Partial<
    Pick<
      UserPortfolioProfile,
      'tagline' | 'socials' | 'displayName' | 'avatarUrl'
    >
  >
): Promise<void> {
  await updateDoc(profileDoc(userId), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

// ─── Auto-sync hooks (call these from your roadmap completion logic) ──────────

/**
 * Called whenever a skill node is marked complete.
 * Idempotent — won't duplicate if nodeId already present.
 */
export async function syncCompletedSkill(
  userId: string,
  skill: PortfolioSkill
): Promise<void> {
  const profile = await getPortfolioByUserId(userId);
  if (!profile) return;

  const alreadyExists = profile.skills.some((s) => s.nodeId === skill.nodeId);
  if (alreadyExists) return;

  await updateDoc(profileDoc(userId), {
    skills: [...profile.skills, skill],
    updatedAt: serverTimestamp(),
  });
}

/**
 * Called when a project-verification node is submitted.
 * Injects the project into the portfolio instantly.
 */
export async function syncCompletedProject(
  userId: string,
  project: PortfolioProject
): Promise<void> {
  const profile = await getPortfolioByUserId(userId);
  if (!profile) return;

  const alreadyExists = profile.projects.some(
    (p) => p.nodeId === project.nodeId
  );
  if (alreadyExists) {
    // Update in place (user may have updated repo / live URL)
    const updated = profile.projects.map((p) =>
      p.nodeId === project.nodeId ? project : p
    );
    await updateDoc(profileDoc(userId), {
      projects: updated,
      updatedAt: serverTimestamp(),
    });
    return;
  }

  await updateDoc(profileDoc(userId), {
    projects: [...profile.projects, project],
    updatedAt: serverTimestamp(),
  });
}

/**
 * Recalculates and persists path progress percentages.
 * Call this after any node state change in the roadmap.
 */
export async function syncPathProgress(
  userId: string,
  paths: PathProgress[]
): Promise<void> {
  await updateDoc(profileDoc(userId), {
    paths,
    updatedAt: serverTimestamp(),
  });
}

// ─── JSON Resume builder ─────────────────────────────────────────────────────

/**
 * Converts a UserPortfolioProfile into a JSON Resume compliant object.
 * https://jsonresume.org/schema/
 */
export function buildJSONResume(profile: UserPortfolioProfile): JSONResume {
  // Group skills by category → one JSON Resume "skills" entry per category
  const skillsByCategory = profile.skills.reduce<Record<string, string[]>>(
    (acc, s) => {
      if (!acc[s.category]) acc[s.category] = [];
      acc[s.category].push(s.skillName);
      return acc;
    },
    {}
  );

  const profiles = [];
  if (profile.socials.github)
    profiles.push({
      network: 'GitHub',
      username: profile.socials.github.split('/').pop() ?? '',
      url: profile.socials.github,
    });
  if (profile.socials.linkedin)
    profiles.push({
      network: 'LinkedIn',
      username: profile.socials.linkedin.split('/').pop() ?? '',
      url: profile.socials.linkedin,
    });
  if (profile.socials.twitter)
    profiles.push({
      network: 'Twitter',
      username: profile.socials.twitter.replace('@', ''),
      url: `https://twitter.com/${profile.socials.twitter.replace('@', '')}`,
    });

  return {
    basics: {
      name: profile.displayName,
      label: profile.tagline,
      url: profile.socials.website ?? '',
      summary: `Developer profile exported from DevPath. ${profile.paths
        .map((p) => `${p.pathName}: ${p.percentage}% complete`)
        .join(', ')}.`,
      profiles,
    },
    skills: Object.entries(skillsByCategory).map(([category, keywords]) => ({
      name: category,
      level: 'Intermediate',
      keywords,
    })),
    projects: profile.projects.map((p) => ({
      name: p.projectName,
      description: p.description,
      highlights: p.techStack ?? [],
      url: p.liveUrl ?? p.githubUrl,
      roles: ['Developer'],
      type: 'application',
    })),
    meta: {
      canonical: `https://devpath.app/profile/${profile.username}`,
      version: 'v1.0.0',
      lastModified: new Date().toISOString(),
    },
  };
}

// ─── Firestore deserialization ────────────────────────────────────────────────

function fromFirestore(data: Record<string, unknown>): UserPortfolioProfile {
  const toDate = (v: unknown): Date =>
    v instanceof Timestamp ? v.toDate() : new Date(v as string);

  return {
    ...(data as unknown as UserPortfolioProfile),
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
    skills: ((data.skills as PortfolioSkill[]) ?? []).map((s) => ({
      ...s,
      completedAt: toDate(s.completedAt),
    })),
    projects: ((data.projects as PortfolioProject[]) ?? []).map((p) => ({
      ...p,
      completedAt: toDate(p.completedAt),
    })),
  };
}
