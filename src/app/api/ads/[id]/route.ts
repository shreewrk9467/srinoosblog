import { NextRequest, NextResponse } from 'next/server';
import { getAdPlacementById, updateAdPlacement } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';

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
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

