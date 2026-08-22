'use client';

import {
  MessageSquare, AlignLeft, Briefcase,
  Anchor, Type, ArrowUpRight, Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const FORMATS = [
  { id: 'x-post',   label: 'X Post',   description: 'Short-form tweet',   icon: MessageSquare },
  { id: 'x-thread', label: 'X Thread', description: 'Multi-tweet series', icon: AlignLeft     },
  { id: 'linkedin', label: 'LinkedIn', description: 'Professional post',  icon: Briefcase     },
  { id: 'hooks',    label: 'Hooks',    description: 'Opening lines',      icon: Anchor        },
  { id: 'caption',  label: 'Caption',  description: 'Social captions',    icon: Type          },
  { id: 'cta',      label: 'CTA',      description: 'Call to actions',    icon: ArrowUpRight  },
];

interface FormatSelectorProps {
  selected: string[];
  onToggle: (id: string) => void;
}

export function FormatSelector({ selected, onToggle }: FormatSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {FORMATS.map(({ id, label, description, icon: Icon }) => {
        const isSelected = selected.includes(id);
        return (
          <button
            key={id}
            onClick={() => onToggle(id)}
            className={cn(
              'relative flex items-start gap-3 p-3.5 rounded-xl text-left',
              'transition-all duration-150 focus:outline-none group',
            )}
            style={{
              background: isSelected ? 'var(--accent-subtle)' : 'var(--surface)',
              border: `1px solid ${isSelected ? 'var(--accent-border)' : 'var(--border)'}`,
              boxShadow: isSelected
                ? '0 0 0 1px var(--accent-border)'
                : 'none',
            }}
            aria-pressed={isSelected}
            onMouseEnter={(e) => {
              if (!isSelected)
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-strong)';
            }}
            onMouseLeave={(e) => {
              if (!isSelected)
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
            }}
          >
            {/* Checkmark indicator */}
            {isSelected && (
              <div
                className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: 'var(--accent)' }}
              >
                <Check className="w-2.5 h-2.5" style={{ color: 'var(--accent-fg)' }} strokeWidth={2.5} />
              </div>
            )}

            <Icon
              className="w-4 h-4 shrink-0 mt-0.5 transition-colors"
              style={{ color: isSelected ? 'var(--accent)' : 'var(--fg-3)' }}
              strokeWidth={1.75}
            />
            <div className="min-w-0">
              <p
                className="text-[13px] font-medium leading-none mb-1.5"
                style={{ color: isSelected ? 'var(--fg)' : 'var(--fg-2)' }}
              >
                {label}
              </p>
              <p
                className="text-[11px] leading-none"
                style={{ color: isSelected ? 'var(--fg-3)' : 'var(--fg-4)' }}
              >
                {description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
