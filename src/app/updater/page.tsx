"use client";

import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';
import { fetchGithubReleaseHistory, type GithubReleaseHistoryItem } from '@/lib/github';
import styles from './Updater.module.css';

const formatReleaseDate = (date: string) => {
    if (!date) return 'Recently updated';
    const releaseDate = new Date(date);

    if (Number.isNaN(releaseDate.getTime())) {
        return 'Recently updated';
    }

    return new Intl.DateTimeFormat('en', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    }).format(releaseDate);
};

export default function UpdaterPage() {
    const [autoUpdate, setAutoUpdate] = useState(true);
    const [notifications, setNotifications] = useState(true);
    const [isChecking, setIsChecking] = useState(false);
    const [releases, setReleases] = useState<GithubReleaseHistoryItem[]>([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const latestRelease = releases[0];

    const loadReleaseHistory = useCallback(async () => {
        setIsChecking(true);
        setError('');

        try {
            const releaseHistory = await fetchGithubReleaseHistory();
            setReleases(releaseHistory);

            if (releaseHistory.length === 0) {
                setError('No recent GitHub releases or merged pull requests were found.');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to load GitHub release history.');
        } finally {
            setIsLoading(false);
            setIsChecking(false);
        }
    }, []);

    useEffect(() => {
        loadReleaseHistory();
    }, [loadReleaseHistory]);

    const handleCheckUpdate = () => {
        loadReleaseHistory();
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.statusCard}>
                    <div className={styles.version}>Live Changelog</div>
                    <div className={styles.channel}>
                        {latestRelease?.source === 'pull-request' ? 'Merged Pull Requests' : 'GitHub Releases'}
                    </div>

                    <div className={styles.message}>
                        {error ? (
                            <>
                                <AlertCircle size={20} color="#f59e0b" />
                                {error}
                            </>
                        ) : (
                            <>
                                <CheckCircle size={20} color="#10b981" />
                                {isLoading
                                    ? 'Fetching the latest GitHub updates...'
                                    : `Latest GitHub update: ${formatReleaseDate(latestRelease?.publishedAt ?? '')}.`}
                            </>
                        )}
                    </div>

                    <Button
                        aria-label="Action button"
                        variant="primary"
                        icon={<RefreshCw size={18} className={isChecking ? 'animate-spin' : ''} />}
                        onClick={handleCheckUpdate}
                    >
                        {isChecking ? 'Checking...' : 'Check for Updates'}
                    </Button>

                    <div className={styles.settings}>
                        <div className={styles.settingRow}>
                            <span className={styles.settingLabel}>Auto-update enabled</span>
                            <label className={styles.switch}>
                                <input
                                    type="checkbox"
                                    checked={autoUpdate}
                                    onChange={() => setAutoUpdate(!autoUpdate)}
                                />
                                <span className={styles.slider}></span>
                            </label>
                        </div>
                        <div className={styles.settingRow}>
                            <span className={styles.settingLabel}>Notify me about new releases</span>
                            <label className={styles.switch}>
                                <input
                                    type="checkbox"
                                    checked={notifications}
                                    onChange={() => setNotifications(!notifications)}
                                />
                                <span className={styles.slider}></span>
                            </label>
                        </div>
                    </div>
                </div>

                <h2 className={styles.sectionTitle}>Release History</h2>

                <div className={styles.timeline} aria-live="polite">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className={styles.release}>
                                <div className={styles.releaseDot} />
                                <div className={styles.releaseHeader}>
                                    <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
                                    <div className={`${styles.skeleton} ${styles.skeletonDate}`} />
                                </div>
                                <div className={styles.releaseNotes}>
                                    <div className={`${styles.skeleton} ${styles.skeletonLine}`} />
                                    <div className={`${styles.skeleton} ${styles.skeletonLineShort}`} />
                                </div>
                            </div>
                        ))
                    ) : releases.length > 0 ? (
                        releases.map(release => (
                            <div key={release.id} className={styles.release}>
                                <div className={styles.releaseDot} />
                                <div className={styles.releaseHeader}>
                                    <a
                                        className={styles.releaseVersion}
                                        href={release.url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {release.title}
                                        <ExternalLink size={16} />
                                    </a>
                                    <div className={styles.releaseDate}>{formatReleaseDate(release.publishedAt)}</div>
                                </div>
                                <div className={styles.releaseNotes}>
                                    <ul className={styles.noteList}>
                                        <li className={styles.noteItem}>{release.description}</li>
                                    </ul>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            GitHub did not return any release history yet. Check back after the next release or merged pull request.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
