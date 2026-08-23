import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/server-auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authed = await getUserFromRequest(req);
  if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  if (!id) return NextResponse.json({ error: 'Missing id.' }, { status: 400 });

  const { error } = await authed.client
    .from('saved')
    .delete()
    .eq('id', id)
    .eq('user_id', authed.userId); // ensures users can only delete their own rows

  if (error) {
    console.error('[saved/delete] DB error:', error.message);
    return NextResponse.json({ error: 'Failed to delete saved item.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
