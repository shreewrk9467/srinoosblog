import { NextRequest, NextResponse } from 'next/server';
import { getAllAffiliateNetworks, createAffiliateNetwork } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const networks = getAllAffiliateNetworks();
  return NextResponse.json({ networks });
}

export async function POST(request: NextRequest) {
  const session = getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ error: 'Network name is required' }, { status: 400 });
    }

    const network = createAffiliateNetwork(body);
    return NextResponse.json({ success: true, network }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to create affiliate network' }, { status: 500 });
  }
}
