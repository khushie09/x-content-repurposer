'use client';

import { useState, useEffect, useCallback } from 'react';
import { Clock, Loader2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useSearch } from '@/lib/search-context';
import type { HistoryItem, RepurposeResult } from '@/lib/types';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const FORMAT_LABELS: Record<string, string> = {
  'x-post': 'X Post', 'x-thread': 'X Thread', 'linkedin': 'LinkedIn',
  'hooks': 'Hooks', 'caption': 'Caption', 'cta': 'CTA',
};

export default function HistoryPage() {
  const [items, setItems]     = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const { query }             = useSearch();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/history');
      if (!res.ok) throw new Error('Failed to load');
      const data = (await res.json()) as { items: HistoryItem[] };
      setItems(data.items ?? []);
    } catch {
      setError('Could not load history. Make sure the database is set up.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = query.trim()
    ? items.filter((item) =>
        item.original_content.toLowerCase().includes(query.toLowerCase()) ||
        item.selected_formats.some((f) => f.includes(query.toLowerCase()))
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
          <Clock className="w-4 h-4" style={{ color: 'var(--accent)' }} strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight" style={{ color: 'var(--fg)' }}>
            History
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--fg-3)' }}>
            All your past repurposes, newest first.
          </p>
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--border)' }} />

      {/* States */}
      {loading && (
        <div className="flex items-center gap-2 py-12 justify-center" style={{ color: 'var(--fg-3)' }}>
          <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.75} />
          <span className="text-[13px]">Loading history…</span>
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
          <Clock className="w-8 h-8 mx-auto mb-3 opacity-20" style={{ color: 'var(--fg-3)' }} strokeWidth={1.5} />
          <p className="text-[14px] font-medium" style={{ color: 'var(--fg-3)' }}>
            {query ? 'No results match your search.' : 'No history yet.'}
          </p>
          <p className="text-[13px] mt-1" style={{ color: 'var(--fg-4)' }}>
            {!query && 'Generate your first repurpose from the home page.'}
          </p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((item) => (
            <HistoryCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function HistoryCard({ item }: { item: HistoryItem }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
    >
      {/* Summary row */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-start gap-3 px-4 py-4 text-left cursor-pointer"
        style={{ transition: 'background 0.15s ease' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        <div className="flex-1 min-w-0 space-y-1.5">
          <p className="text-[13.5px] font-medium leading-snug line-clamp-2" style={{ color: 'var(--fg)' }}>
            {item.original_content}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {item.selected_formats.map((f) => (
              <span
                key={f}
                className="text-[10px] font-medium px-1.5 py-0.5 rounded-md"
                style={{
                  background: 'var(--accent-subtle)',
                  color: 'var(--accent)',
                  border: '1px solid var(--accent-border)',
                }}
              >
                {FORMAT_LABELS[f] ?? f}
              </span>
            ))}
            <span className="text-[11px]" style={{ color: 'var(--fg-4)' }}>·</span>
            <span className="text-[11px] capitalize" style={{ color: 'var(--fg-4)' }}>{item.tone}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11.5px] tabular-nums" style={{ color: 'var(--fg-4)' }}>
            {timeAgo(item.created_at)}
          </span>
          {expanded
            ? <ChevronUp className="w-3.5 h-3.5" style={{ color: 'var(--fg-4)' }} strokeWidth={1.75} />
            : <ChevronDown className="w-3.5 h-3.5" style={{ color: 'var(--fg-4)' }} strokeWidth={1.75} />
          }
        </div>
      </button>

      {/* Expanded outputs */}
      {expanded && (
        <div style={{ borderTop: '1px solid var(--border)' }}>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {(item.generated_results as RepurposeResult[]).map((r) => (
              <div
                key={r.id}
                className="rounded-xl p-3 space-y-2"
                style={{
                  background: 'var(--bg-subtle, var(--bg))',
                  border: '1px solid var(--border)',
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold" style={{ color: 'var(--fg-2)' }}>{r.platform}</span>
                  <span
                    className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                    style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}
                  >
                    {r.type}
                  </span>
                </div>
                <p className="text-[12.5px] leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--fg-3)' }}>
                  {r.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
