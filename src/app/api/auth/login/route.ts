import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCredentials, generateSessionToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const identifier = (body.email || body.username || '').trim();
    const password = (body.password || '').trim();

    if (!identifier || !password) {
      return NextResponse.json({ error: 'Username/Email and password are required' }, { status: 400 });
    }

    const session = await verifyAdminCredentials(identifier, password);
    if (!session) {
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
    }

    const token = generateSessionToken(session);
    const response = NextResponse.json({ success: true, user: session });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

