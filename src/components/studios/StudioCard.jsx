import Link from "next/link";
import { LuMapPin, LuStar, LuUsers } from "react-icons/lu";
import { formatPrice } from "@/app/lib/utils";
import StudioImage from "@/components/ui/StudioImage";
import WishlistButton from "@/components/studios/WishlistButton";

// Every card has the same height, so rows always line up
export default function StudioCard({ studio }) {
  const hasReviews = studio.reviewCount > 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-base-200">
        <StudioImage
          src={studio.image}
          alt={studio.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="badge badge-primary absolute left-3 top-3 font-semibold">
          {studio.category}
        </span>
        <div className="absolute right-3 top-3">
          <WishlistButton studioId={studio._id} />
        </div>
        <span className="badge absolute bottom-3 left-3 gap-1 border-0 bg-base-100/90 font-semibold">
          {hasReviews ? (
            <>
              <LuStar size={14} className="fill-current text-primary" />
              {Number(studio.rating).toFixed(1)}
              <span className="font-normal text-base-content/60">({studio.reviewCount})</span>
            </>
          ) : (
            "New"
          )}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="line-clamp-1 text-lg font-bold">{studio.title}</h3>
        <p className="flex items-center gap-1.5 text-sm text-base-content/70">
          <LuMapPin size={15} className="shrink-0 text-primary" />
          <span className="truncate">{studio.location}</span>
        </p>
        <div className="mt-auto flex items-end justify-between pt-1">
          <p className="text-xl font-extrabold text-primary">
            {formatPrice(studio.hourlyRate)}{" "}
            <span className="text-sm font-medium text-base-content/60">/ hr</span>
          </p>
          <p className="flex items-center gap-1 text-xs text-base-content/60">
            <LuUsers size={14} />
            Up to {studio.maxCapacity}
          </p>
        </div>
        <Link href={`/studios/${studio._id}`} className="btn btn-primary btn-block">
          View Details
        </Link>
      </div>
    </article>
  );
}
