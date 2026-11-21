import { Suspense } from "react";
import { LuSearchX, LuServerOff } from "react-icons/lu";
import { apiGet } from "@/app/lib/api";
import StudioCard from "@/components/studios/StudioCard";
import StudiosFilters from "@/components/studios/StudiosFilters";
import EmptyState from "@/components/ui/EmptyState";
import SectionHeading from "@/components/ui/SectionHeading";
import { StudioGridSkeleton } from "@/components/ui/Skeletons";

export const metadata = { title: "Explore Studios" };

const pick = (value) => (typeof value === "string" ? value : "");

export default async function StudiosPage({ searchParams }) {
  const params = await searchParams;
  const filters = {
    category: pick(params.category),
    search: pick(params.search),
    sort: pick(params.sort) || "newest",
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <SectionHeading
        eyebrow="Explore studios"
        title="Find a space that fits your project"
        subtitle="Filter by category, search by city or name, and sort by price or rating."
      />
      <StudiosFilters initial={filters} />
      {/* The key makes the skeleton appear again every time a filter changes */}
      <Suspense key={JSON.stringify(filters)} fallback={<StudioGridSkeleton count={6} />}>
        <StudioResults filters={filters} />
      </Suspense>
    </main>
  );
}

async function StudioResults({ filters }) {
  const query = new URLSearchParams();
  if (filters.category) query.set("category", filters.category);
  if (filters.search) query.set("search", filters.search);
  if (filters.sort) query.set("sort", filters.sort);

  const { data: studios, status } = await apiGet(`/studios?${query}`);

  if (!studios) {
    return (
      <EmptyState
        icon={LuServerOff}
        title="We couldn’t load the studios"
        message={
          status === 0
            ? "The StudioSpace server can’t be reached right now. Please refresh in a few seconds."
            : "Something went wrong while loading studios. Please try again."
        }
      />
    );
  }

  if (studios.length === 0) {
    return (
      <EmptyState
        icon={LuSearchX}
        title="No studios match your search"
        message="Try a different word, pick another category, or clear the filters to see every space."
        actions={[
          { href: "/studios", label: "Clear filters", primary: true },
          { href: "/add-studio", label: "Host Your Space" },
        ]}
      />
    );
  }

  return (
    <>
      <p className="mb-5 text-sm text-base-content/70">
        Showing <span className="font-bold text-base-content">{studios.length}</span>{" "}
        {studios.length === 1 ? "studio" : "studios"}
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {studios.map((studio) => (
          <StudioCard key={studio._id} studio={studio} />
        ))}
      </div>
    </>
  );
}
