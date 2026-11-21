import Link from "next/link";
import { LuCalendarCheck, LuCamera, LuHandshake, LuWallet } from "react-icons/lu";
import HowBookingWorks from "@/components/home/HowBookingWorks";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata = { title: "How It Works" };

const hostSteps = [
  {
    icon: LuCamera,
    title: "List your space",
    text: "Add photos, the hourly rate, a refundable deposit, your capacity and the gear that comes with the room.",
  },
  {
    icon: LuCalendarCheck,
    title: "Review requests",
    text: "Every booking request lands on your dashboard. Confirm the ones you want and decline the rest.",
  },
  {
    icon: LuHandshake,
    title: "Welcome your guest",
    text: "Confirmed times are locked, so no one else can book over your guest’s session.",
  },
  {
    icon: LuWallet,
    title: "Mark it complete",
    text: "After the session, mark the booking as completed and return the security deposit.",
  },
];

const faqs = [
  {
    q: "Is it free to send a booking request?",
    a: "Yes. Sending a request costs nothing, and you can cancel it for free while it is still pending.",
  },
  {
    q: "Can two people book the same time?",
    a: "Several people can ask for the same slot, but only one request can be confirmed. Once a time is confirmed, StudioSpace blocks any overlapping booking for that studio.",
  },
  {
    q: "What is the security deposit?",
    a: "A refundable amount set by the host to protect their gear and space. It is shown in your total before you book and returned after the session.",
  },
  {
    q: "How do I get an invoice?",
    a: "Once a booking is confirmed, open My Bookings and press Download Invoice to get a PDF receipt.",
  },
  {
    q: "Can I host and book on the same account?",
    a: "Yes. One account can list studios and book other people’s studios. You just can’t book your own space.",
  },
];

export default function HowItWorksPage() {
  return (
    <main>
      <section className="mx-auto max-w-4xl px-4 pt-16 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
          How it works
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
          Booking a studio should feel as easy as booking a table
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base-content/70">
          Whether you are looking for a room or sharing one, here is exactly what happens from the first search to the last invoice.
        </p>
      </section>

      <div className="mt-14">
        <HowBookingWorks />
      </div>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionHeading
          eyebrow="For hosts"
          title="Turn an empty room into income"
          subtitle="Hosting takes a few minutes to set up and gives you full control over who books."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {hostSteps.map((step) => (
            <div key={step.title} className="rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                <step.icon size={24} />
              </span>
              <h3 className="text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm text-base-content/70">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-base-200 py-20">
        <div className="mx-auto max-w-3xl px-4">
          <SectionHeading eyebrow="Questions" title="Good to know before you book" />
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={faq.q} className="collapse collapse-arrow border border-base-300 bg-base-100">
                <input type="radio" name="faq" defaultChecked={index === 0} aria-label={faq.q} />
                <div className="collapse-title font-semibold">{faq.q}</div>
                <div className="collapse-content text-sm text-base-content/70">{faq.a}</div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/studios" className="btn btn-primary btn-lg">
              Start exploring
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
