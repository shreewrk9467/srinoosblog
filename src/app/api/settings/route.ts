import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getWebsiteSettingsAsync, updateWebsiteSettingsAsync } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const settings = await getWebsiteSettingsAsync();
  return NextResponse.json({ settings });
}

export async function PUT(request: NextRequest) {
  const session = getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  try {
    const body: any = await request.json();
    const updated = await updateWebsiteSettingsAsync(body);

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/');
      revalidatePath('/blog');
      revalidatePath('/trending');
      revalidatePath('/about');
      revalidatePath('/contact');
      revalidatePath('/offers');
      revalidatePath('/deals');
      revalidatePath('/categories');
      revalidatePath('/admin/builder');
      revalidatePath('/admin/content');
      revalidatePath('/admin/settings');
    } catch {}

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update settings' }, { status: 500 });
  }
}
