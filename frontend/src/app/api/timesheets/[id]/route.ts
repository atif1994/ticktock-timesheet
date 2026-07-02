/**
 * Internal BFF route: GET /api/timesheets/:id
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:4000';
const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET ?? '';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const backendRes = await fetch(`${BACKEND_URL}/api/timesheets/${id}`, {
    headers: { 'x-internal-secret': INTERNAL_SECRET },
    next: { revalidate: 0 },
  });

  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}
