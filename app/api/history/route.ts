import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('history')
    .select('id, original_content, selected_formats, tone, generated_results, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('[history] DB error:', error.message);
    return NextResponse.json({ error: 'Failed to load history.' }, { status: 500 });
  }

  return NextResponse.json({ items: data ?? [] });
}
