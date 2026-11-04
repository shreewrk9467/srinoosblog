import { Metadata } from 'next';
import Link from 'next/link';
import { getAllAffiliates, getAllAffiliateNetworks, getWebsiteSettings } from '@/lib/db';
import AdUnit from '@/components/AdUnit';
import OffersClientView from './OffersClientView';
import { PageSection } from '@/lib/types';
import { getPageSections } from '@/lib/page-layouts';
import { HelpCircle, Sparkles, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const settings = getWebsiteSettings();
  return {
    title: 'Top Verified Affiliate Deals, Free Registration Offers & Software Discounts | Sricospace',
    description:
      'Discover verified free registration offers, exclusive cloud hosting discounts, software deals, and fintech banking resources curated by Sricospace (Made by Srinoos).',
    keywords: [
      'sricospace deals',
      'affiliate offers',
      'free registration offers',
      'software discounts',
      'hosting promo code',
      'Sricospace',
      'Srinoos',
      'CPA offers',
      'CPL free trials',
    ],
    alternates: {
      canonical: `${settings.site_url || 'https://sricospace.com'}/offers`,
    },
    openGraph: {
      title: 'Top Verified Deals & Free Offers | Sricospace',
      description:
        'Save money and discover legitimate online tools with verified partner promotions and free registration trials.',
      url: `${settings.site_url || 'https://sricospace.com'}/offers`,
      type: 'website',
    },
  };
}

export default function OffersPage() {
  const settings = getWebsiteSettings();
  const allAffiliates = getAllAffiliates({ is_active: true });
  const allNetworks = getAllAffiliateNetworks();

  // Structured Data Schema for Google Rich Snippets
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Top Verified Affiliate Offers & Software Deals - Sricospace',
    description: 'Curated list of verified technology, hosting, and free registration partner offers.',
    itemListElement: allAffiliates.slice(0, 15).map((aff, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Product',
        name: aff.title,
        description: aff.description,
        image: aff.banner_url || aff.company_logo,
        brand: {
          '@type': 'Brand',
          name: aff.company_name || aff.title,
        },
        offers: {
          '@type': 'Offer',
          url: `${settings.site_url || 'https://sricospace.com'}/go/${aff.tracking_slug}`,
          priceCurrency: 'USD',
          price: '0.00',
          availability: 'https://schema.org/InStock',
          category: aff.category || 'Technology and Software',
        },
      },
    })),
  };

  // Load visual builder layout (always synchronized with Builder studio)
  const activeSections = getPageSections('offers', settings).filter((sec: PageSection) => sec.enabled);

  const renderSection = (section: PageSection) => {
    switch (section.type) {
      case 'offers_header':
        return (
          <section key={section.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
            <div
              className={`rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden bg-gradient-to-r ${section.background_gradient || 'from-slate-950 via-slate-900 to-indigo-950'
                } text-white`}
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-3xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-400/30 text-amber-300 rounded-full text-xs font-bold uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{section.badge || '🔥 Exclusive Partner Portal'}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  <span>{allAffiliates.length} Verified Offers</span>
                </div>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-display">
                  {section.headline || 'Curated Deals, Free Registrations & Affiliate Offers'}
                </h1>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {section.subheadline ||
                    'Explore handpicked promotions across free trials, cloud web hosting, AI productivity tools, and business banking. Every link is verified with transparent eligibility criteria.'}
                </p>
              </div>
            </div>
          </section>
        );

      case 'top_ad':
      case 'mid_ad':
      case 'footer_ad':
        return (
          <div key={section.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AdUnit placementId={section.placementId || 'homepage-top'} />
          </div>
        );

      case 'offers_grid':
      case 'deals':
        return (
          <main key={section.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <OffersClientView
              initialAffiliates={allAffiliates}
              networks={allNetworks}
              siteUrl={settings.site_url || 'https://sricospace.com'}
            />
          </main>
        );

      case 'faq_accordion':
        return (
          <section key={section.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs text-xs text-slate-500 space-y-4">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-base">
                <ShieldCheck className="w-5 h-5 text-brand-600" />
                <span>{section.headline || '⚖️ Transparent Affiliate Disclosure & Terms'}</span>
              </div>
              <p className="leading-relaxed">
                {section.subheadline ||
                  'Sricospace.com (Made by Srinoos) is an independent publisher supported by performance-based affiliate partnerships. When you register, click, download, or complete purchases via partner links on our website, we may receive financial compensation (such as CPA, CPL, CPS, or CPI commissions) from participating affiliate networks and merchants at zero additional cost to you.'}
              </p>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-600 space-y-2">
                <p className="font-semibold text-slate-800 text-xs">Verification Guarantee:</p>
                <p className="leading-relaxed">
                  Specific terms, discount duration, eligibility requirements, and conversion validations are governed entirely by each partner organization&apos;s operating agreement. Sricospace does not handle user billing, payments, or third-party service contracts directly.
                </p>
              </div>
            </div>
          </section>
        );

      case 'cta_box':
        return (
          <section key={section.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <div
              className={`rounded-3xl bg-gradient-to-r ${section.background_gradient || 'from-slate-900 via-brand-950 to-slate-900'
                } text-white p-8 sm:p-12 text-center shadow-lg border border-slate-800 space-y-4`}
            >
              {section.badge && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-500/20 text-brand-300 rounded-full text-xs font-bold uppercase tracking-wider">
                  {section.badge}
                </span>
              )}
              <h2 className="text-2xl sm:text-3xl font-black text-white">{section.headline || 'Have a Product or Affiliate Program to Submit?'}</h2>
              {section.subheadline && (
                <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">{section.subheadline}</p>
              )}
              {section.btn1_text && (
                <div className="pt-2">
                  <Link
                    href={section.btn1_link || '/contact'}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md"
                  >
                    {section.btn1_text} &rarr;
                  </Link>
                </div>
              )}
            </div>
          </section>
        );

      case 'custom_banner':
        return (
          <section key={section.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <div
              className={`rounded-3xl bg-gradient-to-r ${section.background_gradient || 'from-indigo-600 via-purple-600 to-brand-600'
                } text-white p-8 sm:p-12 shadow-xl border border-white/10 relative overflow-hidden`}
            >
              <div className="max-w-2xl relative z-10 space-y-3">
                {section.badge && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                    <Sparkles className="w-3.5 h-3.5" /> {section.badge}
                  </span>
                )}
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {section.headline || section.title}
                </h2>
                {section.subheadline && (
                  <p className="text-slate-100 text-sm sm:text-base leading-relaxed">{section.subheadline}</p>
                )}
                {section.btn1_text && (
                  <div className="pt-2">
                    <Link
                      href={section.btn1_link || '/offers'}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-bold rounded-xl text-xs sm:text-sm shadow-md hover:bg-slate-100 transition"
                    >
                      {section.btn1_text} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case 'custom_html':
        return (section.html_content || section.html_code) ? (
          <section key={section.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <div dangerouslySetInnerHTML={{ __html: section.html_content || section.html_code || '' }} />
          </section>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {activeSections ? (
        activeSections.map((section) => renderSection(section))
      ) : (
        <>
          {/* Top Banner Ad Placement */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <AdUnit placementId="homepage-top" />
          </div>

          {/* Hero Header */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-3xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-400/30 text-amber-300 rounded-full text-xs font-bold uppercase tracking-wider">
                  <span>🔥 Exclusive Partner Portal</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  <span>{allAffiliates.length} Verified Offers</span>
                </div>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-display">
                  Curated Deals, Free Registrations & Affiliate Offers
                </h1>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Explore handpicked promotions across free trials, cloud web hosting, AI productivity tools, and business banking. Every link is verified with transparent eligibility criteria.
                </p>
              </div>
            </div>
          </section>

          {/* Interactive Client View with Filter & Search */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <OffersClientView
              initialAffiliates={allAffiliates}
              networks={allNetworks}
              siteUrl={settings.site_url || 'https://sricospace.com'}
            />
          </main>

          {/* Mid-Page Ad Placement */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <AdUnit placementId="homepage-mid" />
          </div>

          {/* Legal & Compliance Notice */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs text-xs text-slate-500 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-700 text-sm">
                <span>⚖️ Transparent Affiliate Disclosure & Terms</span>
              </div>
              <p className="leading-relaxed">
                Sricospace.com (Made by Srinoos) is an independent publisher supported by performance-based affiliate partnerships. When you register, click, download, or complete purchases via partner links on our website, we may receive financial compensation (such as CPA, CPL, CPS, or CPI commissions) from participating affiliate networks and merchants at zero additional cost to you.
              </p>
              <p className="leading-relaxed">
                Specific terms, discount duration, eligibility requirements, and conversion validations are governed entirely by each partner organization&apos;s operating agreement. Sricospace does not handle user billing, payments, or third-party service contracts directly.
              </p>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
