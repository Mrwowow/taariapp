import Image from "next/image";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import { getReels } from "@/lib/store";

export default async function ReelsPreview() {
  const reels = await getReels();
  const displayReels = reels.slice(0, 4);

  return (
    <section className="py-20 px-6">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeader title="Reels" viewAllHref="/reels" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {displayReels.map((reel) => (
            <Link key={reel.id} href="/reels" className="group block">
              <div className="relative aspect-[9/16] overflow-hidden rounded-2xl mb-3">
                <Image
                  src={reel.thumbnail}
                  alt={reel.title}
                  fill
                  className="object-cover transition-all duration-500 group-hover:brightness-90"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                {/* Play icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-cream/30 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  </div>
                </div>
              </div>
              <h4 className="text-sm font-semibold text-dark group-hover:text-accent transition-colors">
                {reel.title}
              </h4>
              <p className="text-xs text-accent uppercase tracking-wide mt-1">
                {reel.city.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
