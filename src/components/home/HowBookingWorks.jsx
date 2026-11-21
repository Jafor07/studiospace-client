import {
  LuCalendarCheck,
  LuClock,
  LuSearch,
  LuSparkles,
} from "react-icons/lu";
import SectionHeading from "@/components/ui/SectionHeading";

const steps = [
  {
    icon: LuSearch,
    title: "Discover Spaces",
    text: "Search by category, location and budget. Every listing shows its hourly rate, capacity and amenities.",
  },
  {
    icon: LuClock,
    title: "Select Shoot Hours",
    text: "Pick your date, start time and number of hours. The total, including the deposit, updates as you choose.",
  },
  {
    icon: LuCalendarCheck,
    title: "Book Instantly",
    text: "Send your request in one click. Confirmed slots can never be double-booked, so your time is protected.",
  },
  {
    icon: LuSparkles,
    title: "Create & Produce",
    text: "Show up, set up and get to work. Download your invoice any time from My Bookings.",
  },
];

export default function HowBookingWorks() {
  return (
    <section className="bg-base-200 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="How booking works"
          title="From idea to the studio in four steps"
          subtitle="No phone tag and no surprise fees. Just a clear path from searching to shooting."
        />
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="relative flex flex-col rounded-box border border-base-300 bg-base-100 p-6 shadow-sm"
            >
              <span className="absolute right-5 top-4 text-5xl font-black text-base-content/10">
                {index + 1}
              </span>
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-content">
                <step.icon size={24} />
              </span>
              <h3 className="text-lg font-bold">
                {index + 1}. {step.title}
              </h3>
              <p className="mt-2 text-sm text-base-content/70">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
