import Link from "next/link";
import { LuHeart, LuLightbulb, LuUsers } from "react-icons/lu";
import { CATEGORIES } from "@/app/lib/constants";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata = { title: "About Us" };

const values = [
  {
    icon: LuLightbulb,
    title: "Great work needs the right room",
    text: "A good photo, a clean vocal take or a finished painting often starts with the space. We help creators find that space quickly.",
  },
  {
    icon: LuUsers,
    title: "Creators helping creators",
    text: "Our hosts are photographers, producers and artists too. They know what a good studio feels like because they build them.",
  },
  {
    icon: LuHeart,
    title: "Fair and transparent",
    text: "Hourly prices, deposits and totals are shown before you book. No hidden fees and no surprises on the day.",
  },
];

export default function AboutPage() {
  return (
    <main>
      <section className="mx-auto max-w-4xl px-4 pb-16 pt-16 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">About us</p>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
          A shared home for creative spaces
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-base-content/70">
          StudioSpace is a peer-to-peer marketplace where studio owners share their rooms and creators book them by the hour. Our mission is simple: make every great idea easier to produce.
        </p>
      </section>

      <section className="bg-base-200 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading eyebrow="What we believe" title="Three ideas behind StudioSpace" />
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="rounded-box border border-base-300 bg-base-100 p-7 shadow-sm">
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-content">
                  <value.icon size={24} />
                </span>
                <h3 className="text-xl font-bold">{value.title}</h3>
                <p className="mt-2 text-sm text-base-content/70">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionHeading
          eyebrow="Who it is for"
          title="Spaces for every kind of maker"
          subtitle="From a single portrait session to a full production day, there is a room for it."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORIES.map((category) => (
            <Link
              key={category.value}
              href={`/studios?category=${encodeURIComponent(category.value)}`}
              className="flex h-full flex-col items-center rounded-box border border-base-300 bg-base-100 p-6 text-center transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"
            >
              <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                <category.icon size={24} />
              </span>
              <h3 className="font-bold">{category.label}</h3>
              <p className="mt-1 text-xs text-base-content/70">{category.blurb}</p>
            </Link>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/add-studio" className="btn btn-primary btn-lg">
            Host Your Space
          </Link>
        </div>
      </section>
    </main>
  );
}
