// src/app/profile/[username]/page.tsx
// Public-facing portfolio route: /profile/[username]

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getPublicProfileByUsername } from '@/lib/portfolio-service';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { PathProgressSection } from '@/components/profile/PathProgressSection';
import { SkillBadgesSection } from '@/components/profile/SkillBadgesSection';
import { ProjectShowcaseSection } from '@/components/profile/ProjectShowcaseSection';
import { ExportBar } from '@/components/profile/ExportBar';

interface Props {
  params: { username: string };
}

export const dynamicParams = false;

export async function generateStaticParams() {
  if (!isFirebaseConfigured) return [];

  try {
    const profilesQuery = query(
      collection(db, 'portfolios'),
      where('isPublic', '==', true)
    );
    const snapshot = await getDocs(profilesQuery);

    return snapshot.docs
      .map((profileDoc) => profileDoc.data().username)
      .filter((username): username is string => Boolean(username))
      .map((username) => ({ username }));
  } catch {
    return [];
  }
}

// Generate OpenGraph metadata dynamically
export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const profile = await getPublicProfileByUsername(username);
  if (!profile) return { title: 'Profile not found' };

  return {
    title: `${profile.displayName} · DevPath Portfolio`,
    description: profile.tagline,
    openGraph: {
      title: `${profile.displayName} · DevPath`,
      description: profile.tagline,
      url: `https://devpath.app/profile/${profile.username}`,
    },
  };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getPublicProfileByUsername(username);

  if (!profile) notFound();

  return (
    <main className="min-h-screen bg-[#0D0F14] text-white">
      {/* ── Profile header: avatar, name, tagline, socials ── */}
      <ProfileHeader profile={profile} />

      <div className="mx-auto max-w-5xl px-4 py-10 space-y-14">
        {/* ── Dev Progress Bars ── */}
        <PathProgressSection paths={profile.paths} />

        {/* ── Verified Tech Stack Badges ── */}
        <SkillBadgesSection skills={profile.skills} />

        {/* ── Project Cards ── */}
        <ProjectShowcaseSection projects={profile.projects} />
      </div>

      {/* ── Sticky export bar ── */}
      <ExportBar profile={profile} />
    </main>
  );
}
