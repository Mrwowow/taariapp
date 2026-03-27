import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import SectionHeader from "@/components/ui/SectionHeader";
import {
  getCityBySlug,
  getArticlesByCity,
  getInterviewsByCity,
  getReelsByCity,
  getSponsors,
} from "@/lib/store";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = await getCityBySlug(slug);
  if (!city) notFound();

  const cityArticles = await getArticlesByCity(slug);
  const cityInterviews = await getInterviewsByCity(slug);
  const cityReels = await getReelsByCity(slug);
  const sponsors = await getSponsors();

  return (
    <>
      {/* City Hero */}
      <section className="relative w-full h-[60vh] min-h-[400px] overflow-hidden">
        <Image
          src={city.heroImage}
          alt={city.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16 max-w-[1280px] mx-auto">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-cream/60 mb-2">
            City Edition
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-cream tracking-tight">
            {city.name}
          </h1>
        </div>
      </section>

      {/* About */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-[720px] text-center">
          <h2 className="font-serif text-sm uppercase tracking-[0.15em] text-dark mb-6">
            About This Edition
          </h2>
          <p className="text-muted text-lg leading-relaxed">{city.description}</p>
        </div>
      </section>

      {/* Stories */}
      {cityArticles.length > 0 && (
        <section className="py-16 px-6">
          <div className="mx-auto max-w-[1280px]">
            <SectionHeader title={`Stories from ${city.name}`} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cityArticles.map((article) => (
                <Link key={article.slug} href={`/stories/${article.slug}`} className="group block">
                  <div className="relative aspect-[3/2] overflow-hidden rounded-2xl mb-4">
                    <Image
                      src={article.featuredImage}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-dark group-hover:text-accent transition-colors mb-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted line-clamp-2">{article.excerpt}</p>
                  <p className="text-sm text-muted mt-2">By {article.author.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Interviews */}
      {cityInterviews.length > 0 && (
        <section className="py-16 px-6 bg-cream-dark">
          <div className="mx-auto max-w-[1280px]">
            <SectionHeader title="Interviews" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cityInterviews.map((interview) => (
                <Link key={interview.slug} href={`/interviews/${interview.slug}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-4">
                    <Image
                      src={interview.portrait}
                      alt={interview.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-dark group-hover:text-accent transition-colors">
                    {interview.name}
                  </h3>
                  <p className="text-sm text-muted italic mt-1">&ldquo;{interview.oneLiner}&rdquo;</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reels */}
      {cityReels.length > 0 && (
        <section className="py-16 px-6">
          <div className="mx-auto max-w-[1280px]">
            <SectionHeader title={`Reels from ${city.name}`} viewAllHref="/reels" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {cityReels.map((reel) => (
                <Link key={reel.id} href="/reels" className="group block">
                  <div className="relative aspect-[9/16] overflow-hidden rounded-2xl mb-3">
                    <Image
                      src={reel.thumbnail}
                      alt={reel.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-cream/30 backdrop-blur-sm flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                          <polygon points="5,3 19,12 5,21" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <h4 className="text-sm font-semibold">{reel.title}</h4>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sponsors */}
      <section className="py-16 px-6 border-t border-border">
        <div className="mx-auto max-w-[1280px] text-center">
          <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-muted mb-8">
            Sponsors
          </h3>
          <div className="flex justify-center gap-12 flex-wrap">
            {sponsors.map((sponsor) => (
              <div
                key={sponsor.name}
                className="w-20 h-20 bg-border/30 flex items-center justify-center text-[10px] text-muted font-medium grayscale hover:grayscale-0 transition-all cursor-pointer"
              >
                LOGO
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
