"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  badge: string;
  ctaLabel: string;
  ctaUrl: string;
}

interface Props {
  slides: HeroSlide[];
  intervalMs?: number;
}

export default function HeroSlider({ slides, intervalMs = 6000 }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(t);
  }, [slides.length, intervalMs]);

  if (slides.length === 0) return null;

  return (
    <section className="relative w-full h-[65vh] min-h-[420px] md:h-[85vh] md:min-h-[600px] overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0B]/90 via-[#0D0D0B]/40 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-16 max-w-[1280px] mx-auto">
            {slide.badge && (
              <span className="inline-block bg-accent text-dark text-[11px] font-bold uppercase tracking-[0.18em] px-3 py-1.5 mb-3 md:mb-5">
                {slide.badge}
              </span>
            )}

            <h1 className="font-serif text-3xl md:text-7xl font-bold text-cream leading-tight mb-3 md:mb-5 max-w-3xl">
              {slide.title}
            </h1>
            {slide.subtitle && (
              <p className="text-cream/70 text-base md:text-lg leading-relaxed mb-5 md:mb-8 max-w-xl line-clamp-2 md:line-clamp-none">
                {slide.subtitle}
              </p>
            )}
            {slide.ctaUrl && slide.ctaLabel && (
              <Link
                href={slide.ctaUrl}
                className="inline-block text-[11px] font-bold uppercase tracking-[0.18em] bg-accent text-dark px-6 py-3 md:px-8 md:py-4 hover:bg-accent-dark transition-colors"
              >
                {slide.ctaLabel} &rarr;
              </Link>
            )}
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
            aria-label="Previous slide"
            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-dark/40 hover:bg-dark/70 text-cream backdrop-blur-sm border border-white/10 flex items-center justify-center transition-colors"
          >
            <span className="text-xl leading-none">&larr;</span>
          </button>
          <button
            onClick={() => setIndex((i) => (i + 1) % slides.length)}
            aria-label="Next slide"
            className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-dark/40 hover:bg-dark/70 text-cream backdrop-blur-sm border border-white/10 flex items-center justify-center transition-colors"
          >
            <span className="text-xl leading-none">&rarr;</span>
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "bg-accent w-8" : "bg-cream/40 hover:bg-cream/70 w-4"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
