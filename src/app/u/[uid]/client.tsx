
"use client";

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Trophy, Flame, Star, Target, MapPin, Link as LinkIcon, Calendar, Phone, Github, Instagram, Linkedin, CheckCircle, User as UserIcon } from 'lucide-react';
import styles from '@/components/profile/Profile.module.css';

interface PublicUser {
    name: string;
    photoURL?: string;
    bio?: string;
    role?: string;
    displayRole?: string;
    roleTasks?: string[];
    city?: string;
    state?: string;
    district?: string;
    mobile?: string;
    email?: string;
    github?: string;
    linkedin?: string;
    instagram?: string;
    privacySettings?: {
        showMobile: boolean;
        showLocation: boolean;
        showEmail: boolean;
    };
    createdAt?: string;
}

export default function ProfileClient({ uid }: { uid: string }) {
    const [user, setUser] = useState<PublicUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            if (!uid) return;
            try {
                let userDoc = await getDoc(doc(db, 'members', uid));
                let userData = userDoc.data() as PublicUser | undefined;

                if (userDoc.exists() && userData) {
                    if ((userData as any).roleId) {
                        const roleDoc = await getDoc(doc(db, 'roles', (userData as any).roleId));
                        if (roleDoc.exists()) {
                            const roleData = roleDoc.data();
                            userData = {
                                ...userData,
                                displayRole: roleData.title,
                                roleTasks: roleData.tasks
                            };
                        }
                    }
                    setUser(userData);
                } else {
                    setError('User not found.');
                }
            } catch (err) {
                console.error("Error fetching user:", err);
                setError('Failed to load profile.');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [uid]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
                <UserIcon size={64} className="text-muted-foreground mb-4" />
                <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
                <p className="text-muted-foreground">{error || "The user you are looking for does not exist."}</p>
            </div>
        );
    }

    const showMobile = user.privacySettings?.showMobile;
    const showLocation = user.privacySettings?.showLocation ?? true;
    const showEmail = user.privacySettings?.showEmail;

    return (
        <section className={styles.profile}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.cover} />
                    <div className={styles.userInfo}>
                        <div className={styles.avatar}>
                            {user.photoURL ? (
                                <img src={user.photoURL} alt={user.name || 'User'} className="w-full h-full object-cover rounded-full" />
                            ) : (
                                user.name?.charAt(0) || 'U'
                            )}
                        </div>

                        <div className={styles.details}>
                            <h1 className={styles.name}>{user.name || 'User'}</h1>

                            <p className={styles.bio}>
                                <span className="text-primary font-bold">{(user.displayRole || user.role || 'MEMBER').toUpperCase()}</span>
                                {user.bio && <span className="text-muted-foreground"> • {user.bio}</span>}
                            </p>

                            <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                                {showLocation && (user.city || user.state) && (
                                    <span className="flex items-center gap-1">
                                        <MapPin size={14} />
                                        {[user.city, user.district, user.state].filter(Boolean).join(', ')}
                                    </span>
                                )}
                                {showMobile && user.mobile && (
                                    <span className="flex items-center gap-1">
                                        <Phone size={14} /> {user.mobile}
                                    </span>
                                )}
                                <span className="flex items-center gap-1">
                                    <Calendar size={14} /> Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Dec 2023'}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-3 mt-3">
                                {user.github && (
                                    <a href={user.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm hover:text-primary transition-colors">
                                        <Github size={14} /> GitHub
                                    </a>
                                )}
                                {user.linkedin && (
                                    <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm hover:text-primary transition-colors">
                                        <Linkedin size={14} /> LinkedIn
                                    </a>
                                )}
                                {user.instagram && (
                                    <a href={user.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm hover:text-primary transition-colors">
                                        <Instagram size={14} /> Instagram
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {user.roleTasks && user.roleTasks.length > 0 && (
                    <div className="mt-6 p-6 bg-card rounded-xl border border-border shadow-sm">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Target className="text-primary" size={20} />
                            Role Responsibilities
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {user.roleTasks.map((task, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 bg-background/50 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
                                    <CheckCircle size={18} className="text-green-500 mt-0.5 shrink-0" />
                                    <span className="text-sm text-foreground/90">{task}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>0</div>
                        <div className={styles.statLabel}><Star size={14} /> Total XP</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>#0</div>
                        <div className={styles.statLabel}><Trophy size={14} /> Global Rank</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>0</div>
                        <div className={styles.statLabel}><Flame size={14} /> Day Streak</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statValue}>0</div>
                        <div className={styles.statLabel}><Target size={14} /> Projects</div>
                    </div>
                </div>

                <div className={styles.tabs}>
                    <div className={`${styles.tab} ${styles.activeTab}`}>Overview</div>
                    <div className={styles.tab}>Projects</div>
                    <div className={styles.tab}>Learning Paths</div>
                    <div className={styles.tab}>Achievements</div>
                </div>

                <div>
                    <h2 className={styles.sectionTitle}>Contribution Activity</h2>
                    <div className={styles.activityGraph}>
                        <div className="flex items-center justify-center h-32 text-muted-foreground bg-muted/20 rounded-lg border border-border/50">
                            Activity Heatmap Coming Soon
                        </div>
                    </div>
                </div>
            </div >
        </section >
    );
}
