'use client';

import { Search, Bell, Menu } from 'lucide-react';
import { useSearch } from '@/lib/search-context';

interface TopbarProps {
  onMobileMenuToggle: () => void;
}

export function Topbar({ onMobileMenuToggle }: TopbarProps) {
  const { query, setQuery } = useSearch();

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
            transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
          }}
          onFocus={(e) => {
            const el = e.currentTarget as HTMLLabelElement;
            el.style.borderColor = 'var(--accent-border)';
            el.style.boxShadow = '0 0 0 3px rgba(240,184,200,0.10)';
          }}
          onBlur={(e) => {
            const el = e.currentTarget as HTMLLabelElement;
            el.style.borderColor = 'var(--border)';
            el.style.boxShadow = 'none';
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
        <IconButton aria-label="Notifications" onClick={() => {}}>
          <Bell className="w-4 h-4" strokeWidth={1.75} />
        </IconButton>

        <button
          className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold ml-0.5 select-none cursor-pointer transition-opacity duration-150 hover:opacity-85"
          style={{
            background: 'linear-gradient(135deg, rgba(240,184,200,0.45) 0%, #52525b 100%)',
            color: '#f4f4f5',
          }}
          aria-label="Profile"
        >
          K
        </button>
      </div>
    </header>
  );
}

function IconButton({
  children,
  'aria-label': label,
  onClick,
}: {
  children: React.ReactNode;
  'aria-label': string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="w-8 h-8 flex items-center justify-center rounded-md cursor-pointer"
      style={{
        color: 'var(--fg-3)',
        transition: 'background 0.15s ease, color 0.15s ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = 'var(--border)';
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--fg-2)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--fg-3)';
      }}
    >
      {children}
    </button>
  );
}
