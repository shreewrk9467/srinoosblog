import { NextRequest, NextResponse } from 'next/server';
import { getAllConversions, recordConversion } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const conversions = getAllConversions(100);
  const totalApproved = conversions
    .filter((c) => c.status === 'approved')
    .reduce((sum, c) => sum + (c.commission_amount || 0), 0);
  const totalPending = conversions
    .filter((c) => c.status === 'pending')
    .reduce((sum, c) => sum + (c.commission_amount || 0), 0);

  return NextResponse.json({
    conversions,
    stats: {
      totalCount: conversions.length,
      totalApprovedCommission: Number(totalApproved.toFixed(2)),
      totalPendingCommission: Number(totalPending.toFixed(2)),
    },
  });
}

export async function POST(request: NextRequest) {
  const session = getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  try {
    const body: any = await request.json();
    if (!body.tracking_slug && !body.offer_title) {
      return NextResponse.json({ error: 'Tracking slug or Offer title is required' }, { status: 400 });
    }

    const conversion = recordConversion(body);
    return NextResponse.json({ success: true, conversion }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to record conversion' }, { status: 500 });
  }
}

