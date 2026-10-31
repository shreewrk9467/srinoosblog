import { NextResponse } from 'next/server';
import { getAnalyticsSummary, getDailyPublishingProgress } from '@/lib/db';
import { getSessionFromCookies } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const summary = getAnalyticsSummary();
  const dailyPublishing = getDailyPublishingProgress();

  return NextResponse.json({
    ...summary,
    dailyPublishing,
  });
}
