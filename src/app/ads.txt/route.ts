import { NextResponse } from 'next/server';
import { getWebsiteSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const settings = getWebsiteSettings();
  const content = settings.ads_txt_content || `google.com, ${settings.adsense_publisher_id.replace('ca-', '')}, DIRECT, f08c47fec0942fa0`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
    },
  });
}
