"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LuCalendarDays, LuClock, LuDownload, LuMapPin, LuX } from "react-icons/lu";
import { apiRequest } from "@/app/lib/client-api";
import { downloadInvoice } from "@/app/lib/invoice";
import { formatDate, formatPrice, formatTime } from "@/app/lib/utils";
import StatusBadge from "@/components/bookings/StatusBadge";
import ConfirmModal from "@/components/ui/ConfirmModal";
import StudioImage from "@/components/ui/StudioImage";

export default function MyBookingCard({ booking }) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const canCancel = booking.status === "Pending";
  const canDownload = booking.status === "Confirmed" || booking.status === "Completed";

  const handleCancel = async () => {
    setCancelling(true);
    const res = await apiRequest(`/bookings/${booking._id}/cancel`, { method: "PATCH" });
    setCancelling(false);

    if (!res.ok) {
      toast.error(res.message);
      return;
    }
    toast.success("Your booking was cancelled.");
    setConfirmOpen(false);
    router.refresh();
  };

  const handleInvoice = async () => {
    setDownloading(true);
    try {
      await downloadInvoice(booking);
      toast.success("Invoice downloaded.");
    } catch (error) {
      console.error("Invoice error:", error);
      toast.error("We couldn’t create the invoice. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <article className="flex flex-col overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-sm md:flex-row">
      <div className="h-44 w-full shrink-0 bg-base-200 md:h-auto md:w-60">
        <StudioImage
          src={booking.studioImage}
          alt={booking.studioTitle}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">
              <Link href={`/studios/${booking.studioId}`} className="hover:text-primary">
                {booking.studioTitle}
              </Link>
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-base-content/70">
              <LuMapPin size={14} className="text-primary" />
              {booking.studioLocation}
            </p>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <div className="grid gap-3 text-sm sm:grid-cols-3">
          <p className="flex items-center gap-2">
            <LuCalendarDays size={16} className="text-primary" />
            {formatDate(booking.date)}
          </p>
          <p className="flex items-center gap-2">
            <LuClock size={16} className="text-primary" />
            {formatTime(booking.startTime)} to {formatTime(booking.endTime)}
          </p>
          <p className="font-bold">
            Total: <span className="text-primary">{formatPrice(booking.total)}</span>
            <span className="block text-xs font-normal text-base-content/60">
              {booking.hours} {booking.hours === 1 ? "hour" : "hours"} + deposit
            </span>
          </p>
        </div>

        {booking.notes && (
          <p className="rounded-field bg-base-200 p-3 text-sm text-base-content/80">
            <span className="font-semibold">Your note: </span>
            {booking.notes}
          </p>
        )}
        {booking.status === "Cancelled" && booking.cancelReason && (
          <p className="text-sm text-error">{booking.cancelReason}</p>
        )}

        {(canCancel || canDownload) && (
          <div className="mt-auto flex flex-wrap gap-2">
            {canCancel && (
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="btn btn-sm btn-error btn-outline"
              >
                <LuX size={15} />
                Cancel Booking
              </button>
            )}
            {canDownload && (
              <button
                type="button"
                onClick={handleInvoice}
                disabled={downloading}
                className="btn btn-sm btn-primary"
              >
                {downloading ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <LuDownload size={15} />
                )}
                Download Invoice
              </button>
            )}
          </div>
        )}
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Cancel this booking?"
        message={`Your request for “${booking.studioTitle}” on ${formatDate(booking.date)} will be cancelled and the host will be told.`}
        confirmLabel="Yes, cancel it"
        cancelLabel="Keep booking"
        loading={cancelling}
        onConfirm={handleCancel}
        onClose={() => setConfirmOpen(false)}
      />
    </article>
  );
}
