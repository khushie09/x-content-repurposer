'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bookmark, Loader2, AlertCircle, Copy, Check, Trash2 } from 'lucide-react';
import { useSearch } from '@/lib/search-context';
import type { SavedItem } from '@/lib/types';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function SavedPage() {
  const [items, setItems]     = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const { query }             = useSearch();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/saved');
      if (!res.ok) throw new Error('Failed to load');
      const data = (await res.json()) as { items: SavedItem[] };
      setItems(data.items ?? []);
    } catch {
      setError('Could not load saved items. Make sure the database is set up.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleUnsave = async (id: string) => {
    try {
      const res = await fetch(`/api/saved/${id}`, { method: 'DELETE' });
      if (res.ok) setItems((prev) => prev.filter((i) => i.id !== id));
    } catch { /* silent */ }
  };

  const filtered = query.trim()
    ? items.filter((item) =>
        item.content.toLowerCase().includes(query.toLowerCase()) ||
        item.platform.toLowerCase().includes(query.toLowerCase()) ||
        item.type.toLowerCase().includes(query.toLowerCase())
      )
    : items;

  return (
    <div className="w-full px-5 sm:px-8 lg:px-12 py-8 pb-24 max-w-[1000px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pt-2">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'var(--accent-subtle)', border: '1px solid var(--accent-border)' }}
        >
          <Bookmark className="w-4 h-4" style={{ color: 'var(--accent)' }} strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight" style={{ color: 'var(--fg)' }}>
            Saved
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--fg-3)' }}>
            Content you've bookmarked, ready to use.
          </p>
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--border)' }} />

      {/* States */}
      {loading && (
        <div className="flex items-center gap-2 py-12 justify-center" style={{ color: 'var(--fg-3)' }}>
          <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.75} />
          <span className="text-[13px]">Loading saved items…</span>
        </div>
      )}

      {error && !loading && (
        <div
          className="flex items-start gap-3 px-4 py-3.5 rounded-xl text-[13px]"
          style={{
            background: 'rgba(239,68,68,0.07)',
            border: '1px solid rgba(239,68,68,0.18)',
            color: '#f87171',
          }}
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={1.75} />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-16">
          <Bookmark className="w-8 h-8 mx-auto mb-3 opacity-20" style={{ color: 'var(--fg-3)' }} strokeWidth={1.5} />
          <p className="text-[14px] font-medium" style={{ color: 'var(--fg-3)' }}>
            {query ? 'No results match your search.' : 'Nothing saved yet.'}
          </p>
          <p className="text-[13px] mt-1" style={{ color: 'var(--fg-4)' }}>
            {!query && 'Hit the Save button on any generated card to bookmark it here.'}
          </p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <SavedCard key={item.id} item={item} onUnsave={handleUnsave} />
          ))}
        </div>
      )}
    </div>
  );
}

function SavedCard({ item, onUnsave }: { item: SavedItem; onUnsave: (id: string) => void }) {
  const [copied, setCopied] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* unavailable */ }
  };

  const handleUnsave = async () => {
    setRemoving(true);
    await onUnsave(item.id);
  };

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        opacity: removing ? 0.4 : 1,
        transition: 'opacity 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = '0 6px 24px rgba(0,0,0,0.18)';
        el.style.borderColor = 'var(--border-strong)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = '';
        el.style.borderColor = 'var(--border)';
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[12.5px] font-semibold truncate" style={{ color: 'var(--fg)' }}>
            {item.platform}
          </span>
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 rounded-md shrink-0"
            style={{
              background: 'var(--accent-subtle)',
              color: 'var(--accent)',
              border: '1px solid var(--accent-border)',
            }}
          >
            {item.type}
          </span>
        </div>
        <span className="text-[11px] tabular-nums shrink-0" style={{ color: 'var(--fg-4)' }}>
          {timeAgo(item.created_at)}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4">
        <p className="text-[13px] leading-[1.75] whitespace-pre-wrap" style={{ color: 'var(--fg-2)' }}>
          {item.content}
        </p>
      </div>

      {/* Actions */}
      <div
        className="flex items-center gap-0.5 px-3 py-2.5 shrink-0"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <ActionBtn onClick={handleCopy} active={copied} activeColor={copied ? '#34d399' : undefined}>
          {copied
            ? <Check className="w-3.5 h-3.5" strokeWidth={2.5} style={{ color: '#34d399' }} />
            : <Copy className="w-3.5 h-3.5" strokeWidth={1.75} />
          }
          {copied ? 'Copied' : 'Copy'}
        </ActionBtn>

        <div className="flex-1" />

        <ActionBtn onClick={handleUnsave} disabled={removing}>
          {removing
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={1.75} />
            : <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
          }
          Remove
        </ActionBtn>
      </div>
    </div>
  );
}

function ActionBtn({
  children,
  onClick,
  active,
  activeColor,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  activeColor?: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1.5 text-[12px] px-2.5 py-1.5 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        color: active ? activeColor ?? 'var(--fg-3)' : 'var(--fg-3)',
        background: active ? 'rgba(52,211,153,0.08)' : 'transparent',
        transition: 'background 0.15s ease, color 0.15s ease',
      }}
      onMouseEnter={(e) => {
        if (!active && !disabled) {
          (e.currentTarget as HTMLButtonElement).style.background = 'var(--border)';
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--fg-2)';
        }
      }}
      onMouseLeave={(e) => {
        if (!active && !disabled) {
          (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--fg-3)';
        }
      }}
    >
      {children}
    </button>
  );
}
