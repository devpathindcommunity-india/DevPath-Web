'use client';

import { useEffect, useState } from 'react';

// Types
interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  published_at: string;
  body: string;
  html_url: string;
  prerelease: boolean;
  draft: boolean;
}

interface ParsedRelease {
  version: string;
  name: string;
  date: string;
  changes: string[];
  url: string;
  prerelease: boolean;
}

// ── Static fallback data ──────────────────────────────────────────────────────
const FALLBACK_RELEASES: ParsedRelease[] = [
  {
    version: 'v2.4.1',
    name: 'v2.4.1',
    date: 'December 14, 2025',
    changes: [
      'Added new Wiki documentation system',
      'Implemented Coming Soon badges for learning paths',
      'Performance improvements for dashboard rendering',
      'Fixed layout issues on mobile devices',
    ],
    url: '#',
    prerelease: false,
  },
  {
    version: 'v2.4.0',
    name: 'v2.4.0',
    date: 'December 10, 2025',
    changes: [
      'Launched new Gamification engine',
      'Added Real-time activity feed',
      'Redesigned User Profile page',
      'Introduced Dark Mode support',
    ],
    url: '#',
    prerelease: false,
  },
  {
    version: 'v2.3.5',
    name: 'v2.3.5',
    date: 'November 28, 2025',
    changes: [
      'Hotfix for login authentication flow',
      'Updated dependency packages',
      'Minor UI tweaks to Navbar',
    ],
    url: '#',
    prerelease: false,
  },
];

// ── Utility: fetch releases from GitHub REST API ──────────────────────────────
async function fetchGitHubReleases(
  owner: string,
  repo: string
): Promise<ParsedRelease[]> {
  const url = `https://api.github.com/repos/${owner}/${repo}/releases`;

  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    next: { revalidate: 3600 }, // cache for 1 hour (Next.js)
  });

  if (!response.ok) {
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText}`
    );
  }

  const data: GitHubRelease[] = await response.json();

  return data
    .filter((r) => !r.draft) // exclude drafts
    .map((r) => ({
      version: r.tag_name,
      name: r.name || r.tag_name,
      date: new Date(r.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      // Parse markdown bullet list from release body
      changes: parseReleaseBody(r.body),
      url: r.html_url,
      prerelease: r.prerelease,
    }));
}

// ── Parse markdown bullet points from release body ────────────────────────────
function parseReleaseBody(body: string | null): string[] {
  if (!body) return ['No release notes provided.'];

  const lines = body.split('\n');
  const bullets: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    // Match lines starting with -, *, or + (markdown bullets)
    const match = trimmed.match(/^[-*+]\s+(.+)/);
    if (match) {
      bullets.push(match[1].trim());
    }
  }

  // If no bullets found, use first 3 non-empty lines as changes
  if (bullets.length === 0) {
    const nonEmpty = lines
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith('#'))
      .slice(0, 3);
    return nonEmpty.length > 0 ? nonEmpty : ['See release notes on GitHub.'];
  }

  return bullets;
}

// ── Skeleton loader ───────────────────────────────────────────────────────────
function ReleaseSkeleton() {
  return (
    <div className="release-skeleton">
      {[1, 2, 3].map((i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-header">
            <div className="skeleton-dot" />
            <div className="skeleton-version" />
            <div className="skeleton-date" />
          </div>
          <div className="skeleton-body">
            {[1, 2, 3].map((j) => (
              <div
                key={j}
                className="skeleton-line"
                style={{ width: `${70 + j * 8}%` }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Release card ──────────────────────────────────────────────────────────────
function ReleaseCard({
  release,
  index,
}: {
  release: ParsedRelease;
  index: number;
}) {
  return (
    <div className="release-card" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="release-timeline-dot" />

      <div className="release-header">
        <div className="release-version-row">
          <a
            href={release.url}
            target="_blank"
            rel="noopener noreferrer"
            className="release-version"
          >
            {release.version}
          </a>
          {release.prerelease && (
            <span className="prerelease-badge">pre-release</span>
          )}
        </div>
        <span className="release-date">{release.date}</span>
      </div>

      <ul className="release-changes">
        {release.changes.map((change, i) => (
          <li key={i} className="release-change-item">
            <span className="change-bullet">•</span>
            {change}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Main page component ───────────────────────────────────────────────────────
export default function UpdaterPage() {
  const [releases, setReleases] = useState<ParsedRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiveData, setIsLiveData] = useState(false);

  // ── Change these to your actual repo ────────────────────────────────────────
  const GITHUB_OWNER = 'devpathindcommunity-india';
  const GITHUB_REPO = 'DevPath-Web';
  // ────────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;

    async function loadReleases() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchGitHubReleases(GITHUB_OWNER, GITHUB_REPO);

        if (!cancelled) {
          if (data.length > 0) {
            setReleases(data);
            setIsLiveData(true);
          } else {
            // API succeeded but no releases published yet — use fallback
            setReleases(FALLBACK_RELEASES);
            setIsLiveData(false);
          }
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : 'Unknown error occurred';

          // Check if it's a rate limit error
          if (message.includes('403') || message.includes('429')) {
            setError(
              'GitHub API rate limit reached. Showing cached release data.'
            );
          } else {
            setError(`Could not fetch live data: ${message}`);
          }

          // Always fall back to static data on error
          setReleases(FALLBACK_RELEASES);
          setIsLiveData(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadReleases();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <style>{`
        /* ── CSS Variables ── */
        :root {
          --bg: #0d1117;
          --surface: #161b22;
          --surface-hover: #1c2128;
          --border: #30363d;
          --text-primary: #e6edf3;
          --text-secondary: #8b949e;
          --text-muted: #6e7681;
          --accent: #58a6ff;
          --accent-dim: #1f6feb33;
          --success: #3fb950;
          --warning: #d29922;
          --error-color: #f85149;
          --dot-color: #58a6ff;
          --line-color: #30363d;
          --radius: 8px;
          --transition: 0.2s ease;
        }

        /* ── Layout ── */
        .updater-page {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text-primary);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica,
            Arial, sans-serif;
          padding: 48px 24px 80px;
        }

        .updater-container {
          max-width: 760px;
          margin: 0 auto;
        }

        /* ── Header ── */
        .updater-header {
          margin-bottom: 40px;
        }

        .updater-title {
          font-size: 28px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 8px;
          letter-spacing: -0.3px;
        }

        .updater-subtitle {
          font-size: 15px;
          color: var(--text-secondary);
          margin: 0 0 16px;
        }

        /* ── Status badges ── */
        .status-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 500;
          padding: 4px 10px;
          border-radius: 20px;
          border: 1px solid transparent;
        }

        .status-badge.live {
          background: #1a3a1a;
          border-color: #3fb95066;
          color: var(--success);
        }

        .status-badge.cached {
          background: #2d2000;
          border-color: #d2992266;
          color: var(--warning);
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: currentColor;
        }

        .status-badge.live .status-dot {
          animation: pulse-green 2s ease-in-out infinite;
        }

        @keyframes pulse-green {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .github-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--accent);
          text-decoration: none;
          padding: 4px 10px;
          border: 1px solid var(--accent-dim);
          border-radius: 20px;
          transition: background var(--transition);
        }

        .github-link:hover {
          background: var(--accent-dim);
        }

        /* ── Error banner ── */
        .error-banner {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: #2a1215;
          border: 1px solid #f8514933;
          border-radius: var(--radius);
          padding: 12px 16px;
          margin-bottom: 24px;
          font-size: 13px;
          color: #ff7b72;
        }

        .error-icon {
          font-size: 15px;
          flex-shrink: 0;
          margin-top: 1px;
        }

        /* ── Timeline ── */
        .releases-timeline {
          position: relative;
          padding-left: 28px;
        }

        .releases-timeline::before {
          content: "";
          position: absolute;
          left: 7px;
          top: 12px;
          bottom: 12px;
          width: 2px;
          background: var(--line-color);
          border-radius: 2px;
        }

        /* ── Release card ── */
        .release-card {
          position: relative;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 20px 20px 18px;
          margin-bottom: 16px;
          animation: fadeInUp 0.4s ease both;
          transition: border-color var(--transition), background var(--transition);
        }

        .release-card:hover {
          border-color: #58a6ff44;
          background: var(--surface-hover);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .release-timeline-dot {
          position: absolute;
          left: -34px;
          top: 24px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--dot-color);
          border: 2px solid var(--bg);
          box-shadow: 0 0 0 2px var(--dot-color);
        }

        .release-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }

        .release-version-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .release-version {
          font-size: 17px;
          font-weight: 700;
          color: var(--accent);
          text-decoration: none;
          font-family: ui-monospace, "SFMono-Regular", "SF Mono", Consolas, monospace;
          letter-spacing: -0.3px;
          transition: opacity var(--transition);
        }

        .release-version:hover {
          opacity: 0.8;
          text-decoration: underline;
        }

        .prerelease-badge {
          font-size: 11px;
          font-weight: 500;
          color: var(--warning);
          background: #2d200066;
          border: 1px solid var(--warning);
          border-radius: 12px;
          padding: 2px 7px;
        }

        .release-date {
          font-size: 13px;
          color: var(--text-muted);
          white-space: nowrap;
        }

        .release-changes {
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .release-change-item {
          display: flex;
          gap: 8px;
          font-size: 14px;
          color: var(--text-secondary);
          padding: 4px 0;
          line-height: 1.5;
        }

        .change-bullet {
          color: var(--text-muted);
          flex-shrink: 0;
          margin-top: 1px;
        }

        /* ── Skeleton ── */
        .release-skeleton {
          padding-left: 28px;
          position: relative;
        }

        .release-skeleton::before {
          content: "";
          position: absolute;
          left: 7px;
          top: 12px;
          bottom: 12px;
          width: 2px;
          background: var(--line-color);
          border-radius: 2px;
        }

        .skeleton-card {
          position: relative;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 20px;
          margin-bottom: 16px;
        }

        .skeleton-dot {
          position: absolute;
          left: -34px;
          top: 24px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--border);
        }

        .skeleton-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .skeleton-version {
          height: 18px;
          width: 80px;
          border-radius: 4px;
          background: var(--border);
          animation: shimmer 1.4s ease-in-out infinite;
        }

        .skeleton-date {
          height: 14px;
          width: 120px;
          border-radius: 4px;
          background: var(--border);
          animation: shimmer 1.4s ease-in-out infinite;
          animation-delay: 0.2s;
        }

        .skeleton-body {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .skeleton-line {
          height: 13px;
          border-radius: 4px;
          background: var(--border);
          animation: shimmer 1.4s ease-in-out infinite;
        }

        .skeleton-line:nth-child(2) { animation-delay: 0.1s; }
        .skeleton-line:nth-child(3) { animation-delay: 0.2s; }

        @keyframes shimmer {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        /* ── Empty state ── */
        .empty-state {
          text-align: center;
          padding: 60px 24px;
          color: var(--text-muted);
        }

        .empty-icon {
          font-size: 40px;
          margin-bottom: 12px;
        }

        .empty-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 6px;
        }

        .empty-description {
          font-size: 14px;
        }

        /* ── Footer ── */
        .updater-footer {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid var(--border);
          text-align: center;
          font-size: 13px;
          color: var(--text-muted);
        }

        .updater-footer a {
          color: var(--accent);
          text-decoration: none;
        }

        .updater-footer a:hover {
          text-decoration: underline;
        }

        /* ── Responsive ── */
        @media (max-width: 600px) {
          .updater-page {
            padding: 32px 16px 60px;
          }

          .updater-title {
            font-size: 22px;
          }

          .release-header {
            flex-direction: column;
            gap: 4px;
          }

          .releases-timeline,
          .release-skeleton {
            padding-left: 20px;
          }

          .releases-timeline::before,
          .release-skeleton::before {
            left: 5px;
          }

          .release-timeline-dot,
          .skeleton-dot {
            left: -26px;
            width: 12px;
            height: 12px;
          }
        }
      `}</style>

      <div className="updater-page">
        <div className="updater-container">
          {/* ── Header ── */}
          <div className="updater-header">
            <h1 className="updater-title">Release History</h1>
            <p className="updater-subtitle">
              Track what's new in DevPath across every version.
            </p>

            <div className="status-row">
              {!loading && (
                <span
                  className={`status-badge ${isLiveData ? 'live' : 'cached'}`}
                >
                  <span className="status-dot" />
                  {isLiveData ? 'Live from GitHub' : 'Showing cached data'}
                </span>
              )}

              <a
                href={`https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases`}
                target="_blank"
                rel="noopener noreferrer"
                className="github-link"
              >
                <svg
                  height="14"
                  width="14"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
                View on GitHub
              </a>
            </div>
          </div>

          {/* ── Error banner ── */}
          {error && (
            <div className="error-banner" role="alert">
              <span className="error-icon">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* ── Content ── */}
          {loading ? (
            <ReleaseSkeleton />
          ) : releases.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <div className="empty-title">No releases yet</div>
              <div className="empty-description">
                Check back once the first version is published on GitHub.
              </div>
            </div>
          ) : (
            <div className="releases-timeline">
              {releases.map((release, i) => (
                <ReleaseCard
                  key={release.version}
                  release={release}
                  index={i}
                />
              ))}
            </div>
          )}

          {/* ── Footer ── */}
          {!loading && releases.length > 0 && (
            <div className="updater-footer">
              {releases.length} release{releases.length !== 1 ? 's' : ''} •{' '}
              <a
                href={`https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases`}
                target="_blank"
                rel="noopener noreferrer"
              >
                See all releases on GitHub ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
