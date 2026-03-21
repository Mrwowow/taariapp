import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import SectionHeader from "@/components/ui/SectionHeader";
import { articles } from "@/lib/data";

export default function LatestStories() {
  const latest = articles.slice(0, 5);
  const [hero, ...rest] = latest;

  return (
    <section className="py-20 px-6 bg-dark">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeader title="Latest Stories" viewAllHref="/stories/the-sound-of-the-new-south" light />

        <div className="flex gap-3 h-[700px]">

          {/* Left — 1 large image, full height */}
          <Link
            href={`/stories/${hero.slug}`}
            className="group relative w-1/2 shrink-0 overflow-hidden rounded-2xl"
          >
            <Image
              src={hero.featuredImage}
              alt={hero.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              priority
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/85 via-dark/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <Badge variant="city">{hero.city.name}</Badge>
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-cream mt-2 mb-2 leading-snug group-hover:text-accent transition-colors">
                {hero.title}
              </h3>
              <p className="text-sm text-cream/60">
                By {hero.author.name} &middot; {hero.readTime} min read
              </p>
            </div>
          </Link>

          {/* Right — 2×2 grid of 4 smaller images */}
          <div className="grid grid-cols-2 grid-rows-2 gap-3 flex-1">
            {rest.map((article) => (
              <Link
                key={article.slug}
                href={`/stories/${article.slug}`}
                className="group relative overflow-hidden rounded-2xl"
              >
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  sizes="25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/85 via-dark/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <Badge variant="city">{article.city.name}</Badge>
                  <h3 className="font-serif text-base font-bold text-cream mt-1.5 leading-snug group-hover:text-accent transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-cream/50 mt-1">
                    {article.author.name} &middot; {article.readTime} min
                  </p>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
