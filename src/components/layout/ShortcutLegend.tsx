'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard, Search, CornerDownLeft, ArrowLeftRight, HelpCircle } from 'lucide-react';

interface ShortcutLegendProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  description: string;
  icon?: any;
}

interface ShortcutSection {
  title: string;
  items: ShortcutItem[];
}

const SHORTCUT_SECTIONS: ShortcutSection[] = [
  {
    title: 'Global Shortcuts',
    items: [
      {
        keys: ['Ctrl', 'K'],
        description: 'Toggle Global Search Input',
        icon: Search,
      },
      {
        keys: ['Cmd', 'K'],
        description: 'Toggle Global Search Input (macOS)',
        icon: Search,
      },
      {
        keys: ['?'],
        description: 'Toggle Keyboard Shortcut Legend',
        icon: HelpCircle,
      },
      {
        keys: ['Esc'],
        description: 'Close Open Modals / Side Drawers / Search',
        icon: X,
      },
    ],
  },
  {
    title: 'Roadmap Navigation',
    items: [
      {
        keys: ['→'],
        description: 'Cycle focused roadmap selection forward',
        icon: ArrowLeftRight,
      },
      {
        keys: ['←'],
        description: 'Cycle focused roadmap selection backward',
        icon: ArrowLeftRight,
      },
    ],
  },
];

export default function ShortcutLegend({ isOpen, onClose }: ShortcutLegendProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with premium blur */}
          <motion.div
            className="fixed inset-0 z-[2500] bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[2600] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className="w-full max-w-lg bg-slate-950/90 dark:bg-slate-950/90 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto backdrop-blur-xl relative"
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              role="dialog"
              aria-modal="true"
              aria-label="Keyboard Shortcuts Legend"
            >
              {/* Top accent glow line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-primary to-purple-500"></div>

              {/* Header */}
              <div className="p-6 border-b border-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                    <Keyboard size={20} />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-white">Keyboard Shortcuts</h2>
                    <p className="text-xs text-slate-400">Accessibility & navigation hotkeys</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 hover:bg-slate-900 rounded-xl transition-colors text-slate-400 hover:text-white"
                  aria-label="Close shortcuts modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[70vh] custom-scrollbar text-white">
                {SHORTCUT_SECTIONS.map((section) => (
                  <div key={section.title} className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400/90 font-mono">
                      {section.title}
                    </h3>
                    <div className="grid gap-2.5">
                      {section.items.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-900 bg-slate-900/30 hover:border-slate-800 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {Icon && (
                                <Icon size={16} className="text-slate-400 shrink-0" />
                              )}
                              <span className="text-sm text-slate-300 font-medium">
                                {item.description}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 font-mono">
                              {item.keys.map((key, kIdx) => (
                                <span key={kIdx} className="flex items-center gap-1">
                                  {kIdx > 0 && <span className="text-xs text-slate-500">+</span>}
                                  <kbd className="px-2 py-1 min-w-[24px] text-center bg-slate-900 text-xs font-bold text-slate-200 border border-slate-800 rounded-lg shadow-[0_2px_0_0_rgba(255,255,255,0.05)] select-none">
                                    {key}
                                  </kbd>
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-900 bg-slate-900/10 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Press <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-400">?</kbd> to toggle</span>
                <span className="text-emerald-500 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  Master Mode Active
                </span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
