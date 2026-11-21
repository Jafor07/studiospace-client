"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LuCheck, LuCheckCheck, LuX } from "react-icons/lu";
import { apiRequest } from "@/app/lib/client-api";
import { formatDate, formatPrice, formatTime } from "@/app/lib/utils";
import StatusBadge from "@/components/bookings/StatusBadge";
import ConfirmModal from "@/components/ui/ConfirmModal";

// One row in the host's "Booking requests" table
export default function HostBookingRow({ booking }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [declineOpen, setDeclineOpen] = useState(false);

  const changeStatus = async (status, successMessage) => {
    setLoading(true);
    const res = await apiRequest(`/bookings/${booking._id}/status`, {
      method: "PATCH",
      body: { status },
    });
    setLoading(false);

    if (!res.ok) {
      // For example 409: another confirmed booking already took this time
      toast.error(res.message);
      setDeclineOpen(false);
      return;
    }
    toast.success(successMessage);
    setDeclineOpen(false);
    router.refresh();
  };

  return (
    <tr>
      <td>
        <p className="font-semibold">{booking.userName}</p>
        <p className="text-xs text-base-content/60">{booking.userEmail}</p>
      </td>
      <td className="min-w-40">
        <Link href={`/studios/${booking.studioId}`} className="font-semibold hover:text-primary">
          {booking.studioTitle}
        </Link>
      </td>
      <td className="whitespace-nowrap text-sm">
        {formatDate(booking.date)}
        <span className="block text-xs text-base-content/60">
          {formatTime(booking.startTime)} to {formatTime(booking.endTime)}
        </span>
      </td>
      <td className="whitespace-nowrap font-semibold">{formatPrice(booking.total)}</td>
      <td>
        <StatusBadge status={booking.status} />
      </td>
      <td>
        <div className="flex justify-end gap-2">
          {booking.status === "Pending" && (
            <>
              <button
                type="button"
                onClick={() => changeStatus("Confirmed", "Booking confirmed. That time is now held.")}
                disabled={loading}
                className="btn btn-sm btn-success"
              >
                {loading ? <span className="loading loading-spinner loading-xs" /> : <LuCheck size={15} />}
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setDeclineOpen(true)}
                disabled={loading}
                className="btn btn-sm btn-error btn-outline"
              >
                <LuX size={15} />
                Decline
              </button>
            </>
          )}
          {booking.status === "Confirmed" && (
            <button
              type="button"
              onClick={() => changeStatus("Completed", "Booking marked as completed.")}
              disabled={loading}
              className="btn btn-sm btn-info btn-outline"
            >
              {loading ? <span className="loading loading-spinner loading-xs" /> : <LuCheckCheck size={15} />}
              Mark completed
            </button>
          )}
        </div>
        <ConfirmModal
          open={declineOpen}
          title="Decline this request?"
          message={`${booking.userName}’s request for ${formatDate(booking.date)} will be cancelled and they will see it in My Bookings.`}
          confirmLabel="Yes, decline"
          cancelLabel="Go back"
          loading={loading}
          onConfirm={() => changeStatus("Cancelled", "Request declined.")}
          onClose={() => setDeclineOpen(false)}
        />
      </td>
    </tr>
  );
}
