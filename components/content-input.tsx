'use client';

import { X, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';

const MAX_CHARS = 5000;

interface ContentInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function ContentInput({ value, onChange }: ContentInputProps) {
  const charCount = value.length;
  const pct = charCount / MAX_CHARS;
  const isNearLimit = pct > 0.85;
  const isAtLimit    = pct >= 1;

  return (
    <div
      className="rounded-2xl overflow-hidden transition-shadow duration-200"
      style={{
        border: '1px solid var(--border)',
        background: 'var(--surface)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
      onFocusCapture={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          '0 0 0 2px rgba(240,184,200,0.22), 0 1px 3px rgba(0,0,0,0.04)';
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent-border)';
      }}
      onBlurCapture={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
      }}
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your post, thread, article, notes or idea..."
        maxLength={MAX_CHARS}
        className="w-full resize-none bg-transparent outline-none font-[inherit] text-[14px] leading-[1.75]"
        style={{
          minHeight: 200,
          padding: '18px 20px 12px',
          color: 'var(--fg)',
        }}
        aria-label="Content input"
      />

      {/* Footer toolbar */}
      <div
        className="flex items-center justify-between px-4 py-2.5 gap-3"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-3">
          {/* Attachment icon */}
          <button
            type="button"
            className="flex items-center justify-center w-7 h-7 rounded-md transition-colors hover:bg-(--border)"
            style={{ color: 'var(--fg-4)' }}
            aria-label="Attach file"
          >
            <Paperclip className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>

          {/* Char count */}
          <span
            className={cn('text-[12px] tabular-nums transition-colors', !isNearLimit && !isAtLimit && 'opacity-60')}
            style={{
              color: isAtLimit ? '#ef4444' : isNearLimit ? '#f59e0b' : 'var(--fg-3)',
            }}
          >
            {charCount.toLocaleString()}
            <span style={{ color: 'var(--fg-4)' }}> / {MAX_CHARS.toLocaleString()}</span>
          </span>
        </div>

        {/* Clear */}
        {charCount > 0 && (
          <button
            onClick={() => onChange('')}
            className="flex items-center gap-1 text-[12px] px-2 py-1 rounded-md transition-colors hover:bg-(--border)"
            style={{ color: 'var(--fg-3)' }}
            aria-label="Clear"
          >
            <X className="w-3 h-3" strokeWidth={2} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
