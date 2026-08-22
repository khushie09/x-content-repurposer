'use client';

import { useState } from 'react';
import { Copy, Bookmark, RefreshCw, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RepurposeResult, SavedItem } from '@/lib/types';

interface OutputCardProps {
  result: RepurposeResult;
  historyId?: string;
  originalContent?: string;
  tone?: string;
  animationClass?: string;
  onRegenerate?: (updated: RepurposeResult) => void;
  initialSavedId?: string;
}

export function OutputCard({
  result,
  historyId,
  originalContent,
  tone,
  animationClass = 'fade-in-up',
  onRegenerate,
  initialSavedId,
}: OutputCardProps) {
  const [content, setContent]         = useState(result.content);
  const [copied, setCopied]           = useState(false);
  const [savedId, setSavedId]         = useState<string | undefined>(initialSavedId);
  const [isSaving, setIsSaving]       = useState(false);
  const [isRegenerating, setIsRegen]  = useState(false);
  const [regenError, setRegenError]   = useState<string | null>(null);

  const isSaved = !!savedId;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* unavailable */ }
  };

  const handleSaveToggle = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      if (isSaved) {
        const res = await fetch(`/api/saved/${savedId}`, { method: 'DELETE' });
        if (res.ok) setSavedId(undefined);
      } else {
        const res = await fetch('/api/saved', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            history_id: historyId,
            format_id: result.id,
            type: result.type,
            platform: result.platform,
            content,
          }),
        });
        if (res.ok) {
          const data = (await res.json()) as { item: SavedItem };
          setSavedId(data.item.id);
        }
      }
    } catch { /* silent */ } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerate = async () => {
    if (isRegenerating || !originalContent) return;
    setIsRegen(true);
    setRegenError(null);
    try {
      const res = await fetch('/api/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: originalContent,
          format: result.id,
          tone: tone ?? 'casual',
        }),
      });
      const data = (await res.json()) as { result?: RepurposeResult; error?: string };
      if (!res.ok || data.error) {
        setRegenError(data.error ?? 'Regeneration failed.');
        return;
      }
      if (data.result) {
        setContent(data.result.content);
        setSavedId(undefined); // unsave since content changed
        onRegenerate?.(data.result);
      }
    } catch {
      setRegenError('Network error.');
    } finally {
      setIsRegen(false);
    }
  };

  return (
    <div
      className={cn('rounded-2xl overflow-hidden flex flex-col', animationClass)}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = '0 6px 24px rgba(0,0,0,0.18)';
        el.style.borderColor = 'var(--border-strong)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)';
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
            {result.platform}
          </span>
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 rounded-md shrink-0"
            style={{
              background: 'var(--accent-subtle)',
              color: 'var(--accent)',
              border: '1px solid var(--accent-border)',
            }}
          >
            {result.type}
          </span>
        </div>
        <span className="text-[11px] tabular-nums shrink-0" style={{ color: 'var(--fg-4)' }}>
          {content.length} chars
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4">
        {isRegenerating ? (
          <div className="flex items-center gap-2 py-4" style={{ color: 'var(--fg-3)' }}>
            <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.75} />
            <span className="text-[13px]">Regenerating…</span>
          </div>
        ) : (
          <p
            className="text-[13px] leading-[1.75] whitespace-pre-wrap"
            style={{ color: 'var(--fg-2)' }}
          >
            {content}
          </p>
        )}
        {regenError && (
          <p className="text-[12px] mt-2" style={{ color: '#f87171' }}>{regenError}</p>
        )}
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
              ? <Check className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2.5} />
              : <Copy className="w-3.5 h-3.5" strokeWidth={1.75} />
          }
          label={copied ? 'Copied' : 'Copy'}
          active={copied}
          activeColor="emerald"
        />

        <CardAction
          onClick={handleSaveToggle}
          disabled={isSaving}
          icon={
            isSaving
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={1.75} />
              : <Bookmark
                  className="w-3.5 h-3.5"
                  style={isSaved ? { fill: 'var(--accent)', color: 'var(--accent)' } : undefined}
                  strokeWidth={1.75}
                />
          }
          label={isSaving ? '…' : isSaved ? 'Saved' : 'Save'}
          active={isSaved}
          activeColor="accent"
        />

        <div className="flex-1" />

        <CardAction
          onClick={handleRegenerate}
          disabled={isRegenerating || !originalContent}
          icon={<RefreshCw className={cn('w-3.5 h-3.5', isRegenerating && 'animate-spin')} strokeWidth={1.75} />}
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
  active,
  activeColor,
  disabled,
}: {
  onClick?: () => void;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  activeColor?: 'accent' | 'emerald';
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1.5 text-[12px] px-2.5 py-1.5 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        color: active
          ? activeColor === 'accent' ? 'var(--accent)' : '#34d399'
          : 'var(--fg-3)',
        background: active
          ? activeColor === 'accent' ? 'var(--accent-subtle)' : 'rgba(52,211,153,0.08)'
          : 'transparent',
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
      {icon}
      {label}
    </button>
  );
}
