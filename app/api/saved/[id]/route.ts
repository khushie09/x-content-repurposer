import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Missing id.' }, { status: 400 });
  }

  const { error } = await supabase.from('saved').delete().eq('id', id);

  if (error) {
    console.error('[saved/delete] DB error:', error.message);
    return NextResponse.json({ error: 'Failed to delete saved item.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
