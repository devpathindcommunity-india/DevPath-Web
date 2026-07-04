'use client';

import { useEffect, useState, type ReactElement } from 'react';

const COOKIE_KEY = 'cookie_consent';

type ConsentValue = 'accepted' | 'rejected';

export default function CookieConsent(): ReactElement | null {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(COOKIE_KEY);
      if (!saved) {
        setVisible(true);
      }
    } catch (e) {
      // If localStorage is blocked, assume they reject or don't show the banner
      setVisible(false);
    }
  }, []);

  const setConsent = (value: ConsentValue): void => {
    try {
      localStorage.setItem(COOKIE_KEY, value);
    } catch (e) {
      // Ignore if localStorage is disabled
    }
    setVisible(false);
  };

  const handleAccept = (): void => setConsent('accepted');
  const handleReject = (): void => setConsent('rejected');

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[92%] md:w-[600px] bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl p-5">
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">We use cookies</h2>

        <p className="text-sm text-gray-600 dark:text-gray-300">
          We use cookies to improve your experience, analyze traffic, and
          personalize content. You can accept or reject non-essential cookies.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <button
            onClick={handleAccept}
            className="px-4 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition"
          >
            Accept all
          </button>

          <button
            onClick={handleReject}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Reject non-essential
          </button>
        </div>

        <p className="text-xs text-gray-500">
          You can change your preferences anytime in Cookies Policy.
        </p>
      </div>
    </div>
  );
}
