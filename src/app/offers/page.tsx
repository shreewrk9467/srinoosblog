import { Metadata } from 'next';
import { getAllAffiliates, getAllAffiliateNetworks, getWebsiteSettings } from '@/lib/db';
import AdUnit from '@/components/AdUnit';
import OffersClientView from './OffersClientView';

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

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <AdUnit placementId="homepage-mid" />
      </div>

      {/* Legal & Compliance Notice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
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
    </div>
  );
}
