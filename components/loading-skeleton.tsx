export function LoadingSkeleton({ count = 3 }: { count?: number }) {
  const clamped = Math.min(count, 6);
  return (
    <div className="space-y-4 pt-2">
      {/* Header skeleton */}
      <div className="flex items-center gap-3">
        <div className="h-4 w-28 rounded-lg shimmer" />
        <div className="h-4 w-6 rounded-full shimmer" />
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: clamped }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
    >
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2">
          <div className="h-3.5 w-24 rounded-md shimmer" />
          <div className="h-3.5 w-10 rounded-md shimmer" />
        </div>
        <div className="h-3 w-14 rounded-md shimmer" />
      </div>

      <div className="px-4 py-4 space-y-2.5">
        <div className="h-3 w-full rounded-md shimmer" />
        <div className="h-3 w-11/12 rounded-md shimmer" />
        <div className="h-3 w-3/4 rounded-md shimmer" />
        <div className="h-3 w-4/5 rounded-md shimmer" />
        <div className="h-3 w-1/2 rounded-md shimmer" />
      </div>

      <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="h-3 w-12 rounded-md shimmer" />
        <div className="h-3 w-12 rounded-md shimmer" />
      </div>
    </div>
  );
}
