'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Already logged in → go to dashboard
  useEffect(() => {
    if (!loading && user) router.replace('/');
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(
        error.message === 'Invalid login credentials'
          ? 'Incorrect email or password.'
          : error.message,
      );
      setSubmitting(false);
    }
    // onAuthStateChange in AuthProvider handles the redirect via the useEffect above
  };

  if (loading) return null; // wait for auth check before showing form

  return (
    <div className="w-full max-w-[380px]">
      {/* Brand */}
      <div className="flex flex-col items-center mb-8 gap-2">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center font-semibold text-white text-[18px] select-none"
          style={{
            background: 'var(--accent)',
            boxShadow: '0 2px 12px rgba(240,184,200,0.3)',
            letterSpacing: '-0.02em',
          }}
        >
          R
        </div>
        <p className="text-[13px]" style={{ color: 'var(--fg-3)' }}>
          Turn one idea into content everywhere.
        </p>
      </div>

      {/* Card */}
      <div
        className="rounded-2xl p-8"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <h1
          className="text-[20px] font-semibold tracking-tight mb-6"
          style={{ color: 'var(--fg)' }}
        >
          Sign in to your account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              className="w-full h-9 px-3 rounded-lg text-[13.5px] bg-transparent outline-none"
              style={{
                color: 'var(--fg)',
                border: '1px solid var(--border)',
                caretColor: 'var(--accent)',
                transition: 'border-color 0.18s ease',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent-border)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
            />
          </Field>

          <Field label="Password">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="w-full h-9 px-3 rounded-lg text-[13.5px] bg-transparent outline-none"
              style={{
                color: 'var(--fg)',
                border: '1px solid var(--border)',
                caretColor: 'var(--accent)',
                transition: 'border-color 0.18s ease',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent-border)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
            />
          </Field>

          {error && (
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px]"
              style={{
                background: 'rgba(239,68,68,0.07)',
                border: '1px solid rgba(239,68,68,0.18)',
                color: '#f87171',
              }}
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-10 rounded-xl text-[13.5px] font-semibold btn-accent flex items-center justify-center gap-2 mt-2"
            style={{ opacity: submitting ? 0.7 : 1 }}
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />}
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>

      <p className="text-center text-[13px] mt-5" style={{ color: 'var(--fg-3)' }}>
        Don&apos;t have an account?{' '}
        <Link
          href="/signup"
          className="font-medium"
          style={{ color: 'var(--accent)', textDecoration: 'none' }}
          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[12px] font-medium" style={{ color: 'var(--fg-3)' }}>
        {label}
      </label>
      {children}
    </div>
  );
}
