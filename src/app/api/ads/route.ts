import { NextRequest, NextResponse } from 'next/server';
import { getAllAdPlacements } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const placements = getAllAdPlacements();
  return NextResponse.json({ placements });
}
