import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import SectionHeader from "@/components/ui/SectionHeader";
import { getArticles, getCities } from "@/lib/store";
import { buildMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import StoriesFilter from "./StoriesFilter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Stories",
  description:
    "Explore stories from the African Diaspora across global cities — culture, music, art, food, and more.",
  path: "/stories",
});

const CATEGORIES = [
  "Culture",
  "Music",
  "Art",
  "Food",
  "Community",
  "Fashion",
  "Tech",
];

export default async function StoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; category?: string }>;
}) {
  const params = await searchParams;
  const [articles, cities] = await Promise.all([getArticles(), getCities()]);

  // Server-side filtering
  let filtered = articles;
  if (params.city) {
    filtered = filtered.filter((a) => a.city.slug === params.city);
  }
  if (params.category) {
    filtered = filtered.filter((a) =>
      a.categories.some(
        (c) => c.toLowerCase() === params.category!.toLowerCase()
      )
    );
  }

  const hero = filtered[0];
  const rest = filtered.slice(1);

  return (
    <>
      {/* Hero */}
      {hero && (
        <section className="relative w-full h-[60vh] min-h-[420px] overflow-hidden">
          <Image
            src={hero.featuredImage}
            alt={hero.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="mx-auto max-w-[1280px]">
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="city">{hero.city.name}</Badge>
                {hero.categories.slice(0, 2).map((cat) => (
                  <Badge key={cat} variant="category">
                    {cat}
                  </Badge>
                ))}
                {hero.isSponsored && (
                  <Badge variant="sponsored">Sponsored</Badge>
                )}
              </div>
              <Link href={`/stories/${hero.slug}`} className="group block">
                <h1 className="font-serif text-3xl md:text-5xl font-bold text-cream leading-tight mb-3 max-w-3xl group-hover:text-accent transition-colors">
                  {hero.title}
                </h1>
              </Link>
              <p className="text-cream/70 text-lg max-w-2xl mb-4 line-clamp-2">
                {hero.excerpt}
              </p>
              <div className="flex items-center gap-3">
                <Image
                  src={hero.author.avatar}
                  alt={hero.author.name}
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
                <p className="text-sm text-cream/60">
                  By {hero.author.name} &middot;{" "}
                  {new Date(hero.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  &middot; {hero.readTime} min read
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filters + Grid */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-[1280px]">
          <SectionHeader title="All Stories" />

          {/* Filters */}
          <StoriesFilter
            cities={cities.map((c) => ({ name: c.name, slug: c.slug }))}
            categories={CATEGORIES}
            activeCity={params.city}
            activeCategory={params.category}
          />

          {/* Grid */}
          {rest.length === 0 && !hero && (
            <p className="text-muted text-center py-20">
              No stories found. Try adjusting your filters.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {rest.map((article) => (
              <Link
                key={article.slug}
                href={`/stories/${article.slug}`}
                className="group block"
              >
                <div className="relative aspect-[3/2] overflow-hidden rounded-2xl mb-4">
                  <Image
                    src={article.featuredImage}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="city">{article.city.name}</Badge>
                  {article.isSponsored && (
                    <Badge variant="sponsored">Sponsored</Badge>
                  )}
                </div>
                <h3 className="font-serif text-xl font-bold text-dark leading-snug mb-2 group-hover:text-accent transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-muted line-clamp-2 mb-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-2">
                  <Image
                    src={article.author.avatar}
                    alt={article.author.name}
                    width={24}
                    height={24}
                    className="rounded-full object-cover"
                  />
                  <p className="text-xs text-muted">
                    {article.author.name} &middot; {article.readTime} min read
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
