'use client';

import { useState } from 'react';
import { Copy, Bookmark, RefreshCw, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OutputCardProps {
  type: string;
  platform: string;
  content: string;
  animationClass?: string;
  onRegenerate?: () => void;
}

export function OutputCard({
  type,
  platform,
  content,
  animationClass = 'fade-in-up',
  onRegenerate,
}: OutputCardProps) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved]   = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* unavailable */ }
  };

  return (
    <div
      className={cn('rounded-2xl overflow-hidden flex flex-col transition-shadow duration-150', animationClass)}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          '0 4px 16px rgba(0,0,0,0.09)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[12.5px] font-semibold truncate" style={{ color: 'var(--fg)' }}>
            {platform}
          </span>
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 rounded-md shrink-0"
            style={{
              background: 'var(--accent-subtle)',
              color: 'var(--accent)',
              border: '1px solid var(--accent-border)',
            }}
          >
            {type}
          </span>
        </div>
        <span className="text-[11px] tabular-nums shrink-0" style={{ color: 'var(--fg-4)' }}>
          {content.length} chars
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4">
        <p
          className="text-[13px] leading-[1.75] whitespace-pre-wrap"
          style={{ color: 'var(--fg-2)' }}
        >
          {content}
        </p>
      </div>

      {/* Actions */}
      <div
        className="flex items-center gap-0.5 px-3 py-2.5 shrink-0"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <CardAction
          onClick={handleCopy}
          icon={
            copied
              ? <Check className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2.5} />
              : <Copy className="w-3.5 h-3.5" strokeWidth={1.75} />
          }
          label={copied ? 'Copied' : 'Copy'}
          activeColor={copied ? 'emerald' : undefined}
        />

        <CardAction
          onClick={() => setSaved((s) => !s)}
          icon={
            <Bookmark
              className="w-3.5 h-3.5 transition-all"
              style={saved ? { fill: 'var(--accent)', color: 'var(--accent)' } : undefined}
              strokeWidth={1.75}
            />
          }
          label={saved ? 'Saved' : 'Save'}
          activeColor={saved ? 'accent' : undefined}
        />

        <div className="flex-1" />

        <CardAction
          onClick={onRegenerate}
          icon={<RefreshCw className="w-3.5 h-3.5" strokeWidth={1.75} />}
          label="Regenerate"
        />
      </div>
    </div>
  );
}

function CardAction({
  onClick,
  icon,
  label,
  activeColor,
}: {
  onClick?: () => void;
  icon: React.ReactNode;
  label: string;
  activeColor?: 'accent' | 'emerald';
}) {
  const activeBg =
    activeColor === 'accent' ? 'var(--accent-subtle)' :
    activeColor === 'emerald' ? 'rgba(16,185,129,0.08)' : undefined;

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-[12px] px-2.5 py-1.5 rounded-lg transition-colors focus:outline-none hover:bg-(--border)"
      style={{
        color: activeColor === 'accent' ? 'var(--accent)' : 'var(--fg-3)',
        background: activeBg,
      }}
    >
      {icon}
      {label}
    </button>
  );
}
