import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const hostingerIp = '82.112.239.60';
  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`http://${hostingerIp}`, {
      method: 'GET',
      signal: controller.signal,
      redirect: 'manual',
    });
    clearTimeout(timeoutId);

    const latency = Date.now() - startTime;
    const serverHeader = res.headers.get('server') || 'LiteSpeed';
    const platformHeader = res.headers.get('platform') || 'hostinger';

    return NextResponse.json({
      success: true,
      online: true,
      ip: hostingerIp,
      serverName: 'server1675',
      location: 'Asia (India)',
      webServer: serverHeader,
      platform: platformHeader,
      httpStatus: res.status,
      latencyMs: latency,
      timestamp: new Date().toISOString(),
      message: 'Hostinger LiteSpeed Web Server is active and reachable!',
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      online: false,
      ip: hostingerIp,
      error: error?.message || 'Server timeout or unreachable',
      latencyMs: Date.now() - startTime,
    });
  }
}

