import { LuAperture } from "react-icons/lu";

// Shown while any page is loading (route changes and data fetches)
export default function Loading() {
  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4"
      role="status"
      aria-live="polite"
    >
      <LuAperture size={56} className="animate-spin text-primary [animation-duration:1.6s]" />
      <p className="text-sm font-semibold tracking-wide text-base-content/70">
        Setting up the lights...
      </p>
    </div>
  );
}
