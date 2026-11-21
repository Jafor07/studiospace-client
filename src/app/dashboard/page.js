import Link from "next/link";
import {
  LuCalendarClock,
  LuCamera,
  LuInbox,
  LuServerOff,
  LuTicket,
  LuTrendingUp,
} from "react-icons/lu";
import { apiGetPrivate, getSession } from "@/app/lib/api";
import { formatPrice } from "@/app/lib/utils";
import HostBookingRow from "@/components/bookings/HostBookingRow";
import EmptyState from "@/components/ui/EmptyState";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await getSession();
  const [studiosRes, myBookingsRes, hostRes] = await Promise.all([
    apiGetPrivate("/my-studios"),
    apiGetPrivate("/my-bookings"),
    apiGetPrivate("/host-bookings"),
  ]);

  if (!studiosRes.data || !myBookingsRes.data || !hostRes.data) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon={LuServerOff}
          title="We couldn’t load your dashboard"
          message="Something went wrong while loading your numbers. Please refresh the page."
        />
      </main>
    );
  }

  const studios = studiosRes.data;
  const myBookings = myBookingsRes.data;
  const requests = hostRes.data;

  const pending = requests.filter((item) => item.status === "Pending").length;
  const earned = requests
    .filter((item) => item.status === "Confirmed" || item.status === "Completed")
    .reduce((sum, item) => sum + item.subtotal, 0);

  const stats = [
    { icon: LuCamera, label: "Studios listed", value: studios.length },
    { icon: LuTicket, label: "Bookings you made", value: myBookings.length },
    { icon: LuInbox, label: "Requests waiting", value: pending },
    { icon: LuTrendingUp, label: "Booked earnings", value: formatPrice(earned) },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <SectionHeading
        center={false}
        eyebrow="Dashboard"
        title={`Welcome back, ${session?.user?.name?.split(" ")[0] || "creator"}`}
        subtitle="See how your studios are doing and answer new booking requests."
      />

      <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-box border border-base-300 bg-base-100 p-5 shadow-sm"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
              <stat.icon size={24} />
            </span>
            <div>
              <p className="text-2xl font-extrabold">{stat.value}</p>
              <p className="text-sm text-base-content/70">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-extrabold">Booking requests for your studios</h2>
          <Link href="/my-listings" className="btn btn-outline btn-sm">
            Manage listings
          </Link>
        </div>

        {requests.length === 0 ? (
          <EmptyState
            icon={LuCalendarClock}
            title="No booking requests yet"
            message="When a creator books one of your studios, the request will appear here for you to confirm."
            actions={
              studios.length === 0
                ? [{ href: "/add-studio", label: "Add your first studio", primary: true }]
                : [{ href: "/my-listings", label: "View my listings", primary: true }]
            }
          />
        ) : (
          <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100 shadow-sm">
            <table className="table">
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Studio</th>
                  <th>Date and time</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((booking) => (
                  <HostBookingRow key={booking._id} booking={booking} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
