"use client";

import { useEffect, useState } from 'react';
import { notFound, usePathname } from 'next/navigation';
import { getPublicProfileByUsername } from '@/lib/portfolio-service';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { PathProgressSection } from '@/components/profile/PathProgressSection';
import { SkillBadgesSection } from '@/components/profile/SkillBadgesSection';
import { ProjectShowcaseSection } from '@/components/profile/ProjectShowcaseSection';
import { ExportBar } from '@/components/profile/ExportBar';
import type { UserPortfolioProfile } from '@/types/portfolio';

export default function PublicProfilePage() {
  const [profile, setProfile] = useState<UserPortfolioProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchProfile() {
      try {
        // Extract username from pathname (e.g., "/profile/Aditya")
        const parts = pathname.split('/');
        const username = parts[parts.length - 1];

        if (!username || username === 'profile' || username === 'public') {
          setLoading(false);
          return;
        }

        const data = await getPublicProfileByUsername(username);
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [pathname]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0D0F14] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </main>
    );
  }

  if (!profile) return notFound();

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
