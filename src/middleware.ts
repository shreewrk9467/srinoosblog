import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'srinoos_production_secure_jwt_secret_token_2026';
const COOKIE_NAME = 'srinoos_admin_token';

function base64UrlToBytes(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4;
  const padded = pad ? base64 + '='.repeat(4 - pad) : base64;
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * High-performance Edge-compatible cryptographic JWT verification using Web Crypto API.
 * Validates HMAC-SHA256 signature and expiration without external dependencies.
 */
async function verifyJwtInEdge(token: string, secretStr: string): Promise<boolean> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const [headerB64, payloadB64, signatureB64] = parts;

    // 1. Verify JSON payload expiration
    const payloadBytes = base64UrlToBytes(payloadB64);
    const payloadText = new TextDecoder().decode(payloadBytes);
    const payloadJson = JSON.parse(payloadText);

    if (payloadJson.exp && payloadJson.exp < Math.floor(Date.now() / 1000)) {
      return false; // Token expired
    }

    // 2. Cryptographically verify signature
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secretStr),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const data = enc.encode(`${headerB64}.${payloadB64}`);
    const signature = base64UrlToBytes(signatureB64);

    return await crypto.subtle.verify('HMAC', key, signature, data);
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  // 1. If accessing /admin/login while already legitimately authenticated, redirect to /admin
  if (pathname === '/admin/login') {
    if (token) {
      const isValid = await verifyJwtInEdge(token, JWT_SECRET);
      if (isValid) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    }
    return NextResponse.next();
  }

  // 2. Protect all other /admin routes with strict cryptographic verification
  if (pathname.startsWith('/admin')) {
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const isValid = await verifyJwtInEdge(token, JWT_SECRET);
    if (!isValid) {
      // Invalid or expired token: clear cookie and redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.set(COOKIE_NAME, '', { path: '/', maxAge: 0, expires: new Date(0) });
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
