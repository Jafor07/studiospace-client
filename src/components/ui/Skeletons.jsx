// Grey animated placeholders shown while data is loading.

export function StudioCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-box border border-base-300 bg-base-100">
      <div className="skeleton aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-4 w-1/3" />
        <div className="skeleton h-10 w-full" />
      </div>
    </div>
  );
}

export function StudioGridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <StudioCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function RowsSkeleton({ rows = 4 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="skeleton h-28 w-full" />
      ))}
    </div>
  );
}
