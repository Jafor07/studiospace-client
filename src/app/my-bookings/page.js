import { LuServerOff, LuTicket } from "react-icons/lu";
import { apiGetPrivate } from "@/app/lib/api";
import MyBookingCard from "@/components/bookings/MyBookingCard";
import EmptyState from "@/components/ui/EmptyState";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata = { title: "My Bookings" };

export default async function MyBookingsPage() {
  const { data: bookings } = await apiGetPrivate("/my-bookings");

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <SectionHeading
        eyebrow="Your sessions"
        title="My bookings"
        subtitle="Track your requests, cancel pending ones and download invoices for confirmed sessions."
      />

      {!bookings ? (
        <EmptyState
          icon={LuServerOff}
          title="We couldn’t load your bookings"
          message="Something went wrong while loading your bookings. Please refresh the page."
        />
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={LuTicket}
          title="No bookings yet"
          message="When you book a studio, your request and its status will show up here."
          actions={[{ href: "/studios", label: "Explore Studios", primary: true }]}
        />
      ) : (
        <div className="space-y-5">
          {bookings.map((booking) => (
            <MyBookingCard key={booking._id} booking={booking} />
          ))}
        </div>
      )}
    </main>
  );
}
