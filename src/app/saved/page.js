import { LuHeart, LuServerOff } from "react-icons/lu";
import { apiGetPrivate } from "@/app/lib/api";
import StudioCard from "@/components/studios/StudioCard";
import EmptyState from "@/components/ui/EmptyState";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata = { title: "Saved Studios" };

export default async function SavedStudiosPage() {
  const { data: studios } = await apiGetPrivate("/wishlist/studios");

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <SectionHeading
        eyebrow="Wishlist"
        title="Saved studios"
        subtitle="The spaces you hearted, ready for when the next project starts."
      />

      {!studios ? (
        <EmptyState
          icon={LuServerOff}
          title="We couldn’t load your saved studios"
          message="Something went wrong while loading your wishlist. Please refresh the page."
        />
      ) : studios.length === 0 ? (
        <EmptyState
          icon={LuHeart}
          title="Nothing saved yet"
          message="Tap the heart on any studio to keep it here for later."
          actions={[{ href: "/studios", label: "Explore Studios", primary: true }]}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio) => (
            <StudioCard key={studio._id} studio={studio} />
          ))}
        </div>
      )}
    </main>
  );
}
