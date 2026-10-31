'use client';

import { useState, useEffect } from 'react';
import { AdPlacement, AffiliatePromotion } from '@/lib/types';
import VisualAdLayoutPreview from '@/components/VisualAdLayoutPreview';
import {
  Tag,
  Monitor,
  Smartphone,
  Tablet,
  CheckCircle2,
  Save,
  DollarSign,
  Layers,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export default function AdminAdsPage() {
  const [placements, setPlacements] = useState<AdPlacement[]>([]);
  const [affiliates, setAffiliates] = useState<AffiliatePromotion[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchAds = async () => {
    try {
      const [resAds, resAff] = await Promise.all([
        fetch('/api/ads').then((r) => r.json()),
        fetch('/api/affiliates').then((r) => r.json()),
      ]);
      setPlacements(resAds.placements || []);
      setAffiliates(resAff.affiliates || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleUpdate = async (id: string, updates: Partial<AdPlacement>) => {
    setSavingId(id);
    try {
      const res = await fetch(`/api/ads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.placement) {
        setPlacements((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...data.placement } : p))
        );
      }
    } catch (e) {
      alert('Error updating placement');
    } finally {
      setSavingId(null);
    }
  };

  const filteredPlacements = placements.filter((p) => {
    if (selectedZone === 'all') return true;
    return p.location_zone === selectedZone;
  });

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
            Monetization Control Engine
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Advertisement & AdSense Slot Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure {placements.length} distinct placement zones across global layouts, blog articles, desktop sidebars, and mobile views.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/admin/settings"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition"
          >
            AdSense Publisher Config
          </a>
        </div>
      </div>

      {/* Visual Placement Preview Wireframe */}
      <VisualAdLayoutPreview placements={placements} />

      {/* Filter Tabs by Zone */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200/80">
        <span className="text-xs font-bold uppercase text-slate-400 px-2">Zone:</span>
        {[
          { key: 'all', label: 'All Placements' },
          { key: 'global', label: 'Zone A: Global Placements' },
          { key: 'article', label: 'Zone B: In-Article Placements' },
          { key: 'sidebar', label: 'Zone C: Desktop Sidebar' },
          { key: 'homepage', label: 'Zone D: Homepage & Category' },
          { key: 'mobile', label: 'Zone E: Mobile Units' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedZone(tab.key)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
              selectedZone === tab.key
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Placements Configuration Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">
            Configurable Ad Units ({filteredPlacements.length})
          </h3>
          <span className="text-xs text-slate-400">Updates persist instantly in database</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/60">
              <tr>
                <th className="px-6 py-4">Placement / ID</th>
                <th className="px-6 py-4">Dimensions</th>
                <th className="px-6 py-4">Type & Slot Configuration</th>
                <th className="px-6 py-4">Device Visibility</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPlacements.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-6 py-4 max-w-xs">
                    <span className="font-bold text-slate-900 text-sm block">{p.name}</span>
                    <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                      id: {p.id} &bull; Zone: {p.location_zone}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-slate-100 font-mono text-slate-700 rounded-md font-semibold text-[11px]">
                      {p.dimensions}
                    </span>
                  </td>

                  <td className="px-6 py-4 space-y-2 min-w-[220px]">
                    <select
                      value={p.ad_type}
                      onChange={(e) => handleUpdate(p.id, { ad_type: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-brand-500"
                    >
                      <option value="adsense">Google AdSense</option>
                      <option value="affiliate">Affiliate Promotion Card</option>
                      <option value="custom_html">Custom HTML / Script</option>
                    </select>

                    {p.ad_type === 'adsense' && (
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-slate-400 font-mono">Slot #:</span>
                        <input
                          type="text"
                          value={p.ad_slot_id || ''}
                          onChange={(e) => handleUpdate(p.id, { ad_slot_id: e.target.value })}
                          placeholder="e.g. 1001001001"
                          className="flex-1 bg-white border border-slate-200 rounded px-2 py-1 text-[11px] font-mono"
                        />
                      </div>
                    )}

                    {p.ad_type === 'affiliate' && (
                      <select
                        value={p.affiliate_promo_id || ''}
                        onChange={(e) => handleUpdate(p.id, { affiliate_promo_id: e.target.value })}
                        className="w-full bg-blue-50 border border-blue-200 text-blue-900 text-[11px] font-medium rounded px-2 py-1"
                      >
                        <option value="">Select Affiliate Campaign...</option>
                        {affiliates.map((aff) => (
                          <option key={aff.id} value={aff.tracking_slug}>
                            {aff.title} ({aff.tracking_slug})
                          </option>
                        ))}
                      </select>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleUpdate(p.id, { desktop_enabled: !p.desktop_enabled })}
                        className={`p-1.5 rounded-lg border transition ${
                          p.desktop_enabled
                            ? 'bg-brand-50 border-brand-300 text-brand-600 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                        title="Desktop Toggle"
                      >
                        <Monitor className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdate(p.id, { tablet_enabled: !p.tablet_enabled })}
                        className={`p-1.5 rounded-lg border transition ${
                          p.tablet_enabled
                            ? 'bg-brand-50 border-brand-300 text-brand-600 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                        title="Tablet Toggle"
                      >
                        <Tablet className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdate(p.id, { mobile_enabled: !p.mobile_enabled })}
                        className={`p-1.5 rounded-lg border transition ${
                          p.mobile_enabled
                            ? 'bg-brand-50 border-brand-300 text-brand-600 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                        title="Mobile Toggle"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleUpdate(p.id, { is_active: !p.is_active })}
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                        p.is_active
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {p.is_active ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

