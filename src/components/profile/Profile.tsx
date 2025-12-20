"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Trophy, Flame, Star, Target, MapPin, Link as LinkIcon, Calendar, Phone, LogOut, Camera, Save, X, Github, Instagram, Linkedin, CheckCircle, Share2, Shield, Copy, Check } from 'lucide-react';
import styles from './Profile.module.css';

export default function Profile() {
    const { user, logout, updateUserProfile } = useAuth();
    const [isEditingPhoto, setIsEditingPhoto] = useState(false);
    const [newPhotoURL, setNewPhotoURL] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [copied, setCopied] = useState(false);

    const handlePrivacyToggle = async (setting: 'showMobile' | 'showLocation' | 'showEmail') => {
        if (!user) return;
        const currentSettings = user.privacySettings || { showMobile: false, showLocation: true, showEmail: false };
        const newSettings = {
            ...currentSettings,
            [setting]: !currentSettings[setting]
        };

        // Optimistic update
        await updateUserProfile({ privacySettings: newSettings });
    };

    const handleShareProfile = () => {
        if (!user) return;
        const url = `${window.location.origin}/u/${user.uid}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSavePhoto = async () => {
        if (!newPhotoURL.trim()) return;
        setIsSaving(true);
        try {
            await updateUserProfile({ photoURL: newPhotoURL });
            setIsEditingPhoto(false);
            setNewPhotoURL('');
        } catch (error) {
            console.error("Failed to update photo:", error);
            alert("Failed to update profile picture. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

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
                        <div className={styles.avatar} style={{ position: 'relative' }}>
                            {user.photoURL ? (
                                <img src={user.photoURL} alt={user.name || 'User'} className="w-full h-full object-cover rounded-full" />
                            ) : (
                                user.name?.charAt(0) || 'U'
                            )}
                            <button
                                onClick={() => setIsEditingPhoto(!isEditingPhoto)}
                                className="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors shadow-lg"
                                title="Update Profile Picture"
                            >
                                <Camera size={14} />
                            </button>
                        </div>

                        <div className={styles.details}>
                            <h1 className={styles.name}>{user.name || 'User'}</h1>

                            {isEditingPhoto && (
                                <div className="flex items-center gap-2 mt-2 mb-2 animate-in fade-in slide-in-from-top-2">
                                    <input
                                        type="url"
                                        value={newPhotoURL}
                                        onChange={(e) => setNewPhotoURL(e.target.value)}
                                        placeholder="Enter image URL..."
                                        className="px-3 py-1 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-64"
                                    />
                                    <button
                                        onClick={handleSavePhoto}
                                        disabled={isSaving}
                                        className="p-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                        title="Save"
                                    >
                                        <Save size={16} />
                                    </button>
                                    <button
                                        onClick={() => setIsEditingPhoto(false)}
                                        className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                        title="Cancel"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}

                            <p className={styles.bio}>
                                <span className="text-primary font-bold">{(user.displayRole || user.role || 'MEMBER').toUpperCase()}</span>
                                {user.bio && <span className="text-muted-foreground"> • {user.bio}</span>}
                            </p>

                            <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                                {(user.city || user.state) && (
                                    <span className="flex items-center gap-1">
                                        <MapPin size={14} />
                                        {[user.city, user.district, user.state].filter(Boolean).join(', ')}
                                    </span>
                                )}
                                {user.mobile && (
                                    <span className="flex items-center gap-1">
                                        <Phone size={14} /> {user.mobile}
                                    </span>
                                )}
                                <span className="flex items-center gap-1">
                                    <Calendar size={14} /> Joined Dec 2023
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

                        <div className="flex gap-2 ml-auto self-start">
                            <button
                                onClick={() => setShowPrivacyModal(true)}
                                className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors"
                                title="Privacy Settings"
                            >
                                <Shield size={20} />
                            </button>
                            <button
                                onClick={handleShareProfile}
                                className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                                title="Share Profile"
                            >
                                {copied ? <Check size={20} /> : <Share2 size={20} />}
                            </button>
                            <button
                                onClick={() => {
                                    logout();
                                    window.location.href = '/';
                                }}
                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Privacy Modal */}
                {showPrivacyModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <Shield className="text-primary" size={24} />
                                    Privacy Settings
                                </h3>
                                <button onClick={() => setShowPrivacyModal(false)} className="text-muted-foreground hover:text-foreground">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Phone size={20} className="text-muted-foreground" />
                                        <div>
                                            <div className="font-medium">Show Mobile Number</div>
                                            <div className="text-xs text-muted-foreground">Visible on public profile</div>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={user.privacySettings?.showMobile || false}
                                            onChange={() => handlePrivacyToggle('showMobile')}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <MapPin size={20} className="text-muted-foreground" />
                                        <div>
                                            <div className="font-medium">Show Location</div>
                                            <div className="text-xs text-muted-foreground">Visible on public profile</div>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={user.privacySettings?.showLocation ?? true}
                                            onChange={() => handlePrivacyToggle('showLocation')}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <LinkIcon size={20} className="text-muted-foreground" />
                                        <div>
                                            <div className="font-medium">Show Email</div>
                                            <div className="text-xs text-muted-foreground">Visible on public profile</div>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={user.privacySettings?.showEmail || false}
                                            onChange={() => handlePrivacyToggle('showEmail')}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-blue-500">Your Public Profile Link</span>
                                    <button
                                        onClick={handleShareProfile}
                                        className="text-xs flex items-center gap-1 text-blue-500 hover:underline"
                                    >
                                        {copied ? <Check size={12} /> : <Copy size={12} />}
                                        {copied ? 'Copied' : 'Copy'}
                                    </button>
                                </div>
                                <code className="block w-full p-2 bg-background rounded border border-border text-xs text-muted-foreground break-all">
                                    {`${typeof window !== 'undefined' ? window.location.origin : ''}/u/${user.uid}`}
                                </code>
                            </div>
                        </div>
                    </div>
                )}

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
                    <div className={styles.tab}>Followers</div>
                </div>

                <div>
                    <h2 className={styles.sectionTitle}>Contribution Activity</h2>
                    <div className={styles.activityGraph}>
                        [Activity Heatmap Placeholder]
                    </div>
                </div>
            </div >
        </section >
    );
}
