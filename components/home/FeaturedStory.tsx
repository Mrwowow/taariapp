import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import SectionHeader from "@/components/ui/SectionHeader";
import { getArticles } from "@/lib/store";

export default async function FeaturedStory() {
  const articles = await getArticles();
  const featured = articles[1];

  return (
    <section className="py-20 px-6 bg-dark-light">
      <div className="mx-auto max-w-[1280px]">
        <SectionHeader title="Featured" light />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <Link href={`/stories/${featured.slug}`} className="group block overflow-hidden rounded-2xl">
            <div className="relative aspect-[3/2] overflow-hidden rounded-2xl">
              <Image
                src={featured.featuredImage}
                alt={featured.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-dark/20 group-hover:bg-dark/0 transition-colors" />
            </div>
          </Link>
          <div>
            <Badge variant="city">{featured.city.name}</Badge>
            {featured.isSponsored && <Badge variant="sponsored">Sponsored</Badge>}
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-cream mt-4 mb-4 leading-tight">
              <Link href={`/stories/${featured.slug}`} className="hover:text-accent transition-colors">
                {featured.title}
              </Link>
            </h2>
            <p className="text-muted text-lg leading-relaxed mb-6">
              {featured.excerpt}
            </p>
            <p className="text-sm text-muted">
              By {featured.author.name} &middot; {featured.readTime} min read
            </p>
            <Link
              href={`/stories/${featured.slug}`}
              className="inline-block mt-6 text-[11px] font-bold uppercase tracking-[0.18em] bg-accent text-dark px-6 py-3 hover:bg-accent-dark transition-colors"
            >
              Read More &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
