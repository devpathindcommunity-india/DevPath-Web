'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bookmark,
  Calendar,
  Grid,
  List,
  Search,
  SlidersHorizontal,
  Clock,
  Building,
  Check,
  AlertTriangle,
  ArrowUpDown,
} from 'lucide-react';
import { useBookmarks, BookmarkItem } from '@/hooks/useBookmarks';

const MOCK_OPPORTUNITIES: BookmarkItem[] = [
  {
    id: 'opp-1',
    title: 'Open Source Contributor',
    description:
      'GSoC is a global program focused on bringing student developers into open source software development.',
    type: 'opportunity',
    company: 'Google',
    deadline: '2026-06-25T23:59:59Z',
    tags: ['Open Source', 'Remote', 'Stipend'],
    color: 'linear-gradient(135deg, #ea4335, #c5221f)',
  },
  {
    id: 'opp-2',
    title: 'Software Engineering Intern',
    description:
      "Join Meta's product teams to build technologies that help people connect, find communities, and grow businesses.",
    type: 'opportunity',
    company: 'Meta',
    deadline: '2026-06-20T23:59:59Z',
    tags: ['Internship', 'Frontend', 'Backend'],
    color: 'linear-gradient(135deg, #0080ff, #0055b3)',
  },
  {
    id: 'opp-3',
    title: 'Hackathon Participant',
    description:
      'Our annual 48-hour hackathon to build open-source projects for community welfare. Compete for cash prizes and mentorship.',
    type: 'opportunity',
    company: 'DevPath',
    deadline: '2026-06-18T18:00:00Z',
    tags: ['Hackathon', 'Community', 'Prizes'],
    color: 'linear-gradient(135deg, #10b981, #047857)',
  },
  {
    id: 'opp-4',
    title: 'GitHub Octernship Fellow',
    description:
      'The GitHub Octernships program connects students with industry partners for paid internship opportunities.',
    type: 'opportunity',
    company: 'GitHub',
    deadline: '2026-07-15T23:59:59Z',
    tags: ['Fellowship', 'Remote', 'Paid'],
    color: 'linear-gradient(135deg, #24292e, #1a1e22)',
  },
  {
    id: 'opp-5',
    title: 'Developer Participant',
    description:
      'Build next-generation payment integrations and financial tools using Stripe API.',
    type: 'opportunity',
    company: 'Stripe',
    deadline: '2026-06-01T23:59:59Z',
    tags: ['Hackathon', 'API', 'Payments'],
    color: 'linear-gradient(135deg, #635bff, #4339ca)',
  },
];

interface DeadlineStatus {
  text: string;
  status: 'expired' | 'closing-today' | 'closing-tomorrow' | 'upcoming';
  daysLeft: number;
}

const calculateDeadlineStatus = (deadlineStr: string): DeadlineStatus => {
  const deadline = new Date(deadlineStr).getTime();
  const now = Date.now();
  const diff = deadline - now;

  if (diff <= 0) {
    return { text: 'Expired', status: 'expired', daysLeft: -1 };
  }

  const oneDay = 24 * 60 * 60 * 1000;
  const daysLeft = diff / oneDay;

  if (daysLeft <= 1) {
    return { text: 'Closing today', status: 'closing-today', daysLeft };
  } else if (daysLeft <= 2) {
    return { text: 'Closing tomorrow', status: 'closing-tomorrow', daysLeft };
  } else {
    return {
      text: `${Math.ceil(daysLeft)} days left`,
      status: 'upcoming',
      daysLeft,
    };
  }
};

export default function OpportunityDashboard() {
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();
  const [activeTab, setActiveTab] = useState<'explore' | 'bookmarked'>(
    'explore'
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'deadline' | 'recent' | 'alpha'>(
    'deadline'
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter bookmarked opportunities to match our schema
  const bookmarkedOpportunities = useMemo(() => {
    return bookmarks.filter((b) => b.type === 'opportunity');
  }, [bookmarks]);

  // Combine mock data with bookmark updates to display correct saved states
  const opportunitiesSource = useMemo(() => {
    if (activeTab === 'bookmarked') {
      return bookmarkedOpportunities;
    }
    return MOCK_OPPORTUNITIES;
  }, [activeTab, bookmarkedOpportunities]);

  // Handle Search & Filter logic
  const processedOpportunities = useMemo(() => {
    let result = [...opportunitiesSource];

    // Search query match
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (opp) =>
          opp.title.toLowerCase().includes(query) ||
          opp.company?.toLowerCase().includes(query) ||
          opp.tags?.some((t) => t.toLowerCase().includes(query))
      );
    }

    // Sort matching configuration
    result.sort((a, b) => {
      if (sortBy === 'deadline') {
        const timeA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
        const timeB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
        return timeA - timeB;
      }
      if (sortBy === 'recent') {
        const bookmarkedA = a.bookmarkedAt ?? 0;
        const bookmarkedB = b.bookmarkedAt ?? 0;
        // Most recent first
        return bookmarkedB - bookmarkedA;
      }
      if (sortBy === 'alpha') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return result;
  }, [opportunitiesSource, searchQuery, sortBy]);

  const handleBookmarkToggle = (opp: BookmarkItem) => {
    const isSaved = isBookmarked(opp.id);
    if (isSaved) {
      toggleBookmark(opp);
    } else {
      toggleBookmark({
        ...opp,
        bookmarkedAt: Date.now(),
      });
    }
  };

  return (
    <div className="w-full space-y-6 text-slate-100">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-slate-950/40 border border-slate-900 rounded-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <SlidersHorizontal className="text-primary" size={22} />
            Opportunity Hub
          </h2>
          <p className="text-xs text-slate-400">
            Track applications, countdown deadlines, and save high-value career
            opportunities.
          </p>
        </div>

        {/* View and Sorting Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              size={16}
            />
            <input
              type="text"
              placeholder="Search title, company, tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 focus:border-primary/50 focus:outline-none rounded-xl text-xs text-white placeholder:text-slate-600 transition-colors"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2">
            <ArrowUpDown size={14} className="text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="deadline" className="bg-slate-950">
                Closest Deadline
              </option>
              <option value="recent" className="bg-slate-950">
                Recently Bookmarked
              </option>
              <option value="alpha" className="bg-slate-950">
                Alphabetical
              </option>
            </select>
          </div>

          {/* Grid/List toggler */}
          <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-slate-500 hover:text-slate-300'}`}
              title="Grid View"
              aria-label="Switch to grid view"
            >
              <Grid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'text-slate-500 hover:text-slate-300'}`}
              title="List View"
              aria-label="Switch to list view"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-900 pb-px">
        <button
          onClick={() => setActiveTab('explore')}
          className={`pb-3 px-4 text-sm font-bold relative transition-colors ${
            activeTab === 'explore'
              ? 'text-white'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Explore
          {activeTab === 'explore' && (
            <motion.div
              layoutId="activeTabUnderline"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab('bookmarked')}
          className={`pb-3 px-4 text-sm font-bold relative transition-colors flex items-center gap-1.5 ${
            activeTab === 'bookmarked'
              ? 'text-white'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          My Bookmarks
          {mounted && bookmarkedOpportunities.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/20 text-primary border border-primary/30">
              {bookmarkedOpportunities.length}
            </span>
          )}
          {activeTab === 'bookmarked' && (
            <motion.div
              layoutId="activeTabUnderline"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
            />
          )}
        </button>
      </div>

      {/* Dashboard Grid/List */}
      <AnimatePresence mode="popLayout">
        {processedOpportunities.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex flex-col items-center justify-center p-12 bg-slate-950/20 border border-slate-900 rounded-2xl text-center"
          >
            <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mb-4 text-slate-500">
              <Bookmark size={20} />
            </div>
            <h3 className="text-md font-bold text-white mb-1">
              No Opportunities Found
            </h3>
            <p className="text-xs text-slate-500 max-w-xs">
              {activeTab === 'bookmarked'
                ? 'Save opportunities from the Explore tab to track deadlines here.'
                : 'No opportunities match your current filter query.'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            layout
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {processedOpportunities.map((opp) => {
              const saved = isBookmarked(opp.id);
              const status = opp.deadline
                ? calculateDeadlineStatus(opp.deadline)
                : null;

              // Deadline badge styling configuration
              let badgeColor = 'bg-slate-900 text-slate-400 border-slate-800';
              if (status) {
                if (status.status === 'expired') {
                  badgeColor = 'bg-red-500/10 text-red-400 border-red-500/20';
                } else if (status.status === 'closing-today') {
                  badgeColor =
                    'bg-orange-500/10 text-orange-400 border-orange-500/20 animate-pulse';
                } else if (status.status === 'closing-tomorrow') {
                  badgeColor =
                    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
                } else {
                  badgeColor =
                    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                }
              }

              return (
                <motion.div
                  key={opp.id}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                  className={`bg-slate-950/40 border border-slate-900 rounded-2xl relative overflow-hidden backdrop-blur-md group hover:border-primary/20 transition-all ${
                    viewMode === 'list'
                      ? 'p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4'
                      : 'p-6 flex flex-col justify-between min-h-[260px]'
                  }`}
                >
                  {/* Accent Side Line */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[3px]"
                    style={{ background: opp.color || 'var(--primary)' }}
                  ></div>

                  {/* Body Content */}
                  <div
                    className={`space-y-3.5 pl-2 ${viewMode === 'list' ? 'flex-1' : ''}`}
                  >
                    {/* Header Row: Company and Title */}
                    <div className="space-y-1">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                        <Building size={11} className="text-primary" />
                        {opp.company}
                      </span>
                      <h3 className="text-md font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
                        {opp.title}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {opp.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {opp.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900 border border-slate-800/60 text-slate-400 uppercase tracking-wider"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Footer (List layout alignment) */}
                  <div
                    className={`pl-2 pt-3 flex flex-wrap items-center justify-between gap-3 ${
                      viewMode === 'list'
                        ? 'sm:border-t-0 sm:pt-0 sm:flex-col sm:items-end justify-end'
                        : 'border-t border-slate-900 mt-4'
                    }`}
                  >
                    {/* Deadline & Countdown */}
                    {opp.deadline && (
                      <div className="flex flex-col gap-1.5 text-left sm:text-right">
                        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
                          <Calendar size={12} className="text-primary" />
                          <span>
                            {new Date(opp.deadline).toLocaleDateString(
                              undefined,
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              }
                            )}
                          </span>
                        </div>
                        {mounted ? (
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border w-fit ${badgeColor}`}
                          >
                            <Clock size={10} />
                            {status?.text}
                          </span>
                        ) : (
                          <div className="h-4 w-16 bg-slate-900 animate-pulse rounded-full"></div>
                        )}
                      </div>
                    )}

                    {/* Bookmark Toggle Button */}
                    <button
                      onClick={() => handleBookmarkToggle(opp)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-300 w-full sm:w-auto justify-center ${
                        saved
                          ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20'
                          : 'bg-primary hover:bg-primary/95 text-white shadow-lg shadow-primary/10'
                      }`}
                      title={
                        saved ? 'Remove from bookmarks' : 'Add to bookmarks'
                      }
                    >
                      {saved ? (
                        <>
                          <AlertTriangle size={13} />
                          <span>Unsave</span>
                        </>
                      ) : (
                        <>
                          <Check size={13} />
                          <span>Bookmark</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
