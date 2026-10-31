'use client';

import { useState, useEffect } from 'react';
import { AffiliatePromotion } from '@/lib/types';
import {
  DollarSign,
  Plus,
  ExternalLink,
  Copy,
  CheckCircle2,
  TrendingUp,
  Tag,
  MousePointerClick,
} from 'lucide-react';

export default function AdminAffiliatesPage() {
  const [affiliates, setAffiliates] = useState<AffiliatePromotion[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    banner_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    description: '',
    destination_url: '',
    tracking_slug: '',
    campaign_name: 'Direct Program',
    disclosure_text: 'Partner promotion: We may earn a commission from purchases.',
  });

  const fetchAffiliates = async () => {
    try {
      const res = await fetch('/api/affiliates');
      const data = await res.json();
      setAffiliates(data.affiliates || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAffiliates();
  }, []);

  const handleCopy = (slug: string) => {
    const fullUrl = `${window.location.origin}/go/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/affiliates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setShowModal(false);
        setFormData({
          title: '',
          banner_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
          description: '',
          destination_url: '',
          tracking_slug: '',
          campaign_name: 'Direct Program',
          disclosure_text: 'Partner promotion: We may earn a commission from purchases.',
        });
        fetchAffiliates();
      } else {
        alert(data.error || 'Failed to create affiliate promotion');
      }
    } catch (err) {
      alert('Error creating promotion');
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">
            Performance Marketing
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Affiliate Marketing & Link Redirection
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage partner promotions with server-side cloaked endpoints (<code>/go/[slug]</code>) and click analytics.
          </p>
        </div>
        <div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
          >
            <Plus className="w-4 h-4" /> Add Affiliate Promotion
          </button>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {affiliates.map((aff) => (
          <div
            key={aff.id}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs flex flex-col justify-between space-y-4 hover:shadow-md transition"
          >
            <div>
              {aff.banner_url && (
                <div className="aspect-[16/9] rounded-xl overflow-hidden bg-slate-100 mb-4 border border-slate-100">
                  <img
                    src={aff.banner_url}
                    alt={aff.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex items-center justify-between text-xs mb-2">
                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-bold rounded-md">
                  {aff.campaign_name}
                </span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <MousePointerClick className="w-3.5 h-3.5" /> {aff.total_clicks} Clicks
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-base leading-snug">{aff.title}</h3>
              {aff.description && (
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{aff.description}</p>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="text-[11px] text-slate-500">
                <span className="font-medium text-slate-700">Target URL:</span>{' '}
                <span className="font-mono text-[10px] text-slate-500 truncate block">
                  {aff.destination_url}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleCopy(aff.tracking_slug)}
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  {copiedSlug === aff.tracking_slug ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy /go/ Link
                    </>
                  )}
                </button>

                <a
                  href={`/go/${aff.tracking_slug}`}
                  target="_blank"
                  className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition"
                  title="Test redirect"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal to Add Promotion */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">New Affiliate Promotion</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Campaign Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Hostinger Cloud Hosting 75% Off"
                  value={formData.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    setFormData({ ...formData, title, tracking_slug: formData.tracking_slug || slug });
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Destination URL (Affiliate Link) *</label>
                <input
                  type="url"
                  required
                  placeholder="https://partner.program.com/?ref=srinoos"
                  value={formData.destination_url}
                  onChange={(e) => setFormData({ ...formData, destination_url: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Tracking Slug *</label>
                  <input
                    type="text"
                    required
                    placeholder="hostinger-promo"
                    value={formData.tracking_slug}
                    onChange={(e) => setFormData({ ...formData, tracking_slug: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Campaign Category</label>
                  <input
                    type="text"
                    placeholder="Hosting / SaaS"
                    value={formData.campaign_name}
                    onChange={(e) => setFormData({ ...formData, campaign_name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Banner Image URL</label>
                <input
                  type="url"
                  value={formData.banner_url}
                  onChange={(e) => setFormData({ ...formData, banner_url: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Short promotional summary..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold shadow-sm hover:bg-emerald-700 transition"
                >
                  Save Promotion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

