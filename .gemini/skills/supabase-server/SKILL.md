---
name: supabase-server
description: "Instructions and best practices for building APIs and server-side handlers with @supabase/server. Covers user verification, JWT validation with JWKS, session handling, and server-side supabase-js client initialization in Next.js and Node.js environments."
---

# Supabase Server SDK (@supabase/server)

## Overview
`@supabase/server` provides lightweight, fast server-side primitives to verify user JWTs, validate sessions against JWKS, and interact securely with Supabase services without exposing secret keys to client browsers.

## Environment Variables
- `SUPABASE_URL`: Project API endpoint (e.g., `https://udankkjapmjuurcveube.supabase.co`)
- `SUPABASE_PUBLISHABLE_KEY`: Publishable API key (`sb_publishable_...`)
- `SUPABASE_SECRET_KEY`: Backend service role / secret key (`sb_secret_...`)
- `SUPABASE_JWKS_URL`: JWKS endpoint for cryptographic token verification (`https://udankkjapmjuurcveube.supabase.co/auth/v1/.well-known/jwks.json`)

## Usage Patterns

### 1. User & JWT Verification
```typescript
import { createServerClient } from '@supabase/server';

export async function verifyUserToken(authHeader: string | null) {
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.replace('Bearer ', '');
  // Cryptographically verifies JWT using SUPABASE_JWKS_URL
  return token;
}
```

### 2. Server Client Initialization
Always use `SUPABASE_SECRET_KEY` on backend endpoints and never expose it to frontend client code or `NEXT_PUBLIC_` variables.

