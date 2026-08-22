'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Plus, Clock, Bookmark,
  PanelLeftClose, ChevronDown, Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { HistoryItem } from '@/lib/types';

/* ─── Brand mark ────────────────────────────────────────────── */

function RMark({ size = 24 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center shrink-0 font-semibold text-white select-none"
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.28),
        background: 'var(--accent)',
        fontSize: Math.round(size * 0.52),
        letterSpacing: '-0.02em',
        boxShadow: '0 1px 6px rgba(240,184,200,0.28)',
      }}
    >
      R
    </div>
  );
}

/* ─── Nav data ──────────────────────────────────────────────── */

const NAV_ITEMS = [
  { label: 'New Repurpose', href: '/',        icon: Plus     },
  { label: 'History',       href: '/history', icon: Clock    },
  { label: 'Saved',         href: '/saved',   icon: Bookmark },
];

/* ─── Sidebar ───────────────────────────────────────────────── */

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'now';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed]     = useState(false);
  const [recent, setRecent]           = useState<HistoryItem[]>([]);
  const pathname = usePathname();

  const loadRecent = useCallback(async () => {
    try {
      const res = await fetch('/api/history');
      if (!res.ok) return;
      const data = await res.json() as { items?: HistoryItem[] };
      setRecent((data.items ?? []).slice(0, 5));
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    loadRecent();
  }, [loadRecent, pathname]); // reload on route change so sidebar stays fresh

  return (
    <>
      {/* Mobile scrim */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 h-full z-50 flex flex-col shrink-0',
          'border-r overflow-hidden',
          collapsed ? 'lg:w-[60px]' : 'lg:w-[228px]',
          'w-[228px]',
          'lg:relative lg:translate-x-0 lg:z-auto',
          mobileOpen
            ? 'translate-x-0 visible'
            : '-translate-x-full invisible lg:translate-x-0 lg:visible',
        )}
        style={{
          background: 'var(--sidebar-bg)',
          borderColor: 'var(--sidebar-border)',
          transition: 'width 0.22s cubic-bezier(0.4,0,0.2,1), transform 0.22s cubic-bezier(0.4,0,0.2,1), visibility 0.22s',
        }}
      >
        {/* ── Header ── */}
        <div
          className="h-12 flex items-center shrink-0 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          {collapsed ? (
            <button
              onClick={() => setCollapsed(false)}
              className="hidden lg:flex w-full h-full items-center justify-center cursor-pointer"
              style={{ transition: 'background 0.15s ease' }}
              aria-label="Expand sidebar"
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--border)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <RMark size={26} />
            </button>
          ) : (
            <div className="flex items-center justify-between w-full px-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <RMark size={26} />
                <span
                  className="text-[13.5px] font-semibold tracking-tight whitespace-nowrap"
                  style={{ color: 'var(--fg)' }}
                >
                  Repurpose
                </span>
              </div>
              <button
                onClick={() => setCollapsed(true)}
                className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md cursor-pointer shrink-0"
                style={{
                  color: 'var(--fg-4)',
                  transition: 'background 0.15s ease, color 0.15s ease',
                }}
                aria-label="Collapse sidebar"
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--border)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--fg-2)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--fg-4)';
                }}
              >
                <PanelLeftClose className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>
            </div>
          )}
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                title={collapsed ? label : undefined}
                className={cn(
                  'flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13px] font-medium group relative cursor-pointer',
                  collapsed && 'lg:justify-center lg:px-0',
                )}
                style={{
                  color: active ? 'var(--fg)' : 'var(--fg-3)',
                  background: active ? 'var(--accent-subtle)' : 'transparent',
                  transition: 'background 0.15s ease, color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'var(--border)';
                    (e.currentTarget as HTMLAnchorElement).style.color = 'var(--fg-2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                    (e.currentTarget as HTMLAnchorElement).style.color = 'var(--fg-3)';
                  }
                }}
                onClick={onMobileClose}
              >
                <Icon
                  className="w-4 h-4 shrink-0"
                  style={{
                    color: active ? 'var(--accent)' : 'inherit',
                    transition: 'color 0.15s ease',
                  }}
                  strokeWidth={active ? 2 : 1.75}
                />
                {!collapsed && <span className="truncate">{label}</span>}
                {active && !collapsed && (
                  <span
                    className="ml-auto w-1 h-1 rounded-full shrink-0"
                    style={{ background: 'var(--accent)' }}
                  />
                )}
              </Link>
            );
          })}

          {/* ── Recent history ── */}
          {!collapsed && recent.length > 0 && (
            <>
              <div className="pt-4 pb-1 px-2.5">
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.09em]"
                  style={{ color: 'var(--fg-4)' }}
                >
                  Recent
                </p>
              </div>
              {recent.map((item) => (
                <Link
                  key={item.id}
                  href={`/history`}
                  className="w-full flex items-center justify-between gap-2 px-2.5 py-[7px] rounded-lg text-[12.5px] text-left cursor-pointer"
                  style={{
                    color: 'var(--fg-3)',
                    transition: 'background 0.15s ease, color 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'var(--border)';
                    (e.currentTarget as HTMLAnchorElement).style.color = 'var(--fg-2)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                    (e.currentTarget as HTMLAnchorElement).style.color = 'var(--fg-3)';
                  }}
                  onClick={onMobileClose}
                >
                  <span className="truncate">
                    {item.original_content.slice(0, 38).trim()}
                    {item.original_content.length > 38 ? '…' : ''}
                  </span>
                  <span className="shrink-0 text-[11px]" style={{ color: 'var(--fg-4)' }}>
                    {timeAgo(item.created_at)}
                  </span>
                </Link>
              ))}
            </>
          )}
        </nav>

        {/* ── Upgrade card ── */}
        {!collapsed ? (
          <div className="p-2 shrink-0">
            <div
              className="rounded-xl p-3"
              style={{ background: 'var(--accent-subtle)', border: '1px solid var(--accent-border)' }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Zap className="w-3 h-3" style={{ color: 'var(--accent)' }} strokeWidth={2} />
                <span className="text-[12px] font-semibold" style={{ color: 'var(--fg)' }}>Free Plan</span>
              </div>
              <p className="text-[11px] mb-2.5 leading-relaxed" style={{ color: 'var(--fg-3)' }}>
                3 of 10 repurposes used this month.
              </p>
              <button
                className="w-full py-1.5 rounded-lg text-[11.5px] font-semibold cursor-pointer"
                style={{
                  background: 'var(--accent)',
                  color: 'var(--accent-fg)',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--accent)')}
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        ) : (
          <div className="p-2 flex justify-center shrink-0">
            <button
              title="Upgrade to Pro"
              className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer"
              style={{ color: 'var(--accent)', transition: 'background 0.15s ease' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-subtle)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Zap className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        )}

        {/* ── User profile ── */}
        <div className="p-2 shrink-0 border-t" style={{ borderColor: 'var(--border)' }}>
          {!collapsed ? (
            <button
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer"
              style={{ transition: 'background 0.15s ease' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--border)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Avatar />
              <div className="flex-1 min-w-0 text-left">
                <p className="text-[13px] font-medium truncate leading-none mb-0.5" style={{ color: 'var(--fg)' }}>
                  Khushi C.
                </p>
                <p className="text-[11px] leading-none" style={{ color: 'var(--fg-3)' }}>
                  Free plan
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--fg-4)' }} strokeWidth={2} />
            </button>
          ) : (
            <div className="flex justify-center">
              <Avatar />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function Avatar() {
  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 select-none"
      style={{
        background: 'linear-gradient(135deg, rgba(240,184,200,0.45) 0%, #52525b 100%)',
        color: '#f4f4f5',
      }}
    >
      K
    </div>
  );
}
