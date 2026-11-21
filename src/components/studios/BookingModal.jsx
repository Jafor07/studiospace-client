"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LuCalendarCheck, LuCircleAlert } from "react-icons/lu";
import { authClient } from "@/app/lib/auth-client";
import { apiRequest } from "@/app/lib/client-api";
import { TIME_SLOTS } from "@/app/lib/constants";
import { formatPrice, formatTime, todayLocal } from "@/app/lib/utils";

const HOURS = Array.from({ length: 12 }, (_, index) => index + 1);

const toMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// "Book Workspace Now" button + the booking pop-up
export default function BookingModal({ studio }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [hours, setHours] = useState(2);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const endMinutes = toMinutes(startTime) + hours * 60;
  const pastMidnight = endMinutes > 24 * 60;
  const endTime = `${String(Math.floor((endMinutes % 1440) / 60)).padStart(2, "0")}:${
    endMinutes % 60 === 0 ? "00" : "30"
  }`;
  const subtotal = hours * studio.hourlyRate;
  const total = subtotal + studio.securityDeposit;

  const openModal = () => {
    if (!session?.user) {
      toast.error("Please log in to book this studio.");
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    setError("");
    setDate((current) => current || todayLocal());
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!date) return setError("Please choose a date.");
    if (pastMidnight)
      return setError("The session would run past midnight. Choose an earlier start or fewer hours.");

    setLoading(true);
    const res = await apiRequest("/bookings", {
      method: "POST",
      body: { studioId: studio._id, date, startTime, hours, notes },
    });
    setLoading(false);

    if (!res.ok) {
      // A 409 means that time is already confirmed for someone else (Challenge 2)
      setError(res.message);
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
    setOpen(false);
    router.push("/my-bookings");
    router.refresh();
  };

  return (
    <>
      <button type="button" onClick={openModal} className="btn btn-primary btn-lg btn-block">
        <LuCalendarCheck size={20} />
        Book Workspace Now
      </button>

      <div className={`modal ${open ? "modal-open" : ""}`} role="dialog" aria-label="Book this studio">
        <div className="modal-box max-w-lg">
          <h3 className="text-xl font-extrabold">Book {studio.title}</h3>
          <p className="mt-1 text-sm text-base-content/70">
            Choose your session. The host confirms your request, and your time is
            held once it is confirmed.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {error && (
              <div role="alert" className="alert alert-error alert-soft text-sm">
                <LuCircleAlert size={18} />
                <span>{error}</span>
              </div>
            )}

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Date</legend>
              <input
                type="date"
                value={date}
                min={todayLocal()}
                onChange={(e) => setDate(e.target.value)}
                required
                className="input w-full"
              />
            </fieldset>

            <div className="grid grid-cols-2 gap-4">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Start time</legend>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="select w-full"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {formatTime(slot)}
                    </option>
                  ))}
                </select>
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Hours</legend>
                <select
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="select w-full"
                >
                  {HOURS.map((hour) => (
                    <option key={hour} value={hour}>
                      {hour} {hour === 1 ? "hour" : "hours"}
                    </option>
                  ))}
                </select>
              </fieldset>
            </div>

            <p className={`text-sm ${pastMidnight ? "text-error" : "text-base-content/70"}`}>
              {pastMidnight
                ? "This session would run past midnight."
                : `Your session ends at ${formatTime(endTime)}.`}
            </p>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Notes for the host (optional)</legend>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={500}
                rows={3}
                placeholder="What are you shooting or recording? Any gear you plan to bring?"
                className="textarea w-full"
              />
            </fieldset>

            {/* Price summary */}
            <div className="space-y-2 rounded-box bg-base-200 p-4 text-sm">
              <div className="flex justify-between">
                <span>
                  {hours} {hours === 1 ? "hour" : "hours"} × {formatPrice(studio.hourlyRate)}
                </span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Refundable security deposit</span>
                <span className="font-semibold">{formatPrice(studio.securityDeposit)}</span>
              </div>
              <div className="flex justify-between border-t border-base-300 pt-2 text-base font-extrabold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="modal-action mt-2">
              <button type="button" className="btn" onClick={() => setOpen(false)} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading || pastMidnight}>
                {loading && <span className="loading loading-spinner loading-sm" />}
                Send Booking Request
              </button>
            </div>
          </form>
        </div>
        <div className="modal-backdrop" onClick={loading ? undefined : () => setOpen(false)} />
      </div>
    </>
  );
}
