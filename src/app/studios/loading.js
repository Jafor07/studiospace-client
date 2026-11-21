import { StudioGridSkeleton } from "@/components/ui/Skeletons";

// Shown while the /studios route itself is opening
export default function StudiosLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <div className="mx-auto mb-10 space-y-3 text-center">
        <div className="skeleton mx-auto h-4 w-32" />
        <div className="skeleton mx-auto h-10 w-80 max-w-full" />
      </div>
      <div className="skeleton mb-8 h-36 w-full" />
      <StudioGridSkeleton count={6} />
    </main>
  );
}
