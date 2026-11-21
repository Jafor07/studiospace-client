import Link from "next/link";
import { LuArrowRight, LuServerOff, LuCamera } from "react-icons/lu";
import { apiGet } from "@/app/lib/api";
import StudioCard from "@/components/studios/StudioCard";
import EmptyState from "@/components/ui/EmptyState";

// Server component: the 6 best studios come straight from MongoDB (.limit(6))
export default async function FeaturedStudios() {
  const { data: studios, status } = await apiGet("/studios/featured");

  if (!studios) {
    return (
      <EmptyState
        icon={LuServerOff}
        title="Studios are taking a moment to load"
        message={
          status === 0
            ? "We can’t reach the StudioSpace server right now. Please refresh in a few seconds."
            : "Something went wrong while loading the featured studios. Please try again."
        }
        actions={[{ href: "/studios", label: "Browse all studios", primary: true }]}
      />
    );
  }

  if (studios.length === 0) {
    return (
      <EmptyState
        icon={LuCamera}
        title="No studios listed yet"
        message="Be the first host on StudioSpace and list your creative space."
        actions={[{ href: "/add-studio", label: "Host Your Space", primary: true }]}
      />
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {studios.map((studio) => (
          <StudioCard key={studio._id} studio={studio} />
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link href="/studios" className="btn btn-outline">
          View all studios
          <LuArrowRight size={18} />
        </Link>
      </div>
    </>
  );
}
