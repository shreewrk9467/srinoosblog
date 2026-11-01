import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getWebsiteSettings, updateWebsiteSettings } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const settings = getWebsiteSettings();
  return NextResponse.json({ settings });
}

export async function PUT(request: NextRequest) {
  const session = getSessionFromCookies();

  try {
    const body = await request.json();
    const updated = updateWebsiteSettings(body);

    try {
      revalidatePath('/', 'layout');
    } catch {}

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update settings' }, { status: 500 });
  }
}
