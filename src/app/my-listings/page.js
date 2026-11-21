import Link from "next/link";
import { LuCamera, LuEye, LuPencil, LuPlus, LuServerOff } from "react-icons/lu";
import { apiGetPrivate } from "@/app/lib/api";
import { formatPrice } from "@/app/lib/utils";
import DeleteStudioButton from "@/components/studios/DeleteStudioButton";
import EmptyState from "@/components/ui/EmptyState";
import SectionHeading from "@/components/ui/SectionHeading";
import StudioImage from "@/components/ui/StudioImage";

export const metadata = { title: "My Studio Listings" };

export default async function MyListingsPage() {
  const { data: studios } = await apiGetPrivate("/my-studios");

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <SectionHeading
          center={false}
          eyebrow="Host tools"
          title="My studio listings"
          subtitle="Every space you have listed on StudioSpace."
        />
        <Link href="/add-studio" className="btn btn-primary mb-10 shrink-0">
          <LuPlus size={18} />
          Add New Studio
        </Link>
      </div>

      {!studios ? (
        <EmptyState
          icon={LuServerOff}
          title="We couldn’t load your listings"
          message="Something went wrong while loading your studios. Please refresh the page."
        />
      ) : studios.length === 0 ? (
        <EmptyState
          icon={LuCamera}
          title="You haven’t listed a studio yet"
          message="Share your space with creators. It only takes a few minutes to publish a listing."
          actions={[{ href: "/add-studio", label: "Add your first studio", primary: true }]}
        />
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100 shadow-sm">
          <table className="table">
            <thead>
              <tr>
                <th>Studio</th>
                <th>Category</th>
                <th>Rate</th>
                <th>Capacity</th>
                <th>Rating</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {studios.map((studio) => (
                <tr key={studio._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-20 shrink-0 overflow-hidden rounded-field bg-base-200">
                        <StudioImage
                          src={studio.image}
                          alt={studio.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-40">
                        <p className="font-bold">{studio.title}</p>
                        <p className="line-clamp-1 text-xs text-base-content/60">{studio.location}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-soft badge-primary whitespace-nowrap">
                      {studio.category}
                    </span>
                  </td>
                  <td className="whitespace-nowrap font-semibold">{formatPrice(studio.hourlyRate)} / hr</td>
                  <td>{studio.maxCapacity}</td>
                  <td className="whitespace-nowrap">
                    {studio.reviewCount > 0
                      ? `${Number(studio.rating).toFixed(1)} (${studio.reviewCount})`
                      : "New"}
                  </td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/studios/${studio._id}`}
                        className="btn btn-sm btn-ghost"
                        aria-label={`View ${studio.title}`}
                      >
                        <LuEye size={15} />
                      </Link>
                      <Link href={`/studios/edit/${studio._id}`} className="btn btn-sm btn-outline">
                        <LuPencil size={15} />
                        Update
                      </Link>
                      <DeleteStudioButton studioId={studio._id} title={studio.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
