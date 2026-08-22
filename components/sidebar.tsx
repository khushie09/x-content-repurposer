'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Plus, Clock, Bookmark, LayoutTemplate, Settings,
  PanelLeftClose, ChevronDown, Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
        boxShadow: '0 1px 6px rgba(240,184,200,0.30)',
      }}
    >
      R
    </div>
  );
}

/* ─── Nav data ──────────────────────────────────────────────── */

const NAV_ITEMS = [
  { label: 'New Repurpose', href: '/', icon: Plus,          active: true  },
  { label: 'History',       href: '#', icon: Clock,         active: false },
  { label: 'Saved',         href: '#', icon: Bookmark,      active: false },
  { label: 'Templates',     href: '#', icon: LayoutTemplate, active: false },
  { label: 'Settings',      href: '#', icon: Settings,      active: false },
];

const RECENT_ITEMS = [
  { label: 'Thread on content depth', time: '2h' },
  { label: 'Personal branding post',  time: '1d' },
  { label: 'LinkedIn carousel ideas', time: '3d' },
];

/* ─── Sidebar ───────────────────────────────────────────────── */

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile scrim */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 h-full z-50 flex flex-col shrink-0',
          'transition-[width,transform,visibility] duration-200 ease-in-out',
          'border-r overflow-hidden',
          /* Desktop collapse */
          collapsed ? 'lg:w-[60px]' : 'lg:w-[228px]',
          /* Mobile drawer */
          'w-[228px]',
          'lg:relative lg:translate-x-0 lg:z-auto',
          mobileOpen
            ? 'translate-x-0 visible'
            : '-translate-x-full invisible lg:translate-x-0 lg:visible',
        )}
        style={{
          background: 'var(--sidebar-bg)',
          borderColor: 'var(--sidebar-border)',
        }}
      >
        {/* ── Header ── */}
        <div
          className="h-12 flex items-center shrink-0 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          {collapsed ? (
            /* Collapsed: RMark centered, clicking it expands — desktop only */
            <button
              onClick={() => setCollapsed(false)}
              className="hidden lg:flex w-full h-full items-center justify-center rounded-none transition-colors hover:bg-[var(--border)]"
              aria-label="Expand sidebar"
            >
              <RMark size={26} />
            </button>
          ) : (
            /* Expanded: logo left, collapse button right */
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

              {/* Collapse toggle — desktop only */}
              <button
                onClick={() => setCollapsed(true)}
                className="hidden lg:flex items-center justify-center w-6 h-6 rounded-md transition-colors shrink-0 hover:bg-[var(--border)]"
                style={{ color: 'var(--fg-3)' }}
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>
            </div>
          )}
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {NAV_ITEMS.map(({ label, href, icon: Icon, active }) => (
            <Link
              key={label}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                'flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13px] font-medium transition-colors group relative',
                collapsed && 'lg:justify-center lg:px-0',
                active
                  ? 'text-[var(--fg)]'
                  : 'hover:bg-[var(--border)] text-[var(--fg-3)] hover:text-[var(--fg-2)]',
              )}
              style={active ? { background: 'var(--accent-subtle)' } : undefined}
              onClick={onMobileClose}
            >
              <Icon
                className="w-4 h-4 shrink-0"
                style={{ color: active ? 'var(--accent)' : undefined }}
                strokeWidth={active ? 2 : 1.75}
              />
              {!collapsed && (
                <span className="truncate">{label}</span>
              )}
              {active && !collapsed && (
                <span
                  className="ml-auto w-1 h-1 rounded-full shrink-0"
                  style={{ background: 'var(--accent)' }}
                />
              )}
            </Link>
          ))}

          {/* Recent */}
          {!collapsed && (
            <>
              <div className="pt-4 pb-1 px-2.5">
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.09em]"
                  style={{ color: 'var(--fg-4)' }}
                >
                  Recent
                </p>
              </div>
              {RECENT_ITEMS.map(({ label, time }) => (
                <button
                  key={label}
                  className="w-full flex items-center justify-between gap-2 px-2.5 py-[7px] rounded-lg text-[12.5px] transition-colors text-left hover:bg-[var(--border)]"
                  style={{ color: 'var(--fg-3)' }}
                >
                  <span className="truncate">{label}</span>
                  <span className="shrink-0 text-[11px]" style={{ color: 'var(--fg-4)' }}>{time}</span>
                </button>
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
                className="w-full py-1.5 rounded-lg text-[11.5px] font-semibold transition-colors"
                style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        ) : (
          <div className="p-2 flex justify-center shrink-0">
            <button
              title="Upgrade to Pro"
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--border)]"
              style={{ color: 'var(--accent)' }}
            >
              <Zap className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        )}

        {/* ── User profile ── */}
        <div
          className="p-2 shrink-0 border-t"
          style={{ borderColor: 'var(--border)' }}
        >
          {!collapsed ? (
            <button
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors hover:bg-[var(--border)] group"
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
