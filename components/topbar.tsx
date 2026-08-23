'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Bell, Menu, LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSearch } from '@/lib/search-context';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

interface TopbarProps {
  onMobileMenuToggle: () => void;
}

// Derive initials from user's email or display name
function getInitials(email?: string | null, name?: string | null): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  if (email) return email[0].toUpperCase();
  return '?';
}

function getDisplayName(email?: string | null, name?: string | null): string {
  if (name) return name;
  if (email) {
    const prefix = email.split('@')[0];
    return prefix.charAt(0).toUpperCase() + prefix.slice(1);
  }
  return 'Account';
}

export function Topbar({ onMobileMenuToggle }: TopbarProps) {
  const { query, setQuery } = useSearch();
  const { user } = useAuth();
  const router = useRouter();

  const [bellOpen, setBellOpen]       = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const bellRef    = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(e.target as Node))    setBellOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  const initials    = getInitials(user?.email, user?.user_metadata?.full_name as string | null);
  const displayName = getDisplayName(user?.email, user?.user_metadata?.full_name as string | null);

  return (
    <header
      className="h-12 flex items-center justify-between px-4 gap-3 shrink-0 sticky top-0 z-30"
      style={{
        borderBottom: '1px solid var(--border)',
        background: 'color-mix(in srgb, var(--bg) 88%, transparent)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Mobile hamburger */}
      <button
        onClick={onMobileMenuToggle}
        className="lg:hidden w-8 h-8 flex items-center justify-center rounded-md transition-colors duration-150 hover:bg-[var(--border)] cursor-pointer"
        style={{ color: 'var(--fg-3)' }}
        aria-label="Open menu"
      >
        <Menu className="w-4 h-4" strokeWidth={1.75} />
      </button>

      {/* Search */}
      <div className="flex-1 flex items-center max-w-xl mx-auto">
        <label
          className="w-full flex items-center gap-2 h-8 px-3 rounded-lg cursor-text"
          style={{
            background: 'var(--surface-2, var(--bg-subtle))',
            border: '1px solid var(--border)',
            outline: 'none',          // prevent label from getting its own focus ring
            transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
          }}
          onFocus={(e) => {
            (e.currentTarget as HTMLLabelElement).style.borderColor = 'var(--accent-border)';
            (e.currentTarget as HTMLLabelElement).style.boxShadow = '0 0 0 3px rgba(240,184,200,0.10)';
          }}
          onBlur={(e) => {
            (e.currentTarget as HTMLLabelElement).style.borderColor = 'var(--border)';
            (e.currentTarget as HTMLLabelElement).style.boxShadow = 'none';
          }}
        >
          <Search className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--fg-3)' }} strokeWidth={1.75} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your repurposed content..."
            className="flex-1 bg-transparent outline-none text-[13px] min-w-0"
            style={{ color: 'var(--fg-2)', caretColor: 'var(--accent)' }}
          />
          <kbd
            className="hidden sm:flex items-center gap-0.5 text-[10px] font-medium shrink-0"
            style={{ color: 'var(--fg-4)' }}
          >
            <span>⌘</span><span>K</span>
          </kbd>
        </label>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1">

        {/* ── Bell ── */}
        <div ref={bellRef} className="relative">
          <IconButton
            aria-label="Notifications"
            active={bellOpen}
            onClick={() => { setBellOpen((o) => !o); setProfileOpen(false); }}
          >
            <Bell className="w-4 h-4" strokeWidth={1.75} />
          </IconButton>

          {bellOpen && (
            <Dropdown align="right" width={260}>
              <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <p className="text-[12px] font-semibold" style={{ color: 'var(--fg)' }}>Notifications</p>
              </div>
              <div className="flex flex-col items-center justify-center py-8 px-4 gap-2">
                <Bell className="w-6 h-6 opacity-20" style={{ color: 'var(--fg-3)' }} strokeWidth={1.5} />
                <p className="text-[13px]" style={{ color: 'var(--fg-3)' }}>No new notifications</p>
              </div>
            </Dropdown>
          )}
        </div>

        {/* ── Profile avatar ── */}
        <div ref={profileRef} className="relative ml-0.5">
          <button
            onClick={() => { setProfileOpen((o) => !o); setBellOpen(false); }}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold select-none cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, rgba(240,184,200,0.45) 0%, #52525b 100%)',
              color: '#f4f4f5',
              transition: 'opacity 0.15s ease, box-shadow 0.15s ease',
              boxShadow: profileOpen ? '0 0 0 2px var(--accent-border)' : 'none',
            }}
            aria-label="Profile"
            aria-expanded={profileOpen}
          >
            {initials}
          </button>

          {profileOpen && (
            <Dropdown align="right" width={220}>
              {/* User info */}
              <div className="px-4 py-3.5" style={{ borderBottom: '1px solid var(--border)' }}>
                <p className="text-[13px] font-semibold truncate" style={{ color: 'var(--fg)' }}>
                  {displayName}
                </p>
                <p className="text-[12px] truncate mt-0.5" style={{ color: 'var(--fg-3)' }}>
                  {user?.email}
                </p>
              </div>

              {/* Menu items */}
              <div className="py-1">
                <DropdownItem
                  icon={<User className="w-3.5 h-3.5" strokeWidth={1.75} />}
                  label="Profile"
                  onClick={() => setProfileOpen(false)}
                />
                <div style={{ height: 1, margin: '4px 12px', background: 'var(--border)' }} />
                <DropdownItem
                  icon={<LogOut className="w-3.5 h-3.5" strokeWidth={1.75} />}
                  label="Log out"
                  onClick={handleLogout}
                  danger
                />
              </div>
            </Dropdown>
          )}
        </div>
      </div>
    </header>
  );
}

/* ─── Shared dropdown shell ─────────────────────────────────── */

function Dropdown({
  children,
  align = 'right',
  width = 200,
}: {
  children: React.ReactNode;
  align?: 'left' | 'right';
  width?: number;
}) {
  return (
    <div
      className="absolute top-full mt-2 z-50 rounded-xl overflow-hidden"
      style={{
        width,
        [align]: 0,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.12)',
      }}
    >
      {children}
    </div>
  );
}

function DropdownItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] cursor-pointer text-left"
      style={{
        color: danger ? '#f87171' : 'var(--fg-2)',
        transition: 'background 0.12s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = danger ? 'rgba(239,68,68,0.07)' : 'var(--border)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      {icon}
      {label}
    </button>
  );
}

/* ─── Icon button ────────────────────────────────────────────── */

function IconButton({
  children,
  'aria-label': label,
  onClick,
  active,
}: {
  children: React.ReactNode;
  'aria-label': string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="w-8 h-8 flex items-center justify-center rounded-md cursor-pointer"
      style={{
        color: active ? 'var(--fg-2)' : 'var(--fg-3)',
        background: active ? 'var(--border)' : 'transparent',
        transition: 'background 0.15s ease, color 0.15s ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = 'var(--border)';
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--fg-2)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = active ? 'var(--border)' : 'transparent';
        (e.currentTarget as HTMLButtonElement).style.color = active ? 'var(--fg-2)' : 'var(--fg-3)';
      }}
    >
      {children}
    </button>
  );
}
