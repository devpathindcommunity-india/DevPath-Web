// src/app/profile/[username]/page.tsx
// Public-facing portfolio route: /profile/[username]

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublicProfileByUsername } from '@/lib/portfolio-service';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { PathProgressSection } from '@/components/profile/PathProgressSection';
import { SkillBadgesSection } from '@/components/profile/SkillBadgesSection';
import { ProjectShowcaseSection } from '@/components/profile/ProjectShowcaseSection';
import { ExportBar } from '@/components/profile/ExportBar';

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateStaticParams() {
  return [
    { username: 'dummy' },
    { username: 'kew7p1pbj7WoX66uGH2ZMcg79RB3' }
  ];
}

export const dynamicParams = false;

// Generate OpenGraph metadata dynamically
export async function generateMetadata({ params }: Props): Promise<Metadata> {
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

export default async function PublicProfilePage({ params }: Props) {
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
