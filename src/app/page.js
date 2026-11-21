import { Suspense } from "react";
import HeroSlider from "@/components/home/HeroSlider";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedStudios from "@/components/home/FeaturedStudios";
import HowBookingWorks from "@/components/home/HowBookingWorks";
import HostGuarantee from "@/components/home/HostGuarantee";
import SectionHeading from "@/components/ui/SectionHeading";
import { StudioGridSkeleton } from "@/components/ui/Skeletons";

export default function HomePage() {
  return (
    <main>
      <HeroSlider />

      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionHeading
          eyebrow="Featured studios"
          title="Top-rated spaces to create in"
          subtitle="Hand-picked rooms with the best reviews from the creators who booked them."
        />
        <Suspense fallback={<StudioGridSkeleton count={6} />}>
          <FeaturedStudios />
        </Suspense>
      </section>

      <section className="bg-base-200 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading
            eyebrow="Browse by category"
            title="What are you making today?"
            subtitle="Choose a type of space and we’ll show you everything available."
          />
          <CategoryGrid />
        </div>
      </section>

      <HowBookingWorks />
      <HostGuarantee />
    </main>
  );
}
