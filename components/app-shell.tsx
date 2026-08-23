'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { SearchProvider } from '@/lib/search-context';
import { useAuth } from '@/lib/auth-context';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  // Show a full-screen spinner while auth state is resolving to prevent flash
  if (loading || !user) {
    return (
      <div
        className="h-full flex items-center justify-center"
        style={{ background: 'var(--bg)' }}
      >
        <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--fg-4)' }} strokeWidth={1.75} />
      </div>
    );
  }

  return (
    <SearchProvider>
      <div className="flex h-full overflow-hidden" style={{ background: 'var(--bg)' }}>
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Topbar onMobileMenuToggle={() => setMobileMenuOpen((o) => !o)} />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SearchProvider>
  );
}
