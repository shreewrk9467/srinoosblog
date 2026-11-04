import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getWebsiteSettingsAsync, updateWebsiteSettingsAsync } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const settings = await getWebsiteSettingsAsync();
  let supabaseSynced = true;
  let tableMissing = false;

  try {
    const { getSupabaseWebsiteSettings, getSupabaseClient } = await import('@/lib/supabase');
    const cloudSettings = await getSupabaseWebsiteSettings();
    if (cloudSettings === null) {
      const client = getSupabaseClient();
      if (client) {
        const { error } = await client.from('website_settings').select('key').limit(1);
        if (error && (error.code === 'PGRST205' || error.message?.includes('schema cache'))) {
          tableMissing = true;
          supabaseSynced = false;
        }
      }
    }
  } catch {}

  return NextResponse.json({ settings, supabaseSynced, tableMissing });
}

export async function PUT(request: NextRequest) {
  const session = getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  try {
    const body: any = await request.json();
    const result = await updateWebsiteSettingsAsync(body);

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

    return NextResponse.json({
      success: true,
      settings: result.updated,
      supabaseSynced: result.supabaseSynced,
      supabaseError: result.supabaseError,
      tableMissing: result.tableMissing,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update settings' }, { status: 500 });
  }
}
