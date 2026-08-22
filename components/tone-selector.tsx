'use client';

const TONES = [
  { id: 'casual',       label: 'Casual'       },
  { id: 'professional', label: 'Professional' },
  { id: 'educational',  label: 'Educational'  },
  { id: 'storytelling', label: 'Storytelling' },
  { id: 'bold',         label: 'Bold'         },
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
            className="px-4 py-1.5 rounded-full text-[13px] transition-all duration-150 focus:outline-none"
            style={
              isSelected
                ? {
                    background: 'var(--accent)',
                    color: 'var(--accent-fg)',
                    border: '1px solid var(--accent)',
                    fontWeight: 600,
                  }
                : {
                    background: 'transparent',
                    color: 'var(--fg-3)',
                    border: '1px solid var(--border-strong)',
                  }
            }
            onMouseEnter={(e) => {
              if (!isSelected)
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--fg-2)';
            }}
            onMouseLeave={(e) => {
              if (!isSelected)
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--fg-3)';
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
