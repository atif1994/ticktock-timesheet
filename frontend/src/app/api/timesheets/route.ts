/**
 * Internal BFF route: GET /api/timesheets
 *
 * Validates the user's session, then proxies the request to the backend API.
 * The browser never speaks directly to the backend — all calls go through here.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:4000';
const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET ?? '';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;

  const backendRes = await fetch(
    `${BACKEND_URL}/api/timesheets?${searchParams.toString()}`,
    {
      headers: { 'x-internal-secret': INTERNAL_SECRET },
      next: { revalidate: 0 }, // always fetch fresh data
    }
  );

  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}
