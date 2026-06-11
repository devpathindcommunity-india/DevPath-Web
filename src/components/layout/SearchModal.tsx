'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, FileText, ChevronRight } from 'lucide-react';
import { useSearchOpen, useSetSearchOpen } from '@/stores/ui-store';
import { searchArticles } from '@/utils/wikiSearch';
import { wikiSearchIndex } from '@/data/wikiSearchIndex';
import styles from './SearchModal.module.css';

const STATIC_PAGES = [
  { title: 'Home', href: '/', category: 'Navigation' },
  { title: 'Courses', href: '/courses', category: 'Navigation' },
  { title: 'Pathway', href: '/pathway', category: 'Navigation' },
  { title: 'Community', href: '/community', category: 'Navigation' },
  { title: 'Resources', href: '/resources', category: 'Navigation' },
  { title: 'Events', href: '/events', category: 'Navigation' },
  { title: 'Open Source', href: '/opensource', category: 'Navigation' },
  { title: 'Team', href: '/team', category: 'Navigation' },
];

export default function SearchModal() {
  const router = useRouter();
  const isSearchOpen = useSearchOpen();
  const setSearchOpen = useSetSearchOpen();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setSearchOpen]);

  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (isSearchOpen && !wasOpenRef.current) {
      setTimeout(() => {
        setQuery('');
        inputRef.current?.focus();
      }, 0);
    }
    wasOpenRef.current = isSearchOpen;
  }, [isSearchOpen]);

  const wikiResults = useMemo(() => {
    return searchArticles(wikiSearchIndex, query);
  }, [query]);

  const pageResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return STATIC_PAGES.filter((p) => p.title.toLowerCase().includes(q));
  }, [query]);

  const selectItem = (href: string) => {
    router.push(href);
    setSearchOpen(false);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <>
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
          />
          <div className={styles.modalContainer}>
            <motion.div
              className={styles.modal}
              initial={{ scale: 0.95, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              role="dialog"
              aria-modal="true"
              aria-label="Global Search"
            >
              <div className={styles.searchBar}>
                <Search className={styles.searchIcon} size={20} />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search wiki articles and pages... (Ctrl+K)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className={styles.searchInput}
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className={styles.closeButton}
                  aria-label="Close search"
                >
                  <X size={20} />
                </button>
              </div>

              <div className={styles.resultsArea}>
                {!query.trim() ? (
                  <div className={styles.suggestions}>
                    <p className={styles.sectionTitle}>Quick Navigation</p>
                    <div className={styles.navGrid}>
                      {STATIC_PAGES.map((page) => (
                        <button
                          key={page.href}
                          onClick={() => selectItem(page.href)}
                          className={styles.navButton}
                        >
                          {page.title}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className={styles.resultsList}>
                    {pageResults.length > 0 && (
                      <div className={styles.section}>
                        <p className={styles.sectionTitle}>Pages</p>
                        {pageResults.map((page) => (
                          <button
                            key={page.href}
                            onClick={() => selectItem(page.href)}
                            className={styles.resultItem}
                          >
                            <div className={styles.resultInfo}>
                              <span className={styles.resultCategory}>
                                {page.category}
                              </span>
                              <span className={styles.resultTitle}>
                                {page.title}
                              </span>
                            </div>
                            <ChevronRight size={16} className={styles.arrow} />
                          </button>
                        ))}
                      </div>
                    )}

                    {wikiResults.length > 0 && (
                      <div className={styles.section}>
                        <p className={styles.sectionTitle}>Documentation</p>
                        {wikiResults.map((article) => (
                          <button
                            key={article.id}
                            onClick={() =>
                              selectItem(`/wiki?article=${article.id}`)
                            }
                            className={styles.resultItem}
                          >
                            <div className={styles.resultInfo}>
                              <span className={styles.resultCategory}>
                                {article.category}
                              </span>
                              <span className={styles.resultTitle}>
                                {article.title}
                              </span>
                              <p className={styles.resultDesc}>
                                {article.description}
                              </p>
                            </div>
                            <ChevronRight size={16} className={styles.arrow} />
                          </button>
                        ))}
                      </div>
                    )}

                    {pageResults.length === 0 && wikiResults.length === 0 && (
                      <div className={styles.noResults}>
                        <FileText size={32} className={styles.noResultsIcon} />
                        <p>No results found for &ldquo;{query}&rdquo;</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
