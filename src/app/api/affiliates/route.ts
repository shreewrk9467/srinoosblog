import { NextRequest, NextResponse } from 'next/server';
import {
  getAllAffiliates,
  createAffiliate,
  getRecentClicks,
  getAllAffiliateNetworks,
  getAllConversions,
} from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const commission_model = searchParams.get('commission_model') || undefined;
  const network = searchParams.get('network') || undefined;
  const search = searchParams.get('search') || undefined;
  const is_featured = searchParams.has('is_featured')
    ? searchParams.get('is_featured') === 'true' || searchParams.get('is_featured') === '1'
    : undefined;
  const is_active = searchParams.has('is_active')
    ? searchParams.get('is_active') === 'true' || searchParams.get('is_active') === '1'
    : undefined;

  const affiliates = getAllAffiliates({
    category,
    commission_model,
    network,
    search,
    is_featured,
    is_active,
  });

  const recentClicks = getRecentClicks(50);
  const networks = getAllAffiliateNetworks();
  const conversions = getAllConversions(20);

  return NextResponse.json({
    affiliates,
    recentClicks,
    networks,
    conversions,
  });
}

export async function POST(request: NextRequest) {
  const session = getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.title || !body.destination_url) {
      return NextResponse.json({ error: 'Title and Destination URL are required' }, { status: 400 });
    }

    const tracking_slug =
      body.tracking_slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const newAff = createAffiliate({ ...body, tracking_slug });
    return NextResponse.json({ success: true, affiliate: newAff }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to create affiliate promotion' }, { status: 500 });
  }
}
