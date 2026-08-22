'use client';

import { LayoutGrid, List } from 'lucide-react';
import { useState } from 'react';
import { OutputCard } from './output-card';
import { MOCK_OUTPUTS } from '@/lib/mock-data';

interface ResultsSectionProps {
  selectedFormats: string[];
}

const DELAY_CLASSES = [
  'fade-in-up',
  'fade-in-up-delay-1',
  'fade-in-up-delay-2',
  'fade-in-up-delay-3',
  'fade-in-up-delay-4',
  'fade-in-up-delay-5',
];

export function ResultsSection({ selectedFormats }: ResultsSectionProps) {
  const [grid, setGrid] = useState(true);
  const results = selectedFormats.map((id) => MOCK_OUTPUTS[id]).filter(Boolean);

  if (results.length === 0) return null;

  return (
    <div className="space-y-4 pt-2">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-[14px] font-semibold" style={{ color: 'var(--fg)' }}>
            Recent Output
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

        {/* View toggle */}
        <div
          className="flex items-center rounded-lg overflow-hidden"
          style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
        >
          <ViewToggle
            active={grid}
            onClick={() => setGrid(true)}
            aria-label="Grid view"
          >
            <LayoutGrid className="w-3.5 h-3.5" strokeWidth={1.75} />
          </ViewToggle>
          <ViewToggle
            active={!grid}
            onClick={() => setGrid(false)}
            aria-label="List view"
          >
            <List className="w-3.5 h-3.5" strokeWidth={1.75} />
          </ViewToggle>
        </div>
      </div>

      {/* Cards */}
      <div
        className={
          grid
            ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
            : 'flex flex-col gap-3'
        }
      >
        {results.map((result, i) => (
          <OutputCard
            key={result.id}
            type={result.type}
            platform={result.platform}
            content={result.content}
            animationClass={DELAY_CLASSES[i] ?? 'fade-in-up'}
            onRegenerate={() => {}}
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
      className="w-7 h-7 flex items-center justify-center transition-colors"
      style={{
        color: active ? 'var(--fg)' : 'var(--fg-4)',
        background: active ? 'var(--accent-subtle)' : 'transparent',
      }}
    >
      {children}
    </button>
  );
}
