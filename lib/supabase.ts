import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// Browser / client-side singleton
export const supabase = createClient(url, key);

// Per-request server-side client that carries the user's JWT so RLS is enforced
// by auth.uid(). Never instantiate this on the client.
export function createServerClient(accessToken: string) {
  return createClient(url, key, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
