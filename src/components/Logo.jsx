import Link from "next/link";
import { LuAperture } from "react-icons/lu";

// Same logo, same size, in the navbar and the footer
export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="StudioSpace home">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-content">
        <LuAperture size={24} />
      </span>
      <span className="text-xl font-extrabold tracking-tight">StudioSpace</span>
    </Link>
  );
}
