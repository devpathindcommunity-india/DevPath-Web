"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Globe, Github, Moon, User, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Notifications from './Notifications';
import styles from './Navbar.module.css';

export default function Navbar() {
    const { user, login, logout } = useAuth();

    return (
        <nav className={styles.navbar}>
            <Link href="/" className={styles.logo}>
                <div className={styles.logoIcon}>
                    <Image src="/logo.png" alt="DevPath Logo" width={32} height={32} />
                </div>
                DevPath
            </Link>

            <div className={styles.navLinks}>
                <Link href="/" className={styles.navLink}>Home</Link>
                <Link href="/paths" className={styles.navLink}>Learning Paths</Link>
                <Link href="/community" className={styles.navLink}>Community</Link>
                <Link href="/resources" className={styles.navLink}>Resources</Link>
                <Link href="/events" className={styles.navLink}>Events</Link>
                <Link href="/leaderboard" className={styles.navLink}>Leaderboard</Link>
            </div>

            <div className={styles.actions}>
                <button className={styles.iconButton} aria-label="Select Language">
                    <Globe size={20} />
                </button>
                <button className={styles.iconButton} aria-label="Toggle Theme">
                    <Moon size={20} />
                </button>
                <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.iconButton}
                    aria-label="GitHub"
                >
                    <Github size={20} />
                </a>

                <Notifications />

                {user ? (
                    <Link href="/profile" className={styles.profileButton}>
                        <div className={styles.avatar} style={{ width: 24, height: 24, borderRadius: '50%', background: '#3b82f6' }} />
                        <span>{user.name}</span>
                    </Link>
                ) : (
                    <button className={styles.profileButton} onClick={login}>
                        <LogIn size={16} />
                        <span>Login</span>
                    </button>
                )}
            </div>
        </nav>
    );
}
