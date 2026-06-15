'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import {
  Flame,
  Github,
  LogIn,
  Menu,
  X,
  LogOut,
  Lock,
  Bookmark,
  Search,
} from 'lucide-react';

import logo from '@/assets/logo.webp';
import { useAuth } from '@/context/AuthContext';
import { NotificationDropdown } from '@/components/NotificationDropdown';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import BookmarkDrawer from '@/components/ui/BookmarkDrawer';
import styles from './Navbar.module.css';
import { calculateStreak } from '@/lib/streakUtils';
import { useMaintenance } from '@/hooks/useMaintenance';
import { useSetSearchOpen } from '@/stores/ui-store';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/courses', label: 'Courses' },
  { href: '/pathway', label: 'Pathway' },
  { href: '/community', label: 'Community' },
  { href: '/resources', label: 'Resources' },
  { href: '/events', label: 'Events' },
  { href: '/opensource', label: 'Open Source' },
  { href: '/team', label: 'Team' },
];

export default function Navbar() {
  const { user, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookmarkDrawerOpen, setBookmarkDrawerOpen] = useState(false);

  const { isMaintenanceMode } = useMaintenance();
  const setSearchOpen = useSetSearchOpen();

  const pathname = usePathname();

  useEffect(() => {
    const handleCloseAll = () => {
      setMobileMenuOpen(false);
      setBookmarkDrawerOpen(false);
    };
    window.addEventListener('close-all-overlays', handleCloseAll);
    return () => window.removeEventListener('close-all-overlays', handleCloseAll);
  }, []);

  const { currentStreak } = useMemo(
    () => calculateStreak(user?.loginDates),
    [user?.loginDates]
  );

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  if (pathname === '/ap') return null;

  const toggleMobileMenu = () => {
    if (!isMaintenanceMode) {
      setMobileMenuOpen((prev) => !prev);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <div
        className={styles.navbarContainer}
        style={{
          top: isMaintenanceMode ? '70px' : '20px',
        }}
      >
        <nav
          className={styles.navbar}
          aria-label="Main navigation"
          style={{
            pointerEvents: isMaintenanceMode ? 'none' : 'auto',
          }}
        >
          {/* Logo */}
          <Link href="/" className={styles.logo} aria-label="DevPath home">
            <div className={styles.logoIcon}>
              <Image
                src={logo}
                alt="DevPath Logo"
                width={32}
                height={32}
                className="rounded-full"
                priority
              />
            </div>

            <span className={styles.logoText}>DevPath</span>
          </Link>

          {/* Center Navigation */}
          <div className={styles.navPill}>
            <div className={styles.navLinks}>
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                if (isMaintenanceMode) {
                  return (
                    <span
                      key={link.href}
                      role="link"
                      aria-disabled="true"
                      tabIndex={0}
                      className={`${styles.navLink} opacity-50 cursor-not-allowed`}
                      title="Maintenance Mode Active"
                    >
                      {link.label === 'Community' && (
                        <Lock size={12} className="inline mr-1" />
                      )}

                      {link.label}
                    </span>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={styles.navLink}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
            
            {/* Scroll Progress Line attached to Pill */}

          </div>
          <motion.div className={styles.progressBar} style={{ scaleX }} />

          {/* Actions */}
          <div
            className={styles.actions}
            role="toolbar"
            aria-label="Navbar actions"
          >
            {user && (
              <div
                className="flex items-center gap-1 px-3 py-1.5 bg-orange-500/10 text-orange-500 rounded-full border border-orange-500/20"
                title={`Current streak: ${currentStreak} days`}
                aria-label={`Current streak: ${currentStreak} days`}
              >
                <Flame
                  size={15}
                  fill="currentColor"
                  style={{ flexShrink: 0 }}
                />

                <span className="text-sm font-semibold leading-none">
                  {currentStreak}
                </span>
              </div>
            )}

            {/* Search */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className={styles.iconButton}
              aria-label="Search"
              title="Search (Ctrl + K)"
            >
              <Search size={18} />
            </button>

            {/* Theme */}
            <ThemeToggle />

            {/* Bookmarks */}
            <button
              type="button"
              onClick={() => setBookmarkDrawerOpen(true)}
              className={styles.iconButton}
              aria-label="Open Saved Bookmarks"
              title="Saved Bookmarks"
            >
              <Bookmark size={18} />
            </button>

            {/* Github */}
            <a
              href="https://github.com/devpathindcommunity-india/DevPath-Web"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.iconButton}
              aria-label="GitHub Repository"
            >
              <Github size={18} />
            </a>

            {/* Notifications */}
            <NotificationDropdown />

            {/* User Section */}
            {user ? (
              <Link
                href="/profile"
                className={styles.profileAvatar}
                title={user.name || 'Profile'}
              >
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={user.name || 'User'}
                    width={36}
                    height={36}
                    className="rounded-full"
                    style={{
                      objectFit: 'cover',
                      width: '100%',
                      height: '100%',
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white font-bold text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </Link>
            ) : (
              <Link
                href={isMaintenanceMode ? '#' : '/login'}
                className={`${styles.profileButton} ${
                  isMaintenanceMode
                    ? 'opacity-50 cursor-not-allowed pointer-events-none'
                    : ''
                }`}
              >
                <LogIn size={16} />

                <span className="hidden sm:inline">Login</span>
              </Link>
            )}

            {/* Mobile Menu */}
            <button
              className={styles.hamburger}
              onClick={toggleMobileMenu}
              aria-label={
                mobileMenuOpen
                  ? 'Close navigation menu'
                  : 'Open navigation menu'
              }
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className={styles.mobileBackdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />

            <motion.div
              id="mobile-nav-drawer"
              className={styles.mobileMenu}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{
                type: 'tween',
                duration: 0.3,
              }}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <div className={styles.mobileHeader}>
                <span id="mobile-nav-title" className={styles.mobileTitle}>
                  Menu
                </span>

                <button
                  className={styles.mobileClose}
                  onClick={closeMobileMenu}
                  aria-label="Close navigation menu"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className={styles.mobileNav} aria-label="Mobile navigation">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={isMaintenanceMode ? '#' : link.href}
                    className={`${styles.mobileLink} ${
                      isMaintenanceMode
                        ? 'opacity-50 cursor-not-allowed pointer-events-none'
                        : ''
                    }`}
                    onClick={isMaintenanceMode ? undefined : closeMobileMenu}
                    aria-current={pathname === link.href ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className={styles.mobileActions}>
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(true);
                    closeMobileMenu();
                  }}
                  className={styles.mobileProfileButton}
                >
                  <Search size={20} />
                  <span>Search</span>
                </button>

                <div className={styles.mobileActionRow}>
                  <ThemeToggle />
                  <span>Toggle Theme</span>
                </div>

                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className={styles.mobileProfileButton}
                      onClick={closeMobileMenu}
                    >
                      <span>{user.name}</span>
                    </Link>

                    <button
                      className={styles.mobileProfileButton}
                      style={{
                        color: '#ef4444',
                        borderColor: '#ef4444',
                      }}
                      onClick={() => {
                        logout();
                        closeMobileMenu();
                        window.location.href = '/';
                      }}
                    >
                      <LogOut size={20} />
                      <span>Logout</span>
                    </button>
                  </>
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
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <BookmarkDrawer
        isOpen={bookmarkDrawerOpen}
        onClose={() => setBookmarkDrawerOpen(false)}
      />
    </>
  );
}
