// src/components/profile/ProfileHeader.tsx
'use client';

import Image from 'next/image';
import { Github, Linkedin, Twitter, Globe } from 'lucide-react';
import type { UserPortfolioProfile } from '@/types/portfolio';

interface Props {
  profile: UserPortfolioProfile;
}

export function ProfileHeader({ profile }: Props) {
  const { displayName, tagline, avatarUrl, username, socials } = profile;

  return (
    <header className="relative border-b border-white/10 bg-gradient-to-b from-[#1A1D25] to-[#0D0F14]">
      <div className="mx-auto max-w-5xl px-4 py-12 flex flex-col sm:flex-row items-center sm:items-end gap-6">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={displayName}
              width={96}
              height={96}
              className="rounded-full ring-4 ring-[#4F9EFF]/40 object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full ring-4 ring-[#4F9EFF]/40 bg-gradient-to-br from-[#4F9EFF] to-[#8B5CF6] flex items-center justify-center text-3xl font-bold">
              {displayName[0]}
            </div>
          )}
          {/* Verified badge */}
          <span className="absolute -bottom-1 -right-1 bg-[#4F9EFF] rounded-full p-1">
            <svg
              className="w-3 h-3 text-white"
              viewBox="0 0 12 12"
              fill="currentColor"
            >
              <path
                d="M10.5 3L5 8.5 2 5.5"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

        {/* Text */}
        <div className="text-center sm:text-left flex-1">
          <p className="text-sm text-[#4F9EFF] font-mono mb-1">@{username}</p>
          <h1 className="text-3xl font-bold tracking-tight">{displayName}</h1>
          {tagline && <p className="mt-1 text-gray-400 max-w-md">{tagline}</p>}
        </div>

        {/* Social links */}
        <nav className="flex gap-3">
          {socials.github && (
            <SocialLink href={socials.github} label="GitHub">
              <Github size={18} />
            </SocialLink>
          )}
          {socials.linkedin && (
            <SocialLink href={socials.linkedin} label="LinkedIn">
              <Linkedin size={18} />
            </SocialLink>
          )}
          {socials.twitter && (
            <SocialLink
              href={`https://twitter.com/${socials.twitter.replace('@', '')}`}
              label="Twitter"
            >
              <Twitter size={18} />
            </SocialLink>
          )}
          {socials.website && (
            <SocialLink href={socials.website} label="Website">
              <Globe size={18} />
            </SocialLink>
          )}
        </nav>
      </div>
    </header>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-[#4F9EFF] transition-colors text-gray-400"
    >
      {children}
    </a>
  );
}
