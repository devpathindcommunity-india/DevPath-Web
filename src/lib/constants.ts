/**
 * Centralized static strings used across the app.
 *
 * Goal: avoid the same (or near-identical) hardcoded strings being
 * duplicated across components, so copy changes only need to happen
 * in one place.
 *
 * This file currently covers the "please log in to do X" family of
 * messages, since those were the most widely duplicated pattern found
 * across the codebase. Other scattered one-off alert/error strings can
 * be migrated here incrementally in follow-up PRs.
 */

export const AUTH_MESSAGES = {
  LOGIN_TO_STAR_PROJECTS: 'Please login to star projects.',
  LOGIN_TO_STAR_RESOURCES: 'Please login to star resources!',
  LOGIN_TO_REACT: 'Please login to react.',
  LOGIN_TO_LIKE_PROJECTS: 'Please login to like projects.',
  LOGIN_TO_FOLLOW_USERS: 'Please login to follow users.',
  LOGIN_TO_CONNECT_GITHUB: 'Please login to connect your GitHub account.',
  LOGIN_TO_START_DISCUSSION: 'Please login to start a discussion.',
  LOGIN_TO_REPLY_TO_DISCUSSION: 'Please login to reply to this discussion.',
  LOGIN_TO_VIEW_PROFILE: 'Please login to view your profile.',
} as const;
