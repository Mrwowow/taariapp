"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface StoriesFilterProps {
  cities: { name: string; slug: string }[];
  categories: string[];
  activeCity?: string;
  activeCategory?: string;
}

export default function StoriesFilter({
  cities,
  categories,
  activeCity,
  activeCategory,
}: StoriesFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/stories?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* City filter */}
      <button
        onClick={() => updateFilter("city", undefined)}
        className={`text-xs font-bold uppercase tracking-[0.12em] px-4 py-2 rounded-full border transition-colors ${
          !activeCity
            ? "bg-dark text-cream border-dark"
            : "text-muted border-border hover:border-dark hover:text-dark"
        }`}
      >
        All Cities
      </button>
      {cities.map((city) => (
        <button
          key={city.slug}
          onClick={() =>
            updateFilter("city", activeCity === city.slug ? undefined : city.slug)
          }
          className={`text-xs font-bold uppercase tracking-[0.12em] px-4 py-2 rounded-full border transition-colors ${
            activeCity === city.slug
              ? "bg-dark text-cream border-dark"
              : "text-muted border-border hover:border-dark hover:text-dark"
          }`}
        >
          {city.name}
        </button>
      ))}

      {/* Divider */}
      <span className="w-px h-6 bg-border mx-1 hidden md:block" />

      {/* Category filter */}
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() =>
            updateFilter(
              "category",
              activeCategory?.toLowerCase() === cat.toLowerCase()
                ? undefined
                : cat.toLowerCase()
            )
          }
          className={`text-xs font-bold uppercase tracking-[0.12em] px-4 py-2 rounded-full border transition-colors ${
            activeCategory?.toLowerCase() === cat.toLowerCase()
              ? "bg-accent text-dark border-accent"
              : "text-muted border-border hover:border-accent hover:text-accent"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
