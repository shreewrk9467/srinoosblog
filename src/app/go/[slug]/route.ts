import { NextRequest, NextResponse } from 'next/server';
import { getAffiliateBySlug, recordAffiliateClick } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  const affiliate = getAffiliateBySlug(slug);

  if (!affiliate || !affiliate.is_active || !affiliate.destination_url) {
    return NextResponse.redirect(new URL('/', request.url), 302);
  }

  // Basic bot filtering: check user agent
  const userAgent = request.headers.get('user-agent') || '';
  const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(userAgent);

  const placementId = request.nextUrl.searchParams.get('src') || undefined;
  const referrer = request.headers.get('referer') || '';

  // Simple IP hash
  const forwardedFor = request.headers.get('x-forwarded-for') || '';
  const ipHash = forwardedFor ? Buffer.from(forwardedFor.split(',')[0]).toString('base64').slice(0, 12) : '';

  if (!isBot) {
    try {
      recordAffiliateClick(slug, {
        placementId,
        userAgent: userAgent.slice(0, 200),
        referrer: referrer.slice(0, 200),
        ipHash,
      });
    } catch (e) {
      // Don't block redirect on tracking error
      console.error('Affiliate click logging error:', e);
    }
  }

  // Perform secure 307 temporary redirect
  const response = NextResponse.redirect(affiliate.destination_url, 307);
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  return response;
}
