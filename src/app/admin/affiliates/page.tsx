'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Edit3,
  Trash2,
  X,
  Layers,
} from 'lucide-react';

export default function AdminAffiliatesPage() {
  const [affiliates, setAffiliates] = useState<AffiliatePromotion[]>([]);
  const [recentClicks, setRecentClicks] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAffiliate, setEditingAffiliate] = useState<AffiliatePromotion | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
      setLoading(true);
      const res = await fetch('/api/affiliates');
      const data = await res.json();
      setAffiliates(data.affiliates || []);
      setRecentClicks(data.recentClicks || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
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
    } catch {
      alert('Error creating promotion');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAffiliate) return;

    try {
      const res = await fetch(`/api/affiliates/${editingAffiliate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingAffiliate),
      });

      const data = await res.json();
      if (res.ok) {
        setAffiliates((prev) =>
          prev.map((a) => (a.id === editingAffiliate.id ? { ...a, ...editingAffiliate } : a))
        );
        setEditingAffiliate(null);
        alert('Affiliate promotion updated successfully!');
      } else {
        alert(data.error || 'Failed to update promotion');
      }
    } catch {
      alert('Error updating promotion');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"? Any active affiliate links will stop redirecting.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/affiliates/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAffiliates((prev) => prev.filter((a) => a.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete affiliate promotion');
      }
    } catch {
      alert('Error deleting promotion');
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Switcher: Google AdSense vs Affiliate Ads */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 rounded-2xl w-fit">
        <Link
          href="/admin/ads"
          className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl transition flex items-center gap-1.5"
        >
          <Tag className="w-3.5 h-3.5" /> Google AdSense & Ad Units
        </Link>
        <Link
          href="/admin/affiliates"
          className="px-4 py-2 text-xs font-bold bg-white text-emerald-700 shadow-xs rounded-xl flex items-center gap-1.5"
        >
          <DollarSign className="w-3.5 h-3.5" /> Affiliate Marketing & /go/ Links
        </Link>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">
            Performance Marketing Command
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Affiliate Marketing & Link Redirection
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Directly add, edit, track, and delete partner promotions with server-side cloaked endpoints (<code>/go/[slug]</code>) and real-time click analytics.
          </p>
        </div>
        <div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Affiliate Promotion
          </button>
        </div>
      </div>

      {/* Campaigns Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
          Loading affiliate promotions...
        </div>
      ) : affiliates.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
          <DollarSign className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700">No Affiliate Promotions Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Create your first affiliate partner link to start earning commissions from your content traffic.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl"
          >
            Create Promotion
          </button>
        </div>
      ) : (
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
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-md">
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
                    className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
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

                  <button
                    type="button"
                    onClick={() => setEditingAffiliate(aff)}
                    className="p-2 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-xl transition cursor-pointer"
                    title="Edit Promotion"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(aff.id, aff.title)}
                    className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition cursor-pointer"
                    title="Delete Promotion"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Live Click & Conversion Logging Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden space-y-0">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
              Real-Time Server Attribution
            </span>
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <MousePointerClick className="w-5 h-5 text-emerald-600" /> Click & Conversion Logging Stream
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Every redirection through <code>/go/[slug]</code> logs attribution tags, referrers, and device headers.
            </p>
          </div>
          <button
            type="button"
            onClick={fetchAffiliates}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Refresh Stream
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/60">
              <tr>
                <th className="px-6 py-3.5">Campaign Slug</th>
                <th className="px-6 py-3.5">Placement (src tag)</th>
                <th className="px-6 py-3.5">Referrer</th>
                <th className="px-6 py-3.5">IP Hash</th>
                <th className="px-6 py-3.5 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
              {recentClicks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400 font-sans">
                    No clicks logged yet. Click any <code>/go/[slug]</code> redirect link above to test live tracking!
                  </td>
                </tr>
              ) : (
                recentClicks.map((click) => (
                  <tr key={click.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-6 py-3.5 font-bold text-slate-900 font-sans">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded border border-emerald-200/60">
                        /go/{click.tracking_slug}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-600">
                      {click.placement_id || <span className="text-slate-400 font-sans">direct</span>}
                    </td>
                    <td className="px-6 py-3.5 max-w-xs truncate text-slate-500">
                      {click.referrer || <span className="text-slate-400 font-sans">direct/none</span>}
                    </td>
                    <td className="px-6 py-3.5 text-slate-400">
                      {click.ip_hash || 'anon'}
                    </td>
                    <td className="px-6 py-3.5 text-right text-slate-500 font-sans">
                      {new Date(click.clicked_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Promotion */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">New Affiliate Promotion</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500 font-mono"
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
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold shadow-sm hover:bg-emerald-700 transition cursor-pointer"
                >
                  Save Promotion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Existing Promotion */}
      {editingAffiliate && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Edit Affiliate Promotion</h3>
                <p className="text-xs text-slate-500 font-mono">ID: {editingAffiliate.id}</p>
              </div>
              <button
                onClick={() => setEditingAffiliate(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  value={editingAffiliate.title}
                  onChange={(e) => setEditingAffiliate({ ...editingAffiliate, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Destination URL</label>
                <input
                  type="url"
                  required
                  value={editingAffiliate.destination_url}
                  onChange={(e) => setEditingAffiliate({ ...editingAffiliate, destination_url: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Tracking Slug</label>
                  <input
                    type="text"
                    required
                    value={editingAffiliate.tracking_slug}
                    onChange={(e) => setEditingAffiliate({ ...editingAffiliate, tracking_slug: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Campaign Category</label>
                  <input
                    type="text"
                    value={editingAffiliate.campaign_name}
                    onChange={(e) => setEditingAffiliate({ ...editingAffiliate, campaign_name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Banner Image URL</label>
                <input
                  type="url"
                  value={editingAffiliate.banner_url || ''}
                  onChange={(e) => setEditingAffiliate({ ...editingAffiliate, banner_url: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingAffiliate.description || ''}
                  onChange={(e) => setEditingAffiliate({ ...editingAffiliate, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingAffiliate(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold shadow-sm hover:bg-emerald-700 transition cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
