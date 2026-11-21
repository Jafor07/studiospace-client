import Link from "next/link";
import { LuArrowRight, LuHouse } from "react-icons/lu";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col items-center px-4 py-14 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/illustrations/not-found.svg"
        alt="A film clapperboard showing 404 under a spotlight"
        className="w-full max-w-md"
      />
      <h1 className="mt-8 text-3xl font-extrabold tracking-tight md:text-4xl">
        This shot didn’t make the final cut
      </h1>
      <p className="mt-3 max-w-md text-base-content/70">
        The page you are looking for has moved, been removed, or never existed.
        Let’s get you back to the set.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">
          <LuHouse size={18} />
          Return to Home
        </Link>
        <Link href="/studios" className="btn btn-outline">
          Explore Studios
          <LuArrowRight size={18} />
        </Link>
      </div>
    </main>
  );
}
