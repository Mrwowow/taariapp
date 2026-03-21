import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import { cities } from "@/lib/data";

export default function CityEditionsPreview() {
  return (
    <section className="py-20 px-6 bg-dark">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeader title="City Editions" light />
        <p className="text-cream/60 text-lg mb-10 -mt-6">
          Explore the Diaspora, city by city.
        </p>
        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/city/${city.slug}`}
              className="group shrink-0 w-[260px] snap-start"
            >
              <div className="relative aspect-[4/5] overflow-hidden mb-4">
                <Image
                  src={city.heroImage}
                  alt={city.name}
                  fill
                  className="object-cover transition-all duration-500 group-hover:brightness-75"
                  sizes="260px"
                />
                <div className="absolute inset-0 bg-dark/20 group-hover:bg-dark/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="text-cream text-xs font-medium uppercase tracking-[0.15em]">
                    Explore &rarr;
                  </span>
                </div>
              </div>
              <h3 className="font-serif text-xl font-bold text-cream">
                {city.name}
              </h3>
              <p className="text-sm text-accent mt-1">
                {city.storyCount} stories
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
