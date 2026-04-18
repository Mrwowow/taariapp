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

        {/* Single sponsor — featured layout */}
        {sponsors.length === 1 && (
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 justify-center">
            <a
              href={sponsors[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 group"
            >
              {sponsors[0].logo ? (
                <Image
                  src={sponsors[0].logo}
                  alt={sponsors[0].name}
                  width={48}
                  height={48}
                  className="rounded object-contain"
                />
              ) : (
                <div className="w-12 h-12 bg-white/5 border border-border rounded flex items-center justify-center text-xs text-muted font-medium shrink-0">
                  {sponsors[0].name.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-cream group-hover:text-accent transition-colors">
                  {sponsors[0].name}
                </p>
                {sponsors[0].tagline && (
                  <p className="text-xs text-muted mt-0.5">{sponsors[0].tagline}</p>
                )}
              </div>
            </a>
          </div>
        )}

        {/* Multiple sponsors — grid layout */}
        {sponsors.length > 1 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sponsors.map((sponsor) => (
              <a
                key={sponsor.id}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border hover:border-accent/30 hover:bg-white/[0.02] transition-colors group"
              >
                {sponsor.logo ? (
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    width={56}
                    height={56}
                    className="rounded object-contain"
                  />
                ) : (
                  <div className="w-14 h-14 bg-white/5 border border-border rounded flex items-center justify-center text-lg text-muted font-medium">
                    {sponsor.name.charAt(0)}
                  </div>
                )}
                <div className="text-center">
                  <p className="text-sm font-medium text-cream group-hover:text-accent transition-colors">
                    {sponsor.name}
                  </p>
                  {sponsor.tagline && (
                    <p className="text-xs text-muted mt-1 line-clamp-2">{sponsor.tagline}</p>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
