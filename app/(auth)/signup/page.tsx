'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

export default function SignupPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace('/');
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      setSubmitting(false);
      return;
    }

    if (data.session) {
      // Email confirmation disabled — user is immediately logged in
      router.replace('/');
    } else {
      // Email confirmation required
      setSubmitted(true);
      setSubmitting(false);
    }
  };

  if (loading) return null;

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

      <div
        className="rounded-2xl p-8"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        {submitted ? (
          <div className="flex flex-col items-center text-center gap-3 py-2">
            <CheckCircle2 className="w-9 h-9" style={{ color: 'var(--accent)' }} strokeWidth={1.5} />
            <h2 className="text-[17px] font-semibold" style={{ color: 'var(--fg)' }}>
              Check your email
            </h2>
            <p className="text-[13px] leading-relaxed" style={{ color: 'var(--fg-3)' }}>
              We sent a confirmation link to <strong style={{ color: 'var(--fg-2)' }}>{email}</strong>.
              Click it to activate your account, then sign in.
            </p>
            <Link
              href="/login"
              className="mt-2 text-[13px] font-medium"
              style={{ color: 'var(--accent)' }}
            >
              Go to sign in →
            </Link>
          </div>
        ) : (
          <>
            <h1
              className="text-[20px] font-semibold tracking-tight mb-6"
              style={{ color: 'var(--fg)' }}
            >
              Create your account
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
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                  autoComplete="new-password"
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
                {submitting ? 'Creating account…' : 'Create account'}
              </button>
            </form>
          </>
        )}
      </div>

      {!submitted && (
        <p className="text-center text-[13px] mt-5" style={{ color: 'var(--fg-3)' }}>
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium"
            style={{ color: 'var(--accent)', textDecoration: 'none' }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
          >
            Sign in
          </Link>
        </p>
      )}
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
