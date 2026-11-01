import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
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

    // Bust cache instantly across the entire website
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/');
      revalidatePath('/blog');
      revalidatePath('/blog/[slug]', 'page');
      revalidatePath('/admin/ads');
    } catch {}

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
      return NextResponse.json({ error: 'Placement not found' }, { status: 404 });
    }

    // Bust cache instantly across the entire website
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/');
      revalidatePath('/blog');
      revalidatePath('/blog/[slug]', 'page');
      revalidatePath('/admin/ads');
    } catch {}

    return NextResponse.json({ success: true, message: 'Placement deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to delete placement' }, { status: 500 });
  }
}
