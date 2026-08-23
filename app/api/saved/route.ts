import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/server-auth';

export async function GET(req: NextRequest) {
  const authed = await getUserFromRequest(req);
  if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await authed.client
    .from('saved')
    .select('id, history_id, format_id, type, platform, content, character_count, created_at')
    .eq('user_id', authed.userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[saved] DB error:', error.message);
    return NextResponse.json({ error: 'Failed to load saved items.' }, { status: 500 });
  }

  return NextResponse.json({ items: data ?? [] });
}

export async function POST(req: NextRequest) {
  const authed = await getUserFromRequest(req);
  if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { history_id, format_id, type, platform, content } = body as {
    history_id?: string;
    format_id?: string;
    type?: string;
    platform?: string;
    content?: string;
  };

  if (!format_id || !type || !platform || typeof content !== 'string') {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const { data, error } = await authed.client
    .from('saved')
    .insert({
      user_id: authed.userId,
      history_id: history_id ?? null,
      format_id,
      type,
      platform,
      content,
      character_count: content.length,
    })
    .select('id, history_id, format_id, type, platform, content, character_count, created_at')
    .single();

  if (error) {
    console.error('[saved] insert error:', error.message);
    return NextResponse.json({ error: 'Failed to save item.' }, { status: 500 });
  }

  return NextResponse.json({ item: data });
}
