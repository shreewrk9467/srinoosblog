import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import AdSenseScript from '@/components/AdSenseScript';
import AdminCornerBadge from '@/components/AdminCornerBadge';
import { getAllCategories, getWebsiteSettingsAsync } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function extractGoogleVerification(tag?: string): string {
  const fallback = 'uodEPcFClTUy1YlkAZF-QtHcAHBhYrkqXwyJmBq_D1I';
  if (!tag) return fallback;
  const match = tag.match(/content=["']([^"']+)["']/i);
  if (match) return match[1];
  const cleaned = tag.replace(/^google-site-verification[:=]\s*/i, '').replace(/["']/g, '').trim();
  return cleaned || fallback;
}

function extractMitgoVerification(tag?: string): string {
  const fallback = '6015bfdb-7e9b-42b0-bfaa-6074e1b4eeab';
  if (!tag) return fallback;
  const match = tag.match(/content=["']([^"']+)["']/i);
  if (match) return match[1];
  const cleaned = tag.replace(/^mitgo-verification[:=]\s*/i, '').replace(/["']/g, '').trim();
  return cleaned || fallback;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getWebsiteSettingsAsync();
  const brandName = settings.site_name.toLowerCase().includes('sricospace')
    ? settings.site_name
    : `SricoSpace | ${settings.site_name}`;

  return {
    metadataBase: new URL(settings.site_url || 'https://sricospace.com'),
    title: {
      default: `${brandName} – ${settings.site_tagline}`,
      template: `%s | ${brandName}`,
    },
    description: `SricoSpace (sricospace.com) – ${settings.site_description}`,
    keywords: [
      'sricospace',
      'sricospace.com',
      'www.sricospace.com',
      'SricoSpace',
      'Srinoos',
      'Srinoos SricoSpace',
      'Ketanboina Venkat Shrinivas',
      'Artificial Intelligence',
      'SEO Strategy',
      'Digital Marketing',
      'Affiliate Marketing',
      'Software Reviews',
      'Technology Tutorials',
      'Website Monetization',
    ],
    authors: [{ name: settings.founder_name || 'Ketanboina Venkat Shrinivas', url: settings.site_url }],
    creator: 'SricoSpace',
    publisher: 'SricoSpace',
    alternates: {
      canonical: settings.site_url || 'https://sricospace.com',
    },
    icons: {
      icon: '/images/srinoos-s-icon.jpg',
      apple: '/images/srinoos-s-icon.jpg',
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: settings.site_url,
      siteName: 'SricoSpace',
      title: `${brandName} – ${settings.site_tagline}`,
      description: `SricoSpace (sricospace.com) – ${settings.site_description}`,
      images: [
        {
          url: `${settings.site_url}/images/srinoos-logo.jpg`,
          width: 1200,
          height: 675,
          alt: `${brandName} Technology Collective`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${brandName} – ${settings.site_tagline}`,
      description: `SricoSpace (sricospace.com) – ${settings.site_description}`,
      creator: '@srinoos',
    },
    verification: {
      google: extractGoogleVerification(settings.google_search_console_tag),
      other: {
        'mitgo-verification': extractMitgoVerification(settings.admitad_verification_tag),
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = getAllCategories();
  const settings = await getWebsiteSettingsAsync();

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SricoSpace',
    alternateName: [settings.site_name, 'sricospace.com', 'www.sricospace.com', 'Srinoos SricoSpace'],
    url: settings.site_url,
    logo: `${settings.site_url}/images/srinoos-logo.jpg`,
    description: `SricoSpace (sricospace.com) – ${settings.site_description}`,
    sameAs: [
      settings.twitter_url,
      settings.facebook_url,
      settings.linkedin_url,
      settings.youtube_url,
      settings.portfolio_url,
      settings.github_url,
    ].filter(Boolean),
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SricoSpace',
    alternateName: ['sricospace', 'sricospace.com', 'www.sricospace.com', settings.site_name],
    url: settings.site_url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${settings.site_url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta
          name="google-site-verification"
          content={extractGoogleVerification(settings.google_search_console_tag)}
        />
        <meta
          name="mitgo-verification"
          content={extractMitgoVerification(settings.admitad_verification_tag)}
        />
        {settings.google_analytics_id && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_id}`}
            />
            <script
              id="google-analytics-init"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${settings.google_analytics_id}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="flex flex-col min-h-screen text-slate-900 bg-slate-50 antialiased selection:bg-brand-500 selection:text-white">
        <AdSenseScript />
        <Header categories={categories} settings={settings} />
        <main className="flex-1 w-full">{children}</main>
        <Footer categories={categories} settings={settings} />
        <CookieBanner />
        <AdminCornerBadge />
      </body>
    </html>
  );
}

