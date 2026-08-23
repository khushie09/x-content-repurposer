import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/server-auth';

const FREE_LIMIT = 10;

export async function GET(req: NextRequest) {
  const authed = await getUserFromRequest(req);
  if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const month = new Date().toISOString().slice(0, 7); // "2026-08"

  const { data } = await authed.client
    .from('usage')
    .select('count')
    .eq('user_id', authed.userId)
    .eq('month', month)
    .maybeSingle();

  return NextResponse.json({ count: data?.count ?? 0, limit: FREE_LIMIT });
}
