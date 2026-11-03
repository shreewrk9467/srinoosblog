'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  ExternalLink,
  ShieldCheck,
  Star,
  Sparkles,
  Info,
  ChevronDown,
  CheckCircle,
  Tag,
  Gift,
  CreditCard,
  Laptop,
  Server,
  ShoppingBag,
  GraduationCap,
  Smartphone,
  Bot,
} from 'lucide-react';
import { AffiliatePromotion, AffiliateNetwork } from '@/lib/types';

interface OffersClientViewProps {
  initialAffiliates: AffiliatePromotion[];
  networks: AffiliateNetwork[];
  siteUrl: string;
}

const CATEGORIES = [
  { id: 'all', name: 'All Offers', icon: Sparkles },
  { id: 'Free Registration Offers', name: 'Free Registration', icon: Gift },
  { id: 'Banking and Financial Services', name: 'Banking & FinTech', icon: CreditCard },
  { id: 'Technology and Software', name: 'Software & SaaS', icon: Laptop },
  { id: 'Hosting and Domains', name: 'Hosting & Domains', icon: Server },
  { id: 'Shopping and E-commerce', name: 'Shopping & Retail', icon: ShoppingBag },
  { id: 'Education and Courses', name: 'Courses & Certs', icon: GraduationCap },
  { id: 'Mobile Applications', name: 'Mobile Apps', icon: Smartphone },
  { id: 'Digital Products and AI', name: 'AI & Digital Tools', icon: Bot },
];

const COMMISSION_MODELS = [
  { id: 'all', label: 'All Models' },
  { id: 'CPL', label: 'CPL (Free Signups / Leads)' },
  { id: 'CPS', label: 'CPS (Discounts / Sales)' },
  { id: 'CPA', label: 'CPA (Action Payouts)' },
  { id: 'CPI', label: 'CPI (App Installs)' },
];

export default function OffersClientView({
  initialAffiliates,
  networks,
}: OffersClientViewProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedModel, setSelectedModel] = useState('all');
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'popular' | 'newest'>('featured');
  const [expandedOfferId, setExpandedOfferId] = useState<string | null>(null);

  const filteredAffiliates = useMemo(() => {
    return initialAffiliates.filter((aff) => {
      // Search
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesTitle = aff.title.toLowerCase().includes(query);
        const matchesCompany = (aff.company_name || '').toLowerCase().includes(query);
        const matchesDesc = (aff.description || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesCompany && !matchesDesc) return false;
      }

      // Category
      if (selectedCategory !== 'all' && aff.category !== selectedCategory) {
        return false;
      }

      // Model
      if (selectedModel !== 'all' && aff.commission_model !== selectedModel) {
        return false;
      }

      // Network
      if (selectedNetwork !== 'all' && aff.affiliate_network !== selectedNetwork) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        return (b.total_clicks || 0) - (a.total_clicks || 0);
      }
      if (sortBy === 'rating') {
        return (b.rating || 4.5) - (a.rating || 4.5);
      }
      if (sortBy === 'popular') {
        return (b.total_clicks || 0) - (a.total_clicks || 0);
      }
      if (sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return 0;
    });
  }, [initialAffiliates, search, selectedCategory, selectedModel, selectedNetwork, sortBy]);

  return (
    <div className="space-y-8">
      {/* Search and Secondary Filter Row */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies, free trials, hosting discounts, software..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-brand-500"
            >
              {COMMISSION_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>

            <select
              value={selectedNetwork}
              onChange={(e) => setSelectedNetwork(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-brand-500"
            >
              <option value="all">All Networks</option>
              {networks.map((n) => (
                <option key={n.id} value={n.name}>
                  {n.name}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-brand-500"
            >
              <option value="featured">Sort: Featured First</option>
              <option value="rating">Sort: Highest Rated</option>
              <option value="popular">Sort: Most Popular</option>
              <option value="newest">Sort: Newest</option>
            </select>
          </div>
        </div>

        {/* Category Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2 border-t border-slate-100">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Counter */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-900">{filteredAffiliates.length}</strong> verified offers
        </span>
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-brand-600 hover:underline font-semibold"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Offers Grid */}
      {filteredAffiliates.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No matching offers found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Try adjusting your search keywords, clearing model filters, or selecting &quot;All Offers&quot;.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('all');
              setSelectedModel('all');
              setSelectedNetwork('all');
            }}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAffiliates.map((aff) => {
            const isExpanded = expandedOfferId === aff.id;
            const modelColor =
              aff.commission_model === 'CPL'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : aff.commission_model === 'CPS'
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : aff.commission_model === 'CPI'
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-amber-50 text-amber-700 border-amber-200';

            return (
              <div
                key={aff.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top Badge Banner */}
                {aff.badge_text && (
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-900 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-xs">
                      {aff.badge_text}
                    </span>
                  </div>
                )}

                <div>
                  {/* Brand & Category Info */}
                  <div className="flex items-start gap-3 pt-1 pb-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                      {aff.company_logo ? (
                        <img
                          src={aff.company_logo}
                          alt={aff.company_name || aff.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Tag className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div className="pr-16">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                        {aff.company_name || 'Verified Partner'}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${modelColor}`}>
                          {aff.commission_model || 'CPA'}
                        </span>
                        <div className="flex items-center gap-0.5 text-amber-400 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{aff.rating ? aff.rating.toFixed(1) : '4.8'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-brand-600 transition leading-snug line-clamp-2 mt-1">
                    {aff.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                    {aff.description}
                  </p>

                  {/* Payout & Value Highlight */}
                  {aff.payout_amount && (
                    <div className="mt-3.5 p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Deal Highlight:</span>
                      <strong className="text-emerald-700 font-bold">{aff.payout_amount}</strong>
                    </div>
                  )}

                  {/* Collapsible Terms & Conditions */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1.5 animate-fadeIn">
                      <p>
                        <strong>Network:</strong> {aff.affiliate_network || 'Direct'}
                      </p>
                      {aff.eligibility_terms && (
                        <p>
                          <strong>Eligibility:</strong> {aff.eligibility_terms}
                        </p>
                      )}
                      <p>
                        <strong>Disclaimer:</strong> {aff.disclosure_text || 'Commissions depend on verified conversion.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="pt-4 border-t border-slate-100 mt-4 space-y-2">
                  <a
                    href={`/go/${aff.tracking_slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 group-hover:scale-[1.01]"
                  >
                    <span>{aff.cta_button_text || 'Claim Offer'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => setExpandedOfferId(isExpanded ? null : aff.id)}
                    className="w-full text-center text-[11px] text-slate-400 hover:text-slate-600 transition py-0.5 flex items-center justify-center gap-1"
                  >
                    <span>{isExpanded ? 'Hide Details' : 'View Terms & Eligibility'}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
