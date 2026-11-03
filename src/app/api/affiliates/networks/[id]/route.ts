import { NextRequest, NextResponse } from 'next/server';
import { updateAffiliateNetwork, deleteAffiliateNetwork } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updated = updateAffiliateNetwork(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Network not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, network: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update network' }, { status: 500 });
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
    const deleted = deleteAffiliateNetwork(params.id);
    if (!deleted) {
      return NextResponse.json({ error: 'Network not found or already deleted' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Network deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to delete network' }, { status: 500 });
  }
}
