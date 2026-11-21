import Link from "next/link";
import { notFound } from "next/navigation";
import {
  LuArrowLeft,
  LuCheck,
  LuMapPin,
  LuPencil,
  LuServerOff,
  LuShieldCheck,
  LuStar,
  LuUsers,
} from "react-icons/lu";
import { getSession, getStudio } from "@/app/lib/api";
import { formatPrice, formatShortDate, getInitials } from "@/app/lib/utils";
import BookingModal from "@/components/studios/BookingModal";
import ReviewSection from "@/components/studios/ReviewSection";
import StudioGallery from "@/components/studios/StudioGallery";
import WishlistButton from "@/components/studios/WishlistButton";
import EmptyState from "@/components/ui/EmptyState";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { data } = await getStudio(id);
  return { title: data?.title || "Studio details" };
}

export default async function StudioDetailsPage({ params }) {
  const { id } = await params;
  const { data: studio, status } = await getStudio(id);

  if (status === 404) notFound();

  if (!studio) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon={LuServerOff}
          title="We couldn’t load this studio"
          message="The StudioSpace server can’t be reached right now. Please try again in a moment."
          actions={[{ href: "/studios", label: "Back to studios", primary: true }]}
        />
      </main>
    );
  }

  const session = await getSession();
  const isOwner = session?.user?.email === studio.ownerEmail;
  const images = [studio.image, ...(studio.gallery || [])];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <Link href="/studios" className="btn btn-ghost btn-sm mb-6">
        <LuArrowLeft size={16} />
        Back to studios
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* Left column */}
        <div className="min-w-0 space-y-10">
          <StudioGallery images={images} title={studio.title} />

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="badge badge-primary font-semibold">{studio.category}</span>
              <span className="flex items-center gap-1 text-sm font-semibold">
                <LuStar size={16} className="fill-current text-primary" />
                {studio.reviewCount > 0
                  ? `${Number(studio.rating).toFixed(1)} (${studio.reviewCount} reviews)`
                  : "New listing"}
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
              {studio.title}
            </h1>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-base-content/70">
              <span className="flex items-center gap-1.5">
                <LuMapPin size={16} className="text-primary" />
                {studio.location}
              </span>
              <span className="flex items-center gap-1.5">
                <LuUsers size={16} className="text-primary" />
                Up to {studio.maxCapacity} people
              </span>
            </div>
          </div>

          <section>
            <h2 className="mb-3 text-2xl font-extrabold">About this space</h2>
            <p className="whitespace-pre-line text-base-content/80">{studio.overview}</p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-extrabold">Amenities</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {studio.amenities.map((amenity) => (
                <li key={amenity} className="flex items-center gap-3 text-sm">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <LuCheck size={15} />
                  </span>
                  {amenity}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-extrabold">Your host</h2>
            <div className="flex items-center gap-4 rounded-box border border-base-300 bg-base-100 p-5">
              {studio.ownerImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={studio.ownerImage}
                  alt={studio.ownerName}
                  referrerPolicy="no-referrer"
                  className="h-16 w-16 rounded-full border-2 border-primary object-cover"
                />
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-content">
                  {getInitials(studio.ownerName)}
                </span>
              )}
              <div>
                <p className="text-lg font-bold">{studio.ownerName}</p>
                <p className="flex items-center gap-1.5 text-sm text-base-content/70">
                  <LuShieldCheck size={15} className="text-success" />
                  Verified StudioSpace host
                </p>
                <p className="text-xs text-base-content/60">
                  Listed on {formatShortDate(studio.createdAt)}
                </p>
              </div>
            </div>
          </section>

          <ReviewSection
            studioId={studio._id}
            reviews={studio.reviews || []}
            rating={studio.rating}
            reviewCount={studio.reviewCount}
            isOwner={isOwner}
          />
        </div>

        {/* Right column: booking card */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-5 rounded-box border border-base-300 bg-base-100 p-6 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl font-extrabold text-primary">
                  {formatPrice(studio.hourlyRate)}
                  <span className="text-base font-medium text-base-content/60"> / hr</span>
                </p>
                <p className="mt-1 text-sm text-base-content/70">
                  + {formatPrice(studio.securityDeposit)} refundable deposit
                </p>
              </div>
              <WishlistButton studioId={studio._id} />
            </div>

            {isOwner ? (
              <div className="space-y-3">
                <p className="rounded-box bg-base-200 p-3 text-sm text-base-content/70">
                  This is your listing, so you can edit it but not book it.
                </p>
                <Link href={`/studios/edit/${studio._id}`} className="btn btn-primary btn-block">
                  <LuPencil size={18} />
                  Edit this studio
                </Link>
              </div>
            ) : (
              <BookingModal
                studio={{
                  _id: studio._id,
                  title: studio.title,
                  hourlyRate: studio.hourlyRate,
                  securityDeposit: studio.securityDeposit,
                }}
              />
            )}

            <ul className="space-y-2 border-t border-base-300 pt-4 text-sm text-base-content/70">
              <li className="flex items-center gap-2">
                <LuCheck size={16} className="text-success" />
                Free cancellation while a request is pending
              </li>
              <li className="flex items-center gap-2">
                <LuCheck size={16} className="text-success" />
                Confirmed times can’t be double-booked
              </li>
              <li className="flex items-center gap-2">
                <LuCheck size={16} className="text-success" />
                Invoice available after confirmation
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}