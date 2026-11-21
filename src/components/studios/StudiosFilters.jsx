"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LuSearch, LuX } from "react-icons/lu";
import { CATEGORIES, SORT_OPTIONS } from "@/app/lib/constants";

// Search, category and sort controls. Everything is stored in the URL
// (?category=...&search=...), so reloading or sharing the link keeps the filters.
export default function StudiosFilters({ initial }) {
  const router = useRouter();
  const [search, setSearch] = useState(initial.search);
  const [isPending, startTransition] = useTransition();
  const timer = useRef(null);

  const update = (changes) => {
    const values = {
      category: initial.category,
      sort: initial.sort,
      search,
      ...changes,
    };
    const query = new URLSearchParams();
    if (values.category) query.set("category", values.category);
    if (values.search.trim()) query.set("search", values.search.trim());
    if (values.sort && values.sort !== "newest") query.set("sort", values.sort);

    const queryString = query.toString();
    startTransition(() => {
      router.replace(queryString ? `/studios?${queryString}` : "/studios", {
        scroll: false,
      });
    });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => update({ search: value }), 450);
  };

  const hasFilters = initial.category || initial.search || initial.sort !== "newest";

  return (
    <div className="mb-8 space-y-5 rounded-box border border-base-300 bg-base-100 p-5 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row">
        <label className="input w-full md:flex-1">
          <LuSearch size={18} className="opacity-60" />
          <input
            type="search"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by name, city or category"
            aria-label="Search studios"
          />
          {isPending && <span className="loading loading-spinner loading-xs text-primary" />}
        </label>

        <select
          value={initial.sort}
          onChange={(e) => update({ sort: e.target.value })}
          className="select w-full md:w-56"
          aria-label="Sort studios"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => update({ category: "" })}
          className={`btn btn-sm ${initial.category === "" ? "btn-primary" : "btn-outline"}`}
        >
          All
        </button>
        {CATEGORIES.map((category) => (
          <button
            key={category.value}
            type="button"
            onClick={() => update({ category: category.value })}
            className={`btn btn-sm ${
              initial.category === category.value ? "btn-primary" : "btn-outline"
            }`}
          >
            <category.icon size={15} />
            {category.label}
          </button>
        ))}

        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              update({ category: "", search: "", sort: "newest" });
            }}
            className="btn btn-sm btn-ghost ml-auto"
          >
            <LuX size={15} />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
