import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/server-auth';

export async function GET(req: NextRequest) {
  const authed = await getUserFromRequest(req);
  if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await authed.client
    .from('history')
    .select('id, original_content, selected_formats, tone, generated_results, created_at')
    .eq('user_id', authed.userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('[history] DB error:', error.message);
    return NextResponse.json({ error: 'Failed to load history.' }, { status: 500 });
  }

  return NextResponse.json({ items: data ?? [] });
}
