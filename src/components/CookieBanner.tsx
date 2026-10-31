'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, X } from 'lucide-react';

export default function CookieBanner() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('srinoos_cookie_consent');
    if (!consent) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('srinoos_cookie_consent', 'accepted');
    setIsOpen(false);
  };

  const handleDecline = () => {
    localStorage.setItem('srinoos_cookie_consent', 'declined');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <aside
      aria-label="Cookie consent banner"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 shadow-2xl"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-brand-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-slate-300 leading-relaxed">
            Srinoos uses cookies to deliver personalized content, analyze website traffic, and serve compliant advertisements through Google AdSense and affiliate partners. By continuing, you agree to our{' '}
            <Link href="/privacy-policy" className="text-brand-400 underline hover:text-brand-300">
              Privacy Policy
            </Link>{' '}
            and{' '}
            <Link href="/cookie-consent" className="text-brand-400 underline hover:text-brand-300">
              Cookie Policy
            </Link>.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={handleDecline}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 rounded-md transition"
          >
            Decline Non-Essential
          </button>
          <button
            onClick={handleAccept}
            className="px-5 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white rounded-md transition shadow"
          >
            Accept All
          </button>
          <button
            onClick={handleDecline}
            aria-label="Close cookie banner"
            className="text-slate-400 hover:text-slate-200 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

