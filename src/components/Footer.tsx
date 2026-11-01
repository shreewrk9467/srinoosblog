'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Send,
  CheckCircle,
  Shield,
  Heart,
  Globe,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
  Github,
  Mail,
} from 'lucide-react';
import { WebsiteSettings } from '@/lib/types';

interface FooterProps {
  categories?: Array<{ id: string; name: string; slug: string }>;
  settings?: WebsiteSettings;
}

export default function Footer({ categories = [], settings }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const brandName = settings?.site_name || 'Srinoos';
  const brandTagline = settings?.site_tagline || 'Technology Collective';
  const logoUrl = settings?.logo_image_url || '/images/srinoos-s-icon.jpg';
  const aboutText =
    settings?.footer_about_text ||
    settings?.site_description ||
    'Srinoos is a leading digital publication dedicated to artificial intelligence, high-performance web development, actionable search engine optimization, and legitimate online monetization strategies.';
  const creditText = settings?.credit_text || 'Designed and Developed by Srinoos';
  const portfolioUrl = settings?.portfolio_url || 'https://quiet-pony-c4f26b.netlify.app';
  const contactEmail = settings?.contact_email || 'ketanboinak@gmail.com';

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Newsletter Section */}
      <div className="border-b border-slate-800/80 bg-slate-900/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Get the Srinoos Tech & Monetization Dispatch
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              Join thousands of digital builders. Actionable SEO playbooks, AI workflows, and affiliate strategies delivered weekly.
            </p>
          </div>
          <div className="w-full md:w-auto">
            {subscribed ? (
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/50 border border-emerald-800 px-5 py-3 rounded-xl text-sm font-medium">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>Thank you for subscribing! Check your inbox soon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center gap-2 max-w-md w-full">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white placeholder-slate-400 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 w-full"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-lg transition flex items-center gap-1.5 flex-shrink-0 shadow-sm"
                >
                  Subscribe <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-xl bg-slate-950 flex-shrink-0 p-0.5">
                <img
                  src={logoUrl}
                  alt={`${brandName} Logo`}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight group-hover:text-brand-400 transition font-display">
                  {brandName}
                </span>
                <span className="block text-[11px] font-bold text-slate-400 -mt-0.5 tracking-wider uppercase">
                  {brandTagline}
                </span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              {aboutText}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2 text-slate-400">
              <a
                href={portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Creator Portfolio"
                title="Live Portfolio"
                className="p-2 bg-slate-900 rounded-lg hover:text-brand-400 hover:bg-slate-800 transition"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${contactEmail}`}
                aria-label="Direct Email"
                title="Direct Email"
                className="p-2 bg-slate-900 rounded-lg hover:text-emerald-400 hover:bg-slate-800 transition"
              >
                <Mail className="w-4 h-4" />
              </a>
              {settings?.twitter_url && (
                <a
                  href={settings.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter / X"
                  className="p-2 bg-slate-900 rounded-lg hover:text-brand-400 hover:bg-slate-800 transition"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {settings?.linkedin_url && (
                <a
                  href={settings.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="p-2 bg-slate-900 rounded-lg hover:text-brand-400 hover:bg-slate-800 transition"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {settings?.github_url && (
                <a
                  href={settings.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="p-2 bg-slate-900 rounded-lg hover:text-brand-400 hover:bg-slate-800 transition"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {settings?.youtube_url && (
                <a
                  href={settings.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="p-2 bg-slate-900 rounded-lg hover:text-rose-400 hover:bg-slate-800 transition"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-brand-400 transition">Home</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-brand-400 transition">All Blog Articles</Link>
              </li>
              <li>
                <Link href="/trending" className="hover:text-brand-400 transition">Trending Posts</Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-brand-400 transition">Browse Categories</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-400 transition">About Srinoos</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-400 transition">Contact Editorial Team</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Categories
            </h4>
            <ul className="space-y-2 text-sm">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link href={`/category/${cat.slug}`} className="hover:text-brand-400 transition">
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/categories" className="text-brand-400 hover:underline text-xs font-semibold">
                  View All Topics &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Compliance & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Monetization & Legal
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/cookie-consent" className="hover:text-white transition">Cookie & Consent</Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-white transition">Terms & Conditions</Link>
              </li>
              <li>
                <Link href="/affiliate-disclosure" className="hover:text-white transition">Affiliate Disclosure</Link>
              </li>
              <li>
                <Link href="/ad-policy" className="hover:text-white transition">Advertisement Policy</Link>
              </li>
              <li>
                <Link href="/admin" className="text-brand-400 hover:text-brand-300 font-medium transition">Admin Login</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Mandatory Credit */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} {brandName}. All rights reserved.</p>
          <div className="flex items-center gap-2 font-medium text-slate-400 bg-slate-900/80 border border-slate-800 px-4 py-1.5 rounded-full">
            <span>
              {creditText.includes('Srinoos') ? (
                <>
                  Designed and Developed by <strong className="text-brand-400 font-semibold">Srinoos</strong>
                </>
              ) : (
                creditText
              )}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

