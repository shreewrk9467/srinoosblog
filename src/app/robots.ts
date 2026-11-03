import { MetadataRoute } from 'next';
import { getWebsiteSettings } from '@/lib/db';

export default function robots(): MetadataRoute.Robots {
  const settings = getWebsiteSettings();
  const baseUrl = settings.site_url || 'https://sricospace.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/go/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

