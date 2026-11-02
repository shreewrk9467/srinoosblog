import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { getSessionFromCookies } from '@/lib/auth';
import { isSupabaseConfigured, getSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const session = getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate mime type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({
        error: 'Invalid file type. Supported types: JPG, PNG, WebP, GIF, SVG',
      }, { status: 400 });
    }

    // Limit size to 5MB for fast serverless transmission
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize and create unique filename
    const ext = path.extname(file.name) || '.jpg';
    const baseName = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-');
    const uniqueFileName = `${baseName}-${Date.now()}${ext}`;

    // 1. If Supabase is configured, attempt upload to Supabase 'media' bucket
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabaseClient();
        if (client) {
          const { data: uploadData, error: uploadErr } = await client.storage
            .from('media')
            .upload(uniqueFileName, buffer, { contentType: file.type, upsert: true });

          if (!uploadErr && uploadData) {
            const { data: publicUrlData } = client.storage.from('media').getPublicUrl(uniqueFileName);
            if (publicUrlData?.publicUrl) {
              return NextResponse.json({
                success: true,
                url: publicUrlData.publicUrl,
                fileName: uniqueFileName,
                size: file.size,
                mimeType: file.type,
                storage: 'supabase',
              });
            }
          }
        }
      } catch (storageErr) {
        console.warn('Supabase storage notice:', storageErr);
      }
    }

    // 2. Serverless-safe fallback: generate self-contained, zero-disk Data URL
    const base64Data = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64Data}`;

    return NextResponse.json({
      success: true,
      url: dataUrl,
      fileName: uniqueFileName,
      size: file.size,
      mimeType: file.type,
      storage: 'inline',
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: error?.message || 'File upload failed' }, { status: 500 });
  }
}
