import { NextRequest, NextResponse } from 'next/server';
import { testWordPressConnection } from '@/lib/wordpress';
import { getSessionFromCookies } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const session = getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  try {
    const { url } = await request.json();
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'WordPress URL is required' }, { status: 400 });
    }

    const result = await testWordPressConnection(url);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Failed to test WordPress connection',
      error: error?.message || 'Server error',
    }, { status: 500 });
  }
}

