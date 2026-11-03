
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Menu,
  X,
  TrendingUp,
  BookOpen,
  Sparkles,
  ShieldAlert,
  ChevronDown,
  LayoutDashboard,
} from 'lucide-react';
import { WebsiteSettings } from '@/lib/types';

interface HeaderProps {
  categories?: Array<{ id: string; name: string; slug: string }>;
  settings?: WebsiteSettings;
}

export default function Header({ categories = [], settings }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  let navLinks: Array<{ name: string; href: string }> = [
    { name: 'Home', href: '/' },
    { name: 'Deals & Offers', href: '/offers' },
    { name: 'All Blogs', href: '/blog' },
    { name: 'Trending', href: '/trending' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  if (settings?.nav_links_json) {
    try {
      const parsed = JSON.parse(settings.nav_links_json);
      if (Array.isArray(parsed) && parsed.length > 0) {
        navLinks = parsed;
      }
    } catch {
      // fallback
    }
  }

  return (
    <header className="w-full bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-xs backdrop-blur-md bg-white/95">
      {/* Top Announcement Bar */}
      {settings?.announcement_bar_enabled !== false && (
        <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="bg-brand-500 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Trending
              </span>
              <Link
                href={settings?.announcement_bar_link || '/blog'}
                className="truncate text-slate-300 hover:text-white transition"
              >
                {settings?.announcement_bar_text || 'How to Build an Organic Traffic Engine with Modern SEO in 2026 • Latest Tech Insights'}
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-4 text-slate-400 text-xs">
              <Link href="/ad-policy" className="hover:text-white transition">
                Ad Disclosure
              </Link>
              <Link href="/affiliate-disclosure" className="hover:text-white transition">
                Affiliate Policy
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Brand & Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="h-14 w-14 rounded-2xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300 border-2 border-slate-800 bg-slate-950 flex-shrink-0 flex items-center justify-center p-0.5">
              <img
                src={settings?.logo_image_url || '/images/srinoos-s-icon.jpg'}
                alt={settings?.site_name || 'Srinoos Logo'}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 group-hover:text-brand-600 transition flex items-center gap-1.5">
                {settings?.site_name || 'Srinoos'}
              </span>
              <span className="block text-[10px] sm:text-[11px] font-bold text-slate-500 -mt-0.5 tracking-wider uppercase">
                {settings?.site_tagline || 'Technology Collective'}
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-sm relative"
          >
            <input
              type="text"
              placeholder="Search tech, AI, SEO, tutorials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 text-sm rounded-full pl-10 pr-4 py-2 border border-transparent focus:border-brand-500 focus:outline-none transition shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 ${
                    isActive
                      ? 'text-brand-600 bg-brand-50'
                      : 'text-slate-700 hover:text-brand-600 hover:bg-slate-100'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                onBlur={() => setTimeout(() => setCategoriesOpen(false), 200)}
                className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-brand-600 hover:bg-slate-100 transition flex items-center gap-1"
              >
                Categories <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              {categoriesOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    Explore Topics
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {categories.slice(0, 8).map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        className="block px-4 py-2 text-sm text-slate-700 hover:text-brand-600 hover:bg-brand-50 transition"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <Link
                      href="/categories"
                      className="block px-4 py-2 text-xs font-semibold text-brand-600 hover:bg-brand-50 text-center"
                    >
                      View All Categories &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Write / Admin CTA */}
            <Link
              href="/admin/blogs/new"
              className="ml-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-lg transition shadow-sm hover:shadow"
            >
              Write Blog
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <form onSubmit={handleSearchSubmit} className="md:hidden pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search blogs & guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 text-slate-900 placeholder-slate-400 text-sm rounded-lg pl-10 pr-4 py-2 border border-slate-200 focus:outline-none focus:border-brand-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </form>
      </div>

      {/* Mobile Slide-Out Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-semibold text-slate-800 hover:bg-brand-50 hover:text-brand-600 transition"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100">
            <span className="block px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-400">
              Categories
            </span>
            <div className="grid grid-cols-2 gap-1 mt-1">
              {categories.slice(0, 6).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-700 hover:text-brand-600 hover:bg-brand-50 rounded"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-brand-600 font-semibold"
            >
              Contact Editorial Desk
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-1.5 bg-brand-600 text-white rounded text-xs font-bold shadow"
            >
              Explore Guides
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

