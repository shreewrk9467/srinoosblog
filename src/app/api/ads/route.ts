import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAllAdPlacements, createAdPlacement } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const placements = getAllAdPlacements();
  return NextResponse.json({ placements });
}

export async function POST(request: NextRequest) {
  const session = getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ error: 'Ad placement name is required' }, { status: 400 });
    }

    const newPlacement = createAdPlacement(body);

    // Bust cache instantly across the entire website
    try {
      revalidatePath('/', 'layout');
    } catch {}

    return NextResponse.json({ success: true, placement: newPlacement }, { status: 201 });
  } catch (error: any) {
    console.error('Create ad placement error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to create ad placement' }, { status: 500 });
  }
}
