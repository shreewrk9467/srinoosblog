import { NextRequest, NextResponse } from 'next/server';
import { getAdPlacementById, updateAdPlacement, deleteAdPlacement } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const placement = getAdPlacementById(params.id);
  if (!placement) {
    return NextResponse.json({ error: 'Placement not found' }, { status: 404 });
  }
  return NextResponse.json({ placement });
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
    const body = await request.json();
    const updated = updateAdPlacement(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Placement not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, placement: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update ad placement' }, { status: 500 });
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
    const deleted = deleteAdPlacement(params.id);
    if (!deleted) {
      return NextResponse.json({ error: 'Placement not found or already deleted' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Ad placement deleted successfully' });
  } catch (error: any) {
    console.error('Delete ad placement error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to delete ad placement' }, { status: 500 });
  }
}
