import { NextRequest, NextResponse } from 'next/server';
import { getAffiliateBySlug, updateAffiliate, deleteAffiliate } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const aff = getAffiliateBySlug(params.id);
  if (!aff) {
    return NextResponse.json({ error: 'Affiliate promotion not found' }, { status: 404 });
  }
  return NextResponse.json({ affiliate: aff });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  try {
    const body: any = await request.json();
    const updated = updateAffiliate(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Affiliate promotion not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, affiliate: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update affiliate promotion' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  try {
    const deleted = deleteAffiliate(params.id);
    if (!deleted) {
      return NextResponse.json({ error: 'Affiliate promotion not found or already deleted' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Affiliate promotion deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to delete affiliate promotion' }, { status: 500 });
  }
}

