'use client';

import { LayoutGrid, List, Plus } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { OutputCard } from './output-card';
import type { RepurposeResult } from '@/lib/types';

interface ResultsSectionProps {
  results: RepurposeResult[];
  historyId?: string;
  originalContent?: string;
  tone?: string;
  onNewRepurpose?: () => void;
}

const DELAY_CLASSES = [
  'fade-in-up',
  'fade-in-up-delay-1',
  'fade-in-up-delay-2',
  'fade-in-up-delay-3',
  'fade-in-up-delay-4',
  'fade-in-up-delay-5',
];

export function ResultsSection({
  results: initialResults,
  historyId,
  originalContent,
  tone,
  onNewRepurpose,
}: ResultsSectionProps) {
  const [results, setResults] = useState<RepurposeResult[]>(initialResults);
  const [grid, setGrid]       = useState(true);
  const router = useRouter();

  if (results.length === 0) return null;

  const handleRegenerated = (index: number, updated: RepurposeResult) => {
    setResults((prev) => prev.map((r, i) => (i === index ? updated : r)));
  };

  return (
    <div className="space-y-4 pt-2">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-[14px] font-semibold" style={{ color: 'var(--fg)' }}>
            Generated Output
          </h2>
          <span
            className="text-[11px] font-medium px-2 py-0.5 rounded-full"
            style={{
              background: 'var(--accent-subtle)',
              color: 'var(--accent)',
              border: '1px solid var(--accent-border)',
            }}
          >
            {results.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* New Repurpose */}
          {onNewRepurpose && (
            <button
              onClick={() => {
                onNewRepurpose();
                router.push('/');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium cursor-pointer"
              style={{
                color: 'var(--fg-3)',
                border: '1px solid var(--border)',
                transition: 'background 0.15s ease, color 0.15s ease, border-color 0.15s ease',
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
              <Plus className="w-3.5 h-3.5" strokeWidth={2} />
              New
            </button>
          )}

          {/* View toggle */}
          <div
            className="flex items-center rounded-lg overflow-hidden"
            style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
          >
            <ViewToggle active={grid} onClick={() => setGrid(true)} aria-label="Grid view">
              <LayoutGrid className="w-3.5 h-3.5" strokeWidth={1.75} />
            </ViewToggle>
            <ViewToggle active={!grid} onClick={() => setGrid(false)} aria-label="List view">
              <List className="w-3.5 h-3.5" strokeWidth={1.75} />
            </ViewToggle>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className={grid ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'flex flex-col gap-3'}>
        {results.map((result, i) => (
          <OutputCard
            key={result.id}
            result={result}
            historyId={historyId}
            originalContent={originalContent}
            tone={tone}
            animationClass={DELAY_CLASSES[i] ?? 'fade-in-up'}
            onRegenerate={(updated) => handleRegenerated(i, updated)}
          />
        ))}
      </div>
    </div>
  );
}

function ViewToggle({
  children,
  active,
  onClick,
  'aria-label': label,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  'aria-label': string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className="w-7 h-7 flex items-center justify-center cursor-pointer"
      style={{
        color: active ? 'var(--fg)' : 'var(--fg-4)',
        background: active ? 'var(--accent-subtle)' : 'transparent',
        transition: 'background 0.15s ease, color 0.15s ease',
      }}
    >
      {children}
    </button>
  );
}
