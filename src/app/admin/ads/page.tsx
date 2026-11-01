'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdPlacement, AffiliatePromotion } from '@/lib/types';
import VisualAdLayoutPreview from '@/components/VisualAdLayoutPreview';
import {
  Tag,
  Monitor,
  Smartphone,
  Tablet,
  CheckCircle2,
  Save,
  Plus,
  Trash2,
  Edit3,
  X,
  Code,
  DollarSign,
  Layers,
  ArrowUpDown,
  Move,
  Eye,
  Sliders,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';

export default function AdminAdsPage() {
  const [placements, setPlacements] = useState<AdPlacement[]>([]);
  const [affiliates, setAffiliates] = useState<AffiliatePromotion[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  // Modal / Form state for Add New
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAd, setNewAd] = useState<Partial<AdPlacement>>({
    name: '',
    location_zone: 'homepage',
    ad_type: 'adsense',
    ad_slot_id: '',
    format: 'responsive',
    dimensions: 'responsive',
    desktop_enabled: true,
    tablet_enabled: true,
    mobile_enabled: true,
    is_active: true,
    custom_html: '',
    affiliate_promo_id: '',
  });

  // State for ad being edited in full editor modal
  const [editingAd, setEditingAd] = useState<AdPlacement | null>(null);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const [resAds, resAff] = await Promise.all([
        fetch('/api/ads').then((r) => r.json()),
        fetch('/api/affiliates').then((r) => r.json()),
      ]);
      setPlacements(resAds.placements || []);
      setAffiliates(resAff.affiliates || []);
    } catch (e) {
      console.error('Failed to load ads:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  // Instant direct toggle / update
  const handleUpdate = async (id: string, updates: Partial<AdPlacement>) => {
    setSavingId(id);
    setSuccessId(null);
    try {
      const res = await fetch(`/api/ads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update ad placement');

      if (data.placement) {
        setPlacements((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...data.placement } : p))
        );
        if (editingAd && editingAd.id === id) {
          setEditingAd(data.placement);
        }
        setSuccessId(id);
        setTimeout(() => setSuccessId(null), 2000);
      }
    } catch (err: any) {
      alert(err.message || 'Error updating placement');
    } finally {
      setSavingId(null);
    }
  };

  // Create new Ad Unit
  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAd.name?.trim()) {
      alert('Please enter an Ad Placement Name');
      return;
    }

    try {
      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAd),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create ad placement');

      setPlacements((prev) => [data.placement, ...prev]);
      setShowAddModal(false);
      setNewAd({
        name: '',
        location_zone: 'homepage',
        ad_type: 'adsense',
        ad_slot_id: '',
        format: 'responsive',
        dimensions: 'responsive',
        desktop_enabled: true,
        tablet_enabled: true,
        mobile_enabled: true,
        is_active: true,
        custom_html: '',
        affiliate_promo_id: '',
      });
      alert('New Ad Placement created and active on live site!');
    } catch (err: any) {
      alert(err.message || 'Error creating ad placement');
    }
  };

  // Remove / Delete Ad Unit
  const handleDeleteAd = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently remove "${name}"? It will disappear from the live website immediately.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/ads/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');

      setPlacements((prev) => prev.filter((p) => p.id !== id));
      if (editingAd && editingAd.id === id) {
        setEditingAd(null);
      }
    } catch (err: any) {
      alert(err.message || 'Error removing ad placement');
    }
  };

  const filteredPlacements = placements.filter((p) => {
    if (selectedZone === 'all') return true;
    return p.location_zone === selectedZone;
  });

  const dimensionPresets = [
    { label: 'Responsive (Auto 100%)', val: 'responsive', format: 'responsive' },
    { label: 'Leaderboard (728x90)', val: '728x90', format: 'leaderboard' },
    { label: 'Billboard (970x250)', val: '970x250', format: 'leaderboard' },
    { label: 'Medium Rectangle (300x250)', val: '300x250', format: 'rectangle' },
    { label: 'Large Rectangle (336x280)', val: '336x280', format: 'rectangle' },
    { label: 'Half Page Skyscraper (300x600)', val: '300x600', format: 'skyscraper' },
    { label: 'Mobile Banner (320x50)', val: '320x50', format: 'banner' },
  ];

  const zonePresets = [
    { key: 'homepage', label: 'Homepage' },
    { key: 'article', label: 'Blog Article' },
    { key: 'sidebar', label: 'Desktop Sidebar' },
    { key: 'global', label: 'Global Layout' },
    { key: 'mobile', label: 'Mobile Units' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Switcher: Google AdSense vs Affiliate Ads */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 rounded-2xl w-fit">
        <Link
          href="/admin/ads"
          className="px-4 py-2 text-xs font-bold bg-white text-brand-700 shadow-xs rounded-xl flex items-center gap-1.5"
        >
          <Tag className="w-3.5 h-3.5" /> Google AdSense & Ad Units
        </Link>
        <Link
          href="/admin/affiliates"
          className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl transition flex items-center gap-1.5"
        >
          <DollarSign className="w-3.5 h-3.5" /> Affiliate Marketing & /go/ Links
        </Link>
      </div>

      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
            Complete AdSense & Banner Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Ad Placement & Position Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Directly add, edit, shift positions across pages, adjust dimensions, and remove ads with instant live updates.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add New Ad Unit
          </button>
          <a
            href="/admin/settings"
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition"
          >
            AdSense Publisher Config
          </a>
        </div>
      </div>

      {/* Visual Placement Wireframe */}
      <VisualAdLayoutPreview
        placements={placements}
        onSelectPlacement={(id) => {
          const match = placements.find((p) => p.id === id);
          if (match) setEditingAd(match);
        }}
      />

      {/* Filter Tabs by Page Zone */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase text-slate-400 px-2 flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5" /> Shift By Page:
          </span>
          {[
            { key: 'all', label: `All Ads (${placements.length})` },
            { key: 'homepage', label: 'Homepage' },
            { key: 'article', label: 'Blog Article' },
            { key: 'sidebar', label: 'Desktop Sidebar' },
            { key: 'global', label: 'Global Header/Footer' },
            { key: 'mobile', label: 'Mobile Specific' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedZone(tab.key)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                selectedZone === tab.key
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs font-semibold text-slate-500">
          Showing {filteredPlacements.length} of {placements.length} ad placements
        </span>
      </div>

      {/* Direct Edit / Management Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200/80">
            Loading ad placements from database...
          </div>
        ) : filteredPlacements.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200/80 space-y-3">
            <p className="font-semibold text-slate-600">No ad placements found in this zone.</p>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl"
            >
              <Plus className="w-4 h-4" /> Add Ad Unit in this Zone
            </button>
          </div>
        ) : (
          filteredPlacements.map((p) => {
            const isSaving = savingId === p.id;
            const isSaved = successId === p.id;

            return (
              <div
                key={p.id}
                className={`bg-white rounded-2xl border p-5 sm:p-6 transition shadow-2xs space-y-4 ${
                  p.is_active ? 'border-slate-200 hover:border-brand-300' : 'border-slate-200/60 bg-slate-50/50 opacity-80'
                }`}
              >
                {/* Row Header: Name, Page Shift Tag, Status Toggle, Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-slate-900 text-base">{p.name}</span>
                      <span className="px-2.5 py-0.5 bg-brand-50 text-brand-700 border border-brand-200 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Move className="w-3 h-3 text-brand-500" /> Page: {p.location_zone}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-mono text-[10px]">
                        {p.dimensions}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 block">
                      Placement ID: <code className="text-slate-600">{p.id}</code> &bull; Type: <strong className="text-slate-700 uppercase">{p.ad_type}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Active Status Switch */}
                    <button
                      type="button"
                      onClick={() => handleUpdate(p.id, { is_active: !p.is_active })}
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 ${
                        p.is_active
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${p.is_active ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                      {p.is_active ? 'Live Active' : 'Disabled'}
                    </button>

                    {/* Direct Edit Button */}
                    <button
                      type="button"
                      onClick={() => setEditingAd(p)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-brand-600" /> Direct Edit
                    </button>

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteAd(p.id, p.name)}
                      title="Remove Ad Unit"
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Inline Quick Adjustment Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs pt-1">
                  {/* 1. Shift Page Zone */}
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">
                      Shift Page Zone:
                    </label>
                    <select
                      value={p.location_zone}
                      onChange={(e) => handleUpdate(p.id, { location_zone: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500"
                    >
                      {zonePresets.map((z) => (
                        <option key={z.key} value={z.key}>{z.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* 2. Adjustable Dimensions */}
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">
                      Adjust Dimensions:
                    </label>
                    <select
                      value={p.dimensions}
                      onChange={(e) => {
                        const match = dimensionPresets.find((d) => d.val === e.target.value);
                        handleUpdate(p.id, {
                          dimensions: e.target.value,
                          format: match ? (match.format as any) : p.format,
                        });
                      }}
                      className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500 font-mono"
                    >
                      {dimensionPresets.map((d) => (
                        <option key={d.val} value={d.val}>{d.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* 3. Ad Type Selector */}
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">
                      Monetization Model:
                    </label>
                    <select
                      value={p.ad_type}
                      onChange={(e) => handleUpdate(p.id, { ad_type: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-brand-500"
                    >
                      <option value="adsense">Google AdSense</option>
                      <option value="custom_html">Custom HTML / Banner</option>
                      <option value="affiliate">Affiliate Promotion Card</option>
                    </select>
                  </div>

                  {/* 4. Device Visibility Switches */}
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">
                      Display Devices:
                    </label>
                    <div className="flex items-center gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={() => handleUpdate(p.id, { desktop_enabled: !p.desktop_enabled })}
                        className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                          p.desktop_enabled
                            ? 'bg-brand-50 border-brand-300 text-brand-700'
                            : 'bg-slate-100 border-slate-200 text-slate-400 line-through'
                        }`}
                        title="Desktop view toggle"
                      >
                        <Monitor className="w-3.5 h-3.5" /> Desktop
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdate(p.id, { tablet_enabled: !p.tablet_enabled })}
                        className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                          p.tablet_enabled
                            ? 'bg-brand-50 border-brand-300 text-brand-700'
                            : 'bg-slate-100 border-slate-200 text-slate-400 line-through'
                        }`}
                        title="Tablet view toggle"
                      >
                        <Tablet className="w-3.5 h-3.5" /> Tablet
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdate(p.id, { mobile_enabled: !p.mobile_enabled })}
                        className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                          p.mobile_enabled
                            ? 'bg-brand-50 border-brand-300 text-brand-700'
                            : 'bg-slate-100 border-slate-200 text-slate-400 line-through'
                        }`}
                        title="Mobile view toggle"
                      >
                        <Smartphone className="w-3.5 h-3.5" /> Mobile
                      </button>
                    </div>
                  </div>
                </div>

                {/* Specific Ad Configuration Box according to Ad Type */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs space-y-2">
                  {p.ad_type === 'adsense' && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1">
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          AdSense Slot ID (Numeric):
                        </label>
                        <input
                          type="text"
                          defaultValue={p.ad_slot_id || ''}
                          onBlur={(e) => {
                            if (e.target.value !== p.ad_slot_id) {
                              handleUpdate(p.id, { ad_slot_id: e.target.value.trim() });
                            }
                          }}
                          placeholder="e.g. 1001001001"
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-brand-500"
                        />
                      </div>
                      <div className="text-[11px] text-slate-500 pt-3 sm:pt-0">
                        Inserts into <code>data-ad-slot</code>. Press tab or click away to save.
                      </div>
                    </div>
                  )}

                  {p.ad_type === 'custom_html' && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-bold text-slate-600 uppercase">
                          Custom HTML / Script / Banner Code:
                        </label>
                        <button
                          type="button"
                          onClick={() => setEditingAd(p)}
                          className="text-brand-600 font-bold hover:underline text-[11px]"
                        >
                          Open in Full Editor &rarr;
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        defaultValue={p.custom_html || ''}
                        onBlur={(e) => {
                          if (e.target.value !== p.custom_html) {
                            handleUpdate(p.id, { custom_html: e.target.value });
                          }
                        }}
                        placeholder="<script>...</script> or <a href='...'><img src='...' /></a>"
                        className="w-full bg-white border border-slate-200 rounded-lg p-2.5 font-mono text-xs focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  )}

                  {p.ad_type === 'affiliate' && (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Linked Affiliate Campaign:
                      </label>
                      <select
                        value={p.affiliate_promo_id || ''}
                        onChange={(e) => handleUpdate(p.id, { affiliate_promo_id: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-brand-500"
                      >
                        <option value="">Select an affiliate partner offer...</option>
                        {affiliates.map((aff) => (
                          <option key={aff.id} value={aff.tracking_slug}>
                            {aff.title} (Slug: /{aff.tracking_slug})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Status Indicator Bar */}
                {isSaving && (
                  <span className="text-[11px] font-bold text-brand-600 animate-pulse block">
                    Saving live changes to production...
                  </span>
                )}
                {isSaved && (
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Changes saved and updated on live website!
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* MODAL 1: ADD NEW AD UNIT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Plus className="w-5 h-5 text-brand-600" /> Create New Ad Placement
                </h3>
                <p className="text-xs text-slate-500">
                  Add a brand new advertising slot to any page, adjust its dimensions, and start earning.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAd} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Placement Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Article Sticky Bottom Banner"
                  value={newAd.name}
                  onChange={(e) => setNewAd({ ...newAd, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Page Location / Zone *
                  </label>
                  <select
                    value={newAd.location_zone}
                    onChange={(e) => setNewAd({ ...newAd, location_zone: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-brand-500"
                  >
                    {zonePresets.map((z) => (
                      <option key={z.key} value={z.key}>{z.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Dimensions & Size Format *
                  </label>
                  <select
                    value={newAd.dimensions}
                    onChange={(e) => {
                      const match = dimensionPresets.find((d) => d.val === e.target.value);
                      setNewAd({
                        ...newAd,
                        dimensions: e.target.value,
                        format: match ? (match.format as any) : 'responsive',
                      });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-brand-500"
                  >
                    {dimensionPresets.map((d) => (
                      <option key={d.val} value={d.val}>{d.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Monetization Type *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'adsense', label: 'Google AdSense' },
                    { key: 'custom_html', label: 'Custom HTML / Code' },
                    { key: 'affiliate', label: 'Affiliate Card' },
                  ].map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setNewAd({ ...newAd, ad_type: t.key as any })}
                      className={`p-2.5 rounded-xl border text-center font-bold transition cursor-pointer ${
                        newAd.ad_type === t.key
                          ? 'bg-brand-50 border-brand-500 text-brand-700 shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {newAd.ad_type === 'adsense' && (
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Google AdSense Slot ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5005005001"
                    value={newAd.ad_slot_id}
                    onChange={(e) => setNewAd({ ...newAd, ad_slot_id: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-xs focus:outline-none focus:border-brand-500"
                  />
                </div>
              )}

              {newAd.ad_type === 'custom_html' && (
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Custom Banner Code or HTML
                  </label>
                  <textarea
                    rows={4}
                    placeholder="<a href='...'><img src='...' /></a>"
                    value={newAd.custom_html}
                    onChange={(e) => setNewAd({ ...newAd, custom_html: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono text-xs focus:outline-none focus:border-brand-500"
                  />
                </div>
              )}

              {newAd.ad_type === 'affiliate' && (
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Select Active Affiliate Campaign
                  </label>
                  <select
                    value={newAd.affiliate_promo_id}
                    onChange={(e) => setNewAd({ ...newAd, affiliate_promo_id: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-brand-500"
                  >
                    <option value="">Select offer...</option>
                    {affiliates.map((aff) => (
                      <option key={aff.id} value={aff.tracking_slug}>
                        {aff.title} ({aff.tracking_slug})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Device Visibility Checklist */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-2">
                  Enable on Devices:
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={Boolean(newAd.desktop_enabled)}
                      onChange={(e) => setNewAd({ ...newAd, desktop_enabled: e.target.checked })}
                      className="rounded text-brand-600 focus:ring-brand-500"
                    />
                    Desktop
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={Boolean(newAd.tablet_enabled)}
                      onChange={(e) => setNewAd({ ...newAd, tablet_enabled: e.target.checked })}
                      className="rounded text-brand-600 focus:ring-brand-500"
                    />
                    Tablet
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={Boolean(newAd.mobile_enabled)}
                      onChange={(e) => setNewAd({ ...newAd, mobile_enabled: e.target.checked })}
                      className="rounded text-brand-600 focus:ring-brand-500"
                    />
                    Mobile
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
                >
                  Save & Publish Ad Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DIRECT EDIT MODAL */}
      {editingAd && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-brand-600" /> Direct Edit Ad: {editingAd.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Update code, shift page position, toggle device views, or adjust sizing.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingAd(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Placement Name
                </label>
                <input
                  type="text"
                  value={editingAd.name}
                  onChange={(e) => setEditingAd({ ...editingAd, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Shift Page Zone
                  </label>
                  <select
                    value={editingAd.location_zone}
                    onChange={(e) => setEditingAd({ ...editingAd, location_zone: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-brand-500"
                  >
                    {zonePresets.map((z) => (
                      <option key={z.key} value={z.key}>{z.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Adjust Dimensions
                  </label>
                  <select
                    value={editingAd.dimensions}
                    onChange={(e) => {
                      const match = dimensionPresets.find((d) => d.val === e.target.value);
                      setEditingAd({
                        ...editingAd,
                        dimensions: e.target.value,
                        format: match ? (match.format as any) : editingAd.format,
                      });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-brand-500"
                  >
                    {dimensionPresets.map((d) => (
                      <option key={d.val} value={d.val}>{d.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Ad Type
                </label>
                <select
                  value={editingAd.ad_type}
                  onChange={(e) => setEditingAd({ ...editingAd, ad_type: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-brand-500"
                >
                  <option value="adsense">Google AdSense</option>
                  <option value="custom_html">Custom HTML / Script</option>
                  <option value="affiliate">Affiliate Promotion</option>
                </select>
              </div>

              {editingAd.ad_type === 'adsense' && (
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    AdSense Slot ID
                  </label>
                  <input
                    type="text"
                    value={editingAd.ad_slot_id || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, ad_slot_id: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-xs focus:outline-none focus:border-brand-500"
                  />
                </div>
              )}

              {editingAd.ad_type === 'custom_html' && (
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Custom HTML / Script Tag (AdSense / Banner / Amazon)
                  </label>
                  <textarea
                    rows={6}
                    value={editingAd.custom_html || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, custom_html: e.target.value })}
                    placeholder="<script>...</script> or <ins>...</ins>"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono text-xs focus:outline-none focus:border-brand-500"
                  />
                </div>
              )}

              {editingAd.ad_type === 'affiliate' && (
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Affiliate Partner Campaign
                  </label>
                  <select
                    value={editingAd.affiliate_promo_id || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, affiliate_promo_id: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-brand-500"
                  >
                    <option value="">Select campaign...</option>
                    {affiliates.map((aff) => (
                      <option key={aff.id} value={aff.tracking_slug}>
                        {aff.title} ({aff.tracking_slug})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Device Visibility Checklist */}
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-2">
                  Display Devices:
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={Boolean(editingAd.desktop_enabled)}
                      onChange={(e) => setEditingAd({ ...editingAd, desktop_enabled: e.target.checked })}
                      className="rounded text-brand-600 focus:ring-brand-500"
                    />
                    Desktop
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={Boolean(editingAd.tablet_enabled)}
                      onChange={(e) => setEditingAd({ ...editingAd, tablet_enabled: e.target.checked })}
                      className="rounded text-brand-600 focus:ring-brand-500"
                    />
                    Tablet
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={Boolean(editingAd.mobile_enabled)}
                      onChange={(e) => setEditingAd({ ...editingAd, mobile_enabled: e.target.checked })}
                      className="rounded text-brand-600 focus:ring-brand-500"
                    />
                    Mobile
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleDeleteAd(editingAd.id, editingAd.name)}
                  className="px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-xl font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" /> Delete Ad
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingAd(null)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await handleUpdate(editingAd.id, editingAd);
                      setEditingAd(null);
                    }}
                    className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" /> Save All Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
