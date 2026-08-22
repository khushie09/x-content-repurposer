'use client';

import { Search, Sun, Moon, Bell, Menu } from 'lucide-react';

interface TopbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onMobileMenuToggle: () => void;
}

export function Topbar({ isDark, onToggleTheme, onMobileMenuToggle }: TopbarProps) {
  return (
    <header
      className="h-12 flex items-center justify-between px-4 gap-3 shrink-0 sticky top-0 z-30 backdrop-blur-md"
      style={{
        borderBottom: '1px solid var(--border)',
        background: 'rgba(var(--bg-rgb, 247 246 244) / 0.92)',
        backgroundColor: 'color-mix(in srgb, var(--bg) 90%, transparent)',
      }}
    >
      {/* Mobile hamburger */}
      <button
        onClick={onMobileMenuToggle}
        className="lg:hidden w-8 h-8 flex items-center justify-center rounded-md transition-colors hover:bg-[var(--border)]"
        style={{ color: 'var(--fg-3)' }}
        aria-label="Open menu"
      >
        <Menu className="w-4 h-4" strokeWidth={1.75} />
      </button>

      {/* Search — takes up center space */}
      <div className="flex-1 flex items-center max-w-xl mx-auto">
        <div
          className="w-full flex items-center gap-2 h-8 px-3 rounded-lg transition-all cursor-text"
          style={{
            background: 'var(--surface-2, var(--bg-subtle))',
            border: '1px solid var(--border)',
          }}
          role="button"
          tabIndex={0}
          aria-label="Search"
          onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent-border)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
        >
          <Search className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--fg-3)' }} strokeWidth={1.75} />
          <input
            type="text"
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
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1">
        <IconButton
          aria-label="Notifications"
          onClick={() => {}}
        >
          <Bell className="w-4 h-4" strokeWidth={1.75} />
        </IconButton>

        <IconButton
          aria-label={isDark ? 'Light mode' : 'Dark mode'}
          onClick={onToggleTheme}
        >
          {isDark
            ? <Sun className="w-4 h-4" strokeWidth={1.75} />
            : <Moon className="w-4 h-4" strokeWidth={1.75} />}
        </IconButton>

        {/* Avatar */}
        <button
          className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold ml-0.5 select-none"
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
      className="w-8 h-8 flex items-center justify-center rounded-md transition-colors hover:bg-[var(--border)]"
      style={{ color: 'var(--fg-3)' }}
    >
      {children}
    </button>
  );
}
