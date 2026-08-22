'use client';

export function HeroDecoration() {
  return (
    <div
      className="relative select-none pointer-events-none hidden xl:block"
      aria-hidden="true"
      style={{ width: 300, height: 210 }}
    >
      {/* Ambient pink glow */}
      <div
        className="absolute"
        style={{
          inset: '-20px',
          background: 'radial-gradient(ellipse 55% 45% at 60% 40%, rgba(240,184,200,0.14) 0%, transparent 70%)',
          filter: 'blur(10px)',
        }}
      />

      {/* SVG curved lines */}
      <svg
        className="absolute inset-0"
        width="300"
        height="210"
        viewBox="0 0 300 210"
        fill="none"
        style={{ overflow: 'visible' }}
      >
        {/* Line from R mark to first card */}
        <path
          d="M 44 22 C 90 14, 126 28, 156 44"
          stroke="var(--accent)"
          strokeWidth="1.25"
          strokeOpacity="0.38"
          strokeDasharray="3 4"
          strokeLinecap="round"
        />
        {/* Line from first card to second card */}
        <path
          d="M 274 108 C 268 135, 248 148, 218 155"
          stroke="var(--accent)"
          strokeWidth="1"
          strokeOpacity="0.22"
          strokeLinecap="round"
        />
        {/* Small dots */}
        <circle cx="44" cy="22" r="2.5" fill="var(--accent)" fillOpacity="0.35" />
        <circle cx="156" cy="44" r="2" fill="var(--accent)" fillOpacity="0.25" />
      </svg>

      {/* R mark */}
      <div
        className="absolute flex items-center justify-center font-semibold text-white"
        style={{
          top: 8,
          left: 0,
          width: 32,
          height: 32,
          borderRadius: 9,
          background: 'var(--accent)',
          fontSize: 15,
          letterSpacing: '-0.02em',
          boxShadow: '0 2px 10px rgba(240,184,200,0.35)',
        }}
      >
        R
      </div>

      {/* Mini card 1 — X Post */}
      <MiniCard
        style={{ top: 16, right: 0, width: 148 }}
        label="X Post"
        content="Clarity compounds. Frequency doesn't. Stop scheduling, start sharpening."
      />

      {/* Mini card 2 — LinkedIn */}
      <MiniCard
        style={{ bottom: 10, right: 24, width: 138 }}
        label="LinkedIn"
        content="The creators who compound go deeper than anyone expects..."
      />
    </div>
  );
}

function MiniCard({
  style,
  label,
  content,
}: {
  style: React.CSSProperties;
  label: string;
  content: string;
}) {
  return (
    <div
      className="absolute rounded-xl p-3"
      style={{
        ...style,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
      }}
    >
      <div
        className="text-[9px] font-semibold uppercase tracking-[0.08em] mb-1.5"
        style={{ color: 'var(--accent)' }}
      >
        {label}
      </div>
      <p
        className="text-[10.5px] leading-[1.55]"
        style={{ color: 'var(--fg-3)' }}
      >
        {content}
      </p>
    </div>
  );
}
