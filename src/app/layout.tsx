import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import AdSenseScript from '@/components/AdSenseScript';
import AdminCornerBadge from '@/components/AdminCornerBadge';
import { getAllCategories, getWebsiteSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const settings = getWebsiteSettings();
  return {
    metadataBase: new URL(settings.site_url || 'https://srinoos.com'),
    title: {
      default: `${settings.site_name} – ${settings.site_tagline}`,
      template: `%s | ${settings.site_name}`,
    },
    description: settings.site_description,
    keywords: [
      'Srinoos',
      'Artificial Intelligence',
      'SEO Strategy',
      'Digital Marketing',
      'Affiliate Marketing',
      'Software Reviews',
      'Technology Tutorials',
      'Website Monetization',
    ],
    authors: [{ name: 'Srinoos Editorial Team', url: settings.site_url }],
    creator: 'Srinoos',
    publisher: 'Srinoos',
    icons: {
      icon: '/images/srinoos-s-icon.jpg',
      apple: '/images/srinoos-s-icon.jpg',
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: settings.site_url,
      siteName: settings.site_name,
      title: `${settings.site_name} – ${settings.site_tagline}`,
      description: settings.site_description,
      images: [
        {
          url: `${settings.site_url}/images/srinoos-logo.jpg`,
          width: 1200,
          height: 675,
          alt: `${settings.site_name} Technology Collective`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${settings.site_name} – ${settings.site_tagline}`,
      description: settings.site_description,
      creator: '@srinoos',
    },
    verification: {
      google: settings.google_search_console_tag?.replace('google-site-verification=', '') || undefined,
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = getAllCategories();
  const settings = getWebsiteSettings();

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.site_name,
    url: settings.site_url,
    logo: `${settings.site_url}/images/srinoos-logo.jpg`,
    description: settings.site_description,
    sameAs: [
      settings.twitter_url,
      settings.facebook_url,
      settings.linkedin_url,
      settings.youtube_url,
    ].filter(Boolean),
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: settings.site_name,
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

