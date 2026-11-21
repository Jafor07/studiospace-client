import Link from "next/link";
import {
  LuBadgeCheck,
  LuHeadset,
  LuShieldCheck,
  LuWrench,
} from "react-icons/lu";
import SectionHeading from "@/components/ui/SectionHeading";

const guarantees = [
  {
    icon: LuShieldCheck,
    title: "Liability protection",
    text: "Every confirmed booking is covered by our host protection terms, so a mishap doesn’t become a dispute.",
  },
  {
    icon: LuBadgeCheck,
    title: "Verified profiles",
    text: "Hosts and guests sign in with a verified account, and every studio is tied to a real owner.",
  },
  {
    icon: LuWrench,
    title: "Equipment safety",
    text: "Hosts list the gear in each room, and a refundable security deposit keeps that gear looked after.",
  },
  {
    icon: LuHeadset,
    title: "24/7 host support",
    text: "Questions at midnight before a shoot? Our support team is on call around the clock.",
  },
];

export default function HostGuarantee() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="Host guarantee & creator support"
          title="Book and host with confidence"
          subtitle="StudioSpace is built so creators can focus on the work while we look after the rest."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {guarantees.map((item) => (
            <div
              key={item.title}
              className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm"
            >
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                <item.icon size={24} />
              </span>
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="mt-2 text-sm text-base-content/70">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-6 rounded-box bg-neutral p-8 text-neutral-content md:flex-row md:p-10">
          <div>
            <h3 className="text-2xl font-extrabold">Got a room that creators would love?</h3>
            <p className="mt-2 max-w-xl text-sm text-neutral-content/80">
              List your studio in a few minutes, set your own hourly rate and
              approve the bookings you want.
            </p>
          </div>
          <Link href="/add-studio" className="btn btn-primary btn-lg shrink-0">
            Host Your Space
          </Link>
        </div>
      </div>
    </section>
  );
}
