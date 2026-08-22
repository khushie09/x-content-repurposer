'use client';

const TONES = [
  { id: 'casual',        label: 'Casual'        },
  { id: 'professional',  label: 'Professional'  },
  { id: 'educational',   label: 'Educational'   },
  { id: 'storytelling',  label: 'Storytelling'  },
  { id: 'bold',          label: 'Bold'          },
];

interface ToneSelectorProps {
  selected: string;
  onSelect: (id: string) => void;
}

export function ToneSelector({ selected, onSelect }: ToneSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Select tone">
      {TONES.map(({ id, label }) => {
        const isSelected = selected === id;
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className="px-4 py-1.5 rounded-full text-[13px] cursor-pointer"
            style={
              isSelected
                ? {
                    background: 'var(--accent)',
                    color: 'var(--accent-fg)',
                    border: '1px solid var(--accent)',
                    fontWeight: 600,
                    transition: 'background 0.18s ease, border-color 0.18s ease, color 0.18s ease, box-shadow 0.18s ease',
                    boxShadow: '0 1px 8px rgba(240,184,200,0.22)',
                  }
                : {
                    background: 'transparent',
                    color: 'var(--fg-3)',
                    border: '1px solid var(--border-strong)',
                    transition: 'background 0.18s ease, border-color 0.18s ease, color 0.18s ease',
                  }
            }
            onMouseEnter={(e) => {
              if (!isSelected) {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.color = 'var(--fg)';
                el.style.borderColor = 'var(--fg-4)';
                el.style.background = 'var(--surface)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.color = 'var(--fg-3)';
                el.style.borderColor = 'var(--border-strong)';
                el.style.background = 'transparent';
              }
            }}
            aria-pressed={isSelected}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
