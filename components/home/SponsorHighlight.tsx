import Image from "next/image";
import { getSponsors } from "@/lib/store";

export default async function SponsorHighlight() {
  const sponsors = await getSponsors();
  if (sponsors.length === 0) return null;

  return (
    <section className="py-14 px-6 bg-dark border-t border-border">
      <div className="mx-auto max-w-[1280px]">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted text-center mb-8">
          Our Partners
        </p>

        <div className={`grid gap-6 ${
          sponsors.length === 1
            ? 'grid-cols-1 max-w-xs mx-auto'
            : sponsors.length === 2
              ? 'grid-cols-2 max-w-lg mx-auto'
              : sponsors.length === 3
                ? 'grid-cols-2 md:grid-cols-3'
                : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
        }`}>
          {sponsors.map((sponsor) => (
            <a
              key={sponsor.id}
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-xl border border-border overflow-hidden group"
            >
              {/* Logo — centered, cover-fit */}
              {sponsor.logo ? (
                <Image
                  src={sponsor.logo}
                  alt={sponsor.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              ) : (
                <div className="absolute inset-0 bg-white/5 flex items-center justify-center text-3xl text-muted font-bold">
                  {sponsor.name.charAt(0)}
                </div>
              )}

              {/* Hover overlay with name + tagline */}
              <div className="absolute inset-0 bg-dark/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                <p className="text-sm font-semibold text-cream">
                  {sponsor.name}
                </p>
                {sponsor.tagline && (
                  <p className="text-xs text-muted mt-1.5 line-clamp-3">
                    {sponsor.tagline}
                  </p>
                )}
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-accent mt-3">
                  Learn More &rarr;
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
