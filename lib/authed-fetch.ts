import { supabase } from './supabase';

// Drop-in replacement for fetch() that automatically attaches the current
// user's Bearer token. Used by all client-side API calls.
export async function authedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const { data: { session } } = await supabase.auth.getSession();
  const headers = new Headers(options.headers as HeadersInit | undefined);
  if (session?.access_token) {
    headers.set('Authorization', `Bearer ${session.access_token}`);
  }
  return fetch(url, { ...options, headers });
}
