'use client';

import { useState, useEffect } from 'react';
import { WebsiteSettings } from '@/lib/types';
import {
  Palette,
  Save,
  CheckCircle2,
  Globe,
  Image as ImageIcon,
  Link as LinkIcon,
  Plus,
  Trash2,
  ExternalLink,
  User,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Layers,
  Menu,
  Upload,
} from 'lucide-react';

interface NavLinkItem {
  name: string;
  href: string;
}

export default function AdminContentCustomizerPage() {
  const [settings, setSettings] = useState<Partial<WebsiteSettings>>({});
  const [navLinks, setNavLinks] = useState<NavLinkItem[]>([
    { name: 'Home', href: '/' },
    { name: 'All Blogs', href: '/blog' },
    { name: 'Trending', href: '/trending' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]);
  const [newLinkName, setNewLinkName] = useState('');
  const [newLinkHref, setNewLinkHref] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: keyof WebsiteSettings) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setSettings((prev) => ({ ...prev, [targetField]: data.url }));
      alert('Image uploaded successfully and linked!');
    } catch (err: any) {
      alert(err.message || 'Error uploading file');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => {
        const s = d.settings || {};
        setSettings(s);
        if (s.nav_links_json) {
          try {
            const parsed = JSON.parse(s.nav_links_json);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setNavLinks(parsed);
            }
          } catch {
            // keep defaults
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddNavLink = () => {
    if (!newLinkName.trim() || !newLinkHref.trim()) {
      alert('Please provide both link label and URL');
      return;
    }
    const updated = [...navLinks, { name: newLinkName.trim(), href: newLinkHref.trim() }];
    setNavLinks(updated);
    setNewLinkName('');
    setNewLinkHref('');
  };

  const handleRemoveNavLink = (index: number) => {
    setNavLinks(navLinks.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const payload = {
        ...settings,
        nav_links_json: JSON.stringify(navLinks),
      };

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Save failed');

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Error saving changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
        Loading site content & elements customizer...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
            WordPress-Style Site Customizer
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Site Elements, Links & Content Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage links, images, descriptions, announcements, and all public content without touching the code.
          </p>
        </div>
        {savedSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> All Website Elements Updated Live!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. TOP ANNOUNCEMENT BAR & ALERT */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Top Header Announcement Bar</h2>
                <p className="text-xs text-slate-500">Appears at the very top of every page for breaking news or promotions.</p>
              </div>
            </div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.announcement_bar_enabled !== false}
                onChange={(e) => setSettings({ ...settings, announcement_bar_enabled: e.target.checked })}
                className="rounded text-brand-600 focus:ring-brand-500"
              />
              Show Announcement Bar
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Announcement Message Text</label>
              <input
                type="text"
                value={settings.announcement_bar_text || ''}
                onChange={(e) => setSettings({ ...settings, announcement_bar_text: e.target.value })}
                placeholder="e.g. How to Build an Organic Traffic Engine with Modern SEO in 2026 • Latest Tech Insights"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Target Click URL / Destination</label>
              <input
                type="text"
                value={settings.announcement_bar_link || ''}
                onChange={(e) => setSettings({ ...settings, announcement_bar_link: e.target.value })}
                placeholder="e.g. /blog/how-to-build-organic-traffic-engine-modern-seo"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* 2. NAVIGATION MENU LINKS (ADD / EDIT / REMOVE) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2 bg-brand-50 text-brand-600 rounded-xl">
              <Menu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Header Navigation Menu Links</h2>
              <p className="text-xs text-slate-500">Directly add, edit, or remove menu items displayed in the top navigation bar.</p>
            </div>
          </div>

          {/* Current Links List */}
          <div className="space-y-2">
            {navLinks.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="font-mono text-slate-400 font-bold w-6">#{idx + 1}</span>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => {
                    const copy = [...navLinks];
                    copy[idx].name = e.target.value;
                    setNavLinks(copy);
                  }}
                  className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-bold text-slate-900 focus:outline-none focus:border-brand-500"
                />
                <input
                  type="text"
                  value={item.href}
                  onChange={(e) => {
                    const copy = [...navLinks];
                    copy[idx].href = e.target.value;
                    setNavLinks(copy);
                  }}
                  className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-slate-600 focus:outline-none focus:border-brand-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveNavLink(idx)}
                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                  title="Remove Link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add New Link Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <input
              type="text"
              placeholder="New Link Label (e.g. Services, Pricing)"
              value={newLinkName}
              onChange={(e) => setNewLinkName(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-500"
            />
            <input
              type="text"
              placeholder="Link Path (e.g. /pricing, /trending)"
              value={newLinkHref}
              onChange={(e) => setNewLinkHref(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-brand-500"
            />
            <button
              type="button"
              onClick={handleAddNavLink}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Add Menu Item
            </button>
          </div>
        </div>

        {/* 3. LOGO, BRANDING & IMAGES */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Brand Identity & Images</h2>
              <p className="text-xs text-slate-500">Manage site logo, brand name, and favicon image URLs.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Site Brand Name</label>
              <input
                type="text"
                value={settings.site_name || ''}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                placeholder="Srinoos"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Brand Subtitle / Collective</label>
              <input
                type="text"
                value={settings.site_tagline || ''}
                onChange={(e) => setSettings({ ...settings, site_tagline: e.target.value })}
                placeholder="Technology Collective"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Official Logo Image URL</label>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 bg-slate-950 flex-shrink-0">
                  <img
                    src={settings.logo_image_url || '/images/srinoos-s-icon.jpg'}
                    alt="Logo Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <input
                  type="text"
                  value={settings.logo_image_url || '/images/srinoos-s-icon.jpg'}
                  onChange={(e) => setSettings({ ...settings, logo_image_url: e.target.value })}
                  placeholder="/images/srinoos-s-icon.jpg"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:border-brand-500"
                />
                <label className="p-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-700 font-bold text-xs cursor-pointer flex items-center gap-1 transition shadow-2xs" title="Upload Logo Image">
                  <Upload className="w-3.5 h-3.5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'logo_image_url')}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 4. HOMEPAGE HERO CONTENT */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Homepage Headlines & Lead Content</h2>
              <p className="text-xs text-slate-500">Edit the primary headline, hero description, and lead feature badge.</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Hero Lead Section Badge</label>
              <input
                type="text"
                value={settings.hero_lead_badge || 'Lead Feature'}
                onChange={(e) => setSettings({ ...settings, hero_lead_badge: e.target.value })}
                placeholder="Lead Feature"
                className="w-full sm:w-72 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Main Site Description (SEO & OpenGraph)</label>
              <textarea
                rows={3}
                value={settings.site_description || ''}
                onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                placeholder="Actionable guides on AI technology, modern engineering, SEO, and verified software comparisons."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* 5. ABOUT ME / FOUNDER PROFILE */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2 bg-brand-50 text-brand-600 rounded-xl">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">About Section / Founder Profile Details</h2>
              <p className="text-xs text-slate-500">Directly modify founder name, title, contact number, location, portfolio link, and bio.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Founder Full Name</label>
              <input
                type="text"
                value={settings.founder_name || 'Ketanboina Venkat Shrinivas'}
                onChange={(e) => setSettings({ ...settings, founder_name: e.target.value })}
                placeholder="Ketanboina Venkat Shrinivas"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Founder Professional Title</label>
              <input
                type="text"
                value={settings.founder_title || 'Founder, Full-Stack Engineer & Digital Growth Specialist'}
                onChange={(e) => setSettings({ ...settings, founder_title: e.target.value })}
                placeholder="Founder, Full-Stack Engineer & Digital Growth Specialist"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Location</label>
              <input
                type="text"
                value={settings.location || 'Pune, India'}
                onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                placeholder="Pune, India"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Contact Phone Number</label>
              <input
                type="text"
                value={settings.phone || '+91 9665800844'}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                placeholder="+91 9665800844"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Contact / Author Email</label>
              <input
                type="email"
                value={settings.contact_email || 'ketanboinak@gmail.com'}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                placeholder="ketanboinak@gmail.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Live Portfolio Website Link</label>
              <input
                type="url"
                value={settings.portfolio_url || 'https://quiet-pony-c4f26b.netlify.app'}
                onChange={(e) => setSettings({ ...settings, portfolio_url: e.target.value })}
                placeholder="https://quiet-pony-c4f26b.netlify.app"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-bold text-slate-700 uppercase mb-1">About Me Detailed Bio / Mission</label>
            <textarea
              rows={4}
              value={settings.about_me_bio || ''}
              onChange={(e) => setSettings({ ...settings, about_me_bio: e.target.value })}
              placeholder="Ketanboina Venkat Shrinivas, a full-stack engineer and digital builder based in Pune, India..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* 6. FOOTER DESCRIPTION & CREDITS */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2 bg-slate-100 text-slate-700 rounded-xl">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Footer Text & Mandatory Credit</h2>
              <p className="text-xs text-slate-500">Control footer description and the bottom developer credit badge.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Bottom Credit Text (Mandatory)</label>
              <input
                type="text"
                value={settings.credit_text || 'Designed and Developed by Srinoos'}
                onChange={(e) => setSettings({ ...settings, credit_text: e.target.value })}
                placeholder="Designed and Developed by Srinoos"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Footer About Paragraph</label>
              <textarea
                rows={2}
                value={settings.footer_about_text || ''}
                onChange={(e) => setSettings({ ...settings, footer_about_text: e.target.value })}
                placeholder="Srinoos is a leading digital publication dedicated to artificial intelligence, high-performance web development..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving Live Elements...' : 'Save All Website Content & Elements'}</span>
        </button>
      </form>
    </div>
  );
}

