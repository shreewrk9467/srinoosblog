'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
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
  Globe,
  Award,
  Search,
  Filter,
  Download,
  AlertCircle,
  Clock,
  Sparkles,
  Gift,
  CreditCard,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { AffiliatePromotion, AffiliateNetwork, AffiliateConversion } from '@/lib/types';

export default function AdminAffiliatesPage() {
  const [activeTab, setActiveTab] = useState<'offers' | 'networks' | 'conversions' | 'clicks'>('offers');
  const [affiliates, setAffiliates] = useState<AffiliatePromotion[]>([]);
  const [networks, setNetworks] = useState<AffiliateNetwork[]>([]);
  const [conversions, setConversions] = useState<AffiliateConversion[]>([]);
  const [recentClicks, setRecentClicks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterNetwork, setFilterNetwork] = useState('all');
  const [filterModel, setFilterModel] = useState('all');

  // Modals
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState<AffiliatePromotion | null>(null);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [editingNetwork, setEditingNetwork] = useState<AffiliateNetwork | null>(null);
  const [showConversionModal, setShowConversionModal] = useState(false);

  // Form states
  const [offerForm, setOfferForm] = useState<Partial<AffiliatePromotion>>({
    title: '',
    company_name: '',
    company_logo: '',
    banner_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    description: '',
    destination_url: '',
    tracking_slug: '',
    campaign_name: 'Direct Program',
    category: 'Technology and Software',
    commission_model: 'CPA',
    payout_amount: '',
    affiliate_network: 'Direct',
    eligibility_terms: '',
    terms_conditions: '',
    cta_button_text: 'Claim Offer',
    badge_text: 'Verified Deal',
    rating: 4.8,
    is_featured: false,
    is_trending: false,
    is_active: true,
    disclosure_text: 'Partner promotion: We may earn a commission upon verified qualification.',
  });

  const [networkForm, setNetworkForm] = useState<Partial<AffiliateNetwork>>({
    name: '',
    logo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&auto=format&fit=crop&q=80',
    login_url: '',
    affiliate_id: '',
    commission_types: 'CPS, CPL, CPA',
    notes: '',
    status: 'active',
  });

  const [conversionForm, setConversionForm] = useState<Partial<AffiliateConversion>>({
    tracking_slug: '',
    offer_title: '',
    network_name: 'Direct',
    conversion_type: 'CPA',
    commission_amount: 10.0,
    currency: 'USD',
    status: 'approved',
    country: 'US',
    order_id: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/affiliates');
      const data = await res.json();
      setAffiliates(data.affiliates || []);
      setRecentClicks(data.recentClicks || []);
      setNetworks(data.networks || []);
      setConversions(data.conversions || []);
    } catch (e) {
      console.error('Error fetching affiliate data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCopy = (slug: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://sricospace.com';
    const fullUrl = `${origin}/go/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  // Save or Update Offer
  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = Boolean(editingOffer);
      const url = isEdit ? `/api/affiliates/${editingOffer?.id}` : '/api/affiliates';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offerForm),
      });

      const data = await res.json();
      if (res.ok) {
        setShowOfferModal(false);
        setEditingOffer(null);
        fetchData();
      } else {
        alert(data.error || 'Failed to save offer');
      }
    } catch {
      alert('Error saving affiliate offer');
    }
  };

  // Delete Offer
  const handleDeleteOffer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this affiliate offer?')) return;
    try {
      const res = await fetch(`/api/affiliates/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      } else {
        alert('Failed to delete offer');
      }
    } catch {
      alert('Error deleting offer');
    }
  };

  // Toggle Active
  const handleToggleActive = async (aff: AffiliatePromotion) => {
    try {
      await fetch(`/api/affiliates/${aff.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !aff.is_active }),
      });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle Featured
  const handleToggleFeatured = async (aff: AffiliatePromotion) => {
    try {
      await fetch(`/api/affiliates/${aff.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_featured: !aff.is_featured }),
      });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  // Save Network
  const handleSaveNetwork = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = Boolean(editingNetwork);
      const url = isEdit ? `/api/affiliates/networks/${editingNetwork?.id}` : '/api/affiliates/networks';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(networkForm),
      });

      if (res.ok) {
        setShowNetworkModal(false);
        setEditingNetwork(null);
        fetchData();
      } else {
        alert('Failed to save affiliate network');
      }
    } catch {
      alert('Error saving network');
    }
  };

  // Record Conversion
  const handleRecordConversion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/affiliates/conversions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(conversionForm),
      });

      if (res.ok) {
        setShowConversionModal(false);
        fetchData();
      } else {
        alert('Failed to record conversion');
      }
    } catch {
      alert('Error recording conversion');
    }
  };

  // Export CSV Report
  const handleExportCSV = () => {
    const headers = ['Tracking Slug', 'Referrer', 'User Agent', 'IP Hash', 'Clicked At'];
    const rows = recentClicks.map((c) => [
      `"${c.tracking_slug || ''}"`,
      `"${c.referrer || ''}"`,
      `"${(c.user_agent || '').replace(/"/g, '""')}"`,
      `"${c.ip_hash || ''}"`,
      `"${c.clicked_at || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sricospace_clicks_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Summary Metrics
  const totalClicks = useMemo(() => affiliates.reduce((sum, a) => sum + (a.total_clicks || 0), 0), [affiliates]);
  const activeOffersCount = useMemo(() => affiliates.filter((a) => a.is_active).length, [affiliates]);
  const totalApprovedEarnings = useMemo(
    () => conversions.filter((c) => c.status === 'approved').reduce((sum, c) => sum + (c.commission_amount || 0), 0),
    [conversions]
  );
  const totalPendingEarnings = useMemo(
    () => conversions.filter((c) => c.status === 'pending').reduce((sum, c) => sum + (c.commission_amount || 0), 0),
    [conversions]
  );

  // Filtered Offers
  const filteredAffiliates = useMemo(() => {
    return affiliates.filter((aff) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        if (
          !aff.title.toLowerCase().includes(q) &&
          !(aff.company_name || '').toLowerCase().includes(q) &&
          !aff.tracking_slug.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (filterCategory !== 'all' && aff.category !== filterCategory) return false;
      if (filterNetwork !== 'all' && aff.affiliate_network !== filterNetwork) return false;
      if (filterModel !== 'all' && aff.commission_model !== filterModel) return false;
      return true;
    });
  }, [affiliates, search, filterCategory, filterNetwork, filterModel]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Affiliate Marketing & Monetization</h1>
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
              Enterprise Hub
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage partner networks, promotional deals, CPA/CPL/CPS conversion tracking, and redirect analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/offers"
            target="_blank"
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
          >
            <span>Live Offers Hub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => {
              setEditingOffer(null);
              setOfferForm({
                title: '',
                company_name: '',
                company_logo: '',
                banner_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
                description: '',
                destination_url: '',
                tracking_slug: `deal-${Date.now().toString().slice(-4)}`,
                campaign_name: 'Direct Program',
                category: 'Technology and Software',
                commission_model: 'CPA',
                payout_amount: '',
                affiliate_network: 'Direct',
                eligibility_terms: '',
                terms_conditions: '',
                cta_button_text: 'Claim Offer',
                badge_text: 'Verified Deal',
                rating: 4.8,
                is_featured: false,
                is_trending: false,
                is_active: true,
                disclosure_text: 'Partner promotion: We may earn a commission upon verified qualification.',
              });
              setShowOfferModal(true);
            }}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Offer</span>
          </button>
        </div>
      </div>

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Offers</span>
            <Tag className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{activeOffersCount}</div>
          <span className="text-xs text-slate-400 mt-1 block">Out of {affiliates.length} total programs</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Tracked Clicks</span>
            <MousePointerClick className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalClicks.toLocaleString()}</div>
          <span className="text-xs text-slate-400 mt-1 block">Logged across /go/[slug]</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Approved Earnings</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">${totalApprovedEarnings.toFixed(2)}</div>
          <span className="text-xs text-slate-400 mt-1 block">Validated by partner networks</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Pipeline</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">${totalPendingEarnings.toFixed(2)}</div>
          <span className="text-xs text-slate-400 mt-1 block">In qualification window</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('offers')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'offers' ? 'bg-slate-900 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Gift className="w-3.5 h-3.5" />
          <span>Affiliate Offers ({affiliates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('networks')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'networks' ? 'bg-slate-900 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Partner Networks ({networks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('conversions')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'conversions' ? 'bg-slate-900 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Conversions ({conversions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('clicks')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'clicks' ? 'bg-slate-900 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <MousePointerClick className="w-3.5 h-3.5" />
          <span>Click Log ({recentClicks.length})</span>
        </button>
      </div>

      {/* TAB 1: OFFERS */}
      {activeTab === 'offers' && (
        <div className="space-y-4">
          {/* Filter Row */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search offer titles, companies, or tracking slugs..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="Free Registration Offers">Free Registration</option>
                <option value="Banking and Financial Services">Banking & FinTech</option>
                <option value="Technology and Software">Technology & Software</option>
                <option value="Hosting and Domains">Hosting & Domains</option>
                <option value="Shopping and E-commerce">Shopping & E-Commerce</option>
                <option value="Education and Courses">Education & Courses</option>
                <option value="Mobile Applications">Mobile Applications</option>
              </select>

              <select
                value={filterModel}
                onChange={(e) => setFilterModel(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
              >
                <option value="all">All Models</option>
                <option value="CPA">CPA (Action)</option>
                <option value="CPL">CPL (Lead / Free Trial)</option>
                <option value="CPS">CPS (Sale)</option>
                <option value="CPI">CPI (Install)</option>
              </select>

              <select
                value={filterNetwork}
                onChange={(e) => setFilterNetwork(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
              >
                <option value="all">All Networks</option>
                {networks.map((n) => (
                  <option key={n.id} value={n.name}>
                    {n.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Offers Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Offer / Brand</th>
                    <th className="py-3 px-3">Category & Network</th>
                    <th className="py-3 px-3">Model & Payout</th>
                    <th className="py-3 px-3 text-center">Clicks</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-center">Tracking Link</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAffiliates.map((aff) => (
                    <tr key={aff.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                            {aff.company_logo ? (
                              <img src={aff.company_logo} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Tag className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <div className="max-w-xs">
                            <span className="font-bold text-slate-900 block truncate">{aff.title}</span>
                            <span className="text-[11px] text-slate-400 block truncate">
                              {aff.company_name || 'Direct'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="font-semibold text-slate-700 block">{aff.category || 'General'}</span>
                        <span className="text-[11px] text-slate-400">{aff.affiliate_network || 'Direct'}</span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="inline-block px-2 py-0.5 rounded font-bold text-[10px] bg-slate-100 text-slate-800">
                          {aff.commission_model || 'CPA'}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-700 block mt-0.5">
                          {aff.payout_amount || 'Variable'}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-center font-bold text-slate-800">
                        {aff.total_clicks || 0}
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleToggleActive(aff)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition ${
                              aff.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {aff.is_active ? 'Active' : 'Paused'}
                          </button>
                          <button
                            onClick={() => handleToggleFeatured(aff)}
                            className={`p-1 rounded transition ${
                              aff.is_featured ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-slate-500'
                            }`}
                            title="Toggle Featured on Homepage"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <div className="inline-flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md text-[11px]">
                          <span className="font-mono text-slate-600">/go/{aff.tracking_slug}</span>
                          <button
                            onClick={() => handleCopy(aff.tracking_slug)}
                            className="text-slate-400 hover:text-brand-600"
                            title="Copy full tracking link"
                          >
                            {copiedSlug === aff.tracking_slug ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingOffer(aff);
                              setOfferForm(aff);
                              setShowOfferModal(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition"
                            title="Edit Offer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteOffer(aff.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete Offer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PARTNER NETWORKS */}
      {activeTab === 'networks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Manage approved accounts across major affiliate networks. All commissions are governed by each network&apos;s verified terms.
            </span>
            <button
              onClick={() => {
                setEditingNetwork(null);
                setNetworkForm({
                  name: '',
                  logo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&auto=format&fit=crop&q=80',
                  login_url: '',
                  affiliate_id: '',
                  commission_types: 'CPS, CPL, CPA',
                  notes: '',
                  status: 'active',
                });
                setShowNetworkModal(true);
              }}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Network</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {networks.map((net) => (
              <div key={net.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                      {net.logo ? (
                        <img src={net.logo} alt="" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Globe className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{net.name}</h3>
                      <span className="text-[11px] text-slate-400 block">{net.commission_types}</span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      net.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {net.status}
                  </span>
                </div>

                {net.notes && <p className="text-xs text-slate-500 leading-relaxed">{net.notes}</p>}

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  {net.login_url ? (
                    <a
                      href={net.login_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-600 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>Network Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-slate-400 text-[11px]">Direct Partnership</span>
                  )}

                  <button
                    onClick={() => {
                      setEditingNetwork(net);
                      setNetworkForm(net);
                      setShowNetworkModal(true);
                    }}
                    className="text-slate-500 hover:text-slate-800 font-semibold"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CONVERSIONS & EARNINGS */}
      {activeTab === 'conversions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Verified conversions reported by affiliate networks (CPA actions, CPL free signups, CPS purchases).
            </span>
            <button
              onClick={() => {
                setConversionForm({
                  tracking_slug: affiliates[0]?.tracking_slug || 'deal-101',
                  offer_title: affiliates[0]?.title || 'Affiliate Promotion',
                  network_name: 'Impact',
                  conversion_type: 'CPL',
                  commission_amount: 15.0,
                  currency: 'USD',
                  status: 'approved',
                  country: 'US',
                  order_id: `ORD-${Date.now().toString().slice(-6)}`,
                });
                setShowConversionModal(true);
              }}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Conversion Event</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-3">Offer & Network</th>
                  <th className="py-3 px-3 text-center">Type</th>
                  <th className="py-3 px-3 text-right">Commission</th>
                  <th className="py-3 px-3 text-center">Country</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Recorded Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {conversions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No conversion events recorded yet. Click &quot;Record Conversion Event&quot; to log report data.
                    </td>
                  </tr>
                ) : (
                  conversions.map((conv) => (
                    <tr key={conv.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">{conv.order_id || conv.id}</td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-900 block truncate max-w-xs">{conv.offer_title}</span>
                        <span className="text-[11px] text-slate-400">{conv.network_name}</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-slate-100 text-slate-800">
                          {conv.conversion_type}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-700">
                        ${conv.commission_amount.toFixed(2)} {conv.currency}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-slate-600">{conv.country || 'US'}</td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            conv.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : conv.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {conv.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-400">
                        {new Date(conv.recorded_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: REAL-TIME CLICK LOGS */}
      {activeTab === 'clicks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Live traffic redirected through <code className="bg-slate-100 px-1 py-0.5 rounded">/go/[slug]</code>.
            </span>
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV Report</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Tracking Slug</th>
                  <th className="py-3 px-3">Referrer</th>
                  <th className="py-3 px-3">IP Hash</th>
                  <th className="py-3 px-3">User Agent</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentClicks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No clicks recorded yet.
                    </td>
                  </tr>
                ) : (
                  recentClicks.map((click, idx) => (
                    <tr key={click.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-4 font-mono font-semibold text-brand-600">
                        /go/{click.tracking_slug}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 truncate max-w-xs">{click.referrer || 'Direct'}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-400">{click.ip_hash || '—'}</td>
                      <td className="py-2.5 px-3 text-slate-400 truncate max-w-xs">{click.user_agent || 'Browser'}</td>
                      <td className="py-2.5 px-4 text-right text-slate-400">
                        {new Date(click.clicked_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT OFFER */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {editingOffer ? 'Edit Affiliate Offer' : 'Create New Affiliate Offer'}
              </h2>
              <button
                onClick={() => setShowOfferModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOffer} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Offer Title *</label>
                  <input
                    type="text"
                    required
                    value={offerForm.title || ''}
                    onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                    placeholder="e.g. Canva Pro 30-Day Free Registration"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company / Brand Name</label>
                  <input
                    type="text"
                    value={offerForm.company_name || ''}
                    onChange={(e) => setOfferForm({ ...offerForm, company_name: e.target.value })}
                    placeholder="e.g. Canva"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Destination Target URL *</label>
                <input
                  type="url"
                  required
                  value={offerForm.destination_url || ''}
                  onChange={(e) => setOfferForm({ ...offerForm, destination_url: e.target.value })}
                  placeholder="https://partner.network/click?pid=123..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tracking Slug *</label>
                  <input
                    type="text"
                    required
                    value={offerForm.tracking_slug || ''}
                    onChange={(e) => setOfferForm({ ...offerForm, tracking_slug: e.target.value })}
                    placeholder="canva-free-trial"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={offerForm.category || 'Technology and Software'}
                    onChange={(e) => setOfferForm({ ...offerForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Free Registration Offers">Free Registration Offers</option>
                    <option value="Banking and Financial Services">Banking and Financial Services</option>
                    <option value="Technology and Software">Technology and Software</option>
                    <option value="Hosting and Domains">Hosting and Domains</option>
                    <option value="Shopping and E-commerce">Shopping and E-commerce</option>
                    <option value="Education and Courses">Education and Courses</option>
                    <option value="Mobile Applications">Mobile Applications</option>
                    <option value="Digital Products and AI">Digital Products and AI</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Commission Model</label>
                  <select
                    value={offerForm.commission_model || 'CPA'}
                    onChange={(e) => setOfferForm({ ...offerForm, commission_model: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="CPL">CPL (Free Signup / Lead)</option>
                    <option value="CPS">CPS (Sale / Purchase)</option>
                    <option value="CPA">CPA (Qualified Action)</option>
                    <option value="CPI">CPI (App Install)</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Deal Highlight / Payout</label>
                  <input
                    type="text"
                    value={offerForm.payout_amount || ''}
                    onChange={(e) => setOfferForm({ ...offerForm, payout_amount: e.target.value })}
                    placeholder="e.g. 75% Off or $10 / signup"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Affiliate Network</label>
                  <select
                    value={offerForm.affiliate_network || 'Direct'}
                    onChange={(e) => setOfferForm({ ...offerForm, affiliate_network: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Direct">Direct Partnership</option>
                    {networks.map((n) => (
                      <option key={n.id} value={n.name}>
                        {n.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={offerForm.cta_button_text || 'Claim Offer'}
                    onChange={(e) => setOfferForm({ ...offerForm, cta_button_text: e.target.value })}
                    placeholder="Claim Offer"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Offer Description</label>
                <textarea
                  rows={2}
                  value={offerForm.description || ''}
                  onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                  placeholder="Key value proposition and features..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company Logo URL</label>
                  <input
                    type="url"
                    value={offerForm.company_logo || ''}
                    onChange={(e) => setOfferForm({ ...offerForm, company_logo: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Badge Text</label>
                  <input
                    type="text"
                    value={offerForm.badge_text || ''}
                    onChange={(e) => setOfferForm({ ...offerForm, badge_text: e.target.value })}
                    placeholder="e.g. 🎁 Free Trial or 🔥 Hot Deal"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={Boolean(offerForm.is_featured)}
                    onChange={(e) => setOfferForm({ ...offerForm, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded text-brand-600"
                  />
                  <span>Feature on Homepage &amp; Top of Deals</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={Boolean(offerForm.is_active)}
                    onChange={(e) => setOfferForm({ ...offerForm, is_active: e.target.checked })}
                    className="w-4 h-4 rounded text-brand-600"
                  />
                  <span>Active &amp; Visible to Visitors</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowOfferModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl transition shadow-xs"
                >
                  {editingOffer ? 'Update Offer' : 'Publish Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT NETWORK */}
      {showNetworkModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                {editingNetwork ? 'Edit Affiliate Network' : 'Add Partner Network'}
              </h2>
              <button onClick={() => setShowNetworkModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNetwork} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Network Name *</label>
                <input
                  type="text"
                  required
                  value={networkForm.name || ''}
                  onChange={(e) => setNetworkForm({ ...networkForm, name: e.target.value })}
                  placeholder="e.g. Impact.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Portal Login URL</label>
                <input
                  type="url"
                  value={networkForm.login_url || ''}
                  onChange={(e) => setNetworkForm({ ...networkForm, login_url: e.target.value })}
                  placeholder="https://app.impact.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Commission Types</label>
                <input
                  type="text"
                  value={networkForm.commission_types || ''}
                  onChange={(e) => setNetworkForm({ ...networkForm, commission_types: e.target.value })}
                  placeholder="CPA, CPL, CPS"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Network Status</label>
                <select
                  value={networkForm.status || 'active'}
                  onChange={(e) => setNetworkForm({ ...networkForm, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="active">Active &amp; Approved</option>
                  <option value="pending_approval">Pending Approval</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNetworkModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition"
                >
                  Save Network
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RECORD CONVERSION */}
      {showConversionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Record Affiliate Conversion</h2>
              <button onClick={() => setShowConversionModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordConversion} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Offer Title *</label>
                <input
                  type="text"
                  required
                  value={conversionForm.offer_title || ''}
                  onChange={(e) => setConversionForm({ ...conversionForm, offer_title: e.target.value })}
                  placeholder="e.g. Canva Pro Free Registration"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Commission ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={conversionForm.commission_amount || 0}
                    onChange={(e) =>
                      setConversionForm({ ...conversionForm, commission_amount: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-700"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Type</label>
                  <select
                    value={conversionForm.conversion_type || 'CPL'}
                    onChange={(e) => setConversionForm({ ...conversionForm, conversion_type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="CPL">CPL (Lead / Free Signup)</option>
                    <option value="CPS">CPS (Sale)</option>
                    <option value="CPA">CPA (Action)</option>
                    <option value="CPI">CPI (Install)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Network</label>
                  <input
                    type="text"
                    value={conversionForm.network_name || 'Impact'}
                    onChange={(e) => setConversionForm({ ...conversionForm, network_name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status</label>
                  <select
                    value={conversionForm.status || 'approved'}
                    onChange={(e) => setConversionForm({ ...conversionForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Order / Transaction ID</label>
                <input
                  type="text"
                  value={conversionForm.order_id || ''}
                  onChange={(e) => setConversionForm({ ...conversionForm, order_id: e.target.value })}
                  placeholder="e.g. TR-998124"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowConversionModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition"
                >
                  Log Conversion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
