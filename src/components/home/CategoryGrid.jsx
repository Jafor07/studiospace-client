import Link from "next/link";
import { CATEGORIES } from "@/app/lib/constants";

// Clicking a card opens /studios with that category already selected
export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {CATEGORIES.map((category) => (
        <Link
          key={category.value}
          href={`/studios?category=${encodeURIComponent(category.value)}`}
          className="group relative flex h-64 flex-col justify-end overflow-hidden rounded-box border border-base-300 text-white"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url(${category.art})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
          <div className="relative p-4">
            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-content">
              <category.icon size={20} />
            </span>
            <h3 className="text-lg font-bold">{category.label}</h3>
            <p className="mt-1 line-clamp-2 text-xs text-white/80">{category.blurb}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
