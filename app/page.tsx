'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Loader2, LayoutGrid } from 'lucide-react';
import { Sidebar } from '@/components/sidebar';
import { Topbar } from '@/components/topbar';
import { ContentInput } from '@/components/content-input';
import { FormatSelector } from '@/components/format-selector';
import { ToneSelector } from '@/components/tone-selector';
import { ResultsSection } from '@/components/results-section';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { HeroDecoration } from '@/components/hero-decoration';
import { cn } from '@/lib/utils';

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [content, setContent] = useState('');
  const [selectedFormats, setSelectedFormats] = useState<string[]>(['x-post', 'x-thread']);
  const [selectedTone, setSelectedTone] = useState('casual');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [generatedFormats, setGeneratedFormats] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('repurpose-theme');
    const dark = stored !== 'light';
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle('dark', newDark);
    localStorage.setItem('repurpose-theme', newDark ? 'dark' : 'light');
  };

  const toggleFormat = (id: string) =>
    setSelectedFormats((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );

  const handleGenerate = () => {
    if (!content.trim() || selectedFormats.length === 0 || isGenerating) return;
    setIsGenerating(true);
    setHasResults(false);
    setGeneratedFormats([]);
    setTimeout(() => {
      setIsGenerating(false);
      setHasResults(true);
      setGeneratedFormats([...selectedFormats]);
    }, 1600);
  };

  const canGenerate = content.trim().length > 0 && selectedFormats.length > 0 && !isGenerating;

  return (
    <div className="flex h-full overflow-hidden" style={{ background: 'var(--bg)' }}>
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar
          isDark={isDark}
          onToggleTheme={toggleTheme}
          onMobileMenuToggle={() => setMobileMenuOpen((o) => !o)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="w-full px-5 sm:px-8 lg:px-12 py-8 pb-24 space-y-8 max-w-[1300px] mx-auto">

            {/* ─── Hero ─── */}
            <div className="flex items-start justify-between gap-8 pt-2">
              <div className="flex-1 min-w-0 space-y-3">
                <h1 className="text-[28px] sm:text-[34px] lg:text-[38px] font-semibold tracking-[-0.025em] leading-[1.15]" style={{ color: 'var(--fg)' }}>
                  Turn one idea into
                  <br />
                  content{' '}
                  <span style={{ color: 'var(--accent)' }}>everywhere.</span>
                </h1>
                <p className="text-[14px] leading-[1.7] max-w-[380px]" style={{ color: 'var(--fg-3)' }}>
                  Paste anything — a thought, a thread, an article — and get it repurposed for every platform instantly.
                </p>
              </div>

              {/* Decorative preview — xl+ only */}
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

            {/* ─── CTA ─── */}
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className={cn(
                'flex items-center justify-center gap-2',
                'w-full h-11 rounded-xl text-[13.5px] font-semibold',
                'transition-all duration-150 focus:outline-none',
                'btn-accent',
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

            {/* ─── Empty state ─── */}
            {!hasResults && !isGenerating && (
              <EmptyState filled={content.trim().length > 0} />
            )}

            {/* ─── Loading ─── */}
            {isGenerating && (
              <LoadingSkeleton count={Math.min(selectedFormats.length, 4)} />
            )}

            {/* ─── Results ─── */}
            {hasResults && !isGenerating && (
              <ResultsSection selectedFormats={generatedFormats} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ─── Helpers ──────────────────────────────────────────────── */

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
      style={{
        border: '1.5px dashed var(--border)',
        background: 'transparent',
      }}
    >
      {/* Icon */}
      <div
        className="mx-auto w-10 h-10 rounded-xl flex items-center justify-center mb-4"
        style={{
          background: 'var(--accent-subtle)',
          border: '1px solid var(--accent-border)',
        }}
      >
        <LayoutGrid className="w-5 h-5" style={{ color: 'var(--accent)', opacity: 0.75 }} strokeWidth={1.5} />
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
