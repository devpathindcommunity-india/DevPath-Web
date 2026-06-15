'use client';

import { useEffect, useRef } from 'react';
import { useSearchOpen, useSetSearchOpen } from '@/stores/ui-store';

type ShortcutHandler = (e: KeyboardEvent) => void;

interface ShortcutConfig {
  [key: string]: ShortcutHandler;
}

/**
 * Checks if the event target is inside an input, textarea, or contenteditable element.
 */
const isInputElement = (el: HTMLElement | null): boolean => {
  if (!el) return false;
  const tagName = el.tagName.toUpperCase();
  return tagName === 'INPUT' || tagName === 'TEXTAREA' || el.isContentEditable;
};

/**
 * Parses and matches a keyboard event against a shortcut key combo string.
 * Example combos: 'ctrl+k', 'meta+k', 'cmd+k', 'escape', 'ArrowLeft', '?', 'shift+/'
 */
const matchesCombo = (combo: string, e: KeyboardEvent): boolean => {
  const parts = combo.toLowerCase().split('+');
  const targetKey = parts[parts.length - 1];

  const wantsCtrl = parts.includes('ctrl');
  const wantsMeta = parts.includes('meta') || parts.includes('cmd');
  const wantsAlt = parts.includes('alt');
  const wantsShift = parts.includes('shift');

  const hasCtrl = e.ctrlKey;
  const hasMeta = e.metaKey;
  const hasAlt = e.altKey;
  const hasShift = e.shiftKey;

  // Normalize key name matches
  const eventKey = e.key.toLowerCase();
  let matchesKey = false;

  if (targetKey === 'cmd') {
    // If 'cmd' is specified as the key itself rather than a modifier
    matchesKey = eventKey === 'meta' || eventKey === 'os';
  } else if (targetKey === 'ctrl') {
    matchesKey = eventKey === 'control';
  } else {
    matchesKey = eventKey === targetKey;
  }

  return (
    matchesKey &&
    wantsCtrl === hasCtrl &&
    wantsMeta === hasMeta &&
    wantsAlt === hasAlt &&
    wantsShift === hasShift
  );
};

export function useKeyboardShortcuts(customShortcuts?: ShortcutConfig) {
  const isSearchOpen = useSearchOpen();
  const setSearchOpen = useSetSearchOpen();

  // Store handlers in a ref so the listener doesn't need to re-bind when customShortcuts change
  const shortcutsRef = useRef<ShortcutConfig | undefined>(customShortcuts);
  useEffect(() => {
    shortcutsRef.current = customShortcuts;
  }, [customShortcuts]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement | null;
      const isTyping = isInputElement(activeEl);

      // Input field isolation check
      // Escape key is permitted to bubble to allow closing active modal overlay even when typing in search input
      if (isTyping && e.key !== 'Escape') {
        return;
      }

      // 1. Process custom callbacks passed into the hook first (takes precedence)
      if (shortcutsRef.current) {
        for (const [combo, handler] of Object.entries(shortcutsRef.current)) {
          if (matchesCombo(combo, e)) {
            e.preventDefault();
            handler(e);
            return;
          }
        }
      }

      // 2. Default Global Mappings (runs if no custom handler matched the combo)
      
      // Ctrl+K / Cmd+K -> Toggle Search
      if (matchesCombo('ctrl+k', e) || matchesCombo('meta+k', e) || matchesCombo('cmd+k', e)) {
        e.preventDefault();
        setSearchOpen(!isSearchOpen);
        return;
      }

      // Escape -> Close all open modal overlays/search/drawers
      if (matchesCombo('escape', e)) {
        // Close search if open
        if (isSearchOpen) {
          e.preventDefault();
          setSearchOpen(false);
        }

        // Dispatch global broadcast event for side drawers / menus
        window.dispatchEvent(new CustomEvent('close-all-overlays'));

        // Programmatically close any DOM elements matching close queries as a robust fallback
        const closeButtons = document.querySelectorAll(
          'button[aria-label*="Close" i], button[class*="close" i], button[id*="close" i], [class*="modal" i] button[onClick]'
        );
        closeButtons.forEach((btn) => {
          (btn as HTMLButtonElement).click();
        });
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSearchOpen, setSearchOpen]);
}
