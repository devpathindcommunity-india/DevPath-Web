"use client";

import { useAuth } from '@/context/AuthContext';
import { Trophy, Flame, Star, Target, MapPin, Link as LinkIcon, Calendar } from 'lucide-react';
import styles from './Profile.module.css';

export default function Profile() {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className={styles.profile} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p>Please login to view your profile.</p>
            </div>
        );
    }

    return (
        <section className={styles.profile}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.cover} />
                    <div className={styles.userInfo}>
                        <div className={styles.avatar}>
                            {user.name.charAt(0)}
                        </div>
                        <div className={styles.details}>
                            <h1 className={styles.name}>{user.name}</h1>
                            <p className={styles.bio}>Full Stack Developer • Open Source Enthusiast</p>
                            <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> San Francisco, CA</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><LinkIcon size={14} /> github.com/alexchen</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> Joined Dec 2023</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{user.xp.toLocaleString()}</div>
                        <div className={styles.statLabel}><Star size={14} /> Total XP</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>#{user.rank}</div>
                        <div className={styles.statLabel}><Trophy size={14} /> Global Rank</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>{user.streak}</div>
                        <div className={styles.statLabel}><Flame size={14} /> Day Streak</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>24</div>
                        <div className={styles.statLabel}><Target size={14} /> Projects</div>
                    </div>
                </div>

                <div className={styles.tabs}>
                    <div className={`${styles.tab} ${styles.activeTab}`}>Overview</div>
                    <div className={styles.tab}>Projects</div>
                    <div className={styles.tab}>Learning Paths</div>
                    <div className={styles.tab}>Achievements</div>
                    <div className={styles.tab}>Followers</div>
                </div>

                <div>
                    <h2 className={styles.sectionTitle}>Contribution Activity</h2>
                    <div className={styles.activityGraph}>
                        [Activity Heatmap Placeholder]
                    </div>
                </div>
            </div>
        </section>
    );
}
