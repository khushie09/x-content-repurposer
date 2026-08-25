'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/';

    if (!code) {
      router.replace('/login');
      return;
    }

    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      router.replace(error ? '/login' : next);
    });
  }, [router, searchParams]);

  return (
    <Loader2
      className="w-5 h-5 animate-spin"
      style={{ color: 'var(--fg-4)' }}
      strokeWidth={1.75}
    />
  );
}

export default function AuthCallbackPage() {
  return (
    <div
      className="h-full flex items-center justify-center"
      style={{ background: 'var(--bg)' }}
    >
      <Suspense
        fallback={
          <Loader2
            className="w-5 h-5 animate-spin"
            style={{ color: 'var(--fg-4)' }}
            strokeWidth={1.75}
          />
        }
      >
        <CallbackHandler />
      </Suspense>
    </div>
  );
}
