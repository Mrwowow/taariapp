"use client";

import Image from "next/image";
import { useState } from "react";
import Badge from "@/components/ui/Badge";
import { reels, cities } from "@/lib/data";

export default function ReelsPage() {
  const [activeCity, setActiveCity] = useState<string>("all");

  const filteredReels =
    activeCity === "all" ? reels : reels.filter((r) => r.city.slug === activeCity);

  return (
    <div className="py-16 px-6">
      <div className="mx-auto max-w-[1280px]">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-dark mb-3">
            Reels
          </h1>
          <p className="text-lg text-muted">
            Short stories, captured in motion.
          </p>
        </div>

        {/* City Filter */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveCity("all")}
            className={`shrink-0 px-5 py-2 text-xs font-medium uppercase tracking-[0.1em] transition-colors ${
              activeCity === "all"
                ? "bg-dark text-cream"
                : "bg-transparent border border-border text-muted hover:border-dark hover:text-dark"
            }`}
          >
            All
          </button>
          {cities.map((city) => (
            <button
              key={city.slug}
              onClick={() => setActiveCity(city.slug)}
              className={`shrink-0 px-5 py-2 text-xs font-medium uppercase tracking-[0.1em] transition-colors ${
                activeCity === city.slug
                  ? "bg-dark text-cream"
                  : "bg-transparent border border-border text-muted hover:border-dark hover:text-dark"
              }`}
            >
              {city.name}
            </button>
          ))}
        </div>

        {/* Reels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReels.map((reel) => (
            <div key={reel.id} className="group cursor-pointer">
              <div className="relative aspect-[9/16] overflow-hidden rounded-2xl mb-3">
                <Image
                  src={reel.thumbnail}
                  alt={reel.title}
                  fill
                  className="object-cover transition-all duration-500 group-hover:brightness-90"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-cream/30 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  </div>
                </div>
                {/* Bottom caption overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-dark/60 to-transparent">
                  <p className="text-cream text-sm">{reel.caption}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-dark group-hover:text-accent transition-colors">
                    {reel.title}
                  </h3>
                  <Badge variant="city">{reel.city.name}</Badge>
                </div>
                <button className="text-xs text-muted hover:text-dark transition-colors">
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredReels.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted text-lg">No reels from this city yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
