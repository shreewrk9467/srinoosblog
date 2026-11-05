import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { formatArticleWithLlm, FormatOptions } from '@/lib/ai-article-formatter';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const session = getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { content, options } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Article content string is required' }, { status: 400 });
    }

    const result = await formatArticleWithLlm(content, (options as FormatOptions) || {});

    return NextResponse.json({
      success: true,
      formattedContent: result.formattedContent,
      stats: result.stats,
      improvements: result.improvements,
    });
  } catch (error: any) {
    console.error('Error in /api/ai-format:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to format article content' },
      { status: 500 }
    );
  }
}

