import { NextRequest, NextResponse } from 'next/server';
import { testWordPressConnection } from '@/lib/wordpress';
import { updateWebsiteSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    let url = '';
    let autoSave = true;

    try {
      const body = await request.json();
      url = body?.url || '';
      if (body?.autoSave !== undefined) autoSave = body.autoSave;
    } catch {
      return NextResponse.json({
        success: false,
        message: 'Invalid request body format',
        error: 'JSON body required',
      }, { status: 400 });
    }

    if (!url || typeof url !== 'string' || !url.trim()) {
      return NextResponse.json({
        success: false,
        message: 'Please provide a valid WordPress URL (e.g., https://wp.sricospace.com)',
        error: 'WordPress URL is required',
      }, { status: 400 });
    }

    const result = await testWordPressConnection(url);

    // If connection succeeded and autoSave is enabled, persist URL to website settings
    if (result.success && autoSave && result.cleanedUrl) {
      try {
        updateWebsiteSettings({
          wordpress_url: result.cleanedUrl,
          wordpress_enabled: true,
        });
      } catch (saveErr) {
        console.warn('Auto-save to settings warning:', saveErr);
      }
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Failed to test WordPress connection',
      error: error?.message || 'Server error',
    }, { status: 500 });
  }
}
