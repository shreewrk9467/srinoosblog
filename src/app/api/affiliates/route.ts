import { NextRequest, NextResponse } from 'next/server';
import { getAllAffiliates, createAffiliate } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const affiliates = getAllAffiliates();
  return NextResponse.json({ affiliates });
}

export async function POST(request: NextRequest) {
  const session = getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.title || !body.destination_url) {
      return NextResponse.json({ error: 'Title and Destination URL are required' }, { status: 400 });
    }

    const tracking_slug = body.tracking_slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newAff = createAffiliate({ ...body, tracking_slug });
    return NextResponse.json({ success: true, affiliate: newAff }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to create affiliate promotion' }, { status: 500 });
  }
}
