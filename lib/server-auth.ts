import { supabase, createServerClient } from './supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

interface AuthedRequest {
  userId: string;
  client: SupabaseClient;
}

// Extract and verify the user's JWT from the Authorization header.
// Returns { userId, client } on success, null on failure.
export async function getUserFromRequest(req: Request): Promise<AuthedRequest | null> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7);

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;

  return { userId: user.id, client: createServerClient(token) };
}
