"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Github, LogIn, Menu, X, LogOut } from 'lucide-react';
import logo from '@/assets/logo.png';
import { useAuth } from '@/context/AuthContext';
import { NotificationDropdown } from '@/components/NotificationDropdown';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import styles from './Navbar.module.css';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/paths', label: 'Learning Paths' },
    { href: '/community', label: 'Community' },
    { href: '/resources', label: 'Resources' },
    { href: '/events', label: 'Events' },
    { href: '/team', label: 'Team' },
];

export default function Navbar() {
    const { user, login, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <>
            <nav className={styles.navbar}>
                <Link href="/" className={styles.logo}>
                    <div className={styles.logoIcon}>
                        <Image src={logo} alt="DevPath Logo" width={32} height={32} />
                    </div>
                    DevPath
                </Link>

                {/* Desktop Navigation */}
                <div className={styles.navLinks}>
                    {navLinks.map((link) => (
                        <Link key={link.href} href={link.href} className={styles.navLink}>
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className={styles.actions}>
                    <button className={styles.iconButton} aria-label="Select Language">
                        <Globe size={20} />
                    </button>
                    <ThemeToggle />
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.iconButton}
                        aria-label="GitHub"
                    >
                        <Github size={20} />
                    </a>

                    <NotificationDropdown />

                    {user ? (
                        <Link href="/profile" className={styles.profileButton}>
                            <div className={styles.avatar} style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--primary)' }}>
                                {user.photoURL && <Image src={user.photoURL} alt={user.name || 'User'} width={24} height={24} className="rounded-full" />}
                            </div>
                            <span>{user.name}</span>
                        </Link>
                    ) : (
                        <Link href="/login" className={styles.profileButton}>
                            <LogIn size={16} />
                            <span>Login</span>
                        </Link>
                    )}

                    {/* Hamburger Menu Button (Mobile Only) */}
                    <button
                        className={styles.hamburger}
                        onClick={toggleMobileMenu}
                        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className={styles.mobileBackdrop}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeMobileMenu}
                        />

                        {/* Drawer */}
                        <motion.div
                            className={styles.mobileMenu}
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                        >
                            <div className={styles.mobileHeader}>
                                <span className={styles.mobileTitle}>Menu</span>
                                <button
                                    className={styles.mobileClose}
                                    onClick={closeMobileMenu}
                                    aria-label="Close menu"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <nav className={styles.mobileNav}>
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={styles.mobileLink}
                                        onClick={closeMobileMenu}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>

                            <div className={styles.mobileActions}>
                                <div className={styles.mobileActionRow}>
                                    <ThemeToggle />
                                    <span>Toggle Theme</span>
                                </div>

                                {user ? (
                                    <Link
                                        href="/profile"
                                        className={styles.mobileProfileButton}
                                        onClick={closeMobileMenu}
                                    >
                                        <span>{user.name}</span>
                                    </Link>
                                ) : (
                                    <Link
                                        href="/login"
                                        className={styles.mobileProfileButton}
                                        onClick={closeMobileMenu}
                                    >
                                        <LogIn size={20} />
                                        <span>Login</span>
                                    </Link>
                                )}
                                {user && (
                                    <button
                                        className={styles.mobileProfileButton}
                                        onClick={() => {
                                            logout();
                                            closeMobileMenu();
                                            window.location.href = '/';
                                        }}
                                        style={{ color: '#ef4444', borderColor: '#ef4444' }}
                                    >
                                        <LogOut size={20} />
                                        <span>Logout</span>
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
