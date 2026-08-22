'use client';

import { useState } from 'react';
import { ArrowRight, Loader2, LayoutGrid, AlertCircle } from 'lucide-react';
import { ContentInput } from '@/components/content-input';
import { FormatSelector } from '@/components/format-selector';
import { ToneSelector } from '@/components/tone-selector';
import { ResultsSection } from '@/components/results-section';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { HeroDecoration } from '@/components/hero-decoration';
import type { RepurposeResult, RepurposeResponse } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function Home() {
  const [content, setContent]               = useState('');
  const [selectedFormats, setSelectedFormats] = useState<string[]>(['x-post', 'x-thread']);
  const [selectedTone, setSelectedTone]     = useState('casual');
  const [isGenerating, setIsGenerating]     = useState(false);
  const [results, setResults]               = useState<RepurposeResult[]>([]);
  const [historyId, setHistoryId]           = useState<string | undefined>();
  const [error, setError]                   = useState<string | null>(null);

  const hasResults = results.length > 0;

  const toggleFormat = (id: string) =>
    setSelectedFormats((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );

  const handleGenerate = async () => {
    if (!content.trim() || selectedFormats.length === 0 || isGenerating) return;

    setIsGenerating(true);
    setError(null);
    setResults([]);
    setHistoryId(undefined);

    try {
      const res = await fetch('/api/repurpose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim(),
          formats: selectedFormats,
          tone: selectedTone,
        }),
      });

      const data = (await res.json()) as RepurposeResponse;

      if (!res.ok || data.error) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }

      setResults(data.results ?? []);
      setHistoryId(data.historyId);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewRepurpose = () => {
    setContent('');
    setResults([]);
    setHistoryId(undefined);
    setError(null);
    setSelectedFormats(['x-post', 'x-thread']);
    setSelectedTone('casual');
  };

  const canGenerate = content.trim().length > 0 && selectedFormats.length > 0 && !isGenerating;

  return (
    <div className="w-full px-5 sm:px-8 lg:px-12 py-8 pb-24 space-y-8 max-w-[1300px] mx-auto">

      {/* ─── Hero ─── */}
      <div className="flex items-start justify-between gap-8 pt-2">
        <div className="flex-1 min-w-0 space-y-3">
          <h1
            className="text-[28px] sm:text-[34px] lg:text-[38px] font-semibold tracking-[-0.025em] leading-[1.15]"
            style={{ color: 'var(--fg)' }}
          >
            Turn one idea into
            <br />
            content{' '}
            <span style={{ color: 'var(--accent)' }}>everywhere.</span>
          </h1>
          <p className="text-[14px] leading-[1.7] max-w-[380px]" style={{ color: 'var(--fg-3)' }}>
            Paste anything — a thought, a thread, an article — and get it repurposed for every platform instantly.
          </p>
        </div>
        <HeroDecoration />
      </div>

      {/* ─── Divider ─── */}
      <div style={{ height: 1, background: 'var(--border)' }} />

      {/* ─── Input ─── */}
      <ContentInput value={content} onChange={setContent} />

      {/* ─── Formats ─── */}
      <div className="space-y-3">
        <SectionLabel>Repurpose into</SectionLabel>
        <FormatSelector selected={selectedFormats} onToggle={toggleFormat} />
        {selectedFormats.length === 0 && (
          <p className="text-[12px]" style={{ color: 'rgba(245,158,11,0.8)' }}>
            Select at least one format to continue.
          </p>
        )}
      </div>

      {/* ─── Tone ─── */}
      <div className="space-y-3">
        <SectionLabel>Tone</SectionLabel>
        <ToneSelector selected={selectedTone} onSelect={setSelectedTone} />
      </div>

      {/* ─── Generate button ─── */}
      <button
        onClick={handleGenerate}
        disabled={!canGenerate}
        className={cn(
          'flex items-center justify-center gap-2',
          'w-full h-11 rounded-xl text-[13.5px] font-semibold',
          'focus:outline-none btn-accent',
          !canGenerate && 'opacity-50 pointer-events-none',
        )}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
            Generating…
          </>
        ) : (
          <>
            Repurpose Content
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </>
        )}
      </button>

      {/* ─── Error ─── */}
      {error && !isGenerating && (
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

      {/* ─── Empty state ─── */}
      {!hasResults && !isGenerating && !error && (
        <EmptyState filled={content.trim().length > 0} />
      )}

      {/* ─── Loading ─── */}
      {isGenerating && (
        <LoadingSkeleton count={Math.min(selectedFormats.length, 4)} />
      )}

      {/* ─── Results ─── */}
      {hasResults && !isGenerating && (
        <ResultsSection
          results={results}
          historyId={historyId}
          originalContent={content.trim()}
          tone={selectedTone}
          onNewRepurpose={handleNewRepurpose}
        />
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[11px] font-semibold uppercase tracking-[0.09em]"
      style={{ color: 'var(--fg-4)' }}
    >
      {children}
    </p>
  );
}

function EmptyState({ filled }: { filled: boolean }) {
  return (
    <div
      className="rounded-2xl px-6 py-12 text-center"
      style={{ border: '1.5px dashed var(--border)', background: 'transparent' }}
    >
      <div
        className="mx-auto w-10 h-10 rounded-xl flex items-center justify-center mb-4"
        style={{ background: 'var(--accent-subtle)', border: '1px solid var(--accent-border)' }}
      >
        <LayoutGrid
          className="w-5 h-5"
          style={{ color: 'var(--accent)', opacity: 0.75 }}
          strokeWidth={1.5}
        />
      </div>
      <p className="text-[14px] font-semibold mb-1.5" style={{ color: 'var(--fg-2)' }}>
        {filled ? 'Ready to repurpose' : 'No output yet'}
      </p>
      <p className="text-[13px] leading-relaxed max-w-[220px] mx-auto" style={{ color: 'var(--fg-4)' }}>
        {filled
          ? 'Select your formats above and hit generate.'
          : 'Paste your content, pick formats, then generate.'}
      </p>
    </div>
  );
}
